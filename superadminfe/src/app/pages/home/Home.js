import React, { useEffect, useState } from "react";
import "./Home.css";
import Div from "@jumbo/shared/Div";
import { Card, Grid, Table, TableHead, Typography } from "@mui/material";
import HomeLineChart from "./salesCharts/HomeLineChart";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  CRMTableHead,
  ChartHeight,
  DisplayFlex,
  FontStyle,
  colorCode,
  dialogTitle,
} from "../widgets/CRMStyles";
import RadialBarChat from "./salesCharts/RadialBarChat";
import TeamChart from "./salesCharts/TeamChart";
import PyramidHomeChart from "./salesCharts/PyramidHomeChart";
import { TableBody, alpha } from "@material-ui/core";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { IoMdContacts } from "react-icons/io";
import { SiGoogleads } from "react-icons/si";
import { FaIdeal } from "react-icons/fa";
import DonutChart from "./salesCharts/DonutChart";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";

const Home = () => {
  const [activities, setActivities] = useState({});
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const [counts, setCounts] = useState({ leads: 0, deals: 0, contacts: 0 });

  const requestOption = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // my activities get data
  const myActivities = async () => {
    await axios
      .post(`${BASE_URL}/user/Dealdashboard/`, {}, requestOption)
      .then((res) => {
        if (Object.keys(res.data).length > 0) {
          console.log("Activies results : ", res?.data);

          setActivities(res.data);
        } else {
          console.log("Activies results no found : ", res?.data);
        }
      })
      .catch((err) => {
        // console.log("err", err);
      });
  };

  const getQualifiedData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/UserQualifiedLeadsAdditional/?Is_Deleted=False&Created_By=${localStorage.getItem(
          "UserId"
        )}&page=${1}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Lead", response.data);
      setCounts({ ...counts, leads: response?.data?.count });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const getDeals = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/DealAdditional/?Is_Deleted=False`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Deal", response.data);
      setCounts({ ...counts, deals: response?.data?.count });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const getContacts = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/ContactAllAdditional/?page=${1}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Account", response.data);
      setCounts({ ...counts, contacts: response?.data?.count });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Get Lead and Deal and Contact Count for Year

  const getModuleCount1 = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/Homedash/`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("response contact", response.data);
      setCounts({
        ...counts,
        contacts: response?.data?.Contact,
        leads: response?.data?.Lead,
        deals: response?.data?.Deal,
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const [datas, setDatas] = useState([]);

  const listRecords = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/TaskCalendarAdditional/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        }
      );
      setDatas(response?.data || []);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    myActivities();
    listRecords();
    // getQualifiedData();
    // getDeals()
    // getContacts()
    getModuleCount1();
  }, []);

  console.log("datas", datas);

  return (
    <JumboContentLayoutMain>
      <Div>
        <Div>
          <Typography id="Typography-root" sx={[dialogTitle, { mb: 1 }]}>
            Lead Overview (Current Year)
          </Typography>
          <RadialBarChat />
        </Div>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Sales
              </Typography>
              <HomeLineChart />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Sales Achieved
              </Typography>
              <TeamChart />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Orders
              </Typography>
              <DonutChart />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Div id="card" style={{ height: "420px" }}>
              <Typography
                id="Typography-root"
                sx={[
                  dialogTitle,
                  {
                    backgroundColor: "transparent !important",
                    mb: 1,
                    textAlign: "center",
                  },
                ]}
              >
                Deal Pipeline (Current Year)
              </Typography>
              <PyramidHomeChart />
            </Div>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <Div id="card">
              <Typography id="Typography-root" sx={[dialogTitle, { mb: 1 }]}>
                To do List
              </Typography>
              <div className="container">
                <div className="row">
                  <div class="">
                    <div class="card-body pt-0" id="card-body">
                      <div class="table-responsive">
                        <table class="table mb-0">
                          <thead
                            class="table-light"
                            id="table-light"
                            style={{
                              backgroundColor: "#e4f1ff !important",
                              color: "#03162a",
                            }}
                          >
                            <CRMTableRow
                              sx={{ backgroundColor: "#f5ee9e !important" }}
                            >
                              <CRMTableCell
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "medium !important",
                                  fontWeight: "600 !important",
                                }}
                              >
                                Task Name
                              </CRMTableCell>
                              <CRMTableCell
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "medium !important",
                                  fontWeight: "600 !important",
                                }}
                              >
                                Task Type
                              </CRMTableCell>
                              <CRMTableCell
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "medium !important",
                                  fontWeight: "600 !important",
                                }}
                              >
                                Deadline Date
                              </CRMTableCell>
                              <CRMTableCell
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "medium !important",
                                  fontWeight: "600 !important",
                                }}
                              >
                                Asinged By
                              </CRMTableCell>
                              <CRMTableCell
                                sx={{
                                  cursor: "pointer",
                                  fontSize: "medium !important",
                                  fontWeight: "600 !important",
                                }}
                              >
                                Status
                              </CRMTableCell>
                            </CRMTableRow>
                          </thead>
                          <tbody>
                            {datas &&
                              datas?.map((data, index) => {
                                // console.log("data : ", data);
                                return (
                                  <CRMTableRow>
                                    <CRMTableCell data-title="Task Id">
                                      {" "}
                                      {data?.Task_Name}
                                    </CRMTableCell>

                                    <CRMTableCell data-title="Task Type">
                                      {data?.Task_Type}
                                    </CRMTableCell>
                                    <CRMTableCell data-title="Task Name">
                                      {data?.Deadline_Date}
                                    </CRMTableCell>
                                    <CRMTableCell data-title="Asigned By">
                                      {data?.Assign_To?.first_name}
                                    </CRMTableCell>
                                    <CRMTableCell data-title="Status">
                                      {data?.Status}
                                    </CRMTableCell>
                                  </CRMTableRow>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Div>
          </Grid>

          {/* <Grid spacing={2} item xs={12} sm={12} md={4} lg={4}>
            <Div
              sx={{
                border: "1px solid lightgray",
                borderRadius: "10px",
                height:ChartHeight,
                py: 2.2,
                px: 2,
              }}
            >
              <Grid
                sx={{ my: { xs: 0.7, md: 1.3 } }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Div>
                  <Card
                    align="center"
                    sx={[
                      DisplayFlex,
                      colorCode.bgBPink,
                      {
                        // boxShadow: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "5px",
                        height: "100px",
                        width: "100%",
                        //
                        border: "1px solid lightgray",
                        p: 0.3,
                      },
                    ]}
                  >
                    <Typography  id='Typography-root'
                      align="center"
                      sx={[
                        DisplayFlex,
                        {
                          width: "8vw",
                          minWidth: "80px",
                          height: "100%",
                          bgcolor: alpha("#f9f9f9", 0.7),
                          borderRadius: 2,
                          align: "center",
                          justifyContent: "center",
                          gap: 3,
                        },
                      ]}
                    >
                      <Div>
                        <Typography  id='Typography-root' align="center">
                          <SiGoogleads style={{ fontSize: 22 }} />
                        </Typography>
                      </Div>
                    </Typography>

                    <Div sx={[]}>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={{
                          color: "#FFFF",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {counts?.leads || 0}
                      </Typography>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={[FontStyle, { color: "#FFFF" }]}
                      >
                        No of Leads
                      </Typography>
                    </Div>
                    <Div></Div>
                  </Card>
                </Div>
              </Grid>
              <Grid
                sx={{ my: { xs: 1, md: 2.7 } }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Div>
                  <Card
                    align="center"
                    sx={[
                      DisplayFlex,
                      colorCode?.bgBPurple,
                      {
                        // boxShadow: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "5px",
                        height: "100px",
                        width: "100%",

                        border: "1px solid lightgray",
                        p: 0.3,
                      },
                    ]}
                  >
                    <Typography  id='Typography-root'
                      align="center"
                      sx={[
                        DisplayFlex,
                        {
                          width: "8vw",
                          minWidth: "80px",
                          height: "100%",
                          bgcolor: alpha("#f9f9f9", 0.7),
                          borderRadius: 2,
                          align: "center",
                          justifyContent: "center",
                          gap: 3,
                        },
                      ]}
                    >
                      <Div>
                        <FaIdeal style={{ fontSize: 22 }} />
                      </Div>
                    </Typography>

                    <Div sx={[]}>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={{
                          color: "#FFFF",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {counts?.deals || 0}
                      </Typography>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={[FontStyle, { color: "#FFFF" }]}
                      >
                        No of Deals
                      </Typography>
                    </Div>
                    <Div></Div>
                  </Card>
                </Div>
              </Grid>
              <Grid
                sx={{ my: { xs: 0.7, md: 1.3 } }}
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Div>
                  <Card
                    align="center"
                    sx={[
                      DisplayFlex,
                      colorCode?.bgBCyan,

                      {
                        // boxShadow: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: "5px",
                        height: "100px",
                        width: "100%",

                        border: "1px solid lightgray",
                        p: 0.3,
                      },
                    ]}
                  >
                    <Typography  id='Typography-root'
                      align="center"
                      sx={[
                        DisplayFlex,
                        {
                          width: "8vw",
                          minWidth: "80px",
                          height: "100%",
                          bgcolor: alpha("#f9f9f9", 0.7),
                          borderRadius: 2,
                          align: "center",
                          justifyContent: "center",
                          gap: 3,
                        },
                      ]}
                    >
                      <Div>
                        <Typography  id='Typography-root' align="center">
                          <IoMdContacts style={{ fontSize: 22 }} />
                        </Typography>
                      </Div>
                    </Typography>

                    <Div sx={[]}>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={{
                          color: "#FFFF",
                          fontSize: "20px",
                          fontWeight: "bold",
                        }}
                      >
                        {counts?.contacts || 0}
                      </Typography>
                      <Typography  id='Typography-root'
                        align="center"
                        sx={[FontStyle, { color: "#FFFF" }]}
                      >
                        No of Contacts
                      </Typography>
                    </Div>
                    <Div></Div>
                  </Card>
                </Div>
              </Grid>
            </Div>
          </Grid> */}
        </Grid>
      </Div>
    </JumboContentLayoutMain>
  );
};
export default Home;
