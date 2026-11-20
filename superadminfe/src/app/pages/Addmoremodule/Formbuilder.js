import React, { useEffect, useState } from "react";
import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Div from "@jumbo/shared/Div";
import { toast } from "react-toastify";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain";
import { FormBuilder as FormBuilderIo, Formio } from "react-formio";
import "./stylesmodule.css";
import "formiojs/dist/formio.full.css";
import { makeStyles } from "@mui/styles";
import {
  ComponentHeading,
  DialogHeader,
  DisplayFlex,
  FontStyle,
} from "../widgets/CRMStyles";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import {
  Cancelbutton,
  CustomButton,
  DialogBox,
} from "../widgets/StylesComponents";

const useStyles = makeStyles({
  fieldInSideToolbar: {
    // Add your custom styles for the fields in the side toolbar
    // For example:
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    padding: "5px",
    margin: "5px",
    borderRadius: "4px",
  },
  // Add more styles as needed
});

const url = `https://safe-springs-353/06.herokuapp.com/api/formdata?cid=`;

const customBuilder = {
  basic: false,
  advanced: false,
  data: false,
  premium: false,
  layout: false,
  customBasic: {
    title: 'Components',
    default: true,
    weight: 1,
    components: {
      textfield: true,
      textarea: true,
      email: true,
      phoneNumber: true,
      number: true,
      address: true,
      datetime: true,
      day: true,
      time: true,
      checkbox: true,
      selectboxes: true,
      select: true,
      radio: true,
      button: true
    }
  },
  customLayout: {
    title: 'Layout',
    weight: 2,
    components: {
      columns: true
    }
  }


};
const FormBuilder = () => {

  const [formData, setFormData] = useState({});
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [isPreviewOpen1, setPreviewOpen1] = useState(false);
  const [JSON_QUESTION_DATA, setJSON_QUESTION_DATA] = useState([]);
  const [FormName, setFormName] = useState("");
  const token = localStorage.getItem("accesstoken");
  let json = {};

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
    console.log("handleFormNameChange:", e.target.value);
  };

  const gotoprint = () => {
    console.log("formData:", formData);
    console.log("JSON_QUESTION_DATA:", JSON_QUESTION_DATA);
  };

  const handleCreate = () => {
    let payload = {
      FormName: FormName,
      FormSTR: formData,
      Created_By: localStorage?.getItem("UserId"),
      Updated_By: localStorage?.getItem("UserId"),
      Organization_Id: localStorage?.getItem("OrganizationId"),
    };
    console.log("handleCreate:", payload);
    axios
      .post(`${BASE_URL}/user/CustomizeFormCRUD/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("Data posted to CustomizeFormCRUD ", res);
        toast.success("Customise Form Created successfully", {
          position: "top-right",
          autoClose: 100,
        });
        window.location.reload();
        setFormData({});
        setPreviewOpen(false);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const openPreview = () => {
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  const printResult = () => {
    Formio.createForm(document.getElementById("formio-result"), {
      components: formData.components,
    }).then((form) => {
      setJSON_QUESTION_DATA(form.component.components);
      console.log("JSON Value", form);
      form.on("submit", (data) => console.log("submit", data));
    });
  };

  useEffect(() => {
    const sidebarComponents = document.querySelectorAll(
      ".builder-sidebar .component"
    );
    sidebarComponents.forEach((component) => {
      component.style.width = "300px";
    });
  }, []);


  return (
    <>
      <JumboContentLayoutMain>
        <Div>
          <Typography
            sx={[
              ComponentHeading,
              { textAlign: "left", fontWeight: 600, mb: 2 },
            ]}
          >
            Create New Form
          </Typography>

          <Div>
            <Stack
              direction={{ md: "row", xs: "column" }}
              justifyContent={"right"}
              padding={"0.5rem"}
            >
              {/* <Stack direction={"row"}>
              

                <CustomButton
                  label="Display Result"
                  width={"140px"}
                  Icon=""
                  onClick={printResult}
                />
              </Stack> */}
              <Stack direction={"row"} spacing={2}>
                {/* 
                <Button
                  // onClick={() => {
                  //   Productrowfun();
                  //   setShowAddModule(true);
                  // }}
                  sx={[DialogBoxCancelButton, ButtonStyle, FontStyle, { width: '100px !important' }]}
                >
                  Cancel
                </Button> */}

                {/* <Cancelbutton label="Cancel" Icon="cancelIcon" /> */}

                <CustomButton
                  label="Save"
                  Icon="saveIcon"
                  type="submit"
                  onClick={(event) => {
                    console.log("Form Data ", formData);
                    event.preventDefault(); // Prevent the default behavior
                    openPreview();
                  }}
                />
              </Stack>
            </Stack>

            <FormBuilderIo
              form={formData}
              onChange={(data) => {
                json = data;
              }}
              onSaveComponent={(data) => {
                setFormData(json)
              }}
              saveForm={(schema) => {
                setFormData(schema);
              }}
              saveText="Save Form"
              options={{
                builder: customBuilder,
                styles: {
                  input: { padding: "10px", margin: "10px 0", width: "100%" },
                  button: { padding: "10px 20px", backgroundColor: "#007BFF", color: "white" },
                },
              }}
            />

            <div
              style={{
                display: "none",
              }}
            >
              <div
                id="formio-result"
                style={{ fontSize: "14px !important", fontWeight: 400 }}
              />
            </div>
          </Div>
        </Div>
        <Dialog
          scroll="body"
          PaperProps={{
            sx: {
              borderRadius: "5px",
              boxShadow: "0px 4px 4px 5px rgba(0, 0, 0, 0.25)",
            },
          }}
          open={isPreviewOpen}
          // onClose={() => { setShowAddPriceBook(false); clear(); setOpen(); }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
          fullWidth
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={[DialogHeader, DisplayFlex, { bgcolor: "#dcdcdc !important" }]}
          >
            Module Details
          </DialogTitle>

          <Div>
            <DialogContent sx={{ background: "#FFFFFF", p: "8px" }}>
              <Card
                sx={{
                  borderRadius: "5px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={12} lg={12} sx={{ p: 1, py: 0 }}>
                    <Div sx={{ minWidth: "150px", width: "100%" }}>
                      <Typography mb={1} sx={[FontStyle, {}]}>
                        Module Name
                      </Typography>
                      <Typography mb={0.1} sx={[FontStyle, {}]}>
                        {" "}
                        Form Name
                      </Typography>
                      <TextField
                        sx={{
                          "& fieldset": {
                            borderRadius: "5px",
                          },
                          MinWidth: "325px",
                          maxWidth: "325px",
                          width: "100%",
                        }}
                        value={FormName}
                        onChange={handleFormNameChange}
                        className="input-box "
                        id="outlined-basic"
                        placeholder="Enter Module Name"
                        variant="outlined"
                      />
                      {/* <Div style={{ color: "red" }}>{errors.name?.message}</Div> */}
                    </Div>
                  </Grid>
                  {/* <Grid item xs={12} md={12} lg={12} sx={{ p: 1, py: 0 }} >
                    <Div sx={{ minWidth: "150px", width: "100%" }} >
                      <Typography mb={0.1} sx={[FontStyle,{ }]} >Singular form of module name</Typography>
                      <TextField
                        sx={{
                          "& fieldset": {
                            borderRadius: "5px",
                          },
                          MinWidth: "325px",
                          maxWidth:'325px',
                          width: "100%"
                        }}
                        // value={addField.priceBookName}
                        // onChange={(e) => }
                        className="input-box "
                        id="outlined-basic"
                        placeholder="Enter Module Name"
                        variant="outlined"

                      />
                      <Div style={{ color: "red" }}>{errors.name?.message}</Div>
                    </Div>
                  </Grid> */}
                </Grid>
              </Card>
            </DialogContent>

            <DialogActions>
              <Cancelbutton label="Cancel" onClick={closePreview} />

              <CustomButton
                label="Create"
                Icon="createIcon"
                type="submit"
                onClick={handleCreate}
              />
            </DialogActions>
          </Div>

          <DialogBox
            open={isPreviewOpen1}
            onClickNo={() => {
              setPreviewOpen(false);
            }}
            onClickYes={() => {
              setPreviewOpen1(false);
              setPreviewOpen(false);
            }}
          />
        </Dialog>
      </JumboContentLayoutMain>
    </>
  );
};

export default FormBuilder;
