import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Avatar,
  Grid,
  Table,
  TableBody,
  Typography,
  useMediaQuery,
  CardHeader,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AvatarFont,
  Colors,
  ComponentHeading,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  Rupee,
  avatarLightColors,
} from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import Bullet, { Tooltip } from "devextreme-react/bullet";
import { ProgressBarLine } from "react-progressbar-line";
import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/cjs/data-grid";
import ColumnBarChart from "./Bars/ColumnBarChart";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import CustomTableHeader from "../widgets/CustomTableHeader";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";

const customizeTooltip = (data) => ({
  text: `${parseInt(data.value, 10)}`,
});

function CustomerRententionDashboard() {
  const matches = useMediaQuery("(min-width:600px)", { noSsr: true });

  const [datas, setDatas] = useState([]);
  const [cancelAccounts, setCancelAccounts] = useState([]);
  const [newAccounts, setNewAccounts] = useState([]);

  const [columnMenuItems, setColumnMenuItems] = useState([
    {
      sort: "Contact_Name",
      label: matches ? "Account Name" : "Name",
      bool: true,
    },
    { sort: "Created_Date", label: "Date", bool: true },
    { sort: "Employees", label: "Employees", bool: true },
    { sort: "Turn_Over", label: "Turn Over", bool: true },
  ]);

  const token = localStorage.getItem("accesstoken");
  const DBName = "crmuseradmin1";
  const getDatas = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/AnalysticCustomerRententionDashboard/?Is_Deleted=False&id=${1}`,
        {
          headers: {
            db: DBName,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("lists23", response.data?.CancelAccounts);
      setNewAccounts(response.data?.NewAccounts);
      setCancelAccounts(response.data?.CancelAccounts);
      setDatas(response.data || []);
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const customers = [
    {
      ID: 1,
      CompanyName: "Super Mart of the West",
      Address: "Street",
      City: "02/02-2024",
      State: "1",
      Zipcode: 72716,
      Phone: "1.2",
      Fax: "(800) 555-2171",
    },
    {
      ID: 2,
      CompanyName: "Electronics Depot",
      Address: " Road NW",
      City: "02/02-2024",
      State: "2",
      Zipcode: 30339,
      Phone: "1.2",
      Fax: "(800) 595-3231",
    },
    {
      ID: 3,
      CompanyName: "K&S Music",
      Address: " Mall",
      City: "02/02-2024",
      State: "7",
      Zipcode: 55403,
      Phone: "1.2",
      Fax: "(612) 304-6074",
    },
    {
      ID: 4,
      CompanyName: "Tom's Club",
      Address: " Drive",
      City: "02/02-2024",
      State: "34",
      Zipcode: 98027,
      Phone: "1.2",
      Fax: "(800) 955-2293",
    },
    {
      ID: 5,
      CompanyName: "E-Mart",
      Address: "Beverly Rd",
      City: "02/02-2024",
      State: "2",
      Zipcode: 60179,
      Phone: "1.2",
      Fax: "(847) 286-2501",
    },
    {
      ID: 6,
      CompanyName: "Walters",
      Address: "Wilmot Rd",
      City: "02/02-2024",
      State: "3",
      Zipcode: 60015,
      Phone: "1.2",
      Fax: "(847) 940-2501",
    },
    {
      ID: 7,
      CompanyName: "StereoShack",
      Address: " Commerce S",
      City: "02/02-2024",
      State: "3",
      Zipcode: 76102,
      Phone: "3.2",
      Fax: "(817) 820-0742",
    },
    {
      ID: 8,
      CompanyName: "Circuit Town",
      Address: "Kensington Court",
      City: "02/02-2024",
      State: "4",
      Zipcode: 60523,
      Phone: "6.4",
      Fax: "(800) 955-9392",
    },
    {
      ID: 9,
      CompanyName: "Premier Buy",
      Address: "Avenue South",
      City: "02/02-2024",
      State: "9",
      Zipcode: 55423,
      Phone: "4.3",
      Fax: "(612) 291-2001",
    },
    {
      ID: 10,
      CompanyName: "ElectrixMax",
      Address: "Shuman Blvd",
      City: "02/02-2024",
      State: "23",
      Zipcode: 60563,
      Phone: "2.2",
      Fax: "(630) 438-7801",
    },
    {
      ID: 11,
      CompanyName: "Video Emporium",
      Address: "Elm Street",
      City: "02/02-2024",
      State: "3",
      Zipcode: 75270,
      Phone: "8.4",
      Fax: "(214) 854-3001",
    },
    {
      ID: 12,
      CompanyName: "Screen Shop",
      Address: "Lowes Blvd",
      City: "02/02-2024",
      State: "6",
      Zipcode: 28117,
      Phone: "1.1",
      Fax: "(800) 445-6938",
    },
  ];

  const dataSource = [
    { Churn: 230, Expansion: 2305, New: 6605, label: "Partner" },
    { Churn: 110, Expansion: 1105, New: 605, label: "Direct" },
  ];

  const dataSource2 = [
    { Churn: 230, Expansion: 2305, New: -660, label: "Jan" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Feb" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Mar" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Apr" },
    { Churn: 110, Expansion: 1105, New: -605, label: "May" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Jun" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Jul" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Aug" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Sep" },
    { Churn: 110, Expansion: 1105, New: -605, label: "Oct" },
  ];
  const dataSource3 = [
    { Customers: 2340, Churn: 230, Expansion: 2305, New: -660, label: "Jan" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Feb" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Mar" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Apr" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "May" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Jun" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Jul" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Aug" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Sep" },
    { Customers: 1140, Churn: 110, Expansion: 1105, New: -605, label: "Oct" },
  ];

  return (
    <JumboContentLayoutMain>
      <Typography sx={[ComponentHeading, { mb: 2 }]}>
        Customer Rentention Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid container item xs={12} md={3.5} mt={1}>
          <Div
            className="card"
            sx={[
              {
                height: "600px",
                p: 1,
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={[
                DialogHeader,
                { backgroundColor: "transparent !important", mb: 1 },
              ]}
            >
              Net Rentention
            </Typography>
            <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "11px" }]}>
              This Month
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={6} mt={1}>
                <Div>
                  <Typography sx={[{ textAlign: "center" }]}>
                    <IoIosArrowDropupCircle
                      style={{
                        fontSize: 40,
                        color: "#721cb8",
                        textAlign: "center",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 400,
                        color: "#721cb8",
                        fontSize: "11px",
                      },
                    ]}
                  >
                    $ 3.005
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#000",
                        fontSize: "12px",
                      },
                    ]}
                  >
                    Expansion
                  </Typography>
                </Div>
                <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                  <Div>
                    <Bullet
                      className="bullet"
                      startScaleValue={0}
                      endScaleValue={70}
                      width={"100px"}
                      height={"20px"}
                      value={23}
                      target={25}
                      color={["#721cb8"]}
                    >
                      <Tooltip customizeTooltip={customizeTooltip} />
                    </Bullet>
                  </Div>
                </Div>
              </Grid>

              <Grid item xs={6} md={6} mt={1}>
                <Div>
                  <Typography sx={[{ textAlign: "center", pb: 0.7 }]}>
                    <FaPlusCircle
                      style={{
                        fontSize: 35,
                        color: "#07beb8",
                        textAlign: "center",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 400,
                        color: "#07beb8",
                        fontSize: "11px",
                      },
                    ]}
                  >
                    $ 13.005
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#000",
                        fontSize: "12px",
                      },
                    ]}
                  >
                    New
                  </Typography>
                </Div>
                <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                  <Div>
                    <Bullet
                      className="bullet"
                      startScaleValue={0}
                      endScaleValue={70}
                      width={"100px"}
                      height={"20px"}
                      value={23}
                      target={25}
                      color={["#07beb8"]}
                    >
                      <Tooltip customizeTooltip={customizeTooltip} />
                    </Bullet>
                  </Div>
                </Div>
              </Grid>

              <Grid item xs={6} md={6} mt={1}>
                <Div>
                  <Typography sx={[{ textAlign: "center" }]}>
                    <IoMdCloseCircle
                      style={{
                        fontSize: 40,
                        color: "#f72585",
                        textAlign: "center",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 400,
                        color: "#f72585",
                        fontSize: "11px",
                      },
                    ]}
                  >
                    $ -9.005
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#000",
                        fontSize: "12px",
                      },
                    ]}
                  >
                    Churn
                  </Typography>
                </Div>
                <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                  <Div>
                    <Bullet
                      className="bullet"
                      startScaleValue={0}
                      endScaleValue={70}
                      width={"100px"}
                      height={"20px"}
                      value={23}
                      target={25}
                      color={["#f72585"]}
                    >
                      <Tooltip customizeTooltip={customizeTooltip} />
                    </Bullet>
                  </Div>
                </Div>
              </Grid>

              <Grid item xs={6} md={6} mt={1}>
                <Div>
                  <Typography sx={[{ textAlign: "center" }]}>
                    <IoIosArrowDropdownCircle
                      style={{
                        fontSize: 40,
                        color: "#ffc242",
                        textAlign: "center",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 400,
                        color: "#ffc242",
                        fontSize: "11px",
                      },
                    ]}
                  >
                    $ 13
                  </Typography>
                  <Typography
                    sx={[
                      {
                        textAlign: "center",
                        fontWeight: 800,
                        color: "#000",
                        fontSize: "12px",
                      },
                    ]}
                  >
                    Contraction
                  </Typography>
                </Div>
                <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
                  <Div>
                    <Bullet
                      className="bullet"
                      startScaleValue={0}
                      endScaleValue={70}
                      width={"100px"}
                      height={"20px"}
                      value={23}
                      target={25}
                      color={["#ffc242"]}
                    >
                      <Tooltip customizeTooltip={customizeTooltip} />
                    </Bullet>
                  </Div>
                </Div>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Typography
                  sx={[
                    {
                      textAlign: "left",
                      fontWeight: 400,
                      color: "#000",
                      fontSize: "12px",
                    },
                  ]}
                >
                  Net Retention
                </Typography>
                <Div sx={{ mt: 1 }}>
                  <ProgressBarLine
                    value={50}
                    min={0}
                    max={100}
                    strokeWidth={5}
                    trailWidth={5}
                    styles={{
                      path: {
                        stroke: "blue",
                      },
                      trail: {
                        stroke: "lightgrey",
                      },
                      text: {
                        fill: "#404040",
                        textAlign: "center",
                        fontSize: "12px",
                      },
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
          </Div>
        </Grid>

        <Grid container item xs={12} md={8.5} mt={1}>
          <Div
            className="card"
            sx={[
              {
                height: { md: "290px" },
                p: 1,
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            {/* <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Net Rentention</Typography>
                        <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "10px" }]}>This Month</Typography> */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} mt={1}>
                <Typography
                  sx={[
                    DialogHeader,
                    { backgroundColor: "transparent !important", mb: 1 },
                  ]}
                >
                  Cancelled Account
                </Typography>
                <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "10px" }]}>
                  Last 30 Days
                </Typography>
                <Div>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={210}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                  >
                    <Table stickyHeader className="table" sx={{ minWidth: { xs: "auto", sm: 600 } }}>
                      <CustomTableHeader
                        headerMenuItems={columnMenuItems}
                        setHeadermenuItems={setColumnMenuItems}
                        setDatas={setCancelAccounts}
                        sortDatas={cancelAccounts}
                        showGear={false}
                      />
                      <TableBody className="table-body" sx={{ mt: 2 }}>
                        {cancelAccounts ? (
                          cancelAccounts?.map((data, index) => {
                            // console.log("data : ", data);
                            let stage = data?.Deal_Stage?.split(" ")[1];
                            let color =
                              stage == "Qualifying"
                                ? {
                                    color: Colors?.green,
                                    bgcolor: Colors?.lightgreen,
                                  }
                                : stage == "Enquiry"
                                ? {
                                    color: Colors?.indigo,
                                    bgcolor: Colors?.lightindigo,
                                  }
                                : stage == "Lost"
                                ? {
                                    color: Colors?.red,
                                    bgcolor: Colors?.lightred,
                                  }
                                : stage == "Demo"
                                ? {
                                    color: Colors?.blue,
                                    bgcolor: Colors?.lightBlue,
                                  }
                                : stage == "Proposal"
                                ? {
                                    color: Colors?.orange,
                                    bgcolor: Colors?.lightorange,
                                  }
                                : {
                                    color: Colors?.purple,
                                    bgcolor: Colors?.lightpurple,
                                  };

                            let avatar =
                              index >= 10
                                ? avatarLightColors[index % 10]
                                : avatarLightColors[index];

                            return (
                              <CRMTableRow>
                                {columnMenuItems[0]?.bool && (
                                  <CRMTableCell
                                    data-title="Account Name"
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <Div sx={[DisplayFlex]}>
                                      <Avatar
                                        size="small"
                                        sx={[
                                          AvatarFont,
                                          {
                                            bgcolor: avatar,
                                            color: "black",
                                            width: 23,
                                            height: 23,
                                            display: {
                                              xs: "none !important",
                                              md: "flex !important",
                                              lg: "flex !important",
                                            },
                                          },
                                        ]}
                                      >
                                        {data &&
                                          data?.Contact_Name?.substring(
                                            0,
                                            2
                                          ).toUpperCase()}
                                      </Avatar>
                                      <Typography
                                        sx={[
                                          FontStyle,
                                          { color: Colors?.blue },
                                        ]}
                                      >
                                        {data?.Contact_Name}

                                        {/* <span style={{ color: "#475259" }}>Tech Wire</span> */}
                                      </Typography>
                                    </Div>
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[1]?.bool && (
                                  <CRMTableCell data-title="Date">
                                    <Typography
                                      sx={[
                                        FontStyle,
                                        {
                                          //   backgroundColor: `${color?.bgcolor} !important`,
                                          color: color?.color,
                                          
                                        },
                                      ]}
                                    >
                                      {data?.Created_Date || "-"}
                                    </Typography>
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[2]?.bool && (
                                  <CRMTableCell
                                    data-title="Employees"
                                    sx={{ color: Colors?.orange }}
                                  >
                                    {data?.Employees || 0}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[3]?.bool && (
                                  <CRMTableCell
                                    data-title="Turn Over"
                                    sx={{ color: Colors?.green }}
                                  >
                                    {Rupee +
                                      " " +
                                      data?.Turn_Over?.toLocaleString() || 0}
                                  </CRMTableCell>
                                )}
                              </CRMTableRow>
                            );
                          })
                        ) : (
                          <Div
                            sx={[
                              DisplayFlex,
                              { justifyContent: "center", height: 210 },
                            ]}
                          >
                            <Typography sx={{ fontSize: "14px" }}>
                              No record{" "}
                            </Typography>
                          </Div>
                        )}
                      </TableBody>
                    </Table>
                  </JumboScrollbar>
                </Div>
              </Grid>
              <Grid item xs={12} md={6} mt={1}>
                <Typography
                  sx={[
                    DialogHeader,
                    { backgroundColor: "transparent !important", mb: 1 },
                  ]}
                >
                  New Account
                </Typography>
                <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "10px" }]}>
                  Last 30 Days
                </Typography>
                <Div>
                  <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={210}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                  >
                    <Table stickyHeader className="table" sx={{ minWidth: { xs: "auto", sm: 600 } }}>
                      <CustomTableHeader
                        headerMenuItems={columnMenuItems}
                        setHeadermenuItems={setColumnMenuItems}
                        setDatas={setNewAccounts}
                        sortDatas={newAccounts}
                        showGear={false}
                      />
                      <TableBody className="table-body" sx={{ mt: 2 }}>
                        {newAccounts ? (
                          newAccounts?.map((data, index) => {
                            // console.log("data : ", data);
                            let stage = data?.Deal_Stage?.split(" ")[1];
                            let color =
                              stage == "Qualifying"
                                ? {
                                    color: Colors?.green,
                                    bgcolor: Colors?.lightgreen,
                                  }
                                : stage == "Enquiry"
                                ? {
                                    color: Colors?.indigo,
                                    bgcolor: Colors?.lightindigo,
                                  }
                                : stage == "Lost"
                                ? {
                                    color: Colors?.red,
                                    bgcolor: Colors?.lightred,
                                  }
                                : stage == "Demo"
                                ? {
                                    color: Colors?.blue,
                                    bgcolor: Colors?.lightBlue,
                                  }
                                : stage == "Proposal"
                                ? {
                                    color: Colors?.orange,
                                    bgcolor: Colors?.lightorange,
                                  }
                                : {
                                    color: Colors?.purple,
                                    bgcolor: Colors?.lightpurple,
                                  };

                            let avatar =
                              index >= 10
                                ? avatarLightColors[index % 10]
                                : avatarLightColors[index];

                            return (
                              <CRMTableRow>
                                {columnMenuItems[0]?.bool && (
                                  <CRMTableCell
                                    data-title="Account Name"
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <Div sx={[DisplayFlex]}>
                                      <Avatar
                                        size="small"
                                        sx={[
                                          AvatarFont,
                                          {
                                            bgcolor: avatar,
                                            color: "black",
                                            width: 23,
                                            height: 23,
                                            display: {
                                              xs: "none !important",
                                              md: "flex !important",
                                              lg: "flex !important",
                                            },
                                          },
                                        ]}
                                      >
                                        {data &&
                                          data?.Contact_Name?.substring(
                                            0,
                                            2
                                          ).toUpperCase()}
                                      </Avatar>
                                      <Typography
                                        sx={[
                                          FontStyle,
                                          { color: Colors?.blue },
                                        ]}
                                      >
                                        {data?.Contact_Name}

                                        {/* <span style={{ color: "#475259" }}>Tech Wire</span> */}
                                      </Typography>
                                    </Div>
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[1]?.bool && (
                                  <CRMTableCell data-title="Date">
                                    <Typography
                                      sx={[
                                        FontStyle,
                                        {
                                          //   backgroundColor: `${color?.bgcolor} !important`,
                                          color: color?.color,
                                          
                                        },
                                      ]}
                                    >
                                      {data?.Created_Date || "-"}
                                    </Typography>
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[2]?.bool && (
                                  <CRMTableCell
                                    data-title="Employees"
                                    sx={{ color: Colors?.orange }}
                                  >
                                    {data?.Employees || 0}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[3]?.bool && (
                                  <CRMTableCell
                                    data-title="Turn Over"
                                    sx={{ color: Colors?.green }}
                                  >
                                    {Rupee +
                                      " " +
                                      data?.Turn_Over?.toLocaleString() || 0}
                                  </CRMTableCell>
                                )}
                              </CRMTableRow>
                            );
                          })
                        ) : (
                          <Div
                            sx={[
                              DisplayFlex,
                              { justifyContent: "center", height: 210 },
                            ]}
                          >
                            <Typography sx={{ fontSize: "14px" }}>
                              No record{" "}
                            </Typography>
                          </Div>
                        )}
                      </TableBody>
                    </Table>
                  </JumboScrollbar>
                </Div>
              </Grid>
            </Grid>
          </Div>

          <Grid item xs={12} mt={1.5}>
            <Div
              className="card"
              sx={[
                {
                  height: "290px",
                  p: 1,
                  boxShadow: "0px 0px 4px lightgray",
                  border: "1px solid white",
                },
              ]}
            >
              <Typography
                sx={[
                  DialogHeader,
                  { backgroundColor: "transparent !important", mb: 1 },
                ]}
              >
                MRR
              </Typography>
              <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "10px" }]}>
                This Fiscal Year to Date
              </Typography>
              <Div>
                <ColumnBarChart
                  labelShow={true}
                  color={["#07beb8", "#7b2cbf", "#f72585"]}
                  barData={dataSource}
                  barType="stackedbar"
                  rotated={true}
                  barLength={["New", "Expansion", "Churn"]}
                  height={200}
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
                        backgroundColor: "#07beb8",
                        position: "absolute",
                        left: -12,
                        top: "25%",
                      }}
                    />{" "}
                    New
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
                        backgroundColor: "#7b2cbf",
                        position: "absolute",
                        left: -12,
                        top: "25%",
                      }}
                    />{" "}
                    Expansion
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
                        backgroundColor: "#f72585",
                        position: "absolute",
                        left: -12,
                        top: "25%",
                      }}
                    />{" "}
                    Churn
                  </Typography>
                </Div>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                height: "350px",
                p: 1,
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={[
                DialogHeader,
                {
                  backgroundColor: "transparent !important",
                  mb: 1,
                  textAlign: "center",
                },
              ]}
            >
              Amount Rentention
            </Typography>
            <Typography
              sx={[
                {
                  mb: 1,
                  fontWeight: 400,
                  textAlign: "center",
                  fontSize: "10px",
                },
              ]}
            >
              Last 12 months to Date{" "}
            </Typography>
            <Div>
              <ColumnBarChart
                labelShow={false}
                color={["#f72585", "#7b2cbf", "#07beb8", "#000"]}
                barData={dataSource3}
                barType={[
                  { label: "New", style: "stackedbar" },
                  { label: "Expansion", style: "stackedbar" },
                  { label: "Churn", style: "stackedbar" },
                  { label: "Customers", style: "line" },
                ]}
                barLength={["New", "Churn", "Expansion", "Customers"]}
                height={280}
              />
            </Div>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                height: "350px",
                p: 1,
                boxShadow: "0px 0px 4px lightgray",
                border: "1px solid white",
              },
            ]}
          >
            <Typography
              sx={[
                DialogHeader,
                {
                  backgroundColor: "transparent !important",
                  mb: 1,
                  textAlign: "center",
                },
              ]}
            >
              Account Rentention
            </Typography>
            <Typography
              sx={[
                {
                  mb: 1,
                  fontWeight: 400,
                  textAlign: "center",
                  fontSize: "10px",
                },
              ]}
            >
              Last 12 months to Date{" "}
            </Typography>
            <Div>
              <ColumnBarChart
                labelShow={false}
                color={["#f72585", "#07beb8", "#7b2cbf"]}
                barData={dataSource2}
                barType={[
                  { label: "New", style: "stackedbar" },
                  { label: "Expansion", style: "stackedbar" },
                  { label: "Churn", style: "line" },
                ]}
                barLength={["New", "Expansion", "Churn"]}
                height={280}
              />
            </Div>
          </Div>
        </Grid>
      </Grid>
    </JumboContentLayoutMain>
  );
}

export default CustomerRententionDashboard;
