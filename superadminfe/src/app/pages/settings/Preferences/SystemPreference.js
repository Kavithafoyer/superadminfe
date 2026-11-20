import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Box,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FontStyle } from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CRMDateField,
  CustomButton,
} from "app/pages/widgets/StylesComponents";
import { BASE_URL } from "app/services/auth-services";

const manufacturer = [
  { label: 1, format: "yyyy-mm-dd" },
  { label: 2, format: "mm-dd-yyyy" },
  { label: 3, format: "dd-mm-yyyy" },
];

const loginValidityTypes = [
  { label: "Date", value: "DATE" },
  { label: "Days", value: "DAYS" },
];

const SystemPreference = () => {
  const [date, setdate] = useState("");
  const [passExpiry, setPassExpiry] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("Default@123");
  const [resetPassword, setResetPassword] = useState(false);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [loginValidityType, setLoginValidityType] = useState("DATE");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [lockAfterFailedAttempts, setLockAfterFailedAttempts] = useState(5);
  const [hideNegativeSentiment, setHideNegativeSentiment] = useState(false);
  const [hideInactiveLeads, setHideInactiveLeads] = useState(false);
  const [hideInactiveUsers, setHideInactiveUsers] = useState(false);

  const [id, setid] = useState("");
  const [newuser, setnewuser] = useState(true);

  const OrganizationId = parseInt(localStorage.getItem("OrganizationId"));
  const UserId = parseInt(localStorage.getItem("UserId"));

  const handleSubmit = (e) => {
    e.preventDefault();

    let payload = {
      Organization_Id: OrganizationId,
      DateFormat: date,
      Password: defaultPassword,
      ResetPassword: resetPassword,
      ForcePasswordChange: forcePasswordChange,
      PasswordExpiryDays: parseInt(passExpiry) || 0,
      LoginValidityType: loginValidityType,
      ValidFrom: validFrom && validFrom !== "[object Object]" ? validFrom : null,
      ValidTo: validTo && validTo !== "[object Object]" ? validTo : null,
      LockAfterFailedAttempts: parseInt(lockAfterFailedAttempts) || 0,
      hide_display_negative_sentiment: hideNegativeSentiment,
      hide_display_inactive_leads: hideInactiveLeads,
      hide_display_inactive_users: hideInactiveUsers,
      Created_By: UserId,
      Updated_By: UserId,
    };

    if (id) {
      payload.id = id;
      axios
        .put(`${BASE_URL}/useradmin/SystemPreferenceCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((response) => {
          if (response?.data?.id) {
            toast.success("Updated Successfully");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to update preferences");
        });
    } else {
      axios
        .post(`${BASE_URL}/useradmin/SystemPreferenceCRUD/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((response) => {
          if (response.data) {
            setid(response.data.id);
            setnewuser(false);
            toast.success("Created Successfully.");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to create preferences");
        });
    }
  };

  const SystemPreferancerecords = async () => {
    // Note: We use the OrganizationId to fetch the preferences for this organization.
    // The previous code had id=3 hardcoded, which might be a placeholder or a specific instance.
    // We should ideally fetch by Organization_Id if the API supports it, but here we follow the existing pattern.
    await axios
      .get(`${BASE_URL}/useradmin/SystemPreferenceCRUD/?id=${OrganizationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        if (response?.data && response.data.length > 0) {
          const data = response.data[0];
          setdate(data.DateFormat);
          setPassExpiry(data.PasswordExpiryDays);
          setDefaultPassword(data.Password);
          setResetPassword(data.ResetPassword);
          setForcePasswordChange(data.ForcePasswordChange);
          setLoginValidityType(data.LoginValidityType);
          setValidFrom(typeof data.ValidFrom === 'string' && data.ValidFrom !== "[object Object]" ? data.ValidFrom : "");
          setValidTo(typeof data.ValidTo === 'string' && data.ValidTo !== "[object Object]" ? data.ValidTo : "");
          setLockAfterFailedAttempts(data.LockAfterFailedAttempts);
          setHideNegativeSentiment(data.hide_display_negative_sentiment);
          setHideInactiveLeads(data.hide_display_inactive_leads);
          setHideInactiveUsers(data.hide_display_inactive_users);
          setid(data.id);
          setnewuser(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    SystemPreferancerecords();
  }, []);

  return (
    <>
      <JumboContentLayoutMain>
        <Typography sx={[{ fontSize: "20px", fontWeight: 600, mb: 1 }]}>
          Settings
        </Typography>
        <Typography sx={[{ fontSize: "18px", fontWeight: 600, mb: 3 }]}>
          System Preferences
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ minHeight: "60vh" }}>
            <Grid container spacing={3}>
              {/* General Settings Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  General Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>
                  Date Format <span className="required"> * </span>
                </Typography>
                <Autocomplete
                  className="search-select3"
                  options={manufacturer}
                  getOptionLabel={(option) => option?.format || ""}
                  value={
                    manufacturer.find((item) => item.format === date) || null
                  }
                  onChange={(e, newValue) => {
                    setdate(newValue?.format || "");
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Date Format" />
                  )}
                />
              </Grid>

              {/* Password Policy Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Password Policy
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>
                  Default Password
                </Typography>
                <TextField
                  className="col-12 input-box2"
                  value={defaultPassword}
                  placeholder="Default Password"
                  onChange={(e) => setDefaultPassword(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>
                  Password Expiry Days
                </Typography>
                <TextField
                  className="col-12 input-box2"
                  type="number"
                  value={passExpiry}
                  placeholder="Expiry Days"
                  onChange={(e) => setPassExpiry(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>
                  Lock After Failed Attempts
                </Typography>
                <TextField
                  className="col-12 input-box2"
                  type="number"
                  value={lockAfterFailedAttempts}
                  placeholder="Attempts"
                  onChange={(e) => setLockAfterFailedAttempts(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={resetPassword}
                      onChange={(e) => setResetPassword(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={[FontStyle]}>Reset Password</Typography>
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={forcePasswordChange}
                      onChange={(e) => setForcePasswordChange(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={[FontStyle]}>
                      Force Password Change
                    </Typography>
                  }
                />
              </Grid>

              {/* Login Validity Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Login Validity
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>
                  Login Validity Type
                </Typography>
                <Autocomplete
                  className="search-select3"
                  options={loginValidityTypes}
                  getOptionLabel={(option) => option?.label || ""}
                  value={
                    loginValidityTypes.find(
                      (item) => item.value === loginValidityType,
                    ) || null
                  }
                  onChange={(e, newValue) => {
                    setLoginValidityType(newValue?.value || "DATE");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Validity Type"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>Valid From</Typography>
                <CRMDateField
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={[FontStyle, { mb: 1 }]}>Valid To</Typography>
                <CRMDateField
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                />
              </Grid>

              {/* Display Preferences Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Display Preferences
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hideNegativeSentiment}
                      onChange={(e) =>
                        setHideNegativeSentiment(e.target.checked)
                      }
                    />
                  }
                  label={
                    <Typography sx={[FontStyle]}>
                      Hide Negative Sentiment
                    </Typography>
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hideInactiveLeads}
                      onChange={(e) => setHideInactiveLeads(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={[FontStyle]}>
                      Hide Inactive Leads
                    </Typography>
                  }
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={hideInactiveUsers}
                      onChange={(e) => setHideInactiveUsers(e.target.checked)}
                    />
                  }
                  label={
                    <Typography sx={[FontStyle]}>
                      Hide Inactive Users
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <Div sx={{ mt: 5, display: "flex", gap: 2 }}>
            <CustomButton
              label={newuser ? "Save" : "Update"}
              type="submit"
              Icon="saveIcon"
            />
            <Cancelbutton label="Cancel" onClick={() => window.history.back()} />
          </Div>
        </form>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default SystemPreference;
