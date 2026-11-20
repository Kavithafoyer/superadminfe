/* eslint-disable no-param-reassign */
// reducers/viewOptionReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showData: true,
  sideMenuOptions: "report",
  charts: [],
  tables: [],
  selectChart: null,
  selectTable: 0,
  tableHeads: [],
  // for analysis
  sideChildMenuOptions: "",
  analyticCharts: []
};
export const viewOptionSlice = createSlice({
  name: "selfServiceViewOptions",
  initialState,
  reducers: {
    setShowData: (state, action) => {
      state.showData = action.payload;
    },
    setSideMenuOptions: (state, action) => {
      state.sideMenuOptions = action.payload;
    },
    // charts crud
    setCharts: (state, action) => {
      console.log("charts", action.payload);
      state.charts.push(action.payload);
    },
    setUpdateCharts: (state, action) => {
      state.charts = action.payload;
    },
    selectChart: (state, action) => {
      state.selectChart = action.payload;
    },
    removeCharts: (state, action) => {
      state.charts = state.charts?.filter(
        (charts) => charts?.id !== action.payload
      );
    },
    replaceCharts: (state, action) => {
      const charIdx = state.charts?.findIndex(
        (charts) => charts.id === action.payload?.id
      );
      state.charts.splice(charIdx, 1, action.payload?.chart);
    },
    // Table crud functions
    setTables: (state, action) => {
      state.tables.push(action.payload);
    },
    removeTable: (state, action) => {
      state.tables = state.tables?.filter(
        (table) => table?.id !== action.payload
      );
    },
    // table headers
    setTableHeads: (state, action) => {
      if (action?.payload) {
        state.tableHeads.push(action.payload);
      }
    },
    setTableHeadsVisibles: (state, action) => {
      if (action?.payload) {
        state.tableHeads = action.payload;
      }
    },
    // select table
    setSelectTable: (state, action) => {
      state.selectTable = action?.payload || 0;
    },


    // for analytics

    setSideChildMenuOptions: (state, action) => {
      state.sideChildMenuOptions = action?.payload;
    },
    setAnalyticCharts: (state, action) => {
      console.log("setAnalyticCharts", action.payload);

      state.analyticCharts = action.payload;
    },
  },
});

export const {
  setShowData,
  setSideMenuOptions,
  setCharts,
  setUpdateCharts,
  removeCharts,
  replaceCharts,
  setTables,
  removeTable,
  setTableHeads,
  setSelectTable,
  setTableHeadsVisibles,
  selectChart,

  // for analytics
  setSideChildMenuOptions,
  setAnalyticCharts
} = viewOptionSlice.actions;
// export const getCharts = (state) => state.selfServiceViewOptions; // Selector for accessing showData state

export default viewOptionSlice.reducer;
