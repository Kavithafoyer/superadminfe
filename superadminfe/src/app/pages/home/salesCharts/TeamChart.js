import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { generateRandomColor } from "app/pages/widgets/CRMStyles"; // Ensure you have this function available
import { NoRecordsPage } from "app/pages/widgets/StylesComponents";

export default function TeamChart() {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#9a9a9a",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9a9a9a",
            fontSize: "14px",
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          format: "MMM",
        },
        y: {
          formatter: (value) => `$${value.toFixed(2)}`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        floating: true,
        offsetY: -10,
        offsetX: 20,
      },
      grid: {
        show: true,
        borderColor: "#e3e3e3",
        strokeDashArray: 5,
      },
      colors: [], // Will be populated dynamically
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#66ff66"], // Light green color at the end of the gradient
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    },
  });

  const getTeamData = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const item = "crmuseradmin1";
      const requestOption = {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await axios.get(
        `${BASE_URL}/user/HomeDashboardTeamOverview/`,
        requestOption
      );

      if (response.data?.UserList?.length > 0) {
        const userList = response.data.UserList;
        const categories = userList.map((user) => user.SalesPerson);
        const seriesData = [
          {
            name: "Amount",
            data: userList.map((user) => user.Amount),
          },
        ];

        setChartData({
          series: seriesData,
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: categories,
            },
            colors: userList.map(() => generateRandomColor()), // Set random colors for each bar
          },
        });
      }
    } catch (error) {
      console.error("Error fetching team data: ", error);
    }
  };

  useEffect(() => {
    getTeamData();
  }, []);

  return (
    <div>
      {chartData.series.length > 0 ? (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <NoRecordsPage />
        </div>
      )}
    </div>
  );
}
