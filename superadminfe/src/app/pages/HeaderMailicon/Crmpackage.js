import React from "react";
import {
  Card,
  CardContent,
  ListItem,
  ListItemText,
  ThemeProvider,
} from "@mui/material";
import List from "@mui/material/List";
import { Link, useNavigate } from "react-router-dom";
import JumboDdPopover from "@jumbo/components/JumboDdPopover";
import Div from "@jumbo/shared/Div";
import useJumboTheme from "@jumbo/hooks/useJumboTheme";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboIconButton from "@jumbo/components/JumboIconButton";

const Crmpackage = () => {
  const navigate = useNavigate();
  const { theme } = useJumboTheme();
  const set = localStorage.getItem("UserType");
  // const {setAuthToken} = useJumboAuth();

  const onLogout = () => {
    // setAuthToken(null);
    // navigate("/");
    localStorage.removeItem("selectedItems");
    localStorage.removeItem("selectedItems1");
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <JumboIconButton elevation={25}>
            {/* <img
              className="full-logo"
              src={"/images/dots-menu.png"}
              width={25}
              height={25}
              alt="crm"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="bi bi-grid"
              viewBox="0 0 16 16"
            >
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
            </svg>
          </JumboIconButton>
        }
      >
        <Card sx={{ bgcolor: "#e9eef6" }}>
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={350}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            <Card
              sx={{
                width: "300px",
                bgcolor: "#f8fafd",
                borderRadius: "25px",
                m: 1,
              }}
            >
              <CardContent>
                <List
                  component="nav"
                  sx={{
                    display: "flex",
                    borderRadius: "25px",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "20px",
                  }}
                >
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ TextDecoration: "none", color: "black" }}
                      to={`/calendar-view`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/google-calendar.png"}
                          width={30}
                          height={30}
                          alt="crm"
                        />
                      </Div>

                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Google Calendar"
                      />
                    </Link>
                  </ListItem>
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ TextDecoration: "none", color: "black" }}
                      to={`/geo-location`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/map.png"}
                          width={30}
                          height={30}
                          alt="crm"
                        />
                      </Div>
                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Google Map"
                      />
                    </Link>
                  </ListItem>
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ TextDecoration: "none", color: "black" }}
                      to={`/gmail`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/gmail.png"}
                          width={30}
                          height={30}
                          alt="crm"
                        />
                      </Div>
                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Google Mail"
                      />
                    </Link>
                  </ListItem>
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/google-drive.png"}
                        width={30}
                        height={30}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Google Drive" />
                  </ListItem> */}

                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ textDecorationLine: "none", color: "black" }}
                      to={`/facebook`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/facebook.png"}
                          width={25}
                          height={25}
                          alt="crm"
                        />
                      </Div>

                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Facebook"
                      />
                    </Link>
                  </ListItem>
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ textDecorationLine: "none", color: "black" }}
                      to={`/linkedIn`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/linkedin.png"}
                          width={25}
                          height={25}
                          alt="crm"
                        />
                      </Div>
                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Linkedin"
                      />
                    </Link>
                  </ListItem>
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ textDecorationLine: "none", color: "black" }}
                      to={`/Instagram`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/instagram.png"}
                          width={25}
                          height={25}
                          alt="crm"
                        />
                      </Div>
                      <ListItemText
                        sx={{ color: "black" }}
                        primary="Instagram"
                      />
                    </Link>
                  </ListItem>
                  <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Link
                      style={{ textDecorationLine: "none", color: "black" }}
                      to={`/Outlook-Mail`}
                    >
                      <Div sx={{}}>
                        <img
                          className="full-logo"
                          src={"/images/outlook.png"}
                          width={30}
                          height={30}
                          alt="crm"
                        />
                      </Div>
                      <ListItemText sx={{ color: "black" }} primary="Outlook" />
                    </Link>
                  </ListItem>
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/google-calendar.png"}
                        width={25}
                        height={25}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Knowlarity" />
                  </ListItem> */}
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/social.png"}
                        width={25}
                        height={25}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Sales Navigator" />
                  </ListItem> */}
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/google-calendar.png"}
                        width={25}
                        height={25}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Twillo" />
                  </ListItem> */}
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/google-calendar.png"}
                        width={25}
                        height={25}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Microsoft Calendar" />
                  </ListItem> */}
                  {/* <ListItem
                    sx={{ width: "60px", textAlign: "center", display: "flow" }}
                  >
                    <Div sx={{}}>
                      <img
                        className="full-logo"
                        src={"/images/google-calendar.png"}
                        width={25}
                        height={25}
                        alt="crm"
                      />
                    </Div>
                    <ListItemText sx={{color:'black'}} primary="Jitsy" />
                  </ListItem> */}
                </List>
              </CardContent>
            </Card>
          </JumboScrollbar>
        </Card>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export default Crmpackage;
