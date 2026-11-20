import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import MovingRoundedIcon from '@mui/icons-material/MovingRounded';
import { Card, CardHeader, Box, Stack, Typography } from '@mui/material';
// components
import useChart from "../useChart";

// ----------------------------------------------------------------------

RevenuAnalytics.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function RevenuAnalytics({ title, subheader, chartLabels, chartData, ...other }) {
  const chartOptions = useChart({
    plotOptions: { bar: { columnWidth: "30%" } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: "string" },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)} Pv`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart
          type="line"
          series={chartData}
          options={chartOptions}
          height={364}
        />
      </Box>
      <Stack direction={"row"} spacing={3} m={2}>
        <Card
          sx={{
            mb: 3,
            boxShadow: 4,
            height: "125px",
            width: "200px",
            borderRadius: "10px",
          }}
        >
          <Stack
            sx={{ padding: "14px 0px", marginLeft: "20px" }}
            justifyContent={"center"}
          >
            <Typography variant="h1"> ₹ 120</Typography>
            <Typography variant="h3"> This Day</Typography>
            <Typography sx={{ color: "primary.main" }}>
              <MovingRoundedIcon /> 1.5%
            </Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            mb: 3,
            boxShadow: 4,
            height: "125px",
            width: "200px",
            borderRadius: "10px",
          }}
        >
          <Stack
            sx={{ padding: "14px 0px", marginLeft: "20px" }}
            justifyContent={"center"}
          >
            <Typography variant="h1"> ₹ 120</Typography>
            <Typography variant="h3"> This Week</Typography>
            <Typography sx={{ color: "primary.main" }}>
              <MovingRoundedIcon /> 1.5%
            </Typography>
          </Stack>
        </Card>
        <Card
          sx={{
            mb: 3,
            boxShadow: 4,
            height: "125px",
            width: "200px",
            borderRadius: "10px",
          }}
        >
          <Stack
            sx={{ padding: "14px 0px", marginLeft: "20px" }}
            justifyContent={"center"}
          >
            <Typography variant="h1"> ₹ 120</Typography>
            <Typography variant="h3"> This Month</Typography>
            <Typography sx={{ color: "primary.main" }}>
              <MovingRoundedIcon /> 1.5%
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
