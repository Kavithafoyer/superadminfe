import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { Country } from "country-state-city";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { toast } from "react-toastify";
import {
  input_label,
} from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  errorFilter,
  fetchTransactionSeries,
  requiredSpan,
} from "app/pages/widgets/StylesComponents";

let Plantype = [{ value: "Paid" }, { value: "Free" }, { value: "Trial Plan" }];

let Module = [
  { value: "Contact" },
  { value: "Lead" },
  { value: "Deal" },
  { value: "Account" },
];

const SetupProduct = ({
  setCreatePlan,
  scrollHeight,
  setListPlan,
  getPlanRecords,
}) => {
  let Countries = Country.getAllCountries();

  const [plantype, setplantype] = useState("");
  const [module, setmodule] = useState("");
  const [planname, setplanname] = useState("");
  const [country, setcountry] = useState("");
  const [code, setcode] = useState("");
  const [noofcontact, setnoofcontact] = useState("");
  const [noofmonth, setnoofmonth] = useState("");
  const [price, setprice] = useState("");
  const [storage, setstorage] = useState("");
  const [addstorage, setaddstorage] = useState("");
  const [noofuser, setnoofuser] = useState("");
  const [fees, setfees] = useState("");
  const [plandetails, setplandetails] = useState("");
  const [trailperiod, settrailperiod] = useState(0);

  const [seriesValue, setSeriesValue] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [save, setSave] = useState(false);

  const [addons, setAddons] = useState([]);
  const [errors, setErrors] = useState({});

  const [addondatas, setaddondatas] = useState([]);

  const handleClickBack = () => {
    setplantype("");
    setmodule("");
    setplanname("");
    setcountry("");
    setcode("");
    setnoofcontact("");
    setnoofmonth("");
    setprice("");
    setstorage("");
    // setaddstorage("")
    setnoofuser("");
    setfees("");
    setplandetails("");
    setCreatePlan(false);
    setListPlan(true);
  };

  // console.log(Countries)

  const handleCreatePlan = () => {
    let error = errorFilter({
      plantype,
      planname,
      country,
      noofmonth,
      price,
      code,
      storage,
      noofuser,
    });

    if (addons?.length === 0) {
      error.addons = "This field is required";
    }

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
        // Modules: module,
        Plan_Id: seriesValue == "Automatic" ? "" : seriesId,
        Plan_Name: planname,
        Noofcontacts: 0,
        Addstorage: 0,
        Noofmonths: noofmonth,
        Country: country,
        UnitPrice: price,
        Trialperiod: trailperiod,
        Plantype: plantype,
        Setupfees: fees,
        Currency_Type: code,
        No_Of_Users: noofuser,
        AllocatedStorage: storage,
        // Addstorage: addstorage,
        PlanDetails: plandetails,
        Is_Active_Flg: true,
        AllocatedAddons: addons?.map((addon) => addon?.id),
        // Package_Id: 1,
        Organization_Id: localStorage.getItem("OrganizationId"),
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
      };
      console.log("payload", payload);
      axios
        .post(`${BASE_URL}/superadmin/plan/`, payload, {
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
            toast.success("Plan is Created successfully");
            handleClickBack();
            getPlanRecords();
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

  const getaddonrecords = async () => {
    await axios
      .get(BASE_URL + "/superadmin/AddonAdditional/?Is_Deleted=False", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("Add on Price", response.data);
        setaddondatas(response.data.results);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getaddonrecords();
  }, []);

  useEffect(() => {
    const transactionSeries = async () => {
      const series = await fetchTransactionSeries("Plan");
      console.log("series", series);
      setSeriesValue(series);
    };
    transactionSeries();
  }, []);

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Product Id {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={seriesValue}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="# Product ID"
            variant="outlined"
            disabled={seriesValue == "Automatic"}
            onChange={(e) => {
              setSeriesId(e.target.value);
            }}
          />
          <div className="red">{errors?.seriesValue}</div>
        </Grid>


        <Grid item xs={12} md={2}>
          <Typography sx={[input_label]}>Product Name {requiredSpan}</Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            value={planname}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Product Name"
            variant="outlined"
            onChange={(e) => {
              setplanname(e.target.value);
            }}
          />
          <div className="red">{errors?.planname}</div>
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
        <CustomButton label="Save" Icon="saveIcon" onClick={handleCreatePlan} />
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

export default SetupProduct
