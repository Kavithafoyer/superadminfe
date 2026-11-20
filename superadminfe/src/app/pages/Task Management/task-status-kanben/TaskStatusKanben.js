import React, { useEffect, useState } from "react";
import Board, { moveColumn } from "@asseinfo/react-kanban";
import "@asseinfo/react-kanban/dist/styles.css";
import "./kanben.css";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { Typography } from "antd";
import { Chip } from "@mui/material";
import { componentTitle } from "app/pages/widgets/CRMStyles";
import { toast } from "react-toastify";
import {
  CustomScrollbarBox,
  Div,
  formatDateTime,
} from "app/pages/widgets/StylesComponents";
import {
  useGetTaskAllRecordsQuery,
  useUpdateTaskStatusMutation,
} from "app/services/RTKApis/taskmanagementnew/NonProjectTaskApi";
import { BsClockHistory } from "react-icons/bs";
import { AutoHeight } from "app/redux/auth/localStorage";

const TaskStatusKanben = () => {
  const [board, setBoard] = useState({
    columns: [
      { id: 1, title: "Not Started", cards: [] },
      { id: 2, title: "In Progress", cards: [] },
      { id: 3, title: "Completed", cards: [] },
    ],
  });

  const [loading, setIsLoading] = useState(false);

  const {
    data: taskData,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTaskAllRecordsQuery();
  const [updateStatus] = useUpdateTaskStatusMutation();

  const handleColumnMove = (_card, source, destination) => {
    const updatedBoard = moveColumn(board, source, destination);
    setBoard(updatedBoard);
  };

  const handleCardMove = (_card, source, destination) => {
    if (source.fromColumnId !== destination.toColumnId) {
      updateCardStatus(_card, destination.toColumnId);
    }
  };

  const updateCardStatus = async (card, columnId) => {
    setIsLoading(true);
    let statusName =
      columnId === 1
        ? "Not Started"
        : columnId === 2
          ? "In Progress"
          : "Completed";

    try {
      await updateStatus({ id: card.id, Status: statusName }).unwrap();
      toast.success(`Task moved to ${statusName}`);
      refetchTasks();
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (taskData?.results) {
      const newBoard = {
        columns: [
          {
            id: 1,
            title: "Not Started",
            cards: taskData.results.filter((t) => t.Status === "Not Started"),
          },
          {
            id: 2,
            title: "In Progress",
            cards: taskData.results.filter((t) => t.Status === "In Progress"),
          },
          {
            id: 3,
            title: "Completed",
            cards: taskData.results.filter((t) => t.Status === "Completed"),
          },
        ],
      };
      setBoard(newBoard);
    }
  }, [taskData]);

  return (
    <JumboContentLayoutMain>
      <Typography sx={[componentTitle]} className="mb-2">
        Task Status (Pending Tasks)
      </Typography>
      <CustomScrollbarBox scrollHeight={AutoHeight(1.4)}>
        <div className="w-full">
          <Board
            onCardDragEnd={handleCardMove}
            onColumnDragEnd={handleColumnMove}
            renderCard={(props) => (
              <div className="kanban-card min-w-[300px] bg-white p-3 shadow-md rounded-md mb-2">
                <Typography variant="subtitle1" fontWeight={700}>
                  {props.Task_Name}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-2"
                >
                  {props.Task_Description?.length > 50
                    ? props.Task_Description.substring(0, 50) + "..."
                    : props.Task_Description}
                </Typography>
                <Div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <BsClockHistory className="text-blue-500" />
                    <Typography variant="caption">
                      {formatDateTime(props.Created_Date, "date")}
                    </Typography>
                  </div>
                  <Chip label={props.Priority} size="small" />
                </Div>
              </div>
            )}
            renderColumnHeader={(props) => (
              <div
                className={`column-header p-2 text-white font-bold rounded-t-md ${
                  props.title === "Not Started"
                    ? "bg-gray-600"
                    : props.title === "In Progress"
                      ? "bg-blue-600"
                      : "bg-green-600"
                }`}
              >
                {props.title} ({props.cards?.length || 0})
              </div>
            )}
          >
            {board}
          </Board>
        </div>
      </CustomScrollbarBox>
    </JumboContentLayoutMain>
  );
};

export default TaskStatusKanben;
