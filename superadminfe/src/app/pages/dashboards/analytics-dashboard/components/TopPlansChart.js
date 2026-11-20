import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography, Grid, IconButton, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../AnalyticsDashboard.css";

const TopPlansChart = ({ data, isLoading, isError, onRefetch }) => {
  const labels = data?.labels || [];
  const counts = data?.counts || [];
  const total = counts.reduce((acc, curr) => acc + curr, 0);

  const colors = ["#147659", "#3686ff", "#ffa14e", "#7c47f7", "#ff6b77", "#2bb673", "#31d9ff"];

  const chartSeries = counts;
  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: labels,
    colors: colors.slice(0, labels.length),
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      fontWeight: 500,
      labels: {
        colors: "#333",
      },
      markers: {
        width: 10,
        height: 10,
        radius: 5,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Subscriptions",
              fontSize: "12px",
              fontWeight: 600,
              color: "#96a0b5",
              formatter: () => total,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#333",
              offsetY: 4,
              formatter: (val) => val,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter: (value) => `${value} active`,
      },
    },
  };

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <Typography className="analytics-card-title">Top Subscription Plans</Typography>
        <IconButton size="small" onClick={onRefetch} disabled={isLoading} title="Refresh this card">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="analytics-card-body" style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, width: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#147659" }} />
            <Typography variant="body2" color="textSecondary">Loading Subscription Plans...</Typography>
          </Box>
        )}

        {isError && !isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 5, width: "100%" }}>
            <ErrorOutlineIcon sx={{ color: "#dc3545", fontSize: 40 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>Failed to load Plan Distribution</Typography>
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
          labels.length > 0 ? (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <ReactApexChart
                  options={chartOptions}
                  series={chartSeries}
                  type="donut"
                  height={260}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {labels.map((label, idx) => {
                    const count = counts[idx] || 0;
                    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                    const color = colors[idx % colors.length];

                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1.5,
                          borderRadius: "8px",
                          border: "1px solid #f5f5f5",
                          bgcolor: "#fafafa",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: color,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                            {label}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#666" }}>
                          {count} ({percentage}%)
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography color="textSecondary">No plan data available</Typography>
            </Box>
          ))
        }
      </div>
    </div>
  );
};

export default TopPlansChart;
