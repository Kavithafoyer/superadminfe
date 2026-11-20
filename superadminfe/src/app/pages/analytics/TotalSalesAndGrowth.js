import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import Div from '@jumbo/shared/Div'
import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { DisplayFlex } from '../widgets/CRMStyles'
import { HiOutlineArrowLongDown, HiOutlineArrowLongUp } from "react-icons/hi2";
import ReactApexChart from 'react-apexcharts'



function TotalSalesAndGrowth() {
    const [series, setSeries] = useState([44, 55,]);

    // donut chart option
    const customSeriesNames = ['LEAD', 'OPPORTUNITY',];

    const [options] = useState({
        chart: {
            width: 380,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
        },

        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center', // Set horizontal alignment to center
        },
        labels: customSeriesNames,
        colors: ['#4ad66d', '#b2ff9e',],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        show: true,
                        position: 'bottom',
                        horizontalAlign: 'center', // Set horizontal alignment to center
                    },
                },
            },
        ],
    });

    const customSeriesNames2 = ['OPPORTUNITY','WINS'];

    const [options2] = useState({
        chart: {
            width: 380,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            type: 'gradient',
        },

        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center', // Set horizontal alignment to center
        },
        labels: customSeriesNames2,
        colors: ['#064789', '#a8d5e2',],

        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        show: true,
                        position: 'bottom',
                        horizontalAlign: 'center', // Set horizontal alignment to center
                    },
                },
            },
        ],
    });
    return (
        <JumboContentLayoutMain>
            <Grid container spacing={2} >
                <Grid item xs={12} md={6} sx={[DisplayFlex, { justifyContent: 'center' }]}>
                    <Div className='card' sx={[{width: {xs:'100%',md:'100%'}, p: 2,  boxShadow: "0px 0px 2px lightgray", border: "0px solid white" }]} >
                        <Div >
                            <Typography sx={{ textAlign: 'center', fontSize: '16px', mb: 1 }}>Total Sales</Typography>
                            <Typography sx={{ textAlign: 'center', color: 'red', fontSize: '16px' }}>9,20,34,000</Typography>
                        </Div>

                    </Div>
                </Grid>

                <Grid item xs={12} md={6} sx={[DisplayFlex, { justifyContent: 'center' }]}>
                    <Div className='card' sx={[{width: {xs:'100%',md:'100%'}, p: 2, boxShadow: "0px 0px 2px lightgray", border: "0px solid white" }]} >
                        <Div sx={[DisplayFlex, { justifyContent: 'center' }]}>
                            <Div>
                                <Typography sx={{ textAlign: 'center', fontSize: '16px', mb: 1 }}>Sales Growth</Typography>
                                <Typography sx={{ textAlign: 'center', color: 'red', fontSize: '16px' }}>34,000</Typography>
                            </Div>
                            <HiOutlineArrowLongDown style={{ color: 'red', fontSize: 30 }} />
                        </Div>
                        {/* <HiOutlineArrowLongUp style={{color:'green', fontSize:25}} /> */}
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}  mt={1}>
                    <Div className='card' sx={[{ minHeight: "330px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Lead/Opportunity</Typography>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                            <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                                <ReactApexChart options={options} series={series} type="donut" width={420} />
                            </Div>
                        </Div>
                    </Div>
                </Grid>
                
                <Grid item xs={12} md={6}  mt={1}>
                    <Div className='card' sx={[{ minHeight: "330px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Opportunity/Wins</Typography>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                            <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                                <ReactApexChart options={options2} series={series} type="donut" width={420} />
                            </Div>
                        </Div>
                    </Div>
                </Grid>
            </Grid>

        </JumboContentLayoutMain >
    )
}

export default TotalSalesAndGrowth
