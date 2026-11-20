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
import {
  loadingfullpage,
  setLoadingFullPageFunc,
} from "app/redux/auth/Loadingskeleton";
import { AutoHeight } from "app/redux/auth/localStorage";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SalesForecastReports() {
  // const loading = useSelector(loadingfullpage);
  const dispatch = useDispatch();

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Account_Name", label: "Product Name", bool: true },
    { sort: "", label: "Period", bool: true },
    { sort: "Contact_Person", label: "Forecasted Revenue", bool: true },
    { sort: "Amount", label: "Actual Revenue", bool: true },

    // { sort: "Deal_Stage", label: "Close Date", bool: true },
    // { sort: "ActualDealAmount", label: "Owner/Assigned To", bool: true },
    // { sort: "Deal_Note", label: "Source", bool: true },
    // { sort: "Customer Name", label: "Customer Name", bool: true },
    
  ]);

  const [datas, setDatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const [getSalesperson_name, setgetSalesperson_name] = useState("")
  const [companyname, setcompanyname] = useState("")
  const [currentDate, setCurrentDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selecteddate, setSelectedDate] = useState(null);
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
  const getData = async () => {
    try {
      await axios
        .get(`${BASE_URL}/user/DealAdditional/?Is_Deleted=False`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("pipeline Report : ", res.data);
          getSalesUsers(res.data?.results);
          dispatch(setLoadingFullPageFunc("success"));
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  const getSalesUsers = async (DealDatas) => {
    try {
      await axios
        .get(
          `${BASE_URL}/user/SalesUsersList/?Is_Deleted=False&id=${localStorage.getItem(
            "UserId"
          )}`,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          //    console.log("pipeline Report : ",res.data);
          let list = [];
          // res.data?.results?.map((result) => {
            DealDatas?.map((result2) => {
              if (
                result2?.Created_Date?.split("T")[0] >= selecteddate?.from &&
                result2?.Created_Date?.split("T")[0] <= selecteddate?.to
              ) {
                // if (result2?.id == result?.Lead_Id?.id) {
                  list.push(result2);
                // }
              } else if (
                !Boolean(selecteddate?.from) ||
                !Boolean(selecteddate?.to)
              ) {
                // if (result2?.id == result?.Lead_Id?.id) {
                  list.push(result2);
                // }
              }
            });
          // });
          // setDatas(list || []);
        });
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    // dispatch(setLoadingFullPageFunc("loading"));
    getData();
  }, []);

  useEffect(() => {
    if (Boolean(selecteddate?.from) && Boolean(selecteddate?.to)) {
      // dispatch(setLoadingFullPageFunc("loading"));
      getData();
    }
  }, [selecteddate]);

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
          <Typography sx={[ComponentHeading, {}]}>
            Sales Forecast Report
          </Typography>
         
        </Div>

        <Div sx={{ mt: 2, mb: { xs: 3, md: 1 } }}>
          <Grid container columnSpacing={2} xs={12}>
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
            </Grid>


            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>


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
                      let stage = data?.Deal_Stage?.split(" ")[1];
                      let color =
                        stage == "Qualifying"
                          ? {
                              color: Colors?.green,
                              bgcolor: Colors?.lightgreen,
                            }
                          : stage == "Enquiry"
                          ? {
                              color: Colors?.indigo,
                              bgcolor: Colors?.lightindigo,
                            }
                          : stage == "Lost"
                          ? { color: Colors?.red, bgcolor: Colors?.lightred }
                          : stage == "Demo"
                          ? {
                              color: Colors?.blue,
                              bgcolor: Colors?.lightBlue,
                            }
                          : stage == "Proposal"
                          ? {
                              color: Colors?.orange,
                              bgcolor: Colors?.lightorange,
                            }
                          : {
                              color: Colors?.purple,
                              bgcolor: Colors?.lightpurple,
                            };
                      let avatar =
                        index > 10
                          ? avatarLightColors[index % 10]
                          : avatarLightColors[index];
                      return (
                        <CRMTableRow>
                          {columnMenuItems[0]?.bool && (
                            <CRMTableCell
                              data-title="Prospect"
                              sx={{ color: Colors?.blue }}
                            >
                              <Div
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <Avatar
                                  sx={[
                                    AvatarFont,
                                    {
                                      bgcolor: avatar,
                                      width: "22px",
                                      height: "22px",
                                      display: {
                                        xs: "none !important",
                                        md: "flex !important",
                                        lg: "flex !important",
                                      },
                                      color: "black",
                                    },
                                  ]}
                                >
                                  {data?.Account_Name.substring(
                                    0,
                                    2
                                  )?.toUpperCase()}
                                  {/* {data?.Name[1]?.toUpperCase()} */}
                                </Avatar>
                                <Typography
                                  color="#0040ff !important"
                                  sx={[
                                    FontStyle,
                                    { color: `${Colors?.blue} !important` },
                                  ]}
                                >
                                  {data?.Account_Name}

                                  {/* <span style={{ color: "#475259" }}>Tech Wire</span> */}
                                </Typography>
                              </Div>
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1]?.bool && (
                            <CRMTableCell data-title="Opportunity">
                              {/* {data?.Created_Date.split("T")[0]} */}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2]?.bool && (
                            <CRMTableCell data-title="Contact Person">
                              {data?.Contact_Person}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3]?.bool && (
                            <CRMTableCell
                              data-title="Deal Value"
                              sx={{ color: Colors?.green }}
                            >
                              {data?.Amount?.toLocaleString() || 0}.00
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4]?.bool && (
                            <CRMTableCell data-title="Status">
                              <Typography
                                sx={[
                                  FontStyle,
                                  {
                                    backgroundColor: `${color?.bgcolor} !important`,
                                    color: color?.color,
                                    borderRadius: "15px",
                                    py: 0.4,
                                    px: 0.8,
                                    display: "inline-flex",
                                  },
                                ]}
                              >
                                {data?.Deal_Stage?.split("Deals")[1]}
                              </Typography>
                            </CRMTableCell>
                          )}
                          {columnMenuItems[5]?.bool && (
                            <CRMTableCell
                              data-title="Actual Earnings"
                              sx={{ color: Colors?.blue }}
                            >
                              {data?.ActualDealAmount?.toLocaleString() || 0}.00
                            </CRMTableCell>
                          )}
                          {columnMenuItems[6]?.bool && (
                            <CRMTableCell data-title="Comments">
                              {data?.Deal_Note}
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

export default SalesForecastReports;
