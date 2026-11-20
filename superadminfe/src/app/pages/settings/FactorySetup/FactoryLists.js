import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain"
import JumboScrollbar from "@jumbo/components/JumboScrollbar"
import Div from "@jumbo/shared/Div"
import { Grid, Table, TableBody, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import FactorySetUp from "./FactorySetup"
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


const FactoryLists = ({ scrollHeight }) => {

    const token = localStorage.getItem("accesstoken");

    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    const [createAndEditFactory, setCreateAndEditFactory] = useState(false);
    const [currentPage, setCurrentPage] = useState("");
    const [FactoryListData, setFactoryListData] = useState([]);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [columnMenuItems, setColumnMenuItems] = useState([
        { label: "Date", sort: "Created_Date", bool: true },
        { label: "Factory Id", sort: "Factory_Id", bool: true },
        { label: "Factory Name", sort: "Factory_Name", bool: true },
        { label: "Building Name", sort: "Building_Name", bool: false },
        { label: "Area Name", sort: "Area_Name", bool: true },
        { label: "Country", sort: "Country", bool: true },
        { label: "State", sort: "State", bool: true },
        { label: "City", sort: "City", bool: true },
        { label: "Location", sort: "Location", bool: true },
    ]);

    // skeleton flag
    const [skeleton, setSkeleton] = useState(false);

    //Delete File
    const [openDelete, setOpenDelete] = useState(false);
    const [currentData, setCurrentData] = useState("");
    const [currentDeleteServiceId, setCurrentDeleteServiceId] = useState("");

    // For the Pagination
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [visitedPages, setVisitedPages] = useState(page - 1);
    const totalRecords = count;


    const handleCreateFactory = (name = "", data = {}) => {
        setCurrentPage(name)
        setCurrentData(data)
        setCreateAndEditFactory(true);
    }

    const getData = async () => {
        setSkeleton(true);
        const response = await axios.get(`${BASE_URL}/user/FactoryAdditional/`, header);
        console.log("responsessssss", response)
        if (response) {
            setSkeleton(false);
        }
        return response?.data;
    }

    const handleSearch = (search) => {
        axios.get(`${BASE_URL}/user/FactorySearch/?search=${search}`, header)
            .then((response) => {
                console.log("FactorySearch", response.data);
                setFactoryListData(response?.data?.results);
                setCount(response?.data?.count)
            }).catch((error) => {
                console.log(error);
            });

    };

    const handleDeleteMenu = (item = {}) => {
        setCurrentData(item)
        setDeleteOpen(true);
    }

    const handleDelete = async (data) => {
        console.log("pra", data?.Factory_Id);
        await axios.delete(
            `${BASE_URL}/user/FactoryCRUD/?id=${currentData?.id}`, header)
            .then((res) => {
                setDeleteOpen(false);
                FactorySetupListsRefetch();
                toast.success(`Deleted successfully`);
            })
            .catch((error) => {
                console.log("hlo", error);
            });
    };

    const { data: FactorySetupQueryDatas, isLoading: FactorySetupListsLoading,
        isError: FactorySetupListError, refetch: FactorySetupListsRefetch } = useQuery(
            ['FactorySetupQueryDatas'],
            getData,
            { staleTime: Infinity }
        );

    useEffect(() => {
        if (FactorySetupQueryDatas) {
            setFactoryListData(FactorySetupQueryDatas || []);
            setCount(FactorySetupQueryDatas?.length);
        }
    }, [FactorySetupQueryDatas]);

    return (
        <JumboContentLayoutMain>
            <Grid item xs={12} md={8} sx={[FontStyle]}>
                <Typography
                    sx={[
                        componentTitle,
                        { color: Colors?.gray, fontWeight: 700 },
                    ]}
                >
                    Factory Setup
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
                            onClick={() => handleCreateFactory("Create")}
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
                            sortDatas={FactoryListData}
                            setDatas={setFactoryListData}
                        />
                        <TableBody>
                            {skeleton ? <CustomTableSkeleton headCount={8} rowCount={8} />
                                : FactoryListData?.length > 0 ? (
                                    FactoryListData?.slice(
                                        visitedPages * rowsPerPage,
                                        visitedPages * rowsPerPage + rowsPerPage
                                    )?.map((item, index) => {

                                        const date = item?.Created_Date?.split("T")[0]

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
                                                            <Div>{date}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[1].bool && (
                                                    <CRMTableCell
                                                        data-title="Factory Id"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Factory_Id}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[2].bool && (
                                                    <CRMTableCell
                                                        data-title="Factory Name"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Factory_Name}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[3].bool && (
                                                    <CRMTableCell
                                                        data-title="Building Name"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Building_Name}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[4].bool && (
                                                    <CRMTableCell
                                                        data-title="Area Name"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Area_Name}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[5].bool && (
                                                    <CRMTableCell
                                                        data-title="Country"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Country}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[6].bool && (
                                                    <CRMTableCell
                                                        data-title="State"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.State}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[7].bool && (
                                                    <CRMTableCell
                                                        data-title="City"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.City}</Div>
                                                        </Div>
                                                    </CRMTableCell>
                                                )}
                                                {columnMenuItems[8].bool && (
                                                    <CRMTableCell
                                                        data-title="Location"
                                                    >
                                                        <Div
                                                            sx={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}
                                                        >
                                                            <Div>{item?.Location}</Div>
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
                                                        onClick={() => handleCreateFactory("Edit", item)}
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
                                                <NoRecordsPage title={"Factory Lists"} />
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

            {createAndEditFactory && <FactorySetUp
                editData={currentData}
                currentPage={currentPage}
                setCreateAndEditFactory={setCreateAndEditFactory}
                getData={FactorySetupListsRefetch}
            />}

        </JumboContentLayoutMain>
    )
}
export default FactoryLists