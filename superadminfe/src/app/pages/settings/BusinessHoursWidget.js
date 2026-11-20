import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  TextField,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Collapse,
  Alert,
  Autocomplete,
  Fade,
  Chip
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

// 15-minute intervals for Autocomplete
const generateTimeOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 15) {
      options.push(
        `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}`
      );
    }
  }
  return options;
};
const TIME_OPTIONS = generateTimeOptions();

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getDayKeys = (day) => {
  const prefix = day === "Wednesday" ? "Wednessday" : day;
  const endSuffix = day === "Monday" ? "EndTime" : "Endtime";
  return {
    checkbox: `${prefix}_Chekbox`,
    start: `${prefix}_Starttime`,
    end: `${prefix}_${endSuffix}`,
  };
};

const BusinessHoursWidget = ({ business, setBusiness }) => {
  const [compactMode, setCompactMode] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState(null);

  // Keyboard navigation & Auto Focus (Feature 19 & 20)
  const handleTimeChange = (day, field, value) => {
    const keys = getDayKeys(day);
    const updated = { ...business, [keys[field]]: value };
    setBusiness(updated);

    // Feature 19: Auto focus next input
    if (field === "start" && value?.length === 5) {
      const endInput = document.getElementById(`${day}-end`);
      if (endInput) endInput.focus();
    }
  };

  // Feature 1 & 3: Copy to all selected days
  const handleCopyToSelected = (sourceDay) => {
    const sourceKeys = getDayKeys(sourceDay);
    const startVal = business[sourceKeys.start];
    const endVal = business[sourceKeys.end];

    if (!startVal || !endVal) return;

    let updated = { ...business };
    DAYS.forEach((d) => {
      const keys = getDayKeys(d);
      if (updated[keys.checkbox] && d !== sourceDay) {
        updated[keys.start] = startVal;
        updated[keys.end] = endVal;
      }
    });
    setBusiness(updated);
  };

  // Feature 25: Reset Row
  const handleResetRow = (day) => {
    const keys = getDayKeys(day);
    setBusiness({ ...business, [keys.start]: null, [keys.end]: null });
  };

  // Feature 11: Quick Select
  const handleQuickSelect = (type) => {
    let updated = { ...business };
    DAYS.forEach((d) => {
      const keys = getDayKeys(d);
      const isWeekend = d === "Saturday" || d === "Sunday";
      if (type === "mon-fri") {
        updated[keys.checkbox] = !isWeekend;
      } else if (type === "weekend") {
        updated[keys.checkbox] = isWeekend;
      } else if (type === "all") {
        updated[keys.checkbox] = true;
      } else if (type === "none") {
        updated[keys.checkbox] = false;
      }
    });
    setBusiness(updated);
  };

  // Feature 2: Auto-copy nearest day timing & Feature 13: Auto-enable
  const handleCheckboxToggle = (day) => {
    const keys = getDayKeys(day);
    const isChecked = !business[keys.checkbox];
    let updated = { ...business, [keys.checkbox]: isChecked };

    // Smart copy from previous day if enabling and current is empty
    if (isChecked && !updated[keys.start]) {
      const dayIndex = DAYS.indexOf(day);
      if (dayIndex > 0) {
        const prevDayKeys = getDayKeys(DAYS[dayIndex - 1]);
        if (updated[prevDayKeys.start] && updated[prevDayKeys.end]) {
          updated[keys.start] = updated[prevDayKeys.start];
          updated[keys.end] = updated[prevDayKeys.end];
        }
      }
    }
    setBusiness(updated);
  };

  // Feature 18: Smart pattern detection (Mon-Fri similarity)
  useEffect(() => {
    const mon = getDayKeys("Monday");
    const tue = getDayKeys("Tuesday");
    if (
      business[mon.checkbox] &&
      business[tue.checkbox] &&
      business[mon.start] &&
      business[mon.end] &&
      business[mon.start] === business[tue.start] &&
      business[mon.end] === business[tue.end]
    ) {
      // Check if Wed-Fri are empty or different
      const wed = getDayKeys("Wednesday");
      if (!business[wed.start]) {
        setSmartSuggestion({
          start: business[mon.start],
          end: business[mon.end],
          message: `Apply ${business[mon.start]} - ${business[mon.end]} to remaining weekdays?`,
        });
        return;
      }
    }
    setSmartSuggestion(null);
  }, [business]);

  const applySmartSuggestion = () => {
    if (!smartSuggestion) return;
    let updated = { ...business };
    ["Wednesday", "Thursday", "Friday"].forEach((d) => {
      const keys = getDayKeys(d);
      if (updated[keys.checkbox]) {
        updated[keys.start] = smartSuggestion.start;
        updated[keys.end] = smartSuggestion.end;
      }
    });
    setBusiness(updated);
    setSmartSuggestion(null);
  };

  // Inline Validation Helper
  const isValidTime = (start, end) => {
    if (!start || !end) return true;
    return start < end;
  };

  // Feature 15 & 21: Live Summary & Timeline View
  const renderTimeline = () => {
    return (
      <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Weekly Timeline Summary
        </Typography>
        {DAYS.map((day) => {
          const keys = getDayKeys(day);
          const isOpen = business[keys.checkbox];
          const start = business[keys.start] || "";
          const end = business[keys.end] || "";
          
          return (
            <Box key={`timeline-${day}`} sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Typography sx={{ width: 40, fontSize: "10px", color: "#666" }}>
                {day.substring(0, 3)}
              </Typography>
              <Box sx={{ flex: 1, height: 8, bgcolor: "#e0e0e0", borderRadius: 4, mx: 1, overflow: "hidden" }}>
                {isOpen && start && end && isValidTime(start, end) ? (
                  <Box
                    sx={{
                      height: "100%",
                      bgcolor: "#10BBE5",
                      marginLeft: `${(parseInt(start.split(":")[0]) / 24) * 100}%`,
                      width: `${((parseInt(end.split(":")[0]) - parseInt(start.split(":")[0])) / 24) * 100}%`,
                    }}
                  />
                ) : null}
              </Box>
              <Typography sx={{ width: 80, fontSize: "10px", color: "#666", textAlign: "right" }}>
                {isOpen ? (start && end ? `${start} - ${end}` : "Open") : "Closed"}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%", textAlign: "left", mt: 3, mb: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, color: "#10BBE5", fontSize: '20px' }}>
          Business Hour
        </Typography>
        <Button
          size="small"
          onClick={() => setCompactMode(!compactMode)}
          sx={{ textTransform: "none", color: "#666" }}
        >
          {compactMode ? "Detailed View" : "Compact Mode"}
        </Button>
      </Box>

      {/* Feature 11: Quick Select Tools */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        <Chip label="Mon-Fri" onClick={() => handleQuickSelect("mon-fri")} clickable />
        <Chip label="Weekend" onClick={() => handleQuickSelect("weekend")} clickable />
        <Chip label="All Days" onClick={() => handleQuickSelect("all")} clickable />
        <Chip label="Clear All" onClick={() => handleQuickSelect("none")} clickable variant="outlined" />
      </Box>

      {/* Feature 4 & 18: Smart Pattern Suggestion */}
      <Collapse in={Boolean(smartSuggestion)}>
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={applySmartSuggestion}>
              Apply Automatically
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {smartSuggestion?.message}
        </Alert>
      </Collapse>

      <Grid container spacing={compactMode ? 1 : 2}>
        {DAYS.map((day) => {
          const keys = getDayKeys(day);
          const isChecked = Boolean(business[keys.checkbox]);
          const start = business[keys.start] || "";
          const end = business[keys.end] || "";
          const isValid = isValidTime(start, end);

          return (
            <Grid item xs={12} key={day}>
              {/* Feature 14: Sticky Row Highlight (hover effect) */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: compactMode ? 0.5 : 1,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  border: !isValid && isChecked ? "1px solid #ff4d4f" : "1px solid transparent",
                  bgcolor: !isValid && isChecked ? "#fff2f0" : "transparent",
                  "&:hover": {
                    bgcolor: isChecked ? "#f0f9ff" : "#f5f5f5",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Box sx={{ width: { xs: 120, md: 150 }, display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(day)}
                    color="info"
                  />
                  <Typography sx={{ fontWeight: isChecked ? 600 : 400, color: isChecked ? "#333" : "#999", width: '100px' }}>
                    {day}
                  </Typography>
                </Box>

                {/* Feature 22: Animated Transitions */}
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
                  {isChecked ? (
                    <Fade in={isChecked}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Autocomplete
                          freeSolo
                          disableClearable
                          options={TIME_OPTIONS}
                          value={start}
                          onChange={(e, val) => handleTimeChange(day, "start", val)}
                          onInputChange={(e, val) => handleTimeChange(day, "start", val)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id={`${day}-start`}
                              type="time"
                              size="small"
                              placeholder="Start Time"
                              className="input-box2"
                              sx={{ width: 150 }}
                              error={!isValid}
                            />
                          )}
                        />
                        <Typography sx={{ color: "#666" }}>to</Typography>
                        <Autocomplete
                          freeSolo
                          disableClearable
                          options={TIME_OPTIONS}
                          value={end}
                          onChange={(e, val) => handleTimeChange(day, "end", val)}
                          onInputChange={(e, val) => handleTimeChange(day, "end", val)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              id={`${day}-end`}
                              type="time"
                              size="small"
                              placeholder="End Time"
                              className="input-box2"
                              sx={{ width: 150 }}
                              error={!isValid}
                            />
                          )}
                        />
                        
                        {/* Feature 9: Inline Validation Warning */}
                        {!isValid && (
                          <Typography variant="caption" color="error">
                            End time must be after start
                          </Typography>
                        )}
                        
                        {/* Row Actions */}
                        {!compactMode && (
                          <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                            <Tooltip title="Apply this timing to all selected days">
                              <IconButton size="small" onClick={() => handleCopyToSelected(day)}>
                                <ContentCopyIcon fontSize="small" sx={{ color: "#10BBE5" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Row">
                              <IconButton size="small" onClick={() => handleResetRow(day)}>
                                <RotateLeftIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </Box>
                    </Fade>
                  ) : (
                    /* Feature 6: Closed Badge */
                    <Chip label="Closed" size="small" sx={{ bgcolor: "#eee", color: "#999" }} />
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Feature 21: Timeline Visualization */}
      {!compactMode && renderTimeline()}
      
    </Box>
  );
};

export default BusinessHoursWidget;
