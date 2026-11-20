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
  CircularProgress,
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
import axios from "axios";
import { apiConfig } from "app/services/config";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
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
  requiredSpan,
  toLocaleCurrency,
} from "app/pages/widgets/StylesComponents";
import { useQuery } from "react-query";

let Transaction = [{ value: "Online" }, { value: "Cash" }, { value: "UPI" }];

const CreatePayments = ({ setOpen, datas, GetRecords, type = "post" }) => {
  const [Plan, setPlan] = useState([]);
  const [customerDatas, setCustomerDatas] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  const [addFields, setAddFields] = useState({
    Customer_Name: "",
    Payment_Date: "",
    Invoice_Date: "",
    Invoice_No: "",
    Invoice_Id: "",
    paid_amount: "",
    InvoiceAmount: "",
    Payment_Mode: "",
    Payment_details: "",
    Transaction_No: "",
    Customer_Id: "",
    Subscription_Id: "",
    status: "success",
    InvoiceFor: "",
    TaxAmount: 0,
    NetAmount: 0,
    Is_Archived: false,
    Is_Deleted: false,
  });

  const [seriesValue, setSeriesValue] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [errors, setErrors] = useState({});

  const handleClickBack = () => {
    setAddFields({
      Customer_Name: "",
      Payment_Date: "",
      Invoice_Date: "",
      Invoice_No: "",
      Invoice_Id: "",
      paid_amount: "",
      InvoiceAmount: "",
      Payment_Mode: "",
      Payment_details: "",
      Transaction_No: "",
      Customer_Id: "",
      Subscription_Id: "",
      status: "success",
      InvoiceFor: "",
    });

    setOpen(false);
  };

  // onChange Invoice name
  const onChangeCustomer = (e, value) => {
    console.log("newValuesss", value);

    let list = { ...addFields };
    list.Customer_Name = value?.Subscription_Id?.Customer_Name || "";
    list.InvoiceAmount = value?.InvoiceAmount || 0;
    list.TaxAmount = value?.TaxAmount || 0;
    list.NetAmount = value?.NetAmount || 0;
    list.paid_amount = value?.NetAmount || 0;
    list.Invoice_Id = value?.id || "";
    list.Invoice_No = value?.Invoice_Id || "";
    list.Invoice_Date = value?.Invoice_Date?.split("T")[0] || "";
    list.Customer_Id = value?.Customer_Id?.id || "";
    list.Subscription_Id = value?.Subscription_Id?.id || "";
    list.InvoiceFor = value?.Subscription_Id?.Customer_Name || "";
    setAddFields(list);
  };

  const getPlanRecords = () => {
    axios
      .get(BASE_URL + "/superadmin/planlist/?page=1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("plan", response.data);
        setPlan(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // invoice datas
  const FetchInvoiceData = async () => {
    setLoadingInvoice(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/InvoiceFullList/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        }
      );
      setInvoiceData(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingInvoice(false);
    }
  };

  // generateInvoice function
  const generateInvoice = async (invid) => {
    let payload = {
      id: invid,
      Is_Archived: true,
      Updated_Date: new Date().toISOString(),
      Organization_Id: localStorage.getItem("OrganizationId"),
      Created_By: localStorage.getItem("UserId"),
      Updated_By: localStorage.getItem("UserId"),
    };

    try {
      const res = await axios.patch(
        `${BASE_URL}/superadmin/Invoice/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        }
      );
      if (res.data) {
        toast.success("Invoice is Created successfully");
        GetRecords();
        handleClickBack();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleCreateSubscription = () => {
    let error = errorFilter(addFields);
    console.log("error", addFields, error);
    setErrors(error);

    if (Object.keys(error)?.length > 0) {
      toast.warning(
        `some fields are empty ${Object.keys(error)?.map((item) => item)}${
          Object.keys(error)?.length > 0 && ", "
        }`,
        {
          position: "top-right",
          autoClose: 500,
        }
      );
    } else {
      let payload = {
        Organization_Id: localStorage.getItem("OrganizationId"),
        Invoice_Id: addFields?.Invoice_Id,
        Payment_Id: "",
        Payment_Mode: addFields?.Payment_Mode,
        Payment_details: addFields?.Payment_details,
        Transaction_No: addFields?.Transaction_No,
        Customer_Name: addFields?.Customer_Name,
        Customer_Id: addFields?.Customer_Id,
        Subscription_Id: addFields?.Subscription_Id,
        InvoiceFor: addFields?.InvoiceFor,
        status: addFields?.status || "success",
        Invoice_Date: addFields?.Invoice_Date,
        Payment_Date: addFields?.Payment_Date,
        InvoiceAmount: addFields?.InvoiceAmount,
        TaxAmount: addFields?.TaxAmount,
        NetAmount: addFields?.NetAmount,
        paid_amount: addFields?.paid_amount,
        Is_Archived: false,
        Is_Deleted: false,
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
      };
      if (type === "put") {
        payload.id = datas?.id;
      }

      console.log("payload", payload);
      axios?.[type === "invoice" ? "post" : type](
        `${BASE_URL}/superadmin/Paymentdetails/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        }
      )
        .then((res) => {
          toast.success("Subscription is Created successfully");
          generateInvoice(addFields?.Invoice_Id);
        })
        .catch((error) => {
          console.log(error);
          toast.error("Somthing Went Wrong");
        });
    }
  };

  useEffect(() => {
    const transactionSeries = async () => {
      const series = await fetchTransactionSeries("Payments");

      setSeriesValue(series);
    };
    transactionSeries();
    FetchInvoiceData();
  }, []);

  useEffect(() => {
    let invoice = invoiceData?.find(
      (inv) =>
        inv?.id ==
        (typeof datas?.Invoice_Id !== "string" ? datas?.Invoice_Id : datas?.id)
    );
    console.log("Invoice : ", invoice, invoiceData);

    if (type === "put" && datas) {
      setAddFields({
        Customer_Name: datas?.Customer_Name || "",
        Payment_Date: datas?.Payment_Date || "",
        Invoice_Date: invoice?.Invoice_Date?.split("T")[0],
        Invoice_Id: datas?.Invoice_Id || "",
        Invoice_No: invoice?.Invoice_Id || "",
        Transaction_No: datas?.Transaction_No || "",
        paid_amount: datas?.paid_amount || "",
        InvoiceAmount: datas?.InvoiceAmount || "",
        Customer_Id: invoice?.Customer_Id?.id || "",
        Subscription_Id: invoice?.Subscription_Id?.id || "",
        InvoiceFor: invoice?.Subscription_Id?.Customer_Name || "",
        status: datas?.status || "success",
        TaxAmount: datas?.TaxAmount || 0,
        NetAmount: datas?.NetAmount || 0,
        Payment_Mode: datas?.Payment_Mode || "",
        Payment_details: datas?.Payment_details || "",
      });
    } else if (type === "invoice") {
      setAddFields((prev) => ({
        ...prev,
        Customer_Name:
          invoice?.Subscription_Id?.Customer_Name ||
          datas?.Customer_Name ||
          datas?.Customername,
        Invoice_Date: datas?.Invoice_Date?.split("T")[0] || datas?.RequestDate,
        Invoice_Id: datas?.id,
        Invoice_No: datas?.Invoice_Id || datas?.Invoice_No,
        paid_amount: datas?.NetAmount || datas?.UserTotalAmount,
        InvoiceAmount: datas?.InvoiceAmount || datas?.UserTotalAmount,
        Customer_Id:
          invoice?.Customer_Id?.id ||
          datas?.Customer_Id?.id ||
          datas?.Customer_Id,
        Subscription_Id:
          invoice?.Subscription_Id?.id ||
          datas?.Subscription_Id?.id ||
          datas?.Subscription_Id,
        InvoiceFor:
          invoice?.Subscription_Id?.Customer_Name ||
          datas?.InvoiceFor ||
          "invoice",
        status: "success",
        TaxAmount: datas?.TaxAmount || 0,
        NetAmount: datas?.NetAmount || datas?.UserTotalAmount,
      }));
    }
  }, [datas, invoiceData]);

  console.log("Invoice : ", type, datas, invoiceData);

  return (
    <>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>
            Transaction No {requiredSpan}
          </Typography>
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
              value={addFields?.Transaction_No}
              onChange={(e) =>
                setAddFields({ ...addFields, Transaction_No: e.target.value })
              }
              className={`col-12 input-box2`}
              name="Transaction_No"
              id="outlined-basic"
              placeholder="Transaction No"
              variant="outlined"
            />
          </FormControl>
          {errors?.Transaction_No && (
            <Div style={{ color: "red" }}>{errors?.Transaction_No}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Invoice No {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          {type === "invoice" ? (
            <TextField
              sx={{
                "& fieldset": {
                  borderRadius: "5px",
                },
                MinWidth: "325px",
                width: "100%",
              }}
              value={addFields?.Invoice_No}
              name="Invoice_No"
              className={`col-12 input-box2`}
              id="outlined-basic"
              type="text"
              placeholder="Invoice No"
              variant="outlined"
            />
          ) : (
            <FormControl className="col-12">
              <Autocomplete
                className="search-select3"
                name="Invoice_No"
                options={invoiceData}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option && option?.Invoice_Id) {
                    return option?.Invoice_Id;
                  }
                  return "";
                }}
                value={addFields?.Invoice_No}
                onChange={(e, newValue) => {
                  onChangeCustomer(e, newValue);
                }}
                loading={loadingInvoice}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Invoice No"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingInvoice ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          )}
          {errors?.Invoice_No && (
            <Div style={{ color: "red" }}>{errors?.Invoice_No}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Invoice Date {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.Invoice_Date}
            name="Invoice Date"
            className={`col-12 input-box2`}
            id="outlined-basic"
            type="date"
            placeholder="Invoice Date"
            variant="outlined"
          />
          {errors?.Invoice_Date && (
            <Div style={{ color: "red" }}>{errors?.Invoice_Date}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Customer Name {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.Customer_Name}
            name="CustomerName"
            // onChange={(e) =>
            //   setAddFields({ ...addFields, CustomerName: e.target.value })
            // }
            className={`col-12 input-box2`}
            id="outlined-basic"
            placeholder="Customer Name"
            variant="outlined"
          />
          {errors?.Customer_Name && (
            <Div style={{ color: "red" }}>{errors?.Customer_Name}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Payment Date {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.Payment_Date}
            onChange={(e) =>
              setAddFields({ ...addFields, Payment_Date: e.target.value })
            }
            className={`col-12 input-box2`}
            name="Payment_Date"
            id="outlined-basic"
            type="date"
            placeholder="Payment Date"
            variant="outlined"
            inputProps={{
              min: new Date().toISOString().split("T")[0],
            }}
          />
          {errors?.Payment_Date && (
            <Div style={{ color: "red" }}>{errors?.Payment_Date}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>
            Invoice Amount {requiredSpan}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.InvoiceAmount}
            name="InvoiceAmount"
            // onChange={(e) =>
            //   setAddFields({ ...addFields, InvoiceAmount: e.target.value || 0 })
            // }
            className={`col-12 input-box2`}
            id="outlined-basic"
            placeholder="Invoice Amount"
            variant="outlined"
          />
          {errors?.InvoiceAmount && (
            <Div style={{ color: "red" }}>{errors?.InvoiceAmount}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Paid Amount {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.paid_amount}
            name="PaidAmount"
            type="number"
            onChange={(e) =>
              setAddFields({ ...addFields, paid_amount: e.target.value })
            }
            className={`col-12 input-box2`}
            id="outlined-basic"
            placeholder="Paid Amount"
            variant="outlined"
          />
          {errors?.paid_amount && (
            <Div style={{ color: "red" }}>{errors?.paid_amount}</Div>
          )}
        </Grid>
        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>Payment Mode {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <Autocomplete
            className="search-select3"
            name="PayMethod"
            options={[
              { PayMethod: "Credit Cards" },
              { PayMethod: "Debit Cards" },
              { PayMethod: "Cash" },
              { PayMethod: "Paper Checks" },
              { PayMethod: "eChecks" },
              { PayMethod: "Digital Payments" },
              { PayMethod: " Money Orders" },
            ]}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option && option?.PayMethod) {
                return option?.PayMethod;
              }
              return "";
            }}
            value={addFields?.Payment_Mode}
            onChange={(e, newValue) => {
              setAddFields({
                ...addFields,
                Payment_Mode: newValue?.PayMethod || "",
              });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Payment Mode" />
            )}
          />
          {errors?.Payment_Mode && (
            <Div style={{ color: "red" }}>{errors?.Payment_Mode}</Div>
          )}
        </Grid>

        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}>
          <Typography sx={input_label}>
            Payment Details {requiredSpan}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
          <TextField
            sx={{
              "& fieldset": {
                borderRadius: "5px",
              },
              MinWidth: "325px",
              width: "100%",
            }}
            value={addFields?.Payment_details}
            name="Payment_details"
            onChange={(e) =>
              setAddFields({ ...addFields, Payment_details: e.target.value })
            }
            className={`col-12 input-box2`}
            id="outlined-basic"
            placeholder="Payment Details"
            variant="outlined"
          />
          {errors?.Payment_details && (
            <Div style={{ color: "red" }}>{errors?.Payment_details}</Div>
          )}
        </Grid>
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
          onClick={handleCreateSubscription}
        />
        <Cancelbutton label="Cancel" onClick={handleClickBack} />
      </Div>


    </>
  );
};

export default CreatePayments;
