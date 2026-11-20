import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import {
  DisplayFlex,
  input_label,
  dialogFontSize,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import { Grid, TextField, Typography, Box } from "@mui/material";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Cancelbutton,
  CustomButton,
  Customgrid,
  Div,
  errorFilter,
  TextEditor,
} from "app/pages/widgets/StylesComponents";
import { contactAddNoteSubmit, contactEditNoteSubmit } from "./APIs";
import { toast } from "react-toastify";
import { data01 } from "app/pages/charts/Pie/components/data";
import { fetchTransactionSeries } from "../../widgets/StylesComponents";
import ReactQuill from "react-quill";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function NotesModel({
  setOpen,
  label = "Add",
  data,
  setOpenNotes,
  endpoint,
  extraPayload,
  historyEndpoint,
  name,
  getData,
}) {
  const [FormId, setFormId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [seriesValue, setSeriesValue] = React.useState("");

  const handleEditorChange = (event, editor) => {
    const value = editor.getData();
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    setNotes(value);
  };
  const validate = () => {
    let error = {};

    if (!Boolean(subject)) {
      error.subject = "is required";
    }
    if (!Boolean(notes)) {
      error.notes = "is required";
    }

    return error;
  };

  // < --------------------------------------- submit function -------------------------------- >
  const handleSubmit = () => {
    let error = validate();
    setErrors(error);

    console.log(
      "Submit ---------- - - - - - -- -  -- - - ->",
      extraPayload,
      data
    );

    if (Object.keys(error).length == 0 && Boolean(data?.id)) {
      label === "Add"
        ? contactAddNoteSubmit(
          { notes, subject, seriesValue, FormId },
          setOpenNotes,
          endpoint,
          historyEndpoint,
          extraPayload,
          getData
        )
        : contactEditNoteSubmit(
          {
            notes,
            subject,
            id: data?.id,
            AccountNotes_Id: data?.AccountNotes_Id,
            Created_Date: data?.Created_Date,
            Created_By: data?.Created_By,
          },
          setOpenNotes,
          endpoint,
          historyEndpoint,
          extraPayload,
          getData
        );
      setOpen(false);
    } else if (!Boolean(data?.id)) {
      toast.error(error?.meesage, {
        position: "top-right",
        autoClose: 2000,
      });
    }
    console.log("2Error", error);
  };

  React.useEffect(async () => {
    let findFormId = "";
    let findFormKey = "";
    let findSeriesValue = "";

    if (label?.toLocaleLowerCase() === "edit") {
      setSubject(data?.Subject);
      setNotes(data?.Notes);
    }

    // for check transaction series

    if (name?.label == "Lead Name") {
      // Leads
      findFormId = data?.LeadNotes_Id;
      findFormKey = "LeadNotes_Id";
      findSeriesValue = "UserLeadNotes";
    } else if (name?.label == "Account Name") {
      // Accounts
      findFormId = data?.AccountNotes_Id;
      findFormKey = "AccountNotes_Id";
      findSeriesValue = "Account_Notes";
    } else if (name?.label == "Deal Name") {
      // Deals
      findFormId = data?.DealNotes_Id;
      findFormKey = "DealNotes_Id";
      findSeriesValue = "Deal_Notes";
    } else {
      // Contacts
      findFormId = data?.ContactNotes_Id;
      findFormKey = "ContactNotes_Id";
      findSeriesValue = "Contact_Notes";
    }

    setFormId(findFormKey);

    const series = await fetchTransactionSeries(findSeriesValue || "");
    console.log("series", series);
    setSeriesValue(series);
  }, [data, name]);

  const cancelFunc = () => {
    if (label === "Add") {
      if (Boolean(subject?.trim()) || Boolean(notes?.trim())) {
        setOpen("note");
      } else {
        setOpenNotes(false);
      }
    } else {
      if (subject?.trim() === data?.Subject && notes?.trim() === data?.Notes) {
        setOpenNotes(false);
      } else {
        setOpen("note");
      }
    }
  };

  return (
    <React.Fragment>
      <DialogTitle
        sx={[DisplayFlex, dialogFontSize]}
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
      >
        {label} Note
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={[input_label, { m: 0 }]}>
                {name?.label || "Name"}:
              </Typography>
              <Typography sx={[FontStyle, { fontWeight: 600, color: "#333" }]}>
                {name?.value || " - "}
              </Typography>
            </Box>

            <Box>
              <Typography sx={[input_label, { mb: 1, textAlign: "left" }]}>Subject</Typography>
              <TextField
                fullWidth
                size="small"
                className="input-box2"
                placeholder="Enter note subject..."
                value={subject}
                error={Boolean(errors?.subject)}
                helperText={errors?.subject ? `Subject ${errors.subject}` : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Box>

            <Box>
              <Typography sx={[input_label, { mb: 1, textAlign: "left" }]}>Note</Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Write your note here..."
                value={notes}
                error={Boolean(errors?.notes)}
                helperText={errors?.notes ? `Notes ${errors.notes}` : ""}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContentText>
        <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
          <CustomButton
            label={label === "Add" ? "Save" : "Update"}
            Icon="saveIcon"
            onClick={handleSubmit}
          />
          <Cancelbutton label="Cancel" onClick={cancelFunc} />
        </DialogActions>
      </DialogContent>
    </React.Fragment>
  );
}

export default React.memo(NotesModel);
