import {
  Avatar,
  Badge,
  Button,
  Dialog,
  Grid,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Paper,
  InputBase,
  DialogTitle,
  Card,
  FormControl,
  Autocomplete,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import React from "react";
import { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import {
  TabContext,
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Div from "@jumbo/shared/Div";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import Editopenactivity from "./Editopenactivity";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import { Search } from "@mui/icons-material";
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
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import ClosedActivity from "./ClosedActivity";
import {
  AvatarCircle,
  Cancelbutton,
  DialogBox,
  CustomButton,
  SaveButton,
  SelectDropdown,
  Dragabledialog,
  htmlToText,
} from "app/pages/widgets/StylesComponents";
import ActivityModel from "../extra-components/ActivityModel";
import { IoCloseCircle } from "react-icons/io5";

const OpenActivity = ({ id, data }) => {
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const item = "crmuseradmin1";
  const [height, setHeight] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showaddcancel, setShowaddcancel] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteDatas, setDeleteDatas] = useState(false);
  const [pending, setPending] = useState(true);
  const [closed, setClosed] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  // Get the Contact List Notes

  const [datas, setDatas] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${BASE_URL}/user/ContactActivitiesMyAdditional/?Contact_Id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res.data", res.data);
        setDatas(res.data.results);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // Search Functionality
  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : getData();
  };
  const handleSearch = (search) => {
    axios
      .get(
        `${BASE_URL}/user/ContactActivitiesSearch/?search=${search}&Contact_Id=${Number(
          id
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
        console.log(res.data);
        setDatas(res.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // For update
  const [update, setUpdate] = useState({});

  const handleUpdate = (data) => {
    setUpdate(data);
    console.log("transfer", data);
  };

  // Delete Function for Name
  const [number, setNumber] = useState("");
  const Deletedata = (data) => {
    axios
      .delete(`${BASE_URL}/user/ContactActivitiesCRUD/?id=${number}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res.data", res.data);
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  // Create Functionality

  const [taskname, setTaskname] = useState("");
  const [taskdescription, setTaskdescription] = useState("");
  const [date1, setDate1] = useState("");
  const [time, setTime] = useState("");

  const validationSchema = yup.object({
    taskname: yup.string().required("Task Name is required"),
    taskdescription: yup.string().required("Task Description is required"),
    date1: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onsubmit = () => {
    var payload = {
      Task: taskname,
      Task_Description: taskdescription,
      Expected_Date: date1,
      Expected_Time: time,
      Activity_Type: "For Morning",
      Contact_Id: Number(id),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    axios
      .post(`${BASE_URL}/user/ContactActivitiesCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        toast.success("Created successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
        setShowDialog(false);
        reset();
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Updated_Person: `${editUser} Created this Contact Activity.`,
          Module_Name: "Contact Activitiy",
          Contact_Id: Number(id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, header)
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  // Closing the Activity

  const handleActivity = () => {
    var payload = {
      id: update.id,
      ContactActivities_Id: update.ContactActivities_Id,
      Task: update.Task,
      Task_Description: update.Task_Description,
      Expected_Date: update.Expected_Date,
      Expected_Time: update.Expected_Time,
      Activity_Type: update.Activity_Type,
      Contact_Id: Number(id),
      Reminder_Id: null,
      Active_Flag: true,
      Created_Date: update.Created_Date,
      Updated_Date: update.Updated_Date,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    console.log("update", payload);
    axios
      .put(`${BASE_URL}/user/ContactActivitiesCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        toast.success("Activity Closed", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  // For Generating Icon

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

  //  For List Showing purpose

  const [icon, setIcon] = useState(null);

  // Getting the Contact Details
  const [condatas, setConDatas] = useState([]);

  const getConData = () => {
    axios
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
        setConDatas(res.data);
      })
      .catch((error) => {
        console.log("erroe", error);
      });
  };

  useEffect(() => {
    getConData();
  }, []);

  //
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
      console.log("selectedDate", selectedDate, currentDate);
      await axios
        .get(
          `${BASE_URL}/user/ContactActivitiesFilter/?fromdate=${selectedDate}&todate=${currentDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error", error);
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .get(
          `${BASE_URL}/user/ContactActivitiesFilter/?fromdate=${fromDate}&todate=${toDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await NotesFilter();
    };
    fetchData();
  }, [selectedDate, fromDate, toDate, id]);

  return (
    <>
      {/* add activity */}

      {/* <Dialog
        open={showDialog}
        // onClose={() => setShowDialog(false)}
        aria-labelledby="draggable-dialog-title"
        maxWdith="xs"
        fullWidth
      >
        <DialogTitle sx={[CRMTableHead, DisplayFlex, dialogTitle]}>
          Activities
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText
              sx={{
                mt: 1,
              }}
            >
              <Grid container spacing={2}>
                <Grid xs={12} md={12} lg={12} xl={12} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography id="Typography-root" mb={0.1} sx={[FontStyle]}>
                      Task Name
                    </Typography>
                    <TextField
                      {...register("taskname")}
                      className={`input-box col-12 ${
                        errors.taskname ? "is-invalid" : ""
                      }`}
                      value={taskname}
                      onChange={(e) => {
                        setTaskname(e.target.value);
                      }}
                      size={"small"}
                      placeholder={"Enter task name"}
                    />
                    <Div style={{ color: "red" }}>
                      {errors.taskname?.message}
                    </Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={6} lg={6} xl={6} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography id="Typography-root" mb={0.1} sx={[FontStyle]}>
                      Expected Date
                    </Typography>
                    <TextField
                      {...register("date1")}
                      className={`input-box col-12 ${
                        errors.date1 ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setDate1(e.target.value);
                      }}
                      value={date1}
                      type="date"
                      placeholder={"Expected Date"}
                    />
                    <Div style={{ color: "red" }}>{errors.date1?.message}</Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={6} lg={6} xl={6} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography id="Typography-root" mb={0.1} sx={[FontStyle]}>
                      Expected Time
                    </Typography>
                    <TextField
                      {...register("time")}
                      className={`input-box col-12 ${
                        errors.time ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      type="time"
                      value={time}
                      placeholder={"Expected Time"}
                    />
                    <Div style={{ color: "red" }}>{errors.time?.message}</Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={12} lg={12} xl={12} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography id="Typography-root" mb={0.1} sx={[FontStyle]}>
                      Task Description
                    </Typography>
                    <TextField
                      {...register("taskdescription")}
                      className={`multiline-box col-12 ${
                        errors.taskdescription ? "is-invalid" : ""
                      }`}
                      multiline
                      onChange={(e) => {
                        setTaskdescription(e.target.value);
                      }}
                      value={taskdescription}
                      rows={3}
                      maxRows={10}
                      placeholder={"Enter task description..."}
                    />
                    <Div style={{ color: "red" }}>
                      {errors.taskdescription?.message}
                    </Div>
                  </Div>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container align="center" spacing={2} pb={2}>
              <Grid
                item
                align="center"
                justifyContent={"center"}
                xs={12}
                lg={12}
              >
                <Div
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <CustomButton label="Save" type="submit" Icon="saveIcon" />

                  <Cancelbutton
                    onClick={() => {
                      setShowaddcancel(true);
                      reset();
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog> */}

      {/* Create Open Activity */}
      <Dragabledialog
        maxWidth="lg"
        open={showDialog}
        // onClose={() => setOpenNotes(false)}
      >
        <ActivityModel
          name={{ label: "Contact Name", value: data?.Name }}
          endpoint={"ContactActivitiesCRUD"}
          historyEndpoint={{
            point: "Updaterecordscrud",
            payload: { Contact_Id: data?.id },
          }}
          data={data}
          setOpenActivity={setShowDialog}
          setOpen={setShowaddcancel}
          extraPayload={{ Contact_Id: data?.id }}
          getData={getData}
        />
      </Dragabledialog>

      {/* Edit Open Activity */}
      <Dragabledialog
        maxWidth="lg"
        open={showEdit}
        // onClose={() => setOpenNotes(false)}
      >
        <ActivityModel
          name={{ label: "Contact Name", value: data?.Name }}
          historyEndpoint={{
            point: "Updaterecordscrud",
            payload: { Contact_Id: data?.id },
          }}
          label="Edit"
          endpoint={"ContactActivitiesCRUD"}
          data={{ ...update, Name: data?.Name }}
          setOpenActivity={setShowEdit}
          setOpen={setShowaddcancel}
          extraPayload={{
            ContactActivities_Id: update?.ContactActivities_Id,
            Contact_Id: data?.id,
          }}
          getData={getData}
        />
      </Dragabledialog>

      <Box
        sx={{
          display: { xs: "block", md: "flex", lg: "flex" },
          justifyContent: "space-between",
          // borderBottom: { xs: 0, md: 1 },
          // borderColor: "divider",
        }}
      >
        <AntTabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          aria-label="ant example"
        >
          <AntTab label="Open Activities" />
          <AntTab label="Closed Activities" />
        </AntTabs>
      </Box>

      {tabValue == 0 && (
        <>
          <Div>
            <Div>
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
                    label="Create"
                    Icon=""
                    onClick={() => setShowDialog(true)}
                  />
                </Div>
              </Div>

              {Boolean(customDate) && (
                <Box
                  sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}
                >
                  <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
                    <FormControl>
                      <Typography id="Typography-root" sx={[FontStyle]}>
                        From
                      </Typography>
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
                      <Typography id="Typography-root" sx={[FontStyle]}>
                        To
                      </Typography>
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
            <JumboScrollbar
              autoHeight={true}
              autoHeightMax={window.innerHeight}
              autoHideTimeOut={4000}
            >
              {datas?.map((data, index) => {
                console.log("hck", data);
                let avatar =
                  index >= 10 ? avatarColors[index % 10] : avatarColors[index];

                return (
                  <>
                    <Timeline
                      key={index}
                      sx={{ m: 0, mt: 2, p: (theme) => theme.spacing(0) }}
                    >
                      <TimelineItem
                        sx={{
                          "&::before": {
                            display: "none",
                          },
                        }}
                      >
                        <TimelineSeparator>
                          <Badge color="primary">
                            {/* <AvatarCircle
                              fullTitle={true}
                              size="32px"
                              fontSize="10px"
                              bgColor={avatar}
                              title={moment(data.Expected_Date).format("MMM D")}
                            /> */}
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
                              {moment(data?.Expected_Date).format("MMM D")}
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
                          {/* {icon === index && ( */}
                          <>
                            <Div
                              // className="card"
                              sx={{
                                p: 1,
                                backgroundColor:
                                  height === index ? "#EAFCEF" : "#fbfcff",
                              }}
                            >
                              <Div
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  // justifyContent: "space-between",
                                  textAlign: "start",
                                  alignItems: "start",
                                  justifyContent: "space-between",
                                  // width:"70% !important"
                                }}
                              >
                                <Card
                                  sx={{
                                    backgroundColor:
                                      height === index ? "#EAFCEF" : "#fbfcff",
                                    height:
                                      height === index ? "fit-content" : "44px",
                                    width: "100% !important",
                                    flexWrap: "wrap",
                                    // overflowX: "auto"
                                  }}
                                >
                                  {/* <Typography  id='Typography-root' sx={{fontSize:'14px'}}> Assigned To <span>: {data?.Contact_Id?.Name}</span>
                              </Typography> */}
                                  <Typography
                                    id="Typography-root"
                                    sx={{ fontSize: "14px" }}
                                  >
                                    Task Name <span>: {data?.Task}</span>
                                  </Typography>
                                  <Typography
                                    id="Typography-root"
                                    sx={{ fontSize: "14px" }}
                                  >
                                    Description{" "}
                                    <span>
                                      :{htmlToText(data?.Task_Description)}
                                    </span>
                                  </Typography>
                                  {/* <Typography  id='Typography-root' >Attachements <span> : <span >{data.file} <DownloadIcon /></span></span></Typography> */}
                                </Card>
                                <Div sx={{ mt: -0.56, display: "flex" }}>
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
                                  <IconButton
                                    onClick={(event) => {
                                      handleClickAction(event);
                                      setNumber(data.id);
                                      handleUpdate(data);
                                    }}
                                    sx={{ p: 0 }}
                                  >
                                    <MoreVertIcon style={{ fontSize: 16 }} />
                                  </IconButton>
                                </Div>
                              </Div>
                            </Div>

                            <Menu
                              id="menu-appbar"
                              anchorEl={anchorElAction}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              keepMounted
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              open={Boolean(anchorElAction)}
                              onClose={handleCloseAction}
                              sx={{
                                mt: 3,
                                mr: 5,
                                maxHeight: "300px",
                                width: "300px",
                              }}
                            >
                              <MenuItem onClick={() => setShowEdit(true)}>
                                <ModeEdit sx={{ fontSize: 20, mr: 1 }} />
                                Edit
                              </MenuItem>
                              <MenuItem onClick={handleActivity}>
                                <IoCloseCircle
                                  style={{ fontSize: 20, marginRight: 8 }}
                                />
                                Close Activity
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setDeleteDatas(data);
                                  // setShowDelete(true)
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 20, mr: 1 }} />
                                Delete
                              </MenuItem>
                            </Menu>
                          </>
                          {/* )} */}
                        </TimelineContent>
                      </TimelineItem>
                    </Timeline>
                  </>
                );
              })}
            </JumboScrollbar>
          </Div>
          <></>
          {/* <Editopenactivity
            id={id}
            getData={getData}
            update={update}
            showEdit={showEdit}
            setShowEdit={setShowEdit}
          /> */}

          {/* showaddcancel */}
          <DialogBox
            open={showaddcancel}
            onClickNo={() => setShowaddcancel(false)}
            onClickYes={() => {
              setShowaddcancel(false);
              setShowDialog(false);
              setShowEdit(false);
            }}
          />
        </>
      )}
      {tabValue == 1 && (
        <>
          <ClosedActivity getData={getData} id={id} />
        </>
      )}
    </>
  );
};

export default OpenActivity;
