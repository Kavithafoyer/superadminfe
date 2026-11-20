import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Grid,
  Table,
  TableBody,
  FormControl,
  Box,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import moment from "moment";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { BASE_URL } from "app/services/auth-services";
import {
  DisplayFlex,
  FontStyle,
  dialogTitle,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { SelectDropdown } from "app/pages/widgets/StylesComponents";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { AutoHeight } from "app/redux/auth/localStorage";
import SearchBar from "app/pages/widgets/SearchField";

const ContactsHistory = ({ scrollHeight, id }) => {
  // Get Histry Details
  console.log("history", id);
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

  var todaydate = moment().format("YYYY-MM-DDTHH:mm:ss");
  // const [selectedDate, setselectedDate] = useState(`${todaydate}`)
  const [activity, setActivity] = useState([]);
  const [meeting, setMeeting] = useState([]);
  const [notes, setNotes] = useState([]);
  const [datas, setDatas] = useState([1, 2, 3, 4]);
  const [date1, setDate1] = useState(`${new Date().getDate()}`);
  const [activitytime, setActivityTime] = useState("");
  const [meetingtime, setMeetingTime] = useState("");
  const [notestime, setNotesTime] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Time", label: "Date", bool: true },
    { sort: "Module_Name", label: "Module Name", bool: true },
    { sort: "Document_Id", label: "Module Id", bool: true },
    { sort: "Updated_Person", label: "Created By", bool: true },
    { sort: "Modified_By", label: "Modified By", bool: true },
  ]);

  // const handleClick = async (date) => {
  //   console.log("data", date.format('YYYY-MM-DD'));
  //   setselectedDate(date.format('YYYY-MM-DD'));

  //   if (date1 !== "") {
  //     await new Promise((resolve) => setTimeout(resolve, 5000)); // 5-second delay

  //     try {
  //       const headers = {
  //         "db": item,
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       };

  //       const activityResponse = await axios.get(`${BASE_URL}/user/HistoryContactActivitiesFilter/?id=${id}&Created_Date=${date.format('YYYY-MM-DD')}`, { headers: headers });
  //       setActivity(activityResponse.data);
  //       console.log("activityResponse", activityResponse.data)

  //       const meetingResponse = await axios.get(`${BASE_URL}/user/HistoryContactMeetingFilter/?id=${id}&Created_Date=${date.format('YYYY-MM-DD')}`, { headers: headers });
  //       setMeeting(meetingResponse.data);
  //       console.log("meetingResponse", meetingResponse.data)

  //       const notesResponse = await axios.get(`${BASE_URL}/user/HistoryContactNotesFilter/?id=${id}&Created_Date=${date.format('YYYY-MM-DD')}`, { headers: headers });
  //       setNotes(notesResponse.data);
  //       console.log("notesResponse", notesResponse.data)
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   }
  // };

  // For Time Line & Colors
  const [colors4, setColors4] = useState([]);

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
        setColors4(avatarColors1);
      } catch (error) { }
    };

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [datas]);

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
          `${BASE_URL}/user/Updaterecordsfilter/?fromdate=${selectedDate}&todate=${currentDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setUpdatedatas(res?.data);
        })
        .catch((error) => {
          console.log("error", error);
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .get(
          `${BASE_URL}/user/Updaterecordsfilter/?fromdate=${fromDate}&todate=${toDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setUpdatedatas(res?.data);
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

  // Get the History List
  const [updatedatas, setUpdatedatas] = useState([]);

  const getData = () => {
    console.log("check the record", id);
    axios
      .get(`${BASE_URL}/user/Updaterecordslist/?Contact_Id=${Number(id)}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res.data1", res.data);
        setUpdatedatas(res.data.results);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Div>
        {/* <LocalizationProvider
          dateAdapter={AdapterDayjs}>
          <DateCalendar
            // value={selectedDate}
            onChange={handleClick}
            renderInput={(params) => <input {...params} />}
            sx={[FontStyle,{
              width: "600px",
            }]} />
        </LocalizationProvider> */}
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
            History
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
                // SearchData={SearchData}
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

        <Div className="">
          <JumboScrollbar
            autoHeight={true}
            autoHeightMax={window.innerHeight}
            autoHideTimeOut={4000}
          >
            <Table sx={{ mt: 1.5 }} stickyHeader>
              <CustomTableHeader
                headerMenuItems={columnMenuItems}
                setHeadermenuItems={setColumnMenuItems}
                setDatas={setUpdatedatas}
                sortDatas={updatedatas}
                showGear={false}
              />
              <TableBody sx={{ mt: 2 }}>
                {updatedatas.length > 0 &&
                  updatedatas?.map((data, index) => {
                    // console.log(data)
                    return (
                      <>
                        <CRMTableRow>
                          {columnMenuItems[0]?.bool && (
                            <CRMTableCell data-title="Date">
                              {data?.Updated_Time.split("T")[0] || "-"}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1]?.bool && (
                            <CRMTableCell data-title="Module Name">
                              {data?.Module_Name || "-"}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2]?.bool && (
                            <CRMTableCell data-title="Module Id">
                              {data?.Document_Id || "-"}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3]?.bool && (
                            <CRMTableCell data-title="Created By">
                              {data?.Updated_Person || "-"}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4]?.bool && (
                            <CRMTableCell data-title="Modified By">
                              {data?.Modified_By || "-"}
                            </CRMTableCell>
                          )}
                        </CRMTableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>

            {/* <Timeline sx={{ m: 0, mt: 2, p: (theme) => theme.spacing(0), mt: 2, mb: 2 }}> */}
            {/* {notes.map((data, index) => {
                return (<>
                  <TimelineItem
                    sx={{
                      "&::before": {
                        display: "none",

                      },
                    }}
                  >
                    <TimelineSeparator
                      sx={{ pl: 2 }}>
                      <Badge color="primary"
                        sx={{

                        }}
                      >
                        <Div

                          sx={{
                            height: 20,
                            width: 20,
                            border: "1px solid black",
                            borderRadius: "50%",
                            backgroundColor: colors4 && colors4[index]
                          }}
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
                      <Div
                        sx={{
                          display: "flex",
                          mt: -1
                        }}>
                        <Div
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600
                          }}>
                          Notes
                        </Div>
                        <Div
                          sx={{
                            width: "400px",
                            ml: 3
                          }}>
                          <Div></Div>
                          <hr
                            style={{
                              marginTop: -6,
                              color: "#746C70",
                              fontWeight: 700
                            }}
                          />
                          <Div sx={{ mt: -1, textAlign: "center", fontSize: "16px", color: "black", fontWeight: 700 }}> {data.Notes} </Div>
                          <hr
                            style={{
                              marginTop: 2,
                              color: "#746C70",
                              fontWeight: 700
                            }} />
                        </Div>

                      </Div>
                    </TimelineContent>
                  </TimelineItem>
                </>
                )
              })} */}
            {/* {activity.map((data, index) => {
                return (<>
                  <TimelineItem
                    sx={{
                      "&::before": {
                        display: "none",

                      },
                    }}
                  >
                    <TimelineSeparator
                      sx={{ pl: 2 }}>
                      <Badge color="primary"
                        sx={{

                        }}
                      >
                        <Div

                          sx={{
                            height: 20,
                            width: 20,
                            border: "1px solid black",
                            borderRadius: "50%",
                            backgroundColor: colors4 && colors4[index]
                          }}
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
                      <Div
                        sx={{
                          display: "flex",
                          mt: -1
                        }}>
                        <Div
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600
                          }}>
                          Activity
                        </Div>
                        <Div
                          sx={{
                            width: "400px",
                            ml: 3
                          }}>
                          <hr
                            style={{
                              marginTop: -6,
                              color: "#746C70",
                              fontWeight: 700
                            }}
                          />
                        
                          <Div sx={{ mt: -1, textAlign: "center", fontSize: "16px", color: "black", fontWeight: 700 }}> {data.Task_Description} </Div>
                          <hr
                            style={{
                              marginTop: 2,
                              color: "#746C70",
                              fontWeight: 700
                            }} />
                        </Div>

                      </Div>
                    </TimelineContent>
                  </TimelineItem>
                </>
                )
              })} */}
            {/* {meeting.map((data, index) => {
                return (<>
                  <TimelineItem
                    sx={{
                      "&::before": {
                        display: "none",

                      },
                    }}
                  >
                    <TimelineSeparator
                      sx={{ pl: 2 }}>
                      <Badge color="primary"
                        sx={{

                        }}
                      >
                        <Div

                          sx={{
                            height: 20,
                            width: 20,
                            border: "1px solid black",
                            borderRadius: "50%",
                            backgroundColor: colors4 && colors4[index],
                          }}
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
                      <Div
                        sx={{
                          display: "flex",
                          mt: -1
                        }}>
                        <Div
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600
                          }}>
                          Meeting
                        </Div>
                        <Div
                          sx={{
                            width: "400px",
                            ml: 3
                          }}>
                          <hr
                            style={{
                              marginTop: -6,
                              color: "#746C70",
                              fontWeight: 700
                            }}
                          />
                          <Div sx={{ mt: -1, textAlign: "center", fontSize: "16px", color: "black", fontWeight: 700 }}> {data.Location} </Div>
                          <hr
                            style={{
                              marginTop: 2,
                              color: "#746C70",
                              fontWeight: 700
                            }} />
                        </Div>

                      </Div>
                    </TimelineContent>
                  </TimelineItem>
                </>
                )
              })} */}
            {/* </Timeline> */}
          </JumboScrollbar>
        </Div>
      </Div>
    </>
  );
};

export default ContactsHistory;
