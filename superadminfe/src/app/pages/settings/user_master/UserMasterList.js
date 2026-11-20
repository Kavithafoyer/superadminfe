import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  Menu,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Popover,
} from "@mui/material";
import React, { useReducer, useCallback } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { apiConfig } from "app/services/config";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  StyledTab,
  StyledTabs,
  UploadBtn,
  componentTitle,
  deletedWarnigMsg,
  dialogTitle,
} from "../../widgets/CRMStyles";
import SearchBar from "../../widgets/SearchField";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import {
  Cancelbutton,
  CustomButton,
  CustomTooltip,
  DeletedIcon,
  DialogBox,
  Dragabledialog,
  EditIcon,
  errorFilter,
  NoRecordsPage,
  toLocaleCurrency,
  axiosInstance,
  CRMCustomLoader,
} from "app/pages/widgets/StylesComponents";
import { handleError } from "app/pages/components/ErrorHandler/handleError";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { GrPowerReset } from "react-icons/gr";
import { AutoHeight } from "app/redux/auth/localStorage";
import CreateUserMaster from "./CreateUserMaster";
import EditUserMaster from "./EditUserMaster";
import {
  reducerFilter,
  UserMasterFilterState,
} from "../filter-reducers/FilterReducers";

const datas = [
  {
    date: "23-12-2022",
    accountName: "Saving Account",
    journal: "Assets",
    reference: "Fixed Assets",
    currency: "Rupee",
  },
];

const UserMasterList = ({ scrollHeight }) => {
  // const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listUserMaster, setlistUserMaster] = useState(true);
  const [openCreateUserMaster, setOpenCreateUserMaster] = useState(false);
  const [openEditUserMaster, setOpenEditUserMaster] = useState(false);
  // const [editCustomer, setEditCustomer] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "AdditionalUser_Id", label: "User Master Id", bool: true },
    { sort: "No_Of_Users", label: "No. Of Users", bool: true },
    { sort: "Amount_Per_User", label: "Amount Per User", bool: true },
    { sort: "Total_Amount", label: "Total Amount", bool: true },
    { sort: "Effective_Date", label: "Effective Date", bool: true },
    { sort: "Status", label: "Status", bool: true },
    { sort: "Country", label: "Country", bool: true },
  ]);
  const [deleteItem, setDeleteItem] = useState(false);

  const [datas, setdatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);

  //for table content check box
  // const [showUserMasterid, setshowUserMasterid] = useState(true);
  // const [showUserMastergb, setshowUserMastergb] = useState(true);
  // const [showUserMastercountry, setshowUserMastercountry] = useState(true);
  // const [showusermastername, setshowusermastername] = useState(true);
  // const [showUserMastercode, setshowUserMastercode] = useState(true);
  // const [showprice, setshowprice] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);

  // const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    setPage(newPage);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/AdditionalUserMasterList/?page=${newPage}`,
      ),
    );
    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = () => {
    setOpenCreateUserMaster(true);
    setlistUserMaster(false);
  };

  const EditShowForm = (data) => {
    console.log("data", data);
    seteditdatas(data);
    setOpenEditUserMaster(true);
    setlistUserMaster(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    UserMasterFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      Name: "",
      noofusers: "",
      Price: "",
      Amount_Per_User: "",
      Total_Amount: "",
      Fromdate: "",
      Todate: "",
    });
  };

  const handleFilterNameChange = (e) => {
    const { name, value } = e.target;
    filterDispatch({ type: name, payload: value });
    console.log("Filter : ", name, value);
  };

  const filterData = async () => {
    let payload = {
      No_Of_Users: filterState?.noofusers || 0,
      Amount_Per_User: filterState?.Amount_Per_User || 0,
      Total_Amount: filterState?.Total_Amount || 0,
      Created_Date: [filterState?.Fromdate || "", filterState?.Todate || ""],
      page: page,
    };

    setLoading(true);
    setPage(1);
    setVisitedPages(0);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/AdditionalUserMasterFilter/`, payload),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
      setShowFilter(null);
      setSearchFiled("");
    }
    setLoading(false);
  };

  // Filter End ------------------------------------------------------------

  const RefreshData = () => {
    setShowFilter(null);
    resetFilter();
    setSearchFiled("");
    setTabValue(0);
    setPage(1);
  };

  const [loading, setLoading] = useState(false);

  const GetUserMasterRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/AdditionalUserMasterList/?page=${page}`),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const GetMyUserMasterRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/AdditionalUserMasterList/?page=${page}&Created_By=${localStorage.getItem(
          "UserId",
        )}`,
      ),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setMyCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  // Removed redundant useEffects for listUserMaster and mount

  const handleClickDelete = async (data) => {
    if (!Boolean(data.id)) {
      toast.warning("id miss match ! ");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(
          `/superadmin/AdditionalUserMasterCRUD/?id=${data.id}`,
        ),
      );

      if (handledata) {
        toast.success("Deleted Successfully");
        GetUserMasterRecords();
      }
    }
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //code for table sorting
  const sortData = (key, direction) => {
    const sortedData = [...datas];

    sortedData.sort((a, b) => {
      const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setdatas(sortedData);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
    setShowsort(false);
  };

  // search Functions

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/AdditionalUserMasterSearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        setdatas(handledata?.results || []);
        setCount(handledata?.count || 0);
      }
      setLoading(false);
    }, 500),
    [page],
  );

  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== ""
      ? handleSearch(e.target.value)
      : GetUserMasterRecords();
  };

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      filterData();
    } else if (tabValue === 0) {
      GetUserMasterRecords();
    } else if (tabValue === 1) {
      GetMyUserMasterRecords();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue, listUserMaster]);

  return (
    <>
      <JumboContentLayoutMain>
        <Div>
          <Box>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={8} sx={[FontStyle]}>
                  <Typography
                    sx={[
                      componentTitle,
                      { color: Colors?.gray, fontWeight: 700, mb: 2 },
                    ]}
                  >
                    User Master List
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={10.5}
                    md={6}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <IconButton
                      sx={{ color: Colors?.Mblue }}
                      onClick={(event) => setShowFilter(event.currentTarget)}
                    >
                      <BiFilterAlt size={22} />
                    </IconButton>
                    <Div>
                      <StyledTabs
                        value={tabValue}
                        onChange={(e, newValue) => {
                          setTabValue(newValue);
                          resetFilter();
                          setSearchFiled("");
                          setPage(1);
                          console.log("newValue : ", newValue);
                        }}
                        aria-label="ant example"
                      >
                        <StyledTab label={`(${count}) All List`} />
                        <StyledTab label={`(${mycount}) My List`} />
                      </StyledTabs>
                    </Div>
                  </Grid>

                  {/* Filter popover  */}
                  <Popover
                    open={Boolean(showFilter)}
                    anchorEl={showFilter}
                    onClose={ShowFilter}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{ minWidth: "300px", width: { xs: "100%", md: "30%" } }}
                  >
                    <Box>
                      <Div
                        sx={[
                          DisplayFlex,
                          CRMTableHead,
                          dialogTitle,
                          { px: 2, justifyContent: "space-between" },
                        ]}
                      >
                        <Typography id="Typography-root" sx={[dialogTitle]}>
                          Filters
                        </Typography>
                        <IconButton sx={{ mr: -1 }} onClick={RefreshData}>
                          <GrPowerReset size={16} />
                        </IconButton>
                      </Div>

                      <Grid container spacing={2} sx={{ padding: "1rem" }}>
                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            No. Of Users
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="No. Of Users"
                            name="noofusers"
                            inputProps={{
                              min: 0,
                            }}
                            value={filterState?.noofusers}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Amount Per User
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Amount Per User"
                            name="Amount_Per_User"
                            inputProps={{
                              min: 0,
                            }}
                            value={filterState?.Amount_Per_User}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Total Amount
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Total Amount"
                            name="Total_Amount"
                            inputProps={{
                              min: 0,
                            }}
                            value={filterState?.Total_Amount}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            From Date
                          </Typography>
                          <TextField
                            type="date"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder=" From Date"
                            name="Fromdate"
                            value={filterState?.Fromdate}
                            onChange={handleFilterNameChange}
                            id="createdDate"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            To Date
                          </Typography>
                          <TextField
                            type="date"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="  To Date"
                            id="lastDate"
                            name="Todate"
                            value={filterState?.Todate}
                            onChange={handleFilterNameChange}
                            disabled={!Boolean(filterState?.Fromdate)}
                            inputProps={{
                              min:
                                Boolean(filterState?.Fromdate) &&
                                new Date(filterState?.Fromdate)
                                  ?.toISOString()
                                  ?.split("T")[0],
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          my: 2,
                          gap: "10px",
                        }}
                      >
                        <Cancelbutton onClick={ShowFilter} />

                        <CustomButton
                          onClick={() => filterData()}
                          type="submit"
                          label="Apply"
                          Icon="filterIcon"
                        />
                      </Div>
                    </Box>
                  </Popover>

                  <Grid item xs={12} md={6}>
                    <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
                      <SearchBar
                        value={searchFiled}
                        width={"250px !important"}
                        border={"1px solid lightgray"}
                        SearchData={(e) => {
                          setSearchFiled(e.target.value);
                          setPage(1);
                          if (Boolean(e.target.value)) {
                            setTabValue(2);
                          } else {
                            setTabValue(0);
                          }
                        }}
                      />
                      <CustomButton
                        onClick={CreateFinanceForm}
                        label="Create"
                        Icon="createIcon"
                        endIcon={true}
                      />
                    </Div>
                  </Grid>
                </Grid>
              </Box>

              <Div sx={{ mt: { xs: 0, md: 1.5 } }}>
                <JumboScrollbar
                  autoHeight={true}
                  autoHideTimeout={4000}
                  autoHeightMin={AutoHeight(1.6)}
                  autoHide={true}
                  hideTracksWhenNotNeeded
                  id="no-more-tables"
                >
                  <Table
                    stickyHeader
                    sx={{ mt: 2, mb: 2, minWidth: { xs: "auto", sm: 1000 } }}
                  >
                    <CustomTableHeader
                      headerMenuItems={columnMenuItems}
                      setHeadermenuItems={setColumnMenuItems}
                      setDatas={setdatas}
                      sortDatas={datas}
                    />
                    {datas?.length > 0 && (
                      <TableBody sx={{ mt: 2 }}>
                        {datas?.length > 0 &&
                          datas
                            ?.slice(visitedPages * 10, visitedPages * 10 + 10)
                            ?.map((data, index) => {
                              return (
                                <CRMTableRow key={index}>
                                  {columnMenuItems[0]?.bool && (
                                    <CRMTableCell
                                      data-title="Date"
                                      align="left"
                                    >
                                      {data?.Updated_Date?.split("T")[0]}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[1]?.bool && (
                                    <CRMTableCell
                                      data-title="User Master Id"
                                      align="left"
                                    >
                                      {data?.AdditionalUser_Id}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[2]?.bool && (
                                    <CRMTableCell
                                      data-title="No. Of Users"
                                      align="left"
                                    >
                                      {data?.No_Of_Users}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[3]?.bool && (
                                    <CRMTableCell
                                      data-title="Amount Per User"
                                      align="left"
                                    >
                                      {toLocaleCurrency(
                                        data?.Amount_Per_User || 0,
                                      )}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Total Amount"
                                      align="left"
                                    >
                                      {toLocaleCurrency(
                                        data?.Total_Amount || 0,
                                      )}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[5]?.bool && (
                                    <CRMTableCell
                                      data-title="Effective Date"
                                      align="left"
                                    >
                                      {data?.Effective_Date}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[6]?.bool && (
                                    <CRMTableCell
                                      data-title="Status"
                                      align="left"
                                    >
                                      {data?.Status}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[7]?.bool && (
                                    <CRMTableCell
                                      data-title="Country"
                                      align="left"
                                    >
                                      {data?.Country}
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
                                        // justifyContent: matches ? "center" : "left",
                                        justifyContent: {
                                          xs: "flex-end",
                                          sm: "center",
                                        },
                                      },
                                    ]}
                                  >
                                    <EditIcon
                                      onClick={(e) => {
                                        EditShowForm(data);
                                      }}
                                    />
                                    <DeletedIcon
                                      onClick={(e) => {
                                        setDeleteItem(data);
                                      }}
                                    />
                                  </CRMTableCell>
                                </CRMTableRow>
                              );
                            })}
                      </TableBody>
                    )}

                    {/* code for Delete Action */}
                    <DialogBox
                      open={deleteItem}
                      Content={deletedWarnigMsg}
                      onClickYes={() => {
                        setDeleteItem(false);
                        handleClickDelete(deleteItem);
                      }}
                      onClickNo={() => setDeleteItem(false)}
                    />
                  </Table>

                  {datas?.length === 0 && (
                    <NoRecordsPage title={"UserMaster"} />
                  )}
                </JumboScrollbar>
              </Div>
              {/* code for pagination */}
              <Div
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Pagination
                  color="success"
                  count={totalPages}
                  page={page}
                  onChange={(e, newValue) => handleChangePage(e, newValue)}
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Div>
            </Box>
          </Box>
        </Div>

        {/* Create UserMaster modal */}
        <Dragabledialog
          maxWidth="md"
          open={openCreateUserMaster}
          title="Create User Master"
        >
          <DialogContent sx={{ p: 1 }}>
            <CreateUserMaster
              setCreateUserMaster={setOpenCreateUserMaster}
              setlistUserMaster={setlistUserMaster}
            />
          </DialogContent>
        </Dragabledialog>

        <Dragabledialog
          maxWidth="md"
          open={openEditUserMaster}
          title="Edit User Master"
        >
          <DialogContent sx={{ p: 1 }}>
            <EditUserMaster
              setEditUserMaster={setOpenEditUserMaster}
              setlistUserMaster={setlistUserMaster}
              editdatas={editdatas}
            />
          </DialogContent>
        </Dragabledialog>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default UserMasterList;
