import React from 'react'
import { useState, useEffect } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { Avatar, Badge, Button, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, TextField, Typography, Menu, MenuItem, DialogTitle, Grid } from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import Div from '@jumbo/shared/Div';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from 'app/services/auth-services';
import { ButtonStyle, CRMTableHead, ComponentHeading, DialogBoxCancelButton, DialogBoxSaveButton, DialogHeader, DisplayFlex, FontStyle, dialogTitle } from 'app/pages/widgets/CRMStyles';
import SearchBar from 'app/pages/widgets/SearchField';
import { Cancelbutton, CustomButton, DialogBox } from 'app/pages/widgets/StylesComponents';


const AccountAppointmentEdit = ({ id, update, showEditDialog, setShowEditDialog, getData }) => {
  // Edit Functionality
  const [showAddCancel, setShowAddcancel] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1"

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
  })

  const onsubmit = () => {
    var payload = {
      "id": update.id,
      "AccountMeeting_Id": update.AccountMeeting_Id,
      "ToDate_Time": todate,
      "FromDate_Time": fromdate,
      "Date": date,
      "Location": location,
      "Venue": venue,
      "Account_Id": Number(id.id),
      "Organization_Id": update.Organization_Id,
      "Created_By": update.Created_By,
      "Updated_By": update.Updated_By
    }
    axios.put(`${BASE_URL}/superadmin/AccountMeetingCRUD/`, payload,
      {
        headers: {
          "db": item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 100
        });
        setDate("");
        setVenue("");
        setLocation("");
        setFromdate("");
        setTodate("");
        getData();
         let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: update?.AccountMeeting_Id,
          Updated_Person: `${editUser} Updated this Account Appointment.`,
          Module_Name: "Account Appointment",
          Account_Id: Number(id.id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        }
        console.log("histotypayload", histotypayload)
        axios
          .post(
            `${BASE_URL}/superadmin/AccountHistorycrud/`, histotypayload
            ,
           { headers: {
              "db": "crmuseradmin1",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },}
          )
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });

        setShowEditDialog(false);
      }).catch((error)=>{
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 100,
          });
        }
      })
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    setTimeout(() => {
      setDate(update.Date);
      setVenue(update.Venue);
      setLocation(update.Location);
      setFromdate(update.FromDate_Time);
      setTodate(update.ToDate_Time);
    }, 2000);
  }, [update])



  return (
    <>

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
              <DialogContent>
            <form onSubmit={handleSubmit(onsubmit)}>
                <DialogContentText>
                  <Grid container >
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography  id='Typography-root' sx={[FontStyle]}>
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
                      <Typography  id='Typography-root' sx={[FontStyle]}>
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
                      <Typography  id='Typography-root' sx={[FontStyle]}>
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
                      <Typography  id='Typography-root' sx={[FontStyle]}>
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
                      <Typography  id='Typography-root' sx={[FontStyle]}>
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
             
              <DialogActions>
                <Div sx={[DisplayFlex, { justifyContent: "center", gap: "10px" }]}>
                <CustomButton label='Update' type='submit' Icon='saveIcon' />
    
                  <Cancelbutton
                    onClick={() => {
                      setShowAddcancel(true);
                      reset();
                    }}
                  />
                </Div>
              </DialogActions>
    
           
            </form>
            </DialogContent>
          </Dialog>
       {/* close dialog */}
       <DialogBox
                open={showAddCancel}
                onClickNo={() => setShowAddcancel(false)}
                onClickYes={() => {
                  setShowAddcancel(false);
                  setShowEditDialog(false);
                  setLocation("");
                  setVenue("");
                  setFromdate("");
                  setTodate("");
                }}
              />
        </>
    
      </>)
}

export default AccountAppointmentEdit;