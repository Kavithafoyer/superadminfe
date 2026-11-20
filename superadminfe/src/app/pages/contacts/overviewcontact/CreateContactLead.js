import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import React, { useEffect } from "react";
import { memo } from "react";
import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useQueryClient } from "react-query";

import { Country, State, City } from "country-state-city";
import {
  CRMTableHead,
  dialogFontSize,
  dialogTitle,
  DisplayFlex,
  input_,
  input_label,
  input_labellabel,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  DialogBox,
  CustomButton,
  InvalidateQueryUpdates,
  Dragabledialog,
  Customgrid,
  fetchTransactionSeries
} from "app/pages/widgets/StylesComponents";

const CreateContactLead = ({
  scrollHeight,
  setOpenAddLead,
  openAddLead,
  id,
  datas,
  ReferredList,
}) => {
  //  Initilization For Country,state,city

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [cname, setCname] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [leadtype, setLeadType] = useState("");
  const [selectedCountry1, setSelectedCountry1] = useState("");
  const [leadID, setLeadID] = useState(" ");

  const [selectedState1, setSelectedState1] = useState("");
  const [selectedCity1, setSelectedCity1] = useState("");
  const [areaname, setAreaName] = useState("");
  const [strname, setStrname] = useState("");
  const [email, setEmail] = useState("");
  const [BuildingNo, setBuildingNo] = useState("");
  const [des, setDes] = useState("");
  const [turnover, setTurnOver] = useState("");
  const [noofemployee, setNoofEmployee] = useState("");
  const [location, setLocation] = useState("");
  const [leadsource1, setLeadscource1] = useState("");
  const [leadindustry1, setLeadindustry1] = useState("");
  const [jobtitle1, setJobtitle1] = useState("");
  const [leadstatus1, setLeadStatus1] = useState("");
  const [sal, setSal] = useState("");
  const [Decissionmaker, setDecissionmaker] = useState("");
  const [save, setSave] = useState(false);
  const [seriesValue, setSeriesValue] = useState("")

  // For Validation Purpose
  const validationSchema = yup.object().shape({
    fname: yup.string().required("Lead First Name is required"),
    lname: yup.string().required("Lead Last Name is required"),
    cname: yup.string().required("Company Name is Required"),
    phone: yup.string().required("Mobile Number is required"),
    url: yup.string().required("Website  is required"),
    selectedCity1: yup.string().required("City is required"),
    selectedCountry1: yup.string().required("Country is Required"),
    selectedState1: yup.string().required("State is Required"),
    areaname: yup.string().required("Area Name is required"),
    strname: yup.string().required("Street Name is required"),
    email: yup.string().required("Email is required"),
    BuildingNo: yup.string().required("Buildingt Name is required"),
    des: yup.string().required("Description is required"),
    location: yup.string().required("Location is required"),
    leadtype: yup.string().required("Lead Type is Required"),
    Decissionmaker: yup.string().required("Decission is required"),
    jobtitle1: yup.string().required("Job Tittle is Required"),
    leadsource1: yup.string().required("Lead Source is Required"),
    leadindustry1: yup.string().required("Lead Industry is Required"),
    leadstatus1: yup.string().required("Lead Industry is Required"),
    turnover: yup.string().required("Lead Company Turn Over is Required"),
    noofemployee: yup.string().required("Lead No Of Employees is Required"),
  });

  let queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const onsubmit = async () => {
    var updatepayload = {
      ContleadId: seriesValue === "Manual" && leadID,
      Salutation: sal,
      LeadFirstName: fname,
      LeadLastName: lname,
      CompanyName: cname,
      PhoneNo: phone,
      EmailId: email,
      WebsiteURL: url,
      BuildingDoorNo: BuildingNo,
      StreetName: strname,
      AreaName: areaname,
      City: selectedCity1,
      State: selectedState1,
      Country: selectedCountry1,
      LeadSource: leadsource1,
      LeadIndustry: leadindustry1,
      //   "Job_Title": jobtitle1,
      Lead_Status: leadstatus1,
      LeadLocation: location,
      LeadCompanyTurnOver: parseInt(turnover),
      LeadNoOfEmployees: noofemployee,
      Decissionmaker: Decissionmaker,
      LeadDescription: des,
      LeadType: leadtype,
      ContactId: id,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    console.log("payload", updatepayload);

    await axios
      .post(`${BASE_URL}/user/UserLeadfromcontactsCRUD/`, updatepayload, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        console.log("res.data", res.data);
        setOpenAddLead(false);
        ReferredList();
        await queryClient.invalidateQueries("getContactOverviewLists");
        toast.success("Created successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
  };

  const LeadDropdown = [
    "From Contact",
    "From Web",
    "From SocialMedia",
    "From Campaign",
  ];

  const DecisionDropdown = ["Yes", "No"];

  const [jobtitle, setJobtitle] = useState([]);
  const [leadstatus, setLeadStatus] = useState([]);
  const [leadindustry, setLeadindustry] = useState([]);
  const [leadsource, setLeadscource] = useState([]);

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

      // Uncomment the console.log line if you want to log the response data
      setLeadindustry(
        response?.data?.find((op) => op?.Lookupname === "Industry Type") || []
      );
      setLeadStatus(
        response?.data?.find((op) => op?.Lookupname === "Lead Status") || []
      );
      setJobtitle(
        response?.data?.find((op) => op?.Lookupname === "Job Title") || []
      );
      setLeadscource(
        response?.data?.find((op) => op?.Lookupname === "Lead Source") || []
      );
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Handle the error as needed s(e.g., show an error message to the user)
    }
  };

  useEffect(() => {
    getlookupData();
  }, []);

  useEffect(() => {
    setFname(datas?.Name)
    setCname(datas?.Company_Name)
    setSelectedCountry1(datas?.Country)
    setSelectedState1(datas?.State)
    setSelectedCity1(datas?.City)
    setEmail(datas?.Email_Id)
    setLeadindustry1(datas?.Industry_Type)
    setPhone(datas?.Mobile_Number)



  }, [datas])

  useEffect(async () => {
    const series = await fetchTransactionSeries("UserLeadfrom_contacts")
    console.log("useEffect in series:", series)
    setSeriesValue(series)
  }, [])

  return (
    <>
      <Dragabledialog
        maxWidth="xl"
        open={openAddLead}
      // onClose={() => setOpenNotes(false)}
      >
        <DialogTitle
          sx={[DisplayFlex, dialogFontSize]}
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        >
          Create Lead
        </DialogTitle>

        <DialogContent sx={{ m: 2 }}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <Customgrid columnCount={4}>


              <Grid item >
                <Typography sx={[input_label]}>Lead ID <span className="required">{seriesValue == "Automatic" ? "" : "*"}</span></Typography>
              </Grid>

              <Grid item>
                <FormControl className="col-12">
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "5px",
                      },
                      width: "100%",
                    }}
                    value={leadID}
                    onChange={(e) => setLeadID(e.target.value)}
                    className={`col-12 input-box2`}
                    id="outlined-basic"
                    placeholder="# Quotation Id"
                    variant="outlined"
                    disabled={seriesValue === "Automatic"}
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Typography sx={[input_label]}>First Name <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  className={`col-12 input-box2 ${errors.name ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  {...register("fname")}
                  placeholder="Lead First Name"
                  variant="outlined"
                  value={fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.fname?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Last Name <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("lname")}
                  className={`col-12 input-box2 ${errors.lname ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Lead Last Name"
                  variant="outlined"
                  value={lname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.lname?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Company Name <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("cname")}
                  className={`col-12 input-box2 ${errors.cname ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Company Name"
                  value={cname}
                  onChange={(e) => {
                    setCname(e.target.value);
                  }}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.cname?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Country <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("selectedCountry1")}
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
                    setValue("selectedCountry1", newValue?.name);
                    setSelectedCountry(newValue);
                    setSelectedCountry1(newValue?.name);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Country" />
                  )}
                />
                <Div style={{ color: "red" }}>
                  {errors.selectedCountry1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>State <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("selectedState1")}
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
                    setSelectedState(newValue);
                    setValue("selectedState1", newValue?.name);
                    setSelectedState1(newValue?.name);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.name === value || value === ""
                  }
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "5px",
                        // minWidth: "300px ",
                        width: "100%",
                      }}
                      placeholder="State"
                    />
                  )}
                />
                <Div style={{ color: "red" }}>
                  {errors.selectedState1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>City <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("selectedCity1")}
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
                    setValue("selectedCity1", newValue?.name);
                    setSelectedCity(newValue);
                    setSelectedCity1(newValue?.name);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="City" />
                  )}
                />
                <Div style={{ color: "red" }}>
                  {errors.selectedCity1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Email Id <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("email")}
                  className={`col-12 input-box2 ${errors.email ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Email Id"
                  variant="outlined"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.email?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Building door no <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("BuildingNo")}
                  className={`col-12 input-box2 ${errors.BuildingNo ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Building DoorNo"
                  variant="outlined"
                  value={BuildingNo}
                  onChange={(e) => {
                    setBuildingNo(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.BuildingNo?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Area Name <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("areaname")}
                  className={`col-12 input-box2 ${errors.BuildingNo ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Area Name"
                  variant="outlined"
                  value={areaname}
                  onChange={(e) => {
                    setAreaName(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.areaname?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Company Turn Over <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("turnover")}
                  className={`col-12 input-box2 ${errors.turnover ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Lead CompanyTurn Over"
                  variant="outlined"
                  name="turnover"
                  value={turnover}
                  onChange={(e) => {
                    setTurnOver(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.turnover?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Description <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("des")}
                  className={`col-12 input-box2 ${errors.des ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Lead Description"
                  variant="outlined"
                  value={des}
                  onChange={(e) => {
                    setDes(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.des?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Lead Type <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("leadtype")}
                  id="outlined-basic"
                  placeholder="Lead Type"
                  variant="outlined"
                  value={leadtype}
                  options={(LeadDropdown && LeadDropdown) || []}
                  onChange={(e, newValue) => {
                    setLeadType(newValue);
                    setValue("leadtype", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "5px",
                        // minWidth: "300px ",
                        width: "100%",
                      }}
                      placeholder="Lead Type"
                    />
                  )}
                ></Autocomplete>
                <Div style={{ color: "red" }}>{errors.leadtype?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Lead Industry <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("leadindustry1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  value={leadindustry1}
                  options={(leadindustry && leadindustry?.Values) || []}
                  onChange={(e, newValue) => {
                    setLeadindustry1(newValue?.value);
                    setValue("leadindustry1", newValue?.value);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "10px",
                      }}
                      placeholder="Lead Industry"
                    />
                  )}
                />

                <Div style={{ color: "red" }}>
                  {errors.leadindustry1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Lead Status <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("leadstatus1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  value={leadstatus1}
                  options={(leadstatus && leadstatus?.Values) || []}
                  onChange={(e, newValue) => {
                    setLeadStatus1(newValue?.value);
                    setValue("leadstatus1", newValue?.value);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "10px",
                      }}
                      className="col-12 input-box"
                      placeholder="Lead Status"
                    />
                  )}
                />
                <Div style={{ color: "red" }}>
                  {errors.leadstatus1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Job Title <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("jobtitle1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value || value === ""
                  }
                  value={jobtitle1}
                  options={(jobtitle && jobtitle?.Values) || []}
                  onChange={(e, newValue) => {
                    setJobtitle1(newValue?.value);
                    setValue("jobtitle1", newValue?.value);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "10px",
                      }}
                      placeholder="Job Title"
                    />
                  )}
                />
                <Div style={{ color: "red" }}>{errors.jobtitle1?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Lead Source <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("leadsource1")}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value || value === ""
                  }
                  value={leadsource1}
                  options={(leadsource && leadsource?.Values) || []}
                  onChange={(e, newValue) => {
                    setLeadscource1(newValue?.value);
                    setValue("leadsource1", newValue?.value);
                  }}
                  id="outlined-basic"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "10px",
                      }}
                      placeholder="Lead Source"
                    />
                  )}
                />
                <Div style={{ color: "red" }}>
                  {errors.leadsource1?.message}
                </Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Phone Number <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("phone")}
                  className={`col-12 input-box2 ${errors.phone ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Phone No"
                  variant="outlined"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <Div style={{ color: "red" }}>{errors.phone?.message}</Div>
              </Grid>

              <Grid item>
                <Typography sx={[input_label]}>Website URL <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("url")}
                  className={`col-12 input-box2 ${errors.url ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Website URL"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.url?.message}</Div>
              </Grid>
              <Grid item>
                <Typography sx={[input_label]}>Street Name <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("strname")}
                  className={`col-12 input-box2 ${errors.strname ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Street Name"
                  variant="outlined"
                  value={strname}
                  onChange={(e) => {
                    setStrname(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.strname?.message}</Div>
              </Grid>
              <Grid item>
                <Typography sx={[input_label]}>No of Employees <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("noofemployee")}
                  className={`col-12 input-box2 ${errors.noofemployee ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Lead No Of Employees"
                  variant="outlined"
                  name="noofemployee"
                  value={noofemployee}
                  onChange={(e) => {
                    setNoofEmployee(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>
                  {errors.noofemployee?.message}
                </Div>
              </Grid>
              <Grid item>
                <Typography sx={[input_label]}>Lead Location <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <TextField
                  {...register("location")}
                  className={`col-12 input-box2 ${errors.location ? "is-invalid" : ""
                    }`}
                  id="outlined-basic"
                  placeholder="Lead Location"
                  variant="outlined"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: "5px",
                      // minWidth: "300px ",
                      width: "100%",
                    },
                  }}
                />
                <Div style={{ color: "red" }}>{errors.location?.message}</Div>
              </Grid>
              <Grid item>
                <Typography sx={[input_label]}>Decission Maker <span className="required">*</span></Typography>
              </Grid>

              <Grid item>
                <Autocomplete
                  className="search-select3 col-12"
                  {...register("Decissionmaker")}
                  id="outlined-basic"
                  variant="outlined"
                  options={DecisionDropdown || []}
                  onChange={(e, newValue) => {
                    if (newValue === "Yes") {
                      setDecissionmaker(true);
                      setValue("Decissionmaker", true);
                    } else {
                      setDecissionmaker(false);
                      setValue("Decissionmaker", false);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        borderRadius: "5px",
                        // minWidth: "300px ",
                        width: "100%",
                      }}
                      placeholder="Decission maker"
                    />
                  )}
                ></Autocomplete>
                <Div style={{ color: "red" }}>
                  {errors.Decissionmaker?.message}
                </Div>
              </Grid>
            </Customgrid>

            <Grid container mt={2} align="center" spacing={1} pb={2}>
              <Grid item align="right" xs={6}>
                <CustomButton type="submit" label="Save" Icon="saveIcon" />
              </Grid>
              <Grid item align="left" xs={6}>
                <Cancelbutton onClick={() => setSave(true)} label="Cancel" />
              </Grid>
            </Grid>
          </form>
        </DialogContent>

        {/* </JumboScrollbar> */}
      </Dragabledialog>

      {/* close dialog box */}
      <DialogBox
        onClickNo={() => setSave(false)}
        onClickYes={() => {
          setSave(false);
          setOpenAddLead(false);
          reset();
        }}
        open={save}
      />
    </>
  );
};

export default memo(CreateContactLead);
