// import React, { useCallback, useEffect, useState } from "react";
// import Scheduler, { Editing, Resource, View } from "devextreme-react/scheduler";
// import "./TaskCalendar.css";
// import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
// import { useTaskAllList } from "../task-api/taskAPI";
// import { Dragabledialog } from "app/pages/widgets/StylesComponents";
// import TaskCU from "../task-mgmt-list/TaskCU";

// export const resourcesData = [
//   { id: 1, color: "#fe1f73" },
//   { id: 2, color: "#79d487" },
//   { id: 3, color: "#3357FF" },
//   { id: 4, color: "#ff9747" },
// ];

// const colors = ['#fe1f73', '#79d487', '#3357FF', '#ff9747'];

// const views = ["day", "week", "month"];
// const groups = ["priority"];

// const TaskCalendar = () => {
//   const { taskAllData, isLoadingTaskAllData, refetchTaskAllData } = useTaskAllList();
//   const [datas, setDatas] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [openAppointment, setOpenAppointment] = useState(null);
//   const [versions, setVersions] = useState([]);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     if (taskAllData?.results && resourcesData?.length > 0) {
//       const newDatas = taskAllData?.results?.map((task, index) => {
//         const color = colors[index % colors?.length];
//         const randomIndex = Math.floor(Math.random() * resourcesData?.length);
//         return {
//           ...task,
//           text: task?.TaskName,
//           ownerId: [resourcesData[randomIndex].id],
//           startDate: new Date(task?.Start_Date),
//           endDate: new Date(task?.Due_Date),
//           color: color,
//         };
//       });
//       setDatas(newDatas);
//       setVersions(prevVersions => [...prevVersions, newDatas]);
//     }
//   }, [taskAllData]);


//   useEffect(() => {
//     if (taskAllData?.results && resourcesData?.length > 0) {
//       const newDatas = taskAllData?.results?.map((task, index) => {
//         const randomIndex = Math.floor(Math.random() * resourcesData?.length);
//         return {
//           ...task,
//           text: task?.TaskName,
//           ownerId: [resourcesData[randomIndex].id],
//           startDate: new Date(task?.Start_Date),
//           endDate: new Date(task?.Due_Date),
//           color: task?.color,
//         };
//       });
//       setDatas(newDatas);
//       setVersions(prevVersions => [...prevVersions, newDatas]);
//     }
//   }, [resourcesData]);


//   const changeYear = useCallback(
//     direction => {
//       const newDate = new Date(currentDate);
//       newDate.setFullYear(currentDate.getFullYear() + direction);
//       setCurrentDate(newDate);
//     },
//     [currentDate]
//   );


//   // const handleCellClick = useCallback((s) => {
//   //   if (s?.cellData?.startDate) {
//   //     const startDateISO = new Date(s?.cellData?.startDate)
//   //       .toISOString()
//   //       .split(":00.000Z")[0];
//   //     setOpen(startDateISO);
//   //     console.log("Start date: ", s?.cellData, startDateISO);
//   //   }
//   // }, []);

//   const handleCellClick = useCallback(s => {
//     if (s?.cellData?.startDate) {
//       try {
//         const startDateISO = new Date(s.cellData.startDate).toISOString();
//         const formattedDate = startDateISO.includes(":00.000Z")
//           ? startDateISO.split(":00.000Z")[0]
//           : startDateISO;

//         setOpen(formattedDate);
//         setOpenAppointment(formattedDate);
//         console.log("AppointmentData", s.appointmentData);
//       } catch (error) {
//         console.error("Error processing cell click:", error);
//       }
//     } else {
//       console.warn("Invalid cell data or start date:", s?.cellData);
//     }
//   }, []);

//   const revertToVersion = versionIndex => {
//     if (versionIndex >= 0 && versionIndex < versions.length) {
//       setDatas(versions[versionIndex]);
//     }
//   };

//   return (
//     <JumboContentLayoutMain>
//       <div className="scheduler-container">
//         <Scheduler
//           timeZone="America/Los_Angeles"
//           dataSource={datas}
//           views={views}
//           defaultCurrentView="month"
//           defaultCurrentDate={currentDate}
//           height={700}
//           groups={groups}
//           cellDuration={60}
//           firstDayOfWeek={0}
//           startDayHour={8}
//           endDayHour={20}
//           editing={false}
//           onAppointmentDblClick={s => {
//             s.cancel = true;
//             setOpen(s.appointmentData || {});
//           }}
//           onCellClick={handleCellClick}
//         >
//           <View type="timelineMonth" />
//           <View type="month" />
//           <Resource
//             fieldExpr="ownerId"
//             allowMultiple={true}
//             dataSource={resourcesData}
//             label="Owner"
//             useColorAsDefault={true}
//           />
//           <Editing
//             allowAdding={false}
//             allowDragging={false}
//             allowResizing={false}
//             allowUpdating={false}
//             allowDeleting={false}
//           />
//         </Scheduler>

//         <br />
//       </div>
//       <br />

//       <Dragabledialog open={Boolean(open)} maxWidth="lg">
//         <TaskCU
//           open={open}
//           type={
//             typeof open !== "string" && Object?.keys(open)?.length > 0
//               ? "Edit"
//               : "Create"
//           }
//           setOpen={setOpen}
//           currentTaskRequest={openAppointment}
//         />
//       </Dragabledialog>
//     </JumboContentLayoutMain>
//   );
// };

// export default TaskCalendar;



import React, { useCallback, useEffect, useRef, useState } from "react";
import Scheduler, { Editing, Resource, View } from "devextreme-react/scheduler";
import "./TaskCalendar.css";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { useTaskAllList } from "../task-api/taskAPI";
import { Dragabledialog } from "app/pages/widgets/StylesComponents";
import TaskCU from "../task-mgmt-list/TaskCU";

export const resourcesData = [
  { id: 1, color: "#d8b78e" },
  { id: 2, color: "#a3d88e" },
  { id: 3, color: "#8ec4d8" },
  { id: 4, color: "#d68ed8" },
];

const colors = ['#d8b78e', '#a3d88e', '#8ec4d8', '#d68ed8'];

const views = ["day", "week", "month"];
const groups = ["priority"];

const TaskCalendar = () => {
  const { taskAllData, isLoadingTaskAllData, refetchTaskAllData } = useTaskAllList();
  const [datas, setDatas] = useState([]);
  const [openTask, setOpenTask] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAppointment, setOpenAppointment] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const schedulerRef = useRef(null);

  useEffect(() => {
    if (taskAllData?.results && resourcesData?.length > 0) {
      const newDatas = taskAllData?.results?.map((task, index) => {
        const color = colors[index % colors?.length];
        const randomIndex = Math.floor(Math.random() * resourcesData?.length);
        return {
          ...task,
          text: task?.TaskName,
          ownerId: [resourcesData[randomIndex].id],
          startDate: new Date(task?.Start_Date),
          endDate: new Date(task?.Due_Date),
          color: color,
        };
      });
      setDatas(newDatas);
      setVersions(prevVersions => [...prevVersions, newDatas]);
    }
  }, [taskAllData]);

  const onAppointmentFormOpening = (e) => {
    // // Customize the form fields or the popup here
    // const { form } = e;

    // // For example, changing the popup width and adding a custom button
    // e.popup.option('width', 500);
    // e.popup.option('height', 600);

    // form.option('items', [
    //   {
    //     dataField: 'text',
    //     label: { text: 'Title' },
    //   },
    //   {
    //     dataField: 'startDate',
    //     editorType: 'dxDateBox',
    //     editorOptions: { width: '100%' },
    //   },
    //   {
    //     dataField: 'endDate',
    //     editorType: 'dxDateBox',
    //     editorOptions: { width: '100%' },
    //   },
    //   {
    //     dataField: 'description',
    //     editorType: 'dxTextArea',
    //     editorOptions: { width: '100%', height: 100 },
    //   },
    //   // Add custom buttons or fields as needed
    // ]);

    e.cancel = true;

    // Extract appointment data and open your custom dialog
    try {
      const startDateISO = new Date(e.appointmentData?.startDate).toISOString();
      const formattedDate = startDateISO.includes(":00.000Z")
        ? startDateISO.split(":00.000Z")[0]
        : startDateISO;

      setOpen(e.appointmentData);
      setOpenAppointment(formattedDate);
      setOpenTask(true);
      console.log("AppointmentData", e.appointmentData);
    } catch (error) {
      console.error("Error processing cell click:", error);
    }

  };

  const changeYear = useCallback(
    direction => {
      const newDate = new Date(currentDate);
      newDate.setFullYear(currentDate.getFullYear() + direction);
      setCurrentDate(newDate);
    },
    [currentDate]
  );

  const handleCellClick = useCallback(s => {
    if (s?.cellData?.startDate) {
      try {
        const startDateISO = new Date(s.cellData?.startDate).toISOString();
        const formattedDate = startDateISO.includes(":00.000Z")
          ? startDateISO.split(":00.000Z")[0]
          : startDateISO;

        setOpen(formattedDate);
        setOpenAppointment(formattedDate);
        setOpenTask(true);
        console.log("AppointmentData", s.appointmentData);
      } catch (error) {
        console.error("Error processing cell click:", error);
      }
    } else {
      console.warn("Invalid cell data or start date:", s?.cellData);
    }
  }, []);

  const revertToVersion = versionIndex => {
    if (versionIndex >= 0 && versionIndex < versions.length) {
      setDatas(versions[versionIndex]);
    }
  };

  return (
    <JumboContentLayoutMain>
      <div className="scheduler-container">
        <Scheduler
          ref={schedulerRef}
          timeZone="America/Los_Angeles"
          dataSource={datas}
          views={views}
          defaultCurrentView="month"
          defaultCurrentDate={currentDate}
          // currentDate={currentDate}  // Bind currentDate state
          height={560}
          groups={groups}
          cellDuration={120}
          firstDayOfWeek={0}
          startDayHour={6}
          endDayHour={24}
          editing={false}
          onAppointmentDblClick={s => {
            s.cancel = true;
            setOpen(s.appointmentData || {});
            setOpenTask(true);
          }}
          onCellClick={handleCellClick}
          maxAppointmentsPerCell={2}
          onAppointmentFormOpening={onAppointmentFormOpening}
        >
          <View type="timelineMonth" />
          <View type="month" />
          <View type="day" />  {/* Ensure the "day" view is included */}
          <Resource
            fieldExpr="ownerId"
            allowMultiple={true}
            dataSource={resourcesData}
            label="Owner"
            useColorAsDefault={true}
          />
          <Editing
            allowAdding={false}
            allowDragging={false}
            allowResizing={false}
            allowUpdating={false}
            allowDeleting={false}
          />
        </Scheduler>

        <br />
      </div>
      <br />

      <Dragabledialog open={Boolean(openTask)} maxWidth="lg">
        <TaskCU
          open={open}
          type={
            typeof open !== "string" && Object?.keys(open)?.length > 0
              ? "Edit"
              : "Create"
          }
          setOpen={setOpenTask}
          currentTaskRequest={openAppointment}
        />
      </Dragabledialog>
    </JumboContentLayoutMain>
  );
};

export default TaskCalendar;
