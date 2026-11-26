import { nanoid } from '@reduxjs/toolkit';
import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';

export interface EditionProduct {
  id: number;
  Product_Name: string | null;
  Product_Code: string | null;
  Description: string | null;
  Is_Active: boolean;
}

export interface ProductEdition {
  id: number;
  Product_Id: number;
  Edition_Id: string;
  Is_Deleted: boolean;
  Edition_Name: string | null;
  Edition_Code: string | null;
  Description: string | null;
  Is_Active: boolean;
}

export interface ProductModule {
  id: number;
  Product_Id: number | null;
  Module_name: string | null;
  Module_Code: string | null;
  Module_Type: string | null;
  Description: string | null;
  Is_active: boolean;
  Status: string | null;
}

export interface ProductFeature {
  id: number;
  Module_Id: number | null;
  Product_Id: number;
  Feature_Name: string | null;
  Feature_Code: string | null;
  Description: string | null;
  Is_Active: boolean;
}

type EditionInput = Pick<ProductEdition, 'Product_Id' | 'Edition_Name' | 'Edition_Code' | 'Description' | 'Is_Active'>;
type EditionFilter = { Product_Id: number; Edition_Name?: string; Edition_Code?: string; Is_Active?: boolean };
type EditionPage = { count: number; results: ProductEdition[] };
type EditionWrite = EditionInput & ({ id: number; Edition_Id: string } | { id?: undefined; Edition_Id?: undefined });

function editionTag(id: number) {
  return [{ type: 'ProductEditions' as const, id }];
}

type ModuleInput = Pick<ProductModule, 'Module_name' | 'Module_Type' | 'Description' | 'Status'>;
type FeatureScope = { Product_Id: number; Module_Id: number };
type FeatureInput = FeatureScope & Pick<ProductFeature, 'Feature_Name' | 'Description' | 'Is_Active'>;
const editionList = 'superadmin/ProductEditionListwithPagination/';
const editionCrud = 'superadmin/ProductEditionCRUD/';
const moduleCrud = 'superadmin/ModuleMasterCRUD/';
const featureCrud = 'superadmin/ProductFeatureCRUD/';
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
    createEditionProduct: builder.mutation<EditionProduct, Pick<EditionProduct, 'Product_Name' | 'Product_Code' | 'Description'>>({
      query: body => ({ url: 'superadmin/ProductMasterCRUD/', method: 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
    getProductEditions: builder.query<ProductEdition[], number>({
      queryFn: (Product_Id, { signal }, __, baseQuery) => loadResultPages<ProductEdition>(
        page => baseQuery({ url: editionList, params: { Product_Id, page, page_size: 50 } }), signal,
      ),
      providesTags: (_, __, id) => editionTag(id),
      extraOptions,
    }),
    getProductEditionPage: builder.query<EditionPage, EditionFilter & { page: number; page_size: number }>({
      query: params => ({ url: editionList, params }),
      providesTags: (_, __, { Product_Id }) => editionTag(Product_Id),
      extraOptions,
    }),
    getProductEdition: builder.query<ProductEdition, { id: number; Product_Id: number }>({
      query: ({ id }) => ({ url: editionCrud, params: { id } }),
      providesTags: (_, __, { Product_Id }) => editionTag(Product_Id),
      extraOptions,
    }),
    getProductModules: builder.query<ProductModule[], number>({
      query: Product_Id => ({ url: 'superadmin/ModuleMasterlistwithoutpaginaton/', params: { Product_Id } }),
      transformResponse: (rows: ProductModule[], _, productId) => rows.filter(row => row.Product_Id === productId),
      providesTags: tags,
      extraOptions,
    }),
    getProductFeatures: builder.query<ProductFeature[], FeatureScope>({
      query: params => ({ url: 'superadmin/ProductFeaturelistwithoutpaginaton/', params }),
      transformResponse: (rows: ProductFeature[], _, scope) =>
        rows.filter(row => row.Product_Id === scope.Product_Id && row.Module_Id === scope.Module_Id),
      providesTags: tags,
      extraOptions,
    }),
    saveProductEdition: builder.mutation<ProductEdition, EditionWrite>({
      query: body => ({
        url: editionCrud,
        method: body.id ? 'PATCH' : 'POST',
        // The serializer otherwise uses Edition_Code as a globally unique Edition_Id.
        body: body.id ? body : { ...body, Edition_Id: 'PED-' + nanoid() },
      }),
      invalidatesTags: (_, error, body) => error ? [] : editionTag(body.Product_Id),
      extraOptions,
    }),
    deleteProductEdition: builder.mutation<ProductEdition, Pick<ProductEdition, 'id' | 'Product_Id'>>({
      // DELETE passes only Is_Deleted to the serializer, which can reset Product_Id.
      query: body => ({ url: editionCrud, method: 'PATCH', body: { ...body, Is_Deleted: true } }),
      invalidatesTags: (_, error, body) => error ? [] : editionTag(body.Product_Id),
      extraOptions,
    }),
    saveProductModule: builder.mutation<ProductModule, ModuleInput & { Product_Id: number; id?: number }>({
      query: body => ({ url: moduleCrud, method: body.id ? 'PATCH' : 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
    deleteProductModule: builder.mutation<ProductModule, number>({
      query: id => ({ url: moduleCrud, method: 'DELETE', params: { id } }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
    saveProductFeature: builder.mutation<ProductFeature, FeatureInput & { id?: number }>({
      query: body => ({ url: featureCrud, method: body.id ? 'PATCH' : 'POST', body }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
    deleteProductFeature: builder.mutation<ProductFeature, number>({
      query: id => ({ url: featureCrud, method: 'DELETE', params: { id } }),
      invalidatesTags: (_, error) => error ? [] : tags,
      extraOptions,
    }),
  }),
});

export const {
  useGetEditionProductsQuery, useCreateEditionProductMutation, useGetProductEditionsQuery,
  useGetProductModulesQuery, useGetProductFeaturesQuery,
  useGetProductEditionPageQuery, useLazyGetProductEditionQuery, useSaveProductEditionMutation, useDeleteProductEditionMutation,
  useSaveProductModuleMutation, useDeleteProductModuleMutation,
  useSaveProductFeatureMutation, useDeleteProductFeatureMutation,
} = productEditionApi;
