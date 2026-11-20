import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  Colors,
  ComponentHeading,
  DisplayFlex,
  FontStyle,
  TableHeaderType,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { LoadingFullPageSkel } from "app/pages/widgets/StylesComponents";
import {
  loadingfullpage,
  setLoadingFullPageFunc,
} from "app/redux/auth/Loadingskeleton";
import { AutoHeight } from "app/redux/auth/localStorage";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

function SalesActivityReports() {

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";


  const [datas, setDatas] = useState([]);
  const [period, setPeriod] = useState("");
  const dispatch = useDispatch();
  const [monthData, setMonthData] = useState([]);

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Sales_Person", label: "Sales rep name", bool: true },
    { sort: "Lead_Id", label: "Date/Time", bool: true },
    { sort: "Deal_Id", label: "Activity Type", bool: true },
    { sort: "Total_Amount", label: "Prospect Name", bool: false },
    { sort: "Net_Amount", label: "Activity Details", bool: true },
    { sort: "Sales Target", label: "Duration", bool: true },
    { sort: "% of Target Achieved", label: "Result", bool: true },
    { sort: "Pipeline Value", label: "Next Steps", bool: true },
    { sort: "Pipeline Con Rate", label: "Opportunity Created", bool: false },
    { sort: "Pipeline Con Rate", label: "Opportunity Value", bool: false },
    { sort: "Pipeline Con Rate", label: "Lead Source", bool: false },
    { sort: "Pipeline Con Rate", label: "Engagement Level", bool: false },
    { sort: "Pipeline Con Rate", label: "Sales Stage", bool: false }
  ]);

  const [userNameLists, setUserNameLists] = useState([]);

  const [getSalesperson_name, setgetSalesperson_name] = useState("")
  const [companyname, setcompanyname] = useState("")
  const [currentDate, setCurrentDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);

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

  const [Companynames, setCompanynames] = useState([
    { Company_Name: "Foyer Tech" },
    { Company_Name: "TCS" },
    { Company_Name: "Workflow" }
  ])

  const handlePeriodChange = (event, newValue) => {
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

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, {
        headers: {
          db: localStorage.getItem("DBName"),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("Users List", response.data);
      // setUserNameLists(response.data);
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
      setUserNameLists(getTerUserLists);
    }
  }, [getTerUserLists]);


  return (
    <JumboContentLayoutMain>
      {/* {loading === "loading" && 
          <LoadingFullPageSkel />} */}
      <Div >
        <Div
          sx={[
            DisplayFlex,
            { justifyContent: "space-between", flexWrap: "wrap" },
          ]}
        >
          <Typography sx={[ComponentHeading, {}]}>
            Sales Activity Reports
          </Typography>

        </Div>

        <Div sx={{ mt: 2, mb: { xs: 3, md: 1 } }}>
          <Grid container columnSpacing={2} xs={12}>
            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

              <Grid item className="col-12 col-md-6">
                <Typography className="col-12 input-label">
                  Choose Sales Representative
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
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Choose Sales Representative" />}
                />
              </Grid>

              <Grid item className="col-12 col-md-6">
                <Typography className="col-12 input-label">
                  Choose a Stage
                </Typography>
                <Autocomplete
                  className="col-12 search-select"
                  options={[
                    { stage: "Deals Enquiry Stage" },
                    { stage: "Deals Qualifying Stage" },
                    { stage: "Deals Proposal Stage" },
                    { stage: "Deals Demo Stage" },
                    { stage: "Deals Negotiation Stage" },
                    { stage: "Deals Lost Stage" },
                  ]}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.stage) {
                      return option?.stage;
                    }
                    return "";
                  }}
                  value={companyname}
                  onChange={(e, newValue) =>
                    setcompanyname(newValue?.stage)
                  }
                  renderInput={(params) => <TextField {...params} placeholder="Choose a Stage" />}
                />
              </Grid>

            </Grid>


            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

              <Grid item className="col-12 col-md-6">
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

              <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                <Typography className="col-6 input-label">
                  From<span className="required">*</span>
                </Typography>
                <TextField
                  type={"date"}
                  className="col-12 search-select"
                // value={fromDate}
                // onChange={(e) => setfromDate(e.target.value)}
                />
              </Grid>

              <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                <Typography className="col-6 input-label">
                  To
                </Typography>
                <TextField
                  type={"date"}
                  className="col-12 search-select"
                // value={toDate}
                // onChange={(e) => settoDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Div>

        <div style={{ margin: "1rem 0rem" }}>
          <TableContainer>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={AutoHeight(2)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  setDatas={setDatas}
                  sortDatas={datas}
                  transformText={TableHeaderType}
                />

                <TableBody>
                  {datas.length > 0 ? (
                    datas?.map((data, index) => {
                      return (
                        <CRMTableRow>
                          {columnMenuItems[0].bool && (
                            <CRMTableCell
                              data-title="Sales rep name"
                              sx={{ color: Colors?.blue }}
                            >
                              {data?.Sales_Person}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1].bool && (
                            <CRMTableCell data-title="No of Leads">
                              {/* {data?.Created_Date.split("T")[0]} */}
                              {data?.Lead_Id?.length}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2].bool && (
                            <CRMTableCell data-title="No of Opportunities">
                              {data?.Deal_Id.length}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3].bool && (
                            <CRMTableCell
                              data-title="Deal Value"
                              sx={{ color: Colors?.green }}
                            >
                              {data?.ActualDealAmount?.toLocaleString() || 0}.00
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4].bool && (
                            <CRMTableCell data-title="Sales">
                              {data?.Net_Amount?.toLocaleString() || 0}.00
                            </CRMTableCell>
                          )}
                          {columnMenuItems[5].bool && (
                            <CRMTableCell
                              data-title="Pipeline"
                              sx={{ color: Colors?.blue }}
                            >
                              {data?.PipelineValue?.toLocaleString() || 0}.00
                            </CRMTableCell>
                          )}
                        </CRMTableRow>
                      );
                    })
                  ) : (
                    <CRMTableRow>
                      <CRMTableCell
                        align="center"
                        sx={{ color: Colors?.blue }}
                        colSpan={columnMenuItems?.length + 1}
                      >
                        No Records
                      </CRMTableCell>
                    </CRMTableRow>
                  )}
                </TableBody>
              </Table>
            </JumboScrollbar>
          </TableContainer>
        </div>
      </Div>
    </JumboContentLayoutMain>
  );
}

export default SalesActivityReports;
