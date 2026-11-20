import React, { useEffect, useState } from "react";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";
import NotificationBirthday from "./NotificationBirthday";
import NotificationInvitation from "./NotificationInvitation";
import NotificationSharedPost from "./NotificationSharedPost";
import NotificationPost from "./NotificationPost";
import { notifications } from "./fake-data";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import CardHeader from "@mui/material/CardHeader";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Divider from "@mui/material/Divider";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import Div from "@jumbo/shared/Div";
import {
  Avatar,
  CardActions,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import axios from "axios";
import { BASE_URL, socket } from "app/services/auth-services";
import { green } from "@mui/material/colors";
import { useMemo } from "react";
import ChatNotification from "./ChatNotification";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import {
  Cancelbutton,
  countdown,
  CustomButton,
} from "app/pages/widgets/StylesComponents";
import { useStateContext } from "app/contexts/ContextProvider";

const NotificationComponents = {
  POSTING: NotificationPost,
  SHARED_POST: NotificationSharedPost,
  INVITATION: NotificationInvitation,
  BIRTHDAY: NotificationBirthday,
};

const NotificationsDropdown = () => {
  const { theme } = useJumboTheme();
  const { headerTheme } = useJumboHeaderTheme();
  const navigate = useNavigate();

  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);
  let companyId = userDetails && userDetails.Organization_Id;
  let id = userDetails && userDetails.id;
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  var userName = localStorage.getItem("Username");

  const { setUsers } = useStateContext();

  const [notifications, setNotifications] = useState([]);
  const [length, setLength] = useState(1);

  const [currUserChatLength, setCurrUserChatLength] = useState(0);
  const [prevUserChatLength, setPrevUserChatLength] = useState(0);
  const [currGroupChatLength, setCurrGroupChatLength] = useState(0);
  const [prevGroupChatLength, setPrevGroupChatLength] = useState(0);

  const [newMessage, setNewMessage] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const [notificationActive, setNotificationActive] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [groupChecked, setGroupChecked] = useState(false);

  const closeNotification = () => {
    setNotificationActive(false);
    setNewMessage("");
  };

  const fetchNotifications = () => {
    axios
      .get(`${BASE_URL}/superadmin/UserNotificationAdditional/`, header)
      .then((res) => {
        //console.log("PP", res.data);
        setNotifications(res.data?.results);
        setLength(res.data.length);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };

  const UserId = parseInt(localStorage.getItem("UserId"));
  const OrganizationId = parseInt(localStorage.getItem("OrganizationId"));
  const item = "crmuseradmin1";

  // userChats shows

  const notificationSound = new Audio(require("../../assets/audio/Bell.mp3"));

  const chatLengthComparison = useMemo(() => {
    if (
      prevUserChatLength < currUserChatLength ||
      prevGroupChatLength < currGroupChatLength
    ) {
      setNotificationActive(true);
      // live chat notification sound
      notificationSound.play().catch(function (error) {
        console.error("Failed to play audio:", error);
      });
      // alert("alert")
    }
  }, [
    prevUserChatLength,
    currUserChatLength,
    prevGroupChatLength,
    currGroupChatLength,
  ]);

  // const handleOnClickUserProfile = async (items) => {
  //   //console.log("usersss", items);
  //   let receivedId = item.username && items?.id;

  //   try {
  //     const response = await axios.get(`${BASE_URL}/user/ChatUsersFullList/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         db: item,
  //       },
  //     });

  //     if (response.data) {
  //       const reversedArray = response.data;
  //       //console.log("userssschat", reversedArray);
  //       if (reversedArray.length > 0) {
  //         // Update chat lengths
  //         let boo =
  //           parseInt(reversedArray[reversedArray?.length - 1].Receiver_Id) ===
  //           parseInt(localStorage.getItem("UserId"));

  //         if (boo) {
  //           // setUserChecked(true)
  //           setPrevUserChatLength(currUserChatLength);
  //           setCurrUserChatLength(reversedArray?.length);
  //           setNewMessage(reversedArray[reversedArray?.length - 1] || "");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     //console.log(error);
  //     if (error) {
  //       // Handle the error as needed
  //     }
  //   }
  // };

  // const handleOnClickGroupProfile = async (items) => {
  //   //console.log("usersss", items);
  //   let receivedId = item.username && items?.id;

  //   try {
  //     const response = await axios.get(`${BASE_URL}/user/ChatGroupFullList/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         db: item,
  //       },
  //     });

  //     if (response.data) {
  //       //console.log("groupchatss", response?.data);
  //       const reversedArray = response.data;
  //       if (response.data?.length > 0) {
  //         // Update chat lengths
  //         let boo = response.data[response.data?.length - 1]?.Receiver_Id?.find(
  //           (item) =>
  //             parseInt(item) === parseInt(localStorage.getItem("UserId"))
  //         );
  //         //console.log("groupchatssboo", boo);

  //         if (boo) {
  //           // setGroupChecked(true)
  //           setPrevGroupChatLength(currUserChatLength);
  //           setCurrGroupChatLength(reversedArray?.length);
  //           setNewMessage(reversedArray[reversedArray?.length - 1] || "");
  //           //console.log("groupchatss", response?.data, boo);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     //console.log(error);
  //     if (error) {
  //       // Handle the error as needed
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handleOnClickUserProfile();
  // }, [currUserChatLength]);

  // useEffect(() => {
  //   handleOnClickUserProfile();
  //   const interval = setInterval(async () => {
  //     await handleOnClickUserProfile();
  //   }, 5000); // 30 in milliseconds

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   handleOnClickUserProfile();
  //   const interval = setInterval(async () => {
  //     await handleOnClickGroupProfile();
  //   }, 5000); // 30 in milliseconds

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  // socket.on("ChatWarningMsg", (data) => {
  //   setNotificationActive(true);
  //   // live chat notification sound
  //   notificationSound.play().catch((error) => {
  //     console.error("Failed to play audio:", error);
  //   });
  //   console.log("ChatWarningMsg : ", data);
  // });

  const openNotification = (data, placement) => {
    notification.info({
      message: `${data?.username} wants to chat with you`,
      description: (
        <>
          <Typography className="mt-3">
            Do you want to Allow or Deny?
          </Typography>
          <div className="flex items-center gap-3 mt-3">
            <CustomButton
              onClick={() => {
                socket.emit("ChatWarningMsg", {
                  ...data,
                  message: "Allowed",
                });

                notification.destroy();
              }}
              label="Allow"
              Icon=""
            />
            <Cancelbutton
              onClick={() => {
                socket.emit("ChatWarningMsg", {
                  ...data,
                  message: "Blocked",
                });
                notification.destroy();
              }}
              label={`Deny`}
              Icon=""
            />
          </div>
        </>
      ),

      placement,
    });
  };

  useEffect(() => {
    socket.on("ChatWarningMsg", (data) => {
      if (
        Number(localStorage.getItem("UserId")) === Number(data?.receiverId) &&
        data?.message === "Waiting"
      ) {
        openNotification(data, "topRight");

        notificationSound.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
      }

      // socket.on("ChatUserGroupList", (data) => {
      //   console.log("ChatUserGroupList all list: ", data);
      //   setUsers(data);
      // });

      console.log(
        "ChatWarningMsg : ",
        data,
        Number(localStorage.getItem("UserId")),
        data?.receiverId
      );
    });

    // Clean up on component unmount
    return () => {
      socket.off("ChatWarningMsg");
      // socket.off("ChatUserGroupList");
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <JumboDdPopover
          triggerButton={
            <ThemeProvider theme={headerTheme}>
              <JumboIconButton badge={{ variant: "dot" }} elevation={25}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-bell-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                </svg>
              </JumboIconButton>
            </ThemeProvider>
          }
          disableInsideClick
        >
          <Div sx={{ width: 360, marginTop: "7px", maxWidth: "100%" }}>
            <CardHeader
              title={"Notifications"}
              action={
                <IconButton sx={{ my: -1 }}>
                  <MoreHorizIcon />
                </IconButton>
              }
            />
            <List disablePadding>
              {notifications?.map((item, index) => {
                //console.log("item", item);
                const timestamp = item.Notification_Time;
                const dateObject = new Date(timestamp);
                const hours = dateObject.getHours();
                const minutes = dateObject.getMinutes();
                const time = hours >= 12 ? "PM" : "AM";
                //console.log(`Time: ${hours}:${minutes}`);
                return (
                  // <Div key={index} sx={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                  //     <Div>
                  //         <Avatar>P</Avatar>
                  //     </Div>
                  //   <Typography sx={{fontSize:'14px'}}>{item.Reminder_Msg}</Typography>
                  // </Div>
                  <ListItemButton component={"li"} disableRipple>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: generateRandomColor(),
                        }}
                      >
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant={"h6"} mb={0.25}>
                          {item?.NotificationMsg}
                        </Typography>
                      }
                      secondary={
                        <Typography noWrap color={"text.secondary"}>
                          {/* {`${hours} : ${minutes} ${time}`} */}
                          {item.Notification_Time?.split("T")[0]}{" "}
                          {`${hours} : ${minutes} ${time}`}
                        </Typography>
                      }
                    />
                    {/* <IconButton elevation={1} edge={"end"} size={"small"}>
                    <MoreHorizIcon />
                  </IconButton> */}
                  </ListItemButton>
                );
              })}
            </List>
            <Divider />
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                onClick={() => {
                  navigate(`/sales-sales-Notifications`);
                }}
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
              {/* <Button type="primary" onClick={openNotification}>
                Open the notification box
              </Button> */}
            </CardActions>
          </Div>
        </JumboDdPopover>
      </ThemeProvider>

      {notificationActive && (
        <ChatNotification
          message={newMessage}
          onExpand={() => setExpanded1(true)} // Toggle the expanded state when clicked
          onClose={closeNotification}
          expanded={expanded1}
        />
      )}
    </>
  );
};

export default NotificationsDropdown;
