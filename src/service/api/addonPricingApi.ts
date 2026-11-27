import type { PricingTier } from "./addonPriceTemplateApi";
import { baseApi } from "../baseApi";
import { broadcastPricingChange, pricingTags } from "../compatibilitySync";

export interface TierScheduleDetails {
  Code: string;
  Name: string;
  Billing_Cycle: string;
  Method: string;
  Usage_Metric: string;
}

export interface PricingOptions {
  Model?: string;
  Billing_Cycle?: string;
  Allow_Annual_Billing?: boolean;
  Require_Approval?: boolean;
  Marketplace_Visible?: boolean;
  Allow_Trial?: boolean;
  Annual_Discount?: string | null;
  Edition_Rates?: {
    Plan: number;
    Rate: string;
    Trial_Days: number;
    Active: boolean;
  }[];
}

export interface AddonPricingDto {
  id: number;
  AddonPricing_Id: string;
  Addon: number;
  Price_Template: number;
  Addon_Name: string | null;
  Price_Template_Name: string | null;
  Pricing_Options?: PricingOptions;
  Tier_Schedule?: Partial<TierScheduleDetails> & { Customized?: boolean };
  Tiers?: (PricingTier & { id?: number; Is_Active?: boolean })[];
  Base_Price: string | number;
  Effective_From: string;
  Effective_To: string | null;
  Is_Active: boolean;
  Is_Deleted: boolean;
  Created_By?: number | any;
  Updated_By?: number | any;
  Created_Date?: string;
  Updated_Date?: string;
  // Enriched fields from to_representation
  Category?: string;
  Addon_Code?: string;
  License_Model?: string;
  Pricing_Model?: string;
  Billing_Cycle?: string;
  Currency?: string;
  Template_Code?: string;
}

export interface AddonPricingKPI {
  total_rules: number;
  fixed_rates: number;
  tiered_rates: number;
  usage_based: number;
  active_rules: number;
  inactive_rules: number;
}

export interface AddonPricingFilterParams {
  category?: string;
  pricing_model?: string;
  status?: string;
  search?: string;
  Is_Active?: boolean;
  fromdate?: string;
  todate?: string;
  page?: number;
}

const prefix = "superadmin/AddonPricing";
const crud = prefix + "CRUD/";
const extraOptions = { skipHostFallback: true };
const tags = ["AddonPricing"] as const;

export const addonPricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. KPI Charts & Metrics Endpoint
    getAddonPricingKPI: builder.query<AddonPricingKPI, void>({
      query: () => prefix + "KPI/",
      providesTags: tags,
      extraOptions,
    }),

    // 2. List Without Pagination Endpoint
    getAddonPricingWithoutPagination: builder.query<AddonPricingDto[], void>({
      query: () => ({ url: prefix + "listwithoutpaginaton/", method: "GET" }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.results || [],
      providesTags: tags,
      extraOptions,
    }),

    // 4. Search Endpoint (GET superadmin/AddonPricingSearch/?search=...)
    searchAddonPricing: builder.query<AddonPricingDto[], string>({
      query: (search) => ({
        url: prefix + "Search/",
        params: { search: search ? String(search).trim() : "" },
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.results || [],
      providesTags: tags,
      extraOptions,
    }),

    // 5. Filter Endpoint (POST superadmin/AddonPricingFilter/)
    filterAddonPricing: builder.query<
      AddonPricingDto[],
      AddonPricingFilterParams
    >({
      query: (filters) => ({
        url: prefix + "Filter/",
        method: "POST",
        body: filters,
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.results || [],
      providesTags: tags,
      extraOptions,
    }),

    filterAddonPricingMutation: builder.mutation<
      AddonPricingDto[],
      AddonPricingFilterParams
    >({
      query: (filters) => ({
        url: prefix + "Filter/",
        method: "POST",
        body: filters,
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.results || [],
      extraOptions,
    }),

    // 6. CRUD Endpoints
    getAddonPricingById: builder.query<AddonPricingDto, string | number>({
      query: (id) => `${crud}?id=${id}`,
      providesTags: tags,
      extraOptions,
    }),

    createAddonPricing: builder.mutation<
      AddonPricingDto,
      Partial<AddonPricingDto>
    >({
      query: (body) => ({
        url: crud,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, error) => (error ? [] : [...pricingTags]),
      onQueryStarted: broadcastPricingChange,
      extraOptions,
    }),

    updateAddonPricing: builder.mutation<
      AddonPricingDto,
      Partial<AddonPricingDto> & { id: number | string }
    >({
      query: (body) => ({
        url: crud,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, error) => (error ? [] : [...pricingTags]),
      onQueryStarted: broadcastPricingChange,
      extraOptions,
    }),

    deleteAddonPricing: builder.mutation<
      { message: string; id: number | string },
      number | string
    >({
      query: (id) => ({
        url: `${crud}?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error) => (error ? [] : [...pricingTags]),
      onQueryStarted: broadcastPricingChange,
      extraOptions,
    }),
  }),
});

export const {
  useGetAddonPricingKPIQuery,
  useGetAddonPricingWithoutPaginationQuery,
  useSearchAddonPricingQuery,
  useLazySearchAddonPricingQuery,
  useFilterAddonPricingQuery,
  useLazyFilterAddonPricingQuery,
  useFilterAddonPricingMutationMutation,
  useGetAddonPricingByIdQuery,
  useCreateAddonPricingMutation,
  useUpdateAddonPricingMutation,
  useDeleteAddonPricingMutation,
} = addonPricingApi;

/**
 * Downloads Addon Pricing records as a CSV file directly from the backend AddonPricingExport API.
 * Streams data directly into browser memory and triggers immediate download.
 */
export const downloadAddonPricingExportCsv = async (params?: {
  search?: string;
  category?: string;
  pricing_model?: string;
  status?: string;
  ids?: string[];
}): Promise<boolean> => {
  try {
    const primaryHost = (
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    ).replace(/\/$/, "");
    const tenantName =
      (typeof window !== "undefined" &&
        (localStorage.getItem("tenant") ||
          localStorage.getItem("tenant_name") ||
          localStorage.getItem("tenantName"))) ||
      process.env.NEXT_PUBLIC_TENANT_NAME ||
      "pegatto_superadmin";

    const query = new URLSearchParams();
    if (params?.search?.trim()) query.set("search", params.search.trim());
    if (params?.category && params.category !== "All Categories") {
      query.set("category", params.category);
    }
    if (params?.pricing_model && params.pricing_model !== "All Models") {
      query.set("pricing_model", params.pricing_model);
    }
    if (params?.status && params.status !== "All Status") {
      query.set("status", params.status);
    }
    if (params?.ids && params.ids.length > 0) {
      query.set("ids", params.ids.join(","));
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") ||
          localStorage.getItem("accesstoken") ||
          localStorage.getItem("access_token") ||
          ""
        : "";
    const dbName =
      typeof window !== "undefined"
        ? localStorage.getItem("DBName") || "crmuseradmin1"
        : "crmuseradmin1";

    if (token) {
      query.set("token", token);
    }

    const url = `${primaryHost}/${tenantName}/superadmin/AddonPricingExport/?${query.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/csv, */*",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        db: dbName,
        Db: dbName,
      },
    });

    if (!res.ok) {
      throw new Error(`Export failed with status ${res.status}`);
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    const contentDisposition = res.headers.get("content-disposition");
    let filename = `addon_pricing_export_${new Date().toISOString().split("T")[0]}.csv`;
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) filename = match[1];
    }
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (error) {
    console.warn(
      "Backend AddonPricingExport failed, falling back to local CSV export:",
      error,
    );
    return false;
  }
};
