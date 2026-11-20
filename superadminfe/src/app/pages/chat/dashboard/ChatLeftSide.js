import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Popover,
  Stack,
  Typography,
  useTheme,
  Fab,
  Tooltip as MuiTooltip,
  Button,
} from "@mui/material";
import { PiCaretDoubleLeftLight, PiCaretDoubleRight } from "react-icons/pi";
import {
  MdBusiness,
  MdDateRange,
  MdEmail,
  MdGroupAdd,
  MdLocalPhone,
  MdMoreVert,
  MdPhotoCamera,
  MdAdd,
  MdArrowBack,
  MdSettings,
  MdOutlineFilterList,
} from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import CreateGroups from "../components/CreateGroups";
import ChatElement from "../components/ChatElement";
import NoChat from "../components/chatHeaderAndFooter/NoChat";
import ChatSettingsDialog from "../components/chatHeaderAndFooter/ChatSettingsDialog";
import { useStateContext } from "../../../contexts/ContextProvider";
import { BASE_URL, socket } from "../../../services/auth-services";
import { ProfileImageUpload } from "../../contacts/extra-components/APIs";
import useResponsive from "../hook/useResponsive";
import { Search, SearchIconWrapper, StyledInputBase } from "../widgets/Search";
import {
  errorFilter,
  formatDate,
  htmlToText,
} from "../../widgets/StylesComponents";
import { ComponentHeading, FontStyle } from "../../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import { Spin } from "antd";
import { useChatContext } from "../context/Chatcontext";
import {
  useGetUserChatListQuery,
  useGetUserDropdownListQuery,
  useCheckPrivateRoomMutation,
  useCreateRoomMutation,
  useAddParticipantMutation,
  useGetRoomByIdQuery,
} from "../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import { toast } from "react-toastify";
import { debounce } from "lodash";

function ChatLeftSide() {
  const { users, setUsers } = useStateContext();

  const {
    sidebarOpen,
    setSidebarOpen,
    setUnreadChatCount,
    selectedRoom,
    playChatSound,
    setInitialMessages,
    setSelectedRoom,
    setTypingUsers,
    setOnlineUsers,
  } = useChatContext();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const UserId = localStorage.getItem("UserId");
  const {
    data: chatList,
    isLoading: isChatListLoading,
    refetch: fetchChatList,
  } = useGetUserChatListQuery(UserId);

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [openProfile, setOpenProfile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0: All, 1: Unread, 2: Groups

  const [base64, setBase64] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("UserDetails"));

  const location = useLocation();
  const navigate = useNavigate();

  // Listen for roomId in location state to automatically select a room
  useEffect(() => {
    if (location.state?.roomId && chatList) {
      const targetRoomId = Number(location.state.roomId);

      // Robustly handle different response formats for chatList
      let rawRooms = [];
      if (Array.isArray(chatList)) {
        rawRooms = chatList;
      } else if (chatList?.data && Array.isArray(chatList.data)) {
        rawRooms = chatList.data;
      }

      const targetRoom = rawRooms.find(
        (room) => Number(room.room_id || room.id) === targetRoomId,
      );

      if (targetRoom) {
        const normalizedRoom = {
          ...targetRoom,
          id: targetRoom.room_id || targetRoom.id,
          name: targetRoom.Participant_Name || targetRoom.name || "Unknown",
        };
        setSelectedRoom(normalizedRoom);
        // Load the initial messages immediately
        setInitialMessages(targetRoom.Participant_Conversation || []);

        // Clear state to prevent re-selection on other navigations
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [
    location.state?.roomId,
    chatList,
    setSelectedRoom,
    setInitialMessages,
    navigate,
    location.pathname,
  ]);

  const [showAllUsers, setShowAllUsers] = useState(false);
  const { data: userDropdownList, isLoading: isUsersLoading } =
    useGetUserDropdownListQuery(undefined, { skip: !showAllUsers });

  useEffect(() => {
    // Robustly handle different response formats
    let rawRooms = [];
    if (Array.isArray(chatList)) {
      rawRooms = chatList;
    } else if (chatList?.data && Array.isArray(chatList.data)) {
      rawRooms = chatList.data;
    }

    // WhatsApp-like feature: The currently selected room should always have 0 unread count in frontend
    const processedRooms = rawRooms.map((room) => {
      // If this room is currently active, clear its count immediately for instant UI feedback
      if (selectedRoom?.id === (room.room_id || room.id)) {
        return { ...room, unread_count: 0 };
      }

      // Get the last message from the room's conversation history
      const lastMessage =
        room.Participant_Conversation?.[
          room.Participant_Conversation.length - 1
        ];

      // Different API versions might use Participant_id or sender
      const lastSenderId = lastMessage?.Participant_id || lastMessage?.sender;

      if (lastSenderId && Number(lastSenderId) === Number(UserId)) {
        return { ...room, unread_count: 0 };
      }
      return room;
    });

    setFilteredRooms(processedRooms);

    // Sync online status from initial chat list
    const statuses = {};
    rawRooms.forEach((room) => {
      if (room.room_type !== "group") {
        const uId = Number(room.Participant_id || room.id);
        if (uId) {
          statuses[uId] = {
            status: room.is_online ? "online" : "offline",
            last_seen: room.last_seen,
          };
        }
      }
    });
    setOnlineUsers((prev) => ({ ...prev, ...statuses }));
  }, [chatList, UserId, selectedRoom?.id, setOnlineUsers]);

  // Listen for new messages via socket to update the sidebar in real-time
  useEffect(() => {
    const handleNewMessage = (data) => {
      // If the message   involves the current user, refresh the chat list
      if (
        Number(data?.receiverId) === Number(UserId) ||
        Number(data?.senderId) === Number(UserId)
      ) {
        fetchChatList();

        // Play sound if current user is the receiver
        if (Number(data?.receiverId) === Number(UserId)) {
          playChatSound(null, null, data?.room_id || data?.roomId);
        }
      }
    };

    socket.on("receive_notification_message", handleNewMessage);

    return () => {
      socket.off("receive_notification_message", handleNewMessage);
    };
  }, [UserId]);

  // Global listener for typing events via ML WebSocket bridge
  useEffect(() => {
    const handleTyping = (e) => {
      const data = e.detail;
      if (data.event_type === "TYPING" || data.event_type === "GROUP_TYPING") {
        const roomId = Number(data.room_id || data.group_id);
        const senderId = Number(data.sender);
        const senderName = data.sender_name;
        const isTyping = data.is_typing;

        if (senderId === Number(UserId)) return;

        setTypingUsers((prev) => {
          const roomTyping = { ...(prev[roomId] || {}) };
          if (isTyping) {
            roomTyping[senderId] = senderName;
          } else {
            delete roomTyping[senderId];
          }
          return { ...prev, [roomId]: roomTyping };
        });
      }
    };

    window.addEventListener("ml-typing", handleTyping);
    return () => {
      window.removeEventListener("ml-typing", handleTyping);
    };
  }, [UserId, setTypingUsers]);

  const sortedChats = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      const lastA =
        a.last_message_time ||
        a.Participant_Conversation?.[a.Participant_Conversation.length - 1]
          ?.created_at;
      const lastB =
        b.last_message_time ||
        b.Participant_Conversation?.[b.Participant_Conversation.length - 1]
          ?.created_at;
      if (lastA && lastB) return new Date(lastB) - new Date(lastA);
      return 0;
    });
  }, [filteredRooms]);

  const displayChats = useMemo(() => {
    let list = sortedChats;
    
    // Tab Filtering
    if (currentTab === 1) { // Unread
      list = list.filter(c => c.unread_count > 0);
    } else if (currentTab === 2) { // Groups
      list = list.filter(c => c.room_type === "group");
    }

    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter((c) => {
      const name = c.room_name || c.Participant_Name || c.name || "";
      return name.toLowerCase().includes(term);
    });
  }, [sortedChats, search, currentTab]);

  const displayAllUsers = useMemo(() => {
    if (!userDropdownList) return [];

    // Get all user IDs from existing PRIVATE chats only.
    // Group chat participants should NOT be filtered out.
    const existingPrivateChatUserIds = new Set(
      Array.isArray(chatList)
        ? chatList
            .filter((chat) => chat.room_type?.toLowerCase() === "private")
            .map((chat) => Number(chat.Participant_id))
            .filter((id) => !isNaN(id) && id > 0)
        : [],
    );

    // Current user's ID to exclude as well
    const currentUserId = Number(UserId);

    let list = userDropdownList.filter((u) => {
      const uId = Number(u.id);
      // 1. Exclude the current user
      // 2. Exclude users we already have a PRIVATE chat with
      // 3. Exclude any actual "groups" that might be in the dropdown (keep only users)
      return (
        uId !== currentUserId &&
        !existingPrivateChatUserIds.has(uId) &&
        !u.Group_Name
      );
    });

    if (!search) return list;
    const term = search.toLowerCase();
    return list.filter((u) => {
      const name = u.username || "";
      return name.toLowerCase().includes(term);
    });
  }, [userDropdownList, chatList, search, UserId]);

  const HandleRefresh = async () => {
    await fetchChatList();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value?.trim());
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base = btoa(event.target.result);
      const imageName = `${file.lastModified}${file.name}`;
      const payload = {
        base64: base,
        imageName,
        id: localStorage.getItem("UserId"),
        username: localStorage.getItem("Username"),
      };

      const errors = errorFilter(payload);
      if (!Object.keys(errors).length) {
        setBase64(base);
        ProfileImageUpload(
          payload,
          setOpenProfile,
          "UserCRUD",
          refreshUserData,
          "useradmin",
        );
      } else {
        toast.error("Error in payload: " + JSON.stringify(errors));
        console.error("Error in payload:", errors);
      }
    };
    reader.readAsBinaryString(file);
  };

  const refreshUserData = async (res) => {
    fetchChatList();
  };

  const profile = () => (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Gradient Header */}
      <Box
        sx={{
          height: 120,
          background: "linear-gradient(135deg, #379666 0%, #2C7A53 100%)",
          width: "100%",
        }}
      />

      <Stack alignItems="center" sx={{ mt: -6, px: 3, pb: 3 }}>
        <Box sx={{ position: "relative" }}>
          <label htmlFor="profile_pics" title="Click to upload Image">
            <Avatar
              alt={htmlToText(currentUser?.username || "")?.[0]}
              src={BASE_URL + currentUser?.User_Photo}
              sx={{
                width: 100,
                height: 100,
                cursor: "pointer",
                border: "4px solid #fff",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  opacity: 0.8,
                  filter: "brightness(0.8)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 5,
                right: 5,
                backgroundColor: "#fff",
                borderRadius: "50%",
                p: 0.5,
                display: "flex",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                pointerEvents: "none",
              }}
            >
              <MdPhotoCamera size={16} color="#379666" />
            </Box>
          </label>
          <input
            type="file"
            id="profile_pics"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </Box>

        <Typography
          className="font-bold"
          sx={{ fontSize: 20, mt: 2, color: "#333", textAlign: "center" }}
        >
          {htmlToText(currentUser?.username || currentUser?.Group_Name || "")}
        </Typography>
        <Typography
          sx={{ fontSize: 14, color: "gray", mb: 3, textAlign: "center" }}
        >
          {currentUser?.Designation || "No Designation"}
        </Typography>

        <Stack spacing={2} sx={{ width: "100%" }}>
          {currentUser?.email && (
            <UserInfo
              icon={<MdEmail size={20} color="#379666" />}
              label="E-mail"
              value={currentUser.email}
            />
          )}
          {currentUser?.PhoneNo && (
            <UserInfo
              icon={<MdLocalPhone size={20} color="#379666" />}
              label="Phone Number"
              value={currentUser.PhoneNo}
            />
          )}
          <UserInfo
            icon={<MdBusiness size={20} color="#379666" />}
            label="Designation"
            value={currentUser?.Designation || "No Designation"}
          />
          <UserInfo
            icon={<MdDateRange size={20} color="#379666" />}
            label="Joined"
            value={formatDate(currentUser?.date_joined) || "-"}
          />
          <Divider sx={{ my: 1 }} />
          <Button
            fullWidth
            startIcon={<MdSettings size={20} />}
            onClick={() => {
              setOpenSettings(true);
              setOpenProfile(null);
            }}
            sx={{
              justifyContent: "flex-start",
              color: "#379666",
              textTransform: "none",
              py: 1,
              px: 2,
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "rgba(55, 150, 102, 0.05)",
              },
            }}
          >
            Settings
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  const UserInfo = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          backgroundColor: "rgba(55, 150, 102, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{ fontSize: 12, color: "gray", lineHeight: 1, mb: 0.5 }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );

  const [checkPrivateRoom] = useCheckPrivateRoomMutation();
  const [createRoom] = useCreateRoomMutation();
  const [addParticipant] = useAddParticipantMutation();

  const handleUserClick = async (selectedUser) => {
    if (!selectedUser?.id) return;
    setIsCreatingChat(true);

    try {
      const res = await checkPrivateRoom({
        participant_1: Number(UserId),
        participant_2: Number(selectedUser.id),
      }).unwrap();

      console.log("CheckPrivateRoom Response:", res);

      if (res.status === false) {
        // Room does not exist, create it
        const roomPayload = {
          name: selectedUser.username || "Private Chat",
          room_type: "private",
          created_by: Number(UserId),
          is_active: true,
        };

        const newRoom = await createRoom({
          ...roomPayload,
          skipInvalidate: true,
        }).unwrap();
        console.log("New Room Created:", newRoom);

        if (newRoom && newRoom.id) {
          // Add participants
          await addParticipant({
            room: newRoom.id,
            user: Number(UserId),
            is_admin: true,
            is_muted: false,
            skipInvalidate: true,
          }).unwrap();

          await addParticipant({
            room: newRoom.id,
            user: Number(selectedUser.id),
            is_admin: false,
            is_muted: false,
          }).unwrap();

          // Select the newly created room
          setSelectedRoom({
            ...newRoom,
            id: newRoom.id,
            name: selectedUser.username,
            room_type: "private",
            is_new: true, // Flag as new to skip initial message fetch
          });
          setShowAllUsers(false);
          toast.success("Chat started!");
        }
      } else if (res.status === true && res.room_id) {
        // Room exists, select it
        setSelectedRoom({
          id: res.room_id,
          name: selectedUser.username,
          room_type: "private",
        });
        setShowAllUsers(false);
        toast.info("Room already exists");
      }
    } catch (err) {
      console.error("Error in handleUserClick:", err);
      toast.error("Failed to start chat.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <>
      {isCreatingChat && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Spin size="large" />
          <Typography sx={{ color: "#379666", fontWeight: 600 }}>
            Opening Chat...
          </Typography>
        </Box>
      )}
      {!openDialog ? (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            backgroundColor: "#fff",
            borderRight: "1px solid #e0e0e0",
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, py: 2 }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#1c1d2c",
                fontFamily: "inherit",
              }}
            >
              CRM Chat System
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={() => setOpenDialog(true)}>
                <MdGroupAdd size={22} color="#54656f" />
              </IconButton>
              <IconButton onClick={(e) => setOpenProfile(e.currentTarget)}>
                <MdMoreVert size={22} color="#54656f" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Search & Filter */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, mb: 1 }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                bgcolor: "#f0f2f5",
                borderRadius: "20px",
                px: 2,
                height: "40px",
              }}
            >
              <IoIosSearch color="#54656f" size={20} />
              <StyledInputBase
                onChange={handleSearch}
                placeholder="Search chats..."
                inputProps={{ "aria-label": "search" }}
                sx={{
                  ml: 1,
                  fontSize: "14px",
                  color: "#54656f",
                  width: "100%",
                  "& .MuiInputBase-input": {
                    padding: "8px 0",
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Tabs */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ px: 2, mt: 1, borderBottom: "1px solid #f0f2f5" }}
          >
            {["All", "Unread", "Groups"].map((label, index) => (
              <Box
                key={label}
                onClick={() => setCurrentTab(index)}
                sx={{
                  pb: 1,
                  cursor: "pointer",
                  position: "relative",
                  color: currentTab === index ? "#2e7d32" : "#54656f",
                  fontWeight: currentTab === index ? 600 : 400,
                  fontSize: "14px",
                  "&::after": currentTab === index ? {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "3px",
                    bgcolor: "#2e7d32",
                    borderRadius: "3px 3px 0 0",
                  } : {},
                }}
              >
                {label}
              </Box>
            ))}
          </Stack>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: "hidden", mt: 1 }}>
            <JumboScrollbar
              autoHide
              style={{ height: "100%" }}
            >
              <Box sx={{ px: 1 }}>
                {isChatListLoading || (showAllUsers && isUsersLoading) ? (
                  <Div sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Spin tip="Loading" />
                  </Div>
                ) : showAllUsers ? (
                  <>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, py: 1 }}>
                      <IconButton onClick={() => setShowAllUsers(false)} size="small">
                        <MdArrowBack size={20} />
                      </IconButton>
                      <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        Back to Chats
                      </Typography>
                    </Stack>
                    {displayAllUsers.length > 0 ? (
                      displayAllUsers.map((user, index) => (
                        <ChatElement
                          key={`user-${index}`}
                          user={user}
                          HandleRefresh={HandleRefresh}
                          createGroup="create group"
                          handleSelectPerson={handleUserClick}
                        />
                      ))
                    ) : (
                      <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                        No users found
                      </Typography>
                    )}
                  </>
                ) : (
                  <>
                    {displayChats.length > 0 ? (
                      displayChats.map((room, index) => (
                        <ChatElement
                          key={`chat-${index}`}
                          room={room}
                          HandleRefresh={HandleRefresh}
                        />
                      ))
                    ) : (
                      <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                        No chats found
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </JumboScrollbar>
          </Box>

          {/* New Chat Button */}
          <Box sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 10 }}>
            <Fab
              onClick={() => setShowAllUsers(true)}
              sx={{
                bgcolor: "#2e7d32",
                color: "#fff",
                "&:hover": { bgcolor: "#1b5e20" },
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              <MdAdd size={28} />
            </Fab>
          </Box>
        </Box>
      ) : (
        <CreateGroups
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
        />
      )}

      <Popover
        open={Boolean(openProfile)}
        anchorEl={openProfile}
        onClose={() => {
          setOpenProfile(null);
          setBase64("");
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ borderRadius: "5px !important" }}
      >
        <Box sx={{ width: "380px", minHeight: "500px" }}>{profile()}</Box>
      </Popover>

      <ChatSettingsDialog
        open={openSettings}
        handleClose={() => setOpenSettings(false)}
        roomId={null}
      />
    </>
  );
}

export default memo(ChatLeftSide);
