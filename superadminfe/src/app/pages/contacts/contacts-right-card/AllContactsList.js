import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  List,
  Grid,
  ListItem,
  Table,
  TableBody,
  TextField,
  Typography,
  Stack,
  Pagination,
  Box,
  useMediaQuery,
  Popover,
  alpha,
  ButtonGroup,
  Avatar,
  ListItemButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";

import {
  CallEnd,
  KeyboardDoubleArrowUp,
  Mic,
  MicOff,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import moment from "moment";
import { customHeight, deletedWarnigMsg } from "app/pages/widgets/CRMStyles";

// import CloseIcon from "@mui/icons-material/Close"
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import React, { useCallback, useEffect } from "react";
import * as yup from "yup";
import { useState, useRef } from "react";
import { debounce } from "lodash";
import DndWrapper from "../DndWrapper";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactEdit from "./ContactEdit";
import { BiFilterAlt } from "react-icons/bi";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import CloseIcon from "@mui/icons-material/Close";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import { IoCallOutline } from "react-icons/io5";
import {
  AntTab,
  AntTabs,
  ButtonStyle,
  CRMTableHead,
  Colors,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  UploadBtn,
  avatarColors,
  componentTitle,
  dialogheading,
  inputLabel,
  DialogHeader,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import { GrPowerReset } from "react-icons/gr";
import { CiMail } from "react-icons/ci";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { AutoHeight } from "app/redux/auth/localStorage";
import {
  AvatarCircle,
  Cancelbutton,
  DialogBox,
  CustomButton,
  DeletedIcon,
  EditIcon,
  InvalidateQueryUpdates,
  NoRecordsPage,
  Sendbutton,
  Uploadbutton,
  Div,
  CustomIcons,
  SelectDropdown,
  avatarColorFun,
  Dragabledialog,
  formatDate,
  CRMDateField,
} from "app/pages/widgets/StylesComponents";
import { useSelector } from "react-redux";
import { isLoadings } from "app/redux/auth/Loadingskeleton";
import randomColor from "randomcolor";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import { useQuery, useQueryClient } from "react-query";
import { TiEdit } from "react-icons/ti";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { FaGear } from "react-icons/fa6";
import { RiMailSendLine } from "react-icons/ri";
import {
  MdClose,
  MdCloudUpload,
  MdDownload,
  MdOutlineNoteAdd,
} from "react-icons/md";
import { TbActivity } from "react-icons/tb";
import TodayIcon from "@mui/icons-material/Today";
import CreateContacts from "./CreateContacts";
import NotesModel from "../extra-components/NotesModel";
import ActivityModel from "../extra-components/ActivityModel";
import ComposeEmail from "../extra-components/ComposeEmail";
import AppointmentModel from "../extra-components/AppointmentModel";
import "./Contact.css";

const AllContactsList = () => {
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const isLoading = useSelector(isLoadings);
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const [showDial, setShowDial] = useState(false);
  const [calldata, setcalldata] = useState();
  const [volume, setVolume] = useState(true);
  const [mic, setMic] = useState(true);
  const [notes, setNotes] = useState("");
  const [statusc, setStatusc] = useState("");
  const [nextdate, setNextDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [callcontext, setCallContext] = useState("");
  const [busy, setBusy] = useState("");
  const [callconvstatus, setCallconvstatus] = useState("");
  const [openAnchor, setOpenAnchor] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isLoader, setIsLoading] = useState(null);

  const [loading, setloading] = useState(false);

  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);
  // const files = acceptedFiles?.map((file) => (
  //   <ListItem selected key={file.path} sx={{ width: "auto", mr: 1 }}>
  //     {file.path} - {file.size} bytes
  //   </ListItem>
  // ));
  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Company_Name", label: "Company", bool: false },
    { sort: "Contact_Id", label: "Contact Id", bool: false },
    { sort: "Email_Id", label: "Email", bool: true },
    { sort: "Mobile_Number", label: "Phone", bool: true },
    { sort: "Created_Date", label: "Created Date", bool: true },
    { sort: "Updated_Date", label: "Updated Date", bool: false },
    { sort: "Industry_Type", label: "Industry Type", bool: true },
    // { sort: "No_Of_Days", label: "No of Days", bool: true },
    { sort: "Last_Call_Date", label: "Last Connected", bool: false },
    { sort: "No_of_Calls", label: "No of Calls", bool: true },
    { sort: "Last_Called_By", label: "Last Called By", bool: true },
    { sort: "City", label: "City", bool: false },
    { sort: "State", label: "State", bool: false },
    { sort: "Country", label: "Country", bool: false },
  ]);

  const matches = useMediaQuery("(min-width:759px)");
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();
  // const { datas1 } = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [Loading, setLoading] = useState(false);

  const [showAllContacts, setShowAllContacts] = useState("contacts");
  const [fadeEdit, setFadeEdit] = useState(false);
  const [openUploadContact, setOpenUploadContact] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [notImportedRows, setNotImportedRows] = useState([]);

  const [openNotes, setOpenNotes] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openSendMail, setOpenSendMail] = useState(false);

  const [anchorElAction, setAnchorElAction] = useState(null);
  const [openUpload, setOpenUpload] = useState(false);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openEditContact, setOpenEditContact] = useState(false);
  const [number, setNumber] = useState(1);
  const [check, setCheck] = useState(true);
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [check4, setCheck4] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // For Mail Composing Functionality

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

  const [to, setTo] = React.useState();
  const [cc, setCc] = React.useState("");
  const [showCc, setShowCc] = useState(false);
  const [subject, setSubject] = React.useState();
  const [message, setMessage] = useState("");
  const [attachFile, setAttachFile] = React.useState();
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [id, setId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshdatas, setrefreshdatas] = useState(false);
  const UserDetails = JSON.parse(localStorage.getItem("UserDetails"));
  // console.log("UserDetails",UserDetails?.email, UserDetails["email"])

  // mail sending ---------------------------------------
  const [base64DataList, setBase64DataList] = useState([]);
  const [fileNames, setFileNames] = useState([]);

  const handleFileInputChange = (e) => {
    const fileList = e.target.files;

    const promises = Array.from(fileList).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64DataArray) => {
        setBase64DataList(base64DataArray);
        const fileArray = Array.from(fileList);
        let list = [...fileNames, ...fileArray];
        setFileNames(list);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };

  const fileRemoved = (e) => {
    let list = [...fileNames];
    list?.splice(e, 1);
    let base64Array = [...base64DataList];
    base64Array?.splice(e, 1);
    setBase64DataList(base64Array);
    // alert(e)
    setFileNames(list);
  };

  const uploadFiles = () => {
    const promises = base64DataList?.map((base64Data, index) => {
      console.log(`Uploading `, fileNames);
      const payload = {
        Organization_Id: localStorage.getItem("OrganizationId"),
        File: base64Data,
        FileName: randomColor() + fileNames[index]?.name,
        Urls: "url",
        Description: "Upload File",
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
      };

      return axios.post(`${BASE_URL}/user/UserFilesandUrlsCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    });

    Promise.all(promises)
      .then((responses) => {
        console.log("Files uploaded successfully:", responses);
        MailSubmit();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
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
      });
  };

  const mailBodyContent = `<div class='card'>
  <div class='card-body'>
    <h4 className="card-subtitle mb-2 text-muted">Dear Sir,</h4>
    <div class='card-text'>
      <p>${message}</p>
      <p>Click the button to download the attachment </p>
      <div>
      ${base64DataList?.map((items, index) => (
    <a href={`${BASE_URL}/useradmin/media/${fileNames[index]?.name}`}>
      <button
        type="button"
        class="btn btn-primary"
        style="background-color:#3c7c33; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; text-decoration: none;"
      >
        Download Attachment
      </button>
    </a>
  ))}
      
      
      </div>
          </div>
  </div>
  </div>`;

  const MailSubmit = async (e) => {
    // e.preventDefault();
    var payload = {
      MailSubject: subject,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Cc: [cc],
      MailBody: mailBodyContent,
      file:
        fileNames?.length > 0
          ? fileNames?.map((fileName) => fileName?.name)
          : [],
      RecevierMailId: to,
      UserId: localStorage.getItem("UserId"),
      Contact_Id: id,
    };
    console.log("payload", payload);
    await axios
      .post(`${BASE_URL}/user/UserMailMasterCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        //  console.log("res", res);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
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
      });
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const handleUpload = () => {
    setOpenUpload(true);
  };

  const handleAddContact = () => {
    setOpenAddContact(true);
  };

  const handleClickEditContact = () => {
    //  // // // console.log("In Edit",update)
    setOpenEditContact(true);
  };

  const handleClickOverviewContact = (data) => {
    navigate(`/app/contacts/overview/${data.id}`);
    setShowAllContacts("overview");
  };

  // const countries = Country.getAllCountries();
  // //  // // // console.log("countries",countries)

  //Function for the Add Contact

  // Notification CRUD

  const handleNotification = async () => {
    var payload = {
      Organization_Id: localStorage.getItem("OrganizationId"),
      NotificationModule: "Mail",
      Notificationname: "Contact",
      NotificationMsg: "AutoResponse Mail NotAification",
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    await axios
      .post(`${BASE_URL}/user/UserNotificationCRUD/`, payload, {
        headers: {
          db: "crmuseradmin1",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        //  console.log("res", res);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
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
      });
  };
  const [File, setFile] = useState(null);
  const onDrop = React.useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    if (newFile) {
      setFile(
        Object.assign(newFile, {
          preview: URL.createObjectURL(newFile),
        }),
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  //Initialize the useState For add Contact

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mail, setMail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [colors, setColors] = useState(["#f4a4d1", "#ddda1f"]);
  const [showAddCancel, setShowAddCancel] = useState(false);
  const [showUploadCancel, setShowUploadCancel] = useState(false);
  const [deleteDatas, setDeleteDatas] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedCity1, setSelectedCity1] = useState("");

  const [datas, setDatas] = useState([]);
  const [isSortName, setIsSortName] = useState("A-Z");

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    mail: yup.string().required("Mail is required"),
    mobilenumber: yup
      .string()
      .required("Mobile Number is Required")
      .min(9, "Minium 9 digits Required")
      .max(15, "Maximum 15 digits Required"),
    // code: yup.string().required("Mobile Code is required"),
    orgname: yup.string().required("Organization Name is required"),
    selectedCity1: yup.string().required("City is required"),
    selectedCountry1: yup.string().required(" Country is Required"),
    selectedState1: yup.string().required("State is Required"),
    industry: yup.string().required("Industry is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const getAllData = async (page = 1) => {
    if (loading) return;
    if (count != 0 && !Boolean(Math.ceil(count / 10) >= page))
      return console.log("Out of Page");

    setloading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/user/ContactAllAdditional/?page=${page}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      console.log("results in contacts", response.data.results);

      setDatas((prevDatas) => {
        if (page === 1) {
          return response?.data?.results || [];
        }
        const updatedDatas = new Set([
          ...prevDatas,
          ...response?.data?.results,
        ]);
        return Array.from(updatedDatas);
      });

      setCount(response?.data?.count);
      // return response?.data || [];
    } catch (error) {
      console.log("error", error);
      return [];
    } finally {
      setloading(false);
    }
  };

  const getData = async (page = 1) => {
    if (loading) return;
    if (count != 0 && !Boolean(Math.ceil(count / 10) >= page))
      return console.log("Out of Page");
    setloading(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/user/ContactAdditional/?Created_By=${localStorage.getItem(
          "UserId",
        )}&page=${page}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setDatas((prevDatas) => {
        if (page === 1) {
          return response?.data?.results || [];
        }
        const updatedDatas = new Set([
          ...prevDatas,
          ...response?.data?.results,
        ]);
        return Array.from(updatedDatas);
      });
      setCount(response?.data?.count);
    } catch (error) {
      console.log("error", error);
      return [];
    } finally {
      setloading(false);
    }
  };

  const onsubmit = async (payload) => {
    console.log("ContactCRUD payload", payload);

    try {
      const response = await axios.post(
        `${BASE_URL}/user/ContactCRUD/`,
        payload,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log("response.data", response.data);
      toast.success("Created successfully", {
        position: "top-right",
      });
      setDatas([]);
      setOpenAddContact(false);
      setShowAllContacts("contacts");
      if (tabValue === 0) {
        console.log("page", { page });

        getAllData(page);
      } else {
        console.log("page", { page });

        getData(page);
      }
      InvalidateQueryUpdates("getUserLoopUpLists");
      reset();

      let editUser = localStorage.getItem("Username");
      let histotypayload = {
        Document_Id: response?.data?.Contact_Id,
        Updated_Person: `${editUser} Created this Contact.`,
        Module_Name: "Contact",
        Contact_Id: response?.data?.id,
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };
      console.log("histotypayload", histotypayload);
      axios
        .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Result", res.data);
        })
        .catch((res) => {
          console.log(res.message);
        });

      if (response.status === 201 && autoresponse === true) {
        if (type === "Static") {
          for (let i = 0; i < follow?.length; i++) {
            var payload1 = {
              id: 1,
              Schedule_Date: follow[i].Follow_Up_Date,
              template: modifiedContent[i],
              Recipients: [mail],
            };
            axios
              .post(`${BASE_URL}/user/AutoResponseSystem1/`, payload1, {
                headers: {
                  db: item,
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              })
              .then(() => { })
              .catch(() => { })
              .finally(() => {
                handleNotification();
              });
          }
        }

        if (type === "Dynamic") {
          var payload2 = {
            id: 1,
            start_date: startdate,
            end_date: enddate,
            every: parseInt(days),
            template: modifiedContent[0],
            Recipients: [mail],
          };
          axios
            .post(`${BASE_URL}/user/AutoResponseSystem2/`, payload2, {
              headers: {
                db: item,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            })
            .then((res) => {
              if (res.status === 400) {
                axios
                  .post(`${BASE_URL}/user/AutoResponseSystem2/`, payload2, {
                    headers: {
                      db: item,
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                  })
                  .then(() => { })
                  .catch(() => { });
              }
            })
            .catch((error) => {
              if (error.response && error.response.status === 403) {
                const errorMessage =
                  error.response.data.details ||
                  "You don't have permission to do it";
                console.log(errorMessage);
              } else {
                console.log(error.message);
              }
            })
            .finally(() => {
              handleNotification();
            });
        }
      }
    } catch (error) {
      if (error.response) {
        const { Mobile_Number, Email_Id } = error.response.data;
        if (
          Mobile_Number &&
          Mobile_Number.includes(
            "contact with this Mobile Number already exists.",
          )
        ) {
          toast.error("Mobile number already exists", {
            position: "top-right",
          });
        }
        if (
          Email_Id &&
          Email_Id.includes("contact with this Email Id already exists.")
        ) {
          toast.error("Email ID already exists", {
            position: "top-right",
          });
        }
      } else if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";
        console.log(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
        });
      } else {
        console.error("Error:", error);
      }
    }
  };

  const renderFilePreview = (file) => {
    if (file) {
      return <p>{file?.name}</p>;
    }
    return null;
  };

  // For Automatic Response
  const [autoresponse, setAutoResponse] = useState(false);
  const [tempcontent, setTempcontent] = useState([]);
  const [responselist, setResponseList] = useState([]);
  const [followup, setFollowup] = useState([]);
  const [followdate, setFollowdate] = useState([]);
  const [follow, setFollow] = useState([]);
  const [type, setType] = useState([]);
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [days, setDays] = useState(0);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/useradmin/CRMUserAutoResponseAdditional/`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setResponseList(
        res.data
          .filter((data) => data.Applied_To.includes("All Contacts"))
          ?.map((data) => data.Applied_To),
      );
      for (
        let i = 0;
        i <
        res.data
          .filter((data) => data.Applied_To.includes("All Contacts"))
          ?.map((data) => data.Applied_To)?.length;
        i++
      ) {
        try {
          const res1 = await axios.post(
            `${BASE_URL}/useradmin/CRMUserAutoResponseAdditional/`,
            {
              Applied_To: res.data
                .filter((data) => data.Applied_To.includes("All Contacts"))
                ?.map((data) => data.Applied_To)[i],
            },
            {
              headers: {
                db: "crmuseradmin1",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            },
          );
          console.log(res1.data[0].AutoResponse);
          setAutoResponse(res1.data[0].AutoResponse);
          setType(res1.data[0].Type);
          setDays(res1.data[0].Recur_EveryDays);
          setStartDate(res1.data[0].Start_Date);
          setEndDate(res1.data[0].End_Date);
          setFollow(res1.data[0].Folloup_Scheduler);
          setTempcontent(
            res1.data[0].Template_Id?.map((da) => da.Template_Content),
          );
          setFollowup(
            res1.data[0].Folloup_Scheduler?.map((da) => da.Email_Template),
          );
          setFollowdate(
            res1.data[0].Folloup_Scheduler?.map((da) => da.Follow_Up_Date),
          );
        } catch (error) {
          // console.error("Error fetching templates:", error);
        }
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const [modifiedContent, setModifiedContent] = useState([]);

  const tempData = () => {
    const replacements = {
      "[Your Name]": `${userDetails && userDetails?.username}`,
      "[Your Position/Title]": `${userDetails && userDetails?.Designation}`,
      "[Your Company]": `Foyer Technology Private Limited`,
      "[Contact Number]": `${userDetails && userDetails?.PhoneNo}`,
      "[Email Address]": `${userDetails && userDetails?.email}`,
      "[Website]": `${userDetails && userDetails?.username}`,
      "[website link]": `${userDetails && userDetails?.username}`,
      "[Contact Name]": name,
    };

    const modifiedTemplates = tempcontent?.map((template) => {
      let modifiedContent = template;
      for (const [placeholder, value] of Object.entries(replacements)) {
        modifiedContent = modifiedContent.split(placeholder).join(value);
      }
      return modifiedContent;
    });
    setModifiedContent(modifiedTemplates);
  };

  useEffect(() => {
    setTimeout(() => {
      tempData();
    }, 5000);
  }, [name]);

  // Search Functionality

  const handleSearch = useCallback(
    debounce(async (search) => {
      if (!search || !search.trim()) return;

      try {
        const res = await axios.get(
          `${BASE_URL}/user/ContactSearch/?search=${search}&Created_By=${localStorage.getItem(
            "UserId",
          )}`,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        setDatas(res.data || []);
        setCount(res?.data?.length || 0);
      } catch (error) {
        console.log("error", error);
      }
    }, 500),
    [token, item]
  );

  const SearchData = (e) => {
    const value = e.target.value;
    console.log("handleSearchange:", value, Boolean(value && value.trim() !== ""));
    setSearchQuery(value);

    if (value && value.trim() !== "") {
      handleSearch(value);
    } else {
      // "when the search has no data, dont search any and show the full list"
      handleSearch.cancel();
      setDatas([]);
      setPage(1);
      if (tabValue === 0) {
        getAllData(1);
      } else {
        getData(1);
      }
    }
  };

  // Delete the Function

  const Deletedata = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/user/ContactCRUD/?id=${update?.id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (response) {
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 100,
        });
        setDatas([]);
        if (tabValue === 0) {
          console.log("page", { page });

          getAllData(page);
        } else {
          console.log("page", { page });

          getData(page);
        }
        InvalidateQueryUpdates("getUserLoopUpLists");
        handleCloseAction();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response.data.details || "You don't have permission to do it";

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 100,
        });
      }
    }
  };

  const [update, setUpdate] = useState({});

  const handleUpdate = (data) => {
    setUpdate(data);
  };

  const resetFunction = () => {
    setName("");
    setCode("");
    setMail("");
    setOrgname("");
    setSelectedCountry("");
    setSelectedCountry1("");
    setSelectedState("");
    setSelectedState1("");
    setIndustry("");
    setMobilenumber("");
    setSelectedCity("");
    setSelectedCity1("");
  };

  const handleReset = () => {
    setValue("selectedCountry", "");
    setValue("selectedState", "");
    setValue("selectedCity", "");
    setValue("industry", "");
  };

  const dialogFilter = (event) => {
    setShowFilter(event.currentTarget);
    setPage(1);
  };

  const closeFilter = () => {
    setShowFilter(null);
  };

  const RefreshData = () => {
    setfilter(false);
    setloading(false);
    setDatas([]); // Clear the data first
    setSelectedCountry1filter("");
    setSelectedState1filter("");
    setSelectedCity1filter("");
    setIndus("");
    setFromdate("");
    setToDate("");
    setrefreshdatas(true); // Trigger refetch
    setPage(1);

    if (tabValue === 0 && filter == false) {
      console.log("page", { page });

      getAllData(page);
    } else if (tabValue === 1 && filter == false) {
      console.log("page", { page });

      getData(page);
    }

    setShowFilter(false);
  };

  //  For Dialog Popup
  const [showDialog, setShowDialog] = useState(false);

  // For Settings Icon Function

  const [contactname, setContactName] = useState(true);
  const [phone, setPhone] = useState(true);
  const [email, setEmail] = useState(true);
  const [country, setCountry] = useState(true);
  const [city, setCity] = useState(true);
  const [companyname, setCompanyName] = useState(true);
  const [industrytype, setIndustryType] = useState(false);
  const [state, setState] = useState(false);
  const [status, setStatus] = useState(false);
  // const [id, setId] = useState(false);

  // Download Template

  const downloadTemplate = () => {
    axios
      .get(`${BASE_URL}/user/download_excel_template/`, {
        responseType: "blob", // Important: responseType as 'blob' to handle binary data
      })
      .then((response) => {
        // Create a temporary URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        //  // // // console.log("url",url)
        // Create a link element
        const link = document.createElement("a");
        //  // // // console.log("link",link)
        link.href = url;
        //  // // // console.log("")
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
      .catch(() => {
        // Handle any errors that occurred during the download process
        // console.error("Error downloading the template:", error);
      });
  };

  //  Upload File
  const [upload, setUpload] = useState("");

  const upLoad = (e) => {
    if (File) {
      const file = File;
      if (file) {
        const formData = new FormData();
        formData.append(" template", file);

        axios
          .post(`${BASE_URL}/user/simple_upload/`, formData, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          })
          .then((res) => {
            if (res.data?.failure_count === 0) {
              setOpenUpload(false);
              setOpenUploadContact(false);
              setDatas([]);
              if (tabValue === 0) {
                console.log("page", { page });

                getAllData(page);
              } else {
                console.log("page", { page });

                getData(page);
              }

              setFile(null);
              setImportedRows(null);
              setNotImportedRows(null);
              InvalidateQueryUpdates("getUserLoopUpLists");
              if (res.data.success_count > 0) {
                toast.success("File uploaded successfully", {
                  position: "top-right",
                  closeButton: true, // Allow manual close
                  closeOnClick: true, // Close on click
                });
              } else {
                setImportedRows(res?.data?.Total_Count);
                setNotImportedRows(res?.data?.failure_data);
                res?.data?.failure_data?.forEach((row) => {
                  const errorMessage = row.Error;
                  // toast.error(`Row ${row.row_number}: ${errorMessage}`);
                });
              }
            } else {
              toast.error(`${res.data.failure_data[0].Error}`, {
                position: "top-right",
                closeButton: true,
                closeOnClick: true,
              });
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              const errorMessage =
                error.response.data.details ||
                "You don't have permission to do it";
              console.log(errorMessage);
              toast.error(errorMessage, {
                position: "top-right",
                autoClose: 100,
              });
            }
          });
      }
    }
  };

  // For Intilization for the Dialog

  const [save, setSave] = useState(false);

  // Auto Focus
  const inputRef = useRef(null);

  useEffect(() => {
    if (name === "" && inputRef.current !== null) {
      inputRef.current.focus();
    }
  }, [name]);

  // For filter Functionality
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setfilter] = useState(false);
  const [contry, setContry] = useState("");
  const [cty, setCty] = useState("");

  const [selectedCountryfilter, setSelectedCountryfilter] = useState("");
  const [selectedStatefilter, setSelectedStatefilter] = useState("");
  const [selectedCityfilter, setSelectedCityfilter] = useState("");
  const [selectedCountry1filter, setSelectedCountry1filter] = useState("");
  const [selectedState1filter, setSelectedState1filter] = useState("");
  const [selectedCity1filter, setSelectedCity1filter] = useState("");
  const [indus, setIndus] = useState("");
  const [fromdate, setFromdate] = useState(new Date().toISOString());
  const [todate, setToDate] = useState(new Date().toISOString());
  const [statefil, setStatefil] = useState("");

  //  For Pagination Table
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);

  const filterSubmit = async () => {
    console.log("pageeen", page);

    if (loading) return;
    if (count != 0 && !Boolean(Math.ceil(count / 10) >= page))
      return console.log("Out of Page");

    setloading(true);

    try {
      await axios
        .get(
          `${BASE_URL}/user/ContactFilter/?Industry_Type=${indus}&Country=${selectedCountry1filter}&State=${selectedState1filter}&City=${selectedCity1filter}&fromdate=${fromdate}&todate=${todate}&page=${page}`,
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
          // console.log(res.data);
          // if (Boolean(nextPage > 1)) {
          //   setDatas((prev) => [...prev, ...res?.data?.results]);
          // } else {
          //   setDatas(res?.data?.results || []);
          // }
          if (res?.data?.results) {
            setfilter(true);

            setDatas((prevDatas) => {
              return page === 1
                ? res.data.results
                : Array.from(new Set([...prevDatas, ...res.data.results]));
            });

            setCount(res.data.count);
          }
          setShowFilter(false);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const handleClickfilter = () => {
    filterSubmit();
  };

  // For jetsi Calling

  // Meeting Link

  const meetingLink = (data) => {
    var payload = {
      RecevierMail: data.Email_Id,
      Contact_Id: data.id,
      UserId: 1,
    };
    //  // // // console.log("payload",payload);
    axios
      .post(`${BASE_URL}/user/CRMUserContactMeetingCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(() => {
        //  // // // console.log(res.data);
        toast.success("Meeting Link Sent successfully", {
          position: "top-right",
          closeButton: true, // Allow manual close
          closeOnClick: true,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
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
      });
  };

  // For Look Up data

  const [leadindustry, setLeadindustry] = useState([]);

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
        },
      );

      console.log("check", response.data);
      console.log(
        "check1",
        response?.data?.find((op) => op?.Lookupname === "Industry Type"),
      );
      // setLeadindustry(response?.data?.find((op) => op?.Lookupname === "Industry Type") || []);
      return response?.data;
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  // Calculate the Date

  const calculateDaysBetweenDates = (startDate) => {
    const currentDate = new Date();
    const startDateObject = new Date(startDate);
    const timeDifference = currentDate - startDateObject;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    if (daysDifference < 1) {
      return "Today";
    } else if (daysDifference < 2) {
      return "Yesterday";
    } else if (daysDifference < 7) {
      return `${Math.floor(daysDifference)} days ago`;
    } else if (daysDifference < 30) {
      const weeks = Math.floor(daysDifference / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (daysDifference < 365) {
      const months = Math.floor(daysDifference / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(daysDifference / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  // // get Lists All Data
  // const {
  //   data: getContactsLists,
  //   isLoading: getContactsListsLoading,
  //   isError: getContactsListsError,
  //   refetch: getContactsListsRefetch,
  // } = useQuery(
  //   ["getContactsListsLists", tabValue, page],
  //   async () => {
  //     if (tabValue === 0) {
  //       return await getAllData(page);
  //     } else if (tabValue === 1) {
  //       return await getData(page);
  //     }
  //   },
  //   { staleTime: Infinity }
  // );

  const {
    data: getUserLoopUp,
    isLoading: getUserLoopUpLoading,
    isError: getUserLoopUpError,
    refetch: getUserLoopUpRefetch,
  } = useQuery(["getUserLoopUpLists"], getlookupData, { staleTime: Infinity });

  const [knowlaritydatas, setKnowlaritydatas] = useState([]);
  const [agentdetails, setagentdetails] = useState([]);

  const getKnowlarityConfiguration = () => {
    axios
      .get(
        `${BASE_URL}/user/KnowlarityConfigurationCRUD/?User_Id=${localStorage.getItem(
          "UserId",
        )}`,
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
        console.log("res?.data", res.data);
        setKnowlaritydatas(res?.data);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const getagentnumber = async (data) => {
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
        console.log("agentres", res);
        const agentnum = res.data?.objects?.find(
          (item) => item?.phone === userDetails?.PhoneNo,
        );
        // setagentdetails(agentnum)

        onGoingCallApi(data, agentnum);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  //  OnGoing Call API

  const onGoingCallApi = async (data, agentnum) => {
    let knopayload = {
      // k_number: "+918037125874",
      // agent_number: "+919344312970",
      // customer_number: "+918870791912",
      // caller_id: "+918040210001",
      // caller_name: datas?.Name,
      k_number: knowlaritydatas?.Knowlarity_Number,
      agent_number: agentnum?.country_code + agentnum?.phone,
      customer_number: "+" + data?.MobileCountry_Id + data?.Mobile_Number,
      caller_id: knowlaritydatas?.Knowlarity_CallerId,
      caller_name: data?.Name,
    };
    console.log("knopayload", knopayload);
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
        },
      )
      .then((res) => {
        console.log("callres", res);
        setShowDial(true);
        setcalldata(data);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  console.log("agentdetails", agentdetails?.phone, agentdetails?.country_code);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const calllogs = () => {
    axios
      .get(
        `${BASE_URL}/user/KnowlarityCallLogsCRUD/?start_Date=2020-04-16&end_Date=&UserId=${localStorage.getItem(
          "UserId",
        )}&Module=Contact`,
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
        // setKnowlaritydatas(res?.data);
        // setcallogsdetails(res.data)
        const mynumberList = res?.data?.filter((item) =>
          item.Agent_Number.includes(userDetails?.PhoneNo),
        );

        const lastIndexData = mynumberList[0];
        console.log("lastIndexData", mynumberList, lastIndexData);

        setDuration(lastIndexData?.Call_Duration);

        if (lastIndexData?.Agent_Number?.includes("User Disconnected")) {
          setStatusc("User Disconnected");
        } else if (lastIndexData?.Agent_Number?.includes("Customer Missed")) {
          setStatusc("Customer Missed");
        } else {
          setStatusc("Connected");
        }

        setLoading(false);
        setAnchorEl(true);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    var payload = {
      Company_Name: calldata?.Company_Name,
      Receiver_Name: calldata?.Name,
      Contact_Number: calldata?.Mobile_Number,
      Selected_Date: moment().format("YYYY-MM-DD"),
      Next_SheduledTime: nextdate,
      Call_Duration: duration,
      Call_Context: callcontext,
      Call_Con_Status: callconvstatus,
      Call_Busy_hour: busy,
      Activity_Type: "Call",
      Activity_relates: "Contact",
      Details: notes,
      Select_Status: statusc,
      Contact_Id: Number(calldata?.id),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
      Organization_Id: localStorage.getItem("OrganizationId"),
    };

    axios
      .post(`${BASE_URL}/user/CallcenterActivityCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("check", res);
        toast.success("Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        setShowDial(false);
        handleClose();
        // for Updating the Contact List
        if (calldata?.No_of_Calls == null || "" || NaN) {
          var x = 1;
        } else {
          var x = parseInt(calldata?.No_of_Calls) + 1;
        }
        let payload1 = {
          id: Number(calldata?.id),
          Last_Call_Date: moment().format("YYYY-MM-DD"),
          Last_Called_By: userDetails && userDetails?.username,
          No_of_Calls: x,
        };
        console.log("check", payload1);
        axios
          .patch(`${BASE_URL}/user/ContactCRUD/`, payload1, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((re) => {
            console.log("res", re);
          })
          .catch((error) => {
            console.log("error", error);
          });
        // For Updateing the History of Changes
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.CallCenter_Id,
          Updated_Person: `${editUser} Created this Contact Phone History.`,
          Module_Name: "Contact Phone History",
          Contact_Id: Number(id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
        // Create Task
        // CreateTask(editUser);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
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
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // sorting functions
  const sortData = (e, value) => {
    const sortedData = [...datas].sort((a, b) =>
      value === "A-Z"
        ? a?.Name?.localeCompare(b?.Name)
        : b?.Name?.localeCompare(a?.Name),
    );
    setDatas(sortedData);
    setIsSortName(value);
  };

  useEffect(() => {
    if (Loading) {
      const timer = setTimeout(() => {
        calllogs();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [Loading]);

  // Scroll end auto api call

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 100 &&
      !loading &&
      !searchQuery
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, searchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setPage(1);
    setDatas([]);
    setSearchQuery("");
  }, [tabValue]);

  // useEffect(() => {
  //   if (getContactsLists?.results?.length > 0) {
  //     setDatas((prevDatas) => {
  //       const updatedDatas = new Set([
  //         ...prevDatas,
  //         ...getContactsLists?.results,
  //       ]);
  //       return Array.from(updatedDatas);
  //     });

  //     let Counts =
  //       getContactsLists?.results?.length == 0
  //         ? datas?.length
  //         : getContactsLists?.count || 0;
  //     setCount(Counts);
  //   }
  // }, [getContactsLists, refreshdatas, page]);

  useEffect(() => {
    if (getUserLoopUp) {
      setLeadindustry(
        getUserLoopUp?.find((op) => op?.Lookupname === "Industry Type") || [],
      );
    }
  }, [getUserLoopUp]);

  useEffect(() => {
    getKnowlarityConfiguration();
  }, []);

  useEffect(() => {
    setDatas([]);
    setPage(1);
    setSearchQuery("");
  }, [tabValue]);

  useEffect(() => {
    if (searchQuery) return;

    if (tabValue == 0 && filter == false) {
      console.log("page", { page });
      getAllData(page);
    } else if (tabValue == 1 && filter == false) {
      console.log("page", { page });
      getData(page);
    } else if (filter == true) {
      console.log("page", { page });

      filterSubmit();
    }
  }, [page, tabValue, filter, searchQuery]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  console.log("Contactssssssss", { tabValue, datas, page });
  console.log("File", File);

  return (
    <>
      <JumboContentLayoutMain>
        <ToastContainer />
        <Box id="con-list">
          <Box sx={{ mb: 2 }} id="heads">
            <Box className="flex items-center justify-between flex-wrap">
              <Typography
                sx={[componentTitle, { color: Colors?.gray, fontWeight: 700 }]}
              >
                Contact Lists
              </Typography>

              <Div className="flex items-center justify-between gap-2 ">
                <SelectDropdown
                  className="search-select3"
                  defaultValue={"All Contacts"}
                  onChange={(e, value) => {
                    setTabValue(value === "All Contacts" ? 0 : 1);
                    console.log("value", value);
                  }}
                  options={["All Contacts", "My Contacts"]}
                />

                <SelectDropdown
                  className="search-select3"
                  defaultValue={"A-Z"}
                  onChange={sortData}
                  options={["A-Z", "Z-A"]}
                  width="70px"
                  clearButton={false}
                />
                {matches && (
                  <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                    <FaGear style={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Div>
            </Box>
          </Box>

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
                  onClick={dialogFilter}
                >
                  <BiFilterAlt size={22} />
                </IconButton>
                <Typography
                  sx={[dialogTitle, { color: Colors?.gray, fontWeight: 400 }]}
                >
                  ( {count} ) Contacts
                </Typography>
              </Grid>
              {!matches && (
                <Grid item xs={1} md={1}>
                  <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                    <FaGear style={{ fontSize: 18 }} />
                  </IconButton>
                </Grid>
              )}

              {/* Filter popover  */}

              <Popover
                open={Boolean(showFilter)}
                anchorEl={showFilter}
                onClose={closeFilter}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{ minWidth: "350px", width: { xs: "100%", md: "40%" } }}
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

                  <Div style={{ padding: "1rem" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Country
                        </Typography>
                        <Autocomplete
                          className="col-12 search-select3"
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.name) {
                              return option?.name;
                            }
                            return "";
                          }}
                          options={Country.getAllCountries() || []}
                          value={selectedCountry1filter}
                          onChange={(e, newValue) => {
                            setSelectedCountryfilter(newValue);
                            setSelectedCountry1filter(newValue?.name);
                          }}
                          id="outlined-basic"
                          renderInput={(params) => (
                            <TextField {...params} placeholder="Country" />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          State
                        </Typography>
                        <Autocomplete
                          className=" col-12 search-select3"
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.name) {
                              return option?.name;
                            }
                            return "";
                          }}
                          value={selectedState1filter}
                          options={
                            State.getStatesOfCountry(
                              selectedCountryfilter?.isoCode,
                            ) || []
                          }
                          onChange={(e, newValue) => {
                            setSelectedStatefilter(newValue);
                            setSelectedState1filter(newValue?.name);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option?.name === value || value === ""
                          }
                          id="outlined-basic"
                          renderInput={(params) => (
                            <TextField {...params} placeholder="State" />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          City
                        </Typography>
                        <Autocomplete
                          className="col-12 search-select3"
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.name) {
                              return option?.name;
                            }
                            return "";
                          }}
                          options={
                            City.getCitiesOfState(
                              selectedStatefilter?.countryCode,
                              selectedStatefilter?.isoCode,
                            ) || []
                          }
                          value={selectedCity1filter}
                          onChange={(e, newValue) => {
                            console.log("newValue", newValue);
                            setSelectedCityfilter(newValue);
                            setSelectedCity1filter(newValue?.name);
                          }}
                          id="outlined-basic"
                          renderInput={(params) => (
                            <TextField {...params} placeholder="City" />
                          )}
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
                          className="col-12 input-box2"
                          autoComplete="off"
                          placeholder="Industry Type"
                          value={indus}
                          onChange={(e) => {
                            setIndus(e.target.value);
                          }}
                        ></TextField>
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          From Date
                        </Typography>
                        <CRMDateField
                          type="date"
                          className="col-12 input-box2"
                          value={fromdate}
                          onChange={(e) => {
                            setFromdate(e.target.value);
                          }}
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
                        <CRMDateField
                          value={todate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                          }}
                          type="date"
                          className="col-12 input-box2"
                          id="lastDate"
                        />
                      </Grid>
                    </Grid>

                    <Div
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        gap: "10px",
                      }}
                    >
                      {/* <Button
                    type="submit"
                    sx={[DialogBoxSaveButton, ButtonStyle, FontStyle]}
                  >
                    Apply
                  </Button> */}
                      <Cancelbutton onClick={closeFilter} />
                      <CustomButton
                        onClick={() => {
                          handleClickfilter();
                        }}
                        type="submit"
                        label="Apply"
                        Icon="filterIcon"
                      />
                    </Div>
                  </Div>
                </Box>
              </Popover>

              {/* <Grid item xs={12} md={4}>
                <Div sx={{ width: { md: window.innerWidth / 3 } }}>
                  <SearchBar
                    SearchData={SearchData}
                    width={"100%"}
                    color={"black"}
                  />
                </Div>
              </Grid> */}
              <Grid item xs={12} md={6} className="custom-btns">
                <Div
                  className="flex-wrap"
                  sx={[DisplayFlex, { justifyContent: "right" }]}
                >
                  <SearchBar
                    SearchData={(e) => SearchData(e)}
                    value={searchQuery}
                    width={"250px !important"}
                    color={"black"}
                    className=""
                  />

                  <span className="flex items-center gap-2">
                    <CustomButton
                      width={"120px"}
                      // onClick={() => downloadTemplate()}
                      onClick={() => setOpenUploadContact(true)}
                      bgColor="#708090"
                      label="Import"
                      Icon="downloadIcon"
                    />
                    <CustomButton
                      onClick={() => setShowAllContacts("create")}
                      label="Create"
                      Icon="createIcon"
                      endIcon={true}
                    />
                  </span>
                </Div>
              </Grid>
            </Grid>
          </Box>

          <Div id="list">
            <List sx={{ mt: 0 }}>
              {datas?.length > 0 &&
                datas?.map((data, idx) => {
                  // if (idx < 2) {

                  let image =
                    (BASE_URL +
                      data?.File?.split("https://backend.crmfarm.app")[1] ||
                      data?.File) ??
                    "";

                  return (
                    <Div
                      onMouseOver={() => setFadeEdit(idx)}
                      onMouseLeave={() => setFadeEdit(null)}
                      className=""
                      key={idx}
                      sx={{
                        minHeight: "124px",
                        p: { xs: 0.5, sm: 2 },
                        px: { xs: 0.5, md: 7 },
                        my: 2,
                        bgcolor: "white",
                        borderRadius: { xs: "5px", md: "10px" },
                        ":hover": {
                          boxsShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important",
                        },
                        cursor: "default",
                      }}
                    >
                      <Grid
                        container
                        alignItems={"center"}
                        spacing={2}
                        sx={{ pr: "5%" }}
                      >
                        <Grid item xs={12} md={1.5}>
                          <div
                            style={{ marginTop: "6px" }}
                            onClick={() => handleClickOverviewContact(data)}
                          >
                            <AvatarCircle
                              size="90px"
                              fontSize="30px"
                              bgColor={avatarColorFun(idx)}
                              title={!Boolean(data?.File) && data?.Name}
                              image={Boolean(data?.File) ? image : false}
                            />
                          </div>
                        </Grid>

                        <Grid container spacing={1} item xs={12} md={10.5}>
                          <Grid item xs={12}>
                            <Box
                              sx={[
                                DisplayFlex,
                                {
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                },
                              ]}
                            >
                              <Typography
                                sx={[
                                  {
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    color: `${Colors?.Mblue}`,
                                  },
                                ]}
                              >
                                {data?.Name}
                              </Typography>
                              <Div sx={[DisplayFlex]}>
                                <Div
                                  className={` ${idx === fadeEdit
                                      ? "fade-in-right"
                                      : "fade-in-left"
                                    } `}
                                  sx={{
                                    display: {
                                      xs: "none !important",
                                      sm:
                                        fadeEdit === idx
                                          ? "flex !important"
                                          : "none !important",
                                    },
                                  }}
                                >
                                  <Div
                                    sx={[
                                      FontStyle,
                                      DisplayFlex,
                                      {
                                        width: "120px",
                                        cursor: "pointer",
                                        transform: "translateX(-50px)",
                                        color: Colors?.Mblue,
                                      },
                                    ]}
                                    onClick={() => {
                                      setUpdate(data);
                                      setShowAllContacts("edit");
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: "25px !important",
                                        color: Colors?.Mblue,
                                      }}
                                    >
                                      <TiEdit
                                        style={{
                                          fontSize: 18,
                                          fontWeight: 900,
                                        }}
                                      />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography
                                          sx={[
                                            FontStyle,
                                            {
                                              color: Colors?.Mblue,
                                              flexWrap: "nowrap",
                                            },
                                          ]}
                                        >
                                          Edit Contact
                                        </Typography>
                                      }
                                    />
                                  </Div>
                                </Div>
                                <CustomButton
                                  onClick={(e) => {
                                    setOpenAnchor(e.target);
                                    setUpdate(data);
                                  }}
                                  sx={{ borderRadius: "25px" }}
                                  label="Action"
                                  bgColor={Colors?.Mblue}
                                  Icon="downArrowIcon"
                                  endIcon={true}
                                />
                              </Div>
                            </Box>
                          </Grid>
                          {columnMenuItems?.map((Menu, subIdx) => {
                            return (
                              <>
                                {Menu?.bool && (
                                  <Grid key={subIdx} item xs={12} lg={4}>
                                    <Typography
                                      sx={[
                                        { fontSize: "14px", color: "#828282" },
                                      ]}
                                    >
                                      <span
                                        style={{
                                          fontWeight: 700,
                                          color: "#5e5e5e",
                                        }}
                                      >
                                        {Menu?.label} :
                                      </span>{" "}
                                      <span>
                                        {Menu?.sort === "Created_Date" ||
                                          Menu?.sort === "Updated_Date"
                                          ? formatDate(data[Menu?.sort])
                                          : data[Menu?.sort] || "-"}
                                      </span>
                                    </Typography>
                                  </Grid>
                                )}
                              </>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Div>
                  );
                  // }
                })}
            </List>
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
                        <Typography id="Typography-root" sx={[FontStyle]}>
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
              setIsLoading(false);
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
                      sm: "translateX(-50px)",
                    },
                    color: Colors?.Mblue,
                    display: {
                      sm: "none !important",
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
                    style={{ fontSize: { xs: 18, md: 25 }, fontWeight: 900 }}
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
                <ListItemIcon sx={{ minWidth: "25px !important", color: "" }}>
                  <MdOutlineNoteAdd style={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={[FontStyle]}>Add Notes</Typography>}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  setOpenSendMail(true);
                  setOpenAnchor(false);
                }}
                sx={{ borderRadius: "5px" }}
              >
                <ListItemIcon sx={{ minWidth: "25px !important", color: "" }}>
                  <RiMailSendLine style={{ fontSize: 17 }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography sx={[FontStyle]}>Send Mail</Typography>}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => {
                  setOpenActivity(true);
                  setOpenAnchor(false);
                }}
                sx={{ borderRadius: "5px" }}
              >
                <ListItemIcon sx={{ minWidth: "25px !important", color: "" }}>
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
                <ListItemIcon sx={{ minWidth: "25px !important", color: "" }}>
                  <TodayIcon sx={{ fontSize: 17 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={[FontStyle]}>Add Appointment</Typography>
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

        {/* Create Contact */}
        <Dragabledialog
          maxWidth="lg"
          open={showAllContacts === "create"}
          title=" Create Contact"
          onClose={() => setShowAllContacts(false)}
        >
          <CreateContacts
            leadindustry={leadindustry}
            setShowAllContacts={setShowAllContacts}
            setOpen={setSave}
            onsubmit={onsubmit}
          />
        </Dragabledialog>

        {/* Edit Contact */}
        <Dragabledialog
          maxWidth="lg"
          open={showAllContacts === "edit"}
          title=" Edit Contact"
          onClose={() => setShowAllContacts(false)}
        >
          <ContactEdit
            getContactsListsRefetch={getAllData}
            update={update}
            setShowAllContacts={setShowAllContacts}
            setOpen={setSave}
          />
        </Dragabledialog>

        {/* Add Note Dialog Box */}
        <Dragabledialog
          maxWidth="sm"
          open={openNotes}
        // onClose={() => setOpenNotes(false)}
        >
          <NotesModel
            name={{ label: "Contact Name", value: update?.Name }}
            endpoint={"ContactNotesCRUD"}
            historyEndpoint={{
              point: "Updaterecordscrud",
              payload: { Contact_Id: update?.id },
            }}
            extraPayload={{ Contact_Id: update?.id }}
            data={update}
            setOpenNotes={setOpenNotes}
            setOpen={setSave}
          />
        </Dragabledialog>

        {/* Add Activities Dialog Box */}
        <Dragabledialog
          maxWidth="lg"
          open={openActivity}
        // onClose={() => setOpenActivity(false)}
        >
          <ActivityModel
            name={{ label: "Contact Name", value: update?.Name }}
            endpoint={"ContactActivitiesCRUD"}
            historyEndpoint={{
              point: "Updaterecordscrud",
              payload: { Contact_Id: update?.id },
            }}
            extraPayload={{ Contact_Id: update?.id }}
            data={update}
            setOpenActivity={setOpenActivity}
            setOpen={setSave}
          />
        </Dragabledialog>

        {/* Add Appointment Dialog Box */}
        <Dragabledialog
          maxWidth="lg"
          open={openAppointment}
        // onClose={() => setOpenAppointment(false)}
        >
          <AppointmentModel
            name={{ label: "Contact Name", value: update?.Name }}
            endpoint={"ContactMeetingCRUD"}
            extraPayload={{ Contact_Id: update?.id }}
            historyEndpoint={{
              point: "Updaterecordscrud",
              payload: { Contact_Id: update?.id },
            }}
            data={update}
            setOpenAppointment={setOpenAppointment}
            setOpen={setSave}
          />
        </Dragabledialog>

        {/* Send Mail Dialog Box */}
        <Dragabledialog
          maxWidth="lg"
          open={openSendMail}
        // onClose={() => setOpenSendMail(false)}
        >
          <ComposeEmail
            endpoint={"UserMailMasterCRUD"}
            extraPayload={{ Contact_Id: update?.id }}
            data={update}
            setOpenSendMail={setOpenSendMail}
            setOpen={setSave}
          />
        </Dragabledialog>

        {/* delete popup */}

        <DialogBox
          open={showDelete}
          Content={deletedWarnigMsg}
          onClickNo={() => setShowDelete(false)}
          onClickYes={() => {
            // setSave(false);
            setShowDelete(false);
            // reset();
            Deletedata();
            setOpenAnchor(null);
          }}
        />

        {/* for upload a contact */}
        <Dragabledialog
          maxWidth="lg"
          open={openUploadContact}
          title="Upload Contact"
          onClose={() => {
            setOpenUploadContact(false);

            setImportedRows(null);
            setNotImportedRows(null);
          }}
        >
          <DialogContent>
            <Div>
              <DialogContentText id="alert-dialog-description">
                <Typography sx={[FontStyle]}>
                  Before Import Contacts you must confirm the data in the
                  prescribed template which shall be used to import data to the
                  CRMFarm. <br />
                  <br />
                  If you don't have the template please download the template
                  here.
                </Typography>
                {/* <ButtonGroup
                  onClick={downloadTemplate}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <Button className="plus-button">Download</Button>
                  <Button variant="contained" className="icon-button">
                    <MdDownload size={24} />
                  </Button>
                </ButtonGroup> */}
                {/* <Div sx={{ display: "flex", justifyContent: "end" }}>
                  <CustomButton
                    onClick={downloadTemplate}
                    label="Download"
                    Icon="downloadIcon"
                  />
                </Div> */}
                <Div sx={{ display: "flex", mt: 2, justifyContent: "center" }}>
                  <Button
                    sx={[UploadBtn, FontStyle]}
                    onClick={downloadTemplate}
                  >
                    Download Template
                  </Button>
                </Div>
                <Typography variant="caption">Import</Typography>
              </DialogContentText>
              <br />
              <Div
                {...getRootProps()}
                style={{
                  border: "2px dashed #EEEEEE",
                  borderRadius: "5px",
                  padding: "30px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here...</p>
                ) : (
                  <p>Drag 'n' drop some files here, or click to select files</p>
                )}
              </Div>
              <br />
              <Div>
                <Typography variant="h3">Uploaded Files</Typography>
                {File ? (
                  <Div
                    sx={{
                      display: "flex",
                      gap: 1,
                      p: 0.5,
                      alignItems: "center",
                      justifyContent: "space-around",
                      backgroundColor: "#EEEEEE",
                      borderRadius: "4px",
                      width: "40%",
                    }}
                  >
                    <Typography variant="h4" sx={{ pt: 0.8 }}>
                      {renderFilePreview(File)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      // onClick={() => removeFile()}
                      sx={{ p: 0 }}
                    >
                      <MdClose />
                    </IconButton>
                  </Div>
                ) : (
                  <Div>No File</Div>
                )}
              </Div>
              <br />
              {/* {notImportedRows?.length > 0 && (
                <Div>
                  <Grid container>
                    <Grid item xs={3.5}>
                      Uploaded Contacts
                    </Grid>
                    <Grid item xs={0.5}>
                      :
                    </Grid>
                    <Grid item xs={5}>
                      {importedRows?.length}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3.5}>
                      Not Uploaded Contacts
                    </Grid>
                    <Grid item xs={0.5}>
                      :
                    </Grid>
                    <Grid item xs={5}>
                      {notImportedRows?.length}
                    </Grid>
                  </Grid>
                  <br />
                  <Typography variant="h3">Reason :</Typography>
                  {notImportedRows?.map((importData, index) => {
                    return (
                      <Grid container key={index}>
                        <Grid item xs={3.5}>
                          Row Number {importData?.row_number}
                        </Grid>
                        <Grid item xs={0.5}>
                          :
                        </Grid>
                        <Grid item xs={7}>
                          {importData?.Error}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Div>
              )} */}
            </Div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <CustomButton onClick={upLoad} label="Upload" Icon="uploadIcon" />
          </DialogActions>
        </Dragabledialog>

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
              default:
                setShowAllContacts(false);
                break;
            }
            setSave(false);
          }}
        />
      </JumboContentLayoutMain>
    </>
  );
};

export default AllContactsList;
