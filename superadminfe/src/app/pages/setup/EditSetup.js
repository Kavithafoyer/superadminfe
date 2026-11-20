import Div from "@jumbo/shared/Div/Div";
import {
  Autocomplete,
  Avatar,
  Button,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import StyledTableCell from "app/pages/StyledTableCell";
import { CloseIcon } from "app/icons/PngIcons";
import React, { useState, useEffect, useRef } from "react";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Card,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  Menu,
  TableContainer,
  TablePagination,
  TableRow,
  TableHead,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { BASE_URL } from "app/services/auth-services";
import Switch from '@mui/material/Switch';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment';
import { ButtonStyle, ComponentHeading, DialogBoxCancelButton, DialogBoxSaveButton, FontStyle } from "../widgets/CRMStyles";

const EditSetup = ({ scrollHeight, setListPage, update, fetchTemplates, setEditPage }) => {

  console.log("update", update?.Start_Date)

  const [rows, setRows] = useState(update?.Folloup_Scheduler);

  const [autocheck, setAutoCheck] = useState(update?.AutoResponse);
  const [responsename, setResponseName] = useState(update?.Response_Name);
  const [recordtype, setRecordType] = useState(update?.Record_Type);
  const [applied, setApplied] = useState(update?.Applied_To);
  const [type, setType] = useState(update?.Type);
  const [days, setDays] = useState(update?.No_Of_Days_After);
  const [edays, setEdays] = useState(update?.Recur_EveryDays)
  const [recure, setRecure] = useState(update?.Recur_EveryDay);
  // const[recured,setRecured]=useState(false);
  const [startdate, setStartdate] = useState(update?.Start_Date);
  const [enddate, setEnddate] = useState(update?.End_Date);
  const [noend, setNoend] = useState(null);
  const [temp, setTemp] = useState([]);
  const [follow, setFollow] = useState(null);
  const [tempid, setTempId] = useState(update?.Template_Id);
  const [dynamicid, setDynamicId] = useState(update?.Template_Id);
  const [startcheck, setStartCheck] = useState(true);
  const [endcheck, setEndCheck] = useState(true);

  useEffect(() => {
    setAutoCheck(update?.AutoResponse);
    setResponseName(update?.Response_Name);
    setRecordType(update?.Record_Type);
    setApplied(update?.Applied_To);
    setType(update?.Type);
    setDays(update?.No_Of_Days_After);
    setEdays(update?.Recur_EveryDays);
    setRecure(update?.Recur_EveryDay);
    setStartdate(update?.Start_Date);
    setEnddate(update?.End_Date);
    setTempId(update?.Template_Id);
    setDynamicId(update?.Template_Id);
    setRows(update?.Folloup_Scheduler)
  }, [])

  const [sortModel, setSortModel] = React.useState([
    {
      field: "commodity",
      sort: "asc",
    },
  ]);

  const handleRemoveRow = index => {
    setRows(oldValues => {
      return oldValues.filter((_, i) => i !== index)
    })
  }

  const handleAddRow = () => {

    const items = {

    };

    setRows([...rows, items]);
  };


  const Recordtype = [
    "Lead",
    "Deal",
    "Sales",
    "Contacts"
  ]

  const Applied = [
    "All Open Leads",
    "All Open Deals",
    "All Contacts"
  ]

  const handleRecureChange = (event) => {
    setType(event.target.value);
  };

  const changeRecur = (e) => {
    setRecure(e.target.value);
    setEdays("1")
  }

  // const changeRecurd=()=>{
  //   setRecured(!recured);
  // }

  const changeEndDate = (e) => {
    setNoend(e.target.value);
    setEndCheck(!endcheck);
  }

  //  Get Templates List

  const [datas, setDatas] = useState([]);
  const [datas1, setDatas1] = useState("");
  const token = localStorage.getItem("accesstoken")
  const item = "crmuseradmin1"
  const getData = async () => {

    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/CRMUserTemplateAdditional/`,
        {
          headers: {
            "db": item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Assuming setDatas is a state update function
      setDatas(response.data || []) ;
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const getData1 = async () => {

    try {
      const response = await axios.get(
        `${BASE_URL}/useradmin/CRMUserTemplateCRUD/?id=${dynamicid}`,
        {
          headers: {
            "db": item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Assuming setDatas is a state update function
      setDatas1(response.data?.Template_Name || []);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  useEffect(() => {
    getData();
    getData1();
  }, [])

  const handleAddChange = (index, event) => {

    const { name, value } = event.target;
    console.log("value", value);
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  }

  const handleAddChange1 = (index, event) => {

    const { name, value } = event.target;
    console.log("value check", value);
    const updatedRows = [...rows];
    updatedRows[index][name] = value?.Template_Name;
    console.log("updatedRows[index][name]", updatedRows[index][name])
    console.log("updatedRows", updatedRows)
    setRows(updatedRows);

    const updatedTemplateIds = [...tempid];
    updatedTemplateIds[index] = value.id;
    console.log("")
    setTempId(updatedTemplateIds);
  }


  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const switchDemo = () => {
    setAutoCheck(!autocheck)
  }

  // For Create Auto Response System 
  const currentDate = moment();
  const formattedDateTime = currentDate.format('YYYY-MM-DD HH:mm:ss');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "Static") {
      var payload = {
        "id": update?.id,
        "AutoResponse_Id": update?.AutoResponse_Id,
        "Response_Name": responsename,
        "AutoResponse": autocheck,
        "Record_Type": recordtype,
        "Applied_To": applied,
        "Type": type,
        "Start_Date": formattedDateTime,
        "End_Date": formattedDateTime,
        "No_Of_Days_After": days,
        "Recur_EveryDays": edays,
        "Recur_EveryDay": recure,
        "Folloup_Scheduler": rows,
        "Template_Id": tempid,
        "Created_By": 1,
        "Updated_By": 1
      };
    } else {
      var payload = {
        "id": update?.id,
        "AutoResponse_Id": update?.AutoResponse_Id,
        "Response_Name": responsename,
        "AutoResponse": autocheck,
        "Record_Type": recordtype,
        "Applied_To": applied,
        "Type": type,
        "No_Of_Days_After": days,
        "Start_Date": startdate,
        "End_Date": enddate,
        "Recur_EveryDays": edays,
        "Recur_EveryDay": recure,
        "Folloup_Scheduler": rows,
        "Template_Id": [dynamicid],
        "Created_By": localStorage.getItem("UserId"),
        "Updated_By": localStorage.getItem("UserId")
      };

    }
    console.log("payload", payload)
    try {
      const response = await axios.put(
        `${BASE_URL}/useradmin/CRMUserAutoResponseCRUD/`,
        payload,
        {
          headers: {
            "db": item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("response", response)
      toast.success("Updated successfully", {
        position: "top-right",
        autoClose: 100,
      });
      setEditPage(false);
      setListPage(true);
      fetchTemplates();

    } catch (error) {
      console.error("An error occurred:", error);
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
      <form onSubmit={handleSubmit} >
        <Div
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography sx={[ComponentHeading]}>
            Auto Responder System
          </Typography>
          <Div>
            <Switch color="info" {...label}

              checked={autocheck}
              onClick={switchDemo} />
          </Div>
        </Div>
        <Grid container spacing={2}>
        <Grid item xs={12} className="row" sx={{ mt: 1 }}>
          <Typography className="col-lg-3 col-sm-10 input-label">
            Auto Response Id 
          </Typography>
          <TextField
            className="col-sm-10 col-11 col-lg-4 search-select"
            id="outlined-basic"
            variant="outlined"
            sx={{ maxWidth: "335px", ml: 1.5 }}
            value={update?.AutoResponse_Id}
            placeholder="# Auto Response Id"
            disabled 
          />
        </Grid>

          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
            <Typography className="col-lg-3 col-sm-10 input-label">
              Name of Response <span className="required">*</span>
            </Typography>

            <TextField
              className="col-sm-10 col-11 col-lg-4 search-select"
              id="outlined-basic"
              placeholder="Name of Response"
              variant="outlined"
              value={responsename}
              sx={{ maxWidth: "335px", ml: 1.5,pl:"0px !important" }}
              onChange={(e) => {
                setResponseName(e.target.value);
              }}
            />
          </Grid>

          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
            <Typography className="col-lg-3 col-sm-10 input-label">
              Record Type <span className="required">*</span>
            </Typography>

            <Autocomplete
              className="col-sm-10 col-lg-4 search-select"
              id="outlined-basic"
              placeholder="Record Type"
              variant="outlined"
              value={recordtype}
              options={Recordtype}
              onChange={(e, newValue) => {
                console.log("newvalue", newValue)
                setRecordType(newValue)
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Activity Type" />
              )}
            />
          </Grid>

          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
            <Typography className="col-lg-3 col-sm-10 input-label">
              Applied To <span className="required">*</span>
            </Typography>

            <Autocomplete
              className="col-sm-10 col-lg-4 search-select"
              id="outlined-basic"
              placeholder="Applied To"
              variant="outlined"
              value={applied}
              options={Applied}
              onChange={(e, newValue) => {
                setApplied(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Applied To" />
              )}
            />
          </Grid>
          <Grid item xs={12} className="row" sx={{ mt: 1 }}>
            <Typography
              className="col-lg-4 col-sm-10 input-label"
              sx={{
                width: "270px !important",
              }}
            >
              Type <span className="required">*</span>
            </Typography>


            <RadioGroup
              sx={{
                display: "flex"
              }}
              className="col-lg-4"
              aria-label="position"
              name="position"
              defaultValue="top"
              value={type}
              onChange={handleRecureChange}
            >
              <FormControlLabel

                control={<Radio color="info" size="small" checked={type === "Static" ? true : ""} />}
                label="Static"
                value="Static"

              />
              <FormControlLabel
                control={<Radio color="info" size="small" checked={type === "Dynamic" ? true : ""} />}
                label="Dynamic"
                value="Dynamic" />
            </RadioGroup>
          </Grid>
          {type === "Dynamic" && <>
            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography className="col-lg-3 col-sm-10 input-label">
                Recurrence Pattern <span className="required">*</span>
              </Typography>
              <Card
                className="col-lg-6"
                sx={{
                  border: "2px solid #EEEEEE",
                  height: "300px",
                  width: "73% !important"
                }}
              >

                <FormControl component="fieldset">
                  <RadioGroup
                    vertical
                    aria-label="position"
                    name="position"
                    defaultValue="top"
                  >
                    <FormControlLabel

                      control={<Radio color="info" size="small" onClick={changeRecur} checked={recure === "Recur Everyday" ? true : false} />}
                      label="Recur Everyday"
                      value="Recur Everyday"
                    />
                    <Div
                      sx={{
                        display: "flex",
                      }}
                    >
                      <FormControlLabel
                        control={<Radio color="info" size="small" onClick={changeRecur}
                          checked={recure === "Recur Every" ? true : false} />}
                        label="Recur Every"
                        value="Recur Every" />
                      <TextField
                        value={edays}
                        onChange={(e) => {
                          setEdays(e.target.value);
                        }}
                        sx={{
                          width: "50px",
                          height: "0px !important",
                          padding: "0 !important",
                        }}

                      ></TextField>
                      <Div
                        sx={{
                          mt: 0.5,
                          ml: 1,
                        }}
                      >
                        Days
                      </Div>
                    </Div>
                    <Div
                      sx={{
                        display: "flex",
                        mt: 2,
                      }}
                    >
                      <FormControlLabel
                        className=""
                        control={<Radio color="info" size="small" checked={startcheck} onChange={() => {
                          setStartCheck(!startcheck)
                        }} />}
                        label="Start Date"
                      />
                      <FormControlLabel
                        sx={{
                          ml: 18,
                        }}
                        className=""
                        control={<Radio color="info" size="small"
                          checked={endcheck}
                          onChange={() => {
                            setEndCheck(!endcheck)
                            setNoend("");
                          }} />}
                        label="End Date"
                      />
                    </Div>
                    <Div
                      sx={{
                        display: "flex",
                      }}
                    >
                      <TextField
                        className="input-box"
                        onChange={(e) => {
                          setStartdate(e.target.value);
                        }}
                        sx={{
                          height: "4px !important",
                        }}
                        disabled={startcheck === false ? true : false}
                        type="datetime-local"
                      ></TextField>
                      <TextField
                        className="input-box"
                        onChange={(e) => {
                          setEnddate(e.target.value);

                        }}
                        sx={{
                          height: "4px !important",
                          ml: 4,
                        }}
                        type="datetime-local"
                        disabled={endcheck === false ? true : false}
                      ></TextField>
                    </Div>
                    {/* <Div
                    sx={{
                          display:"flex",
                          mt:5,
                          ml:50
                        
                          // ml:20
                    }}>
                    <FormControlLabel
                        value="No End Date"
                        control={<Radio color="info"  checked={noend==="No End Date"?true:false} onClick={changeEndDate} size="small" />}
                        label="No End Date"
                    
                      />

                    </Div> */}
                  </RadioGroup>

                  <Div
                    display="flex"
                    sx={{
                      mt: 7
                    }}
                  >
                    <Typography className="col-lg-3 col-sm-10 input-label">
                      Email Templates<span className="required">*</span>
                    </Typography>

                    <Autocomplete
                      id="outlined-basic"
                      className="search-select"
                      options={datas}
                      getOptionLabel={(option) => option?.Template_Name}
                      value={
                        datas.find((option) => option?.Template_Name === temp)
                      }
                      onChange={(e, newValue) => {
                        console.log("name", newValue?.Template_Name);
                        setTemp(newValue?.Template_Name);
                        setDynamicId(newValue?.id);
                      }}
                      variant="outlined"
                      sx={{ minWidth: "240px" }}
                      renderInput={(params) => (
                        <TextField {...params}
                          placeholder="Templates" />
                      )}
                    />


                  </Div>

                </FormControl>

              </Card>
            </Grid>
          </>}
        </Grid>


        {type === "Static" && <>

          <Grid container sx={{
            mt: 2
          }}>
            <Grid item xs={12} className="row" sx={{ mt: 1 }}>
              <Typography className="col-lg-3 col-sm-10 input-label">
                Follow Up Sheduler <span className="required">*</span>
              </Typography>
              <Div
                className="col-lg-9"
              >
                <JumboScrollbar
                  autoHeight={true}
                  autoHideTimeout={4000}
                  autoHeightMin={"100%"}
                  autoHide={true}
                  hideTracksWhenNotNeeded
                >
                  <Table
                    className="table table-bordered"
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                  >
                    <TableHead sx={{ top: "25px" }}>
                      <TableRow className="row">
                        <StyledTableCell
                          className="col-sm-12 col-md-4"
                          sx={{ pl: 3, fontWeight: 600, minWidth: "150px" }}
                        >
                          Follow Up Date
                        </StyledTableCell>
                        <StyledTableCell
                          className="col-sm-12 col-md-3"
                          sx={{ fontWeight: 600, minWidth: "150px" }}
                        >
                          Email Template
                        </StyledTableCell>

                        <StyledTableCell
                          className="col-sm-12 col-md-1"
                          sx={{
                            fontWeight: 600,
                            minWidth: "150px",
                            textAlign: "center",
                          }}
                        >
                          Action
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      {rows.map((data, index) => {
                        const { Follow_Up_Date, Email_Template } = data;
                        return (
                          <TableRow className="row" key={index}>
                            <StyledTableCell className="col-sm-12 col-md-4">

                              <Select
                                className="search-select col-12"
                                name="Follow_Up_Date"
                                value={Follow_Up_Date}
                                sx={{ pt: 1.3, pl: 1 }}
                                onChange={(e) => handleAddChange(index, e)}
                              >
                                <MenuItem value="After 7 Days">After 7 Days</MenuItem>
                                <MenuItem value="After 14 Days">After 14 Days</MenuItem>
                                <MenuItem value="After 21 Days">After 21 Days</MenuItem>
                                <MenuItem value="After 28 Days">After 28 Days</MenuItem>
                              </Select>
                            </StyledTableCell>
                            <StyledTableCell className="col-sm-12 col-md-3">

                              <Select
                                sx={{ pt: 1.3, pl: 1 }}
                                className="search-select col-12"
                                name="Email_Template"
                                value={Email_Template}
                                onChange={(e) => handleAddChange1(index, e)}
                              >
                                {datas && datas.map((data, index) => (<MenuItem key={data.id} value={data}>{data.Template_Name}</MenuItem>))}
                              </Select>
                            </StyledTableCell>

                            <StyledTableCell
                              className="col-sm-12 col-md-1"
                              sx={{ textAlign: "center" }}
                            >
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveRow(index)}
                              >
                                <MdDelete />
                              </IconButton>
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}

                    </TableBody>
                  </Table>
                </JumboScrollbar>
                <Button
                  onClick={handleAddRow}
                  sx={{ textTransform: "capitalize", fontSize: 14 }}
                >
                  + Add more lines
                </Button>
              </Div>
            </Grid>

          </Grid>
        </>}

        <DialogActions
          sx={{ display: "flex", justifyContent: "end", mt: 2 }}
        >
          <Button sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
            type="submit"
          >Save</Button>
          <Button
            sx={[DialogBoxCancelButton, FontStyle, ButtonStyle,]}
            autoFocus
            onClick={() => {
              setEditPage(false);
              setListPage(true);
            }}
          >
            Cancel
          </Button>
        </DialogActions>

      </form>
  );
};

export default EditSetup;
