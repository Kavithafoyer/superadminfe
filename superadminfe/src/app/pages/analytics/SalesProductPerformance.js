import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import React, { useEffect, useState } from 'react'
import { ComponentHeading, DisplayFlex } from '../widgets/CRMStyles'
import { Grid, Typography } from '@mui/material'
import Div from '@jumbo/shared/Div'
import ReactApexChart from 'react-apexcharts'
import ColumnBarChart from './Bars/ColumnBarChart'
import { Chart } from 'devextreme-react'
import { CommonSeriesSettings, SeriesTemplate } from 'devextreme-react/cjs/chart'
import { AutoHeight } from 'app/redux/auth/localStorage'
import { BASE_URL } from 'app/services/auth-services'
import axios from 'axios'

function SalesProductPerformance() {
    const [datas, setDatas] = useState([]);

    const token = localStorage.getItem("accesstoken");
    const DBName = "crmuseradmin1";
    const getDatas = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/AnalysticSalesProductPerformance/?Is_Deleted=False&id=${localStorage.getItem("UserId")}`,
          {
            headers: {
              db: DBName,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        console.log("lists23", response.data?.results);
        if (Object.keys(response.data).length > 0) {
          setDatas(response.data || []);
          setOption({...options,labels: response.data?.Product_Revenue?.map(pr=>pr?.ProductName) || [],})
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };
  
    useEffect(() => {
      getDatas();
    }, []);
  

    // donut chart option
    const customSeriesNames = ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'];
    const [options,setOption] = useState({
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
        labels: datas?.Product_Revenue?.map(pr=>pr?.ProductName) || [],
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
        { Online: 2305, 'In-Store': 1100, label: '2010 ' },
        { Online: 1105, 'In-Store': 900, label: '2011' },
        { Online: 1025, 'In-Store': 800, label: '2012' },
        { Online: 1545, 'In-Store': 700, label: '2013' },
        { Online: 2305, 'In-Store': 1100, label: '2014 ' },
        { Online: 1105, 'In-Store': 900, label: '2015' },
        { Online: 1025, 'In-Store': 800, label: '2016' },
        { Online: 1545, 'In-Store': 700, label: '2017' },
    ];
    const dataSource3 = [
        { Purchase: 2305, Lease: 235, 'Labour': 1100, label: '2010 ' },
        { Purchase: 1105, Lease: 235, 'Labour': 900, label: '2011' },
        { Purchase: 1025, Lease: 235, 'Labour': 800, label: '2012' },
        { Purchase: 1545, Lease: 235, 'Labour': 700, label: '2013' },
        { Purchase: 2305, Lease: 235, 'Labour': 1100, label: '2014 ' },
        { Purchase: 1105, Lease: 235, 'Labour': 900, label: '2015' },
        { Purchase: 1025, Lease: 235, 'Labour': 800, label: '2016' },
        { Purchase: 1545, Lease: 235, 'Labour': 700, label: '2017' },
    ];

    const dataSource2 = [
        { value: 700, label: 'Social Ads' },
        { value: 800, label: 'Banner' },
        { value: 900, label: 'Email' },
        { value: 1100, label: 'Adwords ' },

    ];
    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 2 }]}> Sales Product Performance Dashboard</Typography>
            <Grid container spacing={1.5} >
                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Top Products in Revenue(K)</Typography>
                        <Div sx={[DisplayFlex, { justifyContent: 'center', }]} >
                            <Div sx={[DisplayFlex, { justifyContent: 'center',height:AutoHeight(3) }]} >
                                <ReactApexChart options={options} series={datas?.Product_Revenue?.map(pr=>pr?.Revenue) || []} type="donut" width={380} />
                            </Div>
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Online vs In-Store Purchases (2010-2016)</Typography>
                        <Div sx={{height:AutoHeight(3)}}>
                            <ColumnBarChart
                                labelShow={false}
                                color={['#48cae4', '#00bd9d']}
                                legend={true}
                                legendVerticle='top'
                                barType='area'
                                barData={dataSource}
                                barLength={['Online', 'In-Store']}
                                height={"100%"}
                            />
                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Incremental Sales by Campaign</Typography>
                        <Div sx={{height:AutoHeight(3)}}>
                            <ColumnBarChart
                                labelShow={false}
                                // color={['#48cae4', '#00bd9d', "#efa00b", "red"]}
                                rotated={true}
                                MultipleColumn={true}
                                legend={true}
                                legendVerticle='top'
                                barData={dataSource2}
                                height={'100%'}
                            />

                        </Div>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ minHeight: "300px", p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Cost of Goods Sold</Typography>
                        <Div sx={{height:AutoHeight(3)}}>
                            <ColumnBarChart
                                labelShow={false}
                                color={['#48cae4', '#00bd9d', "#efa00b"]}
                                legend={true}
                                legendVerticle='top'
                                barType='stackedbar'
                                barData={dataSource3}
                                barLength={['Purchase', 'Labour', 'Lease']}
                                height={"100%"}
                            />
                        </Div>
                    </Div>
                </Grid>
            </Grid>
        </JumboContentLayoutMain>
    )
}

export default SalesProductPerformance
