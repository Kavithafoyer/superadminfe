import Div from "@jumbo/shared/Div";
import {
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country } from "country-state-city";
import { toast, ToastContainer } from "react-toastify";
import { apiConfig } from "app/services/config";
import {
  ButtonStyle,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
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
import { BASE_URL } from "app/services/auth-services";

const CreateStorage = ({ setCreateStorage, setListStorage, scrollHeight }) => {
  const navigate = useNavigate();
  const [storagename, setstoragename] = useState("");
  const [storagesize, setstoragesize] = useState("");
  const [country, setcountry] = useState("");
  const [currency, setcurrency] = useState("");
  const [price, setprice] = useState("");
  const [seriesValue, setSeriesValue] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [save, setSave] = useState(false);

  const handleClickBack = () => {
    setstoragename("");
    setstoragesize("");
    setcountry("");
    setcurrency("");
    setprice("");
    // navigate('/StorageList');
    setCreateStorage(false);
    setListStorage(true);
  };

  let Countries = Country.getAllCountries();

  const handlePostStorage = () => {
    let error = errorFilter({ storagename, storagesize, price });
    if (Object.keys(error)?.length > 0) {
      toast.error(
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
        Organization_Id: localStorage.getItem("OrganizationId"),
        Name: storagename,
        Price: price,
        Storage_Size: storagesize,
        Storage_Id: seriesValue == "Automatic" ? "" : seriesId,
        Country: country,
        Currency: currency,
        Is_Deleted: false,
        Isactive: true,
        Created_By: localStorage.getItem("UserId"),
        Updated_By: localStorage.getItem("UserId"),
        Subscription_Id: 1,
        Plan_Id: 1,
      };
      console.log("payload", payload);
      axios
        .post(`${BASE_URL}/superadmin/storagemaster/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          console.log("2", res);
          if (res) {
            toast.success("Storage is created successfully");
            setstoragename("");
            setstoragesize("");
            setcountry("");
            setcurrency("");
            setprice("");
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

  useEffect(() => {
    const transactionSeries = async () => {
      const series = await fetchTransactionSeries("Storagemaster");
      console.log("series", series);
      setSeriesValue(series);
    };
    transactionSeries();
  }, []);

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>
        {/* <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Storage Id</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={seriesValue}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="# Storage ID"
            variant="outlined"
            disabled={seriesValue == "Automatic"}
            onChange={(e) => {
              setSeriesId(e.target.value);
            }}
          />
        </Grid> */}

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Storage Name</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Storage Name"
            variant="outlined"
            value={storagename}
            onChange={(e) => {
              setstoragename(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Storage Size(GB)</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder=" Storage Size(GB)"
            variant="outlined"
            type="number"
            value={storagesize}
            onChange={(e) => {
              setstoragesize(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Country</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <FormControl className="w-100 ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              sx={{ height: "33px" }}
              id="outlined-basic"
              name="country"
              getOptionLabel={(option) => option?.name}
              options={Countries}
              value={Countries.find((item) => item?.name === country) || null}
              onChange={(item, newvalue) => {
                setcountry(newvalue?.name);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Country" />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Currency</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              // {...register("selectedCountry1")}
              options={Countries}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && option?.currency) {
                  return option?.currency;
                }
                return "";
              }}
              value={Countries.find((item) => item?.currency === currency) || null}
              onChange={(item, newvalue) => {
                setcurrency(newvalue?.currency);
                console.log(newvalue?.currency);
              }}
              id="outlined-basic"
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Currency" />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Price</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            type="number"
            placeholder="Price"
            variant="outlined"
            value={price}
            onChange={(e) => {
              setprice(e.target.value);
            }}
          />
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
          onClick={handlePostStorage}
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

      {/* <ToastContainer /> */}
    </>
  );
};

export default CreateStorage;
