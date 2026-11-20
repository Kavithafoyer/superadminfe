import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  
} from "recharts";
import Div from "@jumbo/shared/Div";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import JumboTableHeaderCard from "@jumbo/components/JumboTableHead/jumboTableHeadCard";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import { Table, TableBody, TableCell, TableContainer, TableRow, Typography ,Avatar} from "@mui/material";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { generateRandomColor ,FontStyle} from "app/pages/widgets/CRMStyles";

const TABLE_HEAD = [
      { id: "CompanyName", label: "Company Name" },
      { id: "Values", label: "Values" },   
      { id: "Stage", label: "Stage" },
    ];



const MostVarientTable = () => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [datas,setdatas]=useState([{name:"Foyer"},{name:"Foyer"},{name:"Foyer"}])

  const [lineChartData, setLineChartData] = useState([]);

  const token = localStorage.getItem("accesstoken")
  const item = "crmuseradmin1";

  // const months = [1, 2, 3, 4, 5, 6];

  const lineChart = async () => {

    const requestOption = {
      headers: {
        "db": item,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",

      },
    }
    // await axios.post(`${BASE_URL}/superadmin/AccountDashboardCRUD/`, {}, requestOption

    // )
    //   .then((res) => {
    //     setLineChartData({ ...lineChartData, non_it: res?.data[1].Non_IT || 0, it: res?.data[2].IT || 0 });
    //     console.log(res?.data[0]["Non-IT"], res?.data[2]?.IT, res?.data[1].Non_IT);

    //   })
    // console.log("Chart Values **", lineChartData);

    const response = await axios.post(`${BASE_URL}/superadmin/AccountDashboardCRUD/`, {}, requestOption)
    const collectedData = response.data;

    const processData = collectedData.map(item => ({
      non_it: item.Non_IT,
      it: item.IT,
    }));

    setLineChartData(processData);


  }

  useEffect(() => {
    lineChart();
  }, [])


  return (
    <>
      <JumboDemoCard
        wrapperSx={{ pt: 0, backgroundColor: "background.paper" }}
      >
        <ResponsiveContainer width="100%" height={276}>
        <TableContainer >
              <JumboScrollbar
                autoHeight={true}
                autoHeightMin={200}
                autoHideTimeOut={200}
              >
                <Table className="table">
                  <JumboTableHeaderCard
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                  />

                 

<TableBody className="table-body">
  {datas
    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row, index) => (
      <CRMTableRow
      key={index}
     
      tabIndex={-1}
      role="checkbox"
      >
        <CRMTableCell sx={{ padding: "10px !important" }} align="left">
        <Div
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap:'5px'
                            }}
                          >
                            <Avatar
                              sx={[FontStyle, {
                                bgcolor: generateRandomColor(),
                                width: "22px",
                                height: "22px",
                              }]}
                            >
                              FT
                              {/* {data?.Name[1]?.toUpperCase()} */}
                            </Avatar>
                            <Typography id="Typography-root" 
                              color="#0040ff !important"
                              sx={[FontStyle, {}]}
                            >
                              
                             FoyerTech
                              {/* <span style={{ color: "#475259" }}>Tech Wire</span> */}
                            </Typography>
                          </Div>
        </CRMTableCell>
        <CRMTableCell sx={{ padding: "10px !important" }} align="left">
          <Typography id="Typography-root" >60</Typography>
        </CRMTableCell>
        <CRMTableCell sx={{ padding: "10px !important" }} align="left">
          <Typography id="Typography-root" >High</Typography>
        </CRMTableCell>
      </CRMTableRow>
    ))}
</TableBody>

                  
                </Table>
              </JumboScrollbar>
            </TableContainer>
        </ResponsiveContainer>
       
      </JumboDemoCard>
    </>
  )
}

export default MostVarientTable;
