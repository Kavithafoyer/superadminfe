import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  IconButton,
  TextField,
  Typography,
  Menu,
  MenuItem,
  Grid,
  FormControl,
  Box,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { IoCalendarClear } from "react-icons/io5";
import {
  avatarColors,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import {
  AvatarCircle,
  DialogBox,
  SelectDropdown,
} from "app/pages/widgets/StylesComponents";
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from "@mui/lab";

const AccountCallHistory = ({ id, datass }) => {

  console.log("accdatas", id, datass)

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1"
  const header = {
    headers: {
      "db": "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };



  const [height, setHeight] = useState(true);
  const [save, setSave] = useState(false);
  const [openEditNotes, setOpenEditNotes] = useState(false);
  const [openAddNotes, setOpenAddNotes] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [datas, setDatas] = useState([]);
  const [update, setUpdate] = useState({});
  const [deleteItem, setDeleteItem] = useState(false);

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  //  For Contact Notes Creation
  const [Notes, setNotes] = useState("");
  const [number, setNumber] = useState(1);






  const validationSchema = yup.object({
    Notes: yup.string().required("Notes is required"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });


  // Get the Contact List Notes

  // useEffect(() => {
  //   getData();
  // }, [])

  // const getData = () => {

  //   axios.get(`${BASE_URL}/superadmin/CallcenterActivityAccountAdditional/?Account_Id=${id.id}`,
  //     {
  //       headers: {
  //         "db": item,
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     }
  //   )
  //     .then((res) => {
  //       console.log("AccountCallHistory", res.data);
  //       setDatas(res.data.results);


  //     }).catch((error) => {
  //       console.log('Error', error)
  //     })
  // }

  // Search Functionality
  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : NotesFilter();
  }
  const handleSearch = (search) => {

    axios.get(`${BASE_URL}/superadmin/CallcenterActivityContactSearch/?search=${search}&Account_Id=${id.id}`,
      {
        headers: {
          "db": item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        console.log(res.data);
        setDatas(res.data);
      }).catch((error) => {
        console.log("error", error)
      })
  }

  // Delete Function for Name

  const Deletedata = (data) => {
    console.log("Delete", data)
    axios.delete(`${BASE_URL}/superadmin/CallcenterActivityCRUD/?id=${number}`,
      {
        headers: {
          "db": item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",

        }
      }
    )
      .then((res) => {
        console.log(res.data);
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 100
        });

        setOpenAddNotes(false);
        reset();
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: data?.CallCenter_Id,
          Updated_Person: `${editUser} Deleted this Account Call History.`,
          Module_Name: "Account Call History",
          Account_Id: Number(id.id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        }
        console.log("histotypayload", histotypayload)
        axios
          .post(
            `${BASE_URL}/superadmin/AccountHistorycrud/`, histotypayload
            ,
            {
              headers: {
                "db": "crmuseradmin1",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      }).catch((error) => {
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
      })
  }

  // For update
  const handleUpdate = (data) => {
    setUpdate(data);
    console.log("transfer", data)
  }

  // For Choose Period 

  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const periodOptions = [
    'Previous Week',
    'Previous Month',
    'Previous Quarter',
    'Previous Year',
    'This Week',
    'This Month',
    'This Quarter',
    'This Year',
    'Last One Year',
    'Last Six Month',
    'Last Three Month',
    'Custom Date',
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

      case 'This Week':

        startDate = moment().startOf('week');
        endDate = moment().endOf('week');

        let ThisWeekStart = startDate?.format('YYYY-MM-DD');
        let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(ThisWeekStart);
        setCurrentDate(ThisWeekEnd);

        setCustomDate(false);

        return;

      case 'This Month':

        startDate = moment().startOf('month');
        endDate = moment().endOf('month');

        let ThisMonthStart = startDate?.format('YYYY-MM-DD');
        let ThisMonthEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(ThisMonthStart);
        setCurrentDate(ThisMonthEnd);

        setCustomDate(false);

        return;

      case 'This Quarter':
        startDate = moment().startOf('quarter');
        endDate = moment().endOf('quarter');

        let ThisQuarterStart = startDate?.format('YYYY-MM-DD');
        let ThisQuarterEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(ThisQuarterStart);
        setCurrentDate(ThisQuarterEnd);

        setCustomDate(false);

        return;

      case 'This Year':
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');

        let ThisYearStart = startDate?.format('YYYY-MM-DD');
        let ThisYearEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(ThisYearStart);
        setCurrentDate(ThisYearEnd);

        setCustomDate(false);

        return;

      case 'Previous Week':
        startDate = moment().subtract(1, 'week').startOf('week');
        endDate = moment().subtract(1, 'week').endOf('week');

        let PrevWeekStart = startDate?.format('YYYY-MM-DD');
        let PrevWeekEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(PrevWeekStart);
        setCurrentDate(PrevWeekEnd);

        setCustomDate(false);

        return;

      case 'Previous Month':
        startDate = moment().subtract(1, 'month').startOf('month');
        endDate = moment().subtract(1, 'month').endOf('month');

        let PrevMonthStart = startDate?.format('YYYY-MM-DD');
        let PrevMonthEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(PrevMonthStart);
        setCurrentDate(PrevMonthEnd);

        setCustomDate(false);

        return;

      case 'Previous Quarter':
        startDate = moment().subtract(1, 'quarter').startOf('quarter');
        endDate = moment().subtract(1, 'quarter').endOf('quarter');

        let PrevQuarterStart = startDate?.format('YYYY-MM-DD');
        let PrevQuarterEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(PrevQuarterStart);
        setCurrentDate(PrevQuarterEnd);

        setCustomDate(false);

        return;

      case 'Previous Year':
        startDate = moment().subtract(1, 'year').startOf('year');
        endDate = moment().subtract(1, 'year').endOf('year');

        let MomentDateStart = startDate?.format('YYYY-MM-DD');
        let MomentDateEnd = endDate?.format('YYYY-MM-DD');

        setSelectedDate(MomentDateStart);
        setCurrentDate(MomentDateEnd);

        setCustomDate(false);

        return;

      case 'Last One Year':
        date = moment().subtract(1, 'year');
        setCustomDate(false);

        break;

      case 'Last Six Month':
        date = moment().subtract(6, 'months');
        setCustomDate(false);

        break;

      case 'Last Three Month':
        date = moment().subtract(3, 'months');
        setCustomDate(false);

        break;

      case 'Custom Date':
        setCustomDate(true);
        break;
      default:
        date = null;
    }
    let MomentDate = date?.format('YYYY-MM-DD');
    setSelectedDate(MomentDate);
    setCurrentDate(TodayDate)
  };

  // const NotesFilter = async () => {
  //   if (selectedDate !== "" && selectedDate !== undefined && currentDate !== "") {
  //     await axios.get(`${BASE_URL}/superadmin/KnowlarityAgentCalllogsandActivityAccountList/?Phone_Number=${datass?.Phone_Number}&start_date=${selectedDate}&end_date=${currentDate}&Account_Id=${Number(id)}&Module=Account`, header)
  //       .then((res) => {
  //         console.log("NotesFilter", res?.data?.Result)
  //         setDatas(res?.data?.Result)
  //       }).catch((error) => {
  //         console.log("error")
  //       })

  //     // 
  //   }
  //   if (fromDate !== "" && toDate !== "") {
  //     await axios.get(`${BASE_URL}/superadmin/KnowlarityAgentCalllogsandActivityAccountList/?Phone_Number=${datass?.Phone_Number}&start_date=${fromDate}&end_date=${toDate}&Account_Id=${Number(id)}&Module=Account`, header)
  //       .then((res) => {
  //         console.log("NotesFilter", res?.data?.Result)
  //         setDatas(res?.data?.Result)
  //       }).catch((error) => {
  //         console.log("error")
  //       })

  //   }

  // }

  const getalllist = async () => {

    await axios
      .get(
        `${BASE_URL}/superadmin/CallcenterActivityAccountAdditional/?Account_Id=${Number(id)}`,
        header
      )
      .then((res) => {
        console.log("Allresult", res?.data?.results)
        setDatas(res?.data?.results);
      }).catch((error) => {
        console.log("error")
      });
  };


  const NotesFilter = async () => {
    if (
      selectedDate !== "" &&
      selectedDate !== undefined &&
      currentDate !== ""
    ) {
      await axios
        .get(
          `${BASE_URL}/superadmin/CallcenterActivityAccountFilter/?fromdate=${selectedDate}&todate=${currentDate}&Account_Id=${Number(id)}`,
          header
        )
        .then((res) => {
          console.log("NotesFilter", res?.data)
          setDatas(res?.data);
        }).catch((error) => {
          console.log("error")
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .get(
          `${BASE_URL}/superadmin/CallcenterActivityAccountFilter/?fromdate=${fromDate}&todate=${toDate}&Account_Id=${Number(id)}`,

          header
        )
        .then((res) => {
          console.log("NotesFilter", res?.data)
          setDatas(res?.data);
        }).catch((error) => {
          console.log("error")
        });
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await NotesFilter();
    };
    fetchData();
  }, [selectedDate, fromDate, toDate]);


  useEffect(() => {
    getalllist();
  }, [id]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <Div>
        <Typography id='Typography-root'
          sx={[
            dialogTitle,
            {
              backgroundColor: "transparent !important",
              display: { xs: "none", md: "block" },
            },
          ]}
        >
          Call Notes
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

          {/* <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            <SearchBar
              width={"200px !important"}
              border={"1px solid lightgray"}
              SearchData={SearchData}
            />
          </Div> */}
        </Div>

        {Boolean(customDate) && (
          <Box sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography id='Typography-root' sx={[FontStyle]}>From</Typography>
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
                <Typography id='Typography-root' sx={[FontStyle]}>To</Typography>
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
        <Timeline sx={{ mt: 2, p: (theme) => theme.spacing(0) }}>
          {datas?.length > 0 &&
            datas?.map((data, index) => {
              let avatar =
                index >= 10 ? avatarColors[index % 10] : avatarColors[index];

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
                      size="32px" fontSize="10px"
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
                    <Box
                      sx={{
                        backgroundColor:
                          height === index && data?.Notes?.length > 90
                            ? "#EAFCEF "
                            : "#fbfcff",
                        display: "flex",
                        justifyContent: "space-between",
                        borderRadius: "3px",
                        padding: "3px 5px !important",
                      }}
                    >
                      <JumboScrollbar
                        autoHeight={true}
                        autoHeightMax={"200px"}
                        autoHideTimeOut={4000}
                      >
                        <Card
                          sx={{
                            backgroundColor:
                              height === index ? "#EAFCEF " : "#fbfcff",
                            height: height === index ? "fit-content" : "27px",
                          }}
                        >
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Notes :</span> {data?.Details}
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Status:</span> {data?.Select_Status}
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Duration:</span> {data?.Call_Duration} Seconds
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Context:</span> {data?.Call_Context}
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Conversation Status:</span>{" "}
                            {data?.Call_Con_Status}
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Call Busy Hour:</span> {data?.Call_Busy_hour}
                          </Typography>
                          <Typography
                            id='Typography-root'
                            sx={{ ...FontStyle, lineHeight: '20px', mt: 0.5, cursor: 'pointer' }}
                            onClick={() => handleDownload(data?.Call_Recording)}
                          >
                            <span>Call Recording:</span> <span style={{ color: "blue" }}>{data?.Call_Recording}</span>
                          </Typography>
                          <Typography id='Typography-root'
                            sx={[FontStyle, { lineHeight: "20px", mt: 0.5 }]}
                          >
                            <span> Next Schedule Date:</span>{" "}
                            {data?.Next_SheduledTime}
                          </Typography>
                        </Card>
                      </JumboScrollbar>

                      <Div
                        sx={{
                          alignItems: "flex-start",
                          display: "flex",
                          width: "50px",
                          mt: "0px !important",
                        }}
                      >
                        <Div sx={[DisplayFlex, { gap: "0px !important" }]}>
                          <IconButton
                            onClick={() => {
                              index !== height ? setHeight(index) : setHeight(null);
                            }}
                            sx={{ p: 0 }}
                          >
                            {height !== index ? (
                              <ArrowDropDownIcon />
                            ) : (
                              <ArrowDropUpIcon />
                            )}
                          </IconButton>
                          {/* <IconButton
                      onClick={(event) => {
                        setNumber(data.id);
                        handleUpdate(data);
                        handleClickAction(event);
                      }}
                      sx={{ p: 0 }}
                    >
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton> */}
                        </Div>
                      </Div>
                      {/* <Menu
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
                  onClose={() => setAnchorElAction(false)}
                  sx={{
                    mt: 3,
                    mr: 5,
                    maxHeight: "300px",
                    width: "300px",
                  }}
                >
                  <MenuItem
                    sx={[FontStyle]}
                    onClick={() => {
                      setOpenEditNotes(true);
                      setAnchorElAction(false);
                    }}
                  >
                    <ModeEdit sx={{ fontSize: 16, color: "gray", mr: 0.5 }} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    sx={[FontStyle]}
                    onClick={() => {
                      setDeleteItem(data);
                      setAnchorElAction(false);
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16, color: "gray", mr: 0.5 }} />
                    Delete
                  </MenuItem>
                </Menu> */}
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
        </Timeline>
      </JumboScrollbar>


    </>
  )
}

export default AccountCallHistory;