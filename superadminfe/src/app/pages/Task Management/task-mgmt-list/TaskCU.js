import {
  Autocomplete,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  dialogFontSize,
  DisplayFlex,
  input_label,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CRMDateField,
  CRMSeparateDateTime,
  CustomButton,
  DialogBox,
  errorFilter,
  fetchTransactionSeries,
} from "app/pages/widgets/StylesComponents";
import React, { useEffect, useState } from "react";
import {
  TaskCUD,
  useProjectAdditional,
  useTaskAllList,
  useTaskMyList,
  useUsersList,
} from "../task-api/taskAPI";
import { toast } from "react-toastify";
import ReminderMe from "app/pages/contacts/extra-components/ReminderMe";
import { QueryClient } from "react-query";
import Div from "@jumbo/shared/Div";

const TaskCU = ({ open, setOpen, type = "Create", currentTaskRequest }) => {

  const token = localStorage.getItem("accesstoken");
  const userId = parseInt(localStorage.getItem("UserId"));
  console.log("currentTaskRequest", currentTaskRequest)

  const query = new QueryClient();
  const priorityOption = ["Low", "Normal", "High"];

  const { projectData, refetchProject, isLoadingProject } = useProjectAdditional();
  const { refetchTaskAllData, isLoadingTaskAllData } = useTaskAllList();
  const { refetchTaskMyData, isLoadingTaskMyData } = useTaskMyList();

  const { usersData, refetchUsersList } = useUsersList();

  const [save, setSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReminder, setIsReminder] = useState(false);
  const [errors, setErrors] = useState({});

  const completionOption = [
    "10%",
    "25%",
    "50%",
    "70%",
    "90%",
    "100%",
    "Not Started",
  ];

  const [fields, setFields] = useState({
    taskName: "",
    taskDesc: "",
    startDate: "",
    dueDate: "",
    priority: "",
    completion: "",
    project: "",
    assignedBy: "",
  });

  const [reminderFields, setReinderFields] = useState({
    durationLength: "",
    selectDuration: "",
    repeatedDuarationLength: "",
    selectedRepeatDuration: "",
    content: "",
    reminderflag: false,
  });
  const [seriesValue, setSeriesValue] = useState("")


  const handleSubmit = () => {
    TaskCUFun();
  };


  const TaskCUFun = async () => {
    setIsLoading(true);
    let error = errorFilter({
      taskName: fields?.taskName,
      startDate: fields?.startDate,
      dueDate: fields?.dueDate,
      priority: fields?.priority,
      completion: fields?.completion,
      project: fields?.project,
      assignedBy: fields?.assignedBy,
    });
    const formattedErrors = {};
    for (const [key, message] of Object.entries(error)) {
      formattedErrors[key] = `${message.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase()).replace(/_/g, ' ')} is required`;
    }

    // Update state with formatted error messages
    setErrors(formattedErrors);

    if (Object.keys(error).length > 0) {
      // toast.warning(
      //   ` This fields are invalid ${Object.keys(error)?.map((field) => field)}`
      // );
      console.log(error)
    } else {
      console.log("errorerror...", errors)
      let payload = {
        TaskName: fields?.taskName,
        Task_Id: seriesValue === "Manual" && fields?.Task_Id,
        Task_Desc: fields?.taskDesc,
        Start_Date: fields?.startDate,
        Due_Date: fields?.dueDate,
        Priority: fields?.priority,
        Completion: fields?.completion,
        Project: fields?.project,
        Assigned_By: fields?.assignedBy,
        UserReminder: Boolean(reminderFields?.reminderflag)
          ? {
            ReminderFor: "Reminder for Task Management",
            Repeat_EveryDay: `${reminderFields?.repeatedDuarationLength} ${reminderFields?.selectedRepeatDuration}`,
            RemainderDueDate: `${reminderFields?.durationLength} ${reminderFields?.selectDuration}`,
            RemainderMessage: reminderFields?.content,
            Created_By: userId,
            Updated_By: userId,
          }
          : null,
        Created_By: userId,
        Updated_By: userId,
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        Updated_Date: new Date().toISOString(),
        Created_Date: new Date().toISOString(),
      };
      let editpayload = {
        ...fields,
        TaskName: fields?.taskName,
        Task_Desc: fields?.taskDesc,
        Start_Date: fields?.startDate,
        Due_Date: fields?.dueDate,
        Priority: fields?.priority,
        Completion: fields?.completion,
        Project: fields?.project,
        Assigned_By: fields?.assignedBy,
        UserReminder: Boolean(reminderFields?.reminderflag)
          ? currentTaskRequest?.UserReminder?.id ? {
            ...currentTaskRequest?.UserReminder,
            Reminder_Id: currentTaskRequest?.UserReminder?.Reminder_Id,
            ReminderFor: "Reminder for Task Management",
            Repeat_EveryDay: `${reminderFields?.repeatedDuarationLength} ${reminderFields?.selectedRepeatDuration}`,
            RemainderDueDate: `${reminderFields?.durationLength} ${reminderFields?.selectDuration}`,
            RemainderMessage: reminderFields?.content,
            Created_By: currentTaskRequest?.Created_By?.id ? currentTaskRequest?.Created_By?.id : userId,
            Updated_By: userId,
          } : {
            ReminderFor: "Reminder for Task Management",
            Repeat_EveryDay: `${reminderFields?.repeatedDuarationLength} ${reminderFields?.selectedRepeatDuration}`,
            RemainderDueDate: `${reminderFields?.durationLength} ${reminderFields?.selectDuration}`,
            RemainderMessage: reminderFields?.content,
            Created_By: userId,
            Updated_By: userId,
          }
          : null,
        Created_By: fields?.Created_By?.id,
        Updated_By: userId,
        Organization_Id: fields?.Organization_Id?.id,
        Updated_Date: new Date().toISOString(),
        Created_Date: fields?.Created_Date,
      };
      if (type === "Edit") {
        payload.id = open?.id;
        if (
          open?.UserReminder &&
          Object.values(reminderFields).every((item) => Boolean(item))
        ) {
          payload.UserReminder.id = open?.UserReminder.id;
          payload.UserReminder.Remainder_Id = open?.UserReminder.Remainder_Id;
        }
      }
      console.log("payload", payload);
      try {
        let res = await TaskCUD(type === "Edit" ? "put" : "post", type === "Edit" ? editpayload : payload);
        if (!res?.error) {
          await refetchTaskAllData();
          await refetchTaskMyData();
          toast.success(`Task ${type === "Edit" ? "updat" : "creat"}ed successfully`);
          setOpen(false);
          setErrors({});
        } else {
          toast.error(`${res?.error} Task is not ${type === "Edit" ? "updat" : "creat"}ed`);
        }
      } catch (error) {
        toast.error(error);
        console.error(error);
      }
    }
    setIsLoading(false);
  };



  useEffect(() => {
    if (type === "Edit") {
      setFields({
        ...open,
        Task_Id: open?.Task_Id,
        taskName: open?.TaskName,
        taskDesc: open?.Task_Desc,
        startDate: open?.Start_Date?.split(":00+05:30")[0],
        dueDate: open?.Due_Date?.split(":00+05:30")[0],
        priority: open?.Priority,
        completion: open?.Completion,
        project: open?.Project?.id,
        assignedBy: open?.Assigned_By?.id,
      });

      if (open?.UserReminder?.id) {
        setReinderFields({
          ...open?.UserReminder,
          durationLength: Number(
            open?.UserReminder?.RemainderDueDate?.split(" ")[0]
          ),
          selectDuration: open?.UserReminder?.RemainderDueDate?.split(" ")[1],
          repeatedDuarationLength: Number(
            open?.UserReminder?.Repeat_EveryDay?.split(" ")[0]
          ),
          selectedRepeatDuration:
            open?.UserReminder?.Repeat_EveryDay?.split(" ")[1],
          content: open?.UserReminder?.RemainderMessage,
          reminderflag: open?.UserReminder?.id ? true : false,
        });
      } else {
        setReinderFields({
          durationLength: "",
          selectDuration: "",
          repeatedDuarationLength: "",
          selectedRepeatDuration: "",
          content: "",
          reminderflag: false,
        })
      }
    } else {
      // setFields((prev) => ({ ...prev, startDate: open || "" }));
      // console.log("sdfsdfsdfs", open);
    }
  }, [open]);


  // get transaction series
  useEffect(async () => {
    const series = await fetchTransactionSeries("NewTask_Managemnt")
    console.log("series", series)
    setSeriesValue(series)
  }, [open]);


  console.log("fields?.startDate", fields?.startDate)
  console.log("errorerror", errors)


  return (
    <>
      <DialogTitle
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
        sx={[dialogFontSize, DisplayFlex]}
      >
        {type} Task
      </DialogTitle>

      <DialogContent className="h-full">
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Task Id <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="Task_Id"
              className="input-box2 w-full"
              value={fields?.Task_Id}
              onChange={(e) => {
                setFields({ ...fields, Task_Id: e.target.value })
              }}
              placeholder="Auto Generate Id"
              disabled={seriesValue == "Automatic" ? true : false}
            />
            {!fields?.Task_Id && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.Task_Id}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Task Name <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              className="input-box2 w-full"
              value={fields?.taskName}
              defaultValue={fields?.taskName}
              onChange={(e, newValue) => {
                setFields({
                  ...fields,
                  taskName: e.target.value,
                });
              }}
              placeholder="Enter task name"
            />
            {!fields?.taskName && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.taskName}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Start Date <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* <TextField
              className="input-box2 w-full"
              type="datetime-local"
              value={fields?.startDate}
              defaultValue={fields?.startDate}
              onChange={(e) => {
                console.log("Enter task startDate", e.target.value);
                setFields({
                  ...fields,
                  startDate: e.target.value,
                  dueDate: "",
                });
              }}
              inputProps={{
                min: new Date().toISOString().slice(0, 16), // Set min date to current date
              }}
            // disabled={fields?.startDate === true ? false : true}
            /> */}
            <CRMDateField
              id="startDate"
              name="startDate"
              type="datetime-local"
              value={fields?.startDate}
              onChange={(e) => {
                console.log("Enter task startDate", e.target.value);
                setFields({
                  ...fields,
                  startDate: e.target.value,
                  dueDate: "",
                });
              }}
              InputProps={{
                inputProps: {
                  min: new Date().toISOString().slice(0, 16)
                }
              }}
            />
            {!fields?.startDate && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.startDate}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Due Date <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <CRMDateField
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={fields?.dueDate}
              onChange={(e) => {
                setFields({
                  ...fields,
                  dueDate: e.target.value,
                });
              }}
              disabled={!Boolean(fields?.startDate)}
              InputProps={{
                inputProps: {
                  min: fields?.startDate,
                }
              }}
            />
            {!fields?.dueDate && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.dueDate}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Priority <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              className="search-select3 w-full"
              autocomplete="off"
              options={priorityOption}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option) {
                  return option;
                }
              }}
              value={fields?.priority || null}
              defaultValue={fields?.priority}
              onChange={(e, newValue) => {
                setFields({
                  ...fields,
                  priority: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Priority" />
              )}
            />
            {!fields?.priority && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.priority}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Completion <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              className="search-select3 w-full"
              autocomplete="off"
              options={completionOption}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option) {
                  return option;
                }
              }}
              value={fields?.completion || null}
              defaultValue={fields?.completion}
              onChange={(e, newValue) => {
                setFields({
                  ...fields,
                  completion: newValue,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Completion" />
              )}
            />
            {!fields?.completion && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.completion}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Project <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              className="search-select3 w-full"
              autocomplete="off"
              options={projectData || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.project_name) {
                  return option?.project_name;
                }
              }}
              value={
                (projectData?.length > 0 &&
                  projectData?.find((option) => option.id === fields?.project)
                    ?.project_name) || null
              }
              onChange={(e, newValue) => {
                setFields({
                  ...fields,
                  project: newValue?.id,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Project" />
              )}
            />
            {!fields?.project && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.project}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Assigned By <span className="required">*</span></Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              className="search-select3 w-full"
              autocomplete="off"
              options={usersData || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.username) {
                  return option?.username;
                }
              }}
              value={(usersData?.length > 0 &&
                usersData?.find((user) => user?.id === fields?.assignedBy)
                  ?.username) || null}
              onChange={(e, newValue) => {
                setFields({
                  ...fields,
                  assignedBy: newValue?.id,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Enter Assigned By" />
              )}
            />
            {!fields?.assignedBy && <span style={{ color: "red", fontSize: "13px" }}>
              {errors.assignedBy}
            </span>}
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography sx={input_label}>Task Description</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              className="multiline-box w-full"
              multiline
              rows={4}
              value={fields?.taskDesc}
              defaultValue={fields?.taskDesc}
              onChange={(e) => {
                setFields({
                  ...fields,
                  taskDesc: e.target.value,
                });
              }}
              placeholder="Enter Task Description"
            />
          </Grid>
          {Boolean(fields?.dueDate) && <Grid item xs={12} md={2}></Grid>}
          {Boolean(fields?.dueDate) && (
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <FormGroup className="flex items-center gap-1">
                <FormControlLabel
                  onChange={() => {
                    if (reminderFields?.id) {
                      setReinderFields({
                        durationLength: "",
                        selectDuration: "",
                        repeatedDuarationLength: "",
                        selectedRepeatDuration: "",
                        content: "",
                        reminderflag: false,
                      });
                      setIsReminder(false);
                    } else {
                      setReinderFields({
                        durationLength: "",
                        selectDuration: "",
                        repeatedDuarationLength: "",
                        selectedRepeatDuration: "",
                        content: "",
                        reminderflag: true,
                      });
                      setIsReminder(true);
                    }
                  }}
                  control={
                    <Checkbox
                      color="info"
                      checked={Boolean(reminderFields?.reminderflag)}
                    />
                  }
                // label={
                //   <Typography
                //     onClick={() => {
                //       setIsReminder(true);
                //       if (reminderFields?.id) {
                //         setReinderFields({
                //           ...reminderFields,
                //           // reminderflag: true,
                //         });
                //       } else {
                //         setReinderFields({
                //           durationLength: "",
                //           selectDuration: "",
                //           repeatedDuarationLength: "",
                //           selectedRepeatDuration: "",
                //           content: "",
                //           // reminderflag: true,
                //         });
                //       }
                //     }}
                //     sx={[input_label]}
                //   >
                //     Remind Me (Optional)
                //   </Typography>
                // }
                />

              </FormGroup>
              <Typography
                onClick={() => {
                  setIsReminder(true);
                  setReinderFields(reminderFields)
                }}
                sx={[input_label, { cursor: "pointer" }]}
              >
                Remind Me (Optional)
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent >

      <DialogActions className="flex items-center justify-end mt-3">
        <CustomButton
          disabled={isLoadingTaskAllData || isLoadingTaskMyData || isLoading}
          label={type === "Create" ? "Save" : "Update"}
          onClick={handleSubmit}
          Icon="saveIcon"
        />
        <Cancelbutton onClick={() => setSave(true)} />
      </DialogActions>

      {/* reminder */}
      <ReminderMe
        prevData={open?.UserReminder}
        type={type}
        isReminder={isReminder}
        setIsReminder={setIsReminder}
        reminderFields={reminderFields}
        setReinderFields={setReinderFields}
      />


      <DialogBox
        open={save}
        onClickNo={() => setSave(false)}
        onClickYes={() => {
          setSave(false);
          setOpen(false);
          setErrors({});
        }}
      />
    </>
  );
};
export default TaskCU;
