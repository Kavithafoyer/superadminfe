import React, { memo } from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import { HiOutlineSearch } from "react-icons/hi";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import {
  ButtonStyle,
  CRMTableHead,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  dialogTitle,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
} from "app/pages/widgets/StylesComponents";

const AccountNotesEdit = ({
  id,
  update,
  openEditNotes,
  setOpenEditNotes,
  getData,
}) => {
  const [save, setsave] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);

  // For Edit Contact Notes
  const [openEditNotes1, setOpenEditNotes1] = useState(openEditNotes);
  console.log("openEditNotes1", typeof openEditNotes1);
  const [Notes, setNotes] = useState(update.Notes);

  useEffect(() => {
    setNotes(update.Notes);
  }, [update]);
  console.log("update", update);

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

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const onsubmit = () => {
    console.log("in submit", Notes);
    var payload = {
      id: update.id,
      AccountNotes_Id: update.AccountNotes_Id,
      Subject: update.Subject,
      Notes: Notes,
      Active_Flag: true,
      Is_Deleted: false,
      Created_Date: update.Created_Date,
      Updated_Date: new Date().toISOString(),
      Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      Account_Id: update.Account_Id,
      Created_By: update.Created_By,
      Updated_By: parseInt(localStorage.getItem("UserId")),
    };
    console.log("payload", payload);
    axios
      .put(`${BASE_URL}/superadmin/AccountNotesCRUD/`, payload, {
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
          autoClose: 100,
        });
        setNotes("");
        setOpenEditNotes(false);
        getData();
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: update.AccountNotes_Id,
          Modified_By: `${editUser} Updated this Account Notes.`,
          Module_Name: "Account Notes",
          Account_Id: Number(id.id),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/superadmin/AccountHistorycrud/`, histotypayload, {
            headers: {
              db: "crmuseradmin1",
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
        <DialogContent>
          <form onSubmit={handleSubmit(onsubmit)}>
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
            <DialogActions
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <CustomButton type="submit" Icon="saveIcon" label="Update" />
              <Cancelbutton
                onClick={() => {
                  setsave(true);
                }}
              />
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <>
        {/* close dialog box */}
        <DialogBox
          onClickNo={() => {
            setsave(false);
            // handleReset();
          }}
          onClickYes={() => {
            setsave(false);
            setOpenEditNotes(false);
            reset();
            setNotes("");
            // handleReset();
          }}
          open={save}
        />
      </>
    </>
  );
};

export default memo(AccountNotesEdit);
