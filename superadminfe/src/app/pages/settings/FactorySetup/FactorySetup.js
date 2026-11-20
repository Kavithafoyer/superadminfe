import Div from "@jumbo/shared/Div"
import { Autocomplete, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from "@mui/material"
import { dialogTitle, DisplayFlex, input_label } from "app/pages/widgets/CRMStyles"
import { Cancelbutton, CustomButton, DialogBox, errorRequired } from "app/pages/widgets/StylesComponents"
import { BASE_URL } from "app/services/auth-services"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Country, State, City } from "country-state-city";

const FactorySetup = ({
    editData,
    setCreateAndEditFactory,
    getData,
    currentPage
}) => {

    const token = localStorage.getItem("accesstoken");
    const header = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    };

    const [addFields, setAddFields] = useState({
        Factory_Id: "",
        Factory_Name: "",
        Building_Name: "",
        Area_Name: "",
        Country: "",
        State: "",
        City: "",
        Location: "",
        CountryFilter: "",
        StateFilter: ""
    })
    const [save, setSave] = useState(false);
    const [errors, setErrors] = useState([])

    const handleClickBack = () => {
        setCreateAndEditFactory(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentPage == "Create") {
            if (addFields?.Factory_Name === "" || addFields?.Factory_Name === null || addFields?.Factory_Name === undefined ||
                addFields?.Building_Name === "" || addFields?.Building_Name === null || addFields?.Building_Name === undefined ||
                addFields?.Area_Name === "" || addFields?.Area_Name === null || addFields?.Area_Name === undefined ||
                addFields?.Country === "" || addFields?.Country === null || addFields?.Country === undefined ||
                addFields?.State === "" || addFields?.State === null || addFields?.State === undefined ||
                addFields?.City === "" || addFields?.City === null || addFields?.City === undefined ||
                addFields?.Location === "" || addFields?.Location === null || addFields?.Location === undefined

            ) {
                toast.error("Please fill the required fields");
            } else {
                let Payload = {
                    "Factory_Name": addFields?.Factory_Name,
                    "Building_Name": addFields?.Building_Name,
                    "Area_Name": addFields?.Area_Name,
                    "Country": addFields?.Country,
                    "State": addFields?.State,
                    "City": addFields?.City,
                    "Location": addFields?.Location,
                    Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
                    Created_By: parseInt(localStorage.getItem("UserId")),
                    Updated_By: parseInt(localStorage.getItem("UserId")),
                };
                await axios.post(`${BASE_URL}/user/FactoryCRUD/`, Payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }).then(async (res) => {
                    console.log("FactoryCRUD", res.data);
                    toast.success(`Factory Setup is created successfully`);
                    getData()
                    setCreateAndEditFactory(false);
                }).catch((error) => {
                    console.log(error);
                })
            }


        } else if (currentPage == "Edit") {
            let { CountryFilter, StateFilter, ...rest } = addFields

            let error = errorRequired(rest)
            // if (!Boolean(addFields?.Factory_Id?.length == 11)) {
            //     if (!Boolean(error.Factory_Id)) error.Factory_Id = "Factory Id must be 11 digits."
            // }

            setErrors(error);

            console.log("errorsssss", { error, rest })

            if (Object.keys(error).length === 0) {

                let Payload = {
                    id: editData?.id,
                    "Factory_Id": addFields?.Factory_Id,
                    "Factory_Name": addFields?.Factory_Name,
                    "Building_Name": addFields?.Building_Name,
                    "Area_Name": addFields?.Area_Name,
                    "Country": addFields?.Country,
                    "State": addFields?.State,
                    "City": addFields?.City,
                    "Location": addFields?.Location,
                    Organization_Id: parseInt(localStorage.getItem("OrganizationId")),
                    Created_By: parseInt(localStorage.getItem("UserId")),
                    Updated_By: parseInt(localStorage.getItem("UserId")),
                };
                console.log("Payloaddddd", Payload);

                await axios.put(`${BASE_URL}/user/FactoryCRUD/`, Payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }).then(async (res) => {
                    console.log("FactoryCRUD", res.data);
                    toast.success(`Factory Setup is updated successfully`);
                    getData()
                    setCreateAndEditFactory(false);
                }).catch((error) => {
                    console.log(error);
                })
            }

            else {
                toast.error("Please fill the required fields");
            }
        }


    };

    useEffect(() => {
        if (Boolean(currentPage == "Edit")) {
            setAddFields({
                ...addFields,
                "id": editData?.id,
                "Factory_Id": editData?.Factory_Id,
                "Factory_Name": editData?.Factory_Name,
                "Building_Name": editData?.Building_Name,
                "Area_Name": editData?.Area_Name,
                "Country": editData?.Country,
                "State": editData?.State,
                "City": editData?.City,
                "Location": editData?.Location,
            })
        }
    }, [editData])

    console.log("addFieldssss", addFields);

    return (
        <Dialog
            open={Boolean(currentPage)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={{ xs: "md", md: false }}
            fullWidth={{ xs: "", md: false }}
            sx={{ '& .MuiDialog-paper': { width: { xs: "", md: '900px' } } }}
        >
            <DialogTitle sx={[dialogTitle, DisplayFlex]}>
                {currentPage} Factory Setup
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ pt: 2 }}>

                    <Grid container spacing={2}>

                        {Boolean(currentPage == "Edit") && <>
                            <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                                <Typography sx={input_label}>
                                    Factory Id
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                                <TextField
                                    sx={{
                                        "& fieldset": { borderRadius: "5px", },
                                        width: "100%"
                                    }}
                                    value={addFields?.Factory_Id}
                                    onChange={(e, newValue) => setAddFields({ ...addFields, Factory_Id: e.target.value })}
                                    placeholder="# Factory Id"
                                    className={`col-12 input-box2`}
                                    id="outlined-basic"
                                    variant="outlined"
                                    disabled={Boolean(currentPage == "Edit") && true}
                                />
                                {errors?.Factory_Id && (
                                    <Div style={{ color: "red" }}>{errors?.Factory_Id}</Div>
                                )}
                            </Grid>
                        </>}

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                Factory Name
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <TextField
                                sx={{
                                    "& fieldset": { borderRadius: "5px", },
                                    width: "100%"
                                }}
                                value={addFields?.Factory_Name}
                                onChange={(e, newValue) => setAddFields({ ...addFields, Factory_Name: e.target.value })}
                                placeholder="Factory Name"
                                className={`col-12 input-box2`}
                                id="outlined-basic"
                                variant="outlined"
                            />
                            {errors?.Factory_Name && (
                                <Div style={{ color: "red" }}>{errors?.Factory_Name}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                Building Name
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <TextField
                                sx={{
                                    "& fieldset": { borderRadius: "5px", },
                                    width: "100%"
                                }}
                                value={addFields?.Building_Name}
                                onChange={(e, newValue) => setAddFields({ ...addFields, Building_Name: e.target.value })}
                                placeholder="Building Name"
                                className={`col-12 input-box2`}
                                id="outlined-basic"
                                variant="outlined"
                            />
                            {errors?.Building_Name && (
                                <Div style={{ color: "red" }}>{errors?.Building_Name}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                Area Name
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <TextField
                                sx={{
                                    "& fieldset": { borderRadius: "5px", },
                                    width: "100%"
                                }}
                                value={addFields?.Area_Name}
                                onChange={(e, newValue) => setAddFields({ ...addFields, Area_Name: e.target.value })}
                                placeholder="Area Name"
                                className={`col-12 input-box2`}
                                id="outlined-basic"
                                variant="outlined"
                            />
                            {errors?.Area_Name && (
                                <Div style={{ color: "red" }}>{errors?.Area_Name}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                Country
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <Autocomplete
                                className="col-12 search-select3"
                                getOptionLabel={(option) => {
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    if (option && option?.name) {
                                        return option?.name;
                                    }
                                    return "";
                                }}
                                options={Country?.getAllCountries() || []}
                                value={addFields?.Country}
                                onChange={(e, newValue) => setAddFields({ ...addFields, CountryFilter: newValue, Country: newValue?.name })}
                                id="outlined-basic"
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="Country" />
                                )}
                            />
                            {errors?.Country && (
                                <Div style={{ color: "red" }}>{errors?.Country}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                State
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <Autocomplete
                                className=" col-12 search-select3"
                                getOptionLabel={(option) => {
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    if (option && option?.name) {
                                        return option?.name;
                                    }
                                    return "";
                                }}
                                options={State?.getStatesOfCountry(addFields?.CountryFilter?.isoCode) || []}
                                value={addFields?.State}
                                onChange={(e, newValue) => setAddFields({ ...addFields, StateFilter: newValue, State: newValue?.name })}
                                id="outlined-basic"
                                isOptionEqualToValue={(option, value) =>
                                    option?.name === value || value === ""
                                }
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="State" />
                                )}
                            />
                            {errors?.State && (
                                <Div style={{ color: "red" }}>{errors?.State}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                City
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <Autocomplete
                                className="col-12 search-select3"
                                getOptionLabel={(option) => {
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    if (option && option?.name) {
                                        return option?.name;
                                    }
                                    return "";
                                }}
                                options={
                                    City.getCitiesOfState(
                                        addFields?.StateFilter?.countryCode,
                                        addFields?.StateFilter?.isoCode
                                    ) || []
                                }
                                value={addFields?.City}
                                onChange={(e, newValue) => setAddFields({ ...addFields, City: newValue?.name })}
                                id="outlined-basic"
                                renderInput={(params) => (
                                    <TextField {...params} placeholder="City" />
                                )}
                            />
                            {errors?.City && (
                                <Div style={{ color: "red" }}>{errors?.City}</Div>
                            )}
                        </Grid>

                        <Grid item xs={12} md={2} sx={{ py: 0.4, px: 1 }}  >
                            <Typography sx={input_label}>
                                Location
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ py: 0.4, px: 1 }}>
                            <TextField
                                sx={{
                                    "& fieldset": { borderRadius: "5px", },
                                    width: "100%"
                                }}
                                value={addFields?.Location}
                                onChange={(e, newValue) => setAddFields({ ...addFields, Location: e.target.value })}
                                placeholder="Location"
                                className={`col-12 input-box2`}
                                id="outlined-basic"
                                variant="outlined"
                            />
                            {errors?.Location && (
                                <Div style={{ color: "red" }}>{errors?.Location}</Div>
                            )}
                        </Grid>
                    </Grid>

                </DialogContentText>
                <DialogActions sx={[DisplayFlex, { justifyContent: "center", mt: 5 }]}>
                    <CustomButton
                        label="Save"
                        Icon="saveIcon"
                        onClick={handleSubmit}
                        type="submit"
                    />
                    <Cancelbutton label="Cancel" onClick={() => setSave(true)} />
                </DialogActions>

                {/* close dialog box */}
                <DialogBox
                    open={save}
                    onClickNo={() => setSave(false)}
                    onClickYes={() => {
                        setSave(false)
                        handleClickBack()
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}
export default FactorySetup