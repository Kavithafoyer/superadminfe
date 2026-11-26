import { baseApi } from '../baseApi';
import { fetchFromApi } from '../apiClient';

/**
 * Example 1: Defining RTK Query endpoints for your upcoming project.
 * Endpoints automatically generate React hooks like `useGetItemsQuery` and `useCreateItemMutation`.
 */
export const sampleApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getItems: builder.query<{ id: string; name: string }[], void>({
      query: () => 'items/',
      providesTags: ['Items'],
    }),
    createItem: builder.mutation<{ id: string; name: string }, { name: string }>({
      query: (body) => ({
        url: 'items/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Items'],
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = sampleApi;

/**
 * Example 2: Helper for TanStack Query / React Query.
 * Use with `useQuery({ queryKey: ['items'], queryFn: fetchItems })`
 */
export async function fetchItems() {
  return fetchFromApi('/items');
}
