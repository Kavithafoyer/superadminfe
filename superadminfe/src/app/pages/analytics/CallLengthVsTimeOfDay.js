import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import React, { useEffect, useState } from 'react'
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  ArgumentAxis,
  Label,
  Border,
  Tooltip,
  Export,
  Title,
} from 'devextreme-react/chart';
import { useDrawingArea } from '@mui/x-charts';
import { ComponentHeading } from '../widgets/CRMStyles';
import ColumnBarChart from "./Bars/ColumnBarChart";
import { Typography, Grid, TextField, Autocomplete } from "@mui/material";
import Div from '@jumbo/shared/Div';
import axios from 'axios';
import { BASE_URL } from 'app/services/auth-services';
import { AutoHeight } from 'app/redux/auth/localStorage';
import moment from "moment";
import { useQuery } from "react-query";


const palette = ['#00ced1', '#008000', '#ffd700', '#ff7f50'];

const customizeTooltip = (pointInfo) => ({
  text: `Date : ${pointInfo.argumentText}<br/><br/>Call Duration : ${pointInfo.valueText}m`,
});

// const customizeText = (e) => `${e.value}`;

function CallLengthVsTimeOfDay() {
  const { width, height } = useDrawingArea();
  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');


  const [datas, setDatas] = useState([]);
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
  const [chartData, setChartData] = useState([]);
  




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

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getCallLength = async () => {
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
        const response = await axios.post(`${BASE_URL}/user/AnalysticCallLengthvsTimeOfLength/`, payload, header)
        if (response?.data?.length > 0) {
          setDatas(response?.data || []);
        } else {
          setDatas([]);
        }
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
      await getCallLength();
    };
    fetchData();
  }, [selectedDate, currentDate, userNameLists, salesperson_id]);




  return (
    <JumboContentLayoutMain>
      <Div sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, }]} >
        <Typography sx={[ComponentHeading, { mb: 4 }]}>Call Length vs Time of Day</Typography>
        <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

          <Grid item className="col-12 col-md-6">
            <Typography className="col-12 input-label">
              Choose a Period<span className="required">*</span>
            </Typography>

            <Autocomplete
              className="col-12 search-select"
              value={selectedPeriod}
              options={periodOptions}
              onChange={(e, newValue) => handlePeriodChange(e, newValue)}
              renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
            />
          </Grid>


          <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
            <Typography className="col-6 input-label">
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
            <Typography className="col-6 input-label">
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
            <Typography className="col-12 input-label">
              Choose Rep<span className="required">*</span>
            </Typography>
            <Autocomplete
              className="col-12 search-select"
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

        <br />
        <Div>
        <ColumnBarChart
          height="100%"
          legend={true}
          labelShow={true}
          barData={datas}
          barWidth={50}
          legendVerticle="bottom"
          legendhorizotal="center"
          barType="stackedbar"
          label="Date"
          barLength={["Total_Duration"]}
          // colors={colors}
        />;
           </Div>





        {/* <Chart
          palette={palette}
          dataSource={datas}
          height={AutoHeight()}
        // rotated={true}

        >
          <Tooltip
            enabled={true}
            location="edge"
            customizeTooltip={customizeTooltip}
          />
          <CommonSeriesSettings type="bubble" />

          <ValueAxis>
            <Label font={{ size: "10px", color: 'black', }} />
            <Title font={{ size: "10px", color: 'black', weight: 600 }} text={"CALL DURATION"} />
          </ValueAxis>

          <ArgumentAxis>
            <Label font={{ size: "10px", color: 'black', }} />
            <Title font={{ size: "10px", color: 'black', weight: 600 }} text={"DAYS"} />
          </ArgumentAxis>

           <Series
            argumentField="Date"
            valueField="Total_Duration"
            tagField="Total_Duration"
          />
          <Legend visible={false}
            position="inside"
            horizontalAlignment="left"
          >
          </Legend>

          <Export enabled={false} />
        </Chart> */}


      </Div>

    </JumboContentLayoutMain>
  )
}

export default CallLengthVsTimeOfDay

