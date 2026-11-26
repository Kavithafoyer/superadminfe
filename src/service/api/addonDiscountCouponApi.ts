import { baseApi } from '../baseApi';

export interface AddonDiscountCouponDto {
  id: number;
  AddonDiscountCoupon_Id?: string;
  Coupon_Code: string;
  Discount_Type?: string;
  Discount_Value: number | string;
  Valid_From?: string;
  Valid_To?: string;
  Usage_Limit?: number;
  Is_Active?: boolean;
  Is_Deleted?: boolean;
  Created_Date?: string;
  Updated_Date?: string;
  Created_By?: number;
  Updated_By?: number;
  Applicable_Addons?: number[];
  Applicable_Addon_Names?: string[];
  Addon_Count?: number;
  Formatted_Value?: string;
  Status?: string;
  [key: string]: any;
}

export interface AddonDiscountCouponKPIDto {
  active_discounts?: number;
  total_redeemed?: number;
  total_coupons?: number;
  active_coupons?: number;
  inactive_coupons?: number;
  avg_discount?: string;
  [key: string]: any;
}

export const addonDiscountCouponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddonDiscountCouponKPI: builder.query<AddonDiscountCouponKPIDto, void>({
      query: () => ({
        url: 'superadmin/AddonDiscountCouponKPI/',
        method: 'GET',
      }),
      providesTags: ['AddonDiscountCoupon'],
    }),

    getAddonDiscountCouponWithoutPagination: builder.query<AddonDiscountCouponDto[], void>({
      query: () => ({
        url: 'superadmin/AddonDiscountCouponlistwithoutpaginaton/',
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
              ...result.map(({ id }) => ({ type: 'AddonDiscountCoupon' as const, id })),
              { type: 'AddonDiscountCoupon', id: 'LIST' },
            ]
          : [{ type: 'AddonDiscountCoupon', id: 'LIST' }],
    }),

    getAddonDiscountCouponWithPagination: builder.query<
      { count: number; next: string | null; previous: string | null; results: AddonDiscountCouponDto[] },
      { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: 'superadmin/AddonDiscountCouponListwithPagination/',
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
      providesTags: ['AddonDiscountCoupon'],
    }),

    searchAddonDiscountCoupon: builder.query<AddonDiscountCouponDto[], string>({
      query: (search) => ({
        url: 'superadmin/AddonDiscountCouponSearch/',
        method: 'GET',
        params: { search },
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    filterAddonDiscountCoupon: builder.query<AddonDiscountCouponDto[], Record<string, any>>({
      query: (params) => ({
        url: 'superadmin/AddonDiscountCouponFilter/',
        method: 'GET',
        params,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    filterAddonDiscountCouponMutation: builder.mutation<AddonDiscountCouponDto[], Record<string, any>>({
      query: (body) => ({
        url: 'superadmin/AddonDiscountCouponFilter/',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.results)) return response.results;
        return [];
      },
    }),

    getAddonDiscountCouponById: builder.query<AddonDiscountCouponDto, string | number>({
      query: (id) => ({
        url: `superadmin/AddonDiscountCouponCRUD/?id=${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'AddonDiscountCoupon', id }],
    }),

    createAddonDiscountCoupon: builder.mutation<AddonDiscountCouponDto, Partial<AddonDiscountCouponDto>>({
      query: (body) => ({
        url: 'superadmin/AddonDiscountCouponCRUD/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'AddonDiscountCoupon', id: 'LIST' }, 'AddonDiscountCoupon'],
    }),

    updateAddonDiscountCoupon: builder.mutation<
      AddonDiscountCouponDto,
      { id: number | string } & Partial<AddonDiscountCouponDto>
    >({
      query: ({ id, ...body }) => ({
        url: 'superadmin/AddonDiscountCouponCRUD/',
        method: 'PUT',
        body: { id, ...body },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AddonDiscountCoupon', id },
        { type: 'AddonDiscountCoupon', id: 'LIST' },
        'AddonDiscountCoupon',
      ],
    }),

    deleteAddonDiscountCoupon: builder.mutation<{ message?: string }, number | string>({
      query: (id) => ({
        url: `superadmin/AddonDiscountCouponCRUD/?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AddonDiscountCoupon', id: 'LIST' }, 'AddonDiscountCoupon'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAddonDiscountCouponKPIQuery,
  useGetAddonDiscountCouponWithoutPaginationQuery,
  useGetAddonDiscountCouponWithPaginationQuery,
  useSearchAddonDiscountCouponQuery,
  useFilterAddonDiscountCouponQuery,
  useFilterAddonDiscountCouponMutationMutation,
  useGetAddonDiscountCouponByIdQuery,
  useCreateAddonDiscountCouponMutation,
  useUpdateAddonDiscountCouponMutation,
  useDeleteAddonDiscountCouponMutation,
} = addonDiscountCouponApi;

export async function downloadAddonDiscountCouponExportCsv(filters?: {
  search?: string;
  type?: string;
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
    if (filters?.type && filters.type !== 'All Types') params.append('type', filters.type);
    if (filters?.status && filters.status !== 'All Status') params.append('status', filters.status);
    if (filters?.ids && filters.ids.length > 0) params.append('ids', filters.ids.join(','));

    const queryStr = params.toString();
    const endpoint = `/superadmin/AddonDiscountCouponExport/${queryStr ? `?${queryStr}` : ''}`;

    const candidates = [
      'http://127.0.0.1:8000/pegatto_superadmin',
      'http://localhost:8000/pegatto_superadmin',
      'https://backend.crmfarm.in/pegatto_superadmin',
    ];

    let blob: Blob | null = null;
    let fileName = `addon_discount_coupons_${new Date().toISOString().split('T')[0]}.csv`;

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
