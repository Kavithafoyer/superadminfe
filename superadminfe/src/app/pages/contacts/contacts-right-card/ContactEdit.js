
import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect } from "react";
import * as yup from "yup";
import { useState } from "react";
import { Country, State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "app/services/auth-services";
import {
  CRMTableHead,
  DisplayFlex,
  FontStyle,
  dialogTitle,
  dialogheading,
  input_label,
} from "app/pages/widgets/CRMStyles";
import moment from "moment";
import {
  Cancelbutton,
  DialogBox,
  CustomButton,
  SaveButton,
  Customgrid,
} from "app/pages/widgets/StylesComponents";
import { useQuery, useQueryClient } from "react-query";
import Div from "@jumbo/shared/Div";

const contacts = [
  {
    industry_type: "Product Bsaed",
  },
  {
    industry_type: "Service Bsaed",
  },
];

const ContactEdit = ({
  getContactsListsRefetch,
  setShowAllContacts,
  update,
  setOpen,
}) => {
  // Edit Functionality
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const item = "crmuseradmin1";

  const [name1, setName1] = useState(update.Name);
  const [code1, setCode1] = useState(update.MobileCountry_Id);
  const [mail1, setMail1] = useState(update.Email_Id);
  const [orgname1, setOrgname1] = useState(update.Company_Name);
  const [selectedCountry1, setSelectedCountry1] = useState(update.Country);
  const [selectedState1, setSelectedState1] = useState(update.State);
  const [industry1, setIndustry1] = useState(update.Industry_Type);
  const [mobilenumber1, setMobilenumber1] = useState(update.Mobile_Number);
  const [selectedCity1, setSelectedCity1] = useState(update.City);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setName1(update.Name);
      setCode1(update.MobileCountry_Id);
      setMail1(update.Email_Id);
      setOrgname1(update.Company_Name);
      setSelectedCountry1(update.Country);
      setSelectedState1(update.State);
      setIndustry1(update.Industry_Type);
      setMobilenumber1(update.Mobile_Number);
      setSelectedCity1(update.City);
    }, 2000);
  }, [update]);

  const [number, setNumber] = useState(1);
  const [check, setCheck] = useState(true);
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [check3, setCheck3] = useState(true);
  const [check4, setCheck4] = useState(true);

  const validationSchema1 = yup.object({
    name1: yup.string().required("Name is required"),
    mail1: yup.string().required("Mail is required"),
    mobilenumber1: yup.string().required("Mobile Number is Required"),
    orgname1: yup.string().required("Organization Name is required"),
    // selectedCountry1: yup.string().required("Country is required"),
    // selectedState1: yup.string().required("State is required"),
    // industry1: yup.string().required("Industry is required"),
  });

  const {
    reset: reset1,
    register: register1,
    handleSubmit: handleSubmit1,
    formState: { errors: errors1 },
  } = useForm({
    resolver: yupResolver(validationSchema1),
  });

  const onsubmit1 = () => {
    console.log("update");
    console.log("update", moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"));
    var payload = {
      id: update.id,
      Contact_Id: update.Contact_Id,
      Name: name1,
      Company_Name: update.Company_Name,
      MobileCountry_Id: code1,
      Mobile_Number: mobilenumber1,
      Email_Id: mail1,
      Country: selectedCountry1,
      State: selectedState1,
      City: selectedCity1,
      Industry_Type: industry1,
      Archive: false,
      Is_Deleted: false,
      Created_Date: update.Created_Date,
      Updated_Date: moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSZ"),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };
    console.log("updatepayload", payload);
    axios
      .put(`${BASE_URL}/user/ContactCRUD/`, payload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res?.data);
        getContactsListsRefetch();
        toast.success("Updated successfully", {
          position: "top-right",
          autoClose: 100,
        });
        setShowAllContacts("contacts");
        setOpen(false);
        setCheck(true);
        setCheck1(true);
        setCheck2(true);
        setCheck3(true);
        setCheck4(true);
        // For Updateing the History of Changes
        let editUser = localStorage.getItem("Username");
        let histotypayload = {
          Document_Id: res.data.Contact_Id,
          Modified_By: `${editUser} Updated this Contact.`,
          Module_Name: "Contact",
          Contact_Id: update.id,
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        console.log("histotypayload", histotypayload);
        axios
          .post(`${BASE_URL}/user/Updaterecordscrud/`, histotypayload, header)
          .then((res) => {
            console.log("Result", res.data);
          })
          .catch((res) => {
            console.log(res.message);
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 100,
          });
        }
      });
  };

  //For Child Dailog
  const [save, setSave] = useState(false);

  const [leadindustry, setLeadindustry] = useState([]);

  const getlookupData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/Userlookuplist/`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("check", response.data);
      console.log(
        "check1",
        response?.data?.find((op) => op?.Lookupname === "Industry Type")
      );
      // setLeadindustry(response?.data?.find((op) => op?.Lookupname === "Industry Type") || []);
      return response?.data;
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  const {
    data: getUserLoopUp,
    isLoading: getUserLoopUpLoading,
    isError: getUserLoopUpError,
    refetch: getUserLoopUpRefetch,
  } = useQuery(["getUserLoopUpLists"], getlookupData, { staleTime: Infinity });

  useEffect(() => {
    if (getUserLoopUp) {
      setLeadindustry(
        getUserLoopUp?.find((op) => op?.Lookupname === "Industry Type") || []
      );
    }
  }, [getUserLoopUp]);

  const cancelFunc = () => {
    if (
      name1 === update?.Name &&
      code1 === update?.MobileCountry_Id &&
      mail1 === update?.Email_Id &&
      orgname1 === update?.Company_Name &&
      selectedCountry1 === update?.Country &&
      selectedState1 === update?.State &&
      industry1 === update?.Industry_Type &&
      mobilenumber1 === update?.Mobile_Number &&
      selectedCity1 === update?.City
    ) {
      setShowAllContacts(false);
    } else {
      setOpen("Edit");
    }
  };

  return (
    <>
      <DialogContent>
        <form onSubmit={handleSubmit1(onsubmit1)}>
          <Box mt={1}>
            <Customgrid>
              <Grid item>
                <Typography sx={[input_label]}>Contact Id</Typography>
              </Grid>
              <Grid item>
                <TextField
                  className={`col-12 input-box2`}
                  value={update?.Contact_Id}
                  id="outlined-basic"
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>
                  Contact Name <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  {...register1("name1")}
                  className={`col-12 input-box2  ${errors1.name1 ? "is-invalid" : ""
                    }`}
                  onChange={(e) => {
                    setName1(e.target.value);
                  }}
                  value={name1}
                  id="outlined-basic"
                  placeholder="Enter your name"
                  variant="outlined"
                />
                {!name1 ? (
                  <Div style={{ color: "red" }}>{errors1.name1?.message}</Div>
                ) : null}
              </Grid>

              <Grid item>
                <Typography
                  //   id="Typography-root"
                  mb={0.1}
                  sx={[input_label]}
                >
                  Country <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item>
                <Autocomplete
                  className="search-select3"
                  {...register1("selectedCountry1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.name) {
                      return option?.name;
                    }
                    return "";
                  }}
                  options={Country.getAllCountries()}
                  value={selectedCountry1}
                  onChange={(e, newValue) => {
                    // setValue1("selectedCountry1", newValue?.name);
                    console.log("newValue", newValue);
                    setSelectedCountry(newValue);
                    setSelectedCountry1(newValue?.name);
                    setCode1(newValue?.phonecode);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Country" />
                  )}
                />

                {!selectedCountry1 ? (
                  <Div style={{ color: "red" }}>
                    {errors1.selectedCountry1?.message}
                  </Div>
                ) : null}
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
                  {...register1("selectedState1")}
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
                  options={State.getStatesOfCountry(selectedCountry?.isoCode)}
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
                {!selectedState1 ? (
                  <Div style={{ color: "red" }}>{selectedState1?.message}</Div>
                ) : null}
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
                  className="search-select3"
                  {...register1("selectedCity1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.name) {
                      return option?.name;
                    }
                    return "";
                  }}
                  options={City.getCitiesOfState(
                    selectedState?.countryCode,
                    selectedState?.isoCode
                  )}
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
                {!selectedCity1 ? (
                  <Div style={{ color: "red" }}>
                    {errors1.selectedCity1?.message}
                  </Div>
                ) : null}
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
                    //  defaultValue={Country.getAllCountries().find((op)=>op.phonecode===code1)}
                    {...register1("code1")}
                    className={`input-box2 ${errors1.code1 ? "is-invalid" : ""
                      }`}
                    sx={{ width: "70px" }}
                    value={code1}
                  />

                  <TextField
                    {...register1("mobilenumber1")}
                    type="number"
                    sx={[FontStyle, { width: "100%" }]}
                    className={` input-box2  ${errors1.mobilenumber1 ? "is-invalid" : ""
                      }`}
                    onChange={(e) => {
                      setMobilenumber1(e.target.value);
                    }}
                    value={mobilenumber1}
                    id="outlined-basic"
                    variant="outlined"
                  />
                </Div>
                {!mobilenumber1 ? (
                  <Div style={{ color: "red" }}>
                    {errors1.mobilenumber1?.message}
                  </Div>
                ) : null}
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
                  {...register1("mail1")}
                  className={`col-12 input-box2  ${errors1.mail1 ? "is-invalid" : ""
                    }`}
                  onChange={(e) => {
                    setMail1(e.target.value);
                  }}
                  value={mail1}
                  sx={[FontStyle]}
                  id="outlined-basic"
                  placeholder="Enter Mail Id"
                  variant="outlined"
                />
                {!mail1 ? (
                  <Div style={{ color: "red" }}>{errors1.mail1?.message}</Div>
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
                  {...register1("orgname1")}
                  className={`col-12 input-box2  ${errors1.orgname1 ? "is-invalid" : ""
                    }`}
                  value={orgname1}
                  sx={[FontStyle]}
                  onChange={(e) => {
                    setOrgname1(e.target.value);
                  }}
                  id="outlined-basic"
                  placeholder="Enter Organization Name"
                  variant="outlined"
                />
                {!orgname1 ? (
                  <Div style={{ color: "red" }}>
                    {errors1.orgname1?.message}
                  </Div>
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
                  className="search-select3"
                  {...register1("industry1")}
                  id="outlined-basic"
                  variant="outlined"
                  value={industry1}
                  options={(leadindustry && leadindustry?.Values) || []}
                  name="industry1"
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
                    setIndustry1(newValue?.value);
                    // setValue("industry", newValue?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={[FontStyle]}
                      placeholder="Industry"
                    />
                  )}
                ></Autocomplete>

                {!industry1 ? (
                  <Div style={{ color: "red" }}>
                    {errors1.industry1?.message}
                  </Div>
                ) : null}
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
            <CustomButton label="Update" type="submit" Icon="saveIcon" />
            <Cancelbutton
              label="Cancel"
              onClick={() => {
                cancelFunc();
              }}
            />
          </DialogActions>
        </form>
      </DialogContent>
    </>
  );
};

export default ContactEdit;
