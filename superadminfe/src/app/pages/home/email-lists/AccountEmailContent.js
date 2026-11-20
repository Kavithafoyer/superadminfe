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
import { ModeEdit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";

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

const DealEmailContent = ({ mailItem, onSave, id, scrollHeight }) => {
  const [value, setValue] = React.useState(0);
  const [height, setHeight] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const Swal = useSwalWrapper();
  const [to, setTo] = React.useState();
  const [cc, setCc] = React.useState("");
  const [subject, setSubject] = React.useState();
  const [message, setMessage] = React.useState(
    mailItem ? mailItem?.message : "",
  );
  const [attachFile, setAttachFile] = React.useState();
  const [anchorElAction, setAnchorElAction] = useState(null);

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

  // For File uploading API
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const [base64Data, setBase64Data] = useState("");
  const [fileName, setFileName] = useState("");
  const [attachFileId, setAttachFileId] = useState();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Data(base64String);
        // console.log("base64String", base64String);
        const filename = file.name;
        const filetype = file.type;
        setFileName(file.name);
        // console.log("filename", filename, filetype);

        var payload = {
          Organization_Id: localStorage.getItem("OrganizationId"),
          File: base64String,
          FileName: filename,
          Urls: "",
          Description: "Upload File",
          Created_By: localStorage.getItem("UserId"),
          Updated_By: localStorage.getItem("UserId"),
        };
        axios
          .post(`${BASE_URL}/superadmin/UserFilesandUrlsCRUD/`, payload, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            // console.log("PP", res);
            setAttachFileId(res.data.id);
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
            } else {
              toast.error(`${error}`, {
                position: "top-right",
                autoClose: 100,
              });
            }
          });
      };

      reader.readAsDataURL(file);
    }
  };

  //  Mail Sending Functionality  & Validation

  const mailBodyContent = `<div class='card'>
  <div class='card-body'>
    <h4 className="card-subtitle mb-2 text-muted">Dear Sir,</h4>
    <div class='card-text'>
      <p>${message}</p>
      <p>Click the button to download the attachment </p>
      <div><a href="{{url}}"> 
      <button type='button' class='btn btn-primary' style='background-color: '#3c7c33'; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; text-decoration: none;'>Download Attachment</button></a>
      </div>
          </div>
  </div>
  </div>`;

  const validationSchema = yup.object({
    to: yup.string().required("Receiver Mail Id is required"),
    cc: yup.string(),
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

  const onsubmit = (data) => {
    console.log("data", data);
    let payload = {
      MailSubject: "test",
      Organization_Id: localStorage.getItem("OrganizationId"),
      MailBody: mailBodyContent,
      file: fileName,
      Cc: [cc],
      RecevierMailId: to,
      UserId: localStorage.getItem("UserId"),
      Deal_Id: id,
    };

    console.log("payload", payload);

    axios
      .post(`${BASE_URL}/superadmin/AccountMailMasterCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        toast.success("Mail Sent successfully", {
          position: "top-right",
          autoClose: 100,
        });
        getData();
        setShowDialog(false);
        reset();
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

  //  For get the Mail List

  const [datas, setDatas] = useState([]);

  const getData = () => {
    axios
      .get(
        `${BASE_URL}/superadmin/AccountMailMasterListAdditional/?Account_Id=${id}`,
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
        // console.log("Mail Data",res.data);
        setDatas(res.data);
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

  useEffect(() => {
    getData();
  }, []);

  //  For generate Color
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
          "#050A30",
          "#FF3939",
          "#750075",
          "#104210",
          "#FFA500",
          "#104210",
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

  //  For Inbox In Email Content
  const [senddata, setSendData] = useState([]);
  const [colors4, setColors4] = useState([]);

  const generateRandomColorFromList1 = (list) => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  const generateRandomAvatarColors1 = async (list, colorList) => {
    const colors = await Promise.all(
      list.map(() => generateRandomColorFromList1(colorList)),
    );
    return colors;
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
          senddata,
          colorList1,
        );
        // console.log("avatarColors1", avatarColors1);
        setColors4(avatarColors2);
      } catch (error) {}
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [senddata]);

  // For Search Functionality

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
      .put(`${BASE_URL}/superadmin/MailActivityQuestionsCRUD`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setDatas(res.data);
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

  //   To get Received Data & Get Mail Id

  const [mid, setMid] = useState("");

  const MailData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/superadmin/HistoryDealMailMasterFilter/?Deal_Id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      setMid(res.data.Email_Id);
      const res1 = await axios.get(
        `${BASE_URL}/superadmin/InboxEmailStoring/?UserId=1&MailId=${res.data.Email_Id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      // setSendData(res1.data);

      const res2 = await axios.get(`${BASE_URL}/superadmin/InboxEmailCRUD/`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setSendData(res2.data);
    } catch (error) {}
  };

  useEffect(() => {
    MailData();
  }, []);

  return (
    <Div sx={{ height: "982px" }}>
      <Typography variant="h3" fontWeight={600}>
        Email
      </Typography>
      <TabContext value={value}>
        <Div sx={{ display: "flex", justifyContent: "end", mr: 4 }}>
          <TextField
            className="col-3 input-box1"
            id="outlined-search"
            type="search"
            onChange={SearchData}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HiOutlineSearch size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 100, mt: { xs: 0.5, md: 0 }, mr: 2 }}
          />
          <Button className="save-button" onClick={() => setShowDialog(true)}>
            Compose Mail
          </Button>
          <Dialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <form onSubmit={handleSubmit(onsubmit)}>
              <DialogContent>
                <Typography
                  variant="h3"
                  fontWeight={600}
                  marginBottom="10px"
                  sx={{ cursor: "move" }}
                  id="draggable-dialog-title"
                >
                  Compose Mail
                </Typography>

                <DialogContentText>
                  <TextField
                    className={`input-box col-12 mb-1 ${
                      errors.to ? "is-invalid" : ""
                    }`}
                    size={"small"}
                    type={"email"}
                    {...register("to")}
                    placeholder={"To"}
                    sx={{
                      boxShadow: "0px 0px 5px lightgray",
                      borderRadius: "5px",
                      marginY: "2px",
                    }}
                    onChange={(e) => setTo(e.target.value)}
                  />
                  <Div style={{ color: "red" }}>{errors.to?.message}</Div>
                  <TextField
                    className={`input-box col-12 mb-1 ${
                      errors.cc ? "is-invalid" : ""
                    }`}
                    size={"small"}
                    type={"email"}
                    {...register("cc")}
                    placeholder={"CC"}
                    value={cc}
                    sx={{
                      boxShadow: "0px 0px 5px lightgray",
                      borderRadius: "5px",
                      marginY: "2px",
                    }}
                    onChange={(e) => setCc(e.target.value)}
                  />
                  <Div style={{ color: "red" }}>{errors.cc?.message}</Div>
                  <TextField
                    className={`input-box col-12 mb-1 ${
                      errors.subject ? "is-invalid" : ""
                    }`}
                    size={"small"}
                    placeholder={"Subject"}
                    {...register("subject")}
                    value={subject}
                    sx={{
                      boxShadow: "0px 0px 5px lightgray",
                      borderRadius: "5px",
                      marginY: "2px",
                    }}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <Div style={{ color: "red" }}>{errors.subject?.message}</Div>
                  <TextField
                    multiline
                    className={`multiline-boxcol-12 mb-1 ${
                      errors.message ? "is-invalid" : ""
                    }`}
                    rows={5}
                    maxRows={10}
                    placeholder={"Content"}
                    {...register("message")}
                    value={message}
                    sx={{
                      width: "100%",
                      boxShadow: "0px 0px 5px lightgray",
                      borderRadius: "5px",
                      marginY: "2px",
                    }}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Div style={{ color: "red" }}>{errors.message?.message}</Div>
                  <TextField
                    className={`input-box col-12 mb-1 ${
                      errors.attachFile ? "is-invalid" : ""
                    }`}
                    type="file"
                    placeholder={"Attach file"}
                    {...register("attachFile")}
                    value={attachFile}
                    sx={{
                      boxShadow: "0px 0px 5px lightgray",
                      borderRadius: "5px",
                      marginY: "5px",
                    }}
                    onChange={handleFileInputChange}
                  />
                  <Div style={{ color: "red" }}>
                    {errors.attachFile?.message}
                  </Div>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Div sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Button type="submit" className="save-button" sx={{ mr: 2 }}>
                    Send
                  </Button>
                  <Button
                    className="cancel-button"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancel
                  </Button>
                </Div>
              </DialogActions>
            </form>
          </Dialog>
        </Div>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Sent" {...a11yProps(0)} />
            <Tab label="Inbox" {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0} sx={{ pl: 0, pr: 0 }}>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={scrollHeight ? scrollHeight : 880}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0), mt: 2 }}>
                {datas.map((data, index) => {
                  return (
                    <TimelineItem
                      sx={{
                        p: 0,
                        "&::before": {
                          display: "none",
                          mt: 1,
                        },
                      }}
                    >
                      <TimelineSeparator>
                        <Avatar
                          alt="date"
                          sx={{
                            width: 45,
                            height: 45,
                            textAlign: "center",
                            fontSize: "14px",
                            backgroundColor: colors3 && colors3[index],
                            borderColor: "common.gray",
                            boxShadow: (theme) => theme.shadows[3],
                          }}
                        >
                          {moment(data.MailSentDate).format("MMM D")}
                        </Avatar>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent
                        sx={{
                          p: (theme) => theme.spacing(0.5, 0),
                          ml: 2.5,
                        }}
                      >
                        <Div
                          className="card"
                          sx={{
                            p: 1,
                            backgroundColor:
                              height === true ? "#FFFFF" : "#E5F2FA",

                            borderColor: "common.gray",
                            boxShadow: (theme) => theme.shadows[2],
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
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                backgroundColor: "#FFFFF",
                                alignItems: "start",
                                height:
                                  height === true ? "65px" : "fit-content",
                                overflow: "hidden",
                              }}
                            >
                              <Div>
                                <Typography sx={{ fontSize: "14px" }}>
                                  From{" "}
                                  <span
                                    style={{ marginLeft: 28, marginRight: 5 }}
                                  >
                                    {" "}
                                    :{" "}
                                  </span>{" "}
                                  <span>ravikumar.r@foyertech.com</span>
                                </Typography>
                                <Typography sx={{ fontSize: "14px" }}>
                                  To{" "}
                                  <span
                                    style={{ marginLeft: 42, marginRight: 5 }}
                                  >
                                    {" "}
                                    :{" "}
                                  </span>{" "}
                                  <span>{data.RecevierMailId}</span>
                                </Typography>
                                <Typography sx={{ fontSize: "14px" }}>
                                  Subject{" "}
                                  <span
                                    style={{ marginLeft: 15, marginRight: 5 }}
                                  >
                                    {" "}
                                    :{" "}
                                  </span>{" "}
                                  <span>{data.MailSubject}</span>
                                </Typography>
                                <Typography sx={{ fontSize: "14px" }}>
                                  Message{" "}
                                  <span
                                    style={{ marginLeft: 5, marginRight: 5 }}
                                  >
                                    {" "}
                                    :{" "}
                                  </span>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: data?.MailBody,
                                    }}
                                  />
                                </Typography>
                                <Typography>
                                  Attachements{" "}
                                  <span>
                                    {" "}
                                    :{" "}
                                    <span>
                                      {data.file} <DownloadIcon />
                                    </span>
                                  </span>
                                </Typography>
                              </Div>
                              <Div sx={{ display: "flex" }}>
                                <IconButton
                                  onClick={() => setHeight(!height)}
                                  sx={{ p: 0 }}
                                >
                                  {height ? (
                                    <ArrowDropDownIcon />
                                  ) : (
                                    <ArrowDropUpIcon />
                                  )}
                                </IconButton>
                              </Div>
                            </Div>
                          </JumboScrollbar>
                        </Div>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </JumboScrollbar>
          </TabPanel>
          <TabPanel value={value} index={1} sx={{ pl: 0, pr: 0 }}>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={scrollHeight ? scrollHeight : 880}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Timeline sx={{ m: 0, p: (theme) => theme.spacing(0) }}>
                {senddata.map((data, index) => {
                  return (
                    <TimelineItem
                      sx={{
                        p: 0,
                        "&::before": {
                          display: "none",
                          mt: 1,
                        },
                      }}
                    >
                      <TimelineSeparator>
                        <Avatar
                          alt="date"
                          sx={{
                            width: 45,
                            height: 45,
                            textAlign: "center",
                            fontSize: "14px",
                            backgroundColor: colors4 && colors4[index],
                            borderColor: "common.white",
                            boxShadow: (theme) => theme.shadows[3],
                          }}
                        >
                          {moment(data.received_date).format("MMM D")}
                        </Avatar>
                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent
                        sx={{
                          p: (theme) => theme.spacing(0.5, 0),
                          ml: 2.5,
                        }}
                      >
                        <Div
                          className="card Mail-Content"
                          sx={{
                            p: 1,
                            borderColor: "common.gray",
                            boxShadow: (theme) => theme.shadows[3],
                            backgroundColor:
                              height === true ? "#FFFFF" : "#E5F2FA",
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
                            <Grid container columns={12}>
                              <Grid item xl={11}>
                                <Div
                                  className="Mail-Content1"
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    backgroundColor: "#FFFFF",
                                    alignItems: "start",

                                    height:
                                      height === true ? "65px" : "fit-content",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Div>
                                    <Typography sx={{ fontSize: "14px" }}>
                                      From{" "}
                                      <span
                                        style={{
                                          marginLeft: 28,
                                          marginRight: 5,
                                        }}
                                      >
                                        {" "}
                                        :{" "}
                                      </span>{" "}
                                      <span>{data.sender}</span>
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                      To{" "}
                                      <span
                                        style={{
                                          marginLeft: 42,
                                          marginRight: 5,
                                        }}
                                      >
                                        {" "}
                                        :{" "}
                                      </span>{" "}
                                      <span>{data.recipient}</span>
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                      Subject{" "}
                                      <span
                                        style={{
                                          marginLeft: 15,
                                          marginRight: 5,
                                        }}
                                      >
                                        {" "}
                                        :{" "}
                                      </span>{" "}
                                      <span>{data.subject}</span>
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                      Message{" "}
                                      <span
                                        style={{
                                          marginLeft: 5,
                                          marginRight: 5,
                                        }}
                                      >
                                        {" "}
                                        :{" "}
                                      </span>{" "}
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: data?.body,
                                        }}
                                      />
                                    </Typography>
                                    {/* <Typography>Attachements <span> : <span>{data.file} <DownloadIcon /></span></span></Typography> */}
                                  </Div>
                                </Div>
                              </Grid>
                              <Grid item xl={1}>
                                <Div sx={{ display: "flex" }}>
                                  <IconButton
                                    onClick={() => setHeight(!height)}
                                    sx={{ p: 0 }}
                                  >
                                    {height ? (
                                      <ArrowDropDownIcon />
                                    ) : (
                                      <ArrowDropUpIcon />
                                    )}
                                  </IconButton>
                                </Div>
                              </Grid>
                            </Grid>
                          </JumboScrollbar>
                        </Div>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            </JumboScrollbar>
          </TabPanel>
        </Box>
      </TabContext>
      <>
        <ToastContainer />
      </>
    </Div>
  );
};

export default DealEmailContent;
