import Div from '@jumbo/shared/Div'
import { Autocomplete, FormControl, FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material'
import { DisplayFlex } from 'app/pages/widgets/CRMStyles'
import { Funnel } from 'devextreme-react'
import { Export, Label, Tooltip } from 'devextreme-react/cjs/funnel'
import React, { useState } from 'react'

function PipelineCultivation() {
    const [toggleButton, setToggleButtton] = useState(true)
    const [toggleButton2, setToggleButtton2] = useState(true)

    const dataSource = [
        { argument: 'MQL', value: 9152 },
        { argument: 'SQL', value: 3879 },
        { argument: 'Deals', value: 3121 },
        { argument: 'Customers', value: 3224 },
    ];


    return (
        <>
            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "215px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} justifyContent={'center'} md={4} mt={1.5}>
                            <Div sx={[DisplayFlex,{justifyContent:'center'}]}>
                            <Funnel
                                id="funnel"
                                dataSource={dataSource}
                                palette="Soft Pastel"
                                argumentField="argument"
                                valueField="value"
                                height={180}
                                width={200}

                            >

                                <Export enabled={false} />
                                <Tooltip
                                    enabled={true}
                                    format="fixedPoint"
                                />
                                <Label
                                    visible={true}
                                    position="inside"
                                    backgroundColor="none"
                                />
                            </Funnel>
                            </Div>
                        </Grid>

                        <Grid container item xs={12} md={8} mt={1.5}>
                            <Grid item xs={12} mt={1.5}>
                                <Div sx={[DisplayFlex, { flexWrap: 'wrap', }]}>
                                    <Typography sx={{ mb: 1, fontSize: '11px', fontWeight: 600 }}>Average Daily Opportunities by Role</Typography>
                                    <FormControl sx={{
                                        "& fieldset": {
                                            borderRadius: "5px",
                                        },
                                    }}>
                                        <Autocomplete
                                            // {...register('bookingType',)}
                                            className="search-select"
                                            sx={{ minWidth: '100px', wfontSize: '10px !important' }}
                                            autocomplete="off"
                                            options={[{ label: "BDR" }]}
                                            getOptionLabel={(option) => {
                                                if (typeof option === "string") {
                                                    return option;
                                                }
                                                if (option && option?.label) {
                                                    return option?.label;
                                                }

                                            }}
                                            defaultValue='BDR'
                                            // value={selectUser}
                                            // onChange={(e, newValue) => {
                                            //     setSelectUsers(newValue?.label)
                                            // }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    sx={{ fontSize: '10px !important' }}
                                                />
                                            )}
                                        />
                                    </FormControl>

                                    <Typography sx={{ mb: 1, fontSize: '11px', fontWeight: 600 }}>and Rep</Typography>
                                    <FormControl sx={{
                                        "& fieldset": {
                                            borderRadius: "5px",
                                        },
                                    }}>
                                        <Autocomplete
                                            // {...register('bookingType',)}
                                            className="search-select"
                                            sx={{ minWidth: '100px', wfontSize: '10px !important' }}
                                            autocomplete="off"
                                            options={[{ label: "select user" }]}
                                            getOptionLabel={(option) => {
                                                if (typeof option === "string") {
                                                    return option;
                                                }
                                                if (option && option?.label) {
                                                    return option?.label;
                                                }

                                            }}
                                            defaultValue='select user'
                                            // value={selectUser}
                                            // onChange={(e, newValue) => {
                                            //     setSelectUsers(newValue?.label)
                                            // }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    sx={{ fontSize: '10px !important' }}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Div>
                            </Grid>

                            <Grid item xs={6} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>401</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}> Marketing Qualified Leads (MQL)</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={6} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>701</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Sales Qualified Leads (SQL)</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={6} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Defined adn Woeking (D&W)</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={6} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Commited Deals (CD)</Typography>
                                </Div>
                            </Grid>

                        </Grid>

                    </Grid>
                </Div>
            </Grid>

            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "215px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4} mt={1.5}>
                            <Div sx={[DisplayFlex,{justifyContent:'center'}]}>
                            <Funnel
                                id="funnel"
                                dataSource={dataSource}
                                palette="Soft Pastel"
                                argumentField="argument"
                                valueField="value"
                                height={180}
                                width={200}
                            >

                                <Export enabled={false} />
                                <Tooltip
                                    enabled={true}
                                    format="fixedPoint"
                                />
                                <Label
                                    visible={true}
                                    position="inside"
                                    backgroundColor="none"
                                />
                            </Funnel>
                            </Div>
                        </Grid>

                        <Grid container item xs={12} md={8} mt={1.5}>
                            <Grid item xs={12} mt={1.5}>
                                <Div sx={[DisplayFlex, { flexWrap: 'wrap', justifyContent: 'space-between' }]}>
                                    <Div sx={[DisplayFlex, { flexWrap: 'wrap', }]}>
                                        <Typography sx={{ mb: 1, fontSize: '11px', fontWeight: 600 }}>By Role</Typography>
                                        <FormControl sx={{
                                            "& fieldset": {
                                                borderRadius: "5px",
                                            },
                                        }}>
                                            <Autocomplete
                                                // {...register('bookingType',)}
                                                className="search-select"
                                                sx={{ minWidth: '140px', wfontSize: '10px !important' }}
                                                autocomplete="off"
                                                options={[{ label: "BDR" }]}
                                                getOptionLabel={(option) => {
                                                    if (typeof option === "string") {
                                                        return option;
                                                    }
                                                    if (option && option?.label) {
                                                        return option?.label;
                                                    }

                                                }}
                                                defaultValue='BDR'
                                                // value={selectUser}
                                                // onChange={(e, newValue) => {
                                                //     setSelectUsers(newValue?.label)
                                                // }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        sx={{ fontSize: '10px !important' }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Div>

                                    <Div sx={[DisplayFlex, { flexWrap: 'wrap' }]}>
                                        <Div sx={[DisplayFlex, { alignItems: 'center !important', gap: '10px !important' }]}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>CALLS</Typography>
                                            <FormControlLabel sx={{ p: 0, m: 0 }}
                                                control={<Switch defaultChecked color="secondary" />}
                                            />
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>CALL MINUTES</Typography>

                                        </Div>
                                    </Div>

                                </Div>
                            </Grid>

                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>401</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}> MQL Dialed</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>701</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>SQL Dialed</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>D&W Dialed</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Committed Dialed</Typography>
                                </Div>
                            </Grid>

                        </Grid>

                    </Grid>
                </Div>
            </Grid>

            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "215px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={4} mt={1.5}>
                            <Div sx={[DisplayFlex,{justifyContent:'center'}]}>
                            <Funnel
                                id="funnel"
                                dataSource={dataSource}
                                palette="Soft Pastel"
                                argumentField="argument"
                                valueField="value"
                                height={180}
                                width={200}

                            >

                                <Export enabled={false} />
                                <Tooltip
                                    enabled={true}
                                    format="fixedPoint"
                                />
                                <Label
                                    visible={true}
                                    position="inside"
                                    backgroundColor="none"
                                />
                            </Funnel>
                            </Div>
                        </Grid>

                        <Grid container item xs={12} md={8} mt={1.5}>
                            <Grid item xs={12} mt={1.5}>
                                <Div sx={[DisplayFlex, { flexWrap: 'wrap', justifyContent: 'space-between' }]}>
                                    <Div sx={[DisplayFlex, { flexWrap: 'wrap', }]}>
                                        <Typography sx={{ mb: 1, fontSize: '11px', fontWeight: 600 }}>By Rep</Typography>
                                        <FormControl sx={{
                                            "& fieldset": {
                                                borderRadius: "5px",
                                            },
                                        }}>
                                            <Autocomplete
                                                // {...register('bookingType',)}
                                                className="search-select"
                                                sx={{ minWidth: '140px', wfontSize: '10px !important' }}
                                                autocomplete="off"
                                                options={[{ label: "Nickic Furry" }]}
                                                getOptionLabel={(option) => {
                                                    if (typeof option === "string") {
                                                        return option;
                                                    }
                                                    if (option && option?.label) {
                                                        return option?.label;
                                                    }

                                                }}
                                                defaultValue='Nickic Furry'
                                                // value={selectUser}
                                                // onChange={(e, newValue) => {
                                                //     setSelectUsers(newValue?.label)
                                                // }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        sx={{ fontSize: '10px !important' }}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Div>

                                    <Div sx={[DisplayFlex, { flexWrap: 'wrap' }]}>
                                        <Div sx={[DisplayFlex, { alignItems: 'center !important', gap: '10px !important' }]}>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>DIALS</Typography>
                                            <FormControlLabel sx={{ p: 0, m: 0 }}
                                                control={<Switch defaultChecked color="secondary" />}
                                            />
                                            <Typography sx={{ fontSize: '11px', fontWeight: 600 }}>CALL MINUTES</Typography>

                                        </Div>
                                    </Div>

                                </Div>
                            </Grid>

                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>401</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}> Total Target</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>701</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Targets Called</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Percentage Completed</Typography>
                                </Div>
                            </Grid>
                            <Grid item xs={12} md={3} mt={1.5}>
                                <Div>
                                    <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>-122</Typography>
                                    <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Targets Remaining</Typography>
                                </Div>
                            </Grid>

                        </Grid>

                    </Grid>
                </Div>
            </Grid>
        </>
    )
}

export default PipelineCultivation
