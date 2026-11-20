import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, IconButton, CircularProgress, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Rupee } from "../../../widgets/CRMStyles";
import "../AnalyticsDashboard.css";

const PlanAdoptionDetails = ({
  adoptionData,
  adoptionLoading,
  adoptionError,
  adoptionRefetch,
  renewalData,
  renewalLoading,
  renewalError,
  renewalRefetch,
  cancellationData,
  cancellationLoading,
  cancellationError,
  cancellationRefetch,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getActiveTabState = () => {
    switch (activeTab) {
      case 0:
        return {
          loading: adoptionLoading,
          error: adoptionError,
          refetch: adoptionRefetch,
          label: "Adoption",
        };
      case 1:
        return {
          loading: renewalLoading,
          error: renewalError,
          refetch: renewalRefetch,
          label: "Renewals",
        };
      case 2:
        return {
          loading: cancellationLoading,
          error: cancellationError,
          refetch: cancellationRefetch,
          label: "Cancellations",
        };
      default:
        return {};
    }
  };

  const { loading, error, refetch, label } = getActiveTabState();

  return (
    <div className="analytics-card">
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            flexGrow: 1,
            "& .MuiTabs-indicator": {
              backgroundColor: "#147659",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#147659",
              fontWeight: 700,
            },
          }}
        >
          <Tab label="Adoption" sx={{ fontSize: "12px", fontWeight: 600, minWidth: "auto", px: 2 }} />
          <Tab label="Renewals" sx={{ fontSize: "12px", fontWeight: 600, minWidth: "auto", px: 2 }} />
          <Tab label="Cancellations" sx={{ fontSize: "12px", fontWeight: 600, minWidth: "auto", px: 2 }} />
        </Tabs>
        <IconButton size="small" onClick={refetch} disabled={loading} title={`Refresh ${label} data`}>
          <RefreshIcon fontSize="small" />
        </IconButton>
      </Box>

      <div className="analytics-card-body" style={{ minHeight: "330px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, width: "100%" }}>
            <CircularProgress size={30} sx={{ color: "#147659" }} />
            <Typography variant="body2" color="textSecondary">Loading {label} Metrics...</Typography>
          </Box>
        )}

        {error && !loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 5, width: "100%" }}>
            <ErrorOutlineIcon sx={{ color: "#dc3545", fontSize: 40 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>Failed to load {label}</Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={refetch}
              startIcon={<RefreshIcon />}
              sx={{ color: "#dc3545", borderColor: "#dc3545", "&:hover": { bgcolor: "#ffeaea", borderColor: "#dc3545" } }}
            >
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && activeTab === 0 && adoptionData && (
          <Box>
            <div className="detail-item">
              <span className="detail-label">Total Active Subscriptions</span>
              <span className="detail-value highlight-badge" style={{ backgroundColor: "rgba(20, 118, 89, 0.1)", color: "#147659" }}>
                {adoptionData.total_active_subscriptions || 0}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Trial Subscriptions</span>
              <span className="detail-value">{adoptionData.trial_subscriptions || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Active Plans Created</span>
              <span className="detail-value">{adoptionData.active_plans || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Most Subscribed Plan</span>
              <span className="detail-value highlight-badge" style={{ backgroundColor: "rgba(54, 134, 255, 0.1)", color: "#3686ff" }}>
                {adoptionData.most_subscribed_plan || "None"} ({adoptionData.most_subscribed_plan_count || 0})
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Monthly Billing Cycle</span>
              <span className="detail-value">{adoptionData.monthly_subscriptions || 0} Subscriptions</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Yearly Billing Cycle</span>
              <span className="detail-value">{adoptionData.yearly_subscriptions || 0} Subscriptions</span>
            </div>
          </Box>
        )}

        {!loading && !error && activeTab === 1 && renewalData && (
          <Box>
            <div className="detail-item">
              <span className="detail-label">Renewals Completed</span>
              <span className="detail-value highlight-badge" style={{ backgroundColor: "rgba(43, 182, 115, 0.1)", color: "#2bb673" }}>
                {renewalData.renewals_completed || 0}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Renewals Pending This Month</span>
              <span className="detail-value">{renewalData.renewals_this_month || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Auto-Renewal Enrolled</span>
              <span className="detail-value">{renewalData.auto_renewal_enabled || 0} Subscriptions</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Auto-Renewal Percentage</span>
              <span className="detail-value highlight-badge" style={{ backgroundColor: "rgba(124, 71, 247, 0.1)", color: "#7c47f7" }}>
                {renewalData.auto_renewal_percentage || 0}%
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Cancellation Requests Received</span>
              <span className="detail-value" style={{ color: "#ff6b77", fontWeight: 700 }}>
                {renewalData.cancel_requests || 0}
              </span>
            </div>
          </Box>
        )}

        {!loading && !error && activeTab === 2 && cancellationData && (
          <Box>
            <div className="detail-item">
              <span className="detail-label">Total Cancel Requests</span>
              <span className="detail-value highlight-badge" style={{ backgroundColor: "rgba(255, 107, 119, 0.1)", color: "#ff6b77" }}>
                {cancellationData.total_cancel_requests || 0}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pending Cancellations</span>
              <span className="detail-value">{cancellationData.pending_cancellations || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Outstanding Pending Payment</span>
              <span className="detail-value" style={{ color: "#e67c20", fontWeight: 700 }}>
                {Rupee} {cancellationData.total_pending_payment?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Upcoming Expiries (Next 30 Days)</span>
              <span className="detail-value">{cancellationData.upcoming_expiries || 0}</span>
            </div>
          </Box>
        )}

        {!loading && !error &&
          ((activeTab === 0 && !adoptionData) ||
            (activeTab === 1 && !renewalData) ||
            (activeTab === 2 && !cancellationData)) && (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography color="textSecondary">No data available for this section</Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default PlanAdoptionDetails;
