import Div from "@jumbo/shared/Div";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  Autocomplete
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { input_label } from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
} from "app/pages/widgets/StylesComponents";
import { useUpdateAddonMutation } from "./AddonAPI";
import { Country } from "country-state-city";

let Countries = Country.getAllCountries();

const EditAddon = ({ setListAddon, setEditAddon, Editdatas, scrollHeight }) => {
  const [updateAddonMutation, { isLoading }] = useUpdateAddonMutation();
  const [addonid, setaddonid] = useState("");
  const [addonname, setaddonname] = useState("");
  const [addonuser, setaddonuser] = useState("");
  const [currency, setcurrency] = useState("");
  const [country, setcountry] = useState("");
  const [price, setprice] = useState("");
  const [save, setSave] = useState(false);

  const [Modaldata, setModaldata] = useState([]);

  const handleClickBack = () => {
    setEditAddon(false);
    setListAddon(true);
  };

  useEffect(() => {
    if (Editdatas != undefined && Editdatas.length != 0) {
      setModaldata(Editdatas);
      setaddonid(Editdatas?.Addon_Id);
      setaddonname(Editdatas?.Addon_Name || Editdatas?.Name);
      setaddonuser(Editdatas?.NoofUsers);
      setcurrency(Editdatas?.Currency_code);
      setcountry(Editdatas?.Country);
      setprice(Editdatas?.Price);
    }
  }, [Editdatas]);

  const handleUpdateStorage = () => {
    if (
      addonname === "" ||
      addonname === undefined ||
      addonname === null ||
      price === "" ||
      price === undefined ||
      price === null
    ) {
      toast.error("Invalid Datas");
    } else {
      let payload = {
        id: Modaldata.id,
        Organization_Id: Number(localStorage.getItem("OrganizationId")) || 1,
        Addon_Id: addonid,
        Addon_Name: addonname,
        NoofUsers: addonuser ? Number(addonuser) : null,
        Currency_code: currency || null,
        Country: country || null,
        Started_Date: Modaldata?.Started_Date || new Date().toISOString().split("T")[0],
        Is_Active: true,
        Price: Number(price),
        Is_Deleted: false,
        Created_By: Number(localStorage.getItem("UserId")) || 1,
        Updated_By: Number(localStorage.getItem("UserId")) || 1,
      };

      updateAddonMutation(payload)
        .unwrap()
        .then((res) => {
          toast.success("Addon is Updated successfully");
          handleClickBack();
        })
        .catch((error) => {
          console.error("Addon update error:", error);
          toast.error("Something Went Wrong");
        });
    }
  };

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Addon Id</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={addonid}
            className="w-100 input-box"
            id="outlined-basic"
            placeholder="Addon Id"
            variant="outlined"
            disabled
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Addon Name</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={addonname}
            className="w-100 input-box"
            id="outlined-basic"
            placeholder="Addon Name"
            variant="outlined"
            onChange={(e) => {
              setaddonname(e.target.value);
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>No Of User </Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <TextField
            value={addonuser}
            className="w-100 input-box"
            id="outlined-basic"
            type="number"
            placeholder="No Of User"
            variant="outlined"
            onChange={(e) => {
              setaddonuser(e.target.value);
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
          <Typography sx={[input_label]}>Currency</Typography>
        </Grid>

        <Grid item xs={12} md={9}>
          <FormControl className="w-100  ">
            <Autocomplete
              className="search-select w-100 "
              id="outlined-basic"
              name="currency"
              options={Countries}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                if (option?.currency) return option.currency;
                return "";
              }}
              value={Countries.find((item) => item?.currency === currency) || null}
              onChange={(item, newvalue) => {
                setcurrency(newvalue?.currency || "");
              }}
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
            value={price}
            className="w-100 input-box"
            id="outlined-basic"
            type="number"
            placeholder="Price"
            variant="outlined"
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
          label="Update"
          Icon="saveIcon"
          onClick={handleUpdateStorage}
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

export default EditAddon;
