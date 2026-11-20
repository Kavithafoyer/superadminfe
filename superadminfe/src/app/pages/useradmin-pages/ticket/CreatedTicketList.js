import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  Pagination,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CreateTickets from "./CreateTickets";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
import { Form, Formik } from "formik";
import { ComponentHeading, DisplayFlex } from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import SearchBar from "app/pages/widgets/SearchField";

const severitydatas = [
  { value: "Critical" },
  { value: "Major" },
  { value: "Minor" },
  { value: "Normal" },
];

function CreatedTicketList() {
  const createrId = localStorage.getItem("UserId");
  const navigate = useNavigate();

  const [datas, setDatas] = useState([]);

  const [createTickets, setCreateTickets] = useState(false);
  const [listTickets, setListTickets] = useState(true);
  const [updateTickets, setupdateTickets] = useState(false);

  const [relateddatas, setrelateddatas] = useState([]);
  const [Tnumber, setTnumber] = useState("");
  const [Trelatedto, setTrelatedto] = useState("");
  const [Tdetails, setTdetails] = useState("");
  const [Tseverity, setTseverity] = useState("");
  const [Testmitate, setTestmitateo] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Caller_Name", label: "Date", bool: true },
    { sort: "Month", label: "Ticket No", bool: true },
    { sort: "Month", label: "Related to", bool: false },
    { sort: "Plan_Id", label: "Ticket Details", bool: true },
    { sort: "Month", label: "Severity", bool: true },
  ]);

  const [page, setPage] = useState(1);

  const [ticketId, setTicketId] = useState("");

  const ShowCreateTicketsForm = () => {
    setCreateTickets(true);
    setListTickets(false);
    navigate("/ticket/create-ticket");
  };

  const GetSuperadminTicketRecords = () => {
    axios
      .get(`${BASE_URL}/superadmin/TicketAdditional/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        setDatas(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const handleDeleteCreatedTicket = (data) => {
    if (data?.id !== undefined) {
      axios
        .delete(`${BASE_URL}/superadmin/TicketCRUD/?id=${data.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          if (res.data === "Deleted Successfully") {
            toast.success(res.data);
            GetSuperadminTicketRecords();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleShowRequest = () => () => {
    let playload = {
      id: Tnumber,
      TicketRelatesto: Trelatedto,
      Details: Tdetails,
      Severity: Tseverity,
      RisedBy: createrId,
      DeadlineDate: Testmitate,
      Created_By: createrId,
      Updated_By: createrId,
    };
    if (!Trelatedto && !Tdetails && !Tseverity && !Testmitate) {
      toast.error("Invalid Data");
    } else {
      axios
        .put(`${BASE_URL}/superadmin/TicketCRUD/`, playload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((response) => {
          if (response.data === "Updated sucessfully") {
            toast.success(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleUpdateCreatedTicket = (data) => {
    setTicketId(data?.Ticket_Id);
    setTnumber(data?.id);
    setTrelatedto(data?.TicketRelatesto);
    setTdetails(data?.Details);
    setTseverity(data?.Severity);
    setTestmitateo(data?.DeadlineDate?.split("T")[0]);
    setupdateTickets(true);
    setListTickets(false);
  };

  const handleCreatTicketBack = () => {
    setupdateTickets(false);
    setListTickets(true);
  };

  useEffect(() => {
    GetSuperadminTicketRecords();
    LookupTicketrealatedrecords();
  }, []);

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: listTickets === true ? "block" : "none" }}>
          <Grid container alignItems={"center"} sx={{ my: 2 }}>
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
                <Typography sx={[ComponentHeading]}>Ticket Lists</Typography>
              </Div>
            </Grid>
            <Grid item xs={12} md={4} sm={12} xl={4}>
              <SearchBar
                width={"250px !important"}
                color={"black"}
                className=""
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
              <CustomButton
                label="Create"
                Icon="createIcon"
                onClick={ShowCreateTicketsForm}
              />
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
                <TableBody className="table-body" sx={{ mt: 2 }}>
                  {datas.length > 0 &&
                    datas?.map((data, index) => {
                      return (
                        <CRMTableRow key={index}>
                          {columnMenuItems[0]?.bool && (
                            <CRMTableCell data-title="Caller Name">
                              {data?.AllowcatedDate.split("T")[0]}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1].bool && (
                            <CRMTableCell data-title="Notification Id">
                              {data?.Ticket_Id}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2].bool && (
                            <CRMTableCell data-title="Notification Msg">
                              {data?.TicketRelatesto}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3].bool && (
                            <CRMTableCell data-title="Notification Source">
                              {data?.Details}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4].bool && (
                            <CRMTableCell data-title="Notification Source">
                              {data?.Severity}
                            </CRMTableCell>
                          )}

                          <CRMTableCell
                            data-title="Action"
                            sx={{
                              cursor: "pointer",
                            }}
                          >
                            <Div sx={{ display: "flex", flexDirection: "row" }}>
                              <IconButton
                                sx={{ padding: "0px" }}
                                size="small"
                                onClick={() => {
                                  handleUpdateCreatedTicket(data);
                                }}
                                className="edit-icon"
                              >
                                <BiEdit />
                              </IconButton>
                              <IconButton
                                size="small"
                                className="delete-icon"
                                onClick={() => {
                                  handleDeleteCreatedTicket(data);
                                }}
                              >
                                <MdDelete />
                              </IconButton>
                            </Div>
                          </CRMTableCell>
                        </CRMTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </JumboScrollbar>

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

        <Div sx={{ display: updateTickets === true ? "block" : "none" }}>
          <Div>
            <Typography sx={[ComponentHeading]}>Update Tickets</Typography>
            <Formik initialValues={{}}>
              <Form>
                <Div className="row">
                  <Div className="col-sm-12 col-md-7">
                    <Grid container gap={1} sx={{ mt: 3 }}>
                      <Grid item xs={12} md={12} className="row">
                        <Typography className="input-label col-sm-12 col-md-4">
                          Ticket Id
                        </Typography>
                        <TextField
                          value={ticketId}
                          className="col-sm-12 col-md-8 "
                          sx={{ height: "40px" }}
                          id="outlined-basic"
                          variant="outlined"
                          placeholder="# Ticket Id"
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={12} className="row">
                        <Typography className="input-label col-sm-12 col-md-4">
                          Ticket Number <span className="required"> * </span>
                        </Typography>
                        <TextField
                          value={Tnumber}
                          className="col-sm-12 col-md-8 "
                          sx={{ height: "40px" }}
                          id="outlined-basic"
                          variant="outlined"
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={12} className="row">
                        <Typography className="input-label col-sm-12 col-md-4">
                          Ticket Related to{" "}
                          <span className="required"> * </span>
                        </Typography>
                        <FormControl className="col-sm-12 col-md-8">
                          <Autocomplete
                            className="input-box2"
                            name="severity"
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
                            value={
                              relateddatas.find(
                                (d) => d.value === Trelatedto,
                              ) || null
                            }
                            onChange={(e, newValue) => {
                              setTrelatedto(newValue?.value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="date"
                                placeholder="Select Severity"
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
                          className="col-sm-12 col-md-8 multiline-box"
                          multiline
                          rows={3}
                          id="outlined-basic"
                          placeholder="Write a Details..."
                          variant="outlined"
                          value={Tdetails}
                          onChange={(e) => {
                            setTdetails(e.target.value);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={12} className="row">
                        <Typography className="input-label col-sm-12 col-md-4">
                          Severity <span className="required"> * </span>
                        </Typography>
                        <FormControl className="col-sm-12 col-md-8">
                          <Autocomplete
                            className="input-box2"
                            name="severity"
                            options={severitydatas}
                            getOptionLabel={(option) => {
                              if (typeof option === "string") {
                                return option;
                              }
                              if (option && option?.value) {
                                return option?.value;
                              }
                              return "";
                            }}
                            value={
                              severitydatas.find(
                                (d) => d.value === Tseverity,
                              ) || null
                            }
                            onChange={(e, newValue) => {
                              setTseverity(newValue?.value);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="date"
                                placeholder="Select Severity"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={12} mb={1} className="row">
                        <Typography
                          className="input-label col-sm-12 col-md-4"
                          mt={1}
                        >
                          Raised By <span className="required"> * </span>
                        </Typography>
                        <TextField
                          value={localStorage.getItem("UserType") || ""}
                          className="col-sm-12 col-md-8 "
                          sx={{ height: "40px" }}
                          id="outlined-basic"
                          variant="outlined"
                          disabled
                        />
                      </Grid>

                      <Grid item xs={12} md={12} className="row">
                        <Typography
                          className="input-label col-sm-12 col-md-4"
                          mt={1}
                        >
                          Estima Date <span className="required"> * </span>
                        </Typography>
                        <TextField
                          type="date"
                          className="col-sm-12 col-md-8 "
                          sx={{ height: "40px" }}
                          id="outlined-basic"
                          placeholder="Deadline date"
                          variant="outlined"
                          value={Testmitate}
                          onChange={(e) => {
                            setTestmitateo(e.target.value);
                          }}
                        />
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
                  <CustomButton
                    label="Save"
                    Icon="saveIcon"
                    onClick={handleShowRequest({
                      vertical: "top",
                      horizontal: "right",
                    })}
                  />

                  <Cancelbutton onClick={handleCreatTicketBack} />
                </Div>
              </Form>
            </Formik>
          </Div>
        </Div>
      </JumboContentLayoutMain>
      <Div sx={{ display: createTickets === true ? "block" : "none" }}>
        <CreateTickets
          setCreateTickets={setCreateTickets}
          setListTickets={setListTickets}
        />
      </Div>
      <ToastContainer />
    </>
  );
}

export default CreatedTicketList;
