import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Autocomplete, Button, FormControl, FormControlLabel, Grid, Switch, TextField, Typography, alpha } from '@mui/material'
import React, { memo, useCallback, useState } from 'react'
import Div from '@jumbo/shared/Div'
import ColumnBarChart from '../Bars/ColumnBarChart'
import { DisplayFlex } from 'app/pages/widgets/CRMStyles'

function CampaignAnalysis() {

    const dataSource3 = [
        { label: 'Wade Wilson', callSMade: 0, healthCheck: 0, renew: 329, user: 3252 },
        { label: 'Nickie Furry', callSMade: 0, healthCheck: 0, renew: 319, user: 3252 },
        { label: 'Harvey Bullok', callSMade: 0, healthCheck: 0, renew: 389, user: 3252 },
        { label: 'Jean Grey', callSMade: 0, healthCheck: 0, renew: 919, user: 3252 },
        { label: 'Licius Fox', callSMade: 0, healthCheck: 0, renew: 329, user: 3252 },
        { label: 'Jimmy Gordan', callSMade: 0, healthCheck: 0, renew: 319, user: 3252 },
        { label: 'Natasha Romanoff', callSMade: 3879, healthCheck: 2870, renew: 0, user: 0 },
        { label: 'Jairo Figueroa', callSMade: 9152, healthCheck: 2150, renew: 0, user: 0 },
        { label: 'Alfred Pennyworth', callSMade: 3224, healthCheck: 2220, renew: 0, user: 0 },
        { label: 'Telmo Silva', callSMade: 3121, healthCheck: 2120, renew: 0, user: 0 },

    ].reverse();


    return (
        <>
            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "215px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Div sx={[DisplayFlex, { flexWrap: 'wrap', gap: "10px !important" }]}>
                        <Typography sx={{ mb: 1, fontSize: '13px', fontWeight: 600 }}>Rank of Rep by Role</Typography>
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
                                options={[{ label: "AM, BDR" }]}
                                getOptionLabel={(option) => {
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    if (option && option?.label) {
                                        return option?.label;
                                    }

                                }}
                                defaultValue='AM, BDR'
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

                    <Div sx={{ mt: 1 }}>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', my: 2, }]}>
                            <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: '#ffed66', position: "absolute", left: -12, top: "25%" }} /> PS Campaign Calls Made</Typography>
                            <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', mx: 3 }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: '#fca311', position: "absolute", left: -12, top: "25%" }} /> Q4 Health Check</Typography>
                            <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', mr: 3 }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: '#75c9c8', position: "absolute", left: -12, top: "25%" }} /> Renew Campaign</Typography>
                            <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative' }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: '#004e98', position: "absolute", left: -12, top: "25%" }} /> TS User Campaign</Typography>
                        </Div>
                        <ColumnBarChart
                            labelShow={false}
                            color={['#ffed66', '#fca311', '#75c9c8', '#004e98']}
                            barData={dataSource3}
                            barType='stackedbar'
                            rotated={true}
                            barLength={['callSMade', 'healthCheck', 'renew', 'user']}
                            height={260}
                        />

                    </Div>
                </Div>
            </Grid>

            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "100px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container alignItems={'center'}>
                        <Grid item xs={12} md={6} mt={1.5}>
                            <Div sx={[DisplayFlex, { flexWrap: 'wrap', gap: "10px !important" }]}>
                                <Typography sx={{ mb: 1, fontSize: '12px', fontWeight: 600 }}>By Campaign</Typography>
                                <FormControl sx={{
                                    "& fieldset": {
                                        borderRadius: "5px",
                                    },
                                    width: '60%'
                                }}>
                                    <Autocomplete
                                        // {...register('bookingType',)}
                                        className="search-select"
                                        sx={{ minWidth: '150px', wfontSize: '10px !important' }}
                                        autocomplete="off"
                                        options={[{ label: "4 campaign selected" }]}
                                        getOptionLabel={(option) => {
                                            if (typeof option === "string") {
                                                return option;
                                            }
                                            if (option && option?.label) {
                                                return option?.label;
                                            }

                                        }}
                                        defaultValue='4 campaign selected'
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

                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>401</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}> Total Target</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>701</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Targets Called</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>122.0%</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Percentage Completed</Typography>
                            </Div>
                        </Grid>
                    </Grid>
                </Div>
            </Grid>

            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "100px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container alignItems={'center'}>
                        <Grid item xs={12} md={4} mt={1.5}>
                            <Div sx={[DisplayFlex, { flexWrap: 'wrap', gap: "10px !important" }]}>
                                <Typography sx={{ mb: 1, fontSize: '12px', fontWeight: 600 }}>By Role</Typography>
                                <FormControl sx={{
                                    "& fieldset": {
                                        borderRadius: "5px",
                                    },
                                    width: '70%'
                                }}>
                                    <Autocomplete
                                        // {...register('bookingType',)}
                                        className="search-select"
                                        sx={{ minWidth: '150px', wfontSize: '10px !important' }}
                                        autocomplete="off"
                                        options={[{ label: "AM, BDR" }]}
                                        getOptionLabel={(option) => {
                                            if (typeof option === "string") {
                                                return option;
                                            }
                                            if (option && option?.label) {
                                                return option?.label;
                                            }

                                        }}
                                        defaultValue='AM, BDR'
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

                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>4701</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Total Target</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>5422</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Targets Called</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>112.0%</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Percentage Completed</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>-553</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Target Remaining</Typography>
                            </Div>
                        </Grid>
                    </Grid>
                </Div>
            </Grid>

            <Grid item xs={12} mt={1.5}>
                <Div className='card' sx={[{ minHeight: { md: "100px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                    <Grid container alignItems={'center'}>
                        <Grid item xs={12} md={4} mt={1.5}>
                            <Div sx={[DisplayFlex, { flexWrap: 'wrap', gap: "10px !important" }]}>
                                <Typography sx={{ mb: 1, fontSize: '12px', fontWeight: 600 }}>By Rep</Typography>
                                <FormControl sx={{
                                    "& fieldset": {
                                        borderRadius: "5px",
                                    },
                                    width: '70%'
                                }}>
                                    <Autocomplete
                                        // {...register('bookingType',)}
                                        className="search-select"
                                        sx={{ minWidth: '150px', wfontSize: '10px !important' }}
                                        autocomplete="off"
                                        options={[{ label: "10 campaign selected" }]}
                                        getOptionLabel={(option) => {
                                            if (typeof option === "string") {
                                                return option;
                                            }
                                            if (option && option?.label) {
                                                return option?.label;
                                            }

                                        }}
                                        defaultValue='10 campaign selected'
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

                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>4701</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Total Target</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>5422</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Targets Called</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>112.0%</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Percentage Completed</Typography>
                            </Div>
                        </Grid>
                        <Grid item xs={12} md={2} mt={1.5}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', color: '#5d7bd5', fontSize: '20px' }}>-553</Typography>
                                <Typography sx={{ textAlign: 'center', fontSize: '10px' }}>Target Remaining</Typography>
                            </Div>
                        </Grid>
                    </Grid>
                </Div>
            </Grid>
        </>
    )
}

export default memo(CampaignAnalysis)
