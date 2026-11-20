import React, { memo, useEffect, useCallback, useMemo, useState } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RiCheckLine } from "react-icons/ri";
import { MdMoreVert, MdEdit, MdDelete, MdInfo } from "react-icons/md";
import useResponsive from "../hook/useResponsive";
import { useStateContext } from "../../../contexts/ContextProvider";
import { BASE_URL, socket } from "../../../services/auth-services";
import { AvatarCircle } from "../../widgets/StylesComponents";
import { FontStyle } from "../../widgets/CRMStyles";
import { useChatContext } from "../context/Chatcontext";
import { toast } from "react-toastify";
import {
  useCheckPrivateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useUpdateChatReadFlagMutation,
} from "../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import axios from "axios";
import JumboConfirmDialog from "@jumbo/components/JumboConfirmDialog";
import moment from "moment";

const truncateText = (text, length) => {
  return text?.length > length ? `${text.slice(0, length)}...` : text;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "#f0f2f5",
  },
  position: "relative",
  padding: theme.spacing(1.5, 2),
  transition: "background-color 0.2s",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: -0.7,
      left: -0.7,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(0.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const ChatElement = ({
  room,
  user: userProp, // Still support userProp if needed
  check,
  createGroup,
  online,
  handleSelectPerson,
  person,
  HandleRefresh,
  messageCount,
  sendedDate,
  avatarSize = "50px",
}) => {
  const user = room || userProp; // Use room if provided
  const isDesktop = useResponsive("up", "md");
  const [expanded, setExpanded] = useState(false);
  const token = localStorage.getItem("accesstoken");
  const UserId = parseInt(localStorage.getItem("UserId"));

  const { setSelectedRoom, setInitialMessages, typingUsers, onlineUsers } =
    useChatContext();
  const [checkPrivateRoom] = useCheckPrivateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [updateChatReadFlag] = useUpdateChatReadFlagMutation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [editName, setEditName] = useState("");

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleEditOpen = (event) => {
    event.stopPropagation();
    setEditName(room?.Participant_Name || room?.name || "");
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleEditClose = (event) => {
    if (event) event.stopPropagation();
    setOpenEditDialog(false);
  };

  const handleUpdateRoom = async (event) => {
    event.stopPropagation();
    const roomId = room?.room_id || room?.id;
    if (!roomId) return;

    try {
      await updateRoom({
        id: roomId,
        name: editName,
      }).unwrap();
      toast.success(`${room?.room_type === "group" ? "Group" : "Chat"} updated successfully!`);
      handleEditClose();
    } catch (err) {
      console.error("Failed to update room:", err);
      toast.error(`Failed to update ${room?.room_type === "group" ? "group" : "chat"}.`);
    }
  };

  const handleDeleteRoom = (event) => {
    event.stopPropagation();
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    const roomId = room?.room_id || room?.id;
    if (!roomId) return;

    try {
      await deleteRoom(roomId).unwrap();
      toast.success(`${room?.room_type === "group" ? "Group" : "Chat"} deleted successfully!`);
      if (typeof HandleRefresh === "function") HandleRefresh();
    } catch (err) {
      console.error("Failed to delete room:", err);
      toast.error(`Failed to delete ${room?.room_type === "group" ? "group" : "chat"}.`);
    }
  };
  const handleInfoOpen = (event) => {
    event.stopPropagation();
    setOpenInfoDialog(true);
    handleMenuClose();
  };

  const handleInfoClose = (event) => {
    if (event) event.stopPropagation();
    setOpenInfoDialog(false);
  };

  const handleSelectUser = async () => {
    if (createGroup !== "create group") {
      if (room) {
        // Room already exists — open it directly
        const normalizedRoom = {
          ...room,
          id: room.room_id || room.id,
          name: room.Participant_Name || room.name || "Unknown",
        };

        // Call CheckPrivateRoom API whenever a chat is opened
        const targetUserId = room.Participant_id || room.id;
        if (targetUserId && room.room_type === "private") {
          checkPrivateRoom({
            participant_1: UserId,
            participant_2: targetUserId,
          })
            .unwrap()
            .catch((err) => {
              console.error("CheckPrivateRoom Error:", err);
            });
        }

        // WhatsApp-like feature: Mark as read on the backend when opening
        if (targetUserId) {
          updateChatReadFlag({
            receiverId: UserId,
            senderId: targetUserId,
          });
        }

        setSelectedRoom(normalizedRoom);

        // Load the initial messages immediately into the conversation page
        setInitialMessages(room.Participant_Conversation || []);
      }
    } else if (!person) {
      handleSelectPerson(user);
    }
  };

  const renderBadge = () => {
    if (check === true) {
      return (
        <Badge
          badgeContent={
            <RiCheckLine
              color="white"
              style={{ backgroundColor: "green", borderRadius: "50%" }}
            />
          }
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              transform: "translate(5px)",
              padding: 0,
              bottom: -2,
              cursor: "pointer",
            },
          }}
        >
          <AvatarCircle
            size={avatarSize}
            title={
              !user?.User_Photo &&
              (user?.username ||
                (user?.first_name || user?.last_name
                  ? `${user?.first_name || ""} ${user?.last_name || ""}`
                  : "") ||
                user?.Group_Name)
            }
            image={
              (room?.User_Photo || user?.User_Photo) &&
              `${BASE_URL}${room?.User_Photo || user?.User_Photo}`
            }
          />
        </Badge>
      );
    }

    return (
      <Box sx={{ position: "relative" }}>
        <AvatarCircle
          size={avatarSize}
          title={
            room?.Participant_Name ||
            room?.room_name ||
            room?.name ||
            user?.username ||
            (user?.first_name || user?.last_name
              ? `${user?.first_name || ""} ${user?.last_name || ""}`
              : "") ||
            user?.Group_Name
          }
          image={
            (room?.Participant_Photo || room?.User_Photo || user?.User_Photo) &&
            `${BASE_URL}${room?.Participant_Photo || room?.User_Photo || user?.User_Photo}`
          }
        />
        {room?.room_type !== "group" &&
          onlineUsers[Number(room?.Participant_id || room?.id)]?.status ===
            "online" && (
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#2e7d32",
                border: "2px solid #fff",
                zIndex: 2,
              }}
            />
          )}
      </Box>
    );
  };

  return (
    <>
      <StyledChatBox onClick={() => handleSelectUser()}>
        {(room?.unread_count > 0 || messageCount > 0) && (
          <Box
            sx={{
              position: "absolute",
              bottom: 15,
              right: 15,
              minWidth: 20,
              height: 20,
              borderRadius: "10px",
              backgroundColor: "#2e7d32",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600,
              px: 0.5,
              zIndex: 1,
            }}
          >
            {room?.unread_count || messageCount}
          </Box>
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            {!online ? (
              renderBadge()
            ) : (
              <AvatarCircle
                size={avatarSize}
                title={
                  user?.username ||
                  (user?.first_name || user?.last_name
                    ? `${user?.first_name || ""} ${user?.last_name || ""}`
                    : "") ||
                  user?.Group_Name
                }
                image={user?.User_Photo && `${BASE_URL}${user?.User_Photo}`}
              />
            )}
            <Stack spacing={0.3}>
              <Typography sx={{ ...FontStyle, fontWeight: 500 }}>
                {room?.room_type === "group"
                  ? room?.room_name || room?.name
                  : room?.Participant_Name ||
                    room?.name ||
                    user?.username ||
                    (user?.first_name || user?.last_name
                      ? `${user?.first_name || ""} ${user?.last_name || ""}`
                      : "") ||
                    user?.Group_Name}
              </Typography>
              {!createGroup && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {room?.Participant_Conversation?.[
                    room.Participant_Conversation.length - 1
                  ]?.Participant_id === UserId && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <RiCheckLine
                        size={14}
                        color={
                          room.Participant_Conversation[
                            room.Participant_Conversation.length - 1
                          ].is_unread === false ||
                          room.Participant_Conversation[
                            room.Participant_Conversation.length - 1
                          ].is_unread === "false"
                            ? "#34B7F1"
                            : "#666"
                        }
                      />
                    </Box>
                  )}
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color:
                        room &&
                        typingUsers[Number(room.room_id || room.id)] &&
                        Object.keys(
                          typingUsers[Number(room.room_id || room.id)],
                        ).length > 0
                          ? "#2e7d32"
                          : "#667781",
                      fontWeight:
                        room &&
                        typingUsers[Number(room.room_id || room.id)] &&
                        Object.keys(
                          typingUsers[Number(room.room_id || room.id)],
                        ).length > 0
                          ? 600
                          : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "180px",
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                  >
                    {room &&
                    typingUsers[Number(room.room_id || room.id)] &&
                    Object.keys(typingUsers[Number(room.room_id || room.id)])
                      .length > 0
                      ? "Typing..."
                      : truncateText(
                          room?.last_message ||
                            room?.Participant_Conversation?.[
                              room.Participant_Conversation.length - 1
                            ]?.message ||
                            room?.Participant_Conversation?.[
                              room.Participant_Conversation.length - 1
                            ]?.Participant_Message ||
                            user?.Designation ||
                            "",
                          30,
                        )}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack
            spacing={0.3}
            alignItems="flex-end"
            sx={{ position: "absolute", top: 12, right: 15 }}
          >
            <Typography sx={{ fontSize: "12px", color: "#667781" }}>
              {room?.last_message_time
                ? moment(room.last_message_time).format("h:mm A")
                : ""}
            </Typography>
            {room && !createGroup && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                className="chat-menu-btn"
                sx={{
                  visibility: "hidden",
                  ".MuiBox-root:hover &": {
                    visibility: "visible",
                  },
                }}
              >
                <MdMoreVert size={18} />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </StyledChatBox>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {room?.room_type === "group" && (
          <MenuItem onClick={handleEditOpen}>
            <ListItemIcon>
              <MdEdit size={18} />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}

        {room?.room_type === "group" && (
          <MenuItem onClick={handleInfoOpen}>
            <ListItemIcon>
              <MdInfo size={18} />
            </ListItemIcon>
            <ListItemText>Group Info</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDeleteRoom} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <MdDelete size={18} color="tomato" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Edit Room Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="standard"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button
            onClick={handleUpdateRoom}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog */}
      <Dialog
        open={openInfoDialog}
        onClose={handleInfoClose}
        onClick={(e) => e.stopPropagation()}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ ...FontStyle, fontWeight: "bold" }}>
          Group Information
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ ...FontStyle, mb: 1, fontWeight: "bold" }}>
            Participants: {room?.Participant_List?.length || 0}
          </Typography>
          <Stack spacing={1}>
            {room?.Participant_List?.map((p, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Avatar sx={{ width: 24, height: 24, fontSize: "12px" }}>
                  {(p.Participant_Name?.[0] || "?").toUpperCase()}
                </Avatar>
                <Typography sx={{ ...FontStyle }}>
                  {p.Participant_Name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <JumboConfirmDialog
        open={openDeleteDialog}
        title="Delete Chat"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default memo(ChatElement);
