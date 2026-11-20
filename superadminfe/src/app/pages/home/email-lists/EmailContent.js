import Div from "@jumbo/shared/Div";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  DialogTitle,
  DialogContentText,
  Paper,
  Menu,
  MenuItem,
  InputBase,
  Card,
  FormControl,
  ButtonGroup,
  alpha,
  Badge,
} from "@mui/material";
import { HiOutlineSearch } from "react-icons/hi";
import PropTypes from "prop-types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  TabContext,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { useMutation } from "react-query";
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { mailServices } from "app/services/mail-services";
import DownloadIcon from "@mui/icons-material/Download";
import Draggable from "react-draggable";
import { ModeEdit, Search } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import {
  ButtonStyle,
  CRMTableHead,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  AntTabs,
  AntTab,
  avatarColors,
  customHeight,
  Colors,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import {
  AvatarCircle,
  Cancelbutton,
  DialogBox,
  CustomButton,
  SelectDropdown,
  Dragabledialog,
} from "app/pages/widgets/StylesComponents";
import { IoMdAttach, IoMdClose } from "react-icons/io";
import randomColor from "randomcolor";
import ComposeEmail from "app/pages/contacts/extra-components/ComposeEmail";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

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

const EmailContent = ({ mailItem, onSave, id, data, scrollHeight }) => {
  const [value, setValue] = useState(0);
  const [height, setHeight] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const Swal = useSwalWrapper();
  const [to, setTo] = useState();
  const [showCc, setShowCc] = useState(false);
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState();
  const [message, setMessage] = useState(mailItem ? mailItem?.message : "");
  const [attachFile, setAttachFile] = useState();
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [save, setSave] = useState(false);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  const addMailMutation = useMutation(mailServices.addMail, {
    onSuccess: () => {
      onSave();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Mail has been sent successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const onSendMessage = () => {
    addMailMutation.mutate({ to, subject, message });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // For File uploading API

  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [attachFileId, setAttachFileId] = useState();

  const clear = () => {
    setTo("");
    setCc("");
    setSubject("");
    setMessage(mailItem ? mailItem?.message : "");
    setAttachFile("");
  };

  //  For Background Color Change

  const [colors3, setColors3] = useState([]);

  const generateRandomColorFromList = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  const generateRandomAvatarColors = async (list, colorList) => {
    const colors = await Promise.all(
      list.map(() => generateRandomColorFromList(colorList))
    );
    return colors;
  };

  // For Choose Period

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const periodOptions = [
    "Previous Week",
    "Previous Month",
    "Previous Quarter",
    "Previous Year",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
    "Last One Year",
    "Last Six Month",
    "Last Three Month",
    "Custom Date",
  ];

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let TodayDate = `${year}-${month < 10 ? "0" + month : month}-${day}`;

  const handlePeriodChange = (event, newValue) => {
    setSelectedPeriod(newValue);
    setSelectedDate(null);
    setfromDate("");
    settoDate("");

    let date;

    let startDate; // for previous
    let endDate;

    switch (newValue) {
      case "This Week":
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");

        let ThisWeekStart = startDate?.format("YYYY-MM-DD");
        let ThisWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisWeekStart);
        setCurrentDate(ThisWeekEnd);

        setCustomDate(false);

        return;

      case "This Month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");

        let ThisMonthStart = startDate?.format("YYYY-MM-DD");
        let ThisMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisMonthStart);
        setCurrentDate(ThisMonthEnd);

        setCustomDate(false);

        return;

      case "This Quarter":
        startDate = moment().startOf("quarter");
        endDate = moment().endOf("quarter");

        let ThisQuarterStart = startDate?.format("YYYY-MM-DD");
        let ThisQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisQuarterStart);
        setCurrentDate(ThisQuarterEnd);

        setCustomDate(false);

        return;

      case "This Year":
        startDate = moment().startOf("year");
        endDate = moment().endOf("year");

        let ThisYearStart = startDate?.format("YYYY-MM-DD");
        let ThisYearEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisYearStart);
        setCurrentDate(ThisYearEnd);

        setCustomDate(false);

        return;

      case "Previous Week":
        startDate = moment().subtract(1, "week").startOf("week");
        endDate = moment().subtract(1, "week").endOf("week");

        let PrevWeekStart = startDate?.format("YYYY-MM-DD");
        let PrevWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevWeekStart);
        setCurrentDate(PrevWeekEnd);

        setCustomDate(false);

        return;

      case "Previous Month":
        startDate = moment().subtract(1, "month").startOf("month");
        endDate = moment().subtract(1, "month").endOf("month");

        let PrevMonthStart = startDate?.format("YYYY-MM-DD");
        let PrevMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevMonthStart);
        setCurrentDate(PrevMonthEnd);

        setCustomDate(false);

        return;

      case "Previous Quarter":
        startDate = moment().subtract(1, "quarter").startOf("quarter");
        endDate = moment().subtract(1, "quarter").endOf("quarter");

        let PrevQuarterStart = startDate?.format("YYYY-MM-DD");
        let PrevQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevQuarterStart);
        setCurrentDate(PrevQuarterEnd);

        setCustomDate(false);

        return;

      case "Previous Year":
        startDate = moment().subtract(1, "year").startOf("year");
        endDate = moment().subtract(1, "year").endOf("year");

        let MomentDateStart = startDate?.format("YYYY-MM-DD");
        let MomentDateEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(MomentDateStart);
        setCurrentDate(MomentDateEnd);

        setCustomDate(false);

        return;

      case "Last One Year":
        date = moment().subtract(1, "year");
        setCustomDate(false);

        break;

      case "Last Six Month":
        date = moment().subtract(6, "months");
        setCustomDate(false);

        break;

      case "Last Three Month":
        date = moment().subtract(3, "months");
        setCustomDate(false);

        break;

      case "Custom Date":
        setCustomDate(true);
        break;
      default:
        date = null;
    }
    let MomentDate = date?.format("YYYY-MM-DD");
    setSelectedDate(MomentDate);
    setCurrentDate(TodayDate);
  };

  const NotesFilter = async () => {
    if (
      selectedDate !== "" &&
      selectedDate !== undefined &&
      currentDate !== ""
    ) {
      await axios
        .get(
          `${BASE_URL}/user/CallcenterActivityAccountFilter/?fromdate=${selectedDate}&todate=${currentDate}&Contact_Id=${Number(
            id.id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error");
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .get(
          `${BASE_URL}/user/CallcenterActivityAccountFilter/?fromdate=${fromDate}&todate=${toDate}&Contact_Id=${Number(
            id.id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error");
        });
    }
  };

  const validationSchema = yup.object({
    to: yup.string().required("Receiver Mail Id is required"),
    cc: yup.string().required("CC is required"),
    subject: yup.string().required("Subject is required"),
    message: yup.string().required("Content is required"),
    attachFile: yup.string().required("attachFile is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // const onsubmit = (data) => {
  //   // console.log("data",data);
  //   var payload = {
  //     MailSubject: subject,
  //     Organization_Id: localStorage.getItem("OrganizationId"),
  //     Cc: [cc],
  //     MailBody: mailBodyContent,
  //     file: fileName,
  //     RecevierMailId: to,
  //     Created_By: localStorage.getItem("UserId"),
  //     Updated_By: localStorage.getItem("UserId"),
  //     Contact_Id: id,
  //   };
  //   // console.log("payload",payload)
  //   axios
  //     .post(`${BASE_URL}/user/UserMailMasterCRUD/`, payload, {
  //       headers: {
  //         db: item,
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       toast.success("Mail Sent successfully", {
  //         position: "top-right",
  //         autoClose: 100,
  //       });
  //       getData();
  //       setShowDialog(false);
  //       reset();
  //       clear();
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status === 403) {
  //         const errorMessage =
  //           error.response.data.details || "You don't have permission to do it";
  //         console.log(errorMessage);
  //         toast.error(errorMessage, {
  //           position: "top-right",
  //           autoClose: 100,
  //         });
  //       } else {
  //         toast.error(`${error}`, {
  //           position: "top-right",
  //           autoClose: 100,
  //         });
  //       }
  //     });
  // };

  //  For get the Mail List

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

  const [datas, setDatas] = useState([]);

  const getData = () => {
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
        // console.log("Mail Data",res.data);
        setDatas(res.data);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  //  For Inbox In Email Content
  const [senddata, setSendData] = useState([]);

  const SearchData = (e) => {
    // console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : getData();
  };

  const handleSearch = (search) => {
    var payload = {
      Contact_Id: id,
      search: search,
    };
    axios
      .put(`${BASE_URL}/user/MailListAdditional/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setDatas(res.data || []);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  //   To get Received Data & Get Mail Id

  const [mid, setMid] = useState("");

  const MailData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/ContactCRUD/?id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setMid(res.data.Email_Id);
      const res1 = await axios.get(
        `${BASE_URL}/user/InboxEmailStoring/?UserId=${localStorage.getItem(
          "UserId"
        )}&MailId=${res?.data?.Email_Id}&Contact_Id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // setSendData(res1.data);

      const res2 = await axios.get(
        `${BASE_URL}/user/InboxEmailCRUD/?Contact_Id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setSendData(res2?.data?.results || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getContactMailList = () => {
    axios
      .get(`${BASE_URL}/user/InboxEmailCRUD/?Contact_Id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        setSendData(res?.data?.results || []);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  useEffect(() => {
    MailData();
    getContactMailList();
  }, []);

  useEffect(() => {
    if (value === 0) {
      MailData();
    } else {
      getContactMailList();
    }
  }, [value]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const colorList = [
          "#050A30",
          "#FF3939",
          "#750075",
          "#104210",
          "#FFA500",
          "#104210",
        ];
        const avatarColors1 = await generateRandomAvatarColors(
          datas,
          colorList
        );
        console.log("avatarColors1", avatarColors1);
        setColors3(avatarColors1);
      } catch (error) {}
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [datas]);

  return (
    <>
      {/* dialog compose mail */}
      {/* <Dialog
        open={showDialog}
        // onClose={() => setShowDialog(false)}
        // PaperComponent={PaperComponent}
        // aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={[
            { mb: 0.7 },
            customHeight,
            DisplayFlex,
            {
              bgcolor: "#dcdcdc !important",
              justifyContent: "space-between",
            },
          ]}
        >
          <Typography sx={[dialogTitle]}>Compose Mail</Typography>
        </DialogTitle>

        <Div>
          <DialogContent>
            <DialogContentText>
              <Div sx={{ width: "100%" }}>
                <Typography mb={0.3} sx={FontStyle}>
                  From{" "}
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  size={"small"}
                  type={"email"}
                  value={userDetails?.email || "No Email"}
                  className="input-box"
                  // {...register("to")}
                  placeholder={"From"}
                  disabled
                />
              </Div>

              <Div sx={{ width: "100%", my: 1 }}>
                <Typography mb={0.3} sx={FontStyle}>
                  To{" "}
                </Typography>
                <ButtonGroup
                  sx={{
                    borderRadius: "0px !important",
                    width: "100%",
                    position: "relative",
                  }}
                  aria-label="Basic button group"
                >
                  <TextField
                    sx={{ width: "100%" }}
                    size={"small"}
                    type={"email"}
                    className="input-box col-12"
                    placeholder={"To"}
                    onChange={(e) => setTo(e.target.value)}
                  />
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        position: "absolute",
                        top: "50%",
                        left: "95%",
                        transform: "translate(-50%,-20%)",
                      },
                    ]}
                  >
                    {!Boolean(showCc) && (
                      <Typography
                        sx={[
                          FontStyle,
                          {
                            cursor: "pointer",
                            ":hover": { color: Colors?.Mblue },
                            alignSelf: "center",
                            height: "33px !important",
                            border: "none !important",
                          },
                        ]}
                        onClick={() => setShowCc(true)}
                      >
                        Cc
                      </Typography>
                    )}
                  </Div>
                </ButtonGroup>
              </Div>

              {Boolean(showCc) && (
                <Div sx={{ my: 1, width: "100%" }}>
                  <Typography mb={0.3} sx={FontStyle}>
                    Cc{" "}
                  </Typography>
                  <TextField
                    sx={{ width: "100%" }}
                    size={"small"}
                    type={"email"}
                    className="input-box"
                    placeholder={"CC"}
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                  />
                </Div>
              )}

              <Div sx={{ my: 1, width: "100%" }}>
                <Typography mb={0.3} sx={FontStyle}>
                  Subject{" "}
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  size={"small"}
                  className="input-box"
                  placeholder={"Subject"}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Div>

              <Div sx={{ my: 1, width: "100%" }}>
                <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                  <Typography mb={0.3} sx={FontStyle}>
                    Content{" "}
                  </Typography>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id="attachedFiles"
                    multiple
                    onChange={handleFileInputChange}
                  />
                  <label htmlFor="attachedFiles" style={{ cursor: "pointer" }}>
                    <IoMdAttach style={{ fontSize: 20 }} />
                  </label>
                </Div>

                <Div
                  sx={{ border: "1px solid lightgray", borderRadius: "5px" }}
                >
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        flexWrap: "wrap",
                        gap: "10px !important",
                        p: Boolean(fileNames?.length > 0) ? 1 : 0,
                      },
                    ]}
                  >
                    {fileNames?.map((file, index) => {
                      console.log("image", file, base64DataList[index]);
                      return (
                        <div
                          id="attachedFile"
                          key={index}
                          style={{ position: "relative" }}
                        >
                          <Div sx={{ width: 70, height: 90 }}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`File ${index + 1}`}
                              width={70}
                              height={70}
                            />
                            <p>
                              {file?.name?.length > 10
                                ? file?.name?.substring(0, 10) + "..."
                                : file?.name}
                            </p>
                          </Div>
                          <Div
                            id="attachedRemove"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%,-65%)",
                              width: 70,
                              height: 70,
                              backgroundColor: alpha("#000", 0.2),
                            }}
                          >
                            <Div
                              sx={[DisplayFlex, { justifyContent: "center" }]}
                            >
                              <Typography
                                onClick={() => fileRemoved(index)}
                                sx={[
                                  {
                                    fontSize: "11px",
                                    color: "tomato !important",
                                  },
                                ]}
                              >
                                <IoMdClose
                                  style={{ fontSize: 20, color: "tomato" }}
                                />{" "}
                                Remove
                              </Typography>
                            </Div>
                          </Div>
                        </div>
                      );
                    })}
                  </Div>
                  <TextField
                    multiline
                    sx={{
                      width: "100%",
                      borderWidth: "0px !important",
                      border: "none !important",
                    }}
                    rows={5}
                    maxRows={10}
                    placeholder={"Content"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Div>
              </Div>
            </DialogContentText>
          </DialogContent>
          <Div
            sx={[
              DisplayFlex,
              {
                justifyContent: "center",
                my: 3,
              },
            ]}
          >
            <CustomButton
              type="submit"
              onClick={() => uploadFiles()}
              label="Send"
              Icon="sendIcon"
            />
            <Cancelbutton label="Cancel" onClick={() => { setSave(true); setFileNames([]); }} />
          </Div>
        </Div>
      </Dialog> */}

      <Dragabledialog open={showDialog} maxWidth="lg">
        <ComposeEmail
          endpoint={"UserMailMasterCRUD"}
          data={data}
          setOpenSendMail={setShowDialog}
          setOpen={setSave}
          extraPayload={{ Contact_Id: data?.id }}
        />
      </Dragabledialog>

      <Div>
        <Typography
          sx={[
            dialogTitle,
            {
              backgroundColor: "transparent !important",
              display: { xs: "none", md: "block" },
            },
          ]}
        >
          Email
        </Typography>
        <Div
          sx={[
            DisplayFlex,
            {
              mt: 2,
              flexWrap: "wrap",
              gap: "0px !important",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            <FormControl
              sx={{
                width: "250px",
              }}
            >
              <SelectDropdown
                value={selectedPeriod}
                options={periodOptions || []}
                onChange={handlePeriodChange}
                placeholder="Choose a Period"
              />
            </FormControl>
          </Div>

          <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            {/* <SearchBar
              width={"200px !important"}
              border={"1px solid lightgray"}
              SearchData={SearchData}
            /> */}
            <CustomButton
              onClick={() => setShowDialog(true)}
              label="Send"
              Icon="sendIcon"
            />
          </Div>
        </Div>

        {Boolean(customDate) && (
          <Box sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography sx={[FontStyle]}>From</Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={fromDate}
                  onChange={(e) => setfromDate(e.target.value)}
                />
              </FormControl>
            </Div>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography sx={[FontStyle]}>To</Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={toDate}
                  onChange={(e) => settoDate(e.target.value)}
                />
              </FormControl>
            </Div>
          </Box>
        )}
      </Div>

      {/* close dialog box */}
      <DialogBox
        open={save}
        onClickNo={() => {
          setSave(false);
        }}
        onClickYes={() => {
          setSave(false);
          setShowDialog(false);
          reset();
          // setOpen(false)
          clear();
          // handleReset();
        }}
      />

      <Box
        sx={{
          // borderBottom: 1,
          // borderColor: "divider",
          height: "100% !important",
        }}
      >
        <AntTabs value={value} onChange={handleChange} aria-label="ant example">
          <AntTab label="Sent" {...a11yProps(0)} />
          <AntTab label="Inbox" {...a11yProps(1)} />
        </AntTabs>

        {value == 0 && (
          <JumboScrollbar
            autoHeight={true}
            autoHeightMax={window.innerHeight}
            autoHideTimeOut={1000}
          >
            <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0), mt: 2 }}>
              {datas.map((data, index) => {
                let textLength =
                  data?.RecevierMailId +
                  data?.MailSubject +
                  data?.MailBody +
                  data?.file;
                let avatar =
                  index >= 10 ? avatarColors[index % 10] : avatarColors[index];

                return (
                  <TimelineItem
                    sx={{
                      p: 0,
                      "&::before": {
                        display: "none",
                        // mt: 1,
                      },
                    }}
                  >
                    <TimelineSeparator>
                      {/* <AvatarCircle
                        size="32px"
                        fontSize="10px"
                        fullTitle={true}
                        bgColor={avatar}
                        title={moment(data?.MailSentDate).format("MMM D")}
                      /> */}

                      <Badge color="primary">
                        <Avatar
                          alt="date"
                          sx={{
                            width: 30,
                            height: 30,
                            textAlign: "center",
                            fontSize: "10px !important",
                            backgroundColor: colors3 && colors3[index],
                            // borderColor: "common.white",
                          }}
                        >
                          {moment(data?.MailSentDate).format("MMM D")}
                        </Avatar>
                      </Badge>

                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent
                      sx={{
                        p: (theme) => theme.spacing(0.5, 0),
                        ml: 2.5,
                      }}
                    >
                      <Div
                        sx={{
                          p: 1,
                          backgroundColor:
                            height === index ? "#EAFCEF " : "#fbfcff",
                        }}
                      >
                        <Div
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            // justifyContent: "space-between",
                            textAlign: "start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Card
                            sx={{
                              backgroundColor:
                                height === index ? "#EAFCEF " : "#fbfcff",
                              height: height === index ? "fit-content" : "50px",
                            }}
                          >
                            <Typography sx={[FontStyle]}>
                              From <span> : </span>{" "}
                              <span>ravikumar.r@foyertech.com</span>
                            </Typography>
                            <Typography sx={[FontStyle]}>
                              To <span> : </span>{" "}
                              <span>{data.RecevierMailId}</span>
                            </Typography>
                            <Typography sx={[FontStyle]}>
                              Subject <span> : </span>{" "}
                              <span>{data.MailSubject}</span>
                            </Typography>
                            <Div>
                              <Typography sx={[FontStyle]}>
                                Message <span> : </span>
                              </Typography>
                              <span
                                style={{ fontSize: "12px !important" }}
                                dangerouslySetInnerHTML={{
                                  __html: data.MailBody,
                                }}
                              ></span>
                            </Div>
                            <Typography sx={[FontStyle]}>
                              Attachements{" "}
                              <span>
                                {" "}
                                :{" "}
                                <span>
                                  {data.file} <DownloadIcon />
                                </span>
                              </span>
                            </Typography>
                          </Card>
                          <Div
                            sx={{
                              alignItems: "flex-start",
                              justifySelf: "right",
                              display: "flex",
                              width: "50px",
                              mt: "8px !important",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                index !== height
                                  ? setHeight(index)
                                  : setHeight(null);
                              }}
                              sx={{ p: 0 }}
                            >
                              {height !== index ? (
                                <ArrowDropDownIcon />
                              ) : (
                                <ArrowDropUpIcon />
                              )}
                            </IconButton>
                          </Div>
                        </Div>
                      </Div>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </JumboScrollbar>
        )}
        {value == 1 && (
          <JumboScrollbar
            autoHeight={true}
            autoHeightMax={window.innerHeight}
            autoHideTimeOut={1000}
          >
            <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0) }}>
              {senddata?.length > 0 &&
                senddata?.map((data, index) => {
                  let textLength = data?.sender + data?.recipient + data?.body;
                  //  data?.file
                  let avatar =
                    index >= 10
                      ? avatarColors[index % 10]
                      : avatarColors[index];

                  return (
                    <TimelineItem
                      key={index}
                      sx={{
                        p: 0,
                        "&::before": {
                          display: "none",
                          // mt: 1,
                        },
                      }}
                    >
                      <TimelineSeparator>
                        <AvatarCircle
                          fullTitle={true}
                          size="32px"
                          fontSize="10px"
                          bgColor={avatar}
                          title={moment(data.received_date).format("MMM D")}
                        />

                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent
                        sx={{
                          p: (theme) => theme.spacing(0.5, 0),
                          ml: 2.5,
                        }}
                      >
                        <JumboScrollbar
                          autoHeight={true}
                          autoHideTimeout={4000}
                          autoHeightMin={scrollHeight ? scrollHeight : 83}
                          autoHide={true}
                          hideTracksWhenNotNeeded
                          id="no-more-tables"
                        >
                          <Div
                            sx={{
                              p: 1,
                              backgroundColor:
                                height === index ? "#EAFCEF " : "#fbfcff",
                            }}
                          >
                            <Div
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                // justifyContent: "space-between",
                                textAlign: "start",
                                justifyContent: "space-between",
                                // width:"70% !important"
                              }}
                            >
                              <Card
                                sx={{
                                  backgroundColor:
                                    height === index ? "#EAFCEF " : "#fbfcff",
                                  height:
                                    height === index ? "fit-content" : "50px",
                                  width: "450px !important",
                                  flexWrap: "wrap",
                                  // overflowX: "auto"
                                }}
                              >
                                <Typography sx={[FontStyle]}>
                                  From <span> : </span>{" "}
                                  <span>{data.sender}</span>
                                </Typography>
                                <Typography sx={[FontStyle]}>
                                  To <span> : </span>{" "}
                                  <span>{data.recipient}</span>
                                </Typography>
                                <Typography sx={[FontStyle]}>
                                  Subject <span> : </span>{" "}
                                  <span>{data.subject}</span>
                                </Typography>
                                <Div>
                                  <Typography sx={[FontStyle]}>
                                    Message <span> : </span>
                                  </Typography>
                                  <span
                                    style={{ fontSize: "12px !important" }}
                                    dangerouslySetInnerHTML={{
                                      __html: data.body,
                                    }}
                                  ></span>
                                </Div>
                                {/* <Typography >Attachements <span> : <span >{data.file} <DownloadIcon /></span></span></Typography> */}
                              </Card>
                              <Div
                                sx={{
                                  alignItems: "flex-start",
                                  mr: -2,
                                  float: "right",
                                  justifySelf: "end",
                                  display: "flex",
                                  width: "50px",
                                  mt: "8px !important",
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    index !== height
                                      ? setHeight(index)
                                      : setHeight(null);
                                  }}
                                  sx={{ p: 0 }}
                                >
                                  {height !== index ? (
                                    <ArrowDropDownIcon />
                                  ) : (
                                    <ArrowDropUpIcon />
                                  )}
                                </IconButton>
                              </Div>
                            </Div>
                          </Div>
                        </JumboScrollbar>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          </JumboScrollbar>
        )}
      </Box>
    </>
  );
};

export default EmailContent;
