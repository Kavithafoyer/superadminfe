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
import React, { useEffect, useReducer, useCallback } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt, BiSolidDetail } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
  MdOutlineDataSaverOn,
  MdOutlinePayments,
} from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { RiAiGenerate, RiRefreshFill } from "react-icons/ri";
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
  CRMDateField,
  CustomButton,
  CustomTooltip,
  DateFormatter,
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
import { FaGear } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  reducerFilter,
  renewalFilterState,
} from "app/pages/settings/filter-reducers/FilterReducers";
import RenewalInvoice from "./Renewalinvoice";
import RenewalApply from "./RenewalApply";
import { IoMdPrint } from "react-icons/io";
import CreatePayments from "app/pages/sales/payments/CreatePayments";
import SubscriptionInvoice from "app/pages/sales/subscription/SubscriptionInvoice";
import OverviewPage from "app/pages/components/OverviewPage";
const RenewalDueList = ({ scrollHeight }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Customer_Name", label: "Customer Name", bool: true },
    // { sort: "Renewal_Id", label: "Renewal Id", bool: true },
    { sort: "RenewalDate", label: "Renewal Date", bool: true },
    { sort: "Plan_Name", label: "Plan Name", bool: true },
    { sort: "SuscriptionAmount", label: "Renewal Amount", bool: true },
    // { sort: "Noofusers", label: "No of Users", bool: true },
    // { sort: "Status", label: "Status", bool: true },
  ]);

  const [listRenewal, setListRenewal] = useState("list");
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [save, setSave] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [loading, setLoading] = useState(false);
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
    renewalFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      CustomerName: "",
      RenewalAmount: "",
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
      Customer_Name: filterState?.CustomerName || "",
      RenewalAmount: filterState?.RenewalAmount || "",
      page: page,
    };

    setLoading(true);
    setPage(1);
    setVisitedPages(0);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/renewalfilter/`, payload),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          SuscriptionAmount: item?.Subscription_Id?.SuscriptionAmount || "",
          Plan_Name: item?.Subscription_Id?.Plan_Id?.Plan_Name || "",
        })) || [];

      setdatas(list);
      setCount(handledata.count);
      setShowFilter(false);
      setSearchFiled("");
    }
    setLoading(false);
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

  const getList = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/renewallist/?page=${page}`),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          SuscriptionAmount: item?.Subscription_Id?.SuscriptionAmount || "",
          Plan_Name: item?.Subscription_Id?.Plan_Id?.Plan_Name || "",
        })) || [];

      setdatas(list);
      setCount(handledata.count);
    }
    setLoading(false);
  };

  const handleDelete = async (data) => {
    if (!Boolean(data.id)) {
      toast.warning("id miss match ! ");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(`/superadmin/renewalCRUD/?id=${data.id}`),
      );

      if (handledata) {
        toast.success("Deleted Sucessfully");
        getList();
      }
    }
  };

  // generateInvoice function
  const generateInvoice = async (inv) => {
    let InvoiceAmount = Number(inv?.Subscription_Id?.UnitPrice);
    let NetAmount =
      Number(InvoiceAmount) + Number(inv?.Subscription_Id?.TaxAmount);

    let payload = {
      Invoice_Id: "",
      Subscription_Id: inv?.Subscription_Id?.id,
      InvoiceAmount: InvoiceAmount,
      NetAmount: NetAmount,
      TaxAmount: inv?.Subscription_Id?.TaxAmount,
      InvoiceFor: "invoice",
      Invoice_Code: "invoice",
      Created_Date: new Date().toISOString(),
      Updated_Date: new Date().toISOString(),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    console.log("inv : ", inv, InvoiceAmount, NetAmount);
    try {
      const res = await axios.post(`${BASE_URL}/superadmin/Invoice/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      });
      if (res.data) {
        toast.success("Invoice is Created successfully");
        if (res.data) {
          const patchres = await axios.patch(
            `${BASE_URL}/superadmin/renewalCRUD/`,
            { id: inv?.id, Invoice_Id: res.data?.id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                Db: localStorage.getItem("DBName"),
              },
            },
          );

          getList();
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  // Function to fetch payment records based on Invoice_Id
  const getPaymentRecords = async (invoiceId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/PaymentsAdditional/`,
        {
          params: { page: 1 },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );

      // Find and return the specific payment record by Invoice_Id
      return (
        response.data.results?.find(
          (record) => record?.Invoice_Id === invoiceId,
        ) || {}
      );
    } catch (error) {
      console.error("Error fetching payment records:", error);
      return {};
    }
  };

  // onClick handler function
  const handlePaymentClick = async (data) => {
    try {
      const paymentData = await getPaymentRecords(data?.Invoice_Id?.id);

      const paymentDetails = {
        "Payment Id": paymentData?.Payment_Id || "",
        "Customer Name": paymentData?.Customer_Name || "",
        "Transaction No": paymentData?.Transaction_No || "",
        "Payment Mode": paymentData?.Payment_Mode || "",
        "Payment Date": paymentData?.Payment_Date || "",
        "Invoice Amount": toLocaleCurrency(paymentData?.InvoiceAmount) || "",
        "Paid Amount": toLocaleCurrency(paymentData?.paid_amount) || "",
        "Payment Details": paymentData?.Payment_details || "",
        "Updated Date": paymentData?.Updated_Date?.split("T")[0] || "",
      };

      console.log("Payment Details:", paymentDetails);

      setShowOverview(paymentDetails);
    } catch (error) {
      console.error("Error handling payment click:", error);
    }
  };

  // useEffect(() => {
  //   getList();
  //   // getAddonSubscriptionRecords();
  // }, []);

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/renewalsearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        let list =
          handledata?.results.map((item) => ({
            ...item,
            SuscriptionAmount: item?.Subscription_Id?.SuscriptionAmount || "",
            Plan_Name: item?.Subscription_Id?.Plan_Id?.Plan_Name || "",
          })) || [];

        setdatas(list);
        setCount(handledata?.count);
      }
      setLoading(false);
    }, 500),
    [page],
  );

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
            <Typography sx={[componentTitle]}>Renewal Request</Typography>
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
                ( {count} ) Renewals
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
                      Renewal Amount
                    </Typography>
                    <TextField
                      type="number"
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      placeholder="Renewal Amount"
                      name="RenewalAmount"
                      inputProps={{
                        min: 0,
                      }}
                      value={filterState?.RenewalAmount}
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
              id="no-more-tables-lg"
            >
              <Table stickyHeader sx={{ mt: 2, mb: 2 }}>
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  setDatas={setdatas}
                  sortDatas={datas}
                />
                {datas?.length > 0 && (
                  <TableBody sx={{ mt: 2 }}>
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
                                    : // : item?.label === "Storage Id"
                                      // ? data?.[item?.sort]
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
                            {!invoicedata ? (
                              <CustomTooltip
                                value="Invoice Generator"
                                type="children"
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setShowGenerateInvoice(true);
                                    seteditdatas(data);
                                  }}
                                >
                                  <RiAiGenerate
                                    style={{
                                      fontSize: 16,
                                      color: Colors?.Mblue,
                                    }}
                                  />
                                </IconButton>
                              </CustomTooltip>
                            ) : (
                              <CustomTooltip
                                value="Print Invoice"
                                type="children"
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    seteditdatas({
                                      Customer_Id:
                                        data?.Subscription_Id?.Customer_Id,
                                      ...data?.Invoice_Id,
                                    });
                                    setOpenInvoice(true);
                                  }}
                                >
                                  <IoMdPrint
                                    color={Colors?.Mblue}
                                    style={{ fontSize: 16 }}
                                  />
                                </IconButton>
                              </CustomTooltip>
                            )}

                            {!data?.InvoicegenFlag ? (
                              <CustomTooltip
                                value="Create Payment"
                                type="children"
                              >
                                <IconButton
                                  disabled={!invoicedata}
                                  size="small"
                                  onClick={() => {
                                    setOpenCreateModal({
                                      Invoice_Id: data?.id,
                                      data: data?.Invoice_Id,
                                    });
                                  }}
                                >
                                  <MdOutlinePayment
                                    color={
                                      invoicedata ? Colors?.Mblue : "lightgray"
                                    }
                                    style={{ fontSize: 16 }}
                                  />
                                </IconButton>
                              </CustomTooltip>
                            ) : (
                              <CustomTooltip
                                value="View Payment"
                                type="children"
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handlePaymentClick(data)}
                                >
                                  <MdOutlinePayments
                                    color={Colors?.Mblue}
                                    style={{ fontSize: 16 }}
                                  />
                                </IconButton>
                              </CustomTooltip>
                            )}

                            <CustomTooltip value="Apply" type="children">
                              <IconButton
                                disabled={!data?.InvoicegenFlag}
                                size="small"
                                onClick={() => setOpenApply(data)}
                              >
                                <MdOutlineDataSaverOn
                                  color={
                                    data?.InvoicegenFlag
                                      ? Colors?.Mblue
                                      : "lightgray"
                                  }
                                  style={{ fontSize: 16 }}
                                />
                              </IconButton>
                            </CustomTooltip>

                            {/* <DeletedIcon
                                onClick={(e) => {
                                  setDeleteItem(data);
                                }}
                              /> */}
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
                <NoRecordsPage title={"Renewal Request"} />
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
              count={totalPages <= 10 ? 1 : totalPages / 10}
              page={page}
              onChange={(e, newValue) => handleChangePage(e, newValue)}
              size="small"
              showFirstButton
              showLastButton
            />
          </Div>
        </Div>

        <Div sx={{ display: listRenewal === "invoice" ? "block" : "none" }}>
          <RenewalInvoice
            setrenewalinvoice={setListRenewal}
            setListRenewal={setListRenewal}
            invoicedatas={invoicedatas}
          />
        </Div>

        <Div sx={{ display: listRenewal === "apply" ? "block" : "none" }}>
          <RenewalApply
            setRenewalPlan={setListRenewal}
            setListRenewal={setListRenewal}
            editdatas={editdatas}
            getRenewabledueRecords={getList}
          />
        </Div>

        <Dragabledialog
          maxWidth="lg"
          open={openInvoice}
          title="Invoice Preview"
          onClose={() => setOpenInvoice(false)}
        >
          <SubscriptionInvoice
            openInvoice={openInvoice}
            setOpenInvoice={setOpenInvoice}
            datas={editdatas}
          />
        </Dragabledialog>

        {/* Create Payments modal */}
        <Dragabledialog
          maxWidth="lg"
          open={openCreateModal}
          title={
            openCreateModal?.type === "put" ? "Edit Payment" : "Create Payment"
          }
          // onClose={() => setOpenAppointment(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <CreatePayments
              setOpen={setOpenCreateModal}
              // setDatas={setListSubscription}
              type={"invoice"}
              datas={openCreateModal?.data}
              GetRecords={async () => {
                const patchres = await axios.patch(
                  `${BASE_URL}/superadmin/renewalCRUD/`,
                  { id: openCreateModal?.Invoice_Id, InvoicegenFlag: true },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accesstoken",
                      )}`,
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Db: localStorage.getItem("DBName"),
                    },
                  },
                );
                getList();
              }}
            />
          </DialogContent>
        </Dragabledialog>

        {/* paymnet overview */}
        <OverviewPage
          label={"Payment"}
          datas={showOverview}
          open={Boolean(showOverview)}
          setOpen={setShowOverview}
          onClose={() => setShowOverview(false)}
        />

        <DialogBox
          open={showGenerateInvoice}
          Content={"Do you want to generate an invoice for this subscription?"}
          onClickYes={() => {
            setShowGenerateInvoice(false);
            generateInvoice(editdatas);
          }}
          onClickNo={() => setShowGenerateInvoice(false)}
        />

        {/* Apply modal */}
        <Dragabledialog
          maxWidth="lg"
          open={openApply}
          title="Additional License Request"
          onClose={() => setOpenApply(false)}
        >
          <Grid container gap={1} sx={{ mt: 3 }}>
            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Renewal Id{" "}
              </Typography>

              <TextField
                name="LicenceId"
                value={openApply?.Renewal_Id}
                placeholder="# Renewal Id"
                className="input-box2 col-md-8"
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Customer Name
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Customer Name"
                variant="outlined"
                value={openApply?.Customer_Name}
                // onChange={(e) =>
                //   setFormData((prevState) => ({
                //     ...prevState,
                //     Planname: e.target.value,
                //   }))
                // }
                name="Customer_Name"
                className="input-box2 col-md-8"
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Plan Name
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Plan Name"
                variant="outlined"
                value={openApply?.Subscription_Id?.Plan_Name}
                name="Plan_Name"
                className="input-box2 col-md-8"
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Renewal Date
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Renewal Date"
                variant="outlined"
                className="input-box2 col-md-8"
                value={openApply?.RenewalDate}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Subscription_Id: e.target.value,
                //   }))
                // }
                name="RenewalDate"
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Renewal Amount{" "}
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Renewal Amount"
                variant="outlined"
                className="input-box2 col-md-8"
                value={openApply?.Subscription_Id?.SuscriptionAmount}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Existing_AdditionalUsers: e.target.value,
                //   }))
                // }
                name="RenewalAmount"
              />
            </Grid>
          </Grid>

          <Div
            sx={{
              my: 3,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              gap: 3,
            }}
          >
            <CustomButton
              label={"Apply"}
              Icon="saveIcon"
              onClick={async () => {
                const patchres = await axios.patch(
                  `${BASE_URL}/superadmin/renewalCRUD/`,
                  {
                    id: openApply?.id,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "accesstoken",
                      )}`,
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Db: localStorage.getItem("DBName"),
                    },
                  },
                );

                if (patchres?.data) {
                  const payload = {
                    Created_By: parseInt(localStorage.getItem("UserId")),
                    To:
                      openApply?.Customer_Id?.Mail ||
                      openApply?.Subscription_Id?.Customer_Id?.Mail ||
                      openApply?.Subscription_Id?.Mail ||
                      openApply?.Mail,
                    subject: "Your Renewal Request Has Been Approved", // Use template literals for string interpolation
                    Body: `<p>Dear ${
                      openApply?.Customer_Id?.Contact_Name ||
                      openApply?.Subscription_Id?.Customer_Id?.Contact_Name ||
                      openApply?.Subscription_Id?.Contact_Name ||
                      openApply?.Customer_Name ||
                      "Customer"
                    },</p>
                            <p>We are pleased to inform you that your request has been approved, and your Renewal will be extended.</p>
                            <p>Thank you for your continued partnership.</p>
                            <p>Best regards,<br>
                            ${localStorage.getItem("Username") || ""} <br>
                             ${localStorage.getItem("Designation") || ""} <br>
                             ${localStorage.getItem("Organizationname") || ""}</p>`,
                  };

                  console.log("mailpayload", payload);

                  const response = await axios.post(
                    `${BASE_URL}/superadmin/AddonMailSending/`,
                    payload,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "accesstoken",
                        )}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Db: localStorage.getItem("DBName"),
                      },
                    },
                  );

                  if (!response?.data?.Error) {
                    toast.success("Mail Sent Successfully");
                  } else {
                    toast.error("Mail isn't Sent Successfully");
                  }
                  setOpenApply(false);
                  getList();
                }
              }}
            />
            <Cancelbutton label="Cancel" onClick={() => setSave(true)} />
          </Div>

          <DialogBox
            open={save}
            onClickYes={() => {
              setSave(false);
              setOpenApply(false);
            }}
            onClickNo={() => setSave(false)}
          />
        </Dragabledialog>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default RenewalDueList;
