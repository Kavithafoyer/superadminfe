import React, { useEffect, useState } from "react";
import { Divider, Grid, Typography, alpha } from "@mui/material";
import { ComponentHeading, DisplayFlex } from "../widgets/CRMStyles";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import ReactSpeedometer from "react-d3-speedometer";
import ColumnBarChart from "./Bars/ColumnBarChart";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { AutoHeight } from "app/redux/auth/localStorage";

function ChurnAnalysisDashboard() {
  const [cpuUsage, setcpuUsage] = useState(10);
  const [datas, setDatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const DBName = "crmuseradmin1";
  const getDatas = async () => {
    try {
      const formattedDate = (new Date())
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");

        let dummyDate = '03-09-2024'

      const response = await axios.get(
        `${BASE_URL}/user/AnalysticSalesKPIAndChurnDashboard/?id=${localStorage.getItem(
          "UserId"
        )}&date=${dummyDate}`,
        {
          headers: {
            db: DBName,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("lists23", response.data?.results);

      setDatas(response.data?.results || []);
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const dataSource = [
    { Churn: 230, "Total Customers": 130, label: "01/2024" },
    { Churn: 210, "Total Customers": 110, label: "02/2024" },
    { Churn: 202, "Total Customers": 102, label: "03/2024" },
    { Churn: 256, "Total Customers": 156, label: "04/2024" },
    { Churn: 228, "Total Customers": 128, label: "05/2024" },
    { Churn: 230, "Total Customers": 130, label: "06/2024" },
    { Churn: 210, "Total Customers": 110, label: "07/2024" },
    { Churn: 202, "Total Customers": 102, label: "08/2024" },
    { Churn: 256, "Total Customers": 156, label: "09/2024" },
    { Churn: 228, "Total Customers": 128, label: "10/2024" },
    { Churn: 228, "Total Customers": 128, label: "11/2024" },
    { Churn: 228, "Total Customers": 128, label: "12/2024" },
  ];
  const dataSource2 = [
    { Gain: 230, Loss: -130, label: "01/2024" },
    { Gain: 210, Loss: -110, label: "02/2024" },
    { Gain: 202, Loss: -102, label: "03/2024" },
    { Gain: 256, Loss: -156, label: "04/2024" },
    { Gain: 228, Loss: -128, label: "05/2024" },
    { Gain: 230, Loss: -130, label: "06/2024" },
    { Gain: 210, Loss: -110, label: "07/2024" },
    { Gain: 202, Loss: -102, label: "08/2024" },
    { Gain: 256, Loss: -156, label: "09/2024" },
    { Gain: 228, Loss: -128, label: "10/2024" },
    { Gain: 228, Loss: -128, label: "11/2024" },
    { Gain: 228, Loss: -128, label: "12/2024" },
  ];

  return (
    <JumboContentLayoutMain>
      <Typography sx={[ComponentHeading, { mb: 2 }]}>
        Churn Analysis Dashboard wit Customer Gain and Lose Details
      </Typography>

      <Grid container spacing={2}>
         <Grid item gap={1} xs={12} md={6}>
          <Div
            className="card"
            sx={[
              {
                p: { xs: 0, md: 2 },
                px: { xs: 0, md: 4 },
                height: "260px",
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                mb: 2,
                boxShadow: "0px 1px 1px lightgray",
              }}
            >
              Current Month to Date
            </Typography>
            <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
              <Div>
                <Typography sx={{ fontSize: "14px", mb: 2 }}>
                  Net Customer Gained This Month
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    mb: 2,
                    color: "white",
                    bgcolor: "red",
                    textAlign: "center",
                    p: 1,
                  }}
                >
                  {(datas?.TotalGainedCustomers - (datas?.TotalLostCustomers || 0)) || 0 }
                </Typography>
              </Div>
            </Div>
            <Div
              sx={[DisplayFlex, { justifyContent: "space-between", gap: 3 }]}
            >
              <Div
                className="card"
                sx={[
                  {
                    p: { xs: 0, md: 2 },
                    boxShadow: "0px 0px 4px lightgray",
                    border: "1px solid white",
                  },
                ]}
              >
                <Div
                  sx={[
                    {
                      display: { xs: "block", md: "flex" },
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",
                    },
                  ]}
                >
                  <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                    <img
                      src={require("../../assets/images/progress.png")}
                      width={35}
                      height={35}
                      alt="img"
                    />
                  </Div>
                  <Div sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        mb: { xs: 0, md: 1 },
                        fontWeight: 600,
                      }}
                    >
                      {datas?.TotalGainedCustomers || 0}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                      Customers Gained
                    </Typography>
                  </Div>
                </Div>
              </Div>
              <Div
                className="card"
                sx={[
                  {
                    p: { xs: 0, md: 2 },
                    boxShadow: "0px 0px 4px lightgray",
                    border: "1px solid white",
                  },
                ]}
              >
                <Div
                  sx={[
                    {
                      display: { xs: "block", md: "flex" },
                      alignItems: "center",
                      flexWrap: "wrap",
                      justifyContent: "space-evenly",
                    },
                  ]}
                >
                  <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                    <img
                      src={require("../../assets/images/arrow.png")}
                      width={40}
                      height={40}
                      alt="img"
                    />
                  </Div>
                  <Div sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        mb: { xs: 0, md: 1 },
                        fontWeight: 600,
                      }}
                    >
                      {datas?.TotalLostCustomers || 0}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", textAlign: "center" }}>
                      Customers Lost
                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Div>
          </Div>
        </Grid>

       <Grid item gap={1} xs={12} md={6}>
          <Div
            className="card"
            sx={[
              {
                p: { xs: 0, md: 2 },
                px: { xs: 0, md: 4 },
                height: "260px",
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                mb: 2,
                boxShadow: "0px 1px 1px lightgray",
              }}
            >
              Current Month to Date
            </Typography>
            <Div
              sx={[
                DisplayFlex,
                {
                  flexWrap: "wrap",
                  alignItems: "center !important",
                  justifyContent: "space-around",
                },
              ]}
            >
              <Div>
                <Typography
                  sx={{
                    fontSize: "18px",
                    mb: { xs: 0, md: 1 },
                    fontWeight: 600,
                  }}
                >
                  Churn
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12px",
                    textAlign: "center",
                    fontWeight: 300,
                  }}
                >
                  Past Month Churn{" "}
                  <span style={{ fontSize: "14px", fontWeight: 600 }}>
                  {`${datas?.TotalLostCustomers>datas?.TotalGainedCustomers?'-':''} ${((datas?.TotalLostCustomers / (datas?.TotalGainedCustomers || 1))* 100 ) || '0'}%`}
                    
                  </span>
                </Typography>
              </Div>
              <Div sx={{ mt: 2 }}>
                <ReactSpeedometer
                  // height={179}
                  width={250}
                  maxValue={100}
                  customSegmentLabels={false}
                  value={(datas?.TotalLostCustomers / (datas?.TotalGainedCustomers || 1))* 100 || 0}
                  // valueFormat={"d"}
                  // customSegmentStops={[0, 25, 50, 75, 100]}
                  segmentColors={["#a3be8c", "#ebcb8b", "#d08770", "#bf616a"]}
                  currentValueText={ `${datas?.TotalLostCustomers>datas?.TotalGainedCustomers ? '-':''} ${((datas?.TotalLostCustomers / (datas?.TotalGainedCustomers || 1))* 100 ) || '0'}%`}
                  textColor={"black"}
                />
              </Div>
            </Div>
          </Div>
        </Grid>

        <Grid item gap={1} xs={12} md={6}>
          <Div
            className="card"
            sx={[
              {
                height: '100%',
                p: { xs: 0, md: 2 },
                px: { xs: 0, md: 4 },
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                mb: 2,
                boxShadow: "0px 1px 1px lightgray",
              }}
            >
              By Month / By Quarter
            </Typography>
            <Div sx={[DisplayFlex, { justifyContent: "center", my: 1 }]}>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                  mr: 3,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "3px",
                    backgroundColor: "#8ecae6",
                    position: "absolute",
                    left: -15,
                    top: "40%",
                  }}
                />{" "}
                Total Customer
              </Typography>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "3px",
                    backgroundColor: "#ffb703",
                    position: "absolute",
                    left: -15,
                    top: "40%",
                  }}
                />{" "}
                Churn
              </Typography>
            </Div>
            <Div>
              <ColumnBarChart
                labelShow={false}
                barType="line"
                label="Date"
                color={["#8ecae6", "#ffb703"]}
                barData={datas?.MonthWiseCustomers}
                barLength={["TotalLostCustomers","TotalGainedCustomers",]}
                customLegendName={["Churn",'Total Customer']}
                height={AutoHeight(2.9)}
              />
            </Div>
          </Div>
        </Grid>

        <Grid item gap={1} xs={12} md={6}>
          <Div
            className="card"
            sx={[
              {
                height: '100%',
                p: { xs: 0, md: 2 },
                px: { xs: 0, md: 4 },
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                mb: 2,
                boxShadow: "0px 1px 1px lightgray",
              }}
            >
              Net Customer Gain/Loss Trend
            </Typography>

            <Div sx={[DisplayFlex, { justifyContent: "center", my: 1 }]}>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                  mr: 3,
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "3px",
                    backgroundColor: "#ff758f",
                    position: "absolute",
                    left: -15,
                    top: "40%",
                  }}
                />{" "}
                Loss
              </Typography>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "3px",
                    backgroundColor: "#00c49a",
                    position: "absolute",
                    left: -15,
                    top: "40%",
                  }}
                />{" "}
                Gain
              </Typography>
            </Div>
            <Div>
              <ColumnBarChart
                labelShow={false}
                barType="stackedbar"
                label="Date"
                color={["#ff758f", "#00c49a"]}
                barData={datas?.MonthWiseCustomers}
                barLength={["TotalLostCustomers","TotalGainedCustomers",]}
                customLegendName={["Churn",'Total Customer']}
                height={AutoHeight(2.9)}
                barWidth={15}
              />
            </Div>
          </Div>
        </Grid>
      </Grid>
    </JumboContentLayoutMain>
  );
}

export default ChurnAnalysisDashboard;
