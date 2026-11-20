import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import {
  Autocomplete, Card, Grid, TextField, Typography, Table,
  TableBody, TableHead
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ComponentHeading, DialogHeader, DisplayFlex, input_label, Colors, FontStyle, CRMTableHead } from '../widgets/CRMStyles'
import ColumnBarChart from './Bars/ColumnBarChart'
import Div from '@jumbo/shared/Div'
import axios from 'axios'
import { BASE_URL } from 'app/services/auth-services'
import moment from "moment";
import { useQuery } from "react-query";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import CustomTableHeader from "../widgets/CustomTableHeader";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";

function ActivityIndividualReport() {

  let startDate = moment().startOf('year');
  let endDate = moment().endOf('year');

  let ThisWeekStart = startDate?.format('YYYY-MM-DD');
  let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

  const [datas, setDatas] = useState([]);
  const [dealDatas, setDealDatas] = useState([]);
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

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Sales Person", label: "Sales Person", bool: true },
    { sort: "Activity Type", label: "Activity Type", bool: true },
    { sort: "No of activities", label: "No of activities", bool: true },
  ]);



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
  const getAnalysticSalesOpportunitiesOverview = async () => {
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
        const response = await axios.post(`${BASE_URL}/user/AnalysticSalesOpportunitiesOverview/`, payload, header)

        console.log("response AnalysticSalesOpportunitiesOverview:", response);
        setDealDatas(response?.data || []);
        return;


      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAnalysticActivityIndividualReport = async () => {
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
        const response = await axios.post(`${BASE_URL}/user/AnalysticActivityIndividualReport/`, payload, header)

        console.log("response AnalysticActivityIndividualReport:", response);
        setDatas(response?.data || []);
        return;
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
      await getAnalysticActivityIndividualReport();
      await getAnalysticSalesOpportunitiesOverview();
    };
    fetchData();
  }, [selectedDate, currentDate, userNameLists, salesperson_id]);



  return (
    <JumboContentLayoutMain>
      <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>
        <Typography sx={[ComponentHeading, { mb: { xs: 2, md: 5 } }]}>Activity Individual Report</Typography>

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


        <Grid container spacing={2} >
          <Grid item xs={12} md={12} mt={1}>
            <Div id='card' sx={[{ p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }]} >

              <Div>
                <div className='row'>
                  <div className='col-md-3'>
                  <Card sx={[DisplayFlex, { gap: 4, height: "65px", justifyContent: 'center',backgroundColor:'#f1f1f1' }]}>
                  <Div>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "14px", color: '#4e4e4e' }}>₹ {dealDatas?.total_deal_count || 0}</Typography>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "13px",color:'#363636' }}>Opportunities Closed Overall</Typography>
                  </Div>
                </Card>
                  </div>
                  <div className='col-md-3'>
                  <Card sx={[DisplayFlex, { height: "65px", justifyContent: 'center',backgroundColor:'#f1f1f1' }]}>
                  <Div>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "14px", color: '#4e4e4e' }}>₹   {dealDatas?.deal_counts_by_type
                      ? dealDatas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Open")?.count || 0
                      : 0}</Typography>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "13px",color:'#363636' }}>Opportunities Open</Typography>
                  </Div>
                </Card>
                  </div>
                  <div className='col-md-3'>
                  <Card sx={[DisplayFlex, { height: "65px", justifyContent: 'center',backgroundColor:'#f1f1f1' }]}>
                  <Div>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "14px", color: '#4e4e4e' }}>₹  {datas?.deal_counts_by_type
                      ? datas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Won")?.count || 0
                      : 0}</Typography>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "13px",color:'#363636'}}>Opportunities Won</Typography>
                  </Div>
                </Card>
                  </div>
                  <div className='col-md-3'>
                  <Card sx={[DisplayFlex, { height: "65px", justifyContent: 'center',backgroundColor:'#f1f1f1' }]}>
                  <Div>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "14px", color: '#4e4e4e' }}>₹  {dealDatas?.deal_counts_by_type
                      ? dealDatas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Lost")?.count || 0
                      : 0}</Typography>
                    <Typography sx={{ fontWeight: 600, textAlign: 'center', fontSize: "13px",color:'#363636' }}>Opportunities Lost</Typography>
                  </Div>
                </Card>
                  </div>
                </div>
              </Div>
            </Div>

          </Grid>
          <Grid item xs={12} md={6} mt={1}>
            <Div id='card' sx={[{ height: { md: 300 }, p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }]} >
              <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Tasks Count</Typography>
              <Div>
                <JumboScrollbar
                  autoHeight={true}
                  autoHideTimeout={4000}
                  autoHeightMin={176}
                  autoHeightMax={176}
                  autoHide={true}
                  hideTracksWhenNotNeeded
                  id="no-more-tables"
                >
                  <Table className="table" stickyHeader>
                    <TableHead sx={[CRMTableHead, FontStyle]}>
                      <CRMTableRow>
                        <CRMTableCell
                          align="left"
                        >
                          Sales Person
                        </CRMTableCell>

                        <CRMTableCell
                          align="right"

                        >
                          Activity Type
                        </CRMTableCell>
                        <CRMTableCell
                          align="right"

                        >
                          No of activities
                        </CRMTableCell>
                      </CRMTableRow>
                    </TableHead>
                    <TableBody className="table-body" sx={{ mt: 2 }}>
                      {datas &&
                        datas?.lead_activities?.map((data, index) => {
                          return (
                            <CRMTableRow >
                              <CRMTableCell data-title="Sales Person">
                                {data?.Lead_Owner}
                              </CRMTableCell>
                              <CRMTableCell data-title="Activity Type">
                                "Lead"
                              </CRMTableCell>
                              <CRMTableCell align="right" data-title="Count">
                                {(data?.activity_count || 0)?.toLocaleString()}
                              </CRMTableCell>
                            </CRMTableRow>
                          );
                        })}
                      {datas &&
                        datas?.deal_activities?.map((data, index) => {
                          return (
                            <CRMTableRow >
                              <CRMTableCell data-title="Sales Person">
                                {data?.Deal_Owner}
                              </CRMTableCell>
                              <CRMTableCell data-title="Activity Type">
                                "Deal"
                              </CRMTableCell>
                              <CRMTableCell align="right" data-title="Count">
                                {(data?.activity_count || 0)?.toLocaleString()}
                              </CRMTableCell>
                            </CRMTableRow>
                          );
                        })}


                    </TableBody>
                  </Table>
                </JumboScrollbar>

              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div id='card' sx={[{ height: { md: 300 }, p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }]} >
              <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Calls</Typography>
              <Typography sx={[{ mb: 1, fontWeight: 400, textAlign: 'center', fontSize: "10px" }]}>Outbound/Inbound</Typography>
              <Div>
                <ColumnBarChart
                  labelShow={true}
                  barData={datas?.company_call_duration || []}
                  MultipleColumn={true}
                  valueField='Total_Call_Duration'
                  label='Company_Name'
                  rotated={true}
                  height={200}
                />
              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} mt={1}>
            <Div className='card' sx={[{ height: { md: 350 }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
              <Typography sx={[DialogHeader, { backgroundColor: 'transparent !important', mb: 1, textAlign: 'center', }]}>Average Daily Calls </Typography>
              <Div>
                <ColumnBarChart
                  height={"90%"}
                  labelShow={true}
                  color={["#4cc9f0"]}
                  barData={datas?.date_call_duration}
                  barType="line"
                  label="Total_Call_Duration"
                  barLength={["Date"]}
                // endOnTick={false}
                />
              </Div>
            </Div>
          </Grid>
        </Grid>
      </Div>

    </JumboContentLayoutMain>
  )
}

export default ActivityIndividualReport
