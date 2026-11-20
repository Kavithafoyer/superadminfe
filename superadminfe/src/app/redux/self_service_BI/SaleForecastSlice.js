import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

// Common adapter function to generate unique ID
const createForecastAdapter = (prefix) =>
  createEntityAdapter({
    selectId: (forecast) =>
      `${forecast.xaxis}-${forecast?.actual ?? forecast?.forecast}`,
  });

const salesForecastAdapter = createForecastAdapter("salesForecast");
const indraSalesForecastAdapter = createForecastAdapter("indraSalesForecast");

// Define the initial state
const initialState = {
  loading: false,
  error: null,
  salesForecasts: salesForecastAdapter.getInitialState(),
  indraSalesForecasts: indraSalesForecastAdapter.getInitialState(),
};

// Function to transform response data
const transformResponseData = (response) => {
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

  let saleForcastValue = [...response.data?.actual, ...response.data?.forecast];

  const transformedData = saleForcastValue.map((item) => {
    const dateParts = item?.Date?.split("T")[0]?.split("-");
    const year = dateParts[0];
    const monthIndex = Number(dateParts[1]);
    const monthName = months[monthIndex];
    const xaxis = `${year}-${monthName}`;
    const newItem = { xaxis };
    if (item.Sales !== undefined) {
      newItem.Sales = item?.Sales;
    }
    if (item.Forecast !== undefined) {
      newItem.Forecast = item.Forecast;
    }
    return newItem;
  });

  return transformedData;
};

// Fetch sales forecast
export const fetchSalesForecast = createAsyncThunk(
  "salesForecast/fetchSalesForecast",
  async (params) => {
    const payload = {
      Duration: params?.Duration,
      Period: params?.Period?.toLowerCase(),
    };
    const response = await axios.post(
      "https://backend.crmfarm.app/demo/user/Sales_forecast/",
      payload,
    );
    return transformResponseData(response);
  },
);

// Fetch Indra sales forecast
export const fetchIndraSalesForecast = createAsyncThunk(
  "salesForecast/fetchIndraSalesForecast",
  async (params) => {
    const payload = {
      Duration: params?.Duration,
      Period: params?.Period?.toLowerCase(),
    };

    const response = await axios.post(
      "https://backend.crmfarm.app/demo/user/indra_Salesforecast/",
      payload,
    );
    return transformResponseData(response);
  },
);

// Slice definition
const salesForecastSlice = createSlice({
  name: "salesForecast",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesForecast.fulfilled, (state, { payload }) => {
        state.loading = false;
        salesForecastAdapter.setAll(state.salesForecasts, payload);
      })
      .addCase(fetchSalesForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIndraSalesForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndraSalesForecast.fulfilled, (state, { payload }) => {
        state.loading = false;
        indraSalesForecastAdapter.setAll(state.indraSalesForecasts, payload);
      })
      .addCase(fetchIndraSalesForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default salesForecastSlice.reducer;

// Export selectors
export const { selectAll: selectAllSalesForecasts } =
  salesForecastAdapter.getSelectors(
    (state) => state.salesForecast.salesForecasts,
  );

export const { selectAll: selectAllIndraSalesForecasts } =
  indraSalesForecastAdapter.getSelectors(
    (state) => state.salesForecast.indraSalesForecasts,
  );
