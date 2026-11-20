import React from "react";

import Chart, { Legend, Series, Title, Label, Format, Connector } from "devextreme-react/chart";
import { useEffect, useState } from "react";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { useQuery } from "react-query";

function formatLabel(arg) {
  // console.log("arg",arg)
  return `${arg.valueText}`;
}

function RevenueIndustry() {
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const dataSource = [
    { month: "Jan", oranges: 3 },
    { month: "Feb", oranges: 2 },
    { month: "Mar", oranges: 3 },
    { month: "Apr", oranges: 4 },
    { month: "May", oranges: 6 },
    { month: "Jun", oranges: 11 },
    { month: "Jul", oranges: 4 },
    { month: "Aug", oranges: 5 },
    { month: "Sep", oranges: 7 },
    { month: "Oct", oranges: 8 },
    { month: "Nov", oranges: 9 },
    { month: "Dec", oranges: 4 },
  ];

  const months = [
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

  const FetchlineChart = async () => {
    console.log("Api calling...");
    
    const currentDate = new Date();
    const CurrentDateRanges = [];
    const PreviousDateRanges = [];

    // current date range
    for (let i = 0; i < 12; i++) {
      const start = new Date(currentDate);
      const end = new Date(currentDate);

      start.setMonth(start.getMonth() - i);
      start.setDate(1);
      end.setMonth(end.getMonth() - i + 1);
      end.setDate(0);

      const startDate = start.toISOString().split("T")[0];
      const endDate = end.toISOString().split("T")[0];

      console.log("month date wise", startDate, endDate);

      const requestOption = {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const payloads = { Created_Date: [startDate, endDate] };
      console.log("payloads", payloads)
      await axios
        .post(
          `${BASE_URL}/superadmin/AccountdashboardNew1/`,
          { Created_Date: [startDate, endDate] },
          requestOption
        )
        .then((res) => {
          if (Object.keys(res?.data).length > 0) {
            console.log(
              "linechart results ",
              new Date(startDate).getMonth(),
              "-",
              endDate,
              " : ",
              res?.data?.Response
            );
            let month = new Date(startDate).getMonth();
            CurrentDateRanges.push({
              month,
              value: res?.data?.Response,
            });
          } else {
            console.log("linechart results no found : ", res?.data);
          }
        });
    }
    console.log("line chart exact output : ", CurrentDateRanges);
    let dateValues = [];
    for (let i = 0; i < CurrentDateRanges.length; i++) {
      let index = months[CurrentDateRanges[i]?.month];
      if (CurrentDateRanges[i]?.month == months.indexOf(index)) {
        console.log(CurrentDateRanges[i]?.month, months.indexOf(index));
        dateValues.unshift({
          name: months[months.indexOf(index)],
          current: CurrentDateRanges[i]?.value,
        });
      } else {
        console.log(CurrentDateRanges[i]?.month, months.indexOf(index));
      }
    }
    console.log("dateValues", dateValues);
    return dateValues;
  };

  const { data: lineChartData, isLoading: lineChartDataLoading, isError: lineChartDataerror, refetch } = useQuery('lineChartData', FetchlineChart, { staleTime: Infinity, });

  return (
    <Chart id="chart" dataSource={lineChartData}>
      <Series
        valueField="current"
        argumentField="name"
        name="Month Wise Revenue"
        type="bar"
        color="#ffaa66"
      >
        <Label
          visible={true}
          customizeText={formatLabel}
          format="fixedPoint"
        >
          <Connector
            visible={true}
            width={0.5}
          />
        </Label>
      </Series>

      <Title
        text="Revenue by Month Wise"
        font={{
          size: 16,
          weight: 600,
          family: "Lato, sans-serif",
        }}
        position="left"
        horizontalAlignment="left"
      />
      <Legend horizontalAlignment="center" verticalAlignment="bottom" />
    </Chart>
  );
}
export default RevenueIndustry;
