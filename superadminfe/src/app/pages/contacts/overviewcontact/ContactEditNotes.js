import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import moment from "moment";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import {
  CRMTableHead,
  dialogTitle,
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton, DialogBox, SaveButton } from "app/pages/widgets/StylesComponents";

const ConatctEditNotes = ({
  id,
  update,
  openEditNotes,
  setOpenEditNotes,
  getData,
}) => {
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

  // For Edit Contact Notes
  const [openEditNotes1, setOpenEditNotes1] = useState(openEditNotes);
  console.log("openEditNotes1", typeof openEditNotes1);
  const [Notes, setNotes] = useState(update.Notes);
  const [save1, setsave1] = useState(update.Notes);

  useEffect(() => {
    setNotes(update.Notes);
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
      ContactNotes_Id: update.ContactNotes_Id,
      Contact_Id: update.Contact_Id,
      Notes: Notes,
      Active_Flag: update.Active_Flag,
      Is_Deleted: update.Is_Deleted,
      Created_Date: update.Created_Date,
      Updated_Date: moment().format("YYYY-MM-DD"),
      Organization_Id: update.Organization_Id,
      Created_By: update.Created_By,
      Updated_By: update.Updated_By,
    };
    console.log("payload", payload);
    axios
      .put(`${BASE_URL}/user/ContactNotesCRUD/`, payload, {
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
        setOpenEditNotes(false);
        getData();
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.ContactNotes_Id,
          Modified_By: `${editUser} Updated this Contact Notes.`,
          Module_Name: "Contact Notes",
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

  return (
    <>
      <Dialog
        open={openEditNotes}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"xs"}
        fullWidth
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={[CRMTableHead, DisplayFlex, dialogTitle]}
        >
          Edit Notes
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <TextField
                {...register("Notes")}
                className={`col-sm-12 multiline-box ${
                  errors.Notes ? "is-invalid" : ""
                }`}
                multiline
                rows={6}
                value={Notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                id="outlined-basic"
                placeholder="Enter your notes"
                variant="outlined"
                sx={{ fontSize: "12px" }}
              />
            </DialogContentText>
            {!Notes ? (
              <Div style={{ color: "red !important", fontSize: "12px" }}>
                {errors.Notes?.message}
              </Div>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            
            <CustomButton label="Update" type="submit" Icon="saveIcon"/>
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
          onClickNo={() => {
            setsave1(false);
            // handleReset();
          }}
          onClickYes={() => {
            setsave1(false);
            setOpenEditNotes(false);
            reset();
            setNotes("");
            // handleReset();
          }}
          open={save1}
        />

      
      </>
    </>
  );
};

export default ConatctEditNotes;
