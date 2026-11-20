import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import Div from "@jumbo/shared/Div";
import { ComponentHeading, DisplayFlex } from "app/pages/widgets/CRMStyles";
import ColumnBarChart from "../Bars/ColumnBarChart";
import { FaMinusCircle } from "react-icons/fa";

function CallTargetActivity({ datas, selectDial }) {
  const counts = ["Others", "Account", "Deal"]
  const minutes = ["OthersMin", "AccountMin", "DealMin"]
  

  return (
    <>
      <Grid item xs={12} mt={1.5}>
        <Div
          className="card"
          sx={[
            {
              minHeight: { md: "215px" },
              p: 1,
              boxShadow: "0px 0px 4px lightgray",
              border: "1px solid white",
            },
          ]}
        >
          <Div sx={[DisplayFlex, { flexWrap: "wrap", gap: "10px !important" }]}>
            <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
              DIAL ON TARGET DETAIL
            </Typography>
            <FormControl
              sx={{
                "& fieldset": {
                  borderRadius: "5px",
                },
              }}
            >
              <Autocomplete
                // {...register('bookingType',)}
                className="search-select"
                sx={{ minWidth: "150px", fontSize: "11px !important" }}
                autocomplete="off"
                options={[{ label: "10 Reps Selected" }]}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.label) {
                    return option?.label;
                  }
                }}
                defaultValue="10 Reps Selected"
                // onChange={(e, newValue) => {
                //     setSelectUsers(newValue?.label)
                // }}
                renderInput={(params) => (
                  <TextField {...params} sx={{ fontSize: "11px !important" }} />
                )}
              />
            </FormControl>
          </Div>

          <Div sx={{ mt: 2 }}>
            <ColumnBarChart
              color={["#004e98", "#fca311", "#75c9c8"]}
              barData={datas?.DialTargetDetails || []}
              barType="stackedbar"
              barLength={selectDial == 1? counts: minutes}
              label="date"
              customLegendName={[
                "Other Dials",
                "Account Dials",
                "Prospect Dials",
              ]}
              height={260}
              barWidth={60}
            />
            <Div sx={[DisplayFlex, { justifyContent: "center", my: 1 }]}>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#75c9c8",
                    position: "absolute",
                    left: -12,
                    top: "25%",
                  }}
                />{" "}
                Prospect Dials
              </Typography>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                  mx: 3,
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#fca311",
                    position: "absolute",
                    left: -12,
                    top: "25%",
                  }}
                />{" "}
                Account Dials
              </Typography>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 400,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#004e98",
                    position: "absolute",
                    left: -12,
                    top: "25%",
                  }}
                />{" "}
                Other Dials
              </Typography>
            </Div>
          </Div>
        </Div>
      </Grid>

      <Grid item xs={12} mt={1.5}>
        <Div
          className="card"
          sx={[
            {
              minHeight: { md: "280px" },
              p: 1,
              boxShadow: "0px 0px 4px lightgray",
              border: "1px solid white",
            },
          ]}
        >
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={6} md={4} mt={1.5}>
              <Div
                sx={[DisplayFlex, { flexWrap: "wrap", gap: "10px !important" }]}
              >
                <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
                  By Role
                </Typography>
                <FormControl
                  sx={{
                    "& fieldset": {
                      borderRadius: "5px",
                    },
                    width: "70%",
                    minWidth: "100px",
                    fontSize: "11px !important",
                  }}
                >
                  <Autocomplete
                    className="search-select"
                    sx={{
                      width: "100%",
                      minWidth: "100px",
                      fontSize: "11px !important",
                    }}
                    autocomplete="off"
                    options={[{ label: "AM, BDR" }]}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.label) {
                        return option?.label;
                      }
                    }}
                    defaultValue="select Role"
                    // value={selectUser}
                    // onChange={(e, newValue) => {
                    //     setSelectUsers(newValue?.label)
                    // }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ fontSize: "11px !important" }}
                      />
                    )}
                  />
                </FormControl>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Prospect Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Account Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Other Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>

            <Grid item xs={6} md={4} mt={1.5}>
              <Div
                sx={[DisplayFlex, { flexWrap: "wrap", gap: "10px !important" }]}
              >
                <Typography sx={{ mb: 1, fontSize: "13px", fontWeight: 600 }}>
                  By Rep
                </Typography>
                <FormControl
                  sx={{
                    "& fieldset": {
                      borderRadius: "5px",
                    },
                    width: "70%",
                    minWidth: "100px",
                    fontSize: "11px !important",
                  }}
                >
                  <Autocomplete
                    className="search-select"
                    sx={{
                      width: "100%",
                      minWidth: "100px",
                      fontSize: "11px !important",
                    }}
                    autocomplete="off"
                    options={[{ label: "AM, BDR" }]}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.label) {
                        return option?.label;
                      }
                    }}
                    defaultValue="None Selected"
                    // value={selectUser}
                    // onChange={(e, newValue) => {
                    //     setSelectUsers(newValue?.label)
                    // }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ fontSize: "11px !important" }}
                      />
                    )}
                  />
                </FormControl>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Prospect Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Account Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>

            <Grid item xs={12} md={2.6} mt={1.5}>
              <Div
                className="card "
                sx={{
                  p: 1,
                  bgcolor: "#fca311",
                  border: "0px solid lightgray",
                  borderRadius: "5px !important",
                }}
              >
                <Div
                  sx={[
                    {
                      display: "flex !important",
                      justifyContent: { xs: "space-around", md: "center" },
                      alignItems: "center",
                      width: { xs: "100%", md: "140px" },
                    },
                  ]}
                >
                  <Div>
                    <Typography
                      sx={{
                        mb: 0.5,
                        color: "white",
                        fontSize: "23px",
                        textAlign: "center",
                        fontWeight: 600,
                      }}
                    >
                      34.2
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "white",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      Avg Other Dials Per Day
                    </Typography>
                  </Div>
                  <FaMinusCircle style={{ color: "white", fontSize: "80px" }} />
                </Div>
              </Div>
            </Grid>
          </Grid>
        </Div>
      </Grid>
    </>
  );
}

export default memo(CallTargetActivity);
