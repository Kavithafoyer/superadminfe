import Div from "@jumbo/shared/Div";
import "./Setting.css";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import Setting from "./Setting";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { useTheme } from "@mui/material";
import styled from "@emotion/styled";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
}));

const partners = [
  { name: "Ravindra Auto Spares & Services" },
  { name: "Kathir Auto Spares & Services" },
  { name: "Magesh Auto Spares & Services" },
  { name: "Dinesh Auto Spares & Services" },
];

const GeneralSettings = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [check, setCheck] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  const [check5, setCheck5] = useState(false);
  const [check6, setCheck6] = useState(false);

  const handleChange = (e) => {
    setCheck(e.target.checked);
  };

  const handleChange1 = (e) => {
    setCheck1(e.target.checked);
  };

  const handleChange2 = (e) => {
    setCheck2(e.target.checked);
  };

  const handleChange3 = (e) => {
    setCheck3(e.target.checked);
  };

  const handleChange4 = (e) => {
    setCheck4(e.target.checked);
  };

  const handleChange5 = (e) => {
    setCheck5(e.target.checked);
  };

  const handleChange6 = (e) => {
    setCheck6(e.target.checked);
  };

  const [openBox, setOpenBox] = useState(false);
  const [state, setState] = useState({
    openSave: false,
    openCancel: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, openSave } = state;

  const handleClickSave = (newState) => () => {
    setState({ openSave: true, ...newState });
  };

  const handleClickCancel = (newState) => () => {
    setState({ openCancel: true, ...newState });
    setOpenBox(true);
  };

  const handleClose = () => {
    setState({ ...state, openSave: false });
    setOpenBox(false);
  };

  return (
    <>
      {/* General settings code */}
      <JumboContentLayoutMain>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          General
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Select the modules you are going to enable for partners
        </Typography>
        <Typography variant="h3" sx={{ pt: 2, fontWeight: 600 }}>
          Enable modules for partners
        </Typography>

        <Grid container columns={12}>
          <Grid item xs={12} md={12} className="row" sx={{ mt: 1 }}>
            <Typography className="col-md-3 input-label" sx={{ mt: 2 }}>
              Select a Partner <span className="required">*</span>
            </Typography>
            <FormControl className="col-md-6">
              <Autocomplete
                disablePortal
                className="search-select"
                getOptionLabel={(option) => option.name}
                options={partners}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Partner Name" />
                )}
              />
            </FormControl>
            <Div className="col-md-3"></Div>
          </Grid>
          <Grid item xs={12} sm={12} lg={3} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={<Checkbox name="Request" size="small" />}
                label="Requests"
                checked={check}
                onChange={handleChange}
                sx={{ mb: -1 }}
              />
              <FormGroup sx={{ ml: 2 }}>
                <FormControlLabel
                  control={<Checkbox name="Additional License" size="small" />}
                  label="Additional License"
                  checked={check === true && "check1"}
                  onChange={handleChange1}
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Additional Storage" size="small" />}
                  label="Additional Storage"
                  checked={check2}
                  onChange={handleChange2}
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Add on Purchase" size="small" />}
                  label="Add on Purchase"
                  checked={check3}
                  onChange={handleChange3}
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Cancellation Plan" size="small" />}
                  label="Cancellation Plan"
                  checked={check4}
                  onChange={handleChange4}
                  sx={{ mb: -1 }}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} lg={3} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={<Checkbox name="Lookup" size="small" />}
                label="Lookup"
                sx={{ mb: -1 }}
              />
              <FormGroup sx={{ ml: 2 }}>
                <FormControlLabel
                  control={<Checkbox name="Lookup Lists" size="small" />}
                  label="Lookup Lists"
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Create Lookup" size="small" />}
                  label="Create Lookup"
                  sx={{ mb: -1 }}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} lg={3} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormControlLabel
                control={<Checkbox name="Ticket" size="small" />}
                label="Ticket"
                sx={{ mb: -1 }}
              />
              <FormGroup sx={{ ml: 2 }}>
                <FormControlLabel
                  control={<Checkbox name="Ticket Lists" size="small" />}
                  label="Ticket Lists"
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Create Ticket" size="small" />}
                  label="Create Ticket"
                  sx={{ mb: -1 }}
                />
                <FormControlLabel
                  control={<Checkbox name="Ticket Response" size="small" />}
                  label="Ticket Response"
                  sx={{ mb: -1 }}
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Div sx={{ mt: 30 }}>
          <Button
            className="save-buttonuser"
            onClick={handleClickSave({
              vertical: "top",
              horizontal: "right",
            })}
            sx={{
              mr: 3,
            }}
          >
            Save
          </Button>

          <Button
            className="cancel-buttonuser"
            onClick={handleClickCancel({
              vertical: "top",
              horizontal: "right",
            })}
          >
            Cancel
          </Button>
        </Div>

        <Div>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openSave}
            onClose={handleClose}
            key={vertical + horizontal}
          >
            <Alert severity="success" sx={{ mt: 5.5, pr: 15 }}>
              Saved Successfully
            </Alert>
          </Snackbar>
          <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            open={openBox}
            fullScreen={fullScreen}
            sx={{
              ml: { sm: 0, md: 10 },
              mr: { sm: 0, md: 10 },
            }}
          >
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#000000",
                  letterSpacing: 0.5,
                }}
              >
                You have done some changes. Onclicking the cancel button changed
                data will not be saved. Still you want to cancel the changes?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleClose}
                className="save-buttonuser"
                autoFocus
                sx={{
                  mr: 3,
                }}
              >
                Yes
              </Button>

              <Button onClick={handleClose} className="cancel-buttonuser">
                No
              </Button>
            </DialogActions>
          </BootstrapDialog>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default GeneralSettings;
