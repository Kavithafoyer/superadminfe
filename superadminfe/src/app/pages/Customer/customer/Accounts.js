import {
  Autocomplete,
  IconButton,
  List,
  Grid,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  Popover,
  ListItemButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  ListItemIcon,
  ListItemText,
  Menu,
  DialogContent,
  FormControl,
  Skeleton,
  Table,
  TableBody,
  Pagination,
  alpha,
  Paper,
  Button,
} from "@mui/material";
import { debounce } from "lodash";
import moment from "moment";
import {
  deletedWarnigMsg,
  dialogFontSize,
  input_label,
} from "app/pages/widgets/CRMStyles";
import React, { useCallback, useEffect } from "react";
import * as yup from "yup";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiFilterAlt, BiSort, BiSortAlt2 } from "react-icons/bi";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import {
  CRMTableHead,
  Colors,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  componentTitle,
} from "app/pages/widgets/CRMStyles";
import { GrPowerReset } from "react-icons/gr";
import {
  AvatarCircle,
  Cancelbutton,
  DialogBox,
  CustomButton,
  Div,
  CustomIcons,
  SelectDropdown,
  avatarColorFun,
  Dragabledialog,
  Customgrid,
  formatDate,
  fetchTransactionSeries,
  CRMDateField,
  CRMCustomLoader,
  CRMCustomScrollCard,
  DateFormatter,
  NoRecordsPage,
  CustomTooltip,
} from "app/pages/widgets/StylesComponents";
import { useQuery, useQueryClient } from "react-query";
import { TiEdit } from "react-icons/ti";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { FaGear } from "react-icons/fa6";
import { RiMailSendLine } from "react-icons/ri";
import { MdOutlineNoteAdd } from "react-icons/md";
import { TbActivity } from "react-icons/tb";
import TodayIcon from "@mui/icons-material/Today";
import FilterListIcon from "@mui/icons-material/FilterList";
import ComposeEmail from "app/pages/contacts/extra-components/ComposeEmail";
import ActivityModel from "app/pages/contacts/extra-components/ActivityModel";
import NotesModel from "app/pages/contacts/extra-components/NotesModel";
import { OrganizationId, UserId } from "app/redux/auth/localStorage";
import SearchBar from "app/pages/widgets/SearchField";
import CreateAccountForm from "./CreateAccountForm";
import EditAccountForm from "./EditAccountForm";
import { BiSolidDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { AutoHeight } from "app/redux/auth/localStorage";
import AppointmentModel from "app/pages/contacts/extra-components/AppointmentModel";

const AccountSales = () => {
  const [openNotes, setOpenNotes] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openSendMail, setOpenSendMail] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [update, setUpdate] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [fadeEdit, setFadeEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [tabValue, setTabValue] = useState(
    parseInt(localStorage.getItem("AccountTabValue")) || 0,
  );

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  const [showAccounts, setShowAccounts] = useState("accounts");
  const [Account_Id, setAccount_Id] = useState("");

  const pageRef = useRef(page);

  //create
  const [openAccounts, setOpenAccounts] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [accId, setaccId] = useState("");
  const [name1, setName1] = useState("");
  const [accountOwner1, setAccountOwner1] = useState("");
  const [landLine1, setLandLine1] = useState("");
  const [fax, setFax] = useState("");
  const [turnOver, setTurnOver] = useState("");
  const [employees, setEmployees] = useState("");
  const [code1, setCode1] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [mail1, setMail1] = useState("");
  const [orgname1, setOrgname1] = useState("");
  const [reasonChurn, setreasonChurn] = useState("");
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [selectedState1, setSelectedState1] = useState("");
  const [industry1, setIndustry1] = useState("");
  const [mobilenumber1, setMobilenumber1] = useState("");
  const [selectedCity1, setSelectedCity1] = useState("");
  const [pincode1, setPincode1] = useState("");
  const [areaName1, setAreaName1] = useState("");
  const [streetName1, setStreetName1] = useState("");
  const [doorNo1, setDoorNo1] = useState("");
  const [PaymentTerms, setPaymentTerms] = useState("");

  const [datas, setDatas] = useState([]);
  const [isSortName, setIsSortName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [Loading, setLoading] = useState(false);
  const loadingRef = useRef(Loading);

  const [save, setSave] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [openeditAccount, setopeneditAccount] = useState(null);

  const [DeleteDatas, setDeleteDatas] = useState([]);
  const [listStatus, setListStatus] = useState(false);
  const [countryLists, setCountryLists] = useState([]);
  const [stateLists, setStateLists] = useState([]);
  const [cityLists, setCityLists] = useState([]);
  const [status, setstatus] = useState("Generate Invoice");

  // Edit states removed (moved to EditAccountForm)
  const [duration, setDuration] = useState(0);
  const [busy, setBusy] = useState("");
  const [anchorElSort, setAnchorElSort] = useState(null);

  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Organization_Name", label: "Company Name", bool: true },
    { sort: "Account_Id", label: "Account Id", bool: true },
    { sort: "Phone_Number", label: "Mobile Number", bool: true },
    { sort: "Created_Date", label: "Date", bool: true },
    { sort: "Created_Date", label: "Created Date", bool: true },
    { sort: "Updated_Date", label: "Updated Date", bool: false },
    { sort: "Mail", label: "E-mail", bool: true },
    { sort: "Turn_Over", label: "Turn Over", bool: true },
    { sort: "Industry", label: "Industry Type", bool: false },
    { sort: "Account_Owner", label: "Account Owner", bool: false },
    { sort: "City", label: "City", bool: false },
    { sort: "State", label: "State", bool: false },
    { sort: "Country", label: "Country", bool: true },
  ]);

  const matches = useMediaQuery("(min-width:1200px)");
  const navigate = useNavigate();

  const [totalcount, settotalcount] = useState();
  const totalPages = Math?.ceil(count / 10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    pageRef.current = newPage;
    tabValue == 0 ? getAccountlist(newPage) : getMyAccountlist(newPage);
  };

  // sorting functions
  const sortData = (e, value) => {
    const sortedData = [...datas]?.sort((a, b) =>
      value === "A-Z"
        ? a?.Contact_Name?.localeCompare(b?.Contact_Name)
        : b?.Contact_Name?.localeCompare(a?.Contact_Name),
    );
    setDatas(sortedData);
    setIsSortName(value);
  };

  const handleClickOverviewNotification = (data) => {
    navigate(`/app/accounts/overview/${data?.id}`);
    setShowAccounts(false);
  };

  const handleClickAction = (event, data) => {
    setUpdate(data);
    setShowAccounts("edit");
  };

  const ClearData = () => {
    // Redundant now
  };

  // get products
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const dialogFilter = (event) => {
    setShowFilter(event.currentTarget);
  };

  // filter functionality
  const [indus, setIndus] = useState("");

  const [fromdate, setFromdate] = useState("");
  const [todate, setToDate] = useState("");
  const [OrganizationName, setOrganizationName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [accountOwner, setAccountOwner] = useState("");

  const RefreshData = () => {
    setOrganizationName("");
    setFromdate("");
    setToDate("");
    setIndus("");
    setPhoneNumber("");
    setAddress("");
    setWebsite("");
    setAccountOwner("");
    getAccountlist(page);
    setShowFilter(false);
  };

  const deleteItem = async () => {
    try {
      await axios
        .delete(`${BASE_URL}/superadmin/AccountCRUD/?id=${update?.id}`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          toast.success("Deleted Sucessfully", {
            position: "top-right",
            autoClose: 100,
          });
          setDeleteDatas([]);
          setListStatus(!listStatus);
          setPage(1);
          getAccountlist(1);
        });
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response?.data?.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      } else {
        toast.error(`${error}`, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  const getCountryLists = async () => {
    await axios
      .get(`https://countriesnow.space/api/v0.1/countries`, {
        headers: {
          //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res?.data?.data);
        setCountryLists(res?.data?.data);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };


  const getAccountlist = async (pageNum = 1) => {
    console.log("getAccountlist", pageNum);

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/AccountAdditional/?Is_Deleted=False&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      console.log("AccountCRUD", response?.data);

      const newData = response?.data?.results || [];

      setDatas(newData);
      setCount(response?.data?.count);
    } catch (error) {
      const errorMessage =
        error.response?.data?.details ||
        error.message ||
        "Failed to fetch account list";
      console.error("getAccountlist Error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const getMyAccountlist = async (pageNum = 1) => {
    console.log("getMyAccountlist", pageNum);

    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/AccountMyAdditional/?Created_By=${UserId}&Is_Deleted=False&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      console.log("AccountCRUD", response?.data);

      const newData = response?.data?.results || [];

      setDatas(newData);
      setCount(response?.data?.count);
    } catch (error) {
      const errorMessage =
        error.response?.data?.details ||
        error.message ||
        "Failed to fetch my account list";
      console.error("getMyAccountlist Error:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${BASE_URL}/superadmin/AccountFilter/`, {
        params: {
          Account_Owner: accountOwner,
          Phone_Number: phoneNumber,
          Created_Date: fromdate,
          Industry: indus,
          Address: address,
          Website: website,
        },
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setDatas(response?.data);
      setCount(response?.data?.length);
      setShowFilter(false);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };




  // Search Functionality

  const SearchData = (e) => {
    Boolean(e.target.value !== "")
      ? handleSearch(e.target.value)
      : tabValue == 0
        ? getAccountlist(page)
        : getMyAccountlist(page);
  };

  const handleSearch = useCallback(
    debounce(async (search) => {
      await axios
        .get(`${BASE_URL}/superadmin/AccountSearch/?search=${search}`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          setDatas(res.data || []);
          setCount(res?.data?.length || 0);
        });
    }, 500),
    [],
  );


  const calllogs = () => {
    axios
      .get(
        `${BASE_URL}/superadmin/KnowlarityCallLogsCRUD/?start_Date=2020-04-16&end_Date=&UserId=${localStorage.getItem(
          "UserId",
        )}&Module=Account`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        console.log("calllogsresss", res.data);
        const mynumberList = res?.data?.filter((item) =>
          item.Agent_Number.includes(userDetails?.PhoneNo),
        );

        const lastIndexData = mynumberList[0];
        console.log("lastIndexData", mynumberList, lastIndexData);

        setDuration(lastIndexData?.Call_Duration);

        if (lastIndexData?.Agent_Number?.includes("User Disconnected")) {
          setstatus("User Disconnected");
        } else if (lastIndexData?.Agent_Number?.includes("Customer Missed")) {
          setstatus("Customer Missed");
        } else {
          setstatus("Connected");
        }
        setLoading(false);
        setAnchorEl(true);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.details ||
          error.message ||
          "Error fetching call logs";
        console.error("Call Logs Error:", errorMessage);
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    loadingRef.current = Loading;
  }, [Loading]);

  useEffect(() => {
    if (Loading) {
      const timer = setTimeout(() => {
        calllogs();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [Loading]);


  useEffect(() => {
    if (tabValue == 0) {
      getAccountlist(page);
    } else {
      getMyAccountlist(page);
    }
  }, [page, tabValue]);





  console.log("pagessss", page, datas);

  return (
    <>
      <Div>
        <JumboContentLayoutMain>
          <ToastContainer />
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: showAccounts === "accounts" ? "" : "none",
              }}
            >
              {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#333",
                    m: 0,
                  }}
                >
                  Account Directory
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#96a0b5",
                    mt: 0.5,
                  }}
                >
                  Manage and view details for all registered customer accounts
                </Typography>
              </Box>
            </Box> */}

              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  bgcolor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #f0f0f0",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    onClick={dialogFilter}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      color: "#555",
                      p: 1,
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <BiFilterAlt size={20} />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#96a0b5",
                      ml: 1,
                    }}
                  >
                    ( {count} ) Accounts
                  </Typography>
                </Box>

                {/* Filter popover  */}

                <Popover
                  open={Boolean(showFilter)}
                  anchorEl={showFilter}
                  onClose={() => setShowFilter(null)}
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
                          Account Owner
                        </Typography>
                        <TextField
                          type="text"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Account Owner"
                          value={accountOwner}
                          onChange={(e) => {
                            setAccountOwner(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Phone Number
                        </Typography>
                        <TextField
                          type="text"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Phone Number"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Industry Type
                        </Typography>
                        <TextField
                          type="text"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Industry Type"
                          value={indus}
                          onChange={(e) => {
                            setIndus(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Created Date
                        </Typography>
                        <TextField
                          type="date"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Created Date"
                          id="fromdate"
                          name="fromdate"
                          value={fromdate}
                          onChange={(e) => setFromdate(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Address
                        </Typography>
                        <TextField
                          type="text"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Address"
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Website
                        </Typography>
                        <TextField
                          type="text"
                          className={`col-12 input-box2`}
                          autoComplete="off"
                          placeholder="Website"
                          value={website}
                          onChange={(e) => {
                            setWebsite(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                            gap: "10px",
                          }}
                        >
                          <Cancelbutton onClick={() => setShowFilter(null)} />
                          <CustomButton
                            onClick={filterSubmit}
                            label="Apply"
                            Icon="filterIcon"
                          />
                        </Div>
                      </Grid>
                    </Grid>
                  </Box>
                </Popover>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                  <SearchBar
                    SearchData={(e) => SearchData(e)}
                    width={"250px !important"}
                    color={"black"}
                    className=""
                  />

                  <CustomButton
                  Icon="createIcon"
                  label="Create"
                  onClick={() => setShowAccounts("create")}
                />

                  <IconButton
                    onClick={(e) => setAnchorElSort(e.currentTarget)}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      color: "#555",
                      p: 1,
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <FilterListIcon style={{ fontSize: 20 }} />
                  </IconButton>

                  <IconButton
                    onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      color: "#555",
                      p: 1,
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <FaGear style={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Paper>

              <Popover
                open={Boolean(anchorElSort)}
                anchorEl={anchorElSort}
                onClose={() => setAnchorElSort(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: "200px",
                  }}
                >
                  <SelectDropdown
                    className="search-select-border col-12"
                    value={
                      tabValue === 0 ? "All Accounts" : "My Accounts"
                    }
                    onChange={(e, value) => {
                      setPage(1);
                      const newVal = value === "All Accounts" ? 0 : 1;
                      setTabValue(newVal);
                      localStorage.setItem("AccountTabValue", newVal);
                      setAnchorElSort(null);
                    }}
                    options={["All Accounts", "My Accounts"]}
                  />
                  <SelectDropdown
                    className="search-select-border col-12"
                    defaultValue={"A-Z"}
                    onChange={(e, value) => {
                      sortData(e, value);
                      setAnchorElSort(null);
                    }}
                    options={["A-Z", "Z-A"]}
                  />
                </Box>
              </Popover>
              <Div id="list">
                <Div sx={{ mt: { xs: 0, lg: 1.5 } }}>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={AutoHeight(1.6)}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                  >
                    {Loading ? (
                      <Div sx={{ p: 2 }}>
                        {[1, 2, 3].map((cardIndex) => (
                          <Paper
                            key={cardIndex}
                            elevation={0}
                            sx={{
                              minHeight: "115px",
                              p: { xs: 2, md: 3 },
                              my: 2.5,
                              bgcolor: "#ffffff",
                              borderRadius: "12px",
                              border: "1px solid #f0f0f0",
                              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                            }}
                          >
                            <Grid container alignItems={"center"} spacing={3}>
                              <Grid item xs={12} md={1.5} lg={1} sx={{ display: "flex", justifyContent: "center" }}>
                                <Skeleton variant="circular" width={70} height={70} />
                              </Grid>
                              <Grid container spacing={2} item xs={12} md={10.5} lg={11}>
                                <Grid item xs={12}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Skeleton variant="text" width="180px" height="28px" sx={{ borderRadius: "4px" }} />
                                    <Box sx={{ display: "flex", gap: "8px" }}>
                                      <Skeleton variant="circular" width={28} height={28} />
                                      <Skeleton variant="circular" width={28} height={28} />
                                    </Box>
                                  </Box>
                                </Grid>
                                {[1, 2, 3, 4].map((colIndex) => (
                                  <Grid key={colIndex} item xs={12} sm={6} md={4} lg={3}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.5,
                                        p: 1.5,
                                        bgcolor: "#fafafa",
                                        borderRadius: "8px",
                                        border: "1px solid #f0f0f0",
                                      }}
                                    >
                                      <Skeleton variant="text" width="50%" height="15px" />
                                      <Skeleton variant="text" width="80%" height="20px" />
                                    </Box>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </Div>
                    ) : datas?.length > 0 ? (
                      <Div sx={{ p: 2 }}>
                        {datas?.map((data, index) => {
                          let image =
                            (BASE_URL +
                              data?.File?.split(
                                "https://backend.crmfarm.app",
                              )[1] ||
                              data?.File) ??
                            "";
                          return (
                            <Paper
                              key={index}
                              elevation={0}
                              onMouseOver={() => (setFadeEdit ? setFadeEdit(index) : {})}
                              onMouseLeave={() => (setFadeEdit ? setFadeEdit(null) : {})}
                              onClick={() => handleClickOverviewNotification(data)}
                              sx={{
                                minHeight: "115px",
                                p: { xs: 2, md: 3 },
                                my: 2.5,
                                bgcolor: "#ffffff",
                                borderRadius: "12px",
                                border: "1px solid #f0f0f0",
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.08)",
                                  borderColor: "#e0e6ed",
                                },
                              }}
                            >
                              <Grid
                                container
                                alignItems={"center"}
                                spacing={3}
                              >
                                <Grid item xs={12} md={1.5} lg={1} sx={{ display: "flex", justifyContent: "center" }}>
                                  <div>
                                    <AvatarCircle
                                      size="70px"
                                      fontSize="24px"
                                      bgColor={avatarColorFun(index)}
                                      title={data?.Account_Owner}
                                      image={
                                        Boolean(data?.File) ? image : false
                                      }
                                    />
                                  </div>
                                </Grid>

                                <Grid
                                  container
                                  spacing={2}
                                  item
                                  xs={12}
                                  md={10.5}
                                  lg={11}
                                >
                                  <Grid item xs={12}>
                                    <Box
                                      sx={[
                                        DisplayFlex,
                                        {
                                          justifyContent: "space-between",
                                          flexWrap: "wrap",
                                          gap: 1.5,
                                        },
                                      ]}
                                    >
                                      <Typography
                                        sx={[
                                          {
                                            fontSize: "18px",
                                            fontWeight: 700,
                                            color: Colors?.Mblue,
                                            "&:hover": {
                                              textDecoration: "underline",
                                            }
                                          },
                                        ]}
                                      >
                                        {data?.Account_Owner}
                                      </Typography>
                                      <Div sx={[DisplayFlex, { gap: "8px" }]}>
                                        <IconButton
                                          size="small"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleClickAction(event, data);
                                          }}
                                          sx={{
                                            bgcolor: alpha(Colors?.Mblue, 0.08),
                                            color: Colors?.Mblue,
                                            "&:hover": { bgcolor: alpha(Colors?.Mblue, 0.16) }
                                          }}
                                        >
                                          <TiEdit style={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setShowDelete(true);
                                            setUpdate(data);
                                          }}
                                          sx={{
                                            bgcolor: "rgba(255, 0, 0, 0.08)",
                                            color: "red",
                                            "&:hover": { bgcolor: "rgba(255, 0, 0, 0.16)" }
                                          }}
                                        >
                                          <MdDelete style={{ fontSize: 18 }} />
                                        </IconButton>
                                      </Div>
                                    </Box>
                                  </Grid>
                                  {columnMenuItems?.map(
                                    (item, subIdx) =>
                                      item?.bool && (
                                        <Grid key={subIdx} item xs={12} sm={6} md={4} lg={3}>
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 0.5,
                                              p: 1.5,
                                              bgcolor: "#fafafa",
                                              borderRadius: "8px",
                                              border: "1px solid #f0f0f0",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                color: "#96a0b5",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                              }}
                                            >
                                              {item?.label}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                color: "#333",
                                                wordBreak: "break-all",
                                              }}
                                            >
                                              {item?.label === "Date" ||
                                                item?.sort === "Created_Date" ||
                                                item?.sort === "Updated_Date" ? (
                                                <DateFormatter
                                                  date={
                                                    data[item?.sort]?.split(
                                                      "T",
                                                    )[0]
                                                  }
                                                />
                                              ) : item?.sort === "Turn_Over" ? (
                                                (data[
                                                  item?.sort
                                                ]?.toLocaleString() + ".00" ??
                                                  0.0)
                                              ) : (
                                                data[item?.sort] || "-"
                                              )}
                                            </Typography>
                                          </Box>
                                        </Grid>
                                      ),
                                  )}
                                </Grid>
                              </Grid>
                            </Paper>
                          );
                        })}
                      </Div>
                    ) : (
                      <NoRecordsPage title={"Account"} />
                    )}
                  </JumboScrollbar>
                </Div>
                {/* code for pagination */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#96a0b5" }}>
                    Showing page {page} of {totalPages || 1}
                  </Typography>
                  <Pagination
                    color="primary"
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    size="medium"
                    showFirstButton
                    showLastButton
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>
              </Div>
              {/* gear options */}
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(menuAnchorEl)}
                onClose={() => setMenuAnchorEl(null)}
                sx={{
                  mt: 5,
                  maxHeight: "300px",
                  scrollBehavior: "smooth",
                }}
              >
                <Typography sx={[dialogTitle, { p: 2, mb: -2 }]}>
                  Choose Fields
                </Typography>
                <FormGroup sx={{ p: 2 }}>
                  {columnMenuItems?.length > 0 &&
                    columnMenuItems?.map((column, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              color="info"
                              size="small"
                              checked={column?.bool}
                              onChange={(e) => {
                                let value = [...columnMenuItems];
                                value[index].bool = !column?.bool;
                                setColumnMenuItems(value);
                              }}
                            />
                          }
                          label={
                            <Typography sx={[FontStyle]}>
                              {column?.label}
                            </Typography>
                          }
                        />
                      );
                    })}
                </FormGroup>
              </Menu>
              {/* openAnchor Action popover */}
              <Popover
                id={Boolean(openAnchor) ? "simple-popover" : undefined}
                open={Boolean(openAnchor)}
                anchorEl={openAnchor}
                onClose={() => {
                  setOpenAnchor(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <List sx={{ p: 1 }}>
                  <ListItemButton
                    sx={[
                      FontStyle,
                      {
                        transform: {
                          xs: "translateX(0px)",
                          lg: "translateX(-50px)",
                        },
                        color: Colors?.Mblue,
                        display: {
                          lg: "none !important",
                          xs: "flex !important",
                        },
                      },
                    ]}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: "25px !important",
                        color: Colors?.Mblue,
                      }}
                    >
                      <TiEdit
                        style={{
                          fontSize: { xs: 18, lg: 25 },
                          fontWeight: 900,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={[FontStyle]}>Edit Contact</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setOpenNotes(true);
                      setOpenAnchor(false);
                    }}
                    sx={{ borderRadius: "5px" }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "25px !important", color: "" }}
                    >
                      <MdOutlineNoteAdd style={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={[FontStyle]}>Add Notes</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setOpenSendMail(true);
                      setOpenAnchor(false);
                    }}
                    sx={{ borderRadius: "5px" }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "25px !important", color: "" }}
                    >
                      <RiMailSendLine style={{ fontSize: 17 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={[FontStyle]}>Send Mail</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setOpenActivity(true);
                      setOpenAnchor(false);
                    }}
                    sx={{ borderRadius: "5px" }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "25px !important", color: "" }}
                    >
                      <TbActivity style={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={[FontStyle]}>Add Activity</Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setOpenAppointment(true);
                      setOpenAnchor(false);
                    }}
                    sx={{ borderRadius: "5px" }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "25px !important", color: "" }}
                    >
                      <TodayIcon sx={{ fontSize: 17 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={[FontStyle]}>
                          Add Appointment
                        </Typography>
                      }
                    />
                  </ListItemButton>

                  <ListItemButton
                    onClick={() => {
                      setShowDelete(true);
                      setOpenAnchor(false);
                    }}
                    sx={{ borderRadius: "5px" }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: "25px !important", color: "tomato" }}
                    >
                      {CustomIcons?.deleteIcon}
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={[FontStyle]}>Delete</Typography>}
                    />
                  </ListItemButton>
                </List>
              </Popover>
            </Box>
          </Box>

          {/* Create Accounts */}
          {Boolean(showAccounts === "create") && (
            <CreateAccountForm
              setSave={setSave}
              setShowAccounts={setShowAccounts}
              getAccountlist={getAccountlist}
            />
          )}

          {/* Edit Accounts */}
          {Boolean(showAccounts === "edit") && (
            <EditAccountForm
              accountData={update}
              setSave={setSave}
              setShowAccounts={setShowAccounts}
              getAccountlist={getAccountlist}
            />
          )}

          {/* Add Note Dialog Box */}
          <Dragabledialog
            maxWidth="sm"
            open={openNotes}
          // onClose={() => setOpenNotes(false)}
          >
            <NotesModel
              name={{ label: "Account Name", value: update?.Contact_Name }}
              endpoint={"AccountNotesCRUD"}
              historyEndpoint={{
                point: "AccountHistorycrud",
                payload: { Account_Id: update?.id },
              }}
              extraPayload={{ Account_Id: update?.id }}
              data={update}
              setOpenNotes={setOpenNotes}
              setOpen={setSave}
              getData={getAccountlist}
            />
          </Dragabledialog>

          {/* Add Activities Dialog Box */}
          <Dragabledialog
            maxWidth="lg"
            open={openActivity}
          // onClose={() => setOpenActivity(false)}
          >
            <ActivityModel
              name={{ label: "Account Name", value: update?.Contact_Name }}
              endpoint={"AccountActivitiesCRUD"}
              historyEndpoint={{
                point: "AccountHistorycrud",
                payload: { Account_Id: update?.id },
              }}
              extraPayload={{ Account_Id: update?.id }}
              data={update}
              setOpenActivity={setOpenActivity}
              setOpen={setSave}
              getData={getAccountlist}
            />
          </Dragabledialog>

          {/* Add Appointment Dialog Box */}
          <Dragabledialog
            maxWidth="lg"
            open={openAppointment}
          // onClose={() => setOpenAppointment(false)}
          >
            <AppointmentModel
              name={{ label: "Account Name", value: update?.Contact_Name }}
              historyEndpoint={{
                point: "AccountHistorycrud",
                payload: { Account_Id: update?.id },
              }}
              extraPayload={{ Account_Id: update?.id }}
              endpoint={"AccountMeetingCRUD"}
              data={update}
              setOpenAppointment={setOpenAppointment}
              setOpen={setSave}
              getData={getAccountlist}
            />
          </Dragabledialog>

          {/* Send Mail Dialog Box */}
          <Dragabledialog
            maxWidth="lg"
            open={openSendMail}
          // onClose={() => setOpenSendMail(false)}
          >
            <ComposeEmail
              extraPayload={{ Account_Id: update?.id }}
              endpoint={"AccountMailMasterCRUD"}
              data={update}
              setOpenSendMail={setOpenSendMail}
              setOpen={setSave}
              getData={getAccountlist}
            />
          </Dragabledialog>

          {/* delete popup */}

          <DialogBox
            open={showDelete}
            Content={deletedWarnigMsg}
            onClickNo={() => setShowDelete(false)}
            onClickYes={() => {
              // setSave(false);
              deleteItem();
              setShowDelete(false);
              // reset();
              setOpenAnchor(null);
            }}
          />

          {/* Close dialog box */}
          <DialogBox
            open={save}
            onClickNo={() => setSave(false)}
            onClickYes={() => {
              switch (save) {
                case "note":
                  setOpenNotes(false);
                  break;
                case "activity":
                  setOpenActivity(false);
                  break;
                case "appointment":
                  setOpenAppointment(false);
                  break;
                case "email":
                  setOpenSendMail(false);
                  break;
                case "accounts":
                  setShowAccounts("accounts");
                  break;
                case "create":
                  setShowAccounts("accounts");
                  break;
                case "edit":
                  setShowAccounts("accounts");
                  break;
              }
              setSave(false);
            }}
          />
        </JumboContentLayoutMain>
      </Div>
    </>
  );
};

export default AccountSales;
