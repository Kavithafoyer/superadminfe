import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain';
import { Autocomplete, FormControl, Grid, Table, TableBody, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React from 'react'
import { CRMTableHead, ComponentHeading, FontStyle } from '../widgets/CRMStyles';
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { CRMTableCell, CRMTableRow } from '../widgets/CRMTable';
import Div from '@jumbo/shared/Div';

function SimpleMonthlySalesReport() {

    const datas = [
        { CurrentMonth: 'Sales Volume', Planned: '$ 12,239.00', Actual: '$ 12,239.00', Variance: '$(1,239.00)', },
        { CurrentMonth: 'Total Revenue', Planned: '$ 12,239.00', Actual: '$ 12,239.00', Variance: '$ 12,239.00', },
        { CurrentMonth: 'Sales Margin', Planned: '87%', Actual: '87%', Variance: '-8%', },
        { CurrentMonth: 'Total Orders', Planned: 14, Actual: 17, Variance: -3, },
        { CurrentMonth: 'Average order Value', Planned: '$ 25.00', Actual: '$ 25.00', Variance: '$', },
        { CurrentMonth: 'Other', Planned: '$ 14.00', Actual: '$ -', Variance: '$ -', },
        { CurrentMonth: '', Planned: '$ -', Actual: '$ -', Variance: '$ -', },
        { CurrentMonth: '', Planned: '$ -', Actual: '$ -', Variance: '$ -', },

    ]


    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 1, fontWeight: 600, fontSize: "13px" }]}>Simple Monthly Sales Report Template</Typography>

            <Grid container spacing={2} mt={1.5}>
                <Grid item xs={12} md={9}>
                    <FormControl sx={{ width: { md: '90%' } }} className="col-12">
                        <Typography sx={[FontStyle, { mb: 0.2 }]} >Sales Manager Name</Typography>
                        <Autocomplete
                            className="search-select"
                            // {...register("selectedCountry1")}
                            options={['Colin I']}
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
                            renderInput={(params) => (
                                <TextField {...params} placeholder="No select" />
                            )}
                        />

                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl className="col-12" sx={{ width: { md: '70%' } }}>
                        <Typography sx={[FontStyle, { mb: 0.2 }]} >Date</Typography>
                        <TextField type='date' className='search-select' placeholder="pick date" />
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container spacing={2} mt={1.5}>
                <Grid item xs={12}>
                    <Typography sx={[ComponentHeading, { mb: 0.5, fontWeight: 600, fontSize: "13px" }]}>Sales Report</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >

                        <JumboScrollbar
                            autoHeight={true}
                            autoHideTimeout={4000}
                            autoHeightMin={300}
                            autoHide={true}
                            hideTracksWhenNotNeeded
                            id="no-more-tables"
                        >
                            <Table className="table" stickyHeader sx={{ minWidth: { xs: "auto", sm: 500 } }}>
                                <TableHead sx={[CRMTableHead, FontStyle]}  >
                                    <CRMTableRow sx={{ backgroundColor: '#fdca40 !important' }}>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }} colSpan={4}>CURRENT MONTH</CRMTableCell>
                                    </CRMTableRow>
                                    <CRMTableRow sx={{ backgroundColor: '#f5ee9e !important' }}>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}></CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>PLANNED</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>ACTUAL</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>VARIANCE</CRMTableCell>
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
                                                    data-title="PLANNED" >{data?.Planned}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="ACTUAL">{data?.Actual}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="VARIANCE">{data?.Variance}</CRMTableCell>

                                            </CRMTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>

                        </JumboScrollbar>
                    </Div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <JumboScrollbar
                            autoHeight={true}
                            autoHideTimeout={4000}
                            autoHeightMin={300}
                            autoHide={true}
                            hideTracksWhenNotNeeded
                            id="no-more-tables"
                        >
                            <Table className="table" stickyHeader sx={{ minWidth: { xs: "auto", sm: 500 } }}>
                                <TableHead sx={[CRMTableHead, FontStyle]}  >
                                    <CRMTableRow sx={{ backgroundColor: '#fdca40 !important' }}>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }} colSpan={4}>PREVIOUS MONTH</CRMTableCell>
                                    </CRMTableRow>
                                    <CRMTableRow sx={{ backgroundColor: '#f5ee9e !important' }}>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}></CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>PLANNED</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>ACTUAL</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>VARIANCE</CRMTableCell>
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
                                                    data-title="PLANNED" >{data?.Planned}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="ACTUAL">{data?.Actual}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="VARIANCE">{data?.Variance}</CRMTableCell>

                                            </CRMTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>

                        </JumboScrollbar>
                    </Div>
                </Grid>

                <Grid item xs={12} mt={1}>
                    <Typography sx={[ComponentHeading, { my: 0.5, fontWeight: 600, fontSize: "13px" }]}>Year-To-Date Sales</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <JumboScrollbar
                            autoHeight={true}
                            autoHideTimeout={4000}
                            autoHeightMin={300}
                            autoHide={true}
                            hideTracksWhenNotNeeded
                            id="no-more-tables"
                        >
                            <Table className="table" stickyHeader sx={{ minWidth: { xs: "auto", sm: 500 } }}>
                                <TableHead sx={[CRMTableHead, FontStyle]}  >
                                    <CRMTableRow sx={{ backgroundColor: '#f5ee9e !important' }}>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}></CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>PLANNED</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>ACTUAL</CRMTableCell>
                                        <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>VARIANCE</CRMTableCell>
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
                                                    data-title="PLANNED" >{data?.Planned}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="ACTUAL">{data?.Actual}</CRMTableCell>
                                                <CRMTableCell
                                                    data-title="VARIANCE">{data?.Variance}</CRMTableCell>

                                            </CRMTableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>

                        </JumboScrollbar>
                    </Div>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                    <Div className='card' sx={[{ p: 1, boxShadow: "0px 0px 4px lightgray", border: "1px solid white" }]} >
                        <JumboScrollbar
                            autoHeight={true}
                            autoHideTimeout={4000}
                            autoHeightMin={300}
                            autoHide={true}
                            hideTracksWhenNotNeeded
                            id="no-more-tables"
                        >
                            <Table className="table" stickyHeader>
                                <TableBody className="table-body" sx={{ mt: 2 }}>

                                    <TableRow sx={{height:'35px'}}  >
                                        <CRMTableCell sx={{ backgroundColor: '#e6e6e6 !important' }}
                                        > {'Sales Performance Summary'}
                                        </CRMTableCell>

                                        <CRMTableCell
                                        >On Target for annual goals
                                        </CRMTableCell>

                                    </TableRow >
                                    <TableRow sx={{ backgroundColor: '#e6e6e6 !important' ,height:'35px'}} >
                                        <CRMTableCell colSpan={2}
                                        > {'Notable SWOT Elements'}
                                        </CRMTableCell>
                                    </TableRow >

                                    <TableRow sx={{height:'35px'}}  >
                                        <CRMTableCell align='right' sx={{ backgroundColor: '#e6e6e6 !important' }}
                                        > {'strengths'}
                                        </CRMTableCell>

                                        <CRMTableCell
                                        >Regular Customer Outreach
                                        </CRMTableCell>

                                    </TableRow >
                                    <TableRow sx={{height:'35px'}}  >
                                        <CRMTableCell align='right' sx={{ backgroundColor: '#e6e6e6 !important' }}
                                        > {'Opportunity'}
                                        </CRMTableCell>

                                        <CRMTableCell
                                        >
                                        </CRMTableCell>

                                    </TableRow >
                                    <TableRow sx={{height:'35px'}}  >
                                        <CRMTableCell align='right' sx={{ backgroundColor: '#e6e6e6 !important' }}
                                        > {'Threats'}
                                        </CRMTableCell>

                                        <CRMTableCell
                                        >
                                        </CRMTableCell>

                                    </TableRow >

                                    <TableRow sx={{height:'110px'}} >
                                        <CRMTableCell sx={{ backgroundColor: '#e6e6e6 !important' }}
                                        > {'Recommendation'}
                                        </CRMTableCell>

                                        <CRMTableCell
                                        >
                                        </CRMTableCell>

                                    </TableRow >
                                </TableBody>
                            </Table>

                        </JumboScrollbar>
                    </Div>
                </Grid> */}
            </Grid>
        </JumboContentLayoutMain>
    )
}

export default SimpleMonthlySalesReport
