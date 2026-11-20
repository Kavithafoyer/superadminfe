import { Box, Stack } from "@mui/material";
import React from "react";
import NoChat from "../components/chatHeaderAndFooter/NoChat";
import ChatComponent from "./ChatComponent";
import ChatLeftSide from "./ChatLeftSide";
import { useChatContext } from "../context/Chatcontext";
import { IconButton, Tooltip } from "@mui/material";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import useResponsive from "../hook/useResponsive";
import { ReactionDetailsDialog } from "./Conversation";
import { Super_Admin_URL } from "../../../services/auth-services";

function GeneralApp() {
  const { selectedRoom, sidebarOpen, setSidebarOpen } = useChatContext();

  const updateUserStatus = React.useCallback(async (isOffline = false) => {
    const UserId = localStorage.getItem("UserId");
    if (!UserId) return;

    const url = `${Super_Admin_URL}/superadmin/UserChatList/?user_id=${UserId}${isOffline ? "&offline=true" : ""}`;
    try {
      await fetch(url);
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  }, []);

  React.useEffect(() => {
    const UserId = localStorage.getItem("UserId");
    if (!UserId) return;

    // Set online when entering chat
    updateUserStatus(false);

    // Heartbeat every 50 seconds
    const interval = setInterval(() => updateUserStatus(false), 50000);

    // Set offline when leaving or closing tab
    const handleUnload = () => updateUserStatus(true);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      updateUserStatus(true); // Call offline API on unmount
    };
  }, [updateUserStatus]);

  const isMobile = useResponsive("down", "md");
  const [sidebarWidth, setSidebarWidth] = React.useState(350);
  const [isResizing, setIsResizing] = React.useState(false);
  const containerRef = React.useRef(null);

  const startResizing = React.useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (e) => {
      if (isResizing && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;
        if (newWidth >= 250 && newWidth <= 600) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing],
  );

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  const hasSelectedChat = Boolean(selectedRoom);

  return (
    <Stack
      ref={containerRef}
      sx={{
        width: "100%",
        height: isMobile ? "calc(100vh - 80px)" : "calc(100vh - 145px)",
        position: "relative",
        overflow: "hidden", // Prevent global scrollbar
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        {/* Mobile View */}
        {isMobile ? (
          <Box sx={{ flex: 1, height: "100%" }}>
            {hasSelectedChat ? <ChatComponent /> : <ChatLeftSide />}
          </Box>
        ) : (
          /* Desktop View */
          <>
            {/* Left Side */}
            {sidebarOpen && (
              <>
                <Box
                  sx={{ width: sidebarWidth, height: "100%", flexShrink: 0 }}
                >
                  <ChatLeftSide />
                </Box>
                {/* Resizer Handle */}
                <Box
                  onMouseDown={startResizing}
                  sx={{
                    width: "4px",
                    cursor: "col-resize",
                    backgroundColor: isResizing ? "#379666" : "transparent",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "#379666",
                    },
                    height: "100%",
                    zIndex: 10,
                  }}
                />
              </>
            )}

            {/* Right Side */}
            <Box
              sx={{
                flex: 1,
                height: "100%",
                minWidth: 0, // Critical for flex children with text-overflow
                position: "relative",
              }}
            >
              {hasSelectedChat ? (
                <ChatComponent />
              ) : (
                <Stack
                  sx={{ height: "100%", width: "100%" }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <NoChat />
                </Stack>
              )}
            </Box>
          </>
        )}
      </Box>
      <ReactionDetailsDialog />
    </Stack>
  );
}

export default GeneralApp;
