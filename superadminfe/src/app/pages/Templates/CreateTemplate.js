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
import { toast } from "react-toastify";
import { ComponentHeading, FontStyle } from "../widgets/CRMStyles";
import {
  Cancelbutton,
  CustomButton,
  CustomCKEditor,
  errorFilter,
  htmlToText,
  requiredSpan,
} from "../widgets/StylesComponents";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { mailTemplates } from "./Templatesdata";

const CreateTemplate = ({ setListPage, setCreatePage, fetchTemplates }) => {
  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Creating Templates
  const [tempname, setTempName] = useState("");
  const [temptype, setTemptype] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [errors, setErros] = useState({});

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
      console.log("Some fields are missing", error);
    } else {
      var payload = {
        UserTemplate_Id: "",
        Template_Type: temptype,
        Template_Name: tempname,
        Template_Content: editorContent,
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
        Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
      };

      try {
        const res = await axios.post(
          `${BASE_URL}/useradmin/CRMUserTemplateCRUD/`,
          payload,
          header
        );
        if (res?.data) {
          toast.success("Created Successfully.");
          setTempName("");
          setTemptype("");
          setEditorContent("");
          setListPage(true);
          setCreatePage(false);
          fetchTemplates();
        }
      } catch (error) {
        console.error("Error creating template:", error);
        if (error.response && error.response.status === 403) {
          const errorMessage =
            error.response.data.details || "You don't have permission to do it";
          console.log(errorMessage);
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 100,
          });
        } else {
          toast.error(`${error}`, {
            position: "top-right",
            autoClose: 100,
          });
        }
      }
    }
  };

  return (
    <>
      <Typography sx={[ComponentHeading]}>Templates {requiredSpan}</Typography>

      <form onSubmit={handleTemplateSubmit}>
        <Div sx={{ minHeight: "350px" }}>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs={12} className="row">
              <Typography className="col-md-3" sx={[FontStyle, { mt: 1 }]}>
                Template Name
              </Typography>
              <div className="col-md-6">
                <TextField
                  className=" input-box2 w-full"
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
              </div>
            </Grid>

            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography className="col-md-3" sx={[FontStyle, { mt: 1 }]}>
                Template Type {requiredSpan}
              </Typography>
              <div className="col-md-6">
                <FormControl className="col-md-6">
                  <Autocomplete
                    className="search-select3 col-12 w-full"
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
                  />
                </FormControl>
                <div className="red">{errors?.temptype}</div>
              </div>
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
              {/* <CustomCKEditor
                initData={editorContent}
                onChange={setEditorContent}
              />
              <CKEditor
                editor={ClassicEditor}
                data={"<h1>asbcasibsab<h1>"}
                onChange={(event, editor) => {
                  const value = editor.getData();
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(value, "text/html");
                  const textContent = doc.body.textContent || "";
                  setEditorContent(textContent);
                }}
              /> */}
            </Grid>
          </Grid>
        </Div>

        <Div sx={{ mt: 5, display: "flex", justifyContent: "flex-start" }}>
          <CustomButton
            label="Save"
            Icon="saveIcon"
            type="submit"
            sx={{ mr: 1 }}
          />
          <Cancelbutton
            label="Cancel"
            onClick={() => {
              setListPage(true);
              setCreatePage(false);
              setTempName("");
              setTemptype("");
              setEditorContent("");
            }}
          />
        </Div>
      </form>
    </>
  );
};

export default CreateTemplate;
