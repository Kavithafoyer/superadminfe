import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography, Grid, LinearProgress, IconButton, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../AnalyticsDashboard.css";

const RequestDistributionChart = ({ data, isLoading, isError, onRefetch }) => {
  const distribution = data?.request_distribution || [];
  const labels = distribution.map((item) => item.module);
  const counts = distribution.map((item) => item.count);

  const totalRequests = data?.total_requests || 0;
  const invoiceGenerated = data?.invoice_generated_requests || 0;
  const invoicePending = data?.pending_invoice_requests || 0;
  const instanceCreated = data?.instance_created || 0;
  const instancePending = data?.instance_pending || 0;

  const invoiceTotal = invoiceGenerated + invoicePending;
  const invoicePercentage = invoiceTotal > 0 ? Math.round((invoiceGenerated / invoiceTotal) * 100) : 0;

  const instanceTotal = instanceCreated + instancePending;
  const instancePercentage = instanceTotal > 0 ? Math.round((instanceCreated / instanceTotal) * 100) : 0;

  const colors = ["#ffa14e", "#7c47f7", "#3686ff"];

  const chartSeries = counts;
  const chartOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: labels,
    colors: colors,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "11px",
      fontWeight: 500,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Requests",
              fontSize: "12px",
              fontWeight: 600,
              color: "#96a0b5",
              formatter: () => totalRequests,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: "#333",
              offsetY: 3,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} requests`,
      },
    },
  };

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <Typography className="analytics-card-title">Request Operations</Typography>
        <IconButton size="small" onClick={onRefetch} disabled={isLoading} title="Refresh this card">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="analytics-card-body" style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, width: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#147659" }} />
            <Typography variant="body2" color="textSecondary">Loading Request Operations...</Typography>
          </Box>
        )}

        {isError && !isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 5, width: "100%" }}>
            <ErrorOutlineIcon sx={{ color: "#dc3545", fontSize: 40 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>Failed to load Operations</Typography>
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
          distribution.length > 0 ? (
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={260}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                      Invoice Generation Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#147659" }}>
                      {invoiceGenerated} / {invoiceTotal} ({invoicePercentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={invoicePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#147659",
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {invoicePending} Pending Invoices
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                      Instance Provisioning Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#3686ff" }}>
                      {instanceCreated} / {instanceTotal} ({instancePercentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={instancePercentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#3686ff",
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {instancePending} Pending Instances
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography color="textSecondary">No request operations data available</Typography>
          </Box>
        ))
        }
      </div>
    </div>
  );
};

export default RequestDistributionChart;
