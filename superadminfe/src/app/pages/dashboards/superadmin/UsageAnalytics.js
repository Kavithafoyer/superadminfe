import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const UsageAnalytics = ({ data, isError, onRetry }) => {
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
    series: [{
      name: 'Active Users',
      data: data.dau_trend?.map(item => item.active_users || 0) || []
    }],
    options: {
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: data.dau_trend?.map(item => item.day || "") || [],
      },
      yaxis: {
        title: {
          text: 'Users'
        }
      },
      colors: ['#8884d8'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      }
    },
  };

  return (
    <Box sx={{ p: 1, height: '350px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle2" align="center" gutterBottom>DAU Trend (Last 7 Days)</Typography>
      <ReactApexChart 
        options={chartData.options} 
        series={chartData.series} 
        type="area" 
        height={220} 
      />
      <Box sx={{ mt: 1, flex: 1, overflow: 'auto' }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f9f9f9' }}>
              <TableRow>
                <TableCell sx={{ fontSize: '11px', fontWeight: 'bold' }}>Top User</TableCell>
                <TableCell sx={{ fontSize: '11px', fontWeight: 'bold' }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.top_users?.slice(0, 3).map((user, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontSize: '11px' }}>{user.user__username || "Unknown"}</TableCell>
                  <TableCell sx={{ fontSize: '11px' }} align="right">{user.total_actions || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UsageAnalytics;
