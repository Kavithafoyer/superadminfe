import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const addonApi = createApi({
    reducerPath: 'addonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://backend.crmfarm.in/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accesstoken");
            const dbName = localStorage.getItem("DBName");
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (dbName) {
                headers.set('db', dbName);
            }
            headers.set('Accept', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createAddon: builder.mutation({
            query: (payload) => ({
                url: `crmfarmsa/superadmin/Addon/`,
                method: 'POST',
                body: payload,
            }),
        }),
        updateAddon: builder.mutation({
            query: (payload) => ({
                url: `crmfarmsa/superadmin/Addon/`,
                method: 'PUT',
                body: payload,
            }),
        }),
        getAddonList: builder.query({
            query: () => ({
                url: `crmfarmsa/superadmin/AddonListAPI/`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useCreateAddonMutation, useUpdateAddonMutation, useGetAddonListQuery } = addonApi;
