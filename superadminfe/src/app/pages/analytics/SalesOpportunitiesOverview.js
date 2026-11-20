import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Grid,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  input_label,
} from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import ColumnBarChart from "./Bars/ColumnBarChart";
import DataGrid from "devextreme-react/data-grid";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import moment from "moment";
import { useQuery } from "react-query";

function SalesOpportunitiesOverview() {

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
        const response = await axios.post(`${BASE_URL}/user/AnalysticSalesOpportunitiesOverview/`, payload, header)

        console.log("response AnalysticSalesOpportunitiesOverview:", response);
        setDatas(response?.data || []);

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

        <Typography sx={[ComponentHeading, { mb: { xs: 2, md: 5 } }]}>
          Sales Opportunities Overview
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
        <div class="mt-3 grid grid-cols-12 gap-6 mb-3">
          <div class="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="relative zoom-in before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']">
              <div class="box p-5">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-stars" viewBox="0 0 16 16" style={{color:'#CD5C08'}}>
                    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                  </svg>
                  <div class="ml-auto">
                    <div data-placement="top" class="tooltip cursor-pointer flex items-center rounded-full bg-success py-[3px] pl-2 pr-1 text-xs font-medium text-white">33%
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-up" class="lucide lucide-chevron-up stroke-1.5 ml-0.5 h-4 w-4"><path d="m18 15-6-6-6 6"></path></svg>
                    </div>
                  </div>
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">   {datas?.total_deal_count || 0}</div>
                <div class="mt-1 text-base text-slate-500">Total Opportunities</div>
              </div>
            </div>
          </div>
          <div class="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="relative zoom-in before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']">
              <div class="box p-5">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-graph-down-arrow" viewBox="0 0 16 16" style={{color:'#921A40'}}>
                    <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v2.6l-3.613-4.417a.5.5 0 0 0-.74-.037L7.06 8.233 3.404 3.206a.5.5 0 0 0-.808.588l4 5.5a.5.5 0 0 0 .758.06l2.609-2.61L13.445 11H10.5a.5.5 0 0 0-.5.5" />
                  </svg>
                  <div class="ml-auto">
                    <div data-placement="top" class="tooltip cursor-pointer flex items-center rounded-full bg-danger py-[3px] pl-2 pr-1 text-xs font-medium text-white">2%
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-down" class="lucide lucide-chevron-down stroke-1.5 ml-0.5 h-4 w-4"><path d="m6 9 6 6 6-6"></path></svg>
                    </div>
                  </div>
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">
                  {datas?.deal_counts_by_type
                    ? datas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Lost")?.count || 0
                    : 0}
                </div>
                <div class="mt-1 text-base text-slate-500">Lost Opportunities</div>
              </div>
            </div>
          </div>
          <div class="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="relative zoom-in before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']">
              <div class="box p-5">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-graph-up-arrow" viewBox="0 0 16 16" style={{color:'#1A3636'}}>
                    <path fill-rule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5" />
                  </svg>
                  <div class="ml-auto">
                    <div data-placement="top" class="tooltip cursor-pointer flex items-center rounded-full bg-success py-[3px] pl-2 pr-1 text-xs font-medium text-white">12%
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-up" class="lucide lucide-chevron-up stroke-1.5 ml-0.5 h-4 w-4"><path d="m18 15-6-6-6 6"></path></svg>
                    </div>
                  </div>
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">
                  {datas?.deal_counts_by_type
                    ? datas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Won")?.count || 0
                    : 0}
                </div>
                <div class="mt-1 text-base text-slate-500">
                  Won Opportunities
                </div>
              </div>
            </div>
          </div>
          <div class="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="relative zoom-in before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']">
              <div class="box p-5">
                <div class="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-pie-chart-fill" viewBox="0 0 16 16" style={{color:'#0D7C66'}}>
                    <path d="M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778zM8.5.015V7.5h7.485A8 8 0 0 0 8.5.015" />
                  </svg>
                  <div class="ml-auto">
                    <div data-placement="top" class="tooltip cursor-pointer flex items-center rounded-full bg-success py-[3px] pl-2 pr-1 text-xs font-medium text-white">22%
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-up" class="lucide lucide-chevron-up stroke-1.5 ml-0.5 h-4 w-4"><path d="m18 15-6-6-6 6"></path></svg>
                    </div>
                  </div>
                </div>
                <div class="mt-6 text-3xl font-medium leading-8">
                  {datas?.deal_counts_by_type
                    ? datas.deal_counts_by_type.find((obj) => obj?.Deal_Type === "Open")?.count || 0
                    : 0}
                </div>
                <div class="mt-1 text-base text-slate-500">
                  In Progress Opportunities
                </div>
              </div>
            </div>
          </div>
        </div>
        <Grid container spacing={2}>
        

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  height: { md: 500 },
                  p: 1,
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  DialogHeader,
                  {
                    backgroundColor: "transparent !important",
                    mb: 0.5,
                    textAlign: "center",
                  },
                ]}
              >
                Opportunities by Sales Rep
              </Typography>
              <Typography
                sx={[
                  FontStyle,
                  {
                    backgroundColor: "transparent !important",
                    textAlign: "center",
                  },
                ]}
              >
                Count
              </Typography>
              <Div>
                <ColumnBarChart
                  labelShow={true}
                  barData={datas?.deal_counts_by_owner || []}
                  rotated={true}
                  MultipleColumn={true}
                  barWidth={50}
                  valueField="count"
                  label="Deal_Owner"
                />
              </Div>
            </Div>
          </Grid>

          <Grid item xs={12} md={6} mt={1}>
            <Div
              className="card"
              sx={[
                {
                  mb: 2,
                  p: 1,
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
              <Typography
                sx={[
                  DialogHeader,
                  {
                    backgroundColor: "transparent !important",
                    mb: 0.5,
                    textAlign: "center ",
                  },
                ]}
              >
                Count of Opportunities
              </Typography>
              <Typography
                sx={[
                  FontStyle,
                  {
                    backgroundColor: "transparent !important",
                    textAlign: "center ",
                  },
                ]}
              >
                Each Year
              </Typography>
              <Div>
                <ColumnBarChart
                  height={180}
                  labelShow={false}
                  barType="area"
                  color={["#d1105a"]}
                  barData={datas?.deal_counts_by_year}
                  barLength={["count"]}
                  label="year"
                />
              </Div>
            </Div>

            <Div
              className="card"
              sx={[
                {
                  p: 1,
                  boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                },
              ]}
            >
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
                  <Table className="table" stickyHeader sx={{ minWidth: { xs: "auto", sm: 500 } }}>
                    <TableHead sx={[CRMTableHead, FontStyle]}>
                      <CRMTableRow>
                        <CRMTableCell
                          align="left"
                        >
                          Asigned User Name
                        </CRMTableCell>
                        <CRMTableCell
                          align="right"

                        >
                          Amount
                        </CRMTableCell>
                      </CRMTableRow>
                    </TableHead>
                    <TableBody className="table-body" sx={{ mt: 2 }}>
                      {datas &&
                        datas?.deal_amount_by_owner?.map((data, index) => {
                          return (
                            <CRMTableRow >
                              <CRMTableCell data-title="Asigned User Name">
                                {data?.Deal_Owner}
                              </CRMTableCell>
                              <CRMTableCell align="right" data-title="Amount">
                                {(data?.total_amount || 0)?.toLocaleString()}
                              </CRMTableCell>
                            </CRMTableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </JumboScrollbar>

                <Div
                  sx={[
                    DisplayFlex,
                    { justifyContent: "space-between", py: 1, px: 2, backgroundColor: Colors?.lightSkyBlue },
                  ]}
                >
                  <Typography
                    sx={[
                      {
                        fontWeight: 600,
                        textAlign: "center",
                        color: "black",
                        fontSize: "14px",
                        ml: -1,
                      },
                    ]}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={[
                      {
                        fontWeight: 600,
                        color: "black",
                        fontSize: "14px",
                        //   mr: 0.5,
                      },
                    ]}
                  >
                    ₹ {parseFloat(
                      datas?.deal_amount_by_owner?.reduce(
                        (total, item) => total + (item?.total_amount || 0),
                        0
                      )
                    )?.toLocaleString()}
                  </Typography>
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>
      </Div>
    </JumboContentLayoutMain>
  );
}

export default SalesOpportunitiesOverview;
