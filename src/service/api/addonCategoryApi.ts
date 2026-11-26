import { baseApi } from '../baseApi';
import { loadResultPages } from './loadResultPages';

export type AddonCategoryStatus = 'Active' | 'Draft' | 'Inactive';
export const addonCategoryStatuses = ['Active', 'Inactive', 'Draft'] as const;

export interface AddonCategoryInput {
  Category_Name: string;
  Description: string;
  Display_Order: number;
  Show_In_Marketplace: boolean;
  Status: AddonCategoryStatus;
  Category_Icon: string | null;
  Is_Deleted: boolean;
  Created_By: number;
  Updated_By: number;
}

export interface AddonCategoryDto extends Omit<AddonCategoryInput, 'Description' | 'Status'> {
  id: number;
  AddonCategory_Id: string;
  Category_Code: string | null;
  Description: string | null;
  Status: string | null;
  Created_Date: string;
  Updated_Date: string;
}

type AddonCategoryUpdate = AddonCategoryInput & Pick<AddonCategoryDto,
  'id' | 'AddonCategory_Id' | 'Created_Date' | 'Updated_Date'>;

interface AddonCategoryCards {
  Total_Categories: number;
  Active: number;
  Draft: number;
  Inactive: number;
}

const categoryUrl = 'superadmin/AddonCategoryCRUD/';
const extraOptions = { skipHostFallback: true };
const categoryTags = ['AddonCategories'] as const;

function isSavedCategory(data: unknown): data is AddonCategoryDto {
  const category = data as Partial<AddonCategoryDto> | null;
  return Boolean(category && Number.isSafeInteger(category.id) && category.AddonCategory_Id);
}

export interface PaginatedAddonCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: AddonCategoryDto[];
}

export const addonCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAddonCategories: builder.query<AddonCategoryDto[], void>({
      query: () => 'superadmin/AddonCategorylistwithoutpaginaton/',
      providesTags: categoryTags,
      extraOptions,
    }),
    getAddonCategoriesPaginated: builder.query<PaginatedAddonCategories, { page?: number; page_size?: number }>({
      query: ({ page = 1, page_size } = {}) => ({
        url: 'superadmin/AddonCategoryListwithPagination/',
        params: { page, ...(page_size ? { page_size } : {}) },
      }),
      transformResponse: (response: any): PaginatedAddonCategories => {
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
      providesTags: categoryTags,
      extraOptions,
    }),
    searchAddonCategories: builder.query<AddonCategoryDto[], string>({
      queryFn: (search, { signal }, _options, baseQuery) => loadResultPages<AddonCategoryDto>(
        (page) => baseQuery({
          url: 'superadmin/AddonCategorySearch/',
          params: page === 1 ? { search } : { search, page },
        }),
        signal,
      ),
      providesTags: categoryTags,
      extraOptions,
    }),
    filterAddonCategories: builder.query<AddonCategoryDto[], AddonCategoryStatus>({
      async queryFn(Status, { signal }, _options, baseQuery) {
        const result = await loadResultPages<AddonCategoryDto>(
          (page) => baseQuery({
            url: 'superadmin/AddonCategoryFilter/',
            method: 'POST',
            body: page === 1 ? { Status } : { Status, page },
          }),
          signal,
        );
        if (result.error) return { error: result.error };
        // The backend uses a substring match, so Active also returns Inactive rows.
        return { data: result.data.filter((category) => category.Status?.trim().toLowerCase() === Status.toLowerCase()) };
      },
      providesTags: categoryTags,
      extraOptions,
    }),
    getAddonCategoryCards: builder.query<AddonCategoryCards, void>({
      query: () => 'superadmin/AddonCategoryCards/',
      providesTags: categoryTags,
      extraOptions,
    }),
    getAddonCategory: builder.query<AddonCategoryDto, number>({
      query: (id) => ({ url: categoryUrl, params: { id } }),
      extraOptions,
      keepUnusedDataFor: 0,
    }),
    saveAddonCategory: builder.mutation<AddonCategoryDto, AddonCategoryInput | AddonCategoryUpdate>({
      async queryFn(body, _api, _options, baseQuery) {
        const isUpdate = 'id' in body;
        const result = await baseQuery({ url: categoryUrl, method: isUpdate ? 'PUT' : 'POST', body });
        if (result.error) return { error: result.error };

        // This endpoint can return HTTP 200 even if serializer validation failed.
        const saved = result.data;
        if (!isSavedCategory(saved) || (isUpdate && saved.id !== body.id) ||
          Object.entries(body).some(([key, value]) => saved[key as keyof AddonCategoryDto] !== value)) {
          return { error: { status: 'CUSTOM_ERROR', error: 'The server did not save these changes. Check the category details and your signed-in account.' } };
        }
        return { data: saved };
      },
      invalidatesTags: (result) => result ? categoryTags : [],
      extraOptions,
    }),
    deleteAddonCategory: builder.mutation<AddonCategoryDto, number>({
      async queryFn(id, _api, _options, baseQuery) {
        const result = await baseQuery({ url: categoryUrl, method: 'DELETE', params: { id } });
        if (result.error) return { error: result.error };
        if (!isSavedCategory(result.data) || result.data.id !== id || !result.data.Is_Deleted) {
          return { error: { status: 'CUSTOM_ERROR', error: 'The server did not confirm the deletion.' } };
        }
        return { data: result.data };
      },
      invalidatesTags: (result) => result ? categoryTags : [],
      extraOptions,
    }),
  }),
});

export const {
  useGetAddonCategoriesQuery,
  useGetAddonCategoriesPaginatedQuery,
  useSearchAddonCategoriesQuery,
  useFilterAddonCategoriesQuery,
  useGetAddonCategoryCardsQuery,
  useGetAddonCategoryQuery,
  useSaveAddonCategoryMutation,
  useDeleteAddonCategoryMutation,
} = addonCategoryApi;
