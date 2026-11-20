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
import moment from "moment";
import axios from "axios";
import { apiConfig } from "app/services/config";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
} from "../../widgets/CRMStyles";

const ChangeplanApply = ({
  setChangePlan,
  scrollHeight,
  setListChange,
  editdatas,
  getAddonSubscriptionRecords,
}) => {
  const [Modaldata, setModaldata] = useState([]);
  const [Tenantname, setTenantname] = useState("");
  const [requestno, setrequestno] = useState("");
  const [requestdate, setrequestdate] = useState("");
  const [customername, setcustomername] = useState("");
  const [planname, setplanname] = useState("");
  const [noofuser, setnoofuser] = useState("");
  const [addcancel, setaddcancel] = useState("");
  const [effecdate, seteffecdate] = useState("");
  const [nooflicense, setnooflicense] = useState("");
  const [oldamount, setoldamount] = useState("");
  const [newamount, setnewamount] = useState("");
  const [existingUsersCount, setExistingUsersCount] = useState(0);

  const [error, seterrors] = useState({});

  const [errornewamount, seterrornewamount] = useState({
    show: false,
    value: "",
  });
  const [erroraddcancel, seterroraddcancel] = useState({
    show: false,
    value: "",
  });

  useEffect(() => {
    if (editdatas !== undefined && editdatas.length !== 0) {
      console.log("editdatas", editdatas);
      setModaldata(editdatas);
      setrequestno(editdatas?.Licensereqid);
      setrequestdate(editdatas?.RequestDate);
      setcustomername(editdatas?.Customername);
      setplanname(editdatas?.Planname);
      setnoofuser(editdatas?.Noofusers);
      setaddcancel(editdatas?.Addorcancel);
      seteffecdate(editdatas?.Effectivedate);
      setnooflicense(editdatas?.Nooflicense);
      setoldamount(editdatas?.Plan_Id?.UnitPrice);
      setnewamount(editdatas?.Newamount);

      const subId = editdatas?.Subscription_Id?.Subscription_Id || editdatas?.Subscription_Id;
      if (subId) {
        axios
          .get(`${BASE_URL}/superadmin/subscriptionlist/?Subscription_Id=${subId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: localStorage.getItem("DBName"),
            },
          })
          .then((res) => {
            if (res.data?.results?.length > 0) {
              const subData = res.data.results[0];
              const totalUsers = (subData.Base_Users || 0) + (subData.Additional_users || 0);
              setExistingUsersCount(totalUsers);
            }
          })
          .catch((err) => {
            console.error("Error fetching subscription details", err);
          });
      }
    }
  }, [editdatas]);

  const handleClickBack = () => {
    setrequestno("");
    setrequestdate("");
    setcustomername("");
    setplanname("");
    setnoofuser("");
    setaddcancel("");
    seteffecdate("");
    setnooflicense("");
    setoldamount("");
    setnewamount("");
    seterrornewamount({ show: false, value: "" });
    seterroraddcancel({ show: false, value: "" });

    setChangePlan(false);
    setListChange(true);
  };

  const handleEditChangePlan = () => {
    seterrornewamount({ show: false, value: "" });
    seterroraddcancel({ show: false, value: "" });

    let payload = {
      Addtionalusers: Modaldata?.Addtionalusers,
      Licensereqid: Modaldata?.Licensereqid,
      status: true,
    };
    console.log("payload", payload);
    axios
      .patch(`${BASE_URL}/superadmin/Addorcancellicense/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log("2", res.data);
        if (res.status === 201) {
          toast.success("Change and Upgrade Plan is Updated successfully");
          // getAddonSubscriptionRecords();
          // handleClickBack();
          UpdatedSuperadminsubscription();
        } else {
          toast.error("Check your data");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Somthing Went Wrong");
      });
  };

  const UpdatedSuperadminsubscription = () => {
    let payload = {
      Subscription_Id: Modaldata?.Subscription_Id?.Subscription_Id,
      AddtionalUsers:
        Modaldata?.Subscription_Id?.AddtionalUsers + Modaldata?.Addtionalusers,
    };
    console.log("payload", payload);
    axios
      .patch(`${BASE_URL}/superadmin/subscription/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log("2", res.data);
        if ((res.status === 200) | 201) {
          // toast.success("Change and Upgrade Plan is Updated successfully");
          // getAddonSubscriptionRecords();
          // UpdatedUseradminsubscription();
          GettingTenantName();
          handleClickBack();
          console.log("UpdatedSuperadminsubscription");
        } else {
          toast.error("Check your data");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Somthing Went Wrong");
      });
  };

  const GettingTenantName = () => {
    axios
      .get(
        `${BASE_URL}/superadmin/InstanceCreationtCRUD/?Customer_Id=${Modaldata?.Customer_Id?.id}`,
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
        if ((res.status === 200) | 201) {
          console.log("Tenant Details from Instance Creations", res.data);
          UpdatedUseradminsubscription(res?.data?.Domain_Name);
        } else {
          toast.error("Check your data");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Somthing Went Wrong");
      });
  };

  const UpdatedUseradminsubscription = (Tenantname) => {
    let payload = {
      Subscription_Id: Modaldata?.Subscription_Id?.Subscription_Id,
      AddtionalUsers:
        Modaldata?.Subscription_Id?.AddtionalUsers + Modaldata?.Addtionalusers,
    };
    console.log("payload", payload);
    axios
      .patch(`${BASE_URL}/useradmin/subscription/`, payload, {
        // .patch(`https://127.0.0.1:8000/${Tenantname}/useradmin/subscription/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log("2", res.data);
        if ((res.status === 200) | 201) {
          // toast.success("Change and Upgrade Plan is Updated successfully");
          // getAddonSubscriptionRecords();
          handleClickBack();
          console.log("UpdatedUseradminsubscription Tenant");
        } else {
          toast.error("Check your data");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Somthing Went Wrong");
      });
  };

  return (
    <>
      <Typography sx={[ComponentHeading]}>Change or Upgrade Plan</Typography>
      <Div sx={{ mt: 1, height: { md: "55vh" } }}>
        <Grid container>
          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Request No <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={requestno}
                ></TextField>
              </FormControl>
              {Boolean(error?.error?.requestno) && (
                <Typography sx={{ fontSize: "11px" }} color={"#FF0000"}>
                  <span className="required">*</span>
                  {"Please enter a valid request number"}
                </Typography>
              )}
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Request Date <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  type="date"
                  value={requestdate}
                ></TextField>

                {Boolean(error?.requestdate) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid request date"}
                  </Typography>
                )}
              </FormControl>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Customer Name <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={customername}
                ></TextField>
                {Boolean(error?.customername) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid customer name"}
                  </Typography>
                )}
              </FormControl>
            </Div>
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Plan Name <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={planname}
                ></TextField>
                {Boolean(error?.planname) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid plan name"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Existing Users <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={existingUsersCount}
                ></TextField>
                {Boolean(error?.noofuser) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid no of user"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Add/Cancel <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <Autocomplete
                  className="search-select"
                  value={addcancel}
                  options={["Add", "Cancel"]}
                  onChange={(e, value) => {
                    setaddcancel(value);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(error?.addcancel) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid add cancel"}
                  </Typography>
                )}
              </FormControl>
            </Div>
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Effective Date <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  type="date"
                  value={effecdate}
                ></TextField>
                {Boolean(error?.effecdate) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid effective date"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                No of License <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={nooflicense}
                ></TextField>
                {Boolean(error?.nooflicense) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid noof license"}
                  </Typography>
                )}
              </FormControl>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Old Amount <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={oldamount}
                ></TextField>
                {Boolean(error?.oldamount) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid old amount"}
                  </Typography>
                )}
              </FormControl>
            </Div>
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                New Amount <span className="required">*</span>
              </Typography>
              <FormControl
                className="col-12"
                sx={{ minWidth: { xs: "100%", md: "240px" } }}
              >
                <TextField
                  className="col-12 input-box"
                  value={newamount}
                  onChange={(e) => {
                    setnewamount(e.target.value);
                  }}
                ></TextField>
                {Boolean(error?.newamount) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid new amount"}
                  </Typography>
                )}
              </FormControl>
            </Div>
          </Grid>
        </Grid>
      </Div>
      <Div
        sx={[
          DisplayFlex,
          { justifyContent: { xs: "center", md: "flex-start" }, mt: 2 },
        ]}
      >
        <Button
          sx={[
            DialogBoxSaveButton,
            ButtonStyle,
            FontStyle,
            {
              width: { xs: "100% !important", md: "100px !important" },
              m: 1,
            },
          ]}
          onClick={handleEditChangePlan}
        >
          Save
        </Button>
        <Button
          sx={[
            DialogBoxCancelButton,
            ButtonStyle,
            FontStyle,
            {
              width: { xs: "100% !important", md: "100px !important" },
              m: 1,
            },
          ]}
          onClick={handleClickBack}
        >
          Cancel
        </Button>
      </Div>
    </>
  );
};

export default ChangeplanApply;
