import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { authUser } from "./fake-db";
import {
  Grid,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  IconButton,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import axios from "axios";
import { BASE_URL, getProfileImage, Tenantname } from "app/services/auth-services";
import MailConfiguration from "./MailConfiguration";
import UserProfile from "./UserProfile";
import { CiCalendar, CiMail } from "react-icons/ci";
import { IoVideocamOutline } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

// import { useJumboLayoutSidebar } from "@jumbo/hooks";
// import useJumboAuth from "@jumbo/hooks/useJumboAuth";

const AuthUserDropdown = () => {
  // const { sidebarOptions, setSidebarOptions } = useJumboLayoutSidebar();
  const navigate = useNavigate();
  const { theme } = useJumboTheme();
  const set = localStorage.getItem("Username");
  const token = localStorage.getItem("accesstoken");

  // const {setAuthToken} = useJumboAuth();
  let userDetails = localStorage.getItem("UserDetails");
  try {
    userDetails = JSON.parse(userDetails);
  } catch (e) {
    userDetails = null;
  }
  const [frommail, setFromMail] = useState(
    `${userDetails && userDetails?.email}`
  );
  const [profileData, setProfileData] = useState(userDetails);

  const photo = getProfileImage(profileData?.User_Photo);

  // update login status
  const updateLoginStatus = async () => {
    try {
      const token = localStorage.getItem("accesstoken");
      const username = localStorage.getItem("Username");
      await axios.patch(
        `${BASE_URL}/useradmin/UserCRUD/`,
        {
          User_Login_Status: false,
          username: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: "crmuseradmin1",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updatePassWordStatus = () => {
    if (
      userDetails?.Password_Status === false &&
      userDetails?.Navigate_Status === false
    ) {
      axios
        .patch(
          `${BASE_URL}/useradmin/UserCRUD/`,
          {
            id: localStorage.getItem("UserId"),
            username: userDetails && userDetails?.username,
            Password_Status: true,
          },
          {
            headers: {
              db: "crm",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("get appointments list", res.data);
          window.location.href = `https://admin.crmfarm.in/InstanceEditList/?id=${Tenantname}`;
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      navigate(`/`);
      localStorage.removeItem("selectedItems");
      localStorage.removeItem("selectedItems1");
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("session_id");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("UserDetails");
      localStorage.removeItem("Username");
      localStorage.removeItem("UserId");
      localStorage.removeItem("OrganizationId");
      localStorage.removeItem("UserType");
      localStorage.removeItem("Designation");
      localStorage.removeItem("DBName");
    }
  };

  //   no action auto logout
  const inactivityTimeout = 12000000; // 5 minutes in milliseconds
  let logoutTimer;

  const resetTimeout = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(onLogout, inactivityTimeout);
  };

  useEffect(() => {
    resetTimeout();

    const events = ["mousemove", "keydown"];

    const handleUserActivity = () => {
      resetTimeout();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      clearTimeout(logoutTimer);
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [navigate]);

  const onLogout = async () => {
    // setAuthToken(null);
    const token = localStorage.getItem("accesstoken");
    const refreshtoken = localStorage.getItem("refreshtoken");
    const sessionId = localStorage.getItem("session_id");
    if (refreshtoken) {
      try {
        await axios.post(
          `${BASE_URL}/useradmin/logout/`,
          { refresh: refreshtoken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              "Session-Id": sessionId || "",
            },
          }
        );
      } catch (error) {
        console.error("Logout API failed:", error);
        const errorMessage =
          error.response?.data?.details ||
          error.response?.data?.message ||
          error.message ||
          "Logout failed";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
        });
        return; // Don't let user logout
      }
    }
    await updateLoginStatus();
    updatePassWordStatus();
  };

  // Calendar Mail Configuration and Mail Configuration

  const [showconfig, setShowConfig] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [chatopen, setchatopen] = useState(false);
  const [save, setSave] = useState(false);

  const [cal, setCal] = useState(false);


  return (
    <Div>
      <ThemeProvider theme={theme}>
        <JumboDdPopover
          triggerButton={
            <Div sx={{ display: "flex" }}>
              <Avatar
                src={photo}
                sizes={"small"}
                sx={{
                  cursor: "pointer",
                  backgroundColor: "#064F6B",
                  fontSize: "14px",
                  color: "white",
                }}
              >
                {set && set[0].toUpperCase()}
                {set && set[1].toUpperCase()}
              </Avatar>
              {/* <Typography variant="h3"  fontWeight={700}
                    sx={{pl:1.8,pt:1.3}}>
                      {set&&set}
                      </Typography> */}
            </Div>
          }
        >
          <Div
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: (theme) => theme.spacing(2.5),
            }}
          >
            <Avatar
              src={photo}
              sx={{
                width: 60,
                height: 60,
                mb: 2,
                bgcolor: "#064F6B",
                color: "white",
              }}
            >
              {set && set[0].toUpperCase()}
              {set && set[1].toUpperCase()}
            </Avatar>
            <Typography variant={"h5"}>{set}</Typography>
            <Typography variant={"body1"} color="text.secondary">
              {frommail}
            </Typography>
          </Div>
          <Divider />
          <nav>
            <List disablePadding sx={{ pb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setProfileOpen(true);
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PersonOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" sx={{ my: 0 }} />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  setOpen(true);
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <EmailOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Mail Configuration" sx={{ my: 0 }} />
              </ListItemButton>
              <ListItemButton onClick={onLogout}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ my: 0 }} />
              </ListItemButton>
            </List>
          </nav>
        </JumboDdPopover>
      </ThemeProvider>

      <Div>
        <MailConfiguration open={open} setOpen={setOpen} />
        <UserProfile open={profileOpen} setOpen={setProfileOpen} />
      </Div>
    </Div>
  );
};

export default AuthUserDropdown;
