import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const SubscriptionInsights = ({ data, isError, onRetry }) => {
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
          Unable to load data
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

  if (!data) return null;

  const chartData = {
    series: data.churn_by_product?.map(item => item.total || 0) || [],
    options: {
      chart: {
        type: 'donut',
      },
      labels: data.churn_by_product?.map(item => item.product || "Unknown") || [],
      colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
  };

  return (
    <Box sx={{ p: 2, height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle2" align="center" gutterBottom>Churn by Product</Typography>
          <ReactApexChart 
            options={chartData.options} 
            series={chartData.series} 
            type="donut" 
            height={250} 
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', height: '100%' }}>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, border: '1px solid #f0f0f0', bgcolor: '#f9f9f9' }}>
              <Typography variant="caption" color="text.secondary">Trial to Paid</Typography>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {data.trial_to_paid_conversion || 0}%
              </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, border: '1px solid #f0f0f0', bgcolor: '#fff5f5' }}>
              <Typography variant="caption" color="text.secondary">Expiring Soon</Typography>
              <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                {data.expiring_soon_count || 0}
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionInsights;
