import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, Table, TableBody, TableHead, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { CRMTableHead, DialogBoxCancelButton, DialogBoxSaveButton, DialogHeader, DisplayFlex, FontStyle, dialogTitle } from '../../widgets/CRMStyles';
import { BASE_URL } from 'app/services/auth-services';
import axios from 'axios';
import { toast } from 'react-toastify';
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { CRMTableCell, CRMTableRow } from '../../widgets/CRMTable';
import { BsArrowDownUp } from 'react-icons/bs';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import Div from '@jumbo/shared/Div';
import { Cancelbutton, CustomButton, DialogBox } from '../../widgets/StylesComponents';
import { useQueryClient } from 'react-query';

const UpdateTaskDialog = ({ updateTaskDialogOpen, setUpdateTaskDialogOpen, getTaskList }) => {
const queryClient = useQueryClient()

  const [open, setOpen] = useState(updateTaskDialogOpen ? true : false)
  const [taskList, setTaskList] = useState([])
  const [task, setTask] = useState('')
  const [userList, setUserList] = useState([])
  const [employee, setEmployee] = useState('')
  const [taskEstimation, setTaskEstimation] = useState('')
  const [earlyStartDate, setEarlyStartDate] = useState(new Date().toISOString().split('T')[0])
  const [earlyFinishDate, setEarlyFinishDate] = useState(new Date().toISOString().split('T')[0])
  const statusChoices = [{ name: 'Not Started' }, { name: 'In Progress' }, { name: 'Completed' }]
  const [status, setStatus] = useState('Not Started')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [taskId, setTaskId] = useState('')
  const [employeeNames, setEmployeeNames] = useState([])
  const [updateData, setUpdateData] = useState(updateTaskDialogOpen)
  const priorityChoices = ['LOW', 'NORMAL', 'HIGH']
  const [updateTaskDetails, setUpdateTaskDetails] = useState([])
  const completePercentageChoices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const [istableRowVisible, setIsTableRowVisible] = useState(false)
  const [save, setSave] = useState(false)

  const handleClose = () => {
    setSave(false)
    setUpdateTaskDialogOpen(false)
  }
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [workDetails, setWorkDetails] = useState('')
  const token = localStorage.getItem("accesstoken")

  useEffect(() => {
    setUpdateData(updateTaskDialogOpen)
    setOpen(updateTaskDialogOpen ? true : false)
  }, [updateTaskDialogOpen])

  const saveTableData = () => {
    const payload = {
      "date": date,
      "work_details": workDetails,
      "percentage": updateData?.percentageOfComplete,
      "task": updateData?.id,
      "Created_By": localStorage.getItem("UserId"),
      "Updated_By": localStorage.getItem("UserId"),
      "Organization_Id": localStorage.getItem("OrganizationId"),
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "db": localStorage.getItem("DBName")
    }

    axios.post(`${BASE_URL}/superadmin/TaskUpdateCRUD/`, payload, { headers: headers })
      .then((res) => {
        console.log("saveTableData", res)
        if (res?.status === 201 || res?.status === 200) {
          toast.success("Stored In Table Successfully")
        }
      })
      .catch((error)=>{
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

  const handleUpdate = () => {
    const payload = {
      "id": updateData?.id,
      "task_name": updateData?.task_name,
      "priority": updateData?.priority,
      "percentageOfComplete": updateData?.percentageOfComplete,
      "taskStatus": typeof updateData?.taskStatus === 'object' ? updateData?.taskStatus?.name : updateData?.taskStatus,
      "isDone": updateData?.percentageOfComplete === 100 ? true : false
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "db": localStorage.getItem("DBName")
    }

    axios.patch(`${BASE_URL}/superadmin/NewTaskManagemntCRUD/`, payload, { headers: headers })
      .then((res) => {
        console.log("assignTaskCRUDPost", res)
        if (res?.status === 200) {
          if (istableRowVisible && workDetails) {
            saveTableData()
          }
          toast.success("Updated Successfully")
          handleClose()
          queryClient.invalidateQueries("getAllProjectsLists")
          if(getTaskList) getTaskList()
        }
      })
      .catch((error)=>{
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


  const userLists = () => {
    let token = localStorage.getItem("accesstoken")

    axios
      .get(`${BASE_URL}/superadmin/UsersList/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "db": localStorage.getItem("DBName")
        },
      })
      .then((res) => {
        setUserList(res.data);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  }


  useEffect(() => {
    userLists()
  }, [])

  const handleUpdateTask = (field, value) => {
    let data = {
      ...updateData,
      [field]: value
    }
    setUpdateData(data)
  }


  useEffect(() => {
    setDate(moment(new Date()).format("YYYY-MM-DD"));
  }, [])

  const getUpdateTaskDetails = async() => {
    if(!updateTaskDialogOpen?.id) return
    await axios
      .get(`${BASE_URL}/superadmin/TaskUpdateAdditional/`, {
        params: {
          task_id: updateTaskDialogOpen?.id
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        setUpdateTaskDetails(res?.data?.results || res?.data)
      })
      .catch((error) => {
        console.error("error", error);
      });
  }

  useEffect(() => {
    getUpdateTaskDetails()
  }, [updateTaskDialogOpen])



  return (
    <>
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={'sm'}
    >
      <DialogTitle
    align="left"
    id="alert-dialog-title"
    sx={[dialogTitle, DisplayFlex, { justifyContent: "space-between" }]}
  >
    Edit Task
  </DialogTitle>
      <DialogContent >
        <Grid container spacing={2} sx={{mt: 1}}>
          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Typography id="Typography-root"  sx={[FontStyle]}>Task Name </Typography>
            <TextField
              type="text"
              className="col-12 input-box"
              id="outlined-basic"
              placeholder="Task Name"
              variant="outlined"
              value={updateData?.task_name}
              onChange={(e) => { handleUpdateTask('task_name', e.target.value) }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Typography id="Typography-root"  sx={[FontStyle]}>Priority</Typography>
            <FormControl className="col-12" >
              <Autocomplete
                className=" col-12 search-select"
                options={priorityChoices}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return "";
                }}
                value={updateData?.priority}
                onChange={(e, newValue) => {
                  if (newValue) {
                    handleUpdateTask('priority', newValue)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name='priorityChoices'
                    className="col-12"
                    placeholder="Select Priority"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Typography id="Typography-root"  sx={[FontStyle]}>Complete %</Typography>
            <FormControl className="col-12" >
              <Autocomplete
                className=" col-12 search-select"
                options={completePercentageChoices}
                getOptionLabel={(option) => {
                  return option?.toString() || "";
                }}
                
                value={updateData?.percentageOfComplete}
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    handleUpdateTask('percentageOfComplete', newValue)
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name='percentageOfComplete'
                    className="col-12"
                    
                    placeholder="Select Percentage"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6} lg={6} xl={6} >
            <Typography id="Typography-root"  sx={[FontStyle]}>Status Update</Typography>
            <FormControl className="col-12 " >
              <Autocomplete
                className="col-12 search-select"
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
                
                value={typeof updateData?.taskStatus === 'string' ? {name: updateData?.taskStatus} : updateData?.taskStatus}
                onChange={(e, newValue) => {
                  handleUpdateTask('taskStatus', newValue)
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name='status'
                    className="col-12"
                    
                    placeholder="Status Update"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Box sx={{ width: '100%', typography: 'body1', mt: 2 }}>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMax={250}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table className="table" >
                <TableHead sx={[CRMTableHead, FontStyle]}  >
                  <CRMTableRow>
                    <CRMTableCell sx={{ fontWeight: 600 }}>Date</CRMTableCell>
                    <CRMTableCell sx={{ fontWeight: 600 }}>Work Details</CRMTableCell>
                    <CRMTableCell sx={{ fontWeight: 600 }}>Percentage %</CRMTableCell>
                    <CRMTableCell></CRMTableCell>
                  </CRMTableRow>
                </TableHead>
                <TableBody className="table-body" >
                  {updateTaskDetails?.map((task, index) => {
                    return (
                      <CRMTableRow key={index}>
                        <CRMTableCell data-title="Date">{task?.date}</CRMTableCell>
                        <CRMTableCell data-title="Work Details">{task?.work_details}</CRMTableCell>
                        <CRMTableCell data-title="Percentage %">{task?.percentage}</CRMTableCell>
                        <CRMTableCell></CRMTableCell>
                      </CRMTableRow>)
                  })}
                  {istableRowVisible &&
                    <CRMTableRow>
                      <CRMTableCell data-title="Date">
                        <TextField
                          type="date"
                          className="col-12 input-box"
                          variant="outlined"
                          value={date}
                          onChange={(e) => { setDate(e.target.value) }}
                        />
                      </CRMTableCell>
                      <CRMTableCell data-title="Work Details">
                        <TextField
                          type="text"
                          className="col-12 input-box"
                          placeholder="Enter Work details"
                          variant="outlined"
                          value={workDetails}
                          onChange={(e) => { setWorkDetails(e.target.value) }}
                        />
                      </CRMTableCell>
                      <CRMTableCell data-title="Percentage %">
                        {updateData?.percentageOfComplete}
                      </CRMTableCell>
                      <CRMTableCell><IconButton onClick={() => { setIsTableRowVisible(false) }}><DeleteIcon sx={{ color: 'red' }}></DeleteIcon></IconButton></CRMTableCell>
                    </CRMTableRow>
                  }

                </TableBody>
              </Table>
              <Div sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                {!istableRowVisible &&
                  <CustomButton label='Add Row' onClick={() => { setIsTableRowVisible(true) }} Icon=''  />
                }
              </Div>

            </JumboScrollbar>
          </Box>

        </Grid>
        <Div sx={{ display: 'flex', alignItems: "center", gap: 1, justifyContent: 'center', mt:2 }}>
                <CustomButton label="Save" Icon="saveIcon" onClick={handleUpdate} />
                <Cancelbutton onClick={() => setSave(true)} />
            </Div>

          </DialogContent>
    </Dialog >

    <DialogBox open={save} onClickNo={()=>setSave(false)} onClickYes={()=>handleClose()}/>
    </>
  )
}

export default UpdateTaskDialog
