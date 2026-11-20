import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  FormControl,
  Grid,
  Box,
} from "@mui/material";
import Div from "@jumbo/shared/Div";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConatctEditNotes from "./ContactEditNotes";
import moment from "moment";
import { BASE_URL } from "app/services/auth-services";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { IoCalendarClear } from "react-icons/io5";
import {
  CRMTableHead,
  deletedWarnigMsg,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import {
  Cancelbutton,
  DialogBox,
  CustomButton,
  SaveButton,
  SelectDropdown,
  Dragabledialog,
  htmlToText,
} from "app/pages/widgets/StylesComponents";

import NotesModel from "../extra-components/NotesModel";

const ConatctNotes = ({ id, data }) => {
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const item = "crmuseradmin1";

  const [save, setSave] = useState(false);
  const [openEditNotes, setOpenEditNotes] = useState(false);
  const [openAddNotes, setOpenAddNotes] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [datas, setDatas] = useState([]);
  const [update, setUpdate] = useState({});
  const [deleteItem, setDeleteItem] = useState(false);

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  // For Choose Period

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState("");



  const periodOptions = [
    "Previous Week",
    "Previous Month",
    "Previous Quarter",
    "Previous Year",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
    "Last One Year",
    "Last Six Month",
    "Last Three Month",
    "Custom Date",
  ];

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let TodayDate = `${year}-${month < 10 ? "0" + month : month}-${day}`;

  const handlePeriodChange = (event, newValue) => {
    setSelectedPeriod(newValue);
    setSelectedDate(null);
    setfromDate("");
    settoDate("");

    let date;

    let startDate; // for previous
    let endDate;

    switch (newValue) {
      case "This Week":
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");

        let ThisWeekStart = startDate?.format("YYYY-MM-DD");
        let ThisWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisWeekStart);
        setCurrentDate(ThisWeekEnd);

        setCustomDate(false);

        return;

      case "This Month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");

        let ThisMonthStart = startDate?.format("YYYY-MM-DD");
        let ThisMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisMonthStart);
        setCurrentDate(ThisMonthEnd);

        setCustomDate(false);

        return;

      case "This Quarter":
        startDate = moment().startOf("quarter");
        endDate = moment().endOf("quarter");

        let ThisQuarterStart = startDate?.format("YYYY-MM-DD");
        let ThisQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisQuarterStart);
        setCurrentDate(ThisQuarterEnd);

        setCustomDate(false);

        return;

      case "This Year":
        startDate = moment().startOf("year");
        endDate = moment().endOf("year");

        let ThisYearStart = startDate?.format("YYYY-MM-DD");
        let ThisYearEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisYearStart);
        setCurrentDate(ThisYearEnd);

        setCustomDate(false);

        return;

      case "Previous Week":
        startDate = moment().subtract(1, "week").startOf("week");
        endDate = moment().subtract(1, "week").endOf("week");

        let PrevWeekStart = startDate?.format("YYYY-MM-DD");
        let PrevWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevWeekStart);
        setCurrentDate(PrevWeekEnd);

        setCustomDate(false);

        return;

      case "Previous Month":
        startDate = moment().subtract(1, "month").startOf("month");
        endDate = moment().subtract(1, "month").endOf("month");

        let PrevMonthStart = startDate?.format("YYYY-MM-DD");
        let PrevMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevMonthStart);
        setCurrentDate(PrevMonthEnd);

        setCustomDate(false);

        return;

      case "Previous Quarter":
        startDate = moment().subtract(1, "quarter").startOf("quarter");
        endDate = moment().subtract(1, "quarter").endOf("quarter");

        let PrevQuarterStart = startDate?.format("YYYY-MM-DD");
        let PrevQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevQuarterStart);
        setCurrentDate(PrevQuarterEnd);

        setCustomDate(false);

        return;

      case "Previous Year":
        startDate = moment().subtract(1, "year").startOf("year");
        endDate = moment().subtract(1, "year").endOf("year");

        let MomentDateStart = startDate?.format("YYYY-MM-DD");
        let MomentDateEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(MomentDateStart);
        setCurrentDate(MomentDateEnd);

        setCustomDate(false);

        return;

      case "Last One Year":
        date = moment().subtract(1, "year");
        setCustomDate(false);

        break;

      case "Last Six Month":
        date = moment().subtract(6, "months");
        setCustomDate(false);

        break;

      case "Last Three Month":
        date = moment().subtract(3, "months");
        setCustomDate(false);

        break;

      case "Custom Date":
        setCustomDate(true);
        break;
      default:
        date = null;
    }
    let MomentDate = date?.format("YYYY-MM-DD");
    setSelectedDate(MomentDate);
    setCurrentDate(TodayDate);
  };

  const NotesFilter = async () => {
    if (
      selectedDate !== "" &&
      selectedDate !== undefined &&
      currentDate !== ""
    ) {
      console.log("selectedDate", selectedDate, currentDate);
      await axios
        .get(
          `${BASE_URL}/user/ContactNotesFilter/?fromdate=${selectedDate}&todate=${currentDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error", error);
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .get(
          `${BASE_URL}/user/ContactNotesFilter/?fromdate=${fromDate}&todate=${toDate}&Contact_Id=${Number(
            id
          )}`,
          header
        )
        .then((res) => {
          setDatas(res?.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await NotesFilter();
    };
    fetchData();
  }, [selectedDate, fromDate, toDate, id]);

  //  For Contact Notes Creation
  const [Notes, setNotes] = useState("");
  const [number, setNumber] = useState(1);

  const onsubmit = async () => {
    console.log("in submit", Notes);

    var payload = {
      Contact_Id: Number(id),
      Notes: Notes,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    console.log("payload", payload);
    if (Notes.trim() !== "") {
      try {
        await axios
          .post(`${BASE_URL}/user/ContactNotesCRUD/`, payload, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            toast.success("Created successfully", {
              position: "top-right",
              autoClose: 5000,
            });
            getData();
            setOpenAddNotes(false);
            reset();
            setNotes("");
            let editUser = localStorage.getItem("Username");
            let histotypayload = {
              Document_Id: res.data.ContactNotes_Id,
              Updated_Person: `${editUser} Created this Contact Notes.`,
              Module_Name: "Contact Notes",
              Contact_Id: Number(id),
              Updated_By: parseInt(localStorage.getItem("UserId")),
            };
            console.log("histotypayload", histotypayload);
            axios
              .post(
                `${BASE_URL}/user/Updaterecordscrud/`,
                histotypayload,
                header
              )
              .then((res) => {
                console.log("Result", res.data);
              })
              .catch((res) => {
                console.log(res.message);
              });
          });
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }
    }
  };

  const validationSchema = yup.object({
    Notes: yup.string().required("Notes is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Get the Contact List Notes

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(
        `${BASE_URL}/user/ContactNotesMyAdditional/?Is_Deleted=False&Contact_Id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log("asdas", res.data);
        setDatas(res.data.results);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  // Search Functionality
  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : getData();
  };
  const handleSearch = (search) => {
    axios
      .get(
        `${BASE_URL}/user/ContactNotesSearch/?search=${search}&Contact_Id=${id}`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setDatas(res.data);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  // Delete Function for Name

  const Deletedata = (data) => {
    axios
      .delete(`${BASE_URL}/user/ContactNotesCRUD/?id=${number}`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 5000,
        });
        getData();
        setOpenAddNotes(false);
        reset();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };



  // For update
  const handleUpdate = (data) => {
    setUpdate(data);
  };

  return (
    <Box>
      {/* Create Contacts */}
      {/* <Dialog
        open={openAddNotes}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={[CRMTableHead, DisplayFlex, dialogTitle]}>
          Add Notes
        </DialogTitle>
        <form onSubmit={handleSubmit(onsubmit)}>
          <DialogContent>
            <DialogContentText>
              <TextField
                {...register("Notes")}
                className={`col-12 multiline-box ${
                  errors.Notes ? "is-invalid" : ""
                }`}
                multiline
                rows={6}
                value={Notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                id="outlined-basic"
                placeholder="Enter your notes"
                variant="outlined"
                sx={{ width: "100%", fontSize: "1 2px" }}
              />
            </DialogContentText>
            {!Notes ? (
              <Div style={{ color: "red !important", fontSize: "12px" }}>
                {errors.Notes?.message}
              </Div>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            <CustomButton type="submit" Icon="saveIcon" label="Save" />
            <Cancelbutton
              onClick={() => {
                setSave(true);
              }}
            />
          </DialogActions>
        </form>
      </Dialog> */}

      {/* Create Notes */}
      <Dragabledialog
        maxWidth="sm"
        open={openAddNotes}
        // onClose={() => setOpenNotes(false)}
      >
        <NotesModel
          name={{ label: "Contact Name", value: data?.Name }}
          endpoint={"ContactNotesCRUD"}
          data={data}
          historyEndpoint={{
            point: "Updaterecordscrud",
            payload: { Contact_Id: data?.id },
          }}
          extraPayload={{ Contact_Id: data?.id }}
          setOpenNotes={setOpenAddNotes}
          setOpen={setSave}
          getData={getData}
        />
      </Dragabledialog>

      {/* Edit Notes */}
      <Dragabledialog
        name={{ label: "Contact Name", value: data?.Name }}
        maxWidth="sm"
        open={openEditNotes}
        // onClose={() => setOpenNotes(false)}
      >
        <NotesModel
          label="Edit"
          endpoint={"ContactNotesCRUD"}
          historyEndpoint={{
            point: "Updaterecordscrud",
            payload: { Contact_Id: data?.id },
          }}
          extraPayload={{
            ContactNotes_Id: update?.ContactNotes_Id,
            Contact_Id: data?.id,
          }}
          data={{ ...update, Name: data?.Name }}
          setOpenNotes={setOpenEditNotes}
          setOpen={setSave}
          getData={getData}
        />
      </Dragabledialog>

      {/* close dialog box */}
      <DialogBox
        onClickNo={() => {
          setSave(false);
        }}
        onClickYes={() => {
          setSave(false);
          setOpenAddNotes(false);
          setOpenEditNotes(false);
          // handleReset();
        }}
        open={save}
      />

      <Div>
        <Typography
          id="Typography-root"
          sx={[
            dialogTitle,
            {
              backgroundColor: "transparent !important",
              display: { xs: "none", md: "block" },
            },
          ]}
        >
          Notes
        </Typography>
        <Div
          sx={[
            DisplayFlex,
            {
              mt: 2,
              flexWrap: "wrap",
              gap: "0px !important",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            <FormControl
              sx={{
                width: "250px",
              }}
            >
              <SelectDropdown
                value={selectedPeriod}
                options={periodOptions || []}
                onChange={handlePeriodChange}
                placeholder="Choose a Period"
              />
            </FormControl>
          </Div>

          <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            {/* <SearchBar
              width={"200px !important"}
              border={"1px solid lightgray"}
              SearchData={SearchData}
            /> */}
            <CustomButton
              Icon="createIcon"
              label="Create"
              onClick={() => setOpenAddNotes(true)}
            />
          </Div>
        </Div>

        {Boolean(customDate) && (
          <Box sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography id="Typography-root" sx={[FontStyle]}>
                  From
                </Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={fromDate}
                  onChange={(e) => setfromDate(e.target.value)}
                />
              </FormControl>
            </Div>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography id="Typography-root" sx={[FontStyle]}>
                  To
                </Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={toDate}
                  onChange={(e) => settoDate(e.target.value)}
                />
              </FormControl>
            </Div>
          </Box>
        )}
      </Div>

      <JumboScrollbar
        autoHeight={true}
        autoHeightMax={window.innerHeight}
        autoHideTimeOut={4000}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
          {datas?.length > 0 &&
            datas?.map((data, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "12px",
                    border: "1px solid #f0f0f0",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.01)",
                    p: 2.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.03)",
                      borderColor: "#e0e6ed",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
                        {Boolean(data?.Subject) ? (
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 700,
                              color: "#1e293b",
                            }}
                          >
                            {data?.Subject}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#94a3b8",
                              fontStyle: "italic",
                            }}
                          >
                            Untitled Note
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#64748b",
                            fontWeight: 500,
                          }}
                        >
                          • {moment(data?.received_date || data?.Created_Date).format("MMM DD, YYYY • h:mm A")}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#334155",
                          lineHeight: "1.6",
                          wordBreak: "break-word",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {htmlToText(data?.Notes)}
                      </Typography>
                    </Box>

                    <IconButton
                      onClick={(event) => {
                        setNumber(data.id);
                        handleUpdate(data);
                        handleClickAction(event);
                      }}
                      sx={{ p: 0.5, color: "#94a3b8", "&:hover": { color: "#64748b" } }}
                    >
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElAction}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElAction)}
                    onClose={() => setAnchorElAction(false)}
                    sx={{
                      mt: 3,
                      mr: 5,
                      maxHeight: "300px",
                      width: "300px",
                    }}
                  >
                    <MenuItem
                      sx={[FontStyle]}
                      onClick={() => {
                        setOpenEditNotes(true);
                        setAnchorElAction(false);
                      }}
                    >
                      <ModeEdit
                        sx={{ fontSize: 16, color: "gray", mr: 0.5 }}
                      />
                      Edit
                    </MenuItem>
                    <MenuItem
                      sx={[FontStyle]}
                      onClick={() => {
                        setDeleteItem(data);
                        setAnchorElAction(false);
                      }}
                    >
                      <DeleteIcon
                        sx={{ fontSize: 16, color: "gray", mr: 0.5 }}
                      />
                      Delete
                    </MenuItem>
                  </Menu>
                </Box>
              );
            })}
        </Box>
      </JumboScrollbar>
      {/* 
      <ConatctEditNotes
        id={id}
        update={update}
        openEditNotes={openEditNotes}
        setOpenEditNotes={setOpenEditNotes}
        getData={getData}
      /> */}

      {/* delete items */}
      <DialogBox
        onClickNo={() => {
          setDeleteItem(false);
        }}
        Content={deletedWarnigMsg}
        onClickYes={() => {
          setSave(false);
          Deletedata(update);
          reset();
          setDeleteItem(false);
        }}
        open={deleteItem}
      />
    </Box>
  );
};

export default ConatctNotes;
