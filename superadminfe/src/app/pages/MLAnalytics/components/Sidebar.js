import React, { memo, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel, MdPlayArrow } from "react-icons/md";
// import { Tooltip } from '@syncfusion/ej2-react-popups';

import { analyticssMenu, links } from "../data/dummy";
import { useStateContext } from "app/contexts/ContextProvider";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setAnalyticCharts,
  setSideChildMenuOptions,
  setSideMenuOptions,
} from "app/redux/self_service_BI/ViewOptionSlice";
import {
  Div,
  formatKey,
  formatNumberSuffix,
} from "app/pages/widgets/StylesComponents";
import axios from "axios";
import useResponsive from "app/pages/widgets/useResponsive";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { avatarColors, avatarLightColors } from "app/pages/widgets/CRMStyles";
import {
  fetchSalesForecast,
  selectAllSalesForecasts,
} from "app/redux/self_service_BI/SaleForecastSlice";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  const [activeColor, setActiveColor] = useState([]);

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let segmentRows = [
    {
      xaxis: "",
      From: 0,
      To: 10,
    },
    {
      xaxis: "",
      From: 11,
      To: 20,
    },
    {
      xaxis: "",
      From: 21,
      To: 40,
    },
  ];

  const customerChurns = [
    {
      CustomerID: "C_ID0007",
      Age: 30,
      churn: "churned",
      Territory: "South Territory",
      Reason: "Competitor offering",
    },
    {
      CustomerID: "C_ID0010",
      Age: 58,
      churn: "churned",
      Territory: "West Territory",
      Reason: "Product issues",
    },
    {
      CustomerID: "C_ID0012",
      Age: 28,
      churn: "churned",
      Territory: "North Territory",
      Reason: "Competitor offering",
    },
    {
      CustomerID: "C_ID0013",
      Age: 27,
      churn: "churned",
      Territory: "East Territory",
      Reason: "High price",
    },
    {
      CustomerID: "C_ID0014",
      Age: 41,
      churn: "churned",
      Territory: "West Territory",
      Reason: "No longer needed",
    },
    {
      CustomerID: "C_ID0016",
      Age: 25,
      churn: "churned",
      Territory: "South Territory",
      Reason: "Product issues",
    },
  ];

  // lead
  const [LeadQualificationLists, setLeadQualificationLists] = useState([]);
  const [LeadSegmentLists, setLeadSegmentLists] = useState([]);
  const [LeadStageLists, setLeadStageLists] = useState([]);
  const [LeadScoreLists, setLeadScoreLists] = useState([]);
  const [LeadConvertionRateLists, setLeadConvertionRateLists] = useState([]);
  const [LeadDemographLists, setLeadDemographLists] = useState([]);
  const [LeadSourceAnalysisLists, setLeadSourceAnalysisLists] = useState([]);

  // sales
  const salesForecastsAllData = useSelector(selectAllSalesForecasts);
  const [saleTargetLists, setSaleTargetLists] = useState([]);
  const [saleTrendLists, setSaleTrendLists] = useState([]);

  // deals
  const [dealProbability, setDealealProbability] = useState([]);
  const [dealConvertionRate, setDealConvertionRate] = useState([]);
  const [customerChurn, setCustomerChurn] = useState([]);
  const [customerRetain, setCustomerRetain] = useState([]);

  let isMobile = useResponsive("down", "sm");

  const dispatch = useDispatch();
  const isSideMenuOptions = useSelector(
    (state) => state.selfServiceViewOptions.sideMenuOptions,
  );
  const handleCloseSideBar = (name) => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
    dispatch(setSideMenuOptions(name));
  };

  const activeLink =
    "flex items-center gap-5 pt-3 pb-2.5 rounded-md text-white  text-md pl-3 m-1 mt-0";
  const normalLink =
    "flex items-center gap-5 pt-3 pb-2.5 rounded-md text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray  pl-3 m-1 mt-0";

  const getLeadQualification = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_Qualifiction/`,
      );
      console.log("Lead_Qualifiction", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getLeadSegmentLists = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/lead_Segsize/`,
      );
      console.log("Lead_Qualifiction", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };
  const getLeadStage = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_Stage/`,
      );
      console.log("Lead_Stage", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getLeadSegment = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_Segment/`,
      );
      console.log("Lead_Segment", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getLeadScore = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_score/`,
      );
      console.log("Lead_score", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };
  const getLeadConvertion = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_convertionrate/`,
      );
      // Replace Infinity with a string representation
      const jsonStringHandled = res?.data?.replace(/Infinity/g, '"Infinity"');

      // Parse the JSON string
      const parsedData = JSON.parse(jsonStringHandled);

      // Convert the string "Infinity" back to actual Infinity
      parsedData.forEach((item) => {
        if (item.ConversionRate === "Infinity") {
          item.ConversionRate = Infinity;
        }
      });
      console.log("Lead_convertionrate", parsedData);

      return parsedData;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };
  const getLeadDemograph = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/lead_demographanalysis/`,
      );
      console.log("lead_demographanalysis", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };
  const getLeadSource = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/lead_Sourceanalysis/`,
      );
      console.log("lead_Sourceanalysis", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getSalesTarget = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Target_sales/`,
      );
      console.log("Target_sales", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };
  const getSalesTrend = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Sales_Trend/`,
      );
      console.log("Sales_Trend", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching Sales_Trend:", error);
    }
  };

  const getSalesTrendIndra = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/indraSales_Trend/`,
      );
      console.log("indraSales_Trend", res?.data);
      return res?.data?.Trends;
    } catch (error) {
      console.error("Error fetching indraSales_Trend : ", error);
    }
  };

  const getDealProbability = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Deal_prob/`,
      );
      console.log("Deal_prob", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching Deal_prob:", error);
    }
  };
  const getDealConvertion = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Deal_convertionrate/`,
      );
      console.log("Deal_convertionrate", res?.data);

      // Replace Infinity with a string representation
      const jsonStringHandled = res?.data?.replace(/Infinity/g, '"Infinity"');

      // Parse the JSON string
      const parsedData = JSON.parse(jsonStringHandled);

      // Convert the string "Infinity" back to actual Infinity
      parsedData.forEach((item) => {
        if (item.ConversionRate === "Infinity") {
          item.ConversionRate = Infinity;
        }
      });

      return parsedData;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getCustomerChurn = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Customer_churn/`,
      );
      console.log("Customer_churn", res?.data);
      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getCustomerRetain = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/customer_retain/`,
      );
      console.log("Customer Retain : ", res?.data);

      return res?.data;
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  const getLeadQualified = async () => {
    try {
      const res = await axios.post(
        `https://backend.crmfarm.app/demo/user/Lead_qualified/`,
      );
      console.log("Lead_qualified : ", res?.data?.Qualified);
      return res?.data?.Qualified[0];
    } catch (error) {
      console.error("Error fetching sales order list:", error);
    }
  };

  // Fetch Sales Data
  const fetchSalesData = async () => {
    try {
      const [saleTargetData, saleTrendData, SalesTrendIndraData] =
        await Promise.all([
          getSalesTarget(),
          getSalesTrend(),
          getSalesTrendIndra(),
        ]);

      console.log("fetchSalesData", saleTargetData, saleTrendData);
      setSaleTargetLists(saleTargetData?.Target_sales);
      setSaleTrendLists(saleTrendData?.Trends);
      //   setSalesTrendIndra(SalesTrendIndraData);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  // Fetch Leads Data
  const fetchLeadsData = async () => {
    try {
      const [
        leadQualificationData,
        getLeadStageData,
        getLeadSegmentData,
        getLeadScoreData,
        getLeadConvertionData,
        getLeadDemographData,
        getLeadSourceData,
        getLeadSegmentListDatas,
      ] = await Promise.all([
        getLeadQualification(),
        getLeadStage(),
        getLeadSegment(),
        getLeadScore(),
        getLeadConvertion(),
        getLeadDemograph(),
        getLeadSource(),
        getLeadSegmentLists(),
      ]);

      console.log("all Leads Data", {
        getLeadSourceData,
        getLeadStageData,
        leadQualificationData,
        getLeadSegmentData,
        getLeadScoreData,
        getLeadConvertionData,
        getLeadDemographData,
        getLeadSegmentListDatas,
      });
      console.log(
        "keyssss asasdsadsaas asdasdaswd sa dsadsad asd wasd sad  dasw dasd asdasdsadasdsadasdas-------------",
        getLeadStageData,
        getLeadConvertionData,
        Object.keys({
          ...leadQualificationData,
          ...getLeadSegmentData,
          ...getLeadSegmentData,
        }),
      );

      setLeadQualificationLists(leadQualificationData?.Lead_Qualification);
      setLeadStageLists(getLeadStageData?.Lead_Stage);
      setLeadSegmentLists(getLeadSegmentListDatas);
      setLeadScoreLists(getLeadScoreData?.Lead_Score);
      setLeadConvertionRateLists(getLeadConvertionData);
      setLeadDemographLists(getLeadDemographData);
      setLeadSourceAnalysisLists(getLeadSourceData);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  // Fetch Deals Data
  const fetchDealsData = async () => {
    try {
      const [dealProbabilityData, dealConversationData] = await Promise.all([
        getDealProbability(),
        getDealConvertion(),
      ]);

      console.log("fetchDealsData", {
        dealProbabilityData,
        dealConversationData,
      });

      setDealealProbability(dealProbabilityData["Deal_prob%"]);
      setDealConvertionRate(dealConversationData);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  // Fetch Customer Data
  const fetchCustomerData = async () => {
    try {
      const [customerChurnData] = await Promise.all([getCustomerChurn()]);

      console.log("customer Churn", customerChurnData);
      setCustomerChurn(customerChurnData?.Churn);

      // setCustomerChurn(customerChurn?.churn);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  const fetchCustomerRetain = async () => {
    try {
      const [customerRetain] = await Promise.all([getCustomerRetain()]);

      console.log("customerRetain", customerRetain);
      setCustomerRetain(customerRetain);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  const fetchLeadQualified = async () => {
    try {
      const [LeadQualified] = await Promise.all([getLeadQualified()]);

      console.log("LeadQualified", LeadQualified);
      setLeadQualificationLists(LeadQualified);
      // setCustomerChurn(customerChurn?.churn);
    } catch (error) {
      console.log("leads data error: " + error);
    }
  };

  const handleSideMenu = async (menu, index1, index2) => {
    // activeColor[0] === index : true) && activeColor[1] !== index1
    // console.log("indexxxxxx", menu);

    if (activeColor[0] == index1 && activeColor[1] !== index2) {
      setActiveColor([index1, index2]);
      dispatch(setSideChildMenuOptions(menu?.type));
    } else {
      setActiveColor([index1]);
    }
    // leads
    if (menu?.type === "Lead Qualification") {
      let chartQualification = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
      };

      Object.entries(LeadQualificationLists)?.map(([key, val]) => {
        chartQualification.data.push({
          xaxis: key,
          Lead_qualified: Number(val),
        });
      });

      console.log("chartQualification", chartQualification);
      dispatch(
        setAnalyticCharts({
          fullList: chartQualification.data,
          ChartList: chartQualification,
          ChartCopy: chartQualification,
        }),
      );
    } else if (menu?.type === "Lead Stage") {
      let chartSegament = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[8], avatarLightColors[4]],
      };

      LeadStageLists?.map((lead) => {
        let dataKey = chartSegament?.data?.findIndex(
          (item) => item["xaxis"] === lead?.Stage,
        );
        console.log("dataKey", dataKey);
        if (dataKey !== -1) {
          chartSegament.data[dataKey]["Segment_Count"] =
            chartSegament?.data[dataKey]["Segment_Count"] + 1;
        } else {
          chartSegament?.data?.push({
            ["xaxis"]: lead?.Stage,
            ["Segment"]: lead?.Stage,
            ["Segment_Count"]: 1,
          });
        }
      });

      console.log("chartSegament", chartSegament);
      dispatch(
        setAnalyticCharts({
          fullList: LeadStageLists,
          ChartList: chartSegament,
          ChartCopy: chartSegament,
        }),
      );
    } else if (menu?.type === "Lead Segment") {
      let chartSegament = {
        data: [],
        type: "donutchart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[8], avatarLightColors[4]],
      };

      LeadSegmentLists?.map((lead) => {
        let dataKey = chartSegament?.data?.findIndex(
          (item) => item["xaxis"] === lead?.Lead_Industry,
        );
        console.log("dataKey", dataKey);
        if (dataKey !== -1) {
          chartSegament.data[dataKey]["Lead_Industry_Count"] =
            chartSegament?.data[dataKey]["Lead_Industry_Count"] + 1;
        } else {
          chartSegament?.data?.push({
            ["xaxis"]: lead?.Lead_Industry,
            ["Lead_Industry"]: lead?.Lead_Industry,
            ["Lead_Industry_Count"]: 1,
          });
        }
      });

      console.log("chartSegament", chartSegament);
      dispatch(
        setAnalyticCharts({
          fullList: LeadSegmentLists,
          ChartList: chartSegament,
          ChartCopy: chartSegament,
        }),
      );
    } else if (menu?.type === "Lead Score") {
      let chartScore = {
        data: [],
        type: "piechart",
        size: { width: 650, height: 650 },
        colors: [avatarColors[1], avatarLightColors[6]],
      };

      let convertedData = segmentRows?.map((range, i) => ({
        ...range,
        ["score"]: 0,
        xaxis: `${range.From || 0} - ${range.To || 0}`,
      }));

      LeadScoreLists?.forEach((item) => {
        convertedData.forEach((range) => {
          console.log(
            "conditionss",
            item["score"],
            range?.From,
            item["score"],
            range?.To,
          );
          if (item["score"] >= range?.From && item["score"] < range?.To) {
            range.xaxis = `${range?.From || 0} - ${range?.To || 0}`;
            range["score"]++;
          }
        });
      });

      convertedData.map((item) => {
        chartScore?.data?.push({
          xaxis: item?.xaxis,
          ["score"]: item["score"],
        });
      });

      console.log("chartScore", chartScore);
      dispatch(
        setAnalyticCharts({
          fullList: LeadScoreLists,
          ChartList: chartScore,
          ChartCopy: chartScore,
        }),
      );
    } else if (menu?.type === "Lead Convertion Rate") {
      let chartConversation = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
        // colors: [avatarLightColors[1], avatarLightColors[2]],
      };

      let fullListsConvert = LeadConvertionRateLists?.map((item) => {
        return {
          ConversionRate: item?.ConversionRate,
          Month: months[item?.Month],
          Year: JSON.stringify(item?.Year),
        };
      });

      LeadConvertionRateLists?.forEach((item) => {
        chartConversation?.data?.push({
          ["xaxis"]: `${item.Year}-${months[item.Month]}`,
          ["ConversionRate"]: Math.round(item?.ConversionRate),
          ["ConversionRate_Count"]: Math.round(item?.ConversionRate),
        });
      });
      console.log("chartConversation", LeadConvertionRateLists);
      dispatch(
        setAnalyticCharts({
          fullList: LeadConvertionRateLists,
          ChartList: chartConversation,
          ChartCopy: chartConversation,
        }),
      );
    } else if (menu?.type === "Lead Demograph") {
      let chartDemograph = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[3], avatarLightColors[7], avatarColors[4]],
      };

      LeadDemographLists?.map((lead) => {
        let dataKey = chartDemograph?.data?.findIndex(
          (item) => item["xaxis"] === lead?.City,
        );
        console.log("dataKey", dataKey);
        if (dataKey !== -1) {
          // chartDemograph.data[dataKey]["AreaName_Count"] = chartDemograph?.data[dataKey]["AreaName_Count"] + 1
          chartDemograph.data[dataKey]["City_Count"] =
            chartDemograph?.data[dataKey]["City_Count"] + 1;
          // chartDemograph.data[dataKey]["State_Count"] = chartDemograph?.data[dataKey]["State_Count"] + 1
          // chartDemograph.data[dataKey]["Country_Count"] = chartDemograph?.data[dataKey]["Country_Count"] + 1
        } else {
          chartDemograph?.data?.push({
            ["xaxis"]: lead?.City,
            // ["AreaName"]: lead?.AreaName,
            ["City"]: lead?.City,
            // ["State"]: lead?.State,
            // ["Country"]: lead?.Country,
            // ["AreaName_Count"]: 1,
            ["City_Count"]: 1,
            // ["State_Count"]: 1,
            // ["Country_Count"]: 1,
          });
        }
      });
      console.log("chartDemograph", chartDemograph);
      dispatch(
        setAnalyticCharts({
          fullList: LeadDemographLists,
          ChartList: chartDemograph,
          ChartCopy: chartDemograph,
        }),
      );
    } else if (menu?.type === "Lead Source") {
      let chartSource = {
        data: [],
        type: "piechart",
        size: { width: 650, height: 650 },
      };

      LeadSourceAnalysisLists?.map((lead) => {
        let dataKey = chartSource?.data?.findIndex(
          (item) => item["xaxis"] === lead?.LeadSource,
        );
        console.log("dataKey", dataKey);
        if (dataKey !== -1) {
          chartSource.data[dataKey]["LeadSource_Count"] =
            chartSource?.data[dataKey]["LeadSource_Count"] + 1;
        } else {
          chartSource?.data?.push({
            ["xaxis"]: lead?.LeadSource,
            ["LeadSource"]: lead?.LeadSource,
            ["LeadSource_Count"]: 1,
          });
        }
      });
      console.log("chartSource", chartSource);
      dispatch(
        setAnalyticCharts({
          fullList: LeadSourceAnalysisLists,
          ChartList: chartSource,
          ChartCopy: chartSource,
        }),
      );
    }
    // sales
    else if (menu?.type === "Sales Forecast") {
      dispatch(
        fetchSalesForecast({
          Duration: "1",
          Period: "Month",
        }),
      );

      let chartSalesForecast = {
        data: salesForecastsAllData,
        type: "linechart",
        size: { width: 650, height: 650 },
        colors: [avatarColors[7], avatarColors[6]],
      };

      console.log("chartSalesForecast", chartSalesForecast);
      dispatch(
        setAnalyticCharts({
          fullList: salesForecastsAllData,
          ChartList: chartSalesForecast,
          ChartCopy: chartSalesForecast,
        }),
      );
    } else if (menu?.type === "Sales Target") {
      let chartTarget = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[3], avatarLightColors[6]],
      };

      saleTargetLists?.forEach((item) => {
        chartTarget?.data?.push({
          ["xaxis"]: item.Month,
          ["Available_budget"]: item.Available_budget,
          // ["Email Opened"]: item?.emailopend
        });
      });
      dispatch(
        setAnalyticCharts({
          fullList: saleTargetLists,
          ChartList: chartTarget,
          ChartCopy: chartTarget,
        }),
      );
    } else if (menu?.type === "Sales Trend") {
      let chartTrend = {
        data: [],
        type: "linechart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[3], avatarLightColors[6]],
      };

      saleTrendLists?.length > 0 &&
        saleTrendLists?.forEach((item, idx) => {
          const dateParts = item?.Date?.split("T")[0]?.split("-");
          const year = dateParts?.[0];
          const monthIndex = Number(dateParts?.[1]);
          const monthName = months[monthIndex];
          const xaxis = `${year}-${monthName}`;
          const newItem = { xaxis };
          if (Boolean(item.Trend) || Boolean(item?.Sales)) {
            newItem.Sales = parseFloat(item?.Sales);
            newItem.Trend = parseFloat(item?.Trend);
          }
          chartTrend?.data.push(newItem);
        });
      dispatch(
        setAnalyticCharts({
          fullList: saleTrendLists,
          ChartList: chartTrend,
          ChartCopy: chartTrend,
        }),
      );
    }
    // deals
    else if (menu?.type === "Deals Probability") {
      let chartProbability = {
        data: [
          {
            ["xaxis"]: "0% to 25%",
            ["Deal_prob"]: 0,
            ["Deal_prob_Count"]: 0,
          },
          {
            ["xaxis"]: "26% to 50%",
            ["Deal_prob"]: 0,
            ["Deal_prob_Count"]: 0,
          },
          {
            ["xaxis"]: "51% to 75%",
            ["Deal_prob"]: 0,
            ["Deal_prob_Count"]: 0,
          },
          {
            ["xaxis"]: "76% to 100%",
            ["Deal_prob"]: 0,
            ["Deal_prob_Count"]: 0,
          },
        ],
        type: "barchart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[5], avatarColors[3]],
      };

      dealProbability?.forEach((item) => {
        let counts = Math.round(item?.Deal_prob);

        if (counts <= 25) {
          chartProbability.data[0].Deal_prob_Count += 1;
          chartProbability.data[0].Deal_prob += 1;
        } else if (counts <= 50) {
          chartProbability.data[1].Deal_prob_Count += 1;
          chartProbability.data[1].Deal_prob += 1;
        } else if (counts <= 75) {
          chartProbability.data[2].Deal_prob_Count += 1;
          chartProbability.data[2].Deal_prob += 1;
        } else if (counts <= 100) {
          chartProbability.data[3].Deal_prob_Count += 1;
          chartProbability.data[3].Deal_prob += 1;
        }
      });

      console.log("chartProbability", dealProbability);
      dispatch(
        setAnalyticCharts({
          fullList: dealProbability,
          ChartList: chartProbability,
          ChartCopy: chartProbability,
        }),
      );
    } else if (menu?.type === "Deals Convertion Rate") {
      let chartDealConversation = {
        data: [],
        type: "barchart",
        size: { width: 650, height: 650 },
        colors: [avatarColors[7], avatarColors[1]],
      };

      let fullListsConvert = dealConvertionRate?.map((item) => {
        return {
          ConversionRate: item?.ConversionRate,
          Month: months[item.Month],
          Year: JSON.stringify(item.Year),
        };
      });

      dealConvertionRate?.forEach((item) => {
        chartDealConversation?.data?.push({
          ["xaxis"]: `${item.Year}-${months[item.Month]}`,
          ["ConversionRate"]: Math.round(item?.ConversionRate),
          ["ConversionRate_Count"]: Math.round(item?.ConversionRate),
        });
      });
      console.log("chartDealConversation", fullListsConvert);
      dispatch(
        setAnalyticCharts({
          fullList: fullListsConvert,
          ChartList: chartDealConversation,
          ChartCopy: chartDealConversation,
        }),
      );
    }
    // customer
    else if (menu?.type === "Customer Churn") {
      let chartChurn = {
        data: [],
        type: "piechart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[2], avatarLightColors[8]],
      };

      customerChurns?.length > 0 &&
        customerChurns?.map((churn) => {
          let findind = chartChurn?.data?.findIndex(
            (item) => item?.xaxis === churn?.Territory,
          );

          if (findind == -1) {
            chartChurn.data.push({
              xaxis: churn?.Territory,
              churn: 1,
            });
          } else {
            chartChurn.data[findind].churn += 1;
          }
        });

      dispatch(
        setAnalyticCharts({
          fullList: customerChurns || [],
          ChartList: chartChurn || [],
          ChartCopy: chartChurn || [],
        }),
      );
      // let chartChurn = {
      //   data: [
      //     { xaxis: "Churn", churn: 0 },
      //     { xaxis: "Not Churn", churn: 0 },
      //   ],
      //   type: "piechart",
      //   size: { width: 650, height: 650 },
      //   colors: [avatarLightColors[2], avatarLightColors[8]],
      // };
      // customerChurn?.length > 0 &&
      //   customerChurn?.map((lead) => {
      //     if (Boolean(lead?.churn === "churned")) {
      //       chartChurn.data[0].churn += 1;
      //     } else {
      //       chartChurn.data[1].churn += 1;
      //     }
      //   });
      // //   console.log("chartChurn", chartChurn);
      // dispatch(
      //   setAnalyticCharts({
      //     fullList: customerChurn || [],
      //     ChartList: chartChurn || [],
      //     ChartCopy: chartChurn || [],
      //   })
      // );
    } else if (menu?.type === "Customer Retain") {
      let chartRetain = {
        data: [],
        type: "piechart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[2], avatarLightColors[8]],
      };

      //   const [customerRetain] = await Promise.all([getCustomerRetain()]);

      let array = [];
      if (customerRetain?.length > 0) {
        customerRetain.map((lead) => {
          let months =
            Number(lead?.Noof_Months) + 12 * Number(lead?.Noof_Years);
          let dataKey = array.findIndex((item) => item?.xaxis === months);

          if (dataKey === -1) {
            array.push({
              xaxis: months,
              count: 1,
            });
          } else {
            array[dataKey].count += 1;
          }
        });
      }

      // Sorting the array based on xaxis values
      array.sort((a, b) => a?.xaxis - b?.xaxis);

      let setDatas = [];

      array?.forEach((data) => {
        let months = data?.xaxis;
        let label = "";

        if (months <= 3) {
          label = "0 to 3 M";
        } else if (months <= 6) {
          label = array[0]?.xaxis >= 3 ? "0 to 6 M" : "3 to 6 M";
        } else if (months <= 9) {
          label = array[0]?.xaxis >= 6 ? "0 to 9 M" : "6 to 9 M";
        } else if (months <= 12) {
          label = array[0]?.xaxis >= 9 ? "0 to 12 M" : "9 to 12 M";
        } else {
          let years = Math.floor(months / 12);

          if (years <= 1) {
            label = array[0]?.xaxis >= 12 ? "0 to 3 Y" : "1 to 3 Y";
          } else if (years <= 3) {
            label = "3 to 6 Y";
          } else if (years <= 6) {
            label = "6 to 9 Y";
          } else {
            label = "9 Y and above";
          }
        }

        let dataKey = setDatas.findIndex((item) => item?.xaxis === label);

        if (dataKey === -1) {
          setDatas.push({
            xaxis: label,
            count: data?.count,
          });
        } else {
          setDatas[dataKey].count += data?.count;
        }
      });

      chartRetain.data = [...setDatas];
      dispatch(
        setAnalyticCharts({
          fullList: customerRetain || [],
          ChartList: chartRetain || [],
          ChartCopy: chartRetain || [],
        }),
      );
    } else {
      dispatch(
        setAnalyticCharts({ fullList: [], ChartList: [], ChartCopy: [] }),
      );
    }
  };

  useEffect(() => {
    fetchSalesData(); // sales
    fetchLeadsData(); // leads
    fetchDealsData(); // deals
    fetchCustomerData(); // deals
    fetchCustomerRetain(); // customersRetain
    fetchLeadQualified();
  }, []);

  console.log("salesForecastsAllData", salesForecastsAllData);
  console.log(
    "all Lists",
    LeadQualificationLists,
    LeadSegmentLists,
    LeadScoreLists,
  );

  return (
    <div className=" h-screen  md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && isSideMenuOptions !== "analytics" ? (
        <>
          <div className="flex justify-between items-center">
            {/* <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <SiShopware color='green' /> <span style={{color:'green'}}>CRM FARM</span>
            </Link> */}
            <Tooltip content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </Tooltip>
          </div>
          <div className="mt-0 ">
            {links?.map((item, idx) => (
              <div key={idx}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-0 uppercase">
                  {item.title}
                </p>
                {item?.links.map((link, idx1) => (
                  <Div
                    key={idx1}
                    onClick={() => handleCloseSideBar(link?.name)}
                    style={{
                      backgroundColor:
                        isSideMenuOptions === link?.name ? currentColor : "",
                    }}
                    className={
                      isSideMenuOptions === link?.name ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    {/* <span className="capitalize ">{link.name}</span> */}
                  </Div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* <JumboScrollbar
            autoHeight={true}
            autoWidth={true}
            autoHideTimeout={4000}
            autoHeightMin={600}
            autoWidthMin={400}
            autoHide={true}
            hideTracksWhenNotNeeded
          > */}

          {analyticssMenu?.map((menu, index) => (
            <React.Fragment key={index}>
              <Div
                hover
                sx={{
                  display: "flex",
                  cursor: "pointer",
                  alignItems: "center",
                  transition: "all 0.5s ease",
                  height: "38px",
                  mt: 0.3,
                  width: "100% !important",
                  backgroundColor:
                    activeColor[0] === index ? currentColor : "#fff",
                  color:
                    activeColor[0] === index ? "white !important" : "black",
                  borderBottom: "2px solid #d6dedf",
                  boxShadow: "2px 2px 5px 0px #d6dedf",
                  "&:hover": {
                    backgroundColor: `${currentColor} !important`,
                    color: "white !important",
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    width: "5px",
                    height: "100%",
                    backgroundColor:
                      activeColor[0] === index
                        ? `${currentColor} !important`
                        : `${currentColor} !important`,
                  },
                  "&:hover::before": {
                    backgroundColor: `#d6dedf !important`,
                  },
                  zIndex: 99999,
                }}
                onClick={(e) => {
                  activeColor[0] !== index
                    ? setActiveColor([index])
                    : setActiveColor([]);
                }}
              >
                <Div sx={{ fontSize: "14px", fontWeight: 600 }}>
                  <IconButton size="small">
                    {activeColor[0] === index ? (
                      <IoIosArrowDown
                        size={17}
                        style={{
                          display: !isMobile ? "" : "none",
                          margin: "0px 8px 0 0",
                          color: "white",
                        }}
                      />
                    ) : (
                      <IoIosArrowForward
                        size={16}
                        style={{
                          display: !isMobile ? "" : "none",
                          margin: "0px 8px 0 0",
                          color: "black",
                        }}
                      />
                    )}
                  </IconButton>
                  {menu?.title}
                </Div>
              </Div>

              {/* Accordion row */}
              {activeColor[0] === index &&
                menu?.links &&
                menu?.links?.length > 0 &&
                menu?.links?.map((sideManu, index1) => {
                  return (
                    <Div
                      sx={{
                        display: activeColor[0] === index ? "flex" : "none",
                        cursor: "pointer",
                        alignItems: "center",
                        height: "35px",
                        width: "100% !important",
                        borderTopRightRadius:
                          activeColor[0] === index && activeColor[1] === index1
                            ? "2%"
                            : "",
                        borderBottomRightRadius:
                          activeColor[0] === index && activeColor[1] === index1
                            ? "2%"
                            : "",
                        boxShadow: "2px 2px 5px 0px #d6dedf",
                        backgroundColor:
                          activeColor[0] === index && activeColor[1] === index1
                            ? "#d6dedf"
                            : "#fff",
                        color: "black",
                        transition: "all 0.5s ease",
                        "&::before": {
                          content: '""',
                          display: "block",
                          width: "5px",
                          height: "100%",
                          backgroundColor:
                            activeColor[0] === index &&
                            activeColor[1] === index1
                              ? `${avatarLightColors[3]} !important`
                              : `${avatarLightColors[3]} !important`,
                        },
                        "&:hover": {
                          backgroundColor:
                            activeColor[0] === index
                              ? `#d6dedf !important`
                              : " ",
                        },
                        marginTop: "4px !important",
                        marginBottom:
                          menu.links.length - 1 == index1 ? "4px" : " ",
                      }}
                      onClick={() => handleSideMenu(sideManu, index, index1)}
                    >
                      <Div
                        sx={{
                          ml: 1,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        <Typography sx={{ ml: 1, fontSize: "12px !important" }}>
                          {sideManu?.icon}
                        </Typography>
                        <Typography sx={{ ml: 1, fontSize: "12px !important" }}>
                          {formatKey(sideManu?.type)}
                        </Typography>
                      </Div>
                    </Div>
                  );
                })}
            </React.Fragment>
          ))}

          {/* </JumboScrollbar> */}
        </>
      )}
    </div>
  );
};

export default memo(Sidebar);
