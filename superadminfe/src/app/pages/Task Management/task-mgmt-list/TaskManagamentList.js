import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  Typography,
  Menu,
  FormGroup,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Popover,
  Box,
  Tabs,
  Tab,
  Pagination,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverviewTask from "./OverviewTask";
import CloseIcon from "@mui/icons-material/Close";
import { BsArrowDownUp } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
import { apiConfig } from "app/services/config";
import { SettingsIcon } from "app/icons/PngIcons";
import JumboIconify from "@jumbo/components/JumboIconify";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  StyledTab,
  StyledTabs,
  componentTitle,
  deletedWarnigMsg,
  dialogTitle,
} from "../../widgets/CRMStyles";
import { TabContext, TabPanel } from "@mui/lab";
import SearchBar from "../../widgets/SearchField";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import {
  Cancelbutton,
  CustomButton,
  DeletedIcon,
  DialogBox,
  Dragabledialog,
  EditIcon,
  NoRecordsPage,
} from "../../widgets/StylesComponents";
import { BiFilterAlt } from "react-icons/bi";
import { GrPowerReset } from "react-icons/gr";
import CustomTableHeader from "../../widgets/CustomTableHeader";
import { AutoHeight } from "app/redux/auth/localStorage";
import UpdateTaskList from "./UpdateTaskList";
import CreateTask1 from "./CreateTask";
import { useQuery } from "react-query";

const TaskManagementList = ({ scrollHeight }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("My Request");
  const [createTask, setCreateTask] = useState(false);
  const [updateTask, setUpdateTask] = useState(false);
  const [overviewTask, setOverviewTask] = useState(false);
  const [listTask, setListTask] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const [datas, setdatas] = useState([]);

  const [updatedata, setupdatedata] = useState([]);
  const [popupdatas, setpopupdatas] = useState([]);

  const [dateformat, setdateformat] = useState("");
  const [save, setSave] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setdeleteDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [taskLists, setTaskLists] = useState([]);
  const [taskListsCount, setTaskListsCount] = useState(0);

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: tabValue === 0 ? "Task_Id" : "task_id", label: "Task Id", bool: true },
    { sort: tabValue === 0 ? "Task_Type" : "tast_type", label: "Task Type", bool: true },
    { sort: tabValue === 0 ? "Task_Name" : "task_name", label: "Task Name", bool: true },
    { sort: "Allocated_Date", label: "Allo. Date", bool: true },
    { sort: "Deadline_Date", label: "Est. Date", bool: true },
  ]);

  // filter functions

  const [contry, setContry] = useState("");
  const [cty, setCty] = useState("");
  const [indus, setIndus] = useState("");
  const [fromdate, setFromdate] = useState("");
  const [todate, setToDate] = useState("");
  const [statefil, setStatefil] = useState("");

  const dialogFilter = (event) => {
    setShowFilter(event.currentTarget);
  };

  const closeFilter = () => {
    setShowFilter(null);
  };

  const RefreshData = () => {
    setContry("");
    setCty("");
    setIndus("");
    setFromdate("");
    setToDate("");
    setStatefil("");
    // DealsListsRefetch();
    setShowFilter(false);
  };

  const filterSubmit = async (e) => {
    e.preventDefault();
  };

  // filter functions end

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenMenu = (e, update) => {
    setOpen(e.currentTarget);
    setupdatedata(update);

    // console.log("select rows :: ", update)
  };

  const ShowCreateTaskForm = () => {
    // navigate("/Task/create-Task");
    setCreateTask(true);
    setListTask(false);
  };

  const handleOverviewTask = (data) => {
    setpopupdatas(data);
    setOverviewTask(true);
    setListTask(false);
  };

  const token = localStorage.getItem("accesstoken");
  const item = localStorage.getItem("DBName");

  const handleDeleteTask1 = (data) => {
    console.log(data.id);
    if (data.id !== undefined || data.id !== "") {
      axios
        .delete(`${BASE_URL}/superadmin/NewTaskManagemntCRUD/?id=${data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: item,
          },
        })
        .then((res) => {
          console.log("post", res.data);
          if (res.data === "Deleted Successfully") {
            toast.success(res.data, {
              position: "top-right",
              autoClose: 100,
            });
            listRecords();
            setdeleteDialog(false);
          }
          // setdatas(res.data.results)
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            const errorMessage =
              error.response.data.details ||
              "You don't have permission to do it";
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
        });
    }
  };

  const listRecords = async () => {

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`${BASE_URL}/superadmin/NewTaskManagemntAdditional/?Is_Deleted=False`, {
        headers: headers,
      });
      return response?.data;
    } catch (error) {
      console.error('error', error)
    }
  };

  const Dateformatrecords = () => {
    try {
      const response = axios
        .get(`${BASE_URL}/superadmin/SystemPreferenceCRUD/?id=3`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
      return response.data.DateFormat;
    } catch (error) {
      console.error('error', error)
    }

  };

  const SearchData = (e) => {
    //  console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : refetchAllTaskLists();
  };
  const handleSearch = async (search) => {
    await axios
      .get(`${BASE_URL}/superadmin/Newtaskmanagmentsearch/?search=${search}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        //  console.log(res.data);
        setdatas(res?.data?.results);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const getTaskList = async (pageNum) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await axios.get(`${BASE_URL}/superadmin/NewTaskManagemntMyAdditional/?Created_By=${localStorage.getItem("UserId")}`, {
        headers: headers,
      });
      return response?.data;
    } catch (error) {
      console.error('error', error)
    }
  };

  // useQuery section ---------------------------------------------------------------

  const {
    data: getAllList,
    isLoading: AllListLoading,
    isError,
    refetch: refetchAllTaskLists,
  } = useQuery(["getAllProjectsLists", page], () => listRecords(), {
    staleTime: Infinity,
  });

  const {
    data: getDateformatrecords,
    isError: errorDateformatrecords,
    refetch: refetchDateformatrecords,
  } = useQuery(["getProjectsDateformatrecords"], () => Dateformatrecords(), {
    staleTime: Infinity,
  });

  const {
    data: getTaskLists,
    isError: errorgetTaskList,
    isLoading: isLoadingTaskList,
    refetch: refetchgetTaskList,
  } = useQuery(["getprojectsList", page], () => getTaskList(), {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (Boolean(getAllList)) {
      setdatas(getAllList?.results || getAllList);
    }
  }, [getAllList]);

  useEffect(() => {
    if (Boolean(getDateformatrecords)) {
      setdateformat(getDateformatrecords);
    }
  }, [getDateformatrecords]);

  useEffect(() => {
    if (Boolean(getTaskLists)) {
      setTaskLists(getTaskLists?.results);
      setTaskListsCount(getTaskLists?.count);
    }
  }, [getTaskLists]);


  return (
    <>
      <JumboContentLayoutMain>
        {/* add task */}
        <Dragabledialog
          open={createTask}
          maxWidth="lg"
        >
          <DialogTitle
            sx={[DisplayFlex, dialogTitle, { cursor: "move" }]}
            id="draggable-dialog-title"
          >
            Create Task Management
          </DialogTitle>
          <Div>
            <DialogContent >
              <CreateTask1
                setCreateTask={setCreateTask}
                getTaskList={getTaskList}
              />
            </DialogContent>
          </Div>
        </Dragabledialog>

        {/* edit task */}
        <Dialog
          scroll="body"
          PaperProps={{
            sx: {
              borderRadius: "5px",
              boxShadow: "0px 4px 4px 5px rgba(0, 0, 0, 0.25)",
            },
          }}
          open={updateTask}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"xs"}
          fullWidth
        >
          <DialogTitle
            align="left"
            id="alert-dialog-title"
            sx={[dialogTitle, DisplayFlex, { justifyContent: "space-between" }]}
          >
            Edit Task Management
          </DialogTitle>
          <Div>
            <DialogContent sx={{ background: "#FFFFFF", p: "10px" }}>
              <UpdateTaskList setSave={setSave} setUpdateTask={setUpdateTask} setListTask={setListTask} updatedata={updatedata} />
            </DialogContent>
          </Div>
        </Dialog>

        {/* status Change */}
        <Dialog
          open={overviewTask}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"xs"}
          fullWidth
        >
          <DialogTitle
            align="left"
            id="alert-dialog-title"
            sx={[dialogTitle, DisplayFlex, { justifyContent: "space-between" }]}
          >
            Edit Task Status
          </DialogTitle>
          <Div>
            <DialogContent sx={{ background: "#FFFFFF", p: "10px" }}>
              <OverviewTask
                setSave={setSave}
                setOverviewTask={setOverviewTask}
                setListTask={setListTask}
                popupdatas={popupdatas}
              />

            </DialogContent>
          </Div>
        </Dialog>

        <Div>
          <Typography
            id="Typography-root"
            sx={[componentTitle, { transform: "translateY(-20px)" }]}
          >
            Task Management
          </Typography>

          <Box
            sx={[
              DisplayFlex,
              { justifyContent: "space-between", flexWrap: "wrap" },
            ]}
          >
            <Box sx={[DisplayFlex, { bgcolor: "#fff", gap: "10px" }]}>
              <Div>
                <IconButton
                  sx={{ color: Colors?.Mblue }}
                  onClick={dialogFilter}
                >
                  <BiFilterAlt size={22} />
                </IconButton>

                <Popover
                  open={Boolean(showFilter)}
                  anchorEl={showFilter}
                  onClose={closeFilter}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  sx={{ minWidth: "400px", width: { xs: "100%", md: "30%" } }}
                >
                  <Box>
                    <Div
                      className="MuiDialogTitle-root"
                      sx={[
                        DisplayFlex,
                        dialogTitle,
                        { px: 2, justifyContent: "space-between" },
                      ]}
                    >
                      <Typography id="Typography-root" sx={[dialogTitle]}>
                        Filters
                      </Typography>
                      <IconButton sx={{ mr: -1 }} onClick={RefreshData}>
                        <GrPowerReset color="white" size={16} />
                      </IconButton>
                    </Div>

                    <Div className="MuiDialogContent-root">
                      <form onSubmit={filterSubmit}>
                        <Grid container>
                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">
                              Country
                            </Typography>
                            <TextField
                              type="text"
                              className="col-12 input-box"
                              autoComplete="off"
                              placeholder="Country"
                              value={contry}
                              onChange={(e) => {
                                setContry(e.target.value);
                              }}
                            ></TextField>
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">State</Typography>
                            <TextField
                              type="text"
                              className="col-12 input-box"
                              autoComplete="off"
                              placeholder="State"
                              value={statefil}
                              onChange={(e) => {
                                setStatefil(e.target.value);
                              }}
                            ></TextField>
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">
                              Industry Type
                            </Typography>
                            <TextField
                              type="text"
                              className="col-12 input-box"
                              autoComplete="off"
                              placeholder="Industry Type"
                              value={indus}
                              onChange={(e) => {
                                setIndus(e.target.value);
                              }}
                            ></TextField>
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">City</Typography>
                            <TextField
                              type="text"
                              className="col-12 input-box"
                              autoComplete="off"
                              placeholder="City"
                              value={cty}
                              onChange={(e) => {
                                setCty(e.target.value);
                              }}
                            ></TextField>
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">
                              From Date
                            </Typography>
                            <TextField
                              type="date"
                              className="col-12 input-box"
                              value={fromdate}
                              onChange={(e) => {
                                setFromdate(e.target.value);
                              }}
                              id="createdDate"
                            />
                          </Grid>

                          <Grid item xs={12} md={6} lg={6}>
                            <Typography id="Typography-root">
                              To Date
                            </Typography>
                            <TextField
                              value={todate}
                              onChange={(e) => {
                                setToDate(e.target.value);
                              }}
                              type="date"
                              className="col-12 input-box"
                              id="lastDate"
                            />
                          </Grid>
                        </Grid>

                        <Div
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                            gap: "10px",
                          }}
                        >
                          <Cancelbutton onClick={closeFilter} />
                          <CustomButton
                            type="submit"
                            label="Apply"
                            Icon="filterIcon"
                          />
                        </Div>
                      </form>
                    </Div>
                  </Box>
                </Popover>
              </Div>

              <StyledTabs
                value={tabValue}
                onChange={(e, newValue) => {
                  setTabValue(newValue);
                }}
                aria-label="ant example"
              >
                <StyledTab label="All Task" />
                <StyledTab label="My Task" />
              </StyledTabs>
            </Box>
            <Box>
              <Div
                sx={[
                  DisplayFlex,
                  { flexWrap: "wrap", justifyContent: "flex-end" },
                ]}
              >
                <SearchBar
                  color="gray"
                  border={"1px solid lightgray"}
                  width={{ xs: "100%", md: "250px !important" }}
                  SearchData={SearchData}
                />

                <Div
                  sx={[
                    DisplayFlex,
                    {
                      flexWrap: "wrap",
                      justifyContent: "center",
                      p: { xs: 1, md: 0 },
                    },
                  ]}
                >
                  <CustomButton
                    Icon="createIcon"
                    label="Create"
                    onClick={() => {
                      ShowCreateTaskForm();
                    }}
                  />
                </Div>
              </Div>
            </Box>
          </Box>
        </Div>

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
                sortDatas={tabValue === 0 ? datas : taskLists}
                setDatas={tabValue === 0 ? setdatas : setTaskLists}
              />
              <TableBody >
                {
                  (tabValue === 0 ? datas : taskLists)
                    ?.slice(
                      page == 1 ? page * 0 : (page - 1) * count,
                      page == 1 ? page * 0 + count : (page - 1) * count + count
                    )
                    ?.map((item, index) => {
                      return (
                        <CRMTableRow key={index}>
                          {columnMenuItems[0]?.bool && (
                            <CRMTableCell
                              data-title="Task Id"
                              onClick={() => {
                                handleOverviewTask(item);
                              }}
                              sx={{ color: "#00BFFF", cursor: "pointer" }}
                            >
                              {item?.Task_Id || item?.task_id}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1]?.bool && (
                            <CRMTableCell data-title="Task Type">
                              {item?.Task_Type || item?.tast_type || "-"}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2]?.bool && (
                            <CRMTableCell data-title="Task Name">
                              {item?.Task_Name || item?.task_name}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3]?.bool && (
                            <CRMTableCell data-title="Allo. Date">
                              {item?.Allocated_Date}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4]?.bool && (
                            <CRMTableCell data-title="Est. Date">
                              {item?.Deadline_Date}
                            </CRMTableCell>
                          )}
                        </CRMTableRow>
                      );
                    })}

                {(tabValue === 0 ? datas?.length === 0 : taskLists?.length === 0) && <CRMTableCell colSpan={5}>
                  <NoRecordsPage title={tabValue === 0 ? "All Task" : "My Task"} />
                </CRMTableCell>}
              </TableBody>
            </Table>
          </JumboScrollbar>
          <Div
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pagination
              color="success"
              count={Math?.ceil(tabValue === 0 ? (datas?.length || 0) / 10 : (taskListsCount || 0) / 10)}
              page={page}
              onChange={(e, newValue) => handleChangePage(e, newValue)}
              size="small"
              showFirstButton
              showLastButton
            />
          </Div>
        </Box>
      </JumboContentLayoutMain>

      <DialogBox
        Content={deletedWarnigMsg}
        open={deleteDialog}
        onClickYes={() => {
          setdeleteDialog(false);
          handleDeleteTask1(updatedata);
        }}
        onClickNo={() => setdeleteDialog(false)}
      />
    </>
  );
};

export default TaskManagementList;
