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
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useReducer, useRef, useCallback } from "react";
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
  MdShare,
} from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  generateRandomColor,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { DataArray } from "@mui/icons-material";
import SearchBar from "app/pages/widgets/SearchField";
import {
  Cancelbutton,
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
  AddonsubscriptionFilterState,
  licenseFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import { IoMdPrint } from "react-icons/io";
import OverviewPage from "app/pages/components/OverviewPage";
import CreatePayments from "app/pages/sales/payments/CreatePayments";
import SubscriptionInvoice from "app/pages/sales/subscription/SubscriptionInvoice";

const AddonSubscription = ({ scrollHeight }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Subscription_Id", label: "Subscription Id", bool: true },
    { sort: "Addonsubscriptionname", label: "Subscription Name", bool: true },
    // { sort: "Addon_Id", label: "Addon Id", bool: false },
    // { sort: "Invoice_Id", label: "Invoice Id", bool: false },
    // { sort: "Subscription_Id", label: "Subscription Id", bool: true },
    { sort: "Plan_Name", label: "Plan Name", bool: true },
    { sort: "SubscriptionDate", label: "Subscription date", bool: true },
    // { sort: "Renewaldate", label: "Renewal date", bool: false },
    // { sort: "Noofusers", label: "No of users", bool: false },
    // { sort: "Amountperuser", label: "Amount( Per User )", bool: true },
    // { sort: "Status", label: "Status", bool: true },
    // { sort: "Invoicegenflg", label: "status", bool: true },
  ]);

  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [save, setSave] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const applyAbortRef = useRef(null);
  const hiddenReportRef = React.useRef(null);

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
    setVisitedPages(newPage - 1);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    AddonsubscriptionFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      SubscriptionName: "",
      Subscriptiondate: "",
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
      Addonsubscriptionname: filterState?.SubscriptionName || "",
      page: page,
    };

    setLoading(true);
    setPage(1);
    setVisitedPages(0);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/Addsubscriptionrequestfilter/`, payload),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          SubscriptionDate: item?.Subscription_Id?.SubscriptionDate || "",
          Plan_Name: item?.Subscription_Id?.Plan_Name || "",
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
      axiosInstance.get(`/superadmin/Addsubscriptionrequestlist/?page=${page}`),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          Customer_Id: item?.Customer_Id || item?.Subscription_Id?.Customer_Id,
          SubscriptionDate: item?.Subscription_Id?.SubscriptionDate || "",
          Plan_Name: item?.Subscription_Id?.Plan_Name || "",
        })) || [];

      setdatas(list);
      setCount(handledata.count);
    }
    setLoading(false);
  };

  // Function to fetch payment records based on Invoice_Id
  const getPaymentRecords = async (invoiceId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/PaymentsAdditional/?page=1`,
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
      const paymentData = await getPaymentRecords(
        data?.Invoice_Id?.id || data?.Invoice_Id,
      );

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

  const handleDelete = async (data) => {
    if (!Boolean(data.id)) {
      toast.warning("id miss match ! ");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(`/superadmin/addonsubscription/?id=${data.id}`),
      );

      if (handledata) {
        toast.success("Deleted Sucessfully");
        getList();
      }
    }
  };

  const mailBodyContent = async (selectedFiles, sharingData) => {
    return `<div style="width: 100%; font-family: Arial, sans-serif;">
  <div>
    <h4 className="text-muted">Dear Sir,</h4>
    <div class='card-text'>
    <p>I hope this mail finds you well. I am writing to request a invoice for our organization for the following Subscription.</p>
    <br />
    <div class='card-text'>
    <p><strong>Customer Details:</strong></p>
    <ul>
      <li><strong>Customer Name:</strong> ${
        sharingData?.Customer_Id?.Contact_Name
      }</li>
      <li><strong>Organization Name:</strong>${
        sharingData?.Customer_Id?.Organization_Name || "-"
      }</li>
      <li><strong>Total Amount:</strong> ₹${
        sharingData?.NetAmount || sharingData?.InvoiceAmount || 0
      }</li>
    </ul>
    
  </div>
 
  <br/>

  <p>Click the button to download the attachment</p>
      <ul>
      <div  style="margin:10px 0;">
       <li><strong>File Name :</strong>${selectedFiles?.FileName}</li>
        <a href="${BASE_URL}${selectedFiles?.File}" download=${
          selectedFiles?.File
        } target="_blank">
          <Button>
            Download
          </Button>
        </a>
      </div>

      <li><strong>Terms & Condition:</strong>${
        sharingData?.Payment_Terms || "-"
      }</li>
     
      </ul>
      <br/>
      <p>We appreciate your consideration of Foyer as your subscription provider. We look forward to the possibility of
       working with you and meeting your [subscription] needs.</p>
       <br/>
     
      <p>Best Regards,</p>
      <p>${localStorage.getItem("Username")},</p>
    </div>
  </div>
  </div>`;
  };

  const MailSendFun = async (PDF_URL_Res, sharingData) => {
    const token = localStorage.getItem("accesstoken");
    const item = "crmuseradmin1";
    const header = {
      headers: {
        db: item,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      let customerMail = sharingData?.Customer_Id?.Mail;

      // If mail is missing, fetch it from AccountCRUD
      if (!customerMail) {
        const customerId =
          sharingData?.Customer_Id?.id || sharingData?.Customer_Id;
        if (customerId) {
          const accountRes = await axios.get(
            `${BASE_URL}/superadmin/AccountCRUD/?id=${customerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Db: localStorage.getItem("DBName"),
              },
            },
          );
          if (accountRes.data?.results?.length > 0) {
            customerMail = accountRes.data.results[0].Mail;
          } else if (accountRes.data?.Mail) {
            customerMail = accountRes.data.Mail;
          }
        }
      }

      const payload = {
        Created_By: parseInt(localStorage.getItem("UserId")),
        To: [customerMail],
        mailsubject: `Invoice ${sharingData?.id || ""}`,
        Body: await mailBodyContent(PDF_URL_Res, sharingData),
        filename: generateRandomColor() + PDF_URL_Res?.FileName,
      };

      const response = await axios.post(
        `${BASE_URL}/superadmin/QuotationMailSending/`,
        payload,
        header,
      );

      if (response) {
        toast.success("Mail Sent Successfully");
      }
    } catch (error) {
      console.error("An error occurred while sending the email:", error);
      toast.error(`${error}`);
    } finally {
      setIsSharing(false);
    }
  };

  const sendInvoiceMail = async (sharingData) => {
    setIsSharing(true);
    toast.info("Preparing invoice for sharing...");
    try {
      const contentElement = hiddenReportRef.current;
      if (!contentElement) {
        throw new Error("Invoice content not found");
      }

      const canvas = await html2canvas(contentElement);
      const imageData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("portrait", "mm", "a4");
      const a4Width = 210;
      const a4Height = 297;
      const margin = 10;

      const img = new Image();
      img.src = imageData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const imgAspectRatio = imgWidth / imgHeight;

      let newWidth = a4Width - margin * 2;
      let newHeight = newWidth / imgAspectRatio;

      if (newHeight > a4Height - margin * 2) {
        newHeight = a4Height - margin * 2;
        newWidth = newHeight * imgAspectRatio;
      }

      pdf.addImage(imageData, "JPEG", margin, margin, newWidth, newHeight);

      const customFilename = `${generateRandomColor()}${generateRandomColor()}invoice.pdf`;
      const base64Data = pdf.output("datauristring").split(",")[1];

      const token = localStorage.getItem("accesstoken");
      const item = "crmuseradmin1";
      const header = {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const payload = {
        File: base64Data,
        FileName: customFilename,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Urls: "null",
        Description: "Invoice File",
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };

      const response = await axios.post(
        `${BASE_URL}/superadmin/UserFilesandUrlsCRUD/`,
        payload,
        header,
      );

      await MailSendFun(response.data, sharingData);
    } catch (error) {
      console.error("An error occurred while sending the email:", error);
      toast.error(`${error}`);
      setIsSharing(false);
    }
  };

  const handleShareClick = (data, invoicedata) => {
    const sharingData = {
      ...(typeof invoicedata === "object" ? invoicedata : {}),
      Customer_Id: data?.Customer_Id,
      Customer_Name: data?.Subscription_Id?.Customer_Name,
      Subscription_Id: data?.Subscription_Id,
      Invoice_Id:
        typeof invoicedata === "object" ? invoicedata?.Invoice_Id : invoicedata,
      Invoice_Date:
        typeof invoicedata === "object"
          ? invoicedata?.Invoice_Date
          : data?.RequestDate || data?.Created_Date,
      InvoiceAmount:
        typeof invoicedata === "object"
          ? invoicedata?.InvoiceAmount
          : Number(data?.Addon_Id?.[0]?.Price || 0),
      NetAmount:
        typeof invoicedata === "object"
          ? invoicedata?.NetAmount
          : Number(data?.Addon_Id?.[0]?.Price || 0) +
            Number(data?.Subscription_Id?.TaxAmount || 0),
      TaxAmount:
        typeof invoicedata === "object"
          ? invoicedata?.TaxAmount
          : data?.Subscription_Id?.TaxAmount || 0,
      InvoiceFor:
        typeof invoicedata === "object"
          ? invoicedata?.InvoiceFor
          : "Addon Request",
      Plan_Name: data?.Subscription_Id?.Plan_Name,
      Quantity: 1,
    };
    seteditdatas(sharingData);
    setTimeout(() => {
      sendInvoiceMail(sharingData);
    }, 100);
  };

  // generateInvoice function
  const generateInvoice = async (inv) => {
    let InvoiceAmount = Number(inv?.Addon_Id?.[0]?.Price || 0);
    let TaxAmount = Number(inv?.Subscription_Id?.TaxAmount || 0);
    let NetAmount = InvoiceAmount + TaxAmount;

    let payload = {
      Invoice_Id: "",
      Subscription_Id: parseInt(
        inv?.Subscription_Id?.id || inv?.Subscription_Id || 0,
      ),
      Customer_Id:
        inv?.Customer_Id?.id ||
        inv?.Subscription_Id?.Customer_Id?.id ||
        inv?.Customer_Id ||
        inv?.Subscription_Id?.Customer_Id ||
        inv?.Subscription_Id?.customer_id ||
        inv?.customer_id,
      InvoiceAmount: InvoiceAmount,
      NetAmount: NetAmount,
      TaxAmount: TaxAmount,
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
            `${BASE_URL}/superadmin/Addsubscriptionrequest/`,
            { id: inv?.id, Invoice_Id: res.data?.id, Invoicegenflg: true },
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

  // useEffect(() => {
  //   getList();
  //   // getAddonSubscriptionRecords();
  // }, []);

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/Addsubscriptionrequestsearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        let list =
          handledata?.results.map((item) => ({
            ...item,
            SubscriptionDate: item?.Subscription_Id?.SubscriptionDate || "",
            Plan_Name: item?.Subscription_Id?.Plan_Name || "",
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
      } else if (!searchFiled) {
        getList();
      }
    } else if (tabValue === 1) {
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue]);

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ position: "relative" }}>
          {loading && <CRMCustomLoader />}
          <Box sx={{ mb: 2 }}>
            <Div className="flex items-center justify-between">
            <Typography sx={[componentTitle]}>
              Addon Subscription Request
            </Typography>

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
                ( {count} ) Subscription
              </Typography>
            </Grid>
            {/* {!matches && (
              <Grid item xs={1} md={1}>
                <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                  <FaGear style={{ fontSize: 18 }} />
                </IconButton>
              </Grid>
            )} */}

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
                      Subscription Name
                    </Typography>
                    <TextField
                      type="text"
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      placeholder="Addon subscription name"
                      name="SubscriptionName"
                      value={filterState?.SubscriptionName}
                      onChange={handleFilterNameChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Typography
                      id="Typography-root"
                      sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                    >
                      Subscription Date
                    </Typography>
                    <TextField
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      name="Subscriptiondate"
                      type="date"
                      placeholder="Subscription Date"
                      value={filterState?.Subscriptiondate}
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
                    setPage(1);
                    setVisitedPages(0);
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
                />
                {datas?.length > 0 && (
                  <TableBody sx={{ mt: 2 }}>
                    {datas?.map((data, index) => {
                      console.log("data :", data);
                      let invoicedata = Boolean(
                        data?.Invoicegenflg ||
                          data?.Invoiceflg ||
                          data?.Invoice_Id ||
                          data?.Invoice_No,
                      );
                      let paymentdata = Boolean(
                        data?.Paymentsflg ||
                          data?.Payment_Id ||
                          data?.Invoice_Id?.Payment_Status?.toLowerCase() ===
                            "paid",
                      );
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
                                    : item?.label?.includes("Id")
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
                            <CustomTooltip
                              value="Invoice Generator"
                              type="children"
                            >
                              <IconButton
                                disabled={invoicedata}
                                size="small"
                                onClick={() => {
                                  setShowGenerateInvoice(true);
                                  seteditdatas(data);
                                }}
                              >
                                <RiAiGenerate
                                  style={{
                                    fontSize: 16,
                                    color: !invoicedata
                                      ? Colors?.Mblue
                                      : "gray",
                                  }}
                                />
                              </IconButton>
                            </CustomTooltip>

                            <CustomTooltip
                              value="Share Invoice"
                              type="children"
                            >
                              <IconButton
                                size="small"
                                disabled={
                                  !invoicedata || !paymentdata || isSharing
                                }
                                onClick={() =>
                                  handleShareClick(data, data?.Invoice_Id)
                                }
                              >
                                <MdShare
                                  color={
                                    invoicedata && paymentdata && !isSharing
                                      ? Colors?.Mblue
                                      : "gray"
                                  }
                                  style={{ fontSize: 16 }}
                                />
                              </IconButton>
                            </CustomTooltip>

                            <CustomTooltip
                              value="Print Invoice"
                              type="children"
                            >
                              <IconButton
                                disabled={!invoicedata || !paymentdata}
                                size="small"
                                onClick={() => {
                                  seteditdatas({
                                    ...(typeof data?.Invoice_Id === "object"
                                      ? data?.Invoice_Id
                                      : {}),
                                    Customer_Id: data?.Customer_Id,
                                    Customer_Name:
                                      data?.Subscription_Id?.Customer_Name,
                                    Subscription_Id: data?.Subscription_Id,
                                    Invoice_Id:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.Invoice_Id || data?.Invoice_Id?.id
                                        : data?.Invoice_Id,
                                    Invoice_Date:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.Invoice_Date
                                        : data?.RequestDate || data?.Created_Date,
                                    InvoiceAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.InvoiceAmount
                                        : Number(data?.Addon_Id?.[0]?.Price || 0),
                                    NetAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.NetAmount
                                        : Number(data?.Addon_Id?.[0]?.Price || 0) +
                                          Number(data?.Subscription_Id?.TaxAmount || 0),
                                    TaxAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.TaxAmount
                                        : data?.Subscription_Id?.TaxAmount || 0,
                                    InvoiceFor:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.InvoiceFor
                                        : "Addon Request",
                                    Plan_Name: data?.Subscription_Id?.Plan_Name,
                                    Quantity: 1,
                                  });
                                  setOpenInvoice(true);
                                }}
                              >
                                <IoMdPrint
                                  color={
                                    invoicedata && paymentdata
                                      ? Colors?.Mblue
                                      : "gray"
                                  }
                                  style={{ fontSize: 16 }}
                                />
                              </IconButton>
                            </CustomTooltip>

                            {!paymentdata ? (
                              <CustomTooltip
                                value="Create Payment"
                                type="children"
                              >
                                <IconButton
                                  disabled={!invoicedata || paymentdata}
                                  size="small"
                                  onClick={() => {
                                    setOpenCreateModal({
                                      Invoice_Id: data?.id,
                                      data: {
                                        ...data?.Invoice_Id,
                                        id:
                                          data?.Invoice_Id?.id ||
                                          data?.Invoice_Id,
                                        Invoice_Id:
                                          data?.Invoice_Id?.Invoice_Id ||
                                          data?.Invoice_Id,
                                        Customer_Id: data?.Customer_Id,
                                        Subscription_Id: data?.Subscription_Id,
                                        InvoiceAmount: Number(
                                          data?.Addon_Id?.[0]?.Price,
                                        ),
                                        NetAmount:
                                          Number(data?.Addon_Id?.[0]?.Price) +
                                          Number(
                                            data?.Subscription_Id?.TaxAmount ||
                                              0,
                                          ),
                                        TaxAmount:
                                          data?.Subscription_Id?.TaxAmount || 0,
                                        Invoice_Date:
                                          data?.RequestDate ||
                                          data?.Created_Date,
                                        Customer_Name:
                                          data?.Subscription_Id?.Customer_Name,
                                        InvoiceFor: "Addon Request",
                                      },
                                    });
                                  }}
                                >
                                  <MdOutlinePayment
                                    color={
                                      invoicedata && !paymentdata
                                        ? Colors?.Mblue
                                        : "gray"
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
                                disabled={
                                  !paymentdata ||
                                  data?.sync_status?.toLowerCase() === "synced"
                                }
                                size="small"
                                onClick={() => setOpenApply(data)}
                              >
                                <MdOutlineDataSaverOn
                                  color={
                                    paymentdata &&
                                    data?.sync_status?.toLowerCase() !==
                                      "synced"
                                      ? Colors?.Mblue
                                      : "gray"
                                  }
                                  style={{ fontSize: 16 }}
                                />
                              </IconButton>
                            </CustomTooltip>
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
                <NoRecordsPage title={"Additional Subscription Request"} />
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
                  `${BASE_URL}/superadmin/Addsubscriptionrequest/`,
                  { id: openCreateModal?.Invoice_Id, Paymentsflg: true },
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
                if (openCreateModal?.data?.id) {
                  await axios.patch(
                    `${BASE_URL}/superadmin/Invoice/`,
                    { id: openCreateModal?.data?.id, Payment_Status: "Paid" },
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
                }
              }}
            />
          </DialogContent>
        </Dragabledialog>

        {/* paymnet overview */}
        {showOverview && (
          <OverviewPage
            open={Boolean(showOverview)}
            label="Payment Details"
            setOpen={setShowOverview}
            onClose={() => setShowOverview(false)}
            datas={showOverview}
          />
        )}

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
          maxWidth="md"
          open={openApply}
          title="Addon Subscription Request"
          onClose={() => {
            applyAbortRef.current?.abort();
            setApplyLoading(false);
            setOpenApply(false);
          }}
        >
          <Grid container gap={1} sx={{ mt: 3 }}>
            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Subscription Id{" "}
              </Typography>

              <TextField
                name="Subscription_Id"
                value={openApply?.Subscription_Id?.Subscription_Id}
                placeholder="# Subscription Id"
                className="input-box2 col-md-8"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Subscription Name{" "}
              </Typography>

              <TextField
                name="Addonsubscriptionname"
                value={openApply?.Addonsubscriptionname}
                placeholder="Subscription Name"
                className="input-box2 col-md-8"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
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
                value={openApply?.Plan_Name}
                // onChange={(e) =>
                //   setFormData((prevState) => ({
                //     ...prevState,
                //     Planname: e.target.value,
                //   }))
                // }
                name="Planname"
                className="input-box2 col-md-8"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Subscription Date
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Subscription Date"
                variant="outlined"
                className="input-box2 col-md-8"
                value={openApply?.SubscriptionDate}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Subscription_Id: e.target.value,
                //   }))
                // }
                name="SubscriptionDate"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
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
              loading={applyLoading}
              onClick={async () => {
                const controller = new AbortController();
                applyAbortRef.current = controller;
                setApplyLoading(true);
                const userUpdatePayload = {
                  subscription: {
                    subscription_id:
                      openApply?.Subscription_Id?.id ||
                      openApply?.Subscription_Id,
                    addon_ids: Array.isArray(openApply?.Addon_Id)
                      ? openApply?.Addon_Id?.map((addon) => addon?.id || addon)
                      : [openApply?.Addon_Id?.id || openApply?.Addon_Id],
                    addon_request_ids: Array.isArray(
                      openApply?.Requested_UserMasterId,
                    )
                      ? openApply?.Requested_UserMasterId
                      : [openApply?.Requested_UserMasterId],
                  },
                  tenant: {
                    TenantSubscription_Id: openApply?.TenantSubscription_Id,
                  },
                };

                try {
                  const response = await axios.patch(
                    `${BASE_URL}/superadmin/AdditionalAddonUpdate/`,
                    userUpdatePayload,
                    {
                      signal: controller.signal,
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

                  if (response?.data) {
                    toast.success("Addons updated successfully");
                    setOpenApply(false);
                    getList();
                  }
                } catch (error) {
                  if (axios.isCancel?.(error) || error?.name === "CanceledError" || error?.name === "AbortError") {
                    console.log("Apply request cancelled");
                  } else {
                    console.error("error", error);
                    toast.error("Failed to update addons");
                  }
                } finally {
                  setApplyLoading(false);
                }
              }}
            />
            <Cancelbutton
              label="Cancel"
              onClick={() => {
                applyAbortRef.current?.abort();
                setApplyLoading(false);
                setOpenApply(false);
              }}
            />
          </Div>
        </Dragabledialog>
      </Div>
      </JumboContentLayoutMain>

      {/* Hidden Invoice for background processing */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <SubscriptionInvoice
          reportTemplateRef={hiddenReportRef}
          datas={editdatas}
          Buttons={false}
        />
      </div>

      <ToastContainer />
    </>
  );
};

export default AddonSubscription;
