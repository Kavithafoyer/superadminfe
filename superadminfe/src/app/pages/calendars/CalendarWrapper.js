import React from "react";
import { alpha } from "@mui/material/styles";
import Div from "@jumbo/shared/Div";
import { GlobalStyles, useTheme } from "@mui/material";
import { Colors } from "../widgets/CRMStyles";

const CalendarWrapper = ({ children }) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <GlobalStyles
        sx={{
          ".rbc-overlay .rbc-event": {
            backgroundColor: Colors?.Mblue || theme.palette.primary.main,
          },
        }}
      />
      <Div
        sx={{
          width: "100%",
          ".rbc-toolbar": {
            marginBottom: "16px",

            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
              alignItems: "flex-start",

              ".rbc-toolbar-label": {
                margin: "10px 0",
              },
            },
            ".rbc-btn-group:last-child": {
              "button:last-child": {
                display: "none",
              },
            },
          },
          ".rbc-toolbar-label": {
            fontSize: "13px",
            color: Colors?.Mblue,
          },
          ".rbc-toolbar button": {
            cursor: "pointer",
            borderColor: (theme) => Colors?.Mblue || theme.palette.divider,
            fontFamily: "inherit",
            boxShadow: "none",
            fontSize: "12px",
            color: (theme) => theme?.palette?.text?.primary,
            borderRadius: 1,

            "& + button": {
              mr: 0,
              ml: "-1px",
            },

            "&:hover, &:focus, &:active:hover, &:active:focus, &.rbc-active, &.rbc-active:hover, &.rbc-active:focus":
              {
                boxShadow: "none",
                color: "common.white",
                borderColor: (theme) =>
                  Colors?.Mblue || theme.palette.primary.main,
                backgroundColor: (theme) =>
                  Colors?.Mblue || theme.palette.primary.main,
              },
          },
          ".rbc-event, .rbc-day-slot .rbc-background-event": {
            backgroundColor: (theme) =>
              Colors?.Mblue || theme.palette.primary.main,
            "&:focus": {
              outline: "none",
            },
          },
          ".rbc-event.rbc-selected, .rbc-day-slot .rbc-selected.rbc-background-event":
            {
              backgroundColor: (theme) =>
                alpha(Colors?.Mblue, 0.7) || theme.palette.primary.main,
              color: "white",
            },
          ".rbc-slot-selection, .rbc-selected-cell": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.5),
          },
          ".rbc-off-range-bg": {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          ".rbc-header, .rbc-header + .rbc-header, .rbc-day-bg + .rbc-day-bg, .rbc-time-view, .rbc-month-view, .rbc-month-row + .rbc-month-row":
            {
              borderColor: (theme) => theme.palette.divider,
            },
          // '.rbc-agenda-view table.rbc-agenda-table': {
          //     borderColor: theme => theme.palette.divider,

          //     '& thead > tr > th, & tbody > tr + tr, & tbody > tr > td + td': {
          //         borderRight: 'none',
          //         borderLeft: theme => `solid 1px ${theme.palette.divider}`,
          //     }
          // },
          ".rbc-timeslot-group, .rbc-time-content": {
            borderColor: (theme) => theme.palette.divider,
          },
          ".rbc-time-content > * + * > *, .rbc-header + .rbc-header, .rbc-time-header-content":
            {
              borderRight: "none",
              borderLeft: (theme) => `solid 1px ${theme.palette.divider}`,
            },
          ".rbc-time-header.rbc-overflowing": {
            borderLeft: "none",
            borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          },
          ".rbc-day-slot .rbc-events-container": {
            mr: "10px",
            ml: "0",
          },
          ".rbc-day-slot .rbc-time-slot": {
            borderColor: (theme) => theme.palette.divider,
          },
          ".rbc-show-more": {
            bgcolor: "transparent",
            color: (theme) => "gray" || theme.palette.primary.main,
          },
          ".rbc-btn-group > button": {
            borderRadius: 1,

            "&:first-child:not(:last-child)": {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 4,
              borderBottomLeftRadius: 4,
            },
            "&:last-child:not(:first-child)": {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          },
          ".rbc-day-bg": {
            "& + .rbc-day-bg": {
              borderRight: "none",
              borderLeft: (theme) => `solid 1px ${theme.palette.divider}`,
            },
          },
          ".rbc-day-bg ": {
            "& + .rbc-today": {
              bgcolor: alpha(Colors?.Mblue, 0.5),
            },
          },
          ".rbc-date-cell.rbc-now.rbc-current": {
            a: {
              color: Colors?.Mblue,
            },
          },
          ".rbc-today": {
            ".rbc-timeslot-group .rbc-time-slot": {
              bgcolor: Colors?.Mblue,
            },
          },
          ".rbc-header.rbc-today": {
            bgcolor: Colors?.Mblue,
            color: "white",
          },
          // ".rbc-time-view .rbc-time-header-content .rbc-allday-cell .rbc-row-content .rbc-row ":{
          //     bgcolor: Colors?.Mblue,
          // }
        }}
      >
        {children}
      </Div>
    </React.Fragment>
  );
};

export default CalendarWrapper;
