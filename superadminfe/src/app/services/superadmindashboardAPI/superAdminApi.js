import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const superAdminApi = createApi({
  reducerPath: "superAdminApi",
  tagTypes: ["Tasks", "TicketManagementCRUD", "MenuFeatures"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.crmfarm.in/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accesstoken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSubscriptionAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/SubscriptionAnalyticsAPI/`,
    }),
    getSubscriptionInsights: builder.query({
      query: () => `${getTenant()}/superadmin/SubscriptionInsightsAPI/`,
    }),
    getUsageAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/UsageAnalyticsAPI/`,
    }),
    getInstanceAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/InstanceAnalyticsAPI/`,
    }),
    getProductDropdown: builder.query({
      query: () => `${getTenant()}/superadmin/ProductDropdownAPI/`,
    }),
    getMenuList: builder.query({
      query: () => `${getTenant()}/auth/MenuWithoutPagination/`,
      providesTags: ["MenuFeatures"],
    }),
    getMenuListByProduct: builder.query({
      query: (product) => `${getTenant()}/auth/MenuListproductwithoutpagination/?product=${product}`,
      providesTags: ["MenuFeatures"],
    }),

    getPaymentDashboardAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/PaymentDashboardAnalytics/`,
    }),
    getRenewalDashboardAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/RenewalDashboardAnalytics/`,
    }),
    getRenewalFunnelAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/RenewalFunnelAnalytics/`,
    }),
    getCancellationOverviewAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/CancellationOverviewAnalytics/`,
    }),
    getPlanAdoptionDashboardAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/PlanAdoptionDashboardAnalytics/`,
    }),
    getTopPlansDistributionAnalytics: builder.query({
      query: () => `${getTenant()}/superadmin/TopPlansDistributionAnalytics/`,
    }),
    getRevenueForecastDashboard: builder.query({
      query: () => `${getTenant()}/superadmin/RevenueForecastDashboard/`,
    }),
    getRequestOperationsDashboard: builder.query({
      query: () => `${getTenant()}/superadmin/RequestOperationsDashboard/`,
    }),
    createPlan: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/planCRUD/`,
        method: "POST",
        body: payload,
      }),
    }),
    updatePlan: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/planCRUD/`,
        method: "PATCH",
        body: payload,
      }),
    }),
    getPlanById: builder.query({
      query: (id) => `${getTenant()}/superadmin/planCRUD/?id=${id}`,
    }),
    createMenu: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/auth/menuCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MenuFeatures"],
    }),
    updateMenu: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/auth/menuCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["MenuFeatures"],
    }),
    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `${getTenant()}/auth/menuCRUD/`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["MenuFeatures"],
    }),
    getRolePermissionByRoleId: builder.query({
      query: (roleId) => `${getTenant()}/auth/rolePermissionCRUD/?role_id=${roleId}`,
    }),
    updateRolePermission: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/auth/rolePermissionCRUD/`,
        method: "PATCH",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionAnalyticsQuery,
  useGetSubscriptionInsightsQuery,
  useGetUsageAnalyticsQuery,
  useGetInstanceAnalyticsQuery,
  useGetProductDropdownQuery,
  useGetMenuListQuery,
  useGetMenuListByProductQuery,
  useGetPaymentDashboardAnalyticsQuery,
  useGetRenewalDashboardAnalyticsQuery,
  useGetRenewalFunnelAnalyticsQuery,
  useGetCancellationOverviewAnalyticsQuery,
  useGetPlanAdoptionDashboardAnalyticsQuery,
  useGetTopPlansDistributionAnalyticsQuery,
  useGetRevenueForecastDashboardQuery,
  useGetRequestOperationsDashboardQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useGetPlanByIdQuery,
  useLazyGetPlanByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetRolePermissionByRoleIdQuery,
  useLazyGetRolePermissionByRoleIdQuery,
  useUpdateRolePermissionMutation,
} = superAdminApi;
