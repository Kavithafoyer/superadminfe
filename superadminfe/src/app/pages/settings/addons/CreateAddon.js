import Div from "@jumbo/shared/Div";
import { Grid, TextField, Typography, FormControl, Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { input_label } from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  fetchTransactionSeries,
} from "app/pages/widgets/StylesComponents";
import { useCreateAddonMutation } from "./AddonAPI";
import { Country } from "country-state-city";

let Countries = Country.getAllCountries();

const CreateAddon = ({ setCreateAddon, setListAddon, scrollHeight }) => {
  const [createAddonMutation, { isLoading }] = useCreateAddonMutation();
  const [addonname, setaddonname] = useState("");
  const [addonprice, setaddonprice] = useState("");
  const [noofusers, setnoofusers] = useState("");
  const [currencycode, setcurrencycode] = useState("");
  const [country, setcountry] = useState("");
  const [seriesValue, setSeriesValue] = useState("");
  const [seriesId, setSeriesId] = useState("");

  const handleClickBack = () => {
    setCreateAddon(false);
    setListAddon(true);
  };

  const handlePostAddonPrice = () => {
    if (!addonname || !addonprice) {
      toast.error("Invalid Datas");
    } else {
      let payload = {
        Organization_Id: Number(localStorage.getItem("OrganizationId")) || 1,
        Addon_Id: seriesValue === "Automatic" ? "" : seriesId,
        Addon_Name: addonname,
        NoofUsers: noofusers ? Number(noofusers) : null,
        Currency_code: currencycode || null,
        Country: country || null,
        Started_Date: new Date().toISOString().split("T")[0],
        Is_Active: true,
        Price: Number(addonprice),
        Is_Deleted: false,
        Created_By: Number(localStorage.getItem("UserId")) || 1,
        Updated_By: Number(localStorage.getItem("UserId")) || 1,
      };

      createAddonMutation(payload)
        .unwrap()
        .then((res) => {
          toast.success("Created Successfully");
          setaddonname("");
          setaddonprice("");
          setnoofusers("");
          setcurrencycode("");
          setcountry("");
          handleClickBack();
        })
        .catch((error) => {
          console.error("Addon creation error:", error);
          toast.error("Something Went Wrong");
        });
    }
  };

  useEffect(() => {
    const transactionSeries = async () => {
      const series = await fetchTransactionSeries("Addons");
      setSeriesValue(series);
    };
    transactionSeries();
  }, []);

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Addon Name</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={addonname}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            placeholder="Addon Name"
            variant="outlined"
            onChange={(e) => {
              setaddonname(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>No of Users</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={noofusers}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            type="number"
            placeholder="No of Users"
            variant="outlined"
            onChange={(e) => {
              setnoofusers(e.target.value);
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
              getOptionLabel={(option) => option?.name || ""}
              options={Countries}
              value={Countries.find((item) => item?.name === country) || null}
              onChange={(item, newvalue) => {
                setcountry(newvalue?.name || "");
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Country" />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Currency Code</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select3 col-12 w-100"
              options={Countries}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option && option?.currency) return option?.currency;
                return "";
              }}
              value={Countries.find((item) => item?.currency === currencycode) || null}
              onChange={(item, newvalue) => {
                setcurrencycode(newvalue?.currency || "");
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
            value={addonprice}
            className="w-100 col-12 input-box2"
            id="outlined-basic"
            type="number"
            placeholder="Price"
            variant="outlined"
            onChange={(e) => {
              setaddonprice(e.target.value);
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
          onClick={handlePostAddonPrice}
        />
        <Cancelbutton label="Cancel" onClick={handleClickBack} />
      </Div>

      {/* <ToastContainer /> */}
    </>
  );
};

export default CreateAddon;
