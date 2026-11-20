import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  Pagination,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { RiRefreshFill } from "react-icons/ri";
import CreateTickets from "./CreateTickets";
import ViewTicketResponse from "./ViewTicketResponse";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdSend } from "react-icons/io";
import { BASE_URL } from "app/services/auth-services";
import DeveloperTicket from "./Developeticket";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { CustomButton } from "app/pages/widgets/StylesComponents";

const ListTickets = () => {
  const createrId = localStorage.getItem("UserId");

  const [Listticket, setListticket] = useState(true);
  const [Ticketstatus, setTicketstatus] = useState(false);
  const [sendstatusdatas, setsendstatusdatas] = useState([]);

  const [to, setTo] = useState();
  const [cc, setCc] = useState("pravinfoyer@gmail.com");
  const [subject, setSubject] = useState("Ticket");

  const [showFilter, setShowFilter] = useState(false);
  const [createTickets, setCreateTickets] = useState(false);
  const [viewTickets, setViewTickets] = useState(false);
  const [listTickets, setListTickets] = useState(true);
  const [datas, setDatas] = useState([]);
  const [id, setId] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);

  const [managementdatas, setmanagementdatas] = useState([]);
  const [usersdatas, setusersdatas] = useState([]);

  const [assignedto, setassignedto] = useState([]);
  const [statusdatas, setstatusdatas] = useState([]);
  const [dataresponse, setdataresponse] = useState([]);
  const [Modaldata, setModaldata] = useState([]);
  const [sendAddRequest, setSendAddRequest] = useState(false);

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Caller_Name", label: "Date", bool: true },
    { sort: "Month", label: "Ticket No", bool: true },
    { sort: "Month", label: "Related to", bool: true },
    { sort: "Plan_Id", label: "Ticket Details", bool: true },
    { sort: "Month", label: "Severity", bool: true },
    { sort: "Total_User_License", label: "Status", bool: true },
  ]);

  const token = localStorage.getItem("accesstoken");

  const GetTicketManagementrecords = () => {
    axios
      .get(`${BASE_URL}/superadmin/SuperAdminTicketManagement/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        setmanagementdatas(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const Usersrecord = () => {
    axios
      .get(`${BASE_URL}/superadmin/CRMUserlist/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        setusersdatas(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    GetTicketManagementrecords();
    TicketList();
    LookupTicketStatusrecords();
    Usersrecord();
  }, []);
  const TicketList = () => {
    axios
      .get(`${BASE_URL}/superadmin/TicketAdditional/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        setDatas(response.data.results || response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdate = (data) => {
    setsendstatusdatas(data);
    setTicketstatus(true);
    setListticket(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };
  const RefreshData = () => {};

  const [page, setPage] = useState(1);

  const LookupTicketStatusrecords = () => {
    axios
      .get(`${BASE_URL}/superadmin/Userlookuplist/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        let arr = response.data;
        let list = [];
        arr.map((item, index) => {
          if (item.Lookupname === "Ticket Status") {
            list.push(item);
          }
        });
        setstatusdatas(list[0].Values);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const Deletedata = () => {
    axios
      .delete(`${BASE_URL}/superadmin/CRMUser/`, {
        headers: {
          db: localStorage.getItem("DBName"),
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: { id: id },
      })
      .then((res) => {
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 100,
        });
        TicketList();
        setOpenDelete(false);
      });
  };

  const handlesendPopup = (data) => {
    managementdatas.map((item, index) => {
      if (data.TktType === item.TicketRelatesto) {
        setassignedto(item.AssigntoUser);
        console.log(item.AssigntoUser);
      }
    });
    if (
      data.AssignTo_Users !== "" &&
      data.AssignTo_Users !== null &&
      data.AssignTo_Users !== undefined
    ) {
      setTo(data.AssignTo_Users);
    }
    setSendAddRequest(true);
    setModaldata(data);
  };

  const handleClose1 = () => {
    setSendAddRequest(false);
    setTo("");
    setassignedto([]);
    setModaldata([]);
  };

  const updateAssignto = () => {
    let playload = {
      id: Modaldata.id,
      TktNo: Modaldata.TktNo,
      TktType: Modaldata.TktType,
      TkyCategory: Modaldata.TkyCategory,
      TktLevel: Modaldata.TktLevel,
      Name: Modaldata.Name,
      AllowcatedDate: Modaldata.AllowcatedDate,
      DeadlineDate: Modaldata.DeadlineDate,
      Status: "Assigned",
      Description: Modaldata.Description,
      AssignTo_Users: to,
      Progress: 1,
      AdditionalDetails: [{}],
      Organization_Id: createrId,
      AssignTo: 1,
      TicketGroup: null,
      Created_By: createrId,
      Updated_By: createrId,
    };
    axios
      .put(`${BASE_URL}/superadmin/Ticket/`, playload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log("put", res.data);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  //  Mail Sending Functionality
  const mailBodyContent = `<div class='card'>
<div class='card-body'>
  <h6 className="card-subtitle mb-2 text-muted">Urgent Issue: Ticket ${Modaldata.TktNo}</h6> 
  <p className="card-subtitle mb-2 text-muted">Dear Ticket Management Team,</p>
  <div class='card-text'>
    <p>Please find below the ticket details which need your immediate action:</p>
    <p><strong>Ticket Details:</strong></p>
    <ul>
      <li><strong>Ticket Number:</strong> ${Modaldata.TktNo}</li>
      <li><strong>Raised by:</strong>User</li>
      <li><strong>Issue Type:</strong> ${Modaldata.TktType}</li>
      <li><strong>Priority:</strong>${Modaldata.TktLevel}</li>
    </ul>
    <p><strong>Description of the Issue:</strong></p>
    <p>${Modaldata.TkyCategory}</p>
    <p>We kindly request that you prioritize and resolve this issue promptly. Please keep us updated on the resolution progress of this ticket.</p>
    <p>Thank you for your prompt attention to this matter. If you require any further information or clarification, please do not hesitate to reach out to me.</p>
    <p>To view the ticket, please click the following URL: <a href="#">Ticket #12345</a></p>
    <p>Best regards,</p>
    <p>Foyer</p>
  </div>
</div>
</div>`;

  const onsubmit = () => {
    if (to === undefined || to === null || to === "") {
      toast.error("Invalid Data");
    } else {
      let mailsendto = [];
      usersdatas.map((item, index) => {
        if (item.User_Name === to) {
          mailsendto.push(item.User_emailId);
          console.log(item.User_emailId);
        }
      });

      var payload = {
        MailSubject: subject,
        Organization_Id: 1,
        Cc: [cc],
        MailBody: mailBodyContent,
        RecevierMailId: mailsendto[0],
        file: "testCHECK.png",
        UserId: 1,
      };
      axios
        .post(`${BASE_URL}/superadmin/UserAdminMailMasterCRUD/`, payload, {
          headers: {
            db: localStorage.getItem("DBName"),
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          updateAssignto();
          toast.success("Mail Sent successfully", {
            position: "top-right",
            autoClose: 100,
          });
        });
    }
  };

  return (
    <>
      <Div sx={{ display: Listticket === true ? "block" : "none" }}>
        <JumboContentLayoutMain>
          <Div sx={{ display: listTickets === true ? "block" : "none" }}>
            <Grid container alignItems={"center"} sx={{ my: 1 }}>
              <Grid
                item
                className="filter"
                xs={12}
                md={6.5}
                sm={12}
                xl={6.5}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <Div sx={[DisplayFlex]}>
                  <Typography sx={[ComponentHeading]}>List View</Typography>
                  <IconButton className="filter-icon" onClick={ShowFilter}>
                    <BiFilterAlt />
                  </IconButton>
                </Div>
                <Div
                  className="card filter-box mt-6"
                  id="openFilter"
                  sx={{
                    mt: 4,
                    p: 1.5,
                    maxWidth: "300px",
                    display: showFilter === true ? `block` : `none`,
                  }}
                >
                  <Div
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography sx={[ComponentHeading]}>Filters</Typography>
                    <IconButton
                      sx={{ color: Colors?.Mblue, mt: -1.5, mr: -1.5 }}
                      onClick={RefreshData}
                    >
                      <RiRefreshFill />
                    </IconButton>
                  </Div>
                  <Div className="row">
                    <Div className="col-md-12">
                      <Typography
                        sx={[FontStyle, { mb: 0.4, textAlign: "left" }]}
                      >
                        Related to
                      </Typography>
                      <TextField
                        type="text"
                        className="col-md-12 input-box"
                        autoComplete="off"
                        placeholder="Related to"
                        sx={{ mt: -0.5 }}
                      />
                    </Div>
                  </Div>
                  <Div className="row" sx={{ my: 1 }}>
                    <Div className="col-md-12">
                      <Typography
                        sx={[FontStyle, { mb: 0.4, textAlign: "left" }]}
                      >
                        Lookup Id
                      </Typography>
                      <TextField
                        type="text"
                        className="col-md-12 input-box"
                        autoComplete="off"
                        placeholder="Lookup Id"
                        sx={{ mt: -0.5 }}
                      ></TextField>
                    </Div>
                  </Div>
                  <Div className="col-md-12" sx={{ mt: 0 }}>
                    <Div className="row">
                      <Div className="col-sm-12 col-md-6">
                        <Typography
                          sx={[FontStyle, { mb: 0.4, textAlign: "left" }]}
                        >
                          Created Date
                        </Typography>
                        <TextField
                          type="date"
                          className="col-md-12 input-box"
                          id="createdDate"
                        />
                      </Div>
                      <Div className="col-sm-12 col-md-6">
                        <Typography
                          sx={[FontStyle, { mb: 0.4, textAlign: "left" }]}
                        >
                          Last Date
                        </Typography>
                        <TextField
                          type="date"
                          className="col-md-12 input-box"
                          id="lastDate"
                        />
                      </Div>
                    </Div>
                  </Div>
                  <Div
                    sx={[{ mt: 1, display: "flex", justifyContent: "center" }]}
                  >
                    <Button
                      sx={[DialogBoxSaveButton, FontStyle, ButtonStyle]}
                      type="submit"
                    >
                      Apply
                    </Button>
                  </Div>
                </Div>
              </Grid>
              <Grid item xs={12} md={4} sm={12} xl={4}>
                <TextField
                  className="col-12 input-box"
                  id="outlined-search"
                  type="search"
                  placeholder="Search..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HiOutlineSearch size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 150, mt: { xs: 0.5, md: 0 } }}
                />
              </Grid>
              <Grid
                sx={[
                  DisplayFlex,
                  { justifyContent: { sx: "left", md: "right" } },
                ]}
                item
                xs={12}
                md={1.5}
                sm={12}
                xl={1.5}
              >
                <CustomButton label="Search" Icon="" />
              </Grid>
            </Grid>

            <React.Fragment>
              <JumboScrollbar
                autoHeight={true}
                autoHideTimeout={4000}
                autoHeightMin={"60vh"}
                autoHide={true}
                hideTracksWhenNotNeeded
                id="no-more-tables"
              >
                <Table className="table" sx={{ mt: 0 }}>
                  <CustomTableHeader
                    headerMenuItems={columnMenuItems}
                    setHeadermenuItems={setColumnMenuItems}
                    setDatas={setDatas}
                    sortDatas={datas}
                  />
                  <TableBody sx={{ mt: 2 }}>
                    {datas.length > 0 &&
                      datas?.map((data, index) => {
                        return (
                          <CRMTableRow key={index}>
                            {columnMenuItems[0]?.bool && (
                              <CRMTableCell data-title="Caller Name">
                                {data?.Created_Date.split("T")[0]}
                              </CRMTableCell>
                            )}
                            {columnMenuItems[1].bool && (
                              <CRMTableCell data-title="Notification Id">
                                {data?.TktNo}
                              </CRMTableCell>
                            )}
                            {columnMenuItems[2].bool && (
                              <CRMTableCell data-title="Notification Msg">
                                {data?.TktType}
                              </CRMTableCell>
                            )}
                            {columnMenuItems[3].bool && (
                              <CRMTableCell data-title="Notification Source">
                                {data?.TkyCategory}
                              </CRMTableCell>
                            )}
                            {columnMenuItems[4].bool && (
                              <CRMTableCell data-title="Notification Source">
                                {data?.TktLevel}
                              </CRMTableCell>
                            )}
                            {columnMenuItems[5].bool && (
                              <CRMTableCell data-title="Notification Source">
                                {data?.Status}
                              </CRMTableCell>
                            )}

                            <CRMTableCell
                              data-title="Action"
                              sx={{
                                cursor: "pointer",
                              }}
                            >
                              <Div>
                                <IconButton
                                  size="small"
                                  className="send-icon"
                                  onClick={() => {
                                    handlesendPopup(data);
                                  }}
                                >
                                  <IoMdSend />
                                </IconButton>

                                <IconButton
                                  sx={{ padding: "0px" }}
                                  size="small"
                                  onClick={() => {
                                    handleUpdate(data?.data);
                                  }}
                                  className="edit-icon"
                                >
                                  <BiEdit />
                                </IconButton>
                              </Div>
                            </CRMTableCell>
                          </CRMTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </JumboScrollbar>
              {/* this modal is used to add a licence by user */}
              <Dialog
                open={sendAddRequest}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle
                  sx={[
                    CRMTableHead,
                    DialogHeader,
                    DisplayFlex,
                    { bgcolor: "#dcdcdc !important" },
                  ]}
                >
                  Assign Ticket
                </DialogTitle>
                <DialogContent sx={{ padding: "30px" }}>
                  <DialogContentText id="alert-dialog-description">
                    <Grid container>
                      <Grid item xs={12} md={12} mt={2}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1}>
                              Ticket No
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <Typography sx={[FontStyle]}>
                              {Modaldata.TktNo}
                            </Typography>
                          </Div>
                        </Div>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1}>
                              Related to
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <Typography sx={[FontStyle]}>
                              {Modaldata.TktType}
                            </Typography>
                          </Div>
                        </Div>
                      </Grid>

                      <Grid item xs={12} md={12} mb={1}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1} mt={1}>
                              Assigned to
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]} mt={1}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <FormControl className="col-sm-12 col-12 ">
                              <Autocomplete
                                className="search-select"
                                name="to"
                                options={assignedto}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.Employee) {
                                    return option?.Employee;
                                  }
                                  return "";
                                }}
                                value={to}
                                onChange={(e, newValue) => {
                                  setTo(newValue?.Employee);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="Assigned"
                                    placeholder="Assigned to"
                                  />
                                )}
                              />
                            </FormControl>
                          </Div>
                        </Div>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1} mt={1}>
                              Allocated Date
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]} mt={1}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <TextField
                              style={{ mb: 1 }}
                              className="input-box col-12 mb-1"
                              size={"small"}
                              placeholder={"Allocated date"}
                              value={
                                Modaldata &&
                                Modaldata.AllowcatedDate?.split("T")[0]
                              }
                            />
                          </Div>
                        </Div>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1} mt={1}>
                              Estimated Date
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]} mt={1}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <TextField
                              style={{ mb: 1 }}
                              className="input-box col-12 mb-1"
                              size={"small"}
                              placeholder={"Deadline date"}
                              value={
                                Modaldata &&
                                Modaldata.DeadlineDate?.split("T")[0]
                              }
                            />
                          </Div>
                        </Div>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Div className="row">
                          <Div className="col-5">
                            <Typography sx={[FontStyle]} ml={1} mt={1}>
                              Status
                            </Typography>
                          </Div>
                          <Div className="col-1">
                            <Typography sx={[FontStyle]} mt={1}>
                              : &nbsp;&nbsp;&nbsp;
                            </Typography>
                          </Div>
                          <Div className="col-6">
                            <FormControl className="col-sm-12 col-12 ">
                              <Autocomplete
                                className="search-select"
                                name="to"
                                options={statusdatas}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.value) {
                                    return option?.value;
                                  }
                                  return "";
                                }}
                                value={Modaldata && Modaldata?.Status}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="Assigned"
                                    placeholder="Assigned to"
                                  />
                                )}
                              />
                            </FormControl>
                          </Div>
                        </Div>
                      </Grid>
                    </Grid>
                  </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: "20px 30px 30px 30px" }}>
                  <Button
                    sx={[ButtonStyle, FontStyle, DialogBoxSaveButton]}
                    onClick={onsubmit}
                  >
                    Send Request
                  </Button>
                  <Button
                    sx={[ButtonStyle, FontStyle, DialogBoxCancelButton]}
                    onClick={handleClose1}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>

              <Div
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Pagination
                  color="success"
                  count={Math?.ceil(datas.length / 10)}
                  page={page}
                  onChange={(e, newValue) => setPage(newValue)}
                  variant="outlined"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Div>
            </React.Fragment>
          </Div>
          <Div sx={{ display: createTickets === true ? "block" : "none" }}>
            <CreateTickets
              setCreateTickets={setCreateTickets}
              setListTickets={setListTickets}
            />
          </Div>

          <Div sx={{ display: viewTickets === true ? "block" : "none" }}>
            <ViewTicketResponse
              prop={dataresponse}
              setViewTickets={setViewTickets}
              setListTickets={setListTickets}
            />
          </Div>
        </JumboContentLayoutMain>
        <Dialog open={openDelete}>
          <DialogContent sx={{ pl: 4, pr: 4 }}>
            <Div>
              <Typography sx={[FontStyle]}>
                Are you sure you want to delete the User
              </Typography>
            </Div>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              sx={[ButtonStyle, FontStyle, DialogBoxSaveButton]}
              onClick={() => {
                Deletedata();
              }}
            >
              Delete
            </Button>
            <Button
              sx={[ButtonStyle, FontStyle, DialogBoxCancelButton]}
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Div>
      <ToastContainer />
      <Div sx={{ display: Ticketstatus === true ? "block" : "none" }}>
        <DeveloperTicket
          setListticket={setListticket}
          setTicketstatus={setTicketstatus}
          sendstatusdatas={sendstatusdatas}
        />
      </Div>
    </>
  );
};

export default ListTickets;
