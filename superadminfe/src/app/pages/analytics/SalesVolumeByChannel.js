import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { CRMTableHead, DisplayFlex } from '../widgets/CRMStyles'
import Div from '@jumbo/shared/Div'
import { CRMTableCell, CRMTableRow } from '../widgets/CRMTable'
import { alpha } from '@material-ui/core'
import ColumnBarChart from './Bars/ColumnBarChart'

function SalesVolumeByChannel() {
    const dataSource3 = [
        { label: 'Sales Rep', value: 425 },
        { label: 'Online Store', value: 222 },
        { label: 'Physical Store', value: 125 },
        { label: 'Email Marketing', value: 325 },
        { label: 'Social Media', value: 325 },
        { label: 'Mobile App', value: 325 },
        { label: 'Call Center', value: 233 },

    ]
    return (
        <JumboContentLayoutMain>
            <Grid container spacing={2} >
                <Grid item xs={12} mt={0.5}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Div sx={[DisplayFlex, { gap: '10px' }]} >
                            <Div sx={{ mt: 1 }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Lead To Opportunity Ratio</Typography>
                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', p: 2, width: '200px', border: '1px solid lightgrey', borderBottom: '0px solid lightgrey', bgcolor: alpha('#96e072', 0.3), p: 0.5 }]}>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "11px" }]}>LEAD</Typography>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "11px" }]}>OPPORTUNITY</Typography>
                                </Div>

                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', px: 1, width: '200px', border: '1px solid lightgrey' }]}>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "12px", pt: 1 }]}>44</Typography>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "12px", pt: 1 }]}>22</Typography>
                                </Div>
                            </Div>

                            <Div sx={{ mt: 1 }}>
                                <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Opportunity To Wins Ratio</Typography>
                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', p: 2, width: '200px', border: '1px solid lightgrey', borderBottom: '0px solid lightgrey', bgcolor: alpha('#bad7f2', 0.3), p: 0.5 }]}>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "11px" }]}>OPPORTUNITY</Typography>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "11px", }]}>WINS</Typography>
                                </Div>

                                <Div sx={[DisplayFlex, { justifyContent: 'space-between', px: 1, width: '200px', border: '1px solid lightgrey' }]}>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "12px", pt: 1 }]}>16</Typography>
                                    <Typography sx={[{ textAlign: 'center', fontWeight: 400, fontSize: "12px", pt: 1 }]}>5</Typography>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                </Grid>
                
                <Grid item xs={12} mt={0.5}>
                    <Div className='card' sx={[{ minHeight: { md: "400px" }, p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <Typography sx={[{ mb: 1, fontWeight: 600, fontSize: "13px" }]}>Sales Volume By Channel</Typography>
                        <ColumnBarChart
                            labelShow={false}
                            rotated={true}
                            MultipleColumn={true}
                            legend={false}
                            // legendVerticle='top'
                            barData={dataSource3}
                            height={350}
                        />
                    </Div>
                </Grid>
            </Grid>
        </JumboContentLayoutMain>
    )
}

export default SalesVolumeByChannel
