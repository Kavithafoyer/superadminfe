/* eslint-disable array-callback-return */
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import {
  AvatarFont,
  Colors,
  ComponentHeading,
  DisplayFlex,
  FontStyle,
  TableHeaderType,
  avatarLightColors,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { LoadingFullPageSkel } from "app/pages/widgets/StylesComponents";
import moment from "moment";
import {
  loadingfullpage,
  setLoadingFullPageFunc,
} from "app/redux/auth/Loadingskeleton";
import { AutoHeight } from "app/redux/auth/localStorage";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";


function SalesPipeLineReport() {
  // const loading = useSelector(loadingfullpage);
  const dispatch = useDispatch();

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Account_Name", label: "Deal Name", bool: true },
    { sort: "", label: "Stage", bool: true },
    { sort: "Contact_Person", label: "Probability", bool: true },
    { sort: "Amount", label: "Amount", bool: true },
    { sort: "Deal_Stage", label: "Close Date", bool: true },
    // { sort: "ActualDealAmount", label: "Assigned To", bool: true },
    { sort: "Deal_Note", label: "Company Name", bool: true },
    { sort: "Deal_Note", label: "Contact Name", bool: true },
    // { sort: "Deal_Note", label: "Last Contacted", bool: true },
    { sort: "Deal_Note", label: "Next Steps", bool: false },
  ]);

  const [datas, setDatas] = useState([]);


  const [stageName, setstageName] = useState("")


  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const [hasMore, setHasMore] = useState(true); // State to track if there are more items to load

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

  const newfilter = async () => {
    try {

      if (
        selectedDate !== "" && selectedDate !== undefined && selectedDate !== null && currentDate !== "" &&

        stageName !== "" && stageName !== undefined && stageName !== null &&
        getSalesperson_name !== "" && getSalesperson_name !== undefined && getSalesperson_name !== null
      ) {


        let payload = {
          Deal_Owner: getSalesperson_name,
          Deal_Stage: stageName,
          Is_Deleted: false,
          fromdate: selectedDate,
          todate: currentDate
        }

        await axios.post(`${BASE_URL}/user/SalesPipelineReport/`, payload,  {
          headers:{
            db:"crmuseradmin1",
            Authorization:`Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss", res.data);


            setDatas(res?.data?.Result)

          })
      }

      if (
        fromDate !== "" && fromDate !== null && fromDate !== undefined &&
        toDate !== "" && toDate !== null && toDate !== undefined &&
        stageName !== "" && stageName !== undefined && stageName !== null &&
        getSalesperson_name !== "" && getSalesperson_name !== undefined && getSalesperson_name !== null
      ) {
        let payload = {
          Deal_Owner: getSalesperson_name,
          Deal_Stage: stageName,
          fromdate: fromDate,
          todate: toDate,
          Is_Deleted: false
        }

        await axios.post(`${BASE_URL}/user/SalesPipelineReport/`, payload, {
          headers:{
            db:"crmuseradmin1",
            Authorization:`Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss1", res.data);


            setDatas(res?.data?.Result)



          }).catch((error) => {
            console.log(error)
          })


      }
    } catch (error) {
      console.log(error);
    }
  }




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

  useEffect(() => {
    const fetchData = async () => {
      await newfilter();
      await newfilter();
    };
    fetchData();
  }, [selectedDate, fromDate, toDate,getSalesperson_name,stageName]);

  return (
    <JumboContentLayoutMain>
      {/* {loading === "loading" && <LoadingFullPageSkel />} */}

      <Div >
        <Div
          sx={[
            DisplayFlex,
            { justifyContent: "space-between", flexWrap: "wrap" },
          ]}
        >
          <Typography id="Typography-root" sx={[ComponentHeading, {}]}>
            Sales Pipeline Report
          </Typography>

        </Div>

        <Div sx={{ mt: 2, mb: { xs: 3, md: 1 } }}>
          <Grid container columnSpacing={2} xs={12}>
            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

              <Grid item className="col-12 col-md-6">
                <Typography className="col-12 input-label">
                  Choose Deal Owner
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
                  renderInput={(params) => <TextField {...params} placeholder="Choose Deal Owner" />}
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
                  value={stageName}
                  onChange={(e, newValue) =>
                    setstageName(newValue?.stage)
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
              autoHeightMin={AutoHeight(1.4)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table stickyHeader>
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
                              data-title="Prospect"                             
                            >
                                  {data?.Deal_Name}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1].bool && (
                            <CRMTableCell data-title="Opportunity">
                              {data?.Deal_Stage}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2].bool && (
                            <CRMTableCell data-title="Contact Person">
                              {data?.Deal_Probablity} %
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3].bool && (
                            <CRMTableCell
                              data-title="Deal Value"                             
                            >
                              {data?.Amount}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4].bool && (
                            <CRMTableCell data-title="Status">
                              
                                
                                {data?.ExpClosing_Date?.slice(0,10)}
                             
                            </CRMTableCell>
                          )}
                          {columnMenuItems[5].bool && (
                            <CRMTableCell
                              data-title="Actual Earnings"                             
                            >
                              {data?.Organization_Id?.Organization_Name}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[6].bool && (
                            <CRMTableCell data-title="Comments">
                              {data?.Contact_Person}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[7].bool && (
                            <CRMTableCell data-title="Comments">
                              {data?.Next_Step}
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
                        colSpan={8}
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

export default SalesPipeLineReport;
