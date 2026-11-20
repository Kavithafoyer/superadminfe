import React from "react";
import { Box, Typography, IconButton, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../AnalyticsDashboard.css";

const RenewalFunnelVisual = ({ data, isLoading, isError, onRefetch }) => {
  const due = data?.due_this_month || 0;
  const invoice = data?.invoice_generated || 0;
  const payment = data?.payment_received || 0;
  const failed = data?.failed || 0;

  // Stepped funnel visualization
  const stages = [
    {
      label: "Due This Month",
      value: due,
      width: "100%",
      bgColor: "rgba(20, 118, 89, 0.08)",
      barColor: "rgba(20, 118, 89, 0.45)",
      textColor: "#147659",
    },
    {
      label: "Invoice Generated",
      value: invoice,
      width: "82%",
      bgColor: "rgba(54, 134, 255, 0.08)",
      barColor: "rgba(54, 134, 255, 0.45)",
      textColor: "#3686ff",
    },
    {
      label: "Payment Received",
      value: payment,
      width: "64%",
      bgColor: "rgba(43, 182, 115, 0.08)",
      barColor: "rgba(43, 182, 115, 0.45)",
      textColor: "#2bb673",
    },
    {
      label: "Payment Failed",
      value: failed,
      width: "46%",
      bgColor: "rgba(255, 107, 119, 0.08)",
      barColor: "rgba(255, 107, 119, 0.45)",
      textColor: "#ff6b77",
    },
  ];

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <Typography className="analytics-card-title">Renewal Funnel</Typography>
        <IconButton size="small" onClick={onRefetch} disabled={isLoading} title="Refresh this card">
          <RefreshIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="analytics-card-body" style={{ minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, width: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#147659" }} />
            <Typography variant="body2" color="textSecondary">Loading Renewal Funnel...</Typography>
          </Box>
        )}

        {isError && !isLoading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 5, width: "100%" }}>
            <ErrorOutlineIcon sx={{ color: "#dc3545", fontSize: 40 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>Failed to load Renewal Funnel</Typography>
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
          <div className="funnel-container">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="funnel-stage"
                style={{
                  width: stage.width,
                  backgroundColor: stage.bgColor,
                  margin: "0 auto",
                }}
              >
                <div
                  className="funnel-stage-progress-bar"
                  style={{
                    width: "100%",
                    backgroundColor: stage.barColor,
                  }}
                />
                <Typography className="funnel-stage-label">
                  {stage.label}
                </Typography>
                <Typography
                  className="funnel-stage-value"
                  style={{ color: stage.textColor }}
                >
                  {stage.value}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalFunnelVisual;
