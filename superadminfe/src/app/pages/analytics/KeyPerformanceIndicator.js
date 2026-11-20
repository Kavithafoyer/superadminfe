import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import Div from '@jumbo/shared/Div'
import { Grid, Typography } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import { ComponentHeading, DisplayFlex } from '../widgets/CRMStyles'
import ColumnBarChart from './Bars/ColumnBarChart'
import { PieChart, Switch } from 'devextreme-react'
import { Connector, Export, Label, Legend, Series, SmallValuesGrouping } from 'devextreme-react/cjs/pie-chart'
import VectorMap, { Layer, Tooltip } from 'devextreme-react/vector-map';
import Button from 'devextreme-react/button';
import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import './Analysis.css';
import CRMGaugeChart from './CrmDashboard/CRMGaugeChart'



function formatLabel(arg) {
    return `${arg.argumentText}: ${arg.valueText}`;
}


const bounds = [-180, 85, 180, -60];
const customizeTooltip = (arg) => {
    if (arg.layer.type === 'marker') {
        return { text: arg.attribute('name') };
    }
    return null;
};
const markerClick = ({ target, component }) => {
    if (target?.layer.type === 'marker') {
        component.center(target.coordinates()).zoomFactor(10);
    }
};

function KeyPerformanceIndicator() {
    const [toggleButton, setToggleButtton] = useState(true)
    const vectorMapRef = useRef(null);

    const reset = useCallback(() => {
        vectorMapRef.current.instance.center(null);
        vectorMapRef.current.instance.zoomFactor(null);
    }, [vectorMapRef]);

    const dataSource = [
        { color: "#588157", Dollar: 1300, target: 1300, label: '2020' },
        { color: "#fb5607", Dollar: 1100, target: 1200, label: '2021' },
        { color: "#ffba08", Dollar: 1020, target: 1120, label: '2022' },
        { color: "#0077b6", Dollar: 1560, target: 1560, label: "2023" },
        { color: "#ff758f", Dollar: 1280, target: 1280, label: '2024' },
    ];

    const dataSource2 = [{
        label: 'Jun 2024',
        Organic: 59.8,
        Refference: 937.6,
        Direct: 582,

    }, {
        label: 'Jul 2024',
        Organic: 74.2,
        Refference: 308.6,
        Direct: 35.1,

    }, {
        label: 'Aug 2024',
        Organic: 40,
        Refference: 128.5,
        Direct: 361.8,

    }, {
        label: 'Sep 2024',
        Organic: 22.6,
        Refference: 241.5,
        Direct: 64.9,

    }, {
        label: 'Oct 2024',
        Organic: 19,
        Refference: 119.3,
        Direct: 28.9,

    }, {
        label: 'Nov 2024',
        Organic: 6.1,
        Refference: 123.6,
        Direct: 77.3,

    }];


    const dataSource3 = [
        { Dollar: 11, label: 'Sonair' },
        { Dollar: 10, label: 'Solarbreeze' },
        { Dollar: 15, label: "Konklux" },
        { Dollar: 12, label: 'Voyatouch' },
        { Dollar: 13, label: 'Tin' },
    ];

      


    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 2 }]}>Key Performance Indicator</Typography>
            <Grid container spacing={2} >
                <Grid item xs={12} md={6} mt={1}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div sx={[DisplayFlex, { justifyContent: "space-around" }]}>
                            <Div sx={{ borderRight: "1px solid lightgrey", width: '100%' }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>$ 3,142.00</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Total Sales</Typography>
                            </Div>
                            <Div sx={{ borderRight: "1px solid lightgrey", width: '100%' }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>$ 20.88</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Average Sales</Typography>
                            </Div>
                            <Div sx={{ width: "100%" }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>403</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Count of Sales</Typography>
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6} mt={1}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div sx={[DisplayFlex, { justifyContent: "space-around" }]}>
                            <Div sx={{ borderRight: "1px solid lightgrey", width: '100%' }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>132</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Average Impression</Typography>
                            </Div>
                            <Div sx={{ borderRight: "1px solid lightgrey", width: '100%' }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>12.71%</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Average CTR</Typography>
                            </Div>
                            <Div sx={{ width: "100%" }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "14px" }]}>27.25%</Typography>
                                <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "11px" }]}>Average ACoS</Typography>
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6} mt={1}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div>
                            <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Sales By Month</Typography>
                            <Typography sx={[{ fontWeight: 400, textAlign: 'center', fontSize: "10px" }]}>(Click on the Chart to Filter by Month)</Typography>
                            <Div sx={[DisplayFlex, { justifyContent: 'center', my: 1, }]}>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', }} ><span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: '#9e2a2b', position: "absolute", left: -12, top: "30%" }} /> Failed to meet Target</Typography>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', mx: 3 }} ><span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: '#9e2a2b', position: "absolute", left: -12, top: "20%" }} /> Dollar Sales</Typography>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative' }} ><span style={{ width: "10px", height: "3px", backgroundColor: 'navy', position: "absolute", left: -12, top: "40%" }} /> Monthly Target</Typography>

                            </Div>
                        </Div>
                        <Div>
                            <ColumnBarChart
                                height={240}
                                labelShow={false}
                                color={['#9e2a2b', 'navy']}
                                barType={[{ label: "Dollar", style: 'stackedarea' }, { label: "target", style: 'line' }]}
                                barData={dataSource}
                                barLength={['Dollar', 'target']}
                            // barWidth={35}
                            />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6} mt={1}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Impression Breakdown</Typography>

                        <Div>
                            <ColumnBarChart
                                height={255}
                                legend={false}
                                labelShow={false}
                                barData={dataSource2}
                                legendVerticle='bottom'
                                legendhorizotal='center'
                                barType='stackedbar'
                                color={['#9e2a2b', 'lightgrey', 'black']}
                                barLength={['Organic', 'Refference', 'Direct',]}
                            />
                        </Div>
                        <Div>
                            <Div sx={[DisplayFlex, { justifyContent: 'center', my: 1, }]}>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: '#9e2a2b', position: "absolute", left: -12, top: "25%" }} /> Organic</Typography>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative', mx: 3 }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: 'lightgrey', position: "absolute", left: -12, top: "25%" }} /> Refference</Typography>
                                <Typography sx={{ fontSize: '10px', color: "black", textAlign: 'center', fontWeight: 400, position: 'relative' }} ><span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: 'black', position: "absolute", left: -12, top: "25%" }} /> Direct</Typography>

                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={4} mt={1}>
                    <Div className='card' sx={[{ minHeight: "310px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Dollar Sales by Product</Typography>

                        <Div sx={[DisplayFlex, { justifyContent: 'right' }]}>
                            <Typography >Count</Typography>
                            <Switch onValueChange={() => setToggleButtton(!toggleButton)} value={toggleButton} defaultValue={toggleButton} />
                            <Typography >$</Typography>
                        </Div>

                        <Div>
                            <PieChart
                                dataSource={dataSource3}
                                palette="Bright"
                                title=""
                                height={240}
                                customizeSeries={(seriesName, idx) => {
                                    const colors = [
                                        "green", // Example color for "English"
                                        "navy", // Example color for "Spanish"
                                        "#0000ff",  // Example color for "French"
                                        // Add more colors for other languages as needed
                                    ];
                                    return {
                                        color: colors[idx] || undefined
                                    };
                                }}
                            >
                                <Series
                                    argumentField="label"
                                    valueField="Dollar"
                                >
                                    <Label
                                        visible={true}
                                        customizeText={formatLabel}
                                        format="fixedPoint"
                                    >
                                        <Connector
                                            visible={true}
                                            width={0.5}
                                        />
                                    </Label>
                                    <SmallValuesGrouping
                                        threshold={4.5}
                                        mode="smallValueThreshold"
                                    />
                                </Series>
                                <Legend visible={false}
                                    horizontalAlignment="center"
                                    verticalAlignment="bottom"
                                />
                                <Export enabled={false} />
                            </PieChart>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={4} mt={1}>
                    <Div className='card' sx={[{ height: "310px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, textAlign: 'center', fontSize: "13px" }]}>Sales Count by State</Typography>
                        <Div>
                            <CRMGaugeChart />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={4} mt={1}>
                    <Div className='card' sx={[{ minHeight: "310px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', borderBottom: '1px solid lightgrey' }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Region</Typography>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Dollar Sales</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Alabama</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#6a994e", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Delaware</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#6a994e", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Ohio</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#6a994e", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Colorado</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#eeef20", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>California</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#eeef20", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>West Virginia</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#eeef20", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Connecticut</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#eeef20", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Texas</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#eeef20", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>District of Columbia</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#ff6b6b", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Georgia</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#ff6b6b", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                        <Div sx={[DisplayFlex, { my: 0.1, justifyContent: 'space-between', }]}>
                            <Typography sx={[{ pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>Pennsylvania</Typography>
                            <Typography sx={[{ width: "120px", bgcolor: "#ff6b6b", pb: 0.5, fontWeight: 600, textAlign: 'center', fontSize: "12px" }]}>$ 151.00</Typography>
                        </Div>

                    </Div>
                </Grid>

                
            </Grid>
        </JumboContentLayoutMain>
    )
}

export default KeyPerformanceIndicator
