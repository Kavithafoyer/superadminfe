import Div from "@jumbo/shared/Div";
import { Grid, TextField, Typography, Autocomplete } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { input_label } from "../../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  errorFilter,
} from "app/pages/widgets/StylesComponents";
import { BASE_URL } from "app/services/auth-services";
import { Country } from "country-state-city";

const statusOptions = ["pending", "approved", "rejected", "active"];

const EditUserMaster = ({
  setEditUserMaster,
  setlistUserMaster,
  editdatas,
}) => {
  const [noofusers, setNoofusers] = useState("");
  const [amountPerUser, setAmountPerUser] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [currencyCode, setCurrencyCode] = useState("");
  const [country, setCountry] = useState("");
  const [save, setSave] = useState(false);

  const Countries = Country.getAllCountries();

  useEffect(() => {
    if (editdatas) {
      setNoofusers(editdatas?.No_Of_Users || "");
      setAmountPerUser(editdatas?.Amount_Per_User || "");
      setTotalAmount(editdatas?.Total_Amount || "");
      setEffectiveDate(editdatas?.Effective_Date || "");
      setStatus(editdatas?.Status || "pending");
      setCurrencyCode(editdatas?.Currency_code || "");
      setCountry(editdatas?.Country || "");
    }
  }, [editdatas]);

  const handleClickBack = () => {
    setEditUserMaster(false);
    setlistUserMaster(true);
  };

  const handlePutUserMaster = () => {
    let error = errorFilter({ noofusers, amountPerUser, effectiveDate });
    if (Object.keys(error)?.length > 0) {
      toast.error(`Some fields are empty: ${Object.keys(error).join(", ")}`, {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const payload = {
      id: editdatas?.id,
      AdditionalUser_Id: editdatas?.AdditionalUser_Id,
      Organization_Id:
        typeof editdatas?.Organization_Id === "object"
          ? editdatas?.Organization_Id?.id
          : editdatas?.Organization_Id ||
            Number(localStorage.getItem("OrganizationId")) ||
            1,
      No_Of_Users: Number(noofusers),
      Amount_Per_User: Number(amountPerUser),
      Total_Amount:
        Number(totalAmount) || Number(noofusers) * Number(amountPerUser),
      Effective_Date: effectiveDate,
      Status: status,
      Is_Deleted: editdatas?.Is_Deleted || false,
      Created_By:
        typeof editdatas?.Created_By === "object"
          ? editdatas?.Created_By?.id
          : editdatas?.Created_By ||
            Number(localStorage.getItem("UserId")) ||
            1,
      Updated_By: Number(localStorage.getItem("UserId")) || 1,
      Currency_code: currencyCode,
      Country: country,
      Is_active: editdatas?.Is_active ?? true,
    };

    axios
      .put(
        `${BASE_URL}/superadmin/AdditionalUserMasterCRUD/?id=${editdatas.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      )
      .then((res) => {
        if (res.data) {
          toast.success("User Master updated successfully");
          handleClickBack();
        } else {
          toast.error("Check your data");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something went wrong");
      });
  };

  return (
    <>
      <Grid container columns={12} spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>No. Of Users</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            placeholder="No. Of Users"
            variant="outlined"
            type="number"
            value={noofusers}
            onChange={(e) => {
              setNoofusers(e.target.value);
              setTotalAmount(
                (Number(e.target.value) * Number(amountPerUser)).toFixed(2),
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Amount Per User</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            placeholder="Amount Per User"
            variant="outlined"
            type="number"
            value={amountPerUser}
            onChange={(e) => {
              setAmountPerUser(e.target.value);
              setTotalAmount(
                (Number(noofusers) * Number(e.target.value)).toFixed(2),
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Total Amount</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            placeholder="Total Amount (auto-calculated)"
            variant="outlined"
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Effective Date</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <TextField
            className="w-100 col-12 input-box2"
            variant="outlined"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Status</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Autocomplete
            className="input-box2"
            options={statusOptions}
            value={status}
            onChange={(e, val) => setStatus(val || "pending")}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Status" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Country</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Autocomplete
            className="input-box2"
            options={Countries}
            getOptionLabel={(option) => option?.name || option}
            value={Countries.find((c) => c?.name === country) || null}
            onChange={(e, val) => setCountry(val?.name || "")}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Country" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography sx={[input_label]}>Currency Code</Typography>
        </Grid>
        <Grid item xs={12} md={9}>
          <Autocomplete
            className="input-box2"
            options={Countries}
            getOptionLabel={(option) => option?.currency || option}
            value={Countries.find((c) => c?.currency === currencyCode) || null}
            onChange={(e, val) => setCurrencyCode(val?.currency || "")}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select Currency" />
            )}
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
          onClick={handlePutUserMaster}
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

export default EditUserMaster;
