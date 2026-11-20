import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  Grid,
  TextField,
  Typography,
  Box,
  DialogContent,
  FormControl,
} from "@mui/material";
import {
  dialogFontSize,
  input_label,
} from "app/pages/widgets/CRMStyles";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import {
  Div,
  CustomButton,
  Cancelbutton,
  Customgrid,
} from "app/pages/widgets/StylesComponents";

const CHURN_REASONS = [
  { value: "dissatisfaction with product" },
  { value: "dissatisfaction with service" },
  { value: "pricing concerns" },
  { value: "poor customerservice" },
];

const EditAccountForm = ({
  accountData,
  setSave,
  setShowAccounts,
  getAccountlist,
}) => {
  const [formData, setFormData] = useState({
    id: accountData?.id,
    accountId: accountData?.Account_Id,
    name: accountData?.Contact_Name || "",
    accountOwner: accountData?.Account_Owner || "",
    landLine: accountData?.Land_Line || "",
    countryCode: accountData?.Country_Code || "",
    reasonChurn: accountData?.ReasonForChurn || "",
    mobileNumber: accountData?.Phone_Number || "",
    fax: accountData?.Fax || "",
    turnOver: accountData?.Turn_Over || "",
    email: accountData?.Mail || "",
    paymentTerms: accountData?.Payment_Terms || "",
    leadName: accountData?.Lead_Name || "",
    organizationName: accountData?.Website || "",
    industry: accountData?.Industry || "",
    employees: accountData?.Employees || "",
    gstNo: accountData?.GST_No || "",
    country: null,
    state: null,
    city: null,
    address: {
      pincode: accountData?.Address?.Pincode || "",
      doorNo: accountData?.Address?.BuildingDoorNo || "",
      streetName: accountData?.Address?.StreetName || "",
      areaName: accountData?.Address?.AreaName || "",
    },
  });

  const [errors, setErrors] = useState({});
  const [lookups, setLookups] = useState({
    countries: Country.getAllCountries(),
    states: [],
    cities: [],
  });

  const token = localStorage.getItem("accesstoken");
  const dbName = "crmuseradmin1";

  const [industries, setIndustries] = useState([]);

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
        },
      );
      response.data?.find((op) => {
        if (op?.Lookupname === "Industry Type") {
          setIndustries(op?.Values?.map((v) => v?.value) || []);
        }
      });
    } catch (error) {
      console.error("An error occurred:", error.message);
    }
  };

  useEffect(() => {
    getlookupData();
  }, []);

  // Initialize location data
  useEffect(() => {
    const foundCountry = Country.getAllCountries().find(
      (c) => c.name === accountData?.Country,
    );
    
    let foundState = null;
    if (foundCountry) {
      const states = State.getStatesOfCountry(foundCountry.isoCode);
      foundState = states.find((s) => s.name === accountData?.State);
      setLookups(prev => ({ ...prev, states }));
    }

    if (foundCountry && foundState) {
      const cities = City.getCitiesOfState(foundCountry.isoCode, foundState.isoCode).map(c => c.name);
      setLookups(prev => ({ ...prev, cities }));
    }

    setFormData(prev => ({
      ...prev,
      country: foundCountry || null,
      state: foundState || null,
      city: accountData?.City || null,
    }));
  }, [accountData]);

  // Handle country change
  const handleCountryChange = (event, newValue) => {
    const states = newValue ? State.getStatesOfCountry(newValue.isoCode) : [];
    setLookups(prev => ({ ...prev, states, cities: [] }));
    setFormData(prev => ({
      ...prev,
      country: newValue,
      countryCode: newValue?.phonecode || "",
      state: null,
      city: null,
    }));
    if (errors.country) setErrors(prev => ({ ...prev, country: null }));
  };

  // Handle state change
  const handleStateChange = (event, newValue) => {
    const cities = (formData.country && newValue) 
      ? City.getCitiesOfState(formData.country.isoCode, newValue.isoCode).map(c => c.name)
      : [];
    setLookups(prev => ({ ...prev, cities }));
    setFormData(prev => ({
      ...prev,
      state: newValue,
      city: null,
    }));
    if (errors.state) setErrors(prev => ({ ...prev, state: null }));
  };

  const handleInputChange = (field, value) => {
    if (field.includes("address.")) {
      const addressField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.name) err.name = "Name is required";
    if (!formData.countryCode) err.countryCode = "Country Code is required";
    if (!formData.mobileNumber) err.mobileNumber = "Mobile No is required";
    if (!formData.email) err.email = "Mail Id is required";
    if (!formData.leadName) err.leadName = "Lead is required";
    if (!formData.organizationName) err.organizationName = "Organization is required";
    if (!formData.industry) err.industry = "Industry is required";
    if (!formData.employees) err.employees = "Employers is required";
    if (!formData.gstNo) err.gstNo = "Gst is required";
    if (!formData.country) err.country = "Country is required";
    if (!formData.state) err.state = "State is required";
    if (!formData.city) err.city = "City is required";
    if (!formData.address.pincode) err.pincode = "PinCode is required";
    if (!formData.address.areaName) err.areaName = "Area Name is required";
    if (!formData.address.streetName) err.streetName = "Street Name is required";
    if (!formData.address.doorNo) err.doorNo = "Door No is required";
    if (!formData.paymentTerms) err.paymentTerms = "Payment Terms is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      id: formData.id,
      Account_Id: formData.accountId,
      Contact_Name: formData.name,
      Account_Owner: formData.accountOwner,
      Phone_Number: formData.mobileNumber,
      Land_Line: formData.landLine,
      Mail: formData.email,
      ReasonForChurn: formData.reasonChurn || "",
      Fax: formData.fax,
      Lead_Name: formData.leadName,
      GST_No: formData.gstNo,
      Payment_Terms: formData.paymentTerms,
      Organization_Name: formData.organizationName,
      Decision_Maker: false,
      Turn_Over: formData.turnOver,
      Employees: formData.employees,
      Industry: formData.industry,
      Website: formData.organizationName,
      Country: formData.country?.name,
      Country_Code: formData.countryCode,
      State: formData.state?.name,
      City: formData.city,
      Location: formData.city,
      Address: {
        Pincode: formData.address.pincode,
        AreaName: formData.address.areaName,
        StreetName: formData.address.streetName,
        BuildingDoorNo: formData.address.doorNo,
      },
      LeadCheck: 0,
      Active_Flag: false,
      Status_Flag: "false",
      Is_Deleted: false,
      Lead_Id: null,
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    try {
      await axios.put(`${BASE_URL}/superadmin/AccountCRUD/`, payload, {
        headers: {
          db: dbName,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      toast.success("Edited successfully");
      getAccountlist(1);
      setShowAccounts("accounts");
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.message || "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <Box>
      <Typography sx={[dialogFontSize, { mb: 3, mt: -2 }]}>
        Edit Account
      </Typography>

      <Box
        sx={{
          bgcolor: "white",
          padding: { xs: 1, md: 4 },
          borderRadius: "5px",
          border: "1px solid lightgray",
        }}
      >
        <DialogContent sx={{ mt: 1 }}>
          <Customgrid container columnCount={4}>
            {/* Account Id */}
            <Grid item>
              <Typography sx={[input_label]}> Account Id</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.accountId}
                disabled
                variant="outlined"
              />
            </Grid>

            {/* Name */}
            <Grid item>
              <Typography sx={[input_label]}>
                Name <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* Account Owner / Username */}
            <Grid item>
              <Typography sx={[input_label]}>
                Username <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.accountOwner}
                onChange={(e) => handleInputChange("accountOwner", e.target.value)}
                placeholder="Enter Account Owner"
              />
            </Grid>

            {/* Landline */}
            <Grid item>
              <Typography sx={[input_label]}>Landline</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.landLine}
                onChange={(e) => handleInputChange("landLine", e.target.value)}
                placeholder="Enter Landline Number"
              />
            </Grid>

            {/* Mobile Number */}
            <Grid item>
              <Typography sx={[input_label]}>
                Mobile Number <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <Div sx={{ display: "flex", gap: 1 }}>
                <Autocomplete
                  sx={{ width: "120px" }}
                  options={Array.from(new Set(Country.getAllCountries().map(c => c.phonecode))).sort((a,b) => a-b)}
                  getOptionLabel={(option) => `+${option}`}
                  value={formData.countryCode}
                  onChange={(e, newValue) => handleInputChange("countryCode", newValue)}
                  renderInput={(params) => <TextField {...params} placeholder="code" className="input-box2" />}
                />
                <TextField
                  fullWidth
                  className="input-box2"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    if (!isNaN(e.target.value)) handleInputChange("mobileNumber", e.target.value);
                  }}
                  placeholder="Enter Mobile Number"
                />
              </Div>
              {(errors.countryCode || errors.mobileNumber) && (
                <Typography variant="caption" color="error">
                  {errors.countryCode || errors.mobileNumber}
                </Typography>
              )}
            </Grid>

            {/* Fax */}
            <Grid item>
              <Typography sx={[input_label]}>Fax</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
                placeholder="Enter Fax Number"
              />
            </Grid>

            {/* Turn Over */}
            <Grid item>
              <Typography sx={[input_label]}>Turn Over</Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.turnOver}
                onChange={(e) => handleInputChange("turnOver", e.target.value)}
                placeholder="Enter your Turnover"
              />
            </Grid>

            {/* Email */}
            <Grid item>
              <Typography sx={[input_label]}>
                E-mail Id <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter Mail Id"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Lead */}
            <Grid item>
              <Typography sx={[input_label]}>
                Lead <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.leadName}
                onChange={(e) => handleInputChange("leadName", e.target.value)}
                placeholder="Enter Lead Name"
                error={!!errors.leadName}
                helperText={errors.leadName}
              />
            </Grid>

            {/* Reason for Churn */}
            <Grid item>
              <Typography sx={[input_label]}>Reason for Churn</Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 col-12"
                options={CHURN_REASONS}
                getOptionLabel={(option) => typeof option === "string" ? option : option?.value || ""}
                value={formData.reasonChurn}
                onChange={(e, newValue) => handleInputChange("reasonChurn", newValue?.value || newValue)}
                renderInput={(params) => <TextField {...params} placeholder="Select Reason" />}
              />
            </Grid>

            {/* Organization */}
            <Grid item>
              <Typography sx={[input_label]}>
                Organization <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.organizationName}
                onChange={(e) => handleInputChange("organizationName", e.target.value)}
                placeholder="Enter Organization Name"
                error={!!errors.organizationName}
                helperText={errors.organizationName}
              />
            </Grid>

            {/* Industry */}
            <Grid item>
              <Typography sx={[input_label]}>
                Industry <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 col-12"
                options={industries}
                value={formData.industry}
                onChange={(e, newValue) => handleInputChange("industry", newValue)}
                renderInput={(params) => <TextField {...params} placeholder="Select Industry" />}
              />
              {errors.industry && <Typography variant="caption" color="error">{errors.industry}</Typography>}
            </Grid>

            {/* Employers */}
            <Grid item>
              <Typography sx={[input_label]}>
                Employers <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.employees}
                onChange={(e) => handleInputChange("employees", e.target.value)}
                placeholder="Number of Employers"
                error={!!errors.employees}
                helperText={errors.employees}
              />
            </Grid>

            {/* GST */}
            <Grid item>
              <Typography sx={[input_label]}>
                GST No <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.gstNo}
                onChange={(e) => handleInputChange("gstNo", e.target.value)}
                placeholder="Enter GST Number"
                error={!!errors.gstNo}
                helperText={errors.gstNo}
              />
            </Grid>

            {/* Payment Terms */}
            <Grid item>
              <Typography sx={[input_label]}>
                Payment Terms <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                placeholder="Enter Payment Terms"
                error={!!errors.paymentTerms}
                helperText={errors.paymentTerms}
              />
            </Grid>

            {/* Country */}
            <Grid item>
              <Typography sx={[input_label]}>
                Country <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 col-12"
                options={lookups.countries}
                getOptionLabel={(option) => option?.name || ""}
                value={formData.country}
                onChange={handleCountryChange}
                renderInput={(params) => <TextField {...params} placeholder="Country" />}
              />
              {errors.country && <Typography variant="caption" color="error">{errors.country}</Typography>}
            </Grid>

            {/* State */}
            <Grid item>
              <Typography sx={[input_label]}>
                State <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 col-12"
                options={lookups.states}
                getOptionLabel={(option) => option?.name || ""}
                value={formData.state}
                onChange={handleStateChange}
                disabled={!formData.country}
                renderInput={(params) => <TextField {...params} placeholder="State" />}
              />
              {errors.state && <Typography variant="caption" color="error">{errors.state}</Typography>}
            </Grid>

            {/* City */}
            <Grid item>
              <Typography sx={[input_label]}>
                City <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <Autocomplete
                className="search-select3 col-12"
                options={lookups.cities}
                value={formData.city}
                onChange={(e, newValue) => handleInputChange("city", newValue)}
                disabled={!formData.state}
                renderInput={(params) => <TextField {...params} placeholder="City" />}
              />
              {errors.city && <Typography variant="caption" color="error">{errors.city}</Typography>}
            </Grid>

            {/* Pincode */}
            <Grid item>
              <Typography sx={[input_label]}>
                Pin Code <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.address.pincode}
                onChange={(e) => handleInputChange("address.pincode", e.target.value)}
                placeholder="Enter Pincode"
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
            </Grid>

            {/* Door No */}
            <Grid item>
              <Typography sx={[input_label]}>
                Door No <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.address.doorNo}
                onChange={(e) => handleInputChange("address.doorNo", e.target.value)}
                placeholder="Enter Door Number"
                error={!!errors.doorno}
                helperText={errors.doorno}
              />
            </Grid>

            {/* Street Name */}
            <Grid item>
              <Typography sx={[input_label]}>
                Street Name <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.address.streetName}
                onChange={(e) => handleInputChange("address.streetName", e.target.value)}
                placeholder="Enter Street Name"
                error={!!errors.streetname}
                helperText={errors.streetname}
              />
            </Grid>

            {/* Area Name */}
            <Grid item>
              <Typography sx={[input_label]}>
                Area Name <span className="required">*</span>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                className="col-12 input-box2"
                value={formData.address.areaName}
                onChange={(e) => handleInputChange("address.areaName", e.target.value)}
                placeholder="Enter Area Name"
                error={!!errors.areaname}
                helperText={errors.areaname}
              />
            </Grid>
          </Customgrid>

          <Grid container align="center" mt={4} spacing={2} pb={2}>
            <Grid item align="right" xs={6}>
              <CustomButton
                label="Update"
                Icon="saveIcon"
                onClick={handleSubmit}
              />
            </Grid>
            <Grid item align="left" xs={6}>
              <Cancelbutton onClick={() => setShowAccounts("accounts")} />
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Box>
  );
};

export default EditAccountForm;
