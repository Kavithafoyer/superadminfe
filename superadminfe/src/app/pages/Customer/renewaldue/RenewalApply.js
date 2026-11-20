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
import React, { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import axios from "axios";
import { apiConfig } from "app/services/config";
import { toast, ToastContainer } from "react-toastify";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
} from "../../widgets/CRMStyles";
import { BASE_URL } from "app/services/auth-services";

const RenewalApply = ({
  setRenewalPlan,
  scrollHeight,
  setListRenewal,
  editdatas,
  getRenewabledueRecords,
}) => {
  const [Modaldata, setModaldata] = useState([]);

  const [customername, setcustomername] = useState("");
  const [duedate, setduedate] = useState("");
  const [renewableid, setrenewableid] = useState("");
  const [lastrenewable, setlastrenewable] = useState("");
  const [amount, setamount] = useState("");
  const [error, seterrors] = useState({});

  const [erroraddistorage, seterroraddistorage] = useState({
    show: false,
    value: "",
  });

  useEffect(() => {
    if (editdatas !== undefined && editdatas.length !== 0) {
      console.log("editdatas", editdatas);
      setModaldata(editdatas);
      setcustomername(editdatas?.Customer_Id?.FirstName);
      setduedate(editdatas?.RenewaldueDate);
      setrenewableid(editdatas?.Renewal_Id);
      setlastrenewable(editdatas?.RenewalDate);
      setamount(editdatas?.RenewalAmount);
    }
  }, [editdatas]);

  const handleClickBack = () => {
    setModaldata([]);
    setcustomername("");
    setduedate("");
    setrenewableid("");
    setlastrenewable("");
    setamount("");
    setRenewalPlan(false);
    setListRenewal(true);
  };

  const handleEditRenewabledue = () => {
    seterroraddistorage({ show: false, value: "" });
    if (amount === "" || amount === null || amount === undefined) {
      seterroraddistorage({ show: true, value: " Enter Valid Amount" });
    } else {
      let payload = {
        id: Modaldata.id,
        Renewal_Id: Modaldata.Renewal_Id,
        RenewalDate: Modaldata.RenewalDate,
        AccountOwnerId: Modaldata.AccountOwnerId,
        RenewalPeriod: Modaldata.RenewalPeriod,
        RenewalUnitPrice: Modaldata.RenewalUnitPrice,
        TaxAmount: Modaldata.TaxAmount,
        RenewalAmount: amount,
        InvoicegenFlag: Modaldata.InvoicegenFlag,
        Is_Deleted: Modaldata.Is_Deleted,
        Is_Archived: Modaldata.Is_Archived,
        Created_Date: Modaldata.Created_Date,
        Updated_Date: moment().toDate(),
        Organization_Id: Modaldata.Organization_Id,
        Subscription_Id: Modaldata.Subscription_Id,
        RenewalNoticeId: Modaldata.RenewalNoticeId,
        Customer_Id: Modaldata.Customer_Id,
        Created_By: Modaldata.Created_By,
        Updated_By: Modaldata.Updated_By,
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
      };
      console.log("payload", payload);
      axios
        .put(`${BASE_URL}/superadmin/AddStorage/`, payload, {
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
            toast.success("Renewal Due is Updated successfully");
            getRenewabledueRecords();
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
      <Typography sx={[ComponentHeading]}>Renewal</Typography>

      <Div sx={{ mt: 1, height: { md: "55vh" } }}>
        <Grid container>
          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Customer Name <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
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

            <Div className="col-sm-12 col-lg-4" sx={{ mt: 1.5 }}>
              <Typography className="col-12 input-label">
                Due Date <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  type="date"
                  value={duedate}
                ></TextField>
                {Boolean(error?.duedate) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid due date"}
                  </Typography>
                )}
              </FormControl>
            </Div>
            <Div className="col-sm-12 col-lg-4" sx={{ mt: 1.5 }}>
              <Typography className="col-12 input-label">
                Renewal Id <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={renewableid}
                ></TextField>
                {Boolean(error?.renewableid) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid renewable id"}
                  </Typography>
                )}
              </FormControl>
            </Div>
          </Grid>

          <Grid item className="row" xs={12}>
            <Div className="col-sm-12 col-lg-4" sx={{ mt: 1.5 }}>
              <Typography className="col-12 input-label">
                Last Renewed <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  type="date"
                  value={lastrenewable}
                ></TextField>
                {Boolean(error?.lastrenewable) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid last renewable"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4" sx={{ mt: 1.5 }}>
              <Typography className="col-12 input-label">
                Amount <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={amount}
                ></TextField>
                {Boolean(error?.amount) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid amount"}
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
              m: 1,
              width: { xs: "100% !important", md: "100px !important" },
            },
          ]}
          onClick={handleEditRenewabledue}
        >
          Save
        </Button>
        <Button
          sx={[
            DialogBoxCancelButton,
            ButtonStyle,
            FontStyle,
            {
              m: 1,
              width: { xs: "100% !important", md: "100px !important" },
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

export default RenewalApply;
