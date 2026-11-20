import React from "react";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Div from "@jumbo/shared/Div";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import crmLogo from "../../../assets/images/crmlogo.png";


const ResetPassword1 = () => {
  const token = localStorage.getItem("accesstoken");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let userDetails = localStorage.getItem("UserDetails");
  userDetails = JSON.parse(userDetails);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (confirmPassword == newPassword) {
      axios
        .patch(
          `${BASE_URL}/useradmin/UserCRUD/`,
          {
            id: localStorage.getItem("UserId"),
            username: userDetails && userDetails?.username,
            password: confirmPassword,
            Password_Status: false,
            Navigate_Status: true
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
          console.log("get appointments list", res.data);
          toast.success("Password Updated Successfully")
          navigate(`/`);

        })
        .catch((error) => {
          console.log("error", error);
        });
    } else {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 500,
      });
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
      }}
    >
      <Div sx={{ mb: 3, display: "inline-flex" }}>
        <Link href="#" underline="none" sx={{ display: "inline-flex" }}>
          <img
            src={crmLogo}
            width={200}
            height={45}
            alt="CRM React"
          />
        </Link>
      </Div>
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
          <Div sx={{ position: "relative", height: "50px" }}>
            <Div
              sx={{
                flex: 1,
                inset: 0,
                position: "absolute",
                alignItems: "center",
                backgroundColor: (theme) => alpha(theme.palette.common.white),
                p: (theme) => theme.spacing(3),
              }}
            >
              <Typography
                variant={"h2"}
                sx={{
                  color: "common.black",
                  textAlign: "center",
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  mb: 0,
                }}
              >
                Reset Password
              </Typography>
            </Div>
          </Div>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Div sx={{ mb: 3, width: "100% !important" }}>
                <TextField
                  sx={{
                    fontSize: "14px !important",
                    height: "33px !important",
                    width: "100% !important",
                  }}
                  className="input-box"
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
                  sx={{
                    fontSize: "14px !important",
                    height: "33px !important",
                    width: "100% !important",
                  }}
                  className="input-box"
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
                className="save-button"
                type="submit"
                sx={{ mb: 1 }}
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

export default ResetPassword1;
