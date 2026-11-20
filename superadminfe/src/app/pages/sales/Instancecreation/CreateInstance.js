import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
  input_label,
} from "../../widgets/CRMStyles";
import { toast } from "react-toastify";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import {
  axiosInstance,
  Cancelbutton,
  CustomButton,
} from "app/pages/widgets/StylesComponents";
import { handleError } from "app/pages/components/ErrorHandler/handleError";

const CreateInstance = ({
  setCreateInstance,
  setListInstance,
  scrollHeight,
  createInstance,
}) => {
  const navigate = useNavigate();

  console.log("CreateInstance", createInstance);
  const [step, setStep] = useState(1);

  const [migrateBtn, setmigrateBtn] = useState(false);
  const [visitBtn, setvisitBtn] = useState(false);

  const [FinishDialog, setFinishDialog] = useState(false);

  const [checkBox, setCheckBox] = useState({
    Cond_1: false,
    Cond_2: false,
    loginCheck: false,
    finalstep: false,
    // subDominCreated: false,
  });

  const [Tenant_URL, setTenant_URL] = useState("");

  const [fieldData, setFieldData] = useState({
    instanceReqNo: createInstance?.RequestId,
    customerName: createInstance?.CustomerName,
    subDomainName: createInstance?.InstanceName,
    customer_id: createInstance?.Subscription_Id?.Customer_Id,
    Subscription_Id: createInstance?.Subscription_Id?.id,
    product_type: "",
  });
  useEffect(() => {
    setFieldData({
      instanceReqNo: createInstance?.RequestId,
      customerName: createInstance?.CustomerName,
      subDomainName: createInstance?.InstanceName,
      customer_id: createInstance?.Subscription_Id?.Customer_Id,
      Subscription_Id: createInstance?.Subscription_Id?.id,
      product_type: "",
    });
  }, [createInstance]);

  const [Customer_Details, setCustomer_Details] = useState({
    Company_Name: "",
    Company_Email: "",
  });

  const [error, setErrors] = useState({});

  const handleClickBack = () => {
    setCreateInstance(false);
    setListInstance(true);
    setErrors({});
  };
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  const header = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const GettingTenant_Email_ID = async () => {
    console.log("📩 Getting Tenant Email ID...");

    const customerId = createInstance?.Subscription_Id?.Customer_Id;

    if (!customerId) {
      console.warn("⚠️ Customer ID is missing.");
      toast.error("Customer ID not found in subscription.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/superadmin/AccountCRUD/?id=${Number(customerId)}`,
        header,
      );

      if (res?.data) {
        const { Organization_Name, Mail } = res.data;

        setCustomer_Details((prev) => ({
          ...prev,
          Company_Name: Organization_Name,
          Company_Email: Mail,
        }));

        toast.success("Customer details fetched.", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("✅ Customer details:", res.data);
      } else {
        toast.warning("No customer data received.", {
          position: "top-right",
          autoClose: 2000,
        });
        console.warn("⚠️ Empty response for customer data.");
      }
    } catch (error) {
      console.error("❌ Error fetching tenant email:", error);
      toast.error("Failed to fetch tenant email.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Create database instance
  const createDataBaseFunc = async () => {
    const keys = Object.keys(localStorage);

    // Iterate over each key and log its corresponding value
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    });

    try {
      let payload = {
        Instance_Request_No: fieldData?.instanceReqNo,
        Customer_Name: fieldData?.customerName,
        Customer_Id: Number(fieldData?.customer_id),
        Domain_Name: fieldData?.subDomainName,
        Subscription_Id: fieldData?.Subscription_Id,
        Database_Name: fieldData?.subDomainName,
        Customer_Email: Customer_Details?.Company_Email,
        Created_By: Number(localStorage?.getItem("UserId")),
        Updated_By: Number(localStorage?.getItem("UserId")),
        product_type: fieldData?.product_type,
      };
      const handledata = await handleError(
        axiosInstance.post(`/superadmin/InstanceCreationtCRUD/`, payload),
      );
      if (handledata) {
        toast.success("Created Successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        localStorage.setItem("InstanceId", handledata?.id);
        setStep(step + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Migratedatafun = async () => {
    console.log(" Starting data migration...");

    const subscriptionId = createInstance?.Subscription_Id?.id;
    const subDomainName = fieldData?.subDomainName;

    if (!subscriptionId || !subDomainName) {
      console.error(
        "❌ Required data missing: Subscription ID or subdomain name.",
      );
      toast.error("Missing Subscription ID or Subdomain. Migration aborted.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    let Tenant_URL_BE = "";
    let Tenant_Frontend_URL = "";

    if (Tenantname === "bolt") {
      Tenant_URL_BE = `https://backend.boltmm.in/${subDomainName}`;

      Tenant_Frontend_URL = `https://${subDomainName}.boltmm.in/`;
    } else if (Tenantname === "felix") {
      Tenant_URL_BE = `https://backend.felixhr.com/${subDomainName}`;
      Tenant_Frontend_URL = `https://${subDomainName}.felixhr.com/`;
    } else {
      Tenant_URL_BE = `https://backend.crmfarm.app/${subDomainName}`;
      Tenant_Frontend_URL = `https://${subDomainName}.crmfarm.app/`;
    }

    // Set Tenant Frontend URL for further use
    setTenant_URL(Tenant_Frontend_URL);

    try {
      const sub_res = await axios.get(
        `${BASE_URL}/superadmin/subscription/?id=${subscriptionId}`,
        header,
      );

      const subscriptionData = sub_res?.data;

      if (!subscriptionData) {
        console.error("❌ No subscription data found.");
        toast.error("Subscription data not found.", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      console.log("✅ Subscription data fetched:", subscriptionData);

      // Migrate Plan (Step 1)
      await Migratedatafun_Plan(
        Tenant_URL_BE,
        subscriptionData?.Plan_Id?.id,
        sub_res,
      );
    } catch (error) {
      console.error("❌ Error in Migratedatafun:", error);
      toast.error("Migration failed. See console for details.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const Migratedatafun_Plan = async (Tenant_URL_BE, id, sub_res) => {
    console.log("➡️ Migratedatafun_Plan triggered");

    if (!id || !Tenant_URL_BE) {
      console.error("❌ Missing required parameters: id or Tenant_URL_BE");
      toast.error("Missing required plan migration parameters.", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const planResponse = await axios.get(
        `${BASE_URL}/superadmin/plan/?id=${id}`,
        header,
      );

      const planData = planResponse?.data;
      if (!planData) {
        toast.error("Plan data not found.", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      console.log("✅ Plan data received", planData);

      const plan_payload = {
        ID: planData.id,
        Plan_Id: planData.Plan_Id,
        Plan_Name: planData.Plan_Name,
        Country: planData.Country,
        UnitPrice: planData.UnitPrice,
        Trialperiod: planData.Trialperiod,
        Currency_Type: planData.Currency_Type,
        No_Of_Users: planData.No_Of_Users,
        AllocatedStorage: planData.AllocatedStorage,
        PlanDetails: planData.PlanDetails,
        Organization_Id: planData.Organization_Id?.id,
        Noofcontacts: planData.Noofcontacts,
        Noofmonths: planData.Noofmonths,
        Plantype: planData.Plantype,
        Setupfees: planData.Setupfees,
        Addstorage: planData.Addstorage,
        AllocatedAddons: planData.AllocatedAddons,
      };

      console.log("📦 Plan payload to migrate:", plan_payload);
      let Plan_URL = "";

      if (Tenantname === "bolt") {
        Plan_URL = `${Tenant_URL_BE}/Erpapp/plan/`;
      } else if (Tenantname === "felix") {
        Plan_URL = `${Tenant_URL_BE}/felix/plan/`;
      } else {
        Plan_URL = `${Tenant_URL_BE}/useradmin/plan/`;
      }

      const planPostResponse = await axios.post(Plan_URL, plan_payload, header);

      if (planPostResponse.data) {
        toast.success("Plan migrated successfully.", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("✅ Plan migration success:", planPostResponse.data);
        Migratedatafun_Subscription(Tenant_URL_BE, sub_res); // Proceed to subscription migration
      } else {
        toast.error("Plan migration failed - no response data.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("❌ Error in Migratedatafun_Plan:", error);
      toast.error("Failed to migrate plan. Check console for details.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const Migratedatafun_Subscription = async (Tenant_URL_BE, sub_res) => {
    const subDomain = fieldData?.subDomainName;
    if (!subDomain) {
      toast.error("Subdomain name is missing!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const subData = sub_res?.data;

    if (!subData) {
      toast.error("Invalid subscription response data!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const payload = {
      ID: subData.id,
      Subscription_Id: subData.Subscription_Id,
      SubscriptionDate: subData.SubscriptionDate,
      No_Of_Users: subData.No_Of_Users,
      Basestorage_Size: subData.Basestorage_Size,
      UnitPrice: subData.UnitPrice,
      SubscriptionPeriod: subData.SubscriptionPeriod,
      TaxAmount: subData.TaxAmount,
      Transaction_Type: "online",
      TaxPercentage: subData.TaxPercentage,
      SuscriptionAmount: subData.SuscriptionAmount,
      Additional_users: subData.Additional_users,
      CancelledUsers: subData.CancelledUsers,
      Additional_Addon: subData.Additional_Addon,
      Additional_storage: subData.Additional_storage,
      InvoicegenFlag: subData.InvoicegenFlag,
      SubInvoicePaidFlag: subData.SubInvoicePaidFlag,
      Organization_Id: subData.Organization_Id?.id,
      Customer_Id: subData.Customer_Id?.id,
      Customer_Name: subData.Customer_Id?.Organization_Name,
      Plan_Id: subData.Plan_Id?.id,
    };

    console.log("Sending subscription payload:", payload);
    let Subscription_URL = "";

    if (Tenantname === "bolt") {
      Subscription_URL = `${Tenant_URL_BE}/Erpapp/subscription/`;
    } else if (Tenantname === "felix") {
      Subscription_URL = `${Tenant_URL_BE}/felix/subscription/`;
    } else {
      Subscription_URL = `${Tenant_URL_BE}/useradmin/subscription/`;
    }

    try {
      const response = await axios.post(Subscription_URL, payload, header);

      const result = response?.data;

      if (result) {
        toast.success("Subscription migrated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log("Subscription response:", result);
        setCheckBox((prev) => ({ ...prev, finalstep: !prev.finalstep }));
        setmigrateBtn(true);
      } else {
        toast.warning("No response received from subscription API.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Subscription migration error:", error);
      toast.error("Subscription migration failed. Check console for details.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const SendingMailToTenant = async () => {
    console.log("📧 Sending mail to tenant...");

    const orgId = localStorage.getItem("OrganizationId");
    const userId = localStorage.getItem("UserId");
    const customerEmail = Customer_Details?.Company_Email;

    if (!customerEmail || !Tenant_URL || !orgId || !userId) {
      toast.error("Missing required data to send email.", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error("❌ Missing data: Email, Tenant_URL, orgId, or userId");
      return;
    }

    const payload = {
      MailSubject: "Welcome to CRMFarm Family",
      Organization_Id: orgId,
      MailBody: `
      <!DOCTYPE html>
      <html>
      <head><title>Welcome</title></head>
      <body>
        <h1 style='color: green;'>Welcome to CRMFarm Family</h1>
        <p><b>CRMFarm is now accessible for you via the URL below:</b></p>
        <p><a href='${Tenant_URL}' target='_blank'>${Tenant_URL}</a></p>
        <br>
        <p><b>Login Credentials:</b></p>
        <ul>
          <li><b>Username:</b> admin</li>
          <li><b>Password:</b> Admin@123</li>
        </ul>
        <p><i>Note: Please change your password immediately for security reasons.</i></p>
      </body>
      </html>
    `,
      RecevierMailId: customerEmail,
      UserId: userId,
    };

    try {
      const res = await axios.post(
        `${BASE_URL}/superadmin/InstanceMailSent/`,
        payload,
        header,
      );

      console.log("✅ Email sent successfully:", res?.data);
      toast.success("Welcome email sent!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Update InstanceRequest status
      const updatePayload = {
        RequestId: fieldData?.instanceReqNo,
        InstanceCreatedFlag: true,
      };

      await axios.patch(
        `${BASE_URL}/superadmin/InstanceRequestlist/`,
        updatePayload,
        header,
      );

      console.log("✅ Instance request updated.");
      toast.success("Instance request marked as created.", {
        position: "top-right",
        autoClose: 2000,
      });

      setFinishDialog(true);
      setCreateInstance(false);
      setListInstance(true);
    } catch (error) {
      console.error("❌ Error in SendingMailToTenant:", error);
      toast.error("Error occurred while sending email or updating instance.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const VisitTenant_URL = () => {
    window.location.href = Tenant_URL;
    setCheckBox({ ...checkBox, loginCheck: !checkBox?.loginCheck });
    setvisitBtn(true);
  };

  const nextButtonFunc = () => {
    let errors = {};
    console.log("inside function");

    switch (step) {
      case 1:
        {
          Object.keys(fieldData)?.map((field) => {
            if (!Boolean(fieldData[field]) && field != "product_type") {
              errors[field] = field;
              console.log("errors", errors);
            }
          });
          if (!fieldData?.product_type) {
            errors.product_type = "product_type";
          }
          if (Object.keys(errors)?.length == 0) {
            createDataBaseFunc();
            // setStep(step + 1);
          }
        }
        break;
      case 2:
        {
          if (Boolean(checkBox?.Cond_1) && Boolean(checkBox?.Cond_2)) {
            setStep(step + 1);
          }
        }
        break;
      case 3:
        {
          if (Boolean(checkBox?.finalstep)) {
            //   setStep(step + 1);
            console.log("finalstep");
            SendingMailToTenant();
          }
        }
        break;
      default:
        toast.error("please give a value", {
          position: "top-right",
          autoClose: 2000,
        });
    }

    setErrors(errors);
  };

  useEffect(() => {
    GettingTenant_Email_ID();
  }, [createInstance]);

  return (
    <>
      {/* <Typography sx={[ComponentHeading, { fontWeight: 600 }]}>
        Create Instance
      </Typography> */}
      {step > 0 && (
        <Div
          sx={{
            border: "1px solid lightgrey",
            p: 2,
            mt: 5,
            mb: 5,
            borderRadius: "5px",
          }}
        >
          <Grid container spacing={2}>
            <Grid container alignItems={"center"} item xs={12} md={6}>
              <Grid item xs={12} md={4} mt={1.5}>
                <Typography
                  className="input-label"
                  sx={{ color: step != 1 && "gray !important" }}
                >
                  Instance Request No <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  disabled={true}
                  // {step != 1}
                  value={createInstance?.RequestId}
                  onChange={(e) =>
                    setFieldData({
                      ...fieldData,
                      instanceReqNo: e?.target?.value,
                    })
                  }
                  className="input-box2"
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  placeholder="Instance Request No"
                  variant="outlined"
                />
                {Boolean(error?.instanceReqNo) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "10px" }}>
                    <span className="required">*</span> Please enter a instance
                    request no
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container alignItems={"center"} item xs={12} md={6}>
              <Grid item xs={12} md={4} mt={1.5}>
                <Typography
                  className="input-label"
                  sx={{ color: step != 1 && "gray !important" }}
                >
                  Customer Name <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  disabled={true}
                  className="input-box2"
                  value={createInstance?.CustomerName}
                  onChange={(e) =>
                    setFieldData({
                      ...fieldData,
                      customerName: e?.target?.value,
                    })
                  }
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  placeholder="Customer Name"
                  variant="outlined"
                />
                {Boolean(error?.customerName) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "10px" }}>
                    <span className="required">*</span> Please enter a customer
                    name
                  </Typography>
                )}
              </Grid>
            </Grid>

            {/* <Grid xs={12} mt={1.5}>
              <Div>
                <FormControlLabel
                  sx={{ ml: 1 }}
                  label={
                    <Typography
                      className="input-label"
                      sx={{ color: step != 1 && "gray !important" }}
                    >
                      Sub Domain creation created
                    </Typography>
                  }
                  control={
                    <Checkbox
                      color="info"
                      disabled={step != 1}
                      checked={Boolean(checkBox?.subDominCreated)}
                      onChange={() =>
                        setCheckBox({
                          ...checkBox,
                          subDominCreated: !checkBox?.subDominCreated,
                        })
                      }
                    />
                  }
                />
              </Div>
            </Grid> */}

            <Grid container alignItems={"center"} item xs={12} md={6}>
              <Grid item xs={12} md={4} mt={1.5}>
                <Typography
                  className="input-label"
                  sx={{ color: step != 1 && "gray !important" }}
                >
                  Sub Domain Name <span className="required">*</span>
                </Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  disabled={step != 1}
                  value={fieldData?.subDomainName}
                  onChange={(e) =>
                    setFieldData({
                      ...fieldData,
                      subDomainName: e?.target?.value,
                    })
                  }
                  className="input-box2"
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  placeholder="Sub Domain Name"
                  variant="outlined"
                />
                {Boolean(error?.subDomainName) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "10px" }}>
                    <span className="required">*</span> Please enter a sub
                    domain name
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Grid container alignItems={"center"} item xs={12} md={6}>
              <Grid item xs={12} md={4} mt={1.5}>
                <Typography
                  className="input-label"
                  sx={{ color: step != 1 && "gray !important" }}
                >
                  Database Name <span className="required">*</span>
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  disabled={step != 1}
                  value={fieldData?.subDomainName}
                  className="input-box2"
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  placeholder="Database Name"
                  variant="outlined"
                />
                {Boolean(error?.subDomainName) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "10px" }}>
                    <span className="required">*</span> Please enter a domain
                    name
                  </Typography>
                )}
              </Grid>
            </Grid>
            {/* <Grid container alignItems={"center"} item xs={12} md={6}>
              <Grid item xs={12} md={4} mt={1.5}>
                <Typography
                  className="input-label"
                  sx={{ color: step != 1 && "gray !important" }}
                >
                  Product Type <span className="required">*</span>
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <FormControl className="col-12" sx={{ m: 0 }}>
                  <Autocomplete
                    disabled={step != 1}
                    className="input-box2"
                    options={[
                      { label: "Education CRM", value: "education" },
                      { label: "Retail CRM", value: "retail" },
                      { label: "IT CRM", value: "it" },
                    ]}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") return option;
                      return option?.label || "";
                    }}
                    value={
                      [
                        { label: "Education CRM", value: "education" },
                        { label: "Retail CRM", value: "retail" },
                        { label: "IT CRM", value: "it" },
                      ].find(
                        (item) => item.value === fieldData?.product_type,
                      ) || null
                    }
                    onChange={(e, newValue) => {
                      setFieldData({
                        ...fieldData,
                        product_type: newValue?.value || "",
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Product Type"
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                </FormControl>
                {Boolean(error?.product_type) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "10px" }}>
                    <span className="required">*</span> Please select a Product
                    Type
                  </Typography>
                )}
              </Grid>
            </Grid> */}
          </Grid>
        </Div>
      )}

      {step > 1 && (
        <Div
          sx={{
            border: "1px solid lightgrey",
            p: 2,
            mt: 2,
            borderRadius: "5px",
          }}
        >
          <Div>
            <FormControlLabel
              disabled={step != 2}
              label={
                <Typography
                  className="input-label"
                  sx={{ color: step != 2 && "gray !important" }}
                >
                  All tables copied from the master database
                </Typography>
              }
              control={
                <Checkbox
                  color="info"
                  checked={Boolean(checkBox?.Cond_1)}
                  onChange={() =>
                    setCheckBox({ ...checkBox, Cond_1: !checkBox?.Cond_1 })
                  }
                />
              }
            />
          </Div>

          <Div>
            <FormControlLabel
              disabled={step != 2}
              label={
                <Typography
                  className="input-label"
                  sx={{ color: step != 2 && "gray !important" }}
                >
                  Establish Tenant Credentials in the Tenant Database (
                  <span style={{ color: "#00b4d8" }}>
                    {fieldData?.subDomainName || "No Database Name"}
                  </span>
                  )
                </Typography>
              }
              control={
                <Checkbox
                  color="info"
                  checked={Boolean(checkBox?.Cond_2)}
                  onChange={() =>
                    setCheckBox({ ...checkBox, Cond_2: !checkBox?.Cond_2 })
                  }
                />
              }
            />
          </Div>
        </Div>
      )}

      {step > 2 && (
        <Div
          sx={{
            border: "1px solid lightgrey",
            p: 2,
            mt: 2,
            borderRadius: "5px",
          }}
        >
          <Div
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              onClick={() => {
                Boolean(checkBox.finalstep)
                  ? toast.success("migrate successfully", {
                      position: "top-right",
                      autoClose: 2000,
                    })
                  : toast.error("please click migrate button", {
                      position: "top-right",
                      autoClose: 2000,
                    });
              }}
              disabled={step != 3}
              label={
                <Typography
                  className="input-label"
                  sx={{ color: step != 3 && "gray !important" }}
                >
                  Transfer Subscription information in Tenant Database
                </Typography>
              }
              control={
                <Checkbox
                  color="info"
                  checked={Boolean(checkBox?.finalstep)}

                  // onChange={() =>
                  //   setCheckBox({
                  //     ...checkBox,
                  //     finalstep: !checkBox?.finalstep,
                  //   })
                  // }
                />
              }
            />

            <CustomButton
              label="Migrate"
              Icon=""
              onClick={Migratedatafun}
              disabled={migrateBtn}
            />
          </Div>

          <Div
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              disabled={Boolean(checkBox?.finalstep)}
              label={
                <Typography
                  className="input-label"
                  sx={{ color: step != 2 && "gray !important" }}
                >
                  Login Check
                </Typography>
              }
              control={
                <Checkbox
                  color="info"
                  checked={Boolean(checkBox?.loginCheck)}
                  onChange={() =>
                    setCheckBox({
                      ...checkBox,
                      loginCheck: !checkBox?.loginCheck,
                    })
                  }
                />
              }
            />

            <CustomButton
              label="Visit"
              Icon=""
              onClick={VisitTenant_URL}
              disabled={visitBtn}
            />
          </Div>
        </Div>
      )}

      <Div sx={[DisplayFlex, { mt: 2 }]}>
        <Div>
          <Cancelbutton label="Cancel" onClick={handleClickBack} />
        </Div>
        <Div sx={{ ml: 1 }}>
          <CustomButton
            width={"130px"}
            label={step == 3 ? "Send Mail" : "Next Step"}
            Icon={step == 3 ? "sendIcon" : "nextIcon"}
            onClick={nextButtonFunc}
          />
        </Div>
      </Div>
      <Dialog
        open={FinishDialog}
        onClose={() => setFinishDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        xs={12}
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "black",
              lineHeight: 2,
            }}
          >
            URL(`{Tenant_URL}`) has been handed over to the customer's email
            address.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton
            label="Ok"
            Icon=""
            onClick={() => {
              setFinishDialog(false);
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateInstance;
