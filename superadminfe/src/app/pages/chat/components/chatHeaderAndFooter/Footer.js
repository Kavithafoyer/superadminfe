import {
  Box,
  ButtonGroup,
  IconButton,
  InputBase,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { FaFile } from "react-icons/fa";
import React, { useEffect, useRef, useState, memo } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import useResponsive from "../../hook/useResponsive";
import Div from "@jumbo/shared/Div";
import {
  MdOutlineEmojiEmotions,
  MdSend,
  MdMic,
  MdStop,
  MdDelete,
} from "react-icons/md";
import { ImAttachment } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import { useChatContext } from "../../context/Chatcontext";
import {
  useSendRoomMessageMutation,
  useAddMessageAttachmentMutation,
  useSendTypingStatusMutation,
} from "../../../../services/RTKApis/Chat/ChatRTKQueryAPI";
import { toast } from "react-toastify";

const Footer = () => {
  const {
    selectedRoom,
    markRoomAsNotNew,
    replyToMessage,
    setReplyToMessage,
    playChatSound,
  } = useChatContext();
  const [sendRoomMessage] = useSendRoomMessageMutation();
  const [addMessageAttachment] = useAddMessageAttachmentMutation();
  const [sendTypingStatus] = useSendTypingStatusMutation();

  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingSentRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = files.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setAlertMessage(`File "${file.name}" is too large. Max 10MB.`);
        setOpenAlertDialog(true);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAttachments((prev) => [
          ...prev,
          {
            file,
            name: file.name,
            localURL: fileURL,
            base64: reader.result?.split(",")[1],
            progress: 100,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (e.target) e.target.value = null;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setOpenPicker(false);
      }
    };
    if (openPicker) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPicker]);

  // Typing status logic
  useEffect(() => {
    if (!selectedRoom?.id) return;

    if (message.length > 0 && !isTypingSentRef.current) {
      sendTypingStatus({
        room: selectedRoom.id,
        sender: parseInt(localStorage.getItem("UserId")),
        is_typing: true,
      });
      isTypingSentRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingSentRef.current) {
        sendTypingStatus({
          room: selectedRoom.id,
          sender: parseInt(localStorage.getItem("UserId")),
          is_typing: false,
        });
        isTypingSentRef.current = false;
      }
    }, 500);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, selectedRoom?.id, sendTypingStatus]);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(
        () => setRecordingTime((prev) => prev + 1),
        1000,
      );
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File(
          [audioBlob],
          `voice_message_${Date.now()}.webm`,
          { type: "audio/webm" },
        );
        handleAudioFile(audioFile);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  const cancelRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.onstop = null;
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleAudioFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachments((prev) => [
        ...prev,
        {
          file,
          name: file.name,
          localURL: fileURL,
          base64: reader.result?.split(",")[1],
          progress: 100,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const sendUserMessage = async (type) => {
    if (message.trim() === "" && attachments.length === 0) return;
    if (!selectedRoom?.id) {
      toast.error("Select a room");
      return;
    }
    setSendLoader(true);
    try {
      if (attachments.length > 0) {
        for (const att of attachments) {
          let msgType = "text";
          if (att.file.type.startsWith("image/")) msgType = "image";
          else if (att.file.type.startsWith("video/")) msgType = "video";
          else if (att.file.type.startsWith("audio/")) msgType = "audio";
          else msgType = "document";

          const messageResponse = await sendRoomMessage({
            room: selectedRoom.id,
            sender: parseInt(localStorage.getItem("UserId")),
            message: message || att.name,
            message_type: msgType,
            reply_to: replyToMessage?.id,
          }).unwrap();
          if (messageResponse.id) {
            await addMessageAttachment({
              message: messageResponse.id,
              file: att.base64,
              file_name: att.name,
              file_type: msgType,
              file_size: att.file.size,
              room: selectedRoom.id,
            }).unwrap();
          }
        }
      } else {
        await sendRoomMessage({
          room: selectedRoom.id,
          sender: parseInt(localStorage.getItem("UserId")),
          message: message,
          message_type: type || "text",
          reply_to: replyToMessage?.id,
        }).unwrap();
      }
      setMessage("");
      setAttachments([]);
      setReplyToMessage(null);
      if (selectedRoom?.is_new) markRoomAsNotNew();
      playChatSound(null, null, selectedRoom?.id);

      if (isTypingSentRef.current) {
        sendTypingStatus({
          room: selectedRoom.id,
          sender: parseInt(localStorage.getItem("UserId")),
          is_typing: false,
        });
        isTypingSentRef.current = false;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendLoader(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  };

  return (
    <>
      <Div
        sx={{
          border: "1px solid lightgray !important",
          px: 0.5,
          borderRadius: "3px",
          backgroundColor: "white !important",
          width: "100%",
        }}
      >
        {replyToMessage && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
              bgcolor: "#f0f0f0",
              borderLeft: "4px solid #379666",
              mb: 1,
              borderRadius: "4px",
            }}
          >
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontWeight: "bold", color: "#379666" }}
              >
                Replying to:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "12px",
                  color: "#555",
                }}
              >
                {replyToMessage.message ||
                  replyToMessage.Participant_Message ||
                  "File"}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setReplyToMessage(null)}>
              <IoMdClose size={18} />
            </IconButton>
          </Box>
        )}
        {attachments.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              overflowX: "auto",
              borderBottom: "1px solid #eee",
              bgcolor: "#f9f9f9",
            }}
          >
            {attachments.map((att, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "white",
                }}
              >
                {att.file.type.startsWith("image/") ? (
                  <img
                    src={att.localURL}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box sx={{ p: 0.5, textAlign: "center" }}>
                    <FaFile size={24} color="#379666" />
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontSize: "8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: 70,
                      }}
                    >
                      {att.name}
                    </Typography>
                  </Box>
                )}
                <IconButton
                  onClick={() =>
                    setAttachments((prev) => prev.filter((_, i) => i !== index))
                  }
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    bgcolor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <IoMdClose size={16} color="red" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <InputBase
          ref={inputRef}
          style={{ padding: "10px" }}
          placeholder={
            isRecording
              ? "Recording..."
              : "Pick an emoji or type a message..."
          }
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          multiline
          maxRows={5}
          disabled={isRecording}
        />
        <Div
          sx={{
            borderTop: "1px solid ghostwhite",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ButtonGroup variant="text">
            {openPicker && (
              <Div
                ref={pickerRef}
                sx={{ position: "absolute", bottom: 60, left: 0, zIndex: 1000 }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) => handleEmojiClick(emoji.native)}
                />
              </Div>
            )}
            {!isRecording && (
              <>
                <IconButton
                  ref={emojiButtonRef}
                  onClick={() => setOpenPicker(!openPicker)}
                >
                  <MdOutlineEmojiEmotions size={18} color="darkgreen" />
                </IconButton>
                <IconButton component="label">
                  <input type="file" hidden onChange={handleDrop} multiple />
                  <ImAttachment size={15} color="darkgreen" />
                </IconButton>
              </>
            )}
          </ButtonGroup>
          {isRecording ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 1,
                ml: 2,
              }}
            >
              <Typography variant="body2" color="error">
                Recording: {formatTime(recordingTime)}
              </Typography>
              <IconButton onClick={cancelRecording} color="error">
                <MdDelete size={20} />
              </IconButton>
              <IconButton onClick={stopRecording}>
                <MdStop size={24} color="red" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {message.trim() === "" && attachments.length === 0 ? (
                <IconButton onClick={startRecording}>
                  <MdMic size={20} color="darkgreen" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => sendUserMessage()}
                  disabled={sendLoader}
                >
                  {sendLoader ? (
                    <div
                      className="spinner-grow text-success"
                      style={{ width: "20px", height: "20px" }}
                    ></div>
                  ) : (
                    <MdSend size={18} color="darkgreen" />
                  )}
                </IconButton>
              )}
            </Box>
          )}
        </Div>
      </Div>
      <Dialog open={openAlertDialog} onClose={() => setOpenAlertDialog(false)}>
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          <Typography>{alertMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAlertDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(Footer);
