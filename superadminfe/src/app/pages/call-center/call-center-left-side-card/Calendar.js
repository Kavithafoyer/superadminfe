import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { memo, useRef, useState, useEffect } from "react";
import { Calendar } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

const CRMCalendar = ({
  setDate,
  date = dayjs(new Date().toLocaleString().split("T")[0]),
}) => {
  const [dates, setDates] = useState(date);
  const calendarRef = useRef(null);

  useEffect(() => {
    const handleCalendarClick = (event) => {
      // Ensure the click is within the calendar element
      if (calendarRef.current && calendarRef.current.contains(event.target)) {
        console.log("Calendar clicked");
      }
    };

    window.addEventListener("click", handleCalendarClick);

    return () => {
      // Cleanup function should only try to remove the listener if it exists
      window.removeEventListener("click", handleCalendarClick);
    };
  }, []);

  return (
    <div
      id="Calendar"
      className="shadow-md"
      ref={calendarRef}
      style={{
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      }}
    >
      {/* <Calendar
        value={dates}
        onChange={(e) => {
          setDates(e);
          setDate(
            `${e.year}-${e.month < 10 ? "0" + e.month : e.month}-${e.day}`
          );
          console.log(e);
        }}
        shouldHighlightWeekends
      /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DateCalendar", "DateCalendar"]}>
          <DemoItem>
            <DateCalendar
              value={date || dates}
              onChange={(newValue) => setDate(newValue)}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
};

export default memo(CRMCalendar);
