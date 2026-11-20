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
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Menu,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  DialogContentText,
  Popover,
  Box,
} from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { useState } from "react";
import { BiEdit, BiFilterAlt, BiSolidDetail } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
} from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
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
  componentTitle,
  deletedWarnigMsg,
  dialogTitle,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { DataArray } from "@mui/icons-material";
import SearchBar from "app/pages/widgets/SearchField";
import {
  Cancelbutton,
  CustomButton,
  DateFormatter,
  DeletedIcon,
  DialogBox,
  EditIcon,
  errorFilter,
  NoRecordsPage,
} from "app/pages/widgets/StylesComponents";
import { FaGear } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  cancelPlanFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import CreateCancelPlan from "./CreateCancelPlan";
const CancellationofPlanlist = ({ scrollHeight }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Cancelplan_Id", label: "Cancel Plan Id", bool: true },
    { sort: "Plan_Name", label: "Plan Name", bool: true },
    { sort: "Domain_Name", label: "Domain Name", bool: true },
    { sort: "Customer_Name", label: "Customer Name", bool: true },
  ]);

  const [listCancel, setListCancel] = useState("list");

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);

  const [datas, setdatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);
  const [invoicedatas, setinvoicedatas] = useState([]);
  const [viewdatas, setviewdatas] = useState([]);

  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listChange, setListChange] = useState(true);
  const [changeinvoice, setchangeinvoice] = useState(false);
  const [changeplan, setChangePlan] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const [sendAddRequest, setSendAddRequest] = useState(false);
  const [Modaldata1, setModaldata1] = useState([]);

  const [status, setstatus] = useState("Generate Invoice");

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    axios
      .get(`${BASE_URL}/superadmin/getList/?page=${newPage}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        // console.log(res.data.results);
        setdatas(res.data.results);
        setCount(res.data.count);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    cancelPlanFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      PlanName: "",
      CustomerName: "",
      DomainName: "",
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
      Plan_Name: filterState?.PlanName,
      Customer_Name: filterState?.CustomerName,
      Domain_Name: filterState?.DomainName,
      fromdate: filterState?.Fromdate,
      todate: filterState?.Todate,
      page: page,
    };

    let error = errorFilter(payload);

    if (Object.keys(error).length > 0) {
      toast.warning(
        `some fields are empty ${Object.keys(error)?.map((item) => item)}${
          Object.keys(error)?.length > 0 && ", "
        }`,
        {
          position: "top-right",
          autoClose: 500,
        },
      );
    } else {
      await axios
        .post(`${BASE_URL}/superadmin/CancelPlanfilter/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          console.log(res.data.results);
          setdatas(res.data.results);
          setCount(res.data.count);
          setShowFilter(false);
          setSearchFiled("");
        })
        .catch((error) => {
          console.log("ds", error);
          setdatas([]);
        });
    }
  };

  const RefreshData = () => {
    setShowFilter(null);
    resetFilter();
    getList();
  };

  // Filter End ------------------------------------------------------------

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const ChangePlan = (data) => {
    seteditdatas(data);
    setChangePlan(true);
    setListChange(false);
  };

  // code for settings open
  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = () => {
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

  const getList = () => {
    axios
      .get(BASE_URL + `/superadmin/CancelPlanlist/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("change&upgradeplan", response.data);
        setdatas(response.data.results);
        setCount(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const handleDelete = (data) => {
    // console.log(data)
    if (!Boolean(data.id)) {
      toast.warning("id miss match ! ");
    } else {
      axios
        .delete(`${BASE_URL}/superadmin/CancelPlanCRUD/?id=${data.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          console.log("Delete", res.data);
          if (res.data.id === data.id) {
            toast.success("Deleted Sucessfully");
            getList();
          } else {
            toast.error("Something went wrong");
          }
          // setdatas(res.data.results)
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };

  // useEffect(() => {
  //   getList();
  //   // getAddonSubscriptionRecords();
  // }, []);

  const handleSearch = async (searchstring) => {
    await axios
      .get(
        `${BASE_URL}/superadmin/CancelPlansesearch/?search=${searchstring}&page=${page}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        },
      )
      .then((response) => {
        console.log(response.data);
        setdatas(response.data?.results);
        setCount(response.data?.count);
      })
      .catch((error) => {
        setdatas([]);
        console.log("ds", error);
      });
  };

  // useEffect(() => {
  //   resetFilter();
  //   if (tabValue == 0) {
  //     setSearchFiled("");
  //     getList();
  //   }
  // }, [tabValue]);

  useEffect(() => {
    if (tabValue === 0) {
      const isFilterActive = Object.values(filterState)?.some((state) =>
        Boolean(state),
      );
      if (isFilterActive && !searchFiled) {
        filterData();
      } else {
        getList();
      }
    } else if (tabValue === 1) {
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue]);

  return (
    <>
      <JumboContentLayoutMain>
        <Box sx={{ mb: 2 }}>
          <Div className="flex items-center justify-between">
            <Typography sx={[componentTitle]}>Service Cancellations</Typography>
          </Div>
        </Box>

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={10.5} md={6} display={"flex"} alignItems={"center"}>
              <IconButton
                sx={{ color: Colors?.Mblue }}
                onClick={(e) => setShowFilter(e.currentTarget)}
              >
                <BiFilterAlt size={22} />
              </IconButton>
              <Typography
                sx={[FontStyle, { color: Colors?.gray, fontWeight: 400 }]}
              >
                ( {count} ) Cancel Request
              </Typography>
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
              sx={{ minWidth: "400px", width: { xs: "100%", md: "40%" } }}
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
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      name="PlanName"
                      placeholder="Plan Name"
                      value={filterState?.PlanName}
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
                    <TextField
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      name="CustomerName"
                      placeholder="Customer Name"
                      value={filterState?.CustomerName}
                      onChange={handleFilterNameChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      id="Typography-root"
                      sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                    >
                      Domain Name
                    </Typography>
                    <TextField
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      placeholder="Domain Name"
                      name="DomainName"
                      value={filterState?.DomainName}
                      onChange={handleFilterNameChange}
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
                  width={"250px !important"}
                  // value={searchFiled}
                  border={"1px solid lightgray"}
                  SearchData={(e) => {
                    setSearchFiled(e.target.value);
                    setTabValue(1);
                    if (!Boolean(e.target.value)) {
                      setTabValue(0);
                    }
                  }}
                />
              </Div>
            </Grid>
          </Grid>
        </Box>

        <Div>
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
                  showGear={false}
                />
                {datas?.length > 0 && (
                  <TableBody>
                    {datas?.map((data, index) => {
                      let invoicedata = Boolean(data?.Invoice_Id);
                      return (
                        <CRMTableRow key={index}>
                          {columnMenuItems?.map((item) => {
                            if (item?.bool) {
                              return (
                                <CRMTableCell
                                  data-title={item?.label}
                                  align="left"
                                  style={{
                                    color:
                                      item?.label?.includes("Status") &&
                                      (!data?.[item?.sort]
                                        ? "orangered"
                                        : "green"),
                                  }}
                                >
                                  {item?.label?.includes("Date")
                                    ? (
                                        <DateFormatter
                                          date={
                                            data?.[item?.sort]?.split("T")[0]
                                          }
                                        />
                                      ) || ""
                                    : item?.label === "Cancel Plan Id"
                                      ? data?.[item?.sort] || ""
                                      : item?.label !== "Cancel Plan Id" &&
                                        item?.label?.includes("Id")
                                        ? data?.[item?.sort]?.[item?.sort]
                                        : item?.label?.includes("Status")
                                          ? data?.[item?.sort]
                                            ? "Paid"
                                            : "Unpaid"
                                          : data?.[item?.sort] || ""}
                                </CRMTableCell>
                              );
                            }
                          })}

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
              {datas?.length === 0 && <NoRecordsPage title={"Cancel Plan"} />}
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
              count={totalPages <= 10 ? 1 : totalPages / 10}
              page={page}
              onChange={(e, newValue) => handleChangePage(e, newValue)}
              size="small"
              showFirstButton
              showLastButton
            />
          </Div>
        </Div>

        <Div sx={{ display: listCancel === "create" ? "block" : "none" }}>
          <CreateCancelPlan
            setCancelPlan={setListCancel}
            setListCancel={setListCancel}
          />
        </Div>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default CancellationofPlanlist;
