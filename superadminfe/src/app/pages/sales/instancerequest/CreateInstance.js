import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import {
  MdDelete,
  MdOutlinePayment,
  MdOutlineFileUpload,
} from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL, Tenantname } from "app/services/auth-services";
import moment from "moment";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
  input_label,
} from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  errorFilter,
  fetchTransactionSeries,
} from "app/pages/widgets/StylesComponents";

const CreateInstance = ({
  setCreateInstance,
  datas,
  type = "post",
  setListInstance,
  getinstancerequestrecords,
}) => {
  const [seriesValue, setSeriesValue] = useState("");
  const [errors, setErrors] = useState({});
  const [invoiceData, setInvoiceData] = useState([]);

  const [addFields, setAddFields] = useState({
    InstanceName: "",
    RequestDate: "",
    InvoiceNo: "",
    CustomerName: "",
    PlanName: "",
    NoofUsers: "",
    SubscriptionId: "",
    Amount: "",
    Url: "",
    product_type: "",
  });

  const handleClickBack = () => {
    setAddFields({
      InstanceName: "",
      RequestDate: "",
      InvoiceNo: "",
      CustomerName: "",
      PlanName: "",
      NoofUsers: "",
      SubscriptionId: "",
      Amount: "",
      Url: "",
      product_type: "",
    });

    setListInstance(false);
  };

  // onChange Invoice name
  const onChangeCustomer = (e, value) => {
    console.log("newValuesss", value);

    let list = { ...addFields };
    list.CustomerName = value?.Customer_Name
      ? value?.Customer_Name
      : value?.Invoice_Id?.Subscription_Id?.Customer_Name || "";
    list.PlanName = value?.Invoice_Id?.Subscription_Id?.Plan_Name || "";
    list.planid = value?.Invoice_Id?.Subscription_Id?.Plan_Id || "";
    list.InvoiceNo = value?.Invoice_Id?.Invoice_Id || "";
    list.InvoiceId = value?.Invoice_Id?.id || "";
    list.NoofUsers =
      (value?.Invoice_Id?.Subscription_Id?.Base_Users || 0) +
      (value?.Invoice_Id?.Subscription_Id?.Additional_users || 0);
    list.SubscriptionId = value?.Invoice_Id?.Subscription_Id?.id || "";
    list.Subscription_Id =
      value?.Invoice_Id?.Subscription_Id?.Subscription_Id || "";
    list.Amount = value?.paid_amount || 0;
    setAddFields(list);
  };

  const handleCreateInstance = async () => {
    const { product_type, ...validationFields } = addFields;
    let error = errorFilter(validationFields);

    setErrors(error);
    if (Object.keys(error)?.length > 0) {
      toast.warning(
        `some fields are empty ${Object.keys(error)?.map((item) => item)}${
          Object.keys(error)?.length > 0 && ", "
        }`,
        {
          position: "top-right",
          autoClose: 500,
        },
      );
    } else {
      let payload = {
        // RequestId:
        //   seriesValue === "Manual" || type == "put" ? addFields?.RequestId : "",
        SubscriptionId: addFields?.Subscription_Id,
        Subscription_Id: addFields?.SubscriptionId,
        PlanName: addFields?.PlanName,
        plan_id: addFields?.planid,
        Invoice_Id: addFields?.InvoiceId,
        Invoice_No: addFields?.InvoiceNo,
        RequestDate: addFields?.RequestDate,
        CustomerName: addFields?.CustomerName,
        InstanceName: addFields?.InstanceName,
        URLName: addFields?.Url,
        Noofusers: addFields?.NoofUsers,
        Paidamount: Math.round(addFields?.Amount || 0),
        UserId: localStorage.getItem("UserId"),
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
        Organization_Id: localStorage.getItem("OrganizationId"),
        Created_Date: new Date().toISOString().split("T")[0],
        Updated_Date: new Date().toISOString().split("T")[0],
        InstanceCreatedFlag: false,
        InstCreatedDate: new Date().toISOString().split("T")[0],
        product_type: addFields?.product_type,
      };
      console.log("payload", payload);
      if (type == "put") {
        payload.id = datas?.id;
      }
      await axios?.[type](`${BASE_URL}/superadmin/InstanceRequest/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
        .then((res) => {
          console.log("2", res.data);
          if (res) {
            toast.success("Instance Request is created successfully");
            getinstancerequestrecords();
            handleClickBack();
          } else {
            toast.error("Check your data");
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("Somthing Went Wrong");
        });
    }
  };

  // invoice datas
  const FetchInvoiceData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/PaymentsFullList/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      let list = [];
      const uniqueIds = new Set();

      response.data?.forEach((item) => {
        if (!uniqueIds.has(item.Invoice_Id?.id)) {
          uniqueIds.add(item.Invoice_Id?.id);
          list.push(item);
        }
      });

      console.log("list : ", uniqueIds, list, response);
      setInvoiceData(list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const transactionSeries = async () => {
      const series = await fetchTransactionSeries("InstanceRequest");

      setSeriesValue(series);
    };
    transactionSeries();
    FetchInvoiceData();
  }, []);

  useEffect(() => {
    if (type === "put" && datas) {
      setAddFields({
        RequestId: datas?.RequestId,
        InstanceName: datas?.InstanceName,
        RequestDate: datas?.RequestDate,
        InvoiceNo: datas?.Invoice_No,
        planid: datas?.plan_id?.id,
        InvoiceId: datas?.Invoice_Id?.id,
        CustomerName: datas?.CustomerName,
        PlanName: datas?.PlanName,
        NoofUsers: datas?.Noofusers,
        Subscription_Id: datas?.SubscriptionId,
        SubscriptionId: datas?.Subscription_Id?.id,
        Amount: datas?.Paidamount || 0,
        Url: datas?.URLName,
        product_type: datas?.product_type || "",
      });
    }
  }, [datas]);

  return (
    <>
      <>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {/* <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Request Id </Typography>
          </Grid> */}

          {/* <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <FormControl className="col-12">
              <TextField
                sx={{
                  "& fieldset": { borderRadius: "5px" },
                  MinWidth: "325px",
                  width: "100%",
                }}
                className={`col-12 input-box2 w-100`}
                name="RequestId"
                id="outlined-basic"
                variant="outlined"
                value={addFields?.RequestId}
                onChange={(e) =>
                  setAddFields({ ...addFields, RequestId: e.target.value })
                }
                placeholder="# Request Id"
                disabled={seriesValue == "Automatic" ? true : ""}
              />
            </FormControl>
            {errors?.RequestId && (
              <Div style={{ color: "red" }}>{errors?.RequestId}</Div>
            )}
          </Grid> */}

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Instance Name</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <FormControl className="col-12">
              <TextField
                sx={{
                  "& fieldset": {
                    borderRadius: "5px",
                  },
                  MinWidth: "325px",
                  width: "100%",
                }}
                value={addFields?.InstanceName}
                onChange={(e) => {
                  const instanceName = e.target.value
                    ?.toLocaleLowerCase()
                    ?.trim();
                  let url = "";

                  if (Tenantname === "CRMFarm") {
                    url = `https://${instanceName}.crmfarm.app`;
                  } else if (Tenantname === "felix") {
                    url = `https://${instanceName}.felixhr.com`;
                  } else if (Tenantname === "bolt") {
                    url = `https://${instanceName}.boltmm.in`;
                  }

                  setAddFields({
                    ...addFields,
                    InstanceName: e.target.value,
                    Url: url,
                  });
                }}
                className={`col-12 input-box2 w-100`}
                name="Instance Name"
                id="outlined-basic"
                placeholder="Instance Name"
                variant="outlined"
              />
            </FormControl>
            {errors?.InstanceName && (
              <Div style={{ color: "red" }}>{errors?.InstanceName}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Request Date</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.RequestDate}
              name="Invoice Date"
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              onChange={(e) =>
                setAddFields({ ...addFields, RequestDate: e.target.value })
              }
              type="date"
              placeholder="Request Date"
              variant="outlined"
            />{" "}
            {errors?.RequestDate && (
              <Div style={{ color: "red" }}>{errors?.RequestDate}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Invoice No</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <FormControl className="col-12">
              <Autocomplete
                className="search-select3"
                name="InvoiceNo"
                options={invoiceData}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.Invoice_Id?.Invoice_Id) {
                    return option?.Invoice_Id?.Invoice_Id;
                  }
                  return "";
                }}
                value={addFields?.InvoiceNo}
                onChange={(e, newValue) => {
                  onChangeCustomer(e, newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Invoice No" />
                )}
              />
            </FormControl>
            {errors?.InvoiceNo && (
              <Div style={{ color: "red" }}>{errors?.InvoiceNo}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Customer Name</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.CustomerName}
              name="CustomerName"
              // onChange={(e) =>
              //   setAddFields({ ...addFields, CustomerName: e.target.value })
              // }
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              placeholder="Customer Name"
              variant="outlined"
            />
            {errors?.CustomerName && (
              <Div style={{ color: "red" }}>{errors?.CustomerName}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Plan Name</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.PlanName}
              className={`col-12 input-box2 w-100 `}
              name="PlanName"
              id="outlined-basic"
              placeholder="Plan Name"
              variant="outlined"
            />
            {errors?.PlanName && (
              <Div style={{ color: "red" }}>{errors?.PlanName}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>No of Users</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.NoofUsers}
              name="NoofUsers"
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              onChange={(e) =>
                setAddFields({ ...addFields, NoofUsers: e.target.value })
              }
              placeholder="No of Users"
              variant="outlined"
            />
            {errors?.NoofUsers && (
              <Div style={{ color: "red" }}>{errors?.NoofUsers}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Subscription Id</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.SubscriptionId}
              name="SubscriptionId"
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              placeholder="Subscription Id"
              variant="outlined"
            />
            {errors?.SubscriptionId && (
              <Div style={{ color: "red" }}>{errors?.SubscriptionId}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Amount</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.Amount}
              name="Amount"
              type="number"
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              placeholder="Amount"
              variant="outlined"
            />
            {errors?.Amount && (
              <Div style={{ color: "red" }}>{errors?.Amount}</Div>
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>URL</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <TextField
              value={addFields?.Url}
              name="Url"
              className={`col-12 input-box2 w-100`}
              id="outlined-basic"
              placeholder="https://example.crmfarm.app"
              variant="outlined"
              onChange={(e) =>
                setAddFields({ ...addFields, Url: e.target.value })
              }
            />
            {errors?.Url && <Div style={{ color: "red" }}>{errors?.Url}</Div>}
          </Grid>

          {/* <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
            <Typography sx={input_label}>Product Type</Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
            <FormControl className="col-12">
              <Autocomplete
                className="search-select3"
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
                  ].find((item) => item.value === addFields?.product_type) || ""
                }
                onChange={(e, newValue) => {
                  setAddFields({
                    ...addFields,
                    product_type: newValue?.value || "",
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Product Type" />
                )}
              />
            </FormControl>
            {errors?.product_type && (
              <Div style={{ color: "red" }}>{errors?.product_type}</Div>
            )}
          </Grid> */}
        </Grid>

        <Div
          sx={{
            my: 3,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            gap: 3,
          }}
        >
          <CustomButton
            label={type === "put" ? "Update" : "Save"}
            Icon="saveIcon"
            onClick={handleCreateInstance}
          />
          <Cancelbutton label="Cancel" onClick={handleClickBack} />
        </Div>
      </>
    </>
  );
};

export default CreateInstance;
