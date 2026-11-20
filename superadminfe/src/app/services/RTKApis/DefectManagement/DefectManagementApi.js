import { superAdminApi } from "../../superadmindashboardAPI/superAdminApi";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const DefectApi = superAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 All Defects (Paginated)
    getDefects: builder.query({
      query: ({ page }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCreatedByList/`,
        method: "GET",
        params: { page },
      }),
      providesTags: ["Defects"],
    }),

    // 🔹 My Defects
    getMyDefects: builder.query({
      query: ({ page = 1, UserId }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCreatedByList/`,
        method: "GET",
        params: { page, Created_By: UserId },
      }),
      providesTags: ["Defects"],
    }),

    // 🔹 Assigned Defects
    getAssignedDefects: builder.query({
      query: ({ page = 1, UserId }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingAssignedToList/`,
        method: "GET",
        params: { page, Assigned_To: UserId },
      }),
      providesTags: ["Defects"],
    }),

    // 🔹 Search
    searchDefects: builder.query({
      query: ({ search, Created_By, page }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingsearch/`,
        method: "GET",
        params: {
          search,
          page,
          ...(Created_By != null && { Created_By }),
        },
      }),
    }),

    // 🔹 Search Assigned
    searchAssignedDefects: builder.query({
      query: ({ search, Assigned_To, page }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingsearch/`,
        method: "GET",
        params: {
          search,
          Assigned_To,
          page,
        },
      }),
    }),

    // 🔹 Filter
    filterDefects: builder.mutation({
      query: (body) => ({
        url: `${getTenant()}/superadmin/DefectTrackingFilter/`,
        method: "POST",
        body,
      }),
    }),

    // 🔹 Delete
    deleteDefect: builder.mutation({
      query: (id) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Defects"],
    }),

    // 🔹 Update Status
    updateDefectStatus: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Defects"],
    }),

    // 🔹 Create Defect
    createDefect: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Defects"],
    }),

    // 🔹 Update Defect (Full Update)
    updateDefect: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingCRUD/`,
        method: "PUT",
        body: { id, ...payload },
      }),
      invalidatesTags: ["Defects"],
    }),

    getProjectList: builder.query({
      query: () => `${getTenant()}/superadmin/ProjectDropdownAPI/`,
      providesTags: ["ProjectList"],
    }),

    getChilddefectList: builder.query({
      query: ({ project_id = 0 }) => ({
        url: `${getTenant()}/superadmin/DefectTrackingDropdown/`,
        method: "GET",
        params: {
          project_id,
        },
      }),
    }),
  }),
});

export const {
  useGetDefectsQuery,
  useGetMyDefectsQuery,
  useGetAssignedDefectsQuery,
  useSearchDefectsQuery,
  useSearchAssignedDefectsQuery,
  useFilterDefectsMutation,
  useDeleteDefectMutation,
  useUpdateDefectStatusMutation,
  useCreateDefectMutation,
  useUpdateDefectMutation,
  useGetProjectListQuery,
  useGetChilddefectListQuery,
} = DefectApi;
