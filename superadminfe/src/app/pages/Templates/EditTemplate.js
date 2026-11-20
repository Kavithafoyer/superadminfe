import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ComponentHeading, FontStyle } from "../widgets/CRMStyles";
import { toast } from "react-toastify";
import {
  Cancelbutton,
  CustomButton,
  CustomCKEditor,
  errorFilter,
  requiredSpan,
} from "../widgets/StylesComponents";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const EditTemplate = ({
  setListPage,
  setEditPage,
  transfer,
  fetchTemplates,
}) => {
  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Editing Templates
  const [tempname, setTempName] = useState(transfer?.Template_Name);
  const [temptype, setTemptype] = useState(transfer?.Template_Type);
  const [editorContent, setEditorContent] = useState(
    transfer?.Template_Content
  );
  const [errors, setErros] = useState({});

  useEffect(() => {
    setTempName(transfer?.Template_Name);
    setTemptype(transfer?.Template_Type);
    setEditorContent(transfer?.Template_Content);
  }, [transfer]);

  const handleChange = (event, editor) => {
    var newContent = editor.getData();
    console.log("newContent", newContent);
    setEditorContent(newContent);
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();

    let error = errorFilter({ tempname, temptype, editorContent });
    setErros(error);

    if (Object.keys(error).length > 0) {
      toast.error("Some fields are missing");
    } else {
      var payload = {
        id: transfer?.id,
        UserTemplate_Id: transfer?.UserTemplate_Id,
        Template_Type: temptype,
        Template_Name: tempname,
        Template_Content: editorContent,
        Created_By: parseInt(transfer?.Created_By),
        Updated_By: parseInt(localStorage.getItem("UserId")),
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      };
      try {
        const res = await axios.put(
          `${BASE_URL}/useradmin/CRMUserTemplateCRUD/`,
          payload,
          header
        );
        if (res?.data) {
          setListPage(true);
          setEditPage(false);
          fetchTemplates();
          setTempName("");
          setTemptype("");
          setEditorContent("");
          toast.success("Edited Successfully.");
        }
      } catch (error) {
        console.error("Error creating template:", error);
      }
    }
  };

  return (
    <>
      {/* <Setting /> */}
      <Typography sx={[ComponentHeading]}>Templates</Typography>

      <form onSubmit={handleTemplateSubmit}>
        <Div sx={{ minHeight: "350px" }}>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs={12} className="row">
              <Typography className="col-md-3" sx={[FontStyle, { mt: 1 }]}>
                Template Name {requiredSpan}
              </Typography>
              <TextField
                className="col-md-6 input-box2"
                id="outlined-basic"
                name="templateName"
                value={tempname}
                onChange={(e) => {
                  setTempName(e.target.value);
                }}
                placeholder="Template Name"
                variant="outlined"
              />
              <div className="red">{errors?.tempname}</div>
            </Grid>

            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography className="col-md-3" sx={[FontStyle, { mt: 1 }]}>
                Template Type {requiredSpan}
              </Typography>
              <FormControl className="col-md-6">
                {/* <Select
                  className="search-select"
                  id="demo-customized-select-native"
                  sx={{ pt: 1.3, pl: 1 }}
                  value={temptype}
                  onChange={(e) => {
                    setTemptype(e.target.value)
                  }}
                >
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Document">Document</MenuItem>
                  <MenuItem value="Campaign">Campaign</MenuItem>
                </Select> */}
                <Autocomplete
                  className="search-select3 col-12"
                  name="date"
                  options={["Email", "Document", "Campaign"]}
                  getOptionLabel={(option) => {
                    return option;
                  }}
                  value={temptype}
                  onChange={(e, newValue) => {
                    setTemptype(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="date"
                      placeholder="Select Template Type"
                    />
                  )}
                />{" "}
                <div className="red">{errors?.temptype}</div>
              </FormControl>
            </Grid>

            <Grid item xs={9} sx={{ mt: 3, ml: 1 }}>
              {/* <CKEditor
                content={editorContent}
                events={{
                  // blur: onBlur,
                  // afterPaste: afterPaste,
                  change: onChange,
                }}
              /> */}

              <CKEditor
                editor={ClassicEditor}
                data={editorContent}
                content={editorContent}
                onChange={handleChange}
              />
              <div className="red">{errors?.editorContent}</div>
            </Grid>
          </Grid>
        </Div>

        <Div sx={{ mt: 5, display: "flex", justifyContent: "flex-start" }}>
          {/* <Button type="submit" sx={[DialogBoxSaveButton, ButtonStyle, FontStyle, { mr: 1 }]}>
            Save
          </Button>
          <Button sx={[DialogBoxCancelButton, ButtonStyle, FontStyle]} onClick={() => {
            setListPage(true);
            setEditPage(false);
          }}>Cancel</Button> */}

          <CustomButton
            label="Update"
            type="submit"
            Icon="saveIcon"
            sx={{ mr: 1 }}
          />
          <Cancelbutton
            label="Cancel"
            onClick={() => {
              setListPage(true);
              setEditPage(false);
            }}
          />
        </Div>
      </form>
    </>
  );
};

export default EditTemplate;
