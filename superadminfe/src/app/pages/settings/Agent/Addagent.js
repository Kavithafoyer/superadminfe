import React from "react";
import { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
  FormControl,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  Pagination,
  Box,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import "react-toastify/dist/ReactToastify.css";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import CKEditor from "@ckeditor/ckeditor5-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { AutoHeight } from "app/redux/auth/localStorage";
import {
  CRMTableHead,
  Colors,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  avatarColors,
  componentTitle,
  inputLabel,
} from "app/pages/widgets/CRMStyles";
import SearchBar from "app/pages/widgets/SearchField";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import {
  Cancelbutton,
  CustomButton,
  DeletedIcon,
  DialogBox,
  NoRecordsPage,
  EditIcon,
} from "app/pages/widgets/StylesComponents";
import { Phone } from "@mui/icons-material";

const AddAgent = () => {
  // Create Lead Questions

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
  const [openAddNotes, setOpenAddNotes] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const onChange = (evt) => {
    console.log("eve", evt);
    var newContent = evt.editor.getData();
    console.log("newContent", newContent);
    setEditorContent(newContent);
  };

  //  Getting the List of Lead Question Additional
  const [datas, setDatas] = useState([]);

  //  For Pagination Table

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getData(newPage);
  };
  const matches = useMediaQuery("(min-width:759px)");

  const [knowlaritydatas, setKnowlaritydatas] = useState([]);

  const getKnowlarityConfiguration = () => {
    axios
      .get(
        `${BASE_URL}/user/KnowlarityConfigurationCRUD/?User_Id=${localStorage.getItem(
          "UserId"
        )}`,
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
        console.log("res?.data", res.data);
        setKnowlaritydatas(res?.data);
      })
      .catch((error) => {
        console.log("error");
      });
  };

  const getData = () => {
    axios
      .get(`https://kpi.knowlarity.com/Basic/v1/account/agent/`, {
        headers: {
          Accept: "application/json",
          "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
          Authorization: "09049056-87dd-4867-bf9e-2cd0f3382be2",
        },
      })
      .then((res) => {
        setDatas(res.data.objects || []);

        setCount(res.data?.count || 0);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    getData();
    getKnowlarityConfiguration();
  }, []);
  // Lead Generation

  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  // Fields for Answer

  // Get Lead Industry

  const [userlist, setUserList] = useState([]);

  const [usename, setUsename] = useState([]);

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [indus, setIndus] = useState("");

  const getlookupData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, {
        headers: {
          db: "crmuseradmin",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      setUserList(response?.data);
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed s(e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    getlookupData();
  }, []);

  //  For the popup

  const [save, setSave] = useState(false);

  // Handle Submit

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      usename === "" ||
      usename === null ||
      usename === undefined ||
      phone === "" ||
      phone === null ||
      phone === undefined ||
      email === "" ||
      email === null ||
      email === undefined
    ) {
      toast.error("Please fill the required fields");
    } else {
      var payload = {
        id: null,
        first_name: usename,
        last_name: "",
        phone: phone,
        email: email,
        country_code: "+91",
        is_active: true,
        sip_url_flag: false,
        sip_url: "",
        is_testing_agent: false,
        incall_dtmf: "",
        flag: false,
      };

      console.log("payload", payload);

      axios
        .post(`https://kpi.knowlarity.com/Basic/v1/account/agent/`, payload, {
          headers: {
            Accept: "application/json",
            "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
            Authorization: "09049056-87dd-4867-bf9e-2cd0f3382be2",
          },
        })
        .then((res) => {
          console.log("check", res);
          toast.success("Created successfully", {
            position: "top-right",
            autoClose: 100,
          });
          getData();
          setOpenAddNotes(false);
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
            toast.success("Created successfully", {
              position: "top-right",
              autoClose: 100,
            });
            getData();
            setOpenAddNotes(false);
          }
        });
    }
  };

  const handleSubmitedit = (e) => {
    e.preventDefault();
    if (
      usename === "" ||
      usename === null ||
      usename === undefined ||
      phone === "" ||
      phone === null ||
      phone === undefined ||
      email === "" ||
      email === null ||
      email === undefined
    ) {
      toast.error("Please fill the required fields");
    } else {
      var payload = {
        id: update?.id,
        first_name: usename,
        last_name: "",
        phone: phone,
        email: email,
        country_code: update?.country_code,
        is_active: update?.is_active,
        sip_url_flag: update?.sip_url_flag,
        sip_url: update?.sip_url,
        is_testing_agent: update?.is_testing_agent,
        incall_dtmf: update?.incall_dtmf,
        flag: update?.flag,
      };

      console.log("payload", payload);

      axios
        .put(`https://kpi.knowlarity.com/Basic/v1/account/agent/`, payload, {
          headers: {
            Accept: "application/json",
            "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
            Authorization: "09049056-87dd-4867-bf9e-2cd0f3382be2",
          },
        })
        .then((res) => {
          console.log("check", res);
          toast.success("Created successfully", {
            position: "top-right",
            autoClose: 100,
          });
          getData();
          setOpenEditContact(false);
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
            toast.success("Created successfully", {
              position: "top-right",
              autoClose: 100,
            });
            getData();
            setOpenEditContact(false);
          }
        });
    }
  };

  // For Table Modifications

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "First_Name", label: "Name", bool: true },
    { sort: "Phone", label: "Phone Number", bool: true },
    { sort: "Email", label: "Email", bool: true },
  ]);

  // For Asecnding Order

  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  //code for table sorting
  const sortData = (key, direction) => {
    const sortedData = [...datas];

    sortedData.sort((a, b) => {
      const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setDatas(sortedData);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
    setShowsort(false);
  };

  // Edit And Delete Menu Functionality
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElAction, setAnchorElAction] = useState(null);

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  // Handle Update Function For the Update

  const [openEditContact, setOpenEditContact] = useState(false);
  const [update, setUpdate] = useState("");

  const handleClickEditContact = (update) => {
    setUsename(update?.first_name);
    setEmail(update?.email);
    setPhone(update?.phone);
    setNumber(update?.id);
    setUpdate(update);
    setOpenEditContact(true);
  };

  // For Dialog Popup

  const [showDialog, setShowDialog] = useState(false);

  // Delete Popup Functionality

  const [deleteDatas, setDeleteDatas] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [number, setNumber] = useState(null);

  const Deletedata = async () => {
    await axios
      .delete(`https://kpi.knowlarity.com/Basic/v1/account/agent/${number}/`, {
        headers: {
          Accept: "application/json",
          "x-api-key": "N5larz0zVcavTxs2Lcess4Gy3WtC7lsN1nrsJ4Bi",
          Authorization: "09049056-87dd-4867-bf9e-2cd0f3382be2",
        },
      })
      .then((res) => {
        toast.success("Deleted successfully", {
          position: "top-right",
          autoClose: 100,
        });
        getData();
        handleCloseAction();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.success("Deleted successfully", {
            position: "top-right",
            autoClose: 100,
          });
          getData();
          handleCloseAction();
        }
      });
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Box>
          <Div>
            <Typography
              id="Typography-root"
              sx={[componentTitle, { transform: "translateY(-20px)" }]}
            >
              Telephone Agents
            </Typography>

            <Box
              sx={[
                DisplayFlex,
                { justifyContent: { md: "right" }, flexWrap: "wrap" },
              ]}
            >
              <Box sx={[DisplayFlex, { bgcolor: "#fff", gap: "10px" }]}>
                <SearchBar
                  width={"250px !important"}
                  border={"1px solid lightgray"}
                />
                <CustomButton
                  label="Create"
                  Icon="createIcon"
                  onClick={() => {
                    setOpenAddNotes(true);
                  }}
                />
              </Box>
            </Box>
          </Div>

          <Div sx={{ mt: { xs: 0, md: 1.5 } }}>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={AutoHeight(1.6)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              {datas?.length > 0 ? (
                <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 800 } }}>
                  <CustomTableHeader
                    headerMenuItems={columnMenuItems}
                    setHeadermenuItems={setColumnMenuItems}
                    setDatas={setDatas}
                    sortDatas={datas}
                  />
                  <TableBody sx={{ mt: 2 }}>
                    {datas.length > 0 &&
                      datas
                        ?.slice(
                          page == 1 ? page * 0 : (page - 1) * 10,
                          page == 1 ? page * 0 + 10 : (page - 1) * 10 + 10
                        )
                        ?.map((data, index) => {
                          let avatar =
                            index >= 10
                              ? avatarColors[index % 10]
                              : avatarColors[index];
                          return (
                            <CRMTableRow key={index}>
                              {columnMenuItems[0]?.bool && (
                                <CRMTableCell
                                  data-title="first Name"
                                  sx={{ cursor: "pointer" }}
                                >
                                  <Div
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "center",
                                      gap: "5px",
                                    }}
                                  >
                                    <Typography
                                      id="Typography-root"
                                      sx={[FontStyle, { color: Colors?.Mblue }]}
                                    >
                                      {data?.first_name}
                                    </Typography>
                                  </Div>
                                </CRMTableCell>
                              )}
                              {columnMenuItems[1].bool && (
                                <CRMTableCell
                                  onClick={() => {
                                    setShowDialog(true);
                                  }}
                                  data-title="Phone"
                                >
                                  <Div
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Div>{data?.phone}</Div>
                                  </Div>
                                </CRMTableCell>
                              )}
                              {columnMenuItems[2].bool && (
                                <CRMTableCell data-title="Question">
                                  <Div
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    <Div>{data?.email}</Div>
                                  </Div>
                                </CRMTableCell>
                              )}

                              <CRMTableCell
                                align="center"
                                data-title="Action"
                                sx={[
                                  DisplayFlex,
                                  {
                                    cursor: "pointer",
                                    mb: 1,
                                    // justifyContent: matches ? "center" : "left",
                                    justifyContent: { xs: "flex-end", sm: "center" },
                                  },
                                ]}
                              >
                                {/* <EditIcon
                                                       onClick={() => {
                                                        handleClickEditContact(data);
                                                      }}
                                                        toolTip={true}
                                                    /> */}

                                <DeletedIcon
                                  onClick={() => {
                                    setNumber(data?.id);
                                    setShowDelete(true);
                                  }}
                                />
                              </CRMTableCell>
                            </CRMTableRow>
                          );
                        })}
                  </TableBody>
                  <DialogBox
                    open={showDelete}
                    onClickNo={() => setShowDelete(false)}
                    onClickYes={() => {
                      setShowDelete(false);
                      Deletedata();
                    }}
                  />
                </Table>
              ) : (
                <NoRecordsPage title={"Lead questions"} />
              )}
            </JumboScrollbar>
          </Div>
          {/* code for pagination */}
          <Div
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pagination
              color="success"
              count={Math.ceil(datas?.length / 10)}
              page={page}
              onChange={(e, newValue) => handleChangePage(e, newValue)}
              size="small"
              showFirstButton
              showLastButton
            />
          </Div>
        </Box>

        {/* Dialog box for rg */}

        <Dialog
          open={openAddNotes}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle sx={[CRMTableHead, DisplayFlex, DialogHeader]}>
              Add Agent
            </DialogTitle>
            <DialogContent>
              <Div sx={{ width: "100%", my: 1 }}>
                <FormControl className="col-12">
                  <Typography
                    id="Typography-root"
                    mb={0.1}
                    sx={[
                      inputLabel,
                      {
                        mb: 0.2,
                      },
                    ]}
                  >
                    Select User
                  </Typography>
                  <Autocomplete
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.username) {
                        return option?.username;
                      }
                      return "";
                    }}
                    className="search-select"
                    value={usename}
                    options={userlist || []}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setEmail(newValue?.email);
                      setPhone(newValue?.PhoneNo);
                      setUsename(newValue?.username);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select User" />
                    )}
                  />
                </FormControl>
              </Div>

              <Div
                sx={{
                  my: 1,
                }}
              >
                <Typography
                  id="Typography-root"
                  sx={[
                    inputLabel,
                    {
                      mb: 0.2,
                    },
                  ]}
                >
                  Email
                </Typography>
                <TextField
                  className="col-12 input-box"
                  value={email}
                  placeholder="Mail"
                />
              </Div>

              <Div sx={[FontStyle, { my: 1, color: "black !important" }]}>
                <Div>
                  <Div
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography
                      id="Typography-root"
                      sx={[
                        inputLabel,
                        {
                          mb: 0.2,
                        },
                      ]}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      value={phone}
                      placeholder="Enter Phone Number"
                    />
                  </Div>
                </Div>
              </Div>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <CustomButton label="Save" Icon="saveIcon" type="submit" />
              <Cancelbutton
                label="Cancel"
                onClick={() => {
                  setSave(true);
                }}
              />
            </DialogActions>
          </form>
        </Dialog>
        {/* Dialog box for rg */}

        <Dialog
          open={openAddNotes}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
          fullWidth
        >
          <form onSubmit={handleSubmit}>
            <DialogTitle sx={[CRMTableHead, DisplayFlex, DialogHeader]}>
              Add Agent
            </DialogTitle>
            <DialogContent>
              <Div sx={{ width: "100%", my: 1 }}>
                <FormControl className="col-12">
                  <Typography
                    id="Typography-root"
                    mb={0.1}
                    sx={[
                      inputLabel,
                      {
                        mb: 0.2,
                      },
                    ]}
                  >
                    Select User
                  </Typography>
                  <Autocomplete
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.username) {
                        return option?.username;
                      }
                      return "";
                    }}
                    className="search-select"
                    value={usename}
                    options={userlist || []}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setEmail(newValue?.email);
                      setPhone(newValue?.PhoneNo);
                      setUsename(newValue?.username);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select User" />
                    )}
                  />
                </FormControl>
              </Div>

              <Div
                sx={{
                  my: 1,
                }}
              >
                <Typography
                  id="Typography-root"
                  sx={[
                    inputLabel,
                    {
                      mb: 0.2,
                    },
                  ]}
                >
                  Email
                </Typography>
                <TextField
                  className="col-12 input-box"
                  value={email}
                  placeholder="Mail"
                />
              </Div>

              <Div sx={[FontStyle, { my: 1, color: "black !important" }]}>
                <Div>
                  <Div
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography
                      id="Typography-root"
                      sx={[
                        inputLabel,
                        {
                          mb: 0.2,
                        },
                      ]}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      value={phone}
                      placeholder="Enter Phone Number"
                    />
                  </Div>
                </Div>
              </Div>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <CustomButton label="Save" Icon="saveIcon" type="submit" />
              <Cancelbutton
                label="Cancel"
                onClick={() => {
                  setSave(true);
                }}
              />
            </DialogActions>
          </form>
        </Dialog>

        {/* Dialog box for rg */}

        <Dialog
          open={openEditContact}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
          fullWidth
        >
          <form onSubmit={handleSubmitedit}>
            <DialogTitle sx={[CRMTableHead, DisplayFlex, DialogHeader]}>
              Edit Agent
            </DialogTitle>
            <DialogContent>
              <Div sx={{ width: "100%", my: 1 }}>
                <FormControl className="col-12">
                  <Typography
                    id="Typography-root"
                    mb={0.1}
                    sx={[
                      inputLabel,
                      {
                        mb: 0.2,
                      },
                    ]}
                  >
                    Select User
                  </Typography>
                  <Autocomplete
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.username) {
                        return option?.username;
                      }
                      return "";
                    }}
                    className="search-select"
                    value={usename}
                    options={userlist || []}
                    onChange={(e, newValue) => {
                      console.log("newValue", newValue);
                      setEmail(newValue?.email);
                      setPhone(newValue?.PhoneNo);
                      setUsename(newValue?.username);
                    }}
                    id="outlined-basic"
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select User" />
                    )}
                  />
                </FormControl>
              </Div>

              <Div
                sx={{
                  my: 1,
                }}
              >
                <Typography
                  id="Typography-root"
                  sx={[
                    inputLabel,
                    {
                      mb: 0.2,
                    },
                  ]}
                >
                  Email
                </Typography>
                <TextField
                  className="col-12 input-box"
                  value={email}
                  placeholder="Mail"
                />
              </Div>

              <Div sx={[FontStyle, { my: 1, color: "black !important" }]}>
                <Div>
                  <Div
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Typography
                      id="Typography-root"
                      sx={[
                        inputLabel,
                        {
                          mb: 0.2,
                        },
                      ]}
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      value={phone}
                      placeholder="Enter Phone Number"
                    />
                  </Div>
                </Div>
              </Div>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <CustomButton label="Edit" Icon="saveIcon" type="submit" />
              <Cancelbutton
                label="Cancel"
                onClick={() => {
                  setSave(true);
                }}
              />
            </DialogActions>
          </form>
        </Dialog>

        {/* close dialog box */}
        <DialogBox
          open={save}
          onClickNo={() => setSave(false)}
          onClickYes={() => {
            setUsename("");
            setEmail("");
            setPhone("");
            setSave(false);
            setOpenAddNotes(false);
            setOpenEditContact(false);
          }}
        />
      </JumboContentLayoutMain>
    </>
  );
};

export default AddAgent;
