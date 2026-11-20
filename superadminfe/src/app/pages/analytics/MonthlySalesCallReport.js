import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Autocomplete, FormControl, Grid, Table, TableBody, TableHead, TextField, Typography } from '@mui/material'
import React from 'react'
import { CRMTableHead, ComponentHeading, DisplayFlex, FontStyle } from '../widgets/CRMStyles'
import { DataGrid } from 'devextreme-react'
import { Column } from 'devextreme-react/cjs/data-grid'
import Div from '@jumbo/shared/Div'
import JumboScrollbar from '@jumbo/components/JumboScrollbar'
import { CRMTableCell, CRMTableRow } from '../widgets/CRMTable'



function MonthlySalesCallReport() {
    const datas = [
        { CurrentMonth: 'Week 1', NumberOfCalls: 250, TargetNumberOfCalls: 200, TargetNoOfSales: 25, TargetSalesAchieved: '70.0%', ValueOfSales: '$ 2,000', TargetValueOfSales: '$ 3,000', TargetSalesValueAchieved: '89.0%', NumberOfSales: 35 },
        { CurrentMonth: 'Week 2', NumberOfCalls: 150, TargetNumberOfCalls: 200, TargetNoOfSales: 25, TargetSalesAchieved: '70.0%', ValueOfSales: '$ 1,000', TargetValueOfSales: '$ 3,000', TargetSalesValueAchieved: '89.0%', NumberOfSales: 35 },
        { CurrentMonth: 'Week 3', NumberOfCalls: 250, TargetNumberOfCalls: 200, TargetNoOfSales: 25, TargetSalesAchieved: '70.0%', ValueOfSales: '$ 2,400', TargetValueOfSales: '$ 3,000', TargetSalesValueAchieved: '89.0%', NumberOfSales: 35 },
        { CurrentMonth: 'Week 4', NumberOfCalls: 350, TargetNumberOfCalls: 200, TargetNoOfSales: 25, TargetSalesAchieved: '70.0%', ValueOfSales: '$ 2,300', TargetValueOfSales: '$ 3,000', TargetSalesValueAchieved: '89.0%', NumberOfSales: 35 },
        { CurrentMonth: 'Week 5', NumberOfCalls: 150, TargetNumberOfCalls: 200, TargetNoOfSales: 25, TargetSalesAchieved: '70.0%', ValueOfSales: '$ 1,230', TargetValueOfSales: '$ 3,000', TargetSalesValueAchieved: '89.0%', NumberOfSales: 35 },

    ]

    const monthAndYear = [
        'January 24', 'February 24', 'March 24', 'April 24', 'May 24', 'June 24', 'July 24', 'August 24', 'September 24', 'October 24', 'November 24', 'December 24',
    ]

    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 1, fontWeight: 600, fontSize: "13px" }]}>Monthly Sales Call Report Template</Typography>

            <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={4}>
                    <FormControl sx={{ width: { md: '70%' } }} className="col-12">
                        <Typography sx={[FontStyle, { mb: 0.2 }]} >Month & Year</Typography>
                        <Autocomplete
                            className="search-select"
                            // {...register("selectedCountry1")}
                            options={monthAndYear}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                if (option && option) {
                                    return option;
                                }
                                return "";
                            }}
                            // value={addField?.accName}
                            // onChange={(e, newValue) => {
                            //     setAddField({ ...addField, accId: newValue?.id, accName: newValue?.Account_Owner });
                            // }}
                            id="outlined-basic"
                            renderInput={(params) => (
                                <TextField {...params} placeholder="No select" />
                            )}
                        />

                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl className="col-12" sx={{ width: { md: '70%' } }}>
                        <Typography sx={[FontStyle, { mb: 0.2 }]} >Report Prepared By</Typography>
                        <Autocomplete
                            className="search-select"
                            // {...register("selectedCountry1")}
                            options={['candance W.']}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                if (option && option) {
                                    return option;
                                }
                                return "";
                            }}
                            // value={addField?.accName}
                            // onChange={(e, newValue) => {
                            //     setAddField({ ...addField, accId: newValue?.id, accName: newValue?.Account_Owner });
                            // }}
                            id="outlined-basic"
                            renderInput={(params) => (
                                <TextField {...params} placeholder="No select" />
                            )}
                        />

                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl className="col-12" sx={{ width: { md: '70%' } }}>
                        <Typography sx={[FontStyle, { mb: 0.2 }]} >Signature</Typography>
                        <TextField className='search-select' placeholder="Enter your signature" />
                    </FormControl>
                </Grid>
            </Grid>

            <Div  sx={{ mt: 2 }}>

                <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={400}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                >
                    <Table className="table" sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
                        <TableHead sx={[CRMTableHead, FontStyle]}  >
                            <CRMTableRow>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>CURRENT MONTH</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>NUMBER OF CALLS MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>TARGET NUMBER OF CALLS MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>NUMBER OF SALES MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>TARGET NUMBER OF SALES MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>TARGET SALES ACHIEVED</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>VALUE OF SALES MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>TARGET VALUE OF SALES MADE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer",fontSize:'10px !important',fontWeight:'600 !important' }}>TARGET SALES VALUE ACHIEVED</CRMTableCell>
                            </CRMTableRow>
                        </TableHead>
                        <TableBody className="table-body" sx={{ mt: 2 }}>
                            {datas && datas?.map((data, index) => {
                                // console.log("data : ", data);
                                return (
                                    <CRMTableRow  >
                                        <CRMTableCell
                                            data-title="CURRENT MONTH" > {data?.CurrentMonth}
                                        </CRMTableCell>

                                        <CRMTableCell
                                            data-title="NUMBER OF CALLS MADE" >{data?.NumberOfCalls}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="TARGET NUMBER OF CALLS MADE">{data?.TargetNumberOfCalls}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="NUMBER OF SALES MADE">{data?.NumberOfSales}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="TARGET NUMBER OF SALES MADE">{data?.TargetNoOfSales}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="TARGET SALES ACHIEVED">{data?.TargetSalesAchieved}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="VALUE OF SALES MADE">{data?.ValueOfSales}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="TARGET VALUE OF SALES MADE">{data?.TargetValueOfSales}</CRMTableCell>
                                        <CRMTableCell data-title="TARGET SALES VALUE ACHIEVED">{data?.TargetSalesValueAchieved}</CRMTableCell>
                                    </CRMTableRow>
                                )
                            })}
                            <CRMTableRow sx={{backgroundColor:'#d3e2e9 !important'}} >
                                <CRMTableCell
                                    data-title="CURRENT MONTH" > {'Monthly Total and Averages'}
                                </CRMTableCell>
                                <CRMTableCell
                                    data-title="NUMBER OF CALLS MADE" >{945}</CRMTableCell>
                                <CRMTableCell
                                    data-title="TARGET NUMBER OF CALLS MADE">{1000}</CRMTableCell>
                                <CRMTableCell
                                    data-title="NUMBER OF SALES MADE">{110}</CRMTableCell>
                                <CRMTableCell
                                    data-title="TARGET NUMBER OF SALES MADE">{126}</CRMTableCell>
                                <CRMTableCell
                                    data-title="TARGET SALES ACHIEVED">{'70.0%'}</CRMTableCell>
                                <CRMTableCell
                                    data-title="VALUE OF SALES MADE">{'$ 14,200.00'}</CRMTableCell>
                                <CRMTableCell
                                    data-title="TARGET VALUE OF SALES MADE">{'$ 15,000.00'}</CRMTableCell>
                                <CRMTableCell data-title="TARGET SALES VALUE ACHIEVED">{'94.0%'}</CRMTableCell>
                            </CRMTableRow>
                        </TableBody>
                    </Table>

                </JumboScrollbar>

            </Div>
        </JumboContentLayoutMain>
    )
}

export default MonthlySalesCallReport
