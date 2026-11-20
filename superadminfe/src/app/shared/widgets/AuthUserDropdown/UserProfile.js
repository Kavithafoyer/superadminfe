import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Grid,
  Box,
  Divider,
  Fade,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { FaCamera, FaSave, FaTimes } from "react-icons/fa";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import { BASE_URL, getProfileImage } from "app/services/auth-services";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { CustomButton, Cancelbutton } from "app/pages/widgets/StylesComponents";

const UserProfile = ({ open, setOpen }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const username = localStorage.getItem("Username");

  const urlToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting URL to Base64:", error);
      return null;
    }
  };

  const fetchProfile = () => {
    // Read directly from localStorage — data was stored there at login from UserCRUD_GET
    const storedDetails = localStorage.getItem("UserDetails");
    if (storedDetails) {
      try {
        const data = JSON.parse(storedDetails);
        if (!data.Designation) {
          data.Designation =
            localStorage.getItem("UserType") ||
            localStorage.getItem("Designation") ||
            "Admin";
        }
        setProfileData(data);
        setEditData(data);
      } catch (e) {
        console.error("Error parsing UserDetails from localStorage:", e);
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchProfile();
    }
  }, [open, username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem("accesstoken");
    const payload = {
      ...editData,
      id: profileData.id,
    };

    axios
      .patch(`${BASE_URL}/useradmin/UserCRUD/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        fetchProfile();
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        toast.error("Failed to update profile");
      });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Fallback values from localStorage or default
  const userDetails = JSON.parse(localStorage.getItem("UserDetails") || "{}");

  const displayData = {
    username: profileData?.username || username || "-",
    email: profileData?.email || userDetails?.email || "-",
    PhoneNo: profileData?.PhoneNo || userDetails?.Phone_No || "-",
    Designation:
      profileData?.Designation || localStorage.getItem("UserType") || "Admin",
    first_name:
      profileData?.first_name ||
      userDetails?.Full_Name?.split(" ")[0] ||
      username ||
      "User",
    last_name:
      profileData?.last_name ||
      userDetails?.Full_Name?.split(" ").slice(1).join(" ") ||
      "",
    last_password_change: profileData?.User_PwdUpdatedate || "29th Dec 2024",
    photo: editData?.User_Photo?.startsWith("data:image")
      ? editData.User_Photo
      : getProfileImage(profileData?.User_Photo),
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setEditData((prev) => ({
          ...prev,
          User_Photo: base64String,
          User_Photo_Name: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{ borderBottom: "1px solid #eee", pb: 1 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#43917A" }}>
          Profile
        </Typography>
        <Box display="flex" alignItems="center">
          {!isEditing && (
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => setIsEditing(true)}
              size="small"
              sx={{ color: "#43917A", textTransform: "none", fontWeight: 600 }}
            >
              Edit
            </Button>
          )}
          <IconButton onClick={handleClose} size="small" sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Div
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Div sx={{ position: "relative" }}>
            <Avatar
              src={displayData.photo}
              sx={{
                width: 120,
                height: 120,
                fontSize: "48px",
                bgcolor: "#43917A",
                color: "white",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {displayData.username.charAt(0).toUpperCase()}
            </Avatar>
            <Div
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "8px",
                display: isEditing ? "flex" : "none",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("profile-image-upload").click()}
            >
              <FaCamera style={{ fontSize: "18px", color: "#43917A" }} />
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Div>
          </Div>
          {isEditing && editData?.User_Photo_Name && (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 1, color: "#64748b", fontSize: "0.75rem" }}
            >
              Selected: {editData.User_Photo_Name}
            </Typography>
          )}
          <Div sx={{ textAlign: "center", mt: 2 }}>
            {isEditing ? (
              <Box display="flex" gap={1}>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>First Name</Typography>
                  <TextField
                    className="input-box2"
                    size="small"
                    name="first_name"
                    value={editData.first_name || ""}
                    onChange={handleInputChange}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>Last Name</Typography>
                  <TextField
                    className="input-box2"
                    size="small"
                    name="last_name"
                    value={editData.last_name || ""}
                    onChange={handleInputChange}
                  />
                </Box>
              </Box>
            ) : (
              <Typography
                variant="h2"
                sx={{ fontWeight: 600, color: "#1e293b" }}
              >
                {displayData.first_name} {displayData.last_name}
              </Typography>
            )}
          </Div>
        </Div>

        <Box sx={{ px: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Typography
                variant="h3"
                sx={{ color: "#64748b", fontSize: "0.9rem", mb: 0.5 }}
              >
                User Name
              </Typography>
              {isEditing ? (
                <TextField
                  className="input-box2"
                  fullWidth
                  size="small"
                  name="username"
                  value={editData.username || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 500, color: "#1e293b" }}
                >
                  {displayData.username}
                </Typography>
              )}
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="h3"
                sx={{ color: "#64748b", fontSize: "0.9rem", mb: 0.5 }}
              >
                Role
              </Typography>
              {isEditing ? (
                <TextField
                  className="input-box2"
                  fullWidth
                  size="small"
                  name="Designation"
                  value={editData.Designation || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 500, color: "#1e293b" }}
                >
                  {displayData.Designation}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{ color: "#64748b", fontSize: "0.9rem", mb: 0.5 }}
              >
                Email Id
              </Typography>
              {isEditing ? (
                <TextField
                  className="input-box2"
                  fullWidth
                  size="small"
                  name="email"
                  value={editData.email || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 500, color: "#1e293b" }}
                >
                  {displayData.email}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{ color: "#64748b", fontSize: "0.9rem", mb: 0.5 }}
              >
                Phone No.
              </Typography>
              <Box display="flex" alignItems="center">
                {isEditing ? (
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="PhoneNo"
                    value={editData.PhoneNo || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 500, color: "#1e293b" }}
                    >
                      {displayData.PhoneNo}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                sx={{ color: "#64748b", fontSize: "0.9rem", mb: 0.5 }}
              >
                Password
              </Typography>
              <Box display="flex" alignItems="center">
                {isEditing ? (
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="password"
                    onChange={handleInputChange}
                  />
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 500, color: "#1e293b" }}
                    >
                      ********
                    </Typography>
                  </>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", mt: 0.5, fontSize: "0.8rem" }}
              >
                Password last changed on {displayData.last_password_change}
              </Typography>
            </Grid>

            {isEditing && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="h3"
                    sx={{ color: "#64748b", fontSize: "0.9rem", mb: 1 }}
                  >
                    Address Details
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>Street</Typography>
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="Street"
                    value={editData.Street || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>Area</Typography>
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="Area"
                    value={editData.Area || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>City</Typography>
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="City"
                    value={editData.City || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>State</Typography>
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="State"
                    value={editData.State || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>Country</Typography>
                  <TextField
                    className="input-box2"
                    fullWidth
                    size="small"
                    name="Country"
                    value={editData.Country || ""}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      {isEditing && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <CustomButton label="Save" Icon="saveIcon" onClick={handleSave} />
          <Cancelbutton label="Cancel" onClick={handleCancel} />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UserProfile;
