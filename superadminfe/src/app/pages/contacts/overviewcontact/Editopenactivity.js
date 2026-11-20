import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import moment from "moment";
import {
  CRMTableHead,
  dialogTitle,
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton, DialogBox, SaveButton } from "app/pages/widgets/StylesComponents";

const Editopenactivity = ({ id, getData, update, showEdit, setShowEdit }) => {
  console.log("id", id);
  const [taskname, setTaskname] = useState(update.Task);
  const [taskdescription, setTaskdescription] = useState(
    update.Task_Description
  );
  const [date, setDate] = useState(update.Expected_Date);
  const [time, setTime] = useState(update.Expected_Time);
  const [showAddCancel, setShowcancel] = useState(false);
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const validationSchema = yup.object({
    taskname: yup.string().required("Task Name is required"),
    taskdescription: yup.string().required("Task Description is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
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
    var payload = {
      id: update.id,
      ContactActivities_Id: update.ContactActivities_Id,
      Task: taskname,
      Task_Description: taskdescription,
      Expected_Date: date,
      Expected_Time: time,
      Created_Date: update.Created_Date,
      Updated_Date: moment().format("YYYY-MM-DD"),
      Activity_Type: update.Activity_Type,
      Contact_Id: update?.Contact_Id?.id,
      Active_Flag: update.Active_Flag,
      Is_Deleted: update.Is_Deleted,
      Organization_Id: update?.Organization_Id?.id,
      Created_By: update?.Created_By?.id,
      Updated_By: update.Updated_By?.id,
    };
    axios
      .put(`${BASE_URL}/user/ContactActivitiesCRUD/`, payload, {
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
        setShowEdit(false);
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.ContactActivities_Id,
          Modified_By: `${editUser} Updated this Contact Activity.`,
          Module_Name: "Contact Activity",
          Contact_Id: update?.Contact_Id?.id,
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
      })
      .catch((error) => {
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

  useEffect(() => {
    setTaskname(update.Task);
    setTaskdescription(update.Task_Description);
    setDate(update.Expected_Date);
    setTime(update.Expected_Time);
  }, [update, showEdit]);
  return (
    <>
      <Dialog
        open={showEdit}
        // onClose={() => setShowEdit(false)}
        // aria-labelledby="draggable-dialog-title"
        maxWdith="xs"
        fullWidth
      >
        <DialogTitle sx={[CRMTableHead, DisplayFlex, dialogTitle]}>
          Edit Activities
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText
              sx={{
                mt: 1,
              }}
            >
              <Grid container spacing={2}>
                <Grid xs={12} md={12} lg={12} xl={12} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography  id='Typography-root'
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "black",
                        mb: 0.2,
                      }}
                    >
                      Task Name
                    </Typography>
                    <TextField
                      {...register("taskname")}
                      className={`input-box col-12 ${
                        errors.taskname ? "is-invalid" : ""
                      }`}
                      value={taskname}
                      onChange={(e) => {
                        setTaskname(e.target.value);
                      }}
                      size={"small"}
                      placeholder={"Enter task name"}
                    />
                    <Div style={{ color: "red" }}>
                      {errors.taskname?.message}
                    </Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={6} lg={6} xl={6} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography  id='Typography-root'
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "black",
                        mb: 0.2,
                      }}
                    >
                      Expected Date
                    </Typography>
                    <TextField
                      {...register("date")}
                      className={`input-box col-12 ${
                        errors.date ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      value={date}
                      type="date"
                      placeholder={"Expected Date"}
                    />
                    <Div style={{ color: "red" }}>{errors.date?.message}</Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={6} lg={6} xl={6} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography  id='Typography-root'
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "black",
                        mb: 0.2,
                      }}
                    >
                      Expected Time
                    </Typography>
                    <TextField
                      {...register("time")}
                      className={`input-box col-12 ${
                        errors.time ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                      value={time}
                      type="time"
                      placeholder={"Expected Time"}
                    />
                    <Div style={{ color: "red" }}>{errors.time?.message}</Div>
                  </Div>
                </Grid>

                <Grid xs={12} md={12} lg={12} xl={12} sx={{ p: 1 }}>
                  <Div sx={{ width: "100%" }}>
                    <Typography  id='Typography-root'
                      mb={0.1}
                      sx={{
                        fontWeight: 500,
                        fontSize: "12px",
                        color: "black",
                        mb: 0.2,
                      }}
                    >
                      Task Description
                    </Typography>
                    <TextField
                      {...register("taskdescription")}
                      className={`multiline-box col-12 ${
                        errors.taskdescription ? "is-invalid" : ""
                      }`}
                      multiline
                      onChange={(e) => {
                        setTaskdescription(e.target.value);
                      }}
                      value={taskdescription}
                      rows={3}
                      maxRows={10}
                      placeholder={"Enter task description..."}
                    />
                    <Div style={{ color: "red" }}>
                      {errors.taskdescription?.message}
                    </Div>
                  </Div>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Grid container align="center" spacing={2} pb={2}>
              <Grid
                item
                align="center"
                justifyContent={"center"}
                xs={12}
                lg={12}
              >
                <Div
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <CustomButton Icon="saveIcon" label="Save" type="submit"/>
                  <Cancelbutton
                    onClick={() => {
                      setShowcancel(true);
                      reset();
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>

      {/* showaddcancel */}
      <DialogBox
        open={showAddCancel}
        onClickNo={() => setShowcancel(false)}
        onClickYes={() => {
          setShowcancel(false);
          setShowEdit(false);
          setTime("");
          setDate("");
          setTaskdescription("");
          setTaskname("");
        }}
      />
    </>
  );
};

export default Editopenactivity;
