import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import JumboScrollbar from '@jumbo/components/JumboScrollbar'
import Div from '@jumbo/shared/Div'
import {
    Autocomplete, Card, Grid, TextField, Typography, Table,
    TableBody, TableHead
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CRMTableHead, ComponentHeading, DisplayFlex, FontStyle, input_label } from '../widgets/CRMStyles'
import { CRMTableCell, CRMTableRow } from '../widgets/CRMTable'
import ReactApexChart from 'react-apexcharts'
import ColumnBarChart from './Bars/ColumnBarChart'
import axios from 'axios'
import { BASE_URL } from 'app/services/auth-services'

import PieChart, {
    Legend,
    Series,
    Export,
    Label,
    SmallValuesGrouping,
    Connector,
} from 'devextreme-react/pie-chart';
import moment from "moment";
import { useQuery } from "react-query";


function customizeLabel(point) {
    return `${point.argumentText}: ${point.valueText}%`;
}

function MonthlyRetailSales() {

    let startDate = moment().startOf('year');
    let endDate = moment().endOf('year');

    let ThisWeekStart = startDate?.format('YYYY-MM-DD');
    let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

    const [datas, setDatas] = useState([]);
    const [dealDatas, setDealDatas] = useState([]);
    const [outboundCalls, setOutboundCalls] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('This Year');
    const token = localStorage.getItem("accesstoken");
    const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
    const [fromDate, setfromDate] = useState("");
    const [toDate, settoDate] = useState("");
    const [customDate, setCustomDate] = useState(false);
    const [currentDate, setCurrentDate] = useState(ThisWeekEnd);
    const [getSalesperson_name, setgetSalesperson_name] = useState("all")
    const [userNameLists, setUserNameLists] = useState([]);
    const [salesperson_id, setSalesperson_id] = useState(0);

    const [columnMenuItems, setColumnMenuItems] = useState([
        { sort: "Sales Person", label: "Sales Person", bool: true },
        { sort: "Activity Type", label: "Activity Type", bool: true },
        { sort: "No of activities", label: "No of activities", bool: true },
    ]);



    const DBName = "crmuseradmin1";
    const header = {
        headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }



    const periodOptions = [
        'Previous Week',
        'Previous Month',
        'Previous Quarter',
        'Previous Year',
        'This Week',
        'This Month',
        'This Quarter',
        'This Year',
        'Last One Year',
        'Last Six Month',
        'Last Three Month',
        'Custom Date',
    ];

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let TodayDate = `${year}-${month < 10 ? "0" + month : month}-${day}`;
    let piechartTitle = `Sales by Customer between ${selectedDate} & ${currentDate}`



    const handlePeriodChange = (e, newValue) => {
        // e.preventDefault
        console.log("handlePeriodChange newValue:", newValue);
        setSelectedPeriod(newValue);
        setSelectedDate(" ");
        setCurrentDate(" ");
        let date;

        let startDate; // for previous
        let endDate;

        switch (newValue) {

            case 'This Week':

                startDate = moment().startOf('week');
                endDate = moment().endOf('week');

                let ThisWeekStart = startDate?.format('YYYY-MM-DD');
                let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(ThisWeekStart);
                setCurrentDate(ThisWeekEnd);

                setCustomDate(false);
                return;

            case 'This Month':

                startDate = moment().startOf('month');
                endDate = moment().endOf('month');

                let ThisMonthStart = startDate?.format('YYYY-MM-DD');
                let ThisMonthEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(ThisMonthStart);
                setCurrentDate(ThisMonthEnd);

                setCustomDate(false);
                return;

            case 'This Quarter':
                startDate = moment().startOf('quarter');
                endDate = moment().endOf('quarter');

                let ThisQuarterStart = startDate?.format('YYYY-MM-DD');
                let ThisQuarterEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(ThisQuarterStart);
                setCurrentDate(ThisQuarterEnd);

                setCustomDate(false);
                return;

            case 'This Year':
                startDate = moment().startOf('year');
                endDate = moment().endOf('year');

                let ThisYearStart = startDate?.format('YYYY-MM-DD');
                let ThisYearEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(ThisYearStart);
                setCurrentDate(ThisYearEnd);

                setCustomDate(false);
                return;

            case 'Previous Week':
                startDate = moment().subtract(1, 'week').startOf('week');
                endDate = moment().subtract(1, 'week').endOf('week');

                let PrevWeekStart = startDate?.format('YYYY-MM-DD');
                let PrevWeekEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(PrevWeekStart);
                setCurrentDate(PrevWeekEnd);

                setCustomDate(false);
                return;

            case 'Previous Month':
                startDate = moment().subtract(1, 'month').startOf('month');
                endDate = moment().subtract(1, 'month').endOf('month');

                let PrevMonthStart = startDate?.format('YYYY-MM-DD');
                let PrevMonthEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(PrevMonthStart);
                setCurrentDate(PrevMonthEnd);

                setCustomDate(false);
                return;

            case 'Previous Quarter':
                startDate = moment().subtract(1, 'quarter').startOf('quarter');
                endDate = moment().subtract(1, 'quarter').endOf('quarter');

                let PrevQuarterStart = startDate?.format('YYYY-MM-DD');
                let PrevQuarterEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(PrevQuarterStart);
                setCurrentDate(PrevQuarterEnd);

                setCustomDate(false);
                return;

            case 'Previous Year':
                startDate = moment().subtract(1, 'year').startOf('year');
                endDate = moment().subtract(1, 'year').endOf('year');

                let MomentDateStart = startDate?.format('YYYY-MM-DD');
                let MomentDateEnd = endDate?.format('YYYY-MM-DD');

                setSelectedDate(MomentDateStart);
                setCurrentDate(MomentDateEnd);

                setCustomDate(false);
                return;

            case 'Last One Year':
                date = moment().subtract(1, 'year');
                setCustomDate(false);
                break;

            case 'Last Six Month':
                date = moment().subtract(6, 'months');
                setCustomDate(false);
                break;

            case 'Last Three Month':
                date = moment().subtract(3, 'months');
                setCustomDate(false);
                break;

            case 'Custom Date':
                setCustomDate(true);
                break;
            default:
                date = null;
        }
        let MomentDate = date?.format('YYYY-MM-DD');
        setSelectedDate(MomentDate);
        setCurrentDate(TodayDate)
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getAnalysticMonthlyRetailSales = async () => {
        try {
            if (
                currentDate !== "" && currentDate !== undefined && currentDate !== null
            ) {
                let payload = {
                    Is_Deleted: false,
                    fromdate: selectedDate,
                    todate: currentDate,
                    userid: salesperson_id === 0 ? 'all' : salesperson_id
                }
                const response = await axios.post(`${BASE_URL}/user/AnalysticMonthlyRetailSales/`, payload, header)

                console.log("response AnalysticMonthlyRetailSales:", response);
                setDatas(response?.data || []);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/useradmin/UsersList/`, header);
            console.log("Users List", response.data);
            return response?.data
        } catch (error) {
            console.log("Error in getting user list", error);
        }
    };

    const { data: getTerUserLists, isLoading: getTerUserListsLoading, isError: getTerUserListsError, refetch: getTerUserListsRefetch } = useQuery(
        ['getTerUserLists'],
        fetchUserData, // Assuming 1 as the initial page number
        { staleTime: Infinity }
    );


    useEffect(() => {
        if (getTerUserLists) {
            // let listdata = [...userNameLists]
            let listdata = [{ 'username': 'all', 'id': 0 }]
            getTerUserLists?.map((opt) => {
                listdata.push({
                    id: opt?.id,
                    username: opt?.username
                })
            })
            setUserNameLists(listdata);
        }

    }, [getTerUserLists]);

    useEffect(() => {
        const fetchData = async () => {
            await getAnalysticMonthlyRetailSales();
        };
        fetchData();
    }, [selectedDate, currentDate, userNameLists, salesperson_id]);





    return (
        <JumboContentLayoutMain>
            <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>
                <Typography sx={[ComponentHeading, { mb: 0.5, fontWeight: 600, fontSize: "13px" }]}>Sales By Product</Typography>

                <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

                    <Grid item className="col-12 col-md-6">
                        <Typography sx={[input_label]}>
                            Choose a Period<span className="required">*</span>
                        </Typography>

                        <Autocomplete
                            className="search-select3"
                            value={selectedPeriod}
                            options={periodOptions}
                            onChange={(e, newValue) => handlePeriodChange(e, newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
                        />
                    </Grid>


                    <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                        <Typography sx={[input_label]}>
                            From<span className="required">*</span>
                        </Typography>

                        <TextField
                            type={"date"}
                            className="col-12 search-select"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                        <Typography sx={[input_label]}>
                            To
                        </Typography>

                        <TextField
                            type={"date"}
                            className="col-12 search-select"
                            value={currentDate}
                            onChange={(e) => setCurrentDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item className="col-12 col-md-6">
                        <Typography sx={[input_label]}>
                            Choose Sales Person<span className="required">*</span>
                        </Typography>
                        <Autocomplete
                            className="search-select3"
                            options={userNameLists}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                if (option && option?.username) {
                                    return option?.username;
                                }
                                return "";
                            }}
                            value={getSalesperson_name}
                            onChange={(e, newValue) => {
                                setgetSalesperson_name(newValue?.username);
                                setSalesperson_id(newValue?.id);
                            }}
                            renderInput={(params) => <TextField {...params} placeholder="Choose Rep" />}
                        />
                    </Grid>
                </Grid>
                <br/>

                <Grid container spacing={2}>

                    <Grid item xs={12} md={6}>
                        <Div id='card' sx={[{ p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"}]} >
                            <JumboScrollbar
                                autoHeight={true}
                                autoHideTimeout={4000}
                                autoHeightMin={250}
                                autoHide={true}
                                hideTracksWhenNotNeeded
                                id="no-more-tables"
                            >
                                <Table className="table" stickyHeader sx={{ minWidth: { xs: "auto", sm: 800 } }}>
                                    <TableHead sx={[CRMTableHead, FontStyle]}  >
                                        <CRMTableRow sx={{ backgroundColor: '#e2f1ff !important' }}>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important',  }}>PRODUCT NAME</CRMTableCell>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>UOM</CRMTableCell>
                                            <CRMTableCell sx={  { cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>UNITS SOLD</CRMTableCell>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>SALES TOTAL</CRMTableCell>
                                        </CRMTableRow>
                                    </TableHead>
                                    <TableBody className="table-body" sx={{ mt: 2 }}>
                                        {datas && datas?.SalesByProduct?.map((data, index) => {
                                            console.log("SalesByProduct data in Table : ", data);
                                            return (
                                                <CRMTableRow  >
                                                    <CRMTableCell
                                                        data-title="PRODUCT NAME" > {data?.Product_Name}
                                                    </CRMTableCell>

                                                    <CRMTableCell align='center'
                                                        data-title="UOM" >{data?.UOM}
                                                    </CRMTableCell>

                                                    <CRMTableCell align='center'
                                                        data-title="UNITS SOLD" >{data?.Total_Quantity}
                                                    </CRMTableCell>

                                                    <CRMTableCell
                                                        data-title="SALES TOTAL" >{data?.Total_Final_Price}
                                                    </CRMTableCell>

                                                </CRMTableRow>
                                            )
                                        })}
                                        <CRMTableRow  >
                                            <CRMTableCell
                                                data-title="PRODUCT NAME" > { }
                                            </CRMTableCell>
                                            <CRMTableCell
                                                data-title="UOM" > { }
                                            </CRMTableCell>
                                            <CRMTableCell
                                                data-title="UNITS SOLD" >{ }</CRMTableCell>
                                            <CRMTableCell
                                                data-title="SALES TOTAL">{ }</CRMTableCell>

                                        </CRMTableRow>
                                    </TableBody>
                                </Table>

                            </JumboScrollbar>
                        </Div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Div id='card' sx={[{ minHeight: { md: '330px' }, p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"}]} >

                        <Typography sx={[ComponentHeading, { mb: 0.5, fontWeight: 600, }]}>Monthly Retail Sales Summary Report Template</Typography>

                            <Div sx={{ mt: 2 }}>
                                <Typography sx={[{ mb: 1, fontWeight: 400, fontSize: "12px", color: 'green' }]}>SUMMARY REPORT</Typography>
                                <Table className="table" id="no-more-tables" sx={{ minWidth: { xs: "auto", sm: 800 } }}>
                                    <TableHead sx={[CRMTableHead, FontStyle]}  >
                                        <CRMTableRow sx={{ backgroundColor: '#f5ee9e !important' }}>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important', }}>TOTAL SALES AMOUNT</CRMTableCell>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>TOTAL CUSTOMER ORDERS</CRMTableCell>
                                            <CRMTableCell sx={{ cursor: "pointer", fontSize: '10px !important', fontWeight: '600 !important' }}>TOTAL PRODUCTS SOLD</CRMTableCell>
                                        </CRMTableRow>
                                    </TableHead>
                                    <TableBody className="table-body">
                                        <CRMTableRow  >
                                            <CRMTableCell
                                                data-title="PRODUCT NAME" > {datas?.TotalSalesAmount}
                                            </CRMTableCell>

                                            <CRMTableCell align='center'
                                                data-title="UNITS SOLD" >{datas?.TotalCustomers}</CRMTableCell>
                                            <CRMTableCell align='center'
                                                data-title="SALES TOTAL">{datas?.UniqueProductNamesCount}</CRMTableCell>

                                        </CRMTableRow>
                                    </TableBody>
                                </Table>
                            </Div>
                        </Div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                <Div id='card' sx={[{ minHeight: '300px', p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"}]} >
                    <Div sx={[DisplayFlex, { justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }]} >
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', mb: 2 }}>
                            {piechartTitle}
                        </Typography>
                        <PieChart
                            id="pie"
                            type="doughnut"
                            dataSource={datas?.SalesByProduct}
                            width={Autocomplete} // Adjust height as needed
                        >
                            <Series
                                argumentField="Product_Name"
                                valueField="Total_Quantity"
                                colorField="color" // Assumes you have a color field
                            >
                                <SmallValuesGrouping
                                    mode="topN"
                                    topCount={5} // Display top 5 categories
                                />
                                <Label
                                    visible={true}
                                    format="fixedPoint"
                                    customizeText={customizeLabel}
                                    font={{ size: 14, color: '#000' }} // Customize font size and color
                                    backgroundColor="#fff" // Background color for labels
                                >
                                    <Connector
                                        visible={true}
                                        width={2} // Adjust connector width
                                    />
                                </Label>
                            </Series>
                            <Export enabled={true} />
                            <Legend
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                itemTextOverflow="ellipsis"
                                font={{ size: 12, color: '#666' }} // Customize legend font size and color
                            />
                        </PieChart>
                    </Div>
                </Div>
            </Grid>
                    <Grid item xs={12} md={6}>
                        <Div id='card' sx={[{ minHeight: '300px', p: 1, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"}]} >
                            <Div>
                                {/* <ColumnBarChart
                                labelShow={false}
                                rotated={true}
                                barData={datas2}
                                height={270}
                            /> */}
                            </Div>
                        </Div>
                    </Grid>

                </Grid>
            </Div>

        </JumboContentLayoutMain >

    )
}

export default MonthlyRetailSales
