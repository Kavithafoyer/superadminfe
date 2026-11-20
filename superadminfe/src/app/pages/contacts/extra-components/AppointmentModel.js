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
  input_label1,
  dialogTitle,
} from "app/pages/widgets/CRMStyles";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Cancelbutton,
  CustomButton,
  CustomCKEditor,
  Customgrid,
  Div,
  Dragabledialog,
  TextEditor,
  ckEditorOnchange,
  errorFilter,
} from "app/pages/widgets/StylesComponents";
import {
  contactAddAppointmentSubmit,
  contactEditAppointmentSubmit,
} from "./APIs";
import { toast } from "react-toastify";
import { useState } from "react";
import { fetchTransactionSeries } from "../../widgets/StylesComponents";
import ReminderMe from "./ReminderMe";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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

function AddAppointment({
  setOpen,
  label = "Add",
  data,
  setOpenAppointment,
  endpoint,
  historyEndpoint,
  extraPayload,
  name,
  getData = () => {},
}) {
  const [fields, setFields] = React.useState({
    subject: "",
    location: "",
    venue: "",
    expected_date: "",
    from_time: "",
    to_time: "",
  });

  console.log("karthdata", data);
  const [details, setDetails] = React.useState(data?.Details ?? "");
  const [errors, setErrors] = React.useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [isReminder, setIsReminder] = useState(false);

  const [reminderFields, setReinderFields] = useState({
    durationLength: "",
    selectDuration: "",
    repeatedDuarationLength: "",
    selectedRepeatDuration: "",
    content: "",
  });

  // const handleEditorChange = (textContent) => {
  //   setDetails(textContent);
  // };
  const handleEditorChange = (event, editor) => {
    const value = editor.getData();
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    setDetails(value);
  };

  // set reminder states
  const [firstREmainderHrs, setfirstREmainderHrs] = useState("");
  const [Repeateveryhrs, setRepeateveryhrs] = useState("");
  const [firstRemainder, setfirstRemainder] = useState("");
  const [repeatEvery, setrepeatEvery] = useState("");
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [show, setShow] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [id, setId] = useState("");
  const [reminderid, setReminder] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [seriesValue, setSeriesValue] = React.useState("");
  const [AppointmentId, setAppointmentId] = React.useState("");
  const [FormId, setFormId] = React.useState("");

  // < --------------------------------------- submit function -------------------------------- >
  const handleSubmit = () => {
    let payload = {
      ...fields,
      details,
      id: data?.id,
      AppointmentId,
      seriesValue,
      FormId,
    };
    let error = errorFilter({ ...fields, details, id: data?.id });
    setErrors(error);

    if (Object.keys(error).length == 0) {
      let newPayload = {
        ...payload,
        Reminder_Payload: Boolean(reminderFields?.content)
          ? {
              Created_By: localStorage.getItem("UserId"),
              Updated_By: localStorage.getItem("UserId"),
              ReminderFor: "Reminder for Task Management",
              Repeat_EveryDay: `${reminderFields?.repeatedDuarationLength} ${reminderFields?.selectedRepeatDuration}`,
              RemainderDueDate: `${reminderFields?.durationLength} ${reminderFields?.selectDuration}`,
              RemainderMessage: reminderFields?.content,
            }
          : null,
      };

      if (
        label !== "Add" &&
        data?.Reminder_Id &&
        Object.values(reminderFields)?.every((item) => Boolean(item))
      ) {
        newPayload.Reminder_Payload.id = data?.Reminder_Id?.id;
        newPayload.Reminder_Payload.reminderid = data?.Reminder_Id?.Reminder_Id;
      }

      label === "Add"
        ? contactAddAppointmentSubmit(
            newPayload,
            setOpenAppointment,
            endpoint,
            historyEndpoint,
            extraPayload,
            getData
          )
        : contactEditAppointmentSubmit(
            {
              ...data,
              ...newPayload,
            },
            setOpenAppointment,
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
    console.log("toast", error);
  };

  React.useEffect(async () => {
    let findFormId = "";
    let findFormAPIKey = "";
    let findSeriesValue = "";

    if (label?.toLocaleLowerCase() === "edit") {
      setFields({
        subject: data?.Subject,
        location: data?.Location,
        venue: data?.Venue,
        expected_date: data?.Date,
        from_time: data?.FromDate_Time,
        to_time: data?.ToDate_Time,
      });
      if (Boolean(data?.Reminder_Id)) {
        setfirstREmainderHrs(
          data?.Reminder_Id?.RemainderDueDate?.split(" ")[1]
        );
        // setRepeateveryhrs(data?.Reminder_Id?.Repeat_EveryDay?.split(" ")[1]);
        // setrepeatEvery(data?.Reminder_Id?.Repeat_EveryDay?.split(" ")[0]);
        // setfirstRemainder(data?.Reminder_Id?.RemainderDueDate?.split(" ")[0]);
        // setEditorContent(data?.Reminder_Id?.RemainderMessage);
        // setDetails(data?.Details);
        // setShow(true);
        // setRepeat(true);
        // setReminder(data?.Reminder_Id?.Remainder_Id);
        // setId(data?.Reminder_Id?.id);
        setReinderFields({
          durationLength: Number(
            data?.Reminder_Id?.RemainderDueDate?.split(" ")[0]
          ),
          selectDuration: data?.Reminder_Id?.RemainderDueDate?.split(" ")[1],
          repeatedDuarationLength: Number(
            data?.Reminder_Id?.Repeat_EveryDay?.split(" ")[0]
          ),
          selectedRepeatDuration:
            data?.Reminder_Id?.Repeat_EveryDay?.split(" ")[1],
          content: data?.Reminder_Id?.RemainderMessage,
        });
      }

      console.log("Appointments", data);
    }

    // for check transaction series

    if (name?.label == "Lead Name") {
      // Lead
      findFormId = data?.LeadMeeting_Id;
      findFormAPIKey = "LeadMeeting_Id";
      findSeriesValue = "UserLead_Meeting";
    } else if (name?.label == "Account Name") {
      // Accounts
      findFormId = data?.AccountMeeting_Id;
      findFormAPIKey = "AccountMeeting_Id";
      findSeriesValue = "Account_Meeting";
    } else if (name?.label == "Deal Name") {
      // Deal
      findFormId = data?.DealMeeting_Id;
      findFormAPIKey = "DealMeeting_Id";
      findSeriesValue = "Deal_Meeting";
    } else {
      findFormId = data?.ContactMeeting_Id; // Contact
      findFormAPIKey = "ContactMeeting_Id";
      findSeriesValue = "Contact_Meeting";
    }

    setFormId(findFormAPIKey);
    setAppointmentId(findFormId);

    const series = await fetchTransactionSeries(findSeriesValue || "");
    console.log("Contact_Meeting series", series);
    setSeriesValue(series);
  }, [data]);

  const cancelFunc = () => {
    if (label === "Add") {
      if (
        Object.values({ ...fields, details })?.some((value) =>
          Boolean(value?.trim())
        )
      ) {
        setOpen("appointment");
      } else {
        setOpenAppointment(false);
      }
    } else {
      if (
        fields?.subject === data?.Subject &&
        fields?.location === data?.Location &&
        fields?.venue === data?.Venue &&
        fields?.expected_date === data?.Date &&
        fields?.from_time === data?.FromDate_Time &&
        fields?.to_time === data?.ToDate_Time &&
        details === data?.Details
      ) {
        setOpenAppointment(false);
      } else {
        setOpen("appointment");
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
        {label} Appointment
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          <Customgrid>
            <Grid item>
              <Typography sx={[input_label]}>
                {name?.label || "Name"}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={[FontStyle]}>{name?.value || " - "}</Typography>
            </Grid>

            <Grid item>
              <Typography sx={input_label}>
                Appointment Id{" "}
                <span className="required">
                  {seriesValue == "Automatic" ? "" : "*"}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={AppointmentId}
                sx={{
                  border: errors["AppointmentId"]
                    ? "1px solid red !important"
                    : "",
                  borderRadius: "5px",
                }}
                onChange={(e) => setAppointmentId(e.target.value)}
                disabled={
                  seriesValue == "Automatic"
                    ? true
                    : "" || label?.toLocaleLowerCase() === "edit"
                }
              />
              {errors?.AppointmentId && (
                <Div style={{ color: "red" }}>Appointment Id</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Subject</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.subject}
                onChange={(e) =>
                  setFields({ ...fields, subject: e.target.value })
                }
              />
              {errors?.subject && (
                <Div style={{ color: "red" }}>Subject {errors?.subject}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Location</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.location}
                onChange={(e) =>
                  setFields({ ...fields, location: e.target.value })
                }
              />{" "}
              {errors?.location && (
                <Div style={{ color: "red" }}>Location {errors?.location}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Venue</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.venue}
                onChange={(e) =>
                  setFields({ ...fields, venue: e.target.value })
                }
              />{" "}
              {errors?.venue && (
                <Div style={{ color: "red" }}>Venue {errors?.venue}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Expected Date</Typography>
            </Grid>
            <Grid item className="flex items-center ">
              <Div className="col-12 input-box2">
                <TextField
                  className="col-8 input-box2"
                  value={fields?.expected_date}
                  type="date"
                  onChange={(e) =>
                    setFields({ ...fields, expected_date: e.target.value })
                  }
                />{" "}
                {errors?.expected_date && (
                  <Div style={{ color: "red" }}>
                    Expected date {errors?.expected_date}
                  </Div>
                )}
                {Boolean(fields?.expected_date || show) && (
                  <FormGroup
                    sx={{ display: !errors?.expected_date ? "block" : "none" }}
                  >
                    <FormControlLabel
                      onClick={() => {
                        // if (Boolean(show)) {
                        //   setIsReminder(false);
                        // } else {

                        setIsReminder(true);
                        // }
                      }}
                      control={
                        <Checkbox
                          color="info"
                          checked={Boolean(reminderFields?.content)}
                        />
                      }
                      label={
                        <Typography sx={[input_label]}>
                          Remind Me (Optional)
                        </Typography>
                      }
                    />
                  </FormGroup>
                )}
              </Div>
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>From Time</Typography>
            </Grid>
            <Grid item>
              <TextField
                type="time"
                className="col-12 input-box2"
                value={fields?.from_time}
                onChange={(e) =>
                  setFields({ ...fields, from_time: e.target.value })
                }
              />{" "}
              {errors?.from_time && (
                <Div style={{ color: "red" }}>
                  From Time {errors?.from_time}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>To Time</Typography>
            </Grid>
            <Grid item>
              <TextField
                type="time"
                className="col-12 input-box2"
                value={fields?.to_time}
                onChange={(e) =>
                  setFields({ ...fields, to_time: e.target.value })
                }
              />{" "}
              {errors?.to_time && (
                <Div style={{ color: "red" }}>To Time {errors?.to_time}</Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Details</Typography>
            </Grid>
            <Grid item>
              {/* <TextEditor value={details} onChange={handleEditorChange} /> */}
              <CKEditor
                editor={ClassicEditor}
                content={details}
                data={details}
                onChange={(event, editor) => {
                  handleEditorChange(event, editor);
                }}
              />
              {errors?.details && (
                <Div style={{ color: "red" }}>Details {errors?.details}</Div>
              )}
            </Grid>
          </Customgrid>
        </DialogContentText>
        <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
          <CustomButton
            label={label === "Add" ? "Save" : "Update"}
            disabled={isLoading}
            Icon="saveIcon"
            onClick={handleSubmit}
          />
          <Cancelbutton label="Cancel" onClick={cancelFunc} />
        </DialogActions>
      </DialogContent>

      {/* reminder */}
      <ReminderMe
        prevData={data?.Reminder_Id}
        type={label === "Add" ? "Create" : "Edit"}
        isReminder={isReminder}
        setIsReminder={setIsReminder}
        reminderFields={reminderFields}
        setReinderFields={setReinderFields}
      />
    </React.Fragment>
  );
}
export default React.memo(AddAppointment);
