import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Popover,
  Box,
  FormGroup,
} from "@mui/material";
import {
  CloseIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
} from "app/icons/PngIcons";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import randomColor from "randomcolor";
import {
  AiOutlineClockCircle,
  AiOutlineEdit,
  AiOutlineMail,
} from "react-icons/ai";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import moment from "moment";
import { BASE_URL, BASE_URL1, Tenantname } from "app/services/auth-services";
import { alpha, styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import "./dialogCall.css";
import { CallEnd, Mic, MicOff, VolumeOff, VolumeUp } from "@mui/icons-material";
import { IoIosArrowBack, IoMdAttach, IoMdClose } from "react-icons/io";
import {
  Colors,
  DisplayFlex,
  FontStyle,
  customHeight,
  dialogFontSize,
  dialogTitle,
  generateRandomColor,
  input_label,
  input_label1,
} from "app/pages/widgets/CRMStyles";
import { BsClockHistory } from "react-icons/bs";

import AccountNotes from "./AccountNotes";
import AccountMail from "./AccountMail";

import AccountHistory from "./AccountHistory";
import AccountAppointment from "./AccountAppointment";
import AccountOpenActivity from "./OpenActivityAccount";
import {
  AvatarCircle,
  Cancelbutton,
  ckEditorOnchange,
  CustomButton,
  CustomCKEditor,
  Customgrid,
  DialogBox,
  Dragabledialog,
  errorFilter,
} from "app/pages/widgets/StylesComponents";
import { MdOutlineModeEdit, MdOutlineScheduleSend } from "react-icons/md";
import { AutoHeight } from "app/redux/auth/localStorage";
import { ProfileImageUpload } from "app/pages/contacts/extra-components/APIs";


import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ComposeEmail from "app/pages/contacts/extra-components/ComposeEmail";

const AccountOverview = ({ scrollHeight }) => {
  const navigate = useNavigate();

  const [base64, setbase64] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [openUploadEdit, setOpenUploadEdit] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [showMail, setShowMail] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [phonenotes, setPhoneNotes] = useState(false);
  const [showOpenActivity, setShowOpenActivity] = useState(false);
  const [showClosedActivity, setShowClosedActivity] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [showDial, setShowDial] = useState(false);
  const [volume, setVolume] = useState(true);
  const [mic, setMic] = useState(true);
  const [noteCall, setNoteCall] = useState(false);

  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachFile, setAttachFile] = useState("");
  const [showMailDialog, setShowMailDialog] = useState(false);
  const [showCloseMailDialog, setShowCloseMailDialog] = useState(false);
  const [expanded, setExpanded] = useState("panel1");
  const [bannerColor, setBannerColors] = useState("");
  const [showCc, setShowCc] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("UserDetails"));

  const { id } = useParams();
  const [tap, setTap] = useState(0);
  const handleTap = useCallback(
    (value) => {
      setTap(value);
    },
    [tap],
  );
  console.log("overview", id);

  // image upload function
  const handleChangeImage = (e) => {
    // console.log("file uploaded: ", e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      setImage(reader.readAsBinaryString(file));
      setImageName(randomColor() + file?.name);
    }
  };
  const handleReaderLoaded = (e) => {
    // console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setbase64(btoa(binaryString));
  };

  // upload profile image api
  const handleSaveImage = (e) => {
    let payload = { base64, imageName, id };
    let error = errorFilter(payload);

    if (Object.keys(error).length === 0) {
      ProfileImageUpload(payload, setOpenUploadEdit, "AccountCRUD", getData);
      setbase64("");
      setOpenUploadEdit(false);
    }
  };

  // Getting the Conatct details based on the Id
  const item = "crmuseradmin1";
  const token = localStorage.getItem("accesstoken");

  const [datas, setDatas] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/AccountCRUD/?id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      console.log("Data fetched successfully:", response.data);
      setDatas(response.data);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  };

  const date = new Date();
  let day = date.getDate();
  const getAppointments = () => {
    // Deleted due to 404 error on LeadUpcomingActivities
  };

  // Generate Colors
  const [random, setRandom] = useState([]);
  const [sample, setSample] = useState([1, 2]);
  //  for reminder setup
  const [firstREmainderHrs, setfirstREmainderHrs] = useState("");
  const [Repeateveryhrs, setRepeateveryhrs] = useState("");
  const [firstRemainder, setfirstRemainder] = useState("");
  const [repeatEvery, setrepeatEvery] = useState("");
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [show, setShow] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const generateRandomAvatarColors1 = async (list) => {
    const colors = await Promise.all(list.map(() => randomColor()));
    return colors;
  };

  const onChange = (evt, editor) => {
    ckEditorOnchange(evt, editor, setEditorContent);
  };

  const setreminder = (event) => {
    setIsReminderSet(true);
    setShow(true);
    console.log("inside");
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
  // Getting the Activities List

  // For Mail List & Call List

  const [maildatas, setMailDatas] = useState([]);
  const [calldatas, setCallDatas] = useState([]);

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

      return axios.post(`${BASE_URL}/superadmin/UserFilesandUrlsCRUD/`, payload, {
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
      .post(`${BASE_URL}/superadmin/UserMailMasterCRUD/`, payload, {
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

  const MailData = () => {
    // Deleted due to 404 error on AccountMailListAdditional
  };
  const CallData = () => {
    // Commented out UserLeadCallCRUD api since we didn't have it in UI
    /*
    axios
      .get(`${BASE_URL}/superadmin/UserLeadCallCRUD/?id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log("for contact check")
        // console.log("Mail Data check for call",res.data.results.pop());
        setCallDatas(res?.data?.results?.pop()?.Created_Date);
      })
      .catch((error) => {
        console.log("error", error);
      });
    */
  };

  const handleEditorChange = (event, editor) => {
    const value = editor.getData();
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    setNotes(value);
  };

  useEffect(() => {
    // MailData();
    // CallData();
  }, [id]);

  useEffect(() => {
    getData();
    // getAppointments();
    setBannerColors(generateRandomColor());
  }, []);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));

  const onClosed = () => {
    setShowDial(false);
    setNoteCall(false);
  };

  // Lead Prediction popup

  const [leadprediction, setPrediction] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    var payload = {
      Company_Name: datas?.Organization_Name || "Foyer Tech",
      Receiver_Name: datas?.Contact_Name,
      Contact_Number: datas?.Phone_Number,
      Selected_Date: moment().format("YYYY-MM-DD"),
      Next_SheduledTime: nextdate,
      Call_Duration: duration,
      Missed_Rank: MissedRang,
      Call_Recording: CallRecording,
      Call_Context: callcontext,
      Call_Con_Status: callconvstatus,
      Call_Busy_hour: busy,
      Activity_Type: "Call",
      Activity_relates: "Account",
      Reminder_Payload: Boolean(show)
        ? {
            RemainderDueDate: firstRemainder + " " + firstREmainderHrs,
            Repeat_EveryDay: repeatEvery + " " + Repeateveryhrs,
            ReminderFor: "Reminder for Deal Calls",
            RemainderMessage: editorContent,
            Created_By: localStorage.getItem("UserId"),
            Updated_By: localStorage.getItem("UserId"),
          }
        : null,
      Details: notes,
      Select_Status: status,
      CallCenter_Id: false,
      Account_Id: Number(id),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
      Organization_Id: localStorage.getItem("OrganizationId"),
    };
    axios
      .post(`${BASE_URL}/superadmin/CallcenterActivityCRUD/`, payload, {
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

        if (datas?.No_of_Calls == null || "" || NaN) {
          var x = 1;
        } else {
          var x = parseInt(datas?.No_of_Calls) + 1;
        }

        // For Updateing the History of Changes
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.CallCenter_Id,
          Updated_Person: `${editUser} Created this Account Phone History.`,
          Module_Name: "Account Phone History",
          Account_Id: Number(id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/superadmin/AccountHistorycrud/`, histotypayload, {
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

        // CreateTask(editUser)
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
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [knowlaritydatas, setKnowlaritydatas] = useState([]);
  const [agentdetails, setagentdetails] = useState([]);
  const [callogsdetails, setcallogsdetails] = useState([]);

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
        // setKnowlaritydatas(res?.data);
        // setcallogsdetails(res.data)
        const mynumberList = res?.data?.filter((item) =>
          item.Agent_Number.includes(userDetails?.PhoneNo),
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
    // Deleted due to 404 error on KnowlarityConfigurationCRUD
  };
  const getagentnumber = async () => {
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

        onGoingCallApi(agentnum);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  useEffect(() => {
    // getKnowlarityConfiguration();
  }, []);

  //  OnGoing Call API

  const onGoingCallApi = async (agentnum) => {
    console.log("agentnum", agentnum);
    let knopayload = {
      k_number: knowlaritydatas?.Knowlarity_Number,
      agent_number: agentnum?.country_code + agentnum?.phone,
      customer_number: "+91" + datas?.Phone_Number,
      caller_id: knowlaritydatas?.Knowlarity_CallerId,
      caller_name: datas?.Contact_Name,
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
      })
      .catch((error) => {
        console.log("error");
      });
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        calllogs();
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  //  Right time to Call

  const [rightTimeCalls, setRightTimeCalls] = useState([]);
  const [rightTimeToCallData, setRightTimeToCallData] = useState({});
  const [openShcedule, setOpenshcedule] = useState(false);

  const ContactRightTimeAdditional = async () => {
    // Deleted due to 404 error on ContactRightTimeAdditional
  };
  console.log("rightTimeCalls", rightTimeCalls);
  // right time to call function
  const rightTimeToCallSave = async () => {
    try {
      let response;
      if (!Boolean(rightTimeCalls?.id)) {
        const payload = {
          Lead_Id: datas?.id,
          Right_Time:
            rightTimeToCallData
              ?.filter((right) => right?.checked)
              ?.map((right) => right?.time) ?? [],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        response = await axios.post(
          `${BASE_URL}/superadmin/ContactRightTimeCRUD/`,
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
      } else if (Boolean(rightTimeCalls?.id)) {
        const payload = {
          id: rightTimeCalls?.id,
          Lead_Id: datas?.id,
          Right_Time:
            rightTimeToCallData
              ?.filter((right) => right?.checked)
              ?.map((right) => right?.time) ?? [],
          Organization_Id: localStorage.getItem("OrganizationId"),
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        response = await axios.put(
          `${BASE_URL}/superadmin/ContactRightTimeCRUD/`,
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
        Customer_number: rightTimeTo?.PhoneNo,
        Call_status: rightTimeTo?.Select_Status,
        Call_duration: rightTimeTo?.Call_Duration,
        business_type: rightTimeTo?.Business_Call_Type,
      };
      const response = await axios.post(
        `${BASE_URL1}/superadmin/RighttimetocallContacts/`,
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
    // Deleted due to 404 error on KnowlarityAgentCalllogsandActivityList
  };
  useEffect(() => {
    // ContactRightTimeAdditional();
    // rightTimeToCallLists();
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
                        {datas?.Contact_Name &&
                          datas?.Contact_Name[0]?.toUpperCase()}
                        {datas?.Contact_Name &&
                          datas?.Contact_Name[1]?.toUpperCase()}
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
                      {datas?.Contact_Name}
                    </Typography>
                    <Typography
                      id="Typography-root"
                      sx={{ color: "#F2F2F2", fontSize: "16px" }}
                    >
                      {datas?.Phone_Number}
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Status
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Duration
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Busy Hour
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Coversation Status
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Call Context
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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
                        className="col-md-12 col-lg-6 col-xl-5 input-label"
                        sx={[input_label]}
                      >
                        Next Scheduled Date
                      </Typography>
                      <Div className="col-md-12 col-lg-6 col-xl-6">
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

                <Div className="col-12 col-md-12">
                  <Grid container>
                    <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                      <Typography className="col-md-2.5" sx={[input_label]}>
                        Notes
                      </Typography>
                      <Div className="col-md-12">
                        <CKEditor
                          editor={ClassicEditor}
                          content={notes}
                          data={notes}
                          onChange={handleEditorChange}
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

            {/*  reminder setup */}
            <Dragabledialog
              open={isReminderSet}
              onClose={() => setIsReminderSet(false)}
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
                      <Typography sx={[input_label]}>
                        Reminder Message
                      </Typography>
                    </Grid>

                    <Grid item colSpan={8}>
                      <Div>
                        <CustomCKEditor
                          initData={editorContent}
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
                    onClick={() => setIsReminderSet(true)}
                  />
                  <Cancelbutton onClick={() => setIsReminderSet(false)} />
                </Div>
              </DialogActions>
            </Dragabledialog>
          </form>
        </Dragabledialog>

        {/* mail modal */}

        <Dragabledialog
          maxWidth="lg"
          open={showMailDialog}
          // onClose={() => setOpenSendMail(false)}
        >
          <ComposeEmail
            extraPayload={{ Account_Id: datas?.id }}
            endpoint={"AccountMailMasterCRUD"}
            data={datas}
            setOpenSendMail={setShowMailDialog}
            setOpen={setShowCloseMailDialog}
          />
        </Dragabledialog>

        <DialogBox
          onClickNo={() => setShowCloseMailDialog(false)}
          onClickYes={() => {
            setShowMailDialog(false);
            setFileNames([]);
          }}
          open={showCloseMailDialog}
        />

        <Div
          sx={{
            display: "flex",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={4} xl={4}>
              <Card
                sx={{
                  mb: 2,
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #f0f0f0",
                  height: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  bgcolor: "#ffffff",
                }}
              >
                <Div sx={{ position: "relative" }}>
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        background: `linear-gradient(135deg, #147659 0%, #209372 100%)`,
                        minHeight: "230px",
                        height: "auto",
                        width: "100%",
                        py: 2,
                        px: { xs: 2, md: 4 },
                        color: "#ffffff",
                      },
                    ]}
                  >
                    <Div sx={{ width: "100%" }}>
                      <Div>
                        <IconButton
                          sx={{
                            cursor: "pointer",
                            ml: -2,
                            color: "white",
                            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" }
                          }}
                          onClick={() => navigate(`/customer-list`)}
                        >
                          <IoIosArrowBack size={18} />
                        </IconButton>
                      </Div>

                      <Div
                        sx={[
                          DisplayFlex,
                          {
                            justifyContent: "space-between !important",
                            width: "100%",
                            flexWrap: "wrap",
                            gap: 2,
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
                                gap: "8px",
                                width: "100% !important",
                                justifyContent: "center",
                                flexWrap: "wrap",
                              },
                            ]}
                          >

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
                                                          : item,
                                                    ),
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

                        <Div sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            id="Typography-root"
                            sx={{
                              fontSize: { xs: "22px", md: "29px" },
                              color: "white !important",
                              fontWeight: 700,
                              wordBreak: "break-word",
                            }}
                          >
                            {datas?.Contact_Name || "No Name"}
                          </Typography>

                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.85) !important",
                                my: 1,
                                wordBreak: "break-word",
                              },
                            ]}
                          >
                            {datas?.Phone_Number || "No Mobile No"}
                          </Typography>

                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.85) !important",
                                my: 1,
                                wordBreak: "break-word",
                              },
                            ]}
                          >
                            {datas?.Mail || "No Email"}
                          </Typography>

                          {Boolean(datas?.Company_Name) && (
                            <Typography
                              id="Typography-root"
                              sx={[
                                {
                                  fontSize: "14px",
                                  color: "rgba(255, 255, 255, 0.85) !important",
                                  my: 1,
                                  wordBreak: "break-word",
                                },
                              ]}
                            >
                              {datas?.Company_Name || "No Company Name"}
                            </Typography>
                          )}
                          <Typography
                            id="Typography-root"
                            sx={[
                              {
                                fontSize: "14px",
                                color: "rgba(255, 255, 255, 0.85) !important",
                                my: 1,
                                wordBreak: "break-word",
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

                  <CardContent sx={{ p: 2 }}>
                    <Div
                      sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: "#fafafa",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography
                        id="Typography-root"
                        sx={[
                          dialogTitle,
                          {
                            backgroundColor: "transparent !important",
                            pb: 1,
                            borderBottom: "1px solid #f0f0f0",
                            color: "#333",
                            fontWeight: 700,
                            mb: 2,
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
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <MailIcon size={16} color="#96a0b5" />
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#555 !important", fontSize: "13px", wordBreak: "break-word" }]}
                          >
                            Last contacted through mail on{" "}
                            {maildatas ? (
                              <span style={{ fontWeight: 600, color: "#333" }}>
                                {moment(maildatas).format("D MMM YYYY")}
                              </span>
                            ) : (
                              <span style={{ color: "#96a0b5" }}>Never</span>
                            )}
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <PhoneIcon size={16} color="#96a0b5" />
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#555 !important", fontSize: "13px", wordBreak: "break-word" }]}
                          >
                            Last contacted through phone on{" "}
                            {calldatas ? (
                              <span style={{ fontWeight: 600, color: "#333" }}>{calldatas}</span>
                            ) : (
                              <span style={{ color: "#96a0b5" }}>Never</span>
                            )}
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            py: 1,
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                          }}
                        >
                          <LocationIcon size={16} color="#96a0b5" />
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { color: "#555 !important", fontSize: "13px", wordBreak: "break-word" }]}
                          >
                            Last visited on <span style={{ fontWeight: 600, color: "#333" }}>17 Apr 2024</span>
                          </Typography>
                        </Div>
                      </List>
                    </Div>

                    <Div
                      sx={{
                        p: 2,
                        bgcolor: "#fafafa",
                        borderRadius: "12px",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography
                        id="Typography-root"
                        sx={[
                          dialogTitle,
                          {
                            backgroundColor: "transparent !important",
                            pb: 1,
                            borderBottom: "1px solid #f0f0f0",
                            color: "#333",
                            fontWeight: 700,
                            mb: 2,
                          },
                        ]}
                      >
                        Upcoming Activities
                      </Typography>
                      <JumboScrollbar
                        autoHeight={true}
                        autoHideTimeout={4000}
                        autoHeightMin={AutoHeight(3.3)}
                        autoHide={true}
                        hideTracksWhenNotNeeded
                        id="no-more-tables"
                      >
                        {appointments.length > 0 ? (
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
                                  marginY: "8px",
                                }}
                              >
                                <Typography
                                  id="Typography-root"
                                  sx={[
                                    FontStyle,
                                    {
                                      backgroundColor: alpha(
                                        Colors?.Mblue,
                                        0.08,
                                      ),
                                      color: Colors?.Mblue,
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      fontSize: "11px",
                                      fontWeight: 600,
                                    },
                                  ]}
                                >
                                  {date[2]} {date[1]} {date[3]}
                                </Typography>
                                <Typography
                                  id="Typography-root"
                                  sx={[FontStyle, { fontSize: "13px", color: "#333", fontWeight: 500 }]}
                                >
                                  To send the proposal
                                </Typography>
                              </Div>
                            );
                          })
                        ) : (
                          <Typography sx={{ fontSize: "13px", color: "#96a0b5", textAlign: "center", py: 2 }}>
                            No upcoming activities scheduled
                          </Typography>
                        )}
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
                  p: { xs: 2, md: 3 },
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
                  border: "1px solid #f0f0f0",
                  height: "100%",
                  borderRadius: "12px",
                  width: "100% !important",
                  bgcolor: "#ffffff",
                }}
              >
                <Grid container alignItems={"center"} spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Div
                      onClick={() => handleTap(0)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 2,
                        px: 1,
                        borderRadius: "12px",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        border: `1px solid ${tap === 0 ? Colors?.Mblue : "#f0f0f0"}`,
                        backgroundColor: tap === 0 ? alpha(Colors?.Mblue, 0.04) : "transparent",
                        "&:hover": {
                          borderColor: tap === 0 ? Colors?.Mblue : "#e0e0e0",
                          backgroundColor: tap === 0 ? alpha(Colors?.Mblue, 0.06) : "#f9f9f9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: tap === 0 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.08),
                          mb: 1,
                          color: tap === 0 ? "#ffffff" : Colors?.Mblue,
                          "&:hover": {
                            backgroundColor: tap === 0 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.12),
                          },
                        }}
                      >
                        <AiOutlineEdit size={16} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: tap === 0 ? Colors?.Mblue : "#555",
                        }}
                        textAlign="center"
                      >
                        Notes
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={2.4}>
                    <Div
                      onClick={() => handleTap(2)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 2,
                        px: 1,
                        borderRadius: "12px",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        border: `1px solid ${tap === 2 ? Colors?.Mblue : "#f0f0f0"}`,
                        backgroundColor: tap === 2 ? alpha(Colors?.Mblue, 0.04) : "transparent",
                        "&:hover": {
                          borderColor: tap === 2 ? Colors?.Mblue : "#e0e0e0",
                          backgroundColor: tap === 2 ? alpha(Colors?.Mblue, 0.06) : "#f9f9f9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: tap === 2 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.08),
                          mb: 1,
                          color: tap === 2 ? "#ffffff" : Colors?.Mblue,
                          "&:hover": {
                            backgroundColor: tap === 2 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.12),
                          },
                        }}
                      >
                        <AiOutlineMail size={16} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: tap === 2 ? Colors?.Mblue : "#555",
                        }}
                        textAlign="center"
                      >
                        Mail
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={2.4}>
                    <Div
                      onClick={() => handleTap(3)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 2,
                        px: 1,
                        borderRadius: "12px",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        border: `1px solid ${tap === 3 ? Colors?.Mblue : "#f0f0f0"}`,
                        backgroundColor: tap === 3 ? alpha(Colors?.Mblue, 0.04) : "transparent",
                        "&:hover": {
                          borderColor: tap === 3 ? Colors?.Mblue : "#e0e0e0",
                          backgroundColor: tap === 3 ? alpha(Colors?.Mblue, 0.06) : "#f9f9f9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: tap === 3 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.08),
                          mb: 1,
                          color: tap === 3 ? "#ffffff" : Colors?.Mblue,
                          "&:hover": {
                            backgroundColor: tap === 3 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.12),
                          },
                        }}
                      >
                        <AiOutlineClockCircle size={16} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: tap === 3 ? Colors?.Mblue : "#555",
                        }}
                        textAlign="center"
                      >
                        Activities
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={2.4}>
                    <Div
                      onClick={() => handleTap(4)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 2,
                        px: 1,
                        borderRadius: "12px",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        border: `1px solid ${tap === 4 ? Colors?.Mblue : "#f0f0f0"}`,
                        backgroundColor: tap === 4 ? alpha(Colors?.Mblue, 0.04) : "transparent",
                        "&:hover": {
                          borderColor: tap === 4 ? Colors?.Mblue : "#e0e0e0",
                          backgroundColor: tap === 4 ? alpha(Colors?.Mblue, 0.06) : "#f9f9f9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: tap === 4 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.08),
                          mb: 1,
                          color: tap === 4 ? "#ffffff" : Colors?.Mblue,
                          "&:hover": {
                            backgroundColor: tap === 4 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.12),
                          },
                        }}
                      >
                        <InsertInvitationIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: tap === 4 ? Colors?.Mblue : "#555",
                        }}
                        textAlign="center"
                      >
                        Appointments
                      </Typography>
                    </Div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={2.4}>
                    <Div
                      onClick={() => handleTap(5)}
                      sx={{
                        textAlign: "center",
                        cursor: "pointer",
                        py: 2,
                        px: 1,
                        borderRadius: "12px",
                        transition: "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)",
                        border: `1px solid ${tap === 5 ? Colors?.Mblue : "#f0f0f0"}`,
                        backgroundColor: tap === 5 ? alpha(Colors?.Mblue, 0.04) : "transparent",
                        "&:hover": {
                          borderColor: tap === 5 ? Colors?.Mblue : "#e0e0e0",
                          backgroundColor: tap === 5 ? alpha(Colors?.Mblue, 0.06) : "#f9f9f9",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          backgroundColor: tap === 5 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.08),
                          mb: 1,
                          color: tap === 5 ? "#ffffff" : Colors?.Mblue,
                          "&:hover": {
                            backgroundColor: tap === 5 ? Colors?.Mblue : alpha(Colors?.Mblue, 0.12),
                          },
                        }}
                      >
                        <BsClockHistory size={16} />
                      </IconButton>
                      <Typography
                        id="Typography-root"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: tap === 5 ? Colors?.Mblue : "#555",
                        }}
                        textAlign="center"
                      >
                        History
                      </Typography>
                    </Div>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />
                <Box>
                  {tap === 0 && <AccountNotes id={id} data={datas} />}
                  {tap === 2 && <AccountMail data={datas} id={id} />}
                  {tap === 3 && <AccountOpenActivity data={datas} id={id} />}
                  {tap === 4 && <AccountAppointment data={datas} id={id} />}
                  {tap === 5 && <AccountHistory id={id} />}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Div>

        <Dialog
          open={leadprediction}
          onClose={() => setPrediction(false)}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogContent>
            <Div
              sx={{
                display: "flex",
                minWidth: "300px",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <Typography
                id="Typography-root"
                variant="h3"
                fontWeight={600}
                marginBottom="10px"
                sx={{ cursor: "move" }}
              >
                Lead Prediction
              </Typography>
              <IconButton onClick={() => setPrediction(false)}>
                <CloseIcon size={24} color="black" />
              </IconButton>
            </Div>
            <Div
              sx={{
                display: "flex",
              }}
            >
              <Typography
                id="Typography-root"
                variant="h3"
                fontWeight={600}
                marginBottom="10px"
                sx={{ cursor: "move" }}
              >
                Prediction
              </Typography>
              <Typography
                id="Typography-root"
                variant="h3"
                fontWeight={600}
                marginBottom="10px"
                sx={{
                  cursor: "move",
                  ml: 12.5,
                }}
              >
                {datas && datas?.prediction}
              </Typography>
            </Div>
            <Div
              sx={{
                display: "flex",
                mt: 1,
              }}
            >
              <Typography
                id="Typography-root"
                variant="h3"
                fontWeight={600}
                marginBottom="10px"
                sx={{
                  cursor: "move",
                }}
              >
                Recommended Action
              </Typography>
              <Typography
                id="Typography-root"
                variant="h3"
                fontWeight={600}
                marginBottom="10px"
                sx={{ cursor: "move", ml: 2 }}
              >
                {datas & datas?.Recommaned_Action}
              </Typography>
            </Div>
          </DialogContent>
        </Dialog>
      </JumboContentLayoutMain>
    </>
  );
};

export default AccountOverview;
