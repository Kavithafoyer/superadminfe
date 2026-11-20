import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Link from "@mui/material/Link";
import { alpha } from "@mui/material/styles";
import Div from "@jumbo/shared/Div";
import { BASE_URL } from "../../../services/auth-services";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import crmLogo from "../../../assets/images/crmlogo.png";

const ForgotPassword = ({ username, setLoginPageView, setForgotPageView }) => {
  const navigate = useNavigate();
  const [UserEmail, setUserEmail] = useState("");
  const [UserOTP, setUserOTP] = useState("");
  const [ResetEmailview, setResetEmailview] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleOTPChange = (event) => {
    setUserOTP(event.target.value);
  };

  const handleRequestOTP = async () => {
    if (!UserEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const email = UserEmail.trim();

      // Check if user email is valid in UserCRUD_mailid
      try {
        await axios.get(`${BASE_URL}/useradmin/UserCRUD_mailid/?email=${email}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } catch (mailError) {
        console.error("Error verifying email via UserCRUD_mailid:", mailError);
        const errMsg =
          mailError.response?.data?.detail ||
          mailError.response?.data?.message ||
          "Could not find user with that email";
        toast.error(errMsg);
        // Do not render OTP page
        setLoading(false);
        return;
      }

      const payload = {
        email: email,
      };

      await axios.post(`${BASE_URL}/superadmin/RequestOTP/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      toast.success("OTP has been sent to your email address");
      setResetEmailview(false);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      const errMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async () => {
    const otpValue = UserOTP.trim();
    if (!otpValue) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(otpValue)) {
      toast.error("Please enter a valid 6-digit OTP containing only numbers");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: UserEmail.trim(),
        otp: UserOTP.trim(),
      };

      const response = await axios.post(
        `${BASE_URL}/superadmin/VerifyOTP/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (response.data.status === true) {
        toast.success(response.data.message || "OTP verified successfully");
        sessionStorage.setItem("forgot_password_email", UserEmail.trim());
        navigate("/auth-pages/reset-password", { state: { email: UserEmail.trim() } });
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(
        error.response?.data?.message || "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div
      sx={{
        flex: 1,
        flexWrap: "wrap",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: (theme) => theme.spacing(4),
        minHeight: "100vh",
      }}
    >
      <Div sx={{ display: "inline-flex" }}>
        <Card
          sx={{
            maxWidth: "100%",
            width: { xs: 250, md: 360 },
            mb: 4,
            borderRadius: "10px",
            boxShadow: "0px 0px 15px 0px rgba(0,0,0,0.1)",
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
              Forgot Password?
            </Typography>
            <Typography
              variant={"body2"}
              sx={{
                color: "text.secondary",
                textAlign: "center",
                fontSize: "0.85rem",
              }}
            >
              {ResetEmailview
                ? "Enter your email to receive a verification code."
                : "Enter the 6-digit code sent to your email."}
            </Typography>
          </Div>
          <CardContent sx={{ p: 3 }}>
            {ResetEmailview ? (
              <Div>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "primary.main", fontWeight: 500 }}
                >
                  We will send a One-Time Password (OTP) to your registered
                  email address.
                </Typography>
                <Div sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    id="email"
                    value={UserEmail}
                    onChange={handleEmailChange}
                    disabled={loading}
                  />
                </Div>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 2,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                  onClick={handleRequestOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </Div>
            ) : (
              <Div>
                <Div sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    Enter OTP
                  </Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    id="OTP"
                    placeholder="Enter 6-digit OTP"
                    value={UserOTP}
                    onChange={handleOTPChange}
                    autoFocus
                  />
                </Div>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mb: 2,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                  onClick={handleSubmitOTP}
                >
                  Submit OTP
                </Button>

                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{ color: "text.secondary" }}
                >
                  Didn't receive the code?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleRequestOTP}
                    sx={{ fontWeight: 600, textDecoration: "none" }}
                  >
                    Resend
                  </Link>
                </Typography>
              </Div>
            )}

            <Div sx={{ mt: 2, textAlign: "center" }}>
              <Button
                sx={{
                  textTransform: "none",
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  "&:hover": { backgroundColor: "transparent", color: "primary.main" }
                }}
                onClick={() => {
                  setLoginPageView(true);
                  setForgotPageView(false);
                }}
              >
                Back to Login
              </Button>
            </Div>
          </CardContent>
        </Card>
      </Div>
    </Div>
  );
};

export default ForgotPassword;
