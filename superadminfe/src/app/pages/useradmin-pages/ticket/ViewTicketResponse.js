import Div from "@jumbo/shared/Div";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";

const ViewTicketResponse = ({ setViewTickets, setListTickets, prop }) => {
  const createrId = localStorage.getItem("UserId");
  const token = localStorage.getItem("accesstoken");
  const navigate = useNavigate();

  const [rows, setrows] = useState([]);

  const [ticketRel, setticketRel] = useState("");
  const [ticketSeverity, setticketSeverity] = useState("");
  const [ticketTime, setticketTime] = useState("");
  const [ticketStatus, setticketStatus] = useState("");
  const [ticketDescription, setticketDescription] = useState("");
  const [ticketResponse, setticketResponse] = useState("");

  const [statusdatas, setstatusdatas] = useState([]);

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

  useEffect(() => {
    LookupTicketStatusrecords();
  }, []);

  useEffect(() => {
    console.log(prop);
    if (prop != undefined && prop.length != 0) {
      getResponseRecords();
      setticketRel(prop.TktType);
      setticketTime(prop.DeadlineDate);
      setticketSeverity(prop.TktLevel);
      setticketStatus(prop.Status);
      setticketDescription(prop.Description);
    }
  }, [prop]);
  const getResponseRecords = () => {
    axios
      .get(`${BASE_URL}/superadmin/TicketResponselist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        let Id = res.data.results;
        if (Id.length !== 0) {
          let arr = res.data.results;
          let valueArr = [];

          arr.map((item, index) => {
            console.log(item.Ticketid.TktNo);
            if (item.Ticketid.TktNo === prop.TktNo) {
              valueArr.push(item);
            }
          });
          setrows(valueArr);
          console.log(rows);
        }
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const handleClickBack = () => {
    navigate("/ticket/list-ticket");
    if (setListTickets) setListTickets(true);
    if (setViewTickets) setViewTickets(false);
  };

  const handleSubmite = () => {
    if (
      ticketResponse === "" ||
      ticketResponse === undefined ||
      ticketResponse === null ||
      ticketResponse.length === 0
    ) {
      toast.error("Invalid Data ");
    } else {
      let playload = {
        TicketResponseDetailsCustomer: ticketResponse,
        Response_By: "Account Manager",
        Ticketid: prop.id,
        Created_By: createrId,
        Updated_By: createrId,
      };
      console.log(playload);
      axios
        .post(`${BASE_URL}/superadmin/TicketResponse/`, playload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          if (res.data == "Ticket Response Done") {
            toast.success("Response  Created Successfully");
            getResponseRecords();
            setticketResponse("");
          }
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };
  return (
    <>
      <Div>
        <Typography variant="h2" sx={{ fontWeight: 600 }}>
          Ticket Response
        </Typography>

        <Div className="row">
          <Div className="col-md-6">
            <Grid container>
              <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                <Typography className="col-md-5 input-label" sx={{ mt: 2 }}>
                  Ticket Related to <span className="required">*</span>
                </Typography>
                <TextField
                  className="col-md-6 input-box"
                  id="outlined-basic"
                  placeholder="Ticket Related to"
                  variant="outlined"
                  value={ticketRel}
                  disabled
                />
              </Grid>

              <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                <Typography
                  className="col-sm-8 col-md-5 input-label"
                  sx={{ mt: 2 }}
                >
                  Estimated Date <span className="required">*</span>
                </Typography>
                <TextField
                  className="col-md-6 input-box"
                  id="outlined-basic"
                  placeholder="Elapsed Time"
                  variant="outlined"
                  value={ticketTime?.split("T")[0] || ""}
                  disabled
                />
              </Grid>
            </Grid>
          </Div>

          <Div className="col-md-6">
            <Grid container>
              <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                <Typography className="col-md-5 input-label" sx={{ mt: 2 }}>
                  Ticket Severity
                </Typography>
                <TextField
                  className="col-md-6 input-box"
                  id="outlined-basic"
                  placeholder="Ticket Severity"
                  variant="outlined"
                  value={ticketSeverity}
                  disabled
                />
              </Grid>

              <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                <Typography className="col-md-5 input-label" sx={{ mt: 2 }}>
                  Ticket Status <span className="required">*</span>
                </Typography>

                <FormControl className="col-md-6 input-box">
                  <Select
                    value={ticketStatus}
                    className="react-select-box input-box"
                    sx={{ height: "40px" }}
                    disabled
                  >
                    {statusdatas &&
                      statusdatas.map((item, index) => (
                        <MenuItem key={index} value={item.value}>{item.value}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Div>
          <Grid container>
            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography
                className="col-sm-12 col-md-2 input-label"
                sx={{ mt: 2 }}
              >
                Ticket Description
              </Typography>
              <TextField
                className="col-12 mutiline-box"
                id="outlined-basic"
                placeholder="Write a Dexcription..."
                multiline
                rows={3}
                variant="outlined"
                value={ticketDescription}
                sx={{
                  ml: { xs: 0, md: 1.4 },
                  minWidth: "160px",
                  maxWidth: "1123px",
                }}
                disabled
              />
            </Grid>

            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography
                className="col-sm-12 col-md-2 input-label"
                sx={{ mt: 2 }}
              >
                Response
              </Typography>
              <TextField
                className="col-12 mutiline-box"
                id="outlined-basic"
                placeholder="Write a Response..."
                multiline
                rows={3}
                variant="outlined"
                value={ticketResponse}
                onChange={(e) => {
                  setticketResponse(e.target.value);
                }}
                sx={{
                  ml: { xs: 0, md: 1.4 },
                  minWidth: "160px",
                  maxWidth: "1123px",
                }}
              />
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={11.4} sx={{ ml: 1.5, mt: 2 }}>
              <Typography className="input-label">Response History</Typography>
              <Table className="table">
                <TableHead className="table-head">
                  <TableRow>
                    <TableCell>Response No.</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Response</TableCell>
                    <TableCell>Response by</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                    rows.map((data, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {data.Ticketresponseid}
                          </TableCell>
                          <TableCell>{data.TicketResponseDateTime}</TableCell>
                          <TableCell>
                            {data.TicketResponseDetailsCustomer}
                          </TableCell>
                          <TableCell>{data.Response_By}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Div>
      </Div>
      <Div sx={{ mt: 5 }}>
        <Button
          className="save-buttonuser"
          sx={{ mr: 3 }}
          onClick={handleSubmite}
        >
          Submit
        </Button>
        <Button className="cancel-buttonuser" onClick={handleClickBack}>
          Cancel
        </Button>
      </Div>
      <ToastContainer />
    </>
  );
};

export default ViewTicketResponse;
