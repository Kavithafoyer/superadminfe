import React, { useCallback, useContext, useEffect, useState } from "react";
import MessagesTriggerButton from "./MessagesTriggerButton";
import MessagesHeader from "./MessagesList/MessagesHeader";
import SettingHeader from "./MessagesSetting/SettingHeader";
import SettingsList from "./MessagesSetting/SettingsList";
import MessagesList from "./MessagesList";
import SearchMessages from "./SearchMessages";
import Divider from "@mui/material/Divider";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Div from "@jumbo/shared/Div";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import { CardActions, ThemeProvider } from "@mui/material";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import axios from "axios";
import { BASE_URL, BASE_URL1 } from "app/services/auth-services";
import { useStateContext } from "app/contexts/ContextProvider";

const MessagesDropdown = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useJumboTheme();

  const { count, setCount } = useStateContext();

  const toggleSettingWindow = useCallback(() => {
    setShowSettings((showSettings) => !showSettings);
  }, [setShowSettings]);

  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const [notifications, setNotifications] = useState([]);
  const [length, setLength] = useState(0);

  const fetchNotifications = () => {
    axios
      .get(`${BASE_URL}/user/UserRemainderMessagesAdditional/`, header)
      .then((res) => {
        console.log("PP", res?.data?.results);
        setNotifications(res?.data?.results);
        setLength(res?.data?.results?.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event) => {
    const div = document.getElementById("openFilter");
    if (div && !div.contains(event.target)) {
      setShowSettings(false);
      fetchNotifications();
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={<MessagesTriggerButton notifications={notifications} />}
        disableInsideClick
      >
        {showSettings ? (
          <Div sx={{ width: 380, maxWidth: "100%" }}>
            <SettingHeader backClickCallback={toggleSettingWindow} />
            <SettingsList />
          </Div>
        ) : (
          <Div id="openFilter" sx={{ width: 380, maxWidth: "100%" }}>
            <MessagesHeader
              settingMenuCallback={toggleSettingWindow}
              length={length}
            />
            {/* <Div sx={{ m: 2, mt: 0 }}>
              <SearchMessages />
            </Div> */}
            <MessagesList notifications={notifications} />

            <Divider />
            {/* <CardActions sx={{ justifyContent: "center" }}>
              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: "normal",
                  "&:hover": { bgcolor: "transparent" },
                }}
                size={"small"}
                variant="text"
                endIcon={<ArrowForwardIcon />}
                disableRipple
              >
                View All
              </Button>
            </CardActions> */}
          </Div>
        )}
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export default MessagesDropdown;
