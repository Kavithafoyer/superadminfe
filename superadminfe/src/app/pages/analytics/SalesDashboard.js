import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { Typography, Grid, TextField, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  ButtonStyle,
  ComponentHeading,
  DisplayFlex,
  FontStyle,
  input_label,
} from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import ColumnBarChart from "./Bars/ColumnBarChart";
import { PieChart } from "devextreme-react";
import { Series } from "devextreme-react/cjs/chart";
import {
  Connector,
  Export,
  Label,
  Legend,
} from "devextreme-react/cjs/pie-chart";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import moment from "moment";
import { useQuery } from "react-query";

function customizeText(arg) {
  // console.log('arg',arg);
  return `${arg.valueText}%`;
}

function SalesDashboard() {

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
  const [yearlyPerfData, setYearlyPerfData] = useState([]);



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

  const getAnalysticSalesDashboard = async () => {
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
        const response = await axios.post(`${BASE_URL}/user/AnalysticSalesDashboard/`, payload, header)

        console.log("response getAnalysticSalesDashboard:", response);
        setDatas(response?.data || []);
        const donutData = [
          { name: 'Total Invoice Amount', value: response?.data.total_invoice_amount },];
        setYearlyPerfData(donutData);

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
      await getAnalysticSalesDashboard();
    };
    fetchData();
  }, [selectedDate, currentDate, userNameLists, salesperson_id]);


  return (
    <JumboContentLayoutMain>

      <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>
        <Typography sx={[ComponentHeading, { mb: 2 }]}>
          Sales Dashboard
        </Typography>

        <br/>

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
              Choose Sales Person<span className="required">*</span>
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  height: "300px",
                  p: { xs: 0, md: 2 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  {
                    mb: 1,
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: "13px",
                  },
                ]}
              >
                Top 5 Sales Representatives
              </Typography>

              <ColumnBarChart
                height={"100%"}
                labelShow={true}
                color={["#52b788"]}
                barData={datas?.top_sales_reps}
                label="Sales_Person"
                barLength={["total_amount"]}
                barWidth={50}
                legendVerticle="bottom"
                legendhorizotal="center"
              />
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  height: "300px",
                  p: { xs: 0, md: 2 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  {
                    mb: 1,
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: "13px",
                  },
                ]}
              >
                Sales - Yearly Performance
              </Typography>
              <PieChart
                dataSource={yearlyPerfData}
                palette="Bright"
                title=""
                height={"90%"}
              >
                <Series
                  argumentField="name"
                  valueField="value"
                  color={["#8884d8", "#82ca9d", "#ffc658"]}
                >
                  <Label visible={true} customizeText={customizeText}>
                    <Connector visible={true} width={1} />
                  </Label>
                </Series>
                <Legend
                  orientation="horizontal"
                  itemTextPosition="right"
                  horizontalAlignment="center"
                  verticalAlignment="bottom"
                  columnCount={4}
                />
                <Export enabled={false} />
              </PieChart>
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  height: "300px",
                  p: { xs: 0, md: 2 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  {
                    mb: 1,
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: "13px",
                  },
                ]}
              >
                Sales - Monthly Performance
              </Typography>
              <ColumnBarChart
                height={"90%"}
                labelShow={true}
                color={["#4cc9f0"]}
                barData={datas?.month_wise_amounts}
                barType="line"
                // label="total_amount"
                // barLength={["month"]}
                label="month"
                barLength={["total_amount"]}
                endOnTick={false}
              />
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  height: "300px",
                  p: { xs: 1, md: 2 },
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  {
                    mb: 1,
                    fontWeight: 600,
                    textAlign: "center",
                    fontSize: "13px",
                  },
                ]}
              >
                Top 5 Sales
              </Typography>
              <ColumnBarChart
                xAxisTitle="User"
                yAxisTitle="Total"
                height={"90%"}
                labelShow={true}
                color={["#52b788"]}
                barData={datas?.top_sales}
                label="Customer_Name"
                barLength={["total_amount"]}
                barWidth={35}
              />
            </Div>
          </Grid>
        </Grid>
      </Div >
      <br/>
    </JumboContentLayoutMain>
  );
}

export default SalesDashboard;
