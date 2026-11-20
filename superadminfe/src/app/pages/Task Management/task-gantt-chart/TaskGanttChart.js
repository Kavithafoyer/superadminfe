import React, { useCallback, useEffect, useState } from "react";
import Gantt, {
  Tasks,
  Column,
  Editing,
  Toolbar,
  Item,
  Validation,
} from "devextreme-react/gantt";
import { TaskCUD, useTaskAllList } from "../task-api/taskAPI.js";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain.js";
import { Typography } from "@mui/material";
import { componentTitle, } from "app/pages/widgets/CRMStyles.js";
import { DialogBox, Dragabledialog, } from "app/pages/widgets/StylesComponents.js";
import TaskCU from "../task-mgmt-list/TaskCU.js";
import { toast } from "react-toastify";
import { QueryClient } from "react-query";
import './ganttChart.css';


function TaskGanttChart() {
  const queryClient = new QueryClient();


  const { taskAllData, isLoadingTaskAllData, refetchTaskAllData } = useTaskAllList();
  const [datas, setDatas] = useState([]);
  const [scaleType, setScaleType] = useState("days");
  const [open, setOpen] = useState(false);
  const [save, setSave] = useState("");

  useEffect(() => {
    let list = [];
    if (taskAllData?.results) {
      taskAllData?.results?.map((task) => {
        list.push({
          ...task,
          parentId: 0,
          // progress: 100,
          title: task?.TaskName,
          start: new Date(task?.Start_Date),
          end: new Date(task?.Due_Date),
        });
      });
      setDatas(list);
    }
  }, [taskAllData]);

  const changeScaleType = (type) => {
    setScaleType(type);
  };

  const handleCellClick = useCallback((s) => {
    console.log("sfsafasnf22 : ", s);

    if (s?.data?.startDate) {
      const startDateISO = new Date(s?.data?.startDate)
        .toISOString()
        .split(":00.000Z")[0];
      setOpen(startDateISO);
    }
  }, []);

  return (
    <JumboContentLayoutMain>
      <div className="container"
        onClick={() =>
          Boolean(isLoadingTaskAllData) &&
          toast.warning("loading data please wait...", { autoClose: 500 })
        }
        style={{ backgroundColor: '#fff' }}
      >
        <Typography sx={[componentTitle]} className="mb-2">
          Task Gantt Chart
        </Typography>
        <Gantt
          disabled={Boolean(isLoadingTaskAllData)}
          editing={{
            allowTaskDeleting: true,
          }}
          onTaskEditDialogShowing={false}
          taskListWidth={300}
          scaleType={scaleType}
          height={530}
          zIndex={0}
          onTaskDblClick={(e, dat) => {
            e.cancel = true;
            console.log("sfsafasnf : ", e, dat);
            setOpen(datas?.find((item) => item.id === e.data?.id) || null);
          }}
          onTaskClick={handleCellClick}
          onTaskDeleted={(e) => setSave(e?.data?.id)}
          style={{ cursor: "pointer" }}
        >
          <Tasks dataSource={datas} />
          {/* <Dependencies dataSource={dependencies} /> */}
          {/* <Resources dataSource={resources} /> */}
          {/* <ResourceAssignments dataSource={resourceAssignments} /> */}

          <Toolbar className="d-flex items-center justify-end ganttcharttoolbar">
            <Item name="zoomIn" />
            <Item name="zoomOut" />
            <Item name="separator" />
            <Item name="year" onClick={() => changeScaleType("years")} />
            <Item name="month" onClick={() => changeScaleType("months")} />
            <Item name="week" onClick={() => changeScaleType("weeks")} />
            <Item name="day" onClick={() => changeScaleType("days")} />
          </Toolbar>

          <Column dataField="title" caption="Task Name" width={150} sx={{ zIndex: -1 }} />
          {/* <Column
                minWidth={100}
                dataField="start"
                dataType="date"
                caption="Start Date"
              />
              <Column
                minWidth={100}
                dataField="end"
                dataType="date"
                caption="Due Date"
              /> */}

          <Validation autoUpdateParentTasks />
          <Editing enabled={false} />
        </Gantt>

        <Dragabledialog open={open} maxWidth="lg">
          <TaskCU
            open={open}
            type={
              typeof open !== "string" && Object?.keys(open)?.length > 0
                ? "Edit"
                : "Create"
            }
            setOpen={setOpen}
          />
        </Dragabledialog>

        <DialogBox
          Content={"Are you sure you want to delete this task?"}
          open={Boolean(save)}
          onClickNo={() => setSave(false)}
          onClickYes={async () => {
            let res = await TaskCUD("delete", save?.id);
            if (res?.error) {
              queryClient.invalidateQueries("refetchTaskAllList");
              toast.success(`${res?.error} Deleted Unsuccessfully`);
            } else {
              toast.success("Deleted Successfully");
              setSave(false);
            }
          }}
        />
      </div>
    </JumboContentLayoutMain>
  );
}
export default TaskGanttChart;
