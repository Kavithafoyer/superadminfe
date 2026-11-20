/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable react/react-in-jsx-scope */

import { Colors } from "app/pages/widgets/CRMStyles";
import ColumnBarChart from "./ColumnBarChart";
import PieAndDonutChart from "./PieAndDonutChart";
import { useSelector } from "react-redux";

const data = [
  { id: 0, value: 10, label: "series A" },
  { id: 1, value: 15, label: "series B" },
  { id: 2, value: 20, label: "series C" },
];
const barChart = (data, barLength, size, Colors, isSideMenuOptions) => {
  return (
    <ColumnBarChart
      // MultipleColumn={isSideMenuOptions === "analytics" ? true : false}
      color={Colors}
      valueField={barLength[0]}
      barLength={barLength}
      barData={data}
      chartWidth={size?.width}
      label="xaxis"
    />
  );
};

const lineChart = (data, barLength, Colors, isSideMenuOptions) => (
  <ColumnBarChart
    color={Colors}
    barLength={barLength}
    barType="line"
    barData={data}
    label="xaxis"
  />
);

const areaChart = (data, barLength, isSideMenuOptions) => (
  <ColumnBarChart
    barLength={barLength}
    barType="area"
    barData={data}
    label="xaxis"
  />
);

const SidebarChart = (data, barLength, isSideMenuOptions) => (
  <ColumnBarChart
    // MultipleColumn={isSideMenuOptions === "analytics" ? true : false}
    rotated
    valueField={barLength[0]}
    barLength={barLength}
    // MultipleColumn
    barData={data}
    label="xaxis"
  />
);

export const Charts = ({ chartType }) => {
  console.log("chartType", chartType);
  const isSideMenuOptions = useSelector(
    (state) => state.selfServiceViewOptions.sideMenuOptions
  );
  // let barLength = [];
  // let data =
  //   chartType?.data?.length > 0 &&
  //   Object.entries(chartType?.data[0])?.map(([key, keydata]) => {
  //     console.log("keysssss", key, "-------", key?.match("Count"));
  //     if (key !== "xaxis" || key?.match("Count")) {
  //       barLength.push(key);
  //       // return key
  //     }
  //   });

  let barLength = [];
  let keysSet = new Set(); // Using Set to avoid duplicate entries

  chartType?.data?.forEach((data) => {
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "xaxis" && !key.includes("Count")) {
        let countKey = key + "_Count";
        if (typeof value === "number") {
          keysSet.add(key); // Add the key if the value is a number
        } else if (data.hasOwnProperty(countKey)) {
          keysSet.add(countKey); // Add the count key if the value is not a number and the count key exists
        }
      }
    });
  });

  barLength = Array.from(keysSet); // Convert the Set to an array

  console.log("barLength: ", barLength);

  console.log("keys: ", chartType?.type, barLength);

  switch (chartType?.type) {
    case "linechart":
      return lineChart(
        chartType?.data,
        barLength,
        chartType?.colors,
        isSideMenuOptions
      );
    case "barchart":
      return barChart(
        chartType?.data,
        barLength,
        chartType?.size,
        chartType?.colors,
        isSideMenuOptions
      );
    case "areachart":
      return areaChart(chartType?.data, barLength, isSideMenuOptions);
      break;
    case "piechart":
      return (
        <PieAndDonutChart
          chartData={chartType?.data}
          label={"xaxis"}
          valueField={barLength}
        />
      );
      break;
    case "donutchart":
      return (
        <PieAndDonutChart
          type="doughnut"
          chartData={chartType?.data}
          label={"xaxis"}
          valueField={barLength}
        />
      );

      break;
    case "sidebarchart":
      return SidebarChart(chartType?.data, barLength, isSideMenuOptions);
      break;
    default:
      return null; // or provide a default behavior
  }
};
