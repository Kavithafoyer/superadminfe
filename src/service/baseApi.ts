import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshAccessToken } from "./tokenRefresh";

import { getTenantName, normalizeApiUrl } from './tenant';
export { getTenantName, normalizeApiUrl } from './tenant';

/**
 * Base RTK Query API slice for the application.
 * Follows the pattern: [main backend url] / [tenant] / [backend path] / [endpoint]
 * e.g. https://backend.crmfarm.app/crmfarmsa/superadmin/SubscriptionInsightsAPI/
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: async (args, api, extraOptions: { skipHostFallback?: boolean; skipAuth?: boolean }) => {
    const tenantName = getTenantName();
    const primaryHost = normalizeApiUrl();
    const fallbackHost = 'https://backend.crmfarm.in';
    const useFallbackHost = primaryHost !== fallbackHost && !extraOptions?.skipHostFallback;

    const executeQuery = (host: string) => {
      const baseUrl = `${host}/${tenantName}/`;
      return fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
          const dbName = (typeof window !== 'undefined' && localStorage.getItem("DBName")) || "crmuseradmin1";
          headers.set("db", dbName);
          headers.set("Db", dbName);
          headers.set("Accept", "application/json");
          if (extraOptions?.skipAuth) return headers;
          if (typeof window !== 'undefined') {
            const token =
              localStorage.getItem("token") ||
              localStorage.getItem("accesstoken") ||
              localStorage.getItem("access_token") ||
              "";
            if (token && token !== 'null' && token !== 'undefined') {
              headers.set("Authorization", `Bearer ${token}`);
            }
          }
          return headers;
        },
      })(args, api, extraOptions);
    };

    let result = await executeQuery(primaryHost);

    // If request failed due to CORS / FETCH_ERROR and primaryHost was different from fallbackHost
    if (useFallbackHost && result.error && (result.error.status === 'FETCH_ERROR' || result.error.status === 404)) {
      console.warn(`[baseApi] Request to ${primaryHost} failed with ${result.error.status}. Retrying with fallback ${fallbackHost}...`);
      result = await executeQuery(fallbackHost);
    }

    // Handle Token Expiration (401 Unauthorized)
    if (result.error && result.error.status === 401 && !extraOptions?.skipAuth) {
      console.warn('[baseApi] 401 Unauthorized detected. Attempting automatic token refresh...');
      const newToken = await refreshAccessToken();
      if (newToken) {
        console.log('[baseApi] Token refreshed successfully. Retrying request with new access token...');
        result = await executeQuery(primaryHost);
        if (useFallbackHost && result.error && (result.error.status === 'FETCH_ERROR' || result.error.status === 404)) {
          result = await executeQuery(fallbackHost);
        }
      } else {
        console.warn('[baseApi] Token refresh was not possible. Retaining local session without force-logout.');
      }
    }

    return result;
  },
  tagTypes: [
    "User",
    "Profile",
    "Settings",
    "Items",
    "SuperAdmin",
    "Plans",
    "Subscriptions",
    "Accounts",
    "Invoices",
    "Payments",
    "InstanceRequests",
    "InstanceCreations",
    "AdditionalLicenses",
    "AddonSubscriptions",
    "AdditionalStorages",
    "RenewalDues",
    "CancelPlans",
    "Tasks",
    "TicketGroups",
    "Tickets",
    "ProductMasters",
    "ProductMenus",
    "CompanyDetails",
    "Roles",
    "StorageMaster",
    "UserMaster",
    "AddonMaster",
    "AddonProductCompatibility",
    "AddonCategories",
    "SystemPreferences",
  ],
  endpoints: () => ({}),
});

// Backward compatibility alias
export const crmBaseApi = baseApi;
