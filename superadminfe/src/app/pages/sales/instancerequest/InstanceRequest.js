import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Menu,
  FormGroup,
  Pagination,
  Box,
  Popover,
  Autocomplete,
} from "@mui/material";
import React, { useCallback, useEffect, useReducer } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CreateInstanceDialog from "./CreateInstanceDialog";
import EditInstance from "./EditInstance";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
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
  axiosInstance,
  Cancelbutton,
  CustomButton,
  DeletedIcon,
  DialogBox,
  EditIcon,
  errorFilter,
  NoRecordsPage,
  toLocaleCurrency,
  CRMCustomLoader,
} from "app/pages/widgets/StylesComponents";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  reducerFilter,
  RequestFilterState,
} from "app/pages/settings/filter-reducers/FilterReducers";
import { GrPowerReset } from "react-icons/gr";
import { handleError } from "app/pages/components/ErrorHandler/handleError";

const InstanceRequest = ({ scrollHeight }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listInstance, setListInstance] = useState("list");
  const [createInstance, setCreateInstance] = useState(false);
  const [editInstance, setEditInstance] = useState(false);

  const [datas, setdatas] = useState([]);
  const [mydatas, setMydatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customerDatas, setCustomerDatas] = useState([]);

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "RequestId", label: "Request Id", bool: true },
    { sort: "InstanceName", label: "Instance Name", bool: true },
    { sort: "CustomerName", label: "Customer Name", bool: true },
    { sort: "RequestDate", label: "Request Date", bool: true },
    { sort: "PlanName", label: "Plan Name", bool: true },
    { sort: "Noofusers", label: "No of Users", bool: true },
    { sort: "SubscriptionId", label: "Subscription Id", bool: false },
    { sort: "URLName", label: "URL", bool: true },
    { sort: "Paidamount", label: "Amount", bool: true },
  ]);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    RequestFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      Name: "",
      Customer_Name: "",
      InstanceName: "",
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
      fromdate: filterState?.Fromdate || "",
      todate: filterState?.Todate || "",
      PlanName: filterState?.Name || "",
      CustomerName: filterState?.Customer_Name || "",
      InstanceName: filterState?.InstanceName || "",
      page: page,
    };

    setLoading(true);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/InstanceRequestfilter/`, payload),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
      setShowFilter(false);
      setSearchFiled("");
      setTabValue(3);
    }
    setLoading(false);
  };

  const RefreshData = () => {
    setShowFilter(null);
    setTabValue(0);
    resetFilter();
    getinstancerequestrecords();
  };

  // Filter End ------------------------------------------------------------

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateInstanceForm = () => {
    setListInstance(false);
    setCreateInstance(true);
  };

  const EditInstanceForm = (data) => {
    seteditdatas(data);
    setListInstance(false);
    setEditInstance(true);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
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

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getinstancerequestrecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/InstanceRequestlist/?page=${page}`),
    );
    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const getMyinstancerequestrecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/InstanceRequestmylist/?page=${page}&Created_By=${localStorage.getItem(
          "UserId",
        )}`,
      ),
    );
    if (handledata) {
      setMydatas(handledata?.results || []);
      setMyCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/InstanceRequestsearch/?search=${searchstring}&page=${page}`,
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

  const handleDelete = async (data) => {
    if (!Boolean(data?.id)) {
      toast.error("id missmatched");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(`/superadmin/InstanceRequest/?id=${data?.id}`),
      );

      if (handledata) {
        toast.success("Deleted Sucessfully");
        tabValue === 0
          ? getinstancerequestrecords()
          : getMyinstancerequestrecords();
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getCustomerRecords = async () => {
    const handledata = await handleError(
      axiosInstance.get(
        `${BASE_URL}/superadmin/AccountFullList/?Is_Deleted=False`,
      ),
    );

    if (handledata) {
      setCustomerDatas(handledata || []);
    }
  };

  useEffect(() => {
    getCustomerRecords();
    getMyinstancerequestrecords();
  }, []);

  useEffect(() => {
    resetFilter();
    setPage(1);
    setSearchFiled("");
  }, [tabValue]);

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      setSearchFiled("");
      filterData();
    } else if (tabValue === 0) {
      getinstancerequestrecords();
    } else if (tabValue === 1) {
      getMyinstancerequestrecords();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue]);

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ position: "relative" }}>
          {loading && <CRMCustomLoader />}
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
                      Instance Request List
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
                        {tabValue === 2 || tabValue === 3 ? (
                          <Typography
                            sx={{ fontSize: "18px" }}
                            className="text-[#494949]"
                          >
                            {count == 0 ? "No results" : count}{" "}
                            {tabValue === 3
                              ? " found for your filers."
                              : " found for your search."}
                          </Typography>
                        ) : (
                          <StyledTabs
                            value={tabValue}
                            onChange={(e, newValue) => {
                              setTabValue(newValue);
                              console.log("newValue : ", newValue);
                            }}
                            aria-label="ant example"
                          >
                            <StyledTab label={`(${count}) All List`} />
                            <StyledTab label={`(${mycount}) My List`} />
                          </StyledTabs>
                        )}
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
                      sx={{
                        minWidth: "400px",
                        width: { xs: "100%", md: "40%" },
                      }}
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
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography
                              id="Typography-root"
                              sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                            >
                              Plan Name
                            </Typography>
                            <TextField
                              type="text"
                              className={`col-12 input-box2`}
                              autoComplete="off"
                              placeholder="Plan Name"
                              name="Name"
                              value={filterState?.Name}
                              onChange={handleFilterNameChange}
                            />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography
                              id="Typography-root"
                              sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                            >
                              Customer Name
                            </Typography>

                            <FormControl className="col-12 w-100">
                              <Autocomplete
                                className="search-select3 col-12 w-100"
                                options={customerDatas}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.Contact_Name) {
                                    return option?.Contact_Name;
                                  }
                                  return "";
                                }}
                                value={filterState?.Customer_Name}
                                onChange={(item, newvalue) => {
                                  filterDispatch({
                                    type: "Customer_Name",
                                    payload: newvalue?.Contact_Name,
                                  });
                                }}
                                id="outlined-basic"
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Customer Name"
                                  />
                                )}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography
                              id="Typography-root"
                              sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                            >
                              Instance Name
                            </Typography>
                            <TextField
                              type="text"
                              className={`col-12 input-box2`}
                              autoComplete="off"
                              placeholder="Instance Name"
                              name="InstanceName"
                              value={filterState?.InstanceName}
                              onChange={handleFilterNameChange}
                              id="createdDate"
                            />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
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

                          <Grid item xs={12} md={6} lg={6}>
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
                              disabled={!Boolean(filterState?.Fromdate)}
                              inputProps={{
                                min:
                                  Boolean(filterState?.Fromdate) &&
                                  new Date(filterState?.Fromdate)
                                    ?.toISOString()
                                    ?.split("T")[0],
                              }}
                              onChange={handleFilterNameChange}
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
                          width={"250px !important"}
                          border={"1px solid lightgray"}
                          value={searchFiled}
                          SearchData={(e) => {
                            setSearchFiled(e.target.value);
                            if (Boolean(e.target.value)) {
                              setTabValue(2);
                            } else {
                              setTabValue(0);
                            }
                          }}
                        />
                        <CustomButton
                          onClick={() => setOpenCreateModal("create")}
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
                    <Table stickyHeader sx={{ mt: 2, mb: 2 }}>
                      <CustomTableHeader
                        headerMenuItems={columnMenuItems}
                        setHeadermenuItems={setColumnMenuItems}
                        setDatas={setdatas}
                        sortDatas={datas}
                      />
                      {(tabValue !== 1 ? datas : mydatas)?.length > 0 && (
                        <TableBody sx={{ mt: 2 }}>
                          {(tabValue !== 1 ? datas : mydatas)
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
                                      data-title="Request Id"
                                      align="left"
                                    >
                                      {data?.RequestId}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[2]?.bool && (
                                    <CRMTableCell
                                      data-title="Instance Name"
                                      align="left"
                                    >
                                      {data?.InstanceName}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[3]?.bool && (
                                    <CRMTableCell
                                      data-title="Customer Name"
                                      align="left"
                                    >
                                      {data?.CustomerName}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Request Date"
                                      align="left"
                                    >
                                      {data?.RequestDate?.split("T")[0]}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[5]?.bool && (
                                    <CRMTableCell
                                      data-title="Plan Name"
                                      align="left"
                                    >
                                      {data?.PlanName}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[6]?.bool && (
                                    <CRMTableCell
                                      data-title="No of Users"
                                      align="left"
                                    >
                                      {data?.Noofusers}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[7]?.bool && (
                                    <CRMTableCell
                                      data-title="Subscription Id"
                                      align="left"
                                    >
                                      {data?.SubscriptionId}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[8]?.bool && (
                                    <CRMTableCell data-title="URL" align="left">
                                      {data?.URLName}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[9]?.bool && (
                                    <CRMTableCell
                                      data-title="Amount"
                                      align="left"
                                    >
                                      {toLocaleCurrency(data?.Paidamount || 0)}
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
                                      },
                                    ]}
                                  >
                                    <EditIcon
                                      onClick={(e) => {
                                        setOpenCreateModal(data);
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
                          handleDelete(deleteItem);
                        }}
                        onClickNo={() => setDeleteItem(false)}
                      />
                    </Table>

                    {datas?.length === 0 && (
                      <NoRecordsPage title={"Intance Request"} />
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

          <CreateInstanceDialog
            open={openCreateModal}
            onClose={setOpenCreateModal}
            setCreateInstance={setCreateInstance}
            getinstancerequestrecords={getinstancerequestrecords}
          />
        </Div>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default InstanceRequest;
