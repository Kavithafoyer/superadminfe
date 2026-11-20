import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatBaseApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.crmfarm.in/crmfarmsa/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accesstoken");
      const dbName = localStorage.getItem("DBName") || "crmuseradmin1";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("db", dbName);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "ChatUsers",
    "ChatMessages",
    "ChatCount",
    "Rooms",
    "Messages",
    "Participants",
    "Reactions",
    "ChatNotificationSettings",
  ],
  endpoints: () => ({}),
});
