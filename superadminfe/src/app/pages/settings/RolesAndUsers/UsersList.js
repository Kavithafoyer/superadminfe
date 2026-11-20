import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import SearchBar from "../../widgets/SearchField";
import { MdDelete, MdSend } from "react-icons/md";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CRMTableHead,
  ComponentHeading,
  DialogHeader,
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { useSelector } from "react-redux";
import { selectUserRolePermissions } from "app/redux/actions/fetchUserRolePermissions";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  NoRecordsPage,
} from "app/pages/widgets/StylesComponents";

const uservalidationSchema = yup.object({
  emailTo: yup
    .string()
    .required("Email is required")
    .email("Invalid email address format"),
  // businessUnit: yup.string().required("Business unit is required"),
  designation: yup.string().required("Role name is required"),
});
const formOptions = { resolver: yupResolver(uservalidationSchema) };

const validate = (data) => {
  const errors = {};

  if (!data.designation) {
    errors.designation = "Role name is required";
  }

  return errors;
};

const UsersList = ({ scrollHeight }) => {
  const token = localStorage.getItem("accesstoken");
  // const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjk5NTQyMTgxLCJlbWFpbCI6InJhdmlrdW1hci5yQGZveWVydGVjaC5jb20iLCJvcmlnX2lhdCI6MTY5OTUwNjE4MX0.2xk15P67jfHINEHFhpyzyhLPR2fzitpujX3wolEkrMM"

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      db: localStorage.getItem("DBName"),
    },
  };

  const initialstate = {
    id: "",
    User_Id: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    User_emailId: "",
    last_login: "",
    groups: "",
    User_Photo: "",
    PhoneNo: "",
    UserType: "",
    Designation: "",
    Business_Unit: "",
  };

  const [showUser, setShowUser] = useState(true);
  const [users, setUsers] = useState([initialstate]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentUser, setCurrentUser] = useState(initialstate);
  const [rolename, setRolename] = useState([]);
  const [emailTo, setEmailTo] = useState("");
  const [userType, setUserType] = useState("User");

  const [showInviteUser, setShowInviteUser] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  const [deleteId, setDeleteId] = useState("");

  const [businessUnit, setBusinessUnit] = useState("");
  const [designation, setDesignation] = useState("");

  const [selectedOption, setSelectedOption] = useState("");

  // this function is going to use pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  // const visitedPages = page - 1;

  const createrId = localStorage.getItem("UserId");

  const [userTypeOptions, setUserTypeOptions] = useState([
    { UserType: "UserAdmin", value: "UserAdmin" },
    { UserType: "User", value: "User" },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailTo: "",
    },
  });

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    if (searchQuery) {
      const payload = {
        page: newPage,
        search: searchQuery,
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        is_active: true,
      };

      await axios
        .put(`${BASE_URL}/useradmin/UserAdditional/`, payload, {
          headers: {
            db: localStorage.getItem("DBName"),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("On Search", res?.data?.results);
          setUsers(res?.data?.results);
          setCount(res?.data?.count);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await axios
        .get(
          `${BASE_URL}/useradmin/UserAdditional/?is_active=True&Organization_Id=${createrId}&page=${newPage}`,
          header,
        )
        .then((res) => {
          console.log(res?.data?.results);
          setUsers(res?.data?.results);
          setCount(res?.data?.count);
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };

  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
    console.log("editingggg", e.target.name, e.target.value);
  };

  const getUsers = async () => {
    await axios
      .get(
        `${BASE_URL}/useradmin/UserAdditional/?is_active=True&Organization_Id=${createrId}&page=${page}`,
        header,
      )
      .then((res) => {
        console.log(res?.data?.results);
        setUsers(res?.data?.results);
        setCount(res?.data?.count);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getRoles = async () => {
    // await axios
    //   .get(`${BASE_URL}/useradmin/Rolelist/`, header)
    //   .then((res) => {
    //     console.log("checj", res?.data?.results);
    //     setRolename(res?.data?.results);
    //   })
    //   .catch((error) => {
    //     console.log("ds", error);
    //   });
    await axios
      .get(`${BASE_URL}/useradmin/Rolelistwithpagination/`, header)
      .then((res) => {
        console.log("checj", res?.data);
        setRolename(res?.data);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const getFilterData = useCallback(
    (newValue) => {
      console.log("newValue?.Partner_Name", newValue?.Partner_Name);
      if (newValue && newValue?.Partner_Name) {
        const filterData = users?.filter(
          (opt) => opt?.Business_Unit === newValue?.Partner_Name,
        );
        console.log("filterData", filterData);
        setUsers(filterData);
      } else {
        getUsers();
      }
    },
    [selectedOption],
  );

  useEffect(() => {
    const abortController = new AbortController();
    getRoles();
    return () => {
      abortController.abort(); // cancel the fetch reques
    };
  }, []);

  const ShowInviteUserForm = () => {
    setShowInviteUser(true);
    setShowUser(false);
  };

  const RedirectToUserTable = () => {
    setShowUser(true);
    setShowInviteUser(false);
  };

  const getData = () => {
    // axios
    //   .post(
    //     `${BASE_URL}/Erpapp/RoleAdditionalCRUD/`,
    //     {
    //       name: localStorage.getItem("Designation"),
    //       Is_Deleted: false,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         // "Access-Control-Allow-Origin": "http://localhost:3000",
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //     setUserPermissions(res.data.permissions);
    //   }).catch((error) => {
    //     console.log("ds", error);
    //   });
  };

  useEffect(() => {
    getData();
  }, []);

  const onSendMail = (formData) => {
    console.log("onSend Email ", formData);
    var inviteuserpayload = {
      Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      // email: emailTo,
      email: formData?.emailTo,
      UserType: userType,
      Tenant: Tenantname,
      Url: `${window.location.origin}/registration`,
      groups: [],
      user_permissions: userPermissions,
      mailhtml: `<div className="card" style={{width: 18}}>
      <div className="card-body">
        <h4   className="card-subtitle mb-2 text-muted">Dear User,</h4>
        <div className="card-text">
          We are delighted to welcome you to our platform! In order to register and create an account, please follow the steps below:
          <br/>
          <p>1. Go to our website <a href='{{url}}'> Click Here</a>.</p>
          <p>2. Click on the "Register"  button.</p>
          <p>3. Enter your personal details, including your full name, email address, and a password.</p>
          <p>Follow the instructions to verify your email address.</p>
          <p>Once you click register button,  you will be able to log in to your account.</p>
          <br/>
          <p>If you have any issues during the registration process or require any assistance, please do not hesitate to contact us at 'nrpatnaik@foyertech.com'.</p>
          <p>Thank you for choosing our platform, and we look forward to having you as a member.</p>
          <br/>
          <p>Best regards,</p>
          <p>Administrator</p>
        </div>
        <br/>
      </div>
    </div>`,
      Created_by: parseInt(localStorage.getItem("UserId")),
      mailsubject: "Mail for registration",
      MailPassword: "Test@123",
      Designation: designation?.Role_Name,
      permissions: designation?.permissions,
    };

    axios
      .post(`${BASE_URL}/useradmin/UserCreate/`, inviteuserpayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        setEmailTo("");
        setDesignation("");
        setUserType("");
        console.log("UserCreate res:", res);
        // 👇 Use the actual backend message
        toast.success(res.data.Message || "User invited successfully", {
          position: "top-right",
        });
        setShowInviteUser(false);
        setShowUser(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickEditPopup = (user) => {
    setOpenEdit(true);
    setCurrentUser({
      id: user?.id,
      User_Id: user?.User_Id,
      username: user?.username,
      email: user?.email,
      UserType: user?.UserType,
      Designation: user?.Designation,
      Business_Unit: user?.Business_Unit,
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    console.log("currentUser", currentUser);
    var userspayload = {
      id: currentUser?.id,
      username: currentUser?.username,
      email: currentUser?.email,
      UserType: currentUser?.UserType,
      user_permissions: currentUser?.user_permissions,
      Designation: currentUser?.Designation,
    };

    axios
      .patch(`${BASE_URL}/useradmin/UserCRUD/`, userspayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        // console.log(res.data.results);
        if (res?.data?.id) {
          getUsers();
          setOpenEdit(false);
          toast.success("User Details Updated Successfully");
        }
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const handleDeletePopup = (user) => {
    setOpenDelete(true);
    setDeleteId(user.id);
    setCurrentUser({
      id: user?.id,
      User_Id: user?.User_Id,
      username: user?.username,
      email: user?.email,
      Designation: user?.Designation,
      Business_Unit: user?.Business_Unit,
    });
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    await axios
      .delete(`${BASE_URL}/useradmin/user/?id=${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log(res?.data);
        setOpenDelete(false);
        toast.success(`${currentUser?.username} is deleted successfully`);
        getUsers();
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const debouncedSearch = React.useCallback(
    debounce((data) => {
      const payload = {
        page: page,
        search: data,
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
        is_active: true,
      };
      axios
        .put(`${BASE_URL}/useradmin/UserAdditional/`, payload, {
          headers: {
            db: localStorage.getItem("DBName"),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("On Search", res?.data?.results);
          setUsers(res?.data?.results);
          setCount(res?.data?.count);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500),
    [page, token],
  );

  const handleSearchUser = (e) => {
    var data = e.target.value;
    setSearchQuery(data);
    if (data !== "") {
      debouncedSearch(data);
    } else {
      getUsers();
    }
  };

  // useEffect(() => {
  //   const payload = {
  //     page: page,
  //     search: searchQuery,
  //     Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
  //     is_active: true,
  //   };

  //   axios
  //     .put(`${BASE_URL}/useradmin/UserAdditional/`, payload, {
  //       headers: {
  //         db: localStorage.getItem("DBName"),
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       console.log("On Search", res?.data?.results);
  //       setUsers(res?.data?.results);
  //       setCount(res?.data?.count);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [searchQuery]);

  return (
    <>
      {/* code for user table */}
      <Div sx={{ display: showUser === true ? "block" : "none" }}>
        <Grid container spacing={1} sx={{ mt: -1, mb: 1 }}>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
              <SearchBar
                width={"250px !important"}
                value={searchQuery}
                border={"1px solid lightgray"}
                SearchData={handleSearchUser}
              />
              <CustomButton
                onClick={ShowInviteUserForm}
                label="Invite"
                Icon="createIcon"
                endIcon={true}
              />
            </Div>
          </Grid>
        </Grid>

        <Div sx={{ mt: 1 }}>
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={scrollHeight ? scrollHeight : 370}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
              <TableHead sx={[CRMTableHead]}>
                <CRMTableRow>
                  <CRMTableCell sx={{ fontWeight: 600 }}>User Id</CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: 600 }}>
                    User Name
                  </CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: 600 }}>Email Id</CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: 600 }}>Role</CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: 600 }}>
                    User Type
                  </CRMTableCell>
                  <CRMTableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                    Action &nbsp;&nbsp;
                  </CRMTableCell>
                </CRMTableRow>
              </TableHead>
              <TableBody>
                {users?.length > 0 ? (
                  users?.map((user) => {
                    return (
                      <CRMTableRow key={user?.id}>
                        <CRMTableCell data-title="User Id">
                          {user?.UserId || "-"}
                        </CRMTableCell>
                        <CRMTableCell data-title="User Name">
                          {user?.username || "-"}
                        </CRMTableCell>
                        <CRMTableCell data-title="Email Id">
                          {user?.email || "-"}
                        </CRMTableCell>
                        <CRMTableCell data-title="Role">
                          {user?.Designation || "-"}
                        </CRMTableCell>
                        <CRMTableCell data-title="User Type">
                          {user?.UserType || "-"}
                        </CRMTableCell>
                        <CRMTableCell
                          data-title="Action"
                          sx={{
                            textAlign: "right",
                            display: "flex",
                            justifyContent: { xs: "flex-end", sm: "right" },
                          }}
                        >
                          <IconButton
                            size="small"
                            className="edit-icon"
                            onClick={() => {
                              handleClickEditPopup(user);
                            }}
                          >
                            <BiEdit />
                          </IconButton>

                          <IconButton
                            size="small"
                            className="delete-icon"
                            onClick={() => handleDeletePopup(user)}
                          >
                            <MdDelete />
                          </IconButton>
                        </CRMTableCell>
                      </CRMTableRow>
                    );
                  })
                ) : (
                  <TableRow className="col-12">
                    <CRMTableCell colSpan={6} sx={{ textAlign: "center" }}>
                      <NoRecordsPage title={"User List"} />
                    </CRMTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </JumboScrollbar>

          {/* pagination */}
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
              count={totalPages}
              page={page}
              onChange={(e, newValue) => handleChangePage(e, newValue)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Div>
        </Div>
      </Div>

      {/* Edit user popup */}
      <Dialog open={openEdit}>
        <DialogTitle
          sx={[
            CRMTableHead,
            DialogHeader,
            DisplayFlex,
            { bgcolor: "#dcdcdc !important" },
          ]}
        >
          Edit User
        </DialogTitle>
        <form onSubmit={handleSubmitEdit}>
          <DialogContent sx={{ pl: 4, pr: 10, minWidth: "550px" }}>
            <Div sx={{}}>
              <Div className="mb-3 row">
                <Typography
                  for="staticEmail"
                  className="col-sm-3 input-label mr-3"
                >
                  User Name <span className="required">*</span>
                </Typography>
                <Div className="col-sm-8">
                  <TextField
                    className="input-box2"
                    name="username"
                    value={currentUser?.username}
                    onChange={handleChange}
                    placeholder="Enter User Name"
                    required
                    sx={{ minWidth: "390px" }}
                  />
                </Div>
              </Div>
              <Div className="mb-3 row">
                <Typography
                  for="staticEmail"
                  className="col-sm-3 input-label mr-3"
                >
                  Email Id <span className="required">*</span>
                </Typography>
                <Div className="col-sm-8">
                  <TextField
                    className="input-box2"
                    name="email"
                    value={currentUser?.email}
                    onChange={handleChange}
                    placeholder="Enter Email Id"
                    autoComplete="off"
                    sx={{ minWidth: "390px" }}
                  />
                </Div>
              </Div>

              <Div className="mb-3 row">
                <Typography
                  for="staticEmail"
                  className="col-sm-3 input-label mr-3"
                >
                  User Type
                </Typography>
                <Div className="col-sm-8">
                  <FormControl className="col-sm-12" sx={{ minWidth: "390px" }}>
                    {/* <Select
                      className="input-select"
                      name="UserType"
                      value={currentUser?.UserType}
                      onChange={handleChange}
                    // defaultValue={`${currentUser.UserType}`}
                    >
                      <MenuItem value="Corporate">Admin</MenuItem>
                      <MenuItem value="Partner">User</MenuItem>
                    </Select> */}
                    <Autocomplete
                      className="search-select3"
                      type="search"
                      options={userTypeOptions}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option?.UserType) {
                          return option?.UserType;
                        }
                        return "";
                      }}
                      value={currentUser?.UserType}
                      onChange={(event, newValue) => {
                        let updatedUser = {
                          ...currentUser,
                          UserType: newValue?.value,
                        };
                        console.log("updatedUser", updatedUser);
                        setCurrentUser(updatedUser);
                      }}
                      autoComplete="off"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select User Type"
                          autoComplete="off"
                        />
                      )}
                    />
                  </FormControl>
                </Div>
              </Div>

              <Div className="mb-3 row">
                <Typography
                  for="inputPassword"
                  className="col-sm-3 input-label mr-3"
                >
                  Role
                </Typography>
                <Div className="col-sm-8">
                  <FormControl className="col-sm-12" sx={{ minWidth: "390px" }}>
                    <Autocomplete
                      className="search-select3"
                      name="Designation"
                      options={rolename}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option?.Role_Name) {
                          return option?.Role_Name;
                        }
                        return "";
                      }}
                      value={currentUser?.Designation}
                      onChange={(e, newValue) => {
                        setCurrentUser({
                          ...currentUser,
                          ["Designation"]: newValue?.Role_Name,
                        });
                        console.log("newValue", newValue, currentUser);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="date"
                          placeholder="Select Role"
                        />
                      )}
                    />
                  </FormControl>
                </Div>
              </Div>
            </Div>
          </DialogContent>

          <DialogActions>
            <CustomButton
              // onClick={() => handleSubmit()}
              label="Update"
              type="submit"
              Icon="saveIcon"
            />
            <Cancelbutton label="Cancel" onClick={() => setOpenEdit(false)} />
            {/* <Button
              type="submit"
              sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
            >
              Update
            </Button>
            <Button
              sx={[DialogBoxCancelButton, FontStyle, ButtonStyle, { mr: 2 }]}
              onClick={() => setOpenEdit(false)}
            >
              Cancel
            </Button> */}
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete user popup */}
      <DialogBox
        open={openDelete}
        Content={"Are you sure you want to delete the User"}
        onClickNo={() => {
          setOpenDelete(false);
        }}
        onClickYes={() => {
          setOpenDelete(false);
          deleteUser(currentUser?.username);
        }}
      />

      {/* code for invite user form */}
      <Div sx={{ display: showInviteUser === true ? "block" : "none" }}>
        <Typography sx={[ComponentHeading, { mt: 3 }]}>Invite User</Typography>
        <form onSubmit={handleSubmit(onSendMail)}>
          <Div sx={{ mt: 3, ml: { xs: 0, md: 3 }, minHeight: "300px" }}>
            <Div className="mb-2 row">
              <Typography
                for="staticEmail"
                className="col-sm-2 input-label mr-3"
              >
                Email Id <span className="required">*</span>
              </Typography>
              <Div className="col-sm-12 col-md-3">
                <FormControl className="col-sm-12" sx={{ minWidth: "350px" }}>
                  <TextField
                    className="input-box2"
                    // name="emailTo"
                    defaultValue={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="Enter Email Id"
                    autoComplete="off"
                    sx={{ minWidth: "350px" }}
                    {...register("emailTo", {
                      required: true,
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                </FormControl>
                {errors?.emailTo?.message ? (
                  <p className="text-danger">{errors?.emailTo?.message}</p>
                ) : errors?.emailTo ? (
                  <p className="text-danger">{"Enter Email id"}</p>
                ) : (
                  ""
                )}
              </Div>
            </Div>

            <Div className="mb-2 row">
              <Typography
                for="designation"
                className="col-sm-2 input-label mr-3"
              >
                User Type
              </Typography>
              <Div className="col-sm-12 col-md-3">
                <FormControl className="col-sm-12" sx={{ minWidth: "350px" }}>
                  <Autocomplete
                    className="search-select3"
                    name="date"
                    options={[
                      { label: "Admin", value: "UserAdmin" },
                      { label: "User", value: "User" },
                    ]}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.label) {
                        return option?.label;
                      }
                      return "";
                    }}
                    value={userType}
                    onChange={(e, newValue) => {
                      setUserType(newValue?.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="userType"
                        placeholder="Select User Type"
                      />
                    )}
                  />
                </FormControl>
              </Div>
            </Div>

            <Div className="mb-2 row">
              <Typography
                for="designation"
                className="col-sm-2 input-label mr-3"
              >
                Role
              </Typography>
              <Div className="col-sm-12 col-md-3">
                <FormControl className="col-sm-12" sx={{ minWidth: "350px" }}>
                  <Autocomplete
                    className="search-select3"
                    options={rolename}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.Role_Name) {
                        return option?.Role_Name;
                      }
                      return "";
                    }}
                    value={designation}
                    onChange={(event, newValue) => {
                      console.log("newValueee", newValue);
                      setDesignation(newValue);
                    }}
                    autoComplete="off"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Role"
                        autoComplete="off"
                      />
                    )}
                  />
                </FormControl>
              </Div>
            </Div>
          </Div>

          <Div sx={{ mt: 5 }}>
            <LoadingButton
              variant="contained"
              color="info"
              type="submit"
              endIcon={<MdSend />}
              sx={{ mr: 2, fontSize: "12px" }}
            >
              Send Request
            </LoadingButton>
            <Cancelbutton
              label="Cancel"
              onClick={() => {
                RedirectToUserTable();
                // resetForm();
                reset();
                setBusinessUnit("");
                setDesignation("");
                setEmailTo("");
              }}
            />
            {/* <Button
              sx={[DialogBoxCancelButton, FontStyle, ButtonStyle]}
              onClick={() => {
                RedirectToUserTable();
                // resetForm();
                reset();
                setBusinessUnit("");
                setDesignation("");
                setEmailTo("");
              }}
            >
              Cancel
            </Button> */}
          </Div>
        </form>
      </Div>
    </>
  );
};

export default UsersList;
