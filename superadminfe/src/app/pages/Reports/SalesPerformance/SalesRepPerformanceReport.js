import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Autocomplete,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {
  Colors,
  ComponentHeading,
  DisplayFlex,
  FontStyle,
  TableHeaderType,
} from "app/pages/widgets/CRMStyles";
import moment from "moment";
import { useQuery } from "react-query";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { LoadingFullPageSkel } from "app/pages/widgets/StylesComponents";
import {
  loadingfullpage,
  setLoadingFullPageFunc,
} from "app/redux/auth/Loadingskeleton";
import { AutoHeight } from "app/redux/auth/localStorage";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';


function SalesRepPerformanceReport() {

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const [datas, setDatas] = useState([]);
  const [period, setPeriod] = useState("");
  const dispatch = useDispatch();
  const [monthData, setMonthData] = useState([]);

  const [userNameLists, setUserNameLists] = useState([]);

  const [getSalesperson_name, setgetSalesperson_name] = useState("")
  const [companyname, setcompanyname] = useState("")
  const [currentDate, setCurrentDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);

  const [current, setCurrent] = useState(true);
  const [printPDFForm, setprintPDFForm] = useState(false);
  const [PdfButton, setPdfButton] = useState(false);
  const [ExcelButton, setExcelButton] = useState(false);

  const [printPageState, setPrintPageState] = useState(false);
  const [gearbox, setgearbox] = useState(true);
  const [status, setStatus] = useState(false);



  const showPdfForm = () => {
    setCurrent(false);
    setprintPDFForm(true);
    setStatus(true);
    setgearbox(false);
    setPrintPageState(true)
    setPdfButton(true);
    setExcelButton(false);
  };

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

  const handlePeriodChange = (event, newValue) => {
    setSelectedPeriod(newValue);
    setSelectedDate(null);
    setfromDate("");
    settoDate("");

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


  const [columnMenuItems, setColumnMenuItems] = useState([]);


  const newfilter = async () => {
    try {

      if (
        selectedDate !== "" && selectedDate !== undefined && selectedDate !== null && currentDate !== ""
        && currentDate !== undefined && currentDate !== null) {


        let payload = {

          fromdate: selectedDate,
          todate: currentDate,
          Is_Deleted: false
        }

        await axios.post(`${BASE_URL}/user/SalesRepPerformanceReport/`, payload, {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss", res.data);


            setDatas(res?.data)

          })
      }

      if (
        fromDate !== "" && fromDate !== null && fromDate !== undefined &&
        toDate !== "" && toDate !== null && toDate !== undefined
      ) {
        let payload = {
          fromdate: fromDate,
          todate: toDate,
          Is_Deleted: false
        }

        await axios.post(`${BASE_URL}/user/SalesRepPerformanceReport/`, payload, {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss1", res.data);


            setDatas(res?.data)



          }).catch((error) => {
            console.log(error)
          })


      }
    } catch (error) {
      console.log(error);
    }
  }

  useMemo(() => {
    if (status) {
      setColumnMenuItems([
        { sort: "Sales_Person", label: "Sales rep name", bool: status },
        { sort: "Lead_Id", label: "Total Sales", bool: status },
        { sort: "Deal_Id", label: "No of Deals", bool: status },
        { sort: "Total_Amount", label: "Avg Deal Size", bool: status },
        { sort: "Net_Amount", label: "Win Rate", bool: status },
        { sort: "Sales Target", label: "Sales Target", bool: status },
        { sort: "% of Target Achieved", label: "% of Target Achieved", bool: status },
        { sort: "Pipeline Value", label: "Pipeline Value", bool: status },
        { sort: "Pipeline Con Rate", label: "Pipeline Con Rate", bool: status },
      ])
    } else {
      setColumnMenuItems([
        { sort: "Sales_Person", label: "Sales rep name", bool: true },
        { sort: "Lead_Id", label: "Total Sales", bool: true },
        { sort: "Deal_Id", label: "No of Deals", bool: true },
        { sort: "Total_Amount", label: "Avg Deal Size", bool: false },
        { sort: "Net_Amount", label: "Win Rate", bool: true },
        { sort: "Sales Target", label: "Sales Target", bool: true },
        { sort: "% of Target Achieved", label: "% of Target Achieved", bool: true },
        { sort: "Pipeline Value", label: "Pipeline Value", bool: true },
        { sort: "Pipeline Con Rate", label: "Pipeline Con Rate", bool: false },
      ])
    }
  }, [status])

  //print excel

  function ExportToExcel(type) {
    var elt = document.getElementById('tbl_exporttable_to_xls');
    var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
    XLSX.writeFile(wb, "MyFileName." + type || ('MySheetName.' + (type || 'xlsx')));
  }

  // PDF Print
  const componentPDF = useRef();

  // Function to handle actions after printing
  const handleAfterPrint = () => {
    console.log('Print completed!');
    setStatus(false);
    setgearbox(true);
    setPrintPageState(false);
  };

  const SaveAsPDF = useReactToPrint({
    content: () => componentPDF?.current,
    documentTitle: 'user data',
    pageStyle: `
@page {
  size: landscape;
}
`,
    // onBeforePrint:hanldeRemovePrinter,
    onAfterPrint: handleAfterPrint, // Action after printing
    onPrintError: (error) => console.log("error", error),
  });

  useEffect(() => {
    if (printPageState) {
      // Delay SaveAsPDF until printPageState is true
      SaveAsPDF();
    }
  }, [printPageState]);

  useEffect(() => {
    const fetchData = async () => {
      await newfilter();
      await newfilter();
    };
    fetchData();
  }, [selectedDate, fromDate, toDate]);





  return (
    <JumboContentLayoutMain>
      {/* {loading === "loading" && 
          <LoadingFullPageSkel />} */}
      <Div >
        <Div
          sx={[
            DisplayFlex,
            { justifyContent: "space-between", flexWrap: "wrap" },
          ]}
        >
          <Typography sx={[ComponentHeading, {}]}>
            Sales Rep Performance Report
          </Typography>
        </Div>

        <Div sx={{ mt: 2, mb: { xs: 3, md: 1 } }}>
          <Grid container columnSpacing={2} xs={12}>
            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>


              <Grid item className="col-12 col-md-6">
                <Typography className="col-12 input-label">
                  Choose a Period<span className="required">*</span>
                </Typography>
                <Autocomplete
                  className="col-12 search-select"
                  value={selectedPeriod}
                  options={periodOptions}
                  onChange={handlePeriodChange}
                  renderInput={(params) => <TextField {...params} placeholder="Choose a Period" />}
                />
              </Grid>
            </Grid>


            <Grid container columnSpacing={2} item xs={12} md={12} lg={6}>


              <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                <Typography className="col-6 input-label">
                  From<span className="required">*</span>
                </Typography>
                <TextField
                  type={"date"}
                  className="col-12 search-select"
                  value={fromDate}
                  onChange={(e) => setfromDate(e.target.value)}
                />
              </Grid>

              <Grid item className="col-6 col-md-3" style={{ display: customDate ? "block" : "none" }}>
                <Typography className="col-6 input-label">
                  To
                </Typography>
                <TextField
                  type={"date"}
                  className="col-12 search-select"
                  value={toDate}
                  onChange={(e) => settoDate(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
        </Div>

        <div style={{ margin: "1rem 0rem" }}>
          <TableContainer>
            <JumboScrollbar
              autoHeight={true}
              autoHideTimeout={4000}
              autoHeightMin={AutoHeight(2)}
              autoHide={true}
              hideTracksWhenNotNeeded
              id="no-more-tables"
            >
              <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
                <CustomTableHeader
                  headerMenuItems={columnMenuItems}
                  setHeadermenuItems={setColumnMenuItems}
                  setDatas={setDatas}
                  sortDatas={datas}
                  transformText={TableHeaderType}
                  showGear={gearbox}
                />

                <TableBody>
                  {datas?.length > 0 ? (
                    datas?.map((data, index) => {
                      return (
                        <CRMTableRow>
                          {columnMenuItems[0].bool && (
                            <CRMTableCell
                              data-title="Sales rep name"                              
                            >
                              {data?.Sales_Person}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[1].bool && (
                            <CRMTableCell data-title="Total Sales">
                              {data?.Total_Sales_Amount}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[2].bool && (
                            <CRMTableCell data-title="No of Deals">
                              {data?.No_Of_Deals}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[3].bool && (
                            <CRMTableCell
                              data-title="Avg Deal Size"                              
                            >
                              {data?.Average_Deal_Size}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[4].bool && (
                            <CRMTableCell data-title="Win Rate">
                              {data?.Win_Rate}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[5].bool && (
                            <CRMTableCell
                              data-title="Sales Target"                              
                            >
                              {data?.Total_Sales_Target}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[6].bool && (
                            <CRMTableCell
                              data-title="% of Target Achieved"                              
                            >
                              {data?.Percentage_of_Target_Achieved}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[7].bool && (
                            <CRMTableCell
                              data-title="Pipeline Value"                              
                            >
                              {data?.Pipline_Value}
                            </CRMTableCell>
                          )}
                          {columnMenuItems[8].bool && (
                            <CRMTableCell
                              data-title="Pipeline Con Rate"                              
                            >
                              {data?.Pipeline_Conversion_Rate}
                            </CRMTableCell>
                          )}
                        </CRMTableRow>
                      );
                    })
                  ) : (
                    <CRMTableRow>
                      <CRMTableCell
                        align="center"
                        sx={{ color: Colors?.blue }}
                        colSpan={columnMenuItems?.length + 1}
                      >
                        No Records
                      </CRMTableCell>
                    </CRMTableRow>
                  )}
                </TableBody>
              </Table>
            </JumboScrollbar>
          </TableContainer>
        </div>
      </Div>
    </JumboContentLayoutMain>
  );
}

export default SalesRepPerformanceReport;
