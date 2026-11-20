import React, { useState, useRef, useMemo, useEffect } from 'react';
import Div from "@jumbo/shared/Div";
import JoditEditor from 'jodit-react';
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ComponentHeading } from "app/pages/widgets/CRMStyles";
import {
  Grid,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { GrAttachment } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import { AiOutlineCloudUpload } from "react-icons/ai";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import useStateRef from 'react-usestateref';
import { toast } from 'react-toastify';
import { Cancelbutton, CustomButton } from '../widgets/StylesComponents';

const token = localStorage.getItem("accesstoken");


const CreateInvoiceTemplate = ({ scrollHeight, placeholder, setListPage, setCreatePage, fetchTemplates }) => {
  const editor = useRef(null);
  const [headerContent, setheaderContent] = useState('');
  const [footerContent, setfooterContent] = useState('');
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [base64, setbase64] = useState("");
  const [quotationRequestObj, setQuotationRequestObj] = useState({});
  const [imageList, setImageList, imageLists] = useStateRef([]);
  const [ImageUrl, setImageUrl] = useState([]);


  const handleImageUpload = (url) => {
    setImageUrl(url);
  };
  const handleChangeImage = (e) => {
    console.log("file uploaded: ", e.target.files[0]);
    console.log(e);
    let file = e.target.files[0];
    console.log("file.name", file?.name);
    setFileName(file?.name);
    setFileType(file?.type);
    if (file) {
      const reader = new FileReader();
      reader.onload = handleReaderLoaded;
      reader.readAsBinaryString(file);
      console.log("e.target.files[0].name", e.target.files[0]?.name);
      setSelectedImage(e.target.files[0]?.name);
      setQuotationRequestObj({
        ...quotationRequestObj,
        ["UploadFile"]: reader,
      });
    }
  };
  const handleReaderLoaded = (e) => {
    console.log("file uploaded 2: ", e);
    let binaryString = e.target.result;
    setbase64(btoa(binaryString));

  };

  const handleUpload = async () => {
    console.log("handleUpload 256");
    try {
      const payload = {
        Attachfile: base64,
        filename: fileName.replace(/\s+/g, ""),
        File_Name: fileName.replace(/\s+/g, ""),
        Uploadby: localStorage.getItem("Username"),
        filetype: fileType,
        Created_By: parseInt(localStorage.getItem("UserId")),
      };
      console.log("payload:", payload);

      const response = await axios.post(`${BASE_URL}/useradmin/ImageattachmentCRUD/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("ImageUpload", response.data);

      setSelectedFiles([...selectedFiles, response.data]);
      setFileName("");
      handleGetImage();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemovePdf = (index) => {
    const list = [...selectedFiles];
    list.splice(index, 1);
    setSelectedFiles(list);
  };

  const handleGetImage = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/useradmin/Imageattachmentlistwithoutpagination/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("Get Image", response?.data);
      // Assuming 'results' is your array of objects and 'tenantname' is the variable holding the tenant name
      const updatedResults = response?.data?.map(result => {
        // Extract the filename from the Attachfile URL
        const filename = result?.Attachfile.split('/').pop();
        // Construct the updated Attachfile URL with tenantname
        const updatedAttachfile = `${BASE_URL}/media/${filename}`;

        // Return the updated object
        return {
          ...result,
          Attachfile: updatedAttachfile
        };
      });
      console.log("updatedResults:", updatedResults);
      setImageList(updatedResults);
    } catch (error) {
      console.error(error);
    }

  }

  const config = () => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: placeholder || 'Start typing...'
  });

  const handleSubmit = async () => {
    console.log("headerContent:", headerContent);
    console.log("footerContent:", footerContent);
    try {
      const payload = {
        'HeaderTemplate': headerContent,
        'FooterTemplate': footerContent,
        'Created_By': localStorage.getItem("UserId"),
        'Updated_By': localStorage.getItem("UserId")
      }
      const response = await axios.post(`${BASE_URL}/useradmin/InvoiceTemplateCRUD/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("handleSubmit response", response);
      fetchTemplates();
      toast.success("Created successfully", {
        position: "top-right",
        autoClose: 100,
      });
      setCreatePage(false);
      setListPage(true);
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  }


  useEffect(() => {
    // Fetch the list of Images from the server
    handleGetImage();
  }, []);

  return (
    <>

      <Typography sx={[ComponentHeading]}>
        Create Invoice Template
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={12} md={12} sm={12} xl={12}>
              <Typography sx={[ComponentHeading]}>
                Header Template
              </Typography>
              <JoditEditor
                ref={editor}
                value={headerContent}
                config={config()}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setheaderContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => { }}
              />
            </Grid>

            <Grid item xs={12} md={12} sm={12} xl={12} sx={{ mt: 3 }}>
              <Typography sx={[ComponentHeading]}>
                Footer Template
              </Typography>
              <JoditEditor
                ref={editor}
                value={footerContent}
                config={config()}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => setfooterContent(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => { }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Div
            sx={{ p: 1, mt: 3.5, borderRadius: "4px", height: "95%", minHeight: "140px !important", }}
            className="card col-12"
          >
            <Typography
              variant="h4"
              fontWeight={500}
              sx={{ opacity: 0.9 }}
            >
              Attach a file{" "}
              <span style={{ paddingLeft: "5px" }}>
                <IconButton
                  size="small"
                  component="label"
                  onChange={handleChangeImage}
                >
                  <GrAttachment />
                  <TextField
                    hidden
                    type="file"
                    multiple
                    accept="application/pdf"
                    className="col-12"
                    sx={{
                      // minWidth: { xs: 0, md: "215px" },
                      backgroundColor: "transparent",
                    }}
                  />

                </IconButton>
              </span>
            </Typography>

            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={scrollHeight ? scrollHeight : 400}
              autoHide={true}
              hideTracksWhenNotNeeded
            >
              <Div
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: -1,
                  p: 0.5
                }}
              >
                <Typography variant="h4" sx={{ pt: 1, color: "#949494" }}>
                  {/* {selectedFiles?.length > 0 ? fileName : "No files selected"} */}
                  {fileName ? fileName : "No files selected"}
                </Typography>
                <Div sx={{ pl: 2 }}>
                  {fileName && (
                    <IconButton color="primary" onClick={handleUpload}>
                      <AiOutlineCloudUpload />
                    </IconButton>
                  )}
                </Div>
              </Div>

              {/* <Div>
                {selectedFiles?.map((opt, index) => {
                  console.log("OPT", opt);
                  return (
                    <Div
                      sx={{
                        minWidth: "150px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h4" className="pt-1 pe-2">
                        {index + 1}.
                      </Typography>
                      <Typography variant="h4" className="pt-1 pe-2">
                        {opt?.filename}
                      </Typography>
                      {selectedFiles != [] && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemovePdf(index)}
                        >
                          <MdClose />
                        </IconButton>
                      )}
                    </Div>
                  );
                })}
              </Div> */}

              <Div>
                <Grid container spacing={2}>
                  {/* {imageLists?.current.length > 0 && imageLists?.current?.map((result, index) => ( */}
                  {imageList?.length > 0 && imageList?.map((result, index) => (
                    <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
                      <Box className='card' sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <img
                          src={`${result?.Attachfile}`}
                          alt={`Image ${index + 1}`}
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        // Ensure image fits within the container
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Div>
            </JumboScrollbar>
          </Div>
        </Grid>

        {/* <Button
          type="submit"
          sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
          onClick={() => (handleSubmit())}
        >
          Save
        </Button>
        <Button
          sx={[DialogBoxCancelButton, FontStyle, ButtonStyle,]}
          onClick={() => {
            setCreatePage(false);
            setListPage(true);
          }}
        >
          Cancel
        </Button> */}

        <Div sx={{ mt: 2, mb: 1, ml: 1 }}>
          <CustomButton label="Save" Icon="saveIcon" type="submit" onClick={() => (handleSubmit())} sx={{ mr: 1 }} />
          <Cancelbutton label="Cancel" onClick={() => {
            setListPage(true);
            setCreatePage(false);
          }} />
        </Div>

      </Grid >
      <br />
    </>
  );
};
export default CreateInvoiceTemplate;