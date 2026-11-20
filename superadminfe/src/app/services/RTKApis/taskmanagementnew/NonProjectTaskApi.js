import { superAdminApi } from "../../superadmindashboardAPI/superAdminApi";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const NonProjectTaskApi = superAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Get Assigned To List
    getAssignedTasks: builder.query({
      query: ({ page = 1, Assigned_To }) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementAssignedToList/?Assigned_To=${Assigned_To}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Get Created By List
    getCreatedTasks: builder.query({
      query: ({ page = 1, Created_By }) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCreatedByList/?Created_By=${Created_By}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Search Assigned Tasks
    searchAssignedTasks: builder.query({
      query: ({ page = 1, Assigned_To, search }) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagement_AssignedToSearch/?Assigned_To=${Assigned_To}&search=${search}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Search Created Tasks
    searchCreatedTasks: builder.query({
      query: ({ page = 1, Created_By, search }) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagement_CreatedBySearch/?Created_By=${Created_By}&search=${search}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Filter Assigned Tasks
    filterAssignedTasks: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagement_FilterAssignedTo/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // 🔹 CRUD Operations
    getTaskById: builder.query({
      query: (id) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/?id=${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    createTask: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
    }),

    patchTask: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // 🔹 Dropdown
    getTaskDropdown: builder.query({
      query: () => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementDropdown/`,
        method: "GET",
      }),
    }),

    // 🔹 Additional List (All Records)
    getTaskAllRecords: builder.query({
      query: (page = 1) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementAdditional/?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Status Update (Specific Mutation if needed, else use Patch)
    updateTaskStatus: builder.mutation({
      query: ({ id, Status }) => ({
        url: `${getTenant()}/superadmin/Nonproject_TaskManagementCRUD/`,
        method: "PATCH",
        body: { id, Status },
      }),
      invalidatesTags: (result, error, { id }) => ["Tasks", { type: "Tasks", id }],
    }),

    // 🔹 Today's Tasks
    getTodaysTasks: builder.query({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/NonProject_TodaysTaskLists/`,
        method: "POST",
        body: payload,
      }),
      providesTags: ["Tasks"],
    }),

    // 🔹 Pending Tasks
    getPendingTasks: builder.query({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/NonProject_PendingTaskLists/`,
        method: "POST",
        body: payload,
      }),
      providesTags: ["Tasks"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAssignedTasksQuery,
  useSearchAssignedTasksQuery,
  useFilterAssignedTasksMutation,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  usePatchTaskMutation,
  useDeleteTaskMutation,
  useGetTaskDropdownQuery,
  useGetTaskAllRecordsQuery,
  useUpdateTaskStatusMutation,
  useGetCreatedTasksQuery,
  useSearchCreatedTasksQuery,
  useGetTodaysTasksQuery,
  useGetPendingTasksQuery,
} = NonProjectTaskApi;
