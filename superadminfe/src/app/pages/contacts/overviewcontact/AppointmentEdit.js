import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
  DialogTitle,
  Grid,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import moment from "moment";

import {
  CRMTableHead,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  SaveButton,
} from "app/pages/widgets/StylesComponents";

const AppointmentEdit = ({
  id,
  update,
  showEditDialog,
  setShowEditDialog,
  getData,
}) => {
  // Edit Functionality
  console.log("local", update);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const [showAddCancel, setShowaddcancel] = useState(update.Date);
  const [date, setDate] = useState(update.Date);
  const [venue, setVenue] = useState(update.Venue);
  const [location, setLocation] = useState(update.Location);
  const [fromdate, setFromdate] = useState(update.FromDate_Time);
  const [todate, setTodate] = useState(update.ToDate_Time);

  const validationSchema = yup.object({
    date: yup.string().required("Date is required"),
    venue: yup.string().required("venue is required"),
    location: yup.string().required("Location is required"),
    fromdate: yup.string().required("From Date is required"),
    todate: yup.string().required("From Date is required"),
  });

  const onsubmit = () => {
    var payload = {
      id: update.id,
      ContactMeeting_Id: update.ContactMeeting_Id,
      ToDate_Time: todate,
      FromDate_Time: fromdate,
      Date: date,
      Location: location,
      Venue: venue,
      Contact_Id: update.Contact_Id,
      Created_Date: update.Created_Date,
      Updated_Date: moment().format("YYYY-MM-DD"),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    axios
      .put(`${BASE_URL}/user/ContactMeetingCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
        setShowEditDialog(false);
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.ContactMeeting_Id,
          Modified_By: `${editUser} Updated this Contact Appointment.`,
          Module_Name: "Contact Appointment",
          Contact_Id: update.Contact_Id,
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      }).catch((error)=>{
        if (error.response && error.response.status === 403) {
          const errorMessage = error.response.data.details || "You don't have permission to do it";
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    // setTimeout(() => {
    setDate(update.Date);
    setVenue(update.Venue);
    setLocation(update.Location);
    setFromdate(update.FromDate_Time);
    setTodate(update.ToDate_Time);
    // }, 2000);
  }, [update, showEditDialog]);

  return (
    <>
      <Dialog
        fullwidth
        maxWidth="xs"
        open={showEditDialog}
        // onClose={() => setShowEditDialog(false)}
        // aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle sx={[CRMTableHead, DisplayFlex, dialogTitle]}>
          Edit Appointment
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                  <Typography  id='Typography-root' mb={0.1} sx={[FontStyle]}>
                    Location
                  </Typography>
                  <TextField
                    {...register("location")}
                    className={`input-box col-12 ${
                      errors.date ? "is-invalid" : ""
                    }`}
                    // size={"small"}
                    value={location}
                    defaultValue={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                    }}
                    placeholder={"Enter location"}
                  />
                  <Div className="row" style={{ color: "red" }}>
                    {errors.location?.message}
                  </Div>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Typography  id='Typography-root' mb={0.1} sx={[FontStyle]}>
                    Venue
                  </Typography>
                  <TextField
                    {...register("venue")}
                    className={`input-box col-12  ${
                      errors.venue ? "is-invalid" : ""
                    }`}
                    size={"small"}
                    value={venue}
                    onChange={(e) => {
                      setVenue(e.target.value);
                    }}
                    placeholder={"Enter venue"}
                  />
                  <Div style={{ color: "red" }}>{errors.venue?.message}</Div>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Typography  id='Typography-root' mb={0.1} sx={[FontStyle]}>
                    Expected Date
                  </Typography>
                  <TextField
                    {...register("date")}
                    className={`input-box col-12  ${
                      errors.location ? "is-invalid" : ""
                    }`}
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                    placeholder={"Expected Date"}
                  />
                  <Div style={{ color: "red" }}>{errors.date?.message}</Div>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Typography  id='Typography-root' mb={0.1} sx={[FontStyle]}>
                    From Time
                  </Typography>
                  <TextField
                    {...register("fromdate")}
                    className={`input-box col-12  ${
                      errors.fromdate ? "is-invalid" : ""
                    }`}
                    type="time"
                    value={fromdate}
                    onChange={(e) => {
                      setFromdate(e.target.value);
                    }}
                    placeholder={"From Time"}
                  />
                  <Div style={{ color: "red" }}>{errors.fromdate?.message}</Div>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <Typography  id='Typography-root' mb={0.1} sx={[FontStyle]}>
                    To Time
                  </Typography>
                  <TextField
                    {...register("todate")}
                    className={`input-box col-12  ${
                      errors.todate ? "is-invalid" : ""
                    }`}
                    type="time"
                    value={todate}
                    onChange={(e) => {
                      setTodate(e.target.value);
                    }}
                    placeholder={"To Time"}
                  />
                  <Div style={{ color: "red" }}>{errors.todate?.message}</Div>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Div sx={[DisplayFlex, { justifyContent: "center", gap: "10px" }]}>
              <CustomButton label="Save" Icon="saveIcon" type="submit"/>
              <Cancelbutton
                onClick={() => {
                  setShowaddcancel(true);
                  reset();
                }}
              />
            </Div>
          </DialogActions>

          {/* close dialog */}
          <DialogBox
            open={showAddCancel}
            onClickNo={() => setShowaddcancel(false)}
            onClickYes={() => {
              setShowaddcancel(false);
              setShowEditDialog(false);
              setLocation("");
              setVenue("");
              setFromdate("");
              setTodate("");
            }}
          />
        </form>
      </Dialog>

    
    </>
  );
};

export default AppointmentEdit;
