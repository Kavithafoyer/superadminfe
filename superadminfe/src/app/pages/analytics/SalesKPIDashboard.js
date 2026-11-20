import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import Div from '@jumbo/shared/Div'
import { Divider, Grid, Typography, alpha } from '@mui/material'
import {
    Autocomplete,
    FormControl,
    TextField,
} from "@mui/material";
// import {input_label } from "../widgets/CRMStyles";
import React, { useEffect, useState } from 'react'
import { ImTarget } from "react-icons/im";
import { DisplayFlex, input_label } from '../widgets/CRMStyles';
import { ComponentHeading } from "../widgets/CRMStyles";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import ColumnBarChart from './Bars/ColumnBarChart';
import axios from 'axios';
import { BASE_URL } from 'app/services/auth-services';
import { AutoHeight } from 'app/redux/auth/localStorage';
import moment from "moment";
import { useQuery } from "react-query";

function SalesKPIDashboard() {

    let startDate = moment().startOf('year');
    let endDate = moment().endOf('year');

    let ThisWeekStart = startDate?.format('YYYY-MM-DD');
    let ThisWeekEnd = endDate?.format('YYYY-MM-DD');

    // const { width, height } = useDrawingArea();
    const [selectedteritories, setSelectedteritories] = useState("");
    const [teritoriesList, setTeritoriesList] = useState([]);

    const [datas, setDatas] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('This Year');
    const [selectedDate, setSelectedDate] = useState(ThisWeekStart);
    const [customDate, setCustomDate] = useState(false);
    const [currentDate, setCurrentDate] = useState(ThisWeekEnd);
    const [getSalesperson_name, setgetSalesperson_name] = useState("all")
    const [userNameLists, setUserNameLists] = useState([]);
    const [salesperson_id, setSalesperson_id] = useState(0);
    const [rangeBar, setRangeBar] = useState([]);

    const dataSource = [
        { color: "#588157", value: 1300, label: "Team" },
        { color: "#fb5607", value: 1100, label: "Lauren Rogers" },
        { color: "#ffba08", value: 1020, label: "Lola Rogers" },
        { color: "#0077b6", value: 1560, label: "Caroline Chromik" },
        { color: "#ff758f", value: 1280, label: "Care Bear" },
    ].reverse();

    // get Datas
    const token = localStorage.getItem("accesstoken");

    const header = {
        headers: {
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
        setSelectedDate(null);
        setCurrentDate("");


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

    const getSalesKPIAndChurnDashboard = async () => {
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
                const response = await axios.post(`${BASE_URL}/user/AnalysticSalesKPIAndChurnDashboard/`, payload, header)
                const responseData = response.data;

                console.log("KPi Dashboard response:", response);

                // Check if responseData is an object
                if (responseData && typeof responseData === 'object') {
                    // Check for expected properties
                    const hasRequiredData = responseData.churn_revenue && responseData.cross_selling && responseData.paid && responseData.unpaid;

                    if (hasRequiredData) {
                        setDatas(responseData);
                    } else {
                        console.error('Response data is missing required properties.');
                    }
                } else {
                    console.error('Invalid response format.');
                }

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
        getSalesKPIAndChurnDashboard();
    }, [selectedDate, currentDate, userNameLists, salesperson_id]);
   

    return (
        <JumboContentLayoutMain>
            <Div sx={{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 } }}>

                <Typography sx={[ComponentHeading, { mb: 2 }]}>
                    Sales KPI Dashboard
                </Typography>

                <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>

                    <Grid item className="col-12 col-md-6">
                        <Typography className="col-12 input-label">
                            Choose a Period<span className="required">*</span>
                        </Typography>

                        <Autocomplete
                            className="col-12 search-select"
                            value={selectedPeriod}
                            options={periodOptions}
                            onChange={(e, newValue) => handlePeriodChange(e, newValue)}
                            renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
                        />
                    </Grid>


                    <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                        <Typography className="col-6 input-label">
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
                        <Typography className="col-6 input-label">
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
                        <Typography className="col-12 input-label">
                            Choose Sales Person<span className="required">*</span>
                        </Typography>
                        <Autocomplete
                            className="col-12 search-select"
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

                <Grid container spacing={2} >
                    <Grid item container gap={1} xs={12} md={6}>
                        <Div className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", width:'100%',textAlign:'center' }]} >
                            <Typography sx={{ fontSize: '14px',fontWeight:'600' }} >NUMBER OF SALES</Typography>
                            <Typography sx={{ fontSize: '20px', color: "#137547", my: 2, fontWeight: 600 }} >{datas?.paid?.total_invoices + datas?.unpaid?.total_invoices || 0}</Typography>

                        </Div>
                    </Grid>

                    <Grid item container gap={1} xs={12} md={6}>
                        <Div className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", width:'100%',textAlign:'center' }]} >
                            <Typography sx={{ fontSize: '14px',fontWeight:'600' }} >REVENUE</Typography>
                            <Typography sx={{ fontSize: '20px', color: "#137547", my: 2, fontWeight: 600 }} >₹ {datas?.paid?.total_amount || 0}</Typography>
                        </Div>
                    </Grid>


                    <Grid item container gap={1} xs={12} md={12}>
                        <Div className='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", width:'100%',textAlign:'center'}]} >
                            <Typography sx={{ fontSize: '14px', mb: 2,fontWeight:'600' }} >SALES REVENUE</Typography>

                            <ColumnBarChart
                                height={AutoHeight(2.3)}
                                labelShow={true}
                                legend={true}
                                barType="area"
                                color={['#4cc9f0', "#4c956c"]}
                                barData={datas?.paid?.date_wise_amounts}
                                label="date"
                                customLegendName={['Total']}
                                barLength={['total']}
                                barWidth={35}
                            />
                        </Div>
                    </Grid>

                    <Grid item container gap={1} xs={12} md={6}>
                        <Div id='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",width:'100%' }]} >
                            <Typography sx={{ fontSize: '14px', mb: 2,fontWeight:'600',backgroundColor:'#edf2fa',padding:'7px' }} >UP/CROSS SELL</Typography>
                            <Div sx={[DisplayFlex, { justifyContent: 'space-between',borderBottom:'1px dashed #afbbcf' }]}>
                                <Typography >Revenue</Typography>
                                <Typography sx={{ color: "#4c956c" }}>₹ {datas?.cross_selling?.total_invoice_amount || 0}</Typography>
                            </Div>

                            <Div sx={[DisplayFlex, { justifyContent: 'space-between', my: 1,borderBottom:'1px dashed #afbbcf' }]}>
                                <Typography >% of Revenue</Typography>
                                <Typography sx={{ color: "#4c956c" }}>{datas?.cross_selling?.revenue_percentage || '0%'}</Typography>
                            </Div>
                            <Divider />




                        </Div>
                    </Grid>

                    <Grid item container gap={1} xs={12} md={6}>
                        <Div id='card' sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 }, boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",width:'100%' }]} >
                            {/* <Typography sx={{ fontSize: '14px', mb: 2 }} >ACCUMULATED REVENUE</Typography>
                        <ColumnBarChart
                            labelShow={false}
                            legend={false}
                            barType='rangebar'
                            color={['#4c956c', "#4c956c"]}
                            barData={rangeBar}
                            barWidth={25}
                            height={230}
                        /> */}
                            <Typography sx={{ fontSize: '14px', my: 2,fontWeight:'600',backgroundColor:'#edf2fa',padding:'7px' }} >CHURN</Typography>

                            <Div sx={[DisplayFlex, { justifyContent: 'space-between', my: 1,borderBottom:'1px dashed #afbbcf' }]}>
                                <Typography >Total</Typography>
                                <Typography sx={{ color: "#4c956c" }}>{datas?.cross_selling?.total_invoice_amount || 0}</Typography>
                            </Div>  

                            <Div sx={[DisplayFlex, { justifyContent: 'space-between', my: 1,borderBottom:'1px dashed #afbbcf' }]}>
                                <Typography >Rate</Typography>
                                <Typography sx={{ color: "#4c956c" }}>{datas?.churn_revenue?.churn_revenue_percentage || "0%"}</Typography>
                            </Div>

                            <Div sx={[DisplayFlex, { justifyContent: 'space-between',borderBottom:'1px dashed #afbbcf' }]}>
                                <Typography >% of Revenue</Typography>
                                <Typography sx={{ color: "#4c956c" }}>₹ {datas?.churn_revenue?.total_churn_revenue || 0}</Typography>
                            </Div>

                        </Div>
                    </Grid>
                    </Grid>
                    <br/>
            </Div >
            <br/>


        </JumboContentLayoutMain>
    )
}

export default SalesKPIDashboard
