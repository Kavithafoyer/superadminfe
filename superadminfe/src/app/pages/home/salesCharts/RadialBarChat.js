import Div from "@jumbo/shared/Div";
import { Grid, Typography } from "@mui/material";
import {
  DisplayFlex,
  avatarColors,
  avatarLightColors,
  cardHeight,
} from "app/pages/widgets/CRMStyles";
import Counter from "app/pages/widgets/StylesComponents";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { Label } from "devextreme-react/cjs/funnel";
import React, { useEffect, useState } from "react";
import { BsBrowserEdge } from "react-icons/bs";
import { HiDocumentSearch } from "react-icons/hi";
import { IoIosContact } from "react-icons/io";
import { MdCampaign } from "react-icons/md";
import { TiSocialTwitter } from "react-icons/ti";

const values = [
  {
    value: 0,
    label: "LEAD'S FROM CONTACT",
    style: {
      backgroundColor: "rgba(78, 202, 194, 0.28)",
      // color: "rgba(78, 202, 194, 1)",
      padding: 15,
    },
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        color="rgb(40, 153, 145)"
        fill="currentColor"
        class="bi bi-person-lines-fill"
        viewBox="0 0 16 16"
      >
        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
      </svg>
    ),
  },
  {
    value: 0,
    label: "LEAD'S SOCIAL MEDIA",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        color="rgb(28, 132, 238)"
        fill="currentColor"
        class="bi bi-twitter"
        viewBox="0 0 16 16"
      >
        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
      </svg>
    ),
    style: { backgroundColor: "#c0e3ed", color: "#1c84ee", padding: 15 },
  },
  {
    value: 0,
    label: "LEAD'S FROM CAMPAIGN",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        color="rgb(34, 197, 94)"
        fill="currentColor"
        class="bi bi-megaphone"
        viewBox="0 0 16 16"
      >
        <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
      </svg>
    ),
    style: { backgroundColor: "#d3f3df", color: "#148f41", padding: 15 },
  },
  {
    value: 0,
    label: "LEAD'S FROM ENQUIRY",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="27"
        height="27"
        color="rgb(249, 185, 49)"
        fill="currentColor"
        class="bi bi-chat-left-quote"
        viewBox="0 0 16 16"
      >
        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
        <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
      </svg>
    ),
    style: { backgroundColor: "#fef1d6", color: "#a97f25", padding: 15 },
  },
];

const RadialBarChat = () => {
  const [chartData, setChartData] = useState({
    series: [0, 0, 0, 0, 0],
    options: {
      chart: {
        height: 270,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 2,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["Contact", "Social Media", "Campaign", "Enquiry"],

      legend: {
        show: true,
        floating: true,
        fontSize: "11px",
        position: "left",
        offsetX: 100,
        offsetY: 15,
        // marginLeft: 0,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          vertical: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              // show: false,
              offsetX: 150,
              offsetY: 25,
              // marginTop:10
            },
          },
        },
      ],
    },
  });
  const [datas, setDatas] = useState(values);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const requestOption = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const leadbysourceEnquiry = async (datass) => {
    try {
      await axios
        .get(`${BASE_URL}/user/LeadbysourceEnquiry/`, requestOption)
        .then((res) => {
          let data = { ...datass };
          if (Object.keys(res.data).length > 0) {
            data.leadbysourceEnquiry = res.data?.Lead_by_Enquiry_ForYear;
          } else {
            console.log("team view results no found : ", res?.data);
          }
          console.log("leadbysource : ", data);
          setChartData({ ...chartData, series: Object?.values(data) });

          const leadStatisticsArray = Object.entries(data)?.map(
            ([source, count]) => ({
              label: source.replace("leadbysource", ""),
              value: count,
            })
          );

          // Update the datas state with the new values
          setDatas((prevDatas) =>
            prevDatas?.map((dat) => {
              // Find the corresponding leadStat in the leadStatisticsArray
              const leadStat = leadStatisticsArray.find((lead) => {
                const isMatch = dat.label
                  ?.toLocaleLowerCase()
                  ?.split(" ")
                  ?.includes(lead.label?.toLocaleLowerCase());
                return isMatch;
              });

              console.log("Found leadStat", leadStat);

              return leadStat
                ? {
                    ...dat,
                    value: (dat?.value || 0) + (leadStat?.value || 0),
                  }
                : dat;
            })
          );
        });
    } catch (error) {
      console.error(error.message);
    }
  };
  const leadbysourceCampaign = async (datass) => {
    try {
      await axios
        .get(`${BASE_URL}/user/LeadbysourceCampaign/`, requestOption)
        .then((res) => {
          let data = { ...datass };
          if (Object.keys(res.data).length > 0) {
            // console.log("leadbysource : ",res.data)
            data.leadbysourceCampaign = res.data?.Lead_by_Campaign_ForYear;
          } else {
            console.log("team view results no found : ", res?.data);
          }

          leadbysourceEnquiry(data);
        });
    } catch (error) {
      console.error(error.message);
    }
  };
  const leadbysourceSocial = async (datass) => {
    try {
      await axios
        .get(`${BASE_URL}/user/LeadbysourceSocial/`, requestOption)
        .then((res) => {
          let data = { ...datass };
          if (Object.keys(res.data).length > 0) {
            // console.log("leadbysource : ",res.data)
            data.leadbysourceSocial = res.data?.Lead_by_SocialMedia_ForYear;
          } else {
            console.log("team view results no found : ", res?.data);
          }

          leadbysourceCampaign(data);
        });
    } catch (error) {
      console.error(error.message);
    }
  };
  const leadbysourceWeb = async (datass) => {
    try {
      await axios
        .get(`${BASE_URL}/user/LeadbysourceWeb/`, requestOption)
        .then((res) => {
          let data = { ...datass };
          if (Object.keys(res.data).length > 0) {
            // console.log("leadbysource : ",res.data)
            data.leadbysourceWeb = res.data?.Lead_by_Web_ForYear;
          } else {
            console.log("team view results no found : ", res?.data);
          }

          leadbysourceSocial(data);
        });
    } catch (error) {
      console.error(error.message);
    }
  };
  const leadbysourceContact = async () => {
    try {
      await axios
        .get(`${BASE_URL}/user/LeadbysourceContact/`, requestOption)
        .then((res) => {
          let data = {};
          if (Object.keys(res.data).length > 0) {
            data.leadbysourceContact = res.data?.Lead_by_Contact_ForYear;
          } else {
            console.log("team view results no found : ", res?.data);
          }
          leadbysourceWeb(data);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    leadbysourceContact();
  }, []);

  return (
    <>
      {/*
        <Grid container spacing={4} xs={12} sm={12}>
        {datas?.map((item, idx) => {
          return (
            <Grid key={idx} item xs={6} md={3}>
              <Div
                sx={{
                  borderRadius: "10px",
                  p: 3,
                  backgroundColor: avatarColors[idx],
                  height: cardHeight,
                  boxSizing: "border-box !important",
                }}
              >
                <Div sx={[DisplayFlex, { gap: "10px" }]}>
                  <Div
                    sx={[
                      DisplayFlex,
                      {
                        justifyContent: "center",
                        height: "60px",
                        width: "90px",
                        borderRight: "1px solid lightgray",
                        // backgroundColor: avatarLightColors[idx],
                      },
                    ]}
                  >
                    {item?.label === "Contact" && (
                      <IoIosContact style={{ color: "white", fontSize: 35 }} />
                    )}
                    {item?.label === "Social" && (
                      <TiSocialTwitter
                        style={{ color: "white", fontSize: 35 }}
                      />
                    )}
                    {item?.label === "Campaign" && (
                      <MdCampaign style={{ color: "white", fontSize: 35 }} />
                    )}
                    {item?.label === "Enquiry" && (
                      <HiDocumentSearch
                        style={{ color: "white", fontSize: 30 }}
                      />
                    )}
                  </Div>
                  <Div sx={{ width: "70%" }}>
                    <Typography id='Typography-root'
                      sx={{
                        color: "whitesmoke",
                        fontWeight: 600,
                        textAlign: "center",
                        fontSize: "36px",
                      }}
                    >
                      <Counter maximum={item?.value} speed={50} />
                    </Typography> 
                    <Typography id='Typography-root'
                      sx={[
                        {
                          fontSize: "12px",
                          textAlign: "center",
                          color: "whitesmoke",
                          fontWeight: 600,
                        },
                      ]}
                    >
                      {item?.label === "Social" ? ("Leads From " + item?.label + " Media").toUpperCase() : ("Leads From " + item?.label).toUpperCase()}

                    </Typography>
                  </Div>
                </Div>
              </Div>
            </Grid>
          );
        })}
      </Grid>
    */}

      <div className="">
        <div class="home-row row ">
          {datas?.length > 0 &&
            datas?.map((data, idx) => {
              return (
                <div key={idx} class="home-colspan">
                  <div class="card td" id="card">
                    <div class="card-body">
                      <div class="d-flex align-items-center justify-content-between">
                        <div className="left text-left">
                          <h3 class=" fw-bold mb-1">{data?.value}</h3>
                          <p
                            class="text-muted"
                            style={{
                              fontWeight: "600",
                              color: "#96a0b5 !important",
                            }}
                          >
                            {data?.label}
                          </p>
                          {/* <label
                            class="badge fs-12 badge-soft-success"
                            style={{
                              ...data?.style,
                              fontSize: "12px !important",
                              padding: "0px !important",
                            }}
                          >
                            <i class="ti ti-arrow-badge-up"></i>
                            8.72%
                          </label> */}
                        </div>
                        <div>
                          <div
                            class="avatar-lg d-inline-block me-1 rounded-circle"
                            style={data?.style && data?.style}
                          >
                            <span class="avatar-title bg-info-subtle text-info rounded-circle">
                              {data?.icon}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          {/* <div class="home-colspan">
            <div class="card td" id="card">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <div className="left text-left">
                    <h3 class="mb-0 fw-bold mb-1">4</h3>
                    <p class="text-muted" style={{ fontWeight: "600" }}>
                      LEAD'S FROM CONTACT
                    </p>
                    <span class="badge fs-12 badge-soft-success">
                      <i class="ti ti-arrow-badge-up"></i>
                      8.72%
                    </span>
                  </div>
                  <div>
                    <div
                      class="avatar-lg d-inline-block me-1 rounded-circle"
                      style={{ backgroundColor: "#4ecac247", padding: "15px" }}
                    >
                      <span class="avatar-title bg-info-subtle text-info rounded-circle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
                          color="rgb(40, 153, 145)"
                          fill="currentColor"
                          class="bi bi-person-lines-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class=" home-colspan">
            <div class="card td" id="card">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <div className="left text-left">
                    <h3 class="mb-0 fw-bold mb-1">$75.09k</h3>
                    <p class="text-muted" style={{ fontWeight: "600" }}>
                      LEAD'S SOCIAL MEDIA
                    </p>
                    <span
                      class="badge fs-12 badge-soft-success"
                      style={{ backgroundColor: "#c0e3ed", color: "#1c84ee" }}
                    >
                      <i class="ti ti-arrow-badge-up"></i>
                      7.36%
                    </span>
                  </div>
                  <div>
                    <div
                      class="avatar-lg d-inline-block me-1 rounded-circle"
                      style={{ backgroundColor: "#d2e6fc", padding: "15px" }}
                    >
                      <span class="avatar-title bg-primary-subtle text-primary rounded-circle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
                          color="rgb(28, 132, 238)"
                          fill="currentColor"
                          class="bi bi-twitter"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class=" home-colspan">
            <div class="card td" id="card">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <div className="left text-left">
                    <h3 class="mb-0 fw-bold mb-1">$62.8k</h3>
                    <p class="text-muted" style={{ fontWeight: "600" }}>
                      LEAD'S FROM CAMPAIGN
                    </p>
                    <span
                      class="badge fs-12 badge-soft-danger mt-1"
                      style={{ backgroundColor: "#d3f3df", color: "#148f41" }}
                    >
                      <i class="ti ti-arrow-badge-up"></i>
                      5.62%
                    </span>
                  </div>
                  <div>
                    <div
                      class="avatar-lg d-inline-block me-1 rounded-circle"
                      style={{ padding: "15px" }}
                    >
                      <span class="avatar-title bg-success-subtle text-success rounded-circle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
                          color="rgb(34, 197, 94)"
                          fill="currentColor"
                          class="bi bi-megaphone"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class=" home-colspan">
            <div class="card td" id="card">
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <div className="left text-left">
                    <h3 class="mb-0 fw-bold mb-1">$6.4k</h3>
                    <p class="text-muted" style={{ fontWeight: "600" }}>
                      LEAD'S FROM ENQUIRY
                    </p>
                    <span
                      class="badge fs-12"
                      style={{ backgroundColor: "#fef1d6", color: "#a97f25" }}
                    >
                      <i class="ti ti-arrow-badge-up"></i>
                      2.53%
                    </span>
                  </div>
                  <div>
                    <div
                      class="avatar-lg d-inline-block me-1 rounded-circle"
                      style={{ backgroundColor: "#fef1d6", padding: "15px" }}
                    >
                      <span class="avatar-title bg-warning-subtle text-warning rounded-circle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27"
                          height="27"
                          color="rgb(249, 185, 49)"
                          fill="currentColor"
                          class="bi bi-chat-left-quote"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                          <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* <Div sx={{ width: { md: "35vw", lg: "36vw" }, height: { xs: "330px", md: "100%" }, borderRadius: "3px" }} id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="radialBar"
        height={270}
        />
    </Div> */}
    </>
  );
};

export default RadialBarChat;
