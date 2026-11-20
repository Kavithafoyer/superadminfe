import React, { useEffect } from "react";
import { Avatar, Card, Grid, Typography, Button, Stack } from "@mui/material";
import Div from "@jumbo/shared/Div";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { CancelOutlined } from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";

const dropDownLists = [
  {
    type: "1",
    con_pers: "ravi",
    filter: "Category",
  },
  {
    type: "2",
    con_pers: "ani",
    filter: "Size",
  },
  {
    type: "3",
    con_pers: "kevin",
    filter: "Recent",
  },
];

const SummaryRightSideCardList = () => {
  const [openAddContact, setOpenCreateAccount] = useState(false);
  const [summary, setSummary] = useState({
    Ticket_Progress_Count: 0,
    Ticket_Hold_Count: 0,
    Ticket_Closed_Count: 0,
    Ticket_To_do_Count: 0,
    Ticket_Done_Count: 0,
  });
  const [activities, setActivities] = useState([]);
  const [toDos, setToDos] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  // get Ticket Progress Count
  const getTicketProgressCount = async () => {
    try {
      await axios
        .get(`${BASE_URL}/user/TicketManagementSummary/`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Summary", res.data.results);
          setSummary({
            ...summary,
            Ticket_Progress_Count: res?.data?.Ticket_Progress_Count || 0,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  // get Ticket Hold Count
  const getTicketHoldCount = async () => {
    try {
      await axios
        .post(
          `${BASE_URL}/user/TicketManagementSummary/`,
          {},
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Summary", res.data.results);
          setSummary({
            ...summary,
            Ticket_Hold_Count: res?.data?.Ticket_Hold_Count || 0,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  // get Ticket Closed Count
  const getTicketClosedCount = async () => {
    try {
      await axios
        .put(
          `${BASE_URL}/user/TicketManagementSummary/`,
          {},
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log("Summary", res.data.results);
          setSummary({
            ...summary,
            Ticket_Closed_Count: res?.data?.Ticket_Closed_Count || 0,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  // get Ticket Todo Count
  const getTicketTodoCount = async () => {
    try {
      await axios
        .get(`${BASE_URL}/user/TicketManagementSummary1/`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Summary", res.data.results);
          setSummary({
            ...summary,
            Ticket_To_do_Count: res?.data?.Ticket_To_do_Count || 0,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  // get Ticket Done Count
  const getTicketDoneCount = async () => {
    try {
      await axios
        .post(`${BASE_URL}/user/TicketManagementSummary1/`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Summary", res.data.results);
          setSummary({
            ...summary,
            Ticket_Done_Count: res?.data?.Ticket_Done_Count || 0,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTicketProgressCount();
    getTicketHoldCount();
    getTicketClosedCount();
    getTicketTodoCount();
    getTicketDoneCount();
  }, []);

  return (
    <>
      <JumboContentLayoutMain>
        <Stack>
          {/* Ticket Summary */}
          <Div
            sx={{ boxShadow: 3, borderRadius: "10px", padding: "15px", pb: 0 }}
          >
            <Typography
              color="neutral"
              level="h2"
              noWrap={false}
              variant="plain"
              sx={{ fontSize: "18px", fontWeight: 700 }}
            >
              Ticket Summary
            </Typography>

            <Grid container spacing={3} my={1}>
              <Grid
                item
                display={"flex"}
                sx={{ mt: -2, pb: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
                xs={6}
                md={4}
                lg={2.4}
                xl={2.4}
              >
                <Div
                  sx={{
                    mx: "8px",
                    borderRadius: "180% 20% 20% 20%",
                    width: "126px",
                    height: "90px",
                    bgcolor: "#EFF6FD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Div sx={{ mt: 2, ml: 2 }}>
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#746C70",
                        //
                        mb: 0.6,
                      }}
                    >
                      To Do
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px" }}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#746C70",
                      }}
                    >
                      {summary?.Ticket_To_do_Count}
                    </Typography>
                  </Div>
                </Div>
              </Grid>
              <Grid
                item
                display={"flex"}
                sx={{ mt: -2, pb: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
                xs={6}
                md={4}
                lg={2.4}
                xl={2.4}
              >
                <Div
                  spacing={2}
                  sx={{
                    mx: "8px",
                    borderRadius: "180% 20% 20% 20%",
                    width: "126px",
                    height: "90px",
                    bgcolor: "#FDF2CD",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Div sx={{ mt: 2, ml: 2 }}>
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#746C70",
                        mb: 0.6,
                      }}
                    >
                      In Progress
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px" }}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#746C70",
                      }}
                    >
                      {summary?.Ticket_Progress_Count}
                    </Typography>
                  </Div>
                </Div>
              </Grid>
              <Grid
                item
                display={"flex"}
                sx={{ mt: -2, pb: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
                xs={6}
                md={4}
                lg={2.4}
                xl={2.4}
              >
                <Div
                  spacing={2}
                  sx={{
                    mx: "8px",
                    borderRadius: "180% 20% 20% 20%",
                    width: "126px",
                    height: "90px",
                    bgcolor: "#FFDFDF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Div sx={{ mt: 2, ml: 2 }}>
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#746C70",
                        mb: 0.6,
                      }}
                    >
                      On Hold
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px" }}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#746C70",
                      }}
                    >
                      {summary?.Ticket_Hold_Count}
                    </Typography>
                  </Div>
                </Div>
              </Grid>
              <Grid
                item
                display={"flex"}
                sx={{ mt: -2, pb: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
                xs={6}
                md={4}
                lg={2.4}
                xl={2.4}
              >
                <Div
                  spacing={2}
                  sx={{
                    mx: "8px",
                    borderRadius: "180% 20% 20% 20%",
                    width: "126px",
                    height: "90px",
                    bgcolor: "#D4FFD4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Div sx={{ mt: 2, ml: 2 }}>
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#746C70",
                        mb: 0.6,
                      }}
                    >
                      Closed
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px" }}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#746C70",
                      }}
                    >
                      {summary?.Ticket_Closed_Count}
                    </Typography>
                  </Div>
                </Div>
              </Grid>
              <Grid
                item
                display={"flex"}
                sx={{ mt: -2, pb: 2 }}
                justifyContent={"center"}
                alignItems={"center"}
                xs={6}
                md={4}
                lg={2.4}
                xl={2.4}
              >
                <Div
                  spacing={2}
                  sx={{
                    mx: "8px",
                    borderRadius: "180% 20% 20% 20%",
                    width: "126px",
                    height: "90px",
                    bgcolor: "#E4D7FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Div sx={{ mt: 2, ml: 2 }}>
                    <Typography
                      align="center"
                      sx={{
                        fontWeight: 400,
                        fontSize: "13px",
                        color: "#746C70",
                        mb: 0.6,
                      }}
                    >
                      Done
                    </Typography>

                    <Typography
                      sx={{ fontSize: "14px" }}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#746C70",
                      }}
                    >
                      {summary?.Ticket_Done_Count}
                    </Typography>
                  </Div>
                </Div>
              </Grid>
            </Grid>
          </Div>

          <Grid container spacing={3} mt={1}>
            {/* Recent Activity */}
            <Grid item xs={12} md={8} lg={8} xl={8}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: "10px",
                  padding: "15px",
                  pb: 0,
                }}
              >
                <Div sx={{ borderBottom: "1px solid lightgray", pb: 2, pt: 1 }}>
                  <Typography
                    color="neutral"
                    level="h2"
                    noWrap={false}
                    variant="plain"
                    sx={{ fontSize: "18px", fontWeight: 700 }}
                  >
                    Recent Activity
                  </Typography>
                </Div>
                <Div sx={{ mt: 2 }}>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHeightMin={460}
                    autoHideTimeOut={4000}
                  >
                    <Div>
                      <Stack direction={"column"} spacing={3}>
                        <Div>
                          <Stack>
                            <Div
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "#050A30",
                                  width: "30px",
                                  height: "30px",
                                  fontSize: "14px",
                                }}
                              >
                                GS
                              </Avatar>
                              <Typography
                                sx={{
                                  paddingLeft: "8px",
                                  m: 0,
                                  color: "#304995",
                                  fontSize: "12px",
                                }}
                              >
                                Gokulraj Sugumar{" "}
                                <span style={{ color: "black" }}>
                                  submitted a new ticket
                                </span>{" "}
                                “Proin a iaculis tortor, in pretium justo. Sed
                                quam eros, lobortis eget sagittis eu, vel
                                pharetra. “
                              </Typography>
                            </Div>
                          </Stack>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#FF3939",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            RK
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Roshan Khan{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Phasellus a elit imperdiet, euismod dui ac,
                            placerat ante. Cras at enim et ipsum rhoncus. “
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#424651",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            YS
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Yuvaraj Singh{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Fusce elementum efficitur cursus. Ut lacinia, ipsum
                            vitae hendrerit ullamcorper, ligula amet nec felis.
                            “
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#750075",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            KK
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Kavin Kumar{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Phasellus arcu lectus, aliquet vel tristique in,
                            hendrerit id dui. Sed a viverra quam. vestibulum
                            laoreet vel in velit. “
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#FFA500",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            AJ
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Amy Janette{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Duis interdum odio odio, eget rutrum sapien tempus
                            eu. Curabitur lectus orci “
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#104210",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            GH
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Gill Hamper{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Duis imperdiet feugiat risus, at congue turpis
                            varius et. Aliquam malesuada, ipsum “
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#FD7F20",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            PR
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Prakash Raj{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Sed ultricies, nulla quis rutrum consequat, metus
                            mauris viverra augue, sit amet“
                          </Typography>
                        </Div>
                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "#2B96D2",
                              width: "30px",
                              height: "30px",
                              fontSize: "14px",
                            }}
                          >
                            PR
                          </Avatar>
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{
                              paddingLeft: "8px",
                              m: 0,
                              color: "#304995",
                              fontSize: "12px",
                            }}
                          >
                            Praveen Raj{" "}
                            <span style={{ color: "black" }}>
                              submitted a new ticket
                            </span>{" "}
                            “Aenean arcu sem, ultrices id condimentum et,
                            fermentum at mi. Nulla varius volutpat”
                          </Typography>
                        </Div>
                      </Stack>
                    </Div>
                  </JumboScrollbar>
                </Div>
              </Card>
            </Grid>

            {/* To-Dos */}
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: "10px",
                  padding: "15px",
                  pb: 0,
                }}
              >
                <Div sx={{ borderBottom: "1px solid lightgray", pb: 2, pt: 1 }}>
                  <Typography
                    color="neutral"
                    level="h2"
                    noWrap={false}
                    variant="plain"
                    sx={{ fontSize: "18px", fontWeight: 700 }}
                  >
                    To-Dos
                  </Typography>
                </Div>
                <Div sx={{ mt: 2 }}>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHeightMin={460}
                    autoHideTimeOut={4000}
                  >
                    <Div>
                      <Stack direction={"column"} spacing={3}>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                        <Stack
                          direction={"row"}
                          spacing={3}
                          alignContent={"center"}
                        >
                          <CheckBoxOutlineBlankIcon sx={{ width: "11px" }} />
                          <Typography
                            sx={{ fontSize: "14px" }}
                            sx={{ m: 0, color: "black", fontSize: "12px" }}
                          >
                            Cras condimentum nisl purus imperdiet, in elementum
                            arcu sagittis. Quisque iaculis sem.
                          </Typography>
                        </Stack>
                      </Stack>
                    </Div>
                  </JumboScrollbar>
                </Div>
              </Card>
            </Grid>
          </Grid>

          {/* dialog module */}
          <Dialog
            open={openAddContact}
            onClose={() => setOpenCreateAccount(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {/* <DialogTitle
        align='center'
          id="alert-dialog-title"
          sx={{ fontSize: "18px" }}
        >
          ADD TO DO
          <IconButton
                sx={{ float: "right" }}
                onClick={() => setOpenCreateAccount(false)}
              ><CancelOutlined />
              </IconButton>
        </DialogTitle> */}
            <DialogContent>
              <Typography
                align="center"
                id="alert-dialog-title"
                sx={{
                  fontSize: "18px",
                  color: "black",
                  fontWeight: 500,
                  ml: 6,
                }}
              >
                Add To Do
                <IconButton
                  sx={{ float: "right" }}
                  onClick={() => setOpenCreateAccount(false)}
                >
                  <CancelOutlined />
                </IconButton>
              </Typography>
              <Card sx={{ width: "452px", height: "190px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      className="col-sm-12 input-box"
                      id="outlined-basic"
                      placeholder="Date"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarMonthIcon sx={{ color: "red" }} />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      className="col-sm-12 input-box"
                      id="outlined-basic"
                      placeholder="From Time"
                      InputProps={{}}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ pt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-basic"
                      placeholder="Enter Add To Do"
                      multiline
                      rows={6}
                      sx={{ width: 450 }}
                      InputProps={{
                        sx: { borderRadius: 8 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <BorderColorIcon
                              sx={{
                                color: "#6C63FF",
                                position: "relative",
                                bottom: 30,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Card>
              <Grid container align="center" spacing={2}>
                <Grid item align="center" xs={12}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: "#1E90FF",
                      paddingRight: "9px",
                      borderRadius: "8px",
                      "&:hover": { color: "#FFFFFF", bgcolor: "#008000" },
                    }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Stack>
      </JumboContentLayoutMain>
    </>
  );
};

export default SummaryRightSideCardList;
