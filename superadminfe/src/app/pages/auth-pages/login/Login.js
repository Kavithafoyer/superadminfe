import React, { useState } from "react";
import "./Login.css";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Div from "@jumbo/shared/Div";
import * as yup from "yup";
import { BASE_URL, Tenantname } from "../../../services/auth-services";
import { useLocation, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import arrow from "../../../assets/images/right-arrow.gif";
import CRMlogo from "../../../assets/images/crmlogo.png";
import {
  Colors,
  DisplayFlex,
  FontStyle,
  generateRandomColor,
} from "app/pages/widgets/CRMStyles";
import { useEffect } from "react";
import ForgotPassword from "../forgot-password/ForgotPassword";
import Cookies from "js-cookie";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { base64UrlDecode } from "app/pages/home/IntroPage";
import { FirstLetterCaps } from "app/pages/widgets/StylesComponents";

export let uniqueID = generateRandomColor().split("#")[1];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken } = useJumboAuth();

  // const params = new URLSearchParams(location.search);
  // const Tenantname = params.get('Tenentname');
  const hostname = window.location.href.split(".")[0].split("//")[1];
  const Tenantname =
    hostname === "admin.localhost:3000/" ? "" : hostname.split(".")[0];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [validData, setValidData] = useState([]);
  const [role, setRole] = useState("");
  const [progress, setProgress] = useState(300);
  const [progressInterval, setProgressInterval] = useState(null);
  const [error, setErrors] = useState({});
  const [status, setStatus] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [LoginPageView, setLoginPageView] = useState(true);
  const [ForgotPageView, setForgotPageView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const validationSchema = yup.object({
    username: yup
      .string("Enter username")
      .required("Email is required")
      .max(30, "Username is strong"),
    password: yup
      .string("Enter your password")
      .required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors: formErrors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
      setValue("username", location.state.username);
    } else {
      const savedUsername = Cookies.get("LUserName");
      const savedPassword = Cookies.get("LPassword");
      if (savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
        setValue("username", savedUsername);
        setValue("password", savedPassword);
      }
    }
  }, [location.state, setValue]);

  const startProgressInterval = () => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress - 1;
        if (newProgress === 0) {
          setShowLoginButton(true);
          setShowOtpBox(false);
          clearInterval(interval);
          stopProgressInterval();
        }
        return newProgress;
      });
    }, 1000);
    setProgressInterval(interval);
  };

  const stopProgressInterval = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
      setOtp("");
      setOtpNumber("");
    }
  };

  const generateOTP = () => {
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    console.log("OTP: ", OTP);
    return OTP;
  };

  const handleGenerateOtp = () => {
    let errors = {};
    if (!username.trim()) {
      errors.username = "Email is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsOtpLoading(true);
      setShowOtpBox(true);
      setShowLoginButton(false);
      const otp = generateOTP();
      const payload = {
        username,
        subject: "OTP Verification",
        MailContent: `<div className="card">
          <div className="card-body">
            <h4 className="card-title">Hi,</h4>
            <p className="card-text">
              To ensure the security of your account, we require you to verify your identity with a One-Time Password (OTP).
            </p>
            <br/>
            <p>Here is your OTP: <span style="font-size: 18px; font-weight: 600;">${otp}</span></p>
            <br/>
            <p>
              Please enter this OTP on the login page within the next 10 minutes to complete the verification process and gain access to your account.
            </p>
            <br/>
            <p>
              If you did not request this OTP or have any concerns about your account's security, please contact our support team immediately.
            </p>
            <br/>
            <div>CRMFarm Team</div>
          </div>
        </div>`,
      };

      // Small delay to ensure the skeleton is visible even if the API is very fast
      setTimeout(() => {
        axios
          .post(`${BASE_URL}/user/GenerateOtp/`, payload, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then((res) => {
            setIsOtpLoading(false);
            setOtpNumber(otp);
            setOtp("");
            setProgress(300);
            startProgressInterval();
            localStorage.setItem("OTP", otp);
          })
          .catch((error) => {
            console.error("Error generating OTP:", error);
            setIsOtpLoading(false);
            setOtpNumber(otp);
            setOtp("");
            setProgress(300);
            startProgressInterval();
            localStorage.setItem("OTP", otp);
          });
      }, 500);
    }
  };

  const Check_isactiveTenant = async (data) => {
    setIsLoading(true);
    console.log("Entering into Check_isactiveTenant ");
    var userpayload = {
      username: username,
      password: password,
    };

    await axios
      .get(`${BASE_URL}/useradmin/UserCRUD_GET/?username=${username}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("res Login Check:", res);
        if (res?.data?.is_Tenantactive == true) {
          handleResetPassword(res.data);
        } else {
          toast.error("Your Subscription is inactive", {
            position: "top-right",
            autoClose: 500,
          });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Enter valid username and password", {
          position: "top-right",
          autoClose: 500,
        });
      });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const updateLoginStatus = async () => {
    try {
      // Direct navigation bypassing the UserCRUD PATCH endpoint
      navigate("/superadmin-dashboard");
    } catch (error) {
      console.error("Error updating login status:", error);
    }
  };

  const handleResetPassword = async (userDataFromGet) => {
    const userpayload = {
      username,
      password,
    };

    await axios
      .post(`${BASE_URL}/useradmin/login/`, userpayload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        setIsLoading(false);
        if (res.status === 200 && username !== "demouser") {
          if (rememberMe) {
            Cookies.set("LUserName", username);
            Cookies.set("LPassword", password);
          }
          // handleGenerateOtp(); // Bypassing OTP
        }
        const accessToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const sessionId = res.data.session_id;

        console.log("DEBUG: Login token response:", res.data, "Extracted:", { accessToken, refreshToken, sessionId });

        localStorage.setItem("accesstoken", accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshtoken", refreshToken);
        if (sessionId) {
          localStorage.setItem("session_id", sessionId);
        }
        localStorage.setItem("selectedItems", JSON.stringify([]));
        localStorage.setItem("selectedItems1", JSON.stringify([]));
        localStorage.setItem("isLoggedIn", "true");

        if (userDataFromGet) {
          const userData = userDataFromGet;
          setStatus(userData);
          localStorage.setItem("UserType", userData.UserType);
          localStorage.setItem("UserDetails", JSON.stringify(userData));
          localStorage.setItem("Username", userData.username);
          localStorage.setItem("UserId", userData.id);
          localStorage.setItem("OrganizationId", userData.Organization_Id);
          localStorage.setItem("Designation", userData.Designation);
          localStorage.setItem("DBName", "crmuseradmin1");
          setRole(userData.Designation);

          setValidData(userData);
          if (username === "demouser") {
            if (rememberMe) {
              Cookies.set("LUserName", username);
              Cookies.set("LPassword", password);
            }
            navigate(`/superadmin-dashboard`);
            toast.success("Login successfully", {
              position: "top-right",
              autoClose: 500,
            });
          } else {
            if (rememberMe) {
              Cookies.set("LUserName", username);
              Cookies.set("LPassword", password);
            }
            updateLoginStatus();
            toast.success("Login successfully", {
              position: "top-right",
              autoClose: 500,
            });
          }
        } else {
          setIsLoading(false);
          console.error("No user data provided from UserCRUD_GET");
          toast.error("User details could not be retrieved", {
            position: "top-right",
            autoClose: 500,
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error resetting password:", error);
        toast.error("Enter valid username and password", {
          position: "top-right",
          autoClose: 500,
        });
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleResetPassword();
  };

  const validateOtp = async (e) => {
    if (otp == otpNumber) {
      setIsLoading(true);
      await updateLoginStatus();
      setIsLoading(false);

      toast.success("OTP is Verified");
      toast.success("Login successfully", {
        position: "top-right",
      });

      for (let i = 0; i < 2; i++) {
        navigate("/superadmin-dashboard");
      }
    } else {
      toast.error("Please enter valid OTP");
    }
  };

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
    // console.log("Remember me:", event.target.checked);
  };

  // console.log("Tenantname", Tenantname)

  return (
    <>
      {ForgotPageView ? (
        <ForgotPassword
          username={username}
          setLoginPageView={setLoginPageView}
          setForgotPageView={setForgotPageView}
        />
      ) : (
        <div id="main-wrapper" className="oxyy-login-register">
          <div className="container-fluid px-0">
            <div className="row g-0 min-vh-100">
              <div className="col-md-6 order-2 order-md-1">
                <div className="hero-wrap d-flex align-items-center h-100">
                  <div className="hero-mask"></div>
                  <div className="hero-bg hero-bg-scroll"></div>
                </div>
              </div>
              <div className="col-md-6 d-flex order-1 order-md-2">
                <div className="container my-auto py-5">
                  <div className="row g-0">
                    <div className="col-11 col-sm-10 col-lg-9 col-xl-8 mx-auto">
                      <div style={{ textAlign: "-webkit-center" }}>
                        <img src={CRMlogo} width={100}></img>
                      </div>
                      <h3 className="fw-600 mb-2 text-center">
                        {FirstLetterCaps(
                          Tenantname === "localhost:3000/" ? "" : Tenantname,
                        )}
                      </h3>
                      <h3 className="fw-600 mb-4">Log In</h3>
                      <form
                        id="loginForm"
                        onSubmit={handleSubmit(Check_isactiveTenant)}
                        // onSubmit={handleSubmit(Check_isactiveTenant)}
                        style={{ textAlign: "left", color: "white" }}
                        noValidate
                        autoComplete="off"
                      >
                        <div className="mb-3">
                          <label htmlFor="Username" className="form-label">
                            Username
                          </label>
                          <input
                            id="emailAddress"
                            required
                            fullWidth
                            type="text"
                            autoComplete="off"
                            className={`form-control ${formErrors.username ? "is-invalid" : ""}`}
                            {...register("username")}
                            value={username}
                            disabled={isLoading}
                            onChange={(e) => {
                              setUsername(e.target.value);
                              setValue("username", e.target.value, {
                                shouldValidate: true,
                              });
                            }}
                            placeholder="Enter username"
                          />
                          {formErrors.username && (
                            <div
                              className="invalid-feedback d-block text-danger mt-1"
                              style={{ fontSize: "13px" }}
                            >
                              {formErrors.username.message}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="password"
                            className="form-label"
                            id="loginPassword"
                          >
                            Password
                          </label>
                          <div className="relative">
                            <input
                              fullWidth
                              type={showPassword ? "text" : "password"}
                              className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                              {...register("password")}
                              value={password}
                              disabled={isLoading}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setValue("password", e.target.value, {
                                  shouldValidate: true,
                                });
                              }}
                              placeholder="Enter Your Password"
                            />
                            {formErrors.password && (
                              <div
                                className="invalid-feedback d-block text-danger mt-1"
                                style={{ fontSize: "13px" }}
                              >
                                {formErrors.password.message}
                              </div>
                            )}
                            {password?.length > 0 && (
                              <span
                                onClick={handleClickShowPassword}
                                className="cursor-pointer absolute top-[50%] transform -translate-y-[50%] right-4"
                              >
                                {showPassword ? (
                                  <EyeOutlined
                                    style={{ fontSize: "18px" }}
                                    className="text-[#3fa9ff]"
                                  />
                                ) : (
                                  <EyeInvisibleOutlined
                                    style={{ fontSize: "18px" }}
                                    className="text-[#3fa9ff]"
                                  />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* --- OTP UI COMMENTED OUT ---
                      <Div
                        sx={{
                          display: showOtpBox === true ? "block" : "none",
                          justifyContent: "center",
                          mt: 3,
                        }}
                      >
                        {isOtpLoading ? (
                          <Div sx={{ mt: 2 }}>
                            <Typography
                              sx={{
                                color: "#3fa9ff",
                                mb: 1.5,
                                fontSize: "14px",
                                textAlign: "center",
                                fontWeight: 500,
                              }}
                            >
                              Sending verification code to your email...
                            </Typography>
                            <Skeleton
                              animation="wave"
                              variant="text"
                              width="40%"
                              height={25}
                              sx={{
                                mb: 1,
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                              }}
                            />
                            <Skeleton
                              animation="wave"
                              variant="rectangular"
                              width="100%"
                              height={48}
                              sx={{
                                borderRadius: "4px",
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                              }}
                            />
                          </Div>
                        ) : (
                          <>
                            <Typography
                              sx={[FontStyle, { mt: 2, color: "#102C57" }]}
                            >
                              OTP will expire within {progress} sec
                            </Typography>
                            <Div className="mt-1">
                              <input
                                className="form-control"
                                id="emailAddress"
                                required
                                fullWidth
                                type="text"
                                autoComplete="off"
                                value={otp}
                                onChange={(e) => {
                                  setOtp(e.target.value);
                                }}
                                placeholder="Check Mail and Enter OTP"
                              />
                            </Div>
                          </>
                        )}
                      </Div>
                      --- END OTP UI --- */}
                        <div className="row mt-4">
                          <div className="col">
                            <div className="form-check">
                              <input
                                id="remember-me"
                                name="remember"
                                className="form-check-input"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleCheckboxChange}
                              />
                              <label
                                className="form-check-label text-black"
                                htmlFor="remember-me"
                              >
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <div className="col text-end fn">
                            <a
                              sx={{
                                // color: "black !important",
                                fontSize: "12px !important",
                              }}
                              onClick={() => {
                                setLoginPageView(false);
                                setForgotPageView(true);
                              }}
                            >
                              <label className="form-check-label text-[#60b6fc] cursor-pointer">
                                Forgot Password ?
                              </label>
                            </a>
                          </div>
                        </div>
                        <div className="d-grid my-2">
                          {/* <button className="btn btn-primary" type="submit">Login</button> */}
                          <Div
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: "4rem",
                              my: "1.5rem",
                            }}
                          >
                            <Button
                              type="submit"
                              disabled={isLoading}
                              sx={{
                                background: isLoading
                                  ? "rgb(150 150 150)"
                                  : "rgb(31 109 175)",
                                width: "100%",
                                padding: "10px",
                                ":hover": {
                                  background: isLoading
                                    ? "rgb(150 150 150)"
                                    : "rgb(71 137 193)",
                                },
                                borderRadius: "5px !important",
                              }}
                            >
                              {isLoading ? (
                                <CircularProgress
                                  size={24}
                                  sx={{ color: "white" }}
                                />
                              ) : (
                                <Typography
                                  sx={[
                                    {
                                      fontSize: "15px !important",
                                      color: "white !important",
                                    },
                                  ]}
                                >
                                  Login
                                </Typography>
                              )}
                            </Button>
                          </Div>

                          {/* --- OTP Submit Button COMMENTED OUT ---
                        <Div
                          sx={{
                            display: showOtpBox === true ? "block" : "none",
                            justifyContent: "center",
                            mt: "4rem",
                            my: "1.5rem",
                          }}
                        >
                          <Div
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {isOtpLoading ? (
                              <Skeleton
                                animation="wave"
                                variant="rectangular"
                                width="100%"
                                height={48}
                                sx={{
                                  borderRadius: "5px",
                                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                                }}
                              />
                            ) : (
                              <Button
                                type="button"
                                onClick={validateOtp}
                                disabled={isLoading}
                                sx={{
                                  background: isLoading
                                    ? "rgb(150 150 150)"
                                    : "rgb(31 109 175)",
                                  width: "100%",
                                  padding: "10px",
                                  ":hover": {
                                    background: isLoading
                                      ? "rgb(150 150 150)"
                                      : "rgb(71 137 193)",
                                  },
                                  borderRadius: "5px !important",
                                }}
                              >
                                {isLoading ? (
                                  <CircularProgress
                                    size={24}
                                    sx={{ color: "white" }}
                                  />
                                ) : (
                                  <Typography
                                    sx={[
                                      {
                                        fontSize: "15px !important",
                                        color: "white !important",
                                      },
                                    ]}
                                  >
                                    Submit
                                  </Typography>
                                )}
                              </Button>
                            )}
                          </Div>
                        </Div>
                        --- END OTP Submit Button --- */}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Login;
