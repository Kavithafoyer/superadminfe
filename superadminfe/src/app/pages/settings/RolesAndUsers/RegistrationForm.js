import styled from "@emotion/styled";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Typography,
  Grid,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Card,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "app/services/auth-services";

const RegistrationForm = ({
  showPopup,
  setShowPopup,
  setShowUser,
  getData,
}) => {
  const initialstate = {
    id: "",
    password: "",
    confirmpassword: "",
    username: "",
    last_login: "",
    first_name: "",
    last_name: "",
    email: "",
    User_emailId: "",
    Business_Unit: "",
    location: "",
    User_Photo: "",
  };  
  const navigate = useNavigate();
  const theme = useTheme();
  const [base64, setbase64] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [user, setUser] = useState(initialstate);
  // const [firstName,setFirstName] = useState(null);
  // const [lastName,setLastName] = useState(null);
  // const [email,setEmail] = useState(null);
  // const [password,setPassword] = useState(null);
  // const [confirmPassword,setConfirmPassword] = useState(null);
  // const [contactNo,setContactNo] = useState(null);
  // const [role,setRole] = useState(null);
  // const [profilePhoto,setProfilePhoto] = useState(null);

  const validationSchema = yup.object({
    username: yup
      .string("Enter your username")
      .required("Username is required")
      .min(5, "Username is weak")
      .max(30, "Username is strong"),
    password: yup
      .string("Enter your password")
      .required("Password is required"),
  });

  // image upload function
  const handleChangeImage = (e) => {
    console.log("file uploaded: ", e.target.files[0]);
    console.log(e);
    let file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
      const name = e.target.name;
      const value = e.target.value;
      setUser((values) => ({ ...values, [name]: value }));
    }
  };

  const handleReaderLoaded = (e) => {
    console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setbase64(btoa(binaryString));
  };

  const handleSaveImage = (e) => {
    e.preventDefault();
    setShowImage(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  //This function is take the input data
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const token = localStorage.getItem("accesstoken");
  // const token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjk5NTQyMTgxLCJlbWFpbCI6InJhdmlrdW1hci5yQGZveWVydGVjaC5jb20iLCJvcmlnX2lhdCI6MTY5OTUwNjE4MX0.2xk15P67jfHINEHFhpyzyhLPR2fzitpujX3wolEkrMM"

  const handleSubmit = (e) => {
    e.preventDefault();
    var userpayload = {
      Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      User_Name: '',
      username: user.username,
      password: user.password,
      User_OldPassword: user.confirmpassword,
      email: user.email,
      User_emailId: '',
      User_Photo: "",
      User_Photo_Name: btoa(user.User_Photo),
      last_login: "2023-02-22",
      PhoneNo: user.PhoneNo,
      Boarding_House: 0,
      Street: "",
      Area: "",
      City: "",
      State: "",
      Country: user.location,
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
      first_name: user.first_name,
      last_name: user.last_name,
      Business_Unit: user.Business_Unit,
      UserType: "Admin",
      Url: "",
      groups: [],
      user_permissions: []
    };
    axios
      .post(`${BASE_URL}/Erpapp/Usersignup/`, userpayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
        navigate("/");
        getData();
      });
    // navigate("/");
  };

  const handleClickBack = () => {
    navigate("/settings/roles&users");
    setShowUser(true);
  };

  return (
    <>
      <Div>
        {/* <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        > */}
        <form
          onSubmit={handleSubmit}
          validateOnChange={true}
          validationSchema={validationSchema}
        >
          <Div className="row" sx={{ p: 5, width: "100%" }}>
            <Div className="col-1"></Div>
            <Div
              className="card col-10"
              sx={{
                border: "none",
                borderRadius: 1,
                p: 3,
                mt: 5,
                mb: 5,
                ml: 2,
                boxShadow: "0px 0px 10px 1px #D7DBDD",
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  mt: 0.5,
                  mb: 0.5,
                  fontWeight: 600,
                  textAlign: "center",
                  // color: "red",
                }}
              >
                Signup Form
              </Typography>
              <hr />

              <Grid container>
                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-12 col-lg-2">
                    <Typography className="col-12 input-label">
                      Salutation <span className="required">*</span>
                    </Typography>
                    <FormControl
                      className="col-12"
                      sx={{
                        minWidth: "100px",
                        maxWidth: "1005px",
                      }}
                    >
                      <Select
                        className="col-12 input-select"
                        defaultValue="1"
                      // onChange={(e) => setUser(e.target.value)}
                      >
                        <MenuItem value="1">Mr.</MenuItem>
                        <MenuItem value="2">Mis.</MenuItem>
                        <MenuItem value="3">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Div>

                  <Div className="col col-sm-12 col-lg-5">
                    <Typography className="col-12 input-label">
                      First Name <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="First Name"
                      name="first_name"
                      value={user.first_name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>

                  <Div className="col col-sm-12 col-lg-5">
                    <Typography className="col-12 input-label">
                      Last Name <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Last Name"
                      name="last_name"
                      value={user.last_name}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                </Grid>

                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Password <span className="required">*</span>
                    </Typography>
                    <TextField
                      type="password"
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Password"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>

                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Confirm Password <span className="required">*</span>
                    </Typography>
                    <TextField
                      type="password"
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Confirm Password"
                      name="confirmpassword"
                      value={user.confirmpassword}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                </Grid>

                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-6">
                    <Typography className="col-12 input-label">
                      User Name<span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Enter the user name"
                      name="username"
                      value={user.username}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>

                  <Div className="col col-sm-6">
                    <Typography className="col-12 input-label">
                      Email Id <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Email ID"
                      name="email"
                      value={user.email}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                </Grid>

                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-6">
                    <Typography className="col-12 input-label">
                      Contact No <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Contact No"
                      name="PhoneNo"
                      value={user.PhoneNo}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Business Unit <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      name="Business_Unit"
                      placeholder="Business Unit"
                      value={user.Business_Unit}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                </Grid>
                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Role <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Role"
                      name="Designation"
                      value="Sales Manager"
                      // value={user.Designation}
                      // onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>
                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Location <span className="required">*</span>
                    </Typography>
                    <TextField
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Location"
                      name="location"
                      value={user.location}
                      onChange={handleInputChange}
                      variant="outlined"
                      required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1130px",
                      }}
                    />
                  </Div>
                </Grid>

                {/* <Grid item className="row" xs={12} sm={12}>
                  <Div className="col-sm-12">
                  <Typography className="col-12 input-label">
                      Department <span className="required">*</span>
                    </Typography>
                    <FormControl className="col-12" sx={{ minWidth: "180px" }}>
                      <Select className="col-12 input-select" defaultValue="1">
                        <MenuItem value="1">Sales</MenuItem>
                        <MenuItem value="2">Purchase</MenuItem>
                        <MenuItem value="3">Marketing</MenuItem>
                      </Select>
                    </FormControl>
                  </Div>
                </Grid> */}

                <Grid item className="row" xs={12} sm={12}>
                  <Div className="col col-sm-12 col-lg-6">
                    <Typography className="col-12 input-label">
                      Upload Profile Photo <span className="required">*</span>
                    </Typography>
                    <TextField
                      type="file"
                      accept="image/*"
                      multiple
                      className="col-12 input-box"
                      id="outlined-basic"
                      placeholder="Upload Photo"
                      name="User_Photo"
                      value={user.User_Photo}
                      variant="outlined"
                      onChange={handleChangeImage}
                      // required
                      sx={{
                        minWidth: "180px",
                        maxWidth: "1005px",
                      }}
                    />
                  </Div>

                  <Div className="col col-sm-12 col-lg-2" sx={{ mt: 4 }}>
                    <Button onClick={handleSaveImage} className="save-button">
                      Upload
                    </Button>
                  </Div>

                  <Div className="col col-sm-12 col-lg-4" sx={{ mt: 4 }}>
                    <Card sx={{ minHeight: "200px", p: 2 }}>
                      <Div
                        sx={{
                          // ml: { xs: 0, md: 17 },
                          display: showImage === true ? "block" : "none",
                          p: 3,
                          width: 200,
                          height: 200,
                          // border: "1px solid #B2BABB ",
                          borderRadius: 0,
                        }}
                      >
                        <img
                          alt="Image1"
                          src={`data:image/png;base64,${base64}`}
                          width={150}
                          height={150}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Div>
                    </Card>
                  </Div>
                </Grid>
              </Grid>

              {/* code for save and back buttons */}
              <Div sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  type="submit"
                  className="save-button"
                  sx={{
                    mr: 3,
                  }}
                // onClick={handleClickSave}
                >
                  Save
                </Button>

                <Button className="cancel-button" onClick={handleClickBack}>
                  Back
                </Button>
              </Div>
            </Div>

            <Div className="col-1"></Div>
          </Div>
        </form>
        {/* </Formik> */}
      </Div>
    </>
  );
};

export default RegistrationForm;
