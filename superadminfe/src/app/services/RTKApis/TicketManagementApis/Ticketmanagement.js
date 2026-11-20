import { superAdminApi } from "../../superadmindashboardAPI/superAdminApi";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const TicketmanagementApis = superAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ ALL TICKETS
    getAllTicket: builder.query({
      query: ({ page }) => ({
        url: `${getTenant()}/superadmin/TicketManagementAlllist/`,
        method: "GET",
        params: { page },
      }),
      providesTags: ["TicketManagementCRUD"],
    }),

    // ✅ CREATE / UPDATE
    setupTicket: builder.mutation({
      query: ({ payload, method }) => ({
        url: `${getTenant()}/superadmin/TicketManagementCRUD/`,
        method: method,
        body: payload,
      }),
      invalidatesTags: ["TicketManagementCRUD"],
    }),

    updateTicketStatus: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/TicketManagementCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["TicketManagementCRUD"],
    }),

    // ✅ DELETE
    deleteTicket: builder.mutation({
      query: (id) => ({
        url: `${getTenant()}/superadmin/TicketManagementCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TicketManagementCRUD"],
    }),

    // ✅ ASSIGNED TICKETS
    getassignedTicket: builder.query({
      query: () => ({
        url: `${getTenant()}/superadmin/TicketManagementAssinedToList/?Assigned_To=${localStorage.getItem(
          "UserId"
        )}`,
        method: "GET",
      }),
      providesTags: ["TicketManagementCRUD"],
    }),

    // ✅ MY TICKETS
    getmyTicket: builder.query({
      query: () => ({
        url: `${getTenant()}/superadmin/TicketManagementAdditional/?User_Id=${localStorage.getItem(
          "UserId"
        )}`,
        method: "GET",
      }),
      providesTags: ["TicketManagementCRUD"],
    }),

    // ✅ ASSIGNED TICKETS (Duplicate or similar to getassignedTicket)
    getAssignedTicket: builder.query({
      query: () => ({
        url: `${getTenant()}/superadmin/TicketManagementAdditional/?Assigned_To=${localStorage.getItem(
          "UserId"
        )}`,
        method: "GET",
      }),
      providesTags: ["TicketManagementCRUD"],
    }),

    // ✅ SEARCH
    searchTickets: builder.query({
      query: (params) => ({
        url: `${getTenant()}/superadmin/TicketManagementSearch/`,
        method: "GET",
        params: params,
      }),
      providesTags: ["TicketManagementCRUD"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSetupTicketMutation,
  useGetassignedTicketQuery,
  useUpdateTicketStatusMutation,
  useGetmyTicketQuery,
  useGetAssignedTicketQuery,
  useGetAllTicketQuery,
  useDeleteTicketMutation,
  useLazySearchTicketsQuery,
} = TicketmanagementApis;
