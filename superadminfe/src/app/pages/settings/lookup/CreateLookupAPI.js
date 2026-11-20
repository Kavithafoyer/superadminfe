import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const createLookupApi = createApi({
  reducerPath: "createLookupApi",
  baseQuery: fetchBaseQuery({
    // Following the pattern from superAdminApi.js
    baseUrl: "https://backend.crmfarm.in/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accesstoken");
      const dbName = localStorage.getItem("DBName");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      if (dbName) {
        headers.set("db", dbName);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createLookup: builder.mutation({
      query: (payload) => ({
        url: `crmfarmsa/useradmin/Userlookup/`,
        method: "POST",
        body: payload,
      }),
    }),
    getLookupList: builder.query({
      query: () => ({
        url: `crmfarmsa/useradmin/Userlookuplist/`,
        method: "GET",
      }),
    }),
    deleteLookup: builder.mutation({
      query: (id) => ({
        url: `crmfarmsa/useradmin/Userlookup/?id=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLookupMutation,
  useGetLookupListQuery,
  useDeleteLookupMutation,
} = createLookupApi;
