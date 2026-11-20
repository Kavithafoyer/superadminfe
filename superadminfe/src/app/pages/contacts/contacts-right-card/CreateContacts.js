import {
  Autocomplete,
  Box,
  Container,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  DisplayFlex,
  dialogTitle,
  input_label,
} from "app/pages/widgets/CRMStyles";
import {
  AvatarCircle,
  Cancelbutton,
  CustomButton,
  Customgrid,
  DialogBox,
  Div,
} from "app/pages/widgets/StylesComponents";
import { City, Country, State } from "country-state-city";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchTransactionSeries } from "../../widgets/StylesComponents";

const CreateContacts = ({
  leadindustry,
  setShowAllContacts,
  setOpen,
  onsubmit,
}) => {
  const [contactNo, setContactNo] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mail, setMail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [colors, setColors] = useState(["#f4a4d1", "#ddda1f"]);
  const [showAddCancel, setShowAddCancel] = useState(false);
  const [showUploadCancel, setShowUploadCancel] = useState(false);
  const [deleteDatas, setDeleteDatas] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedCity1, setSelectedCity1] = useState("");

  const [errors, setErrors] = useState({});
  const [seriesValue, setSeriesValue] = useState("");

  const validate = () => {
    let error = {};

    if (Boolean(seriesValue !== "Automatic") && !Boolean(contactNo)) {
      error.ContactId = "Contact Id is required";
    } else if (
      Boolean(seriesValue !== "Automatic") &&
      !Boolean(contactNo?.length == 11)
    ) {
      error.ContactId = "Contact Id must be 11 digits.";
    }
    if (!Boolean(name)) {
      error.name = "Name is required";
    }
    if (!Boolean(mail)) {
      error.mail = "Mail is required";
    }
    if (!Boolean(mobilenumber)) {
      error.mobilenumber = "Mobile Number is required";
    } else if (!/^[0-9]{9,15}$/.test(mobilenumber)) {
      error.mobilenumber = "Mobile Number must be between 9 to 15 digits";
    }
    if (!Boolean(selectedCity1)) {
      error.selectedCity1 = "City is required";
    }
    if (!Boolean(selectedCountry1)) {
      error.selectedCountry1 = "Country is required";
    }
    if (!Boolean(selectedState1)) {
      error.selectedState1 = "State is required";
    }
    if (!Boolean(industry)) {
      error.industry = "Industry is required";
    }

    return error;
  };

  const onsubmited = async (e) => {
    e.preventDefault();
    let validForm = validate();
    setErrors(validForm);

    if (!Boolean(Object.keys(errors)?.length === 0))
      return console.log("Please fill the required fields.");

    const payload = {
      Contact_Id: seriesValue === "Manual" && contactNo,
      Name: name,
      Company_Name: orgname,
      MobileCountry_Id: code,
      Mobile_Number: mobilenumber,
      Email_Id: mail,
      Country: selectedCountry1,
      State: selectedState1,
      City: selectedCity1,
      Industry_Type: industry,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    await onsubmit(payload);
  };

  useEffect(async () => {
    const series = await fetchTransactionSeries("Contact");
    console.log("series", series);
    setSeriesValue(series);
  }, []);

  const cancelFunc = () => {
    if (
      Boolean(name?.trim()) ||
      Boolean(code) ||
      Boolean(mail?.trim()) ||
      Boolean(mobilenumber) ||
      Boolean(selectedCountry1) ||
      Boolean(selectedState1) ||
      Boolean(industry?.trim()) ||
      Boolean(selectedCity1)
    ) {
      setOpen("Edit");
    } else {
      setShowAllContacts(false);
    }
  };

  return (
    <>
      <DialogContent>
        <form onSubmit={(e) => onsubmited(e)}>
          <Box mt={2}>
            <Customgrid>
              <Grid item>
                <Typography sx={[input_label]}>
                  Contact Id{" "}
                  <span className="required">
                    {seriesValue == "Automatic" ? "" : "*"}
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Div>
                  <TextField
                    className={`col-12 input-box2 ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    id="outlined-basic"
                    placeholder="# Contact Id"
                    variant="outlined"
                    disabled={seriesValue == "Automatic" ? true : ""}
                  />
                  <Div style={{ color: "red" }}>{errors?.ContactId}</Div>
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>
                  Contact Name <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Div>
                  <TextField
                    className={`col-12 input-box2 ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    id="outlined-basic"
                    placeholder="Enter your name"
                    variant="outlined"
                  />
                  <Div style={{ color: "red" }}>{errors?.name}</Div>
                </Div>
              </Grid>

              <Grid item>
                <Typography mb={0.1} sx={[input_label]}>
                  Country <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Autocomplete
                  className="search-select3"
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.name) {
                      return option?.name;
                    }
                    return "";
                  }}
                  options={Country.getAllCountries() || []}
                  value={selectedCountry1}
                  onChange={(e, newValue) => {
                    // setValue("selectedCountry1", newValue?.name);
                    console.log("newValue", newValue);
                    setSelectedCountry(newValue);
                    setSelectedCountry1(newValue?.name);
                    setCode(newValue?.phonecode);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Country" />
                  )}
                />

                <Div style={{ color: "red" }}>{errors?.selectedCountry1}</Div>
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  State <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Autocomplete
                  className="search-select3"
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.name) {
                      return option?.name;
                    }
                    return "";
                  }}
                  value={selectedState1}
                  options={
                    State.getStatesOfCountry(selectedCountry?.isoCode) || []
                  }
                  onChange={(e, newValue) => {
                    console.log("newValue", newValue);
                    setSelectedState(newValue);
                    // setValue("selectedState1", newValue?.name);
                    setSelectedState1(newValue?.name);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.name === value || value === ""
                  }
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="State" />
                  )}
                />
                <Div style={{ color: "red" }}>{errors?.selectedState1}</Div>
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  City <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Autocomplete
                  className="col-12 search-select3"
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.name) {
                      return option?.name;
                    }
                    return "";
                  }}
                  options={
                    City.getCitiesOfState(
                      selectedState?.countryCode,
                      selectedState?.isoCode
                    ) || []
                  }
                  value={selectedCity1}
                  onChange={(e, newValue) => {
                    // setValue("selectedCity1", newValue?.name);
                    console.log("newValue", newValue);
                    setSelectedCity(newValue);
                    setSelectedCity1(newValue?.name);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="City" />
                  )}
                />
                <Div style={{ color: "red" }}>{errors?.selectedCity1}</Div>
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  Mobile Number <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Div sx={[DisplayFlex]}>
                  <TextField
                    name="code"
                    className={`col-2 input-box2 ${
                      errors.code ? "is-invalid" : ""
                    }`}
                    sx={{ width: "100px" }}
                    value={code}
                    placeholder="code"
                    autoFocus={code === ""}
                  />

                  <TextField
                    className={` input-box2  ${
                      errors.mobilenumber ? "is-invalid" : ""
                    }`}
                    sx={{ width: "100%" }}
                    type="number"
                    min="0"
                    id="outlined-basic"
                    onChange={(e) => {
                      setMobilenumber(e.target.value);
                    }}
                    placeholder="Enter Mobile Number"
                    variant="outlined"
                    autoFocus={mobilenumber === ""}
                  />
                </Div>
                <Div style={{ color: "red" }}>{errors?.mobilenumber}</Div>
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  E-mail <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  className={`col-12 input-box2  ${
                    errors.mail ? "is-invalid" : ""
                  }`}
                  id="outlined-basic"
                  onChange={(e) => {
                    setMail(e.target.value);
                  }}
                  placeholder="Enter Mail Id"
                  variant="outlined"
                  autoFocus={mail === ""}
                />
                {!mail ? (
                  <Div style={{ color: "red" }}>{errors?.mail}</Div>
                ) : null}
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  Organization Name <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  className={`col-12 input-box2  ${
                    errors.orgname ? "is-invalid" : ""
                  }`}
                  id="outlined-basic"
                  onChange={(e) => {
                    setOrgname(e.target.value);
                  }}
                  placeholder="Enter Organization Name"
                  variant="outlined"
                  autoFocus={orgname === ""}
                />
                {!orgname ? (
                  <Div style={{ color: "red" }}>{errors?.orgname}</Div>
                ) : null}
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  Industry <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Autocomplete
                  className="col-12 search-select3"
                  id="outlined-basic"
                  variant="outlined"
                  value={industry}
                  options={(leadindustry && leadindustry?.Values) || []}
                  name="industry"
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  onChange={(e, newValue) => {
                    console.log("newValue", newValue);
                    setIndustry(newValue?.value);
                    // setValue("industry", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Industry" />
                  )}
                ></Autocomplete>

                {!industry ? (
                  <Div style={{ color: "red" }}>{errors?.industry}</Div>
                ) : (
                  ""
                )}
              </Grid>
            </Customgrid>

            {/* <Grid container align="center" mt={2} spacing={2} pb={2}>
              <Grid item align="right" xs={6}>
                <CustomButton label="Save" type="submit" Icon="saveIcon" />
              </Grid>
              <Grid item align="left" xs={6}>
                <Cancelbutton onClick={() => setSave(true)} />
              </Grid>
            </Grid> */}
          </Box>
          <DialogActions
            sx={[DisplayFlex, { gap: "10px", justifyContent: "center" }]}
          >
            <CustomButton label="Save" type="submit" Icon="saveIcon" />
            <Cancelbutton label="Cancel" onClick={() => cancelFunc()} />
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

export default CreateContacts;
