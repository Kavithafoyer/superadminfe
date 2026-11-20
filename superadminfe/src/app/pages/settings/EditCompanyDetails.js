import Div from "@jumbo/shared/Div";
import Span from "@jumbo/shared/Span";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import BusinessHoursWidget from "./BusinessHoursWidget";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Setting from "./Setting";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import styled from "@emotion/styled";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import UpdateCompanyDetails from "./UpdateCompanyDetails";
import { ButtonStyle, ComponentHeading, DialogBoxSaveButton, DisplayFlex, FontStyle } from "app/pages/widgets/CRMStyles";
import { CRMDateField, CustomButton } from "app/pages/widgets/StylesComponents";

const manufacturer = [
  { month: "January", value: 1 },
  { month: "February", value: 2 },
  { month: "March", value: 3 },
  { month: "April", value: 4 },
  { month: "May", value: 5 },
  { month: "June", value: 6 },
  { month: "July", value: 7 },
  { month: "August", value: 8 },
  { month: "September", value: 9 },
  { month: "October", value: 10 },
  { month: "November", value: 11 },
  { month: "December", value: 12 },
];
const date = [
  { label: 1, yearformat: "yyyy-MM-dd" },
  { label: 2, yearformat: "MM-dd-yyyy" },
  { label: 3, yearformat: "dd-MM-yyyy" },
];

// const currencies = [
//   { currency: "Rupees - ₹" },
//   { currency: "Dollar - $" },
//   { currency: "Yen – ¥" },
//   { currency: "Euro - €" },
// ];


const currencies = [
  { label: 1, curency: "INR", format: "Rupees - ₹" },
  { label: 2, curency: "USD", format: "Dollar - $" },
  { label: 3, curency: "JPY", format: "Yen – ¥" },
  { label: 4, curency: "EUR", format: "Euro - €" },
  { label: 5, curency: "BRL", format: "Real - R$" },
];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(1),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const EditCompanyDetails = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const startYear = 1900;
  const endYear = new Date().getFullYear();

  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push(year);
  }

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState("");
  const [compId, setCompId] = useState("");
  const [business, setBusiness] = useState([]);
  const [companyAdd, setCompanyAdd] = useState([]);
  const [fiscal, setFiscal] = useState([]);
  const [bankDetails, setBankDetails] = useState({});

  const [companyLogo, setCompanyLogo] = useState("");
  const [companyMail, setCompanyMail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyFormat, setCurrencyFormat] = useState("");
  const [dateFormat, setDateFormat] = useState("");
  const [contactNo1, setContactNo1] = useState("");
  const [contactNo2, setContactNo2] = useState("");
  const [contactNo3, setContactNo3] = useState("");
  const [fiscalYearStart, setFiscalYearStart] = useState(null);
  const [fiscalYearEnd, setFiscalYearEnd] = useState(null);
  const [fiscalMonth, setFiscalMonth] = useState("");
  const [checkMonth, setCheckMonth] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Company Profile",
    "Company Details",
    "Bank Details",
    "Fiscal Year",
    "Business Hour",
    "Currencies",
  ];

  const [sunCheckbox, setSunCheckbox] = useState(false);
  const [monCheckbox, setMonCheckbox] = useState(false);
  const [tueCheckbox, setTueCheckbox] = useState(false);
  const [wedCheckbox, setWedCheckbox] = useState(false);
  const [thuCheckbox, setThuCheckbox] = useState(false);
  const [friCheckbox, setFriCheckbox] = useState(false);
  const [satCheckbox, setSatCheckbox] = useState(false);

  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const [openBox, setOpenBox] = useState(false);
  const [base64, setbase64] = useState("");

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [showEdit, setShowEdit] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);

  const fetchBankDetails = async (ifscCode) => {
    try {
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      const data = await response.json();

      if (response.ok) {
        setBankDetails({ ...bankDetails, ['IFSC_CODE']: ifscCode, ["Swift_Code"]: data.BRANCH, ["Beneficiary_Bank_Name"]: data.BANK, ["Bank_Address"]: data.ADDRESS })
      } else {
        toast.error("Enter a valid IFSC Code");
        setBankDetails({ ...bankDetails, ['IFSC_CODE']: "", ["Swift_Code"]: "", ["Beneficiary_Bank_Name"]: "", ["Bank_Address"]: "" })
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBusiness((values) => ({ ...values, [name]: value }));
    setCompanyAdd((values) => ({ ...values, [name]: value }));
    setFiscal((values) => ({ ...values, [name]: value }));
    setBankDetails((values) => ({ ...values, [name]: value }));
    console.log("GGG", fiscal.Calendar_MonthName);

    if (name === "IFSC_Code") {
      fetchBankDetails(event.target.value)
    }
  };

  const handleChangeMonth = (e) => {
    var month = e.target.value;
    setCheckMonth(month);
    console.log(month);
  };

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  // image upload function
  const handleChangeImage = (e) => {
    console.log("file uploaded: ", e.target.files[0]);
    let file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
      setCompanyLogo(e.target.files[0].name);
    }
  };

  const handleReaderLoaded = (e) => {
    console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setbase64(btoa(binaryString));
  };

  // const handleClickConfirm = (e) => {
  //   e.preventDefault()
  //   if (companyName != undefined || companyName != "" || companyName != null) {
  //     toast.success("Currency is formatted");
  //   } else {
  //     toast.error("Enter the valid Company Name");
  //   }
  // };

  const handleClickConfirm = (currency) => {
    if (currency === "INR") {
      setCurrencyFormat("Rupees - ₹")
    } else if (currency === "USD") {
      setCurrencyFormat("Dollar - $")
    } else if (currency === "JPY") {
      setCurrencyFormat("Yen – ¥")
    } else if (currency === "EUR") {
      setCurrencyFormat("Euro - €")
    } else if (currency === "BRL") {
      setCurrencyFormat("Real - R$")
    }
    toast.success("Currency is formatted");
  };


  const handleUpdateBankDetails = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/useradmin/UserorganizationmasterBankDetailsCRUD/`, {
        Beneficiary_Account_Name: bankDetails?.Beneficiary_Account_Name,
        Beneficiary_Account_Number: bankDetails?.Beneficiary_Account_Number,
        Beneficiary_Bank_Name: bankDetails?.Beneficiary_Bank_Name,
        IFSC_CODE: bankDetails?.IFSC_CODE,
        Created_By: parseInt(localStorage.getItem("UserId")),
        Created_Date: new Date().toISOString().slice(0, 10),
        Updated_By: parseInt(localStorage.getItem("UserId")),
        Updated_Date: new Date().toISOString().slice(0, 10),
      }, header)
      return response?.data?.id
    } catch (error) {
      console.log(error);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    const bankId = await handleUpdateBankDetails();

    if (companyName != undefined || companyName != "" || companyName != null) {
      toast.success("Currency is formatted in one");
    } else {
      toast.error("Enter the valid Company Name");
    }

    var companyPayload1 = {
      Company_Name: companyName,
      CompanyLogo: base64,
      CompanyLogo_Name: companyLogo,
      CompanyMail: companyMail,

      Organization_Contact_Number: {
        Org_Contact_NO_1: contactNo1,
        Org_Contact_NO_2: contactNo2,
        Org_Contact_NO_3: contactNo3,
      },

      CompanyAddress: {
        Company_Id: parseInt(localStorage.getItem("OrganizationId")),
        Address_Type: "",
        Building_Street: companyAdd?.Building_Street,
        Building_Name: "",
        Building_Area: companyAdd?.Building_Area,
        Building_Country: selectedCountry?.name,
        Building_State: selectedState?.name,
        Building_City: selectedCity?.name,
        Zip_Code: companyAdd?.Zip_Code,
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      },

      // Organization_BankDetails: bankDetails,
      Organization_BankDetails: bankId,

      Fiscal_Year: {
        Company_Id: parseInt(localStorage.getItem("OrganizationId")),
        Calendar_MonthName: fiscalMonth,
        CalendarName: "",
        Calender_QuarterName: "",
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
        Calandermonth: checkMonth,
      },

      Business_Hour: {
        Company_Id: parseInt(localStorage.getItem("OrganizationId")),
        Monday_Chekbox: Boolean(business?.Monday_Chekbox),
        Monday_Starttime: business?.Monday_Starttime,
        Monday_EndTime: business?.Monday_EndTime,
        Tuesday_Chekbox: Boolean(business?.Tuesday_Chekbox),
        Tuesday_Starttime: business?.Tuesday_Starttime,
        Tuesday_Endtime: business?.Tuesday_Endtime,
        Wednessday_Chekbox: Boolean(business?.Wednessday_Chekbox),
        Wednessday_Starttime: business?.Wednessday_Starttime,
        Wednessday_Endtime: business?.Wednessday_Endtime,
        Thursday_Chekbox: Boolean(business?.Thursday_Chekbox),
        Thursday_Starttime: business?.Thursday_Starttime,
        Thursday_Endtime: business?.Thursday_Endtime,
        Friday_Chekbox: Boolean(business?.Friday_Chekbox),
        Friday_Starttime: business?.Friday_Starttime,
        Friday_Endtime: business?.Friday_Endtime,
        Saturday_Chekbox: Boolean(business?.Saturday_Chekbox),
        Saturday_Starttime: business?.Saturday_Starttime,
        Saturday_Endtime: business?.Saturday_Endtime,
        Sunday_Chekbox: Boolean(business?.Sunday_Chekbox),
        Sunday_Starttime: business?.Sunday_Starttime,
        Sunday_Endtime: business?.Sunday_Endtime,
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      },
      DateFormat: dateFormat,
      Currencies: currency,
      Created_By: parseInt(localStorage.getItem("UserId")),
      Updated_By: parseInt(localStorage.getItem("UserId")),
    };

    setLoading(true);

    await axios
      .post(`${BASE_URL}/Erpapp/CompanyCRUD/`, companyPayload1, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success("Company details saved successfully");
        setActiveStep(0);
        setLoading(false);
        if (res.data.id === 0) {
          setShowEdit(true);
          setShowUpdate(false);
        } else {
          setShowEdit(false);
          setShowUpdate(true);
        }
      }).catch((error) => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
    setOpenBox(false);
  };

  const createrId = parseInt(localStorage.getItem("UserId"));

  const getCompanyDetails = async () => {
    setLoading(true);

    await axios
      .get(`${BASE_URL}/useradmin/CRMorganizationCRUD/?id=${createrId}`, header)
      .then((res) => {
        console.log("D", res.data);
        var Id = res?.data?.id;
        setLoading(false);
        if (!Id) {
          setShowEdit(true);
          setShowUpdate(false);
        } else {
          setShowEdit(false);
          setShowUpdate(true);

          setId(res?.data?.id);
          setCompId(res?.data?.Company_Id);

        }
      })
      .catch((error) => {
        console.log("ds", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getCompanyDetails();
  }, [createrId]);


  return (
    <>
      {/* Edit company details code */}
      <JumboContentLayoutMain>
        <Div sx={{ display: showEdit === true ? "block" : "none" }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Edit Your Company Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <Div
                className="card"
                sx={{ m: 1, ml: 0, mr: 0, p: 4, minHeight: "466px" }}
              >
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* code for company profile */}
                  <Div sx={{ display: activeStep === 0 ? "block" : "none" }}>
                      <Div
                        sx={{
                          mt: 4,
                          ml: { xs: 0, md: 2 },
                        }}
                      >
                        <Grid item xs={12} sm={4} lg={4} className="row">
                          <Typography
                            className="input-label col-md-3"
                            sx={{ mt: 1, textAlign: "left" }}
                          >
                            Company Name <Span className="required">*</Span>
                          </Typography>
                          <TextField
                            className="col-md-5 input-box2"
                            id="outlined-basic"
                            placeholder="Company Name"
                            variant="outlined"
                            value={companyName}
                            name="companyName"
                            onChange={(e) => setCompanyName(e.target.value)}
                            autoComplete="off"
                          />
                        </Grid>
                      </Div>

                      <Div sx={{ mt: 2, ml: { xs: 0, md: 2 } }}>
                        <Typography
                          sx={[ComponentHeading, { ml: 1.5, textAlign: "left" }]}
                        >
                          Address :
                        </Typography>
                        <br />
                        <Grid container>
                          <Grid item xs={12} className="row">
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Street & Building Name{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="col-md-5 input-box2"
                              id="outlined-basic"
                              placeholder="Street & Building Name"
                              variant="outlined"
                              value={companyAdd?.Building_Street}
                              name="Building_Street"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Area Name <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="col-md-5 input-box2"
                              id="outlined-basic"
                              placeholder="Area Name"
                              variant="outlined"
                              value={companyAdd?.Building_Area}
                              name="Building_Area"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Country <Span className="required">*</Span>
                            </Typography>
                            <FormControl className="col-md-5">
                              {/* <Select
                                  className="search-select3"
                                  placeholder="Select Country"
                                  name="selectedCountry"
                                  options={Country.getAllCountries()}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  value={selectedCountry}
                                  onChange={(item) => {
                                    setSelectedCountry(item);
                                    console.log("PP", item);
                                  }}
                                /> */}
                              <Autocomplete
                                className="search-select3"
                                name="selectedCountry"
                                options={Country.getAllCountries()}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.name) {
                                    return option?.name;
                                  }
                                  return "";
                                }}
                                value={selectedCountry || null}
                                onChange={(event, newValue) => {
                                  setSelectedCountry(newValue?.name);
                                  // setCountryId(newValue?.id);
                                  // getStateLists(newValue?.country);
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option === value
                                }
                                renderInput={(params) => <TextField {...params} placeholder="Select Country" variant="outlined" />}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              State <Span className="required">*</Span>
                            </Typography>
                            <FormControl className="col-md-5">
                              {/* <Select
                                  className="react-select-box"
                                  placeholder="Select State"
                                  name="selectedState"
                                  options={State?.getStatesOfCountry(
                                    selectedCountry?.isoCode
                                  )}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  value={selectedState}
                                  onChange={(item) => {
                                    setSelectedState(item);
                                    console.log("PP", item);
                                  }}
                                /> */}
                              <Autocomplete
                                className="search-select3"
                                name="selectedState"
                                options={State?.getStatesOfCountry(
                                  selectedCountry?.isoCode
                                )}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.name) {
                                    return option?.name;
                                  }
                                  return "";
                                }}
                                getOptionValue={(options) => {
                                  return options["name"];
                                }}
                                value={selectedState}
                                onChange={(event, newValue) => {
                                  setSelectedState(newValue?.name);
                                  // setStateId(newValue?.id)
                                  // getCityLists(newValue?.name);
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option === value
                                }
                                renderInput={(params) => <TextField {...params} placeholder="Select State" variant="outlined" />}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              City <Span className="required">*</Span>
                            </Typography>
                            <FormControl className="col-md-5">
                              {/* <Select
                                  className="react-select-box"
                                  placeholder="Select City"
                                  name="selectedCity"
                                  options={City.getCitiesOfState(
                                    selectedState?.countryCode,
                                    selectedState?.isoCode
                                  )}
                                  getOptionLabel={(options) => {
                                    return options["name"];
                                  }}
                                  getOptionValue={(options) => {
                                    return options["name"];
                                  }}
                                  value={selectedCity}
                                  onChange={(item) => {
                                    setSelectedCity(item);
                                    console.log("PP", item);
                                  }}
                                /> */}
                              <Autocomplete
                                className="search-select3"
                                name="selectedCity"
                                options={City.getCitiesOfState(
                                  selectedState?.countryCode,
                                  selectedState?.isoCode
                                )}
                                getOptionLabel={(option) => {
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  if (option && option?.name) {
                                    return option?.name;
                                  }
                                  return "";
                                }}
                                getOptionValue={(options) => {
                                  return options?.name;
                                }}
                                value={selectedCity}
                                onChange={(event, newValue) => {
                                  setSelectedCity(newValue?.name);
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option === value
                                }
                                renderInput={(params) => <TextField {...params} placeholder="Select City" variant="outlined" />}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Pincode <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="col-md-5 input-box2"
                              id="outlined-basic"
                              placeholder="Pincode"
                              variant="outlined"
                              value={companyAdd?.Zip_Code}
                              name="Zip_Code"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Date Format
                              <Span className="required">*</Span>
                            </Typography>
                            <FormControl className="col-md-5">
                              <Autocomplete
                                className="search-select3 col-12"
                                id="highlights-demo"
                                name="dateFormat"
                                getOptionLabel={(option) => option?.yearformat}
                                options={date}
                                value={date?.find(
                                  (option) => option?.yearformat === dateFormat
                                )}
                                onChange={(e, item) => {
                                  setDateFormat(item?.yearformat);
                                  console.log("abc", item);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Date Format"
                                    variant="outlined"
                                  />
                                )}
                              ></Autocomplete>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Contact Number 1{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              type="number"
                              id="outlined-basic"
                              placeholder="Contact Number 1"
                              variant="outlined"
                              value={contactNo1}
                              name="contactNo1"
                              onChange={(e) => setContactNo1(e.target.value)}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Contact Number 2{" "}
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              type="number"
                              id="outlined-basic"
                              placeholder="Contact Number 2"
                              variant="outlined"
                              value={contactNo2}
                              name="contactNo2"
                              onChange={(e) => setContactNo2(e.target.value)}
                              autoComplete="off"
                            />
                          </Grid>

                          <Grid item xs={12} className="row" sx={{ mt: 1, mb: 3 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Contact Number 3{" "}
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              type="number"
                              id="outlined-basic"
                              placeholder="Contact Number 3"
                              variant="outlined"
                              value={contactNo3}
                              name="contactNo3"
                              onChange={(e) => setContactNo3(e.target.value)}
                              autoComplete="off"
                            />
                          </Grid>

                        </Grid>

                        {/* <Div sx={{ mt: 5 }}>
                            <Button
                              className="save-button"
                              type="submit"
                              sx={{ mr: 3 }}
                              onClick={handleClickSave({
                                vertical: "top",
                                horizontal: "right",
                              })}
                            >
                              Save
                            </Button>
                            <Button
                              className="cancel-button"
                              onClick={handleClickCancel({
                                vertical: "top",
                                horizontal: "right",
                              })}
                            >
                              Cancel
                            </Button>
                          </Div> */}

                        {/* code for save and cancel messeges */}
                        <Div>
                          <Snackbar
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            onClose={handleClose}
                          >
                            <Alert
                              severity="success"
                              sx={{ mt: 5.5, pr: 15 }}
                            >
                              Saved Successfully
                            </Alert>
                          </Snackbar>

                          <BootstrapDialog
                            onClose={handleClose}
                            aria-labelledby="customized-dialog-title"
                            open={openBox}
                            fullScreen={fullScreen}
                            anchorOrigin={{ vertical, horizontal }}
                            key={vertical + horizontal}
                            sx={{
                              ml: { sm: 0, md: 10 },
                              mr: { sm: 0, md: 10 },
                              display:
                                showCancelAlert === true ? "block" : "none",
                            }}
                          >
                            <DialogContent>
                              <DialogContentText
                                id="alert-dialog-description"
                                sx={{
                                  pl: 2,
                                  fontSize: 16,
                                  fontWeight: 400,
                                  color: "#000000",
                                  letterSpacing: 1,
                                }}
                              >
                                You have done some changes. Onclicking the
                                cancel button changed data will not be
                                saved. Still you want to cancel the changes?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions
                              sx={{ mr: { sm: 0, md: 20 }, mb: 2 }}
                            >
                              <Button
                                onClick={handleClose}
                                className="save-button"
                                autoFocus
                                sx={{
                                  mr: 3,
                                }}
                              >
                                Yes
                              </Button>

                              <Button
                                onClick={handleClose}
                                className="cancel-button"
                              >
                                No
                              </Button>
                            </DialogActions>
                          </BootstrapDialog>
                        </Div>
                      </Div>
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 5,
                          gap: 2,
                        }}
                      >
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ color: "#666565" }}
                        >
                          Back
                        </Button>
                        <CustomButton onClick={handleNext} label="Next" />
                      </Div>
                  </Div>

                  {/* code for company details */}
                  <Div sx={{ display: activeStep === 1 ? "block" : "none" }}>
                    <Grid container>
                      <Grid item xs={12} sm={6} lg={6}>
                        <Div sx={{ mt: 8 }}>
                          <Div
                            sx={[DisplayFlex, {
                              justifyContent: "center",
                              height: { xs: 230, xl: 225 },
                              borderRadius: 0,
                            }]}
                          >
                            <img
                              alt="Company Logo"
                              src={`data:image/png;base64,${base64}`}
                              width={150}
                              height={150}
                              style={{ border: "1px solid #10BBE5 ", padding: 2, }}
                            />
                          </Div>

                          <Button
                            component="label"
                            onChange={handleChangeImage}
                            sx={[FontStyle, {
                              marginTop: { sm: 2, md: "5px" },
                              color: "#10BBE5",
                              textTransform: "capitalize",
                              textAlign: "center",
                              // border: "1px solid lightgray",
                              padding: "10px",
                            }]}
                          >
                            Upload Company Logo
                            <input
                              hidden
                              accept="image/*"
                              multiple
                              type="file"
                              style={{
                                backgroundColor: "transparent",
                              }}
                              name="companyLogo"
                              onChange={handleInputChange}
                            />
                          </Button>
                        </Div>
                      </Grid>
                      <Grid item xs={12} sm={6} lg={6}>
                        <Div sx={{ mt: 10, ml: { xs: 0, md: 10 } }}>
                          <Div
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: "#10BBE5",
                              marginBottom: "5px",
                            }}
                          >
                            <span></span>
                            CRM India Private Limited
                          </Div>

                          <Div>
                            <TextField
                              className="col-md-8 input-box"
                              id="outlined-basic"
                              placeholder="Company Mail"
                              variant="outlined"
                              value={companyMail}
                              name="companyMail"
                              onChange={(e) => setCompanyMail(e.target.value)}
                              autoComplete="off"
                            />
                          </Div>
                        </Div>
                      </Grid>
                    </Grid>
                    <Div
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 5,
                        gap: 2,
                      }}
                    >
                      <Button onClick={handleBack} sx={{ color: "#666565" }}>
                        Back
                      </Button>
                      <CustomButton onClick={handleNext} label="Next" />
                    </Div>
                  </Div>

                  {/* code for Bank Details */}
                  <Div sx={{ display: activeStep === 2 ? "block" : "none", mb: 2 }}>
                      <Div sx={{ mt: 2, ml: { xs: 0, md: 2 } }}>
                        <Grid container>
                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              IFSC Code{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              id="outlined-basic"
                              placeholder="IFSC Code"
                              variant="outlined"
                              value={bankDetails?.IFSC_CODE}
                              name="IFSC_CODE"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>
                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Bank Name{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              id="outlined-basic"
                              placeholder="Bank Name"
                              variant="outlined"
                              value={bankDetails?.Beneficiary_Bank_Name}
                              name="Beneficiary_Bank_Name"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>
                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Account Name{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              id="outlined-basic"
                              placeholder="Account Name"
                              variant="outlined"
                              value={bankDetails?.Beneficiary_Account_Name}
                              name="Beneficiary_Account_Name"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>
                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Account Number{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              id="outlined-basic"
                              placeholder="Account Number"
                              variant="outlined"
                              value={bankDetails?.Beneficiary_Account_Number}
                              name="Beneficiary_Account_Number"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>
                          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
                            <Typography
                              className="input-label col-md-3"
                              sx={{ mt: 1, textAlign: "left" }}
                            >
                              Address{" "}
                              <Span className="required">*</Span>
                            </Typography>
                            <TextField
                              className="input-box2 col-md-5"
                              id="outlined-basic"
                              placeholder="Address"
                              variant="outlined"
                              value={bankDetails?.Bank_Address}
                              name="Bank_Address"
                              onChange={handleInputChange}
                              autoComplete="off"
                            />
                          </Grid>
                        </Grid>
                      </Div>
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 5,
                          gap: 2,
                        }}
                      >
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ color: "#666565" }}
                        >
                          Back
                        </Button>
                        <CustomButton onClick={handleNext} label="Next" />
                      </Div>
                  </Div>

                  {/* code for fiscal year */}
                  <Div sx={{ display: activeStep === 3 ? "block" : "none" }}>
                    <Typography sx={{ pl: 1, pt: 3, fontWeight: 600, textAlign: 'left', fontSize: "14px" }}>
                      Fiscal Year
                    </Typography>
                    <Typography sx={{ pl: 1, fontWeight: 500, textAlign: 'left', fontSize: "14px" }}>
                      You can fix your company's fiscal year here
                    </Typography>
                    <Div sx={{ mt: 5 }}>
                      {/* <Grid container spacing={1} rowSpacing={1}>
                        <Grid item xs={12} sm={4} lg={3}>
                          <Typography sx={[FontStyle, { textAlign: "left" }]} className="input-label">
                            Fiscal Year Start
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl className="col-12">
                            <CRMDateField
                              id="fiscalYearStart"
                              name="fiscalYearStart"
                              inputValue={fiscalYearStart}
                              handleInputChange={(e) => setFiscalYearStart(e.target.value)}
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4} lg={3}>
                          <Typography sx={[FontStyle, { textAlign: "left" }]} className="input-label">
                            Fiscal Year End
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={3}>
                          <FormControl className="col-12">
                            <CRMDateField
                              id="fiscalYearEnd"
                              name="fiscalYearEnd"
                              inputValue={fiscalYearEnd}
                              handleInputChange={(e) => setFiscalYearEnd(e.target.value)}
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>
                      </Grid> */}

                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={4} lg={3}>
                          <Typography sx={[FontStyle, { textAlign: "left" }]} className="input-label">
                            Fiscal Year
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={4}>
                          <FormControl className="col-12">
                            <Autocomplete
                              className="search-select3"
                              name="fiscalYear"
                              getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option && option) {
                                  return option;
                                }
                                return "";
                              }}
                              options={years}
                              value={fiscalYearStart}
                              onChange={(e, newValue) => {
                                setFiscalYearStart(newValue);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option === value
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Year"
                                  variant="outlined"
                                  autoComplete="off"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container spacing={1}>
                        {/* <Grid item xs={12} sm={12} lg={4}></Grid> */}
                        <Grid item xs={12} sm={4} lg={3}>
                          <Typography sx={[FontStyle, { textAlign: "left" }]} className="input-label">
                            Fiscal Month
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={4}>
                          <FormControl className="col-12">
                            <Autocomplete
                              className="search-select"
                              name="fiscalMonth"
                              getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option && option?.month) {
                                  return option?.month;
                                }
                                return "";
                              }}
                              options={manufacturer}
                              value={fiscalMonth}
                              onChange={(e, newValue) => {
                                setFiscalMonth(newValue?.month);
                                // console.log("HHH", newValue);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option?.month === value
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Month"
                                  variant="outlined"
                                  autoComplete="off"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <Grid container>
                        {/* <Grid item xs={12} sm={4} lg={4}></Grid> */}
                        <Grid item xs={12} sm={4} lg={3}>
                          <Typography sx={[FontStyle, { pt: 2, textAlign: "left" }]} className="input-label">
                            Display Fiscal Based On
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} lg={4}>
                          <Div sx={{ pt: 1 }}>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              defaultValue="start month"
                              name="radio-buttons-group"
                            >
                              <FormControlLabel
                                control={<Radio color="info" size="small" />}
                                label="Start Month"
                                name="Start Month"
                                value="startMonth"
                                checked={checkMonth === "startMonth"}
                                onChange={handleChangeMonth}
                              />
                              <FormControlLabel
                                control={<Radio color="info" size="small" />}
                                label="End Month"
                                value="endMonth"
                                name="End Month"
                                checked={checkMonth === "endMonth"}
                                onChange={handleChangeMonth}
                              />
                            </RadioGroup>
                          </Div>
                        </Grid>
                      </Grid>
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 5,
                          gap: 2,
                        }}
                      >
                        <Button onClick={handleBack} sx={{ color: "#666565" }}>
                          Back
                        </Button>
                        <CustomButton onClick={handleNext} label="Next" />
                      </Div>
                    </Div>
                  </Div>

                  {/* code for Business hour */}
                  <Div sx={{ display: activeStep === 4 ? "block" : "none" }}>
                    <BusinessHoursWidget business={business || {}} setBusiness={setBusiness} />
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 5,
                          gap: 2,
                        }}
                      >
                        <Button onClick={handleBack} sx={{ color: "#666565" }}>
                          Back
                        </Button>
                        <CustomButton onClick={handleNext} label="Next" />
                      </Div>
                  </Div>

                  {/* code for Currencies */}
                  <Div sx={{ display: activeStep === 5 ? "block" : "none" }}>
                    <Typography
                      sx={[ComponentHeading, { textAlign: "left", pl: 1, pt: 3, fontWeight: 600 }]}
                    >
                      Currencies
                    </Typography>
                    <Typography sx={[FontStyle, { textAlign: "left", pl: 1, fontWeight: 500 }]}>
                      You can fix your currencies which will be used to
                      transact all financial transactions. Once you setup you
                      can not change later
                    </Typography>
                    <Div sx={{ mt: 5, ml: 1, textAlign: "left" }}>
                      <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={1} lg={1}></Grid> */}
                        <Grid className="row" item xs={12} sm={12} lg={3}>
                          <Typography

                            className="col-12"
                            sx={[FontStyle, { textAlign: "left", pt: 0, ml: -1, color: "#10BBE5" }]}
                          >
                            Home Currencies
                          </Typography>
                          <FormControl
                            className="col-md-8 ms-1"
                            sx={{ minWidth: "195px" }}
                          >
                            <Autocomplete
                              className="search-select"
                              name="currency"
                              getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                  return option;
                                }
                                if (option && option?.curency) {
                                  return option?.curency;
                                }
                                return "";
                              }}
                              options={currencies}
                              value={currency}
                              onChange={(e, newValue) => {
                                setCurrency(newValue?.curency);
                                handleClickConfirm(newValue?.curency);
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option?.curency === value
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Currency Format"
                                  autoComplete="off"
                                  variant="outlined"
                                />
                              )}
                            />
                          </FormControl>
                        </Grid>
                        <Grid className="row" item xs={12} sm={12} lg={3}>
                          <Typography
                            className="col-12"
                            sx={[FontStyle, { textAlign: "left", pt: 0, pl: { xs: 0, md: 6 }, color: "#10BBE5" }]}
                          >
                            Format
                          </Typography>
                          <TextField
                            className="input-box col-12"
                            value={currencyFormat}
                            placeholder="Currency Format"
                            autoComplete="off"
                            disabled
                            sx={{ pt: 0, pl: { xs: 0, md: 6 }, maxWidth: "100%" }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3} lg={3}></Grid>
                      </Grid>
                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 5,
                          gap: 2,
                        }}
                      >
                        <Button onClick={handleBack} sx={{ color: "#666565" }}>
                          Back
                        </Button>
                        <CustomButton
                          type="submit"
                          label="Submit"
                          Icon="saveIcon"
                        />
                      </Div>
                    </Div>
                  </Div>
                </Div>
              <br />
            </div>
          </form>
        </Div>

        <Div sx={{ display: showUpdate === true ? "block" : "none" }}>
          <UpdateCompanyDetails
            showEdit={showEdit}
            showUpdate={showUpdate}
            setShowEdit={setShowEdit}
            setShowUpdate={setShowUpdate}
            loading={loading}
            setLoading={setLoading}
            id={id}
            compId={compId}
          />
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default EditCompanyDetails;
