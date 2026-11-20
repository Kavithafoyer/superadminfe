import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ComponentHeading, DisplayFlex } from '../widgets/CRMStyles'
import Div from '@jumbo/shared/Div'
import ReactApexChart from 'react-apexcharts'
import ColumnBarChart from './Bars/ColumnBarChart'
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { VectorMap } from 'devextreme-react'
import { ControlBar, Layer, Legend, Source } from 'devextreme-react/cjs/vector-map'
import { Tooltip } from 'devextreme-react/cjs/map'




// map
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


function ExecutiveSalesPerformance() {
    const [series, setSeries] = useState([44, 55, 41, 17,]);
    const [series2, setSeries2] = useState([44, 55, 41, 17, 34]);

    // donut chart option
    const customSeriesNames = ['North America ($657K)', 'Europe ($57K)', 'Asia ($57K)', 'Other ($57K)',];

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
            position: 'right',
            horizontalAlign: 'center', // Set horizontal alignment to center
        },
        labels: customSeriesNames,
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
    const customSeriesNames2 = ['Product 1 ($657K)', 'Product 2 ($65K)', 'Product 3 ($57K)', 'Product 4 ($67K)', 'Product 5 ($57K)'];
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
            position: 'right',
            horizontalAlign: 'center', // Set horizontal alignment to center
        },
        labels: customSeriesNames2,
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
    const dataSource = [
        { 'CY Q4': 2305, 'Regional': 500, 'CY Q3': 1100, label: 'Spain ' },
        { 'CY Q4': 1105, 'Regional': 500, 'CY Q3': 900, label: 'Noeway'},
        { 'CY Q4': 1025, 'Regional': 500, 'CY Q3': 800, label: 'Holland'},
        { 'CY Q4': 1545, 'Regional': 500, 'CY Q3': 700, label: 'Italy'},
        { 'CY Q4': 2305, 'Regional': 500, 'CY Q3': 1100, label: 'Russia '},
        { 'CY Q4': 1105, 'Regional': 500, 'CY Q3': 900, label: 'Austria'},
        { 'CY Q4': 1025, 'Regional': 500, 'CY Q3': 800, label: 'France'},
        { 'CY Q4': 1545, 'Regional': 500, 'CY Q3': 700, label: 'UK'},
    ];

    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 2 }]}>Executive Sales Performance Dashboard</Typography>
            <Grid container spacing={1.5} >
                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Opportunity Breakdown - QTD</Typography>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                            <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                                <ReactApexChart options={options} series={series} type="donut" width={420} />
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}></Typography>
                        <Div>
                            <ColumnBarChart
                                labelShow={false}
                                color={['#48cae4', '#00bd9d','orange']}
                                legend={true}
                                legendVerticle='top'
                                barType={[{label:'Regional',style:'line'}]}
                                barData={dataSource}
                                barLength={['CY Q4', 'CY Q3','Regional']}
                                height={250}
                            />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Top Products in Revenue</Typography>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                            <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                                <ReactApexChart options={options2} series={series2} type="donut" width={410} />
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Regional Sales Status</Typography>
                        <Div >
                            <VectorMap
                                id="vector-map"
                                bounds={bounds}
                                height={250}
                            >
                                <ControlBar zoomVisible={false} panVisible={false} />
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
                                <Legend visible={false} customizeText={customizeText}>
                                    <Source
                                        layer="areas"
                                        grouping="color"
                                    ></Source>
                                </Legend>
                            </VectorMap>
                        </Div>
                    </Div>
                </Grid>
            </Grid>
        </JumboContentLayoutMain>
    )
}

export default ExecutiveSalesPerformance
