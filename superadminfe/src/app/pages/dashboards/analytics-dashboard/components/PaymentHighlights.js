import React from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import {
  MdAttachMoney,
  MdMoneyOff,
  MdCheckCircle,
  MdError,
  MdAccessTime,
} from "react-icons/md";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Rupee } from "../../../widgets/CRMStyles";
import "../AnalyticsDashboard.css";

const PaymentHighlights = ({ data, isLoading, isError, onRefetch }) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          bgcolor: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
          minHeight: "88px",
        }}
      >
        <CircularProgress size={24} sx={{ color: "#147659" }} />
        <Typography sx={{ ml: 2, fontSize: "13px", fontWeight: 600, color: "#666" }}>
          Loading Payment Highlights...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2.5,
          bgcolor: "#fff5f5",
          border: "1px solid #ffddd9",
          borderRadius: "12px",
          minHeight: "88px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <MdError size={24} color="#dc3545" />
          <Typography sx={{ color: "#c62828", fontSize: "13px", fontWeight: 600 }}>
            Failed to load Payment Highlights.
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={onRefetch}
          startIcon={<RefreshIcon />}
          sx={{
            color: "#dc3545",
            borderColor: "#dc3545",
            "&:hover": { bgcolor: "#ffeaea", borderColor: "#dc3545" },
          }}
          variant="outlined"
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: "TOTAL INVOICED",
      value: `${Rupee} ${data.total_invoiced?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      icon: <MdAttachMoney size={26} color="#147659" />,
      style: { backgroundColor: "rgba(20, 118, 89, 0.12)" },
    },
    {
      label: "OUTSTANDING AMOUNT",
      value: `${Rupee} ${data.outstanding_amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      icon: <MdMoneyOff size={26} color="#e67c20" />,
      style: { backgroundColor: "rgba(230, 124, 32, 0.12)" },
    },
    {
      label: "SUCCESS RATE",
      value: `${data.payment_success_rate || 0}%`,
      icon: <MdCheckCircle size={26} color="#2bb673" />,
      style: { backgroundColor: "rgba(43, 182, 115, 0.12)" },
    },
    {
      label: "FAILED PAYMENTS",
      value: data.failed_payments || 0,
      icon: <MdError size={26} color="#dc3545" />,
      style: { backgroundColor: "rgba(220, 53, 69, 0.12)" },
    },
    {
      label: "AVG PAYMENT DELAY",
      value: `${data.avg_payment_delay_days || 0} Days`,
      icon: <MdAccessTime size={26} color="#7c47f7" />,
      style: { backgroundColor: "rgba(124, 71, 247, 0.12)" },
    },
  ];

  return (
    <div className="analytics-row">
      {metrics.map((item, idx) => (
        <div key={idx} className="analytics-colspan">
          <div className="analytics-card" style={{ height: "auto" }}>
            <div className="analytics-card-body" style={{ padding: "16px 20px" }}>
              <div className="stat-card-inner">
                <div>
                  <Typography className="stat-card-value">{item.value}</Typography>
                  <Typography className="stat-card-label">{item.label}</Typography>
                </div>
                <div className="stat-card-icon-container" style={item.style}>
                  {item.icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentHighlights;
