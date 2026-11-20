import Div from '@jumbo/shared/Div';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from 'app/services/auth-services';
import { FontStyle } from '../../widgets/CRMStyles';
import { Cancelbutton, CustomButton, DialogBox, SelectDropdown } from '../../widgets/StylesComponents';

const manufacturer = [{ name: "Assigned" }, { name: "In Assigned" }, { name: "Completed" }, { name: "In Progress" }];

const OverviewTask = ({ setOverviewTask, setListTask, popupdatas }) => {
  const [datas, setdatas] = useState([])
  const [status, Setstatus] = useState("")
  const [save, setSave] = useState(false)
  const [userList, setUserList] = useState([])
  const [assignedUsers, setAssignedUsers] = useState([])

  const createrId = localStorage.getItem("UserId");

  useEffect(() => {
    setdatas(popupdatas)
    Setstatus(popupdatas?.Status || popupdatas?.taskStatus)
  }, [popupdatas])

  const handleClickBack = () => {
    setOverviewTask(false);
    setSave(false)
    if(setListTask) setListTask(true);
  }

  const handleSaveStatus = () => {
    if (status === null || status === "" || status === undefined) {
      toast.error("Invalid Data", {
        position: "top-right",
        autoClose: 100
      });
    } else {
      let payload = {
        "id": datas?.id,
        "taskStatus": status,
        "Updated_By": createrId
      }
      axios
        .patch(`${BASE_URL}/superadmin/NewTaskManagemntCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "db": localStorage.getItem("DBName")
          },
        })
        .then((res) => {
          setOverviewTask(false)
          setSave(false)
          toast.success("Updated Successfully", {
            position: "top-right",
            autoClose: 100
          });
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage = error.response.data.details || "You don't have permission to do it";
            toast.error(errorMessage, { position: "top-right", autoClose: 100 });
          } else {
            toast.error(`${error}`, { position: "top-right", autoClose: 100 });
          }
        });
    }
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
        setUserList(res?.data);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  }

  useEffect(() => {
    if (datas && Object.keys(datas).length > 0 && userList.length > 0) {
      let users = []
      const selectedUsers = userList?.filter(user => datas?.assign_to_users?.includes(user.id))
      selectedUsers.forEach((user) => { users.push(user.username) })
      setAssignedUsers(users)
    }
  }, [datas, userList])

  useEffect(() => {
    userLists()
  }, [])

  const InfoRow = ({ label, value }) => (
    <Grid
      xs={12} md={12} lg={12} xl={12}
      sx={{ display: "flex", alignItems: "center", gap: "20%", mb: 1 }}
    >
      <Div sx={{ display: "flex", alignItems: "center" }}>
        <Typography id="Typography-root" sx={[FontStyle, { width: "130px" }]}>{label}</Typography>
        <Typography id="Typography-root" sx={[FontStyle]}>:</Typography>
      </Div>
      <Div>
        <Typography sx={[FontStyle]}>{value || "-"}</Typography>
      </Div>
    </Grid>
  );

  return (
    <>
      <Div>
        <Grid container>
          <InfoRow label="Task Id" value={datas?.Task_Id || datas?.task_id} />
          <InfoRow label="Task Type" value={datas?.Task_Type || datas?.tast_type} />
          <InfoRow label="Task Name" value={datas?.Task_Name || datas?.task_name} />
          <InfoRow label="Assign To" value={assignedUsers?.join(", ") || datas?.Assign_toUsers} />
          <InfoRow label="Description" value={datas?.Description} />
          <InfoRow label="Allocated Date" value={datas?.Allocated_Date?.split("T")[0] || datas?.Allocated_Date} />
          <InfoRow label="Established Date" value={datas?.Deadline_Date?.split("T")[0] || datas?.Deadline_Date} />

          <Grid
            xs={12} md={12} lg={12} xl={12}
            sx={{ display: "flex", alignItems: "center", gap: "20%", mt: 1 }}
          >
            <Div sx={{ display: "flex", alignItems: "center" }}>
              <Typography id="Typography-root" sx={[FontStyle, { width: "130px" }]}>Status</Typography>
              <Typography id="Typography-root" sx={[FontStyle]}>:</Typography>
            </Div>
            <SelectDropdown
              value={status}
              options={manufacturer}
              getOptionLabel="name"
              name="status"
              onChange={(e, value) => Setstatus(value?.name)}
            />
          </Grid>
        </Grid>

        <Div sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center", mt: 3 }}>
          <CustomButton label="Save" Icon="saveIcon" onClick={handleSaveStatus} />
          <Cancelbutton onClick={() => setSave(true)} />
        </Div>
      </Div>

      <DialogBox
        open={save}
        onClickYes={() => { handleClickBack() }}
        onClickNo={() => setSave(false)}
      />
    </>
  )
}

export default OverviewTask;
