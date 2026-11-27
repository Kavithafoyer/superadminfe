import { baseApi } from '../baseApi';
import type { EditionProduct } from './productEditionApi';

type ConfigurationSections = Record<
  'General_Settings' | 'Module_Configuration' | 'Feature_Controls' | 'Integrations' | 'Branding' | 'Advanced_Settings',
  Record<string, unknown>
>;

export type ProductConfiguration = ConfigurationSections & { Configuration_Id: string };
const url = 'superadmin/ProductConfigurationCRUD/';
const extraOptions = { skipHostFallback: true };

const productConfigurationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getConfigurationProducts: builder.query<EditionProduct[], void>({
      query: () => 'superadmin/ProductMasterdropdownlist/',
      providesTags: ['ProductMasters'],
      extraOptions,
    }),
    getProductConfiguration: builder.query<ProductConfiguration | null, string>({
      async queryFn(Product_Code, _api, _options, baseQuery) {
        const result = await baseQuery({ url, params: { Product_Code } });
        if (result.error) {
          const error = result.error;
          if (error.status === 404 && (error.data as { code?: string })?.code === 'configuration_not_found') {
            return { data: null };
          }
          return { error };
        }
        return { data: result.data as ProductConfiguration };
      },
      extraOptions,
    }),
    saveProductConfiguration: builder.mutation<ProductConfiguration, {
      productCode: string;
      existing: boolean;
      sections: ConfigurationSections;
    }>({
      query: ({ productCode, existing, sections }) => ({
        url,
        method: existing ? 'PUT' : 'POST',
        body: { ...sections, Product_Code: productCode },
      }),
      async onQueryStarted({ productCode }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(productConfigurationApi.util.updateQueryData('getProductConfiguration', productCode, () => data));
        } catch {
          // The form reports the request error.
        }
      },
      extraOptions,
    }),
  }),
});

export const { useGetConfigurationProductsQuery, useGetProductConfigurationQuery, useSaveProductConfigurationMutation } = productConfigurationApi;
