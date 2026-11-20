import Div from "@jumbo/shared/Div";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiConfig, BASE_URL } from "app/services/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ButtonStyle,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DisplayFlex,
  FontStyle,
} from "app/pages/widgets/CRMStyles";
import { Cancelbutton, CustomButton } from "app/pages/widgets/StylesComponents";

const manufacturer = [{ name: "Compaign1" }, { name: "Compaign2" }];
const EditeLookup = ({ setEditLookup, setListLookup, prop, lookUpRecords, listdatas }) => {
  const token = localStorage.getItem("accesstoken");

  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      db: localStorage.getItem("DBName"),
    },
  };
  const navigate = useNavigate();
  const [lookupvalus, setLookupvalus] = useState({
    id: "",
    Lookupname: "",
    Defaultvalue: "",
    Lookupperpose: "",
  });
  const [itemName, setItemName] = useState("");
  const [lockupname, setlockupname] = useState("");
  const [purposename, setpurposename] = useState("");
  const [value, setValue] = useState("My Request");
  const [showBox, setShowBox] = useState(false);
  const [number, setNumber] = useState(2);
  const [rows, setRows] = useState([{ value: "" }]);
  const [Details, setDetails] = useState("");

  const [items, setItems] = useState([
    {
      id: 1,
      value: "",
    },
  ]);

  useEffect(() => {
    if (prop != undefined && prop.length != 0) {
      if (prop?.Values) {
        setItems(
          Object.keys(prop.Values || {}).map((key, index) => ({
            id: index + 1,
            value: key,
          }))
        );
      }
      setRows(prop.Values);
      setItemName(prop.Lookupname);
      setlockupname(prop.Lookupname);
      setpurposename(prop.Purpose);
    }
  }, [prop]);

  const handleClickBack = () => {
    setListLookup(true);
    setEditLookup(false);
    // navigate('/lookup/list-lookup');
  };

  const handleAddRow = () => {
    // const newId = items.length + 1;
    // const newItem = {
    //   id: newId,
    //   value: ""
    // };
    // const newList = [...items];
    // newList.push(newItem);
    // setItems(newList);
    // setRows([...rows, items]);
    // setNumber((previousNumber) => previousNumber + 1);

    let arr = [];
    items?.map((item, ind) => {
      if (item?.id == 0 || item?.value == "") {
        toast.error(
          "You cannot add more item without adding information in previous Item."
        );
        arr.push(ind);
      } else if (item?.id == undefined || item?.value == undefined) {
        toast.error(
          "You cannot add more item without adding information in previous Item."
        );
        arr.push(ind);
      }
    });

    if (arr?.length == 0) {
      const newId = items?.length + 1;
      const newItem = {
        id: newId,
        value: "",
      };

      // Add a new empty row to the items state
      const newList = [...items];
      newList.push(newItem);
      setItems(newList);
    }
  };

  const handleValueChange = (event, index) => {
    const { name, value } = event.target;
    const newList = [...items];
    newList[index].value = value;
    setItems(newList);
    console.log("NewLookup", newList);
  };

  const handleRemoveRow = (e, index) => {
    // setRows(rows.slice(index, -1));
    // setItems(rows.slice(index, -1));
    // setNumber((previousNumber) => previousNumber - 1);

    const list = [...items];
    if (index !== 0) {
      list.splice(index, 1);
    }
    setItems(list);
  };

  const handleChangeArray = (index, value) => {};

  const handleSubmit = (values) => {
    if (lockupname == undefined || lockupname == "" || lockupname == null) {
      toast.error("Enter the valid lookup name");
      return;
    }
    if (purposename == undefined || purposename == "" || purposename == null) {
      toast.error("Enter the valid Purpose/Details");
      return;
    }

    if (lockupname) {
      const checkLookupName = listdatas?.some((opt) => {
        return (
          opt?.Lookupname?.toLowerCase() === lockupname?.toLowerCase() &&
          opt?.id !== prop?.id
        );
      });

      if (checkLookupName) {
        toast.error(`Lookup Name ${lockupname} Already Exists.`);
        return;
      }
    }

    if (prop != undefined && prop.length != 0) {
      var lookuppayload = {
        id: prop.id,
        Lookupid: prop.Lookupid,
        Lookupname: lockupname,
        Values: items,
        Purpose: purposename,
        Is_Deleted: false,
        Created_Date: new Date(),
        Updated_Date: new Date(),
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };
      console.log(lookuppayload);
      axios
        .put(`${BASE_URL}crmfarmsa/useradmin/Userlookuplist/`, lookuppayload, header)
        .then((res) => {
          //  console.log("res", res);
          if (res.status >= 200 && res.status < 300) {
            setItems([
              {
                id: 1,
                value: "",
              },
            ]);

            toast.success("Lookup is update successfully");
            lookUpRecords();
            handleClickBack();
          } else {
            toast.error("Check your data");
          }
        });
      // .catch((error) => {
      //   console.log(error);
      //   toast.error("Invalid lookup name");
      // });
    } else {
      var lookuppayload = {
        Lookupname: lockupname,
        Values: items,
        Purpose: purposename,
        Is_Deleted: false,
        Created_Date: new Date(),
        Updated_Date: new Date(),
        Created_By: 1,
        Updated_By: 1,
      };
      console.log("lookuppayload", lookuppayload);
      axios
        .post(`${BASE_URL}crmfarmsa/useradmin/Userlookuplist/`, lookuppayload, header)
        .then((res) => {
          console.log("2", res);
          if (res.status === 200) {
            setItems([
              {
                id: 1,
                value: "",
              },
            ]);
            toast.success("Lookup is created successfully");
            lookUpRecords();
            handleClickBack();
          } else {
            toast.error("Check your data");
          }
        });
      // .catch((error) => {
      //   console.log(error);
      //   toast.error("Invalid lookup name");
      // });
    }
  };
  return (
    <>
      <Div>
        <Typography sx={[ComponentHeading, { mb: 2 }]}>
          {/* {prop.length>0 ? "Edit":"Create"} Lookup */}
          Edit Lookup
        </Typography>
        <Formik
          enableReinitialize={true}
          initialValues={{
            Lookupname: prop?.Lookupname,
            Purpose: prop?.Purpose,
          }}
          onSubmit={(values, { setSubmitting, setFieldValue }) => {
            handleSubmit(values);
            console.log(values);
          }}
        >
          {({ errors }) => (
            <Form>
              <Div sx={{ minHeight: "400px" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2.5} lg={2.5}>
                    <Typography sx={[FontStyle]}>Lookup Id</Typography>
                  </Grid>
                  <Grid item xs={11} md={9.5} lg={9.5}>
                    <TextField
                      className={`col-5 input-box2`}
                      id="outlined-basic"
                      placeholder="# Lookup Id"
                      variant="outlined"
                      name="LookupId"
                      value={prop?.Lookupid}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} md={2.5} lg={2.5}>
                    <Typography sx={[FontStyle]}>
                      Lookup Name <span className="required"> * </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9.5} lg={9.5}>
                    <TextField
                      className={`col-5 input-box2 ${
                        errors.pass ? "is-invalid" : ""
                      }`}
                      id="outlined-basic"
                      placeholder="Lookup Name"
                      variant="outlined"
                      name="Lookupname"
                      onChange={(e) => {
                        setlockupname(e.target.value);
                      }}
                      value={lockupname}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.5} lg={2.5}>
                    <Typography sx={[FontStyle]}>
                      Purpose/Details <span className="required"> * </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9.5} lg={9.5}>
                    <TextField
                      className="col-5 multiline-box"
                      multiline
                      rows={3}
                      id="outlined-basic"
                      placeholder="Write a Purpose/Details..."
                      variant="outlined"
                      name="Purpose"
                      onChange={(e) => {
                        setpurposename(e.target.value);
                      }}
                      value={purposename}
                    />
                  </Grid>

                  <Grid item xs={12} md={2.5} lg={2.5}></Grid>
                  <Grid item xs={11} md={9.5} lg={9.5}>
                    {items?.map((data, index) => (
                      <Div sx={[DisplayFlex, { my: 1 }]} key={index}>
                        <Typography variant="h3"> {index + 1}. </Typography>
                        <TextField
                          className="col-4 input-box2 "
                          id="outlined-basic"
                          placeholder="Values"
                          variant="outlined"
                          value={data?.value}
                          onChange={(event) => handleValueChange(event, index)}
                          // onBlur={handleChangeArray(index, data.value)}
                        />

                        <Div className="col-1">
                          <IconButton
                            sx={{ padding: "0px" }}
                            color="error"
                            onClick={(e) => handleRemoveRow(e, index)}
                          >
                            <MdDelete />
                          </IconButton>
                        </Div>
                      </Div>
                    ))}
                  </Grid>
                </Grid>

                <Div sx={{ ml: { xs: 0, md: 30 }, mt: 1 }}>
                  <Button onClick={handleAddRow}> + Add More Values</Button>
                </Div>
              </Div>

              <Div sx={{ mt: 5, mb: 5 }}>
                {/* <Button sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]} type="submit"  >
                Update
              </Button>
              <Button sx={[DialogBoxCancelButton, FontStyle, ButtonStyle, { mr: 2 }]} onClick={handleClickBack}>
                Cancel
              </Button> */}

                <CustomButton
                  // onClick={RedirectToCreateRoles}
                  label="Update"
                  type="submit"
                  Icon="saveIcon"
                  sx={{ mr: 1 }}
                />
                <Cancelbutton label="Cancel" onClick={handleClickBack} />
              </Div>
            </Form>
          )}
        </Formik>
      </Div>
    </>
  );
};

export default EditeLookup;
