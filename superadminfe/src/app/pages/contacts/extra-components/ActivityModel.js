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
  dialogTitle,
  input_label1,
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
import { contactAddActivitySubmit, contactEditActivitySubmit } from "./APIs";
import { ToastContainer, toast } from "react-toastify";
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

function ActivityModel({
  setOpen,
  label = "Add",
  data,
  setOpenActivity,
  endpoint,
  extraPayload,
  historyEndpoint,
  name,
  getData,
}) {
  const [fields, setFields] = React.useState({
    activity_name: "",
    expected_date: "",
    expected_time: "",
  });
  const [description, setDescription] = React.useState(
    data?.Task_Description ?? ""
  );
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
  //   setDescription(textContent);
  // };

  const handleEditorChange = (event, editor) => {
    const value = editor.getData();
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(value, "text/html");
    // const textContent = doc.body.textContent || "";
    setDescription(value);
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
  const [ActivityId, setActivityId] = React.useState("");
  const [seriesValue, setSeriesValue] = React.useState("");
  const [FormId, setFormId] = React.useState("");

  // < --------------------------------------- submit function -------------------------------- >
  const handleSubmit = () => {
    setIsLoading(true);
    let payload = {
      ...fields,
      description,
      id: data?.id,
      ActivityId,
      seriesValue,
      FormId,
    };
    let error = errorFilter({ ...fields, description, id: data?.id });
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
        ? contactAddActivitySubmit(
            newPayload,
            setOpenActivity,
            endpoint,
            historyEndpoint,
            extraPayload,
            getData
          )
        : contactEditActivitySubmit(
            {
              ...data,
              ...newPayload,
            },
            setOpenActivity,
            endpoint,
            historyEndpoint,
            extraPayload,
            getData
          );
      setOpen(false);
      setIsLoading(false);
    } else if (!Boolean(data?.id)) {
      toast.error(error?.meesage, {
        position: "top-right",
        autoClose: 2000,
      });
      setIsLoading(false);
    }

    console.log("toast", error);
  };

  console.log("dataasds", fields, data);

  React.useEffect(async () => {
    let findFormId = "";
    let findFormAPIKey = "";
    let findSeriesValue = "";

    if (label?.toLocaleLowerCase() === "edit") {
      setFields({
        activity_name: data?.Task,
        expected_date: data?.Expected_Date,
        expected_time: data?.Expected_Time,
      });
      setDescription(data?.Task_Description);
    }
    if (Boolean(data?.Reminder_Id)) {
      // setfirstREmainderHrs(data?.Reminder_Id?.RemainderDueDate?.split(" ")[1]);
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

    // for check transaction series
    if (name?.label == "Lead Name") {
      // Lead
      findFormId = data?.UserQualifiedLeadsActivities_Id;
      findFormAPIKey = "UserQualifiedLeadsActivities_Id";
      findSeriesValue = "UserQualified_Activities";
    } else if (name?.label == "Account Name") {
      // Accounts
      findFormId = data?.AccountActivities_Id;
      findFormAPIKey = "AccountActivities_Id";
      findSeriesValue = "Account_Activities";
    } else if (name?.label == "Deal Name") {
      // Deal
      findFormId = data?.DealActivities_Id;
      findFormAPIKey = "DealActivities_Id";
      findSeriesValue = "Deal_Activities";
    } else {
      findFormId = data?.ContactActivities_Id; // Contact
      findFormAPIKey = "ContactActivities_Id";
      findSeriesValue = "Contact_Activities";
    }
    console.log("NotesModel transactions", {
      findFormId,
      findSeriesValue,
      data,
      name,
    });
    setFormId(findFormAPIKey);
    setActivityId(findFormId || "");

    const series = await fetchTransactionSeries(findSeriesValue || "");
    console.log("series", series);

    // const series = await fetchTransactionSeries("Contact_Activities")
    setSeriesValue(series);
  }, [data, name]);

  const cancelFunc = () => {
    if (label === "Add") {
      if (
        Object.values({ ...fields, description })?.some((value) =>
          Boolean(value?.trim())
        )
      ) {
        setOpen("activity");
      } else {
        setOpenActivity(false);
      }
    } else {
      if (
        fields?.activity_name === data?.Task &&
        fields?.expected_date === data?.Expected_Date &&
        fields?.expected_time === data?.Expected_Time &&
        description === data?.Task_Description
      ) {
        setOpenActivity(false);
      } else {
        setOpen("activity");
      }
    }
  };

  return (
    <React.Fragment>
      {/* <ToastContainer /> */}
      <DialogTitle
        sx={[DisplayFlex, dialogFontSize]}
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
      >
        {label} Activity
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
                Activity Id
                <span className="required">
                  {seriesValue == "Automatic" ? "" : "*"}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={ActivityId}
                sx={{
                  border: errors["ActivityId"]
                    ? "1px solid red !important"
                    : "",
                  borderRadius: "5px",
                }}
                onChange={(e) => setActivityId(e.target.value)}
                disabled={
                  seriesValue == "Automatic"
                    ? true
                    : "" || label?.toLocaleLowerCase() === "edit"
                }
              />
              {errors?.ActivityId && (
                <Div style={{ color: "red" }}>
                  ActivityId {errors?.ActivityId}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Activity Name</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={fields?.activity_name}
                onChange={(e) =>
                  setFields({ ...fields, activity_name: e.target.value })
                }
              />
              {errors?.activity_name && (
                <Div style={{ color: "red" }}>
                  Activity name {errors?.activity_name}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Expected Date</Typography>
            </Grid>
            <Grid item className="flex items-center ">
              <Div className="col-12 input-box2">
                <TextField
                  className="col-12 input-box2"
                  value={fields?.expected_date}
                  type="date"
                  inputProps={{
                    min: new Date(),
                  }}
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
              <Typography sx={[input_label]}>Expected Time</Typography>
            </Grid>
            <Grid item>
              <TextField
                type="time"
                className="col-12 input-box2"
                value={fields?.expected_time}
                onChange={(e) =>
                  setFields({ ...fields, expected_time: e.target.value })
                }
              />{" "}
              {errors?.expected_time && (
                <Div style={{ color: "red" }}>
                  Expected time {errors?.expected_time}
                </Div>
              )}
            </Grid>

            <Grid item>
              <Typography sx={[input_label]}>Description</Typography>
            </Grid>
            <Grid item>
              {/* <TextEditor value={description} onChange={handleEditorChange} /> */}
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  handleEditorChange(event, editor);
                }}
              />

              {errors?.description && (
                <Div style={{ color: "red" }}>{errors?.description}</Div>
              )}
            </Grid>
          </Customgrid>
        </DialogContentText>
        <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
          <CustomButton
            disabled={isLoading}
            label={label === "Add" ? "Save" : "Update"}
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
export default React.memo(ActivityModel);
