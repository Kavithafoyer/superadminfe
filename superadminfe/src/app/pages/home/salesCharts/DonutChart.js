import React from "react";
import ApexCharts from "react-apexcharts";
import Div from "@jumbo/shared/Div";
import { NoRecordsPage } from "app/pages/widgets/StylesComponents";

const populationByRegions = [
  { region: "Cash Flow", val: 41196 },
  { region: "Africa", val: 1012 },
  { region: "Northern America", val: 3441 },
  { region: "Latin America and the Caribbean", val: 59040 },
  { region: "Europe", val: 72222 },
  { region: "Oceania", val: 3516 },
];

const customPalette = ["#ff4560", "#775dd0", "#008ffb", "#00e396", "#feb019", "#FFCC5C"];

const DonutChart = () => {
  // Convert data to the format expected by ApexCharts
  const series = populationByRegions.map(item => item.val);
  const labels = populationByRegions.map(item => item.region);

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: labels,
    colors: customPalette,
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
        },
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontWeight: 600,
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          // Access the percentage directly using seriesIndex
          const total = series.reduce((acc, curr) => acc + curr, 0);
          const percent = (val / total * 100).toFixed(2);
          return `${val} (${percent}%)`;
        },
      },
    },
    title: {
      align: 'center',
      margin: 20,
      style: {
        fontSize: '16px',
        fontWeight: 600,
      },
    },
  };

  return (
    <>
      {populationByRegions?.length > 0 ? (
        <ApexCharts
          options={chartOptions}
          series={series}
          type="donut"
          height={400}
        />
      ) : (
        <Div
          sx={{ display: "flex", justifyContent: "center", position: "relative" }}
        >
          <NoRecordsPage title={"orders"} />
        </Div>
      )}
    </>
  );
};

export default DonutChart;
