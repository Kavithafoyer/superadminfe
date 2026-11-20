import { useEffect, useState } from "react";
import moment from "moment";

export const PERIOD_OPTIONS = [
  "Previous Week",
  "Previous Month",
  "Previous Quarter",
  "Previous Year",
  "This Week",
  "This Month",
  "This Quarter",
  "This Year",
  "Last One Year",
  "Last Six Month",
  "Last Three Month",
  "Custom Date",
];

export const usePeriodFilter = (defaultPeriod = "This Year") => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(defaultPeriod);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [customDate, setCustomDate] = useState<boolean>(false);

  const applyPeriod = (period: string) => {
    let start: moment.Moment, end: moment.Moment;

    switch (period) {
      case "This Week":
        start = moment().startOf("week");
        end = moment().endOf("week");
        break;

      case "This Month":
        start = moment().startOf("month");
        end = moment().endOf("month");
        break;

      case "This Quarter":
        start = moment().startOf("quarter");
        end = moment().endOf("quarter");
        break;

      case "This Year":
        start = moment().startOf("year");
        end = moment().endOf("year");
        break;

      case "Previous Week":
        start = moment().subtract(1, "week").startOf("week");
        end = moment().subtract(1, "week").endOf("week");
        break;

      case "Previous Month":
        start = moment().subtract(1, "month").startOf("month");
        end = moment().subtract(1, "month").endOf("month");
        break;

      case "Previous Quarter":
        start = moment().subtract(1, "quarter").startOf("quarter");
        end = moment().subtract(1, "quarter").endOf("quarter");
        break;

      case "Previous Year":
        start = moment().subtract(1, "year").startOf("year");
        end = moment().subtract(1, "year").endOf("year");
        break;

      case "Last One Year":
        start = moment().subtract(1, "year");
        end = moment();
        break;

      case "Last Six Month":
        start = moment().subtract(6, "months");
        end = moment();
        break;

      case "Last Three Month":
        start = moment().subtract(3, "months");
        end = moment();
        break;

      case "Custom Date":
        setCustomDate(true);
        return;

      default:
        return;
    }

    setCustomDate(false);
    const startStr = start.format("YYYY-MM-DD");
    const endStr = end.format("YYYY-MM-DD");
    setFromDate(startStr);
    setToDate(endStr);
    setSelectedDate(startStr);
    setCurrentDate(endStr);
  };

  useEffect(() => {
    applyPeriod(defaultPeriod);
  }, [defaultPeriod]);

  return {
    selectedPeriod,
    setSelectedPeriod,
    selectedDate,
    currentDate,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    customDate,
    PERIOD_OPTIONS,
    applyPeriod,
  };
};
