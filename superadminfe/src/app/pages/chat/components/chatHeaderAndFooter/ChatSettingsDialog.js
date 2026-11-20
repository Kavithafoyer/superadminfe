import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Switch,
  Slider,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import {
  MdVolumeUp,
  MdNotifications,
  MdMusicNote,
  MdClose,
} from "react-icons/md";
import { useChatContext } from "../../context/Chatcontext";
import { toast } from "react-toastify";
import {
  useGetChatNotificationSettingsQuery,
  useCreateChatNotificationSettingMutation,
  usePatchChatNotificationSettingMutation,
} from "../../../../services/RTKApis/Chat/ChatRTKQueryAPI";

const ChatSettingsDialog = ({ open, handleClose, roomId = null }) => {
  const { playChatSound, selectedRoom } = useChatContext();
  const userId = localStorage.getItem("UserId");
  const fileInputRef = useRef(null);

  // Fetch settings for this room/general
  const { data: settingsData, isLoading } = useGetChatNotificationSettingsQuery(
    { userId, roomId },
    { skip: !open },
  );

  const [createSetting] = useCreateChatNotificationSettingMutation();
  const [patchSetting] = usePatchChatNotificationSettingMutation();

  const [localSettings, setLocalSettings] = useState({
    enabled: true,
    volume: 80,
    ringtone: null,
    ringtoneName: "Default (Bell)",
  });

  useEffect(() => {
    if (settingsData && settingsData.length > 0) {
      const serverSetting = settingsData[0];
      setLocalSettings({
        id: serverSetting.id,
        enabled: serverSetting.Enable_Notifications,
        volume: serverSetting.Volume_Percent || 80,
        ringtone: serverSetting.Notification_Sound,
        ringtoneName: serverSetting.File_Name || "Custom Sound",
      });
    } else {
      setLocalSettings({
        enabled: true,
        volume: 80,
        ringtone: null,
        ringtoneName: "Default (Bell)",
      });
    }
  }, [settingsData]);

  const handleToggleNotifications = (event) => {
    setLocalSettings((prev) => ({ ...prev, enabled: event.target.checked }));
  };

  const handleVolumeChange = (event, newValue) => {
    setLocalSettings((prev) => ({ ...prev, volume: newValue }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 900 * 1024) {
        toast.error("File is too large. Please select a file under 900KB.");
        return;
      }
      if (!file.type.startsWith("audio/")) {
        toast.error("Please select an audio file (mp3).");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalSettings((prev) => ({
          ...prev,
          ringtone: e.target.result,
          ringtoneName: file.name,
        }));
        toast.success("Sound selected! Click Done to save.");
      };
      reader.readAsDataURL(file);
    }
  };

  const resetRingtone = () => {
    setLocalSettings((prev) => ({
      ...prev,
      ringtone: null,
      ringtoneName: "Default (Bell)",
    }));
  };

  const handleSave = async () => {
    // If ringtone is a data URL (newly selected), send only the base64 part
    let ringtoneBase64 = localSettings.ringtone;
    if (ringtoneBase64 && ringtoneBase64.includes("base64,")) {
      ringtoneBase64 = ringtoneBase64.split("base64,")[1];
    }

    const payload = {
      User: Number(userId),
      Room: roomId ? Number(roomId) : null,
      Enable_Notifications: localSettings.enabled,
      Volume_Percent: localSettings.volume,
      File_Name: localSettings.ringtoneName,
      Notification_Sound: ringtoneBase64,
    };

    try {
      if (localSettings.id) {
        await patchSetting({ ...payload, id: localSettings.id }).unwrap();
      } else {
        await createSetting(payload).unwrap();
      }
      toast.success("Settings saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {roomId && selectedRoom
              ? `${selectedRoom.name} - Chat Settings`
              : "General Settings"}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <MdClose />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {isLoading ? (
          <Typography align="center" sx={{ py: 4 }}>
            Loading...
          </Typography>
        ) : (
          <Stack spacing={3} sx={{ py: 1 }}>
            {/* Notifications Toggle */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <MdNotifications size={20} color="#379666" />
                <Typography>Enable Notifications</Typography>
              </Stack>
              <Switch
                checked={localSettings.enabled}
                onChange={handleToggleNotifications}
                color="primary"
              />
            </Stack>

            {/* Volume Adjuster */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <MdVolumeUp size={20} color="#379666" />
                <Typography>Volume ({localSettings.volume}%)</Typography>
              </Stack>
              <Slider
                value={localSettings.volume}
                onChange={handleVolumeChange}
                aria-labelledby="input-slider"
                min={0}
                max={100}
                sx={{ color: "#379666" }}
                disabled={!localSettings.enabled}
              />
            </Box>

            {/* Ringtone Selection */}
            <Box>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <MdMusicNote size={20} color="#379666" />
                <Typography>Notification Sound</Typography>
              </Stack>
              <Stack direction="column" spacing={1}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Current: {localSettings.ringtoneName}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      borderColor: "#379666",
                      color: "#379666",
                      "&:hover": {
                        borderColor: "#2e7d56",
                        bgcolor: "rgba(55, 150, 102, 0.04)",
                      },
                    }}
                  >
                    Change MP3
                  </Button>
                  {localSettings.ringtone && (
                    <Button
                      variant="text"
                      size="small"
                      color="error"
                      onClick={resetRingtone}
                    >
                      Reset
                    </Button>
                  )}
                </Stack>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="audio/mp3,audio/mpeg"
                  onChange={handleFileChange}
                />
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={() =>
            playChatSound(localSettings.ringtone, localSettings.volume)
          }
          variant="text"
          disabled={!localSettings.enabled || isLoading}
          sx={{ color: "#379666" }}
        >
          Test Sound
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          sx={{ bgcolor: "#379666", "&:hover": { bgcolor: "#2e7d56" } }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatSettingsDialog;
