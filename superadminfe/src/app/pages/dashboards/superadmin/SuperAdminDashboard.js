import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  useGetSubscriptionAnalyticsQuery,
  useGetSubscriptionInsightsQuery,
  useGetUsageAnalyticsQuery,
  useGetInstanceAnalyticsQuery,
} from "app/services/superadmindashboardAPI/superAdminApi";
import { dialogTitle } from "../../widgets/CRMStyles";
import SubscriptionAnalytics from "./SubscriptionAnalytics";
import SubscriptionInsights from "./SubscriptionInsights";
import SubscriptionGrowthChart from "./SubscriptionGrowthChart";
import UsageAnalytics from "./UsageAnalytics";
import InstanceAnalytics from "./InstanceAnalytics";
import "./SubscriptionAnalytics.css"; // We'll need the home-row styles

const SuperAdminDashboard = () => {
  const { data: subAnalytics, isLoading: isLoadingSub, isError: isErrorSub, refetch: refetchSub } = useGetSubscriptionAnalyticsQuery();
  const { data: subInsights, isLoading: isLoadingInsights, isError: isErrorInsights, refetch: refetchInsights } = useGetSubscriptionInsightsQuery();
  const { data: usageAnalytics, isLoading: isLoadingUsage, isError: isErrorUsage, refetch: refetchUsage } = useGetUsageAnalyticsQuery();
  const { data: instanceAnalytics, isLoading: isLoadingInstance, isError: isErrorInstance, refetch: refetchInstance } = useGetInstanceAnalyticsQuery();

  const loading = isLoadingSub || isLoadingInsights || isLoadingUsage || isLoadingInstance;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <JumboContentLayoutMain>
      <Div>
        <Div>
          <Typography id="Typography-root" sx={[dialogTitle, { mb: 2 }]}>
            SuperAdmin Overview
          </Typography>
          <SubscriptionAnalytics data={subAnalytics} isError={isErrorSub} onRetry={refetchSub} />
        </Div>



        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Subscription Insights
              </Typography>
              <SubscriptionInsights data={subInsights} isError={isErrorInsights} onRetry={refetchInsights} />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Usage Analytics
              </Typography>
              <UsageAnalytics data={usageAnalytics} isError={isErrorUsage} onRetry={refetchUsage} />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Subscription Growth
              </Typography>
              <SubscriptionGrowthChart data={subAnalytics} isError={isErrorSub} onRetry={refetchSub} />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Instance Analytics
              </Typography>
              <InstanceAnalytics data={instanceAnalytics} isError={isErrorInstance} onRetry={refetchInstance} />
            </Div>
          </Grid>

          {/* Additional Grid items can be added here following the Home.js pattern */}
        </Grid>
      </Div>
    </JumboContentLayoutMain>
  );
};

export default SuperAdminDashboard;
