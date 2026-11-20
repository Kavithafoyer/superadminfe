import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div/Div";
import {
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { ComponentHeading, DisplayFlex, FontStyle } from "../widgets/CRMStyles";
import { alpha } from "@material-ui/core";
import CreateInvoiceTemplate from "./CreateInvoiceTemplate";
import EditInvoiceTemplate from "./EditInvoiceTemplate";
import { CustomButton, DialogBox, NoRecordsPage } from "../widgets/StylesComponents";


const InvoiceListTemplates = ({ scrollHeight }) => {

  const token = localStorage.getItem("accesstoken");
  const header = {
    headers: {
      db: "crmuseradmin1",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const [listPage, setListPage] = useState(true);
  const [createPage, setCreatePage] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [transfer, setTransfer] = useState("");
  const [count, setCount] = useState(0);
  const [templates, setTemplates] = useState([]);


  const DeleteTemplate = async (template) => {
    try {
      const res = await axios.delete(`${BASE_URL}/useradmin/InvoiceTemplateCRUD/?id=${template?.id}`, header);
      console.log("Deleted", res?.data);
      fetchTemplates();
      setOpenDelete(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const handleSearchData = async (e) => {
    const searchdata = e.target.value;
    if (searchdata != "") {
      try {
        const response = await axios.get(`${BASE_URL}/useradmin/CRMUserTemplateSearch/?search=${searchdata}`, header)
        if (response?.data) {
          setTemplates(response?.data);
          setCount(response?.data?.length);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      fetchTemplates();
    }
  }


  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/useradmin/InvoiceTemplatelist/`, header);
      console.log("res.data:", res?.data)
      setTemplates(res?.data?.results);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);



  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: listPage === true ? "block" : "none" }}>
          <Typography sx={[ComponentHeading]}>
            Invoice Template List
          </Typography>
          <Typography sx={{ fontSize: "18px", fontWeight: 600, }}>
            Invoice Lists templates view and action
          </Typography>

          <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
            <Grid
              item
              className="filter"
              xs={12}
              md={7}
              sm={12}
              xl={7}
              sx={{ display: "flex", flexDirection: "row" }}
            />

            <Grid item xs={12} md={3} sm={12} xl={3}>
              {/* <TextField
                className="col-12 input-box2"
                id="outlined-search"
                type="search"
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineSearch size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: { xs: 0.5, md: 0 }, minWidth: 150 }}
              /> */}
            </Grid>

            <Grid item justifySelf={'flex-end'} xs={12} md={2} sm={12} xl={2}>
              <CustomButton
                onClick={() => {
                  setCreatePage(true);
                  setListPage(false);
                }}
                label="Create Template"
                Icon="createIcon"
                endIcon={true}
                sx={{ textAlign: "right", width: "100% !important" }}
              />
              {/* <Button
                type="button"
                sx={[ButtonStyle, UploadBtn, FontStyle, {
                  mt: { xs: 0.5, md: 0 },
                  ml: { xs: 0, md: 1 }
                }]}
                onClick={() => {
                  setCreatePage(true);
                  setListPage(false);
                }}
              >
                Create
              </Button> */}
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            {templates && templates?.length > 0 ?
              templates?.map((template) => (
                <Grid item key={template.id} xl={2}>
                  <Paper className="template-item" elevation={3} sx={{ height: "170px", overflow: "hidden", alignItems: 'center' }}>
                    {/* <Div sx={[DisplayFlex, { justifyContent: 'center !important', padding: "10px", }]} className="template-img">
                      <Div className="template-info" sx={{ alignItems: "center", textAlign: "center" }}>
                        <img
                          src="/images/icon-docs.png"
                          width={70}
                          height={70}
                          alt="crm"
                          style={{ marginLeft: "-10px" }}
                        />
                        <Typography sx={[FontStyle, { textAlign: "center" }]} className="template-name">
                          Invoice Template
                        </Typography>
                      </Div>
                    </Div> */}
                    <Div sx={[DisplayFlex, { justifyContent: 'center !important', alignItems: "center !important", padding: "10px", }]} className="template-img">
                      <Div className="template-info">
                        <img
                          src="/images/icon-docs.png"
                          width={70}
                          height={70}
                          alt="crm"
                        // style={{ marginLeft: "-10px" }}
                        />
                        <Typography sx={[FontStyle, { textAlign: "center", mt: 1 }]} className="template-name">
                          {/* {template?.Template_Name} */}
                          Invoice Template
                        </Typography>
                      </Div>
                    </Div>

                    <div className="template-actions" >
                      <Button sx={{ width: "100%", bgcolor: "#3a5a40", ":hover": { bgcolor: alpha("#3a5a40", 0.8), }, borderRadius: "0px !important" }} onClick={() => {
                        setEditPage(true);
                        setListPage(false);
                        setTransfer(template);
                      }}>
                        <MdModeEdit style={{ fontSize: "16px", color: "white" }} />
                      </Button>

                      <Button sx={{ width: "100%", bgcolor: "#bc4749", ":hover": { bgcolor: alpha("#bc4749", 0.8), }, borderRadius: "0px !important" }}
                        onClick={() => setOpenDelete(template)}>
                        <MdDeleteForever style={{ fontSize: "16px", color: "white" }} />
                      </Button>


                    </div>
                  </Paper>
                </Grid>
              )) : (
                <NoRecordsPage title={"Invoice Template List"} />
              )}
          </Grid>

          {/* code for purchase list table */}

        </Div>

        {createPage && (
          <CreateInvoiceTemplate
            setListPage={setListPage}
            setCreatePage={setCreatePage}
            fetchTemplates={fetchTemplates}
          />
        )}

        {editPage && (
          <EditInvoiceTemplate
            setListPage={setListPage}
            setEditPage={setEditPage}
            transfer={transfer}
            fetchTemplates={fetchTemplates}
          />
        )}
      </JumboContentLayoutMain>


      {/* delete dialog box */}
      <DialogBox
        open={openDelete}
        Content={"Are you sure you want to delete the invoice template"}
        onClickNo={() => {
          setOpenDelete(false);
        }}
        // onClickYes={() => {
        //   setOpenDelete(false);
        //   DeleteTemplate(transfer);
        // }}
        onClickYes={() => {
          DeleteTemplate(openDelete)
        }}
      />

      {/* <Dialog open={openDelete} maxWidth={'xs'} fullWidth>
        <DialogContent sx={{ pl: 4, pr: 4 }}>
          <Div>
            <Typography sx={[FontStyle]}>
              Are you sure you want to delete the invoice template
            </Typography>
          </Div>
        </DialogContent>
        <DialogActions>
          <Button
            sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
            onClick={() => DeleteTemplate(openDelete)}
          >
            Delete
          </Button>
          <Button
            sx={[DialogBoxCancelButton, FontStyle, ButtonStyle,]}
            onClick={() => setOpenDelete(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default InvoiceListTemplates;
