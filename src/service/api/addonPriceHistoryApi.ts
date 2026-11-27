import { baseApi } from "../baseApi";

export interface AddonPriceHistoryDto {
  id: number;
  AddonPriceHistory_Id?: string;
  Addon_Pricing: number;
  Pricing_Id?: number;
  Addon_Name?: string;
  Product?: string;
  Category?: string;
  Old_Base_Price: number | string;
  New_Base_Price: number | string;
  Previous_Price?: number;
  New_Price?: number;
  Change_Amount?: number;
  Change_Percentage?: number;
  Reason?: string;
  Changed_By?: number;
  Changed_By_Name?: string;
  Change_Date?: string;
  Effective_Date?: string;
  Is_Deleted?: boolean;
  [key: string]: any;
}

export interface AddonPriceHistoryKPIDto {
  total_price_changes?: number;
  price_increases?: number;
  price_decreases?: number;
  last_change?: string;
  [key: string]: any;
}

export const addonPriceHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddonPriceHistoryKPI: builder.query<AddonPriceHistoryKPIDto, void>({
      query: () => ({
        url: "superadmin/AddonPriceHistoryKPI/",
        method: "GET",
      }),
      providesTags: ["AddonPriceHistory"],
    }),

    getAddonPriceHistoryWithoutPagination: builder.query<
      AddonPriceHistoryDto[],
      { pricing_id?: number; addon_name?: string } | void
    >({
      query: (params) => ({
        url: "superadmin/AddonPriceHistorylistwithoutpaginaton/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results))
          return response.results;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "AddonPriceHistory" as const,
                id,
              })),
              { type: "AddonPriceHistory", id: "LIST" },
            ]
          : [{ type: "AddonPriceHistory", id: "LIST" }],
    }),

    getAddonPriceHistoryWithPagination: builder.query<
      {
        count: number;
        next: string | null;
        previous: string | null;
        results: AddonPriceHistoryDto[];
      },
      { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: "superadmin/AddonPriceHistoryListwithPagination/",
        method: "GET",
        params: {
          page: params.page || 1,
          ...(params.page_size ? { page_size: params.page_size } : {}),
        },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return {
            count: response.length,
            next: null,
            previous: null,
            results: response,
          };
        }
        return {
          count: response?.count || 0,
          next: response?.next || null,
          previous: response?.previous || null,
          results: response?.results || response?.data || [],
        };
      },
      providesTags: ["AddonPriceHistory"],
    }),

    searchAddonPriceHistory: builder.query<AddonPriceHistoryDto[], string>({
      query: (search) => ({
        url: "superadmin/AddonPriceHistorySearch/",
        method: "GET",
        params: { search },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results))
          return response.results;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ["AddonPriceHistory"],
    }),

    filterAddonPriceHistoryMutation: builder.mutation<
      AddonPriceHistoryDto[],
      {
        pricing_id?: number;
        addon_name?: string;
        search?: string;
        fromdate?: string;
        todate?: string;
        [key: string]: any;
      }
    >({
      query: (body) => ({
        url: "superadmin/AddonPriceHistoryFilter/",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results))
          return response.results;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
    }),

    createAddonPriceHistory: builder.mutation<
      AddonPriceHistoryDto,
      {
        Addon_Pricing: number;
        Old_Base_Price: number;
        New_Base_Price: number;
        Reason?: string;
        Change_Date?: string;
        Changed_By?: number;
        [key: string]: any;
      }
    >({
      query: (body) => ({
        url: "superadmin/AddonPriceHistoryCRUD/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "AddonPriceHistory", id: "LIST" },
        "AddonPriceHistory",
        "AddonPricing",
      ],
    }),

    updateAddonPriceHistory: builder.mutation<
      AddonPriceHistoryDto,
      Partial<AddonPriceHistoryDto> & { id: number }
    >({
      query: (data) => ({
        url: "superadmin/AddonPriceHistoryCRUD/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AddonPriceHistory", id },
        { type: "AddonPriceHistory", id: "LIST" },
        "AddonPriceHistory",
        "AddonPricing",
      ],
    }),

    deleteAddonPriceHistory: builder.mutation<
      { message: string },
      number | string
    >({
      query: (id) => ({
        url: "superadmin/AddonPriceHistoryCRUD/",
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: [
        { type: "AddonPriceHistory", id: "LIST" },
        "AddonPriceHistory",
        "AddonPricing",
      ],
    }),
  }),
});

export const {
  useGetAddonPriceHistoryKPIQuery,
  useGetAddonPriceHistoryWithoutPaginationQuery,
  useGetAddonPriceHistoryWithPaginationQuery,
  useSearchAddonPriceHistoryQuery,
  useFilterAddonPriceHistoryMutationMutation,
  useCreateAddonPriceHistoryMutation,
  useUpdateAddonPriceHistoryMutation,
  useDeleteAddonPriceHistoryMutation,
} = addonPriceHistoryApi;

/**
 * Utility to trigger export of Addon Price History as CSV stream
 */
export async function downloadAddonPriceHistoryExportCsv(params?: {
  pricing_id?: number;
  addon_name?: string;
  search?: string;
}): Promise<void> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        localStorage.getItem("accesstoken") ||
        localStorage.getItem("access_token") ||
        ""
      : "";
  const dbName =
    (typeof window !== "undefined" && localStorage.getItem("DBName")) ||
    "crmuseradmin1";

  const queryParams = new URLSearchParams();
  if (params?.pricing_id)
    queryParams.set("pricing_id", String(params.pricing_id));
  if (params?.addon_name) queryParams.set("addon_name", params.addon_name);
  if (params?.search) queryParams.set("search", params.search);

  const url = `http://127.0.0.1:8000/pegatto_superadmin/superadmin/AddonPriceHistoryExport/${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      db: dbName,
      Db: dbName,
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed with HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `price_history_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}
