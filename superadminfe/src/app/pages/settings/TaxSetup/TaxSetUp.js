import Div from "@jumbo/shared/Div";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  dialogTitle,
  DisplayFlex,
  input_label,
} from "app/pages/widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
  errorRequired,
} from "app/pages/widgets/StylesComponents";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TaxSetUp = ({ editData, setCreateAndEditTax, getData, currentPage }) => {
  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const [taxSection, setTaxSection] = useState("");
  const [taxPrecentage, setTaxPrecentage] = useState("");
  const [taxId, setTaxId] = useState("");
  const [taxDescription, setTaxDescription] = useState("");
  const [save, setSave] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleClickBack = () => {
    setCreateAndEditTax(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage == "Create") {
      if (taxSection === "" || taxSection === null || taxSection === undefined || taxDescription === "" || taxDescription === null || taxDescription === undefined || taxSection === "" || taxSection === null || taxSection === undefined) {
        toast.error("Invalid Data");
      } else {

        let Payload = {
          // Tax_Id: Boolean(taxId) && taxId,
          Tax_Name: taxSection,
          Description: taxDescription,
          Tax_Percentage: taxPrecentage,
          Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
          Created_By: parseInt(localStorage.getItem("UserId")),
          Updated_By: parseInt(localStorage.getItem("UserId")),
        };
        await axios.post(`${BASE_URL}/user/TaxsetupCRUD/`, Payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then(async (res) => {
            console.log("TaxsetupCRUD", res.data);
            toast.success(
              `Tax is created successfully`
            );
            getData();
            setCreateAndEditTax(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      let error = errorRequired({
        taxId,
        taxSection,
        taxDescription,
        taxPrecentage,
      });
      // if (!Boolean(taxId?.length == 11)) {
      //   if (!Boolean(error.taxId)) error.taxId = "Tax Id must be 11 digits.";
      // }
      setErrors(error);

      console.log("errorsssss", error);

      if (Object.keys(error).length === 0) {
        let Payload = {};
        let method = "";

        if (Boolean(currentPage == "Create")) {
          method = "post";
          Payload = {
            Tax_Id: Boolean(taxId) && taxId,
            Tax_Name: taxSection,
            Description: taxDescription,
            Tax_Percentage: taxPrecentage,
            Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
            Created_By: parseInt(localStorage.getItem("UserId")),
            Updated_By: parseInt(localStorage.getItem("UserId")),
          };
          console.log("Post ", Payload);
        } else {
          method = "put";
          Payload = {
            id: editData?.id,
            Tax_Id: taxId,
            Tax_Name: taxSection,
            Description: taxDescription,
            Tax_Percentage: taxPrecentage,
            Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
            Created_By: parseInt(localStorage.getItem("UserId")),
            Updated_By: parseInt(localStorage.getItem("UserId")),
          };
        }

        await axios[method](`${BASE_URL}/user/TaxsetupCRUD/`, Payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then(async (res) => {
            console.log("TaxsetupCRUD", res.data);
            toast.success(
              `Tax is ${(method = "put" ? "updated" : "created")} successfully`
            );
            getData();
            setCreateAndEditTax(false);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        toast.error("Please fill the required fields");
      }
    }


  };

  useEffect(() => {
    if (currentPage == "Edit") {
      setTaxSection(editData?.Tax_Name);
      setTaxPrecentage(editData?.Tax_Percentage);
      setTaxId(editData?.Tax_Id);
      setTaxDescription(editData?.Description);
    }
  }, [editData]);

  return (
    <Dialog
      open={Boolean(currentPage)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={{ xs: "md", md: false }}
      fullWidth={{ xs: "", md: false }}
      sx={{ "& .MuiDialog-paper": { width: { xs: "", md: "600px" } } }}
    >
      <DialogTitle sx={[dialogTitle, DisplayFlex]}>
        {currentPage} Tax Setup
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {Boolean(currentPage == "Edit") && (
              <>
                <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                  <Typography sx={input_label}>Tax Id</Typography>
                </Grid>

                <Grid item xs={12} md={7} sx={{ py: 0.4, px: 1 }}>
                  <TextField
                    sx={{
                      "& fieldset": { borderRadius: "5px" },
                      width: "100%",
                    }}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="# Tax Id"
                    className={`col-12 input-box2`}
                    id="outlined-basic"
                    variant="outlined"
                    disabled={Boolean(currentPage == "Edit") && true}
                  />
                  {errors?.taxId && (
                    <Div style={{ color: "red" }}>{errors?.taxId}</Div>
                  )}
                </Grid>
              </>
            )}

            <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
              <Typography sx={input_label}>Tax Name</Typography>
            </Grid>

            <Grid item xs={12} md={7} sx={{ py: 0.4, px: 1 }}>
              <TextField
                sx={{
                  "& fieldset": { borderRadius: "5px" },
                  width: "100%",
                }}
                value={taxSection}
                onChange={(e) => setTaxSection(e.target.value)}
                placeholder="Tax Name"
                className={`col-12 input-box2`}
                id="outlined-basic"
                variant="outlined"
              />
              {errors?.taxSection && (
                <Div style={{ color: "red" }}>{errors?.taxSection}</Div>
              )}
            </Grid>

            <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
              <Typography sx={input_label}>Tax Percentage</Typography>
            </Grid>

            <Grid item xs={12} md={7} sx={{ py: 0.4, px: 1 }}>
              <TextField
                sx={{
                  "& fieldset": { borderRadius: "5px" },
                  width: "100%",
                }}
                value={taxPrecentage}
                onChange={(e) => setTaxPrecentage(e.target.value)}
                placeholder="Tax Percentage"
                className={`col-12 input-box2`}
                id="outlined-basic"
                variant="outlined"
              />
              {errors?.taxPrecentage && (
                <Div style={{ color: "red" }}>{errors?.taxPrecentage}</Div>
              )}
            </Grid>

            <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
              <Typography sx={input_label}>Description</Typography>
            </Grid>

            <Grid item xs={12} md={7} sx={{ py: 0.4, px: 1 }}>
              <TextField
                sx={{
                  "& fieldset": { borderRadius: "5px" },
                  width: "100%",
                }}
                multiline
                rows={4}
                value={taxDescription}
                onChange={(e) => setTaxDescription(e.target.value)}
                placeholder="Tax Name Description"
                className={`col-12`}
                id="outlined-basic"
                variant="outlined"
              />
              {errors?.taxDescription && (
                <Div style={{ color: "red" }}>{errors?.taxDescription}</Div>
              )}
            </Grid>
          </Grid>
        </DialogContentText>
        <DialogActions sx={[DisplayFlex, { justifyContent: "center", mt: 5 }]}>
          <CustomButton
            label="Save"
            Icon="saveIcon"
            onClick={handleSubmit}
            type="submit"
          />
          <Cancelbutton label="Cancel" onClick={() => setSave(true)} />
        </DialogActions>

        {/* close dialog box */}
        <DialogBox
          open={save}
          onClickNo={() => setSave(false)}
          onClickYes={() => {
            setSave(false);
            handleClickBack();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
export default TaxSetUp;