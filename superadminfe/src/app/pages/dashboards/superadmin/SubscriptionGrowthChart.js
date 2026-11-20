import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Button, Typography } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import moment from 'moment';

const SubscriptionGrowthChart = ({ data, isError, onRetry }) => {
  if (isError) {
    return (
      <Box
        sx={{
          height: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <SentimentDissatisfiedIcon sx={{ fontSize: 52, color: '#bdbdbd' }} />
        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#555', mt: 1 }}>
          Unable to load chart
        </Typography>
        <Typography sx={{ fontSize: '12px', color: '#999' }}>
          Please check back in a moment.
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={onRetry}
          sx={{ mt: 1, fontSize: '12px', borderColor: '#bdbdbd', color: '#555' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!data || !data.subscription_growth) return null;

  const chartData = {
    series: [{
      name: 'Total Subscriptions',
      data: data.subscription_growth.map(item => item.total || 0)
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        type: 'category',
        categories: data.subscription_growth.map(item => moment(item.month).format('MMM YYYY')),
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Total Subscriptions'
        },
        min: 0
      },
      title: {
        text: 'Subscription Growth Trend',
        align: 'center',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#666'
        }
      },
      colors: ['#289991'],
      markers: {
        size: 5,
        colors: ["#289991"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    },
  };

  return (
    <Box sx={{ p: 1, height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="line" 
        height={300} 
      />
    </Box>
  );
};

export default SubscriptionGrowthChart;
