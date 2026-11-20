import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import { Super_Admin_URL } from "../../../services/auth-services";
import { useChatNotificationSettingFilterMutation } from "../../../services/RTKApis/Chat/ChatRTKQueryAPI";

// Create the Chat context
const ChatContext = createContext();

// Export the custom hook to use the context
export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    console.warn("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [selectUser, setSelectUser] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null); // New state for rooms
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMessage, setEditMessage] = useState(null);
  const [deleteMessageItem, setDeleteMessageItem] = useState(null);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [reactionDetails, setReactionDetails] = useState(null); // { reactions: [], open: true/false }
  const [initialMessages, setInitialMessages] = useState([]); // Store messages from ChatList API
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState({}); // { roomId: { userId: username } }
  const [onlineUsers, setOnlineUsers] = useState({}); // { userId: { status, last_seen } }

  const [filterNotificationSettings] = useChatNotificationSettingFilterMutation();

  const [chatSettings, setChatSettings] = useState(() => {
    const saved = localStorage.getItem("chatNotificationSettings");
    return saved
      ? JSON.parse(saved)
      : {
          enabled: true,
          volume: 80,
          ringtone: null,
          ringtoneName: "Default (Bell)",
          isMuted: false,
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "chatNotificationSettings",
      JSON.stringify(chatSettings),
    );
  }, [chatSettings]);

  useEffect(() => {
    const handleStatusUpdate = (e) => {
      const data = e.detail;
      const userId = Number(data.user_id);
      const status = data.status;
      const lastSeen = data.last_seen;

      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: { status, last_seen: lastSeen },
      }));
    };

    window.addEventListener("ml-user-status", handleStatusUpdate);
    return () => window.removeEventListener("ml-user-status", handleStatusUpdate);
  }, []);

  const updateChatSettings = useCallback((newSettings) => {
    setChatSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const playChatSound = useCallback(async (customRingtone = null, customVolume = null, roomId = null) => {
    // If explicit values are provided (e.g. from Test Sound), use them
    if (customRingtone !== null || customVolume !== null) {
        const audio = new Audio(customRingtone || require("../../../assets/audio/Bell.mp3"));
        audio.volume = (customVolume !== null ? customVolume : 80) / 100;
        audio.play().catch(err => console.error("Error playing chat sound:", err));
        return;
    }

    if (chatSettings.isMuted) return;

    const userId = localStorage.getItem("UserId");
    let targetSettings = { ...chatSettings };

    // Fetch settings via the new Filter API
    try {
      const payload = { user_id: Number(userId) };
      if (roomId) {
        payload.room_id = Number(roomId);
      }

      const res = await filterNotificationSettings(payload).unwrap();
      if (res.status) {
        let settingsData;
        if (res.case === "ROOM_NOTIFICATION_SETTING") {
          settingsData = res.data;
        } else if (res.case === "GENERAL_NOTIFICATION_SETTING") {
          // General settings returns an array
          settingsData = Array.isArray(res.data) ? res.data[0] : res.data;
        }

        if (settingsData) {
          targetSettings = {
            enabled: settingsData.Enable_Notifications,
            volume: settingsData.Volume_Percent !== undefined ? settingsData.Volume_Percent : chatSettings.volume,
            ringtone: settingsData.Notification_Sound,
          };
        }
      }
    } catch (err) {
      console.error("Failed to fetch settings via filter, falling back to local:", err);
    }

    if (!targetSettings.enabled) return;

    try {
      let audioSource = targetSettings.ringtone;
      if (!audioSource) {
        audioSource = require("../../../assets/audio/Bell.mp3");
      } else if (typeof audioSource === "string" && audioSource.startsWith("/media/")) {
        // Handle relative media paths from backend
        audioSource = `${Super_Admin_URL}${audioSource}`;
      }

      const audio = new Audio(audioSource);
      audio.volume = (targetSettings.volume || 80) / 100;
      audio
        .play()
        .catch((err) => console.error("Error playing chat sound:", err));
    } catch (error) {
      console.error("Failed to prepare chat sound:", error);
    }
  }, [chatSettings, filterNotificationSettings]);

  const markRoomAsNotNew = useCallback(() => {
    setSelectedRoom((prev) => (prev ? { ...prev, is_new: false } : null));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectUser,
        setSelectUser,
        selectedRoom,
        setSelectedRoom,
        sidebarOpen,
        setSidebarOpen,
        editMessage,
        setEditMessage,
        deleteMessageItem,
        setDeleteMessageItem,
        replyToMessage,
        setReplyToMessage,
        reactionDetails,
        setReactionDetails,
        initialMessages,
        setInitialMessages,
        unreadChatCount,
        setUnreadChatCount,
        markRoomAsNotNew,
        chatSettings,
        updateChatSettings,
        playChatSound,
        typingUsers,
        setTypingUsers,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
