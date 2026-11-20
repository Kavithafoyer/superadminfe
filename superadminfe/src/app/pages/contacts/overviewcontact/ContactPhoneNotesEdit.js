import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Autocomplete,
  Grid,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import moment from "moment";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import {
  CRMTableHead,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  DialogBox,
  CustomButton,
  SaveButton,
} from "app/pages/widgets/StylesComponents";

const ContactPhoneNotesEdit = ({
  id,
  update,
  openEditNotes,
  setOpenEditNotes,
  getData,
}) => {
  // Contact Phone Data
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const item = "crmuseradmin1";

  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);

  const [contactdatas, setContactDatas] = useState([]);

  const getContactData = () => {
    axios
      .get(`${BASE_URL}/user/ContactCRUD/?id=${update.Contact_Id}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res", res.data);
        setContactDatas(res.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getContactData();
  }, []);

  // For Edit Contact Notes
  console.log("update", update);

  const [openEditNotes1, setOpenEditNotes1] = useState(openEditNotes);

  console.log("openEditNotes1", typeof openEditNotes1);
  const [Notes, setNotes] = useState(update.Details);
  const [status, setStatus] = useState(update.Select_Status);
  const [nextdate, setNextdate] = useState(update?.Next_SheduledTime);
  const [duration, setDuration] = useState(update?.Call_Duration);
  const [callcontext, setCallContext] = useState(update?.Call_Context);
  const [busy, setBusy] = useState(update?.Call_Busy_hour);
  const [callconvstatus, setCallconvstatus] = useState(update?.Call_Busy_hour);

  const option = [
    "Connected",
    "Customer Missed",
    "Voice mail",
    "Busy",
    "Disconnect",
    "Missed call",
    "Call waiting",
    "Confidence call",
    "Call attended",
    "Do Not Disturb Turned On",
    "Call Not Picked",
    "Called Back",
  ];

  const contaxtoptions = [
    "Solving Problem",
    "Making Decision",
    "Solution Achieved",
  ];
  const callconvoptions = [
    "Casual",
    "Tension",
    "Not Interested",
    "Friendly",
    "Confidancial",
  ];

  const BusyHroptions = ["Morning", "Evening", "After Noon"];
  const [save1, setsave1] = useState(update.Notes);

  useEffect(() => {
    setNotes(update?.Details);
    setStatus(update?.Select_Status);
    setNextdate(update?.Next_SheduledTime?.split(":00")[0]);
    setDuration(update?.Call_Duration);
    setCallContext(update?.Call_Context);
    setBusy(update?.Call_Busy_hour);
    setCallconvstatus(update?.Call_Con_Status);
    // console.log("Next_SheduledTime",update?.Next_SheduledTime);
  }, [update, openEditNotes]);

  const validationSchema = yup.object({
    Notes: yup.string().required("Notes is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onsubmit = () => {
    console.log("in submit", Notes);
    var payload = {
      id: update.id,
      CallCenter_Id: update.CallCenter_Id,
      Company_Name: update.Company_Name,
      Activity_relates: update.Activity_relates,
      Receiver_Name: update.Receiver_Name,
      Details: Notes,
      Contact_Number: update.Contact_Number,
      Selected_Date: update.Selected_Date,
      Select_Status: status,
      Next_SheduledTime: nextdate,
      Call_Duration: duration,
      Call_Context: callcontext,
      Call_Con_Status: callconvstatus,
      Call_Busy_hour: busy,
      Activity_Type: update.Activity_Type,
      Contact_Id: update.Contact_Id,
      Updated_Date: moment().format("YYYY-MM-DD"),
      Active_Flag: update.Active_Flag,
      Is_Deleted: update.Is_Deleted,
      Organization_Id: update.Organization_Id,
      Created_By: update.Created_By,
      Updated_By: update.Updated_By,
    };
    console.log("payload", payload);
    axios
      .put(`${BASE_URL}/user/CallcenterActivityCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        //  console.log("res", res);
        toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        setOpenEditNotes(false);
        getData();
        let payload1 = {
          id: Number(update.Contact_Id),
          Last_Call_Date: moment().format("YYYY-MM-DD"),
          Last_Called_By: userDetails && userDetails?.username,
          No_of_Calls: `${
            contactdatas?.No_of_Calls === null
              ? 1
              : Number(contactdatas?.No_of_Calls) + 1
          }`,
        };
        axios
          .patch(`${BASE_URL}/user/ContactCRUD/`, payload1, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((re) => {
            console.log("res", re);
          })
          .catch((error) => {
            console.log("error", error);
          });

        // History Update Record
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.CallCenter_Id,
          Modified_By: `${editUser} Updated this Contact Phone History.`,
          Module_Name: "Contact Phone History",
          Contact_Id: update.Contact_Id,
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, header)
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  return (
    <>
      <Dialog
        open={openEditNotes}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // onClose={() => setOpenEditNotes(false)}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={[CRMTableHead, DisplayFlex, dialogTitle]}
        >
          Edit Call Notes
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Call Status
                  </Typography>
                  <Autocomplete
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.value) {
                        return option?.value;
                      }
                      return "";
                    }}
                    options={option}
                    value={status}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setStatus(newValue);
                    }}
                    id="outlined-basic"
                    className="search-select col-12"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          borderRadius: "10px",
                        }}
                        placeholder="Call Status"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Call context
                  </Typography>
                  <Autocomplete
                    className="search-select"
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.value) {
                        return option?.value;
                      }
                      return "";
                    }}
                    value={callcontext}
                    options={contaxtoptions}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setCallContext(newValue);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          borderRadius: "10px",
                        }}
                        placeholder="Call Context"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Call Busy Hour
                  </Typography>
                  <Autocomplete
                    className="search-select"
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.value) {
                        return option?.value;
                      }
                      return "";
                    }}
                    value={busy}
                    options={BusyHroptions}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setBusy(newValue);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          borderRadius: "10px",
                        }}
                        placeholder="Call Busy Hour"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Call Coversation Status
                  </Typography>
                  <Autocomplete
                    className="search-select"
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.value) {
                        return option?.value;
                      }
                      return "";
                    }}
                    value={callconvstatus}
                    options={callconvoptions}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setCallconvstatus(newValue);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          borderRadius: "10px",
                        }}
                        placeholder="Call Status"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Call Duration
                  </Typography>
                  <TextField
                    className="col-12 input-box"
                    onChange={(e) => {
                      setDuration(e.target.value);
                    }}
                    placeholder="Enter Call Duration"
                    type="number"
                    value={duration}
                    InputProps={{
                      endAdornment: (
                        <Div sx={{ paddingLeft: "100px !important" }}>
                          {" "}
                          Minutes
                        </Div>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Next Scheduled Date
                  </Typography>
                  <TextField
                    type="datetime-local"
                    value={nextdate}
                    onChange={(e) => {
                      setNextdate(e.target.value);
                    }}
                    id="outlined-basic"
                    variant="outlined"
                    className="input-box col-12"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Typography id="Typography-root" sx={[FontStyle]}>
                    Notes
                  </Typography>
                  <TextField
                    {...register("Notes")}
                    className={`col-12 multiline-box ${
                      errors.Notes ? "is-invalid" : ""
                    }`}
                    multiline
                    rows={4}
                    value={Notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                    id="outlined-basic"
                    placeholder="Enter your notes"
                    variant="outlined"
                    sx={{ fontSize: "12px" }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
            {!Notes ? (
              <Div style={{ color: "red !important", fontSize: "12px" }}>
                {errors.Notes?.message}
              </Div>
            ) : null}
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <CustomButton label="Update" type="submit" Icon="saveIcon" />
            <Cancelbutton
              onClick={() => {
                setsave1(true);
              }}
            />
          </DialogActions>
        </form>
      </Dialog>
      <>
        {/* close dialog box */}

        <DialogBox
          open={save1}
          onClickNo={() => setsave1(false)}
          onClickYes={() => {
            setsave1(false);
            setOpenEditNotes(false);
            reset();
            setNotes("");
          }}
        />
      </>
    </>
  );
};

export default ContactPhoneNotesEdit;
