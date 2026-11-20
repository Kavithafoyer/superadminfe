import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Select from "react-select";
import React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { filter } from "lodash";
import { useDropzone } from "react-dropzone";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactlessSharpIcon from "@mui/icons-material/ContactlessSharp";
import activityStreamList from "../../../mock/dailyActivityStream";
import allContacts from "../../../mock/allContactList";
import JumboScrollbar from "@jumbo/components/JumboScrollbar/JumboScrollbar";
import DndWrapper from "../../contacts/DndWrapper";

import CloseIcon from "@mui/icons-material/Close";

import { calendarData } from "app/pages/calendars/data";
import { momentLocalizer } from "react-big-calendar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  ReferenceLine,
  YAxis,
} from "recharts";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import * as yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import CallCenterEdit from "./CallCenterEdit";
import { Country, State, City } from "country-state-city";
import moment from "moment";
import { BASE_URL, BASE_URL1 } from "app/services/auth-services";
import {
  CallEnd,
  CancelOutlined,
  FiberManualRecord,
  Mic,
  MicOff,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import {
  ButtonStyle,
  CRMTableHead,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  StyledTab,
  StyledTabs,
  avatarColors,
  lightColors,
  customHeight,
  deletedWarnigMsg,
  dialogTitle,
  dialogheading,
  generateRandomColor,
  Colors,
  dialogFontSize,
  input_label,
  input_label1,
  LeadtoMove,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { PiWechatLogo } from "react-icons/pi";
import { RiCloseFill } from "react-icons/ri";
import { format, getISOWeek } from "date-fns";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import CRMCalendar from "./Calendar";
import CallContactList from "./CallContactList";
import { FaUser, FaUsers } from "react-icons/fa";
import { CustomWidthTooltip } from "app/pages/widgets/ToolTip";
import useResponsive from "app/pages/widgets/useResponsive";
// import { UserId } from "app/redux/auth/localStorage";
import ParticularCallHistory from "./ParticularCallHistory";
import { useQuery, useQueryClient } from "react-query";
import Counter, {
  AvatarCircle,
  Cancelbutton,
  CustomButton,
  CustomCKEditor,
  CustomIcon,
  Customgrid,
  DeletedIcon,
  DialogBox,
  Dragabledialog,
  NoRecordsPage,
  avatarColorFun,
  ckEditorOnchange,
  errorFilter,
  fetchTransactionSeries,
  formatDate,
} from "app/pages/widgets/StylesComponents";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import {
  FaArrowsDownToPeople,
  FaCalendarDays,
  FaPeopleRobbery,
} from "react-icons/fa6";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "./calendar.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const { events } = calendarData;
const today = new Date();
const currentYear = today.getFullYear();
const localizer = momentLocalizer(moment);

const TABLE_HEAD = [
  { id: "Contact", label: "Contact", alignRight: false },
  { id: "Activity", label: "Activity", alignRight: false },
  { id: "TimeFrom", label: "Time From", alignRight: false },
  { id: "TimeTo", label: "Time To", alignRight: false },
  { id: "ContactPerson", label: "Contact Person", alignRight: false },
  { id: "Receiver", label: "Receiver", alignRight: false },
  { id: "Status", label: "Status", alignRight: false },
  { id: "NextDate", label: "Next Date", alignRight: false },
];

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_activityStream) =>
        _activityStream.contactPerson
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const contacts = [
  {
    industry_type: "Product Bsaed",
  },
  {
    industry_type: "Service Bsaed",
  },
];

const CallCenterLeftCardLists = ({ scrollHeight }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [page1, setPage1] = useState(1);
  const count1 = 6;

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openUpload, setOpenUpload] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [openAddTodayCall, setOpenAddTodayCall] = useState(false);
  const [openWeeklyGraph, setOpenWeeklyGraph] = useState(false);
  const [openWeeklyReport, setOpenWeeklyReport] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [errors, setErrors] = useState({});
  const [showActivityStream, setShowActivityStream] = useState(false);

  let queryClient = useQueryClient();

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Receiver_Name", label: "Contact Name", bool: true },
    { sort: "Contact_Number", label: "Phone No", bool: true },
    { sort: "Activity_Type", label: "Activity Type", bool: true },
    { sort: "Select_Status", label: " Status", bool: true },
    { sort: "Details", label: "Details", bool: true },
    { sort: "Company_Name", label: "Company Name", bool: false },
    { sort: "Call_Recording", label: "Recording", bool: false },
    { sort: "Selected_Date", label: "Selected Date", bool: true },
    { sort: "Activity_relates", label: "Activity relates", bool: true },
    { sort: "Next_SheduledTime", label: "Next Scheduled Time", bool: true },
  ]);

  const [showDelete, setShowDelete] = useState(null);

  const [currentActs, setCurrentActs] = useState([]);
  const [currentVisits, setCurrentVisits] = useState([]);
  const [combineValues, setCombineValues] = useState([]);
  const [targetSummary, setTargetSummary] = useState("");
  const [totalContactPercentage, setTotalContactPercentage] = useState({});
  const [totalVisitPercentage, setTotalVisitPercentage] = useState({});

  const [firstREmainderHrs, setfirstREmainderHrs] = useState("");
  const [Repeateveryhrs, setRepeateveryhrs] = useState("");
  const [firstRemainder, setfirstRemainder] = useState("");
  const [repeatEvery, setrepeatEvery] = useState("");
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [show, setShow] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // tabs values state
  const [tabValue, setTabValue] = useState(0);
  const [contactpage, setContactpage] = useState(false);

  const handleUpload = () => {
    setOpenUpload(true);
  };

  const handleAddContact = () => {
    setOpenAddContact1(true);
  };

  const handleAddActivity = () => {
    setOpenActivity(true);
  };
  const handleShowSummary = () => {
    setOpenSummary(true);
  };

  const handleShowWeeklyGraph = () => {
    setOpenWeeklyGraph(true);
  };

  const handleShowWeeklyReport = () => {
    setOpenWeeklyReport(true);
  };

  const handleShowActivityStream = () => {
    setShowActivityStream(true);
    setMainpage(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = activityStreamList.map((n) => n.contactPerson);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event) => {
    setCallerName(targetSummary?.Caller_Name);
    setCallTarget(targetSummary?.Weekly_Call_Target);
    setAppointmentTarget(targetSummary?.Weekly_Visit_Target);
    setAnchorEl1(event.currentTarget);
  };

  const handleOpenCallClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseCallClick = () => {
    setAnchorEl(null);
  };

  const files = acceptedFiles.map((file) => (
    <ListItem selected key={file.path} sx={{ width: "auto", mr: 1 }}>
      {file.path} - {file.size} bytes
    </ListItem>
  ));

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - activityStreamList?.length)
      : 0;

  const filteredStreamList = applySortFilter(
    activityStreamList,
    getComparator(order, orderBy),
    filterName
  );

  const isNotFound = !filteredStreamList?.length && !!filterName;

  const contactsEmptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allContacts?.length) : 0;

  const filteredCallList = applySortFilter(
    allContacts,
    getComparator(order, orderBy),
    filterName
  );

  const callIsNotFound = !filteredCallList?.length && !!filterName;

  //  For buttons & Weekly Report

  const [more, setMore] = useState(false);

  const buttons = [
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#effadb",
          height: "34px !important",
        },
      ]}
      key="one"
    >
      Total Key
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          my: 0.5,
          backgroundColor: "#dbeffa",
          height: "34px !important",
        },
      ]}
      key="two"
    >
      On Track
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          my: 0.5,
          backgroundColor: "#fadbef",
          height: "34px !important",
        },
      ]}
      key="three"
    >
      Under Goal
    </Box>,
  ];

  const buttons1 = [
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#D8E2DC",
          height: "34px !important",
        },
      ]}
      key="one"
    >
      Success
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#FFE5D9",
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalContactPercentage?.week1}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#FBFAF3",
          height: "34px !important",
        },
      ]}
      key="three"
    >
      {totalContactPercentage?.week2}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#FFE9EE",
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalContactPercentage?.week3}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#FFDDE4",
          height: "34px !important",
        },
      ]}
      key="three"
    >
      {totalContactPercentage?.week4}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: "#effadb",
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalContactPercentage?.week5}%
    </Box>,
  ];

  const buttons2 = [
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[0],
          height: "34px !important",
        },
      ]}
      key="one"
    >
      Success
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[1],
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalVisitPercentage?.week1}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[2],
          height: "34px !important",
        },
      ]}
      key="three"
    >
      {totalVisitPercentage?.week2}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[3],
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalVisitPercentage?.week3}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[4],
          height: "34px !important",
        },
      ]}
      key="three"
    >
      {totalVisitPercentage?.week4}%
    </Box>,
    <Box
      sx={[
        DisplayFlex,
        FontStyle,
        {
          justifyContent: "center",
          borderWidth: "0px !important",
          width: "100px !important",
          px: "0px !important",
          borderRadius: "2px !important",
          pb: 0.5,
          backgroundColor: lightColors[5],
          height: "34px !important",
        },
      ]}
      key="two"
    >
      {totalVisitPercentage?.week5}%
    </Box>,
  ];

  //  Main Page Display

  const [mainpage, setMainpage] = useState(true);

  //  Activity List

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleClickEditContact = (update) => {
    //console.log("In Edit", update);
    setOpenEditContact(true);
  };

  const Deletedata = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/user/CallcenterActivityCRUD/?id=${number}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      ////console.log(res.data);
      toast.success("Deleted successfully", {
        position: "top-right",
        autoClose: 100,
      });

      getActivityStreamRefetch();
      handleCloseAction();
    } catch (error) {
      console.error("Error while deleting:", error);
    }
  };

  const handleUpdate = (data) => {
    setUpdate(data);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };
  const [selectedValue, setSelectedValue] = useState("Select");
  const [showDialog, setShowDialog] = useState(false);
  const [update, setUpdate] = useState("");
  const navigate = useNavigate();
  const [openOverviewContact, setOpenOverviewContact] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [openEditContact, setOpenEditContact] = useState(false);
  const [number, setNumber] = useState(1);

  const [showsort, setShowsort] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Generating Color
  const [contactdatas, setContactDatas] = useState([]);

  //  For getting the Contact List

  const [condatas, setCondatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const creatbyid = localStorage.getItem("UserId");

  const getReceiverData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/ContactAdditional/?Is_Deleted=False`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response?.data?.results;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Conatct Search API

  const SearchData = (e) => {
    e.target.value !== ""
      ? handleSearch(e.target.value)
      : ReceiverDataRefetch();
  };

  const handleSearch = (search) => {
    axios
      .get(`${BASE_URL}/user/ContactSearch/?search=${search}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        ////console.log(res.data);
        setContactDatas(res.data);
      });
  };

  // For getting the All Contact List To Todays List

  const [selectedItems, setSelectedItems] = useState(
    JSON.parse(localStorage.getItem("selectedItems"))
  );

  const handleCheckboxChange = (row) => {
    ////console.log("setSelectedItems", selectedItems);
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.some((item) => item.id === row.id)
        ? prevSelectedItems?.filter((item) => item.id !== row.id)
        : [...prevSelectedItems, row]
    );
  };

  // Update Local Storage whenever 'selectedItems' change
  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  // Retrieve 'selectedItems' from Local Storage on component mount
  useEffect(() => {
    const storedSelectedItems = JSON.parse(
      localStorage.getItem("selectedItems")
    );
    if (storedSelectedItems) {
      setSelectedItems(storedSelectedItems);
    }
  }, []);

  // For Todays List To Prior List

  const [priorItems, setPriorItems] = useState([
    JSON.parse(localStorage.getItem("selectedItems1")),
  ]);

  const handleCheckboxChange1 = (row) => {
    ////console.log("PriorSelectedItems", priorItems);
    setPriorItems((prevSelectedItems) =>
      prevSelectedItems.some((item) => item.id === row.id)
        ? prevSelectedItems?.filter((item) => item.id !== row.id)
        : [...prevSelectedItems, row]
    );
  };

  // Retrieve 'PriorselectedItems' from Local Storage on component mount
  useEffect(() => {
    const storedSelectedItems1 = JSON.parse(
      localStorage.getItem("selectedItems1")
    );
    if (storedSelectedItems1) {
      setPriorItems(storedSelectedItems1);
    }
  }, []);

  // Update Local Storage whenever 'selectedItems' change

  useEffect(() => {
    localStorage.setItem("selectedItems1", JSON.stringify(priorItems));
  }, [priorItems]);

  // For Activity Modal Creation

  const validationSchema = yup.object().shape({
    selectDate: yup.string().required("Select Date is required"),
    comname: yup.string().required("Copmany Name is required"),
    activity: yup.string().required("Activity is required"),
    receiver: yup.string().required("Receiver is required"),
    type: yup.string().required(" Activity Type is required"),
    details: yup.string().required("Details is required"),
    activitystatus: yup.string().required("Activity Status is required"),
    next: yup.string().required("Sheduled Date is required"),
  });

  const [selectDate, setSelectDate] = useState("");
  const [comname, setComname] = useState("");
  const [activity, setActivity] = useState("");
  const [type, setType] = useState("");
  const [activitystatus, setActivityStatus] = useState("");
  const [next, setNext] = useState("");
  const [details, setDetails] = useState("");
  const [receiver, setReceiver] = useState("");
  const [pnumber, setPnumber] = useState("");
  const [contactid, setContactid] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const dropdownvisit = ["Appointment", "Call"];

  const dropdownList = ["Lead", "Account", "Contact"];

  const dropdownStatus = [
    "Completed",
    "Postponed",
    "Not Responding",
    "Call Back",
    "Cancelled",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { err },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onsubmit = async (e) => {
    ////console.log("submit");
    e.preventDefault();
    try {
      const payload = {
        Company_Name: comname,
        Receiver_Name: receiver,
        Details: details,
        Selected_Date: selectDate,
        Contact_Number: pnumber,
        Activity_relates: activity,
        Select_Status: activitystatus,
        Next_SheduledTime: next,
        Activity_Type: type,
        Contact_Id: contactid,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
      };

      const response = await axios.post(
        `${BASE_URL}/user/CallcenterActivityCRUD/`,
        payload,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`, // Make sure 'token' is defined before calling this function
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // ////console.log(response.data);
      currentVisitDataRefetch();
      currentActivityDataRefetch();
      setOpenActivity(false);
      setContactCancel(false);
      handleCloseCallClick();
      toast.success("Created successfully", {
        position: "top-right",
        autoClose: 100,
      });
      await getActivityStreamRefetch();
      reset();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // For Settings Icon Function

  const [contactname, setContactName] = useState(true);
  const [phone, setPhone] = useState(true);
  const [act, setAct] = useState(true);
  const [actstatus, setActStatus] = useState(true);
  const [actdetails, setActDetails] = useState(true);
  const [companyname, setCompanyName] = useState(true);
  const [date, setDate] = useState(false);
  const [actrelates, setActRelates] = useState(false);
  const [actNext, setActNext] = useState(false);
  const [id, setId] = useState(false);

  //code for table sorting
  const sortData = (key, direction) => {
    const sortedData = [...activitiesList];

    sortedData?.sort((a, b) => {
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

    setActivitiesList(sortedData);
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

  // Download Template

  const downloadTemplate = async () => {
    await axios
      .get(`${BASE_URL}/user/download_excel_template/`, {
        responseType: "blob", // Important: responseType as 'blob' to handle binary data
      })
      .then((response) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        ////console.log("url", url);
        // Create a link element
        const link = document.createElement("a");
        ////console.log("link", link);
        link.href = url;
        ////console.log("");
        link.setAttribute("download", "template.xlsx"); // Set the desired file name
        document.body.appendChild(link);
        // Click the link to trigger the download
        link.click();
        // Clean up resources after download
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        // Toast Message
        toast.success("Downloaded successfully", {
          position: "top-right",
          autoClose: 100,
        });
      })
      .catch((error) => {
        // Handle any errors that occurred during the download process
        console.error("Error downloading the template:", error);
      });
  };

  //  Upload File
  const [upload, setUpload] = useState("");

  const upLoad = (e) => {
    const file = e.target.files[0];
    ////console.log("e.target.files[0]", e.target.files[0]);
    if (file) {
      const formData = new FormData();

      formData?.append("template", file);
      ////console.log("formdata", formData);
      axios
        .post(`${BASE_URL}/user/simple_upload/`, formData, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          ////console.log(res.data);
          setOpenUpload(false);
          ReceiverDataRefetch();
          if (res.data?.success_count > 0) {
            toast.success("File uploaded successfully", {
              position: "top-right",
              closeButton: true, // Allow manual close
              closeOnClick: true, // Close on click
            });
          } else {
            toast.error(`${res.data?.failure_data[0].Error}`, {
              position: "top-right",
              closeButton: true,
              closeOnClick: true,
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file", {
            position: "top-right",
            closeButton: true,
            closeOnClick: true,
          });
        });
    }
  };

  //  For Upload Contact
  const [openAddContact1, setOpenAddContact1] = useState(false);
  const [save, setSave] = useState(false);
  const [contactCancel, setContactCancel] = useState(false);
  const [addContactCancel, setAddContactCancel] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mail, setMail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const validationSchema1 = yup.object().shape({
    name: yup.string().required("Name is required"),
    mail: yup.string().required("Mail is required"),
    mobilenumber: yup
      .string()
      .required("Mobile Number is Required")
      .min(9, "Minium 9 digits Required")
      .max(15, "Maximum 15 digits Required"),
    code: yup.string().required("Mobile Code is required"),
    orgname: yup.string().required("Organization Name is required"),
    selectedCity: yup.string().required("City is required"),
    selectedCountry: yup.string().required(" Country is Required"),
    selectedState: yup.string().required("State is Required"),
    industry: yup.string().required("Industry is required"),
  });

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    reset: reset1,
    formState: { errors: errors1 },
  } = useForm({
    resolver: yupResolver(validationSchema1),
  });

  const onsubmit1 = () => {
    ////console.log("check");
    var payload = {
      Name: name,
      Company_Name: orgname,
      MobileCountry_Id: code,
      Mobile_Number: mobilenumber,
      Email_Id: mail,
      Country: selectedCountry.name,
      State: selectedState.name,
      City: selectedCity.name,
      Industry_Type: industry.industry_type,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    ////console.log("payload", payload);
    axios
      .patch(`${BASE_URL}/user/ContactUpdate/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        ////console.log(res.data);
        toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        setOpenAddContact1(false);
        ReceiverDataRefetch();
        reset1();
      })
      .catch((error) => {
        ////console.log("error", error);
      });
  };

  const resetFunction = () => {
    setName("");
    setCode("");
    setMail("");
    setOrgname("");
    setSelectedCountry("");
    setSelectedState("");
    setIndustry("");
    setMobilenumber("");
    setSelectedCity("");
  };

  const handleReset = () => {
    setValue1("selectedCountry", "");
    setValue1("selectedState", "");
    setValue1("selectedCity", "");
    setValue1("industry", "");
    setfirstREmainderHrs("");
    setRepeateveryhrs("");
    setfirstRemainder("");
    setrepeatEvery("");
    setEditorContent("");
    setNotes("");
    setStatus("");
    setNextDate("");
    setDuration("");
    setCallRecording("");
    setCallContext("");
    setBusy("");
    setCallconvstatus("");
  };

  // For Overview Page

  const set = localStorage.getItem("Username");

  // For generating Random Color For Upcoming Activities
  const [avatornew, setAvatornew] = useState([]);

  const generateRandomColorFromList1 = (list) => {
    const randomIndex = Math.floor(Math.random() * list?.length);
    return list[randomIndex];
  };

  const generateRandomAvatarColors1 = async (list, colorList) => {
    const colors = await Promise.all(
      list.map(() => generateRandomColorFromList1(colorList))
    );
    return colors;
  };

  // For generating Random Color For Closing Activities
  const [avatornew1, setAvatornew1] = useState([]);

  const generateRandomColorFromList2 = (list) => {
    const randomIndex = Math.floor(Math.random() * list?.length);
    return list[randomIndex];
  };

  const generateRandomAvatarColors2 = async (list, colorList) => {
    const colors = await Promise.all(
      list.map(() => generateRandomColorFromList2(colorList))
    );
    return colors;
  };

  //  For getting the all days In Week
  const [weekDays, setWeekDays] = useState([]);

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const updateWeekDays = () => {
      const currentDate = new Date();
      const weekStart = currentDate.getDate() - currentDate.getDay() + 1; // Start of the current week (Monday)
      const weekDates = [...Array(7)].map((_, index) => {
        const date = new Date(currentDate);
        date.setDate(weekStart + index);
        return getFormattedDate(date); // Apply getFormattedDate directly to format the date
      });
      ////console.log("updateWeekDays", weekDates);
      setWeekDays(weekDates);
    };

    updateWeekDays();

    const interval = setInterval(() => {
      updateWeekDays();
    }, 86400000); // Update the dates every 24 hours

    return () => clearInterval(interval);
  }, []);

  //  Initialize the State for Current Week

  const [mon, setMon] = useState({
    Call_Count: 0,
    appointment: 0,
  });

  const [tus, setTus] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });
  const [wed, setWed] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });
  const [thu, setThu] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });
  const [fri, setFri] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });
  const [sun, setSun] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });
  const [sat, setSat] = useState({
    Call_Count: 0,
    Visit_Count: 0,
  });

  // graph datas
  const data = [
    {
      name: "Mon",
      Contact: mon?.Call_Count || 0,
      Appointment: mon?.Visit_Count || 0,
    },
    {
      name: "Tue",
      Contact: tus?.Call_Count || 0,
      Appointment: tus?.Visit_Count || 0,
    },
    {
      name: "Wed",
      Contact: wed?.Call_Count || 0,
      Appointment: wed?.Visit_Count || 0,
    },
    {
      name: "Thu",
      Contact: thu?.Call_Count || 0,
      Appointment: thu?.Visit_Count || 0,
    },
    {
      name: "Fri",
      Contact: fri?.Call_Count || 0,
      Appointment: fri?.Visit_Count || 0,
    },
    {
      name: "Sat",
      Contact: sat?.Call_Count || 0,
      Appointment: sat?.Visit_Count || 0,
    },
    {
      name: "Sun",
      Contact: sun?.Call_Count || 0,
      Appointment: sun?.Visit_Count || 0,
    },
  ];

  // For Weekly Graph

  const day1 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[0]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day2 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[1]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day3 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[2]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day4 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[3]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day5 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[4]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day6 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[5]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const day7 = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityTypeRangeFilter/?Created_Date=${
          weekDays[6]
        }&Created_By=${localStorage.getItem("UserId")}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const currentactivity = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityWeeklyReportCall/`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const weekNumbers = getCurrentMonthWeekNumbers();
      const contactAct = Array.from({ length: weekNumbers?.length }, () => ({
        week: "",
        values: [],
        total: 0,
      }));

      response.data?.Calls?.forEach((call, index) => {
        const weekIndex = Math.floor(index / 7);
        contactAct[weekIndex].week = "Week " + weekNumbers[weekIndex];
        contactAct[weekIndex].values.push({
          Created_Date: call?.Created_Date,
          count: call?.count || 0,
        });
        contactAct[weekIndex].total += parseInt(call?.count || 0);
      });

      const contactTotal = {};

      weekNumbers?.map((weekNum, idx) => {
        const weeklyCallTarget = targetSummary?.Weekly_Call_Target || 0;

        ////console.log(`Weekly_Call_Target`);
        const percentage =
          weeklyCallTarget === 0
            ? 0
            : (contactAct[idx]?.total / weeklyCallTarget) * 100;
        contactTotal[`week${idx + 1}`] = parseFloat(percentage).toFixed(2);
      });

      return { totalContactPercentage: contactTotal, currentActs: contactAct };
    } catch (error) {
      console.error("Error fetching call data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const currentVisit = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityWeeklyReportAppointment/`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const weekNumbers = getCurrentMonthWeekNumbers();
      const contactAct = Array.from({ length: weekNumbers?.length }, () => ({
        week: "",
        values: [],
        total: 0,
      }));

      response.data?.Visit?.forEach((call, index) => {
        const weekIndex = Math.floor(index / 7);
        contactAct[weekIndex].week = "Week " + weekNumbers[weekIndex];
        contactAct[weekIndex].values.push({
          Created_Date: call?.Created_Date,
          count: call?.count || 0,
        });
        contactAct[weekIndex].total += parseInt(call?.count || 0);
      });

      const contactTotal = {};
      weekNumbers.forEach((weekNum, idx) => {
        const weeklyVisitTarget = targetSummary?.Weekly_Visit_Target || 0;
        const percentage =
          weeklyVisitTarget === 0
            ? 0
            : (contactAct[idx].total / weeklyVisitTarget) * 100;
        contactTotal[`week${idx + 1}`] = parseFloat(percentage).toFixed(2);
      });

      return { totalVisitPercentage: contactTotal, currentVisits: contactAct };
    } catch (error) {
      console.error("Error fetching visit data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const combineCurrentactivityAndCurrentVisit = () => {
    const combinedValues = currentActs.map((currentAct, actIndex) => {
      const combinedWeekValues = currentAct.values.map((value, valueIndex) => {
        const visitCount =
          currentVisits[actIndex]?.values[valueIndex]?.count || 0;
        const currentCount = parseInt(value.count || 0) + parseInt(visitCount);
        return {
          Created_Date: value?.Created_Date,
          count: currentCount,
        };
      });

      const total = combinedWeekValues.reduce(
        (acc, val) => acc + parseInt(val.count),
        0
      );

      return {
        week: currentAct.week,
        values: combinedWeekValues,
        total: total,
      };
    });

    setCombineValues(combinedValues);
  };

  // useEffect(() => {
  //   currentVisit();
  // }, [targetSummary]);

  useEffect(() => {
    if (currentActs?.length > 0 && currentVisits?.length > 0) {
      combineCurrentactivityAndCurrentVisit();
    }
  }, [currentActs, currentVisits]);

  //  For showing the Date Field

  const [isDateField, setIsDateField] = useState(false);
  const [isDateField1, setIsDateField1] = useState(false);

  const handleBlur = () => {
    setIsDateField(false);
  };

  const handleHover1 = () => {
    setIsDateField1(true);
  };

  const handleDialogClose = (confirmed) => {
    setIsReminderSet(false);
  };

  const onChange = (evt, editor) => {
    ckEditorOnchange(evt, editor, setEditorContent);
    // ////console.log("eve", evt);
    // var newContent = evt.editor.getData();
    // ////console.log("newContent", newContent);
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    // setEditorContent(textContent);
  };

  const handleBlur1 = () => {
    setIsDateField1(false);
  };

  // Weeks Of the Month
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysOffset =
      firstDayOfYear.getDay() > 4
        ? 7 - firstDayOfYear.getDay()
        : -firstDayOfYear.getDay();
    const firstWeekDate = new Date(date.getFullYear(), 0, 1 + daysOffset);
    const diffInDays = Math.floor(
      (date.getTime() - firstWeekDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    return 1 + Math.floor(diffInDays / 7);
  }

  const getCurrentMonthWeekNumbers = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const weekNumbers = [];

    for (let day = 1; day <= 31; day++) {
      const currentDate = new Date(year, currentMonth, day);
      if (currentDate.getMonth() === currentMonth) {
        const weekNumber = getISOWeek(currentDate); // You can use a library like 'date-fns' to get week numbers
        if (!weekNumbers.includes(weekNumber)) {
          weekNumbers.push(weekNumber);
        }
      }
    }

    return weekNumbers;
  };

  const [weekNumbers, setWeekNumbers] = useState([]);

  useEffect(() => {
    const weekNumbers = getCurrentMonthWeekNumbers();
    setWeekNumbers(weekNumbers);
  }, []);

  // tabs functionality

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // update code
  let DaysHeader = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [openCreateList, setOpenCreateList] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [listName, setListName] = useState("");
  const [location, setLocation] = useState("");
  const [slectIndustry, setSlectIndustry] = useState("");
  const [lookupdata, setLookupdata] = useState([]);
  const [allLocationList, setAllLocationList] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [showDial, setShowDial] = useState(false);
  const [calldata, setcalldata] = useState();
  const [startTimeEndTime, setStartTimeEndTime] = useState();
  const [noteCall, setNoteCall] = useState(false);
  const [mic, setMic] = useState(false);
  const [volume, setVolume] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [allSelectedMails, setAllSelect] = useState(false);
  const [callTarget, setCallTarget] = useState("");
  const [appointmentTarget, setAppointmentTarget] = useState("");
  const [callerName, setCallerName] = useState("");
  const [openCreateTarget, setOpenCreateTarget] = useState(false);
  const [saveCreateTarget, setSaveCreateTarget] = useState(false);
  const [userCallsActivities, setUserCallsActivities] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [contactdata, setContactdata] = useState([]);
  const [datePicker, setDatPicker] = useState();
  const isMobile = useResponsive("between", "xs", "sm");
  const [activitiesList, setActivitiesList] = useState([]);
  const [upactivities, setUpactivities] = useState([]);
  const [closedactivities, setClosedactivities] = useState([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  let userId = localStorage.getItem("UserId");

  const [seriesValue, setSeriesValue] = useState("");
  const [callCenterId, setCallCenterId] = useState("");

  const option = [
    "Connected",
    "Customer Missed",
    "Voice mail",
    "Busy",
    "Disconnect",
    "Missed call",
    "Call waiting",
    "Confidence call",
    "Call attended",
    "Do Not Disturb Turned On",
    "Call Not Picked",
    "Called Back",
  ];

  const contaxtoptions = [
    "Solving Problem",
    "Making Decision",
    "Solution Achieved",
  ];
  const callconvoptions = [
    "Casual",
    "Tension",
    "Not Interested",
    "Friendly",
    "Confidancial",
  ];

  const BusyHroptions = ["Morning", "Evening", "After Noon"];

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [nextdate, setNextDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [CallRecording, setCallRecording] = useState(null);
  const [MissedRang, setMissedRang] = useState(0);
  const [callcontext, setCallContext] = useState("");
  const [busy, setBusy] = useState("");
  const [callconvstatus, setCallconvstatus] = useState("");

  // Upcoming & Closed Activities
  const fetchUpcomingData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityUpcomingActivities/?Created_By=${userId}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const upcoming = [];
      let date = new Date(new Date(datePicker).getTime() + 1 * 86400000)
        .toISOString()
        .split("T")[0];
      response?.data?.forEach((value) => {
        if (
          value?.Created_Date == date ||
          new Date(value?.Next_SheduledTime)?.toISOString()?.split("T")[0] ==
            date
        ) {
          upcoming.push(value);
        }
      });

      return upcoming;
    } catch (error) {
      console.error("Error fetching upcoming data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const fetchClosingData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityClosedActivities/?Created_By=${userId}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const closed = [];
      let datePick = new Date(
        new Date(datePicker).getTime() + 1 * 86400000
      ).toISOString();
      let time;
      let date;
      response.data?.forEach((value) => {
        date = new Date(value?.Next_SheduledTime)?.toLocaleDateString(
          undefined,
          { year: "numeric", month: "2-digit", day: "2-digit" }
        );
        time = new Date(value?.Next_SheduledTime)?.toLocaleTimeString(
          undefined,
          { hour12: true }
        );
        if (
          new Date(value?.Next_SheduledTime)?.toISOString()?.split("T")[0] ==
            datePick?.split("T")[0] &&
          time >= new Date()?.toLocaleTimeString(undefined, { hour12: true })
        ) {
          closed.push(value);
        }
      });

      return closed;
    } catch (error) {
      console.error("Error fetching closing data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorList1 = [
          "#050A30",
          "#FF3939",
          "#750075",
          "#104210",
          "#FFA500",
          "#104210",
        ];
        const avatarColors2 = await generateRandomAvatarColors1(
          upactivities,
          colorList1
        );
        setAvatornew(avatarColors2);
      } catch (error) {}
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [upactivities]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorList1 = [
          "#050A30",
          "#FF3939",
          "#750075",
          "#104210",
          "#FFA500",
          "#104210",
        ];
        const avatarColors3 = await generateRandomAvatarColors2(
          closedactivities,
          colorList1
        );
        setAvatornew1(avatarColors3);
      } catch (error) {}
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [closedactivities]);

  const ActivitiesData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/CallcenterActivityAdditional/?Is_Deleted=False&Created_By=${userId}&page=${page}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Process response data
      let color = response?.data?.results?.map(() => generateRandomColor());
      return {
        activitiesList: response?.data?.results,
        avatarColors: color,
        count: response?.data?.count,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Activities Data Search Functionality
  const SearchData1 = (e) => {
    e.target.value !== ""
      ? handleSearch1(e.target.value)
      : getActivityStreamRefetch();
  };

  const handleSearch1 = async (search) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/CallcenterActivitySearch/?search=${search}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      ////console.log(res.data);
      setActivitiesList(res.data);
    } catch (error) {
      console.error("Error while searching:", error);
    }
  };

  // get all contact list list
  const getContactData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/UserCallCenterListAdditional/?Is_Deleted=False&Created_By=${userId}&Organization_Id=${localStorage.getItem(
          "OrganizationId"
        )}`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      let color = response?.data?.results?.map(() => generateRandomColor());
      return {
        contactData: response?.data?.results,
        avatarColors: color,
      };
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // get today's list
  const getTodaysContactData = async (date) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/UserTodayListAdditional/?Created_Date=${
          date || new Date().toISOString().split("T")[0]
        }&Created_By=${userId}`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      let callDatas = [];
      let avatarColor = [];
      response.data?.results?.forEach((datas) => {
        datas?.Today_List?.forEach((dat) => {
          avatarColor.push(generateRandomColor());
          callDatas.push(dat);
        });
      });
      ////console.log("callDatas", callDatas, response.data?.results);
      return { callDatas, avatarColor };
    } catch (error) {
      console.error("An error occurred:", error.message);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // Getting the Lookup data
  const getlookupData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/Userlookuplist/`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      ////console.log("check", response.data);
      // //console.log(
      //   "check1",
      //   response?.data?.find((op) => op?.Lookupname === "Industry Type")
      // );
      // setLookupdata(response?.data?.find((op) => op?.Lookupname === "Industry Type") || []);
      return response?.data;
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // getContact location list
  const allContactLocations = async (callDatas, color) => {
    try {
      axios
        .get(`${BASE_URL}/user/ContactFullList/`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          let localLocal = [];
          let allCallList = [];

          if (res.data?.length > 0) {
            res.data?.forEach((result) => {
              if (!localLocal?.includes(result?.City)) {
                localLocal?.push(result?.City);
              }

              if (callDatas?.length > 0) {
                callDatas?.filter((call) => {
                  if (call?.id == result?.id) {
                    allCallList.push({
                      ...result,
                      Calling_Time: call?.Calling_Time,
                      Call_Status: call?.Call_Status,
                      Shcedule_Date: call?.Shcedule_Date,
                    });
                  }
                });
              }
            });

            let users = res.data?.map((result) => result?.Name);
            //console.log("allCallList", allCallList, res.data);
            setAllUsers(users);
            setAllLocationList(localLocal);
            setContactDatas(allCallList);
            // setAvatarColors(color);
          }
        });
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };
  // For Create Contact List Functionlaity and States
  const nameRegex = /^(?!\s*$)(?!null$)(?!undefined$).+/;
  const createConactList = async (e) => {
    let dubListName = true;
    contactdata?.some((contact) => {
      if (contact?.ListName?.toLowerCase() === listName?.toLowerCase()) {
        dubListName = false;
      }
    });
    let error = {};
    if (!nameRegex.test(listName)) {
      error.listName = "is required";
    }
    if (!nameRegex.test(slectIndustry)) {
      error.slectIndustry = "is required";
    }
    if (!nameRegex.test(location)) {
      error.location = "is required";
    }

    setErrors(error);
    if (dubListName) {
      if (
        nameRegex.test(listName) &&
        nameRegex.test(slectIndustry) &&
        nameRegex.test(location)
      ) {
        try {
          var payload = {
            ListName: listName,
            Industry: slectIndustry,
            Location: location,
            Organization_Id: localStorage.getItem("OrganizationId"),
            Created_By: localStorage.getItem("UserId"),
            Updated_By: localStorage.getItem("UserId"),
          };
          //console.log("payload", payload);
          const response = await axios.post(
            `${BASE_URL}/user/UserCallCenterListCRUD/`,
            payload,
            {
              headers: {
                db: item,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
          //console.log("res.data.results", response.data);
          if (response) {
            setListName("");
            setLocation("");
            setSlectIndustry("");

            setOpenCreateList(false);
            toast.success("Created successfully", {
              position: "top-right",
              autoClose: 100,
            });
            getCallCenterRefetch();
            setTabValue(0);
          }
        } catch (error) {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
            //console.log(errorMessage);
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 100,
            });
          } else {
            if (error.response && error.response.status === 403) {
              const errorMessage =
                error.response.data.details ||
                "You don't have permission to do it";
              //console.log(errorMessage);
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
        }
      } else {
        toast.error("some fields are empty", {
          position: "top-right",
          autoClose: 100,
        });
      }
    } else {
      toast.error(`${name} already exists in the list`, {
        position: "top-right",
        autoClose: 100,
      });
    }
  };

  // delete contact list
  const deleteContactList = async (e) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/UserCallCenterListCRUD/?id=${e}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response) {
        toast.success("Deleted Successfully", {
          position: "top-right",
          autoClose: 100,
        });
      }
      getCallCenterRefetch();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        //console.log(errorMessage);
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

  // check today user dublicate users avoid funcion
  const dubUser = () => {
    let bool = true;
    let exitsUser = [...selectedUsers];
    contactdatas?.forEach((item) => {
      selectedUsers?.filter((user, index) => {
        if (item?.id === user?.user?.id && user?.checked == true) {
          //console.log("payloadss2", user);
          exitsUser[index].checked = false;
          bool = false;
        }
      });
    });
    let allselect = exitsUser?.every((user, index) => user?.checked === true);

    let selectedUser = [];
    exitsUser?.map((user) => {
      if (user?.checked == true) {
        selectedUser.push({
          ...user?.user,
          Calling_Time: "",
          Call_Status: "",
          Shcedule_Date: "",
        });
      }
    });

    //console.log("dunlications created2", contactdatas);
    setSelectedUsers(exitsUser);
    setAllSelect(allselect);

    return { selectedUser, bool };
  };

  // create todays list
  const createTodayList = async (e) => {
    e.preventDefault();
    let users = dubUser();
    //console.log("payloadss", users?.bool);

    if (users?.bool == true && users?.selectedUser?.length > 0) {
      try {
        let payload = {
          Today_List: users?.selectedUser,
          Created_Date: new Date()?.toISOString().split("T")[0],
          Updated_Date: new Date()?.toISOString().split("T")[0],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        const response = await axios.post(
          `${BASE_URL}/user/UserTodayListscrud/`,
          payload,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        //console.log("res.data.results", response.data);
        if (response) {
          setListName("");
          setLocation("");
          setSlectIndustry("");

          setContactpage(false);
          toast.success("Created successfully", {
            position: "top-right",
            autoClose: 100,
          });
          getCallCenterRefetch();
          setTabValue(1);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
        toast.error(error.message, {
          position: "top-right",
          autoClose: 100,
        });
      }
    } else {
      toast.error("please check user dublicates or empty ", {
        position: "top-right",
        autoClose: 100,
      });
    }
  };

  const handleRefetch = () => {
    queryClient.refetchQueries("day1Data");
    queryClient.refetchQueries("day2Data");
    queryClient.refetchQueries("day3Data");
    queryClient.refetchQueries("day4Data");
    queryClient.refetchQueries("day5Data");
    queryClient.refetchQueries("day6Data");
    queryClient.refetchQueries("day7Data");
    queryClient.invalidateQueries("getActivityStreamLists");
    queryClient.invalidateQueries("getCallCenterLists");
    queryClient.invalidateQueries("receiverData");
    queryClient.invalidateQueries("currentActivityData");
    queryClient.invalidateQueries("currentVisitData");
    queryClient.invalidateQueries("getTargetSummarylists");
    queryClient.invalidateQueries("upcomingDataLists");
    queryClient.invalidateQueries("closingDataLists");
  };

  //console.log("activitiesList", activitiesList);

  // update call activities function
  const callActiviesFunc = async (e) => {
    let error = errorFilter({
      status,
      callcontext,
      busy,
      callconvstatus,
      duration,
      nextdate,
      notes,
    });

    if (Boolean(seriesValue !== "Automatic") && !Boolean(callCenterId)) {
      error.callCenterId = "Call Center Id is required";
    } else if (
      Boolean(seriesValue !== "Automatic") &&
      !Boolean(callCenterId?.length == 11)
    ) {
      error.callCenterId = "Call Center Id must be 11 digits.";
    }

    setErrors(error);
    if (Object.keys(error)?.length === 0) {
      try {
        var payload = {
          CallCenter_Id: seriesValue === "Manual" && callCenterId,
          Company_Name: calldata?.Company_Name,
          Receiver_Name: calldata?.Name,
          Contact_Number: calldata?.Mobile_Number,
          Selected_Date: moment().format("YYYY-MM-DD"),
          Next_SheduledTime: nextdate,
          Call_Duration: duration,
          Missed_Rank: MissedRang,
          Call_Recording: CallRecording,
          Call_Context: callcontext,
          Call_Con_Status: callconvstatus,
          Call_Busy_hour: busy,
          Activity_Type: "Call",
          Activity_relates: "Contact",
          Details: notes,
          Select_Status: status,
          Reminder_Payload: Boolean(show)
            ? {
                RemainderDueDate: firstRemainder + " " + firstREmainderHrs,
                Repeat_EveryDay: repeatEvery + " " + Repeateveryhrs,
                ReminderFor: "Reminder for Contact Call Center",
                RemainderMessage: editorContent,
                Created_By: localStorage.getItem("UserId"),
                Updated_By: localStorage.getItem("UserId"),
              }
            : null,
          Contact_Id: Number(calldata?.id),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
          Organization_Id: localStorage.getItem("OrganizationId"),
        };

        //console.log("payload", payload);

        const response = await axios.post(
          `${BASE_URL}/user/CallcenterActivityCRUD/`,
          payload,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`, // Make sure 'token' is defined before calling this function
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        //console.log(response.data);
        if (response) {
          updateContactCallDetails(callDialog);
          setShowDial(false);
          handleClose();
          handleRefetch();
          handleReset();
          // allContactLocations(contactdata, avatarColors)
        }
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    } else {
      toast.error("some fields are empty", {
        position: "top-right",
        autoClose: 100,
      });
    }
  };

  // update Contact call details
  const updateContactCallDetails = async (user) => {
    try {
      let noOfCalls = parseInt(user?.No_of_Calls) + 1 || 1;
      let payload1 = {
        id: parseInt(user?.id),
        Last_Call_Date: moment().format("YYYY-MM-DD"),
        Last_Called_By: localStorage.getItem("Username"),
        No_of_Calls: noOfCalls,
        File: "",
      };

      //console.log("Updating contact", payload1, callDialog, noOfCalls);

      await axios
        .patch(`${BASE_URL}/user/ContactCRUD/`, payload1, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((re) => {
          //console.log("res345", re);
          setType("");
          setStatus("");
          setNext("");
          setNotes("");

          toast.success("Created successfully", {
            position: "top-right",
            autoClose: 100,
          });
          setShowDial(false);
          handleClose();
        })
        .catch((error) => {
          //console.log("error", error);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  // create target submit or summary create
  const submitCreateTarget = async () => {
    let error = errorFilter({ callerName, callTarget, appointmentTarget });

    setErrors(error);
    if (nameRegex.test(callerName) && Object.keys(error)?.length === 0) {
      try {
        let payload = {
          Weekly_Call_Target: callTarget,
          Weekly_Visit_Target: appointmentTarget,
          Caller_Name: callerName,
          Month: "no month",
          Created_Date: new Date()?.toISOString().split("T")[0],
          Updated_Date: new Date()?.toISOString().split("T")[0],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        //console.log("payload", payload);
        const response = await axios.post(
          `${BASE_URL}/useradmin/CallcenterTargetListscrud/`,
          payload,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response) {
          setOpenCreateTarget(false);
          getTargetSummarylistsRefetch();
          toast.success("Create successfully", {
            position: "top-right",
            autoClose: 100,
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.error("some fields are empty", {
        position: "top-right",
        autoClose: 500,
      });
    }
  };

  const submitUpdateTarget = async () => {
    let error = errorFilter({ callerName, callTarget, appointmentTarget });

    setErrors(error);
    if (nameRegex.test(callerName) && Object.keys(error)?.length === 0) {
      try {
        let payload = {
          id: targetSummary?.id,
          Weekly_Call_Target: callTarget,
          Weekly_Visit_Target: appointmentTarget,
          Caller_Name: callerName,
          Month: "no month",

          Updated_Date: new Date()?.toISOString().split("T")[0],
          Organization_Id: localStorage.getItem("OrganizationId"),
          UserId: localStorage.getItem("UserId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        //console.log("payload", payload);
        const response = await axios.put(
          `${BASE_URL}/useradmin/CallcenterTargetListscrud/`,
          payload,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response) {
          setOpenCreateTarget(false);
          getTargetSummarylistsRefetch();
          toast.success("Update successfully", {
            position: "top-right",
            autoClose: 100,
          });
        }
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.error("some fields are empty", {
        position: "top-right",
        autoClose: 500,
      });
    }
  };

  // get target summary
  const getTargetSummary = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/CallcenterTargetListAdditional/`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response?.data?.results[0];
    } catch (error) {
      console.error("Error fetching target summary:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  // get organisation bussiness hour
  const organisationBussinessHour = async (data) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/CRMorganizationCRUD/?id=${1}`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response) {
        let target = Object.keys(response?.data?.Business_Hour || {})?.filter(
          (key) => response?.data?.Business_Hour[key] === true
        )?.length;
        //console.log("responsetarget", data);
        if (data?.Weekly_Call_Target) {
          setTargetSummary({
            ...data,
            Caller_Name: data?.Caller_Name,
            Weekly_Call_Target: data?.Weekly_Call_Target,
            Weekly_Visit_Target: data?.Weekly_Visit_Target,
          });
        }
      }
    } catch (error) {
      console.error(error?.message);
    }
  };

  const setreminder = (event) => {
    setIsReminderSet(true);
    setShow(true);
    //console.log("inside");
  };

  const {
    data: getActivityStream,
    isLoading: getActivityStreamLoading,
    isError: getActivityStreamError,
    refetch: getActivityStreamRefetch,
  } = useQuery(["getActivityStreamLists", page], ActivitiesData, {
    staleTime: Infinity,
  });

  const {
    data: getCallCenter,
    isLoading: getCallCenterLoading,
    isError: getCallCenterError,
    refetch: getCallCenterRefetch,
  } = useQuery(
    ["getCallCenterLists", tabValue, filterDate],
    async () => {
      if (tabValue == 0) {
        return await getContactData();
      } else if (tabValue == 1) {
        return Boolean(filterDate)
          ? await getTodaysContactData(filterDate)
          : await getTodaysContactData();
      }
    },
    { staleTime: Infinity }
  );

  const {
    data: receiverData,
    isLoading: receiverDataLoading,
    isError: receiverDataError,
    refetch: ReceiverDataRefetch,
  } = useQuery(["receiverData"], getReceiverData, { staleTime: Infinity });
  // currentactivity
  const {
    data: currentActivityData,
    isLoading: currentActivityDataLoading,
    isError: currentActivityDataError,
    refetch: currentActivityDataRefetch,
  } = useQuery(["currentActivityData", targetSummary], currentactivity, {
    staleTime: Infinity,
  });

  const {
    data: currentVisitData,
    isLoading: currentVisitDataLoading,
    isError: currentVisitDataError,
    refetch: currentVisitDataRefetch,
  } = useQuery(["currentVisitData", targetSummary], currentVisit, {
    staleTime: Infinity,
  });

  // //console.log("currentVisitData", currentVisitData);
  // //console.log("currentActivityData", currentActivityData);
  const {
    data: getUserLoopUp,
    isLoading: getUserLoopUpLoading,
    isError: getUserLoopUpError,
    refetch: getUserLoopUpRefetch,
  } = useQuery(["getUserLoopUpLists"], getlookupData, { staleTime: Infinity });

  const {
    data: getTargetSummarylists,
    isLoading: getTargetSummarylistsLoading,
    isError: getTargetSummarylistsError,
    refetch: getTargetSummarylistsRefetch,
  } = useQuery(["getTargetSummarylists"], getTargetSummary, {
    staleTime: Infinity,
  });

  const {
    data: upcomingDataLists,
    isLoading: upcomingLoading,
    isError: upcomingError,
    refetch: upcomingRefetch,
  } = useQuery(["upcomingDataLists", datePicker], fetchUpcomingData, {
    staleTime: Infinity,
  });

  const {
    data: closingDataLists,
    isLoading: closingLoading,
    isError: closingError,
    refetch: closingRefetch,
  } = useQuery(["closingDataLists", datePicker], fetchClosingData, {
    staleTime: Infinity,
  });

  // for all days
  const {
    data: day1Data,
    isLoading: day1Loading,
    isError: day1Error,
    refetch: day1Refetch,
  } = useQuery(["day1Data", weekDays[0]], day1, {
    staleTime: Infinity,
    enabled: !!weekDays[0],
  });

  const {
    data: day2Data,
    isLoading: day2Loading,
    isError: day2Error,
    refetch: day2Refetch,
  } = useQuery(["day2Data", weekDays[1]], day2, {
    staleTime: Infinity,
    enabled: !!weekDays[1],
  });

  const {
    data: day3Data,
    isLoading: day3Loading,
    isError: day3Error,
    refetch: day3Refetch,
  } = useQuery(["day3Data", weekDays[2]], day3, {
    staleTime: Infinity,
    enabled: !!weekDays[2],
  });

  const {
    data: day4Data,
    isLoading: day4Loading,
    isError: day4Error,
    refetch: day4Refetch,
  } = useQuery(["day4Data", weekDays[3]], day4, {
    staleTime: Infinity,
    enabled: !!weekDays[3],
  });

  const {
    data: day5Data,
    isLoading: day5Loading,
    isError: day5Error,
    refetch: day5Refetch,
  } = useQuery(["day5Data", weekDays[4]], day5, {
    staleTime: Infinity,
    enabled: !!weekDays[4],
  });

  const {
    data: day6Data,
    isLoading: day6Loading,
    isError: day6Error,
    refetch: day6Refetch,
  } = useQuery(["day6Data", weekDays[5]], day6, {
    staleTime: Infinity,
    enabled: !!weekDays[5],
  });

  const {
    data: day7Data,
    isLoading: day7Loading,
    isError: day7Error,
    refetch: day7Refetch,
  } = useQuery(["day7Data", weekDays[6]], day7, {
    staleTime: Infinity,
    enabled: !!weekDays[6],
  });

  useEffect(() => {
    if (getActivityStream) {
      // setAvatarColors(getActivityStream?.avatarColors);
      setActivitiesList(getActivityStream?.activitiesList);
      setCount(getActivityStream?.count);
    }
  }, [getActivityStream]);

  useEffect(() => {
    if (getCallCenter) {
      if (tabValue == 0) {
        // setAvatarColors(getCallCenter?.avatarColor);
        setContactdata(getCallCenter?.contactData);
      } else if (tabValue == 1) {
        allContactLocations(
          getCallCenter?.callDatas,
          getCallCenter?.avatarColor
        );
      }
    }
  }, [getCallCenter]);

  useEffect(() => {
    if (receiverData) {
      setCondatas(receiverData);
    }
  }, [receiverData]);

  useEffect(() => {
    if (currentActivityData) {
      setTotalContactPercentage(currentActivityData?.totalContactPercentage);
      setCurrentActs(currentActivityData?.currentActs);
    }
  }, [currentActivityData]);

  useEffect(() => {
    if (currentVisitData) {
      setTotalVisitPercentage(currentVisitData?.totalVisitPercentage);
      setCurrentVisits(currentVisitData?.currentVisits);
    }
  }, [currentVisitData]);

  useEffect(() => {
    if (getUserLoopUp) {
      getUserLoopUp?.find((op) => {
        if (op?.Lookupname === "Industry Type") {
          setLookupdata(op?.Values?.map((v) => v?.value) || []);
        }
      });
    }
  }, [getUserLoopUp]);

  useEffect(() => {
    if (getTargetSummarylists) {
      organisationBussinessHour(getTargetSummarylists);
    }
  }, [getTargetSummarylists]);

  useEffect(() => {
    if (upcomingDataLists) {
      setUpactivities(upcomingDataLists);
    }
  }, [upcomingDataLists]);

  useEffect(() => {
    if (closingDataLists) {
      setClosedactivities(closingDataLists);
    }
  }, [closingDataLists]);

  // days setup
  useEffect(() => {
    if (day1Data) {
      setMon(day1Data);
      //console.log("day1Data", day1Data);
    }
  }, [day1Data]);

  useEffect(() => {
    if (day2Data) {
      setTus(day2Data);
      //console.log("day1Data", day2Data);
    }
  }, [day2Data]);

  useEffect(() => {
    if (day3Data) {
      setWed(day3Data);
      //console.log("day1Data", day3Data);
    }
  }, [day3Data]);

  useEffect(() => {
    if (day4Data) {
      setThu(day4Data);
      //console.log("day1Data", day4Data);
    }
  }, [day4Data]);

  useEffect(() => {
    if (day5Data) {
      setFri(day5Data);
      //console.log("day1Data", day5Data);
    }
  }, [day5Data]);

  useEffect(() => {
    if (day6Data) {
      setSun(day6Data);
      //console.log("day1Data", day6Data);
    }
  }, [day6Data]);

  useEffect(() => {
    if (day7Data) {
      setSat(day7Data);
      //console.log("day1Data", day7Data);
    }
    allContactLocations(); // for inital loading...
  }, [day7Data]);

  const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
  //console.log("PhoneNo", userDetails?.PhoneNo);
  const [knowlaritydatas, setKnowlaritydatas] = useState([]);
  const [agentdetails, setagentdetails] = useState([]);
  const [callogsdetails, setcallogsdetails] = useState([]);

  const getKnowlarityConfiguration = () => {
    axios
      .get(
        `${BASE_URL}/user/KnowlarityConfigurationCRUD/?User_Id=${localStorage.getItem(
          "UserId"
        )}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        //console.log("res?.data", res.data);
        setKnowlaritydatas(res?.data);
      })
      .catch((error) => {
        //console.log("error");
      });
  };

  const getagentnumber = async (row) => {
    await axios
      .get(`https://kpi.knowlarity.com/Basic/v1/account/agent`, {
        headers: {
          // "Accept": "application/json",
          // "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
          // "Authorization": "09049056-87dd-4867-bf9e-2cd0f3382be2",

          Accept: "application/json",
          "x-api-key": knowlaritydatas?.Header_Key,
          Authorization: knowlaritydatas?.API_Key,
        },
      })
      .then((res) => {
        //console.log("agentres", res);
        const agentnum = res.data?.objects?.find(
          (item) => item?.phone === userDetails?.PhoneNo
        );
        // setagentdetails(agentnum)

        onGoingCallApi(row, agentnum);
      })
      .catch((error) => {
        //console.log("error");
      });
  };

  const onGoingCallApi = async (row, agentnum) => {
    //console.log("agentnum", agentnum, row);
    let knopayload = {
      k_number: knowlaritydatas?.Knowlarity_Number,
      agent_number: agentnum?.country_code + agentnum?.phone,
      customer_number: "+" + row?.MobileCountry_Id + row?.Mobile_Number,
      caller_id: knowlaritydatas?.Knowlarity_CallerId,
      caller_name: row?.Name,
    };

    //console.log("knopayload", knopayload);
    await axios
      .post(
        `https://kpi.knowlarity.com/Basic/v1/account/call/makecall`,
        knopayload,
        {
          headers: {
            // "Accept": "application/json",
            // "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
            // "Authorization": "09049056-87dd-4867-bf9e-2cd0f3382be2",

            Accept: "application/json",
            "x-api-key": knowlaritydatas?.Header_Key,
            Authorization: knowlaritydatas?.API_Key,
          },
        }
      )
      .then((res) => {
        //console.log("callres", res);
        setShowDial(true);
      })
      .catch((error) => {
        //console.log("error");
      });
  };

  const calllogs = () => {
    axios
      .get(
        `${BASE_URL}/user/KnowlarityCallLogsCRUD/?start_Date=2020-04-16&end_Date=&UserId=${localStorage.getItem(
          "UserId"
        )}&Module=Contact`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        //console.log("calllogsresss", res.data);
        // setKnowlaritydatas(res?.data);
        // setcallogsdetails(res.data)
        const mynumberList = res?.data?.filter((item) =>
          item.Agent_Number.includes(userDetails?.PhoneNo)
        );

        const lastIndexData = mynumberList[0];
        //console.log("lastIndexData", mynumberList, lastIndexData);

        setDuration(lastIndexData?.Call_Duration);
        setCallRecording(lastIndexData?.Call_Recording);
        setMissedRang(lastIndexData?.Call_Duration);

        if (lastIndexData?.Agent_Number?.includes("User Disconnected")) {
          setStatus("User Disconnected");
        } else if (lastIndexData?.Agent_Number?.includes("Customer Missed")) {
          setStatus("Customer Missed");
        } else {
          setStatus("Connected");
        }
        setIsLoading(false);
        setAnchorEl(true);
      })
      .catch((error) => {
        //console.log("error");
      });
  };

  useEffect(async () => {
    getKnowlarityConfiguration();

    const series = await fetchTransactionSeries("Callcenter_Activity");
    console.log("Callcenter_Activity series", series);
    setSeriesValue(series);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        calllogs();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleEditorChange = (event) => {
    const value = event.editor.getData();
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");
    const textContent = doc.body.textContent || "";
    setNotes(textContent);
  };

  //console.log("contactdatainpage", contactdata, contactdatas);

  // Move to Lead

  const [leadtomove, setLeadtoMove] = useState(false);

  const CallCenterMovetoLead = async () => {
    //console.log("LeadCheck", leadtomove);
    try {
      const response = await axios.put(
        `${BASE_URL}/user/UserCallCenterListCRUD/`,
        {
          id: leadtomove?.id,
          Created_Date: leadtomove?.date,
          Organization_Id: leadtomove?.orgid,
          User_Id: localStorage.getItem("UserId"),
        },
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      toast.success("Contact Moved successfully", {
        position: "top-right",
        autoClose: 100,
      });
      handleRefetch();
      setLeadtoMove(false);
    } catch (error) {
      //console.log("error", error);
    }
  };

  return (
    <>
      {/* Dialog for the Create contact List */}
      <Dragabledialog
        maxWidth="sm"
        sx
        open={Boolean(openCreateList)}
        title="Create Contact List"
      >
        <DialogContent sx={{ mt: 2 }}>
          <Customgrid>
            <Grid item colSpan={3}>
              <Typography sx={[input_label]}>List Name</Typography>
            </Grid>
            <Grid item colSpan={9}>
              <TextField
                // className={`w-full input-box2`}
                id="outlined-basic"
                placeholder="Enter List Name"
                variant="outlined"
                onChange={(e) => {
                  setListName(e.target.value);
                }}
                value={listName}
                InputProps={{
                  style: {
                    borderRadius: "5px",
                  },
                }}
              />
              {errors?.listName && (
                <Div sx={{ color: "red", fontSize: "12px" }}>
                  List name is required
                </Div>
              )}
            </Grid>
            <Grid item colSpan={3}>
              <Typography sx={[input_label]}>Location</Typography>
            </Grid>
            <Grid item colSpan={9}>
              <Autocomplete
                multiple
                // id="size-small-filled-multi"
                size="small"
                //  defaultValue={[top100Films[13]]}
                options={allLocationList || []}
                renderTags={(value, getTagProps) =>
                  value?.map((option, index) => (
                    <Chip
                      sx={{ fontSize: "12px" }}
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option) {
                    return option;
                  }
                  return "";
                }}
                // value={location}
                // defaultValue={location}
                onChange={(e, newValue) => {
                  //console.log("newValue", newValue);
                  setLocation(newValue);
                }}
                // className={`${location?.length <= 2 ? "search-select3" : ""}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      fontSize: "12px !important",
                      borderRadius: "5px",
                    }}
                    placeholder={location?.length > 0 ? "" : "Location"}
                  />
                )}
              />
              {errors?.location && (
                <Div sx={{ color: "red", fontSize: "12px" }}>
                  location is required
                </Div>
              )}
            </Grid>

            <Grid item colSpan={3}>
              <Typography sx={[input_label]}>Industry Type</Typography>
            </Grid>
            <Grid item colSpan={9}>
              <Autocomplete
                options={lookupdata}
                multiple
                // id="size-small-filled-multi"
                size="small"
                renderTags={(value, getTagProps) =>
                  value?.map((option, index) => (
                    <Chip
                      sx={{ fontSize: "12px" }}
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                    />
                  ))
                }
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option) {
                    return option;
                  }
                  return "";
                }}
                // value={slectIndustry}
                // defaultValue={slectIndustry}
                onChange={(e, newValue) => {
                  setSlectIndustry(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      borderRadius: "5px",
                    }}
                    placeholder={
                      slectIndustry?.length > 0 ? "" : "Industry Type"
                    }
                  />
                )}
              />
              {errors?.slectIndustry && (
                <Div sx={{ color: "red", fontSize: "12px" }}>
                  Industry is required
                </Div>
              )}
            </Grid>
          </Customgrid>

          <Grid container align="left" mt={2} spacing={2}>
            <Grid item align="right" xs={6}>
              <CustomButton
                onClick={createConactList}
                Icon="saveIcon"
                type="submit"
                label="Save"
              />
            </Grid>
            <Grid item align="left" xs={6}>
              <Cancelbutton
                label="Cancel"
                onClick={() => {
                  if (
                    Boolean(
                      listName?.trim() ||
                        location?.length > 0 ||
                        slectIndustry?.length > 0
                    )
                  ) {
                    setContactCancel(true);
                  } else {
                    setOpenCreateList(false);
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dragabledialog>
      {/* close dialog */}
      <DialogBox
        open={contactCancel}
        onClickNo={() => {
          setContactCancel(false);
        }}
        onClickYes={() => {
          setContactCancel(false);
          setOpenCreateList(false);
          setListName("");
          setLocation([]);
          setSlectIndustry([]);
          // setErrors({})
        }}
      />

      {/* user list modal */}
      <Dragabledialog maxWidth="lg" open={Boolean(contactpage)}>
        <DialogTitle
          sx={[DisplayFlex, dialogFontSize]}
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
          {contactpage?.ListName}
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <CallContactList
            setContactpage={setContactpage}
            selectedUsers={selectedUsers}
            allSelectedMails={allSelectedMails}
            setAllSelect={setAllSelect}
            setSelectedUsers={setSelectedUsers}
            id={contactpage?.id}
          />

          <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
            <CustomButton
              Icon="saveIcon"
              onClick={createTodayList}
              type="submit"
              label="Save"
            />

            <Cancelbutton
              label="Cancel"
              onClick={() => setContactpage(false)}
            />
          </Div>
        </DialogContent>
      </Dragabledialog>

      {/* user Calls Activeities */}
      <Dragabledialog maxWidth="lg" open={Boolean(userCallsActivities)}>
        <DialogTitle
          sx={[
            DisplayFlex,
            dialogFontSize,
            { justifyContent: "space-between" },
          ]}
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
          Call History
          <IconButton
            className="text-black dark:text-white"
            onClick={() => setUserCallsActivities(false)}
            sx={{ float: "right", mr: -2 }}
          >
            <CloseIcon
              className="text-black dark:text-white"
              sx={{ fontSize: "22px !important" }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <ParticularCallHistory
            setUserCallsActivities={setUserCallsActivities}
            activitiesList={activitiesList}
            datePicker={filterDate}
            id={userCallsActivities?.row}
            index={userCallsActivities?.index}
          />
        </DialogContent>
      </Dragabledialog>
      {/* delete contact list dialog  */}
      <DialogBox
        Content={deletedWarnigMsg}
        open={deleteDialog}
        onClickNo={() => {
          setDeleteDialog(false);
        }}
        onClickYes={() => {
          setDeleteDialog(false);
          deleteContactList(deleteDialog);
          // setErrors({})
        }}
      />

      {/* call section */}
      <Dialog
        open={showDial && !Boolean(anchorEl)}
        // onClose={onClosed}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            backgroundColor: "#0070B9",
            overflow: "hidden",
            // borderTopRightRadius: "12px",
            // borderRadiusTopleft: "12px",
          }}
        >
          {/* <IconButton
              onClick={() => {
                return setShowDial(false), setNoteCall(false);
              }}
              sx={{
                right: "10px",
                top: "8px",
                position: "absolute",
                opacity: "87%",
              }}
            >
              <CloseIcon size={24} color="#FFFFFF" />
            </IconButton> */}
          <Stack
            sx={{
              overflow: "hidden",
              width: "350px",
              height: "400px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                <Div
                  sx={{
                    width: "100%",
                    height: "200px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Div
                    sx={{
                      width: "100px",
                      height: "100px",
                      backgroundColor: "green",
                      borderRadius: "50%",
                      position: "relative",
                      zIndex: "2",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        fontSize: "30px",
                        borderColor: "common.white",
                        boxShadow: "inset 0px 0px 5px white",
                        color: "#3498db",
                        fontWeight: "900",
                      }}
                    >
                      {callDialog?.Name?.substring(0, 2)?.toUpperCase()}
                    </Avatar>
                  </Div>
                  <Div
                    sx={{
                      width: "115px",
                      height: "115px",
                      position: "absolute",
                      backgroundColor: "#F2F2F2",
                      opacity: "25%",
                      borderRadius: "50%",
                    }}
                  ></Div>
                  <Div
                    sx={{
                      width: "130px",
                      height: "130px",
                      position: "absolute",
                      backgroundColor: "#F2F2F2",
                      opacity: "20%",
                      borderRadius: "50%",
                    }}
                  ></Div>
                  <Div
                    sx={{
                      width: "145px",
                      height: "145px",
                      position: "absolute",
                      backgroundColor: "#F2F2F2",
                      opacity: "15%",
                      borderRadius: "50%",
                    }}
                  ></Div>
                </Div>
                <Div sx={{ textAlign: "center" }}>
                  <Typography
                    id="Typography-root"
                    variant="h3"
                    mb={1}
                    sx={{
                      fontSize: "28px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                    }}
                    color={"common.black"}
                  >
                    {callDialog?.Name}
                  </Typography>
                  <Typography sx={{ color: "#F2F2F2", fontSize: "12px" }}>
                    {callDialog?.Mobile_Number}
                  </Typography>
                </Div>

                <Div
                  sx={{
                    mt: 2,
                    gap: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Div>
                    <IconButton
                      onClick={() => setVolume(false)}
                      sx={{
                        display: volume ? "" : "none",
                        borderRadius: "50%",
                        padding: "8px",
                        color: "black",
                        backgroundColor: "white",
                        ":hover": { backgroundColor: "white", opacity: 0.8 },
                      }}
                    >
                      <VolumeUp fontSize="16px" color="black" />
                    </IconButton>
                    <IconButton
                      onClick={() => setVolume(true)}
                      sx={{
                        display: !volume ? "" : "none",
                        borderRadius: "50%",
                        padding: "8px",
                        color: "black",
                        backgroundColor: "white",
                        opacity: 0.8,
                        ":hover": { backgroundColor: "white", opacity: 0.8 },
                      }}
                    >
                      <VolumeOff fontSize="16px" color="black" />
                    </IconButton>
                  </Div>
                  <IconButton
                    sx={{
                      borderRadius: "50%",
                      padding: "8px",
                      color: "white",
                      backgroundColor: "red",
                      ":hover": {
                        backgroundColor: "white",
                        color: "red",
                      },
                    }}
                    onClick={() => setIsLoading(true)}
                  >
                    <CallEnd fontSize="13px" color="red" />
                  </IconButton>
                  <Div>
                    <IconButton
                      onClick={() => setMic(false)}
                      sx={{
                        display: mic ? "" : "none",
                        borderRadius: "50%",
                        padding: "8px",
                        color: "black",
                        backgroundColor: "white",
                        ":hover": { backgroundColor: "white", opacity: 0.9 },
                      }}
                    >
                      <MicOff fontSize="16px" color="black" />
                    </IconButton>
                    <IconButton
                      onClick={() => setMic(true)}
                      sx={{
                        display: !mic ? "" : "none",
                        borderRadius: "50%",
                        padding: "8px",
                        color: "black",
                        backgroundColor: "white",
                        opacity: 0.8,
                        ":hover": { backgroundColor: "white", opacity: 0.8 },
                      }}
                    >
                      <Mic fontSize="16px" color="black" />
                    </IconButton>
                  </Div>
                </Div>
                <Div
                  sx={{
                    textAlign: "center",
                    borderRadius: "5px",
                    marginTop: "30px",
                    fontSize: "16px",
                    backgroundColor: "white",
                    padding: "10px",
                  }}
                >
                  Connecting . . . .
                </Div>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* call submit form */}
      <Dragabledialog maxWidth="lg" open={Boolean(anchorEl)}>
        <DialogTitle
          sx={[
            DisplayFlex,
            dialogFontSize,
            { justifyContent: "space-between" },
          ]}
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
          Create Call Notes
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Customgrid columnCount={4}>
            <Grid item>
              <Typography sx={[input_label]}>
                Call Center Id
                <span className="required">
                  {seriesValue == "Automatic" ? "" : "*"}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="input-box2 w-full"
                placeholder="# Call Center Id"
                value={callCenterId}
                onChange={(e) => {
                  setCallCenterId(e.target.value);
                }}
                disabled={seriesValue == "Automatic" ? true : ""}
              />
              {errors?.callCenterId && (
                <Div style={{ color: "red" }}>{errors?.callCenterId}</Div>
              )}
            </Grid>
            <Grid item>
              <Typography sx={[input_label]}>Call Status</Typography>
            </Grid>
            <Grid item>
              {" "}
              <Autocomplete
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.value) {
                    return option?.value;
                  }
                  return "";
                }}
                options={option}
                value={status}
                onChange={(e, newValue) => {
                  //console.log("newValue", newValue);
                  setStatus(newValue);
                }}
                id="outlined-basic"
                className="search-select3 w-full"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      borderRadius: "10px",
                    }}
                    placeholder="Call Status"
                  />
                )}
              />
              {errors?.status && (
                <Div style={{ color: "red" }}>Call Status {errors?.status}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Call Context</Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 w-full"
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.value) {
                    return option?.value;
                  }
                  return "";
                }}
                value={callcontext}
                options={contaxtoptions}
                onChange={(e, newValue) => {
                  //console.log("newValue", newValue);
                  setCallContext(newValue);
                }}
                id="outlined-basic"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      borderRadius: "10px",
                    }}
                    placeholder="Call Context"
                  />
                )}
              />
              {errors?.callcontext && (
                <Div style={{ color: "red" }}>
                  Call Context {errors?.callcontext}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Call Busy Hour</Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 w-full"
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.value) {
                    return option?.value;
                  }
                  return "";
                }}
                value={busy}
                options={BusyHroptions}
                onChange={(e, newValue) => {
                  //console.log("newValue", newValue);
                  setBusy(newValue);
                }}
                id="outlined-basic"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      borderRadius: "10px",
                    }}
                    placeholder="Call Busy Hour"
                  />
                )}
              />
              {errors?.busy && (
                <Div style={{ color: "red" }}>
                  Call Busy Hour {errors?.busy}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>
                Call Coversation Status
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 w-full"
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.value) {
                    return option?.value;
                  }
                  return "";
                }}
                value={callconvstatus}
                options={callconvoptions}
                onChange={(e, newValue) => {
                  //console.log("newValue", newValue);
                  setCallconvstatus(newValue);
                }}
                id="outlined-basic"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      borderRadius: "10px",
                    }}
                    placeholder="Call Status"
                  />
                )}
              />
              {errors?.callconvstatus && (
                <Div style={{ color: "red" }}>
                  Call Coversation Status {errors?.callconvstatus}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Call Duration</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="input-box2 w-full"
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
                placeholder="Enter Call Duration"
                type="number"
                value={duration}
                InputProps={{
                  endAdornment: (
                    <Typography sx={[FontStyle, { textAlign: "right" }]}>
                      Seconds
                    </Typography>
                  ),
                }}
              />
              {errors?.duration && (
                <Div style={{ color: "red" }}>
                  Call Duration {errors?.duration}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Next Scheduled Date</Typography>
            </Grid>
            <Grid item>
              <TextField
                type="datetime-local"
                value={nextdate}
                onChange={(e) => {
                  setNextDate(e.target.value);
                }}
                id="outlined-basic"
                variant="outlined"
                className="input-box2 w-full"
              />
              <FormGroup sx={{ display: nextdate ? "block" : "none" }}>
                <FormControlLabel
                  control={<Checkbox checked={show} onChange={setreminder} />}
                  label={
                    <Typography sx={[input_label1]}>Set Reminder</Typography>
                  }
                />
              </FormGroup>
              {errors?.nextdate && (
                <Div style={{ color: "red" }}>
                  Next Scheduled Date {errors?.nextdate}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Notes</Typography>
            </Grid>
            <Grid item colSpan={10} xs={12}>
              <CKEditor
                initData={notes}
                className={`${errors["notes"] && "border-1 border-danger"}`}
                onChange={handleEditorChange}
              />
              {errors?.notes && (
                <Div style={{ color: "red" }}>Notes {errors?.notes}</Div>
              )}
            </Grid>
          </Customgrid>

          <Div sx={[DisplayFlex, { justifyContent: "center", mt: 2 }]}>
            <CustomButton
              type="submit"
              label="Save"
              onClick={callActiviesFunc}
              Icon="saveIcon"
            />
          </Div>
        </DialogContent>

        <Dragabledialog
          open={isReminderSet}
          onClose={() => handleDialogClose(false)}
          maxWidth={"md"}
        >
          <DialogTitle
            sx={[DisplayFlex, dialogTitle, { cursor: "move" }]}
            id="draggable-dialog-title"
          >
            Reminder
          </DialogTitle>
          <DialogContent>
            <Box mt={2} sx={{ height: "200px !important" }}>
              <Customgrid columnCount={4}>
                <Grid item colSpan={4}>
                  <Typography sx={[input_label]}>
                    First Reminder Before Due
                  </Typography>
                </Grid>

                <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                  <Div>
                    <TextField
                      className="w-full input-box2"
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Enter Time"
                      value={firstRemainder}
                      onChange={(e) => {
                        setfirstRemainder(e.target.value);
                      }}
                    />
                  </Div>
                  <Div>
                    <Autocomplete
                      className="w-full search-select3"
                      sx={{ width: "100px !important" }}
                      options={[
                        { name: "Days" },
                        { name: "Hrs" },
                        { name: "Mins" },
                      ]}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option?.name) {
                          return option?.name;
                        }
                        return "";
                      }}
                      value={firstREmainderHrs}
                      onChange={(e, newValue) => {
                        setfirstREmainderHrs(newValue?.name || "");
                        // functiondate(newValue)
                      }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                    />
                  </Div>
                </Grid>

                <Grid item colSpan={4}>
                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox />}
                      label={
                        <Typography sx={[input_label]}>Repeat Every</Typography>
                      }
                    />
                  </FormGroup>
                </Grid>

                <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                  <Div>
                    <TextField
                      className="w-full input-box2"
                      id="outlined-basic"
                      variant="outlined"
                      placeholder="Enter Time"
                      value={repeatEvery}
                      onChange={(e) => {
                        setrepeatEvery(e.target.value);
                      }}
                    />
                  </Div>
                  <Div>
                    <Autocomplete
                      className="w-full search-select3"
                      sx={{ width: "100px !important" }}
                      options={[{ name: "Hrs" }, { name: "Mins" }]}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option?.name) {
                          return option?.name;
                        }
                        return "";
                      }}
                      value={Repeateveryhrs}
                      onChange={(e, newValue) => {
                        setRepeateveryhrs(newValue.name);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                    />
                  </Div>
                </Grid>

                <Grid item colSpan={4}>
                  <Typography
                    //   id="Typography-root"
                    sx={[input_label]}
                  >
                    Reminder Message
                  </Typography>
                </Grid>

                <Grid item colSpan={8}>
                  <Div>
                    <CustomCKEditor
                      editor={ClassicEditor}
                      data={editorContent}
                      content={editorContent}
                      onChange={onChange}
                    />
                  </Div>
                </Grid>
              </Customgrid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Div
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
                mt: 2,
              }}
            >
              <CustomButton
                label="Save"
                Icon="saveIcon"
                onClick={() => handleDialogClose(true)}
              />
              <Cancelbutton onClick={() => handleDialogClose(false)} />
            </Div>
            {/* <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
                <Button onClick={() => handleDialogClose(true)} color="primary">OK</Button> */}
          </DialogActions>
        </Dragabledialog>
      </Dragabledialog>

      <JumboContentLayoutMain>
        <Card>
          {/* popup for upload */}
          <Dialog
            open={openUpload}
            // onClose={() => setOpenUpload(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors?.Mblue,
                color: "white",
                pt: 2,
              }}
            >
              <Typography sx={{ fontSize: "18px", verticalAlign: "middle" }}>
                Upload Contact
              </Typography>
              <IconButton
                onClick={() => setOpenUpload(false)}
                sx={{ float: "right" }}
              >
                <CloseIcon size={24} className="text-black dark:text-white" />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography>
                  Before Import Contacts you must confirm the data in the
                  prescribed template which shall be used to import data to the
                  CRMFarm. <br />
                  <br />
                  If you don't have the template please download the template
                  here.
                </Typography>
                <Div sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    sx={{
                      backgroundColor: "green",
                      color: "#fff",
                      ":hover": {
                        backgroundColor: "green",
                        opacity: 0.9,
                        color: "#fff",
                      },
                    }}
                    onClick={downloadTemplate}
                  >
                    Download Template
                  </Button>
                </Div>
                <Typography variant="caption">Import</Typography>
                <DndWrapper>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} onChange={upLoad} />
                    <Typography variant={"body1"}>
                      Drag 'n' drop some files here, or click to select files
                    </Typography>
                    <Typography
                      variant="subtitle"
                      sx={{ marginLeft: { md: "7rem", xs: "3rem" } }}
                    >
                      OR
                    </Typography>
                    <Div
                      position={"absolute"}
                      alignContent={"center"}
                      justifyContent={"center"}
                    >
                      <input type="file" id="upload" onChange={upLoad} hidden />
                      <label
                        htmlFor="upload"
                        style={{ backgroundColor: "#F5F7FA !important" }}
                      >
                        <Button
                          sx={{
                            display: "inline-block",
                            backgroundColor: "#3588F3 !important",
                            padding: "0.5rem",
                            fontFamily: "sans-serif",
                            borderRadius: "0.3rem",
                            cursor: "pointer",
                            marginTop: "1rem",
                            color: "#fff", // Change this color to your desired color
                            marginLeft: { md: "5rem", xs: "2rem" },
                          }}
                        >
                          Browse file
                        </Button>
                      </label>
                    </Div>
                  </div>
                </DndWrapper>
                {/* <Typography variant={"h4"}>Files</Typography> */}
                <List disablePadding sx={{ display: "flex" }}>
                  {files}
                </List>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          {/* popup for add contacts */}
          <Dialog
            open={openAddContact1}
            // onClose={() => setOpenAddContact1(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                fontSize: "18px",
                backgroundColor: Colors?.Mblue,
                color: "white",
                pt: 2,
              }}
            >
              Add Contact
              <IconButton
                className="text-black dark:text-white"
                sx={{ float: "right", mt: -1, mr: -3 }}
                onClick={() => {
                  setOpenAddContact1(false);
                  reset();
                }}
              >
                <CancelOutlined />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit1(onsubmit1)}>
                <DialogContentText id="alert-dialog-description">
                  <Div>
                    <Typography sx={[FontStyle, {}]}>Contact Name</Typography>
                    <TextField
                      {...register1("name")}
                      className={`col-12 input-box ${
                        errors?.name ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      id="outlined-basic"
                      placeholder="Enter your name"
                      variant="outlined"
                    />
                    <Div style={{ color: "red" }}>{errors1.name?.message}</Div>
                  </Div>
                  <Div className="">
                    <FormControl className="col-md-4">
                      <Typography
                        mb={0.1}
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "black",
                          mt: 1,
                          mb: 0.2,
                        }}
                      >
                        Country
                      </Typography>
                      <Select
                        name="selectedCountry"
                        {...register1("selectedCountry")}
                        className={`react-select-box ${
                          errors?.selectedCountry ? "is-invalid" : ""
                        }`}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        options={Country.getAllCountries()}
                        onChange={(item) => {
                          setSelectedCountry(item);
                          //console.log("item", item);
                          setSelectedState("");
                          setSelectedCity("");
                          setCode(item.phonecode);
                          setValue1("selectedCountry", item.name);
                        }}
                        placeholder="Select Country"
                      />
                      <Div style={{ color: "red" }}>
                        {errors1.selectedCountry?.message}
                      </Div>
                    </FormControl>

                    <FormControl className="col-md-4">
                      <Typography
                        mb={0.1}
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "black",
                          mt: 1,
                          mb: 0.2,
                        }}
                      >
                        State
                      </Typography>
                      <Select
                        name="selectedState"
                        {...register1("selectedState")}
                        className={`react-select-box ${
                          errors?.selectedState ? "is-invalid" : ""
                        }`}
                        options={State.getStatesOfCountry(
                          selectedCountry?.isoCode
                        )}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        value={selectedState}
                        onChange={(item) => {
                          setSelectedState(item);
                          setSelectedCity("");
                          setValue1("selectedState", item.name);
                        }}
                        placeholder="Select State"
                      />
                      <Div style={{ color: "red" }}>
                        {errors1.selectedState?.message}
                      </Div>
                    </FormControl>

                    <FormControl className="col-md-4">
                      <Typography
                        mb={0.1}
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "black",
                          mt: 1,
                          mb: 0.2,
                        }}
                      >
                        City
                      </Typography>
                      <Select
                        name="selectedCity"
                        {...register1("selectedCity")}
                        className={`react-select-box ${
                          errors?.selectedCity ? "is-invalid" : ""
                        }`}
                        options={City.getCitiesOfState(
                          selectedState?.countryCode,
                          selectedState?.isoCode
                        )}
                        value={selectedCity}
                        getOptionLabel={(options) => {
                          return options["name"];
                        }}
                        getOptionValue={(options) => {
                          return options["name"];
                        }}
                        onChange={(item) => {
                          setSelectedCity(item);
                          setValue1("selectedCity", item.name);
                        }}
                        placeholder="Select City"
                      />
                      <Div style={{ color: "red" }}>
                        {errors1.selectedCity?.message}
                      </Div>
                    </FormControl>
                  </Div>
                  <Div className="mt-1s">
                    <FormControl className="col-2">
                      <Typography
                        mb={0.1}
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "black",
                          mt: 1,
                          mb: 0.2,
                        }}
                      >
                        Code
                      </Typography>
                      <TextField
                        name="code"
                        {...register1("code")}
                        className={`input-box ${
                          errors?.code ? "is-invalid" : ""
                        }`}
                        value={code}
                        placeholder="code"
                        autoFocus={code === ""}
                      />
                      {!code ? (
                        <Div style={{ color: "red" }}>
                          {errors1.code?.message}
                        </Div>
                      ) : null}
                    </FormControl>

                    <FormControl className="col-10">
                      <Typography
                        mb={0.1}
                        sx={{
                          fontWeight: 500,
                          fontSize: "14px",
                          color: "black",
                          mt: 1,
                          mb: 0.2,
                        }}
                      >
                        Mobile Number
                      </Typography>
                      <TextField
                        {...register1("mobilenumber")}
                        className={`input-box  ${
                          errors?.mobilenumber ? "is-invalid" : ""
                        }`}
                        type="number"
                        min="0"
                        id="outlined-basic"
                        onChange={(e) => {
                          setMobilenumber(e.target.value);
                        }}
                        placeholder="Enter Mobile Number"
                        variant="outlined"
                        autoFocus={mobilenumber === ""}
                      />
                      <Div style={{ color: "red" }}>
                        {errors1.mobilenumber?.message}
                      </Div>
                    </FormControl>
                  </Div>
                  <Div>
                    <Typography
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "black",
                        mt: 1,
                        mb: 0.2,
                      }}
                    >
                      E-mail
                    </Typography>
                    <TextField
                      {...register1("mail")}
                      className={`col-12 input-box ${
                        errors?.mail ? "is-invalid" : ""
                      }`}
                      id="outlined-basic"
                      onChange={(e) => {
                        setMail(e.target.value);
                      }}
                      placeholder="Enter Mail Id"
                      variant="outlined"
                      autoFocus={mail === ""}
                    />
                    {!mail ? (
                      <Div style={{ color: "red" }}>
                        {errors1.mail?.message}
                      </Div>
                    ) : null}
                  </Div>
                  <Div>
                    <Typography
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "black",
                        mt: 1,
                        mb: 0.2,
                      }}
                    >
                      Organization Name
                    </Typography>
                    <TextField
                      {...register1("orgname")}
                      className={`col-12 input-box ${
                        errors?.orgname ? "is-invalid" : ""
                      }`}
                      id="outlined-basic"
                      onChange={(e) => {
                        setOrgname(e.target.value);
                      }}
                      placeholder="Enter Organization Name"
                      variant="outlined"
                      autoFocus={orgname === ""}
                    />
                    {!orgname ? (
                      <Div style={{ color: "red" }}>
                        {errors1.orgname?.message}
                      </Div>
                    ) : null}
                  </Div>
                  <FormControl className="col-12">
                    <Typography
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color: "black",
                        mt: 1,
                        mb: 0.2,
                      }}
                    >
                      Industry
                    </Typography>
                    <Select
                      name="industry"
                      {...register1("industry")}
                      className={`react-select-box ${
                        errors?.industry ? "is-invalid" : ""
                      }`}
                      getOptionLabel={(option) => option.industry_type}
                      getOptionValue={(option) => option.industry_type}
                      options={contacts}
                      onChange={(item) => {
                        setIndustry(item.industry_type);
                        setValue1("industry", item.industry_type);
                      }}
                      placeholder="Select Industry"
                    />
                    {!industry ? (
                      <Div style={{ color: "red" }}>
                        {errors1.industry?.message}
                      </Div>
                    ) : (
                      ""
                    )}
                  </FormControl>
                </DialogContentText>

                <Grid container align="center" mt={2} spacing={2} pb={2}>
                  <Grid item align="right" xs={6}>
                    <CustomButton Icon="saveIcon" type="submit" label="Save" />
                  </Grid>
                  <Grid item align="left" xs={6}>
                    <Cancelbutton
                      label="Cancel"
                      onClick={() => setAddContactCancel(true)}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>

          {/*Child Dialog box */}
          <DialogBox
            open={addContactCancel}
            onClickNo={() => setAddContactCancel(false)}
            onClickYes={() => {
              setAddContactCancel(false);
              setOpenAddContact1(false);
              reset1();
              resetFunction();
              handleReset();
            }}
          />

          {/* popup for AddActivity */}
          <Dialog
            open={openActivity}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={[dialogheading, DialogHeader, DisplayFlex]}
            >
              Create Activity
              {/* <IconButton
                onClick={() => setOpenActivity(false)}
                sx={{ float: "right" }}
              >
                <CloseIcon size={24} color="white" />
              </IconButton> */}
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(onsubmit)}>
                {/* <DialogContentText id="alert-dialog-description"> */}
                <Grid container>
                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>Date</Typography>

                      <TextField
                        {...register("selectDate")}
                        type="date"
                        className={`col-12 input-box ${
                          errors?.selectDate ? "is-invalid" : ""
                        }`}
                        id="outlined-basic"
                        placeholder="Select Date"
                        variant="outlined"
                        onChange={(e) => {
                          //console.log("e.target.value", e.target.value);
                          setValue("selectDate", e.target.value);
                          setSelectDate(e.target.value);
                        }}
                        onBlur={handleBlur}
                        // onMouseLeave={handleHover}

                        InputProps={{
                          style: {
                            borderRadius: "5px",
                          },
                        }}
                      />
                      <Div style={{ color: "red" }}>
                        {errors?.selectDate?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>Company Name</Typography>
                      <TextField
                        {...register("comname")}
                        className={`col-12 input-box ${
                          errors?.comname ? "is-invalid" : ""
                        }`}
                        id="outlined-basic"
                        placeholder="Enter Company Name"
                        variant="outlined"
                        onChange={(e) => {
                          setComname(e.target.value);
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "5px",
                          },
                        }}
                      />
                      <Div style={{ color: "red" }}>
                        {errors?.comname?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>
                        Conatct Number
                      </Typography>
                      <TextField
                        {...register("pnumber")}
                        className={`col-12 input-box ${
                          errors?.pnumber ? "is-invalid" : ""
                        }`}
                        id="outlined-basic"
                        placeholder="Conatct Number"
                        variant="outlined"
                        onChange={(e) => {
                          setPnumber(e.target.value);
                        }}
                        InputProps={{
                          style: {
                            borderRadius: "5px",
                          },
                        }}
                      />
                      <Div style={{ color: "red" }}>
                        {errors?.pnumber?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <FormControl className="col-12">
                        <Typography sx={[FontStyle, {}]}>
                          Activity relates to
                        </Typography>
                        <Autocomplete
                          {...register("activity")}
                          options={dropdownList}
                          onChange={(e, newValue) => {
                            setValue("activity", newValue);
                            setActivity(newValue);
                          }}
                          className={`col-md-12 input-select1  ${
                            errors?.activity ? "is-invalid" : ""
                          }`}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              value={activity}
                              placeholder="Acyivity relates to"
                            />
                          )}
                        />
                      </FormControl>
                      <Div style={{ color: "activity" }}>
                        {errors?.name?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>Receiver</Typography>
                      <Autocomplete
                        {...register("receiver")}
                        options={condatas}
                        className={`col-12 input-select1  ${
                          errors?.receiver ? "is-invalid" : ""
                        }`}
                        getOptionLabel={(option) => option?.Name}
                        value={condatas.find(
                          (option) => option?.Name === receiver
                        )}
                        onChange={(e, newValue) => {
                          //console.log("name", newValue?.Name);
                          setContactid(newValue?.id);
                          // setReceiver(newValue?.Name);
                          setValue("receiver", newValue?.Name);
                          setReceiver(newValue?.Name);
                        }}
                        id="outlined-basic"
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Receiver" />
                        )}
                      />
                      <Div style={{ color: "red" }}>
                        {errors?.receiver?.message}
                      </Div>
                    </Div>
                  </Grid>
                  {/*  */}
                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <FormControl className="col-12">
                        <Typography sx={[FontStyle, {}]}>
                          Activity Type
                        </Typography>
                        <Autocomplete
                          {...register("type")}
                          onChange={(e, newValue) => {
                            setValue("type", newValue);
                            setType(newValue);
                          }}
                          options={dropdownvisit}
                          className={`col-md-12 input-select1  ${
                            errors?.type ? "is-invalid" : ""
                          }`}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Activity Type"
                            />
                          )}
                        />
                      </FormControl>
                      <Div style={{ color: "red" }}>
                        {errors?.type?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>
                        Next Scheduled Date & Time
                      </Typography>
                      {isDateField1 ? (
                        <TextField
                          {...register("next")}
                          className={`col-12 input-box ${
                            errors?.next ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            setValue("next", e.target.value);
                            setNext(e.target.value);
                          }}
                          type="date"
                          id="outlined-basic"
                          onBlur={handleBlur1}
                          placeholder="Next Scheduled Date & Time"
                          variant="outlined"
                          InputProps={{
                            style: {
                              borderRadius: "5px",
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          className={`col-12 input-box ${
                            errors?.next ? "is-invalid" : ""
                          }`}
                          onMouseEnter={handleHover1}
                          type="text"
                          id="outlined-basic"
                          placeholder="Next Scheduled Date & Time"
                          variant="outlined"
                          InputProps={{
                            style: {
                              borderRadius: "5px",
                            },
                          }}
                        />
                      )}
                      <Div style={{ color: "red" }}>
                        {errors?.next?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={6} lg={6} xs={12}>
                    <Div>
                      <FormControl className="col-12">
                        <Typography sx={[FontStyle, {}]}>Status</Typography>
                        <Autocomplete
                          {...register("activitystatus")}
                          onChange={(e, newValue) => {
                            // setActivityStatus(e.target.value);
                            setValue("activitystatus", newValue);
                            setActivityStatus(newValue);
                          }}
                          options={dropdownStatus}
                          className={`col-md-12 input-select1  ${
                            errors?.activitystatus ? "is-invalid" : ""
                          }`}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Status"
                            />
                          )}
                        />
                      </FormControl>
                      <Div style={{ color: "red" }}>
                        {errors?.activitystatus?.message}
                      </Div>
                    </Div>
                  </Grid>

                  <Grid item md={12} lg={12} xs={12}>
                    <Div>
                      <Typography sx={[FontStyle, {}]}>Details</Typography>
                      <TextField
                        {...register("details")}
                        onChange={(e) => {
                          setDetails(e.target.value);
                        }}
                        className={`col-12 input-box ${
                          errors?.details ? "is-invalid" : ""
                        }`}
                        id="outlined-basic"
                        placeholder="Enter Details"
                        variant="outlined"
                        InputProps={{
                          style: {
                            borderRadius: "5px",
                          },
                        }}
                        multiline
                        row={5}
                      />
                      <Div style={{ color: "red" }}>
                        {errors?.details?.message}
                      </Div>
                    </Div>
                  </Grid>
                </Grid>
                {/* </DialogContentText> */}

                <Grid container align="center" mt={1} spacing={2}>
                  <Grid item align="right" xs={6}>
                    <CustomButton Icon="saveIcon" type="submit" label="Save" />
                  </Grid>
                  <Grid item align="left" xs={6}>
                    <Cancelbutton
                      label="Cancel"
                      onClick={() => setSave(true)}
                    />
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>
          {/*Child Dialog box */}
          <DialogBox
            open={save}
            onClickNo={() => setSave(false)}
            onClickYes={() => {
              setSave(false);
              setOpenAddContact1(false);
              setOpenActivity(false);
              reset1();
              resetFunction();
              handleReset();
            }}
          />

          {/* popup for weekly graph */}
          <Dragabledialog maxWidth="lg" open={Boolean(openWeeklyGraph)}>
            <DialogTitle
              sx={[
                DisplayFlex,
                dialogFontSize,
                { justifyContent: "space-between" },
              ]}
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
            >
              Weekly Graph
              <IconButton onClick={() => setOpenWeeklyGraph(false)}>
                <RiCloseFill className="text-black dark:text-white" />
              </IconButton>
            </DialogTitle>
            <DialogContent
              sx={{
                // mt: -3,
                pl: -2,
              }}
            >
              <Grid
                container
                sx={{ minWidth: { xs: 392, sm: 400 }, height: "100%" }}
              >
                <Grid item xs={12} m={2}>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={data}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        labelStyle={{ fontSize: "12px !important" }}
                        itemStyle={{ fontSize: "12px !important" }}
                        cursor={true}
                        formatter={(value, name) => [value, name]}
                      />
                      <Legend />
                      <defs>
                        <linearGradient x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#6200EE"
                            stopOpacity={1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#B819D2"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <defs>
                        <linearGradient x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#1ABBDE"
                            stopOpacity={1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#09BCA7"
                            stopOpacity={1}
                          />
                        </linearGradient>
                      </defs>
                      <ReferenceLine y={80} stroke="red" label="Target" />
                      <Bar
                        sx={{ fontSize: "12px !important" }}
                        dataKey="Contact"
                        fill={"#750075"}
                      />
                      <Bar
                        sx={{ fontSize: "12px !important" }}
                        dataKey="Appointment"
                        fill={"#FFA500"}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
              </Grid>
            </DialogContent>
          </Dragabledialog>

          {/* popup for summary */}
          <Dialog
            open={openSummary}
            // onClose={() => setOpenSummary(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={[
                dialogheading,
                DisplayFlex,
                DialogHeader,
                { p: 0, px: 1, justifyContent: "space-between" },
              ]}
            >
              Summary
              <IconButton
                sx={{ float: "right" }}
                onClick={() => setOpenSummary(false)}
              >
                <RiCloseFill style={{ color: "white" }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box>
                <Div
                  sx={{
                    borderRadius: "10px",
                    p: 3,
                    backgroundColor: avatarColors[8],
                    height: 110,
                    mb: 1.4,
                    boxSizing: "border-box !important",
                  }}
                >
                  <Div sx={[DisplayFlex, { gap: "10px" }]}>
                    <Div
                      sx={[
                        DisplayFlex,
                        {
                          justifyContent: "center",
                          height: "50px",
                          width: "80px",
                          borderRight: "1px solid lightgray",
                          // backgroundColor: avatarLightColors[idx],
                        },
                      ]}
                    >
                      <FaCalendarDays
                        style={{ color: "white", fontSize: 25 }}
                      />
                    </Div>
                    <Div sx={{ width: "70%" }}>
                      <Typography
                        sx={{
                          color: "whitesmoke",
                          fontWeight: 600,
                          textAlign: "center",
                          fontSize: "30px !important",
                        }}
                      >
                        {format(new Date(), "LLLL")}
                        {/* {} */}
                      </Typography>
                      <Typography
                        sx={[
                          {
                            fontSize: "14px !important",
                            textAlign: "center",
                            // transform: "translateX(50%)",
                            color: "whitesmoke",
                            fontWeight: 600,
                          },
                        ]}
                      >
                        MONTH
                      </Typography>
                    </Div>
                  </Div>
                </Div>

                <Div
                  sx={{
                    borderRadius: "10px",
                    p: 3,
                    backgroundColor: avatarColors[9],
                    height: 110,
                    my: 1.4,
                    boxSizing: "border-box !important",
                  }}
                >
                  <Div sx={[DisplayFlex, { gap: "10px" }]}>
                    <Div
                      sx={[
                        DisplayFlex,
                        {
                          justifyContent: "left",
                          height: "50px",
                          width: "80px",
                          borderRight: "1px solid lightgray",
                          // backgroundColor: avatarLightColors[idx],
                        },
                      ]}
                    >
                      <FaArrowsDownToPeople
                        style={{ color: "white", fontSize: 25 }}
                      />
                    </Div>
                    <Div sx={{ width: "70%" }}>
                      <Typography
                        sx={{
                          color: "whitesmoke",
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: "30px",
                        }}
                      >
                        <Counter
                          maximum={targetSummary?.Weekly_Call_Target}
                          speed={50}
                        />
                        {/* {} */}
                      </Typography>
                      <Typography
                        sx={[
                          {
                            fontSize: "14px !important",
                            textAlign: "left",
                            // transform: "translateX(50%)",
                            color: "whitesmoke",
                            fontWeight: 600,
                          },
                        ]}
                      >
                        {"Weekly Contact Goal"?.toUpperCase()}
                      </Typography>
                    </Div>
                  </Div>
                </Div>
                <Div
                  sx={{
                    borderRadius: "10px",
                    p: 3,
                    backgroundColor: avatarColors[7],
                    height: 110,
                    mt: 1.4,
                    boxSizing: "border-box !important",
                  }}
                >
                  <Div sx={[DisplayFlex, { gap: "10px" }]}>
                    <Div
                      sx={[
                        DisplayFlex,
                        {
                          justifyContent: "left",
                          height: "50px",
                          width: "80px",
                          borderRight: "1px solid lightgray",
                          // backgroundColor: avatarLightColors[idx],
                        },
                      ]}
                    >
                      <FaPeopleRobbery
                        style={{ color: "white", fontSize: 25 }}
                      />
                    </Div>
                    <Div sx={{ width: "70%" }}>
                      <Typography
                        sx={{
                          color: "whitesmoke",
                          fontWeight: 600,
                          textAlign: "left",
                          fontSize: "30px",
                        }}
                      >
                        <Counter
                          maximum={targetSummary?.Weekly_Visit_Target}
                          speed={50}
                        />
                        {/* {} */}
                      </Typography>
                      <Typography
                        sx={[
                          {
                            fontSize: "14px !important",
                            textAlign: "left",
                            // transform: "translateX(50%)",
                            color: "whitesmoke",
                            fontWeight: 600,
                          },
                        ]}
                      >
                        {"Weekly Meeting Goal"?.toUpperCase()}
                      </Typography>
                    </Div>
                  </Div>
                </Div>
              </Box>
            </DialogContent>
          </Dialog>

          {/* create target dialog */}
          <Dragabledialog maxWidth="md" open={Boolean(openCreateTarget)}>
            <DialogTitle
              sx={[
                DisplayFlex,
                dialogFontSize,
                { justifyContent: "space-between" },
              ]}
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
            >
              {`${
                targetSummary?.Weekly_Call_Target ? "Update" : "Create"
              } Target`}

              <IconButton
                sx={{ float: "right" }}
                onClick={() => setOpenCreateTarget(false)}
              >
                <RiCloseFill />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 1 }}>
              <Customgrid>
                <Grid item>
                  <Typography sx={[input_label]}>Caller Name</Typography>
                </Grid>
                <Grid item>
                  <Autocomplete
                    options={allUsers}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option) {
                        return option;
                      }
                      return "";
                    }}
                    value={callerName}
                    onChange={(e, newValue) => {
                      setCallerName(newValue);
                    }}
                    className={`search-select3 w-full  ${
                      errors?.type ? "is-invalid" : ""
                    }`}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Caller name" />
                    )}
                  />
                  {errors?.callerName && (
                    <Div style={{ color: "red" }}>
                      Caller Name {errors?.callerName}
                    </Div>
                  )}
                </Grid>

                <Grid item>
                  <Typography sx={[input_label]}>
                    Call Target Per/Day
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    className={`w-full input-box2 ${
                      errors?.next ? "is-invalid" : ""
                    }`}
                    value={callTarget}
                    onChange={(e) => setCallTarget(e.target.value)}
                    type="number"
                    id="outlined-basic"
                    placeholder="call target per day"
                    variant="outlined"
                    InputProps={{
                      style: {
                        borderRadius: "5px",
                      },
                    }}
                  />
                  {errors?.callTarget && (
                    <Div style={{ color: "red" }}>
                      Call Target Per/Day {errors?.callTarget}
                    </Div>
                  )}
                </Grid>

                <Grid item>
                  <Typography sx={[input_label]}>
                    Fix Appointment Per/day
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    className={`w-full input-box2 ${
                      errors?.next ? "is-invalid" : ""
                    }`}
                    value={appointmentTarget}
                    onChange={(e) => {
                      setAppointmentTarget(e.target.value);
                    }}
                    type="number"
                    id="outlined-basic"
                    placeholder="Fix appointment per day"
                    variant="outlined"
                    InputProps={{
                      style: {
                        borderRadius: "5px",
                      },
                    }}
                  />
                  {errors?.appointmentTarget && (
                    <Div style={{ color: "red" }}>
                      Fix Appointment Per/day {errors?.appointmentTarget}
                    </Div>
                  )}
                </Grid>
              </Customgrid>

              <Grid container align="center" mt={1} spacing={2}>
                <Grid item align="right" xs={6}>
                  <CustomButton
                    onClick={
                      targetSummary?.Weekly_Call_Target
                        ? submitUpdateTarget
                        : submitCreateTarget
                    }
                    Icon="saveIcon"
                    type="submit"
                    label={`${
                      targetSummary?.Weekly_Call_Target ? "Update" : "Save"
                    }`}
                  />
                </Grid>
                <Grid item align="left" xs={6}>
                  <Cancelbutton
                    label="Cancel"
                    onClick={() => setSaveCreateTarget(true)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
          </Dragabledialog>
          {/* close dialog */}
          <DialogBox
            open={saveCreateTarget}
            onClickNo={() => {
              setSaveCreateTarget(false);
            }}
            onClickYes={() => {
              setSaveCreateTarget(false);
              setOpenCreateTarget(false);
              // setErrors({})
            }}
          />

          {/* popup for weekly report */}
          <Dragabledialog maxWidth="lg" open={Boolean(openWeeklyReport)}>
            <DialogTitle
              sx={[
                DisplayFlex,
                dialogFontSize,
                { justifyContent: "space-between" },
              ]}
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
            >
              Weekly Report
              <IconButton onClick={() => setOpenWeeklyReport(false)}>
                <RiCloseFill className="text-black dark:text-white" />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <JumboScrollbar
                autoHeight={true}
                autoHideTimeout={4000}
                autoHeightMin={!more ? 280 : "75vh"}
                autoHide={true}
                hideTracksWhenNotNeeded
              >
                <Grid container columns={12} mt={2}>
                  <Grid item md={10} lg={10} xs={12} xl={10}>
                    <Table
                    // className="table table-bordered"
                    // style={{ border: "1px solid black" }}
                    >
                      <TableHead className="">
                        <CRMTableRow>
                          <CRMTableCell></CRMTableCell>
                          {DaysHeader?.map((day, i) => {
                            return (
                              <CRMTableCell
                                key={i}
                                style={{ fontSize: "12px !important" }}
                              >
                                {day}
                              </CRMTableCell>
                            );
                          })}

                          <CRMTableCell style={{ fontSize: "12px !important" }}>
                            Total
                          </CRMTableCell>
                        </CRMTableRow>
                      </TableHead>
                      <TableBody>
                        {combineValues?.length > 0 &&
                          combineValues?.map((combine, index) => {
                            return (
                              <CRMTableRow key={index}>
                                <CRMTableCell>
                                  <Typography sx={[FontStyle]}>
                                    {combine?.week}
                                  </Typography>
                                </CRMTableCell>
                                {combine?.values?.map((value, valueIndex) => {
                                  return (
                                    <CRMTableCell key={valueIndex}>
                                      <Typography sx={[FontStyle]}>
                                        {value?.count}
                                      </Typography>
                                    </CRMTableCell>
                                  );
                                })}
                                {combine?.values?.length === 7 ? (
                                  <CRMTableCell>{combine?.total}</CRMTableCell>
                                ) : (
                                  <>
                                    {Array.from({
                                      length: 7 - combine?.values?.length,
                                    }).map((_, i) => (
                                      <CRMTableCell key={i}>-</CRMTableCell>
                                    ))}
                                    <CRMTableCell>
                                      {combine?.total || 0}
                                    </CRMTableCell>
                                  </>
                                )}
                              </CRMTableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </Grid>
                  <Grid
                    item
                    md={2}
                    lg={2}
                    xs={12}
                    xl={2}
                    sx={{ pl: { xs: 0, sm: 3 } }}
                  >
                    {buttons}
                  </Grid>
                </Grid>

                <Typography
                  sx={[
                    FontStyle,
                    ButtonStyle,
                    {
                      mt: 1,
                      cursor: "pointer",
                      color: Colors?.Mblue,
                    },
                  ]}
                  onClick={() => {
                    setMore(!more);
                  }}
                >
                  {more === false ? "More Details" : "See Less"}{" "}
                  {!more ? (
                    <MdOutlineKeyboardArrowDown size={16} color="black" />
                  ) : (
                    <MdOutlineKeyboardArrowUp size={16} color="black" />
                  )}
                </Typography>

                {more === true && (
                  <>
                    <Typography sx={[dialogTitle, { mt: 2 }]}>
                      Contact Made
                    </Typography>
                    <Grid container columns={12}>
                      <Grid item md={10} lg={10} xs={12} xl={10}>
                        <Table
                        // className="table table-bordered"
                        // style={{ border: "1px solid black" }}
                        >
                          <TableHead className="">
                            <CRMTableRow>
                              <CRMTableCell></CRMTableCell>
                              {DaysHeader?.map((day, i) => {
                                return (
                                  <CRMTableCell
                                    key={i}
                                    style={{ fontSize: "12px !important" }}
                                  >
                                    {day}
                                  </CRMTableCell>
                                );
                              })}
                              <CRMTableCell
                                style={{ fontSize: "12px !important" }}
                              >
                                Total
                              </CRMTableCell>
                            </CRMTableRow>
                          </TableHead>
                          <TableBody>
                            {currentActs?.length > 0 &&
                              currentActs?.map((item, index) => {
                                // //console.log(
                                //   "Current",
                                //   currentActs[currentActs?.length - 1]
                                // );
                                return (
                                  <CRMTableRow key={index}>
                                    <CRMTableCell>{item?.week}</CRMTableCell>

                                    {item?.values?.map((value, index1) => {
                                      return (
                                        <CRMTableCell key={index1}>
                                          <Typography sx={[FontStyle]}>
                                            {value?.count}
                                          </Typography>
                                        </CRMTableCell>
                                      );
                                    })}
                                    {/* {(currentActs?.length - 1 !== index) && <CRMTableCell>{item?.total}</CRMTableCell>} */}

                                    {item?.values?.length === 7 ? (
                                      <CRMTableCell>{item?.total}</CRMTableCell>
                                    ) : (
                                      <>
                                        {Array.from({
                                          length: 7 - item?.values?.length,
                                        }).map((_, i) => (
                                          <CRMTableCell key={i}>-</CRMTableCell>
                                        ))}
                                        <CRMTableCell>
                                          {item?.total || 0}
                                        </CRMTableCell>
                                      </>
                                    )}
                                  </CRMTableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        lg={2}
                        xs={12}
                        xl={2}
                        sx={{ pl: { xs: 0, sm: 3 } }}
                      >
                        {buttons1}
                      </Grid>
                    </Grid>
                    <Typography sx={[dialogTitle, { mt: 3 }]}>
                      Appointment Made
                    </Typography>

                    <Grid container columns={12}>
                      <Grid item md={10} lg={10} xs={12} xl={10}>
                        <Table
                        // className="table table-bordered"
                        // style={{ border: "1px solid black" }}
                        >
                          <TableHead className="">
                            <CRMTableRow>
                              <CRMTableCell> </CRMTableCell>
                              {DaysHeader?.map((day, i) => {
                                return (
                                  <CRMTableCell
                                    key={i}
                                    style={{ fontSize: "12px !important" }}
                                  >
                                    {day}
                                  </CRMTableCell>
                                );
                              })}
                              <CRMTableCell
                                style={{ fontSize: "12px !important" }}
                              >
                                Total
                              </CRMTableCell>
                            </CRMTableRow>
                          </TableHead>
                          <TableBody>
                            {currentVisits?.length > 0 &&
                              currentVisits?.map((item, index) => {
                                return (
                                  <CRMTableRow key={index}>
                                    <CRMTableCell>{item?.week}</CRMTableCell>
                                    {item?.values?.map((value, index1) => {
                                      return (
                                        <CRMTableCell key={index1}>
                                          <Typography sx={[FontStyle]}>
                                            {value?.count}
                                          </Typography>
                                        </CRMTableCell>
                                      );
                                    })}
                                    {item?.values?.length === 7 ? (
                                      <CRMTableCell>{item?.total}</CRMTableCell>
                                    ) : (
                                      <>
                                        {Array.from({
                                          length: 7 - item?.values?.length,
                                        }).map((_, i) => (
                                          <CRMTableCell key={i}>-</CRMTableCell>
                                        ))}
                                        <CRMTableCell>
                                          {item?.total || 0}
                                        </CRMTableCell>
                                      </>
                                    )}
                                  </CRMTableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        lg={2}
                        xs={12}
                        xl={2}
                        sx={{ pl: { xs: 0, sm: 3 } }}
                      >
                        {/* <ButtonGroup
                          orientation="vertical"
                          aria-label="vertical contained button group"
                          variant="contained"
                        > */}
                        {buttons2}
                        {/* </ButtonGroup> */}
                      </Grid>
                    </Grid>
                  </>
                )}
              </JumboScrollbar>
            </DialogContent>
          </Dragabledialog>

          {/*  Main Code For Design Page */}

          <Div sx={{ display: Boolean(mainpage) ? "block" : "none", my: 2 }}>
            <Grid
              container
              columns={12}
              spacing={2}
              // sx={{ minHeight: "810px" }}
            >
              {/* right side */}
              <Grid item xs={12} md={12} xl={12}>
                <Card
                  sx={{
                    pb: 4,
                    mb: 2,
                    boxShadow: "none",
                    border: "1px solid #EEEEEE",
                    // minHeight: "800px",
                    borderRadius: "5px",
                  }}
                >
                  <Grid
                    container
                    columns={12}
                    sx={{
                      p: 1,
                      px: 2,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #ECECEC",
                    }}
                  >
                    <Div sx={[DisplayFlex]}>
                      <AvatarCircle
                        title={set}
                        label={set}
                        subLabel={
                          <Div
                            sx={{
                              display: "flex",
                            }}
                          >
                            <FiberManualRecord
                              sx={{
                                fontSize: "10px",
                                ml: -0.3,
                                mt: -0.3,
                                color: localStorage?.getItem("isLoggedIn")
                                  ? "lightgreen"
                                  : "lightgray",
                              }}
                            />
                            <Typography
                              sx={[
                                FontStyle,
                                { fontSize: "9px !important", mt: -0.5 },
                              ]}
                            >
                              {localStorage?.getItem("isLoggedIn")
                                ? "Online"
                                : "Offline"}
                            </Typography>
                          </Div>
                        }
                      />
                    </Div>

                    <Div sx={[DisplayFlex]}>
                      <Div>
                        <IconButton
                          onClick={() =>
                            navigate("/customer-support/ticket-livecharts")
                          }
                          size="small"
                          // sx={{ ml: 1 }}
                          aria-controls={
                            Boolean(anchorEl1) ? "account-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            Boolean(anchorEl1) ? "true" : undefined
                          }
                        >
                          <PiWechatLogo size={20} color={"green"} />
                        </IconButton>
                      </Div>

                      {/* Settting popup view */}
                      <Div>
                        <IconButton
                          onClick={handleClick}
                          size="small"
                          // sx={{ ml: 1 }}
                          aria-controls={
                            Boolean(anchorEl1) ? "account-menu" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            Boolean(anchorEl1) ? "true" : undefined
                          }
                        >
                          <SettingsOutlinedIcon sx={{ color: Colors?.Mblue }} />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl1}
                          id="account-menu"
                          open={Boolean(anchorEl1)}
                          onClose={() => setAnchorEl1(null)}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          <MenuItem
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <AvatarCircle
                              title={set}
                              label={set}
                              subLabel={
                                <Div
                                  sx={{
                                    display: "flex",
                                  }}
                                >
                                  <FiberManualRecord
                                    sx={{
                                      fontSize: "10px",
                                      ml: -0.3,
                                      mt: -0.3,
                                      color: localStorage?.getItem("isLoggedIn")
                                        ? "lightgreen"
                                        : "lightgray",
                                    }}
                                  />
                                  <Typography
                                    sx={[
                                      FontStyle,
                                      { fontSize: "9px !important", mt: -0.5 },
                                    ]}
                                  >
                                    {localStorage?.getItem("isLoggedIn")
                                      ? "Online"
                                      : "Offline"}
                                  </Typography>
                                </Div>
                              }
                            />
                          </MenuItem>

                          <Divider />
                          {/* <MenuItem onClick={handleClose}>Notes</MenuItem> */}
                          <MenuItem
                            onClick={() => {
                              setOpenCreateTarget(true);
                            }}
                          >
                            {`${
                              targetSummary?.Weekly_Call_Target
                                ? "Update"
                                : "Create"
                            } Target`}
                          </MenuItem>
                        </Menu>
                      </Div>
                    </Div>
                  </Grid>

                  {/* Activities Division */}
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-4 mt-3">
                        <CRMCalendar date={datePicker} setDate={setDatPicker} />
                      </div>
                      <div className="col-md-8">
                        <div class="row mt-3">
                          <div class="col-xxl-12 col-xl-12 col-lg-12 col-md-6 col-sm-6 col-12">
                            <div class="card custom-card bg-primary-transparent border-0 shadow-none">
                              <div class="card-body p-4">
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                  <div class="main-card-icon primary">
                                    <div class="avatar avatar-lg bg-primary-transparent border border-primary border-opacity-10">
                                      <div class="avatar avatar-sm svg-white">
                                        <FaCalendarDays
                                          style={{
                                            color: "white",
                                            fontSize: 25,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-left">
                                    {" "}
                                    <span
                                      class="d-block mb-1"
                                      // style={{ fontSize: "large" }}
                                    >
                                      {" "}
                                      {format(new Date(), "LLLL")}
                                    </span>
                                    <h5 class="fw-medium d-block mb-0">
                                      <span class="text-success fw-semibold fs-12  d-inline-block">
                                        MONTH
                                        <i class="ri-arrow-up-s-line align-middle mx-1"></i>
                                      </span>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xxl-12 col-xl-12 col-lg-12 col-md-6 col-sm-6 col-12">
                            <div class="card custom-card bg-secondary-transparent border-0 shadow-none">
                              <div class="card-body p-4">
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                  <div class="main-card-icon secondary">
                                    <div class="avatar avatar-lg bg-secondary-transparent border border-secondary border-opacity-10">
                                      <div class="avatar avatar-sm svg-white">
                                        <FaArrowsDownToPeople
                                          style={{
                                            color: "white",
                                            fontSize: 25,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-left">
                                    {" "}
                                    <span
                                      class="d-block mb-1"
                                      // style={{ fontSize: "large" }}
                                    >
                                      <Counter
                                        maximum={
                                          targetSummary?.Weekly_Call_Target
                                        }
                                        speed={50}
                                      />
                                    </span>
                                    <h5 class="fw-medium d-block mb-0">
                                      <span class="text-danger fw-semibold fs-12 d-inline-block">
                                        {" "}
                                        {"Weekly Contact Goal"?.toUpperCase()}
                                        <i class="ri-arrow-down-s-line align-middle mx-1"></i>
                                      </span>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="col-xxl-12 col-xl-12 col-lg-12 col-md-6 col-sm-6 col-12">
                            <div class="card custom-card bg-success-transparent border-0 shadow-none">
                              <div class="card-body p-4">
                                <div class="d-flex align-items-center gap-3 flex-wrap">
                                  <div class="main-card-icon success">
                                    <div class="avatar avatar-lg bg-success-transparent border border-success border-opacity-10">
                                      <div class="avatar avatar-sm svg-white">
                                        <FaPeopleRobbery
                                          style={{
                                            color: "white",
                                            fontSize: 25,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-left">
                                    {" "}
                                    <span
                                      class="d-block mb-1"
                                      // style={{ fontSize: "large" }}
                                    >
                                      <Counter
                                        maximum={
                                          targetSummary?.Weekly_Visit_Target
                                        }
                                        speed={50}
                                      />
                                    </span>
                                    <h5 class="fw-medium d-block mb-0">
                                      <span class="text-success fw-semibold fs-12 ms-2 d-inline-block">
                                        {"Weekly Meeting Goal"?.toUpperCase()}
                                        <i class="ri-arrow-up-s-line align-middle mx-1"></i>
                                      </span>
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Grid
                    container
                    spacing={2}
                    sx={{
                      p: 1,
                      height: 411,
                    }}
                  >
                    <Grid item xs={12} md={12} lg={12} sx={{ mt: 2 }}>
                      <Card sx={{ borderRadius: "5px", boxShadow: 1 }}>
                        <JumboScrollbar
                          autoHeight={true}
                          autoHideTimeout={4000}
                          autoHeightMin={404.5}
                          autoHide={true}
                          hideTracksWhenNotNeeded
                          // id="no-more-tables"
                        >
                          <Div>
                            <Typography
                              sx={[DisplayFlex, { px: 1 }]}
                              style={{
                                padding: "10px",
                                backgroundColor: "#edf2fa",
                                color: "#233758",
                                fontWeight: "600",
                                fontSize: "13px",
                              }}
                            >
                              Upcoming Activities
                            </Typography>
                            {upactivities?.length > 0 ? (
                              upactivities?.map((data, index) => {
                                return (
                                  <Div
                                    key={index}
                                    sx={[DisplayFlex, { p: 0.5 }]}
                                  >
                                    <AvatarCircle
                                      title={moment(data?.Created_Date).format(
                                        "MMM D"
                                      )}
                                      fullTitle={true}
                                      label={
                                        <Typography sx={[FontStyle]}>
                                          {data?.Receiver_Name +
                                            " scheduled on " +
                                            new Date(
                                              data?.Next_SheduledTime
                                            )?.toLocaleDateString(undefined, {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                            }) +
                                            " " +
                                            new Date(
                                              data?.Next_SheduledTime
                                            )?.toLocaleTimeString(undefined, {
                                              hour12: true,
                                            })}
                                        </Typography>
                                      }
                                      labelColor="black"
                                    />
                                  </Div>
                                );
                              })
                            ) : (
                              <NoRecordsPage title="Upcoming Activities" />
                            )}
                          </Div>
                        </JumboScrollbar>
                      </Card>
                    </Grid>

                    <Grid
                      sx={{
                        display:
                          datePicker < new Date().toISOString().split("T")[0] &&
                          Boolean(datePicker)
                            ? "block"
                            : "none",
                      }}
                      item
                      xs={12}
                      md={6}
                    >
                      <Card sx={{ borderRadius: "5px", boxShadow: 1 }}>
                        <JumboScrollbar
                          autoHeight={true}
                          autoHideTimeout={4000}
                          autoHeightMin={404.5}
                          autoHide={true}
                          hideTracksWhenNotNeeded
                          // id="no-more-tables"
                        >
                          <Div>
                            <Typography
                              sx={[dialogheading, DisplayFlex, { px: 1 }]}
                            >
                              Closed Activities
                            </Typography>
                            {closedactivities?.length > 0 ? (
                              closedactivities?.map((data, index) => {
                                return (
                                  <Div
                                    key={index}
                                    sx={[DisplayFlex, { p: 0.5 }]}
                                  >
                                    <AvatarCircle
                                      title={moment(
                                        data?.Next_SheduledTime
                                      ).format("MMM D")}
                                      fullTitle={true}
                                      label={
                                        <Typography sx-={[FontStyle]}>
                                          {data?.Receiver_Name +
                                            " " +
                                            " closed "}
                                        </Typography>
                                      }
                                      labelColor="black"
                                    />
                                  </Div>
                                );
                              })
                            ) : (
                              <NoRecordsPage title="Closed Activities" />
                            )}
                          </Div>
                        </JumboScrollbar>
                      </Card>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              {/* left side */}
              <Grid item xs={12} md={12} xl={12}>
                <Card
                  sx={{
                    pb: 1,
                    boxShadow: "none",
                    border: "1px solid #EEEEEE",
                    borderRadius: "5px",
                  }}
                >
                  <Div
                    className="grid grid-cols-12 p-2"
                    style={{ backgroundColor: "#f1f6fd" }}
                  >
                    <Div
                      onClick={handleShowWeeklyReport}
                      className="col-span-3 cursor-pointer flex items-center gap-2"
                      style={{ borderRight: "1px dashed lightgrey" }}
                    >
                      <IconButton
                        sx={{
                          color: Colors?.Mblue,
                          mb: 0.2,
                        }}
                      >
                        <EventNoteIcon fontSize="20px" />
                      </IconButton>
                      <Typography textAlign="center" sx={[FontStyle]}>
                        Weekly Report
                      </Typography>
                    </Div>
                    <Div
                      onClick={handleShowWeeklyGraph}
                      className="col-span-3 cursor-pointer flex items-center gap-2"
                      style={{ borderRight: "1px dashed lightgrey" }}
                    >
                      <IconButton
                        sx={{
                          color: Colors?.Mblue,
                          mb: 0.2,
                        }}
                      >
                        <AssessmentIcon fontSize="20px" />
                      </IconButton>
                      <Typography textAlign="center" sx={[FontStyle]}>
                        Weekly Graph
                      </Typography>
                    </Div>
                    <Div
                      onClick={handleShowActivityStream}
                      className="col-span-3 cursor-pointer flex items-center gap-2"
                      style={{ borderRight: "1px dashed lightgrey" }}
                    >
                      <IconButton
                        sx={{
                          color: Colors?.Mblue,
                          mb: 0.2,
                          transform: "rotate(-90deg)",
                        }}
                      >
                        <ContactlessSharpIcon fontSize="20px" />
                      </IconButton>
                      <Typography textAlign="center" sx={[FontStyle]}>
                        Activity Stream
                      </Typography>
                    </Div>

                    <Div className="col-span-3 cursor-pointer flex items-center justify-end">
                      <CustomButton
                        label="Create List"
                        width={"120px"}
                        Icon="createIcon"
                        onClick={() => setOpenCreateList(true)}
                      />
                    </Div>
                  </Div>

                  {/* table tab */}
                  <Box sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                    <Div>
                      <StyledTabs
                        value={tabValue}
                        onChange={(e, newValue) => {
                          setTabValue(newValue);
                          //console.log("newValue : ", newValue);
                        }}
                        aria-label="ant example"
                      >
                        <StyledTab label="Contact List" />
                        <StyledTab label="Today's Call List" />
                      </StyledTabs>
                    </Div>
                    {tabValue == 1 && (
                      <Div sx={{ mt: { xs: 1, sm: 0 } }}>
                        <input
                          type="date"
                          name="filterDate"
                          onChange={(newDate) => {
                            console.log("newDate", newDate);
                            console.log(
                              "newDate1",
                              new Date(newDate?.target.value)
                                ?.toISOString()
                                .split("T")[0]
                            );

                            setFilterDate(
                              new Date(newDate?.target.value)
                                ?.toISOString()
                                .split("T")[0]
                            );
                            getCallCenterRefetch(
                              new Date(newDate?.target.value)
                                ?.toISOString()
                                .split("T")[0]
                            );
                          }}
                          value={filterDate}
                          style={{
                            border: "none",
                            padding: "5px",
                            outline: "none",
                            ":hover": { border: "none" },
                          }}
                        />
                      </Div>
                    )}
                  </Box>

                  <Box sx={{ p: 1 }} className="bg-gray-100">
                    <>
                      <Box
                        sx={{}}
                        className="overflow-y-auto"
                        id="no-more-tables"
                      >
                        {(tabValue == 0 ? contactdata : contactdatas).length >
                        0 ? (
                          <List sx={{ mt: 0 }}>
                            {(tabValue == 0 ? contactdata : contactdatas)?.map(
                              (row, index) => {
                                console.log("filterdata", filterDate);
                                console.log(
                                  "chekc",
                                  new Date()?.toISOString().split("T")[0]
                                );
                                //console.log("rowsssss", row);
                                //console.log("itemssss", activitiesList);
                                let statuses = activitiesList?.find(
                                  (item) =>
                                    item?.Contact_Id?.id == row?.id &&
                                    format(
                                      new Date(item?.Selected_Date),
                                      "yyyy-MM-dd"
                                    ) == format(new Date(), "yyyy-MM-dd")
                                );
                                let checkbox = Boolean(statuses?.Select_Status);
                                //console.log("lists", statuses);
                                let count = 0;
                                activitiesList?.forEach((activities) => {
                                  if (
                                    Number(activities?.Contact_Id?.id) ===
                                      Number(row?.id) &&
                                    new Date(filterDate || new Date())
                                      ?.toISOString()
                                      ?.split("T")[0] ==
                                      new Date(activities?.Selected_Date)
                                        .toISOString()
                                        ?.split("T")[0]
                                  ) {
                                    count += 1;
                                  }
                                });

                                let avatar =
                                  index >= 10
                                    ? avatarColors[index % 10]
                                    : avatarColors[index];

                                return (
                                  <Div
                                    // onMouseOver={() => setFadeEdit(idx)}
                                    // onMouseLeave={() => setFadeEdit(null)}

                                    className=""
                                    key={index}
                                    sx={{
                                      minHeight: "h-full",
                                      position: "relative",
                                      p: { xs: 0.5, sm: 2 },
                                      my: 1,

                                      bgcolor: "white",
                                      borderRadius: { xs: "5px", md: "10px" },
                                      ":hover": {
                                        boxShadow:
                                          "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important",
                                        backgroundColor: "#fff",
                                      },
                                      cursor: "default",
                                    }}
                                  >
                                    <FormControlLabel
                                      sx={{
                                        position: "absolute",
                                        top: 0,
                                        transform: "translateX(10px)",
                                      }}
                                      control={
                                        <>
                                          {Boolean(tabValue == 1) && (
                                            <Checkbox
                                              checked={checkbox}
                                              // onChange={() => {
                                              //   selectedData(data);
                                              // }}
                                              sx={{ p: 0 }}
                                              color="info"
                                              size="medium"
                                            />
                                          )}
                                        </>
                                      }
                                    />
                                    <Div className="flex justify-between items-center mb-2">
                                      <Typography
                                        title="Click to Add Today Calls"
                                        onClick={() => {
                                          row?.ListName
                                            ? setContactpage(row)
                                            : setUserCallsActivities({
                                                row,
                                                index,
                                              });
                                        }}
                                        sx={[
                                          {
                                            fontSize: "16px",
                                            fontWeight: 700,
                                            color: `${Colors?.Mblue}`,
                                            cursor: "pointer",
                                          },
                                        ]}
                                      >
                                        {row?.ListName
                                          ? row?.ListName
                                          : row?.Name}
                                      </Typography>

                                      <Div>
                                        {tabValue == 0 ? (
                                          <DeletedIcon
                                            onClick={() =>
                                              setDeleteDialog(row?.id)
                                            }
                                          />
                                        ) : (
                                          <CustomIcon
                                            Icon="callIcon"
                                            color={
                                              new Date()
                                                ?.toISOString()
                                                .split("T")[0] != filterDate
                                                ? "lightgray"
                                                : "green"
                                            }
                                            disabled={
                                              new Date()
                                                ?.toISOString()
                                                .split("T")[0] != filterDate
                                            }
                                            onClick={() => {
                                              getagentnumber(row);
                                              setCallDialog(row);
                                              setcalldata(row);
                                              setStartTimeEndTime(
                                                new Date().toISOString()
                                              );
                                            }}
                                          />
                                        )}
                                      </Div>
                                    </Div>

                                    <Grid container spacing={2}>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        sx={[
                                          DisplayFlex,
                                          { gap: "10px !important" },
                                        ]}
                                      >
                                        <Typography
                                          sx={[
                                            {
                                              fontSize: "14px",
                                              color: "#828282",
                                            },
                                          ]}
                                        >
                                          <span
                                            style={{
                                              fontWeight: 700,
                                              color: "#5e5e5e",
                                            }}
                                          >
                                            Industries:
                                          </span>{" "}
                                        </Typography>
                                        {tabValue == 0 && row?.ListIndustry && (
                                          <CustomWidthTooltip
                                            title={row?.ListIndustry?.map(
                                              (item, ind) => {
                                                return (
                                                  <span
                                                    style={{
                                                      fontSize: "14px",
                                                      color: "green",
                                                    }}
                                                    key={ind}
                                                  >
                                                    {item},{" "}
                                                  </span>
                                                );
                                              }
                                            )}
                                          >
                                            <Div className="flex items-center gap-1 flex-wrap">
                                              {row?.ListIndustry?.map(
                                                (item, ind) => {
                                                  if (ind === 0) {
                                                    return (
                                                      <Typography
                                                        sx={{
                                                          fontSize: "14px",
                                                        }}
                                                        key={ind}
                                                      >
                                                        {item}{" "}
                                                        {row?.ListIndustry
                                                          ?.length > 1 && (
                                                          <span> ...</span>
                                                        )}
                                                      </Typography>
                                                    );
                                                  }
                                                }
                                              ) || ""}
                                            </Div>
                                          </CustomWidthTooltip>
                                        )}
                                        {tabValue == 1 && (
                                          <Div className="flex items-center gap-1 flex-wrap">
                                            <Typography
                                              sx={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              {row?.Industry_Type}
                                            </Typography>
                                          </Div>
                                        )}
                                      </Grid>

                                      {tabValue == 1 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              Mobile Number :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {row?.Mobile_Number || " - "}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {tabValue == 1 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              No of Calls :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {count || 0}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {tabValue == 1 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              Time :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {Boolean(statuses?.Start_Time)
                                              ? new Date(
                                                  statuses?.Start_Time
                                                )?.toLocaleTimeString("en-IN", {
                                                  hour: "numeric",
                                                  minute: "numeric",
                                                  second: "numeric",
                                                  hour12: true,
                                                })
                                              : "-"}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {tabValue == 1 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              Call Status :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {statuses?.Select_Status || "-"}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {tabValue == 1 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <CustomButton
                                            onClick={() => {
                                              // //console.log(
                                              //   "row?.Selected_Date",
                                              //   row?.Selected_Date
                                              // );
                                              setLeadtoMove({
                                                id: row?.id,
                                                date: new Date()
                                                  ?.toISOString()
                                                  ?.split("T")[0],
                                                orgid:
                                                  localStorage.getItem(
                                                    "OrganizationId"
                                                  ),
                                              });
                                            }}
                                            Icon="moveIcon"
                                            label="Move to Lead"
                                            width="150px"
                                          />
                                        </Grid>
                                      )}
                                      {tabValue == 0 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              Location :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {row?.Location && (
                                              <CustomWidthTooltip
                                                title={row?.Location?.map(
                                                  (item, ind) => {
                                                    return (
                                                      <span
                                                        style={{
                                                          color: "green",
                                                        }}
                                                        key={ind}
                                                      >
                                                        {item}
                                                        {row?.Location?.length >
                                                          1 && ","}{" "}
                                                      </span>
                                                    );
                                                  }
                                                )}
                                              >
                                                {row?.Location?.map(
                                                  (item, ind) => {
                                                    if (ind === 0) {
                                                      return (
                                                        <Typography
                                                          sx={[
                                                            FontStyle,
                                                            {
                                                              display:
                                                                "inline-flex",
                                                              flexWrap: "wrap",
                                                            },
                                                          ]}
                                                          key={ind}
                                                        >
                                                          {item}{" "}
                                                          {row?.Location
                                                            ?.length > 1 &&
                                                            ","}{" "}
                                                        </Typography>
                                                      );
                                                    } else if (ind == 1) {
                                                      return (
                                                        <Typography
                                                          sx={[
                                                            FontStyle,
                                                            {
                                                              display:
                                                                "inline-flex",
                                                              flexWrap: "wrap",
                                                            },
                                                          ]}
                                                          key={ind}
                                                        >
                                                          {item}{" "}
                                                          {row?.Location
                                                            ?.length > 2 && (
                                                            <span> ...</span>
                                                          )}
                                                        </Typography>
                                                      );
                                                    }
                                                  }
                                                )}
                                              </CustomWidthTooltip>
                                            )}
                                          </Typography>
                                        </Grid>
                                      )}

                                      {tabValue == 0 && (
                                        <Grid
                                          item
                                          xs={12}
                                          sm={6}
                                          md={4}
                                          sx={[
                                            DisplayFlex,
                                            { gap: "10px !important" },
                                          ]}
                                        >
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                                color: "#828282",
                                              },
                                            ]}
                                          >
                                            <span
                                              style={{
                                                fontWeight: 700,
                                                color: "#5e5e5e",
                                              }}
                                            >
                                              No of Contacts :
                                            </span>{" "}
                                          </Typography>
                                          <Typography
                                            sx={[
                                              {
                                                fontSize: "14px",
                                              },
                                            ]}
                                          >
                                            {row?.Contact?.length || 0}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>
                                  </Div>
                                );
                                // }
                              }
                            )}
                          </List>
                        ) : (
                          <NoRecordsPage
                            title={
                              tabValue == 0
                                ? "Contact List"
                                : "Todays Call List "
                            }
                          />
                        )}
                      </Box>
                      <Div
                        sx={{
                          mt: 2,
                          display: "flex",
                          justifyContent: "right",
                          alignItems: "center",
                        }}
                      >
                        {
                          <Pagination
                            color="success"
                            count={Math?.ceil(contactdata?.length / count1)}
                            page={page}
                            onChange={(e, newValue) =>
                              handleChangePage(e, newValue)
                            }
                            size="small"
                            showFirstButton
                            showLastButton
                          />
                        }
                      </Div>
                    </>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Div>

          {/* Activity Table List & Activity Stream */}
          <Div sx={{ display: Boolean(showActivityStream) ? "block" : "none" }}>
            <Div
              sx={[
                DisplayFlex,
                { justifyContent: "space-between", flexWrap: "wrap" },
              ]}
              mt={2}
            >
              <Div sx={[DisplayFlex]}>
                <IconButton
                  sx={{ bgcolor: "ghostwhite", padding: "4px !important" }}
                  onClick={() => {
                    setShowActivityStream(false);
                    setMainpage(true);
                  }}
                >
                  <MdOutlineKeyboardArrowLeft
                    sx={{
                      color: "#B2B3B2",
                      cursor: "pointer",
                      fontSize: 25,
                    }}
                  />
                </IconButton>
                <Typography sx={[dialogTitle]}>
                  Daily Activity Stream
                </Typography>
              </Div>
              <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
                <SearchBar
                  SearchData={SearchData1}
                  border="1px solid lightgray !important"
                  width="250px !important"
                  color={"gray"}
                />
                {/* <Button sx={[ButtonStyle, FontStyle, DialogBoxSaveButton]} onClick={handleAddActivity}>
                      Create
                    </Button> */}
              </Div>
            </Div>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={AutoHeight(1.9)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table className="table" sx={{ mt: 1.5 }}>
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  setDatas={setActivitiesList}
                  sortDatas={activitiesList}
                />

                <TableBody className="table-body" sx={{ mt: 2 }}>
                  {activitiesList?.map((data, index) => {
                    //console.log("acctivitus ", data, index);
                    let avatar = avatarColorFun(index);

                    return (
                      <CRMTableRow>
                        {columnMenuItems[0].bool && (
                          <CRMTableCell
                            data-title="Contact Name"
                            // onClick={() => {
                            //   handleClickOverviewContact(data);
                            // }}
                            sx={{ cursor: "pointer" }}
                          >
                            <AvatarCircle
                              bgColor={avatar}
                              title={data?.Receiver_Name}
                              label={data?.Receiver_Name}
                            />
                          </CRMTableCell>
                        )}
                        {columnMenuItems[1].bool && (
                          <CRMTableCell data-title="Phone No">
                            {data?.Contact_Number}
                          </CRMTableCell>
                        )}

                        {columnMenuItems[2].bool && (
                          <CRMTableCell
                            data-title="Activity Type"
                            onClick={() => {
                              //console.log("check");
                              setShowDialog(true);
                            }}
                          >
                            {data?.Activity_Type}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[3].bool && (
                          <CRMTableCell data-title="Status" sx={[FontStyle]}>
                            {data?.Select_Status}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[4].bool && (
                          <CRMTableCell data-title="Details">
                            {data?.Details}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[5].bool && (
                          <CRMTableCell data-title="Company Name">
                            {data?.Company_Name}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[6].bool && (
                          <CRMTableCell data-title="Company Name">
                            {data?.Call_Recording}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[7].bool && (
                          <CRMTableCell data-title="Date">
                            {data?.Selected_Date}
                          </CRMTableCell>
                        )}
                        {columnMenuItems[8].bool && (
                          <CRMTableCell data-title="Activity Relates To">
                            {data?.Activity_relates}
                          </CRMTableCell>
                        )}

                        {columnMenuItems[9].bool && (
                          <CRMTableCell data-title="Next Date">
                            {formatDate(data?.Next_SheduledTime) || " - "}
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
                              justifyContent: { xs: "left", md: "center" },
                            },
                          ]}
                        >
                          {/* <EditIcon
                            onClick={() => {
                              handleClickEditContact(update);
                              handleUpdate(data);
                              setNumber(data?.id);
                              //  //console.log("Inside button");
                            }}
                          /> */}

                          {/* <DeletedIcon
                            onClick={() => {
                              handleUpdate(data);
                              handleUpdate(data);
                              setShowDelete(true);
                              //  //console.log("Inside button");
                            }}
                          /> */}
                        </CRMTableCell>
                      </CRMTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </JumboScrollbar>

            <Div
              sx={{
                mt: 2,
                display: Boolean(
                  Math?.ceil(activitiesList?.length / count) === 1
                )
                  ? "none"
                  : "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              {
                <Pagination
                  color="success"
                  count={Math?.ceil(activitiesList?.length / count)}
                  page={page}
                  onChange={(e, newValue) => handleChangePage(e, newValue)}
                  size="small"
                  showFirstButton
                  showLastButton
                />
              }
            </Div>

            {/* delete avtivities stream */}
            <DialogBox
              open={showDelete}
              Content={deletedWarnigMsg}
              onClickNo={() => setShowDelete(false)}
              onClickYes={() => {
                // setSave(false);
                setShowDelete(false);
                // reset();
                Deletedata();

                setAnchorElAction(false);
              }}
            />
            <DialogBox
              Content={LeadtoMove}
              open={Boolean(leadtomove)}
              onClickNo={() => {
                setLeadtoMove(false);
              }}
              onClickYes={() => {
                setDeleteDialog(false);
                CallCenterMovetoLead();
                // setErrors({})
              }}
            />
          </Div>

          <CallCenterEdit
            openEditContact={openEditContact}
            setOpenEditContact={setOpenEditContact}
            update={update}
            getActivityStreamRefetch={getActivityStreamRefetch}
          />
          <></>
        </Card>
      </JumboContentLayoutMain>
    </>
  );
};

export default CallCenterLeftCardLists;
