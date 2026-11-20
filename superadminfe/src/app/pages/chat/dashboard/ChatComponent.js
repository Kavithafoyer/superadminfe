import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import ChatHeader from "../components/chatHeaderAndFooter/Header";
import ChatFooter from "../components/chatHeaderAndFooter/Footer";
import useResponsive from "../hook/useResponsive";
import Div from "@jumbo/shared/Div";
import {
  AudioMsg,
  CallMsg,
  DocMsg,
  ImageMsg,
  LinkMsg,
  MediaMsg,
  OthersMsg,
  TextMsg,
  Timeline,
  VideoMsg,
  EditDialog,
  DeleteConfirmDialog,
  ReactionDetailsDialog,
} from "./Conversation";
import { useSelector } from "react-redux";
import { getMessagesError } from "./SelectChatUserSlice";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useChatContext } from "../context/Chatcontext";
import {
  useGetRoomMessagesQuery,
  useLazyGetRoomMessagesQuery,
  useMarkMessagesReadMutation,
} from "../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import { socket } from "../../../services/auth-services";

// File format constants
export const FileFormats = [
  "js",
  "pdf",
  "doc",
  "docx",
  "pptx",
  "xlsx",
  "csv",
  "txt",
  "html",
  "xml",
  "json",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "exe",
  "msi",
];
export const VideoFormats = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  "m4v",
  "ogg",
  "mpeg",
  "mpg",
  "3gp",
  "ts",
  "vob",
  "swf",
  "rm",
  "asf",
];
export const ImageFormats = [
  "jfif",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "ico",
  "heic",
  "apng",
  "raw",
];
export const AudioFormats = ["ogg", "amr", "aac", "mp3", "wav", "flac"];

function ChatComponent() {
  const { selectedRoom, initialMessages, typingUsers, setTypingUsers } = useChatContext();
  const UserId = localStorage.getItem("UserId");
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const messageListRef = useRef(null);

  // Pagination states
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPrepending, setIsPrepending] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  // Initial fetch for Page 1
  const {
    data: conversation,
    isLoading,
    isError,
    refetch: refetchMessages,
  } = useGetRoomMessagesQuery(
    { roomId: selectedRoom?.id, page: 1, userId: UserId },
    {
      skip: !selectedRoom?.id || selectedRoom?.is_new,
    },
  );

  const [triggerLazyMessages] = useLazyGetRoomMessagesQuery();
  const [markRead] = useMarkMessagesReadMutation();

  // Mark messages as read when room is opened
  useEffect(() => {
    if (selectedRoom?.id && UserId) {
      markRead({ room_id: Number(selectedRoom.id), user_id: Number(UserId) });
    }
  }, [selectedRoom?.id, UserId, markRead]);

  // Reset state when room changes
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setIsPrepending(false);
  }, [selectedRoom?.id]);

  // Socket listener for typing events (via Global ML WebSocket bridge in Header)
  useEffect(() => {
    const handleNotification = (e) => {
      const data = e.detail;
      if (data.event_type === "TYPING" || data.event_type === "GROUP_TYPING") {
        const roomId = Number(data.room_id || data.group_id);
        const senderId = Number(data.sender);
        const senderName = data.sender_name;
        const isTyping = data.is_typing;

        // Don't show typing indicator for the current user
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

    window.addEventListener("ml-typing", handleNotification);
    return () => {
      window.removeEventListener("ml-typing", handleNotification);
    };
  }, [UserId, setTypingUsers]);

  // Detect broken messages (non-text without attachments) and refetch
  useEffect(() => {
    if (conversation && Array.isArray(conversation)) {
      const hasBrokenMessage = conversation.some(msg => {
        const type = (msg.message_type || "").toLowerCase();
        // If type is not text and not deleted, it MUST have attachments
        if (type && type !== "text" && msg.message !== "This message was deleted") {
          return !msg.attachments || msg.attachments.length === 0;
        }
        return false;
      });

      if (hasBrokenMessage) {
        console.warn("Broken message detected (type exists but no attachments), refetching in 2s...");
        const timer = setTimeout(() => {
          refetchMessages();
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [conversation, refetchMessages]);

  // Listen for real-time reactions
  useEffect(() => {
    const handleReaction = (e) => {
      const data = e.detail;
      const messageId = data.message_id;
      const reaction = data.reaction;
      const senderId = data.sender;

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            const existingReactions = [...(msg.reactions || [])];
            const userReactionIndex = existingReactions.findIndex(
              (r) => Number(r.user_id || r.User_id) === Number(senderId)
            );

            if (userReactionIndex > -1) {
              existingReactions[userReactionIndex] = {
                ...existingReactions[userReactionIndex],
                reaction: reaction,
              };
            } else {
              existingReactions.push({
                id: Date.now(), 
                user_id: senderId,
                reaction: reaction,
              });
            }
            return { ...msg, reactions: existingReactions };
          }
          return msg;
        })
      );
    };

    window.addEventListener("ml-reaction", handleReaction);
    return () => window.removeEventListener("ml-reaction", handleReaction);
  }, []);

  // Sync initialMessages/conversation into state
  useEffect(() => {
    if (conversation) {
      setMessages((prev) => {
        // If the current messages in state belong to a different room, discard them
        const roomChanged =
          prev.length > 0 &&
          (prev[0].room || prev[0].room_id) !== selectedRoom?.id;
        const baseContent = roomChanged ? [] : prev;

        // Merge base with new Page 1 data, ensuring uniqueness
        // ALSO: Filter out broken messages for display
        const filteredConversation = conversation.filter(msg => {
          const type = (msg.message_type || "").toLowerCase();
          if (type && type !== "text" && msg.message !== "This message was deleted") {
            return msg.attachments && msg.attachments.length > 0;
          }
          return true;
        });

        const merged = [...baseContent, ...filteredConversation];
        // Use a Map to keep unique messages by their unique identifiers
        const uniqueMap = new Map();
        merged.forEach((msg) => {
          const key =
            msg.id ||
            `${msg.message || msg.Participant_Message || msg.Meassage}-${msg.created_at || msg.Participant_Send_Date_Time || msg.SendedDate}`;
          uniqueMap.set(key, msg);
        });

        const result = Array.from(uniqueMap.values());
        // Sort messages by date to keep them in order
        result.sort(
          (a, b) =>
            new Date(a.created_at || a.Participant_Send_Date_Time || a.SendedDate) -
            new Date(b.created_at || b.Participant_Send_Date_Time || b.SendedDate),
        );

        return result;
      });

      if (conversation.length < 10 && page === 1) {
        setHasMore(false);
      }
    } else if (initialMessages?.length > 0 && messages.length === 0) {
      // Check if initialMessages actually belong to the current room
      const firstMsg = initialMessages[0];
      const initialRoomId =
        firstMsg.room || firstMsg.room_id || selectedRoom?.id;

      if (initialRoomId === selectedRoom?.id) {
        // Also filter initial messages
        const filteredInitial = initialMessages.filter(msg => {
          const type = (msg.message_type || "").toLowerCase();
          if (type && type !== "text" && msg.message !== "This message was deleted") {
            return msg.attachments && msg.attachments.length > 0;
          }
          return true;
        });

        setMessages(filteredInitial);
        if (initialMessages.length < 10) {
          setHasMore(false);
        }
      }
    }
  }, [conversation, initialMessages, selectedRoom?.id]);

  // Handle scroll to fetch more
  const handleScroll = useCallback(
    async (e) => {
      const { scrollTop, scrollHeight } = e.target;

      if (
        scrollTop <= 10 &&
        hasMore &&
        !isPrepending &&
        messages.length >= 10
      ) {
        setIsPrepending(true);
        setPrevScrollHeight(scrollHeight);

        const nextPage = page + 1;

        try {
          const results = await triggerLazyMessages({
            roomId: selectedRoom.id,
            page: nextPage,
            userId: UserId,
          }).unwrap();

          if (results && results.length > 0) {
            const filteredResults = results.filter(msg => {
              const type = (msg.message_type || "").toLowerCase();
              if (type && type !== "text" && msg.message !== "This message was deleted") {
                return msg.attachments && msg.attachments.length > 0;
              }
              return true;
            });
            setMessages((prev) => [...filteredResults, ...prev]);
            setPage(nextPage);
            if (results.length < 10) {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
        } catch (error) {
          console.error("Failed to fetch more messages:", error);
        } finally {
          setIsPrepending(false);
        }
      }
    },
    [
      hasMore,
      isPrepending,
      messages.length,
      page,
      selectedRoom?.id,
      triggerLazyMessages,
      UserId,
    ],
  );

  // Maintain scroll position after prepending
  useEffect(() => {
    if (
      isPrepending === false &&
      prevScrollHeight > 0 &&
      messageListRef.current
    ) {
      const newScrollHeight = messageListRef.current.scrollHeight;
      messageListRef.current.scrollTop = newScrollHeight - prevScrollHeight;
      setPrevScrollHeight(0);
    }
  }, [messages, isPrepending, prevScrollHeight]);

  const messageError = useSelector(getMessagesError);

  // Determine the message type and render the appropriate component
  const renderMessage = (msg) => {
    // 1. Check for Calls (Jitsi)
    if (msg?.Jitci || msg?.Audio_Answer !== "" || msg?.Video_Answer !== "") {
      if (msg?.message_type === "call" || msg?.Audio_Answer !== "" || msg?.Video_Answer !== "") {
          return (
            <React.Fragment key={msg.id}>
              <CallMsg msg={msg} menu={true} />
              <Timeline msg={msg} />
            </React.Fragment>
          );
      }
    }

    // 2. Check explicitly by message_type from the new API
    if (msg?.message_type) {
      const type = msg.message_type.toLowerCase();
      if (type === "text") {
        const text = msg?.message || msg?.Participant_Message || msg?.Meassage || "";
        if (text.startsWith("https://www.youtube.com"))
          return <MediaMsg key={msg.id} msg={msg} menu={true} />;
        if (text.startsWith("http"))
          return <LinkMsg key={msg.id} msg={msg} menu={true} />;
        return <TextMsg key={msg.id} msg={msg} menu={true} />;
      }
      if (type === "image") return <ImageMsg key={msg.id} msg={msg} menu={true} />;
      if (type === "video") return <VideoMsg key={msg.id} msg={msg} menu={true} />;
      if (type === "audio") return <AudioMsg key={msg.id} msg={msg} menu={true} />;
      if (type === "file" || type === "document")
        return <DocMsg key={msg.id} msg={msg} menu={true} />;
    }

    // 3. Fallback for legacy messages handling explicit Files
    if (msg?.File) {
      const fileExtension = msg.File.split(".").pop().toLowerCase();
      if (ImageFormats.includes(fileExtension))
        return <ImageMsg key={msg.id} msg={msg} menu={true} />;
      if (VideoFormats.includes(fileExtension))
        return <VideoMsg key={msg.id} msg={msg} menu={true} />;
      if (AudioFormats.includes(fileExtension))
        return <AudioMsg key={msg.id} msg={msg} menu={true} />;
      if (FileFormats.includes(fileExtension))
        return <DocMsg key={msg.id} msg={msg} menu={true} />;
      return <OthersMsg key={msg.id} msg={msg} menu={true} />;
    }

    // 4. Fallback for legacy messages with Text (either 'message' or 'Meassage')
    const textContent =
      msg?.Participant_Message || msg?.message || msg?.Meassage;
    if (textContent) {
      if (textContent.startsWith("https://www.youtube.com"))
        return <MediaMsg key={msg.id} msg={msg} menu={true} />;
      if (textContent.startsWith("http"))
        return <LinkMsg key={msg.id} msg={msg} menu={true} />;
      return <TextMsg key={msg.id} msg={msg} menu={true} />;
    }

    // 5. Ultimate fallback if nothing matches
    return <OthersMsg key={msg.id} msg={msg} menu={true} />;
  };

  // Render messages based on the messages state
  const renderMessages = () => {
    if (isLoading && (!messages || messages.length === 0)) {
      return (
        <Div sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={40} />
        </Div>
      );
    }

    if (isError) {
      return (
        <Div sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="error">
            Failed to load messages. Please try again.
          </Typography>
        </Div>
      );
    }

    if (conversation === "Blocked") {
      return (
        <Div sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography>
            {selectedRoom?.name || "This contact"} is not available right now.
            Please try chatting again later.
          </Typography>
        </Div>
      );
    }

    if (messages?.length > 0) {
      return (
        <>
          {isPrepending && (
            <Stack alignItems="center" py={1}>
              <CircularProgress size={20} />
            </Stack>
          )}
          {messages.map((msg) => renderMessage(msg))}
        </>
      );
    }

    return (
      <Div sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={require("../../../assets/images/no-message.png")}
          style={{ width: "200px", height: "200px" }}
          alt="No Messages"
        />
      </Div>
    );
  };

  // Scroll to the bottom of the message list when conversation updates (Page 1 only)
  useEffect(() => {
    if (messageListRef.current && page === 1 && !isPrepending) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, page, isPrepending]);

  return (
    <Stack
      className="h-full"
      sx={{ height: "100%", overflow: "hidden", bgcolor: "#fff" }}
      width={isMobile ? "100vw" : "100%"}
    >
      <ChatHeader />

      <Box
        ref={messageListRef}
        onScroll={handleScroll}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "auto",
          bgcolor: "#efeae2", 
          py: 2,
          minHeight: 0,
          display:
            isLoading || !conversation || conversation?.length === 0
              ? "flex"
              : "block",
          justifyContent:
            isLoading || !conversation || conversation?.length === 0
              ? "center"
              : "initial",
          alignItems:
            isLoading || !conversation || conversation?.length === 0
              ? "center"
              : "initial",
        }}
      >
        <Div sx={{ px: isMobile ? 1 : 2 }}>{renderMessages()}</Div>
      </Box>
      

      {/* Typing Indicator */}
      {selectedRoom?.id && typingUsers[Number(selectedRoom.id)] && Object.keys(typingUsers[Number(selectedRoom.id)]).length > 0 && (
        <Box sx={{ px: 2, py: 1, bgcolor: '#efeae2', display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <Box 
            sx={{ 
              bgcolor: '#fff', 
              px: 1.5, 
              py: 0.5, 
              borderRadius: '10px', 
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#379666', fontWeight: 600 }}>
              {Object.values(typingUsers[Number(selectedRoom.id)]).join(', ')} typing...
            </Typography>
            <Box className="typing-bubble-mini">
              <span className="typing-dot-mini"></span>
              <span className="typing-dot-mini"></span>
              <span className="typing-dot-mini"></span>
            </Box>
          </Box>
        </Box>
      )}

      <ChatFooter />
      <EditDialog />
      <DeleteConfirmDialog />
      <ReactionDetailsDialog />
    </Stack>
  );
}

export default memo(ChatComponent);
