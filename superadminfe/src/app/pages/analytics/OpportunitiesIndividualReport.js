import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Autocomplete,
  Avatar,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import ColumnBarChart from "./Bars/ColumnBarChart";
import ReactSpeedometer from "react-d3-speedometer";
import DataGrid, {
  Column,
  Selection,
  Summary,
  GroupItem,
  SortByGroupSummaryInfo,
  Scrolling,
} from "devextreme-react/data-grid";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import CustomTableHeader from "../widgets/CustomTableHeader";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";

function OpportunitiesIndividualReport() {
  const [selectUser, setSelectUser] = useState("");
  const [cpuUsage, setcpuUsage] = useState(10);
  const dataGridRef = useRef(null);
  const matches = useMediaQuery("(min-width:600px)", { noSsr: true });

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Account_Name", label: matches  ? "Customer Name" : "Name", bool: true },
    { sort: "Deal_Stage", label: "Deal Stage", bool: true },
    { sort: "Amount", label: "Amount", bool: true },
  ]);
  const [datas, setDatas] = useState([]);
  const [tableDatas, setTableDatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const DBName = "crmuseradmin1";
  const getDatas = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/AnalysticSalesOpportunitiesOverview/?Is_Deleted=False&id=${localStorage.getItem(
          "UserId"
        )}`,
        {
          headers: {
            db: DBName,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("lists23", response.data?.results);
      if (Object.keys(response.data).length > 0) {
        // let list = {...response.data}
        // response.data?.TotalAcconts?.map((acc) =>{

        // })

        setSelectUser(response.data?.TopAcconts[0] || {});
        setDatas(response.data || []);
        setTableDatas(response.data?.TotalDeals);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const onStateResetClick = useCallback(() => {
    dataGridRef.current.instance.state(null);
  }, []);

  const orders = [
    {
      ID: 1,
      OrderNumber: 35703,
      OrderDate: new Date(2014, 3, 10),
      SaleAmount: 11800,
      Terms: "15 Days",
      TotalAmount: 12175,
      CustomerStoreState: "California",
      CustomerStoreCity: "Los Angeles",
      Employee: "Harv Mudd",
    },
    {
      ID: 4,
      OrderNumber: 35711,
      SaleAmount: 16050,
      TotalAmount: 16550,
      CustomerStoreCity: "San Jose",
      Employee: "Jim Packard",
    },
    {
      ID: 5,
      OrderNumber: 35714,
      OrderDate: new Date(2014, 0, 22),
      SaleAmount: 14750,
      Terms: "15 Days",
      TotalAmount: 15250,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 7,
      OrderNumber: 35983,
      OrderDate: new Date(2014, 1, 7),
      SaleAmount: 3725,
      Terms: "15 Days",
      TotalAmount: 3850,
      CustomerStoreState: "Colorado",
      CustomerStoreCity: "Denver",
      Employee: "Todd Hoffman",
    },
    {
      ID: 9,
      OrderNumber: 36987,
      OrderDate: new Date(2014, 2, 11),
      SaleAmount: 14200,
      Terms: "15 Days",
      TotalAmount: 14800,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 11,
      OrderNumber: 38466,
      OrderDate: new Date(2014, 2, 1),
      SaleAmount: 7800,
      Terms: "15 Days",
      TotalAmount: 8200,
      CustomerStoreState: "California",
      CustomerStoreCity: "Los Angeles",
      Employee: "Harv Mudd",
    },
    {
      ID: 14,
      OrderNumber: 39420,
      OrderDate: new Date(2014, 1, 15),
      SaleAmount: 20500,
      Terms: "15 Days",
      TotalAmount: 9100,
      CustomerStoreState: "California",
      CustomerStoreCity: "San Jose",
      Employee: "Jim Packard",
    },
    {
      ID: 15,
      OrderNumber: 39874,
      OrderDate: new Date(2014, 1, 4),
      SaleAmount: 9050,
      Terms: "30 Days",
      TotalAmount: 19100,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 18,
      OrderNumber: 42847,
      OrderDate: new Date(2014, 1, 15),
      SaleAmount: 20400,
      Terms: "30 Days",
      TotalAmount: 20800,
      CustomerStoreState: "Wyoming",
      CustomerStoreCity: "Casper",
      Employee: "Todd Hoffman",
    },
    {
      ID: 19,
      OrderNumber: 43982,
      OrderDate: new Date(2014, 4, 29),
      SaleAmount: 6050,
      Terms: "30 Days",
      TotalAmount: 6250,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 29,
      OrderNumber: 56272,
      OrderDate: new Date(2014, 1, 6),
      SaleAmount: 15850,
      Terms: "30 Days",
      TotalAmount: 16350,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 30,
      OrderNumber: 57429,
      OrderDate: new Date(2013, 11, 31),
      SaleAmount: 11050,
      Terms: "30 Days",
      TotalAmount: 11400,
      CustomerStoreState: "Arizona",
      CustomerStoreCity: "Phoenix",
      Employee: "Clark Morgan",
    },
    {
      ID: 32,
      OrderNumber: 58292,
      OrderDate: new Date(2014, 4, 13),
      SaleAmount: 13500,
      Terms: "15 Days",
      TotalAmount: 13800,
      CustomerStoreState: "California",
      CustomerStoreCity: "Los Angeles",
      Employee: "Harv Mudd",
    },
    {
      ID: 36,
      OrderNumber: 62427,
      OrderDate: new Date(2014, 0, 27),
      SaleAmount: 23500,
      Terms: "15 Days",
      TotalAmount: 24000,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 39,
      OrderNumber: 65977,
      OrderDate: new Date(2014, 1, 5),
      SaleAmount: 2550,
      Terms: "15 Days",
      TotalAmount: 2625,
      CustomerStoreState: "Wyoming",
      CustomerStoreCity: "Casper",
      Employee: "Todd Hoffman",
    },
    {
      ID: 40,
      OrderNumber: 66947,
      OrderDate: new Date(2014, 2, 23),
      SaleAmount: 3500,
      Terms: "15 Days",
      TotalAmount: 3600,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 42,
      OrderNumber: 68428,
      OrderDate: new Date(2014, 3, 10),
      SaleAmount: 10500,
      Terms: "15 Days",
      TotalAmount: 10900,
      CustomerStoreState: "California",
      CustomerStoreCity: "Los Angeles",
      Employee: "Harv Mudd",
    },
    {
      ID: 43,
      OrderNumber: 69477,
      OrderDate: new Date(2014, 2, 9),
      SaleAmount: 14200,
      Terms: "15 Days",
      TotalAmount: 14500,
      CustomerStoreState: "California",
      CustomerStoreCity: "Anaheim",
      Employee: "Harv Mudd",
    },
    {
      ID: 46,
      OrderNumber: 72947,
      OrderDate: new Date(2014, 0, 14),
      SaleAmount: 13350,
      Terms: "30 Days",
      TotalAmount: 13650,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 47,
      OrderNumber: 73088,
      OrderDate: new Date(2014, 2, 25),
      SaleAmount: 8600,
      Terms: "30 Days",
      TotalAmount: 8850,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Reno",
      Employee: "Clark Morgan",
    },
    {
      ID: 50,
      OrderNumber: 76927,
      OrderDate: new Date(2014, 3, 27),
      SaleAmount: 9800,
      Terms: "30 Days",
      TotalAmount: 10050,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 51,
      OrderNumber: 77297,
      OrderDate: new Date(2014, 3, 30),
      SaleAmount: 10850,
      Terms: "30 Days",
      TotalAmount: 11100,
      CustomerStoreState: "Arizona",
      CustomerStoreCity: "Phoenix",
      Employee: "Clark Morgan",
    },
    {
      ID: 56,
      OrderNumber: 84744,
      OrderDate: new Date(2014, 1, 10),
      SaleAmount: 4650,
      Terms: "30 Days",
      TotalAmount: 4750,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 57,
      OrderNumber: 85028,
      OrderDate: new Date(2014, 4, 17),
      SaleAmount: 2575,
      Terms: "30 Days",
      TotalAmount: 2625,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Reno",
      Employee: "Clark Morgan",
    },
    {
      ID: 59,
      OrderNumber: 87297,
      OrderDate: new Date(2014, 3, 21),
      SaleAmount: 14200,
      Terms: "30 Days",
      TotalAmount: 0,
      CustomerStoreState: "Wyoming",
      CustomerStoreCity: "Casper",
      Employee: "Todd Hoffman",
    },
    {
      ID: 60,
      OrderNumber: 88027,
      OrderDate: new Date(2014, 1, 14),
      SaleAmount: 13650,
      Terms: "30 Days",
      TotalAmount: 14050,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 65,
      OrderNumber: 94726,
      OrderDate: new Date(2014, 4, 22),
      SaleAmount: 20500,
      Terms: "15 Days",
      TotalAmount: 20800,
      CustomerStoreState: "California",
      CustomerStoreCity: "San Jose",
      Employee: "Jim Packard",
    },
    {
      ID: 66,
      OrderNumber: 95266,
      OrderDate: new Date(2014, 2, 10),
      SaleAmount: 9050,
      Terms: "15 Days",
      TotalAmount: 9250,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 69,
      OrderNumber: 98477,
      OrderDate: new Date(2014, 0, 1),
      SaleAmount: 23500,
      Terms: "15 Days",
      TotalAmount: 23800,
      CustomerStoreState: "Wyoming",
      CustomerStoreCity: "Casper",
      Employee: "Todd Hoffman",
    },
    {
      ID: 70,
      OrderNumber: 99247,
      OrderDate: new Date(2014, 1, 8),
      SaleAmount: 2100,
      Terms: "15 Days",
      TotalAmount: 2150,
      CustomerStoreState: "Utah",
      CustomerStoreCity: "Salt Lake City",
      Employee: "Clark Morgan",
    },
    {
      ID: 78,
      OrderNumber: 174884,
      OrderDate: new Date(2014, 3, 10),
      SaleAmount: 7200,
      Terms: "30 Days",
      TotalAmount: 7350,
      CustomerStoreState: "Colorado",
      CustomerStoreCity: "Denver",
      Employee: "Todd Hoffman",
    },
    {
      ID: 81,
      OrderNumber: 188877,
      OrderDate: new Date(2014, 1, 11),
      SaleAmount: 8750,
      Terms: "30 Days",
      TotalAmount: 8900,
      CustomerStoreState: "Arizona",
      CustomerStoreCity: "Phoenix",
      Employee: "Clark Morgan",
    },
    {
      ID: 82,
      OrderNumber: 191883,
      OrderDate: new Date(2014, 1, 5),
      SaleAmount: 9900,
      Terms: "30 Days",
      TotalAmount: 10150,
      CustomerStoreState: "California",
      CustomerStoreCity: "Los Angeles",
      Employee: "Harv Mudd",
    },
    {
      ID: 83,
      OrderNumber: 192474,
      OrderDate: new Date(2014, 0, 21),
      SaleAmount: 12800,
      Terms: "30 Days",
      TotalAmount: 13100,
      CustomerStoreState: "California",
      CustomerStoreCity: "Anaheim",
      Employee: "Harv Mudd",
    },
    {
      ID: 84,
      OrderNumber: 193847,
      OrderDate: new Date(2014, 2, 21),
      SaleAmount: 14100,
      Terms: "30 Days",
      TotalAmount: 14350,
      CustomerStoreState: "California",
      CustomerStoreCity: "San Diego",
      Employee: "Harv Mudd",
    },
    {
      ID: 85,
      OrderNumber: 194877,
      OrderDate: new Date(2014, 2, 6),
      SaleAmount: 4750,
      Terms: "30 Days",
      TotalAmount: 4950,
      CustomerStoreState: "California",
      CustomerStoreCity: "San Jose",
      Employee: "Jim Packard",
    },
    {
      ID: 86,
      OrderNumber: 195746,
      OrderDate: new Date(2014, 4, 26),
      SaleAmount: 9050,
      Terms: "30 Days",
      TotalAmount: 9250,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Las Vegas",
      Employee: "Harv Mudd",
    },
    {
      ID: 87,
      OrderNumber: 197474,
      OrderDate: new Date(2014, 2, 2),
      SaleAmount: 6400,
      Terms: "30 Days",
      TotalAmount: 6600,
      CustomerStoreState: "Nevada",
      CustomerStoreCity: "Reno",
      Employee: "Clark Morgan",
    },
    {
      ID: 88,
      OrderNumber: 198746,
      OrderDate: new Date(2014, 4, 9),
      SaleAmount: 15700,
      Terms: "30 Days",
      TotalAmount: 16050,
      CustomerStoreState: "Colorado",
      CustomerStoreCity: "Denver",
      Employee: "Todd Hoffman",
    },
    {
      ID: 91,
      OrderNumber: 214222,
      OrderDate: new Date(2014, 1, 8),
      SaleAmount: 11050,
      Terms: "30 Days",
      TotalAmount: 11250,
      CustomerStoreState: "Arizona",
      CustomerStoreCity: "Phoenix",
      Employee: "Clark Morgan",
    },
  ];

  const ColumnItems = ["Opportunity Group", "Detail", "Amount"];

  return (
    <JumboContentLayoutMain>
      <Typography sx={[ComponentHeading, { mb: 2 }]}>
        Opportunities Individual Report
      </Typography>
      <Grid container spacing={2}>
      <Grid item xs={12} md={12} mt={1}>
          <Div
             id="card"
            sx={[
              {
                p: 1,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              },
            ]}
          >
            <Typography
              sx={[{ fontWeight: 600, textAlign: "center", fontSize: "13px" ,textAlignLast:'end'}]}
            >
              Select Sale Rep
            </Typography>

           <div style={{float:'inline-end'}}>
           <Autocomplete
              options={datas?.TopAcconts?.sort(
                (a, b) => -b.Name.localeCompare(a.Name)
              )}
              getOptionLabel={(option) => option?.Name || ""}
              // sx={{ width: 300 }}
              sx={{ p: 1 }}
              value={selectUser?.Name}    
              defaultValue={selectUser?.Name}
              onChange={(e, value) => setSelectUser(value)}
              renderInput={(params) => <TextField {...params} />} style={{width:'200px'}}
            />
           </div>
            <Div>
              <div className="row mt-5">
                <div className="col-md-3">
                <Card
                sx={[
                  DisplayFlex,
                  { gap: 4, height: "65px", justifyContent: "center",backgroundColor:'#f1f1f1' },
                ]}
              >
                <Div>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#4e4e4e",
                    }}
                  >
                    ₹ {selectUser?.Closed?.toLocaleString() || 0}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "13px",
                      color:"#363636"
                    }}
                  >
                    Opportunities Closed Overall
                  </Typography>
                </Div>
              </Card>
                </div>
                <div className="col-md-3">
                <Card
                sx={[DisplayFlex, { height: "65px", justifyContent: "center", backgroundColor:'#f1f1f1' }]}
              >
                <Div>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#4e4e4e",
                    }}
                  >
                    ₹ {selectUser?.Open?.toLocaleString() || 0}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "13px",
                      color:'#363636'
                    }}
                  >
                    Opportunities Open
                  </Typography>
                </Div>
              </Card>
                </div>
                <div className="col-md-3">
                <Card
                sx={[DisplayFlex, { height: "65px", justifyContent: "center" ,backgroundColor:'#f1f1f1'}]}
              >
                <Div>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#4e4e4e",
                    }}
                  >
                    ₹ {selectUser?.Won?.toLocaleString() || 0}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "13px",
                      color:'#363636'
                    }}
                  >
                    Opportunities Won
                  </Typography>
                </Div>
              </Card>
                </div>
                <div className="col-md-3">
                <Card
                sx={[DisplayFlex, { height: "65px", justifyContent: "center", backgroundColor:'#f1f1f1' }]}
              >
                <Div>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#4e4e4e",
                    }}
                  >
                    ₹ {selectUser?.Lost?.toLocaleString() || 0}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: "13px",
                      color:'#363636'
                    }}
                  >
                    Opportunities Lost
                  </Typography>
                </Div>
              </Card>
                </div>
              </div>
            </Div>
          </Div>
        </Grid>
        </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                minHeight: "350px",
                p: 1,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              },
            ]}
          >
            <Typography
              sx={[
                {
                  mb: 1,
                  fontWeight: 600,
                  textAlign: "center",
                  fontSize: "13px",
                },
              ]}
            >
              Top Accounts
            </Typography>

            
            <Div>
              <ColumnBarChart
                labelShow={true}
                color={["#d1105a"]}
                barData={datas?.DealSaleRep}
                rotated={true}
                barLength={["Amount"]}
                label="Name"
                height={300}
              />
            </Div>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                minHeight: "350px",
                p: 1,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              },
            ]}
          >
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={330}
              autoHide={true}
              hideTracksWhenNotNeeded
              // id="no-more-tables"
            >
              <Table stickyHeader className="table">
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  setDatas={setTableDatas}
                  sortDatas={tableDatas}
                  showGear={false}
                />
                <TableBody className="table-body" sx={{ mt: 2 }}>
                  {tableDatas &&
                    tableDatas?.map((data, index) => {
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
                          ? { color: Colors?.red, bgcolor: Colors?.lightred }
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
                              data-title="Customer Name"
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
                                    data?.Account_Name?.substring(
                                      0,
                                      2
                                    ).toUpperCase()}
                                </Avatar>
                                <Typography
                                  sx={[FontStyle, { color: Colors?.blue }]}
                                >
                                  {data?.Account_Name}

                                  {/* <span style={{ color: "#475259" }}>Tech Wire</span> */}
                                </Typography>
                              </Div>
                            </CRMTableCell>
                          )}

                          {columnMenuItems[1]?.bool && (
                            <CRMTableCell data-title="Deal Stage">
                              <Typography
                                sx={[
                                  FontStyle,
                                  {
                                    backgroundColor: `${color?.bgcolor} !important`,
                                    color: color?.color,
                                    borderRadius: "15px",
                                    py: 0.4,
                                    px: 0.8,
                                    display: "inline-flex",
                                  },
                                ]}
                              >
                                {data?.Deal_Stage?.split("Deals")[1]}
                              </Typography>
                            </CRMTableCell>
                          )}

                          {columnMenuItems[2]?.bool && (
                            <CRMTableCell
                              data-title="Deal Amount"
                              sx={{color:Colors?.purple}}
                             
                            >
                              {Rupee + " " +data?.Amount?.toLocaleString() || 0}
                            </CRMTableCell>
                          )}

                        </CRMTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </JumboScrollbar>

          </Div>
        </Grid>

        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                minHeight: "350px",
                p: 1,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              },
            ]}
          >
            <Typography
              sx={[
                DialogHeader,
                {
                  backgroundColor: "transparent !important",
                  textAlign: "center",
                },
              ]}
            >
              Opportunities
            </Typography>
            <Typography sx={[FontStyle, { textAlign: "center" }]}>
              By Probability
            </Typography>
            <Div>
              <ColumnBarChart
                labelShow={true}
                // color={['navy',]}
                barData={datas?.DealSaleRep || []}
                barLength={["Probability"]}
                label="Name"
                height={250}
              />
            </Div>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} mt={1}>
          <Div
            className="card"
            sx={[
              {
                minHeight: "350px",
                p: 1,
                boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
              },
            ]}
          >
            <Div
              sx={[
                DisplayFlex,
                { justifyContent: "center", transform: "translateY(25%)" },
              ]}
            >
              <ReactSpeedometer
                // height={179}
                width={250}
                maxValue={100}
                customSegmentLabels={false}
                value={datas?.Conversion?.number?.toFixed(2) || 0}
                segmentColors={["#a3be8c", "#ebcb8b", "#d08770", "#bf616a"]}
                currentValueText={datas?.Conversion?.percentage}
                textColor={"black"}
              />
            </Div>
            <Typography
              sx={[
                {
                  mt: 1,
                  fontWeight: 600,
                  textAlign: "center",
                  fontSize: "13px",
                },
              ]}
            >
              Conversion Rate
            </Typography>
          </Div>
        </Grid>
      </Grid>
    </JumboContentLayoutMain>
  );
}

export default OpportunitiesIndividualReport;
