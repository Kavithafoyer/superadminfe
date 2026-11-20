import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  DisplayFlex,
} from "app/pages/widgets/CRMStyles";
import { Country } from "country-state-city";
import axios from "app/services/config";
import { toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import {
  Div,
  CustomButton,
  Cancelbutton,
} from "app/pages/widgets/StylesComponents";
import { OrganizationId, UserId } from "app/redux/auth/localStorage";

// --- Constants & Helpers ---

const CHURN_REASONS = [
  { value: "dissatisfaction with product" },
  { value: "dissatisfaction with service" },
  { value: "pricing concerns" },
  { value: "poor customerservice" },
];

const INITIAL_FORM_STATE = {
  name: "",
  accountOwner: localStorage.getItem("Username") || "",
  landLine: "",
  fax: "",
  turnOver: "",
  employees: "",
  countryCode: "",
  mobileNumber: "",
  email: "",
  leadName: "",
  reasonChurn: "",
  organizationName: "",
  industry: "",
  gstNo: "",
  paymentTerms: "",
  country: null,
  state: null,
  city: null,
  address: {
    pincode: "",
    doorNo: "",
    streetName: "",
    areaName: "",
  },
};

// --- Sub-components ---

const FormInputLabel = ({ label, required }) => (
  <Typography sx={input_label}>
    {label} {required && <span style={{ color: "red" }}>*</span>}
  </Typography>
);

const FormField = ({ label, required, error, children }) => (
  <Grid item xs={12} md={6}>
    <FormInputLabel label={label} required={required} />
    {children}
    {error && (
      <Typography
        variant="caption"
        sx={{ color: "red", mt: 0.5, display: "block" }}
      >
        {error}
      </Typography>
    )}
  </Grid>
);

const CreateAccountForm = ({ setSave, setShowAccounts, getAccountlist }) => {
  const [formData, setFormData] = useState(() => ({
    ...INITIAL_FORM_STATE,
    accountOwner: localStorage.getItem("Username") || "",
  }));
  const [errors, setErrors] = useState({});
  const [lookups, setLookups] = useState({
    industries: ["IT", "Sales", "Marketing", "Finance", "HR", "Other"],
    countries: Country.getAllCountries(),
    states: [],
    cities: [],
  });

  const token = localStorage.getItem("accesstoken");
  const authHeaders = useMemo(
    () => ({
      headers: {
        db: localStorage.getItem("DBName") || "crmuseradmin1",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }),
    [token],
  );

  // --- Handlers ---

  const handleInputChange = (field, value) => {
    if (field.includes("address.")) {
      const addressField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = {
      name: "Name",
      countryCode: "Country Code",
      mobileNumber: "Mobile Number",
      email: "Email",
      leadName: "Lead Name",
      organizationName: "Organization",
      industry: "Industry",
      employees: "Employers",
      gstNo: "GST No",
      country: "Country",
      state: "State",
      city: "City",
      paymentTerms: "Payment Terms",
      "address.pincode": "Pincode",
      "address.doorNo": "Door No",
      "address.streetName": "Street Name",
      "address.areaName": "Area Name",
    };

    Object.entries(requiredFields).forEach(([key, label]) => {
      const value = key.includes(".")
        ? formData.address[key.split(".")[1]]
        : formData[key];

      if (!value) {
        newErrors[key] = `${label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- API Calls ---

  const fetchIndustries = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/useradmin/Userlookuplist/`,
        authHeaders,
      );
      const industryLookup = data?.find(
        (op) => op?.Lookupname === "Industry Type",
      );
      if (industryLookup?.Values) {
        setLookups((prev) => ({
          ...prev,
          industries: industryLookup.Values.map((v) => v.value),
        }));
      }
    } catch (error) {
      console.error("Failed to fetch industries:", error);
    }
  }, [authHeaders]);

  const fetchStates = useCallback(async (countryName) => {
    if (!countryName) return;
    try {
      const { data } = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country: countryName },
        { headers: { "Content-Type": "application/json" } },
      );
      setLookups((prev) => ({ ...prev, states: data?.data?.states || [] }));
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  }, []);

  const fetchCities = useCallback(async (countryName, stateName) => {
    if (!countryName || !stateName) return;
    try {
      const { data } = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        { country: countryName, state: stateName },
        { headers: { "Content-Type": "application/json" } },
      );
      setLookups((prev) => ({ ...prev, cities: data?.data || [] }));
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      Contact_Name: formData.name,
      Account_Owner: formData.accountOwner,
      Phone_Number: formData.mobileNumber,
      Land_Line: formData.landLine,
      Mail: formData.email,
      Fax: formData.fax,
      Lead_Name: formData.leadName,
      ReasonForChurn: formData.reasonChurn,
      GST_No: formData.gstNo,
      Payment_Terms: formData.paymentTerms,
      Organization_Name: formData.organizationName,
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
      Organization_Id: OrganizationId,
      Created_By: UserId,
      Updated_By: UserId,
      LeadCheck: 0,
      Active_Flag: false,
      Status_Flag: "false",
      Is_Deleted: false,
      Created_Date: new Date().toISOString().split("T")[0],
      Updated_Date: new Date().toISOString().split("T")[0],
      Lead_Id: null,
    };

    try {
      await axios.post(
        `${BASE_URL}/superadmin/AccountCRUD/`,
        payload,
        authHeaders,
      );
      toast.success("Account created successfully");
      setShowAccounts("accounts");
      getAccountlist(1);
    } catch (error) {
      const data = error.response?.data;
      if (data && typeof data === "object") {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(`${field}: ${msg}`));
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        const errorMsg = error.message || "An error occurred";
        toast.error(errorMsg);
      }
    }
  };

  // --- Effects ---

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  useEffect(() => {
    if (formData.country) {
      fetchStates(formData.country.name);
      handleInputChange("state", null);
      handleInputChange("city", null);
    }
  }, [formData.country, fetchStates]);

  useEffect(() => {
    if (formData.country && formData.state) {
      fetchCities(formData.country.name, formData.state.name);
      handleInputChange("city", null);
    }
  }, [formData.country, formData.state, fetchCities]);

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", width: "100%" }}>
      <Typography sx={[dialogFontSize, { mb: 3, mt: -2 }]}>
        Create Account
      </Typography>

      <Box
        sx={{
          bgcolor: "white",
          p: { xs: 2, md: 4 },
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Grid container spacing={3}>
            {/* General Information */}
            <FormField label="Name" required error={errors.name}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter account name"
              />
            </FormField>

            <FormField label="Account Owner" required>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.accountOwner}
                disabled
              />
            </FormField>

            <FormField label="Lead Name" required error={errors.leadName}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.leadName}
                onChange={(e) => handleInputChange("leadName", e.target.value)}
                placeholder="Enter lead name"
              />
            </FormField>

            {/* Contact Details */}
            <FormField
              label="Mobile Number"
              required
              error={errors.mobileNumber || errors.countryCode}
            >
              <Div sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Autocomplete
                  className="input-box2"
                  sx={{ width: 90, flexShrink: 0 }}
                  size="small"
                  options={Array.from(
                    new Set(lookups.countries.map((c) => c.phonecode)),
                  ).sort((a, b) => a - b)}
                  getOptionLabel={(option) => `+${option}`}
                  value={formData.countryCode}
                  onChange={(_, val) => handleInputChange("countryCode", val)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="+91" />
                  )}
                />
                <TextField
                  className="input-box2"
                  sx={{ flex: 1 }}
                  size="small"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && isNaN(val)) return toast.warn("Numbers only");
                    handleInputChange("mobileNumber", val);
                  }}
                  placeholder="Mobile number"
                />
              </Div>
            </FormField>

            <FormField label="E-mail Id" required error={errors.email}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@example.com"
              />
            </FormField>

            <FormField label="Landline" error={errors.landLine}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.landLine}
                onChange={(e) => handleInputChange("landLine", e.target.value)}
                placeholder="Landline number"
              />
            </FormField>

            <FormField label="Fax" error={errors.fax}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.fax}
                onChange={(e) => handleInputChange("fax", e.target.value)}
                placeholder="Fax number"
              />
            </FormField>

            {/* Business Details */}
            <FormField
              label="Organization"
              required
              error={errors.organizationName}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.organizationName}
                onChange={(e) =>
                  handleInputChange("organizationName", e.target.value)
                }
                placeholder="Organization name"
              />
            </FormField>

            <FormField label="Industry" required error={errors.industry}>
              <Autocomplete
                className="search-select3 col-6"
                fullWidth
                size="small"
                options={lookups.industries}
                getOptionLabel={(option) => option || ""}
                isOptionEqualToValue={(option, value) =>
                  option === value || value === ""
                }
                value={formData.industry}
                onChange={(_, val) => handleInputChange("industry", val)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Industry" />
                )}
              />
            </FormField>

            <FormField label="GST No" required error={errors.gstNo}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.gstNo}
                onChange={(e) => handleInputChange("gstNo", e.target.value)}
                placeholder="GSTIN"
              />
            </FormField>

            <FormField
              label="Payment Terms"
              required
              error={errors.paymentTerms}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.paymentTerms}
                onChange={(e) =>
                  handleInputChange("paymentTerms", e.target.value)
                }
                placeholder="e.g. Net 30"
              />
            </FormField>

            <FormField label="Employers" required error={errors.employees}>
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.employees}
                onChange={(e) => handleInputChange("employees", e.target.value)}
                placeholder="Number of employees"
              />
            </FormField>

            <FormField label="Turn Over">
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.turnOver}
                onChange={(e) => handleInputChange("turnOver", e.target.value)}
                placeholder="Annual turnover"
              />
            </FormField>

            <FormField label="Reason for Churn">
              <Autocomplete
                className="search-select3 col-6"
                fullWidth
                size="small"
                options={CHURN_REASONS}
                getOptionLabel={(option) => option.value || ""}
                value={
                  CHURN_REASONS.find((r) => r.value === formData.reasonChurn) ||
                  null
                }
                onChange={(_, val) =>
                  handleInputChange("reasonChurn", val?.value || "")
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select reason" />
                )}
              />
            </FormField>

            {/* Location Details */}
            <FormField label="Country" required error={errors.country}>
              <Autocomplete
                className="search-select3 col-6"
                fullWidth
                size="small"
                options={lookups.countries}
                getOptionLabel={(option) => option.name || ""}
                value={formData.country}
                onChange={(_, val) => {
                  handleInputChange("country", val);
                  if (val) handleInputChange("countryCode", val.phonecode);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Country" />
                )}
              />
            </FormField>

            <FormField label="State" required error={errors.state}>
              <Autocomplete
                className="search-select3 col-6"
                fullWidth
                size="small"
                options={lookups.states}
                getOptionLabel={(option) => option.name || ""}
                value={formData.state}
                disabled={!formData.country}
                onChange={(_, val) => handleInputChange("state", val)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select State" />
                )}
              />
            </FormField>

            <FormField label="City" required error={errors.city}>
              <Autocomplete
                className="search-select3 col-6"
                fullWidth
                size="small"
                options={lookups.cities}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option || ""
                }
                value={formData.city}
                disabled={!formData.state}
                onChange={(_, val) => handleInputChange("city", val)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select City" />
                )}
              />
            </FormField>

            <FormField
              label="Pin Code"
              required
              error={errors["address.pincode"]}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.address.pincode}
                onChange={(e) =>
                  handleInputChange("address.pincode", e.target.value)
                }
                placeholder="Pincode"
              />
            </FormField>

            <FormField
              label="Door No"
              required
              error={errors["address.doorNo"]}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.address.doorNo}
                onChange={(e) =>
                  handleInputChange("address.doorNo", e.target.value)
                }
                placeholder="Door/Building No"
              />
            </FormField>

            <FormField
              label="Street Name"
              required
              error={errors["address.streetName"]}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.address.streetName}
                onChange={(e) =>
                  handleInputChange("address.streetName", e.target.value)
                }
                placeholder="Street name"
              />
            </FormField>

            <FormField
              label="Area Name"
              required
              error={errors["address.areaName"]}
            >
              <TextField
                className="col-6 input-box2"
                fullWidth
                size="small"
                value={formData.address.areaName}
                onChange={(e) =>
                  handleInputChange("address.areaName", e.target.value)
                }
                placeholder="Area name"
              />
            </FormField>
          </Grid>

          <Grid
            container
            justifyContent="center"
            spacing={2}
            sx={{ mt: 4, pb: 2 }}
          >
            <Grid item>
              <CustomButton
                label="Create Account"
                Icon="saveIcon"
                onClick={handleSubmit}
                sx={{ minWidth: 160 }}
              />
            </Grid>
            <Grid item>
              <Cancelbutton onClick={() => setSave("create")} />
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Box>
  );
};

export default CreateAccountForm;
