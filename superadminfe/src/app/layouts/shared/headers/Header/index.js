import React, { useState, useEffect } from "react";
import "./Header.css";
import Stack from "@mui/material/Stack";
import useJumboLayoutSidebar from "@jumbo/hooks/useJumboLayoutSidebar";
import AuthUserDropdown from "../../../../shared/widgets/AuthUserDropdown";
import NotificationsDropdown from "../../../../shared/NotificationsDropdown";
import {
  Grid,
  IconButton,
  ListItemIcon,
  Slide,
  Typography,
  useMediaQuery,
  Popover,
  Box,
  useTheme,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Div from "@jumbo/shared/Div";
import CloseIcon from "@mui/icons-material/Close";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Logo from "../../../../shared/Logo";
import { SIDEBAR_STYLES, SIDEBAR_VARIANTS } from "@jumbo/utils/constants";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import { DrawerHeader } from "@jumbo/components/JumboLayout/style";
import { Link, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import Crmpackage from "app/pages/HeaderMailicon/Crmpackage";
import SettingsHeaderDropdown from "app/shared/widgets/ASettingsHeader/SettingsHeaderDropdown";
import { useDispatch } from "react-redux";
import { BASE_URL, socket, Tenantname } from "app/services/auth-services";
import axios from "axios";
import {
  GmailSecertKey,
  getGeoLocationKey,
} from "app/redux/reducers/locationApp";

import { useStateContext } from "app/contexts/ContextProvider";
// import CustomNotification from "app/pages/leads/CustomNotification";
import { notification } from "antd";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";

const Header = () => {
  const token = localStorage.getItem("accesstoken");
  const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const [dropdownSearchVisibility, setDropdownSearchVisibility] =
    useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { headerTheme } = useJumboHeaderTheme();

  const navigate = useNavigate();

  const showDropdownSearch = useMediaQuery("(max-width:575px)");

  const showHeaderMenu = useMediaQuery("(min-width:575px)");

  const showSettingIcon = useMediaQuery("(min-width:575px)");

  const HomeMenu = () => {
    setSidebarOptions({ open: true });
  };

  const PurchaseMenu = () => {
    setSidebarOptions({ open: true });
  };

  const SettingMenu = () => {
    setSidebarOptions({ open: true });
  };

  // console.log("type", `${type}`);
  // console.log("foe", foe);
  // console.log(`${localStorage.getItem("UserType")}`);
  const item = "Admin";
  const check = `${localStorage.getItem("UserType")}`;
  // console.log("check", check);
  // console.log("item", String(item));

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const getMapData = () => {
  //     axios.get(`${BASE_URL}/user/MapConfigurationCRUD/?User_Id=${localStorage.getItem("UserId")}`)
  //       .then((res) => {
  //         dispatch(setGoogleMapsApiKey(res?.data?.API_Key));
  //         console.log("res?.data?.API_Key",res?.data?.API_Key)
  //       })
  //       .catch((err) => {
  //         // console.log("err", err);
  //       });

  //   };

  //   getMapData();
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getGeoLocationKey());
    dispatch(GmailSecertKey());
  }, [dispatch]);

  const NotificatioCallCenterActivityModule = async () => {
    await axios
      .get(
        `${BASE_URL}/user/NotificatioCallCenterActivityModule/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        // //  console.log("res", res);
        DealNotificationStage();
      })
      .catch((err) => {
        // // console.log("err", err);
      });
  };

  const DealNotificationStage = async () => {
    await axios
      .get(
        `${BASE_URL}/user/DealNotificationStage/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        //  console.log("res", res);
        NotificationDealUpdatedStages();
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const NotificationDealUpdatedStages = async () => {
    await axios
      .get(
        `${BASE_URL}/user/NotificationDealUpdatedStages/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        //  console.log("res", res);
        MeetingNotificationStage();
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const MeetingNotificationStage = async () => {
    await axios
      .get(
        `${BASE_URL}/user/MeetingNotificationStage/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        //  console.log("res", res);
        InActiveLeads();
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const InActiveLeads = async () => {
    await axios
      .get(
        `${BASE_URL}/user/InActiveLeads/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        //  console.log("res", res);
        InActiveAccounts();
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const InActiveAccounts = async () => {
    await axios
      .get(
        `${BASE_URL}/user/InActiveAccounts/?UserId=${localStorage.getItem(
          "UserId",
        )}&Organization_Id=${localStorage.getItem("OrganizationId")}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        //  console.log("res", res);
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  useEffect(() => {
    const setDailyTimeout = () => {
      const now = new Date();
      const nextSixPM = new Date();

      nextSixPM.setHours(0, 14, 0, 0); // Set the time to 6 PM

      // If it's already past 6 PM, set the date to the next day

      if (now.getTime() > nextSixPM.getTime()) {
        nextSixPM.setDate(nextSixPM.getDate() + 1);
      }

      const timeUntilNextSixPM = nextSixPM.getTime() - now.getTime();

      setTimeout(() => {
        performTask(); // Function to perform your task
        setDailyTimeout(); // Set the next timeout
      }, timeUntilNextSixPM);
    };

    const performTask = () => {
      // console.log("Trigger");
      NotificatioCallCenterActivityModule();
    };

    setDailyTimeout();
  }, []);

  //  Scoket List Functionality
  const {
    initialState,
    reminder,
    setReminder,
    count,
    setCount,
    setCountnumber,
    countnumber,
  } = useStateContext();

  const [expanded, setExpanded] = useState(false);
  const [scheduledMessage, setScheduledMessage] = useState(null);

  const [notificationActive, setNotificationActive] = useState(false);

  const NotificationSound = () => {
    const notificationSound = new Audio(
      require("../../../../assets/audio/Bell.mp3"),
    );
    // Play notification sound (if allowed by browser)
    if (notificationSound) {
      try {
        const playPromise = notificationSound.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Failed to play audio:", error);
          });
        }
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  };

  const getSocket = () => {
    // Log a message when connected to the server
    socket.on("connect", () => {
      console.log("Connected to the server with Socket ID:", socket.id);
    });

    // Log a message when disconnected from the server
    socket.on("disconnect", () => {
      console.log("Disconnected from the server with Socket ID:", socket.id);
    });

    if (socket) {
      console.log("Cnnected to the server");
      socket.emit("remainder_List", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });
      socket.emit("CallCenterActivity", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });
      socket.emit("SalesSchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      //  Activity Model

      //  Lead Activity

      socket.emit("LeadActivitySchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      //  DealActivitySchdule

      socket.emit("DealActivitySchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      // Account Activity

      socket.emit("AccountActivitySchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      // ContactActivitySchdule

      socket.emit("ContactActivitySchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      // LeadMeetingSchdule

      socket.emit("LeadMeetingSchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      // DealMeetingSchdule
      socket.emit("DealMeetingSchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      //  AccountMeetingSchdule
      socket.emit("AccountMeetingSchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });

      // ContactMeetingSchdule

      socket.emit("ContactMeetingSchdule", {
        RemainderList: {
          UserId: localStorage.getItem("UserId"),
          db: "demo",
        },
      });
    }
  };

  socket.on("ContactMeetingMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("AccountMeetingMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("DealMeetingMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("LeadMeetingMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("ContactActivityMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("AccountActivityMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("DealActivityMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("LeadActivityMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("scheduledMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();

    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );

      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);

      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("SalesMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();
    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );
      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);
      return updatedCountnumber;
    });
    NotificationSound();
  });

  socket.on("CallCenterMessage", (data) => {
    console.log("Scheduled message received:", data);
    setScheduledMessage(data);
    RemainderData();
    setCountnumber((prevCountnumber) => {
      const updatedCountnumber = [...prevCountnumber, 1];
      const sum = updatedCountnumber.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      );
      console.log("updatedCountnumber", updatedCountnumber);
      setCount(sum);
      return updatedCountnumber;
    });
    NotificationSound();
  });

  useEffect(() => {
    getSocket();
  }, []);

  const RemainderData = (data) => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, 60000);
  };

  // zing

  const notificationSound = new Audio(
    require("../../../../assets/audio/Bell.mp3"),
  );

  const openNotification = (data, placement) => {
    notification.info({
      message: `${data?.Meassage}`,
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
    socket.on("receive_notification_message", (data) => {
      if (
        Number(localStorage.getItem("UserId")) === Number(data?.Receiver_Id)
        // && selectedUser?.id !== Number(data?.Receiver_Id)
      ) {
        console.log(
          "response receive_notification_message : ",
          data?.pop()?.Meassage,
        );

        openNotification(data?.pop(), "topRight");
        notificationSound.play().catch((error) => {
          console.error("Failed to play audio:", error);
        });
      }
    });

    // Clean up on component unmount
    return () => {
      socket.off("ChatWarningMsg");
      // socket.off("ChatUserGroupList");
    };
  }, []);

  return (
    <React.Fragment>


      {(sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER ||
        sidebarOptions.variant === SIDEBAR_VARIANTS.TEMPORARY ||
        (sidebarOptions.variant === SIDEBAR_VARIANTS.PERSISTENT &&
          !sidebarOptions.open)) && (
        <>
          <DrawerHeader>
            <Div className="flex items-center gap-2">
              <Logo />
              <IconButton
                edge="start"
                color="inherit"
                mode={headerTheme.type ?? "light"}
                aria-label="open drawer"
                sx={{
                  ml:
                    sidebarOptions.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER
                      ? -1
                      : -2,
                  mr: 1,
                  overflow: "hidden",
                  fontSize: "0.5rem",
                  borderRadius: "1px",
                  padding: "6px 26px 18px 18px",
                  height: "70px",
                  backgroundColor: "white",
                  "&:hover,&:active": {
                    backgroundColor: "inherit",
                    color: "#000000",

                  },
                }}
                onClick={() =>
                  setSidebarOptions({ open: !sidebarOptions.open })
                }
              >
                <>
                  {sidebarOptions?.open ? (
                    <div className="open-close-icon-theme2">
                      <MenuOpenIcon />
                    </div>
                  ) : (
                    <div className="open-close-icon-theme2">
                      <MenuIcon />
                    </div>
                  )}
                </>
              </IconButton>
            </Div>
          </DrawerHeader>
        </>
      )}
      {sidebarOptions?.style === SIDEBAR_STYLES.CLIPPED_UNDER_HEADER && <></>}
      {showDropdownSearch && (
        <Slide in={dropdownSearchVisibility}>
          <Div
            sx={{
              zIndex: 1,
              left: 0,
              right: 0,
              position: "absolute",
              height: "65px",
            }}
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                color: "inherit",
                transform: "translateY(-50%)",
              }}
              onClick={() => setDropdownSearchVisibility(false)}
            >
              <div className="open-close-icon-theme2">
                <CloseIcon mode={headerTheme.type ?? "light"} />
              </div>
            </IconButton>
          </Div>
        </Slide>
      )}

      {showHeaderMenu && (
        <div className="header-menus">
          <h2
            className="col"
            id="home_"
            style={{
              padding: "0px 20px 0px 15px",
              fontWeight: "400",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <Link to="/user-admin-dashboard" onClick={HomeMenu}></Link>
          </h2>

          <h2
            className="col"
            style={{
              padding: "0px 15px 0px 15px",
              fontWeight: "400",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <Link
              to="/licence/list-licence"
              href="#purchase_"
              // onClick={PurchaseMenu}
            ></Link>
          </h2>

          <h2
            className="col"
            style={{
              padding: "0px 15px 0px 15px",
              fontWeight: "400",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <Link to="/lookup/list-lookup" href="#lookup_"></Link>
          </h2>

          <h2
            className="col"
            style={{
              padding: "0px 15px 0px 15px",
              fontWeight: "400",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <Link to="/ticket/list-ticket" href="#ticket_"></Link>
          </h2>
        </div>
      )}

      {/* {!showDropdownSearch && (
        <Div sx={{ marginLeft: { xs: "0px", md: "120px" } }}>
          <SearchGlobal
            sx={{
              minWidth: { xs: 0, md: 360 },
              maxWidth: { xs: 240, md: 420 },
            }}
          />
        </Div>
      )} */}

      {token && (
        <>
          {isMobile ? (
            <>
              <Tooltip title="More">
                <IconButton
                  onClick={(e) => setAnchorElMenu(e.currentTarget)}
                  sx={{ ml: "auto", color: "inherit" }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(anchorElMenu)}
                anchorEl={anchorElMenu}
                onClose={() => setAnchorElMenu(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: 70,
                    borderRadius: 2,
                    boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >

                  <Tooltip title="Notifications" placement="left">
                    <Box component="span">
                      <NotificationsDropdown />
                    </Box>
                  </Tooltip>
                  {/* <Tooltip title="Settings" placement="left">
                    <Box component="span">
                      <SettingsHeaderDropdown />
                    </Box>
                  </Tooltip> */}
                    <ThemeProvider theme={headerTheme}>
                      <Tooltip title="Live Chats" placement="left">
                        <JumboIconButton
                          elevation={25}
                          onClick={() => {
                            navigate("/customer-support/ticket-livecharts");
                            setAnchorElMenu(null);
                          }}
                        >
                          <i
                            className="bi bi-chat-dots"
                            style={{ color: "#000000" }}
                          ></i>
                        </JumboIconButton>
                      </Tooltip>
                    </ThemeProvider>
                  {/* <Tooltip title="CRM Package" placement="left">
                    <Box component="span">
                      <Crmpackage />
                    </Box>
                  </Tooltip> */}
                  <Tooltip title="Profile" placement="left">
                    <Box component="span">
                      <AuthUserDropdown />
                    </Box>
                  </Tooltip>
                </Box>
              </Popover>
            </>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1, md: 1.3 }}
              className="Notification-icon"
              sx={{ ml: { xs: -1, md: "auto" } }}
            >

              <Tooltip title="Notifications">
                <Box component="span">
                  <NotificationsDropdown />
                </Box>
              </Tooltip>
              {/* <Tooltip title="Settings">
                <Box component="span">
                  <SettingsHeaderDropdown />
                </Box>
              </Tooltip> */}
              <ThemeProvider theme={headerTheme}>
                <Tooltip title="Live Chats">
                  <JumboIconButton
                    elevation={25}
                    onClick={() => {
                      navigate("/customer-support/ticket-livecharts");
                    }}
                  >
                    <i
                      className="bi bi-chat-dots"
                      style={{ color: "#000000" }}
                    ></i>
                  </JumboIconButton>
                </Tooltip>
              </ThemeProvider>
              {/* <Tooltip title="CRM Package">
                <Box component="span">
                  <Crmpackage />
                </Box>
              </Tooltip> */}
              <div className="profile-icon">
                <Tooltip title="Profile">
                  <Box component="span">
                    <AuthUserDropdown />
                  </Box>
                </Tooltip>
              </div>
            </Stack>
          )}
        </>
      )}

      {/* <>
        {expanded && (
          <CustomNotification
            // reminder={reminder}
            // setReminder={setReminder}
            messages={scheduledMessage}
            setScheduledMessage={setScheduledMessage}
            onClose={closeNotification}
            expanded={expanded}
          />
        )}
      </> */}

      {/* <Sidebar showPartnerMenus={showPartnerMenus}/> */}
    </React.Fragment>
  );
};

export default Header;
