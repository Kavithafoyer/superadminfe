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
  Checkbox,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useGetAddonListQuery } from "app/pages/settings/addons/AddonAPI";
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

const EditSubscription = ({
  setEditSubscription,
  scrollHeight,
  setListSubscription,
  editdatas,
  GetSubscriptionRecords,
}) => {
  const { data: addonListData } = useGetAddonListQuery();
  const [addons, setAddons] = useState([]);
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

  const [fields, setFields] = useState({
    cusname: "",
    planname: "",
    subscname: "",
    noofuser: "",
    unitprice: "",
    taxamount: "",
    subscperiod: "",
    amount: "",
    status: "",
    startDate: "",
    storageSize: "",
    discount: "",
    taxPercentage: "",
    additionalUsers: "",
    cancelledUsers: "",
    additionalAddOns: "",
    additionalStorage: "",
    baseUsers: "",
  });

  const [taxamount, settaxamount] = useState("");
  const [save, setSave] = useState(false);

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
      console.error(
        "Error fetching customer records:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    getPlanRecords();
    getCustomerRecords();
  }, []);

  const handleClickBack = () => {
    setcusname("");
    setplanname("");
    setsubscname("");
    setnoofuser("");
    setunitprice("");
    setamount("");

    setsubscperiod("");
    // settranstype("");
    settaxamount("");
    setEditSubscription(false);
    setListSubscription(true);
    setErrors({});
  };

  const handleEditSubscription = async () => {
    // Only validate the required fields (marked with * in the form)
    let error = errorFilter({
      subscname: fields?.subscname,
      cusname: fields?.cusname,
      planname: fields?.planname,
      noofuser: fields?.noofuser,
      unitprice: fields?.unitprice,
      taxamount: fields?.taxamount,
      subscperiod: fields?.subscperiod,
      amount: fields?.amount,
      startDate: fields?.startDate,
      status: fields?.status,
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
      let payload = {
        id: editdatas?.id,
        Customer_Name: fields?.cusname,
        Customer_Id: fields?.customerId,
        Plan_Id: fields?.planId,
        Plan_Name: fields?.planname,
        No_Of_Users: fields?.noofuser,
        Base_Users: fields?.baseUsers,
        UnitPrice: fields?.unitprice,
        Subscription_Name: fields?.subscname,
        SubscriptionPeriod: fields?.subscperiod,
        TaxAmount: fields?.taxamount,
        Transaction_Type: "",
        SuscriptionAmount: fields?.amount,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
        status: fields?.status,
        start_date: fields?.startDate,
        SubscriptionDate: fields?.startDate,
        Basestorage_Size: fields?.storageSize,
        discount: fields?.discount,
        TaxPercentage: fields?.taxPercentage,
        Additional_users: fields?.additionalUsers,
        CancelledUsers: fields?.cancelledUsers,
        Additional_Addon: addons.map((a) => a.id),
        Additional_storage: fields?.additionalStorage,
        Server_cost: editdatas?.Server_cost || null,
        Operation_cost: editdatas?.Operation_cost || null,
        Is_Deleted: false,
        Is_Archived: false,
      };
      console.log("payload", payload);
      await axios
        .put(`${BASE_URL}/superadmin/subscription/`, payload, {
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
            toast.success("Subscription is Updated successfully");
            handleClickBack();
            GetSubscriptionRecords();
          } else {
            toast.error("Check your data");
          }
        })
        .catch((error) => {
          console.error(
            "Subscription update error:",
            error.response?.data || error.message,
          );
          toast.error("Something Went Wrong");
        });
    }
  };

  useEffect(() => {
    if (editdatas) {
      console.log(
        "editdatas : ",
        editdatas,
        editdatas?.Customer_Id?.Contact_Name,
        editdatas?.Plan_Id?.Plan_Name,
      );

      setFields((prev) => ({
        ...prev,
        cusname: editdatas?.Customer_Id?.Contact_Name,
        customerId: editdatas?.Customer_Id?.id,
        planname: editdatas?.Plan_Id?.Plan_Name,
        planId: editdatas?.Plan_Id?.id,
        subscname: editdatas?.Subscription_Name,
        noofuser: editdatas?.No_Of_Users ?? "",
        baseUsers: editdatas?.Base_Users ?? "",
        unitprice: editdatas?.UnitPrice ?? "",
        amount: editdatas?.SuscriptionAmount ?? "",
        subscperiod: editdatas?.SubscriptionPeriod || "",
        taxamount: editdatas?.TaxAmount ?? "",
        status: editdatas?.status || "active",
        startDate:
          editdatas?.start_date || new Date().toISOString().split("T")[0],
        storageSize: editdatas?.Basestorage_Size || "",
        discount: editdatas?.discount || "",
        taxPercentage: editdatas?.TaxPercentage || "",
        additionalUsers: editdatas?.Additional_users || "",
        cancelledUsers: editdatas?.CancelledUsers || "",
        additionalStorage: editdatas?.Additional_storage || "",
      }));
    }
  }, [editdatas]);

  useEffect(() => {
    if (editdatas?.Additional_Addon && addonListData) {
      let addonIds = [];
      try {
        if (Array.isArray(editdatas.Additional_Addon)) {
          addonIds = editdatas.Additional_Addon;
        } else if (typeof editdatas.Additional_Addon === 'string') {
          addonIds = editdatas.Additional_Addon.startsWith('[') 
            ? JSON.parse(editdatas.Additional_Addon) 
            : editdatas.Additional_Addon.split(',').map(id => Number(id.trim()));
        } else if (typeof editdatas.Additional_Addon === 'number') {
          addonIds = [editdatas.Additional_Addon];
        }
      } catch (e) {
        addonIds = [];
      }
      const selectedAddons = addonListData.filter((a) =>
        addonIds.includes(a.id) || addonIds.includes(String(a.id))
      );
      setAddons(selectedAddons);
    } else {
      setAddons([]);
    }
  }, [editdatas, addonListData]);

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
            value={fields?.subscname}
            onChange={(e) => {
              setFields((prev) => ({ ...prev, subscname: e.target.value }));
            }}
          />{" "}
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
                if (typeof option === "string") return option;
                return option?.Contact_Name || "";
              }}
              isOptionEqualToValue={(option, value) =>
                option?.Contact_Name === value ||
                option?.Contact_Name === value?.Contact_Name
              }
              value={fields?.cusname || null}
              onChange={(item, newvalue) => {
                setFields((prev) => ({
                  ...prev,
                  cusname: newvalue?.Contact_Name || "",
                  customerId: newvalue?.id || "",
                }));
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Customer Name" />
              )}
            />
          </FormControl>{" "}
          <div className="red">{errors?.cusname}</div>
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
                if (typeof option === "string") return option;
                return option?.Plan_Name || "";
              }}
              isOptionEqualToValue={(option, value) =>
                option?.Plan_Name === value ||
                option?.Plan_Name === value?.Plan_Name
              }
              value={fields?.planname || null}
              onChange={(item, newvalue) => {
                setFields((prev) => ({
                  ...prev,
                  planname: newvalue?.Plan_Name || "",
                  planId: newvalue?.id || "",
                  unitprice: Number(newvalue?.UnitPrice || 0),
                  noofuser: newvalue?.No_Of_Users || "",
                  amount: Number(newvalue?.UnitPrice || 0),
                }));
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Plan Name" />
              )}
            />
          </FormControl>{" "}
          <div className="red">{errors?.planname}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>No of Users {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.baseUsers}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="No of Users"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({ ...prev, noofuser: e.target.value }))
            }
          />{" "}
          <div className="red">{errors?.noofuser}</div>
        </Grid>

        {/* <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Base Users</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.baseUsers}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Base Users"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({ ...prev, baseUsers: e.target.value }))
            }
          />
        </Grid> */}

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Price {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.unitprice}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            type="number"
            placeholder="Price"
            variant="outlined"
            // onChange={(e) => {
            //   setnoofmonth(e.target.value);
            // }}
          />{" "}
          <div className="red">{errors?.unitprice}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Tax Amount {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Tax Amount"
            type="number"
            variant="outlined"
            value={fields?.taxamount}
            onChange={(e) => {
              setFields((prev) => ({
                ...prev,
                taxamount: e.target.value,
                amount: Boolean(e.target.value)
                  ? Number(e.target.value) + Number(prev?.unitprice || 0)
                  : Number(prev?.unitprice || 0),
              }));
            }}
          />{" "}
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
              value={fields?.subscperiod || null}
              onChange={(event, newValue) => {
                setFields((prev) => ({ ...prev, subscperiod: newValue || "" }));
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Subscription Period" />
              )}
            />
          </FormControl>{" "}
          <div className="red">{errors?.subscperiod}</div>
        </Grid>

        {/* <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Transaction Type {requiredSpan}</Typography>
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
          <Typography sx={[input_label]}>Amount {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.amount}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Amount "
            type="number"
            variant="outlined"
          />{" "}
          <div className="red">{errors?.amount}</div>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Start Date {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            type="date"
            className="w-100 col-12 input-box2"
            value={fields?.startDate}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, startDate: e.target.value }))
            }
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
              getOptionLabel={(option) =>
                option ? option.charAt(0).toUpperCase() + option.slice(1) : ""
              }
              isOptionEqualToValue={(option, value) => option === value}
              value={fields?.status || null}
              onChange={(event, newValue) =>
                setFields((prev) => ({ ...prev, status: newValue || "" }))
              }
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
            value={fields?.storageSize}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Storage Size"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({ ...prev, storageSize: e.target.value }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Discount</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.discount}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Discount"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({ ...prev, discount: e.target.value }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Tax Percentage</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.taxPercentage}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Tax Percentage"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({ ...prev, taxPercentage: e.target.value }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Additional Users</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.additionalUsers}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Additional Users"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({
                ...prev,
                additionalUsers: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Cancelled Users</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.cancelledUsers}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Cancelled Users"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({
                ...prev,
                cancelledUsers: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Additional Storage</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={fields?.additionalStorage}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Additional Storage"
            type="number"
            variant="outlined"
            onChange={(e) =>
              setFields((prev) => ({
                ...prev,
                additionalStorage: e.target.value,
              }))
            }
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Additional Addons</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl className="w-100">
            <Autocomplete
              multiple
              limitTags={2}
              className="search-select3 col-12 w-100"
              id="addons-multiple"
              options={addonListData || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.Addon_Name || option?.Name || ""}
              value={addons}
              onChange={(event, newValue) => {
                setAddons(newValue);
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option?.Addon_Name || option?.Name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Addons" variant="outlined" />
              )}
            />
          </FormControl>
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
          label="Update"
          Icon="saveIcon"
          onClick={handleEditSubscription}
        />
        <Cancelbutton label="Cancel" onClick={() => setSave(true)} />
      </Div>

      <DialogBox
        open={save}
        onClickYes={() => {
          setSave(false);
          handleClickBack();
        }}
        onClickNo={() => setSave(false)}
      />
    </>
  );
};

export default EditSubscription;
