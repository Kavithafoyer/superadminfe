import styled from "@emotion/styled";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  TextField,
  Card,
  Avatar,
  IconButton,
  Autocomplete,
} from "@mui/material";
import * as yup from "yup";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "app/services/auth-services";
import { toast } from "react-toastify";
import { MdPhotoCamera } from "react-icons/md";

const RegistrationPage = () => {
  const initialstate = {
    password: "",
    confirmpassword: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    Designation: "",
    User_Photo: "",
    PhoneNo: "",
    BuildingHouseNo: "",
    Street: "",
    Area: "",
    City: "",
    State: "",
    Country: "",
    UserType: "User",
  };

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [base64, setbase64] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [user, setUser] = useState(initialstate);
  const [photoName, setPhotoName] = useState("");

  const handleChangeImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setbase64(btoa(event.target.result));
        setShowImage(true);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.password !== user.confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    var userpayload = {
      Organization_Id: parseInt(localStorage.getItem("OrganizationId")) || 1,
      User_Name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      password: user.password,
      User_OldPassword: user.password,
      email: user.email,
      User_Photo_Name: photoName,
      User_Photo: base64,
      PhoneNo: user.PhoneNo,
      Boarding_House: user.BuildingHouseNo,
      Street: user.Street,
      Area: user.Area,
      City: user.City,
      State: user.State,
      Country: user.Country,
      Designation: user.Designation,
      UserType: user.UserType,
      Created_By: 1,
      Updated_By: 1,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    axios
      .post(`${BASE_URL}/Erpapp/Usersignup/`, userpayload)
      .then((res) => {
        toast.success("Registration successful!");
        navigate("/user/login");
      })
      .catch((err) => {
        toast.error("Registration failed. Please try again.");
      });
  };

  return (
    <Div
      sx={{
        width: 900,
        maxWidth: "100%",
        margin: "auto",
        p: 4,
      }}
    >
      <Card
        sx={{
          p: 5,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 5, fontWeight: 700, color: "#2c3e50" }}
        >
          Registration Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Profile Photo Section */}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Div sx={{ position: "relative" }}>
                <Avatar
                  src={showImage ? `data:image/png;base64,${base64}` : ""}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid #f0f0f0",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  }}
                />
                <IconButton
                  color="primary"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "white",
                    "&:hover": { bgcolor: "#f5f5f5" },
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <MdPhotoCamera />
                </IconButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleChangeImage}
                  accept="image/*"
                />
              </Div>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Click to upload profile photo
              </Typography>
              {photoName && (
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {photoName}
                </Typography>
              )}
            </Grid>

            {/* Basic Info */}
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Username <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                required
                placeholder="Enter Username"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Email <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                required
                placeholder="Enter Email"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Password <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
                required
                placeholder="Enter Password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Confirm Password <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                type="password"
                name="confirmpassword"
                value={user.confirmpassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm Password"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                First Name <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                required
                placeholder="Enter First Name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Last Name <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                required
                placeholder="Enter Last Name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Designation <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="Designation"
                value={user.Designation}
                onChange={handleInputChange}
                required
                placeholder="Enter Designation"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                Phone Number <span className="required">*</span>
              </Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="PhoneNo"
                value={user.PhoneNo}
                onChange={handleInputChange}
                required
                placeholder="Enter Phone Number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography className="input-label">
                User Type <span className="required">*</span>
              </Typography>
              <Autocomplete
                className="input-box2"
                options={["Admin", "User", "Manager"]}
                value={user.UserType}
                onChange={(event, newValue) => {
                  setUser((values) => ({ ...values, UserType: newValue }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose User Type"
                    required
                  />
                )}
              />
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{
                  mt: 3,
                  mb: 1,
                  fontWeight: 600,
                  borderBottom: "1px solid #eee",
                  pb: 1,
                }}
              >
                Address Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography className="input-label">Building/House No</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="BuildingHouseNo"
                value={user.BuildingHouseNo}
                onChange={handleInputChange}
                placeholder="Enter Building/House No"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">Street</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="Street"
                value={user.Street}
                onChange={handleInputChange}
                placeholder="Enter Street"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">Area</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="Area"
                value={user.Area}
                onChange={handleInputChange}
                placeholder="Enter Area"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">City</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="City"
                value={user.City}
                onChange={handleInputChange}
                placeholder="Enter City"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">State</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="State"
                value={user.State}
                onChange={handleInputChange}
                placeholder="Enter State"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography className="input-label">Country</Typography>
              <TextField
                fullWidth
                className="input-box2"
                name="Country"
                value={user.Country}
                onChange={handleInputChange}
                placeholder="Enter Country"
              />
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "center", mt: 5 }}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                color="success"
                sx={{
                  px: 8,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "0px 4px 15px rgba(46, 125, 50, 0.3)",
                }}
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Div>
  );
};

export default RegistrationPage;
