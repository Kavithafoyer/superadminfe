import React, { memo, useEffect, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { Typography, Grid, TextField, Autocomplete } from "@mui/material";
import { ComponentHeading } from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import { useDrawingArea } from "@mui/x-charts";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { AutoHeight } from "app/redux/auth/localStorage";
import moment from "moment";
import { useQuery } from "react-query";
import "./Analysis.css";

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#f1685e",
  "#ffafcc",
  "#fb8500",
  "#ffb703",
];

function SalesByCustomer() {
  const { width, height, left, top } = useDrawingArea();

  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

  const [datas, setDatas] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const token = localStorage.getItem("accesstoken");
  const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
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
  };

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

  const handlePeriodChange = (e, newValue) => {
    // Handle period change logic
    console.log("handlePeriodChange newValue:", newValue);
    setSelectedPeriod(newValue);
    setSelectedDate(null);
    setCurrentDate("");

    let startDate, endDate;

    switch (newValue) {
      // Handle each case
      case 'This Week':
        startDate = moment().startOf('week');
        endDate = moment().endOf('week');
        break;
      case 'This Month':
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        break;
      case 'This Quarter':
        startDate = moment().startOf('quarter');
        endDate = moment().endOf('quarter');
        break;
      case 'This Year':
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');
        break;
      case 'Previous Week':
        startDate = moment().subtract(1, 'week').startOf('week');
        endDate = moment().subtract(1, 'week').endOf('week');
        break;
      case 'Previous Month':
        startDate = moment().subtract(1, 'month').startOf('month');
        endDate = moment().subtract(1, 'month').endOf('month');
        break;
      case 'Previous Quarter':
        startDate = moment().subtract(1, 'quarter').startOf('quarter');
        endDate = moment().subtract(1, 'quarter').endOf('quarter');
        break;
      case 'Previous Year':
        startDate = moment().subtract(1, 'year').startOf('year');
        endDate = moment().subtract(1, 'year').endOf('year');
        break;
      case 'Custom Date':
        break;
      default:
        startDate = moment().startOf('year');
        endDate = moment().endOf('year');
    }
    
    if (startDate && endDate) {
      setSelectedDate(startDate.format('YYYY-MM-DD'));
      setCurrentDate(endDate.format('YYYY-MM-DD'));
    }
  };

  const getSalesByCustomer = async () => {
    try {
      if (currentDate !== "" && selectedDate !== "") {
        let payload = {
          Is_Deleted: false,
          fromdate: selectedDate,
          todate: currentDate,
          userid: salesperson_id === 0 ? 'all' : salesperson_id
        };
        const response = await axios.post(`${BASE_URL}/user/AnalysticSalesByCustomer/`, payload, header);

        if (response.data?.sales_within_period?.length > 0) {
          const list = response.data?.sales_within_period?.map((res) => ({
            name: res?.Customer_Name,
            data: res?.total_sales,
            color: colors[Math.floor(Math.random() * colors.length)]
          }));
          setDatas(list || []);
        } else {
          setDatas([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, header);
      return response?.data;
    } catch (error) {
      console.log("Error in getting user list", error);
    }
  };

  const { data: getTerUserLists } = useQuery(['getTerUserLists'], fetchUserData, { staleTime: Infinity });

  useEffect(() => {
    if (getTerUserLists) {
      const listdata = [{ username: 'all', id: 0 }];
      getTerUserLists?.forEach((opt) => {
        listdata.push({ id: opt?.id, username: opt?.username });
      });
      setUserNameLists(listdata);
    }
  }, [getTerUserLists]);

  useEffect(() => {
    const fetchData = async () => {
      await getSalesByCustomer();
    };
    fetchData();
  }, [selectedDate, currentDate, salesperson_id]);

  return (
    <JumboContentLayoutMain>
      <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>
        <Typography sx={[ComponentHeading, { mb: 2 }]}>Sales By Customers</Typography>

        <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>
          <Grid item className="col-12 col-md-6">
            <Typography className="col-12 input-label">Choose a Period<span className="required">*</span></Typography>
            <Autocomplete
              className="col-12 search-select"
              value={selectedPeriod}
              options={periodOptions}
              onChange={(e, newValue) => handlePeriodChange(e, newValue)}
              renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
            />
          </Grid>

          <Grid item className="col-6 col-md-3" style={{ display: selectedPeriod === 'Custom Date' ? "block" : "none" }}>
            <Typography className="col-6 input-label">From<span className="required">*</span></Typography>
            <TextField
              type="date"
              className="col-12 search-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Grid>

          <Grid item className="col-6 col-md-3" style={{ display: selectedPeriod === 'Custom Date' ? "block" : "none" }}>
            <Typography className="col-6 input-label">To</Typography>
            <TextField
              type="date"
              className="col-12 search-select"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </Grid>

          <Grid item className="col-12 col-md-6">
            <Typography className="col-12 input-label">Choose Sales Person<span className="required">*</span></Typography>
            <Autocomplete
              className="col-12 search-select"
              options={userNameLists}
              getOptionLabel={(option) => option?.username || ""}
              value={userNameLists.find(user => user.username === getSalesperson_name) || null}
              onChange={(e, newValue) => {
                setgetSalesperson_name(newValue?.username);
                setSalesperson_id(newValue?.id);
              }}
              renderInput={(params) => <TextField {...params} placeholder="Choose Rep" />}
            />
          </Grid>
        </Grid>
        <div className="container mt-3 mb-3">
          <div className="row">
            <div className="col-md-12 bg">
            <ReactApexChart
          type="pie"
          series={datas.map(item => item.data)}
          options={{
            chart: {
              type: 'pie',
            },
            labels: datas.map(item => item.name),
            colors: datas.map(item => item.color),
            title: {
              text: `Sales by Customer between ${selectedDate} & ${currentDate}`,
              align: 'center'
            },
            legend: {
              position: 'bottom'
            },
            plotOptions: {
              pie: {
                expandOnClick: true
              }
            },
            dataLabels: {
              enabled: true
            }
          }}
          height={AutoHeight()}
        />
            </div>
          </div>
        </div>
      </Div>
    </JumboContentLayoutMain>
  );
}

export default SalesByCustomer;
