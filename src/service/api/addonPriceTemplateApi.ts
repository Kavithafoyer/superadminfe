import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';

export interface AddonPriceTemplateDto {
  id: number;
  AddonPriceTemplate_Id: string;
  Template_Code: string;
  Template_Name: string;
  Billing_Type: string | null;
  Billing_Cycle: string | null;
  Currency: string;
  Is_Active: boolean;
  Is_Deleted: boolean;
  Created_Date: string;
  Updated_Date: string;
  Created_By?: number | any;
  Updated_By?: number | any;
}

export interface AddonPriceTemplateKPI {
  total_templates: number;
  active_templates: number;
  inactive_templates: number;
  applied_addons: number;
  avg_discount: string;
  avg_discount_value: number;
  type_breakdown: Record<string, number>;
  cycle_breakdown: Record<string, number>;
}

export interface AddonPriceTemplateFilterParams {
  Billing_Type?: string;
  Billing_Cycle?: string;
  Status?: string;
  Is_Active?: boolean;
  search?: string;
  fromdate?: string;
  todate?: string;
  page?: number;
}

const prefix = 'superadmin/AddonPriceTemplate';
const crud = prefix + 'CRUD/';
const extraOptions = { skipHostFallback: true };
const tags = ['AddonPriceTemplates'] as const;

export const addonPriceTemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. KPI Charts & Metrics Endpoint
    getAddonPriceTemplateKPI: builder.query<AddonPriceTemplateKPI, void>({
      query: () => prefix + 'KPI/',
      providesTags: tags,
      extraOptions,
    }),

    // 2. List Without Pagination Endpoint
    getAddonPriceTemplatesWithoutPagination: builder.query<AddonPriceTemplateDto[], void>({
      query: () => prefix + 'listwithoutpaginaton/',
      transformResponse: (response: any) => (Array.isArray(response) ? response : response?.results || []),
      providesTags: tags,
      extraOptions,
    }),

    // 3. List With Pagination Endpoint
    getAddonPriceTemplatesWithPagination: builder.query<
      { count: number; next: string | null; previous: string | null; results: AddonPriceTemplateDto[] },
      { page?: number; page_size?: number } | void
    >({
      query: (arg) => ({
        url: prefix + 'ListwithPagination/',
        params: {
          page: arg && typeof arg === 'object' && arg.page ? arg.page : 1,
          ...(arg && typeof arg === 'object' && arg.page_size ? { page_size: arg.page_size } : {}),
        },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return { count: response.length, next: null, previous: null, results: response };
        }
        return {
          count: response?.count ?? 0,
          next: response?.next ?? null,
          previous: response?.previous ?? null,
          results: response?.results ?? [],
        };
      },
      providesTags: tags,
      extraOptions,
    }),

    // 4. Search Endpoint (GET superadmin/AddonPriceTemplateSearch/?search=...)
    searchAddonPriceTemplates: builder.query<AddonPriceTemplateDto[], string>({
      query: (search) => ({
        url: prefix + 'Search/',
        params: { search: search ? String(search).trim() : '' },
      }),
      transformResponse: (response: any) => (Array.isArray(response) ? response : response?.results || []),
      providesTags: tags,
      extraOptions,
    }),

    // 5. Filter Endpoint (POST superadmin/AddonPriceTemplateFilter/)
    filterAddonPriceTemplates: builder.query<AddonPriceTemplateDto[], AddonPriceTemplateFilterParams>({
      query: (filters) => ({
        url: prefix + 'Filter/',
        method: 'POST',
        body: filters,
      }),
      transformResponse: (response: any) => (Array.isArray(response) ? response : response?.results || []),
      providesTags: tags,
      extraOptions,
    }),

    filterAddonPriceTemplatesMutation: builder.mutation<AddonPriceTemplateDto[], AddonPriceTemplateFilterParams>({
      query: (filters) => ({
        url: prefix + 'Filter/',
        method: 'POST',
        body: filters,
      }),
      transformResponse: (response: any) => (Array.isArray(response) ? response : response?.results || []),
      extraOptions,
    }),

    // 6. CRUD Endpoints
    getAddonPriceTemplateById: builder.query<AddonPriceTemplateDto, string | number>({
      query: (id) => `${crud}?id=${id}`,
      providesTags: tags,
      extraOptions,
    }),

    createAddonPriceTemplate: builder.mutation<AddonPriceTemplateDto, Partial<AddonPriceTemplateDto>>({
      query: (body) => ({
        url: crud,
        method: 'POST',
        body,
      }),
      invalidatesTags: tags,
      extraOptions,
    }),

    updateAddonPriceTemplate: builder.mutation<AddonPriceTemplateDto, Partial<AddonPriceTemplateDto> & { id: number | string }>({
      query: (body) => ({
        url: crud,
        method: 'PUT',
        body,
      }),
      invalidatesTags: tags,
      extraOptions,
    }),

    deleteAddonPriceTemplate: builder.mutation<{ message: string; id: number | string }, number | string>({
      query: (id) => ({
        url: `${crud}?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: tags,
      extraOptions,
    }),
  }),
});

export const {
  useGetAddonPriceTemplateKPIQuery,
  useGetAddonPriceTemplatesWithoutPaginationQuery,
  useGetAddonPriceTemplatesWithPaginationQuery,
  useSearchAddonPriceTemplatesQuery,
  useLazySearchAddonPriceTemplatesQuery,
  useFilterAddonPriceTemplatesQuery,
  useLazyFilterAddonPriceTemplatesQuery,
  useFilterAddonPriceTemplatesMutationMutation,
  useGetAddonPriceTemplateByIdQuery,
  useCreateAddonPriceTemplateMutation,
  useUpdateAddonPriceTemplateMutation,
  useDeleteAddonPriceTemplateMutation,
} = addonPriceTemplateApi;

/**
 * Downloads Price Template records as a CSV file directly from the backend AddonPriceTemplateExport API.
 * Streams data directly into browser memory and triggers immediate download.
 */
export const downloadAddonPriceTemplatesExportCsv = async (params?: {
  search?: string;
  Billing_Type?: string;
  Billing_Cycle?: string;
  Status?: string;
  ids?: string[];
}): Promise<boolean> => {
  try {
    const primaryHost = (
      process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    ).replace(/\/$/, '');
    const tenantName =
      (typeof window !== 'undefined' &&
        (localStorage.getItem('tenant') ||
          localStorage.getItem('tenant_name') ||
          localStorage.getItem('tenantName'))) ||
      process.env.NEXT_PUBLIC_TENANT_NAME ||
      'pegatto_superadmin';

    const query = new URLSearchParams();
    if (params?.search?.trim()) query.set('search', params.search.trim());
    if (params?.Billing_Type && params.Billing_Type !== 'All Types') {
      query.set('Billing_Type', params.Billing_Type);
    }
    if (params?.Billing_Cycle && params.Billing_Cycle !== 'All Cycles') {
      query.set('Billing_Cycle', params.Billing_Cycle);
    }
    if (params?.Status && params.Status !== 'All Status') {
      query.set('Status', params.Status);
    }
    if (params?.ids && params.ids.length > 0) {
      query.set('ids', params.ids.join(','));
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('token') ||
          localStorage.getItem('accesstoken') ||
          localStorage.getItem('access_token') ||
          ''
        : '';
    const dbName =
      typeof window !== 'undefined'
        ? localStorage.getItem('DBName') || 'crmuseradmin1'
        : 'crmuseradmin1';

    if (token) {
      query.set('token', token);
    }

    const url = `${primaryHost}/${tenantName}/superadmin/AddonPriceTemplateExport/?${query.toString()}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/csv, */*',
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
    const a = document.createElement('a');
    a.href = downloadUrl;
    const contentDisposition = res.headers.get('content-disposition');
    let filename = `price_templates_export_${new Date().toISOString().split('T')[0]}.csv`;
    if (contentDisposition && contentDisposition.includes('filename=')) {
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
    console.warn('Backend AddonPriceTemplateExport failed, falling back to local CSV export:', error);
    return false;
  }
};
