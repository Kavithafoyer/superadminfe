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
// import {
//   ButtonStyle,
//   ComponentHeading,
//   DialogBoxCancelButton,
//   DialogBoxSaveButton,
//   DisplayFlex,
//   FontStyle,
// } from "../widgets/CRMStyles";
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
import { BASE_URL, BASE_URL } from "app/services/auth-services";

const EditInstance = ({
  setCreateInstance,
  setListInstance,
  scrollHeight,
  createInstance,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("urlParams", urlParams);
  const instanceid = urlParams.get("id");
  console.log("instanceid", instanceid);

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
    instanceReqNo: "",
    customerName: "",
    subDomainName: "",
    customer_id: "",
  });

  const [Customer_Details, setCustomer_Details] = useState({
    Company_Name: "",
    Company_Email: "",
  });

  const [ids, setids] = useState({
    Subscription_ID: "",
    Plan_ID: "",
    Addon_ID: "",
  });

  const [error, setErrors] = useState({});

  const handleClickBack = () => {
    setCreateInstance(false);
    setListInstance(true);
    setErrors({});
  };

  const GettingTenant_Email_ID = async () => {
    console.log("GettingTenant_Email_ID..");
    console.log("${Number(fieldData.customer_id)}", fieldData.customer_id);

    try {
      await axios
        .get(
          `${BASE_URL}/superadmin/AccountCRUD/?id=${Number(
            createInstance?.Customer_id,
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          if (res.data) {
            toast.success(res.data, { position: "top-right", autoClose: 2000 });
            setFieldData({
              ...fieldData,
              instanceReqNo: createInstance?.RequestId,
              customerName: createInstance?.Company_Name,
              customer_id: createInstance?.Customer_id,
            });
            setCustomer_Details({
              ...Customer_Details,
              Company_Name: res?.data?.Organization_Name,
              Company_Email: res?.data?.Mail,
            });
            console.log("res.data", res.data);
            console.log("Got Customer Details");
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";
  // Create database instance
  const createDataBaseFunc = async () => {
    // console.log("createDataBaseFunc",createDataBaseFunc)
    console.log(
      "localStorage?.getItem(UserId)",
      localStorage?.getItem("UserId"),
    );
    const keys = Object.keys(localStorage);

    // Iterate over each key and log its corresponding value
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    });

    let payload = {
      Instance_Request_No: fieldData?.instanceReqNo,
      Customer_Name: fieldData?.customerName,
      Domain_Name: fieldData?.subDomainName,
      Database_Name: fieldData?.subDomainName,
      Created_By: localStorage?.getItem("UserId"),
      Updated_By: localStorage?.getItem("UserId"),
    };
    try {
      await axios
        .post(`${BASE_URL}/superadmin/InstanceCreationtCRUD/`, payload, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("get All Data createDataBaseFunc", res);
          if (res.data) {
            toast.success(res.data);
            setStep(step + 1);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const VisitTenant_URL = () => {
    // window.open(Tenant_URL, '_blank');
    window.location.href = Tenant_URL;
    setCheckBox({ ...checkBox, loginCheck: !checkBox?.loginCheck });
    setvisitBtn(true);
  };

  const Migratedatafun = async () => {
    // MyURL:'https://64.227.149.3:8000/superadmin/subscription/'
    console.log("Migratedatafun");
    //Getting data form super Admin database for subscription model
    try {
      await axios
        .get(
          `${BASE_URL}/superadmin/subscription/?Subscription_Id=${createInstance?.SubscriptionId}`,
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        )
        .then(async (sub_res) => {
          console.log("Migratedatafun in subscription", sub_res);
          if (sub_res.data) {
            toast.success(sub_res.data);

            //Posting subscription model data in Tenant Database
            // const Tenant_URL = `https://${fieldData?.subDomainName}.crmfarm.app`
            // const Tenant_URL = `https://backend.crmfarm.app`
            const Tenant_URL_BE = `https://backend.crmfarm.app/${fieldData?.subDomainName}`;

            // const Tenant_URL = `https://crmfarm.local:8000/${fieldData?.subDomainName}`
            setTenant_URL(`https://crmfarm.app/${fieldData?.subDomainName}`);

            console.log("Tenant_URL", Tenant_URL);

            console.log("sub domain:", fieldData?.subDomainName);
            setids({ ...ids, Plan_ID: sub_res?.data?.Plan_Id?.id });
            console.log("setids.Plan_ID:", ids.Plan_ID);
            console.log("sub_res?.data:", sub_res?.data);
            console.log(
              "sub_res.data.Organization_Id.id",
              sub_res?.data?.Organization_Id?.id,
            );
            console.log(
              "sub_res.data.Subscription_Id:",
              sub_res?.data?.Subscription_Id,
            );
            console.log(
              "sub_res.data.Customer_Id.id:",
              sub_res?.data?.Customer_Id?.id,
            );
            console.log("sub_res.data.Plan_Id.id:", sub_res?.data?.Plan_Id?.id);
            console.log(
              "sub_res.data.SubscriptionDate",
              sub_res?.data?.SubscriptionDate,
            );
            console.log(
              "sub_re?s.data?.No_Of_Users:",
              sub_res?.data?.No_Of_Users,
            );
            console.log(
              "sub_res?.data?.Basestorage_Size:",
              sub_res?.data?.Basestorage_Size,
            );
            console.log("sub_res?.data?.TaxAmount:", sub_res?.data?.TaxAmount);
            console.log(
              "sub_res?.data?.Transaction_Type",
              sub_res?.data?.Transaction_Type,
            );
            console.log(
              "sub_res?.data?.SuscriptionAmount",
              sub_res?.data?.SuscriptionAmount,
            );
            console.log(
              "sub_res?.data?.Additional_users",
              sub_res?.data?.Additional_users,
            );
            console.log(
              "sub_res?.data?.CancelledUsers",
              sub_res?.data?.CancelledUsers,
            );
            console.log(
              "sub_res?.data?.Additional_Addon",
              sub_res?.data?.Additional_Addon,
            );
            console.log(
              "sub_res?.data?.Additional_storage",
              sub_res?.data?.Additional_storage,
            );
            console.log(
              "sub_res?.data?.InvoicegenFlag",
              sub_res?.data?.InvoicegenFlag,
            );
            console.log(
              "sub_res?.data?.SubInvoicePaidFlag:",
              sub_res?.data?.SubInvoicePaidFlag,
            );

            console.log("Tenant_URL_150", Tenant_URL_BE);

            let subscription_payload = {
              Subscription_Id: sub_res?.data?.Subscription_Id,
              SubscriptionDate: sub_res?.data?.SubscriptionDate,
              No_Of_Users: sub_res?.data?.No_Of_Users,
              Basestorage_Size: sub_res?.data?.Basestorage_Size,
              UnitPrice: sub_res?.data?.UnitPrice,
              SubscriptionPeriod: sub_res?.data?.SubscriptionPeriod,
              TaxAmount: sub_res?.data?.TaxAmount,
              Transaction_Type: sub_res?.data?.Transaction_Type,
              SuscriptionAmount: sub_res?.data?.SuscriptionAmount,
              Additional_users: sub_res?.data?.Additional_users,

              CancelledUsers: 3,
              Additional_Addon: "1",
              Additional_storage: 1,
              InvoicegenFlag: sub_res?.data?.InvoicegenFlag,
              SubInvoicePaidFlag: sub_res?.data?.SubInvoicePaidFlag,
              Organization_Id: sub_res?.data?.Organization_Id?.id,
              Customer_Id: sub_res?.data?.Customer_Id?.id,
              Customer_Name: sub_res?.data?.Customer_Id?.Organization_Name,
              Plan_Id: sub_res?.data.Plan_Id?.id,
            };
            console.log("subscription_payload", subscription_payload);
            console.log(
              "Tenant_URL............................_178",
              Tenant_URL_BE,
            );

            try {
              await axios
                .post(
                  `${Tenant_URL_BE}/useradmin/subscription/`,
                  subscription_payload,
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    // db: item,Authorization: `Bearer ${token}`,
                  },
                )
                .then((res) => {
                  console.log("Migratedatafun in subscription", res);
                  if (res.data) {
                    toast.success(res.data);
                    // setStep(step + 1);
                    console.log("res.data", res.data);
                    console.log("Subscription success");
                    Migratedatafun_Plan(Tenant_URL_BE);
                  }
                });
            } catch (error) {
              console.error(error);
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  const Migratedatafun_Plan = async (Tenant_URL_BE) => {
    console.log("Migratedatafun_Plan");
    console.log("ids?.Plan_ID:", ids?.Plan_ID);
    //Getting data form super Admin database for Plan model ${ids?.Plan_ID}
    try {
      await axios
        .get(`${BASE_URL}/superadmin/plan/?id=1`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then(async (Plan_res) => {
          console.log("Migratedatafun in subscription", Plan_res);
          if (Plan_res?.data) {
            toast.success(Plan_res?.data);
            console.log("Plan_res?.data:", Plan_res?.data);

            let plan_payload = {
              Plan_Id: Plan_res?.data?.Plan_Id,
              Plan_Name: Plan_res?.data?.Plan_Name,
              Country: Plan_res?.data?.Country,
              UnitPrice: Plan_res?.data?.UnitPrice,
              Trialperiod: Plan_res?.data?.Trialperiod,
              Currency_Type: Plan_res?.data?.Currency_Type,
              No_Of_Users: Plan_res?.data?.No_Of_Users,
              AllocatedStorage: Plan_res?.data?.AllocatedStorage,
              PlanDetails: Plan_res?.data?.PlanDetails,
              Is_Active_Flg: Plan_res?.data?.Is_Active_Flg,
              Is_Deleted: Plan_res?.data?.Is_Deleted,
              Is_Archived: Plan_res?.data?.Is_Archived,
              Organization_Id: Plan_res?.data?.Organization_Id?.id,
              Noofcontacts: Plan_res?.data?.Noofcontacts,
              Noofmonths: Plan_res?.data?.Noofmonths,
              Plantype: Plan_res?.data?.Plantype,
              Setupfees: Plan_res?.data?.Setupfees,
              Addstorage: Plan_res?.data?.Addstorage,
              AllocatedAddons: Plan_res?.data?.AllocatedAddons,
            };

            console.log("plan_payload", plan_payload);
            console.log(
              "Plan_res?.data?.AllocatedAddons",
              Plan_res?.data?.AllocatedAddons,
            );
            const ADDON = Plan_res?.data?.AllocatedAddons;
            try {
              await axios
                .post(`${Tenant_URL_BE}/useradmin/plan/`, plan_payload, {
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                })
                .then((res) => {
                  console.log("Migratedatafun in Plan", res);
                  if (res.data) {
                    toast.success(res.data);
                    Migratedatafun_Addon(Tenant_URL_BE, ADDON);
                    console.log("res.data", res.data);
                    console.log("success");
                  }
                });
            } catch (error) {
              console.error(error);
            }
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  const Migratedatafun_Addon = async (Tenant_URL_BE, ADDON) => {
    console.log("Migratedatafun_Addon");
    // Iterate over the list and call the API for each id
    ADDON.map(async (item) => {
      //Getting data form super Admin database for Plan model ${ids?.Plan_ID}
      try {
        console.log("ADDON:", ADDON);
        await axios
          .get(`${BASE_URL}/superadmin/Addon/?Addon_Id=${item.Addon_Id}`, {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })
          .then(async (Addon_res) => {
            console.log("Migratedatafun in Addon_res", Addon_res);
            if (Addon_res?.data) {
              toast.success(Addon_res?.data);
              console.log("Addon_res?.data:", Addon_res?.data);

              let Addon_payload = {
                // "Addon_Id": "ADN000000001",
                // "Name": "Outlook",
                // "Currency_code": "Indian",
                // "Country":"Indian",
                // "Started_Date": "2022-11-21",
                // "Is_Active": true,
                // "Price": 1000.0,
                // "Is_Deleted": false,

                Addon_Id: Addon_res?.data?.Addon_Id,
                Name: Addon_res?.data?.Name,
                Currency_code: Addon_res?.data.Currency_code,
                Country: Addon_res?.data.Currency_code,
                Started_Date: Addon_res?.data.Started_Date,
                Is_Active: Addon_res?.data?.Is_Active,
                Price: Addon_res?.data?.Price,
                Is_Deleted: Addon_res?.data.Is_Deleted,
              };

              console.log("Addon_payload", Addon_payload);

              try {
                await axios
                  .post(
                    `${Tenant_URL_BE}/useradmin/AddonCRUD/`,
                    Addon_payload,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                      },
                    },
                  )
                  .then((res) => {
                    console.log("Migratedatafun in Addon_payload", res);
                    if (res.data) {
                      toast.success(res.data);
                      console.log("res.data", res.data);
                      console.log("xxxxxx_Addon success_xxxxxxxx");
                      setCheckBox({
                        ...checkBox,
                        finalstep: !checkBox?.finalstep,
                      });
                      setmigrateBtn(true);
                    }
                  });
              } catch (error) {
                console.error(error);
              }
            }
          });
      } catch (error) {
        console.error(error);
      }
    });
  };

  const nextButtonFunc = () => {
    let errors = {};

    switch (step) {
      case 1:
        {
          Object.keys(fieldData)?.map((field) => {
            if (!Boolean(fieldData[field])) {
              errors[field] = field;
              console.log("errors", errors);
            }
          });
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

  // useEffect(()=>{
  //   setFieldData({...fieldData,instanceReqNo:createInstance?.RequestId,customerName:createInstance?.Company_Name, customer_id:createInstance?.Customer_id})
  // },[createInstance])

  const [instanceData, setInstanceData] = useState({});
  const [instanceFind, setInstanceFind] = useState({});

  const getInstanceData = () => {
    if (instanceid) {
      console.log("instanceidCheck", instanceid);
      axios
        .get(`${BASE_URL}/superadmin/InstanceCreationtCRUD/?id=${instanceid}`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("results in contacts", res.data);
          if (res) {
            setInstanceData(res.data);
            setStep(3);
            setCheckBox({
              ...checkBox,
              Cond_1: true,
              Cond_2: true,
              loginCheck: true,
              finalstep: true,
            });
            setFieldData({
              ...fieldData,
              subDomainName: (res.data?.Domain_Name || "").toLowerCase().replace(/[^a-z]/g, ""),
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  const getAllDatas = async () => {
    console.log("getAllDatas function");
    try {
      await axios
        .get(`${BASE_URL}/superadmin/InstanceRequestpendingList/`, {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("get All Data", res);
          if (res) {
            console.log("List API Result", res.data?.results);
            let obj = res.data?.results?.find(
              (f) => f?.RequestId == instanceData?.RequestId,
            );
            setInstanceFind(obj);
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDatas();
  }, [instanceData]);

  const SendingMailToTenant = () => {
    console.log("Mail Sent to Tenant");
    console.log(
      "Customer_Details.Company_Email",
      Customer_Details.Company_Email,
    );
    let payload = {
      MailSubject: "Welcome to CRMFarm Family",
      MailBody: `<!DOCTYPE html><html><head><title>Hi</title></head><body><h1 style='color: green'>Welcome to CRMFarm Family</h1><img width='1' height='1' src= '{{url}}'><b>CRMFarm is now accessible for you via the URL below.</b><p>https://crmfarm.app/${instanceid}/</p><br><a href='https://crmfarm.app/${instanceid}/'></a><br>User Name: admin<br>Password: Admin@123<br>Note: Please change your password immediately for security reasons. <b></body></html>`,
      RecevierMailId: instanceData?.Customer_Email,
      UserId: localStorage.getItem("UserId"),
    };
    axios
      .post(`${BASE_URL}/superadmin/InstanceMailSent/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then(async (res) => {
        console.log("email sending resspp", res);
        let instanceRes = await axios.patch(
          `${BASE_URL}/superadmin/InstanceRequestCRUD/`,
          { id: instanceFind?.id, InstanceCreatedFlag: true },
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        setFinishDialog(true);
        setCreateInstance(false);
        setListInstance(true);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  useEffect(() => {
    getInstanceData();
  }, [instanceid]);

  useEffect(() => {
    GettingTenant_Email_ID();
  }, [createInstance]);

  return (
    <JumboContentLayoutMain>
      <>
        <Typography sx={[ComponentHeading, { fontWeight: 600 }]}>
          Create Instance
        </Typography>
        {step > 0 && (
          <Div
            sx={{
              border: "1px solid lightgrey",
              p: 2,
              mt: 2,
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
                    value={instanceData?.Instance_Request_No}
                    className="input-box"
                    sx={{ width: "100%" }}
                    id="outlined-basic"
                    placeholder="Instance Request No"
                    variant="outlined"
                  />
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
                    className="input-box"
                    value={instanceData?.Customer_Name}
                    sx={{ width: "100%" }}
                    id="outlined-basic"
                    placeholder="Customer Name"
                    variant="outlined"
                  />
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
                        subDomainName: e?.target?.value.toLowerCase().replace(/[^a-z]/g, ""),
                      })
                    }
                    className="input-box"
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
                    className="input-box"
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
              <Button
                onClick={Migratedatafun}
                disabled={migrateBtn}
                sx={[DialogBoxSaveButton, ButtonStyle, FontStyle, {}]}
              >
                Migrate data
              </Button>
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
              <Button
                onClick={VisitTenant_URL}
                disabled={visitBtn}
                sx={[DialogBoxSaveButton, ButtonStyle, FontStyle, {}]}
              >
                Visit
              </Button>
            </Div>
          </Div>
        )}

        <Div sx={[DisplayFlex, { mt: 2 }]}>
          <Div>
            <Button
              sx={[DialogBoxCancelButton, ButtonStyle, FontStyle]}
              onClick={handleClickBack}
            >
              Cancel
            </Button>
          </Div>
          <Div sx={{ ml: 1 }}>
            <Button
              onClick={nextButtonFunc}
              // disabled={
              //   step == 1
              //     ? Object.values(fieldData)?.some((field) => !Boolean(field))
              //     : step == 2
              //     ? !Boolean(checkBox?.Cond_1) && !Boolean(checkBox?.Cond_2)
              //     : step == 3 && !Boolean(checkBox?.finalstep)
              // }
              sx={[DialogBoxSaveButton, ButtonStyle, FontStyle, {}]}
            >
              {step == 3 ? "Send Mail" : `${"Next Step"}`}
            </Button>
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
              URL https://crmfarm.app/${instanceid} has been handed over to the
              customer's email address.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, {}]}
              onClick={() => {
                setFinishDialog(false);
              }}
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </JumboContentLayoutMain>
  );
};

export default EditInstance;
