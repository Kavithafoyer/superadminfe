import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { MdSubscriptions, MdOutlineTimer, MdOutlineEventBusy, MdLoop } from 'react-icons/md';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import "./SubscriptionAnalytics.css";

const SubscriptionAnalytics = ({ data, isError, onRetry }) => {
  if (isError) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          my: 1,
          border: '1px solid #ffddd9',
          borderRadius: 2,
          bgcolor: '#fff5f5',
        }}
      >
        <ErrorOutlineIcon sx={{ color: '#e53935', fontSize: 28 }} />
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#c62828' }}>
            Failed to load subscription highlights
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#888' }}>
            We're having trouble connecting to our servers. Please try again later.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={onRetry}
          sx={{
            ml: 'auto',
            borderColor: '#e53935',
            color: '#e53935',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            '&:hover': { bgcolor: '#ffeaea', borderColor: '#e53935' },
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: "ACTIVE SUBSCRIPTIONS",
      value: data.active || 0,
      icon: <MdSubscriptions size={27} color="rgb(40, 153, 145)" />,
      style: { backgroundColor: "rgba(78, 202, 194, 0.28)", padding: 15 }
    },
    {
      label: "TRIAL SUBSCRIPTIONS",
      value: data.trial || 0,
      icon: <MdOutlineTimer size={27} color="rgb(28, 132, 238)" />,
      style: { backgroundColor: "#c0e3ed", color: "#1c84ee", padding: 15 }
    },
    {
      label: "EXPIRED SUBSCRIPTIONS",
      value: data.expired || 0,
      icon: <MdOutlineEventBusy size={27} color="rgb(249, 185, 49)" />,
      style: { backgroundColor: "#fef1d6", color: "#a97f25", padding: 15 }
    },
    {
      label: "RENEWAL RATE",
      value: `${data.renewal_rate || 0}%`,
      icon: <MdLoop size={27} color="rgb(76, 175, 80)" />,
      style: { backgroundColor: "rgba(76, 175, 80, 0.12)", color: "#4caf50", padding: 15 }
    }
  ];

  return (
    <div className="home-row row">
      {metrics.map((item, idx) => (
        <div key={idx} className="home-colspan">
          <div className="card td" id="card">
            <div className="card-body" style={{ padding: '10px 15px' }}>
              <div className="d-flex align-items-center justify-content-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
                <div className="left text-left">
                  <h3 className="fw-bold mb-1" style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{item.value}</h3>
                  <p className="text-muted" style={{ fontWeight: "600", color: "#96a0b5", fontSize: '11px', margin: 0 }}>
                    {item.label}
                  </p>
                </div>
                <div>
                  <div className="avatar-lg d-inline-block rounded-circle" style={{ ...item.style, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%' }}>
                    <span className="avatar-title">
                      {item.icon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionAnalytics;
