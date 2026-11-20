import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  Box,
  CardContent,
  Popover,
  ButtonGroup,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { LocationIcon, MailIcon, PhoneIcon } from "app/icons/PngIcons";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmailContent from "app/pages/home/email-lists/EmailContent";
import OpenActivity from "./OpenActivity";
import ClosedActivity from "./ClosedActivity";
import Appointment from "./Appointment";
import ContactsHistory from "./ContactsHistory";
import ConatctNotes from "./ContactNotes";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import randomColor from "randomcolor";
import {
  CallEnd,
  KeyboardDoubleArrowUp,
  Mic,
  MicOff,
  VolumeOff,
  VolumeUp,
} from "@mui/icons-material";
import {
  AiOutlineClockCircle,
  AiOutlineEdit,
  AiOutlineMail,
} from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import moment from "moment";
import { BASE_URL, BASE_URL1, Tenantname } from "app/services/auth-services";
import CloseIcon from "@mui/icons-material/Close";
import CreateContactLead from "./CreateContactLead";
import Draggable from "react-draggable";
import {
  Colors,
  customHeight,
  dialogFontSize,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  generateRandomColor,
  input_label,
  input_label1,
} from "app/pages/widgets/CRMStyles";
import { IoIosArrowBack, IoMdAttach, IoMdClose } from "react-icons/io";
import ContactPhoneNotes from "./ContactPhoneNotes";
import { TiPhoneOutline } from "react-icons/ti";
import {
  AvatarCircle,
  Cancelbutton,
  DialogBox,
  CustomButton,
  errorFilter,
  InvalidateQueryUpdates,
  Dragabledialog,
  Customgrid,
  CustomCKEditor,
  ckEditorOnchange,
} from "app/pages/widgets/StylesComponents";
import { MdOutlineModeEdit, MdOutlineScheduleSend } from "react-icons/md";
import { ProfileImageUpload } from "../extra-components/APIs";
import ComposeEmail from "../extra-components/ComposeEmail";
import TransactionReport from "./TransactionReport";
import { GrTransaction } from "react-icons/gr";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useQueryClient } from "react-query";
import { useJumboLayoutSidebar } from "@jumbo/hooks";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// function stringToColor() {
//   let hash = 0;
//   let i;

//   /* eslint-disable no-bitwise */
//   for (i = 0; i < string.length; i += 1) {
//     hash = string.charCodeAt(i) + ((hash << 5) - hash);
//   }

//   let color = '#';

//   for (i = 0; i < 3; i += 1) {
//     const value = (hash >> (i * 8)) & 0xff;
//     color += `00${value.toString(16)}`.slice(-2);
//   }
//   /* eslint-enable no-bitwise */

//   return color;
// }

// function stringAvatar() {
//   return {
//     sx: {
//       bgcolor: stringToColor(name),
//     },
//     children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
//   };
// }

const OverviewContact = ({ scrollHeight }) => {
  const queryClient = useQueryClient();
  const { sidebarOptions } = useJumboLayoutSidebar();
  const navigate = useNavigate();
  const [singleFile, setSingleFile] = useState([]);
  const { id } = useParams();
  const [base64, setbase64] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [openUploadEdit, setOpenUploadEdit] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [phonenotes, setPhoneNotes] = useState(false);
  const [showMail, setShowMail] = useState(false);
  const [showOpenActivity, setShowOpenActivity] = useState(false);
  const [showClosedActivity, setShowClosedActivity] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [showMailDialog, setShowMailDialog] = useState(false);
  const [showMail2, setShowMail2] = useState(false);

  const [showDial, setShowDial] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [noteCall, setNoteCall] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [volume, setVolume] = useState(true);
  const [mic, setMic] = useState(true);
  const [showCc, setShowCc] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [bannerColor, setBannerColors] = useState("");
  // For Conatct Lead Purpose
  const [tap, setTap] = useState(0);

  const [openAddLead, setOpenAddLead] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const UserDetails = JSON.parse(localStorage.getItem("UserDetails"));

  const uploadSingleFiles = (e) => {
    const file = e.target.files[0];
    setSingleFile([URL.createObjectURL(file)]);
  };

  // const uploadFiles = (e) => {
  //   e.preventDefault();
  //   console.log(singleFile);
  // };

  const removeImage = () => {
    setSingleFile([]);
  };

  const handleRefetch = () => {
    queryClient.refetchQueries("day1Data");
    queryClient.refetchQueries("day2Data");
    queryClient.refetchQueries("day3Data");
    queryClient.refetchQueries("day4Data");
    queryClient.refetchQueries("day5Data");
    queryClient.refetchQueries("day6Data");
    queryClient.refetchQueries("day7Data");
  };

  // // console.log("overview",id);

  const handleTap = useCallback(
    (value) => {
      setTap(value);
    },
    [tap]
  );

  // console.log("alert  ");

  const onsubmit = () => {
    setExpanded(false);
    setNoteCall(false);
    setNotes("");
  };
  const handleShowNotes = () => {
    setShowNotes(true);
    setShowMail(false);
    setShowOpenActivity(false);
    setShowClosedActivity(false);
    setShowAppointment(false);
    setShowHistory(false);
    setPhoneNotes(false);
  };

  const handleShowPhone = () => {
    setShowNotes(false);
    setShowMail(false);
    setShowOpenActivity(false);
    setShowClosedActivity(false);
    setShowAppointment(false);
    setShowHistory(false);
    setPhoneNotes(true);
  };

  const handleShowMail = () => {
    setShowNotes(false);
    setShowMail(true);
    setShowOpenActivity(false);
    setShowClosedActivity(false);
    setShowAppointment(false);
    setPhoneNotes(false);
    setShowHistory(false);
  };

  const handleShowOpenActivity = () => {
    setShowNotes(false);
    setShowMail(false);
    setShowOpenActivity(true);
    setShowClosedActivity(false);
    setShowAppointment(false);
    setPhoneNotes(false);
    setShowHistory(false);
  };

  const handleShowClosedActivity = () => {
    setShowNotes(false);
    setShowMail(false);
    setShowOpenActivity(false);
    setShowClosedActivity(true);
    setShowAppointment(false);
    setPhoneNotes(false);
    setShowHistory(false);
  };

  const handleShowAppointment = () => {
    setShowNotes(false);
    setShowMail(false);
    setShowOpenActivity(false);
    setShowClosedActivity(false);
    setShowAppointment(true);
    setPhoneNotes(false);
    setShowHistory(false);
  };

  const handleShowHistory = () => {
    setShowNotes(false);
    setShowMail(false);
    setShowOpenActivity(false);
    setShowClosedActivity(false);
    setShowAppointment(false);
    setPhoneNotes(false);
    setShowHistory(true);
  };

  // image upload function
  const handleChangeImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      setImage(reader.readAsBinaryString(file));
      setImageName(file?.lastModified + file?.name);
      console.log("file uploaded: ", e.target.files[0]);
    }
  };

  const handleReaderLoaded = (e) => {
    // console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setbase64(btoa(binaryString));
  };

  const onClosed = () => {
    setShowDial(false);
    setNoteCall(false);
  };

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
        console.error("Error uploading files:", error);
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
        <a href={`BASE_URL/media/${fileNames[index]?.name}`}>
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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    // setAnchorEl(event.currentTarget);
    setIsLoading(true);
    // callLogs()
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Getting the Conatct details based on the Id
  const item = "crmuseradmin1";
  const token = localStorage.getItem("accesstoken");

  const [datas, setDatas] = useState([]);

  const getData = async () => {
    await axios
      .get(`${BASE_URL}/user/ContactCRUD/?id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res", res.data);
        setDatas(res.data);
        setImage(
          Boolean(res?.data?.File) ? `${BASE_URL}${res?.data?.File}` : ""
        );
        setImageName(randomColor() + res?.data?.FileName || "");
        InvalidateQueryUpdates("getContactsListsLists");
        setOpenUploadEdit(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getData();
    ActivityList();
  }, []);

  const date = new Date();
  let day = date.getDate();
  // console.log("day",day);

  // upload profile image api
  const handleSaveImage = (e) => {
    let payload = { base64, imageName, id };
    let error = errorFilter(payload);

    if (Object.keys(error).length === 0) {
      ProfileImageUpload(payload, setOpenUploadEdit, "ContactCRUD", getData);
      setbase64("");
      setOpenUploadEdit(false);
    }
  };

  // Getting the Activities List
  const [activity, setActivity] = useState([]);
  const ActivityList = () => {
    var payload = {
      Contact_Id: Number(id),
    };
    axios
      .post(`${BASE_URL}/user/ContactActivitiesRange/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log("res",res.data);
        setActivity(res.data);
      })
      .catch((error) => {});
  };

  // Generate Colors

  const [random, setRandom] = useState([]);
  const [sample, setSample] = useState([1, 2]);

  const generateRandomAvatarColors1 = async (list) => {
    const colors = await Promise.all(list.map(() => randomColor()));
    return colors;
  };

  const handleEditorChange = (event) => {
    const value = event.editor.getData();
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");
    const textContent = doc.body.textContent || "";
    setNotes(textContent);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const avatarColors2 = await generateRandomAvatarColors1(sample);
        setRandom(avatarColors2);
      } catch (error) {
        // Handle error if any
      }
    };

    setTimeout(() => {
      fetchData();
    }, 2000);
  }, [sample]);

  // For Mail List & Call List

  const [maildatas, setMailDatas] = useState([]);
  const [calldatas, setCallDatas] = useState([]);
  const [lastvisiteddate, setlastvisiteddate] = useState([]);

  const MailData = () => {
    axios
      .get(`${BASE_URL}/user/MailListAdditional/?Contact_Id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log("Mail Data check",res.data.pop());
        setMailDatas(res.data?.[0]?.MailSentDate);
      })
      .catch((error) => {
        console.log("erroe", error);
      });
  };

  const CallData = () => {
    axios
      .get(
        `${BASE_URL}/user/CallcenterActivityContactAdditional/?Contact_Id=${id}`,
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
        // console.log("for contact check")
        console.log("Mail Data check for call", res.data?.results.unshift());
        setCallDatas(res.data?.results?.[0]?.Created_Date);
      })
      .catch((error) => {
        console.log("erroe", error);
      });
  };

  const getAppointments = () => {
    axios
      .get(
        `${BASE_URL}/user/ContactMeetingMyAdditional/?Is_Deleted=False&Contact_Id=${id}`,
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
        console.log("get appointments list", res.data.results);
        setAppointments(res.data?.results);
        setlastvisiteddate(res?.data?.results?.[0]?.Created_Date);
      })
      .catch((error) => {
        console.log("erroe", error);
      });
  };

  // GetThe Contact Refered List
  const [refer, setRefer] = useState([]);

  const ReferredList = async () => {
    await axios
      .get(
        `${BASE_URL}/user/UserLeadfromcontactsAdditional/?Is_Deleted=False&Contact_Id=${id}&Created_By=${localStorage.getItem(
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
        console.log("get Contact list", res.data.results);
        setRefer(res.data?.results || []);
      })
      .catch((error) => {
        console.log("erroe", error);
      });
  };
  useEffect(() => {
    MailData();
    CallData();
    getAppointments();
    ReferredList();
    setBannerColors(generateRandomColor());
    getData();
    ActivityList();
  }, [id]);

  function PaperComponent(props) {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  const option = [
    "Connected",
    "Customer Missed",
    "User Disconnected",
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

  const [firstREmainderHrs, setfirstREmainderHrs] = useState("");
  const [Repeateveryhrs, setRepeateveryhrs] = useState("");
  const [firstRemainder, setfirstRemainder] = useState("");
  const [repeatEvery, setrepeatEvery] = useState("");
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [show, setShow] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
  console.log("PhoneNo", userDetails?.PhoneNo);

  // CreateTask Function

  const CreateTask = (editUser) => {
    let playload = {
      Task_Type: "Call",
      Task_Name: "",
      Assign_toUsers: editUser,
      Start_Time: moment().format("HH:mm:ss"),
      End_Time: moment().format("HH:mm:ss"),
      Description: notes,
      Allocated_Date: new Date().toISOString().split("T")[0],
      Deadline_Date: new Date().toISOString().split("T")[0],
      Status: "In Assisgned",
      Created_Date: new Date().toISOString().split("T")[0],
      Updated_Date: new Date().toISOString().split("T")[0],
      Organization_Id: localStorage.getItem("OrganizationId"),
      Assign_To: localStorage.getItem("UserId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    console.log("playload", playload);
    axios
      .post(BASE_URL + "/user/TaskCalendarCRUD/", playload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: item,
        },
      })
      .then((response) => {
        console.log("responseTask", response?.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const handleReset = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    var payload = {
      CallCenter_Id: "",
      Company_Name: datas?.Company_Name,
      Receiver_Name: datas?.Name,
      Contact_Number: datas?.Mobile_Number,
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
      Contact_Id: Number(id),
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
        handleReset();
        handleRefetch();
        // for Updating the Contact List

        if (datas?.No_of_Calls == null || "" || NaN) {
          var x = 1;
        } else {
          var x = parseInt(datas?.No_of_Calls) + 1;
        }

        let payload1 = {
          id: Number(id),
          Last_Call_Date: moment().format("YYYY-MM-DD"),
          Last_Called_By: userDetails && userDetails?.username,
          No_of_Calls: x,
        };
        console.log("check", payload1);
        axios
          .patch(`${BASE_URL}/user/ContactUpdate/`, payload1, {
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

        CreateTask(editUser);
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

  const [knowlaritydatas, setKnowlaritydatas] = useState([]);
  const [agentdetails, setagentdetails] = useState([]);
  const [callogsdetails, setcallogsdetails] = useState([]);

  const callLogs = (event) => {
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
        console.log("calllogsresss", res.data);
        // setKnowlaritydatas(res?.data);
        // setcallogsdetails(res.data)
        const mynumberList = res?.data?.filter((item) =>
          item.Agent_Number.includes(userDetails?.PhoneNo)
        );

        const lastIndexData = mynumberList[0];
        console.log("lastIndexData", mynumberList, lastIndexData);

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
        console.log("error");
      });
  };

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
        console.log("res?.data", res.data);
        setKnowlaritydatas(res?.data);
      })
      .catch((error) => {
        console.log("error");
      });
  };
  const getagentnumber = async () => {
    await axios
      .get(`https://kpi.knowlarity.com/Basic/v1/account/agent`, {
        headers: {
          Accept: "application/json",
          "x-api-key": knowlaritydatas?.Header_Key,
          Authorization: knowlaritydatas?.API_Key,
        },
      })
      .then((res) => {
        console.log("agentres", res);
        const agentnum = res.data?.objects?.find(
          (item) => item?.phone === userDetails?.PhoneNo
        );
        // setagentdetails(agentnum)

        onGoingCallApi(agentnum);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  useEffect(() => {
    getKnowlarityConfiguration();
  }, []);

  //  OnGoing Call API

  const onGoingCallApi = async (agentnum) => {
    console.log("agentnum", agentnum);
    let knopayload = {
      k_number: knowlaritydatas?.Knowlarity_Number,
      agent_number: agentnum?.country_code + agentnum?.phone,
      customer_number: "+" + datas?.MobileCountry_Id + datas?.Mobile_Number,
      caller_id: knowlaritydatas?.Knowlarity_CallerId,
      caller_name: datas?.Name,
    };
    console.log("knopayload", knopayload);
    await axios
      .post(
        `https://kpi.knowlarity.com/Basic/v1/account/call/makecall`,
        knopayload,
        {
          headers: {
            Accept: "application/json",
            "x-api-key": knowlaritydatas?.Header_Key,
            Authorization: knowlaritydatas?.API_Key,
          },
        }
      )
      .then((res) => {
        console.log("callres", res);
        setShowDial(true);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        callLogs();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("agentdetails", agentdetails?.phone, agentdetails?.country_code);

  //  Right time to Call

  const [rightTimeCalls, setRightTimeCalls] = useState([]);
  const [rightTimeToCallData, setRightTimeToCallData] = useState({});
  const [openShcedule, setOpenshcedule] = useState(false);

  const ContactRightTimeAdditional = async () => {
    try {
      if (Boolean(datas?.id)) {
        await axios
          .get(
            `${BASE_URL}/user/ContactRightTimeAdditional/?Contact_Id=${Number(
              datas?.id
            )}&Is_Delete=False`,
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
            // setDatas(res?.data?.Result);
            if (res?.data?.results?.length > 0) {
              // console.log("Bearer", res?.data?.results[0]);
              // rightTimeToCall(res?.data?.Result[res?.data?.Result?.length - 1]);
              setRightTimeCalls(res?.data?.results[0]);
              setOpenshcedule(false);
            }
          });
        //
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log("rightTimeCalls", rightTimeCalls);
  // right time to call function
  const rightTimeToCallSave = async () => {
    try {
      let response;
      if (!Boolean(rightTimeCalls?.id)) {
        const payload = {
          Contact_Id: datas?.id,
          Right_Time:
            rightTimeToCallData
              ?.filter((right) => right?.checked)
              ?.map((right) => right?.time) ?? [],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        response = await axios.post(
          `${BASE_URL}/user/ContactRightTimeCRUD/`,
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
      } else if (Boolean(rightTimeCalls?.id)) {
        const payload = {
          id: rightTimeCalls?.id,
          Contact_Id: datas?.id,
          Right_Time:
            rightTimeToCallData
              ?.filter((right) => right?.checked)
              ?.map((right) => right?.time) ?? [],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        response = await axios.put(
          `${BASE_URL}/user/ContactRightTimeCRUD/`,
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
      }
      if (response) {
        ContactRightTimeAdditional();
      }
    } catch (error) {
      console.error("Error in rightTimeToCall:", error);
    }
  };
  // console.log("agentdetails", agentdetails?.phone, agentdetails?.country_code);
  // right time to call function
  const rightTimeToCall = async (rightTimeTo) => {
    try {
      const payload = {
        Customer_number: rightTimeTo?.Contact_Number,
        Call_status: rightTimeTo?.Select_Status,
        Call_duration: rightTimeTo?.Call_Duration,
        business_type: rightTimeTo?.Business_Call_Type,
      };
      const response = await axios.post(
        `${BASE_URL1}/user/RighttimetocallContacts/`,
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
      if (response?.data?.Right_time?.length > 0) {
        // Extract the Right_time array from the response and map it to the required format
        const rightTimeData = Object.values(response?.data?.Right_time[0])
          ?.map((val) => {
            if (
              rightTimeCalls?.id &&
              rightTimeCalls?.Right_Time.includes(val)
            ) {
              return {
                id: rightTimeCalls?.id,
                time: val,
                checked: true,
              };
            } else {
              return {
                time: val,
                checked: false,
              };
            }
          })
          .filter(Boolean);
        // Update the state with the mapped data
        console.log("rightTimeData2", rightTimeData);
        setRightTimeToCallData(rightTimeData);
      }
    } catch (error) {
      console.error("Error in rightTimeToCall:", error);
    }
  };
  const rightTimeToCallLists = async () => {
    let startDate = moment().startOf("year");
    let endDate = moment().endOf("year");
    let ThisYearStart = startDate?.format("YYYY-MM-DD");
    let ThisYearEnd = endDate?.format("YYYY-MM-DD");
    if (Boolean(datas?.Mobile_Number) && Boolean(datas?.id)) {
      await axios
        .get(
          `${BASE_URL}/user/KnowlarityAgentCalllogsandActivityList/?Phone_Number=${
            datas?.Mobile_Number
          }&Contact_Id=${Number(
            datas?.id
          )}&start_date=${ThisYearStart}&end_date=${ThisYearEnd}&Module=Contact`,
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
          console.log("NotesFilter", res?.data?.results);
          // setDatas(res?.data?.Result);
          if (res?.data?.Result?.length > 0) {
            rightTimeToCall(res?.data?.Result[res?.data?.Result?.length - 1]);
          }
        })
        .catch((error) => {
          console.log("error");
        });
      //
    }
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

  const setreminder = (event) => {
    setIsReminderSet(true);
    setShow(true);
    console.log("inside");
  };

  useEffect(() => {
    ContactRightTimeAdditional();
    rightTimeToCallLists();
  }, [datas]);

  return (
    <>
      <JumboContentLayoutMain>
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
                        {datas?.Name && datas?.Name[0]?.toUpperCase()}
                        {datas?.Name && datas?.Name[1]?.toUpperCase()}
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
                      {datas?.Name}
                    </Typography>
                    <Typography
                      id="Typography-root"
                      sx={{ color: "#F2F2F2", fontSize: "16px" }}
                    >
                      {datas?.Mobile_Number}
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

          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ mt: 2 }}>
              <Div className="row">
                <Div className="col-12 col-md-6 col-lg-6">
                  <Grid container>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Status
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                            console.log("newValue", newValue);
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
                      </Div>
                    </Grid>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Duration
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                              <Typography
                                sx={[FontStyle, { textAlign: "right" }]}
                              >
                                Seconds
                              </Typography>
                            ),
                          }}
                        />
                      </Div>
                    </Grid>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Busy Hour
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                            console.log("newValue", newValue);
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
                      </Div>
                    </Grid>
                  </Grid>
                </Div>
                <Div className="col-12 col-md-6 col-lg-6">
                  <Grid container>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Coversation Status
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                            console.log("newValue", newValue);
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
                      </Div>
                    </Grid>

                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Context
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                            console.log("newValue", newValue);
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
                      </Div>
                    </Grid>

                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography
                        className="col-md-12 col-lg-5 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Next Scheduled Date
                      </Typography>
                      <Div className="col-md-12 col-lg-7 col-xl-7">
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
                        <FormGroup
                          sx={{ display: nextdate ? "block" : "none" }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox checked={show} onChange={setreminder} />
                            }
                            label={
                              <Typography sx={[input_label1]}>
                                Set Reminder
                              </Typography>
                            }
                          />
                        </FormGroup>
                      </Div>
                    </Grid>
                  </Grid>
                </Div>

                <Div className="col-12">
                  <Grid container>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography className="col-md-12 " sx={[input_label]}>
                        Notes
                      </Typography>
                      <Div className="col-md-12 ">
                        <CKEditor
                          editor={ClassicEditor}
                          data={notes}
                          onChange={(event, editor) => {
                            const value = editor.getData();
                            // const parser = new DOMParser();
                            // const doc = parser.parseFromString(
                            //   value,
                            //   "text/html"
                            // );
                            // const textContent = doc.body.textContent || "";
                            setNotes(value);
                          }}
                        />
                      </Div>
                    </Grid>
                  </Grid>
                </Div>
              </Div>
            </DialogContent>
            <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
              <CustomButton
                type="submit"
                label="Save"
                // onClick={handleSaveImage}
                Icon="saveIcon"
              />
            </DialogActions>
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
                            <Typography sx={[input_label]}>
                              Repeat Every
                            </Typography>
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
                        <CKEditor
                          editor={ClassicEditor}
                          data={editorContent}
                          onChange={(event, editor) => {
                            const value = editor.getData();

                            setEditorContent(value);
                          }}
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
          </form>
        </Dragabledialog>

        <Dragabledialog
          maxWidth="lg"
          open={showMailDialog}
          // onClose={() => setOpenNotes(false)}
        >
          <ComposeEmail
            endpoint={"UserMailMasterCRUD"}
            data={datas}
            setOpenSendMail={setShowMailDialog}
            setOpen={setShowMail2}
            extraPayload={{ Contact_Id: datas?.id, MailId: "" }}
          />
        </Dragabledialog>

        {/* Close Dialog mail popup */}
        <DialogBox
          onClickNo={() => setShowMail2(false)}
          onClickYes={() => {
            setShowMail2(false);
            setShowMailDialog(false);
            setFileNames([]);
          }}
          open={showMail2}
        />

        <Div
          sx={{
            display: "flex",
            //  mt:-3.5,
            //  ml:-4.5
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4} xl={4}>
              <Card
                sx={{
                  mb: 2,
                  boxShadow: "none",
                  border: "1px solid #EEEEEE",
                  // minHeight: "760px",
                  height: "100%",
                  borderRadiusTopleft: "5px",
                  borderRadiusTopRight: "5px",
                }}
              >
                <Div sx={{ position: "relative" }}>
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        // backgroundColor: "background-color: #44b09e;
                        background: `linear-gradient(0deg,  rgb(245 245 245 / 79%) 0%, #00CDAC 100%)`,
                        // color: random && random[1],
                        height: "230px",
                        width: "100%",
                        py: 2,
                        px: { xs: 2, md: 4 },
                      },
                    ]}
                  >
                    <Div sx={{ width: "100%" }}>
                      <Div>
                        <IconButton
                          sx={{
                            cursor: "pointer",
                            transform: "translate(-30px , 0px)",
                            backgroundColor: "#f7f7f733",
                          }}
                          onClick={() => navigate(`/app/contacts`)}
                        >
                          <IoIosArrowBack color="white" size={18} />
                        </IconButton>
                      </Div>

                      <Div
                        sx={[
                          DisplayFlex,
                          {
                            justifyContent: "space-between !important",
                            width: "100%",
                            transform: "translateY(-17px)",
                          },
                        ]}
                      >
                        <Div>
                          <AvatarCircle
                            // title={datas?.Name}
                            image={
                              Boolean(datas?.File) && BASE_URL + datas?.File
                            }
                            bgColor={Colors?.Mblue}
                            size="120px"
                            fontsize="32px"
                          />
                          <Div
                            my={2}
                            sx={[
                              DisplayFlex,
                              {
                                ml: -1.5,
                                gap: "3px",
                                width: "100% !important",
                                justifyContent: "center",
                              },
                            ]}
                          >
                            <IconButton
                              onClick={() => {
                                // onGoingCallApi();
                                getagentnumber();
                              }}
                              sx={{}}
                            >
                              <PhoneIcon size={20} color="#5c5c5c" />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setShowMailDialog(true);
                              }}
                              sx={{}}
                            >
                              <MailIcon size={20} color="#5c5c5c" />
                            </IconButton>

                            <IconButton
                              sx={{
                                p: 1,
                              }}
                              onClick={() => setOpenUploadEdit(true)}
                            >
                              <MdOutlineModeEdit size={20} color="#5c5c5c" />
                            </IconButton>
                            <IconButton
                              sx={{
                                p: 1,
                              }}
                              onClick={(e) => {
                                setOpenshcedule(e.currentTarget);
                                rightTimeToCallLists();
                              }}
                            >
                              <MdOutlineScheduleSend
                                size={20}
                                color="#5C5C5C"
                              />
                            </IconButton>
                            <Popover
                              id={id}
                              open={Boolean(openShcedule)}
                              anchorEl={openShcedule}
                              // onClose={handleClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                            >
                              <DialogTitle
                                id="alert-dialog-title"
                                sx={[dialogTitle, DisplayFlex]}
                              >
                                Rigth Time To Call
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  {rightTimeToCallData?.length > 0 &&
                                    rightTimeToCallData?.map((right, idx) => {
                                      return (
                                        <Div key={idx}>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                onChange={() =>
                                                  setRightTimeToCallData(
                                                    rightTimeToCallData?.map(
                                                      (item, idxx) =>
                                                        idxx === idx
                                                          ? {
                                                              ...item,
                                                              checked:
                                                                !item?.checked,
                                                            }
                                                          : item
                                                    )
                                                  )
                                                }
                                                checked={right?.checked}
                                                size="small"
                                                color="info"
                                              />
                                            }
                                            label={
                                              <Typography sx={[FontStyle]}>
                                                {right?.time}
                                              </Typography>
                                            }
                                          />
                                        </Div>
                                      );
                                    })}
                                </DialogContentText>
                                <Div
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    mt: 2,
                                  }}
                                >
                                  <Cancelbutton
                                    onClick={() => {
                                      setOpenshcedule(false);
                                    }}
                                    label="Cancel"
                                  />
                                  <CustomButton
                                    label={
                                      Boolean(rightTimeCalls?.id)
                                        ? "Update"
                                        : "Save"
                                    }
                                    onClick={rightTimeToCallSave}
                                    Icon="saveIcon"
                                  />
                                </Div>
                              </DialogContent>
                            </Popover>

                            <Dialog
                              open={openUploadEdit}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <Formik>
                                <Form>
                                  <DialogTitle
                                    id="alert-dialog-title"
                                    sx={[dialogTitle, DisplayFlex]}
                                  >
                                    Upload Picture
                                  </DialogTitle>

                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      <Div
                                        sx={[
                                          DisplayFlex,
                                          { justifyContent: "center" },
                                        ]}
                                      >
                                        <label
                                          title="Click upload Image"
                                          for={"profile_pic"}
                                        >
                                          <Avatar
                                            alt="User"
                                            src={
                                              base64
                                                ? `data:image/png;base64,${base64}`
                                                : image
                                            }
                                            sx={{
                                              width: 100,
                                              height: 100,
                                              verticalAlign: "middle",
                                              boxShadow: (theme) =>
                                                theme.shadows[3],
                                              cursor: "pointer",
                                              ":hover": {
                                                backgroundColor: "grey",
                                              },
                                            }}
                                          />
                                        </label>
                                      </Div>

                                      <Typography
                                        id="Typography-root"
                                        sx={{
                                          fontSize: "13px",
                                          verticalAlign: "middle",
                                          textAlign: "center",
                                          mt: 1,
                                        }}
                                      >
                                        {datas?.Name}
                                      </Typography>
                                      <input
                                        type="file"
                                        onChange={handleChangeImage}
                                        style={{ display: "none" }}
                                        id="profile_pic"
                                      />
                                    </DialogContentText>

                                    <DialogActions
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Cancelbutton
                                        onClick={() => setOpenUploadEdit(false)}
                                        label="Cancel"
                                      />
                                      <CustomButton
                                        label="Save"
                                        onClick={handleSaveImage}
                                        Icon="saveIcon"
                                      />
                                    </DialogActions>
                                  </DialogContent>
                                </Form>
                              </Formik>
                            </Dialog>
                          </Div>
                        </Div>

                        <Div>
                          <Typography
                            id="Typography-root"
                            sx={{
                              fontSize: "29px",
                              color: "#0c4c40 !important",
                              fontWeight: 700,
                            }}
                          >
                            {datas?.Name || "No Name"}
                          </Typography>

                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "#147663 !important",
                                my: 1,
                              },
                            ]}
                          >
                            {datas?.Mobile_Number || "No Mobile No"}
                          </Typography>

                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "#147663 !important",
                                my: 1,
                              },
                            ]}
                          >
                            {datas?.Email_Id}
                          </Typography>

                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "#147663 !important",
                                my: 1,
                              },
                            ]}
                          >
                            {datas?.Company_Name || "No Company Name"}
                          </Typography>
                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "#147663 !important",
                                my: 1,
                              },
                            ]}
                          >
                            {datas?.City}
                            {Boolean(datas?.City) && ","}{" "}
                            {datas?.Country || "No Address"}
                          </Typography>
                        </Div>
                      </Div>
                    </Div>
                  </Div>

                  <CardContent
                    sx={{ p: 2, backgroundColor: "rgb(245 245 245 / 79%)" }}
                  >
                    <Div
                      mb={3}
                      sx={{
                        // display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        // height:"164px",
                        margin: "0 8px",
                        padding: "10px",
                        // zIndex: 1,

                        backgroundColor: "#ffff",
                        borderRadius: "5px",
                        // boxShadow: "0px 2px 7px #888888",
                        // border: "1px solid lightgray",
                        my: 1,
                        // mt: -5,
                      }}
                    >
                      <Typography
                        id="Typography-root"
                        sx={[
                          dialogTitle,
                          {
                            backgroundColor: "transparent !important",
                            // borderBottom: "1px solid lightgray",
                            // margin: "0px 20px",
                            padding: "10px 0px",
                          },
                        ]}
                      >
                        Insights
                      </Typography>
                      <List disablePadding>
                        <Div
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          {/* <ListItemIcon> */}
                          <MailIcon size={14} color="#6c757d" />
                          {/* </ListItemIcon> */}
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#7D7D7D !important" }]}
                          >
                            Last contacted through mail on{" "}
                            {Boolean(maildatas) &&
                              moment(maildatas)?.format("DD MMM YYYY")}
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          {/* <Typography  id='Typography-root'> */}
                          <PhoneIcon size={14} color="#6c757d" />
                          {/* </Typography> */}
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#7D7D7D !important" }]}
                          >
                            Last contacted through phone on {calldatas}
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          {/* <ListItemIcon> */}
                          <LocationIcon size={14} color="#6c757d" />
                          {/* </ListItemIcon> */}
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#7D7D7D !important" }]}
                          >
                            Last visited on {lastvisiteddate}
                          </Typography>
                        </Div>
                      </List>
                    </Div>

                    <Div
                      sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        height: "250px",
                        margin: "0 8px",
                        padding: "10px",
                        // zIndex: 1,

                        mb: 1,
                        backgroundColor: "#ffff",
                        borderRadius: "5px",
                        // border: "1px solid lightgray",
                      }}
                    >
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          // borderBottom: "1px solid lightgray",
                          // margin: "0px 20px",
                          padding: "10px 0px",
                        }}
                      >
                        <Typography
                          id="Typography-root"
                          sx={[
                            dialogTitle,
                            { backgroundColor: "transparent !important" },
                          ]}
                        >
                          Referred Leads
                        </Typography>

                        <CustomButton
                          label="Refer a lead"
                          onClick={() => setOpenAddLead(true)}
                          Icon={""}
                          width={"130px"}
                        />
                      </Div>
                      <List disablePadding>
                        {refer &&
                          refer?.map((data, index) => {
                            return (
                              <>
                                <ListItem sx={{ gap: "4px" }}>
                                  {/* <ListItemIcon> */}
                                  <AvatarCircle
                                    title={
                                      data?.LeadFirstName +
                                        " " +
                                        data?.LeadLastName ?? ""
                                    }
                                  />
                                  {/* </ListItemIcon> */}
                                  <Typography
                                    id="Typography-root"
                                    sx={[
                                      FontStyle,
                                      { color: "#7D7D7D !important" },
                                    ]}
                                  >
                                    {data?.LeadFirstName +
                                      " " +
                                      data?.LeadLastName ?? ""}
                                  </Typography>
                                </ListItem>
                              </>
                            );
                          })}
                      </List>
                    </Div>

                    <Div
                      mt={2}
                      sx={{
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        // height:"170px",
                        margin: "0 8px",
                        padding: "10px",
                        // zIndex: 1,

                        backgroundColor: "#ffff",
                        borderRadius: "5px",
                        // boxShadow: "0px 2px 7px #888888",
                        // border: "1px solid lightgray",
                        // mb: 1,
                        // padding: "0px 20px",
                      }}
                    >
                      <Typography
                        id="Typography-root"
                        sx={[
                          dialogTitle,
                          {
                            backgroundColor: "transparent !important",
                            // borderBottom: "1px solid lightgray",
                            padding: "10px 0px",
                          },
                        ]}
                      >
                        Upcoming Activities
                      </Typography>
                      <JumboScrollbar
                        autoHeight={true}
                        autoHideTimeout={4000}
                        autoHeightMax={scrollHeight ? scrollHeight : 350}
                        autoHide={true}
                        hideTracksWhenNotNeeded
                        id="no-more-tables"
                      >
                        {appointments.length > 0 &&
                          appointments?.map((item, index) => {
                            const date = new Date(item?.Date)
                              .toDateString()
                              .split(" ");
                            return (
                              <Div
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginY: "5px",
                                }}
                              >
                                <Typography
                                  id="Typography-root"
                                  sx={[
                                    FontStyle,
                                    {
                                      backgroundColor: alpha(
                                        Colors?.Mblue,
                                        0.2
                                      ),
                                      color: "##A84F52",
                                      padding: "3px 6px",
                                      borderRadius: "12px",
                                    },
                                  ]}
                                >
                                  {date[2]} {date[1]} {date[3]}
                                </Typography>
                                <Typography
                                  id="Typography-root"
                                  sx={[FontStyle]}
                                >
                                  To send the propsosal
                                </Typography>
                              </Div>
                            );
                          })}
                      </JumboScrollbar>
                    </Div>
                  </CardContent>
                </Div>
              </Card>
            </Grid>

            {/* code for right side card */}

            <Grid item xs={12} sm={12} md={8} xl={8}>
              <Card
                sx={{
                  // px: 1,
                  p: { xs: 1, md: 2 },
                  boxShadow: "none",
                  border: "1px solid #cfcccc",
                  height: "150vh",
                  borderRadius: "5px",
                  width: "100% !important",
                  // height: "100%",
                }}
              >
                <Grid
                  container
                  alignItems={"center"}
                  spacing={2}
                  style={{
                    backgroundColor: "#dcf9f4",
                    width: "calc(100% + 35px)",
                    paddingBottom: "16px",
                  }}
                >
                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(0)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 0 ? Colors?.Mblue : "#613659",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <AiOutlineEdit size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 0 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        Notes
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(1)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 1 ? Colors?.Mblue : "#ED006D",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <TiPhoneOutline size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 1 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        Call History
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(2)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 2 ? Colors?.Mblue : "#6600FF",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <AiOutlineMail size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 2 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        Mail
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(3)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 3 ? Colors?.Mblue : "#E32227",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <AiOutlineClockCircle size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 3 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        Activities
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(4)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 4 ? Colors?.Mblue : "#B7AC44",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <InsertInvitationIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={[
                          FontStyle,
                          {
                            color: tap === 4 ? Colors?.Mblue : "black",
                          },
                        ]}
                        mt={1}
                        textAlign="center"
                      >
                        Appointments
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(5)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 5 ? Colors?.Mblue : "#006194",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <BsClockHistory size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 5 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        History
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={4} md={3} lg={1.7} xl={1.7}>
                    <Div
                      onClick={() => handleTap(6)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 1.5,
                        ":hover": {
                          borderRadius: "5px",
                          backgroundColor: "#99e1d2",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor:
                            tap === 6 ? Colors?.Mblue : "#40A578",
                          mb: 0.5,
                          color: "#ffffff",
                          ":hover": {
                            backgroundColor: alpha(Colors?.Mblue, 0.8),
                          },
                        }}
                      >
                        <GrTransaction size={14} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        mt={1}
                        sx={[
                          FontStyle,
                          {
                            color: tap === 6 ? Colors?.Mblue : "black",
                          },
                        ]}
                        textAlign="center"
                      >
                        Transaction
                      </Typography>
                    </Div>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 2, color: "#000000" }} />

                <Box>
                  <Div sx={{ display: tap === 0 ? "" : "none" }}>
                    <ConatctNotes id={id} data={datas} />
                  </Div>
                  <Div sx={{ display: tap === 1 ? "" : "none" }}>
                    <ContactPhoneNotes id={id} Overviewdatas={datas} />
                  </Div>

                  <Div sx={{ display: tap === 2 ? "" : "none" }}>
                    <EmailContent data={datas} id={id} />
                  </Div>

                  <Div sx={{ display: tap === 3 ? "" : "none" }}>
                    <OpenActivity data={datas} id={id} />
                  </Div>

                  <Div
                    sx={{
                      display: showClosedActivity === true ? "block" : "none",
                    }}
                  >
                    <ClosedActivity id={id} />
                  </Div>

                  <Div
                    sx={{
                      display: tap === 4 ? "block" : "none",
                    }}
                  >
                    <Appointment data={datas} id={id} />
                  </Div>

                  <Div sx={{ display: tap === 5 ? "block" : "none" }}>
                    <ContactsHistory id={id} />
                  </Div>

                  <Div
                    sx={{
                      display: tap === 6 ? "block" : "none",
                    }}
                  >
                    <TransactionReport data={datas} id={id} />
                  </Div>
                </Box>
                <>
                  <CreateContactLead
                    setOpenAddLead={setOpenAddLead}
                    openAddLead={openAddLead}
                    id={id}
                    datas={datas}
                    ReferredList={ReferredList}
                  />
                </>
              </Card>
            </Grid>
          </Grid>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default OverviewContact;
