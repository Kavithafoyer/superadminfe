import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import {
  Grid,
  Grow,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  Colors,
  DisplayFlex,
  FontStyle,
  avatarLightColors,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  Div,
  NoRecordsPage,
  formatDateToMonthYear,
  formatIndianNumber,
  formatKey,
  formatNumberSuffix,
  isDateString,
} from "app/pages/widgets/StylesComponents";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Charts } from "../components/Charts";
import { VscSettings } from "react-icons/vsc";
import { GrPowerReset } from "react-icons/gr";
import Popover from "@mui/material/Popover";
import { setAnalyticCharts } from "app/redux/self_service_BI/ViewOptionSlice";
import { charts } from "../data/dummy";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchIndraSalesForecast,
  fetchSalesForecast,
  selectAllIndraSalesForecasts,
  selectAllSalesForecasts,
} from "app/redux/self_service_BI/SaleForecastSlice";
import { MdDelete } from "react-icons/md";
import { Dropdown, Segmented, Select, Space } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BarsOutlined,
  DownOutlined,
} from "@ant-design/icons";
import axios from "axios";

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

// apis ----------------------------------------------------------------

const getSalesForecast = async () => {
  try {
    const res = await axios.post(
      `https://backend.crmfarm.app/demo/user/Sales_forecast/`,
      {
        Duration: "6",
        Period: "month",
      },
    );
    console.log("Sales_forecast", res?.data);
    return [...res?.data?.actual, ...res?.data?.forecast];
  } catch (error) {
    console.error("Error fetching sales order list:", error);
  }
};

const getIndraSalesForecast = async () => {
  try {
    const res = await axios.post(
      `https://backend.crmfarm.app/demo/user/indra_Salesforecast/`,
      {
        Duration: "6",
        Period: "month",
      },
    );
    console.log("indra_Salesforecast", res?.data);
    return [...res?.data?.actual, ...res?.data?.forecast];
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
    return res?.data?.Trends;
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

const Analytics = () => {
  const dispatch = useDispatch();

  const getSideMenuName = useSelector(
    (state) => state?.selfServiceViewOptions?.sideChildMenuOptions,
  );
  const getChartData = useSelector(
    (state) => state?.selfServiceViewOptions?.analyticCharts,
  );

  const salesForecastsAllData = useSelector(selectAllSalesForecasts);
  const indraSalesForecastsAllData = useSelector(selectAllIndraSalesForecasts);

  console.log(
    "adksdjsabs - - - - -  - -- -  - - - - -",
    salesForecastsAllData,
    indraSalesForecastsAllData,
  );

  const [showFilter, setShowFilter] = useState(false);
  const [errors, setErrors] = useState({
    error: {},
    lengths: [],
  });

  // for segment only
  const [xaxis, setXaxis] = useState("");
  const [yaxis, setYaxis] = useState([]);

  const [segmentRows, setSegmentRows] = useState([
    {
      xaxis: "",
      From: 0,
      To: 0,
    },
    {
      xaxis: "",
      From: 0,
      To: 0,
    },
    {
      xaxis: "",
      From: 0,
      To: 0,
    },
  ]);

  const [duration, setDuration] = useState(1);
  const [period, setPeriod] = useState("Month");
  const [tableView, setTableView] = useState("chart");
  const [salesForecast, setSalesForecast] = useState([]);
  const [indraSalesForecast, setIndraSalesForecast] = useState([]);
  const [salesTrendIndra, setSalesTrendIndra] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [salesForecaseType, setSalesForecaseType] = useState("TrendCRM");
  const [churnOption, setChurnOption] = useState("Territory");

  const getdatalist = async () => {
    try {
      const [
        saleForecastData,
        indraSalesForecastData,
        saleTrendData,
        SalesTrendIndraData,
      ] = await Promise.all([
        getSalesForecast(),
        getIndraSalesForecast(),
        getSalesTrend(),
        getSalesTrendIndra(),
      ]);
      console.log(
        "SalesForecast :  - - - - - - - - - - - - - - - - - - - - -",
        indraSalesForecastData,
      );
      setSalesForecast(
        saleForecastData?.map((item) => ({ ...item, xaxis: item?.Date }) || []),
      );
      setIndraSalesForecast(indraSalesForecastData);
      setSalesTrend(saleTrendData);
      setSalesTrendIndra(SalesTrendIndraData);
    } catch (error) {
      console.log("leadate data error: " + error);
    }
  };

  useEffect(() => {
    getdatalist();
    dispatch(
      fetchSalesForecast({
        Duration: 1,
        Period: "month",
      }),
    );
    dispatch(
      fetchIndraSalesForecast({
        Duration: 1,
        Period: "month",
      }),
    );
  }, []);

  useEffect(() => {
    let chartChurn = {
      data: [],
      type: "piechart",
      size: { width: 650, height: 650 },
      colors: [avatarLightColors[2], avatarLightColors[8]],
    };

    getChartData?.fullList?.length > 0 &&
      getChartData?.fullList?.map((churn) => {
        let findind = chartChurn?.data?.findIndex(
          (item) => item?.xaxis === churn?.[churnOption],
        );

        if (findind == -1) {
          chartChurn.data.push({
            xaxis: churn?.[churnOption],
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
  }, [churnOption]);

  const handleForecastType = async (type) => {
    let sales =
      type === "TrendIndra"
        ? salesTrendIndra
        : type === "TrendCRM"
          ? salesTrend
          : type === "SalesIndra"
            ? indraSalesForecastsAllData
            : salesForecastsAllData;

    if (sales?.length > 0 && (type === "TrendIndra" || type === "TrendCRM")) {
      let chartTrend = {
        data: [],
        type: "linechart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[3], avatarLightColors[6]],
      };

      sales?.forEach((item, idx) => {
        const dateParts =
          type === "TrendIndra"
            ? item?.SO_OrderDate?.split("T")[0]?.split("-")
            : item?.Date?.split("T")[0]?.split("-");
        console.log(" chartTrend: ", dateParts, item?.SO_OrderDate);
        const year = dateParts[0];
        const monthIndex = Number(dateParts[1]);
        const monthName = months[monthIndex];
        const xaxis = `${year}-${monthName}`;
        const newItem = { xaxis };
        if (
          Boolean(item.Trend) ||
          Boolean(type === "TrendIndra" ? item?.Net_Amount : item?.Sales)
        ) {
          newItem[type === "TrendIndra" ? "Net Amount" : "Sales"] = parseFloat(
            type === "TrendIndra" ? item?.Net_Amount : item?.Sales,
          );
          newItem.Trend = parseFloat(item.Trend);
        }
        chartTrend?.data.push(newItem);
      });
      console.log(
        "chartTrend -      - - - - - - - - - - - - - - --  -",
        chartTrend,
      );
      dispatch(
        setAnalyticCharts({
          fullList: sales,
          ChartList: chartTrend,
          ChartCopy: chartTrend,
        }),
      );
    } else if (sales?.length > 0) {
      let chartTrend = {
        data: [],
        type: "linechart",
        size: { width: 650, height: 650 },
        colors: [avatarLightColors[3], avatarLightColors[6]],
      };
      chartTrend.data = sales;

      if (type === "SalesIndra") {
        let trend = [];
        sales?.map((item) => {
          trend.push({ xaxis: item?.Date, ...item });
        });
        chartTrend.data = trend;
      }

      dispatch(
        setAnalyticCharts({
          fullList: sales,
          ChartList: chartTrend,
          ChartCopy: chartTrend,
        }),
      );
    }
  };

  useEffect(() => {
    setDuration(1);
    setPeriod("Month");
    handleForecastType(salesForecaseType);
  }, [salesForecaseType]);

  useEffect(() => {
    handleForecastType("SalesIndra");
  }, [indraSalesForecastsAllData]);

  const shallowCopyChartData = Object.assign({}, getChartData);

  console.log("Original Data:", getChartData);
  console.log("Shallow Copy Data:", shallowCopyChartData);

  const dialogFilter = (event) => {
    setShowFilter(event.currentTarget);
  };

  const closeFilter = () => {
    setShowFilter(null);
  };

  const RefreshData = () => {
    if (Boolean(getSideMenuName == "Lead Segment")) {
      setXaxis("Lead_Industry");
      setSegmentRows([
        {
          xaxis: "",
          From: 0,
          To: 0,
        },
        {
          xaxis: "",
          From: 0,
          To: 0,
        },
        {
          xaxis: "",
          From: 0,
          To: 0,
        },
      ]);
    } else {
      setXaxis("");
      setYaxis([]);
      dispatch(
        setAnalyticCharts({
          ...getChartData,
          fullList: getChartData?.fullList,
          ChartList: getChartData?.ChartCopy,
        }),
      );
    }
  };

  const fetchAxisdata = (e) => {
    e.preventDefault();
    if (
      Boolean(
        getChartData?.ChartList?.type == "piechart" ||
        getChartData?.ChartList?.type == "donutchart",
      ) &&
      Boolean(yaxis?.length > 1)
    ) {
      toast.error(
        `${getChartData?.ChartList?.type} is applicable for only one Xaxis and Yaxis.`,
      );
      dispatch(
        setAnalyticCharts({
          ...getChartData,
          fullList: getChartData?.fullList,
          ChartList: [],
        }),
      );
    } else {
      let lists = {
        ...getChartData?.ChartList,
        data: [],
      };

      // let lists = [];
      getChartData?.fullList?.forEach((data) => {
        yaxis.forEach((axis) => {
          let dataKey = lists.data.findIndex(
            (list) => list.xaxis === data[xaxis],
          );

          if (dataKey !== -1) {
            if (lists.data[dataKey][axis] === data[axis]) {
              lists.data[dataKey][axis + "_Count"]++;
            } else {
              lists.data[dataKey][axis] = data[axis];
              lists.data[dataKey][axis + "_Count"] = 1;
            }
          } else {
            const newEntry = {
              xaxis: data[xaxis],
              [axis]: data[axis],
              [axis + "_Count"]: 1,
            };
            lists?.data?.push(newEntry);
          }
        });
      });

      console.log("Axisssss", lists);
      dispatch(
        setAnalyticCharts({
          ...getChartData,
          fullList: getChartData?.fullList,
          ChartList: lists,
        }),
      );
    }
  };

  const handleChartClick = (value) => {
    if (
      Boolean(value == "piechart" || value == "donutchart") &&
      Boolean(yaxis?.length > 1)
    ) {
      toast.error(`${value} is applicable for only one Xaxis and Yaxis.`);
      dispatch(
        setAnalyticCharts({
          ...getChartData,
          fullList: getChartData?.fullList,
          ChartList: [],
        }),
      );
    } else {
      let updatedChart = { ...getChartData };
      updatedChart.ChartList = { ...updatedChart.ChartList, type: value };
      console.log("updatedChart", updatedChart);
      dispatch(
        setAnalyticCharts({
          ...getChartData,
          fullList: updatedChart?.fullList,
          ChartList: updatedChart?.ChartList,
        }),
      );
    }
  };

  const validate = () => {
    let error = {};
    let lengths = [];

    if (segmentRows && Boolean(xaxis != "Lead_Industry")) {
      segmentRows?.map((item, ind) => {
        if (item.From > item.To) {
          // toast.error(`'To' range should be greater than 'From' range.`);
          error[ind + 1] = "'To' range should be greater than 'From' range.";
        }
      });
    }
    if (segmentRows && Boolean(xaxis != "Lead_Industry")) {
      const rangeSet = new Set();
      segmentRows?.forEach((item, index) => {
        let rangeKey = `${item.From}-${item.To}`;
        if (rangeSet.has(rangeKey)) {
          lengths?.push(
            `Duplicate range "${item.From} - ${item.To}" is not allowed.`,
          );
        } else {
          rangeSet?.add(rangeKey);
        }
      });
    }
    return { error, lengths };
  };

  const fetchSegmentWise = (e) => {
    e.preventDefault();

    let validForm = validate();
    setErrors(validForm);

    console.log("validForm", validForm, validForm?.lengths);
    if (
      Boolean(xaxis == "Lead_Industry" || xaxis == "Lead Score") ||
      (Object.keys(validForm?.error)?.length === 0 &&
        validForm?.lengths?.length === 0)
    ) {
      if (xaxis == "Lead_Industry" || xaxis == "Lead Score") {
        setXaxis("Lead_Industry");
        dispatch(
          setAnalyticCharts({
            ...getChartData,
            fullList: getChartData?.fullList,
            ChartList: getChartData?.ChartCopy,
          }),
        );
      } else {
        let convertedData = segmentRows.map((range) => ({
          ...range,
          [xaxis]: 0,
          xaxis: `${range.From || 0} - ${range.To || 0}`,
        }));

        getChartData?.fullList.forEach((item) => {
          convertedData.forEach((range) => {
            console.log(
              "conditionss",
              item[xaxis],
              range?.From,
              item[xaxis],
              range?.To,
            );
            if (item[xaxis] >= range?.From && item[xaxis] < range?.To) {
              range.xaxis = `${formatNumberSuffix(
                range?.From || 0,
              )} - ${formatNumberSuffix(range?.To || 0)}`;
              range[xaxis]++;
            }
          });
        });

        setSegmentRows(convertedData);
        const cleanedData = convertedData.map((item) => ({
          xaxis: item?.xaxis,
          [xaxis]: item[xaxis],
        }));
        console.log("convertedData", convertedData, cleanedData);
        dispatch(
          setAnalyticCharts({
            ...getChartData,
            ChartList: { ...getChartData?.ChartList, data: cleanedData },
          }),
        );
      }
    }
  };

  const handleSegmentChange = (e, index) => {
    let updatedRows = [...segmentRows];
    let { name, value } = e.target;
    updatedRows[index][name] = Number(value) || 0;

    updatedRows[index].xaxis = `${updatedRows[index].From || 0} - ${
      updatedRows[index].To || 0
    }`;
    setSegmentRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const list = [...segmentRows];
    if (index !== 0) {
      list.splice(index, 1);
    }
    console.log("index", index, list);
    setSegmentRows(list);
  };

  const handleAddRow = () => {
    let newArr = [];
    segmentRows?.map((item, ind) => {
      if (!Boolean(item?.From > 0 || item?.To > 0)) {
        newArr.push(ind);
      }
    });
    console.log("newArr", newArr, segmentRows);
    if (newArr?.length === 0) {
      const items1 = {
        xaxis: "",
        From: 0,
        To: 0,
      };
      setSegmentRows([...segmentRows, items1]);
    } else {
      toast.error(`Please fill the previous rows properly.`);
    }
  };

  useEffect(() => {
    if (
      Boolean(getChartData?.ChartList?.data?.length > 0) &&
      Boolean(getSideMenuName == "Lead Segment")
    ) {
      setXaxis("Lead_Industry");
    } else if (
      Boolean(getChartData?.ChartList?.data?.length > 0) &&
      Boolean(getSideMenuName == "Lead Score")
    ) {
      setXaxis("score");
    } else {
      setXaxis("");
      setYaxis([]);
    }
  }, [getSideMenuName, getChartData]);

  useEffect(() => {
    if (!Boolean(salesForecastsAllData)) return;
    console.log("dispatch rendersss");
    dispatch(
      setAnalyticCharts({
        ...getChartData,
        fullList: salesForecastsAllData,
        ChartList: { ...getChartData?.ChartList, data: salesForecastsAllData },
      }),
    );
  }, [salesForecastsAllData]);

  console.log("From analytics salesForecastsAllData", salesForecastsAllData);
  console.log("segmentRows", {
    getChartData,
    segmentRows,
    keys: Object.keys(
      (getChartData?.fullList?.length > 0 && getChartData?.fullList[0]) || {},
    )?.filter(
      (item) =>
        item == "LeadNoOfEmployees" ||
        item == "Lead_Industry" ||
        item == "TurnOver",
    ),
  });

  let filterButton = getSideMenuName?.includes("Convertion Rate");

  // filter x axis and y axis labels
  const filterValue =
    getSideMenuName == "Lead Segment"
      ? ["LeadNoOfEmployees", "Lead_Industry", "TurnOver"]
      : getSideMenuName == "Lead Score"
        ? ["score"]
        : [];

  useEffect(() => {
    const func = async () => {
      if (salesForecaseType === "SalesIndra") {
        await dispatch(
          fetchIndraSalesForecast({
            Duration: duration,
            Period: period,
          }),
        );
        await handleForecastType("SalesIndra");
      } else if (salesForecaseType === "SalesCRM") {
        await dispatch(
          fetchSalesForecast({
            Duration: duration,
            Period: period,
          }),
        );
      }
    };
    func();
  }, [period, duration]);

  return (
    <>
      {Boolean(getSideMenuName) && (
        <Div
          className="p-4"
          sx={{
            height: `100%`,
            position: "relative",
            width: "100%",
            backgroundColor: "#fff",
          }}
        >
          <div className="flex items-center gap-2 justify-between">
            <div>
              <Typography variant="h1" sx={{ fontWeight: 600 }}>
                Analytics
              </Typography>

              <Typography variant="h3">
                {getSideMenuName === "Customer Retain"
                  ? "Customer Retain (Month Count)"
                  : getSideMenuName == "Lead Qualification"
                    ? "Lead Qualification ( % )"
                    : getSideMenuName}
              </Typography>
            </div>
            {(getSideMenuName == "Sales Trend" ||
              getSideMenuName == "Sales Forecast") && (
              <div className="flex items-center gap-2">
                <CustomButton
                  onClick={() =>
                    setSalesForecaseType(
                      getSideMenuName == "Sales Trend"
                        ? "TrendCRM"
                        : "SalesCRM",
                    )
                  }
                  label="CRM"
                  Icon=""
                />
                <CustomButton
                  onClick={() =>
                    setSalesForecaseType(
                      getSideMenuName == "Sales Trend"
                        ? "TrendIndra"
                        : "SalesIndra",
                    )
                  }
                  label="Indra"
                  Icon=""
                />
              </div>
            )}
          </div>

          <Div>
            <Grid container>
              {/* {Boolean(getSideMenuName) ? ( */}
              <>
                <Grid
                  item
                  xs={6}
                  sx={[
                    DisplayFlex,
                    {
                      justifyContent: filterButton
                        ? "flex-end"
                        : "space-between",
                      mt: 1,
                    },
                  ]}
                >
                  {!Boolean(filterButton) && (
                    <Div className="flex justify-start align-items-end">
                      {getSideMenuName === "Customer Churn" ? (
                        <Select
                          showSearch
                          placeholder="Select a person"
                          optionFilterProp="label"
                          onChange={(value) => setChurnOption(value)}
                          value={churnOption}
                          options={[
                            { label: "Territory", value: "Territory" },
                            { label: "Reason", value: "Reason" },
                          ]}
                        />
                      ) : (
                        <IconButton
                          sx={{ color: Colors?.Mblue }}
                          onClick={dialogFilter}
                        >
                          <VscSettings size={22} />
                        </IconButton>
                      )}
                      <Typography variant="h3">
                        {Boolean(
                          getSideMenuName == "Lead Segment" ||
                          getSideMenuName == "Lead Score",
                        ) && formatKey(xaxis)}
                      </Typography>
                    </Div>
                  )}
                  <Div className="flex">
                    {charts?.map((chart, i) => {
                      let chartView =
                        getSideMenuName == "Lead Segment" ||
                        getSideMenuName == "Lead Score" ||
                        getSideMenuName == "Customer Churn" ||
                        getSideMenuName == "Customer Retain"
                          ? i == 0 || i == 2
                            ? "none"
                            : "block"
                          : getSideMenuName == "Lead Qualification"
                            ? i == 1 || i == 4
                              ? "block"
                              : "none"
                            : getSideMenuName == "Sales Trend" ||
                                getSideMenuName == "Sales Forecast"
                              ? i == 3 || i == 5
                                ? "none"
                                : "Block"
                              : "";
                      console.log("chartView", chartView);

                      return (
                        <IconButton
                          title={chart?.type || ""}
                          key={i + 10}
                          onClick={() => handleChartClick(chart.type)}
                          sx={{
                            pl: "7px",
                            pr: "7px",
                            display: chartView || "block",
                            cursor: "pointer",
                            "&:hover": {
                              color: `${avatarLightColors[i + 2]} !important`,
                            },
                          }}
                        >
                          {chart?.icon}
                        </IconButton>
                      );
                    })}
                  </Div>
                </Grid>
                <Grid item xs={6}></Grid>
              </>
              {/* // ) : ( */}
              {getSideMenuName == "Sales Forecast" && (
                <Grid
                  container
                  item
                  columnSpacing={2}
                  sx={{ display: "flex", justifyContent: "flex-start", my: 1 }}
                >
                  {
                    <Grid item xs={12} md={2}>
                      <Typography
                        id="Typography-root"
                        sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                      >
                        Duration
                      </Typography>
                      <TextField
                        className={`col-12 input-box2`}
                        id="outlined-basic"
                        placeholder="Duration"
                        value={duration || 0}
                        onChange={(e) => {
                          setDuration(Number(e.target.value));
                        }}
                      />
                    </Grid>
                  }
                  {
                    <Grid item xs={12} md={2}>
                      <Typography
                        id="Typography-root"
                        sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                      >
                        Period
                      </Typography>
                      <Autocomplete
                        name="name"
                        className="col-12 search-select3"
                        sx={{
                          bgcolor: "#36c6d3 !important",
                          borderRadius: "5px",
                        }}
                        options={["Year", "Month", "Quarter"]}
                        getOptionLabel={(option) => option || ""}
                        value={period}
                        onChange={(e, newValue) => {
                          setPeriod(newValue);
                        }}
                        id="outlined-basic"
                        renderInput={(params) => (
                          <TextField {...params} placeholder="Period" />
                        )}
                      />
                    </Grid>
                  }
                  <Grid
                    item
                    xs={12}
                    md={8}
                    className="flex justify-end items-end self-end self"
                  >
                    <Segmented
                      onChange={(e) => {
                        setTableView(e);
                        console.log("change : ", e);
                      }}
                      options={[
                        {
                          value: "chart",
                          icon: <BarChartOutlined />,
                        },
                        {
                          value: "table",
                          icon: <BarsOutlined />,
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              )}
              {/* // )} */}
              {Boolean(getSideMenuName === "Sales Trend") && (
                <div className="flex items-center  justify-end w-full">
                  <Segmented
                    onChange={(e) => {
                      setTableView(e);
                      console.log("change : ", e);
                    }}
                    options={[
                      {
                        value: "chart",
                        icon: <BarChartOutlined />,
                      },
                      {
                        value: "table",
                        icon: <BarsOutlined />,
                      },
                    ]}
                  />
                </div>
              )}
              {(getSideMenuName === "Sales Forecast" ||
              getSideMenuName == "Sales Trend"
                ? tableView === "chart"
                  ? true
                  : false
                : true) && (
                <Grid
                  item
                  xs={12}
                  md={
                    Boolean(getSideMenuName == "Sales Forecast") ||
                    Boolean(getSideMenuName === "Sales Trend")
                      ? 12
                      : 6
                  }
                  className="card p-3 overflow-x-auto w-full"
                  sx={{
                    maxHeight: "500px !important",
                    mt:
                      Boolean(getSideMenuName == "Sales Forecast") ||
                      Boolean(getSideMenuName === "Sales Trend")
                        ? 1
                        : 0,
                  }}
                >
                  {Boolean(getChartData?.ChartList?.data?.length > 0) ? (
                    <Charts chartType={getChartData?.ChartList} />
                  ) : (
                    <NoRecordsPage
                      height="50%"
                      width="50%"
                      title={getSideMenuName}
                    />
                  )}
                </Grid>
              )}
              {(getSideMenuName === "Sales Forecast" ||
              getSideMenuName === "Sales Trend"
                ? tableView === "table"
                  ? true
                  : false
                : true) && (
                <Grid
                  item
                  xs={12}
                  md={
                    getSideMenuName === "Sales Forecast" ||
                    Boolean(getSideMenuName === "Sales Trend")
                      ? 12
                      : 6
                  }
                  className="card p-3 overflow-x-auto w-full "
                  sx={{
                    maxHeight: "480px !important",
                    width: "100% !important",
                  }}
                >
                  <div className="bg-white">
                    <JumboScrollbar
                      autoHeight={true}
                      autoWidth={true}
                      autoHideTimeout={4000}
                      autoHeightMin={500}
                      autoWidthMin={400}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                    >
                      {getChartData?.fullList?.length > 0 ? (
                        <Grow
                          in={true}
                          style={{ transformOrigin: "0 0 0" }}
                          {...(true ? { timeout: 500 } : {})}
                        >
                          <Table
                            key={100}
                            stickyHeader
                            className="w-full"
                            sx={{
                              maxWidth:
                                getSideMenuName === "Sales Forecast"
                                  ? "100% !important"
                                  : "600px !important",
                              minWidth: "600px !important",
                              width:
                                getSideMenuName === "Sales Forecast"
                                  ? "100% !important"
                                  : "600px !important",
                            }}
                          >
                            <TableHead key={100 + 200}>
                              <TableRow>
                                {getChartData?.fullList?.length > 0 &&
                                  Object.entries(
                                    getChartData?.fullList[0] || {},
                                  )?.map(([column, columnData], index) => (
                                    <>
                                      {console.log(
                                        "columnData",
                                        column,
                                        "----",
                                        columnData,
                                        [column, columnData],
                                      )}
                                      <TableCell
                                        sx={{
                                          cursor: "pointer",
                                          padding: "0px 10px  !important",
                                          fontSize: "13px ",
                                          backgroundColor: `#F3F3F3 !important`,
                                          color: `#10BBE5 !important`,
                                          fontWeight: "500",
                                          boxShadow: "none",
                                          minWidth: "150px !important",
                                        }}
                                        key={index}
                                      >
                                        {formatKey(column)}
                                      </TableCell>
                                    </>
                                  ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getChartData?.fullList?.length > 0 ? (
                                getChartData?.fullList?.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    {Object.values(row)?.map(
                                      (cell, cellIndex) => (
                                        <>
                                          {typeof cell !== "object" &&
                                            !Array.isArray(cell) && (
                                              <TableCell
                                                sx={{
                                                  boxShadow: "none",
                                                  fontSize: "12px !important",
                                                  fontWeight: "400 !important",
                                                  padding:
                                                    "5px 10px !important",
                                                }}
                                                key={cellIndex}
                                              >
                                                {typeof cell === "string"
                                                  ? isDateString(cell)
                                                    ? formatDateToMonthYear(
                                                        cell,
                                                      )
                                                    : cell
                                                  : formatIndianNumber(cell)}
                                              </TableCell>
                                            )}
                                        </>
                                      ),
                                    )}
                                  </TableRow>
                                ))
                              ) : (
                                <TableCell sx={[DisplayFlex]}>
                                  No Charts
                                </TableCell>
                              )}
                            </TableBody>
                          </Table>
                        </Grow>
                      ) : (
                        <NoRecordsPage
                          height="50%"
                          width="50%"
                          title={getSideMenuName}
                          style={[DisplayFlex, { justifyContent: "center" }]}
                        />
                      )}
                    </JumboScrollbar>
                  </div>
                </Grid>
              )}
            </Grid>
          </Div>
        </Div>
      )}

      {/* popup filter */}
      <Popover
        open={Boolean(showFilter)}
        anchorEl={showFilter}
        onClose={closeFilter}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        sx={{ minWidth: "300px", width: { xs: "100%", md: "40%" } }}
      >
        {Boolean(
          getSideMenuName !== "Lead Segment" &&
          getSideMenuName !== "Lead Score",
        ) ? (
          <Div>
            <Div
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                boxShadow: 1,
              }}
            >
              <Typography id="Typography-root">Axis Setup</Typography>
              <IconButton sx={{ mr: -1 }} onClick={RefreshData}>
                <GrPowerReset size={16} />
              </IconButton>
            </Div>

            <form style={{ padding: "1rem" }} onSubmit={fetchAxisdata}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                  >
                    X-axis
                  </Typography>
                  <Autocomplete
                    className="col-12 search-select3"
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return formatKey(option);
                      }
                      if (option && option) {
                        return formatKey(option);
                      }
                      return "";
                    }}
                    options={Object.keys(
                      (getChartData?.fullList?.length > 0 &&
                        getChartData?.fullList[0]) ||
                        {},
                    )}
                    value={xaxis}
                    onChange={(e, newValue) => {
                      setXaxis(newValue);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="X-Axis" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                  >
                    Y-axis
                  </Typography>
                  <Autocomplete
                    multiple
                    limitTags={1}
                    name="name"
                    className="col-12 search-select3"
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return formatKey(option);
                      }
                      if (option && option) {
                        return formatKey(option);
                      }
                      return "";
                    }}
                    options={Object.keys(
                      (getChartData?.fullList?.length > 0 &&
                        getChartData?.fullList[0]) ||
                        {},
                    )}
                    value={yaxis}
                    onChange={(e, newValue) => {
                      setYaxis(newValue);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Y-Axis" />
                    )}
                  />
                </Grid>
              </Grid>
              <Div
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  gap: "10px",
                }}
              >
                <Cancelbutton onClick={closeFilter} />
                <CustomButton type="submit" label="Apply" Icon="filterIcon" />
              </Div>
            </form>
          </Div>
        ) : (
          <Div>
            {" "}
            {/* for segment only*/}
            <Div
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1,
                boxShadow: 1,
              }}
            >
              <Typography id="Typography-root">Segment Setup</Typography>
              <IconButton sx={{ mr: -1 }} onClick={RefreshData}>
                <GrPowerReset size={16} />
              </IconButton>
            </Div>
            <form style={{ padding: "1rem" }} onSubmit={fetchSegmentWise}>
              <Grid container spacing={1}>
                <Grid
                  item
                  xs={12}
                  className={`${
                    getSideMenuName == "Lead Score"
                      ? "flex items-center gap-3"
                      : ""
                  }`}
                >
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                  >
                    X-axis
                  </Typography>
                  {getSideMenuName == "Lead Score" ? (
                    <Typography
                      id="Typography-root"
                      sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                    >
                      Score
                    </Typography>
                  ) : (
                    <Autocomplete
                      className="col-12 search-select3"
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return formatKey(
                            option === "LeadNoOfEmployees"
                              ? "Company Size"
                              : option,
                          );
                        }
                        if (option && option) {
                          return formatKey(
                            option === "LeadNoOfEmployees"
                              ? "Company Size"
                              : option,
                          );
                        }
                        return "";
                      }}
                      options={Object.keys(
                        (getChartData?.fullList?.length > 0 &&
                          getChartData?.fullList[0]) ||
                          {},
                      )?.filter((item) => filterValue.includes(item))}
                      value={xaxis}
                      onChange={(e, newValue) => {
                        setXaxis(newValue);
                        setSegmentRows(
                          segmentRows.map((row) => ({
                            ...row,
                            [newValue]: 0,
                            From: 0,
                            To: 0,
                          })),
                        );
                      }}
                      id="outlined-basic"
                      renderInput={(params) => (
                        <TextField {...params} placeholder="X-Axis" />
                      )}
                    />
                  )}
                </Grid>
                {Boolean(
                  xaxis == "TurnOver" ||
                  xaxis == "LeadNoOfEmployees" ||
                  xaxis == "score",
                ) && (
                  <>
                    {segmentRows?.map((item, idx) => (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { textAlign: "left" }]}
                          >
                            Range {idx + 1}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            className={`col-12 search-select3`}
                            id="outlined-basic"
                            placeholder="From"
                            name="From"
                            value={item?.From || 0}
                            onChange={(e) => handleSegmentChange(e, idx)}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TextField
                            InputProps={{
                              style: {
                                border: errors?.error?.[idx + 1]
                                  ? "1px solid red"
                                  : "none",
                                borderRadius: "5px",
                              },
                            }}
                            className={`col-12 search-select3`}
                            id="outlined-basic"
                            placeholder="To"
                            name="To"
                            value={item?.To || 0}
                            onChange={(e) => handleSegmentChange(e, idx)}
                          />
                        </Grid>
                        <Grid item xs={2} className="flex justify-start">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveRow(idx)}
                          >
                            <MdDelete size={20} />
                          </IconButton>
                        </Grid>
                        <Typography
                          id="Typography-root"
                          sx={{ color: "red", fontSize: 12, pl: 1 }}
                        >
                          {errors?.error[idx + 1]}
                        </Typography>
                      </>
                    ))}
                  </>
                )}
                <Typography
                  id="Typography-root"
                  sx={{ color: "red", fontSize: 12, pl: 2 }}
                >
                  {errors?.lengths[0]}
                </Typography>
              </Grid>
              {Boolean(
                xaxis == "TurnOver" ||
                xaxis == "LeadNoOfEmployees" ||
                xaxis == "score",
              ) && (
                <Button
                  onClick={handleAddRow}
                  sx={{ textTransform: "capitalize", fontSize: 12, mt: 1 }}
                >
                  + Add more segment
                </Button>
              )}
              <Div
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  gap: "10px",
                }}
              >
                <Cancelbutton onClick={closeFilter} />
                <CustomButton type="submit" label="Apply" Icon="filterIcon" />
              </Div>
            </form>
          </Div>
        )}
      </Popover>
      <ToastContainer />
    </>
  );
};

export default memo(Analytics);
