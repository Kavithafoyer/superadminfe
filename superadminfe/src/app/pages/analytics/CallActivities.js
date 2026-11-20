import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, ComponentHeading, DisplayFlex } from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import CallsSummary from "./CallsSummary";
import CallTargetActivity from "./CallActivities/CallTargetActivity";
import CampaignAnalysis from "./CallActivities/CampaignAnalysis";
import PipelineCultivation from "./CallActivities/PipelineCultivation";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CallActivities() {
  const [selectTab, setSelectTab] = useState("callsummary");
  const [selectSideTab, setSelectSideTab] = useState(null);
  const [selectWeekTab, setSelectWeekTab] = useState([1]);
  const [dates, setDate] = useState({ from: "", to: "" });
  const [selectDial, setSelectDial] = useState(1);
  const [value, setValue] = useState(false);

  const [datas, setDatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const DBName = "crmuseradmin1";
  const getDatas = async (start, end, type) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/AnalysticCallActivities/?type=${ type || selectTab}&Is_Deleted=False&StartDate=${start}&EndDate=${end}&id=${localStorage.getItem(
          "UserId"
        )}`,
        {
          headers: {
            db: DBName,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // console.log("lists23", response.data?.results);
      if (Object.keys(response.data).length > 0) {
        setDatas(response.data || []);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());

    const formattedDate = currentDate.toISOString().split("T")[0];

    getDatas("2000-01-01", formattedDate, selectTab);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());

    const formattedDate = currentDate.toISOString().split("T")[0];

    getDatas("2000-01-01", formattedDate, selectTab);
  }, [selectTab]);

  useEffect(() => {
    // console.log("datess",dates);
    if (Boolean(dates?.from) && Boolean(dates?.to) && Boolean(selectTab)) {

      if(dates?.from <= dates?.to){
      getDatas(dates?.from, dates?.to, selectTab);
      setSelectSideTab(null)
    }
    else{
      toast.error("The From date should be greater than the To date.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
    }
  }, [dates]);

  const valueChanged = useCallback(
    (e, type) => {
      const sevenDaysBefore = new Date(
        Date.now() - (e || 0) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate());

      const formattedDate = currentDate.toISOString().split("T")[0];

      if (e !== value) {
        // Check if the new value is different from the current value
        setValue(e);
        setDate({ from: "", to: "" })
        getDatas(sevenDaysBefore, formattedDate, type);
        console.log(sevenDaysBefore,formattedDate)
      }
    },
    [value]
  );

  // donut chart option
  const [options] = useState({
    chart: {
      width: 380,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
    },

    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  });

  const selectWeek = (no) => {
    let tab = [...selectWeekTab];
    let find = selectWeekTab?.findIndex((t) => t == no);
    if (find != -1) {
      tab = selectWeekTab?.filter((tab, i) => tab != no);
    } else {
      tab.push(no);
    }
    setSelectWeekTab(tab);
  };

  return (
    <JumboContentLayoutMain>
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={2} mt={1}>
          <Div
            className="card"
            sx={[
              {
                height: "100%",
                p: 2,
                px: { xs: 1, md: 4 },
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            {/* <FormControl sx={{
                            "& fieldset": {
                                borderRadius: "5px",
                            },
                            mt: { md: "30%" }
                        }}>
                            <Autocomplete
                                // {...register('bookingType',)}
                                className="search-select"
                                sx={{ width: '88%' }}
                                autocomplete="off"
                                options={[{ label: "30 Users Selected" }]}
                                getOptionLabel={(option) => {
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    if (option && option?.label) {
                                        return option?.label;
                                    }

                                }}
                                value={selectUser}
                                onChange={(e, newValue) => {
                                    setSelectUsers(newValue?.label)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Select Users"
                                    />
                                )}
                            />
                        </FormControl> */}

            <Div
              sx={[DisplayFlex, { justifyContent: "center !important", mt: 1 }]}
            >
              <Div>
                <Div
                  sx={[
                    DisplayFlex,
                    {
                      display: { md: "block !important" },
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <Button
                    onClick={(e) => {
                      setSelectSideTab(1);
                      valueChanged(7);
                    }}
                    sx={{
                      py: 1,
                      my: 0.5,
                      fontSize: "11px",
                      width: "88%",
                      bgcolor: Boolean(selectSideTab == 1)
                        ? Colors?.lightSkyBlue
                        : alpha("#e9ecef", 0.8),
                      color: "black",
                      ":hover": {
                        bgcolor: Boolean(selectSideTab == 1)
                          ? Colors?.lightSkyBlue
                          : alpha("#e9ecef", 0.6),
                      },
                    }}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectSideTab(2);
                      valueChanged(30);
                    }}
                    sx={{
                      py: 1,
                      my: 0.5,
                      fontSize: "11px",
                      width: "88%",
                      bgcolor: Boolean(selectSideTab == 2)
                        ? Colors?.lightSkyBlue
                        : alpha("#e9ecef", 0.8),
                      color: "black",
                      ":hover": {
                        bgcolor: Boolean(selectSideTab == 2)
                          ? Colors?.lightSkyBlue
                          : alpha("#e9ecef", 0.6),
                      },
                    }}
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectSideTab(3);
                      valueChanged(90);
                    }}
                    sx={{
                      py: 1,
                      my: 0.5,
                      fontSize: "11px",
                      width: "88%",
                      bgcolor: Boolean(selectSideTab == 3)
                        ? Colors?.lightSkyBlue
                        : alpha("#e9ecef", 0.8),
                      color: "black",
                      ":hover": {
                        bgcolor: Boolean(selectSideTab == 3)
                          ? Colors?.lightSkyBlue
                          : alpha("#e9ecef", 0.6),
                      },
                    }}
                  >
                    Last 90 Days
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectSideTab(4);
                      valueChanged(365);
                    }}
                    sx={{
                      py: 1,
                      my: 0.5,
                      fontSize: "11px",
                      width: "88%",
                      bgcolor: Boolean(selectSideTab == 4)
                        ? Colors?.lightSkyBlue
                        : alpha("#e9ecef", 0.8),
                      color: "black",
                      ":hover": {
                        bgcolor: Boolean(selectSideTab == 4)
                          ? Colors?.lightSkyBlue
                          : alpha("#e9ecef", 0.6),
                      },
                    }}
                  >
                    Last 365 Days
                  </Button>
                </Div>
                <Div sx={[DisplayFlex, { flexWrap: "wrap", mt: 2 }]}>
                  <Div sx={{ my: 1 }}>
                    <Typography sx={{ mb: 0.5 }}>From</Typography>
                    <TextField
                      id="time"
                      type="date"
                      sx={{ width: "100% !important" }}
                      className="search-select"
                      value={dates?.from}
                      onChange={(e) =>
                        setDate({ ...dates, from: e.target.value })
                      }
                    />
                  </Div>
                  <Div sx={{ my: 1 }}>
                    <Typography sx={{ mb: 0.5 }}>To</Typography>
                    <TextField
                      id="time"
                      type="date"
                      sx={{ width: "100% !important" }}
                      className="search-select"
                      value={dates?.to}
                      onChange={(e) =>
                        setDate({ ...dates, to: e.target.value })
                      }
                    />
                  </Div>
                </Div>

                {/* {Boolean(selectTab == "callsummary") && <Div sx={[DisplayFlex, { display: { md: 'block !important' }, flexWrap: 'wrap', justifyContent: { xs: 'space-between', md: 'center' }, mt: 2 }]}>
                                    <Button onClick={() => selectWeek(1)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 1) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 1) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Saturday</Button>
                                    <Button onClick={() => selectWeek(2)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 2) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 2) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Sunday</Button>
                                    <Button onClick={() => selectWeek(3)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 3) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 3) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Monday</Button>
                                    <Button onClick={() => selectWeek(4)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 4) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 4) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Tuesday</Button>
                                    <Button onClick={() => selectWeek(5)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 5) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 5) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Wednesday</Button>
                                    <Button onClick={() => selectWeek(6)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 6) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 6) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Thursday</Button>
                                    <Button onClick={() => selectWeek(7)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab?.some(no => no == 7) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab?.some(no => no == 7) ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Friday</Button>
                                </Div>} */}

                {Boolean(selectTab == "calltarget") && (
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        display: { md: "block !important" },
                        flexWrap: "wrap",
                        justifyContent: { xs: "space-between", md: "center" },
                        mt: 2,
                      },
                    ]}
                  >
                    {/* <Button onClick={() => setSelectWeekTab2(1)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab2 == 1 ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab2 == 1 ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Weekdays</Button> */}
                    {/* <Button onClick={() => setSelectWeekTab2(2)} sx={{ py: 1, my: 0.5, fontSize: "11px", width: "88%", minWidth: '100px', bgcolor: selectWeekTab2 == 2 ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.4), color: 'black', ':hover': { bgcolor: selectWeekTab2 == 2 ?Colors?.lightSkyBlue : alpha("#e9ecef", 0.8) } }} >Weekend</Button> */}
                    <Button
                      onClick={() => setSelectDial(1)}
                      sx={{
                        py: 1,
                        my: 0.5,
                        mt: 4,
                        fontSize: "11px",
                        width: "88%",
                        minWidth: "100px",
                        bgcolor:
                          selectDial == 1
                            ? Colors?.lightSkyBlue
                            : alpha("#e9ecef", 0.4),
                        color: "black",
                        ":hover": {
                          bgcolor:
                            selectDial == 1
                              ? Colors?.lightSkyBlue
                              : alpha("#e9ecef", 0.8),
                        },
                      }}
                    >
                      Dials
                    </Button>
                    <Button
                      onClick={() => setSelectDial(2)}
                      sx={{
                        py: 1,
                        my: 0.5,
                        fontSize: "11px",
                        width: "88%",
                        minWidth: "100px",
                        bgcolor:
                          selectDial == 2
                            ? Colors?.lightSkyBlue
                            : alpha("#e9ecef", 0.4),
                        color: "black",
                        ":hover": {
                          bgcolor:
                            selectDial == 2
                              ? Colors?.lightSkyBlue
                              : alpha("#e9ecef", 0.8),
                        },
                      }}
                    >
                      Minutes
                    </Button>
                  </Div>
                )}
              </Div>
            </Div>
          </Div>
        </Grid> 

        <Grid container item xs={12} md={10} mt={1}>
          <Grid
            container
            spacing={1.5}
            sx={{ py: 2 }}
            alignItems={"center"}
            item
            xs={12}
          >
            <Grid item xs={12} md={3}>
              <Typography sx={[ComponentHeading]}>
                {Boolean(selectTab == "callsummary") && "Calls Summary"}
                {Boolean(selectTab == "calltarget") && "Call Target Activity"}
                {Boolean(selectTab == "campaigns") && "Campaigns"}
                {Boolean(selectTab == "pipeline") && "Pipeline Cultivation"}
              </Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <Div
                sx={[
                  DisplayFlex,
                  { flexWrap: "wrap", justifyContent: "space-between" },
                ]}
              >
                <Button
                  onClick={() => {
                    setSelectTab("callsummary");
                    setValue(null);
                    setSelectSideTab(null);
                    setDate({ from: "", to: "" })
                  }}
                  sx={{
                    py: 1,
                    fontSize: "11px",
                    width: "140px",
                    bgcolor: Boolean(selectTab == "callsummary")
                      ? "#5d7bd5"
                      : "#fca311",
                    color: "white",
                    ":hover": {
                      bgcolor: Boolean(selectTab == "callsummary")
                        ? "#5d7bd5"
                        : alpha("#fca311", 0.8),
                    },
                  }}
                >
                  Calls Summary
                </Button>
                {/* <Button
                  onClick={() => {
                    setSelectTab("calltarget");
                    setValue(null);
                    setSelectSideTab(null);
                    setDate({ from: "", to: "" })
                  }}
                  sx={{
                    py: 1,
                    fontSize: "11px",
                    width: "140px",
                    bgcolor: Boolean(selectTab == "calltarget")
                      ? "#5d7bd5"
                      : "#fca311",
                    color: "white",
                    ":hover": {
                      bgcolor: Boolean(selectTab == "calltarget")
                        ? "#5d7bd5"
                        : alpha("#fca311", 0.8),
                    },
                  }}
                >
                  Call Target Activity
                </Button>
                <Button
                  onClick={() => {
                    setSelectTab("campaigns");
                    setValue(null);
                    setSelectSideTab(null);
                    setDate({ from: "", to: "" })
                  }}
                  sx={{
                    py: 1,
                    fontSize: "11px",
                    width: "140px",
                    bgcolor: Boolean(selectTab == "campaigns")
                      ? "#5d7bd5"
                      : "#fca311",
                    color: "white",
                    ":hover": {
                      bgcolor: Boolean(selectTab == "campaigns")
                        ? "#5d7bd5"
                        : alpha("#fca311", 0.8),
                    },
                  }}
                >
                  Campaign
                </Button>
                <Button
                  onClick={() => {
                    setSelectTab("pipeline");
                    setValue(null);
                    setSelectSideTab(null);
                    setDate({ from: "", to: "" })
                  }}
                  sx={{
                    py: 1,
                    fontSize: "11px",
                    width: "145px",
                    bgcolor: Boolean(selectTab == "pipeline")
                      ? "#5d7bd5"
                      : "#fca311",
                    color: "white",
                    ":hover": {
                      bgcolor: Boolean(selectTab == "pipeline")
                        ? "#5d7bd5"
                        : alpha("#fca311", 0.8),
                    },
                  }}
                >
                  Pipeline Cultivation
                </Button> */}
              </Div>

            </Grid>
          </Grid>
          {Boolean(selectTab == "callsummary") && (
            <CallsSummary datas={datas} />
          )}
          {Boolean(selectTab == "calltarget") && (
            <CallTargetActivity datas={datas} selectDial={selectDial} />
          )}
          {Boolean(selectTab == "campaigns") && (
            <CampaignAnalysis datas={datas} />
          )}
          {Boolean(selectTab == "pipeline") && (
            <PipelineCultivation datas={datas} />
          )}
        </Grid>
      </Grid>
      <ToastContainer />
    </JumboContentLayoutMain>
  );
}

export default CallActivities;
