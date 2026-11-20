import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
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

const AdditionalStorageApply = ({
  setCreateStorage,
  scrollHeight,
  setListStorage,
  editdatas,
  getAddonSubscriptionRecords,
}) => {
  const [Modaldata, setModaldata] = useState([]);

  const [requestno, setrequestno] = useState("");
  const [requestdate, setrequestdate] = useState("");
  const [customername, setcustomername] = useState("");
  const [domainname, setdomainname] = useState("");
  const [adistorage, setadistorage] = useState("");
  const [alocstorage, setalocstorage] = useState("");

  const [error, seterrors] = useState({});

  const [erroraddistorage, seterroraddistorage] = useState({
    show: false,
    value: "",
  });

  useEffect(() => {
    if (editdatas !== undefined && editdatas.length !== 0) {
      console.log("editdatas", editdatas);
      setModaldata(editdatas);
      setrequestno(editdatas?.AddStorageRequestKey);
      setrequestdate(editdatas?.RequestDate);
      setcustomername(editdatas?.Customer_Id?.FirstName);
      setdomainname(editdatas?.Domainname);
      setadistorage(editdatas?.Additionalstorage);
      setalocstorage(editdatas?.AllocatedStorage);
    }
  }, [editdatas]);

  const handleClickBack = () => {
    setModaldata([]);
    setrequestno("");
    setrequestdate("");
    setcustomername("");
    setdomainname("");
    setadistorage("");
    setalocstorage("");
    seterroraddistorage({ show: false, value: "" });
    setCreateStorage(false);
    setListStorage(true);
  };

  const handleEditAdditionalstorage = () => {
    seterroraddistorage({ show: false, value: "" });
    if (
      alocstorage === "" ||
      alocstorage === null ||
      alocstorage === undefined
    ) {
      seterroraddistorage({
        show: true,
        value: " Enter Valid Additional Storage",
      });
    } else {
      let payload = {
        id: Modaldata.id,
        Additionalstorage: adistorage,
        AllocatedStorage: alocstorage,
        Domainname: domainname,
        AddStorageRequestKey: requestno,
        RequestDate: requestdate,
        StorageRequested: Modaldata.StorageRequested,
        UnitPrice: Modaldata.UnitPrice,
        InvoiceAmount: Modaldata.InvoiceAmount,
        TaxAmount: Modaldata.TaxAmount,
        NetAdditionalAmount: Modaldata.NetAdditionalAmount,
        InvoicegenFlag: Modaldata.InvoicegenFlag,
        Is_Deleted: Modaldata.Is_Deleted,
        Is_Archived: Modaldata.Is_Archived,
        Created_Date: Modaldata.Created_Date,
        Updated_Date: moment().toDate(),
        Organization_Id: localStorage.getItem("OrganizationId"),
        Subscription_Id: Modaldata.Subscription_Id,
        Customer_Id: Modaldata.Customer_Id.id,
        Requested_UserMasterId: Modaldata.Requested_UserMasterId,
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
            toast.success("Additional Storage is Updated successfully");
            getAddonSubscriptionRecords();
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
      <Typography sx={[ComponentHeading]}>Additional Storage</Typography>
      <Div sx={{ mt: 1, height: { md: "55vh" } }}>
        <Grid container>
          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Request No <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={requestno}
                ></TextField>
                {Boolean(error?.requestno) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid request no"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Request Date <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
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
          </Grid>

          <Grid item className="row" xs={12} sx={{ mt: 2 }}>
            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Domain Name <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={domainname}
                ></TextField>
                {Boolean(error?.domainname) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid domain name"}
                  </Typography>
                )}
              </FormControl>
            </Div>

            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Additional Storage <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={adistorage}
                ></TextField>
                {Boolean(error?.adistorage) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid additional  storage"}
                  </Typography>
                )}
              </FormControl>
            </Div>
            <Div className="col-sm-12 col-lg-4">
              <Typography className="col-12 input-label">
                Allocated Storage <span className="required">*</span>
              </Typography>
              <FormControl className="col-12" sx={{ minWidth: "240px" }}>
                <TextField
                  className="col-12 input-box"
                  value={alocstorage}
                  onChange={(e) => {
                    setalocstorage(e.target.value);
                  }}
                ></TextField>
                {Boolean(error?.alocstorage) && (
                  <Typography color={"#FF0000"} sx={{ fontSize: "11px" }}>
                    <span className="required">*</span>
                    {"Please enter a valid allocated storage"}
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
            { m: 1, width: { xs: "100% !important", md: "100px !important" } },
          ]}
          onClick={handleEditAdditionalstorage}
        >
          Save
        </Button>
        <Button
          sx={[
            DialogBoxCancelButton,
            ButtonStyle,
            FontStyle,
            { m: 1, width: { xs: "100% !important", md: "100px !important" } },
          ]}
          onClick={handleClickBack}
        >
          Cancel
        </Button>
      </Div>
    </>
  );
};

export default AdditionalStorageApply;
