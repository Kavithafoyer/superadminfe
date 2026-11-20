import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
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
import React from "react";
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
import { BASE_URL } from "app/services/auth-services";
import { useEffect } from "react";
import moment from "moment";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
} from "../../widgets/CRMStyles";

const EditInstance = ({
  setEditInstance,
  scrollHeight,
  setListInstance,
  getinstancerequestrecords,
  editdatas,
}) => {
  const [datas, setdatas] = useState([]);
  const [Modaldata, setModaldata] = useState([]);

  const [instanceid, setinstanceid] = useState("");
  const [instancename, setinstancename] = useState("");
  const [requestdate, setrequestdate] = useState("");
  const [customername, setcustomername] = useState("");
  const [planname, setplanname] = useState("");
  const [noofuser, setnoofuser] = useState("");
  const [subscid, setsubscid] = useState("");
  const [paidamount, setpaidamount] = useState("");
  const [url, seturl] = useState("");

  const [errorinstancename, seterrorinstancename] = useState({
    show: false,
    value: "",
  });
  const [errorrequestdate, seterrorrequestdate] = useState({
    show: false,
    value: "",
  });
  const [errorcustomername, seterrorcustomername] = useState({
    show: false,
    value: "",
  });
  const [errorplanname, seterrorplanname] = useState({
    show: false,
    value: "",
  });
  const [errornoofuser, seterrornoofuser] = useState({
    show: false,
    value: "",
  });
  const [errorsubscid, seterrorsubscid] = useState({ show: false, value: "" });
  const [errorpaidamount, seterrorpaidamount] = useState({
    show: false,
    value: "",
  });
  const [errorurl, seterrorurl] = useState({ show: false, value: "" });
  // const [error,seterror]=useState({"show":false,"value":""})

  const handleClickBack = () => {
    setModaldata([]);
    setinstanceid("");
    setinstancename("");
    setrequestdate("");
    setcustomername("");
    setplanname("");
    setnoofuser("");
    setsubscid("");
    setpaidamount("");
    seturl("");
    seterrorinstancename({ show: false, value: "" });
    seterrorrequestdate({ show: false, value: "" });
    seterrorcustomername({ show: false, value: "" });
    seterrorplanname({ show: false, value: "" });
    seterrornoofuser({ show: false, value: "" });
    seterrorsubscid({ show: false, value: "" });
    seterrorpaidamount({ show: false, value: "" });
    seterrorurl({ show: false, value: "" });

    setEditInstance(false);
    setListInstance(true);
  };

  const getSubscriptionRecords = () => {
    axios
      .get(BASE_URL + "/superadmin/subscriptionlist/?page=1", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("InstanceRequest", response.data);
        setdatas(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getSubscriptionRecords();
  }, []);

  useEffect(() => {
    if (editdatas != undefined && editdatas.length != 0) {
      console.log("editdatas", editdatas);
      setModaldata(editdatas);
      setinstanceid(editdatas?.RequestId);
      setinstancename(editdatas?.InstanceName);
      setrequestdate(editdatas?.RequestDate);
      setcustomername(editdatas?.CustomerName);
      setplanname(editdatas?.PlanName);
      setnoofuser(editdatas?.Noofusers);
      setsubscid(editdatas?.SubscriptionId);
      setpaidamount(editdatas?.Paidamount);
      seturl(editdatas?.URLName);
    }
  }, [editdatas]);

  const handleEditInstance = () => {
    seterrorinstancename({ show: false, value: "" });
    seterrorrequestdate({ show: false, value: "" });
    seterrorcustomername({ show: false, value: "" });
    seterrorplanname({ show: false, value: "" });
    seterrornoofuser({ show: false, value: "" });
    seterrorsubscid({ show: false, value: "" });
    seterrorpaidamount({ show: false, value: "" });
    seterrorurl({ show: false, value: "" });
    if (
      instancename === "" ||
      instancename === null ||
      instancename === undefined ||
      requestdate === "" ||
      requestdate === null ||
      requestdate === undefined ||
      customername === "" ||
      customername === null ||
      customername === undefined ||
      planname === "" ||
      planname === null ||
      planname === undefined ||
      noofuser === "" ||
      noofuser === null ||
      noofuser === undefined ||
      subscid === "" ||
      subscid === null ||
      subscid === undefined ||
      paidamount === "" ||
      paidamount === null ||
      paidamount === undefined ||
      url === "" ||
      url === null ||
      url === undefined
    ) {
      if (
        instancename === "" ||
        instancename === null ||
        instancename === undefined
      ) {
        seterrorinstancename({
          show: true,
          value: " Enter Valid Instance Name",
        });
      }
      if (
        requestdate === "" ||
        requestdate === null ||
        requestdate === undefined
      ) {
        seterrorrequestdate({ show: true, value: " Enter Valid Request Date" });
      }
      if (
        customername === "" ||
        customername === null ||
        customername === undefined
      ) {
        seterrorcustomername({
          show: true,
          value: " Enter Valid Customer Name",
        });
      }
      if (planname === "" || planname === null || planname === undefined) {
        seterrorplanname({ show: true, value: " Enter Valid Plan Name" });
      }
      if (noofuser === "" || noofuser === null || noofuser === undefined) {
        seterrornoofuser({ show: true, value: " Enter Valid No Of User" });
      }
      if (subscid === "" || subscid === null || subscid === undefined) {
        seterrorsubscid({ show: true, value: " Enter Valid Subscriber Id" });
      }
      if (
        paidamount === "" ||
        paidamount === null ||
        paidamount === undefined
      ) {
        seterrorpaidamount({ show: true, value: " Enter Valid Paid Amount" });
      }
      if (url === "" || url === null || url === undefined) {
        seterrorurl({ show: true, value: " Enter Valid Url" });
      }
    } else {
      let payload = {
        id: Modaldata.id,
        RequestId: instanceid,
        Organization_Id: Modaldata.Organization_Id,
        Subscription_Id: 1,
        SubscriptionId: subscid,
        PlanName: planname,
        plan_id: 1,
        RequestDate: requestdate,
        UserId: Modaldata.UserId,
        CustomerName: customername,
        InstanceName: instancename,
        URLName: url,
        Noofusers: noofuser,
        Paidamount: paidamount,
        Created_By: Modaldata.Created_By,
        Updated_By: localStorage.getItem("UserId"),
        Created_Date: Modaldata.Created_Date,
        Updated_Date: moment().toDate(),
      };
      console.log("payload", payload);
      axios
        .put(`${BASE_URL}/superadmin/InstanceRequest/`, payload, {
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
            toast.success("Instance Request is Updated successfully");
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

  return (
    <>
      <Typography sx={[ComponentHeading]}>Edit Instance Request</Typography>
      <Div sx={{ mt: 1 }}>
        <Grid container>
          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Request Id <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="Instance Name"
                  value={instanceid}
                ></TextField>
              </FormControl>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Instance Name <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="Instance Name"
                  value={instancename}
                  onChange={(e) => {
                    setinstancename(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errorinstancename.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorinstancename.value}
                </Typography>
              </Div>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Request Date <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  type="date"
                  value={requestdate}
                  onChange={(e) => {
                    setrequestdate(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errorrequestdate.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorrequestdate.value}
                </Typography>
              </Div>
            </Div>
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Customer Name <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="Customer Name"
                  value={customername}
                  onChange={(e) => {
                    setcustomername(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errorcustomername.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorcustomername.value}
                </Typography>
              </Div>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Plan Name <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="Plan Name"
                  value={planname}
                  onChange={(e) => {
                    setplanname(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errorplanname.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorplanname.value}
                </Typography>
              </Div>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                No of Users <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="No of Users"
                  value={noofuser}
                  onChange={(e) => {
                    setnoofuser(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errornoofuser.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errornoofuser.value}
                </Typography>
              </Div>
            </Div>
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Subscription Id <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <Select
                  className="input-select"
                  sx={{ height: "34px !important" }}
                  value={subscid}
                  onChange={(e) => {
                    setsubscid(e.target.value);
                  }}
                >
                  {datas?.length > 0 &&
                    datas?.map((item, index) => (
                      <MenuItem value={item.Subscription_Id}>
                        {item.Subscription_Id}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Div
                sx={{
                  display: errorsubscid.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorsubscid.value}
                </Typography>
              </Div>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                Paid Amount <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="Paid Amount"
                  value={paidamount}
                  onChange={(e) => {
                    setpaidamount(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{
                  display: errorpaidamount.show === true ? "" : "none",
                  ml: 5,
                }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorpaidamount.value}
                </Typography>
              </Div>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
              <Typography className="col-12 input-label">
                URL <span className="required">*</span>
              </Typography>
              <FormControl className="col-12">
                <TextField
                  className="col-12 input-box"
                  placeholder="URL"
                  value={url}
                  onChange={(e) => {
                    seturl(e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <Div
                sx={{ display: errorurl.show === true ? "" : "none", ml: 5 }}
              >
                <Typography color={"#FF0000"}>
                  <span className="required">*</span>
                  {errorurl.value}
                </Typography>
              </Div>
            </Div>
          </Grid>
        </Grid>

        <Div
          sx={[
            DisplayFlex,
            {
              mt: 5,
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            },
          ]}
        >
          <Button
            sx={[DialogBoxCancelButton, FontStyle, ButtonStyle, { m: 1 }]}
            onClick={handleClickBack}
          >
            Cancel
          </Button>

          <Button
            sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { m: 1 }]}
            onClick={handleEditInstance}
          >
            Update
          </Button>
        </Div>
      </Div>
    </>
  );
};

export default EditInstance;
