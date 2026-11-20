import React from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Slide,
  Dialog,
  DialogContent,
  DialogTitle,
  Popover,
  InputBase,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  DialogActions,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { BsCheckAll } from "react-icons/bs";
import { MdOutlineEmojiEmotions, MdEdit } from "react-icons/md";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  useUpdateRoomMessageMutation,
  useAddReactionMutation,
  useGetUserDropdownListQuery,
  useDeleteRoomMessageMutation,
  useDeleteMessageVisibilityMutation,
  useDeleteReactionMutation,
  useGetParticipantsQuery,
} from "../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import moment from "moment";

import Div from "@jumbo/shared/Div";
import {
  DisplayFlex,
  FontStyle,
  PrimaryColor,
  ButtonStyle,
  dialogTitle,
  Colors,
} from "../../widgets/CRMStyles";
import { PiDotsThreeVertical } from "react-icons/pi";
import { MdPhoneMissed } from "react-icons/md";
import { VscCallIncoming, VscCallOutgoing } from "react-icons/vsc";
import { SlCallEnd } from "react-icons/sl";
import { FaFileArchive } from "react-icons/fa";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { BASE_URL } from "../../../services/auth-services";
import Zip from "../../../assets/images/zip.png";
import Exe from "../../../assets/images/exe.png";
import Pdf from "../../../assets/images/pdf.png";
import useResponsive from "../hook/useResponsive";
import { Image } from "antd";
import { useChatContext } from "../context/Chatcontext";
import { IoMdArrowDropdown } from "react-icons/io";
import { toast } from "react-toastify";

// helper functions
export const getFileName = (fileUrl) => {
  if (!fileUrl) return "";
  return fileUrl.split("/").pop();
};

export const getMediaUrl = (fileUrl, msg) => {
  // If we have an attachments array, use the first attachment's file path
  const attachment =
    msg?.attachments && msg.attachments.length > 0 ? msg.attachments[0] : null;
  const path = attachment ? attachment.file : fileUrl;

  if (!path) return "";
  if (path.startsWith("http")) return path;

  const baseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const file = path.startsWith("/") ? path : "/" + path;
  return baseUrl + file;
};

// file download function
const handleDownload = async (msg) => {
  try {
    const attachment =
      msg?.attachments && msg.attachments.length > 0
        ? msg.attachments[0]
        : null;
    let url = "";
    let fileName = "";

    if (attachment) {
      const rawFile = attachment.file || "";
      const name = rawFile.split("/").pop();
      const baseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
      url = `${baseUrl}/superadmin/${name}/`;
      fileName = name;
    } else {
      url = getMediaUrl(msg?.File, msg);
      fileName = getFileName(url);
    }

    const token = localStorage.getItem("accesstoken");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        db: localStorage.getItem("DBName") || "crmuseradmin1",
      },
    });
    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

// image, pdf, text etc view function
const ViewImage = (msg) => {
  window.open(getMediaUrl(msg?.File || msg?.attachments?.[0]?.file, msg), "_blank");
};

const formatWhatsAppDate = (dateString) => {
  if (!dateString) return "";
  const date = moment(dateString);
  const now = moment();

  if (date.isSame(now, "day")) {
    return date.format("h:mm A");
  } else if (date.isSame(now.clone().subtract(1, "days"), "day")) {
    return date.format("[Yesterday], h:mm A");
  } else {
    return date.format("MMM D, h:mm A");
  }
};

const Timestamp = ({
  date,
  isSender,
  readStatus,
  isEdited,
  seenBy,
  isSeen,
  isGroup,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      justifyContent="flex-end"
      sx={{ mt: 0.2 }}
    >
      {isEdited && (
        <Typography
          sx={{
            fontSize: "9px",
            color: "#667781",
            fontStyle: "italic",
          }}
        >
          edited
        </Typography>
      )}
      <Typography sx={{ fontSize: "11px", color: "#667781" }}>
        {new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>
      {isSender && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isSeen ||
          (seenBy && seenBy.length > 0) ||
          readStatus === "read" ||
          readStatus === false ||
          readStatus === "false" ? (
            <BsCheckAll size={18} color="#2e7d32" />
          ) : readStatus === "delivered" ? (
            <BsCheckAll size={18} color="#667781" />
          ) : (
            <IoMdCheckmark size={14} color="#667781" />
          )}
        </Box>
      )}
    </Stack>
  );
};

const ReplyMessage = ({ reply }) => {
  if (!reply) return null;
  return (
    <Box
      sx={{
        backgroundColor: "rgba(0,0,0,0.05)",
        borderLeft: "4px solid #2e7d32",
        borderRadius: "4px",
        p: 1,
        mb: 1,
        fontSize: "12px",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", display: "block", color: "#2e7d32" }}
      >
        Replying to:
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "13px", color: "#54656f" }}
      >
        {reply.message}
      </Typography>
    </Box>
  );
};

const Reactions = ({ reactions }) => {
  const { setReactionDetails } = useChatContext();
  if (!reactions || reactions.length === 0) return null;

  const handleClick = (e) => {
    e.stopPropagation();
    setReactionDetails({ reactions, open: true });
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ mt: 0.5, flexWrap: "wrap", cursor: "pointer" }}
      onClick={handleClick}
    >
      {reactions.slice(0, 3).map((r, i) => (
        <Box
          key={i}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: 5,
            px: 0.8,
            py: 0.1,
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {r.reaction}
        </Box>
      ))}
      {reactions.length > 3 && (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: 5,
            px: 1,
            py: 0.1,
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            color: "#379666",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          +{reactions.length - 3}
        </Box>
      )}
    </Stack>
  );
};

const ReactionDetailsDialog = () => {
  const { reactionDetails, setReactionDetails, selectedRoom } =
    useChatContext();
  const { data: userList } = useGetUserDropdownListQuery();
  const [deleteReaction] = useDeleteReactionMutation();
  const currentUserId = Number(localStorage.getItem("UserId"));

  if (!reactionDetails) return null;

  const handleClose = () => {
    setReactionDetails(null);
  };

  const getUserName = (userId) => {
    if (!userList) return `User ${userId}`;
    const user = userList.find((u) => u.id == userId);
    return user ? user.username : `User ${userId}`;
  };

  const getUserPhoto = (userId) => {
    if (!userList) return "/media/default.png";
    const user = userList.find((u) => u.id == userId);
    return user
      ? user.user_photo || user.Participant_Photo || "/media/default.png"
      : "/media/default.png";
  };

  const handleDeleteReaction = async (reactionId) => {
    try {
      await deleteReaction(reactionId).unwrap();
      toast.success("Reaction removed");

      const updatedReactions = reactionDetails.reactions.filter(
        (r) => r.id !== reactionId,
      );
      if (updatedReactions.length === 0) {
        handleClose();
      } else {
        setReactionDetails({
          ...reactionDetails,
          reactions: updatedReactions,
        });
      }
    } catch (error) {
      console.error("Failed to delete reaction:", error);
      toast.error("Failed to delete reaction");
    }
  };

  return (
    <Dialog
      open={reactionDetails.open}
      onClose={handleClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          minWidth: "320px",
          borderRadius: 4,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 3, fontWeight: "bold" }}>
        Reactions
      </DialogTitle>
      <DialogContent sx={{ px: 2, pb: 2 }}>
        <List sx={{ pt: 0 }}>
          {reactionDetails.reactions.map((r, index) => {
            const userId = r.user_id || r.User_id;
            const userName =
              r.user_name || r.Participant_Name || getUserName(userId);
            const userPhoto =
              r.user_photo || r.Participant_Photo || getUserPhoto(userId);
            const isMyReaction = Number(userId) === currentUserId;

            return (
              <ListItem
                key={index}
                sx={{
                  "&:hover": isMyReaction
                    ? {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        cursor: "pointer",
                      }
                    : {},
                }}
                onClick={
                  isMyReaction ? () => handleDeleteReaction(r.id) : undefined
                }
              >
                <ListItemAvatar>
                  <Avatar src={userPhoto} alt={userName} />
                </ListItemAvatar>
                <ListItemText
                  primary={userName}
                  secondary={isMyReaction ? "Tap to remove" : ""}
                />
                <Typography variant="h6">{r.reaction}</Typography>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const useSender = (msg) => {
  const { selectedRoom } = useChatContext();
  const UserId = localStorage.getItem("UserId");
  const msgSenderId = Number(
    msg?.Participant_id ||
      msg?.sender?.id ||
      msg?.sender ||
      msg?.SenderId ||
      msg?.sender_id,
  );

  const { data: participants } = useGetParticipantsQuery(selectedRoom?.id, {
    skip:
      !(
        selectedRoom?.room_type === "group" ||
        selectedRoom?.type === "group" ||
        selectedRoom?.is_group
      ) || !selectedRoom?.id,
  });

  const getSenderData = () => {
    if (msgSenderId === Number(UserId)) {
      const currentUser = JSON.parse(localStorage.getItem("UserDetails"));
      return {
        username: currentUser?.username || "Me",
        photo: currentUser?.User_Photo,
        isMe: true,
      };
    }

    if (msg?.sender && typeof msg.sender === "object") {
      return {
        username: msg.sender.username || "Unknown",
        photo: msg.sender.User_Photo,
        isMe: false,
      };
    }

    if (msg?.Participant_Name || msg?.Participant_Photo) {
      return {
        username: msg.Participant_Name || "Unknown",
        photo: msg.Participant_Photo,
        isMe: msgSenderId === Number(UserId),
      };
    }

    if (msg?.senderDetails) {
      return {
        username: msg.senderDetails.username || "Unknown",
        photo: msg.senderDetails.User_Photo,
        isMe: false,
      };
    }

    if (participants && participants.length > 0) {
      const participant = participants.find(
        (p) =>
          Number(p.user?.id || p.user) === msgSenderId ||
          Number(p.UserId) === msgSenderId,
      );
      if (participant) {
        return {
          username:
            participant.user_name ||
            participant.user?.username ||
            "Unknown User",
          photo: participant.user?.User_Photo || participant.User_Photo,
          isMe: false,
        };
      }
    }

    return { username: "Unknown User", photo: null, isMe: false };
  };

  const isGroup = !!(
    selectedRoom?.room_type === "group" ||
    selectedRoom?.type === "group" ||
    selectedRoom?.is_group
  );

  return { ...getSenderData(), isGroup };
};

const SenderAvatar = ({ sender }) => {
  if (!sender.isGroup) return null;
  return (
    <Avatar
      src={sender.photo ? getMediaUrl(sender.photo) : ""}
      sx={{
        width: 32,
        height: 32,
        fontSize: "12px",
        bgcolor: PrimaryColor,
        border: "1.5px solid #fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        mx: 0.5,
      }}
    >
      {sender.username?.substring(0, 1)?.toUpperCase()}
    </Avatar>
  );
};

const SenderName = ({ sender }) => {
  if (!sender.isGroup) return null;
  return (
    <Typography
      variant="caption"
      sx={{
        color: PrimaryColor,
        fontWeight: "bold",
        fontSize: "0.75rem",
        display: "block",
        mb: 0.5,
        maxWidth: "180px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {sender.username === "Me" ? "~ You" : `~ ${sender.username}`}
    </Typography>
  );
};

const MessageOption = ({ msg }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [reactionAnchorEl, setReactionAnchorEl] = React.useState(null);
  const {
    setEditMessage,
    setDeleteMessageItem,
    setReplyToMessage,
    selectedRoom,
  } = useChatContext();
  const [addReaction] = useAddReactionMutation();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReactionClick = (event) => {
    setReactionAnchorEl(event.currentTarget);
  };

  const handleReactionClose = () => {
    setReactionAnchorEl(null);
  };

  const onSelectReaction = async (emoji) => {
    try {
      await addReaction({
        message: msg.id,
        user: parseInt(localStorage.getItem("UserId")),
        reaction: emoji,
        room: selectedRoom?.id,
      }).unwrap();
    } catch (error) {
      console.error("Failed to add reaction:", error);
      toast.error("Failed to add reaction");
    }
    handleReactionClose();
  };

  const handleReply = () => {
    setReplyToMessage(msg);
    handleClose();
  };

  const handleEdit = () => {
    if (msg?.message || msg?.Meassage || msg?.file || msg?.File) {
      setEditMessage(msg);
    }
    handleClose();
  };

  const handleDelete = () => {
    setDeleteMessageItem(msg);
    handleClose();
  };

  const UserId = localStorage.getItem("UserId");
  const msgSenderId = Number(
    msg?.Participant_id ||
      msg?.sender?.id ||
      msg?.sender ||
      msg?.SenderId ||
      msg?.sender_id,
  );
  const isMe = msgSenderId === Number(UserId);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
  const content = msg?.message || msg?.Participant_Message || msg?.Meassage;
  const isMessageDeleted = content === "This message was deleted";

  return (
    <>
      {!isMessageDeleted && (
        <IconButton
          onClick={handleReactionClick}
          size="small"
          sx={{
            visibility: "hidden",
            ".MuiStack-root:hover &": {
              visibility: "visible",
            },
            padding: 0,
            ml: 0.5,
          }}
        >
          <MdOutlineEmojiEmotions size={20} color="#379666" />
        </IconButton>
      )}

      <Popover
        open={Boolean(reactionAnchorEl)}
        anchorEl={reactionAnchorEl}
        onClose={handleReactionClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: 5,
            p: 0.5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Stack direction="row" spacing={0.5}>
          {emojis.map((emoji) => (
            <IconButton
              key={emoji}
              size="small"
              onClick={() => onSelectReaction(emoji)}
              sx={{
                fontSize: "1.2rem",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.05)",
                  transform: "scale(1.2)",
                },
                transition: "transform 0.1s",
              }}
            >
              {emoji}
            </IconButton>
          ))}
        </Stack>
      </Popover>

      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        sx={{
          visibility: "hidden",
          ".MuiStack-root:hover &": {
            visibility: "visible",
          },
          padding: 0,
          ml: 0.5,
        }}
      >
        <IoMdArrowDropdown size={20} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleReply}>Reply</MenuItem>
        {!isMessageDeleted && isMe && (
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
        )}
        {!isMessageDeleted && isMe && (
          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const TextMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  const content = msg?.message || msg?.Participant_Message || msg?.Meassage;
  const msgDate = msg?.created_at || msg?.SendedDate;

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 0.5, px: 2 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            p: "6px 10px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Typography
            sx={{
              fontSize: "14.5px",
              color: "#111b21",
              wordBreak: "break-word",
              lineHeight: 1.4,
            }}
          >
            {content}
          </Typography>
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msgDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const EditDialog = () => {
  const { editMessage, setEditMessage } = useChatContext();
  const [updateRoomMessage] = useUpdateRoomMessageMutation();
  const [message, setMessage] = React.useState("");
  const [openPicker, setOpenPicker] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    if (editMessage) {
      setMessage(
        editMessage?.Participant_Message ||
          editMessage?.message ||
          editMessage?.Meassage ||
          "",
      );
    }
  }, [editMessage]);

  const handleClose = () => {
    setEditMessage(null);
    setOpenPicker(false);
  };

  const handleUpdate = async () => {
    if (!message.trim()) return;
    try {
      const payload = {
        id: editMessage?.id,
        room: editMessage?.room,
        sender: parseInt(localStorage.getItem("UserId")),
        message: message,
        message_type: editMessage?.message_type || "text",
        is_edited: true,
      };

      await updateRoomMessage(payload).unwrap();
      toast.success("Message updated");
      handleClose();
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setOpenPicker(false);
  };

  if (!editMessage) return null;

  return (
    <Dialog
      open={Boolean(editMessage)}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: "#fff",
          backgroundImage: "none",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1,
          bgcolor: "#f0f0f0",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "16px", color: "#333" }}>
          Edit Message
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <IoMdClose size={20} />
        </IconButton>
      </Stack>

      <DialogContent sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f9f9f9",
              borderRadius: 1,
              borderLeft: "4px solid #379666",
            }}
          >
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              mb={0.5}
            >
              Original Message:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", color: "#555" }}
            >
              {editMessage?.message || editMessage?.Meassage}
            </Typography>
          </Box>

          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 1,
              p: 1,
              "&:focus-within": {
                borderColor: "#379666",
                boxShadow: "0 0 0 2px rgba(55, 150, 102, 0.1)",
              },
            }}
          >
            <InputBase
              fullWidth
              multiline
              maxRows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ fontSize: "14px" }}
              autoFocus
              placeholder="Type your changes here..."
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
            >
              <IconButton
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setOpenPicker(true);
                }}
                size="small"
              >
                <MdOutlineEmojiEmotions size={20} color="#379666" />
              </IconButton>

              <Popover
                open={openPicker}
                anchorEl={anchorEl}
                onClose={() => setOpenPicker(false)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                />
              </Popover>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={handleClose}
                  sx={{
                    color: "gray",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  onClick={handleUpdate}
                  variant="contained"
                  sx={{
                    bgcolor: "#379666",
                    "&:hover": { bgcolor: "#2d7a53" },
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2,
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmDialog = () => {
  const { deleteMessageItem, setDeleteMessageItem } = useChatContext();
  const [deleteRoomMessage] = useDeleteRoomMessageMutation();
  const [deleteMessageVisibility] = useDeleteMessageVisibilityMutation();

  const handleClose = () => {
    setDeleteMessageItem(null);
  };

  const handleConfirmDelete = async (deleteType) => {
    if (deleteMessageItem) {
      try {
        if (deleteType === "everyone") {
          await deleteRoomMessage({
            id: deleteMessageItem?.id,
            room: deleteMessageItem?.room || deleteMessageItem?.Receiver_Id,
          }).unwrap();
        } else {
          await deleteMessageVisibility({
            id: deleteMessageItem?.id,
            room: deleteMessageItem?.room || deleteMessageItem?.Receiver_Id,
          }).unwrap();
        }
        toast.success(
          `Message deleted for ${deleteType === "everyone" ? "everyone" : "me"}`,
        );
        handleClose();
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  if (!deleteMessageItem) return null;

  return (
    <Dialog
      open={Boolean(deleteMessageItem)}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
          maxWidth: "320px",
        },
      }}
    >
      <DialogTitle id="delete-dialog-title" sx={{ ...dialogTitle, pb: 1 }}>
        Delete Message?
      </DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </Typography>
      </DialogContent>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ px: 3, pb: 2 }}
      >
        <Button
          onClick={handleClose}
          sx={{
            ...ButtonStyle,
            color: "gray",
            border: "1px solid lightgray",
            "&:hover": { bgcolor: "#f5f5f5" },
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Stack spacing={1}>
          <Button
            onClick={() => handleConfirmDelete("me")}
            variant="outlined"
            size="small"
            sx={{
              ...ButtonStyle,
              color: "#d32f2f",
              borderColor: "#d32f2f",
              "&:hover": {
                bgcolor: "rgba(211, 47, 47, 0.04)",
                borderColor: "#d32f2f",
              },
              textTransform: "none",
            }}
          >
            Delete for Me
          </Button>
          <Button
            onClick={() => handleConfirmDelete("everyone")}
            variant="contained"
            size="small"
            sx={{
              ...ButtonStyle,
              bgcolor: "#d32f2f",
              color: "white",
              "&:hover": { bgcolor: "#b71c1c" },
              textTransform: "none",
            }}
          >
            Delete for Everyone
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

const MediaMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  const getEmbedUrl = (url) => {
    const videoID = url?.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoID}`;
  };

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 1.5 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack spacing={1}>
            <Image
              width={"100%"}
              height={"100%"}
              style={{ borderRadius: "10px" }}
              preview={{
                destroyOnClose: true,
                imageRender: () => (
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: " 100%",
                      border: "none",
                    }}
                    src={getEmbedUrl(msg?.message || msg?.Meassage) || ""}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                ),
                toolbarRender: () => null,
              }}
              src={getEmbedUrl(msg?.message || msg?.Meassage) || ""}
            />
            <Reactions reactions={msg?.reactions} />
            <Timestamp
              date={msg?.created_at || msg?.SendedDate}
              isSender={sender.isMe}
              readStatus={msg?.is_unread}
              seenBy={msg?.seen_by}
              isSeen={msg?.is_seen}
              isGroup={sender.isGroup}
            />
          </Stack>
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const ImageMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  let msgType = msg?.File?.split(".");
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 1.5 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack
            sx={{
              backgroundColor: alpha("#ffff", 0.1),
              borderRadius: 1,
            }}
            p={0.5}
          >
            <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
              <Image
                style={{ backgroundColor: alpha("#ABF1BC", 0.1) }}
                width={200}
                src={getMediaUrl(msg?.File, msg)}
                alt={getFileName(msg?.File || msg?.attachments?.[0]?.file)}
              />
            </Div>
            <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
              <Typography
                sx={[
                  FontStyle,
                  {
                    color: "#000",
                    p: 0.5,
                  },
                ]}
              >
                {getFileName(msg?.File).length > 20
                  ? getFileName(msg?.File).substring(0, 20) +
                    "..." +
                    msgType[msgType?.length - 1]
                  : getFileName(msg?.File)}
              </Typography>
              <IconButton>
                <AiOutlineCloudDownload
                  onClick={() => handleDownload(msg)}
                  size={16}
                  color={"#379666"}
                />
              </IconButton>
            </Div>
          </Stack>
          {Boolean(msg?.message || msg?.Meassage) && (
            <Typography
              sx={[
                FontStyle,
                {
                  color: "#000",
                  p: 0.5,
                },
              ]}
            >
              {msg?.message || msg?.Meassage}
            </Typography>
          )}
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const VideoMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  let msgType = msg?.File?.split(".");
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 0.5, px: 2 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack
            sx={{
              backgroundColor: alpha("#ffff", 0.1),
              borderRadius: 1,
            }}
            p={0.5}
          >
            <video
              width="100%"
              height="200"
              controls
              src={getMediaUrl(msg?.File, msg)}
            />
            <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
              <Typography
                sx={[
                  FontStyle,
                  {
                    color: "#000",
                    p: 0.5,
                  },
                ]}
              >
                {getFileName(msg?.File).length > 20
                  ? getFileName(msg?.File).substring(0, 20) +
                    "..." +
                    msgType[msgType?.length - 1]
                  : getFileName(msg?.File)}
              </Typography>
              <IconButton>
                <AiOutlineCloudDownload
                  onClick={() => handleDownload(msg)}
                  size={16}
                  color={"#379666"}
                />
              </IconButton>
            </Div>
          </Stack>
          {Boolean(msg?.message || msg?.Meassage) && (
            <Typography
              sx={[
                FontStyle,
                {
                  color: "#000",
                  p: 0.5,
                },
              ]}
            >
              {msg?.message || msg?.Meassage}
            </Typography>
          )}
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const AudioMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  let msgType = msg?.File?.split(".");
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 1.5 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            p: 0.5,
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack
            sx={{
              backgroundColor: alpha("#ffff", 0.1),
              borderRadius: 1,
            }}
            p={0.5}
          >
            <audio controls src={getMediaUrl(msg?.File, msg)} />
            <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
              <Typography
                sx={[
                  FontStyle,
                  {
                    color: "#000",
                    p: 0.5,
                  },
                ]}
              >
                {getFileName(msg?.File).length > 20
                  ? getFileName(msg?.File).substring(0, 20) +
                    "..." +
                    msgType[msgType?.length - 1]
                  : getFileName(msg?.File)}
              </Typography>
              <IconButton>
                <AiOutlineCloudDownload
                  onClick={() => handleDownload(msg)}
                  size={16}
                  color={"#379666"}
                />
              </IconButton>
            </Div>
          </Stack>

          {Boolean(msg?.message || msg?.Meassage) && (
            <Typography
              sx={[
                FontStyle,
                {
                  color: "#000",
                  p: 0.5,
                },
              ]}
            >
              {msg?.message || msg?.Meassage}
            </Typography>
          )}
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const OthersMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 0.5, px: 2 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack
            sx={{
              backgroundColor: alpha("#ffff", 0.1),
              borderRadius: 1,
            }}
            p={0.5}
          >
            <img
              src={getMediaUrl(msg?.File, msg)}
              width={"300px"}
              height={"300px"}
              alt={"no Image"}
            />
            <IconButton sx={[DisplayFlex, { justifyContent: "right" }]}>
              <AiOutlineCloudDownload
                onClick={() => handleDownload(msg)}
                size={16}
                color={"#379666"}
              />
            </IconButton>
          </Stack>
          <Typography
            sx={[
              FontStyle,
              {
                color: "#000",
                p: 0.5,
              },
            ]}
          >
            {msg?.message || msg?.Meassage}
          </Typography>
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const DocMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  let msgType = msg?.File?.split(".");
  let type = msgType[msgType?.length - 1];
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 0.5, px: 2 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Stack
            sx={{
              backgroundColor: alpha("#ffff", 0.1),
              borderRadius: 1,
            }}
            p={0.5}
          >
            <Div>
              {type?.toLowerCase() == "zip" ||
              type?.toLowerCase() == "exe" ||
              type?.toLowerCase() == "msi" ||
              type?.toLowerCase() == "pdf" ? (
                <Div sx={{ textAlign: "center" }}>
                  <img
                    style={{
                      margin: "20px",
                      cursor: type?.toLowerCase() == "pdf" && "pointer",
                    }}
                    onClick={() =>
                      type?.toLowerCase() == "pdf" && ViewImage(msg)
                    }
                    src={
                      type?.toLowerCase() == "exe" ||
                      type?.toLowerCase() == "msi"
                        ? Exe
                        : type?.toLowerCase() == "pdf"
                          ? Pdf
                          : Zip
                    }
                    width={50}
                    height={50}
                  />
                  <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                    <Typography
                      sx={[
                        FontStyle,
                        {
                          color: "#000",
                          p: 0.5,
                        },
                      ]}
                    >
                      {getFileName(msg?.File || msg?.attachments?.[0]?.file)
                        .length > 20
                        ? getFileName(
                            msg?.File || msg?.attachments?.[0]?.file,
                          ).substring(0, 20) +
                          "..." +
                          type
                        : getFileName(msg?.File || msg?.attachments?.[0]?.file)}
                    </Typography>
                    <IconButton>
                      <AiOutlineCloudDownload
                        onClick={() => handleDownload(msg)}
                        size={16}
                        color={"#379666"}
                      />
                    </IconButton>
                  </Div>
                </Div>
              ) : (
                <Div>
                  <embed
                    onClick={() => {
                      ViewImage(msg);
                    }}
                    src={getMediaUrl(msg?.File, msg)}
                  ></embed>
                  <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                    <Typography
                      sx={[
                        FontStyle,
                        {
                          color: "#000",
                          p: 0.5,
                        },
                      ]}
                    >
                      {getFileName(msg?.File || msg?.attachments?.[0]?.file)
                        .length > 20
                        ? getFileName(
                            msg?.File || msg?.attachments?.[0]?.file,
                          ).substring(0, 20) +
                          "..." +
                          type
                        : getFileName(msg?.File || msg?.attachments?.[0]?.file)}
                    </Typography>
                    <IconButton>
                      <AiOutlineCloudDownload
                        onClick={() => handleDownload(msg)}
                        size={16}
                        color={"#379666"}
                      />
                    </IconButton>
                  </Div>
                </Div>
              )}
            </Div>
          </Stack>
          {Boolean(msg?.message || msg?.Meassage) && (
            <Typography
              sx={[
                FontStyle,
                {
                  color: "#000",
                  p: 0.5,
                },
              ]}
            >
              {msg?.message || msg?.Meassage}
            </Typography>
          )}
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const LinkMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 1.5 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            mx: 1,
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <a
            href={msg?.message || msg?.Meassage}
            target="_blank"
            variant="body2"
            style={{ color: "#000" }}
          >
            {msg?.message || msg?.Meassage}
          </a>
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const CallMsg = ({ msg, menu }) => {
  const sender = useSender(msg);
  const theme = useTheme();

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        sx={{ position: "relative", my: 1.5 }}
        direction="row"
        justifyContent={sender.isMe ? "end" : "start"}
        alignItems="flex-end"
      >
        <Box
          p={0.5}
          sx={{
            backgroundColor: sender.isMe ? "#fff" : "#d9fdd3",
            borderRadius: "12px",
            [`${sender.isMe ? "borderTopRightRadius" : "borderTopLeftRadius"}`]: "4px",
            width: "max-content",
            maxWidth: "75%",
            boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <SenderName sender={sender} />
          <ReplyMessage reply={msg?.reply_message} />
          <Div
            sx={[
              DisplayFlex,
              {
                p: 1,
                gap: "10px !important",
                backgroundColor: "rgba(200,200,200,0.1)",
              },
            ]}
          >
            <Div>
              <IconButton
                disabled
                sx={{
                  bgcolor: `${
                    sender.isMe ? "#f6f6f6" : "lightgray"
                  } !important`,
                  p: 1.5,
                }}
              >
                {(msg?.Audio_Answer === "declined" ||
                  msg?.Video_Answer === "declined") && (
                  <MdPhoneMissed size={18} color={"tomato"} />
                )}
                {(msg?.Audio_Answer === "callend" ||
                  msg?.Video_Answer === "callend") && <SlCallEnd size={18} />}
              </IconButton>
            </Div>
            <Div>
              <Typography
                sx={[
                  FontStyle,
                  {
                    color: "#000",
                    p: 0.5,
                  },
                ]}
              >
                {msg?.Audio_Answer !== "" ? "Voice Call" : "Video Call"}
              </Typography>

              {(msg?.Audio_Answer === "declined" ||
                msg?.Video_Answer === "declined") && (
                <Typography
                  sx={[
                    FontStyle,
                    {
                      color: "#000",
                    },
                  ]}
                >
                  {sender.isMe ? "No answer" : "Missed call"}
                </Typography>
              )}
            </Div>
          </Div>
          <Reactions reactions={msg?.reactions} />
          <Timestamp
            date={msg?.created_at || msg?.SendedDate}
            isSender={sender.isMe}
            readStatus={msg?.is_unread}
            seenBy={msg?.seen_by}
            isSeen={msg?.is_seen}
            isGroup={sender.isGroup}
          />
        </Box>
        {menu && <MessageOption msg={msg} />}
      </Stack>
    </Slide>
  );
};

const Timeline = ({ msg }) => {
  const UserId = localStorage.getItem("UserId");
  const msgSender = msg?.sender || msg?.SenderId;
  let time = new Date(msg?.created_at || msg?.SendedDate).toLocaleTimeString(
    [],
    {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    },
  );
  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={msgSender == UserId ? "right" : "left"}
        sx={{ px: 2, mt: -0.5, mb: 1 }}
      >
        <Typography
          sx={{
            fontSize: "10px",
            color: "#667781",
          }}
        >
          {time}
        </Typography>
      </Stack>
    </Slide>
  );
};

export {
  Timeline,
  MediaMsg,
  LinkMsg,
  DocMsg,
  TextMsg,
  CallMsg,
  VideoMsg,
  OthersMsg,
  AudioMsg,
  ImageMsg,
  EditDialog,
  DeleteConfirmDialog,
  ReactionDetailsDialog,
};
