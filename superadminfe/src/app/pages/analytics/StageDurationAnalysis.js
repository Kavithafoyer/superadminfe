import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Grid, Typography } from '@mui/material'
import React from 'react'
import { ComponentHeading } from '../widgets/CRMStyles'
import ColumnBarChart from './Bars/ColumnBarChart'
import { useDrawingArea } from '@mui/x-charts'
import Div from '@jumbo/shared/Div'
import { AutoHeight } from 'app/redux/auth/localStorage'

function StageDurationAnalysis() {
    const { width, height } = useDrawingArea();
    const dataSource = [
        { color: "#588157", unqualified: 900, lost: 1100, won: 1000, label: 'INCOMING' },
        { color: "#fb5607", unqualified: 100, lost: 0, won: 1000, label: 'CONTACTED' },
        { color: "#ffba08", unqualified: 0, lost: 1100, won: 0, label: 'INTERESTED' },
        { color: "#0077b6", unqualified: 0, lost: 0, won: 0, label: "CALLED" },
        { color: "#ff758f", unqualified: 0, lost: 0, won: 1000, label: 'QUOTE' },
        { color: "#ff758f", unqualified: 0, lost: 0, won: 0, label: 'CLOSURE' },
    ];
    return (
        <JumboContentLayoutMain>
            <Div sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 },}]} >
                <Typography sx={[ComponentHeading, { mb: 3 }]}>Stage Duration Analysis</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={10}>
                        <ColumnBarChart
                            height={AutoHeight()}
                            yAxisTitle="DURATION (DAYS)"
                            labelShow={false}
                            barData={dataSource}
                            color={["#80b918", "#8d99ae", "#ff0a54"]}
                            barLength={['won', 'unqualified', 'lost']}

                        />
                    </Grid>
                    <Grid item justifySelf={'center'} alignSelf={'center'} xs={12} md={2} >
                        <Div sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Div sx={{ display: { xs: "flex", md: "block" }, gap: "10px", alignItems: 'center', justifyContent: 'space-evenly', mt: { xs: 3, md: 0 } }}>
                                <Div>
                                    <Typography sx={{ fontSize: "10px", color: "#80b918" }}>WON</Typography>
                                    <Typography sx={{ fontSize: "18px", color: "#80b918" }}>345.4</Typography>
                                    <Typography sx={{ fontSize: "10px", color: "#8d99ae" }}>DAYS</Typography>
                                </Div>
                                <Div sx={{ my: { xs: 0, md: 4 } }}>
                                    <Typography sx={{ fontSize: "10px", color: "#ff0a54" }}>LOST</Typography>
                                    <Typography sx={{ fontSize: "18px", color: "#ff0a54" }}>235.1</Typography>
                                    <Typography sx={{ fontSize: "10px", color: "#8d99ae" }}>DAYS</Typography>
                                </Div>
                                <Div>
                                    <Typography sx={{ fontSize: "10px", color: "#8d99ae" }}>UNQUALIFIED</Typography>
                                    <Typography sx={{ fontSize: "18px", color: "#8d99ae" }}>145.5</Typography>
                                    <Typography sx={{ fontSize: "10px", color: "#8d99ae" }}>DAYS</Typography>
                                </Div>
                            </Div>
                        </Div>
                    </Grid>
                </Grid>
            </Div>
        </JumboContentLayoutMain>
    )
}

export default StageDurationAnalysis
