import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography, ButtonGroup, Button, Grid, Paper, IconButton, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Rupee } from "../../../widgets/CRMStyles";
import "../AnalyticsDashboard.css";

const formatMonth = (monthStr) => {
  if (!monthStr) return "";
  const parts = monthStr.split("-");
  if (parts.length < 2) return monthStr;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthIndex = parseInt(parts[1], 10) - 1;
  return `${monthNames[monthIndex] || parts[1]} ${parts[0]}`;
};

const RevenueForecastChart = ({ data, isLoading, isError, onRefetch }) => {
  const [viewType, setViewType] = useState("mrr"); // 'mrr' or 'arr'

  const currentMrr = data?.current_mrr || 0;
  const currentArr = data?.current_arr || 0;

  const trendData = viewType === "mrr" ? data?.mrr_trend || [] : data?.arr_trend || [];
  const categories = trendData.map((item) => formatMonth(item.month));
  const seriesData = trendData.map((item) => viewType === "mrr" ? item.mrr : item.arr);

  const chartSeries = [
    {
      name: viewType === "mrr" ? "Monthly Recurring Revenue (MRR)" : "Annual Recurring Revenue (ARR)",
      data: seriesData,
    },
  ];

  const chartOptions = {
    chart: {
      type: "area",
      height: 280,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: [viewType === "mrr" ? "#147659" : "#1c84ee"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: viewType === "mrr" ? "#147659" : "#1c84ee",
            opacity: 0.4,
          },
          {
            offset: 100,
            color: viewType === "mrr" ? "#147659" : "#1c84ee",
            opacity: 0.0,
          },
        ],
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#96a0b5",
          fontSize: "11px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${Rupee}${value >= 100000 ? (value / 100000).toFixed(1) + "L" : value.toLocaleString()}`,
        style: {
          colors: "#96a0b5",
          fontSize: "11px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${Rupee} ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      theme: "light",
    },
  };

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <Typography className="analytics-card-title">Revenue Forecast Trends</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ButtonGroup size="small">
            <Button
              onClick={() => setViewType("mrr")}
              variant={viewType === "mrr" ? "contained" : "outlined"}
              disabled={isLoading || isError}
              sx={{
                backgroundColor: viewType === "mrr" ? "#147659 !important" : "transparent",
                color: viewType === "mrr" ? "#fff !important" : "#666",
                borderColor: "#147659",
                "&:hover": { borderColor: "#147659" },
              }}
            >
              MRR
            </Button>
            <Button
              onClick={() => setViewType("arr")}
              variant={viewType === "arr" ? "contained" : "outlined"}
              disabled={isLoading || isError}
              sx={{
                backgroundColor: viewType === "arr" ? "#1c84ee !important" : "transparent",
                color: viewType === "arr" ? "#fff !important" : "#666",
                borderColor: "#1c84ee",
                "&:hover": { borderColor: "#1c84ee" },
              }}
            >
              ARR
            </Button>
          </ButtonGroup>
          <IconButton size="small" onClick={onRefetch} disabled={isLoading} title="Refresh this card">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Box>
      </div>

      <div className="analytics-card-body" style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, width: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#147659" }} />
            <Typography variant="body2" color="textSecondary">Loading Revenue Forecast...</Typography>
          </Box>
        )}

        {isError && !isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 5, width: "100%" }}>
            <ErrorOutlineIcon sx={{ color: "#dc3545", fontSize: 40 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>Failed to load Revenue Trends</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={onRefetch}
              startIcon={<RefreshIcon />}
              sx={{ color: "#dc3545", borderColor: "#dc3545", "&:hover": { bgcolor: "#ffeaea", borderColor: "#dc3545" } }}
            >
              Retry
            </Button>
          </Box>
        )}

        {!isLoading && !isError && (
          <>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                    bgcolor: "rgba(20, 118, 89, 0.03)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#96a0b5", fontWeight: 600 }}>
                    CURRENT MRR
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#147659", mt: 0.5 }}>
                    {Rupee} {currentMrr.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                    bgcolor: "rgba(28, 132, 238, 0.03)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#96a0b5", fontWeight: 600 }}>
                    CURRENT ARR
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#1c84ee", mt: 0.5 }}>
                    {Rupee} {currentArr.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ minHeight: "280px" }}>
              {categories.length > 0 ? (
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height={280}
                />
              ) : (
                <Box
                  sx={{
                    height: "280px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="textSecondary">No trend data available</Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default RevenueForecastChart;
