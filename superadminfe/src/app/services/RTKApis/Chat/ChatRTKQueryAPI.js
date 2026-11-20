import { chatBaseApi } from "../../ChatBaseApi";

export const ChatRTKQueryAPI = chatBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chat users list
    getChatUsersList: builder.query({
      query: (id) => ({
        url: `superadmin/ChatUserGroupList/?id=${id}`,
        method: "GET",
      }),
      providesTags: ["ChatUsers"],
      transformResponse: (response) => response[0],
      keepUnusedDataFor: 3600,
    }),

    // Get chat count (unread and last message date) for a specific user
    getChatCount: builder.query({
      query: ({ receiverId, senderId }) => ({
        url: `superadmin/Chatcount/?RecevierId=${receiverId}&SenderId=${senderId}`,
        method: "GET",
      }),
      providesTags: (result, error, { receiverId }) => [
        { type: "ChatCount", id: receiverId },
      ],
      keepUnusedDataFor: 3600,
    }),

    // Fetch messages between two users
    fetchMessages: builder.query({
      query: ({ receiverId, senderId }) => ({
        url: `superadmin/UserChatMasterCRUD/?RecevierId=${receiverId}&SenderId=${senderId}`,
        method: "GET",
      }),
      providesTags: (result, error, { receiverId }) => [
        { type: "ChatMessages", id: receiverId },
      ],
      keepUnusedDataFor: 3600,
    }),

    // Send a message
    sendMessage: builder.mutation({
      query: ({ endpoint, payload }) => ({
        url: `superadmin/${endpoint}/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { payload }) => [
        { type: "ChatMessages", id: payload.Receiver_Id },
        { type: "ChatCount", id: payload.Receiver_Id },
      ],
    }),

    // Update a message
    updateMessage: builder.mutation({
      query: (payload) => ({
        url: `superadmin/UserChatMasterCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, payload) => [
        { type: "ChatMessages", id: payload.Receiver_Id },
      ],
    }),

    // Delete a message
    deleteMessage: builder.mutation({
      query: ({ id, receiverId, deleteType }) => ({
        url: `superadmin/UserChatMasterCRUD/?id=${id}&RecevierId=${receiverId}&deleteType=${deleteType}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { receiverId }) => [
        { type: "ChatMessages", id: receiverId },
      ],
    }),

    // Update chat read flag
    updateChatReadFlag: builder.mutation({
      query: ({ receiverId, senderId }) => ({
        url: `superadmin/Chatreadflagchange/?RecevierId=${receiverId}&SenderId=${senderId}`,
        method: "GET",
      }),
      invalidatesTags: (result, error, { receiverId }) => [
        { type: "ChatCount", id: receiverId },
      ],
    }),

    // --- NEW ROOM-BASED ENDPOINTS ---

    getRooms: builder.query({
      query: (userId) => ({
        url: `superadmin/ChatRoomListwithPagination/?created_by=${userId}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response?.results || [];
      },
    }),

    createRoom: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatRoomCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { skipInvalidate }) => 
        skipInvalidate ? [] : ["Rooms"],
    }),

    getRoomById: builder.query({
      query: (roomId) => ({
        url: `superadmin/ChatRoomCRUD/?id=${roomId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Rooms", id }],
    }),

    updateRoom: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatRoomCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rooms", id },
        "Rooms",
      ],
    }),

    patchRoom: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatRoomCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rooms", id },
        "Rooms",
      ],
    }),

    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `superadmin/ChatRoomCRUD/?id=${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),

    roomSearch: builder.query({
      query: (searchTerm) => ({
        url: `superadmin/ChatRoomSearch/?search=${searchTerm}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response?.results || [];
      },
    }),

    addParticipant: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatParticipantCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { room, skipInvalidate }) => 
        skipInvalidate ? [{ type: "Participants", id: room }] : [{ type: "Participants", id: room }, "Rooms"],
    }),

    getParticipants: builder.query({
      query: (roomId) => ({
        url: `superadmin/ChatParticipantList/?room=${roomId}`,
        method: "GET",
      }),
      providesTags: (result, error, roomId) => [
        { type: "Participants", id: roomId },
      ],
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response?.results || [];
      },
    }),

    getParticipantById: builder.query({
      query: (participantId) => ({
        url: `superadmin/ChatParticipantCRUD/?id=${participantId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Participants", id }],
    }),

    updateParticipant: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatParticipantCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id, room }) => [
        { type: "Participants", id },
        { type: "Participants", id: room },
      ],
    }),

    patchParticipant: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatParticipantCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id, room }) => [
        { type: "Participants", id },
        { type: "Participants", id: room },
      ],
    }),

    deleteParticipant: builder.mutation({
      query: (participantId) => ({
        url: `superadmin/ChatParticipantCRUD/?id=${participantId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { skipInvalidate }) => 
        skipInvalidate ? ["Participants"] : ["Participants", "Rooms"],
    }),

    participantSearch: builder.query({
      query: (searchTerm) => ({
        url: `superadmin/ChatParticipantSearch/?search=${searchTerm}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response?.results || [];
      },
    }),

    getRoomMessages: builder.query({
      query: ({ roomId, page = 1, userId }) => ({
        url: `superadmin/MessageList/?room=${roomId}&page=${page}&user_id=${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, { roomId }) => [
        { type: "Messages", id: roomId },
      ],
      transformResponse: (response) => {
        const messages = Array.isArray(response)
          ? response
          : response?.results || [];

        const filtered = messages
          .map((msg) => {
            if (msg.message === "This message was deleted") {
              return { ...msg, message_type: "text" };
            }
            return msg;
          });

        return [...filtered].reverse();
      },
    }),

    sendRoomMessage: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
        "Rooms",
      ],
    }),

    updateRoomMessage: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { room, id }) => [
        { type: "Messages", id: room },
        { type: "Messages", id },
      ],
    }),

    patchRoomMessage: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { room, id }) => [
        { type: "Messages", id: room },
        { type: "Messages", id },
      ],
    }),

    deleteRoomMessage: builder.mutation({
      query: ({ id, room }) => ({
        url: `superadmin/MessageCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    messageSearch: builder.query({
      query: (searchTerm) => ({
        url: `superadmin/MessageSearch/?search=${searchTerm}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response?.results || [];
      },
    }),

    addReaction: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageReactionCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    deleteReaction: builder.mutation({
      query: (reactionId) => ({
        url: `superadmin/MessageReactionCRUD/?id=${reactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms", "Messages"],
    }),

    getMessageEditHistory: builder.query({
      query: (messageId) => ({
        url: `superadmin/MessageEditHistoryCRUD/?message=${messageId}`,
        method: "GET",
      }),
    }),

    createMessageEditHistory: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageEditHistoryCRUD/`,
        method: "POST",
        body: payload,
      }),
    }),

    updateMessageEditHistory: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageEditHistoryCRUD/`,
        method: "PUT",
        body: payload,
      }),
    }),

    patchMessageEditHistory: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageEditHistoryCRUD/`,
        method: "PATCH",
        body: payload,
      }),
    }),

    deleteMessageEditHistory: builder.mutation({
      query: (editHistoryId) => ({
        url: `superadmin/MessageEditHistoryCRUD/?id=${editHistoryId}`,
        method: "DELETE",
      }),
    }),

    getParticipantSearch: builder.query({
      query: (searchTerm) => ({
        url: `superadmin/ChatParticipantSearch/`,
        method: "GET",
        params: { search: searchTerm },
      }),
      providesTags: ["Rooms"],
    }),

    // Message Read Status
    createMessageReadStatus: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageReadStatusCRUD/`,
        method: "POST",
        body: payload,
      }),
    }),

    getMessageReadStatusList: builder.query({
      query: (messageId) => ({
        url: `superadmin/MessageReadStatusList/?message=${messageId}`,
        method: "GET",
      }),
    }),

    // Message Visibility
    createMessageVisibility: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageVisibilityCRUD/`,
        method: "POST",
        body: payload,
      }),
    }),

    deleteMessageVisibility: builder.mutation({
      query: ({ id }) => ({
        url: `superadmin/MessageVisibilityCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    // Get user chat list (rooms and last messages)
    getUserChatList: builder.query({
      query: (userId) => ({
        url: `superadmin/UserChatList/?user_id=${userId}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
      transformResponse: (response) => {
        return response.status ? response.data : [];
      },
    }),

    // Check if a private room exists between two participants
    checkPrivateRoom: builder.mutation({
      query: (payload) => ({
        url: `superadmin/CheckPrivateRoom/`,
        method: "POST",
        body: payload,
      }),
    }),

    // Get user dropdown list for group creation
    getUserDropdownList: builder.query({
      query: () => ({
        url: `superadmin/UserDropdownAPI/`,
        method: "GET",
      }),
    }),

    addMessageAttachment: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageAttachmentCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { room }) => [
        { type: "Messages", id: room },
      ],
    }),

    sendTypingStatus: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MessageCRUD/`,
        method: "POST",
        body: payload,
      }),
    }),

    markMessagesRead: builder.mutation({
      query: (payload) => ({
        url: `superadmin/MarkMessagesRead/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),

    // Chat Notification Settings
    getChatNotificationSettings: builder.query({
      query: ({ userId, roomId }) => ({
        url: `superadmin/ChatNotificationSettingCRUD/?User=${userId}${roomId ? `&Room=${roomId}` : ""}`,
        method: "GET",
      }),
      providesTags: (result, error, { roomId }) => [
        { type: "ChatNotificationSettings", id: roomId || "general" },
      ],
    }),

    createChatNotificationSetting: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatNotificationSettingCRUD/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { Room }) => [
        { type: "ChatNotificationSettings", id: Room || "general" },
      ],
    }),

    updateChatNotificationSetting: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatNotificationSettingCRUD/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { Room }) => [
        { type: "ChatNotificationSettings", id: Room || "general" },
      ],
    }),

    patchChatNotificationSetting: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatNotificationSettingCRUD/`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { Room }) => [
        { type: "ChatNotificationSettings", id: Room || "general" },
      ],
    }),

    deleteChatNotificationSetting: builder.mutation({
      query: (id) => ({
        url: `superadmin/ChatNotificationSettingCRUD/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ChatNotificationSettings"],
    }),

    // Chat Notification Settings Filter
    chatNotificationSettingFilter: builder.mutation({
      query: (payload) => ({
        url: `superadmin/ChatNotificationSettingFilter/`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChatUsersListQuery,
  useGetChatCountQuery,
  useFetchMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
  useUpdateChatReadFlagMutation,
  useGetRoomsQuery,
  useLazyGetRoomsQuery,
  useGetRoomByIdQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  usePatchRoomMutation,
  useDeleteRoomMutation,
  useRoomSearchQuery,
  useAddParticipantMutation,
  useGetParticipantsQuery,
  useLazyGetParticipantsQuery,
  useGetParticipantByIdQuery,
  useUpdateParticipantMutation,
  usePatchParticipantMutation,
  useDeleteParticipantMutation,
  useParticipantSearchQuery,
  useGetRoomMessagesQuery,
  useLazyGetRoomMessagesQuery,
  useSendRoomMessageMutation,
  useUpdateRoomMessageMutation,
  usePatchRoomMessageMutation,
  useDeleteRoomMessageMutation,
  useMessageSearchQuery,
  useAddReactionMutation,
  useDeleteReactionMutation,
  useGetMessageEditHistoryQuery,
  useCreateMessageEditHistoryMutation,
  useUpdateMessageEditHistoryMutation,
  usePatchMessageEditHistoryMutation,
  useDeleteMessageEditHistoryMutation,
  useLazyGetParticipantSearchQuery,
  useGetUserDropdownListQuery,
  useCreateMessageReadStatusMutation,
  useGetMessageReadStatusListQuery,
  useCreateMessageVisibilityMutation,
  useDeleteMessageVisibilityMutation,
  useGetUserChatListQuery,
  useCheckPrivateRoomMutation,
  useAddMessageAttachmentMutation,
  useSendTypingStatusMutation,
  useGetChatNotificationSettingsQuery,
  useLazyGetChatNotificationSettingsQuery,
  useCreateChatNotificationSettingMutation,
  useUpdateChatNotificationSettingMutation,
  usePatchChatNotificationSettingMutation,
  useDeleteChatNotificationSettingMutation,
  useMarkMessagesReadMutation,
  useChatNotificationSettingFilterMutation,
} = ChatRTKQueryAPI;
