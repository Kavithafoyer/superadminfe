import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain';
import { Colors, ComponentHeading, DisplayFlex, TableHeaderType } from 'app/pages/widgets/CRMStyles';
import CustomTableHeader from 'app/pages/widgets/CustomTableHeader';
import { Autocomplete, Grid, Table, TableBody, TableContainer, TextField, Typography } from '@mui/material';
import { CustomScrollBar } from 'app/pages/widgets/StylesComponents';
import { CRMTableCell, CRMTableRow } from 'app/pages/widgets/CRMTable';
import Div from '@jumbo/shared/Div';

function StagedisCRMreports() {
  const [columnMenuItems, setColumnMenuItems] = useState([]);

  const [datas, setDatas] = useState([]);

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";



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

        await axios.post(`${BASE_URL}/user/StageDistributionCRMReport/`, payload, {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss", res.data);


            setDatas(res?.data?.Result)

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

        await axios.post(`${BASE_URL}/user/StageDistributionCRMReport/`, payload, {
          headers: {
            db: "crmuseradmin1",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then((res) => {
            console.log("ressss1", res.data);


            setDatas(res?.data?.Result)



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
        { sort: "", label: "Deal Stage", bool: status },
        { sort: "", label: "No of opportunity", bool: status },
        { sort: "", label: "Perc of total Opp", bool: status },
        { sort: "", label: "Total Deal Amt", bool: status },
        { sort: "", label: "SAvg Deal Amount", bool: status },
        { sort: "", label: "Won Rate", bool: status },
        { sort: "", label: "Loss Rate", bool: status },
        // { sort: "", label: "Conversion Rate", bool: status },
        // { sort: "", label: "Nxt Action", bool: status },
        // { sort: "", label: "Conversion Rate", bool: status },
        // { sort: "", label: "Time in Stage", bool: status },
        // { sort: "", label: "Opp Added", bool: status }
      ])
    } else {
      setColumnMenuItems([
        { sort: "", label: "Deal Stage", bool: true },
        { sort: "", label: "No of opportunity", bool: true },
        { sort: "", label: "Perc of total Opp", bool: true },
        { sort: "", label: "Total Deal Amt", bool: true },
        { sort: "", label: "SAvg Deal Amount", bool: false },
        { sort: "", label: "Won Rate", bool: true },
        { sort: "", label: "Loss Rate", bool: true },
      //   { sort: "", label: "Conversion Rate", bool: true },
      //   { sort: "", label: "Nxt Action", bool: false },
      //   { sort: "", label: "Conversion Rate", bool: false },
      //   { sort: "", label: "Time in Stage", bool: false },
      //   { sort: "", label: "Opp Added", bool: false }
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
      <Div >
        <Div
          sx={[
            DisplayFlex,
            { justifyContent: "space-between", flexWrap: "wrap" },
          ]}
        >
          <Typography sx={[ComponentHeading, {}]}>
            Stage Distribution CRM Report
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

              <Grid item className="col-12 col-md-6">
                <Typography className="col-12 input-label">
                  Save as
                </Typography>

                <Autocomplete
                  className="col-12 search-select"
                  options={[
                    { value: "PDF" },
                    { value: "Excel" },
                  ]}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option && option?.value) {
                      return option?.value;
                    }
                    return "";
                  }}
                  // value={stageName}
                  onChange={(e, newValue) =>
                    newValue?.value === "PDF" ?
                      showPdfForm() : ExportToExcel('xlsx')
                  }
                  renderInput={(params) => <TextField {...params} placeholder="Pdf" />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Div>

        <Div ref={componentPDF}>
          <CustomScrollBar
            stateValue={!printPageState}
            childrens={
              <div style={{ margin: "1rem 0rem" }}>
                <TableContainer>

                  <Table stickyHeader>
                    <CustomTableHeader
                      headerMenuItems={columnMenuItems}
                      setHeadermenuItems={setColumnMenuItems}
                      setDatas={setDatas}
                      sortDatas={datas}
                      transformText={TableHeaderType}
                      showGear={gearbox}
                    />

                    <TableBody>
                      {datas.length > 0 ? (
                        datas?.map((data, index) => {

                          return (
                            <CRMTableRow>
                              {columnMenuItems[0]?.bool && (
                                <CRMTableCell
                                  data-title="Prospect">
                                  {data?.Stage}
                                </CRMTableCell>
                              )}
                              {columnMenuItems[1]?.bool && (
                                <CRMTableCell data-title="Opportunity">
                                  {data?.Number_of_Opportunities}
                                </CRMTableCell>
                              )}
                              {columnMenuItems[2]?.bool && (
                                <CRMTableCell data-title="Contact Person">
                                </CRMTableCell>
                              )}
                              {columnMenuItems[3]?.bool && (
                                <CRMTableCell data-title="Contact Person">
                                </CRMTableCell>
                              )}
                              {columnMenuItems[4]?.bool && (
                                <CRMTableCell data-title="Contact Person">
                                </CRMTableCell>
                              )}
                              {columnMenuItems[5]?.bool && (
                                <CRMTableCell
                                  data-title="Deal Value"
                                >
                                  {data?.Win_Rate.toFixed(2)}
                                </CRMTableCell>
                              )}
                              {columnMenuItems[6]?.bool && (
                                <CRMTableCell data-title="Status">

                                  {data?.Loss_Rate?.toFixed(2)}
                                </CRMTableCell>
                              )}
                              {/* {columnMenuItems[5]?.bool && (
                                <CRMTableCell data-title="Comments">
                                </CRMTableCell>
                              )} */}
                            </CRMTableRow>
                          );
                        })
                      ) : (
                        <CRMTableRow>
                          <CRMTableCell
                            align="center"
                            sx={{ color: Colors?.blue }}
                            colSpan={8}
                          >
                            No Records
                          </CRMTableCell>
                        </CRMTableRow>
                      )}
                    </TableBody>
                  </Table>

                </TableContainer>
              </div>
            }
            fromDate={fromDate ? fromDate : selectedDate}
            toDate={toDate ? toDate : currentDate}
            formName={"Weekly Sales"}
          />
        </Div>


      </Div>
    </JumboContentLayoutMain>
  )
}

export default StagedisCRMreports