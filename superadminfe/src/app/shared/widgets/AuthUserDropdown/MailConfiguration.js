import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import Div from "@jumbo/shared/Div";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast } from "react-toastify";
import { MdEdit, MdEmail, MdVpnKey, MdDns, MdSettingsInputComponent } from "react-icons/md";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";

const MailConfiguration = ({ open, setOpen }) => {
  const token = localStorage.getItem("accesstoken");
  const userId = localStorage.getItem("UserId");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      db: localStorage.getItem("DBName"),
    },
  };

  const [showPassword, setShowPassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [id, setId] = useState("");
  const [mailId, setMailId] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [imapHost, setImapHost] = useState("");
  const [imapPort, setImapPort] = useState("");

  const fetchMailConfig = async () => {
    if (userId) {
      await axios
        .get(
          `${BASE_URL}/superadmin/UserMailConfigurationCRUD/?User_Id=${userId}`,
          header
        )
        .then((res) => {
          if (res.data?.id) {
            setId(res.data.id);
            setMailId(res.data.MailId);
            setMailPassword(res.data.MailPassword);
            setSmtpHost(res.data.SMTPHost);
            setSmtpPort(res.data.SMTPPort);
            setImapHost(res.data.IMAPHost);
            setImapPort(res.data.IMAPPort);
            setIsEdit(false);
          } else {
            setIsEdit(true);
          }
        })
        .catch((error) => {
          console.log(error);
          setIsEdit(true);
        });
    }
  };

  useEffect(() => {
    if (open) {
      fetchMailConfig();
    }
  }, [open]);

  const handleSubmitMailConfigure = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      SMTPHost: smtpHost,
      SMTPPort: smtpPort,
      IMAPHost: imapHost,
      IMAPPort: imapPort,
      MailId: mailId,
      MailPassword: mailPassword,
      User_Id: parseInt(userId || 0),
      Organization_Id: parseInt(localStorage.getItem("OrganizationId") || 0),
      Created_By: parseInt(userId || 0),
      Updated_By: parseInt(userId || 0),
    };

    const request = id
      ? axios.put(`${BASE_URL}/superadmin/UserMailConfigurationCRUD/`, { ...payload, id }, header)
      : axios.post(`${BASE_URL}/superadmin/UserMailConfigurationCRUD/`, payload, header);

    request
      .then((res) => {
        if (res.status === 200 && res.data?.id) {
          toast.success(id ? "Mail Configuration Updated" : "Mail Configured Successfully");
          setIsEdit(false);
          fetchMailConfig();
        }
      })
      .catch((error) => {
        toast.error("Failed to save mail configuration");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const DetailRow = ({ icon: Icon, label, value, isPassword }) => (
    <Box display="flex" alignItems="center" mb={2} sx={{ p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
      <Icon style={{ marginRight: 16, color: '#43917A', fontSize: 24 }} />
      <Box flex={1}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {isPassword ? '•'.repeat(mailPassword.length) : (value || '-')}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <Div sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: "#43917A", m: 0 }}>
            Mail Configuration
          </Typography>
          {!isEdit && id && (
            <IconButton color="primary" onClick={() => setIsEdit(true)} sx={{ bgcolor: 'rgba(67, 145, 122, 0.1)' }}>
              <MdEdit />
            </IconButton>
          )}
        </Box>

        {isEdit ? (
          <form onSubmit={handleSubmitMailConfigure}>
            <DialogContent sx={{ p: 0 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography className="input-label">Mail Id <span className="required">*</span></Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    value={mailId}
                    onChange={(e) => setMailId(e.target.value)}
                    placeholder="Enter Your Mail Id"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className="input-label">Mail Password <span className="required">*</span></Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    type={showPassword ? "text" : "password"}
                    value={mailPassword}
                    onChange={(e) => setMailPassword(e.target.value)}
                    placeholder="Enter Your Mail Password"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography className="input-label">SMTP Host</Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="e.g. smtp.gmail.com"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography className="input-label">SMTP Port</Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="e.g. 587"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography className="input-label">IMAP Host</Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    value={imapHost}
                    onChange={(e) => setImapHost(e.target.value)}
                    placeholder="e.g. imap.gmail.com"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography className="input-label">IMAP Port</Typography>
                  <TextField
                    fullWidth
                    className="input-box2"
                    value={imapPort}
                    onChange={(e) => setImapPort(e.target.value)}
                    placeholder="e.g. 993"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <CustomButton label={id ? "Update" : "Save"} type="submit" Icon="saveIcon" loading={loading} />
              <Cancelbutton label="Cancel" onClick={() => id ? setIsEdit(false) : setOpen(false)} />
            </DialogActions>
          </form>
        ) : (
          <Box>
            <DetailRow icon={MdEmail} label="Registered Mail ID" value={mailId} />
            <DetailRow icon={MdVpnKey} label="Password" value={mailPassword} isPassword />
            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DetailRow icon={MdDns} label="SMTP Host" value={smtpHost} />
              </Grid>
              <Grid item xs={6}>
                <DetailRow icon={MdSettingsInputComponent} label="SMTP Port" value={smtpPort} />
              </Grid>
              <Grid item xs={6}>
                <DetailRow icon={MdDns} label="IMAP Host" value={imapHost} />
              </Grid>
              <Grid item xs={6}>
                <DetailRow icon={MdSettingsInputComponent} label="IMAP Port" value={imapPort} />
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="center" mt={3}>
              <Button 
                variant="outlined" 
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 2, px: 4, color: '#43917A', borderColor: '#43917A' }}
              >
                Close Overview
              </Button>
            </Box>
          </Box>
        )}
      </Div>
    </Dialog>
  );
};

export default MailConfiguration;
