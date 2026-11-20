import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain"
import JumboScrollbar from "@jumbo/components/JumboScrollbar"
import Div from "@jumbo/shared/Div"
import { Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import TaxSetUp from "./TaxSetUp"
import { useQuery } from "react-query"
import axios from "axios"
import { BASE_URL } from "app/services/auth-services"
import { format } from "date-fns"
import { useDispatch, useSelector } from "react-redux"
import { Colors, componentTitle, deletedWarnigMsg, DisplayFlex, FontStyle } from "app/pages/widgets/CRMStyles"
import { CustomButton, CustomTableSkeleton, DeletedIcon, DialogBox, EditIcon, NoRecordsPage } from "app/pages/widgets/StylesComponents"
import CustomTableHeader from "app/pages/widgets/CustomTableHeader"
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable"
import { toast } from "react-toastify"


const ListTax = ({ scrollHeight }) => {

    const token = localStorage.getItem("accesstoken");
    const companyId = localStorage.getItem("OrganizationId");

    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    const [createAndEditTax, setCreateAndEditTax] = useState(false);
    const [currentPage, setCurrentPage] = useState("");
    const [TaxListData, setTaxListData] = useState([]);

    const [columnMenuItems, setColumnMenuItems] = useState([
        { label: "Date", sort: "Created_Date", bool: true },
        { label: "Tax Id", sort: "Tax_Id", bool: true },
        { label: "Tax Name", sort: "Tax_Name", bool: true },
        { label: "Tax Percentage", sort: "Tax_Percentage", bool: true },
        { label: "Tax Description", sort: "Description", bool: true },
    ]);

    // gear box icon states
    const [chkDate, setChkDate] = useState(true)
    const [Serviceprice_Id, setServiceprice_Id] = useState(true);
    const [Servicecategory_Name, setServicecategory_Name] = useState(true);
    const [City_Name, setCity_Name] = useState(true)
    const [Service_Name, setService_Name] = useState(true);
    const [Price, setPrice] = useState(true);
    const [dateFormat, setDateFormat] = useState("");
    const [searchData, setSearchData] = useState("");

    // skeleton flag
    const [skeleton, setSkeleton] = useState(false);

    //Delete File
    const [openDelete, setOpenDelete] = useState(false);
    const [currentData, setCurrentData] = useState("");
    const [currentDeleteServiceId, setCurrentDeleteServiceId] = useState("");
    const [deleteName, setDeleteName] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);

    // For the Pagination
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visitedPages, setVisitedPages] = useState(page - 1);
    const rowsPerPageOptions = [10];
    const totalRecords = count;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);


    const handleCreateTax = (name = "", data = {}) => {
        setCurrentPage(name)
        setCurrentData(data)
        setCreateAndEditTax(true);
    }

    const getData = async () => {
        setSkeleton(true);
        const response = await axios.get(`${BASE_URL}/user/TaxsetupAdditional/`, header);
        console.log("responsessssss", response)
        if (response) {
            setSkeleton(false);
        }
        return response?.data;
    }

    const handleSearch = (search) => {
        axios.get(`${BASE_URL}/user/TaxSearch/?search=${search}`, header)
            .then((response) => {
                console.log("TaxSearch", response.data);
                setTaxListData(response?.data?.results);
                setCount(response?.data?.count)
            }).catch((error) => {
                console.log(error);
            });

    };

    const handleDeleteMenu = (item = {}) => {
        setCurrentData(item)
        setDeleteOpen(true);
    }

    const handleDelete = async () => {
        await axios.delete(`${BASE_URL}/user/TaxsetupCRUD/?id=${currentData?.id}`, header)
            .then((res) => {
                TaxSetupListsRefetch();
                setDeleteOpen(false);
                toast.success(`Deleted successfully`);
            })
            .catch((error) => {
                console.log("hlo", error);
            });
    };


    const { data: TaxSetupQueryDatas, isLoading: TaxSetupListsLoading,
        isError: TaxSetupListError, refetch: TaxSetupListsRefetch } = useQuery(
            ['TaxSetupQueryDatas'],
            getData,
            { staleTime: Infinity }
        );

    useEffect(() => {
        if (TaxSetupQueryDatas) {
            setTaxListData(TaxSetupQueryDatas || []);
            setCount(TaxSetupQueryDatas?.length);
        }
    }, [TaxSetupQueryDatas]);

    return (
        <JumboContentLayoutMain>
            <Grid item xs={12} md={8} sx={[FontStyle]}>
                <Typography
                    sx={[
                        componentTitle,
                        { color: Colors?.gray, fontWeight: 700 },
                    ]}
                >
                    Tax Setup
                </Typography>
            </Grid>
            <Div>
                <Grid container sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12} xl={5}>

                    </Grid>

                    <Grid item xs={12} xl={4}>

                    </Grid>

                    <Grid item xs={12} xl={3} sx={{ display: "flex", justifyContent: "end" }}>
                        <CustomButton
                            onClick={() => handleCreateTax("Create")}
                            label="Create"
                            Icon="createIcon"
                            endIcon={true}
                        />
                    </Grid>

                </Grid>
                <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={scrollHeight ? scrollHeight : 380}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                >
                        <Table stickyHeader className="table" sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
                            <CustomTableHeader
                                headerMenuItems={columnMenuItems}
                                setHeadermenuItems={setColumnMenuItems}
                                sortDatas={TaxListData}
                                setDatas={setTaxListData}
                            />
                        <TableBody>
                            {skeleton ? <CustomTableSkeleton headCount={5} rowCount={8} />
                                : TaxListData?.length > 0 ? (
                                    TaxListData?.slice(
                                        visitedPages * rowsPerPage,
                                        visitedPages * rowsPerPage + rowsPerPage
                                    )?.map((item, index) => {

                                        const date = new Date(item?.Created_Date);
                                        const formattedDate =
                                            dateFormat && format(date, dateFormat);

                                        return (
                                            <CRMTableRow>
                                                {columnMenuItems[0].bool && (
                                                    <CRMTableCell
                                                        data-title="Date"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Created_Date}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[1].bool && (
                                                    <CRMTableCell
                                                        data-title="Tax Id"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Tax_Id}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[2].bool && (
                                                    <CRMTableCell data-title="Tax Name">
                                                        <Div
                                                            sx={{
                                                                alignSelf: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Tax_Name}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[3].bool && (
                                                    <CRMTableCell data-title="Tax Percentage">
                                                        <Div
                                                            sx={{
                                                                alignSelf: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            {item?.Tax_Percentage}
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[4].bool && (
                                                    <CRMTableCell data-title="Tax Description">
                                                        <Div
                                                            sx={{
                                                                alignSelf: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            {item?.Description}
                                                        </Div>
                                                    </CRMTableCell>
                                                )}

                                                <CRMTableCell
                                                    align="center"
                                                    data-title="Action"
                                                    sx={[
                                                        DisplayFlex,
                                                        {
                                                            cursor: "pointer",
                                                            mb: 1,
                                                            justifyContent: { xs: "flex-end", sm: "center" },
                                                        },
                                                    ]}
                                                >
                                                    <EditIcon
                                                        onClick={() => handleCreateTax("Edit", item)}
                                                        toolTip={true}
                                                    />

                                                    <DeletedIcon
                                                        onClick={() => handleDeleteMenu(item)}
                                                        toolTip={true}
                                                    />
                                                </CRMTableCell>
                                            </CRMTableRow>
                                        )
                                    }))
                                    : (
                                        <CRMTableRow>
                                            <CRMTableCell colSpan={8} align="center">
                                                <NoRecordsPage title={"Tax Lists"} />
                                            </CRMTableCell>
                                        </CRMTableRow>
                                    )}
                        </TableBody>
                    </Table>
                </JumboScrollbar>

                {/* code for Delete Action */}
                <DialogBox
                    open={deleteOpen}
                    Content={deletedWarnigMsg}
                    onClickNo={() => setDeleteOpen(false)}
                    onClickYes={() => handleDelete()}
                />
            </Div>
            {/* Code for Delete PopUp */}

            {createAndEditTax && <TaxSetUp
                editData={currentData}
                currentPage={currentPage}
                setCreateAndEditTax={setCreateAndEditTax}
                getData={TaxSetupListsRefetch}
            />}

        </JumboContentLayoutMain>
    )
}
export default ListTax