import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  FormControl,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { ComponentHeading, DisplayFlex, FontStyle, input_label } from "../widgets/CRMStyles";
import ColumnBarChart from "./Bars/ColumnBarChart";
import { useDrawingArea } from "@mui/x-charts";
import Div from "@jumbo/shared/Div";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { AutoHeight } from "app/redux/auth/localStorage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import moment from "moment";
import { useQuery } from "react-query";

function SalesGoals() {

  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

  const { width, height } = useDrawingArea();
  const [selectedteritories, setSelectedteritories] = useState("");
  const [teritoriesList, setTeritoriesList] = useState([]);

  const [datas, setDatas] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState(ThisWeekEnd);
  const [getSalesperson_name, setgetSalesperson_name] = useState("all")
  const [userNameLists, setUserNameLists] = useState({});
  const [salesperson_id, setSalesperson_id] = useState(0);

  const dataSource = [
    { color: "#588157", value: 1300, label: "Team" },
    { color: "#fb5607", value: 1100, label: "Lauren Rogers" },
    { color: "#ffba08", value: 1020, label: "Lola Rogers" },
    { color: "#0077b6", value: 1560, label: "Caroline Chromik" },
    { color: "#ff758f", value: 1280, label: "Care Bear" },
  ].reverse();

  // get Datas
  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
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
    setCurrentDate("");


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

  const getSalesGoals = async () => {
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
        const response = await axios.post(`${BASE_URL}/user/AnalysticSalesGoals/`, payload, header)

        console.log("response:", response);

        if (response.data?.sales_within_period?.length > 0) {
          const list = response.data?.sales_within_period?.map((res, idx) => ({
            userName: res?.Customer_Name,
            TotalAmount: res?.total_sales,
            color: getRandomColor(),
            // color: colors[idx]?.color,
          }));
          console.log("lists", list);
          setDatas(list || []);
        } else {
          setDatas([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }


  const TerritoryList = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/TerritoryManagementFullList/`, header)
      console.log("response:", response);
      // let TerritoryList = response?.data?.map(Tname=>Tname?.TerritoryName)
      // console.log("TerritoryList:",TerritoryList);
      setTeritoriesList(response?.data);
    } catch (error) {
      console.log(error);
    }
  }


  const handleTerritoryChange = (event, newValue) => {
    console.log("triggered handleTerritoryChange:",)
    console.log(" newValue in handleTerritory:", newValue);
    setSelectedteritories(newValue?.TerritoryName);
  }


  useEffect(() => {
    TerritoryList();
    // TerritoryManagementList();
  }, [])


  useEffect(() => {
    getSalesGoals();
  }, [selectedteritories, selectedDate, currentDate,]);



  return (
    <JumboContentLayoutMain>

      <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
        <Typography sx={[ComponentHeading, { mb: 2 }]}>Sales Goals</Typography>
      </Div>


      <Grid container spacing={2} sx={{ py: 1, px: 4, display: 'flex', justifyContent: 'flex-start' }}>
      
      {/* Period Selector */}
      <Grid item xs={12} md={4}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Choose a Period<span style={{ color: 'red' }}>*</span>
        </Typography>
        <Autocomplete
          value={selectedPeriod}
          options={periodOptions}
          onChange={(e, newValue) => handlePeriodChange(e, newValue)}
          renderInput={(params) => <TextField {...params} placeholder="Choose a Period" fullWidth />}
        />
      </Grid>

      {/* From Date */}
      {customDate && (
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            From<span style={{ color: 'red' }}>*</span>
          </Typography>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
          />
        </Grid>
      )}

      {/* To Date */}
      {customDate && (
        <Grid item xs={12} md={4}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            To
          </Typography>
          <TextField
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            fullWidth
          />
        </Grid>
      )}

      {/* Territory Selector */}
      <Grid item xs={12} md={6}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Choose a Territory
        </Typography>
        <FormControl fullWidth>
          <Autocomplete
            autoComplete="off"
            name="selectTerritoryName"
            options={teritoriesList || []}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option?.TerritoryName || '')}
            value={selectedteritories}
            onChange={(e, newValue) => handleTerritoryChange(e, newValue)}
            renderInput={(params) => <TextField {...params} placeholder="Choose a territory" />}
          />
        </FormControl>
      </Grid>

    </Grid>

      <Div sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, mt: 2 }]}>


        {/* <ColumnBarChart
          height={AutoHeight()}
          rotated={true}
          // barType="stackedbar"
          color={["green", "lightgrey"]}
          barData={datas}
          label="username"
          barLength={["achieved", "target"]}
        /> */}
        <ResponsiveContainer width="100%" height={400}>

          <BarChart
            data={datas}
            margin={{
              top: 20, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="salesPerson" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="#8884d8" />
            <Bar dataKey="totalTarget" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

      </Div>
    </JumboContentLayoutMain>
  );
}

export default SalesGoals;
