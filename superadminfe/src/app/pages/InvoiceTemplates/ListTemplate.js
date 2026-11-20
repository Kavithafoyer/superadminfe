import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar/JumboScrollbar";
import Div from "@jumbo/shared/Div/Div";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete, MdDeleteForever, MdModeEdit } from "react-icons/md";
// import Templates from "./Templates";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { EditIcon } from "app/icons/PngIcons";
import { ButtonStyle, ComponentHeading, DialogBoxCancelButton, DialogBoxSaveButton, DisplayFlex, FontStyle, UploadBtn } from "../widgets/CRMStyles";
import { alpha } from "@material-ui/core";
import CreateInvoiceTemplate from "./CreateTemplate";
import EditInvoiceTemplate from "./EditTemplate";

const InvoiceListTemplates = ({ scrollHeight }) => {

  const token = localStorage.getItem("accesstoken");

  const [listPage, setListPage] = useState(true);
  const [createPage, setCreatePage] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const [transfer, setTransfer] = useState("");
  const [templateList, setTemplateList] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);
  const [openDelete, setOpenDelete] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/useradmin/InvoiceTemplatelist/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
      }
      );
      console.log("res.data:", res.data)
      setTemplates(res.data?.results);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    // Fetch the list of templates from the server
    fetchTemplates();
  }, []);

  const DeleteTemplate = async (template) => {
    try {
      console.log("DeleteTemplate")
      console.log("template?.id", template)

      const res = await axios.delete(
        `${BASE_URL}/useradmin/InvoiceTemplateCRUD/?id=${template.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Deleted", res.data);
      fetchTemplates();
      setOpenDelete(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };



  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: listPage === true ? "block" : "none" }}>
          <Typography sx={{ fontSize: "16px", fontWeight: 600, }}>
            Invoice Template List
          </Typography>
          <Typography sx={[ComponentHeading]} >
            Invoice Lists templates view and action
          </Typography>

          <Grid container sx={{ mt: 2, mb: 1 }}>
            <Grid
              item
              className="filter"
              xs={12}
              md={6.4}
              sm={12}
              xl={6.4}
              sx={{ display: "flex", flexDirection: "row" }}
            ></Grid>

            <Grid item xs={12} md={3.8} sm={12} xl={3.8}>
              <TextField
                className="col-12 input-box1"
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
              />
            </Grid>

            <Grid item justifySelf={'flex-end'} xs={12} md={1.5} sm={12} xl={1.5}>
              <Button

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
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} >
            {templates &&
              templates?.map((template) => (
                <Grid item key={template.id} xl={2}>
                  <Paper className="template-item" elevation={3} sx={{ height: "170px", overflow: "hidden", alignItems: 'center' }}>
                    <Div sx={[DisplayFlex, { justifyContent: 'center !important', padding: "10px", }]} className="template-img">
                      <Div className="template-info" sx={{ alignItems: "center", textAlign: "center" }}>
                        <img
                          src="/images/icon-docs.png"
                          width={70}
                          height={70}
                          alt="crm"
                          style={{ marginLeft: "-10px" }}
                        />
                        <Typography sx={[FontStyle, { textAlign: "center" }]} className="template-name">
                          {/* {template?.Template_Name} */} Invoice Template
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
              ))}
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


      <Dialog open={openDelete} maxWidth={'xs'} fullWidth>
        <DialogContent sx={{ pl: 4, pr: 4 }}>
          <Div>
            <Typography sx={[FontStyle]}>
              Are you sure you want to delete the row
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
      </Dialog>
    </>
  );
};

export default InvoiceListTemplates;
