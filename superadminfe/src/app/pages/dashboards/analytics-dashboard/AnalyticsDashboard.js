import React from "react";
import { Box, CircularProgress, Typography, Grid, Button, Paper } from "@mui/material";
import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { dialogTitle } from "../../widgets/CRMStyles";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Import RTK Query Hooks
import {
  useGetPaymentDashboardAnalyticsQuery,
  useGetRenewalDashboardAnalyticsQuery,
  useGetRenewalFunnelAnalyticsQuery,
  useGetCancellationOverviewAnalyticsQuery,
  useGetPlanAdoptionDashboardAnalyticsQuery,
  useGetTopPlansDistributionAnalyticsQuery,
  useGetRevenueForecastDashboardQuery,
  useGetRequestOperationsDashboardQuery,
} from "app/services/superadmindashboardAPI/superAdminApi";

// Import Components
import PaymentHighlights from "./components/PaymentHighlights";
import RevenueForecastChart from "./components/RevenueForecastChart";
import TopPlansChart from "./components/TopPlansChart";
import RequestDistributionChart from "./components/RequestDistributionChart";
import RenewalFunnelVisual from "./components/RenewalFunnelVisual";
import PlanAdoptionDetails from "./components/PlanAdoptionDetails";
import "./AnalyticsDashboard.css";

const AnalyticsDashboard = () => {
  // Queries
  const {
    data: paymentData,
    isLoading: loadingPayment,
    isError: errorPayment,
    refetch: refetchPayment,
  } = useGetPaymentDashboardAnalyticsQuery();

  const {
    data: renewalData,
    isLoading: loadingRenewal,
    isError: errorRenewal,
    refetch: refetchRenewal,
  } = useGetRenewalDashboardAnalyticsQuery();

  const {
    data: funnelData,
    isLoading: loadingFunnel,
    isError: errorFunnel,
    refetch: refetchFunnel,
  } = useGetRenewalFunnelAnalyticsQuery();

  const {
    data: cancellationData,
    isLoading: loadingCancellation,
    isError: errorCancellation,
    refetch: refetchCancellation,
  } = useGetCancellationOverviewAnalyticsQuery();

  const {
    data: adoptionData,
    isLoading: loadingAdoption,
    isError: errorAdoption,
    refetch: refetchAdoption,
  } = useGetPlanAdoptionDashboardAnalyticsQuery();

  const {
    data: plansData,
    isLoading: loadingPlans,
    isError: errorPlans,
    refetch: refetchPlans,
  } = useGetTopPlansDistributionAnalyticsQuery();

  const {
    data: revenueData,
    isLoading: loadingRevenue,
    isError: errorRevenue,
    refetch: refetchRevenue,
  } = useGetRevenueForecastDashboardQuery();

  const {
    data: requestData,
    isLoading: loadingRequest,
    isError: errorRequest,
    refetch: refetchRequest,
  } = useGetRequestOperationsDashboardQuery();

  const isLoading =
    loadingPayment ||
    loadingRenewal ||
    loadingFunnel ||
    loadingCancellation ||
    loadingAdoption ||
    loadingPlans ||
    loadingRevenue ||
    loadingRequest;

  const isError =
    errorPayment ||
    errorRenewal ||
    errorFunnel ||
    errorCancellation ||
    errorAdoption ||
    errorPlans ||
    errorRevenue ||
    errorRequest;

  const handleRefetchAll = () => {
    refetchPayment();
    refetchRenewal();
    refetchFunnel();
    refetchCancellation();
    refetchAdoption();
    refetchPlans();
    refetchRevenue();
    refetchRequest();
  };

  return (
    <JumboContentLayoutMain>
      <Div className="analytics-container">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography className="analytics-title" sx={[dialogTitle, { fontSize: "22px !important", color: "#333", fontWeight: "700 !important", m: 0 }]}>
            Analytics & Reports Overview
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleRefetchAll}
            sx={{
              borderColor: "#147659",
              color: "#147659",
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#147659",
                backgroundColor: "rgba(20, 118, 89, 0.04)",
              },
            }}
          >
            Refresh All
          </Button>
        </Box>

        {/* Top Stat Highlights */}
        <PaymentHighlights
          data={paymentData?.data}
          isLoading={loadingPayment}
          isError={errorPayment}
          onRefetch={refetchPayment}
        />

        <Grid container spacing={3} mt={1}>
          {/* Revenue Trends */}
          <Grid item xs={12} lg={7}>
            <RevenueForecastChart
              data={revenueData?.data}
              isLoading={loadingRevenue}
              isError={errorRevenue}
              onRefetch={refetchRevenue}
            />
          </Grid>

          {/* Plan Adoption, Renewals, & Cancellations Details */}
          <Grid item xs={12} lg={5}>
            <PlanAdoptionDetails
              adoptionData={adoptionData?.data}
              adoptionLoading={loadingAdoption}
              adoptionError={errorAdoption}
              adoptionRefetch={refetchAdoption}
              renewalData={renewalData?.data}
              renewalLoading={loadingRenewal}
              renewalError={errorRenewal}
              renewalRefetch={refetchRenewal}
              cancellationData={cancellationData?.data}
              cancellationLoading={loadingCancellation}
              cancellationError={errorCancellation}
              cancellationRefetch={refetchCancellation}
            />
          </Grid>

          {/* Request Operations */}
          <Grid item xs={12} md={6}>
            <RequestDistributionChart
              data={requestData?.data}
              isLoading={loadingRequest}
              isError={errorRequest}
              onRefetch={refetchRequest}
            />
          </Grid>

          {/* Top Plans Chart */}
          <Grid item xs={12} md={6}>
            <TopPlansChart
              data={plansData?.data}
              isLoading={loadingPlans}
              isError={errorPlans}
              onRefetch={refetchPlans}
            />
          </Grid>

          {/* Renewal Funnel */}
          <Grid item xs={12} md={6}>
            <RenewalFunnelVisual
              data={funnelData?.data}
              isLoading={loadingFunnel}
              isError={errorFunnel}
              onRefetch={refetchFunnel}
            />
          </Grid>

          {/* Operations Summary Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              className="analytics-card"
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "330px",
                bgcolor: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#147659", mb: 2 }}>
                  System Health & Activity
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mb: 3, lineHeight: 1.6 }}>
                  This dashboard reflects real-time metrics across billing cycles, subscription statuses,
                  plan conversions, and request queues. Ensure all pending cancellation requests and pending
                  instance deployments are processed timely to maintain high customer satisfaction.
                </Typography>
              </Box>

              <Box sx={{ borderTop: "1px solid #f0f0f0", pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#96a0b5", fontWeight: 600 }}>
                      TOTAL SYSTEM REQUESTS
                    </Typography>
                    {loadingRequest ? (
                      <Box sx={{ display: "flex", mt: 0.5 }}><CircularProgress size={16} sx={{ color: "#666" }} /></Box>
                    ) : (
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333", mt: 0.5 }}>
                        {requestData?.data?.total_requests || 0}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: "#96a0b5", fontWeight: 600 }}>
                      ACTIVE SUBSCRIPTIONS
                    </Typography>
                    {loadingAdoption ? (
                      <Box sx={{ display: "flex", mt: 0.5 }}><CircularProgress size={16} sx={{ color: "#147659" }} /></Box>
                    ) : (
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#147659", mt: 0.5 }}>
                        {adoptionData?.data?.total_active_subscriptions || 0}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Div>
    </JumboContentLayoutMain>
  );
};

export default AnalyticsDashboard;
