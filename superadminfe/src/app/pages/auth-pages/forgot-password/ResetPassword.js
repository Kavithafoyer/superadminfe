import React from "react";
import { Card, CardContent, TextField, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import { alpha } from "@mui/material/styles";
import Div from "@jumbo/shared/Div";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import crmLogo from "../../../assets/images/crmlogo.png";


const ResetPassword = () => {
  const token = localStorage.getItem("accesstoken");
  const navigate = useNavigate();
  const location = useLocation();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("UserId"));
  const [userName, setUserName] = useState("");

  let userDetails = localStorage.getItem("UserDetails");
  try {
    userDetails = JSON.parse(userDetails);
  } catch (e) {
    userDetails = null;
  }

  // Get email from navigation state (forgot password flow) or sessionStorage
  const emailFromState = location.state?.email || sessionStorage.getItem("forgot_password_email");

  useEffect(() => {
    if (emailFromState) {
      // Forgot password flow — fetch user id from email
      axios
        .get(`${BASE_URL}/useradmin/UserCRUD_mailid/?email=${emailFromState}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("UserCRUD_mailid response:", res.data);
          const userData = Array.isArray(res.data) ? res.data[0] : res.data;
          if (userData) {
            setUserId(userData.id);
            setUserName(userData.username);
          } else {
            console.error("No user found in response:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user by email:", error);
          toast.error("Could not find user with that email");
        });
    } else if (userDetails) {
      // Logged-in user resetting password
      setUserId(localStorage.getItem("UserId"));
      setUserName(userDetails?.username);
    }
  }, [emailFromState]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword !== newPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 500,
      });
      return;
    }

    try {
      let finalUserId = userId;
      let finalUserName = userName;

      if (!finalUserId && emailFromState) {
        const mailRes = await axios.get(
          `${BASE_URL}/useradmin/UserCRUD_mailid/?email=${emailFromState}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const userData = Array.isArray(mailRes.data) ? mailRes.data[0] : mailRes.data;
        if (userData) {
          finalUserId = userData.id;
          finalUserName = userData.username;
        }
      }

      if (!finalUserId) {
        toast.error("User ID not found. Please try the forgot password flow again.");
        return;
      }

      const res = await axios.patch(
        `${BASE_URL}/useradmin/UserCRUD/`,
        {
          id: finalUserId,
          username: finalUserName || (userDetails && userDetails?.username),
          password: confirmPassword,
          Password_Status: false,
          Navigate_Status: true
        },
        {
          headers: {
            db: "crm",
            ...(token && { Authorization: `Bearer ${token}` }),
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("get appointments list", res.data);
      sessionStorage.removeItem("forgot_password_email");

      if (localStorage.getItem("UserType") === "UserAdmin") {
        toast.success("Password Updated Successfully");
        navigate(`/user-admin-dashboard`);
      } else {
        navigate(`/`, { state: { username: finalUserName } });
        toast.success("Password Updated Successfully");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (userDetails?.Navigate_Status === false) {
      axios
        .patch(
          `${BASE_URL}/useradmin/UserCRUD/`,
          {
            id: localStorage.getItem("UserId"),
            username: userDetails && userDetails?.username,
            Navigate_Status: true,
          },
          {
            headers: {
              db: "crm",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {

          console.log("get", res.data);
          window.location.href = `/admin.crmfarm.in/InstanceCreationList`
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    else {
      window.location.href = `/admin.crmfarm.in/${Tenantname}`

    }

  }

  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // ml: {xs: 0, md: 60, xl: 60},
        p: (theme) => theme.spacing(4),
        minHeight: "100vh",
      }}
    >
      <Div sx={{ display: "inline-flex" }}>
        <Card
          sx={{
            maxWidth: "100%",
            width: { xs: 300, md: 360 },
            mb: 2,
            borderRadius: "10px",
            boxShadow: "0px 0px 5px 0px #95A5A6",
          }}
        >
          <Div
            sx={{
              p: (theme) => theme.spacing(3),
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.5),
            }}
          >
            <Typography
              variant={"h2"}
              sx={{
                color: "common.black",
                textAlign: "center",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                mb: 1,
                fontWeight: 600,
              }}
            >
              Reset Password
            </Typography>
          </Div>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Div sx={{ mb: 3, width: "100% !important" }}>
                <TextField
                  fullWidth
                  className="input-box2"
                  placeholder="Enter New password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                // focused
                />
                <br />
                <br />
                <TextField
                  fullWidth
                  className="input-box2"
                  type="password"
                  placeholder="Retype New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                // focused
                />
              </Div>
              <Button
                fullWidth
                variant="contained"
                className="save-button"
                type="submit"
                sx={{
                  mb: 2,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Reset Password
              </Button>
            </form>
            {/* <Button
            onClick={handleUpdate}
              sx={{
                float: "right",
                mb: 1,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Cancel
            </Button> */}
          </CardContent>
        </Card>
        <>{/* <ToastContainer /> */}</>
      </Div>
    </Div>
  );
};

export default ResetPassword;
