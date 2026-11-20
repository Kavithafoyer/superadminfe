import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import React, { useEffect, useState } from "react";
import {
  ButtonStyle,
  ComponentHeading,
  DisplayFlex,
  FontStyle,
  input_label,
} from "../widgets/CRMStyles";
import { Typography, Grid, TextField, Autocomplete } from "@mui/material";
import ColumnBarChart from "./Bars/ColumnBarChart";
import { useDrawingArea } from "@mui/x-charts";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import CrmSpeedoMeter from "./CrmDashboard/CrmSpeedoMeter";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import ReactSpeedometer from "react-d3-speedometer";
import moment from "moment";
import { useQuery } from "react-query";


function ActivityOverview() {

  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

  const [datas, setDatas] = useState([]);
  const [outboundCalls, setOutboundCalls] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const token = localStorage.getItem("accesstoken");
  const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState(ThisWeekEnd);
  const [getSalesperson_name, setgetSalesperson_name] = useState("all")
  const [userNameLists, setUserNameLists] = useState([]);
  const [salesperson_id, setSalesperson_id] = useState(0);



  const DBName = "crmuseradmin1";
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }



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
  let piechartTitle = `Sales by Customer between ${selectedDate} & ${currentDate}`



  const handlePeriodChange = (e, newValue) => {
    // e.preventDefault
    console.log("handlePeriodChange newValue:", newValue);
    setSelectedPeriod(newValue);
    setSelectedDate(" ");
    setCurrentDate(" ");
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

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getAnalysticActivityOverview = async () => {
    try {
      if (
        currentDate !== "" && currentDate !== undefined && currentDate !== null
      ) {
        let payload = {
          Is_Deleted: false,
          fromdate: selectedDate,
          todate: currentDate,
          userid: salesperson_id === 0 ? 'all' : salesperson_id
        }
        const response = await axios.post(`${BASE_URL}/user/AnalysticActivityOverview/`, payload, header)

        console.log("response:", response);
        setDatas(response.data || []);

        // if (response.data?.length > 0) {
        //   setDatas(response.data || []);
        //   // const list = response.data?.sales_within_period?.map((res, idx) => ({
        //   //   userName: res?.Customer_Name,
        //   //   TotalAmount: res?.total_sales,
        //   //   color: getRandomColor(),
        //   //   // color: colors[idx]?.color,
        //   // }));
        //   // console.log("lists", list);
        //   // setDatas(list || []);
        // }else{
        //   setDatas([]);
        // }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, header);
      console.log("Users List", response.data);
      return response?.data
    } catch (error) {
      console.log("Error in getting user list", error);
    }
  };

  const { data: getTerUserLists, isLoading: getTerUserListsLoading, isError: getTerUserListsError, refetch: getTerUserListsRefetch } = useQuery(
    ['getTerUserLists'],
    fetchUserData, // Assuming 1 as the initial page number
    { staleTime: Infinity }
  );


  useEffect(() => {
    if (getTerUserLists) {
      // let listdata = [...userNameLists]
      let listdata = [{ 'username': 'all', 'id': 0 }]
      getTerUserLists?.map((opt) => {
        listdata.push({
          id: opt?.id,
          username: opt?.username
        })
      })
      setUserNameLists(listdata);
    }

  }, [getTerUserLists]);

  useEffect(() => {
    const fetchData = async () => {
      await getAnalysticActivityOverview();
    };
    fetchData();
  }, [selectedDate, currentDate, userNameLists, salesperson_id]);

  return (
    <JumboContentLayoutMain>

      <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>
        <Typography sx={[ComponentHeading, { mb: { xs: 2, md: 5 } }]}>
          Activity Overview
        </Typography>

        <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

          <Grid item className="col-12 col-md-6">
            <Typography sx={[input_label]}>
              Choose a Period<span className="required">*</span>
            </Typography>

            <Autocomplete
              className="search-select3"
              value={selectedPeriod}
              options={periodOptions}
              onChange={(e, newValue) => handlePeriodChange(e, newValue)}
              renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
            />
          </Grid>


          <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
            <Typography sx={[input_label]}>
              From<span className="required">*</span>
            </Typography>

            <TextField
              type={"date"}
              className="col-12 search-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Grid>

          <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
            <Typography sx={[input_label]}>
              To
            </Typography>

            <TextField
              type={"date"}
              className="col-12 search-select"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </Grid>

          <Grid item className="col-12 col-md-6">
            <Typography sx={[input_label]}>
              Choose Sales Person<span className="required">*</span>
            </Typography>
            <Autocomplete
              className="search-select3"
              options={userNameLists}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.username) {
                  return option?.username;
                }
                return "";
              }}
              value={getSalesperson_name}
              onChange={(e, newValue) => {
                setgetSalesperson_name(newValue?.username);
                setSalesperson_id(newValue?.id);
              }}
              renderInput={(params) => <TextField {...params} placeholder="Choose Rep" />}
            />
          </Grid>
        </Grid>
        <br/>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  // boxShadow: "0px 0px 4px lightgray",
                  // border: "1px solid white",
                  backgroundColor: "#003566",
                },
              ]}  
            >
              <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                <Div>
                  <Typography sx={{ fontSize: "14px", textAlign: "center", color: 'white' }}>
                    Sales Closed <span><i class="bi bi-graph-up-arrow"></i></span>
                  </Typography>
                  <Div sx={[DisplayFlex, { justifyContent: "center", }]}>
                    <Typography sx={{ fontSize: "18px", color: "white", mt: 2 }}>
                      {datas?.invoice_count}
                      {/* <span style={{ color: "red" }}> ({datas?.invoice_count})</span> */}
                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  // boxShadow: "0px 0px 4px lightgray",
                  // border: "1px solid white",
                  backgroundColor: "#2a9d8f",

                },
              ]}
            >
              <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                <Div>
                  <Typography sx={{ fontSize: "14px", textAlign: "center", color: 'white' }}>
                    Avg Sales <span><i class="bi bi-graph-up"></i></span>
                  </Typography>
                  <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                    <Typography sx={{ fontSize: "18px", color: "#003b40", mt: 2 }}>
                      ₹ {datas?.total_invoice_amount}
                      {/* <span style={{ color: "red" }}> ({outboundCalls?.usersales?.Avg_Percentage})</span> */}
                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} md={6}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Div>
                <Typography sx={{ fontSize: "14px" }}>Outbound Calls</Typography>
                <Div
                  sx={[
                    DisplayFlex,
                    { justifyContent: "space-between", height: "110px" },
                  ]}
                >
                  <Div sx={[DisplayFlex, { justifyContent: "space-between", height: "110px" }]}>
                    <Typography sx={{ fontSize: "20px" }}>{datas?.current_total_call_duration || 0}</Typography>

                    <Typography sx={{ fontSize: "18px", color: datas?.percentage_diff_call_duration ? "green" : "tomato" }}>

                      {datas?.percentage_diff_call_duration < 0 ?
                        <IoMdArrowDropdown style={{ color: "tomato", fontSize: 22 }} /> :
                        <IoMdArrowDropup style={{ color: "green", fontSize: 22 }} />}
                      {datas?.percentage_diff_call_duration}
                    </Typography>

                  </Div>


                  <ReactSpeedometer
                    height={"100%"}
                    width={250}
                    maxValue={100}
                    customSegmentLabels={false}
                    value={datas?.percentage_diff_call_duration || 0}  // Default to 0 if undefined or null
                    segmentColors={["#008000", "#ffdd00", "#ff9e00", "#ff4800", "#d00000"]}
                    currentValueText={String(datas?.percentage_diff_call_duration || 0)}
                    textColor={"black"}
                  />
                </Div>

                <Typography sx={{ fontSize: "11px" }}>Current Period vs last Period</Typography>
              </Div>
            </Div>
          </Grid>




          <Grid item xs={12} md={6}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Div>
                <Typography sx={{ fontSize: "14px" }}>Demos</Typography>
                <Div
                  sx={[
                    DisplayFlex,
                    { justifyContent: "space-between", height: "110px" },
                  ]}
                >
                  <Div sx={[DisplayFlex, { justifyContent: "space-between", height: "110px" }]}>
                    <Typography sx={{ fontSize: "20px" }}>{datas?.percentage_diff_demo_count || 0}</Typography>

                    <Typography sx={{ fontSize: "18px", color: datas?.percentage_diff_demo_count ? "green" : "tomato" }}>

                      {datas?.percentage_diff_demo_count < 0 ?
                        <IoMdArrowDropdown style={{ color: "tomato", fontSize: 22 }} /> :
                        <IoMdArrowDropup style={{ color: "green", fontSize: 22 }} />}
                      {datas?.percentage_diff_demo_count}
                    </Typography>
                  </Div>

                  <ReactSpeedometer
                    height={"100%"}
                    width={250}
                    maxValue={100}
                    minValue={-100} // Adjust minValue to handle negative values if needed
                    customSegmentLabels={false}
                    value={datas?.percentage_diff_demo_count || 0}  // Default to 0 if undefined or null
                    segmentColors={["#008000", "#ffdd00", "#ff9e00", "#ff4800", "#d00000"]}
                    currentValueText={String(datas?.percentage_diff_demo_count || 0)}
                    textColor={"black"}
                  />
                </Div>
                <Typography sx={{ fontSize: "11px" }}>Current Period vs last Period</Typography>
              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography sx={[ComponentHeading, { mb: 1 ,textAlign:'center'}]}>
                Calls Activities
              </Typography>

              <ColumnBarChart
                height={"100%"}
                legend={true}
                labelShow={false}
                barData={datas?.Current_Total_Call_Duration}
                barWidth={50}
                legendVerticle="bottom"
                legendhorizotal="center"
                barType="stackedbar"
                label="Company_Name"
                barLength={["total_call_duration",]}
              />

            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  p: { xs: 0, md: 2 },
                  px: { xs: 0, md: 4 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography sx={[ComponentHeading, { mb: 1 }]} style={{textAlign:'center'}}>
                Outbound Calls Per Weekday
              </Typography>
              <ColumnBarChart
                height={"100%"}
                labelShow={true}
                color={["#4cc9f0"]}
                barData={datas?.date_call_duration_data}
                barLength={["Total_Call_Duration"]}
                label="Date"
                barWidth={50}
              />
            </Div>
          </Grid>
        </Grid>
        <br/>
      </Div >
      <br/>
    </JumboContentLayoutMain>
  );
}

export default ActivityOverview;
