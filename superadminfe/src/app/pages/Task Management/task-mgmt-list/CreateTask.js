import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ButtonStyle, DialogBoxCancelButton, DialogBoxSaveButton, DisplayFlex, FontStyle, dialogTitle, input_label, input_label1 } from "../../widgets/CRMStyles";
import { Cancelbutton, CustomButton, Customgrid, DialogBox, Dragabledialog } from "../../widgets/StylesComponents";
import { CKEditor } from "@ckeditor/ckeditor5-react";



const CreateTask1 = ({ setCreateTask, setSave, getTaskList }) => {

  const [jobtype, setjobtype] = useState(false)
  const [normaltype, setnormaltype] = useState(true)



  const [taskid, settaskid] = useState("")
  const [tasktype, settasktype] = useState("")
  const [taskname, settaskname] = useState("")
  const [assignto, setassignto] = useState("")
  const [description, setdescription] = useState("")
  const [allodate, setallodate] = useState("")
  const [deaddate, setdeaddate] = useState("")
  const [starttime, setstarttime] = useState("")
  const [endtime, setendtime] = useState("")
  const [userList, setUserList] = useState([])
  const [earlyStartDate, setEarlyStartDate] = useState('')
  const [earlyFinishDate, setEarlyFinishDate] = useState('')
  const [isDependent, setIsDependent] = useState('')
  const [isEmployeeSingleOrMultiple, setIsEmployeeSingleOrMultiple] = useState('')
  const [allocatedDate, setAllocatedDate] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [taskDuration, setTaskDuration] = useState(0)
  const [projectList, setProjectList] = useState([])
  const [projectId, setProjectId] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')
  const [resourceCost, setResourceCost] = useState(0.0)

  const taskTypeList = [{ name: "Main" }, { name: "Sub" }];
  const dependentChoices = [{ name: "Yes" }, { name: "No" }]
  const employeeChoices = [{ name: 'Single' }, { name: 'Multiple' }]
  const priorityChoices = ['LOW', 'NORMAL', 'HIGH']
  const statusChoices = ['Not Started', 'In Progress', 'Completed']
  const [listTasks, setListTasks] = useState([])
  const [mainTask, setMainTask] = useState('')

  const [firstREmainderHrs, setfirstREmainderHrs] = useState("")
  const [Repeateveryhrs, setRepeateveryhrs] = useState("")
  const [firstRemainder, setfirstRemainder] = useState("")
  const [repeatEvery, setrepeatEvery] = useState("")

  const [dateformat, setdateformat] = useState("")
  const [createClose, setCreateClose] = useState(false);

  const [editorContent, setEditorContent] = useState("");

  const [isReminderSet, setIsReminderSet] = React.useState(false);






  const calculateDateDifference = (start, end) => {
    const oneDay = 24 * 60 * 60 * 1000;

    let startDate = new Date(start)
    let endDate = new Date(end)
    const startDateTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const endDateTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

    const differenceInMilliseconds = Math.abs(endDateTime - startDateTime);
    const differenceInDays = Math.floor(differenceInMilliseconds / oneDay);

    return differenceInDays

  };

  const handleClickBack = () => {
    // setSave(true)
    setCreateTask(false)
  };

  const token = localStorage.getItem("accesstoken")
  const OrganizationId = localStorage.getItem("OrganizationId")
  const item = localStorage.getItem("DBName")


  useEffect(() => {
    if (Boolean(earlyStartDate) && Boolean(earlyFinishDate)) {
      let differenceInDays = calculateDateDifference(earlyStartDate, earlyFinishDate)
      setTaskDuration(differenceInDays)
    }
  }, [earlyStartDate, earlyFinishDate])

  const getProjectDetails = async () => {
    await axios.get(`${BASE_URL}/superadmin/ProjectAdditional/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    })
      .then((res) => {
        console.log("resgfgf", res?.data?.results)
        setProjectList(res?.data?.results)
      })
      .catch((error) => {
        console.error("Error while fetching Project details ", error)
      })
  }
  useEffect(() => {
    getProjectDetails()
  }, [])

  useEffect(() => {
    getTaskListByProject()
  }, [projectId])




  const createTask = async () => {
    let payload = {
      "task_name": taskname,
      "tast_type": tasktype,
      "assign_to_users": assignto,
      "task_duration": taskDuration,
      "main_task": mainTask?.id,
      "early_start": new Date(earlyStartDate).toISOString(),
      "early_finish": new Date(earlyFinishDate).toISOString(),
      "dependent": isDependent,
      "tasks_multi_name": "",
      "single_or_multi_emp": isEmployeeSingleOrMultiple,
      "Allocated_Date": allocatedDate,
      "Deadline_Date": deadlineDate,
      "project": projectId?.id,
      "priority": priority,
      "taskStatus": status,
      "resourceCost": resourceCost,
      "Created_By": localStorage.getItem("UserId"),
      "Updated_By": localStorage.getItem("UserId"),
      "Organization_Id": localStorage.getItem("OrganizationId")
    }

    console.log("payload", payload)
    await axios.post(`${BASE_URL}/superadmin/NewTaskManagemntCRUD/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "db": item
      },
    })
      .then((res) => {
        console.log("responseeeee", res)
        if (res?.status === 201) {
          toast.success("Task Created Successfully")
          setCreateTask(false)
          getTaskList()
        }

      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage = error.response.data.details || "You don't have permission to do it";
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

  const handleDialogClose = (confirmed) => {
    setIsReminderSet(false);
  };

  const onChange = (evt) => {
    console.log("eve", evt);
    var newContent = evt.editor.getData();
    console.log("newContent", newContent);
    setEditorContent(newContent);
  };

  const handleClickSavetask = () => {

    if (taskname === "" || taskname === undefined || taskname === null || tasktype === "" || tasktype === undefined || tasktype === null
      || assignto === "" || assignto === undefined || assignto === null || taskDuration === "" || taskDuration === undefined || taskDuration === null
      || earlyStartDate === "" || earlyStartDate === undefined || earlyStartDate === null || earlyFinishDate === "" || earlyFinishDate === undefined || earlyFinishDate === null
      || isDependent === "" || isDependent === undefined || isDependent === null || isEmployeeSingleOrMultiple === "" || isEmployeeSingleOrMultiple === undefined || isEmployeeSingleOrMultiple === null
      || allocatedDate === "" || allocatedDate === undefined || allocatedDate === null || deadlineDate === "" || deadlineDate === undefined || deadlineDate === null
      || projectId === "" || projectId === undefined || projectId === null
    ) {
      toast.error("Enter Valid data")
    }
    else {
      createTask()
    }


  }

  const functiondate = (e) => {
    if (e?.name === "Task") {
      setjobtype(true)
      setnormaltype(false)

    } else {
      setnormaltype(true)
      setjobtype(false)
    }

  }

  // user list
  const userLists = () => {

    axios
      .get(`${BASE_URL}/superadmin/UsersList/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "db": item
        },
      })
      .then((res) => {
        console.log("task12", res.data);
        setUserList(res.data);

      })
      .catch((error) => {
        console.log("ds", error);
      });
  }


  useEffect(() => {
    // Dateformatrecords()
    userLists()
  }, []);


  const handleCheckboxChange = (event) => {
    setIsReminderSet(event.target.checked);
  };

  const handleChangeAssignTo = (value) => {
    let assignUsers = []
    value?.map((item) => {
      assignUsers.push(item?.id)
    })
    setassignto(assignUsers)
  }

  const getTaskListByProject = () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    }

    axios.get(`${BASE_URL}/superadmin/TaskByProject/`, {
      params: {
        project_id: projectId?.id
      },
      headers: headers
    }).then((res) => {
      console.log("resss", res?.data?.results)
      setListTasks(res?.data?.results)
    })
      .catch((error) => {
        console.error("error", error)
      })
  }

  return (
    <>
      <Div>
        <Formik initialValues={{}}>
          <Form>
            <Box mt={2}>
              <Customgrid columnCount={4}>
                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Select Project
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    className="col-12 search-select3"
                    options={projectList}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.project_name) {
                        return option?.project_name;
                      }
                      return "";
                    }}

                    value={projectId}
                    onChange={(e, newValue) => {
                      console.log("iddddd", newValue)
                      setProjectId(newValue || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='selectProject'
                        placeholder="Select Project "
                      />
                    )}
                  />
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Task Name
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Task Name"
                      variant="outlined"
                      value={taskname}
                      onChange={(e) => { settaskname(e.target.value) }}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Task Type
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    className="col-12 search-select3"
                    options={taskTypeList}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.name) {
                        return option?.name;
                      }
                      return "";
                    }}

                    value={tasktype}
                    onChange={(e, newValue) => {
                      settasktype(newValue?.name || "");
                      functiondate(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='tasktype'
                        placeholder="Select Task Type"
                      />
                    )}
                  />
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Dependent
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    className="col-12 search-select3"
                    options={dependentChoices}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.name) {
                        return option?.name;
                      }
                      return "";
                    }}
                    value={isDependent}
                    onChange={(e, newValue) => {
                      setIsDependent(newValue?.name || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='dependent'
                        placeholder="Dependent"
                      />
                    )}
                  />
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Single or Multiple
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    className="col-12 search-select"
                    options={employeeChoices}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.name) {
                        return option?.name;
                      }
                      return "";
                    }}

                    value={isEmployeeSingleOrMultiple}
                    onChange={(e, newValue) => {
                      setIsEmployeeSingleOrMultiple(newValue?.name || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='single or multi Employee'
                        className="col-12"

                        placeholder="Single or Multi Employee"
                      />
                    )}
                  />
                </Grid>


                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Start Date
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="date"
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Allocated Date"
                      variant="outlined"
                      value={earlyStartDate}
                      inputProps={{
                        min: new Date().toISOString()?.split("T")[0]
                      }}
                      onChange={(e) => { setEarlyStartDate(e.target.value) }}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    End Date
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="date"
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Allocated Date"
                      variant="outlined"
                      value={earlyFinishDate}
                      inputProps={{
                        min: new Date().toISOString()?.split("T")[0]
                      }}
                      onChange={(e) => { setEarlyFinishDate(e.target.value) }}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Duration in Days
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="text"
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Task Duration"
                      variant="outlined"
                      value={taskDuration}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Allocated Days
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="date"
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Allocated Date"
                      variant="outlined"
                      value={allocatedDate}
                      inputProps={{
                        min: new Date().toISOString()?.split("T")[0]
                      }}
                      onChange={(e) => { setAllocatedDate(e.target.value) }}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Deadline Date
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="date"
                      className="col-12 input-box2"
                      id="outlined-basic"
                      placeholder="Deadline Date"
                      variant="outlined"
                      value={deadlineDate}
                      onChange={(e) => { setDeadlineDate(e.target.value) }}
                    />
                  </Div>
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Select Periority
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    options={priorityChoices}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.name) {
                        return option?.name;
                      }
                      return "";
                    }}
                    className="col-12 search-select3"

                    value={priority}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        setPriority(newValue)
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='priority'
                        className="col-12"

                        placeholder="Select Priority"
                      />
                    )}
                  />
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Select Status
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete

                    className="col-12 search-select3 "
                    options={statusChoices}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.name) {
                        return option?.name;
                      }
                      return "";
                    }}

                    value={status}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        setStatus(newValue)
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='status'
                        className="col-12"

                        placeholder="Select Status"
                      />
                    )}
                  />
                </Grid>

                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Resource Cost
                  </Typography>
                </Grid>
                <Grid item >
                  <Div>
                    <TextField
                      type="text"
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Resource Cost"
                      variant="outlined"
                      value={resourceCost}
                      onChange={(e) => setResourceCost(e.target.value)}

                    />
                  </Div>
                </Grid>
                <Grid item >
                  <Typography
                    sx={[input_label]}
                  >
                    Asign Users
                  </Typography>
                </Grid>
                <Grid item >
                  <Autocomplete
                    multiple
                    options={userList}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.username) {
                        return option?.username;
                      }
                      return "";
                    }}

                    className={`col-12 search-select3`}
                    value={userList.filter(u => assignto.includes(u.id))}
                    onChange={(e, newValue) => {
                      handleChangeAssignTo(newValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name='tasktype'
                        className="col-12"
                      />
                    )}
                  />
                </Grid>

                <Grid item colSpan={12}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={isReminderSet} onChange={handleCheckboxChange} />} label={
                      <Typography sx={[input_label1]}>Set Reminder</Typography>
                    } />
                  </FormGroup>

                </Grid>

              </Customgrid>


            </Box>

            <Dragabledialog
              open={isReminderSet}
              onClose={() => handleDialogClose(false)}
              maxWidth={"md"}
            >
              <DialogTitle
                sx={[DisplayFlex, dialogTitle, { cursor: "move" }]}
                id="draggable-dialog-title"
              >
                Reminder
              </DialogTitle>
              <DialogContent>
                <Box mt={2} sx={{ height: "200px !important" }} >

                  <Customgrid columnCount={4}>

                    <Grid item colSpan={4} >
                      <Typography
                        sx={[input_label]}
                      >
                        First Reminder Before Due
                      </Typography>
                    </Grid>

                    <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                      <Div>
                        <TextField
                          className="w-full input-box2"
                          id="outlined-basic"
                          variant="outlined"
                          placeholder="Enter Time"
                          value={firstRemainder}
                          onChange={(e) => { setfirstRemainder(e.target.value) }}
                        />
                      </Div>
                      <Div>
                        <Autocomplete
                          className="w-full search-select3"
                          sx={{ width: "100px !important" }}
                          options={[{ name: "Days" }, { name: "Hrs" }, { name: "Mins" }]}
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.name) {
                              return option?.name;
                            }
                            return "";
                          }}
                          value={{name: firstREmainderHrs}}
                          onChange={(e, newValue) => {
                            setfirstREmainderHrs(newValue?.name || "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select"
                            />
                          )}
                        />
                      </Div>
                    </Grid>

                    <Grid item colSpan={4} >
                      <FormGroup sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={<Typography sx={
                            [input_label]
                          }>Repeat Every</Typography>}
                        />
                      </FormGroup>
                    </Grid>

                    <Grid item sx={{ display: "flex" }} colSpan={8} gap={2}>
                      <Div>
                        <TextField
                          className="w-full input-box2"
                          id="outlined-basic"
                          variant="outlined"
                          placeholder="Enter Time"
                          value={repeatEvery}
                          onChange={(e) => { setrepeatEvery(e.target.value) }}
                        />
                      </Div>
                      <Div>
                        <Autocomplete
                          className="w-full search-select3"
                          sx={{ width: "100px !important" }}
                          options={[{ name: "Days" }, { name: "Hrs" }, { name: "Mins" }]}
                          getOptionLabel={(option) => {
                            if (typeof option === "string") {
                              return option;
                            }
                            if (option && option?.name) {
                              return option?.name;
                            }
                            return "";
                          }}
                          value={{name: Repeateveryhrs}}
                          onChange={(e, newValue) => {
                            setRepeateveryhrs(newValue?.name || "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select"
                            />
                          )}
                        />
                      </Div>
                    </Grid>

                    <Grid item colSpan={4}>
                      <Typography
                        sx={[input_label]}
                      >
                        Reminder Message
                      </Typography>
                    </Grid>

                    <Grid item colSpan={8}>
                      <Div>
                        <CKEditor
                          content={editorContent}
                          events={{
                            change: onChange,
                          }}
                        />
                      </Div>
                    </Grid>
                  </Customgrid>
                </Box>


              </DialogContent>
              <DialogActions>

                <Div sx={{ display: 'flex', alignItems: "center", gap: 1, justifyContent: 'center', mt: 2 }}>
                  <CustomButton label="Save" Icon="saveIcon" onClick={() => handleDialogClose(true)} />
                  <Cancelbutton onClick={() => handleDialogClose(false)} />
                </Div>
              </DialogActions>
            </Dragabledialog>



            <Div sx={{ display: 'flex', alignItems: "center", gap: 1, justifyContent: 'center', mt: 2 }}>
              <CustomButton label="Save" Icon="saveIcon" onClick={handleClickSavetask} />
              <Cancelbutton onClick={() => setCreateClose(true)} />
            </Div>
          </Form>
        </Formik>
      </Div>
      <ToastContainer />
      <DialogBox
        open={createClose}
        onClickYes={() => {
          setCreateClose(false);
          setCreateTask(false);
        }}
        onClickNo={() => setCreateClose(false)}
      />
    </>
  );
};

export default CreateTask1;
