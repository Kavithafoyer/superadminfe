import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from "@jumbo/shared/Div";
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiConfig } from "app/services/config";
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

const manufacturer = [{ name: "Compaign1" }, { name: "Compaign2" }];
const EditeLookup = ({ setCreateLookup, setListLookup, prop, listdatas }) => {
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

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleClickBack = () => {
    setListLookup(true);
    setCreateLookup(false);
    // navigate('/lookup/list-lookup');
  };
  const handleClickShow = () => {
    setShowBox(!showBox);
  };

  const handleAddRow = () => {
    const newId = items.length + 1;
    const newItem = {
      id: newId,
      value: "",
    };
    const newList = [...items];
    newList.push(newItem);
    setItems(newList);
    setRows([...rows, items]);
    setNumber((previousNumber) => previousNumber + 1);
  };

  const handleValueChange = (event, index) => {
    const { name, value } = event.target;
    const newList = [...items];
    newList[index].value = value;
    setItems(newList);
    console.log("NewLookup", newList);
  };
  const handleRemoveRow = (index) => {
    setRows(rows.slice(index, -1));
    setItems(rows.slice(index, -1));
    setNumber((previousNumber) => previousNumber - 1);
  };
  const handleChangeArray = (index, value) => {};
  const handleSubmit = (values) => {
    if (lockupname == undefined || lockupname == "" || lockupname == null) {
      toast.error("Enter the valid lookup name");
      return;
    }
    if (purposename == undefined || purposename == "" || purposename == null) {
      toast.error("Enter the valid Details");
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

    const valuesObject = items.reduce((acc, item) => {
      if (item.value) {
        acc[item.value] = item.value;
      }
      return acc;
    }, {});

    if (prop != undefined && prop.length != 0) {
      var lookuppayload = {
        id: prop.id,
        Lookupid: prop.Lookupid,
        Lookupname: lockupname,
        Values: valuesObject,
        Purpose: purposename,
        Is_Deleted: false,
        Created_Date: new Date(),
        Updated_Date: new Date(),
        Created_By: parseInt(localStorage.getItem("UserId")),
        Updated_By: parseInt(localStorage.getItem("UserId")),
      };
      console.log(lookuppayload);
      axios
        .put(`${apiConfig.URL}crmfarmsa/useradmin/Userlookuplist/`, lookuppayload, header)
        .then((res) => {
          //  console.log("res", res);
          if (res.status >= 200 && res.status < 300) {
            setItems([
              {
                id: 1,
                value: "",
              },
            ]);

            toast.success("Lookup updated successfully");
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
        Values: valuesObject,
        Purpose: purposename,
        Is_Deleted: false,
        Created_Date: new Date(),
        Updated_Date: new Date(),
        Created_By: 1,
        Updated_By: 1,
      };
      console.log("lookuppayload", lookuppayload);
      axios
        .post(`${apiConfig.URL}crmfarmsa/useradmin/Userlookuplist/`, lookuppayload, header)
        .then((res) => {
          console.log("2", res);
          if (res.status >= 200 && res.status < 300) {
            setItems([
              {
                id: 1,
                value: "",
              },
            ]);
            toast.success("Lookup created successfully");
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
      <Div sx={{ mt: 3 }}>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={3}>
                  <Typography sx={[FontStyle]}>Lookup Id</Typography>
                </Grid>
                <Grid item xs={11} md={6.1} lg={6.1}>
                  <TextField
                    className={`col-12 input-box2`}
                    id="outlined-basic"
                    placeholder="# Lookup Id"
                    variant="outlined"
                    name="LookupId"
                    value={prop?.Lookupid}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} md={3} lg={3}>
                  <Typography sx={[FontStyle]}>
                    Lookup Name <span className="required"> * </span>
                  </Typography>
                </Grid>
                <Grid item xs={11} md={6.1} lg={6.1}>
                  <TextField
                    className={`col-12 input-box ${
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

                <Grid item xs={12} md={3} lg={3}>
                  <Typography sx={[FontStyle]}>
                    Details <span className="required"> * </span>
                  </Typography>
                </Grid>
                <Grid item xs={11} md={6.1} lg={6.1}>
                  <TextField
                    className="col-12 multiline-box"
                    multiline
                    rows={3}
                    id="outlined-basic"
                    placeholder="Write a Details..."
                    variant="outlined"
                    name="Purpose"
                    onChange={(e) => {
                      setpurposename(e.target.value);
                    }}
                    value={purposename}
                  />
                </Grid>

                <Grid item xs={12} md={3} lg={3}></Grid>
                <Grid item xs={11} md={6.1} lg={6.1}>
                  {rows?.map((data, index) => (
                    <Div sx={[DisplayFlex, { my: 1 }]} key={index}>
                      <Typography sx={[ComponentHeading]}>
                        {" "}
                        {index + 1}.{" "}
                      </Typography>
                      <TextField
                        className="col-11 input-box "
                        id="outlined-basic"
                        placeholder="Values"
                        variant="outlined"
                        value={data?.value}
                        onChange={(event) => handleValueChange(event, index)}
                        onBlur={handleChangeArray(index, data.value)}
                      />
                      {index == 0 ? (
                        ""
                      ) : (
                        <Div className="col-1">
                          <IconButton
                            sx={{ padding: "0px" }}
                            color="error"
                            onClick={handleRemoveRow}
                          >
                            <MdDelete />
                          </IconButton>
                        </Div>
                      )}
                    </Div>
                  ))}
                </Grid>
              </Grid>

              <Div sx={{ ml: { xs: 0, md: 33 }, mt: 1 }}>
                <Button onClick={handleAddRow}> + Add More Values</Button>
              </Div>

              <Div sx={{ position: "absolute", bottom: 60, right: 5 }}>
                <Button
                  sx={[DialogBoxSaveButton, FontStyle, ButtonStyle, { mr: 2 }]}
                  type="submit"
                >
                  Update
                </Button>
                <Button
                  sx={[
                    DialogBoxCancelButton,
                    FontStyle,
                    ButtonStyle,
                    { mr: 2 },
                  ]}
                  onClick={handleClickBack}
                >
                  Cancel
                </Button>
              </Div>
            </Form>
          )}
        </Formik>
      </Div>
      <ToastContainer />
    </>
  );
};

export default EditeLookup;
