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
  MenuItem,
  Select,
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
  requiredSpan,
} from "app/pages/widgets/StylesComponents";

let Transaction = [{ value: "Online" }, { value: "Cash" }, { value: "UPI" }];

const CreateSubscriptionForm = ({
  setCreateSubcriprion,
  scrollHeight,
  setListSubscription,
  GetSubscriptionRecords,
}) => {
  const [Plan, setPlan] = useState([]);
  const [customerDatas, setCustomerDatas] = useState([]);
  const [errors, setErrors] = useState({});

  const [cusname, setcusname] = useState("");
  const [planname, setplanname] = useState("");
  const [subscname, setsubscname] = useState("");
  const [noofuser, setnoofuser] = useState("");
  const [unitprice, setunitprice] = useState("");
  const [amount, setamount] = useState("");
  const [subscperiod, setsubscperiod] = useState("");
  // const [transtype, settranstype] = useState("");
  const [taxamount, settaxamount] = useState("");

  const [status, setStatus] = useState("active");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [storageSize, setStorageSize] = useState("");
  const [discount, setDiscount] = useState("");
  const [serverCost, setServerCost] = useState("");
  const [operationCost, setOperationCost] = useState("");

  const handleClickBack = () => {
    setcusname("");
    setplanname("");
    setsubscname("");
    setnoofuser("");
    setunitprice("");
    setamount("");
    setsubscperiod("");
    settaxamount("");
    setCreateSubcriprion(false);
    setListSubscription(true);
    setErrors({});
    setStatus("active");
    setStartDate(new Date().toISOString().split("T")[0]);
    setStorageSize("");
    setDiscount("");
    setServerCost("");
    setOperationCost("");

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

  const getCustomerRecords = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/AccountFullList/?Is_Deleted=False`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      console.log("Accountlist", response.data);
      setCustomerDatas(response.data || []);
    } catch (error) {
      console.error("Error fetching customer records:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getPlanRecords();
    getCustomerRecords();
  }, []);

  useEffect(() => {
    const p = parseFloat(unitprice) || 0;
    const t = parseFloat(taxamount) || 0;
    const s = parseFloat(serverCost) || 0;
    const o = parseFloat(operationCost) || 0;
    const d = parseFloat(discount) || 0;
    
    setamount(p + t + s + o - d);
  }, [unitprice, taxamount, serverCost, operationCost, discount]);

  const handleCreateSubscription = () => {
    let error = errorFilter({
      cusname: cusname?.Contact_Name || "",
      planname: planname?.Plan_Name || "",
      subscname,
      unitprice,
      subscperiod,
      noofuser,
      amount,
    });

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
      let calculatedEndDate = null;
      if (startDate && subscperiod) {
        if (subscperiod === "Monthly") calculatedEndDate = moment(startDate).add(1, 'months').format('YYYY-MM-DD');
        else if (subscperiod === "Quarterly") calculatedEndDate = moment(startDate).add(3, 'months').format('YYYY-MM-DD');
        else if (subscperiod === "Half Yearly") calculatedEndDate = moment(startDate).add(6, 'months').format('YYYY-MM-DD');
        else if (subscperiod === "Annual") calculatedEndDate = moment(startDate).add(1, 'years').format('YYYY-MM-DD');
      }

      let payload = {
        Organization_Id: localStorage.getItem("OrganizationId"),
        Customer_Name: cusname?.Contact_Name,
        Plan_Name: planname?.Plan_Name,
        Customer_Id: cusname?.id,
        Plan_Id: planname?.id,
        SubscriptionDate: startDate,
        No_Of_Users: noofuser,
        Base_Users: noofuser,
        UnitPrice: unitprice,
        Subscription_Name: subscname,
        SubscriptionPeriod: subscperiod,
        discount: discount || null,
        TaxAmount: taxamount,
        Transaction_Type: null,
        SuscriptionAmount: amount,
        Additional_Addon: null,
        Is_Deleted: false,
        Is_Archived: false,
        status: status,
        previous_subscription: null,
        start_date: startDate,
        end_date: calculatedEndDate,
        is_trial: status === "trial",
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
        
        // Preserve other existing properties
        Basestorage_Size: storageSize || null,
        Server_cost: serverCost || null,
        Operation_cost: operationCost || null,
        TaxPercentage: null,
        Additional_users: null,
        CancelledUsers: null,
        Additional_storage: null,
      };
      console.log("payload", payload);
      axios
        .post(`${BASE_URL}/superadmin/subscription/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          toast.success("Subscription is Created successfully");
          GetSubscriptionRecords();
          handleClickBack();
        })
        .catch((error) => {
          console.error("Subscription creation error:", error.response?.data || error.message);
          toast.error("Something Went Wrong");
        });
    }
  };

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>
            Subscription Name {requiredSpan}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Subscription Name"
            variant="outlined"
            value={subscname}
            onChange={(e) => {
              setsubscname(e.target.value);
            }}
          />
          <div className="red">{errors?.subscname}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>
            Customer Name {requiredSpan}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={customerDatas}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.Contact_Name) {
                  return option?.Contact_Name;
                }
                return "";
              }}
              value={cusname?.Contact_Name}
              onChange={(item, newvalue) => {
                setcusname(newvalue);
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Customer Name" />
              )}
            />
            <div className="red">{errors?.cusname}</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Plan Name {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={Plan}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.Plan_Name) {
                  return option?.Plan_Name;
                }
                return "";
              }}
              value={planname?.Plan_Name}
              onChange={(item, newvalue) => {
                setplanname(newvalue);
                setunitprice(Number(newvalue?.UnitPrice || 0));
                setnoofuser(newvalue?.No_Of_Users);
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Plan Name" />
              )}
            />
            <div className="red">{errors?.planname}</div>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>No of Users {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={noofuser}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="No of Users"
            variant="outlined"
            // onChange={(e) => {
            //   setplanname(e.target.value);
            // }}
          />
          <div className="red">{errors?.noofuser}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Price {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={unitprice}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            type="number"
            placeholder="Price"
            variant="outlined"
            // onChange={(e) => {
            //   setnoofmonth(e.target.value);
            // }}
          />
          <div className="red">{errors?.unitprice}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Tax Amount</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Tax Amount"
            type="number"
            variant="outlined"
            value={taxamount}
            onChange={(e) => {
              settaxamount(e.target.value);
            }}
          />
          <div className="red">{errors?.taxamount}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>
            Subscription Period {requiredSpan}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={["Monthly", "Quarterly", "Half Yearly", "Annual"]}
              value={subscperiod || null}
              onChange={(event, newValue) => {
                setsubscperiod(newValue || "");
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Subscription Period" />
              )}
            />
          </FormControl>
          <div className="red">{errors?.subscperiod}</div>
        </Grid>

        {/* <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Transaction Type</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={["Online", "Cash", "UPI"]}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option) {
                  return option;
                }
                return "";
              }}
              value={transtype}
              onChange={(item, newvalue) => {
                settranstype(newvalue);
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Transaction Type" />
              )}
            />
          </FormControl>
        </Grid> */}



        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Start Date {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            type="date"
            className="w-100 col-12 input-box2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Status {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={["trial", "active", "expired", "cancelled"]}
              getOptionLabel={(option) => {
                return option ? option.charAt(0).toUpperCase() + option.slice(1) : "";
              }}
              value={status || null}
              onChange={(event, newValue) => {
                setStatus(newValue || "");
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Status" />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Storage Size</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={storageSize}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Storage Size"
            type="number"
            variant="outlined"
            onChange={(e) => setStorageSize(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Operation Cost</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={operationCost}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Operation Cost"
            type="number"
            variant="outlined"
            onChange={(e) => setOperationCost(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Server Cost</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={serverCost}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Server Cost"
            type="number"
            variant="outlined"
            onChange={(e) => setServerCost(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Discount</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={discount}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Discount"
            type="number"
            variant="outlined"
            onChange={(e) => setDiscount(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Amount {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={amount}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Amount "
            type="number"
            variant="outlined"
          />
          <div className="red">{errors?.amount}</div>
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
          label="Save"
          Icon="saveIcon"
          onClick={handleCreateSubscription}
        />
        <Cancelbutton label="Cancel" onClick={handleClickBack} />
      </Div>
    </>
  );
};

export default CreateSubscriptionForm;
