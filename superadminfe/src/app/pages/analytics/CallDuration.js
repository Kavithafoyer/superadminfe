import React, { useEffect, useState } from "react";
import { Typography, Grid, TextField, Autocomplete } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import axios from "axios";
import { useQuery } from "react-query";
import { BASE_URL } from "app/services/auth-services";
import { ComponentHeading } from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";

function CallDuration() {
  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

  const [selectedPeriod, setSelectedPeriod] = useState('This Year');
  const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
  const [currentDate, setCurrentDate] = useState(ThisWeekEnd);
  const [getSalesperson_name, setgetSalesperson_name] = useState("all");
  const [userNameLists, setUserNameLists] = useState([]);
  const [salesperson_id, setSalesperson_id] = useState(0);
  const [chartData, setChartData] = useState([]);

  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const periodOptions = [
    'Previous Week', 'Previous Month', 'Previous Quarter', 'Previous Year',
    'This Week', 'This Month', 'This Quarter', 'This Year', 
    'Last One Year', 'Last Six Month', 'Last Three Month', 'Custom Date'
  ];

  const handlePeriodChange = (e, newValue) => {
    setSelectedPeriod(newValue || 'This Year');
  };

  const getCallDuration = async () => {
    try {
      if (currentDate) {
        const payload = {
          Is_Deleted: false,
          fromdate: selectedDate,
          todate: currentDate,
          userid: salesperson_id === 0 ? 'all' : salesperson_id
        };
        const response = await axios.post(`${BASE_URL}/user/AnalysticCallDurations/`, payload, header);

        let combinedData = [];
        if (response?.data?.Contact) {
          const contactData = response.data.Contact.map(item => ({ ...item, Type: "Contact" }));
          combinedData = [...combinedData, ...contactData];
        }
        if (response?.data?.Deal) {
          const dealData = response.data.Deal.map(item => ({ ...item, Type: "Deal" }));
          combinedData = [...combinedData, ...dealData];
        }
        if (response?.data?.Lead) {
          const leadData = response.data.Lead.map(item => ({ ...item, Type: "Lead" }));
          combinedData = [...combinedData, ...leadData];
        }

        if (combinedData.length > 0) {
          const formattedData = combinedData.reduce((acc, item) => {
            if (!acc[item.Type]) {
              acc[item.Type] = { name: item.Type, data: [] };
            }
            acc[item.Type].data.push({ x: item.Company_Name, y: item.Total_Call_Duration });
            return acc;
          }, {});

          setChartData(Object.values(formattedData));
        } else {
          setChartData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching call duration data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, header);
      return response?.data;
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const { data: getTerUserLists } = useQuery(['getTerUserLists'], fetchUserData, { staleTime: Infinity });

  useEffect(() => {
    if (getTerUserLists) {
      const listdata = [{ 'username': 'all', 'id': 0 }];
      getTerUserLists.forEach(opt => {
        listdata.push({
          id: opt.id,
          username: opt.username
        });
      });
      setUserNameLists(listdata);
    }
  }, [getTerUserLists]);

  useEffect(() => {
    getCallDuration();
  }, [selectedDate, currentDate, salesperson_id]);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: 'normal'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      type: 'category',
      categories: chartData.length ? chartData[0].data.map(item => item.x) : []
    },
    yaxis: {
      title: {
        text: 'Call Duration (mins)'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: val => `${val} mins`
      }
    }
  };

  return (
    <div style={{ padding: '16px',backgroundColor:'#fff' }}>
      <Div sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }]}>
        <Typography sx={[ComponentHeading, { mb: { xs: 2, md: 5 } }]}>
          Call Durations
        </Typography>

        <Grid container columnSpacing={2} item xs={12} md={12} lg={12}>
          <Grid item className="col-12 col-md-3">
            <Typography className="col-12 input-label">
              Choose a Period<span className="required">*</span>
            </Typography>
            <Autocomplete
              className="col-12 search-select"
              value={selectedPeriod}
              options={periodOptions}
              onChange={handlePeriodChange}
              renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
            />
          </Grid>

          <Grid item className="col-6 col-md-3">
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

          <Grid item className="col-6 col-md-3">
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

          <Grid item className="col-12 col-md-3">
            <Typography className="col-12 input-label">
              Choose Rep<span className="required">*</span>
            </Typography>
            <Autocomplete
              className="col-12 search-select"
              options={userNameLists}
              getOptionLabel={(option) => option?.username || ""}
              value={userNameLists.find(user => user.username === getSalesperson_name) || null}
              onChange={(e, newValue) => {
                setgetSalesperson_name(newValue?.username || "all");
                setSalesperson_id(newValue?.id || 0);
              }}
              renderInput={(params) => <TextField {...params} placeholder="Choose Rep" />}
            />
          </Grid>
        </Grid>
        <br />
        <Div>
          <ReactApexChart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={350}
          />
        </Div>
      </Div>
    </div>
  );
}

export default CallDuration;
