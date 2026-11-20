import React from "react";
import { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
  Menu,
  MenuItem,
  DialogTitle,
  Grid,
  FormControl,
  Box,
} from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import Div from "@jumbo/shared/Div";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppointmentEdit from "./AppointmentEdit";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import {
  CRMTableHead,
  deletedWarnigMsg,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import {
  Cancelbutton,
  DialogBox,
  CustomButton,
  SaveButton,
  SelectDropdown,
  Dragabledialog,
} from "app/pages/widgets/StylesComponents";
import AppointmentModel from "../extra-components/AppointmentModel";

const Appointment = ({ id, data }) => {
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

  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteDatas, setDeleteDatas] = useState(false);
  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  // Geting list
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
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
        console.log(res.data);
        setDatas(res.data.results);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : getData();
  };

  // Search Functionality

  const handleSearch = (search) => {
    axios
      .get(
        `${BASE_URL}/user/ContactMeetingSearch/?search=${search}&Contact_Id=${id}`,
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

  // Delete Functionality
  const [number, setNumber] = useState(1);
  const Deletedata = (data) => {
    axios
      .delete(`${BASE_URL}/user/ContactMeetingCRUD/?id=${number}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
        handleCloseAction();
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

  // For Edit Functionality

  const [update, setUpdate] = useState({});
  const handleUpdate = (data) => {
    setUpdate(data);
  };

  // Creata Functionality
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [fromdate, setFromdate] = useState("");
  const [todate, setTodate] = useState("");
  const [showAddCancel, setShowaddcancel] = useState("");

  const validationSchema = yup.object({
    date: yup.string().required("Date is required"),
    venue: yup.string().required("venue is required"),
    location: yup.string().required("Location is required"),
    fromdate: yup.string().required("From Date is required"),
    todate: yup.string().required("From Date is required"),
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
      ToDate_Time: todate,
      FromDate_Time: fromdate,
      Date: date,
      Location: location,
      Venue: venue,
      Contact_Id: Number(id),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    axios
      .post(`${BASE_URL}/user/ContactMeetingCRUD/`, payload, {
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
          Document_Id: res.data.ContactMeeting_Id,
          Updated_Person: `${editUser} Created this Contact Appointment.`,
          Module_Name: "Contact Appointment",
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
      } catch (error) { }
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [datas]);

  // For Choose Period Purpose

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate1, setfromDate1] = useState("");
  const [toDate1, settoDate1] = useState("");
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

  let date1 = new Date();
  let day = date1.getDate();
  let month = date1.getMonth() + 1;
  let year = date1.getFullYear();
  let TodayDate = `${year}-${month < 10 ? "0" + month : month}-${day}`;

  const handlePeriodChange = (event, newValue) => {
    setSelectedPeriod(newValue);
    setSelectedDate(null);
    setfromDate1("");
    settoDate1("");

    let date1;

    let startDate1; // for previous
    let endDate1;

    switch (newValue) {
      case "This Week":
        startDate1 = moment().startOf("week");
        endDate1 = moment().endOf("week");

        let ThisWeekStart = startDate1?.format("YYYY-MM-DD");
        let ThisWeekEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(ThisWeekStart);
        setCurrentDate(ThisWeekEnd);

        setCustomDate(false);

        return;

      case "This Month":
        startDate1 = moment().startOf("month");
        endDate1 = moment().endOf("month");

        let ThisMonthStart = startDate1?.format("YYYY-MM-DD");
        let ThisMonthEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(ThisMonthStart);
        setCurrentDate(ThisMonthEnd);

        setCustomDate(false);

        return;

      case "This Quarter":
        startDate1 = moment().startOf("quarter");
        endDate1 = moment().endOf("quarter");

        let ThisQuarterStart = startDate1?.format("YYYY-MM-DD");
        let ThisQuarterEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(ThisQuarterStart);
        setCurrentDate(ThisQuarterEnd);

        setCustomDate(false);

        return;

      case "This Year":
        startDate1 = moment().startOf("year");
        endDate1 = moment().endOf("year");

        let ThisYearStart = startDate1?.format("YYYY-MM-DD");
        let ThisYearEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(ThisYearStart);
        setCurrentDate(ThisYearEnd);

        setCustomDate(false);

        return;

      case "Previous Week":
        startDate1 = moment().subtract(1, "week").startOf("week");
        endDate1 = moment().subtract(1, "week").endOf("week");

        let PrevWeekStart = startDate1?.format("YYYY-MM-DD");
        let PrevWeekEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(PrevWeekStart);
        setCurrentDate(PrevWeekEnd);

        setCustomDate(false);

        return;

      case "Previous Month":
        startDate1 = moment().subtract(1, "month").startOf("month");
        endDate1 = moment().subtract(1, "month").endOf("month");

        let PrevMonthStart = startDate1?.format("YYYY-MM-DD");
        let PrevMonthEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(PrevMonthStart);
        setCurrentDate(PrevMonthEnd);

        setCustomDate(false);

        return;

      case "Previous Quarter":
        startDate1 = moment().subtract(1, "quarter").startOf("quarter");
        endDate1 = moment().subtract(1, "quarter").endOf("quarter");

        let PrevQuarterStart = startDate1?.format("YYYY-MM-DD");
        let PrevQuarterEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(PrevQuarterStart);
        setCurrentDate(PrevQuarterEnd);

        setCustomDate(false);

        return;

      case "Previous Year":
        startDate1 = moment().subtract(1, "year").startOf("year");
        endDate1 = moment().subtract(1, "year").endOf("year");

        let MomentDateStart = startDate1?.format("YYYY-MM-DD");
        let MomentDateEnd = endDate1?.format("YYYY-MM-DD");

        setSelectedDate(MomentDateStart);
        setCurrentDate(MomentDateEnd);

        setCustomDate(false);

        return;

      case "Last One Year":
        date1 = moment().subtract(1, "year");
        setCustomDate(false);

        break;

      case "Last Six Month":
        date1 = moment().subtract(6, "months");
        setCustomDate(false);

        break;

      case "Last Three Month":
        date1 = moment().subtract(3, "months");
        setCustomDate(false);

        break;

      case "Custom Date":
        setCustomDate(true);
        break;
      default:
        date1 = null;
    }
    let MomentDate = date1?.format("YYYY-MM-DD");
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
          `${BASE_URL}/user/ContactAppointmentFilter/?fromdate=${selectedDate}&todate=${currentDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data || []);
        })
        .catch((error) => { });

      //
    }
    if (fromDate1 !== "" && toDate1 !== "") {
      await axios
        .get(
          `${BASE_URL}/user/ContactAppointmentFilter/?fromdate=${fromDate1}&todate=${toDate1}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data || []);
        })
        .catch((error) => { });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await NotesFilter();
    };
    fetchData();
  }, [selectedDate, fromDate1, toDate1, id]);

  return (
    <>
      {/* add appointment */}

      {/* Create Appointment */}
      <Dragabledialog
        maxWidth="lg"
        open={showDialog}
      // onClose={() => setOpenNotes(false)}
      >
        <AppointmentModel
          name={{ label: "Contact Name", value: data?.Name }}
          historyEndpoint={{ point: "Updaterecordscrud", payload: { Contact_Id: data?.id, } }}
          data={data}
          endpoint={"ContactMeetingCRUD"}
          setOpenAppointment={setShowDialog}
          setOpen={setShowaddcancel}
          extraPayload={{ Contact_Id: data?.id }}
          getData={getData}
        />
      </Dragabledialog>

      {/* Edit Appointment */}
      <Dragabledialog
        maxWidth="lg"
        open={showEditDialog}
      // onClose={() => setOpenNotes(false)}
      >
        <AppointmentModel
          name={{ label: "Contact Name", value: data?.Name }}
          label="Edit"
          endpoint={"ContactMeetingCRUD"}
          historyEndpoint={{ point: "Updaterecordscrud", payload: { Contact_Id: data?.id, } }}
          data={{ ...update, Name: data?.Name }}
          setOpenAppointment={setShowEditDialog}
          setOpen={setShowaddcancel}
          extraPayload={{
            ContactMeeting_Id: update?.ContactMeeting_Id,
            Contact_Id: data?.id,
          }}
          getData={getData}
        />
      </Dragabledialog>

      {/* close dialog */}
      <DialogBox
        open={showAddCancel}
        onClickNo={() => setShowaddcancel(false)}
        onClickYes={() => {
          setShowaddcancel(false);
          setShowDialog(false);
          setShowEditDialog(false);
        }}
      />

      <Div>
        <Div>
          <Typography
            id="Typography-root"
            sx={[
              dialogTitle,
              {
                backgroundColor: "transparent !important",
                display: { xs: "none", md: "block" },
              },
            ]}
          >
            Appointments
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
                Icon="createIcon"
                label="Create"
                onClick={() => setShowDialog(true)}
              />
            </Div>
          </Div>

          {Boolean(customDate) && (
            <Box sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}>
              <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
                <FormControl>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    From
                  </Typography>
                  <TextField
                    sx={[FontStyle]}
                    type={"date"}
                    className="input-box"
                    value={fromDate1}
                    onChange={(e) => setfromDate1(e.target.value)}
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
                    value={toDate1}
                    onChange={(e) => settoDate1(e.target.value)}
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
            return (
              <>
                <Timeline sx={{ m: 0, mt: 2, p: (theme) => theme.spacing(0) }}>
                  <TimelineItem
                    sx={{
                      "&::before": {
                        display: "none",
                      },
                    }}
                  >
                    <TimelineSeparator>
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
                          {moment(data?.Date).format("MMM D")}
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
                        // className="card"
                        sx={{
                          p: 1,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "start",
                          backgroundColor: "#fbfcff",
                        }}
                      >
                        <Div>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Date : {data?.Date}
                          </Typography>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Venue :  {data?.Venue}
                          </Typography>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Location :  {data?.Location}
                          </Typography>
                        </Div>
                        <IconButton
                          onClick={(event) => {
                            setNumber(data?.id);
                            handleUpdate(data);
                            handleClickAction(event);
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: "18px" }} />
                        </IconButton>
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
                        <MenuItem
                          onClick={() => {
                            setShowEditDialog(true);
                          }}
                        >
                          <ModeEdit sx={{ fontSize: 20, mr: 2 }} />
                          Edit
                        </MenuItem>

                        <MenuItem
                          onClick={() => {
                            setDeleteDatas(data);
                            setShowDelete(true);
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 20, mr: 2 }} />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              </>
            );
          })}
        </JumboScrollbar>
      </Div>

      {/* delete popup */}
      <DialogBox
        open={showDelete}
        Content={deletedWarnigMsg}
        onClickNo={() => setShowDelete(false)}
        onClickYes={() => {
          setShowDelete(false);
          // reset();
          Deletedata(deleteDatas);
          setAnchorElAction(false);
        }}
      />
    </>
  );
};

export default Appointment;
