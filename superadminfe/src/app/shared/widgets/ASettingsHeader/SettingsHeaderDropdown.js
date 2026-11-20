import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import {
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import axios from "axios";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ComponentHeading } from "app/pages/widgets/CRMStyles";
// import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import { LuFileEdit } from "react-icons/lu";

const SettingsHeaderDropdown = () => {
  const navigate = useNavigate();
  const { theme } = useJumboTheme();
  const { headerTheme } = useJumboHeaderTheme();
  const set = localStorage.getItem("Username");
  // const {setAuthToken} = useJumboAuth();
  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);
  const [frommail, setFromMail] = useState(
    `${userDetails && userDetails?.email}`
  );

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

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <ThemeProvider theme={headerTheme}>
            <JumboIconButton elevation={25}>
              <SettingsIcon sx={{ fontSize: "1.25rem" }} />
            </JumboIconButton>
          </ThemeProvider>
        }
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "200px",
            p: (theme) => theme.spacing(2),
          }}
        >
          <Typography noWrap={false} sx={[ComponentHeading, {}]}>
            Settings
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            {/* <ListItemButton>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <AddCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Add New Form" sx={{ my: 0 }} />
                        </ListItemButton> */}
            <ListItemButton
              onClick={() => {
                navigate(`/Add-Formbuilder`);
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Customize Form" sx={{ my: 0 }} />
            </ListItemButton>
            {/* <ListItemButton>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <VisibilityOffIcon />
                            </ListItemIcon>
                            <ListItemText  primary="Hide Form"
                                sx={{ my: 0 }} />
                        </ListItemButton> */}
            <ListItemButton
              onClick={() => {
                navigate(`/Add-FormbuilderList`);
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LuFileEdit size={20} />
              </ListItemIcon>
              <ListItemText primary="Customize Form List" sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export default SettingsHeaderDropdown;
