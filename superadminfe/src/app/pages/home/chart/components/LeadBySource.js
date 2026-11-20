import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import numeral from 'numeral';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// utils
// components
import useChart from "../useChart";

// ----------------------------------------------------------------------

function fNumber(number) {
    return numeral(number).format();
  }
    

LeadBySource.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function LeadBySource({ title, subheader, chartData, ...other }) {
  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: "35%", borderRadius: 2 },
    },
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      {/* <CardHeader title={title} subheader={subheader} /> */}
      <Box dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={260} />
      </Box>
    </Card>
  );
}
