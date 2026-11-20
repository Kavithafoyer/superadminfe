import React from "react";
import PieChart, {
  Series,
  Label,
  Connector,
  SmallValuesGrouping,
  Legend,
  Export,
  Title,
} from "devextreme-react/pie-chart";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Div from "@jumbo/shared/Div";


function RevenueRegion() {
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  function formatLabel(arg) {

    return `${arg.argumentText}: ${arg.valueText}`;
  }


  const FetchData = async () => {
    console.log("Region api calling...");

    try {
      const response = await axios.get(`${BASE_URL}/superadmin/AccountdashboardNew1/`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("list12345555", response?.data);
      return response?.data?.Response
    } catch (error) {
      console.log("err", error);
    }
  };

  const { data: dataSource, isLoading: dataSourceLoading, isError: dataSourceError } = useQuery('dataSource', FetchData, { staleTime: Infinity, });

  // const dataSource = [
  //     {
  //         language: 'Africa',
  //         percent: 55.5,
  //     },
  //     {
  //         language: 'Central America',
  //         percent: 2.8,
  //     },
  //     {
  //         language: 'Asia',
  //         percent: 4.6,
  //     },
  //     {
  //         language: 'Europe',
  //         percent: 5.0,
  //     },
  //     {
  //         language: 'Middle East',
  //         percent: 2.5,
  //     },
  //     {
  //         language: 'German',
  //         percent: 5.8,
  //     },
  //     {
  //         language: 'French',
  //         percent: 4.0,
  //     },
  //     {
  //         language: 'Russian',
  //         percent: 5.9,
  //     },
  //     {
  //         language: 'Italian',
  //         percent: 1.9,
  //     },
  //     {
  //         language: 'North America',
  //         percent: 1.7,
  //     },
  //     {
  //         language: 'India',
  //         percent: 1.5,
  //     },
  //     {
  //         language: 'Pacific',
  //         percent: 1.3,
  //     },
  //     {
  //         language: 'South America',
  //         percent: 0.9,
  //     },
  //     {
  //         language: 'Arabic',
  //         percent: 0.8,
  //     },
  //     {
  //         language: 'Korean',
  //         percent: 0.7,
  //     },
  //     {
  //         language: 'Czech',
  //         percent: 0.7,
  //     },
  //     {
  //         language: 'Swedish',
  //         percent: 0.5,
  //     },
  //     {
  //         language: 'Vietnamese',
  //         percent: 0.4,
  //     },
  //     {
  //         language: 'Indonesian',
  //         percent: 0.4,
  //     },
  //     {
  //         language: 'Greek',
  //         percent: 0.4,
  //     },
  //     {
  //         language: 'Romanian',
  //         percent: 0.4,
  //     },
  //     {
  //         language: 'Hungarian',
  //         percent: 0.3,
  //     },
  //     {
  //         language: 'Danish',
  //         percent: 0.3,
  //     },
  //     {
  //         language: 'Thai',
  //         percent: 0.3,
  //     },
  //     {
  //         language: 'Finnish',
  //         percent: 0.2,
  //     },
  //     {
  //         language: 'Slovak',
  //         percent: 0.2,
  //     },
  //     {
  //         language: 'Bulgarian',
  //         percent: 0.2,
  //     },
  //     {
  //         language: 'Norwegian',
  //         percent: 0.2,
  //     },
  //     {
  //         language: 'Hebrew',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Lithuanian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Croatian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Ukrainian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Norwegian Bokmål',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Serbian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Catalan',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Slovenian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Latvian',
  //         percent: 0.1,
  //     },
  //     {
  //         language: 'Estonian',
  //         percent: 0.1,
  //     },
  // ];

  return (
    <>
      <PieChart
        dataSource={dataSource}
        palette="Bright"
        legend={{
          visible: false, // Hiding the legend
        }}
      >
        <Series argumentField="name" valueField="count">
          <Label visible={true} customizeText={formatLabel} format="fixedPoint">
            <Connector visible={true} width={0.5} />
          </Label>
          {/* <SmallValuesGrouping threshold={4.5} mode="smallValueThreshold" /> */}
        </Series>

        <Export enabled={true} />
        <Title
          text="Revenue by Region"
          font={{
            size: 16,
            weight: 600,
            family: "Lato, sans-serif",
          }}
          position="left"
          horizontalAlignment="left"
        />
      </PieChart>
    </>
  );
}
export default RevenueRegion;
