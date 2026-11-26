import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';

export interface EditionProduct {
  id: number;
  Product_Name: string;
  Product_Code: string | null;
  Description: string | null;
  Is_Active: boolean;
}

export interface ProductEdition {
  id: number;
  Product_Id: number;
  Edition_Id: string;
  Edition_Name: string | null;
  Edition_Code: string | null;
  Description: string | null;
  Is_Active: boolean;
}

interface EditionModule {
  id: number;
  Module_name: string | null;
  Module_Code: string | null;
  Product_Edition_id: number[];
}

type EditionInput = Pick<ProductEdition, 'Product_Id' | 'Edition_Name' | 'Edition_Code' | 'Description' | 'Is_Active'>;
const crud = 'superadmin/ProductEditionCRUD/';
const extraOptions = { skipHostFallback: true };
const tags = ['ProductMasters'] as const;

export const productEditionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getEditionProducts: builder.query<EditionProduct[], void>({
      queryFn: (_, { signal }, __, baseQuery) => loadResultPages<EditionProduct>(
        page => baseQuery({ url: 'superadmin/ProductMasterList/', params: { page } }), signal,
      ),
      providesTags: tags,
      extraOptions,
    }),
    getProductEditions: builder.query<ProductEdition[], number>({
      query: Product_Id => ({ url: 'superadmin/ProductEditionlistwithoutpaginaton/', params: { Product_Id } }),
      providesTags: tags,
      extraOptions,
    }),
    getEditionModules: builder.query<EditionModule[], number>({
      query: edition_product => ({ url: 'superadmin/ModuleMasterlistwithoutpaginaton/', params: { edition_product } }),
      providesTags: tags,
      extraOptions,
    }),
    saveProductEdition: builder.mutation<ProductEdition, EditionInput & { id?: number }>({
      query: body => ({ url: crud, method: body.id ? 'PATCH' : 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
    deleteProductEdition: builder.mutation<ProductEdition, number>({
      query: id => ({ url: crud, method: 'DELETE', params: { id } }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
  }),
});

export const {
  useGetEditionProductsQuery, useGetProductEditionsQuery, useGetEditionModulesQuery,
  useSaveProductEditionMutation, useDeleteProductEditionMutation,
} = productEditionApi;
