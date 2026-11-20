import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
} from "../../widgets/CRMStyles";

const CreateCancelPlan = ({ setCancelPlan, setListCancel, scrollHeight }) => {
  const handleClickBack = () => {
    setCancelPlan(false);
    setListCancel(true);
  };

  const [error, seterrors] = useState({});

  return (
    <>
      <Typography sx={[ComponentHeading]}>Cancel the Plan</Typography>
      <Grid
        container
        className="card"
        spacing={1}
        justifyContent={"center"}
        gap={1}
        mt={2}
      >
        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              Customer Name <span className="required">*</span>
            </Typography>
            <>
              <TextField
                sx={{ width: { xs: "100%", md: "50%" } }}
                className="input-box"
                id="outlined-basic"
                placeholder="Customer name"
                variant="outlined"
              />
              {Boolean(error?.customerName) && (
                <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                  <span className="required">*</span>
                  {"Please enter a valid customer name"}
                </Typography>
              )}
            </>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              Domain Name <span className="required">*</span>
            </Typography>
            <>
              <TextField
                sx={{ width: { xs: "100%", md: "50%" } }}
                className="input-box"
                id="outlined-basic"
                placeholder="Dimain Name"
                variant="outlined"
              />
              {Boolean(error?.domainName) && (
                <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                  <span className="required">*</span>
                  {"Please enter a valid domain name"}
                </Typography>
              )}
            </>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              Plan Name <span className="required">*</span>
            </Typography>

            <TextField
              sx={{ width: { xs: "100%", md: "50%" } }}
              className="input-box"
              id="outlined-basic"
              placeholder="Plan Name"
              variant="outlined"
            />
            {Boolean(error?.planName) && (
              <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                <span className="required">*</span>
                {"Please enter a valid Plan name"}
              </Typography>
            )}
          </Div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              No of Users <span className="required">*</span>
            </Typography>

            <>
              <TextField
                sx={{ width: { xs: "100%", md: "50%" } }}
                className="input-box"
                id="outlined-basic"
                placeholder="10"
                variant="outlined"
              />
              {Boolean(error?.noofUser) && (
                <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                  <span className="required">*</span>
                  {"Please enter a valid no of users"}
                </Typography>
              )}
            </>
          </Div>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              Expiry Date <span className="required">*</span>
            </Typography>
            <>
              <TextField
                sx={{ width: { xs: "100%", md: "50%" } }}
                className="input-box"
                id="outlined-basic"
                type="date"
                variant="outlined"
              />
              {Boolean(error?.expireDate) && (
                <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                  <span className="required">*</span>
                  {"Please enter a valid expire Date"}
                </Typography>
              )}
            </>
          </Div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
          <Div
            sx={{
              display: {
                xs: "block",
                md: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography className=" input-label">
              Effective Cancel Date <span className="required">*</span>
            </Typography>

            <>
              <TextField
                sx={{ width: { xs: "100%", md: "50%" } }}
                className="input-box"
                id="outlined-basic"
                type="date"
                variant="outlined"
              />
              {Boolean(error?.effectiveCancelDate) && (
                <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                  <span className="required">*</span>
                  {"Please enter a valid Effective Cancel Date"}
                </Typography>
              )}
            </>
          </Div>
        </Grid>
        <Grid item xs={12} mt={2} mb={2}>
          <Div sx={[DisplayFlex, { justifyContent: "center" }]}>
            <Button
              sx={[DialogBoxCancelButton, ButtonStyle, FontStyle]}
              onClick={handleClickBack}
            >
              Cancel
            </Button>
            <Button sx={[DialogBoxSaveButton, ButtonStyle, FontStyle]}>
              Save
            </Button>
          </Div>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateCancelPlan;
