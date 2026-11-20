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
  Card,
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import {
  avatarColors,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import {
  AvatarCircle,
  Cancelbutton,
  CustomButton,
  SaveButton,
  SelectDropdown,
} from "app/pages/widgets/StylesComponents";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";

const ClosedActivity = ({ id }) => {
  const [height, setHeight] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  console.log("Closxid", id);

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

  // Get the Contact List Notes
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${BASE_URL}/user/ContactActivitiesClosed/?Contact_Id=${id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
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
        `${BASE_URL}/user/ContactClosedActivitiesSearch/?Contact_Id=${id.id}&search=${search}`,
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

  // For generating Color

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

  const [icon1, setIcon1] = useState(null);

  return (
    <>
      <Div>
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          // aria-labelledby="draggable-dialog-title"
        >
          <DialogContent>
            <Typography
              id="Typography-root"
              sx={[dialogTitle, { backgroundColor: "transparent !important" }]}
            >
              Closed Activities
            </Typography>
            <DialogContentText>
              <TextField
                className="input-box col-12 mb-1"
                size={"small"}
                placeholder={"Enter task name"}
              />

              <TextField
                multiline
                className="multiline-box col-12 mb-1"
                rows={5}
                maxRows={10}
                placeholder={"Enter task description..."}
              />
              <TextField
                className="input-box col-6 mb-1 mr-1"
                type="date"
                placeholder={"Expected Date"}
              />
              <TextField
                className="input-box col-6 mb-1 mr-1"
                type="time"
                placeholder={"Expected Time"}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Div
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <CustomButton label="Update" type="submit" Icon="saveIcon" />

              <Cancelbutton onClick={() => setShowDialog(false)} />
            </Div>
          </DialogActions>
        </Dialog>

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
              <SearchBar
                width={"200px !important"}
                border={"1px solid lightgray"}
                SearchData={SearchData}
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
          autoHideTimeOut={2000}
        >
          {datas?.map((data, index) => {
            let avatar =
              index >= 10 ? avatarColors[index % 10] : avatarColors[index];

            return (
              <Timeline key={index} sx={{ m: 0, mt: 2, p: 0 }}>
                <TimelineItem
                  sx={{
                    "&::before": {
                      display: "none",
                    },
                  }}
                >
                  <TimelineSeparator>
                    <Badge color="primary">
                      <AvatarCircle
                        fullTitle={true}
                        size="32px"
                        fontSize="10px"
                        bgColor={avatar}
                        title={moment(data.Expected_Date).format("MMM D")}
                      />
                    </Badge>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent
                    sx={{
                      p: (theme) => theme.spacing(0.5, 0),
                      ml: 2.5,
                    }}
                  >
                    {/* {icon1 === index && ( */}
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
                              height: height === index ? "fit-content" : "44px",
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
                              Description <span>:{data?.Task_Description}</span>
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
                          </Div>
                        </Div>
                      </Div>
                    </>
                    {/* )} */}
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            );
          })}
        </JumboScrollbar>
      </Div>
    </>
  );
};

export default ClosedActivity;
