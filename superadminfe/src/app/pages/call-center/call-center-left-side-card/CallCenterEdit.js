import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import CalendarTodaySharpIcon from "@mui/icons-material/CalendarTodaySharp";
import FactorySharpIcon from "@mui/icons-material/FactorySharp";
import TextSnippetSharpIcon from "@mui/icons-material/TextSnippetSharp";
import RestoreSharpIcon from "@mui/icons-material/RestoreSharp";
import * as yup from "yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
import { useQuery, useQueryClient } from 'react-query';
import CloseIcon from "@mui/icons-material/Close";
import { DisplayFlex } from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";

const CallCenterEdit = ({ openEditContact, setOpenEditContact, update, getActivityStreamRefetch }) => {

  console.log("openEditContact", update)

  const [condatas, setCondatas] = useState([]);

  const token = localStorage.getItem("accesstoken")
  const item = "crmuseradmin1"

  const getReceiverData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/ContactAdditional/?Is_Deleted=False`,
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response?.data?.results;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to handle it in the component
    }
  };

  const { data: receiverData, isLoading: receiverDataLoading, isError: receiverDataError, refetch: ReceiverDataRefetch } = useQuery(
    ['receiverData'],
    getReceiverData,
    { staleTime: Infinity }
  );

  useEffect(() => {
    if (receiverData) {
      setCondatas(receiverData);
    }
  }, [receiverData]);

  useEffect(() => {

    setSelectDate1(update.Selected_Date);
    setComname1(update.Company_Name);
    setActivity1(update.Activity_relates);
    setType1(update.Activity_Type);
    setNext1(update.Next_SheduledTime);
    setDetails1(update.Details);
    setActivityStatus1(update.Select_Status);
    setReceiver1(update.Receiver_Name);
    setPnumber1(update.Contact_Number);

  }, [update])


  const [number, setNumber] = useState(1);
  const [selectDate1, setSelectDate1] = useState(update.Selected_Date);
  const [comname1, setComname1] = useState(update.Company_Name);
  const [activity1, setActivity1] = useState(update.Activity_relates);
  const [type1, setType1] = useState(update.Activity_Type);
  const [activitystatus1, setActivityStatus1] = useState(update.Select_Status);
  const [next1, setNext1] = useState(update.Next_SheduledTime);
  const [details1, setDetails1] = useState(update.Details);
  const [receiver1, setReceiver1] = useState(update.Receiver_Name);
  const [pnumber1, setPnumber1] = useState(update.Contact_Number);
  const [contactid1, setContactid1] = useState(null);
  // console.log("typ1",type1)
  const dropdownvisit = ['Visit', "Call"]

  const dropdownList = ['Lead', 'Account', 'Contact']

  const dropdownStatus = ['Completed', "Postponed", "Not Responding", "Call Back", "Cancelled"]

  const validationSchema = yup.object().shape({
    selectDate1: yup.string().required("Select Date is required"),
    comname1: yup.string().required("Copmany Name is required"),
    activity1: yup.string().required("Activity is required"),
    receiver1: yup.string().required("Receiver is required"),
    type1: yup.string().required(" Activity Type is required"),
    details1: yup.string().required("Details is required"),
    activitystatus1: yup.string().required("Activity Status is required"),
    next1: yup.string().required("Sheduled Date is required"),
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onsubmit = async () => {
    // console.log("submit")
    try {
      const payload = {
        "id": update.id,
        "CallCenter_Id": update.CallCenter_Id,
        "Company_Name": comname1,
        "Receiver_Name": receiver1,
        "Details": details1,
        "Activity_relates": activity1,
        "Selected_Date": selectDate1,
        "Contact_Number": pnumber1,
        "Select_Status": activitystatus1,
        "Next_SheduledTime": next1,
        "Activity_Type": type1,
        "Contact_Id": contactid1,
        "Organization_Id": localStorage.getItem("OrganizationId"),
        "Created_By": localStorage.getItem("UserId"),
        "Updated_By": localStorage.getItem("UserId")
      };

      // console.log("payload", payload);

      const response = await axios.put(
        `${BASE_URL}/user/CallcenterActivityCRUD/`,
        payload,
        {
          headers: {
            "db": item,
            Authorization: `Bearer ${token}`, // Make sure 'token' is defined before calling this function
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      // console.log(response.data);

      setOpenEditContact(false);
      toast.success("Updated successfully", {
        position: "top-right",
        autoClose: 100
      });
      await getActivityStreamRefetch();
      reset();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (<>

    <Dialog
      open={openEditContact}
      // onClose={() => setOpenEditContact(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: "18px", verticalAlign: "middle" }}>
          Edit Activity
        </Typography>
        <IconButton
          onClick={() => setOpenEditContact(false)}
          sx={{ float: "right" }}
        >
          <CloseIcon sx={{ color: "white",}}/>
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onsubmit)} >
        
            <DialogContentText id="alert-dialog-description">
              <Stack direction={"column"} spacing={1}>
                <Stack>
                  <TextField
                    {...register('selectDate1')}
                    type="date"
                    className={`col-md-12 input-box mt-1 ${errors.selectDate1 ? "is-invalid" : ""
                      }`}
                    id="outlined-basic"
                    placeholder="Select Date"
                    variant="outlined"
                    value={selectDate1}
                    onChange={(e) => {
                      setSelectDate1(e.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarTodaySharpIcon />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "15px",
                      },
                    }}
                  />
                  <Div style={{ color: "red" }}>{errors.selectDate1?.message}</Div>
                </Stack>
                <Stack>
                  <TextField
                    {...register('comname1')}
                    className={`col-md-12 input-box mt-1 ${errors.comname1 ? "is-invalid" : ""
                      }`}
                    id="outlined-basic"
                    placeholder="Enter Company Name"
                    variant="outlined"
                    value={comname1}
                    onChange={(e) => {
                      setComname1(e.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FactorySharpIcon />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "15px",
                      },
                    }}
                  />
                  <Div style={{ color: "red" }}>{errors.comname1?.message}</Div>
                </Stack>
                <Stack>
                  <TextField
                    {...register('pnumber1')}
                    className={`col-md-12 input-box mt-1 ${errors.pnumber1 ? "is-invalid" : ""
                      }`}
                    value={pnumber1}
                    id="outlined-basic"
                    placeholder="Conatct Number"
                    variant="outlined"
                    onChange={(e) => {
                      setPnumber1(e.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FactorySharpIcon />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "15px",
                      },
                    }}
                  />
                  <Div style={{ color: "red" }}>{errors.pnumber?.message}</Div>
                </Stack>
                <Stack>
                  <FormControl>
                    <Autocomplete
                      {...register('activity1')}
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option.value) {
                          return option.value;
                        }
                        return "";
                      }}
                      options={dropdownList}
                      value={activity1}
                      onChange={(e, newValue) => {
                        setValue('activity1', newValue);
                        setActivity1(newValue)
                      }}


                      className={`col-md-12 input-select1 mt-1 ${errors.activity1 ? "is-invalid" : ""
                        }`}
                      renderInput={(params) => (
                        <TextField {...params}

                          placeholder="Acyivity relates to"

                        />
                      )}
                    />
                  </FormControl>
                  <Div style={{ color: "red" }}>{errors.activity1?.message}</Div>
                </Stack>
                <Stack>
                  <Autocomplete
                    {...register('receiver1')}
                    getOptionLabel={(option) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      if (option && option?.Name) {
                        return option?.Name;
                      }
                      return "";
                    }}


                    options={condatas}

                    className={`col-md-12 input-select1 mt-1 ${errors.receiver1 ? "is-invalid" : ""
                      }`}
                    //    getOptionLabel={(option) => option?.Name}
                    value={receiver1}
                    onChange={(e, newValue) => {
                      // console.log("name",newValue?.Name);
                      setContactid1(newValue?.id);
                      setReceiver1(newValue?.Name);
                      setValue('receiver1', newValue?.Name);
                    }}
                    id="outlined-basic"

                    renderInput={(params) => (
                      <TextField {...params}

                        placeholder="Receiver"

                      />
                    )}

                  />
                  <Div style={{ color: "red" }}>{errors.receiver1?.message}</Div>
                </Stack>
                <Stack>
                  <FormControl>
                    <Autocomplete
                      {...register('type1')}

                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option.value) {
                          return option.value;
                        }
                        return "";
                      }}


                      onChange={(e, newValue) => {
                        setValue('type1', newValue);
                        setType1(newValue);
                      }}
                      options={dropdownvisit}
                      value={type1}
                      className={`col-md-12 input-select1 mt-1 ${errors.type1 ? "is-invalid" : ""
                        }`}
                      renderInput={(params) => (
                        <TextField {...params}
                          placeholder="Activity Type"
                        />
                      )}
                    />
                  </FormControl>
                  <Div style={{ color: "red" }}>{errors.type1?.message}</Div>
                </Stack>
                <Stack>
                  <TextField
                    {...register('details1')}
                    onChange={(e) => {
                      setDetails1(e.target.value);
                    }}

                    className={`col-md-12 input-box mt-1 ${errors.details1 ? "is-invalid" : ""
                      }`}
                    value={details1}
                    id="outlined-basic"
                    placeholder="Enter Details"
                    variant="outlined"

                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TextSnippetSharpIcon />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "15px",

                      },
                    }}
                    multiline
                    row={5}
                  />
                  <Div style={{ color: "red" }}>{errors.details1?.message}</Div>
                </Stack>
                <Stack>
                  <FormControl>
                    <Autocomplete
                      getOptionLabel={(option) => {
                        if (typeof option === "string") {
                          return option;
                        }
                        if (option && option.value) {
                          return option.vlaue;
                        }
                        return "";
                      }}
                      {...register('activitystatus1')}
                      onChange={(e, newValue) => {
                        setActivityStatus1(newValue);
                        setValue('activitystatus1', newValue);
                      }}
                      value={activitystatus1}
                      options={dropdownStatus}
                      className={`col-md-12 input-select1 mt-1 ${errors.activitystatus1 ? "is-invalid" : ""
                        }`}

                      renderInput={(params) => (
                        <TextField {...params}
                          placeholder="Select Status"
                        />
                      )}
                    />
                  </FormControl>
                  <Div style={{ color: "red" }}>{errors.activitystatus1?.message}</Div>
                </Stack>
                <Stack>
                  <TextField
                    {...register('next1')}
                    className={`col-md-12 input-box mt-1 ${errors.next1 ? "is-invalid" : ""
                      }`}
                    onChange={(e) => {
                      setNext1(e.target.value);
                    }}
                    value={next1}
                    type="date"
                    id="outlined-basic"
                    placeholder="Next Scheduled Date & Time"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <RestoreSharpIcon />
                        </InputAdornment>
                      ),
                      style: {
                        borderRadius: "15px",
                      },
                    }}
                  />
                  <Div style={{ color: "red" }}>{errors.next1?.message}</Div>
                </Stack>
              </Stack>
            </DialogContentText>
            <Div sx={[DisplayFlex, { justifyContent: "center" ,mt:2}]}>
            <CustomButton
              Icon="saveIcon"
              type="submit"
              label="Update"
            />

            <Cancelbutton
              label="Cancel"
              onClick={() => setOpenEditContact(false)}
            />
          </Div>
        </form>
      </DialogContent>
    </Dialog>





  </>)
}

export default CallCenterEdit;