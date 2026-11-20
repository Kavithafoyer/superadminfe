// reducers.js

// import { SET_GOOGLE_MAPS_API_KEY } from "../actions/locationkey";

// const initialState = {
//   googleMapsApiKey: null,
// };


// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_GOOGLE_MAPS_API_KEY:
//       return {
//         ...state,
//         googleMapsApiKey: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";

export const getGeoLocationKey = createAsyncThunk("chat/allusers", async () => {
  // const res = await axios.get(
  //   `${BASE_URL}/user/MapConfigurationCRUD/?User_Id=${localStorage.getItem(
  //     "UserId"
  //   )}`,
  //   {
  //     headers: {
  //       db: "crmuseradmin1",
  //       Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }
  // );

  // return res?.data?.API_Key;
  return null;
});

// Fetch the Gmail Details

export const GmailSecertKey = createAsyncThunk("/check", async () => {
  // const res = await axios.get(
  //   `${BASE_URL}/user/UserGmailConfigurationCRUD/?User_Id=${localStorage.getItem(
  //     "UserId"
  //   )}`,
  //   {
  //     headers: {
  //       db: "crmuseradmin1",
  //       Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   }
  // );
  // return res;
  return { data: { Client_Id: "", API_Key: "" } };
});

const initialState = {
  geoLocationKey: "",

  Clien_Id: "",
  API_Key: "",
  status: "idle",
  error: null,
};

export const GeoLocationSlicer = createSlice({
  name: "geoLocationReducer",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // fetch promises
      .addCase(getGeoLocationKey.fulfilled, (state, action) => {
        state.status = "success";
        console?.log("API_Key  : ", action.payload);
        state.geoLocationKey = action.payload;
      })
      .addCase(GmailSecertKey?.fulfilled, (state, action) => {
        state.status = "success";
        console?.log("API_Key2 : ", action.payload?.data);
        state.Clien_Id = action?.payload?.data?.Client_Id;
        state.API_Key = action?.payload?.data?.API_Key;
      });
  },
});

export const locationKey = (state) => state?.geoLocationReducer?.geoLocationKey;

export const Key = (state) => state?.geoLocationReducer?.Clien_Id;

export const apikey = (state) => state?.geoLocationReducer?.API_Key;

export default GeoLocationSlicer.reducer;
