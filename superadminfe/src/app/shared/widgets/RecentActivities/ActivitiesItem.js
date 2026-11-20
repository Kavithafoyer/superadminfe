import React from "react";
import { Typography } from "@mui/material";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";

const ActivitiesItem = ({ item }) => {
  return (
    <TimelineItem
      sx={{
        "&::before": {
          display: "none",
        },
      }}
    >
      <TimelineSeparator>
        <TimelineDot
          sx={{
            p: "6px",
            m: 0,
            bgcolor: item.color,
            color: "white",
          }}
        >
          {item.icon}
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          p: (theme) => theme.spacing(0.5, 0),
          ml: 2.5,
        }}
      >
        <Typography sx={{ fontSize: "14px" }} mb={0.5}>
          {item.title}
        </Typography>
        <Typography variant={"h6"} color={"text.secondary"}>
          {item.subTitle}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
};
/* Todo item prop define */
export default ActivitiesItem;
