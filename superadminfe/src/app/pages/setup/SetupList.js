import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar/JumboScrollbar";
import Div from "@jumbo/shared/Div/Div";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputAdornment,
  Grid,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModeEdit from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
// import Templates from "./Templates";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import SetUp from "./SetUp";
import EditSetup from "./EditSetup";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ButtonStyle, CRMTableHead, ComponentHeading, DialogBoxCancelButton, DialogBoxSaveButton, DisplayFlex, FontStyle, UploadBtn } from "../widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "../widgets/CRMTable";

const SetupList = ({ scrollHeight }) => {
  const [listPage, setListPage] = useState(true);
  const [createPage, setCreatePage] = useState(false);
  const [editPage, setEditPage] = useState(false);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [number, setNumber] = useState(1);
  const [responselist, setResponseList] = useState([]);
  const [update, setUpdate] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  const token = localStorage.getItem("accesstoken");

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/useradmin/CRMUserAutoResponseAdditional/`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setResponseList(res.data);
      setOpenDelete(false)
      console.log("check");
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };

  //   For Sorting

  const [showsort, setShowsort] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortData = (key, direction) => {
    const sortedData = [...responselist];

    sortedData.sort((a, b) => {
      const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setResponseList(sortedData);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
    setShowsort(false);
  };

  const handleUpdate = (data) => {
    setUpdate(data);
  };



  // Delete Template

  const Deletedata = async (response) => {

    try {
      const res = await axios.delete(
        `${BASE_URL}/useradmin/CRMUserAutoResponseCRUD/?id=${number}`,
        {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Deleted", res.data);
      toast.success("Deleted successfully", {
        position: "top-right",
        autoClose: 100,
      });
      fetchTemplates();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const errorMessage = error.response.data.details || "You don't have permission to do it";
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

  };






  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: listPage === true ? "block" : "none" }}>

          <Grid container alignItems={'center'} sx={{ my: 1 }}>
            <Grid
              item
              className="filter"
              xs={12}
              md={6.5}
              sm={12}
              xl={6.5}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <Div sx={[DisplayFlex]}>
                <Typography sx={[ComponentHeading]}>
                  Auto Response List
                </Typography>
              </Div>


            </Grid>
            <Grid item xs={12} md={4} sm={12} xl={4}>
              <TextField
                className="col-12 input-box"
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
                sx={{ minWidth: 150, mt: { xs: 0.5, md: 0 } }}
              />
            </Grid>
            <Grid sx={[DisplayFlex, { justifyContent: { sx: "left", md: "right" } }]} item xs={12} md={1.5} sm={12} xl={1.5}>
              <Button

                type="button"
                sx={[ButtonStyle, UploadBtn, FontStyle, {
                  mt: { xs: 0.5, md: 0 },
                  ml: 1,
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



          {/* code for purchase list table */}
          <React.Fragment>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={scrollHeight ? scrollHeight : 350}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table stickyHeader className="table" sx={{ minWidth: { xs: "auto", sm: 800 } }}>
                <TableHead sx={[CRMTableHead]}>
                  <CRMTableRow>
                    <CRMTableCell
                      onClick={() => handleSort("Created_Date")}
                      sx={{
                        color: "#2E4053",
                        fontWeight: 600,
                      }}
                    >
                      Date
                       
                    </CRMTableCell>
                    <CRMTableCell
                      sx={{ color: "#2E4053", fontWeight: 600 }}
                      onClick={() => handleSort("Response_Name")}
                    >
                      Response Name
                       
                    </CRMTableCell>
                    <CRMTableCell
                      sx={{ color: "#2E4053", fontWeight: 600 }}
                      onClick={() => handleSort("Record_Type")}
                    >
                      Record Type
                       
                    </CRMTableCell>
                    <CRMTableCell
                      sx={{ color: "#2E4053", fontWeight: 600 }}
                      onClick={() => handleSort("Applied_To")}
                    >
                      Applied To
                       
                    </CRMTableCell>

                    <CRMTableCell sx={{ color: "#2E4053", fontWeight: 600 }}>
                      Action
                    </CRMTableCell>
                  </CRMTableRow>
                </TableHead>
                <TableBody>
                  {responselist &&
                    responselist.length > 0 &&
                    responselist.map((response, index) => {
                      return (
                        <CRMTableRow hover>
                          <CRMTableCell data-title="Date">
                            {response.Created_Date.split("T")[0]}
                          </CRMTableCell>
                          <CRMTableCell data-title="Response Name">
                            {response.Response_Name}
                          </CRMTableCell>
                          <CRMTableCell data-title="Record Type">{response.Record_Type}</CRMTableCell>
                          <CRMTableCell data-title="Applied To">{response.Applied_To}</CRMTableCell>
                          <CRMTableCell data-title="Action" sx={{ display: "flex", justifyContent: { xs: "flex-end", sm: "center" } }}>
                            <IconButton
                              onClick={(event) => {
                                handleClickAction(event);
                                handleUpdate(response);
                                setNumber(response.id);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </CRMTableCell>

                          <Menu
                            id="menu-appbar"
                            anchorEl={anchorElAction}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            open={Boolean(anchorElAction)}
                            onClose={handleCloseAction}
                            sx={{
                              mt: 7,
                              mr: 5,
                              maxHeight: "300px",
                              width: "300px",
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                setEditPage(true);
                                setListPage(false);
                                setAnchorElAction(null);
                              }}
                            >

                              <ModeEdit sx={{ fontSize: 20, mr: 2 }} />
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => { setOpenDelete(response);setAnchorElAction(null) }}
                            >
                              <DeleteIcon sx={{ fontSize: 20, mr: 2 }} />
                              Delete
                            </MenuItem>
                          </Menu>
                        </CRMTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </JumboScrollbar>


          </React.Fragment>
        </Div>

        {createPage && (
          <SetUp
            setListPage={setListPage}
            setCreatePage={setCreatePage}
            fetchTemplates={fetchTemplates}
          // fetchTemplates={fetchTemplates}
          />
        )}

        {editPage && (
          <>
            <EditSetup
              setEditPage={setEditPage}
              update={update}
              fetchTemplates={fetchTemplates}
              setListPage={setListPage}
            />
          </>
        )}



        <Dialog open={openDelete} maxWidth={'xs'} fullWidth>
          <form>
            <DialogContent sx={{ pl: 4, pr: 4 }}>
              <Div>
                <Typography sx={[FontStyle]}>
                  Are you sure you want to delete the row
                </Typography>
              </Div>
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
                onClick={()=>Deletedata(openDelete)}
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
          </form>
        </Dialog>

        <>
          <>
            </>
        </>
      </JumboContentLayoutMain>
    </>
  );
};

export default SetupList;
