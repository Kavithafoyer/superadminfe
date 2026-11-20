import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  ButtonStyle,
  CRMTableHead,
  ComponentHeading,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
  componentTitle,
} from "../../widgets/CRMStyles";
import axios from "axios";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import moment from "moment";
import { BsArrowDownUp } from "react-icons/bs";
import { BASE_URL } from "app/services/auth-services";
import SearchBar from "../../widgets/SearchField";
import UpdateTaskDialog from "./UpdateTaskDialog";
import { AutoHeight } from "app/redux/auth/localStorage";
import CustomTableHeader from "../../widgets/CustomTableHeader";
import { EditIcon } from "../../widgets/StylesComponents";
import { useQuery } from "react-query";

const UpdateTaskList = () => {
  const [updateTaskDialogOpen, setUpdateTaskDialogOpen] = useState(false);
  const [assignTaskLists, setAssignTaskLists] = useState([]);
  const token = localStorage.getItem("accesstoken");
  const [page, setPage] = useState(page || 1);
  const [assignTaskListsCount, setAssignTaskListsCount] = useState(0);
  const [data, setData] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "task_name", label: "Task Name", bool: true },
    { sort: "days", label: "Total Est in Days", bool: true },
    { sort: "startDate", label: "Start Date", bool: true },
    { sort: "endDate", label: "Early Finish Date", bool: true },
    { sort: "taskStatus", label: "Status Update", bool: true },
  ]);

  const getTaskList = async (pageNum) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
     const response =  await axios.get(`${BASE_URL}/superadmin/NewTaskManagemntMyAdditional/`, {
        params: {
          page: pageNum,
          Created_By: localStorage.getItem("UserId")
        },
        headers: headers,
      });

      return response?.data
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const getTaskListBySearch = async (searchData) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    await axios
      .get(`${BASE_URL}/superadmin/Newtaskmanagmentsearch/`, {
        params: {
          search: searchData,
        },
        headers: headers,
      })
      .then((res) => {
        console.log("SearchResponse", res?.data);
        setAssignTaskLists(res?.data?.results || res?.data);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };
  const SearchData = (e) => {
    let searchValue = e.target.value;
    if (searchValue) {
      getTaskListBySearch(searchValue);
    } else {
        refetchGetAllTaskList();
    }
  };

  // useQuery section ---------------------------------------------------------------

  const {
    data: getAllTaskList,
    isLoading: isLoadingGetAllTaskList,
    isError,
    refetch: refetchGetAllTaskList,
  } = useQuery(["getAllProjectsLists", page], () => getTaskList(page), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (Boolean(getAllTaskList)) {
      setAssignTaskLists(getAllTaskList?.results);
      setAssignTaskListsCount(getAllTaskList?.count);
    }
  }, [getAllTaskList]);


  return (
    <>
      <JumboContentLayoutMain>
        <Typography
          id="Typography-root"
          sx={[componentTitle, { transform: "translateY(-20px)" }]}
        >
          Task List
        </Typography>
        <Box>
          <Div
            sx={[DisplayFlex, { flexWrap: "wrap", justifyContent: "flex-end",gap:"0px !important" }]}
          >
            <SearchBar
              color="gray"
              border={"1px solid lightgray"}
              width={{ xs: "100%", md: "250px !important" }}
              SearchData={SearchData}
            />
          </Div>
        </Box>

        <Box sx={{ mt: 2 }}>
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={AutoHeight(1.6)}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            <Table stickyHeader>
              <CustomTableHeader
                headerMenuItems={columnMenuItems}
                setHeadermenuItems={setColumnMenuItems}
                sortDatas={assignTaskLists}
                setDatas={setAssignTaskLists}
              />

              <TableBody className="table-body" sx={{ mt: 2 }}>
                {assignTaskLists?.map((item, index) => {
                  return (
                    <CRMTableRow key={index}>
                      <CRMTableCell data-title="Task Name">
                        {item?.task_name}
                      </CRMTableCell>
                      <CRMTableCell data-title="Total Estimation in Days">
                        {item?.task_duration}
                      </CRMTableCell>
                      <CRMTableCell data-title="Start Date">
                        {moment(item?.early_start).format(
                          "YYYY-MM-DD"
                        )}
                      </CRMTableCell>
                      <CRMTableCell data-title="Early Finish Date">
                        {moment(item?.early_finish).format("YYYY-MM-DD")}
                      </CRMTableCell>
                      <CRMTableCell data-title="Status Update">
                        {item?.taskStatus}
                      </CRMTableCell>
                      <CRMTableCell
                        align="center"
                        data-title="Action"
                        sx={[
                          DisplayFlex,
                          {
                            cursor: "pointer",
                            mb: 1,
                            justifyContent: { xs: "left", md: "center" },
                          },
                        ]}
                      >
                        <EditIcon
                          onClick={() => {
                            setUpdateTaskDialogOpen(item);
                          }}
                        />
                      </CRMTableCell>
                    </CRMTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </JumboScrollbar>
        </Box>
        <Div
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Pagination
            color="success"
            count={Math?.ceil((assignTaskListsCount || 0) / 10)}
            page={page}
            onChange={(e, newValue) => handleChangePage(e, newValue)}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Div>
      </JumboContentLayoutMain>
      {Boolean(updateTaskDialogOpen) && (
        <UpdateTaskDialog
          updateTaskDialogOpen={updateTaskDialogOpen}
          setUpdateTaskDialogOpen={setUpdateTaskDialogOpen}
          getTaskList={() => refetchGetAllTaskList()}
        ></UpdateTaskDialog>
      )}
    </>
  );
};

export default UpdateTaskList;
