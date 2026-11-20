import { superAdminApi } from "../../../services/superadmindashboardAPI/superAdminApi";

const getTenant = () => {
  const currentURL = window.location.href;
  return currentURL.split(".")[0].split("//")[1];
};

export const DefectChatRTKQueryAPI = superAdminApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET MESSAGES BY ROOM
    getTicketRoomMessages: builder.query({
      query: ({ Ticket_Id, page, roomId = 1 }) => ({
        url: `${getTenant()}/superadmin/ChatRoomByTicket/?Ticket_Id=${Ticket_Id}&page=${page}`,
        method: "GET",
      }),

      providesTags: (result, error, { roomId }) => [
        { type: "Messages", id: roomId },
      ],

      transformResponse: (response) => {
        const messages = Array.isArray(response)
          ? response
          : response?.results || [];

        return [...messages].reverse();
      },
    }),

    // ✅ SEND MESSAGE
    sendTicketRoomMessage: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/MessageCRUD/`,
        method: "POST",
        body: payload,
      }),

      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    // ✅ VALIDATE ROOM
    validateRoom: builder.mutation({
      query: (body) => ({
        url: `${getTenant()}/superadmin/ValidateRoomByTicketorDefect/`,
        method: "POST",
        body,
      }),
    }),

    // ✅ CREATE ROOM
    createGroup: builder.mutation({
      query: (body) => ({
        url: `${getTenant()}/superadmin/CreateGroupParticipant/`,
        method: "POST",
        body,
      }),
    }),

    addMessageAttachment: builder.mutation({
      query: (payload) => ({
        url: `${getTenant()}/superadmin/MessageAttachmentCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    deleteRoomMessage: builder.mutation({
      query: ({ id, room }) => ({
        url: `${getTenant()}/superadmin/MessageCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),
  }),
});

export const {
  useGetTicketRoomMessagesQuery,
  useLazyGetTicketRoomMessagesQuery,
  useSendTicketRoomMessageMutation,
  useValidateRoomMutation,
  useCreateGroupMutation,
  useAddMessageAttachmentMutation,
  useDeleteRoomMessageMutation,
} = DefectChatRTKQueryAPI;
