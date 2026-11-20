import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Grid, Typography, alpha } from '@mui/material'
import React from 'react'
import { ComponentHeading, DisplayFlex } from '../widgets/CRMStyles'
import Div from '@jumbo/shared/Div'
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import BoyIcon from '@mui/icons-material/Boy';
import {
    LinearGauge,
    Scale,
    Tick,
    Label,
    RangeContainer,
    Range,
    ValueIndicator,
    SubvalueIndicator,
    Export,
    Title,
    Font,
} from 'devextreme-react/linear-gauge';
import VectorMap, {
    Layer, Legend, Source, Tooltip,
} from 'devextreme-react/vector-map';
import ColumnBarChart from './Bars/ColumnBarChart'
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { MdOutlineStar } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";


const populations = {
    China: 19,
    India: 17.4,
    'United States': 4.44,
    Indonesia: 3.45,
    Brazil: 2.83,
    Pakistan: 2.62,
    Nigeria: 2.42,
    Bangladesh: 2.18,
    Russia: 2.04,
    Japan: 1.77,
    Mexico: 1.67,
    Philippines: 1.39,
    Vietnam: 1.25,
    Ethiopia: 1.23,
    Egypt: 1.21,
    Germany: 1.13,
    Iran: 1.08,
    Turkey: 1.07,
    'Congo (Kinshasa)': 0.94,
    France: 0.92,
    Thailand: 0.9,
    'United Kingdom': 0.89,
    Italy: 0.85,
    Burma: 0.84,
    'South Africa': 0.74,
    'S. Korea': 0.7,
    Colombia: 0.66,
    Spain: 0.65,
    Tanzania: 0.63,
    Kenya: 0.62,
    Ukraine: 0.6,
    Argentina: 0.59,
    Algeria: 0.54,
    Poland: 0.54,
    Sudan: 0.52,
    Canada: 0.49,
    Uganda: 0.49,
    Iraq: 0.47,
    Morocco: 0.46,
    Uzbekistan: 0.43,
};



const colorGroups = [0, 0.5, 0.8, 1, 2, 3, 100];
const bounds = [-180, 85, 180, -60];
const customizeLayer = (elements) => {
    elements.forEach((element) => {
        element.attribute('population', populations[element.attribute('name')]);
    });
};
const customizeText = (arg) => {
    let text;
    if (arg.index === 0) {
        text = '< 0.5%';
    } else if (arg.index === 5) {
        text = '> 3%';
    } else {
        text = `${arg.start}% to ${arg.end}%`;
    }
    return text;
};
const customizeTooltip = (arg) => {
    if (arg.attribute('population')) {
        return {
            text: `${arg.attribute('name')}: ${arg.attribute('population')}% of world population`,
        };
    }
    return null;
};

function MonthlySalesDashboard() {
    const subValues = [15, 25];

    const dataSource = [
        { value: 2305, value2: 1100, label: 'NA ' },
        { value: 1105, value2: 900, label: 'EMEA' },
        { value: 1025, value2: 800, label: 'APAC' },
        { value: 1545, value2: 700, label: 'ANZO' },
    ];

    const winsCountries = [
        { label: 'Canada', value: 66 },
        { label: 'United States', value: 66 },
        { label: 'Australia', value: 66 },
        { label: 'France', value: 66 },
        { label: 'India', value: 66 },
    ]
    const newAccounts = [
        { label: 'Taragon Sage', seat: 6, date: 'Mar 2' },
        { label: 'Milky Way', seat: 6, date: 'Mar 2' },
        { label: 'Summar Health', seat: 6, date: 'Mar 2' },
        { label: 'Mach Z', seat: 6, date: 'Mar 2' },
        { label: 'Ok Go', seat: 6, date: 'Mar 2' },
    ]

    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 2 }]}> Monthly Sales Board</Typography>
            <Grid container spacing={1.5} >
                <Grid container spacing={1.5} item xs={12} md={6} mt={1.5}>
                    <Grid item xs={12}>
                        <Div className='card' sx={[{ minHeight: "200px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                            <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Sales Performance (Today)</Typography>
                            <Grid container alignItems={'center'} spacing={1.5}>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Typography sx={{ fontSize: '13px' }}>Monthly Ending March 31</Typography>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[DisplayFlex,]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>365 Leads</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>285 leads Yesterday</Typography>
                                    </Div>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[DisplayFlex,]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>27 Trials</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>18 Yesterday</Typography>
                                    </Div>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[DisplayFlex,]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>11  Wins</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>15 Yesterday</Typography>
                                    </Div>
                                </Grid>

                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Typography sx={{ fontSize: '11px' }}>31.0 Days Left</Typography>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[{ display: 'flex', gap: '8px' }]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>{'$4,765 New MRR'.length > 9 ? '$4,765 New MRR'.substring(0, 10) + "..." : '$4,765 New MRR'}</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>'$6,765 Yesterday</Typography>
                                    </Div>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[{ display: 'flex', gap: '8px' }]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>{'$4,765 New MRR'.length > 9 ? '$1,250 Expansion MRR'.substring(0, 10) + "..." : '$4,765 New MRR'}</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>'$4,765 Yesterday</Typography>
                                    </Div>
                                </Grid>
                                <Grid item xs={6} md={3} mt={1.5}>
                                    <Div>
                                        <Div sx={[{ display: 'flex', gap: '8px' }]}>
                                            {/* <BiSolidDownArrow  style={{fontSize:'20px',color:'tomato'}}/> */}
                                            <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} />
                                            <Typography sx={{ fontSize: '16px' }}>{'$4,765 New MRR'.length > 9 ? '$4,765 Service MRR'.substring(0, 10) + "..." : '$4,765 New MRR'}</Typography>
                                        </Div>
                                        <Typography sx={{ fontSize: '10px' }}>'$2,765 Yesterday</Typography>
                                    </Div>
                                </Grid>
                            </Grid>
                        </Div>
                    </Grid>

                    <Grid item xs={12}>
                        <Div className='card' sx={[{ minHeight: "200px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                            <Grid container justifyContent={"space-between"} spacing={1.5}>
                                <Grid item xs={6} >
                                    {Array.from({ length: 10 })?.map((e, index) => (
                                        <BoyIcon key={index} style={{ color: 'green' }} fontSize="medium" />
                                    ))}
                                    <Typography sx={{ fontSize: '16px', mt: 1 }}>{10} Wins Today</Typography>

                                </Grid>

                                <Grid item xs={6} >
                                    <LinearGauge
                                        subvalues={subValues}
                                    >
                                        <Scale startValue={0} endValue={30} tickInterval={5}>
                                            <Tick color="#536878" />
                                            {/* <Label indentFromTick={-3} /> */}
                                        </Scale>
                                        <RangeContainer width={15}>
                                            <Range startValue={0} endValue={5} color="#92000A" />
                                            <Range startValue={5} endValue={20} color="#E6E200" />
                                            <Range startValue={20} endValue={30} color="#77DD77" />
                                        </RangeContainer>

                                    </LinearGauge>
                                </Grid>

                                <Grid container justifyContent={"space-around"} spacing={2}>
                                    <Grid item xs={6} md={6} mt={1.5}>
                                        <Div>
                                            <Div sx={[DisplayFlex, { justifyContent: 'center' }]}>
                                                <BiSolidDownArrow style={{ fontSize: '20px', color: 'tomato' }} />
                                                {/* <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} /> */}
                                                <Typography sx={{ fontSize: '16px' }}>$365 New MRR</Typography>
                                            </Div>
                                            <Typography sx={{ fontSize: '10px', textAlign: 'center' }}>$2,333 MRR Yesterday</Typography>
                                        </Div>
                                    </Grid>
                                    <Grid item xs={6} md={6} mt={1.5}>
                                        <Div>
                                            <Div sx={[DisplayFlex, { justifyContent: 'center' }]}>
                                                <BiSolidDownArrow style={{ fontSize: '20px', color: 'tomato' }} />
                                                {/* <BiSolidUpArrow style={{ fontSize: '20px', color: 'green' }} /> */}
                                                <Typography sx={{ fontSize: '16px', }}>$65 Expansion MRR</Typography>
                                            </Div>
                                            <Typography sx={{ fontSize: '10px', textAlign: 'center' }}>$2,233 MRR Yesterday</Typography>
                                        </Div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Div>
                    </Grid>
                </Grid>

                <Grid container item spacing={1.5} xs={12} md={6} mt={1.5}>
                    <Grid item xs={12} md={7}>
                        <Div className='card' sx={[{ minHeight: "400px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                            <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Wins by Region (past 7 days)</Typography>
                            <Div >
                                <VectorMap
                                    id="vector-map"
                                    bounds={bounds}
                                    height={200}
                                >
                                    <Layer
                                        dataSource={mapsData.world}
                                        palette="Violet"
                                        name="areas"
                                        colorGroupingField="population"
                                        colorGroups={colorGroups}
                                        customize={customizeLayer}
                                    ></Layer>
                                    <Tooltip
                                        enabled={true}
                                        customizeTooltip={customizeTooltip}
                                    ></Tooltip>
                                    <Legend customizeText={customizeText}>
                                        <Source
                                            layer="areas"
                                            grouping="color"
                                        ></Source>
                                    </Legend>
                                </VectorMap>
                            </Div>
                            <Div >
                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', bgcolor: alpha('#979dac', 0.3), p: 0.5 }]}>
                                    <Typography sx={[{ fontWeight: 400, fontSize: "12px" }]}>Regions</Typography>
                                    <Typography sx={[{ fontWeight: 400, fontSize: "12px" }]}>Sessions</Typography>
                                </Div>

                                <Div sx={{ minHeight: '140px' }}>
                                    {
                                        winsCountries?.map((winsCount, idx) => {
                                            return (
                                                <Div key={idx} sx={[DisplayFlex, { justifyContent: 'space-between', p: 0.5 }]}>
                                                    <Typography sx={[{ fontWeight: 400, fontSize: "12px" }]}>{winsCount?.label}</Typography>
                                                    <Div sx={[DisplayFlex]}>
                                                        <Typography sx={[{ fontWeight: 400, fontSize: "12px" }]}>{winsCount?.value}</Typography>
                                                        {idx == 0 && <MdOutlineStar style={{ color: 'green', fontSize: 16 }} />}
                                                        {idx <= 2 && <FaCircle style={{ color: 'green', fontSize: 14 }} />}
                                                        {idx > 2 && <FaMinus style={{ color: 'grey', fontSize: 14 }} />}
                                                    </Div>
                                                </Div>
                                            )
                                        })
                                    }
                                </Div>

                            </Div>
                        </Div>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Div className='card' sx={[{ minHeight: "410px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                            <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>New Accounts (past 7 days)</Typography>

                            <Div >
                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', bgcolor: alpha('#979dac', 0.3), p: 0.5 }]}>
                                    <Typography sx={[{ fontWeight: 400, fontSize: "11px" }]}>Account Name</Typography>
                                    <Div sx={[DisplayFlex, { gap: '10px' }]}>
                                        <Typography sx={[{ fontWeight: 400, fontSize: "11px" }]}>Seates</Typography>
                                        <Typography sx={[{ fontWeight: 400, fontSize: "11px" }]}>Date</Typography>
                                    </Div>
                                </Div>

                                <Div sx={{ minHeight: '310px', borderBottom: '1px solid lightgrey' }}>
                                    {
                                        newAccounts?.map((winsCount, idx) => {
                                            return (
                                                <Div key={idx} sx={[DisplayFlex, { justifyContent: 'space-between', p: 0.5 }]}>
                                                    <Typography sx={[{ fontWeight: 400, fontSize: "11px" ,color:'#1e96fc'}]}>{winsCount?.label}</Typography>
                                                    <Div sx={[DisplayFlex, { gap: '10px' }]}>
                                                        <Typography sx={[{ fontWeight: 400, fontSize: "11px" }]}>{winsCount?.seat}</Typography>
                                                        <Typography sx={[{ fontWeight: 400, fontSize: "11px" }]}>{winsCount?.date}</Typography>
                                                    </Div>
                                                </Div>
                                            )
                                        })
                                    }
                                </Div>

                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', mt:1, p: 0.5 }]}>
                                    <Typography sx={[{ fontWeight: 600, fontSize: "11px" }]}>{96}</Typography>
                                    <Div sx={[DisplayFlex, { gap: '10px' }]}>
                                        <Typography sx={[{ fontWeight: 600, fontSize: "11px" }]}>{100}</Typography>
                                        <Div sx={[DisplayFlex]}>
                                            <FaCircle style={{ color: 'green', fontSize: 14 }} />
                                            <Typography sx={[{ fontWeight: 600,color:'green' ,fontSize: "12px" }]}>{'13.6/day'}</Typography>
                                        </Div>
                                    </Div>
                                </Div>
                            </Div>
                        </Div>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "150px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>New Accounts This Month</Typography>
                        <Div>
                            <ColumnBarChart
                                labelShow={true}
                                rotated={true}
                                color={['#1e96fc',]}
                                barData={dataSource}
                                height={110}

                            />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "150px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Account Target/progress</Typography>

                        <LinearGauge
                            id="gauge"
                            subvalues={subValues}
                        >
                            <Scale startValue={0} endValue={50} tickInterval={5}>
                                <Tick color="#536878" />
                                <Label indentFromTick={-3} />
                            </Scale>
                            <RangeContainer width={15} >
                                <Range startValue={0} endValue={15} color="gray" />
                            </RangeContainer>

                        </LinearGauge>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "150px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>MRR This Month</Typography>
                        <Div>
                            <ColumnBarChart
                                labelShow={true}
                                color={['#1e96fc', 'lightgreen']}
                                barData={dataSource}
                                rotated={true}
                                barType='stackedbar'
                                height={110}
                                barLength={["value", "value2"]}

                            />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "150px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Expansion MRR Target/progressh</Typography>

                        <LinearGauge
                            id="gauge"
                            subvalues={subValues}
                        >
                            <Scale startValue={0} endValue={50} tickInterval={5}>
                                <Tick color="#536878" />
                                <Label indentFromTick={-3} />
                            </Scale>
                            <RangeContainer width={15} >
                                <Range startValue={0} endValue={15} color="grey" />
                            </RangeContainer>

                        </LinearGauge>
                    </Div>
                </Grid>
            </Grid>


        </JumboContentLayoutMain>
    )
}

export default MonthlySalesDashboard
