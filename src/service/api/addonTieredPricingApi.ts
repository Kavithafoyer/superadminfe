import { baseApi } from '../baseApi';
import { broadcastPricingChange } from '../compatibilitySync';
import type { TierScheduleDetails } from './addonPricingApi';
import type { PricingTier } from './addonPriceTemplateApi';

export interface AddonTieredPricingDto {
  id: number;
  AddonTieredPricing_Id?: string;
  Addon_Pricing: number;
  Addon_Name?: string;
  Pricing_Id?: number;
  Addon_Code?: string;
  Category?: string;
  Billing_Cycle?: string;
  Currency?: string;
  Template_Code?: string;
  Name?: string;
  Rate_Details?: Pick<PricingTier, 'Storage' | 'Features' | 'Unit_Price' | 'Discount'>;
  Min_Employees: number;
  Max_Employees: number;
  Tier_Price: number | string;
  Tier_Price_Display?: string;
  Is_Active?: boolean;
  Is_Deleted?: boolean;
  Created_Date?: string;
  Updated_Date?: string;
  Created_By?: number;
  Updated_By?: number;
  Status?: string;
  [key: string]: any;
}

export interface AddonTieredPricingKPIDto {
  active_tier_schedules?: number;
  volume_based?: number;
  graduated?: number;
  avg_discount?: string;
  [key: string]: any;
}

export const addonTieredPricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveAddonTierSchedule: builder.mutation<AddonTieredPricingDto[], {
      Addon_Pricing: number;
      Price_Template: number;
      Is_Active: boolean;
      Tiers: PricingTier[];
      Schedule?: TierScheduleDetails;
    }>({
      query: (body) => ({ url: 'superadmin/AddonTieredPricingCRUD/', method: 'POST', body }),
      extraOptions: { skipHostFallback: true },
      invalidatesTags: (_result, error) => error ? [] : ['AddonTieredPricing', 'AddonPricing'],
      onQueryStarted: broadcastPricingChange,
    }),
    getAddonTieredPricingKPI: builder.query<AddonTieredPricingKPIDto, void>({
      query: () => ({
        url: 'superadmin/AddonTieredPricingKPI/',
        method: 'GET',
      }),
      providesTags: ['AddonTieredPricing'],
    }),

    getAddonTieredPricingWithoutPagination: builder.query<AddonTieredPricingDto[], void>({
      query: () => ({
        url: 'superadmin/AddonTieredPricinglistwithoutpaginaton/',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'AddonTieredPricing' as const, id })),
              { type: 'AddonTieredPricing', id: 'LIST' },
            ]
          : [{ type: 'AddonTieredPricing', id: 'LIST' }],
    }),

    getAddonTieredPricingWithPagination: builder.query<
      { count: number; next: string | null; previous: string | null; results: AddonTieredPricingDto[] },
      { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'superadmin/AddonTieredPricingListwithPagination/',
        method: 'GET',
        params: {
          page: params.page || 1,
          ...(params.page_size ? { page_size: params.page_size } : {}),
        },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return { count: response.length, next: null, previous: null, results: response };
        }
        return {
          count: response?.count || 0,
          next: response?.next || null,
          previous: response?.previous || null,
          results: response?.results || response?.data || [],
        };
      },
      providesTags: ['AddonTieredPricing'],
    }),

    searchAddonTieredPricing: builder.query<AddonTieredPricingDto[], string>({
      query: (search) => ({
        url: 'superadmin/AddonTieredPricingSearch/',
        method: 'GET',
        params: { search },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    filterAddonTieredPricing: builder.query<AddonTieredPricingDto[], Record<string, any>>({
      query: (params) => ({
        url: 'superadmin/AddonTieredPricingFilter/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    filterAddonTieredPricingMutation: builder.mutation<AddonTieredPricingDto[], Record<string, any>>({
      query: (body) => ({
        url: 'superadmin/AddonTieredPricingFilter/',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    getAddonTieredPricingById: builder.query<AddonTieredPricingDto, string | number>({
      query: (id) => ({
        url: `superadmin/AddonTieredPricingCRUD/?id=${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'AddonTieredPricing', id }],
    }),

    createAddonTieredPricing: builder.mutation<AddonTieredPricingDto, Partial<AddonTieredPricingDto>>({
      query: (body) => ({
        url: 'superadmin/AddonTieredPricingCRUD/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AddonTieredPricing', id: 'LIST' }, 'AddonTieredPricing'],
    }),

    updateAddonTieredPricing: builder.mutation<
      AddonTieredPricingDto,
      { id: number | string } & Partial<AddonTieredPricingDto>
    >({
      query: ({ id, ...body }) => ({
        url: 'superadmin/AddonTieredPricingCRUD/',
        method: 'PUT',
        body: { id, ...body },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AddonTieredPricing', id },
        { type: 'AddonTieredPricing', id: 'LIST' },
        'AddonTieredPricing',
      ],
    }),

    deleteAddonTieredPricing: builder.mutation<{ message?: string }, number | string>({
      query: (id) => ({
        url: `superadmin/AddonTieredPricingCRUD/?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AddonTieredPricing', id: 'LIST' }, 'AddonTieredPricing'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSaveAddonTierScheduleMutation,
  useGetAddonTieredPricingKPIQuery,
  useGetAddonTieredPricingWithoutPaginationQuery,
  useGetAddonTieredPricingWithPaginationQuery,
  useSearchAddonTieredPricingQuery,
  useFilterAddonTieredPricingQuery,
  useFilterAddonTieredPricingMutationMutation,
  useGetAddonTieredPricingByIdQuery,
  useCreateAddonTieredPricingMutation,
  useUpdateAddonTieredPricingMutation,
  useDeleteAddonTieredPricingMutation,
} = addonTieredPricingApi;

export async function downloadAddonTieredPricingExportCsv(filters?: {
  search?: string;
  status?: string;
  ids?: string[];
}): Promise<boolean> {
  try {
    const dbName =
      (typeof window !== 'undefined' && localStorage.getItem('DBName')) || 'crmuseradmin1';
    const token =
      (typeof window !== 'undefined' &&
        (localStorage.getItem('token') ||
          localStorage.getItem('accesstoken') ||
          localStorage.getItem('access_token'))) ||
      '';

    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status && filters.status !== 'All Status') params.append('status', filters.status);
    if (filters?.ids && filters.ids.length > 0) params.append('ids', filters.ids.join(','));

    const queryStr = params.toString();
    const endpoint = `/superadmin/AddonTieredPricingExport/${queryStr ? `?${queryStr}` : ''}`;

    const candidates = [
      'http://127.0.0.1:8000/pegatto_superadmin',
      'http://localhost:8000/pegatto_superadmin',
      'https://backend.crmfarm.in/pegatto_superadmin',
    ];

    let blob: Blob | null = null;
    let fileName = `addon_tiered_pricing_${new Date().toISOString().split('T')[0]}.csv`;

    for (const host of candidates) {
      try {
        const fullUrl = `${host}${endpoint}`;
        const headers: Record<string, string> = {
          db: dbName,
          Db: dbName,
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const resp = await fetch(fullUrl, { method: 'GET', headers });
        if (resp.ok) {
          blob = await resp.blob();
          const cd = resp.headers.get('content-disposition');
          if (cd && cd.includes('filename=')) {
            const match = cd.match(/filename="?([^";]+)"?/);
            if (match && match[1]) fileName = match[1];
          }
          break;
        }
      } catch {
        continue;
      }
    }

    if (!blob) return false;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Failed to download CSV from backend:', err);
    return false;
  }
}
