import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';
import { broadcastCompatibilityChange, compatibilityTags } from '../compatibilitySync';

export const compatibilityLabels = {
  compatible: 'Compatible',
  incompatible: 'Not compatible',
  dependency: 'Requires dependency',
} as const;
export type CompatibilityType = keyof typeof compatibilityLabels;

export interface CompatibilityInput {
  Addon: number;
  Product: number;
  Compatibility_Type: CompatibilityType;
  Dependencies: number[];
  Version_Constraint: boolean;
  Minimum_Version: string;
  Maximum_Version: string;
  Rule_Description: string;
  Is_Active: boolean;
}

export interface CompatibilityRule extends Omit<CompatibilityInput, 'Compatibility_Type'> {
  id: number;
  Addon_Name?: string | null;
  Product_Name?: string | null;
  Compatibility_Type?: CompatibilityType | '';
  Is_Compatible: boolean;
}

const prefix = 'superadmin/AddonProductCompatibility';
const crud = prefix + 'CRUD/';
const extraOptions = { skipHostFallback: true };
const tags = ['AddonProductCompatibility'] as const;

export const addonProductCompatibilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompatibilityMatrix: builder.query<CompatibilityRule[], void>({
      query: () => prefix + 'listwithoutpaginaton/',
      providesTags: tags,
      extraOptions,
    }),
    listCompatibilityRules: builder.query<CompatibilityRule[], void>({
      queryFn: (_, { signal }, __, baseQuery) => loadResultPages<CompatibilityRule>(
        (page) => baseQuery({ url: prefix + 'ListwithPagination/', params: { page } }), signal,
      ),
      providesTags: tags,
      extraOptions,
    }),
    searchCompatibilityRules: builder.query<CompatibilityRule[], string>({
      queryFn: (search, { signal }, _, baseQuery) => loadResultPages<CompatibilityRule>(
        (page) => baseQuery({ url: prefix + 'Search/', params: { search, page } }), signal,
      ),
      providesTags: tags,
      extraOptions,
    }),
    filterCompatibilityRules: builder.query<CompatibilityRule[], { Product: number }>({
      queryFn: (filters, { signal }, _, baseQuery) => loadResultPages<CompatibilityRule>(
        (page) => baseQuery({ url: prefix + 'Filter/', method: 'POST', body: { ...filters, page } }), signal,
      ),
      providesTags: tags,
      extraOptions,
    }),
    getCompatibilityRule: builder.query<CompatibilityRule, number>({
      query: (id) => ({ url: crud, params: { id } }),
      providesTags: tags,
      extraOptions,
    }),
    saveCompatibilityProducts: builder.mutation<CompatibilityRule[], Omit<CompatibilityInput, 'Product'> & {
      Products: number[];
      Removed_Products?: number[];
      Changed_Fields?: string[];
      id?: number;
    }>({
      query: (body) => ({ url: crud, method: 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : compatibilityTags,
      onQueryStarted: broadcastCompatibilityChange,
      extraOptions,
    }),
    saveCompatibilityRule: builder.mutation<CompatibilityRule, CompatibilityInput & { id?: number }>({
      query: (body) => ({ url: crud, method: body.id ? 'PUT' : 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : compatibilityTags,
      onQueryStarted: broadcastCompatibilityChange,
      extraOptions,
    }),
    deleteCompatibilityRule: builder.mutation<void, number>({
      query: (id) => ({ url: crud, method: 'DELETE', params: { id } }),
      invalidatesTags: (_, error) => error ? [] : compatibilityTags,
      onQueryStarted: broadcastCompatibilityChange,
      extraOptions,
    }),
  }),
});

export const {
  useGetCompatibilityMatrixQuery, useListCompatibilityRulesQuery, useSearchCompatibilityRulesQuery,
  useFilterCompatibilityRulesQuery, useGetCompatibilityRuleQuery, useSaveCompatibilityRuleMutation,
  useDeleteCompatibilityRuleMutation, useSaveCompatibilityProductsMutation,
} = addonProductCompatibilityApi;
