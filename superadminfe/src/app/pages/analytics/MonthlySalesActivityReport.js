import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import { Table, TableBody, TableHead, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CRMTableHead, ComponentHeading, DisplayFlex, FontStyle } from '../widgets/CRMStyles'
import { DataGrid } from 'devextreme-react'
import { Column } from 'devextreme-react/cjs/data-grid'
import Div from '@jumbo/shared/Div'
import JumboScrollbar from '@jumbo/components/JumboScrollbar'
import { CRMTableCell, CRMTableRow } from '../widgets/CRMTable'
import axios from 'axios'
import { BASE_URL } from 'app/services/auth-services'



function MonthlySalesActivityReport() {

    const [datas, setDatas] = useState([]);

    const token = localStorage.getItem("accesstoken");
    const DBName = "crmuseradmin1";
    const getDatas = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user/SalesUsersList/?id=${localStorage.getItem("UserId")}`,
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
        if (Object.keys(response.data?.results).length > 0) {
          setDatas(response.data?.results || []);
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };
  
    useEffect(() => {
      getDatas();
    }, []);





    const data = [
        { client: 'Johns HVAC', date: '12/06/2027', quarter: 'Q1', month: 'Feb', year: '2027', sales: '5000.00', projected: '4599.00', cost: '5432.00', revenue: '7363.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: 'Q1', month: 'Feb', year: '2027', sales: '5000.00', projected: '4599.00', cost: '5432.00', revenue: '7363.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: 'Q1', month: 'Feb', year: '2027', sales: '5000.00', projected: '4599.00', cost: '5432.00', revenue: '7363.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: 'Q1', month: 'Feb', year: '2027', sales: '5000.00', projected: '4599.00', cost: '5432.00', revenue: '7363.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
        { client: 'Johns HVAC', date: '12/06/2027', quarter: '', month: '-', year: '2027', sales: '', projected: '', cost: '', revenue: '0.00' },
    ]


    return (
        <JumboContentLayoutMain>
            <Typography sx={[ComponentHeading, { mb: 1, fontWeight: 600, fontSize: "13px" }]}>Monthly Sales Activity Report Template</Typography>
            <Div>

                <JumboScrollbar
                    autoHeight={true}
                    autoHideTimeout={4000}
                    autoHeightMin={400}
                    autoHide={true}
                    hideTracksWhenNotNeeded
                    id="no-more-tables"
                >
                    <Table className="table" sx={{ mt: 2, minWidth: { xs: "auto", sm: 1000 } }}>
                        <TableHead sx={[CRMTableHead, FontStyle]}  >
                            <CRMTableRow>
                                <CRMTableCell sx={{ cursor: "pointer", }}>CLIENT / COMPANY</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>DATE OF SALE</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>QUARTER</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>MONTH</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>YEAR</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>SALES</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>PROJECTED</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>COST</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>REVENUE</CRMTableCell>
                            </CRMTableRow>
                        </TableHead>
                        <TableBody className="table-body" sx={{ mt: 2 }}>
                            {data && data?.map((data, index) => {
                                // console.log("data : ", data);
                                return (
                                    <CRMTableRow >
                                        <CRMTableCell
                                            data-title="CLIENT / COMPANY" > {data?.client}
                                        </CRMTableCell>
                                        <CRMTableCell data-title="DATE OF SALE" onClick={() => { }}>{data?.date}</CRMTableCell>

                                        <CRMTableCell
                                            data-title="QUARTER" >{data?.quarter}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="MONTH">{data?.month}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="YEAR">{data?.year}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="SALES">{data?.sales}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="PROJECTED">{data?.projected}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="COST">{data?.cost}</CRMTableCell>
                                        <CRMTableCell
                                            data-title="REVENUE">{data?.revenue}</CRMTableCell>
                                    </CRMTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                </JumboScrollbar>

                <Div sx={[DisplayFlex, { justifyContent: 'right' }]} id="no-more-tables">
                    <Table className="" sx={{ mt: 4, width: '40%', minWidth: { xs: "auto", sm: 600 } }} stickyHeader>
                        <TableHead sx={[CRMTableHead, FontStyle]}  >
                            <CRMTableRow>
                                <CRMTableCell sx={{ cursor: "pointer", }}>SALES TOTAL</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>PROJECTED TOTAL</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>COST TOTAL</CRMTableCell>
                                <CRMTableCell sx={{ cursor: "pointer", }}>REVENUE TOTAL</CRMTableCell>
                            </CRMTableRow>
                        </TableHead>
                        <TableBody className="table-body" sx={{ mt: 2 }}>

                            <CRMTableRow >
                                <CRMTableCell sx={{}}
                                    data-title="SALES TOTAL">{parseFloat(5000) * 4}.00</CRMTableCell>
                                <CRMTableCell sx={{}}
                                    data-title="PROJECTED TOTAL">{parseFloat(4599 * 4)}.00</CRMTableCell>
                                <CRMTableCell sx={{}}
                                    data-title="COST TOTAL">{parseFloat(5432     * 4)}.00</CRMTableCell>
                                <CRMTableCell sx={{}}
                                    data-title="REVENUE TOTAL">{parseFloat(7363 * 4)}.00</CRMTableCell>
                            </CRMTableRow>

                        </TableBody>
                    </Table>
                </Div>

            </Div>
        </JumboContentLayoutMain>
    )
}

export default MonthlySalesActivityReport
