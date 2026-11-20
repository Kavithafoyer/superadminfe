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
import React, { useEffect, useReducer, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt, BiSolidDetail } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice, FaFileInvoiceDollar } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
  MdOutlinePayments,
  MdOutlineDataSaverOn,
  MdShare,
} from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { RiAiGenerate, RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import ChangeplanApply from "./ChangeplanApply";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ChangeplanInvoice from "./Changeplaninvoice_02";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { DataArray } from "@mui/icons-material";
import SearchBar from "app/pages/widgets/SearchField";
import {
  Cancelbutton,
  CustomButton,
  CustomIcon,
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
  licenseFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import SubscriptionInvoice from "app/pages/sales/subscription/SubscriptionInvoice";
import { IoMdPrint } from "react-icons/io";
import CreatePayments from "app/pages/sales/payments/CreatePayments";
import OverviewPage from "app/pages/components/OverviewPage";

const ChangePlanList = ({ scrollHeight }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Licensereqid", label: "Request Id", bool: true },
    { sort: "RequestDate", label: "Request Date", bool: true },
    { sort: "Customername", label: "Customer Name", bool: true },
    { sort: "Planname", label: "Plan Name", bool: true },
    { sort: "Subscription_Id", label: "Subscription Id", bool: true },
    { sort: "Plan_Id", label: "Plan Id", bool: true },
    // { sort: "Invoice_Id", label: "Invoice Id", bool: true },
    // { sort: "Invoiceflg", label: "", bool: false },
    { sort: "Paymentsflg", label: "Payments Status", bool: true },
  ]);

  const [save, setSave] = useState(false);
  const [openApply, setOpenApply] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const applyAbortRef = useRef(null);

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);

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

  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const hiddenReportRef = useRef(null);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const [existingUsersCount, setExistingUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openApply) {
      const subId =
        openApply?.Subscription_Id?.Subscription_Id ||
        openApply?.Subscription_Id;
      if (subId) {
        axios
          .get(
            `${BASE_URL}/superadmin/subscriptionlist/?Subscription_Id=${subId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                Db: localStorage.getItem("DBName"),
              },
            },
          )
          .then((res) => {
            if (res.data?.results?.length > 0) {
              const subData = res.data.results[0];
              const totalUsers =
                (subData.Base_Users || 0) + (subData.Additional_users || 0);
              setExistingUsersCount(totalUsers);
            }
          })
          .catch((err) => {
            console.error("Error fetching subscription details", err);
          });
      }
    }
  }, [openApply]);

  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

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
      <li><strong>Total Amount:</strong> ₹${sharingData?.NetAmount || sharingData?.InvoiceAmount || 0}</li>
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
        const customerId = sharingData?.Customer_Id?.id || sharingData?.Customer_Id;
        if (customerId) {
          const accountRes = await axios.get(
            `${BASE_URL}/superadmin/AccountCRUD/?id=${customerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Db: localStorage.getItem("DBName"),
              },
            }
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
      Customer_Name: data?.Customername || data?.Customer_Name,
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
          : data?.UserTotalAmount,
      NetAmount:
        typeof invoicedata === "object"
          ? invoicedata?.NetAmount
          : data?.UserTotalAmount,
      TaxAmount:
        typeof invoicedata === "object"
          ? invoicedata?.TaxAmount
          : data?.TaxAmount,
      InvoiceFor:
        typeof invoicedata === "object"
          ? invoicedata?.InvoiceFor
          : "Additional Licence",
      Plan_Name:
        data?.Planname || data?.Plan_Name || data?.Subscription_Id?.Plan_Name,
      Quantity: data?.Nooflicense || data?.Requestedusers,
    };
    seteditdatas(sharingData);
    setTimeout(() => {
      sendInvoiceMail(sharingData);
    }, 100);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setVisitedPages(newPage - 1);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    licenseFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      CustomerName: "",
      Planname: "",
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
      Customername: filterState?.CustomerName || "",
      Planname: filterState?.Planname || "",
      page: page,
    };

    setLoading(true);
    setPage(1);
    setVisitedPages(0);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/Additionallicenserequestfilter/`, payload),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          Customer_Id: item?.Customer_Id || item?.Subscription_Id?.Customer_Id,
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
    Addorcancellicenselist();
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

  const GetUpdatedAddorLicence = (Licensereqid) => {
    axios
      .get(
        BASE_URL +
          `superadmin/Addorcancellicense/?Licensereqid=${Licensereqid}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      )
      .then((response) => {
        console.log("Get Addorcancel Details", response?.data);
        setinvoicedatas(response?.data);
        setchangeinvoice(true);
        setListChange(false);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const Addorcancellicenselist = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/Additionallicenserequestlist/?page=${page}`),
    );

    if (handledata) {
      let list =
        handledata?.results.map((item) => ({
          ...item,
          Customer_Id: item?.Customer_Id || item?.Subscription_Id?.Customer_Id,
          Nooflicense: item?.Nooflicense || item?.Requestedusers,
          Requestedusers: item?.Nooflicense || item?.Requestedusers,
        })) || [];
      setdatas(list);
      setCount(handledata.count);
    }
    setLoading(false);
  };

  // generateInvoice function
  const generateInvoice = async (inv) => {
    let InvoiceAmount = Number(inv?.UserTotalAmount || 0);
    let NetAmount = Number(inv?.UserTotalAmount || 0);

    let payload = {
      Invoice_Id: "",
      Subscription_Id: parseInt(
        inv?.Subscription_Id?.id || inv?.Subscription_Id || 0,
      ),
      Customer_Id: inv?.Customer_Id,
      InvoiceAmount: InvoiceAmount,
      NetAmount: NetAmount,
      TaxAmount: inv?.TaxAmount || 0,
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
            `${BASE_URL}/superadmin/Additionallicenserequest/`,
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

          Addorcancellicenselist();
        }
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleDelete = async (data) => {
    if (!Boolean(data.id)) {
      toast.warning("id miss match ! ");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(`/superadmin/AddorcancellicenseCRUD/?id=${data.id}`),
      );

      if (handledata) {
        toast.success("Deleted Sucessfully");
        Addorcancellicenselist();
      }
    }
  };

  // useEffect(() => {
  //   Addorcancellicenselist();
  //   // getAddonSubscriptionRecords();
  // }, []);

  const [colors2, setColors2] = useState([]);
  const [colors3, setColors3] = useState([]);

  const generateRandomColorFromList = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  const generateRandomAvatarColors = async (list, colorList) => {
    const colors = await Promise.all(
      list.map(() => generateRandomColorFromList(colorList)),
    );
    return colors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorList = [
          "#FAB3B3",
          "#FAB3F3",
          "#E0B3FA",
          "#BFB3FA",
          "#B3E3FA",
          "#B3FACD",
          "#E7FAB3",
          "#FAF6B3",
          "#FAD4B3",
          "#FAB3B3",
        ];
        const avatarColors1 = await generateRandomAvatarColors(
          datas,
          colorList,
        );
        // console.log("avatarColors1", avatarColors1);
        setColors3(avatarColors1);
      } catch (error) {}
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [datas]);

  const handleClose2 = () => {
    setSendAddRequest(false);
    setModaldata1([]);
  };

  const handlesendPopup = (data) => {
    console.log("data", data);
    setSendAddRequest(true);
    setModaldata1(data);
  };

  const handleSearchChange = (event) => {
    console.log("handleSearchange:", event.target.value);
    var SearchData = event.target.value;
    SearchData !== "" ? handleSearch(SearchData) : Addorcancellicenselist();
  };

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/Additionallicenserequestsearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        let list =
          handledata?.results.map((item) => ({
            ...item,
            Customer_Id: item?.Customer_Id || item?.Subscription_Id?.Customer_Id,
          })) || [];
        setdatas(list);
        setCount(handledata?.count);
      }
      setLoading(false);
    }, 500),
    [page],
  );

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

  // useEffect(() => {
  //   resetFilter();
  //   if (tabValue == 0) {
  //     setSearchFiled("");
  //     Addorcancellicenselist();
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
        Addorcancellicenselist();
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
        {/*----------- Below code is payment details(View_Payment)----------------------- */}
        <Dialog
          open={sendAddRequest}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={[DialogHeader, DisplayFlex]}>
            View Payment Details
          </DialogTitle>
          <DialogContent sx={{ padding: "10px", overflow: "hidden" }}>
            <DialogContentText id="alert-dialog-description">
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1}>
                        Request No
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <Typography sx={[FontStyle]}>
                        {/* {Modaldata.Ticket_Id} */}
                      </Typography>
                    </Div>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1}>
                        Customer Name
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <Typography sx={[FontStyle]}>
                        {/* {Modaldata.TicketRelatesto} */}
                      </Typography>
                    </Div>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1} mt={1}>
                        Invoice No
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1} mt={1}>
                        Invoice Date
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]} mt={1}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <TextField
                        style={{ mb: 1 }}
                        className="input-box col-12 mb-1"
                        size={"small"}
                        placeholder={"Allocated date"}
                        //  value={Modaldata && Modaldata.AllowcatedDate?.split("T")[0]}
                        //  onChange={(e) => setTo(e.target.value)}
                      />
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1} mt={1}>
                        Payment Amount
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]} mt={1}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <TextField
                        style={{ mb: 1 }}
                        className="input-box col-12 mb-1"
                        size={"small"}
                        placeholder={"Deadline date"}
                        //  value={Modaldata && Modaldata.DeadlineDate?.split("T")[0]}
                        //  onChange={(e) => setTo(e.target.value)}
                      />
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1} mt={1}>
                        Payment Date
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]} mt={1}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <TextField
                        style={{ mb: 1 }}
                        className="input-box col-12 mb-1"
                        size={"small"}
                        placeholder={"Deadline date"}
                        //  value={Modaldata && Modaldata.DeadlineDate?.split("T")[0]}
                        //  onChange={(e) => setTo(e.target.value)}
                      />
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Div className="row">
                    <Div className="col-12 col-md-5">
                      <Typography sx={[FontStyle]} ml={1}>
                        Status
                      </Typography>
                    </Div>
                    <Div
                      className="col-1"
                      sx={{ display: { xs: "none", md: "flex" } }}
                    >
                      <Typography sx={[FontStyle]} mt={1}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                    <Div className="col-12 col-md-6">
                      <Typography sx={[FontStyle]} mt={1}>
                        : &nbsp;&nbsp;&nbsp;
                      </Typography>
                    </Div>
                  </Div>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: "20px 30px 30px 30px" }}>
            {/* <Button className="save-buttonuser" sx={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",}}>Send Request</Button> */}
            <Button
              sx={[DialogBoxCancelButton, ButtonStyle, FontStyle]}
              onClick={handleClose2}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        {/*----------- End of payment details(View_Payment)----------------------- */}

        <Box sx={{ mb: 2 }}>
          <Div className="flex items-center justify-between">
            <Typography sx={[componentTitle]}>
              Additional Licence Request
            </Typography>
            {/* <Div className="z-999 p-2 flex items-center justify-center">
              {matches && (
                <IconButton 
                onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                  <FaGear style={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Div> */}
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
                ( {count} ) Licence Request
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
                      Customer Name
                    </Typography>
                    <TextField
                      type="text"
                      className={`col-12 input-box2`}
                      autoComplete="off"
                      placeholder="Customer Name"
                      name="CustomerName"
                      value={filterState?.CustomerName}
                      onChange={handleFilterNameChange}
                    />
                  </Grid>

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
                      console.log("data is : ", data);
                      let invoicedata = Boolean(
                        data?.Invoiceflg ||
                        data?.Invoice_Id?.id ||
                        data?.Invoice_Id,
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
                                    : item?.label !== "Request Id" &&
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
                                      data?.Customername || data?.Customer_Name,
                                    Subscription_Id: data?.Subscription_Id,
                                    Invoice_Id:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.Invoice_Id ||
                                          data?.Invoice_Id?.id
                                        : data?.Invoice_Id,
                                    Invoice_Date:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.Invoice_Date
                                        : data?.RequestDate ||
                                          data?.Created_Date,
                                    InvoiceAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.InvoiceAmount
                                        : data?.UserTotalAmount,
                                    NetAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.NetAmount
                                        : data?.UserTotalAmount,
                                    TaxAmount:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.TaxAmount
                                        : data?.TaxAmount,
                                    InvoiceFor:
                                      typeof data?.Invoice_Id === "object"
                                        ? data?.Invoice_Id?.InvoiceFor
                                        : "Additional Licence",
                                    Plan_Name:
                                      data?.Planname ||
                                      data?.Plan_Name ||
                                      data?.Subscription_Id?.Plan_Name,
                                    Quantity: data?.Nooflicense || data?.Requestedusers,
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
                                        UserTotalAmount: data?.UserTotalAmount,
                                        TaxAmount: data?.TaxAmount || 0,
                                        RequestDate:
                                          data?.RequestDate ||
                                          data?.Created_Date,
                                        Customername: data?.Customername,
                                        InvoiceFor: "Licence Request",
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
                {/* <DialogBox
                  open={deleteItem}
                  Content={deletedWarnigMsg}
                  onClickYes={() => {
                    setDeleteItem(false);
                    handleDelete(deleteItem);
                  }}
                  onClickNo={() => setDeleteItem(false)}
                /> */}
              </Table>
              {datas?.length === 0 && (
                <NoRecordsPage title={"Additional Licence Request"} />
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

        <Div sx={{ display: changeinvoice === true ? "block" : "none" }}>
          <ChangeplanInvoice
            setchangeinvoice={setchangeinvoice}
            setListChange={setListChange}
            invoicedatas={invoicedatas}
          />
        </Div>

        <Div sx={{ display: changeplan === true ? "block" : "none" }}>
          <ChangeplanApply
            setChangePlan={setChangePlan}
            setListChange={setListChange}
            editdatas={editdatas}
            getAddonSubscriptionRecords={Addorcancellicenselist}
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
                console.log("openCreateModal : ", openCreateModal);
                await axios.patch(
                  `${BASE_URL}/superadmin/Additionallicenserequest/`,
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
                Addorcancellicenselist();
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
          onClose={() => {
            applyAbortRef.current?.abort();
            setApplyLoading(false);
            setOpenApply(false);
          }}
        >
          <Grid container gap={1} sx={{ mt: 3 }}>
            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Licence Request Id{" "}
              </Typography>

              <TextField
                name="LicenceId"
                value={openApply?.Licensereqid}
                placeholder="# Licence Request Id"
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
                value={openApply?.Planname}
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
                Subscription Id
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Subscription Id"
                variant="outlined"
                className="input-box2 col-md-8"
                value={openApply?.Subscription_Id?.Subscription_Id}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Subscription_Id: e.target.value,
                //   }))
                // }
                name="Subscription_Id"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Existing Users{" "}
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Existing Users"
                variant="outlined"
                className="input-box2 col-md-8"
                value={existingUsersCount}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Existing_AdditionalUsers: e.target.value,
                //   }))
                // }
                name="Users"
                disabled
                size="small"
                sx={{ backgroundColor: "#f4f4f4" }}
              />
            </Grid>

            <Grid item xs={12} md={12} className="row">
              <Typography className="input-label col-sm-12 col-md-4">
                Additional Users
              </Typography>
              <TextField
                id="outlined-basic"
                placeholder="Additional Users"
                variant="outlined"
                className="input-box2 col-md-8"
                value={openApply?.Nooflicense || openApply?.Requestedusers}
                // onChange={(e) =>
                //   setFormData((updState) => ({
                //     ...updState,
                //     Requested_User: e.target.value,
                //   }))
                // }
                name="Nooflicense"
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
                const subId =
                  openApply?.Subscription_Id?.id || openApply?.Subscription_Id;
                const userUpdatePayload = {
                  subscription: {
                    subscription_id: subId,
                    Additional_users: openApply?.Requestedusers,
                    Addtionaluser_Id: Array.isArray(
                      openApply?.Requested_UserMasterId,
                    )
                      ? openApply?.Requested_UserMasterId
                      : [openApply?.Requested_UserMasterId],
                  },
                  tenant: {
                    TenantSubscription_Id: subId,
                    Additional_users: openApply?.Requestedusers,
                  },
                };

                try {
                  const response = await axios.patch(
                    `${BASE_URL}/superadmin/AdditionalUserupdate/`,
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
                    toast.success("Users updated successfully");
                    setOpenApply(false);
                    Addorcancellicenselist();
                  }
                } catch (error) {
                  if (axios.isCancel?.(error) || error?.name === "CanceledError" || error?.name === "AbortError") {
                    console.log("Apply request cancelled");
                  } else {
                    console.error("error", error);
                    toast.error("Failed to update users");
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

export default ChangePlanList;
