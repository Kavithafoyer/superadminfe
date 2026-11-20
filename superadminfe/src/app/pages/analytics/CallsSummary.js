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
import React, { useCallback, useState } from "react";
import { ComponentHeading, DisplayFlex } from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import ReactApexChart from "react-apexcharts";
import ColumnBarChart from "./Bars/ColumnBarChart";

function CallsSummary({ datas }) {
  const [selectTab, setSelectTab] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [selectWeekTab, setSelectWeekTab] = useState([1]);
  const [series, setSeries] = useState([44, 55, 41, 17, 15]);
  const [selectUser, setSelectUsers] = useState("");
  const [value, setValue] = useState(false);

  const valueChanged = useCallback((e) => {
    setValue(e.value);
  }, []);



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
    <>
      <Grid item xs={12} mt={1.5}>
        <Div
          className="card"
          sx={[
            {
              minHeight: { md: "215px" },
              p: 1,
              boxShadow: "0px 0px 4px lightgray",
              border: "1px solid white",
            },
          ]}
        >
          <Grid container spacing={1.5}>
            <Grid item xs={12} md={8.5}>
              <Div sx={{ m: 1, minHeight: "90" }}>
                <Typography sx={{ mb: 1, fontSize: "11px", fontWeight: 600 }}>
                  FREQUENCY
                </Typography>
                <Div
                  sx={[
                    DisplayFlex,
                    {
                      flexWrap: "wrap",
                      justifyContent: { xs: "space-between", md: "normal" },
                    },
                  ]}
                >
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Frequency?.TotalCalls}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Calls
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Frequency?.TotalInboundCalls}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Inbound Calls
                    </Typography>
                  </Div>
                  <Div sx={{ width: "85px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Frequency?.TotalOutboundCalls}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Outbound Calls
                    </Typography>
                  </Div>
                </Div>
              </Div>

              <Div sx={{ m: 1, mt: 3, minHeight: "90px" }}>
                <Typography sx={{ mb: 1, fontSize: "11px", fontWeight: 600 }}>
                  DURATION
                </Typography>
                <Div
                  sx={[
                    DisplayFlex,
                    {
                      flexWrap: "wrap",
                      justifyContent: { xs: "space-between", md: "normal" },
                    },
                  ]}
                >
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.OutboundTotalMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Outbound Total Minutes
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.InboundTotalMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Inbound Total Minutes
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.OutboundAverageMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Outbound Avg Minutes
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.InboundAverageMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Inbound Avg Minutes
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.OutboundMaxMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Outbound Max Minutes
                    </Typography>
                  </Div>
                  <Div sx={{ width: "80px" }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#5d7bd5",
                        fontSize: "20px",
                      }}
                    >
                      {datas?.CallSummary?.Duration?.InboundMaxMinutes?.toFixed(2) || 0}
                    </Typography>
                    <Typography sx={{ textAlign: "center", fontSize: "11px" }}>
                      Inbound Max Minutes
                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Grid>

            <Grid item xs={12} md={3.5} mt={1}>
              <Div
                sx={[
                  DisplayFlex,
                  { justifyContent: "center", position: "relative !important" },
                ]}
              >
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  width={250}
                />
                <Div sx={{ position: "absolute !important" }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#5d7bd5",
                      fontSize: "20px",
                    }}
                  >
                    72%
                  </Typography>
                </Div>
              </Div>
            </Grid>
          </Grid>
        </Div>
      </Grid>

      <Grid item xs={12} mt={1.5}>
        <Div
          className="card"
          sx={[
            {
              minHeight: { md: "350px" },
              p: 1,
              boxShadow: "0px 0px 4px lightgray",
              border: "1px solid white",
            },
          ]}
        >
          <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
            ACTIVITY SUMMARY
          </Typography>
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6} mt={1.5}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Top Inbound Users(Minutes)
              </Typography>
              <ColumnBarChart
                labelShow={true}
                color={["#f5bd1f"]}
                barData={datas?.Summary?.InboundUserMinutes}
                barType="stackedbar"
                rotated={true}
                height={260}
                label="ReceiverName"
                barLength={["CallDuration"]}
                barWidth={30}
              />
            </Grid> */}

            <Grid item xs={12} md={12} mt={1.5}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "11px",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                Top Outbound Users(Minutes)
              </Typography>
              <ColumnBarChart
                labelShow={true}
                color={["#5d7bd5"]}
                barData={datas?.Summary?.OutboundUserMinutes}
                barType="stackedbar"
                rotated={true}
                height={260}
                width={380}
                label="ReceiverName"
                barLength={["CallDuration"]}
                barWidth={30}
              />
            </Grid>
          </Grid>
        </Div>
      </Grid>

      <Grid item xs={12} mt={1.5}>
        <Div
          className="card"
          sx={[
            {
              minHeight: { md: "350px" },
              p: 1,
              boxShadow: "0px 0px 4px lightgray",
              border: "1px solid white",
            },
          ]}
        >
          <Div
            sx={[
              DisplayFlex,
              { justifyContent: "space-between", flexWrap: "wrap" },
            ]}
          >
            <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
              CALL ACTIVITY
            </Typography>
            <Div
              sx={[
                DisplayFlex,
                { alignItems: "center !important", gap: "10px !important" },
              ]}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                INBOUND
              </Typography>
              <FormControlLabel 
                sx={{ p: 0, m: 0 }}
                control={<Switch onChange={()=>setToggle(!toggle)} defaultChecked color="secondary" />}
              />
              <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                OUTBOUND
              </Typography>
            </Div>
          </Div>

          <ColumnBarChart
            labelShow={false}
            color={["#f5bd1f"]}
            barData={toggle?datas?.CallActivity?.CallActivityInbound : datas?.CallActivity?.CallActivityOutbound}
            height={290}
            barLength={['duration']}
            label="date"
            barWidth={30}
          />
        </Div>
      </Grid>
    </>
  );
}

export default CallsSummary;
