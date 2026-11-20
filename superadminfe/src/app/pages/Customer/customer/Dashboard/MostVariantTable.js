import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { Table, TableBody, TableHead } from '@mui/material';
import { CRMTableHead } from 'app/pages/widgets/CRMStyles';
import { CRMTableCell, CRMTableRow } from 'app/pages/widgets/CRMTable';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BASE_URL } from 'app/services/auth-services';
import { useQuery } from 'react-query';


const columns = ['Customer Name', 'Industry', 'Company Name'];

const MostVariantTable = ({ mostVariantinitial }) => {
  const token = localStorage.getItem("accesstoken")
  const item = "crmuseradmin1";

  let condition = mostVariantinitial?.some(item => item)

  const FetchData = async () => {
    if (!condition) return
    console.log("condition api calling...")

    try {
      const response = await axios.get(`${BASE_URL}/superadmin/AccountdashboardNew/`, {
        headers: {
          "db": item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      });
      const list = response?.data?.MostVarients;
      console.log("list1234", list);
      return list
    } catch (error) {
      console.log("err", error);
    }
  };


  const { data: customers, isLoading: customersLoading, isError: customersError } = useQuery(
    ['customers', condition],
    FetchData,
    { staleTime: Infinity, enabled: condition }
  );

  if (customersLoading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>

  return (
    <JumboScrollbar
      autoHeight={true}
      autoHideTimeout={4000}
      autoHeightMin={329}
      autoHide={true}
      hideTracksWhenNotNeeded
      id="no-more-tables"
    >
      <Table stickyHeader>
        <TableHead sx={[CRMTableHead]}>
          <CRMTableRow>
            {columns?.map((column, idx) => <CRMTableCell key={idx}>{column}</CRMTableCell>)}
          </CRMTableRow>
        </TableHead>
        <TableBody>
          {condition && customers.length > 0 ? customers?.map((customer, idx) => {
            return (
              <CRMTableRow key={idx}>
                <CRMTableCell >{customer?.Contact_Name}</CRMTableCell>
                <CRMTableCell >{customer?.Industry}</CRMTableCell>
                <CRMTableCell >{customer?.Organization_Name}</CRMTableCell>
              </CRMTableRow>
            )
          }) :
            <CRMTableRow colSpan={3}>
              <CRMTableCell >Loading...</CRMTableCell>
            </CRMTableRow>
          }
        </TableBody>
      </Table>
    </JumboScrollbar>
  );
};

export default MostVariantTable