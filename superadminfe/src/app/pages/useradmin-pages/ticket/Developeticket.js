import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import { useNavigate } from "react-router-dom";

const DeveloperTicket = ({ sendstatusdatas, setListticket, setTicketstatus }) => {
  const [statusdatas, setstatusdatas] = useState([]);
  const [relateddatas, setrelateddatas] = useState([]);

  const [ticketnumber, setticketnumber] = useState(true);
  const [ticketprops, setticketprops] = useState(false);

  const [datas, setdatas] = useState([]);

  const [Tnumber, setTnumber] = useState("");
  const [Trelatedto, setTrelatedto] = useState("");
  const [Tdetails, setTdetails] = useState("");
  const [Tassignedto, setTassignedto] = useState("");
  const [Tallodate, setTallodate] = useState("");
  const [Testmitate, setTestmitateo] = useState("");
  const [Tstatus, setTstatus] = useState("");

  const createrId = localStorage.getItem("UserId");

  const [Modaldata, setModaldata] = useState([]);

  const navigate = useNavigate();

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

  const LookupTicketrealatedrecords = () => {
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
          if (item.Lookupname === "Ticket Related To") {
            list.push(item);
          }
        });
        setrelateddatas(list[0].Values);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const CreatedTicketlistrecords = () => {
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
        setdatas(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

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
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    LookupTicketStatusrecords();
    LookupTicketrealatedrecords();
    CreatedTicketlistrecords();
    GetTicketManagementrecords();
  }, []);

  useEffect(() => {
    console.log(sendstatusdatas);
    if (sendstatusdatas != undefined && sendstatusdatas.length != 0) {
      setModaldata(sendstatusdatas);
      setTnumber(sendstatusdatas.TktNo);
      setTrelatedto(sendstatusdatas.TktType);
      setTdetails(sendstatusdatas.TkyCategory);
      setTassignedto(sendstatusdatas.AssignTo_Users);
      setTallodate(sendstatusdatas.Created_Date?.split("T")[0]);
      setTestmitateo(sendstatusdatas.DeadlineDate?.split("T")[0]);
      setTstatus(sendstatusdatas.Status);
      setticketnumber(false);
      setticketprops(true);
    }
  }, [sendstatusdatas]);

  const functionstatusdetails = (e, newValue) => {
    setTnumber(newValue);
    datas?.map((item, index) => {
      if (item.TktNo === newValue) {
        setModaldata(item);
        setTrelatedto(item.TktType);
        setTdetails(item.TkyCategory);
        setTassignedto(item.AssignTo_Users);
        setTallodate(item.Created_Date?.split("T")[0]);
        setTestmitateo(item.DeadlineDate?.split("T")[0]);
        setTstatus(item.Status);
      }
    });
  };

  const handleUpdateStatus = () => {
    if (Tstatus === "" || Tstatus === null || Tstatus === undefined) {
      toast.error("Enter Valid data");
    } else {
      let playload = {
        id: Modaldata.id,
        TktNo: Modaldata.TktNo,
        TktType: Modaldata.TktType,
        TkyCategory: Modaldata.TkyCategory,
        TktLevel: Modaldata.TktLevel,
        Name: Modaldata.Name,
        AllowcatedDate: Modaldata.AllowcatedDate,
        DeadlineDate: Modaldata.DeadlineDate,
        Status: Tstatus,
        Description: Modaldata.Description,
        AssignTo_Users: Modaldata.AssignTo_Users,
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
          if (res.data === "Updated sucessfully") {
            toast.success("Status Updated sucessfully");
          }
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };

  const handleClickBack = () => {
    if (setListticket) setListticket(true);
    if (setTicketstatus) setTicketstatus(false);
    navigate("/ticket/list-ticket");
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Div>
          <Typography sx={{ fontWeight: 600, fontSize: "18px" }}>
            Tickets
          </Typography>
          <Typography sx={[ComponentHeading]}>Tickets Status</Typography>
          <Formik initialValues={{}}>
            <Form>
              <Div className="row">
                <Div className="col-sm-12 col-md-7">
                  <Grid container gap={1} sx={{ mt: 3 }}>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{ display: ticketnumber === true ? "" : "none" }}
                      className="row"
                    >
                      <Typography className="input-label col-sm-12 col-md-4">
                        Ticket No <span className="required"> * </span>
                      </Typography>
                      <FormControl className="col-sm-12 col-md-8">
                        <Autocomplete
                          className="search-select"
                          name="date"
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
                          value={Tnumber}
                          onChange={(e, newValue) => {
                            functionstatusdetails(e, newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="date"
                              placeholder="Related to"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      md={12}
                      sx={{ display: ticketprops === true ? "" : "none" }}
                      className="row"
                    >
                      <Typography className="input-label col-sm-12 col-md-4">
                        Ticket No <span className="required"> * </span>
                      </Typography>
                      <TextField
                        value={Tnumber}
                        className="col-sm-12 col-md-8 "
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} md={12} mt={1} className="row">
                      <Typography className="input-label col-sm-12 col-md-4">
                        Ticket Related to <span className="required"> * </span>
                      </Typography>
                      <FormControl className="col-sm-12 col-md-8">
                        <Autocomplete
                          className="search-select"
                          name="date"
                          options={relateddatas}
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.value) {
                              return option?.value;
                            }
                            return "";
                          }}
                          value={Trelatedto}
                          onChange={(e, newValue) => {
                            setTrelatedto(newValue?.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="date"
                              placeholder="Related to"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={12} className="row">
                      <Typography className="input-label col-sm-12 col-md-4">
                        Details <span className="required"> * </span>
                      </Typography>
                      <TextField
                        value={Tdetails}
                        className="col-sm-12 col-md-8 multiline-box"
                        multiline
                        rows={3}
                        id="outlined-basic"
                        placeholder="Write a Details..."
                        variant="outlined"
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} md={12} className="row">
                      <Typography className="input-label col-sm-12 col-md-4">
                        Assigned to <span className="required"> * </span>
                      </Typography>

                      <TextField
                        value={Tassignedto}
                        className="col-sm-12 col-md-8 "
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} md={12} mb={1} className="row">
                      <Typography
                        className="input-label col-sm-12 col-md-4"
                        mt={1}
                      >
                        Allocated Date<span className="required"> * </span>
                      </Typography>
                      <TextField
                        type="date"
                        value={Tallodate}
                        className="col-sm-12 col-md-8 "
                        sx={{ height: "30px" }}
                        id="outlined-basic"
                        variant="outlined"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} md={12} mt={1} mb={1} className="row">
                      <Typography
                        className="input-label col-sm-12 col-md-4"
                        mt={1}
                      >
                        Estimated Date <span className="required"> * </span>
                      </Typography>
                      <TextField
                        value={Testmitate}
                        type="date"
                        className="col-sm-12 col-md-8 "
                        sx={{ height: "30px" }}
                        id="outlined-basic"
                        placeholder="Deadline date"
                        variant="outlined"
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} md={12} mt={1} className="row">
                      <Typography className="input-label col-sm-12 col-md-4">
                        Status <span className="required"> * </span>
                      </Typography>
                      <FormControl className="col-sm-12 col-md-8">
                        <Autocomplete
                          className="search-select"
                          name="date"
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
                          value={statusdatas.find(d => d.value === Tstatus) || null}
                          onChange={(e, newValue) => {
                            setTstatus(newValue?.value);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="date"
                              placeholder="Select Status"
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Div>
              </Div>
              <Div
                sx={{
                  mt: 5,
                  mb: { xs: 0, md: 4 },
                  mr: { xs: 0, md: 4 },
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  sx={[ButtonStyle, FontStyle, DialogBoxSaveButton, { mr: 1 }]}
                  onClick={handleUpdateStatus}
                >
                  Update
                </Button>
                <Button
                  sx={[ButtonStyle, FontStyle, DialogBoxCancelButton]}
                  onClick={handleClickBack}
                >
                  Cancel
                </Button>
              </Div>
            </Form>
          </Formik>
        </Div>
        <ToastContainer />
      </JumboContentLayoutMain>
    </>
  );
};
export default DeveloperTicket;
