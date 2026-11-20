import React, { useState, memo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Stack,
  styled,
  Typography,
  Tooltip,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import {
  MdChevronLeft,
  MdVolumeUp,
  MdVolumeOff,
  MdSettings,
  MdLocalPhone,
  MdVideoCameraFront,
  MdMoreVert,
} from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

import { useDispatch, useSelector } from "react-redux";
import useResponsive from "../../hook/useResponsive";
import { FontStyle } from "../../../widgets/CRMStyles";
import { getSelectChatUser } from "../../dashboard/SelectChatUserSlice";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { BASE_URL } from "../../../../services/auth-services";
import { AvatarCircle } from "../../../widgets/StylesComponents";
import ProfileInfo from "./ProfileInfo";
import { useChatContext } from "../../context/Chatcontext";
import ChatSettingsDialog from "./ChatSettingsDialog";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
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
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Conversation_Menu = [
  {
    title: "Contact info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete chat",
  },
];

const ChatHeader = () => {
  const {
    selectedRoom,
    setSelectedRoom,
    chatSettings,
    updateChatSettings,
    onlineUsers,
  } = useChatContext();
  const [toggleProfileInfo, setToggleProfileInfo] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const isMobile = useResponsive("down", "md");

  const toggleMute = () => {
    updateChatSettings({ isMuted: !chatSettings.isMuted });
  };

  return (
    <>
      <Box
        p={2}
        width={"100%"}
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          zIndex: 1,
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{ width: "100%", height: "100%" }}
          justifyContent="space-between"
        >
          <Stack spacing={2} direction="row" alignItems="center">
            {isMobile && (
              <IconButton onClick={() => setSelectedRoom(null)} sx={{ p: 0 }}>
                <MdChevronLeft size={24} />
              </IconButton>
            )}
            <Box
              onClick={(e) => setToggleProfileInfo(e.currentTarget)}
              sx={{ cursor: "pointer" }}
            >
              <AvatarCircle
                fontSize="12px"
                size="45px"
                title={
                  selectedRoom?.room_name || selectedRoom?.name || "Unknown"
                }
                image={
                  Boolean(
                    selectedRoom?.Participant_Photo || selectedRoom?.User_Photo,
                  ) &&
                  BASE_URL +
                    (selectedRoom?.Participant_Photo ||
                      selectedRoom?.User_Photo)
                }
              />
            </Box>
            <Stack spacing={0.2}>
              <Typography
                align="left"
                sx={{ fontSize: "16px", fontWeight: 600, color: "#1c1d2c" }}
              >
                {selectedRoom?.room_name || selectedRoom?.name}
              </Typography>

              {selectedRoom?.room_type === "group" ? (
                selectedRoom?.Participant_List && (
                  <Typography
                    align="left"
                    sx={{ fontSize: "12px", color: "#667781" }}
                  >
                    {selectedRoom.Participant_List.length} participants
                  </Typography>
                )
              ) : (
                <Typography
                  align="left"
                  sx={{
                    fontSize: "12px",
                    color:
                      onlineUsers[
                        Number(selectedRoom?.Participant_id || selectedRoom?.id)
                      ]?.status === "online"
                        ? "#2e7d32"
                        : "#667781",
                    fontWeight:
                      onlineUsers[
                        Number(selectedRoom?.Participant_id || selectedRoom?.id)
                      ]?.status === "online"
                        ? 500
                        : 400,
                  }}
                >
                  {onlineUsers[
                    Number(selectedRoom?.Participant_id || selectedRoom?.id)
                  ]?.status === "online"
                    ? "Online"
                    : onlineUsers[
                        Number(selectedRoom?.Participant_id || selectedRoom?.id)
                      ]?.last_seen
                      ? `Last seen ${onlineUsers[Number(selectedRoom?.Participant_id || selectedRoom?.id)]?.last_seen}`
                      : "Offline"}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack direction={"row"} alignItems="center" spacing={1}>
            <IconButton onClick={(e) => setOpenSettings(true)} color="inherit">
              <MdMoreVert size={22} color="#54656f" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <ProfileInfo open={toggleProfileInfo} setOpen={setToggleProfileInfo} />
      <ChatSettingsDialog
        open={openSettings}
        handleClose={() => setOpenSettings(false)}
        roomId={selectedRoom?.id}
      />
    </>
  );
};

export default memo(ChatHeader);
