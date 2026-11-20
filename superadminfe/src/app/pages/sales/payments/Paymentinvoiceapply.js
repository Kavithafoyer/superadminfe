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
  FontStyle,
} from "../../widgets/CRMStyles";

const PaymentInvoice = ({
  setChangePlan,
  scrollHeight,
  setListChange,
  getpaymentRecords,
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

    setChangePlan(false);
    setListChange(true);
  };

  //   const getSubscriptionRecords=()=>{
  //     axios.get(BASE_URL + "/superadmin/subscriptionlist/?page=1", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         "Db": localStorage.getItem("DBName")
  //       },
  //     })
  //       .then((response) => {
  //         console.log("InstanceRequest",response.data)
  //         setdatas(response.data.results)
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       })
  //       .finally(() => {
  //       });

  //   }

  //   useEffect(()=>{
  //     getSubscriptionRecords()
  //   },[])

  //   useEffect(() => {
  //     if (editdatas != undefined && editdatas.length != 0) {
  //       console.log("editdatas",editdatas)
  //       setModaldata(editdatas)
  //       setinstanceid(editdatas?.RequestId)
  //       setinstancename(editdatas?.InstanceName)
  //       setrequestdate(editdatas?.RequestDate)
  //       setcustomername(editdatas?.CustomerName)
  //       setplanname(editdatas?.PlanName)
  //       setnoofuser(editdatas?.Noofusers)
  //       setsubscid(editdatas?.SubscriptionId)
  //       setpaidamount(editdatas?.Paidamount)
  //       seturl(editdatas?.URLName)
  //     }
  //     }, [editdatas]);

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
            getpaymentRecords();
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
      <Typography vasx={[ComponentHeading]}>Edit Instance Request</Typography>
      <Div sx={{ mt: 1 }}>
        {/* <Grid container>

        <Grid item className="row" xs={12} sx={{ mt: 2 }}>

        <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
                Customer Id <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                placeholder="Instance Name"
                value={customerid} >

              </TextField>
            </FormControl>
          </Div>
          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Invoice Id <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                placeholder="Instance Name"
                value={invoiceid} >

              </TextField>
            </FormControl>
            
          </Div>

          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Invoice Name <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                type="date"
                value={invoicename}
              >

              </TextField>
            </FormControl>
           
          </Div>
         
        </Grid>

        <Grid item className="row" xs={12} sx={{ mt: 2 }}>
        <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Invoice Date <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
              type="date"
                placeholder="Customer Name"
                value={invoicedate}
              >

              </TextField>
            </FormControl>
           
          </Div>
          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Invoice Details <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                value={invoicedetails}
              >

              </TextField>
            </FormControl>
            
          </Div>

          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Amount <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                placeholder="No of Users"
                value={amount}
              >


              </TextField>
            </FormControl>
            
          </Div>

          
        </Grid>

        <Grid item className="row" xs={12} sx={{ mt: 2 }}>

        <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Reciept Amount <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="input-select"
                value={recamount}
                type="number"
                onChange={(e) => { setrecamount(e.target.value) }}

              />
            </FormControl>
            <Div sx={{ display: errorrecamount.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorrecamount.value}
              </Typography>
            </Div>
          </Div>


          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Payment Mode <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <Select className="col-12 input-box"
                placeholder="Payment Mode"
                value={paymentmode}
                onChange={(e) => { setpaymentmode(e.target.value) }}

              >

              </Select>
            </FormControl>
            <Div sx={{ display: errorpaymentmode.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorpaymentmode.value}
              </Typography>
            </Div>
          </Div>
          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Payment Date <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                placeholder="Payment Date"
                value={paymentdate}
                onChange={(e) => { setpaymentdate(e.target.value) }}
              >

              </TextField>
            </FormControl>
            <Div sx={{ display: errorpaymentdate.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorpaymentdate.value}
              </Typography>
            </Div>
          </Div>
        </Grid>

        <Grid item className="row" xs={12} sx={{ mt: 2 }}>

        <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Reciept Amount <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="input-select"
                value={recamount}
                type="number"
                onChange={(e) => { setrecamount(e.target.value) }}

              />
            </FormControl>
            <Div sx={{ display: errorrecamount.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorrecamount.value}
              </Typography>
            </Div>
          </Div>


          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Payment Mode <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <Select className="col-12 input-box"
                placeholder="Payment Mode"
                value={paymentmode}
                onChange={(e) => { setpaymentmode(e.target.value) }}

              >

              </Select>
            </FormControl>
            <Div sx={{ display: errorpaymentmode.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorpaymentmode.value}
              </Typography>
            </Div>
          </Div>
          <Div className="col-sm-12 col-lg-4" sx={{ ml: -1 }}>
            <Typography className="col-12 input-label">
              Payment Date <span className="required">*</span>
            </Typography>
            <FormControl className="col-12" sx={{ minWidth: "240px" }}>
              <TextField className="col-12 input-box"
                placeholder="Payment Date"
                value={paymentdate}
                onChange={(e) => { setpaymentdate(e.target.value) }}
              >

              </TextField>
            </FormControl>
            <Div sx={{ display: errorpaymentdate.show === true ? "" : "none", ml: 5 }}>
              <Typography color={"#FF0000"} >
                <span className="required">*</span>{errorpaymentdate.value}
              </Typography>
            </Div>
          </Div>
        </Grid>


      </Grid> */}
        <Div
          className="row Typographyh1"
          sx={{
            mt: 7,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
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
            onClick={handleEditInstance}
          >
            Update
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
      </Div>
    </>
  );
};

export default PaymentInvoice;
