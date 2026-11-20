import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Button, Typography, Grid, Tabs, Tab } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

const InstanceAnalytics = ({ data, isError, onRetry }) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isError) {
    return (
      <Box
        sx={{
          height: '370px',
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

  const lineChartData = {
    series: [{
      name: 'Total Instances',
      data: data.growth?.map(item => item.total || 0) || []
    }],
    options: {
      chart: { type: 'line', toolbar: { show: false } },
      stroke: { width: 3, curve: 'smooth' },
      xaxis: {
        categories: data.growth?.map(item => item.month?.split('T')[0] || "") || [],
      },
      colors: ["#FFA41B"],
      markers: { size: 4 },
      yaxis: { title: { text: 'Count' } }
    },
  };

  const donutChartData = {
    series: data.instances_by_product?.map(item => item.total || 0) || [],
    options: {
      chart: { type: 'donut' },
      labels: data.instances_by_product?.map(item => item.product_type || "N/A") || [],
      legend: { position: 'bottom', fontSize: '10px' },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '70%' } } }
    },
  };

  return (
    <Box sx={{ height: '370px', display: 'flex', flexDirection: 'column' }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        centered 
        sx={{ minHeight: '40px', mb: 1 }}
      >
        <Tab label="Growth" sx={{ fontSize: '11px', minHeight: '40px' }} />
        <Tab label="Distribution" sx={{ fontSize: '11px', minHeight: '40px' }} />
      </Tabs>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {tabValue === 0 ? (
          <ReactApexChart 
            options={lineChartData.options} 
            series={lineChartData.series} 
            type="line" 
            height={280} 
          />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ReactApexChart 
              options={donutChartData.options} 
              series={donutChartData.series} 
              type="donut" 
              height={230} 
            />
            <Box sx={{ mt: 1, p: 1, borderTop: '1px solid #f0f0f0' }}>
              <Grid container spacing={1} justifyContent="center">
                {data.status_distribution?.map((item, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', textTransform: 'uppercase' }}>
                        {item.status}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {item.total}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InstanceAnalytics;
