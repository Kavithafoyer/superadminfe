import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import React from 'react'
import CrmDashboard from '../dashboards/crm/CrmDashboard'
import CrmSpeedoMeter from './CrmDashboard/CrmSpeedoMeter'
import Container from '@mui/material/Container'
import { Grid, Typography } from '@mui/material'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import Div from '@jumbo/shared/Div'
import { ComponentHeading, DisplayFlex } from '../widgets/CRMStyles'
import ColumnBarChart from './Bars/ColumnBarChart'

function CRMDashBoard() {
    const dataSource = [
        {color:"#588157",value:1300,label:'Monday'},
        {color:"#fb5607",value:1100,label:'Tuesday'},
        {color:"#ffba08",value:1020,label:'Wednesday'},
        {color:"#0077b6",value:1560,label:"Thursday"},
        {color:"#ff758f",value:1280,label:'Friday'},];


    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 2 }]}>CRM Dashboard</Typography>

            <Grid container spacing={3} >
                <Grid container gap={2} item xs={12} md={6} >
                    <Div  className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]}  >
                        <Div>
                            <Typography sx={{ fontSize: '14px' }} >Outbound Calls</Typography>
                            <Div sx={[DisplayFlex, { justifyContent: 'space-between' }]} >
                                <Div>
                                    <Typography sx={{ fontSize: '20px' }}>2,794</Typography>
                                    <Typography sx={{ fontSize: '18px', color: "tomato" }} >
                                        <IoMdArrowDropdown style={{ color: "tomato", fontSize: 22 }} />
                                        {/* <IoMdArrowDropup style={{color:"green",fontSize:22}}/> */}
                                        32%</Typography>
                                </Div>
                                <CrmSpeedoMeter />
                            </Div>
                            <Typography sx={{ fontSize: '11px' }}>vs last Period</Typography>
                        </Div>
                    </Div>

                    <Div  className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]}  >
                        <Div>
                            <Typography sx={{ fontSize: '14px' }} >Demos</Typography>
                            <Div sx={[DisplayFlex, { justifyContent: 'space-between' }]} >
                                <Div>
                                    <Typography sx={{ fontSize: '20px' }}>2,794</Typography>
                                    <Typography sx={{ fontSize: '18px', color: "tomato" }} >
                                        <IoMdArrowDropdown style={{ color: "tomato", fontSize: 22 }} />
                                        {/* <IoMdArrowDropup style={{color:"green",fontSize:22}}/> */}
                                        32%</Typography>
                                </Div>
                                <CrmSpeedoMeter />
                            </Div>
                            <Typography sx={{ fontSize: '11px' }}>vs last Period</Typography>
                        </Div>
                    </Div>

                </Grid>

                <Grid container gap={2} item xs={12} md={6} >
                    <Div  className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]}  >
                        <Div sx={[DisplayFlex, { justifyContent: 'center' }]}>
                            <Div sx={{ mt: { md: 4 } }}>
                                <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >Sales closed</Typography>
                                <Div sx={[DisplayFlex, { justifyContent: 'center' }]} >
                                    <Typography sx={{ fontSize: '18px', color: "black", mt: 2 }} >22
                                        <span style={{ color: "red" }}> (-29%)</span>
                                    </Typography>
                                </Div>
                            </Div>
                        </Div>
                    </Div>

                    <Div  className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div sx={[DisplayFlex, { justifyContent: 'center' }]} >
                            <Div sx={{ mt: { md: 4 } }}>
                                <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >Avg Sales</Typography>
                                <Div sx={[DisplayFlex, { justifyContent: 'center' }]} >
                                    <Typography sx={{ fontSize: '18px', color: "black", mt: 2 }} >$ 4,522
                                        <span style={{ color: "red" }}> (-4%)</span>
                                    </Typography>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} mt={1}>
                    <Div  className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[ComponentHeading, { mb: 4 }]}>Outbound Calls per Weekday</Typography>
                        <ColumnBarChart
                            // height={(height * 3) / 2}
                            labelShow={true}
                            color={['#4cc9f0']}
                            barData={dataSource}
                            // barWidth={35}
                        />
                    </Div>
                </Grid>

            </Grid>

        </JumboContentLayoutMain>
    )
}

export default CRMDashBoard
