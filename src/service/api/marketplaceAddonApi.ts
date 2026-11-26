import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';
import { broadcastCompatibilityChange, compatibilityTags } from '../compatibilitySync';

export const billingCycles = {
  monthly: 'Monthly', quarterly: 'Quarterly', half_yearly: 'Half yearly', yearly: 'Yearly', one_time: 'One time',
};

export const licenseModels = ['Per Tenant', 'Per User', 'Usage Based', 'Tiered Volume'] as const;

export type InitialCompatibility = 'compatible' | 'incompatible';

export interface MarketplaceAddon {
  id: number;
  AddonMaster_Id?: string | null;
  Addon_Code?: string | null;
  License_Model?: typeof licenseModels[number];
  Trial_Available?: boolean;
  Trial_Days?: number;
  Addon_Name?: string | null;
  Description?: string | null;
  Organization_Id?: number | null;
  Created_By?: number | null;
  Updated_By?: number | null;
  Addon_Category?: number | null;
  Category?: string | null;
  Products?: number[];
  Plans?: number[];
  products_details?: { id: number; Product_Name: string; Product_Code: string }[];
  plans_details?: { id: number; Plan_Name: string; Plan_Id: string }[];
  Billing_Cycle?: keyof typeof billingCycles | null;
  Price?: number | null;
  Tax?: string | null;
  TaxPercentage?: number | null;
  TaxAmount?: number | null;
  TotalAmount?: number | null;
  NoofUsers?: number | null;
  Currency_code?: string | null;
  Country?: string | null;
  Features?: string[] | null;
  Minimum_Core_API_Version?: string;
  Known_Incompatibilities?: string;
  Release_Version?: string;
  Release_Status?: string;
  Release_Notes?: string;
  Cloudflare_Public_Id?: unknown[] | null;
  Started_Date?: string | null;
  Updated_Date?: string;
  Status?: string | null;
  Is_Active?: boolean | null;
  Is_Deleted?: boolean | null;
}

const crudUrl = 'superadmin/Addon/';
const listUrl = 'superadmin/AddonAdditional/';
const extraOptions = { skipHostFallback: true };
const tags = ['AddonMaster'] as const;

export const marketplaceAddonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketplaceAddons: builder.query<MarketplaceAddon[], void>({
      queryFn: (_arg, { signal }, _options, baseQuery) => loadResultPages<MarketplaceAddon>(
        (page) => baseQuery({ url: listUrl, params: { Is_Deleted: 'False', page } }), signal,
      ),
      providesTags: tags,
      extraOptions,
    }),
    searchMarketplaceAddons: builder.query<MarketplaceAddon[], string>({
      async queryFn(search, { signal }, _options, baseQuery) {
        const result = await loadResultPages<MarketplaceAddon>(
          (page) => baseQuery({ url: listUrl, method: 'PUT', body: { search, page } }), signal,
        );
        if (result.error) return { error: result.error };
        return { data: [...new Map(result.data.map((item) => [item.id, item])).values()] };
      },
      providesTags: tags,
      extraOptions,
    }),
    getMarketplaceAddon: builder.query<MarketplaceAddon, number>({
      query: (id) => ({ url: crudUrl, params: { id } }),
      providesTags: tags,
      keepUnusedDataFor: 0,
      extraOptions,
    }),
    getMarketplaceAddonCards: builder.query<{ Total_Addons: number; Published: number; In_Draft: number; Inactive: number }, void>({
      query: () => 'superadmin/AddonMasterCards/',
      providesTags: tags,
      extraOptions,
    }),
    getMarketplaceAddonProducts: builder.query<{ id: number; name: string; product_name: string }[], void>({
      query: () => 'superadmin/ProductDropdownAPI/',
      providesTags: ['ProductMasters'],
      extraOptions,
    }),
    saveMarketplaceAddon: builder.mutation<MarketplaceAddon, Partial<MarketplaceAddon> & {
      Product_Compatibility_Type?: InitialCompatibility;
    }>({
      query: (body) => ({ url: crudUrl, method: body.id ? 'PUT' : 'POST', body }),
      invalidatesTags: (_result, error) => error ? [] : compatibilityTags,
      onQueryStarted: broadcastCompatibilityChange,
      extraOptions,
    }),
    deleteMarketplaceAddon: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: crudUrl, method: 'DELETE', params: { id } }),
      invalidatesTags: (_result, error) => error ? [] : compatibilityTags,
      onQueryStarted: broadcastCompatibilityChange,
      extraOptions,
    }),
  }),
});

export const {
  useGetMarketplaceAddonsQuery, useSearchMarketplaceAddonsQuery, useGetMarketplaceAddonQuery,
  useGetMarketplaceAddonCardsQuery, useGetMarketplaceAddonProductsQuery,
  useSaveMarketplaceAddonMutation, useDeleteMarketplaceAddonMutation,
} = marketplaceAddonApi;
