import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toLocaleCurrency } from "app/pages/widgets/StylesComponents";

function HomeLineChart() {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Current Year",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar", // Set type to 'bar'
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: "rounded",
          columnWidth: "55%",
        },
      },
      xaxis: {
        type: "category",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: {
          style: {
            colors: "#9a9a9a",
            fontSize: "14px",
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
          format: "MMM", // Display month abbreviation in tooltip
        },
        y: {
          formatter: (value) => `${toLocaleCurrency(value.toFixed(2))}`, // Format y-axis values
        },
      },
      legend: {
        show: false, // Hide legend as we only show one series
      },
      grid: {
        show: true,
        borderColor: "#fff",
        strokeDashArray: 5,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#379777"], // Example green color at the end of the gradient
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      colors: ["#50B498"], // Initial bar color, gradient will override this
    },
  });

  const getData = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const UserId = localStorage.getItem("UserId");
      const item = "crmuseradmin1";

      const response = await axios.get(
        `${BASE_URL}/user/SalesPaymentAdditional/?Is_Deleted=False&Created_By=${UserId}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data?.results) {
        organizeData(response.data.results);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const organizeData = (datas) => {
    const currentYear = new Date().getFullYear();

    const getMonthFromDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("default", { month: "short" });
    };

    const fillMonthsWithZeroes = () => {
      const months = {};
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      monthNames.forEach((month) => {
        months[month] = 0;
      });

      return months;
    };

    const currentYearData = fillMonthsWithZeroes();

    datas.forEach((item) => {
      const monthName = getMonthFromDate(item.Created_Date);
      const monthValue = item.Paid_Amount;
      const itemYear = new Date(item.Created_Date).getFullYear();

      if (itemYear === currentYear) {
        currentYearData[monthName] = Number(monthValue);
      }
    });

    setChartData((prevData) => ({
      ...prevData,
      series: [
        {
          name: "Current Year",
          data: Object.values(currentYearData),
        },
      ],
      options: {
        ...prevData.options,
        xaxis: {
          ...prevData.options.xaxis,
          categories: Object.keys(currentYearData),
        },
      },
    }));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default HomeLineChart;
