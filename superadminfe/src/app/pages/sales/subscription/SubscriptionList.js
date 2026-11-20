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
import React, { useEffect, useReducer, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiAiGenerate, RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CreateSubscriptionDialogs from "./SubscriptionDialogs";
// import CreateCustomer from "./CreateCustomer";
// import Finance from "../Finance";
// import CreateJournals from "./CreateJournals";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import SearchBar from "../../widgets/SearchField";
import {
  ButtonStyle,
  Colors,
  ComponentHeading,
  componentTitle,
  CRMTableHead,
  deletedWarnigMsg,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  StyledTab,
  StyledTabs,
  UploadBtn,
} from "../../widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import {
  axiosInstance,
  Cancelbutton,
  CustomButton,
  CustomTooltip,
  DeletedIcon,
  DialogBox,
  EditIcon,
  errorFilter,
  NoRecordsPage,
  toLocaleCurrency,
  CRMCustomLoader,
} from "app/pages/widgets/StylesComponents";
import { GrPowerReset } from "react-icons/gr";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  reducerFilter,
  subscriptionFilterState,
} from "app/pages/settings/filter-reducers/FilterReducers";
import { handleError } from "app/pages/components/ErrorHandler/handleError";
import { IoMdPrint } from "react-icons/io";
import { MdShare } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SubscriptionInvoice from "./SubscriptionInvoice";
import { generateRandomColor } from "app/pages/widgets/CRMStyles";

const SubscriptionList = ({ scrollHeight }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listSubscription, setListSubscription] = useState(true);
  const [createSubcriprion, setCreateSubcriprion] = useState(false);
  const [editSubscription, setEditSubscription] = useState(false);

  const reportTemplateRef = useRef(null);

  const [showsubscriptionid, setshowsubscriptionid] = useState(true);
  const [showsubscriptiondate, setshowsubscriptiondate] = useState(true);
  const [showcustomername, setshowcustomername] = useState(true);
  const [showplanname, setshowplanname] = useState(true);
  const [shownoofuser, setshownoofuser] = useState(true);
  const [showamount, setshowamount] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const [datas, setdatas] = useState([]);
  const [mydatas, setMydatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const hiddenReportRef = useRef(null);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Subscription_Id", label: "Subscription Id", bool: true },
    { sort: "Subscription_Name", label: "Subscription Name", bool: true },
    { sort: "Subscription_Date", label: "Subscription Date", bool: false },
    { sort: "Customer_Name", label: "Customer Name", bool: true },
    { sort: "Plan_Name", label: "Plan Name", bool: true },
    { sort: "No_Of_Users", label: "No of Users", bool: true },
    { sort: "UnitPrice", label: "Price", bool: true },
    { sort: "Tax_Amount", label: "Tax Amount", bool: true },
    { sort: "SuscriptionAmount", label: "Amount", bool: true },
  ]);
  const [deleteItem, setDeleteItem] = useState(false);
  const [customerDatas, setCustomerDatas] = useState([]);
  const [organisationData, setOrganisationData] = useState({});
  const [invoiceData, setInvoiceData] = useState([]);

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
    subscriptionFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      Name: "",
      Customer_Name: "",
      Plan_Name: "",
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
      Subscription_Name: filterState?.Name || "",
      Customer_Name: filterState?.Customer_Name || "",
      Plan_Name: filterState?.Plan_Name || "",
      Is_Deleted: false,
      fromdate: filterState?.Fromdate || "",
      todate: filterState?.Todate || "",
      page: page,
    };

    setLoading(true);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/subscriptionfilter/`, payload),
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
    GetSubscriptionRecords();
  };

  // Filter End ------------------------------------------------------------

  // organisation function
  const organization = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/useradmin/CRMorganizationCRUD/?id=${localStorage.getItem(
          "OrganizationId",
        )}`,
      ),
    );
    if (handledata) {
      setOrganisationData(handledata || {});
    }
    setLoading(false);
  };

  const getCustomerRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/AccountFullList/?Is_Deleted=False`),
    );
    if (handledata) {
      setCustomerDatas(handledata || []);
    }
    setLoading(false);
  };

  const getInvoiceRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/InvoiceFullList/?Is_Deleted=False`),
    );
    if (handledata) {
      setInvoiceData(handledata || []);
    }
    setLoading(false);
  };

  // generateInvoice function
  const generateInvoice = async (inv) => {
    let payload = {
      Invoice_Id: "",
      Subscription_Id: inv?.id,
      Customer_Id: inv?.Customer_Id?.id,
      InvoiceAmount: inv?.UnitPrice,
      TaxAmount: inv?.TaxAmount,
      NetAmount: inv?.SuscriptionAmount,
      InvoiceFor: "invoice",
      Invoice_Code: "invoice",
      Created_Date: new Date().toISOString(),
      Updated_Date: new Date().toISOString(),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    const handledata = await handleError(
      axiosInstance.post(`/superadmin/Invoice/`, payload),
    );
    if (handledata) {
      toast.success("Invoice is Created successfully");
      getInvoiceRecords();
    }
    setLoading(false);
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
      <li><strong>Total Amount:</strong> ₹${sharingData?.NetAmount}</li>
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
        mailsubject: `Subscription ${sharingData?.id}`,
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
      Customer_Id: data?.Customer_Id,
      ...invoicedata,
    };
    seteditdatas(sharingData);
    // Use a small timeout to ensure the hidden component has updated with new editdatas
    setTimeout(() => {
      sendInvoiceMail(sharingData);
    }, 100);
  };

  useEffect(() => {
    getCustomerRecords();
    organization();
    getInvoiceRecords();
    GetMySubscriptionRecords();
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = () => {
    setCreateSubcriprion(true);
    setListSubscription(false);
  };
  const handleEditSubscription = (data) => {
    console.log("data", data);
    seteditdatas(data);
    setEditSubscription(true);
    setListSubscription(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // code for settings open
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

  const GetSubscriptionRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/subscriptionlist/?page=${page}`),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || []);
    }
    setLoading(false);
  };

  const GetMySubscriptionRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/subscriptionmylist/?page=${page}&Created_By=${localStorage.getItem(
          "UserId",
        )}`,
      ),
    );

    if (handledata) {
      setMydatas(handledata?.results || []);
      setMyCount(handledata?.count || []);
    }
    setLoading(false);
  };

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/subscriptionsearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        setdatas(handledata?.results || []);
        setCount(handledata?.count || []);
      }
      setLoading(false);
    }, 500),
    [page],
  );

  const DeleteSubscription = async (data) => {
    // console.log(data)
    if (
      data.Subscription_Id === "" ||
      data.Subscription_Id === undefined ||
      data.Subscription_Id === null
    ) {
      toast.error("Invalid Datas");
    } else {
      const handledata = await handleError(
        axiosInstance.delete(`/superadmin/subscription/?id=${data.id}`),
      );

      if (handledata) {
        GetSubscriptionRecords();
        toast.success("Deleted Sucessfully");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

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
      GetSubscriptionRecords();
    } else if (tabValue === 1) {
      GetMySubscriptionRecords();
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
                      Subscription List
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
                              Subscription Name
                            </Typography>
                            <TextField
                              type="text"
                              className={`col-12 input-box2`}
                              autoComplete="off"
                              placeholder="Subscription Name"
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
                              Plan Name
                            </Typography>
                            <TextField
                              type="text"
                              className={`col-12 input-box2`}
                              autoComplete="off"
                              placeholder="Plan Name"
                              name="Plan_Name"
                              value={filterState?.Plan_Name}
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
                      sx={{ mt: 2, mb: 2, minWidth: { xs: "auto", sm: 1200 } }}
                    >
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
                              let invoicedata =
                                invoiceData?.find(
                                  (item) =>
                                    item?.Subscription_Id?.id === data?.id,
                                ) || {};

                              console.log(invoiceData);

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
                                      data-title="Subscription Id"
                                      align="left"
                                    >
                                      {data?.Subscription_Id}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[2]?.bool && (
                                    <CRMTableCell
                                      data-title="Subscription Name"
                                      align="left"
                                    >
                                      {data?.Subscription_Name}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[3]?.bool && (
                                    <CRMTableCell
                                      data-title="Subscription Date"
                                      align="left"
                                    >
                                      {data?.SubscriptionDate?.split("T")[0]}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Customer Name"
                                      align="left"
                                    >
                                      {data?.Customer_Name}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[5]?.bool && (
                                    <CRMTableCell
                                      data-title="Plan Name"
                                      align="left"
                                    >
                                      {data?.Plan_Name ||
                                        data?.Plan_Id?.Plan_Name}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[6]?.bool && (
                                    <CRMTableCell
                                      data-title="No of Users"
                                      align="left"
                                    >
                                      {data?.Base_Users}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[7]?.bool && (
                                    <CRMTableCell
                                      data-title="Price"
                                      align="left"
                                    >
                                      {toLocaleCurrency(data?.UnitPrice)}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[8]?.bool && (
                                    <CRMTableCell
                                      data-title="Tax Amount"
                                      align="left"
                                    >
                                      {toLocaleCurrency(data?.TaxAmount)}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[9]?.bool && (
                                    <CRMTableCell
                                      data-title="Amount"
                                      align="left"
                                    >
                                      {toLocaleCurrency(
                                        data?.SuscriptionAmount,
                                      )}
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
                                        minWidth: "150px",
                                        justifyContent: {
                                          xs: "flex-end",
                                          sm: "center",
                                        },
                                      },
                                    ]}
                                  >
                                    {Object.keys(invoicedata)?.length === 0 ? (
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
                                              Customer_Id: data?.Customer_Id,
                                              ...invoicedata,
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

                                    <CustomTooltip
                                      value="Share Invoice"
                                      type="children"
                                    >
                                      <IconButton
                                        size="small"
                                        disabled={
                                          Object.keys(invoicedata)?.length ===
                                            0 || isSharing
                                        }
                                        onClick={() =>
                                          handleShareClick(data, invoicedata)
                                        }
                                      >
                                        <MdShare
                                          color={
                                            Object.keys(invoicedata)?.length !==
                                            0
                                              ? Colors?.Mblue
                                              : "gray"
                                          }
                                          style={{ fontSize: 16 }}
                                        />
                                      </IconButton>
                                    </CustomTooltip>

                                    <EditIcon
                                      disabled={Object.keys(invoicedata)?.length !== 0}
                                      color={Object.keys(invoicedata)?.length !== 0 ? "gray" : "#c1ccf4"}
                                      onClick={(e) => {
                                        handleEditSubscription(data);
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
                          DeleteSubscription(deleteItem);
                        }}
                        onClickNo={() => setDeleteItem(false)}
                      />
                    </Table>

                    {datas?.length === 0 && (
                      <NoRecordsPage title={"Subscription"} />
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

          <CreateSubscriptionDialogs
            createSubcriprion={createSubcriprion}
            setCreateSubcriprion={setCreateSubcriprion}
            setListSubscription={setListSubscription}
            GetSubscriptionRecords={GetSubscriptionRecords}
            editSubscription={editSubscription}
            setEditSubscription={setEditSubscription}
            editdatas={editdatas}
            openInvoice={openInvoice}
            setOpenInvoice={setOpenInvoice}
            organisationData={organisationData}
            reportTemplateRef={reportTemplateRef}
            showGenerateInvoice={showGenerateInvoice}
            setShowGenerateInvoice={setShowGenerateInvoice}
            generateInvoice={generateInvoice}
          />
        </Div>
      </JumboContentLayoutMain>

      {/* Hidden Invoice for background processing */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <SubscriptionInvoice
          organisationData={organisationData}
          reportTemplateRef={hiddenReportRef}
          datas={editdatas}
          Buttons={false}
        />
      </div>

      <ToastContainer />
    </>
  );
};

export default SubscriptionList;
