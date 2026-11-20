import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  Pagination,
  Box,
  Popover,
  Autocomplete,
  DialogContent,
  Button,
  TableRow,
} from "@mui/material";
import React, { useReducer, useRef, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
} from "react-icons/md";
import { RiAiGenerate, RiMailSendFill, RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import {
  Colors,
  ComponentHeading,
  componentTitle,
  CRMTableHead,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  generateRandomColor,
  StyledTab,
  StyledTabs,
  ButtonStyle,
} from "../../widgets/CRMStyles";
import SearchBar from "../../widgets/SearchField";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import {
  axiosInstance,
  Cancelbutton,
  CustomButton,
  CustomTooltip,
  DateFormatter,
  DialogBox,
  Dragabledialog,
  errorFilter,
  NoRecordsPage,
  toLocaleCurrency,
  CRMCustomLoader,
} from "app/pages/widgets/StylesComponents";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  invoiceFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import { GrPowerReset } from "react-icons/gr";
import { IoMdPrint } from "react-icons/io";
import { AutoHeight } from "app/redux/auth/localStorage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import SubscriptionInvoice from "../subscription/SubscriptionInvoice";
import CreatePayments from "../payments/CreatePayments";
import { handleError } from "app/pages/components/ErrorHandler/handleError";

const InvoiceList = ({ scrollHeight }) => {
  const [datas, setdatas] = useState([]);
  const [mydatas, setMydatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);

  const [openInvoice, setOpenInvoice] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [customerDatas, setCustomerDatas] = useState([]);

  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [createInvoice, setCreateInvoice] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const [showcustomername, setshowcustomername] = useState(true);
  const [showinvoiceno, setshowinvoiceno] = useState(true);
  const [showinvoicedate, setshowinvoicedate] = useState(true);
  const [showinvoiceamount, setshowinvoiceamount] = useState(true);
  const [showstatus, setshowstatus] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const reportTemplateRef = useRef(null);
  const hiddenReportRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pdfname, setpdfname] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hiddenInvoiceData, setHiddenInvoiceData] = useState({});

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Invoice_Id", label: "Invoice Id", bool: true },
    { sort: "Invoice_Date", label: "Invoice Date", bool: true },
    { sort: "InvoiceAmount", label: "Invoice Amount", bool: true },
    { sort: "TaxAmount", label: "Tax Amount", bool: true },
    { sort: "NetAmount", label: "Net Amount", bool: true },
    { sort: "Is_Archived", label: "Payment Status", bool: true },
    // { sort: "Tax_Amount", label: "Tax Amount", bool: true },
    // { sort: "SuscriptionAmount", label: "Amount", bool: true },
  ]);

  // API Headars
  const token = localStorage.getItem("accesstoken");
  const UserId = localStorage.getItem("UserId");
  const item = "crmuseradmin1";

  const header = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [myCount, setMyCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    invoiceFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      InvoiceAmount: "",
      TaxAmount: "",
      NetAmount: "",
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
      InvoiceAmount: filterState?.InvoiceAmount || 0,
      TaxAmount: filterState?.TaxAmount || 0,
      NetAmount: filterState?.NetAmount || 0,
      page: page,
    };

    setLoading(true);
    const handledata = await handleError(
      axiosInstance.post(`/superadmin/InvoiceDetailsAdditional/`, payload),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const RefreshData = () => {
    setShowFilter(null);
    const changed = tabValue !== 0 || page !== 1 || searchFiled !== "";
    resetFilter();
    setPage(1);
    setSearchFiled("");
    setTabValue(0);
    if (!changed) getInvoiceRecords();
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

  const fetchSubscriptions = async () => {
    setLoadingSubscriptions(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/subscriptionlist/`),
    );
    if (handledata) {
      setSubscriptions(handledata?.results || []);
    }
    setLoadingSubscriptions(false);
  };

  const generateInvoice = async (subData) => {
    let payload = {
      Customer_Id: subData?.Customer_Id?.id || subData?.Customer_Id,
      Subscription_Id: subData?.id,
      Invoice_Date: new Date().toISOString().split("T")[0],
      InvoiceAmount: subData?.SuscriptionAmount,
      TaxAmount: subData?.TaxAmount,
      NetAmount: subData?.SuscriptionAmount + subData?.TaxAmount,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: UserId,
      Updated_By: UserId,
    };

    const res = await handleError(
      axiosInstance.post(`/superadmin/Invoice/`, payload),
    );
    if (res) {
      toast.success("Invoice generated successfully");
      setCreateInvoice(false);
      getInvoiceRecords();
    }
  };

  useEffect(() => {
    if (createInvoice) {
      fetchSubscriptions();
    }
  }, [createInvoice]);

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

  const getInvoiceRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/InvoiceDetailsAdditional/?Is_Deleted=False&page=${page}`,
      ),
    );

    if (handledata) {
      setdatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  const getMyInvoiceRecords = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/Invoicemylist/?page=${page}&Created_By=${localStorage.getItem(
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
    try {
      const payload = {
        Created_By: parseInt(localStorage.getItem("UserId")),
        To: sharingData?.Organization_Id?.Organization_Mail || sharingData?.organization?.Organization_Mail || sharingData?.Customer_Id?.Mail,
        mailsubject: `Invoice ${sharingData?.Invoice_Id}`,
        Body: await mailBodyContent(PDF_URL_Res, sharingData),
        filename: generateRandomColor() + PDF_URL_Res?.FileName,
      };

      const response = await handleError(
        axiosInstance.post(`/superadmin/QuotationMailSending/`, payload)
      );

      if (response) {
        toast.success("Mail Sent Successfully");
      }
    } catch (error) {
      console.error("An error occurred while sending the email:", error);
      toast.error(`${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const sendInvoiceMail = async (sharingData) => {
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

      const payload = {
        File: base64Data,
        FileName: customFilename,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Urls: "null",
        Description: "Invoice File",
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };

      const response = await handleError(
        axiosInstance.post(`/superadmin/UserFilesandUrlsCRUD/`, payload)
      );

      if (response) {
        await MailSendFun(response, sharingData);
      } else {
        setIsSending(false);
      }
    } catch (error) {
      console.error("An error occurred while sending the email:", error);
      toast.error(`${error}`);
      setIsSending(false);
    }
  };

  const handleSendInvoiceClick = async (item) => {
    setLoading(true);
    setIsSending(true);
    toast.info("Preparing invoice for sending...");
    
    // Fetch full invoice list to get expanded data
    const invoiceFullList = await handleError(
      axiosInstance.get(`/superadmin/InvoiceFullList/?Is_Deleted=False`)
    );
    
    let fullInvoiceData = item;
    const list = invoiceFullList?.results || invoiceFullList;
    if (Array.isArray(list)) {
       const found = list.find((i) => i.id === item.id);
       if (found) {
         fullInvoiceData = found;
       }
    }

    const orgData = await handleError(
      axiosInstance.get(
        `/useradmin/CRMorganizationCRUD/?id=${localStorage.getItem(
          "OrganizationId",
        )}`,
      ),
    );

    const sharingData = {
      type: "send",
      organization: orgData,
      ...fullInvoiceData,
    };

    setHiddenInvoiceData(sharingData);

    setTimeout(() => {
      sendInvoiceMail(sharingData);
    }, 500);
    setLoading(false);
  };

  const GetSubscriptionRecords = async (item, type) => {
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/subscriptionlist/?page=${page}`),
    );

    if (handledata) {
      let sub = handledata?.results?.find(
        (i) => i?.id == (item?.Subscription_Id?.id || item?.Subscription_Id),
      );
      organization(sub, item, type);
    }
  };

  const organization = async (sub, item, type) => {
    const handledata = await handleError(
      axiosInstance.get(
        `/useradmin/CRMorganizationCRUD/?id=${localStorage.getItem(
          "OrganizationId",
        )}`,
      ),
    );

    if (handledata) {
      setOpenInvoice({
        type: type,
        Customer_Id: sub?.Customer_Id,
        organization: handledata,
        ...item,
      });
    }
  };

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.put(`/superadmin/InvoiceDetailsAdditional/`, {
          search: searchstring,
          Is_Deleted: false,
          page,
        }),
      );

      if (handledata) {
        setdatas(handledata?.results || []);
        setCount(handledata?.count || 0);
      }
      setLoading(false);
    }, 500),
    [page],
  );

  useEffect(() => {
    const hasFilter = Object.values(filterState)?.some((state) => Boolean(state));
    
    if (hasFilter && !Boolean(searchFiled) && tabValue === 3) {
      filterData();
    } else if (tabValue === 0) {
      getInvoiceRecords();
    } else if (tabValue === 1) {
      getMyInvoiceRecords();
    } else if (tabValue === 2) {
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue]);

  useEffect(() => {
    getMyInvoiceRecords();
  }, []);

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
                    Invoice List
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
                            resetFilter();
                            setPage(1);
                            setSearchFiled("");
                            setTabValue(newValue);
                            console.log("newValue : ", newValue);
                          }}
                          aria-label="ant example"
                        >
                          <StyledTab label={`(${count}) All List`} />
                          <StyledTab label={`(${myCount}) My List`} />
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
                            Invoice Amount
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder=" Invoice Amount"
                            name="InvoiceAmount"
                            inputProps={{ min: 0 }}
                            value={filterState?.InvoiceAmount}
                            onChange={handleFilterNameChange}
                            id="createdDate"
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Tax Amount
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Tax Amount"
                            name="TaxAmount"
                            inputProps={{ min: 0 }}
                            value={filterState?.TaxAmount}
                            onChange={handleFilterNameChange}
                            id="createdDate"
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Net Amount
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Net Amount"
                            name="NetAmount"
                            inputProps={{ min: 0 }}
                            value={filterState?.NetAmount}
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
                          onClick={() => {
                            const changed = tabValue !== 3 || page !== 1 || searchFiled !== "";
                            setPage(1);
                            setSearchFiled("");
                            setShowFilter(false);
                            setTabValue(3);
                            if (!changed) filterData();
                          }}
                          type="submit"
                          label="Apply"
                          Icon="filterIcon"
                        />
                      </Div>
                    </Box>
                  </Popover>

                  <Grid item xs={12} md={6}>
                    <Div
                      sx={[DisplayFlex, { justifyContent: "right", gap: 2 }]}
                    >
                      <SearchBar
                        width={"250px !important"}
                        border={"1px solid lightgray"}
                        value={searchFiled}
                        SearchData={(e) => {
                          setSearchFiled(e.target.value);
                          setPage(1);
                          if (Boolean(e.target.value)) {
                            resetFilter();
                            setTabValue(2);
                          } else {
                            setTabValue(0);
                          }
                        }}
                      />
                      <CustomButton
                        onClick={() => setCreateInvoice(true)}
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
                    {(tabValue !== 1 ? datas : mydatas)?.length > 0 && (
                      <TableBody sx={{ mt: 2 }}>
                        {(tabValue !== 1 ? datas : mydatas)?.map(
                          (data, index) => {
                            return (
                              <CRMTableRow key={index}>
                                {columnMenuItems[0]?.bool && (
                                  <CRMTableCell data-title="Date" align="left">
                                    <DateFormatter
                                      date={data?.Updated_Date?.split("T")[0]}
                                    />
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[1]?.bool && (
                                  <CRMTableCell
                                    data-title="Invoice Id"
                                    align="left"
                                  >
                                    {data?.Invoice_Id}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[2]?.bool && (
                                  <CRMTableCell
                                    data-title="Invoice Date"
                                    align="left"
                                  >
                                    {data?.Invoice_Date?.split("T")[0]}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[3]?.bool && (
                                  <CRMTableCell
                                    data-title="Invoice Amount"
                                    align="left"
                                  >
                                    {toLocaleCurrency(data?.InvoiceAmount || 0)}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[4]?.bool && (
                                  <CRMTableCell
                                    data-title="Tax Amount"
                                    align="left"
                                  >
                                    {toLocaleCurrency(data?.TaxAmount || 0)}
                                  </CRMTableCell>
                                )}
                                {columnMenuItems[5]?.bool && (
                                  <CRMTableCell
                                    data-title="Net Amount"
                                    align="left"
                                  >
                                    {toLocaleCurrency(data?.NetAmount || 0)}
                                  </CRMTableCell>
                                )}
                                {columnMenuItems[6]?.bool && (
                                  <CRMTableCell
                                    data-title="Payment Status"
                                    align="left"
                                    style={{
                                      color: !data?.Is_Archived
                                        ? "orangered"
                                        : "green",
                                    }}
                                  >
                                    {!data?.Is_Archived ? "Unpaid" : "Paid"}
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
                                      justifyContent: {
                                        xs: "flex-end",
                                        sm: "center",
                                      },
                                    },
                                  ]}
                                >
                                  <CustomTooltip
                                    value="View Invoice"
                                    type="children"
                                  >
                                    <IconButton
                                      disabled={loading}
                                      size="small"
                                      onClick={() => {
                                        GetSubscriptionRecords(data, "view");
                                      }}
                                    >
                                      <FaFileInvoice
                                        style={{
                                          fontSize: 16,
                                          color: !loading
                                            ? Colors?.Mblue
                                            : "gray",
                                        }}
                                      />
                                    </IconButton>
                                  </CustomTooltip>

                                  <CustomTooltip
                                    value="Invoice Send"
                                    type="children"
                                  >
                                    <IconButton
                                      disabled={loading || isSending}
                                      size="small"
                                      onClick={() => {
                                        handleSendInvoiceClick(data);
                                      }}
                                    >
                                      <RiMailSendFill
                                        color={
                                          !(loading || isSending)
                                            ? Colors?.Mblue
                                            : "gray"
                                        }
                                        style={{ fontSize: 16 }}
                                      />
                                    </IconButton>
                                  </CustomTooltip>

                                  <CustomTooltip
                                    value="Create Payment"
                                    type="children"
                                  >
                                    <IconButton
                                      disabled={loading || data?.Is_Archived}
                                      size="small"
                                      onClick={() => {
                                        setOpenCreateModal(data);
                                      }}
                                    >
                                      <MdOutlinePayment
                                        color={
                                          !(loading || data?.Is_Archived) ? Colors?.Mblue : "gray"
                                        }
                                        style={{ fontSize: 16 }}
                                      />
                                    </IconButton>
                                  </CustomTooltip>
                                </CRMTableCell>
                              </CRMTableRow>
                            );
                          },
                        )}
                      </TableBody>
                    )}
                  </Table>

                  {datas?.length === 0 && <NoRecordsPage title={"Invoice"} />}
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

        {/* Generate Invoice Dialog */}
        <Dragabledialog
          maxWidth="lg"
          open={createInvoice}
          title="Select Subscription to Generate Invoice"
          onClose={() => setCreateInvoice(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <JumboScrollbar autoHeight={true} autoHeightMin={400}>
              <Table stickyHeader>
                <TableHead>
                  <CRMTableRow>
                    <CRMTableCell>Customer Name</CRMTableCell>
                    <CRMTableCell>Plan</CRMTableCell>
                    <CRMTableCell>Amount</CRMTableCell>
                    <CRMTableCell align="center">Action</CRMTableCell>
                  </CRMTableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((sub, idx) => (
                    <CRMTableRow key={idx}>
                      <CRMTableCell>
                        {sub.Customer_Name || sub.Customer_Id_name || "N/A"}
                      </CRMTableCell>
                      <CRMTableCell>
                        {sub.Plan_Name || sub.Plan_Id_name || "N/A"}
                      </CRMTableCell>
                      <CRMTableCell>
                        {toLocaleCurrency(sub.SuscriptionAmount)}
                      </CRMTableCell>
                      <CRMTableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => generateInvoice(sub)}
                          sx={[ButtonStyle, DialogBoxSaveButton]}
                        >
                          Generate Invoice
                        </Button>
                      </CRMTableCell>
                    </CRMTableRow>
                  ))}
                </TableBody>
              </Table>
              {subscriptions.length === 0 && !loadingSubscriptions && (
                <NoRecordsPage title="Subscriptions for Invoice Generation" />
              )}
            </JumboScrollbar>
          </DialogContent>
          <Div
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 2,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setCreateInvoice(false)}
              sx={ButtonStyle}
            >
              Cancel
            </Button>
          </Div>
        </Dragabledialog>

        {/* Create Lookup modal */}
        <Dragabledialog
          maxWidth="lg"
          open={openCreateModal}
          title={
            openCreateModal?.type === "put" ? "Edit Payment" : "Create Payment"
          }
        >
          <DialogContent sx={{ p: 1 }}>
            <CreatePayments
              setOpen={setOpenCreateModal}
              type={"invoice"}
              datas={openCreateModal}
              GetRecords={getInvoiceRecords}
            />
          </DialogContent>
        </Dragabledialog>

        <Dragabledialog
          maxWidth="lg"
          open={openInvoice}
          title="Invoice Preview"
          onClose={() => setOpenInvoice(false)}
        >
          <SubscriptionInvoice
            reportTemplateRef={reportTemplateRef}
            organisationData={openInvoice?.organization}
            Buttons={openInvoice?.type === "view" ? false : true}
            openInvoice={openInvoice}
            setOpenInvoice={setOpenInvoice}
            datas={openInvoice}
          />
        </Dragabledialog>
      </Div>
    </JumboContentLayoutMain>

      {/* Hidden Invoice for background processing */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <SubscriptionInvoice
          organisationData={hiddenInvoiceData?.organization}
          reportTemplateRef={hiddenReportRef}
          datas={hiddenInvoiceData}
          Buttons={false}
        />
      </div>
    </>
  );
};

export default InvoiceList;
