import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import {
  Avatar,
  Box,
  FormControl,
  Grid,
  ListItem,
  ListItemAvatar,
  Table,
  TableBody,
  TextField,
  Typography,
} from "@mui/material";
import {
  AvatarCircle,
  Customgrid,
  Div,
  SelectDropdown,
  avatarColorFun,
} from "app/pages/widgets/StylesComponents";
import { BASE_URL } from "app/services/auth-services";
import { Colors, DisplayFlex, FontStyle } from "app/pages/widgets/CRMStyles";
import { useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import SearchBar from "app/pages/widgets/SearchField";
import { useState } from "react";
import moment from "moment";
import { memo } from "react";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";

const dummyData = {
  id: 6,
  Organization_Id_id: 1,
  Contact_Id: "CON000000006",
  Name: "RaviRaj",
  File: null,
  FileName: null,
  Company_Name: "CNF Automotive Private Limited",
  MobileCountry_Id: "91",
  Mobile_Number: "9344312970",
  Email_Id: "ravikumar.r@foyertech.com",
  Country: "India",
  State: "Tamil Nadu",
  City: "Salem",
  Industry_Type: "Automobiles",
  No_of_Calls: "11",
  Last_Call_Date: "2024-04-22",
  Last_Called_By: "admin1",
  No_Of_Days: null,
  Lead_Flag: null,
  Archive: false,
  Is_Deleted: false,
  Created_By_id: 4,
  Created_Date: "2023-11-25T07:33:22.434109Z",
  Updated_By_id: 4,
  Updated_Date: "2023-11-25T07:33:22.434109Z",
  Leads: [
    {
      id: 5,
      LeadId: "QLE000000002",
      Salutation: "Mr",
      LeadFirstName: "Velu",
      File: null,
      FileName: "",
      LeadLastName: "Kumar",
      LeadType: "From Contact",
      CompanyName: "Karthoffiel",
      PhoneNo: "+919344312970",
      EmailId: "prakash.n@foyertech.com",
      WebsiteURL: "foyertech.com",
      BuildingDoorNo: 1,
      StreetName: "Oyo",
      AreaName: "Oyo",
      City: "Salem",
      State: "Tamil Nadu",
      Country: "India",
      LeadScore: 0,
      Lead_Stage: "Cool",
      Recommaned_Action: null,
      Lead_Status: "Contacted",
      LifeCycleStage: null,
      Maps: "",
      LeadDescription: "Check",
      LeadMLQStatus: false,
      LeadMLQuestions: {},
      LeadSLQStatus: false,
      LeadSLQuestions: {},
      LeadQualifyStatus: false,
      Job_Title: "",
      Job_Role: null,
      Designation: null,
      Decissionmaker: true,
      Yrs_of_Experience: null,
      LeadNoOfEmployees: 12,
      Lead_Industry: "Financial Services",
      LeadCompanyTurnOver: 1000.0,
      Head_Quarter: null,
      LeadLocation: "Chennai",
      Year_of_Founded: null,
      Organization_structure: null,
      LeadSource: "Website",
      Budget_Availability: null,
      Budget: null,
      Level_of_detail_provided: null,
      Previous_purchases: null,
      Campaign_Id: "",
      ContactId: "6",
      LeadGrowth: "Down",
      prediction: null,
      Is_Deleted: false,
      Created_Date: "2023-01-29",
      Updated_Date: "2023-01-29",
      Organization_Id: 1,
      Created_By: 4,
      Updated_By: 4,
    },
  ],
  Deal: [
    {
      id: 13,
      Deal_Id: "DEL000000001",
      Deal_Code: "",
      Deal_Name: "Contracta.com",
      Deal_Type: "Won",
      Account_Name: "Tamil",
      Lead_Name: "Velu",
      Contact_Person: "vinoth",
      Phoene: "",
      Amount: 1000,
      Deal_Owner: "Muthu",
      DealScore: 0.0,
      ApproxDealAmount: 0.0,
      ActualDealAmount: 0.0,
      MinimumTurnOver: 1000.0,
      Current_Status: "",
      Deal_Stage: "Deals Negotiation Stage",
      Lost_Reason: "",
      Lead_Source: "Website",
      Deal_Competitor: null,
      Deal_Probablity: "50",
      Probability_Id: 0,
      Next_Step: "",
      Deal_Note: "check",
      ExpClosing_Date: "2024-04-11T15:18:57.558271+05:30",
      Recommaned_Action: "",
      Prediction: "",
      Active_Flag: false,
      Is_Deleted: false,
      Created_Date: "2024-04-11",
      Updated_Date: "2024-04-11",
      Organization_Id: 1,
      Account_Id: 10,
      Lead_Id: 5,
      Created_By: 4,
      Updated_By: 4,
    },
    {
      id: 14,
      Deal_Id: "DEL000000002",
      Deal_Code: "",
      Deal_Name: "PlushDeals.com",
      Deal_Type: "Open",
      Account_Name: "udhay",
      Lead_Name: "Velu",
      Contact_Person: "prakash",
      Phoene: "",
      Amount: 5000,
      Deal_Owner: "admin1",
      DealScore: 0.0,
      ApproxDealAmount: 0.0,
      ActualDealAmount: 0.0,
      MinimumTurnOver: 2000.0,
      Current_Status: "",
      Deal_Stage: "Deals Proposal Stage",
      Lost_Reason: "",
      Lead_Source: "Website",
      Deal_Competitor: null,
      Deal_Probablity: "20",
      Probability_Id: 0,
      Next_Step: "",
      Deal_Note: "testing",
      ExpClosing_Date: "2024-04-11T15:20:25.626247+05:30",
      Recommaned_Action: "",
      Prediction: "",
      Active_Flag: false,
      Is_Deleted: false,
      Created_Date: "2024-04-11",
      Updated_Date: "2024-04-11",
      Organization_Id: 1,
      Account_Id: 11,
      Lead_Id: 5,
      Created_By: 4,
      Updated_By: 4,
    },
  ],
  Sales: [],
};

function TransactionReport({ id, data }) {
  const [open, setOpen] = React.useState(null);
  const [datas, setDatas] = React.useState([]);

  const handleClick = (idx) => {
    setOpen(open === idx ? null : idx);
  };

  // const dealHeaders = [
  //   { sort: "Company_Name", label: "Company Name", bool: true },
  //   { sort: "Phoene", label: "Phone", bool: true },
  //   { sort: "Amount", label: "Deal Amount", bool: true },
  //   { sort: "Deal_Probablity", label: "Deal Probability", bool: true },
  //   { sort: "Deal_Stage", label: "Deal Stage", bool: true },
  //   { sort: "Contact_Person", label: "Last Contacted By", bool: true },
  // ];

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  // selected period function

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const periodOptions = [
    "Previous Week",
    "Previous Month",
    "Previous Quarter",
    "Previous Year",
    "This Week",
    "This Month",
    "This Quarter",
    "This Year",
    "Last One Year",
    "Last Six Month",
    "Last Three Month",
    "Custom Date",
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
      case "This Week":
        startDate = moment().startOf("week");
        endDate = moment().endOf("week");

        let ThisWeekStart = startDate?.format("YYYY-MM-DD");
        let ThisWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisWeekStart);
        setCurrentDate(ThisWeekEnd);

        setCustomDate(false);

        return;

      case "This Month":
        startDate = moment().startOf("month");
        endDate = moment().endOf("month");

        let ThisMonthStart = startDate?.format("YYYY-MM-DD");
        let ThisMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisMonthStart);
        setCurrentDate(ThisMonthEnd);

        setCustomDate(false);

        return;

      case "This Quarter":
        startDate = moment().startOf("quarter");
        endDate = moment().endOf("quarter");

        let ThisQuarterStart = startDate?.format("YYYY-MM-DD");
        let ThisQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisQuarterStart);
        setCurrentDate(ThisQuarterEnd);

        setCustomDate(false);

        return;

      case "This Year":
        startDate = moment().startOf("year");
        endDate = moment().endOf("year");

        let ThisYearStart = startDate?.format("YYYY-MM-DD");
        let ThisYearEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(ThisYearStart);
        setCurrentDate(ThisYearEnd);

        setCustomDate(false);

        return;

      case "Previous Week":
        startDate = moment().subtract(1, "week").startOf("week");
        endDate = moment().subtract(1, "week").endOf("week");

        let PrevWeekStart = startDate?.format("YYYY-MM-DD");
        let PrevWeekEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevWeekStart);
        setCurrentDate(PrevWeekEnd);

        setCustomDate(false);

        return;

      case "Previous Month":
        startDate = moment().subtract(1, "month").startOf("month");
        endDate = moment().subtract(1, "month").endOf("month");

        let PrevMonthStart = startDate?.format("YYYY-MM-DD");
        let PrevMonthEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevMonthStart);
        setCurrentDate(PrevMonthEnd);

        setCustomDate(false);

        return;

      case "Previous Quarter":
        startDate = moment().subtract(1, "quarter").startOf("quarter");
        endDate = moment().subtract(1, "quarter").endOf("quarter");

        let PrevQuarterStart = startDate?.format("YYYY-MM-DD");
        let PrevQuarterEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(PrevQuarterStart);
        setCurrentDate(PrevQuarterEnd);

        setCustomDate(false);

        return;

      case "Previous Year":
        startDate = moment().subtract(1, "year").startOf("year");
        endDate = moment().subtract(1, "year").endOf("year");

        let MomentDateStart = startDate?.format("YYYY-MM-DD");
        let MomentDateEnd = endDate?.format("YYYY-MM-DD");

        setSelectedDate(MomentDateStart);
        setCurrentDate(MomentDateEnd);

        setCustomDate(false);

        return;

      case "Last One Year":
        date = moment().subtract(1, "year");
        setCustomDate(false);

        break;

      case "Last Six Month":
        date = moment().subtract(6, "months");
        setCustomDate(false);

        break;

      case "Last Three Month":
        date = moment().subtract(3, "months");
        setCustomDate(false);

        break;

      case "Custom Date":
        setCustomDate(true);
        break;
      default:
        date = null;
    }
    let MomentDate = date?.format("YYYY-MM-DD");
    setSelectedDate(MomentDate);
    setCurrentDate(TodayDate);
  };

  const NotesFilter = async () => {
    if (
      selectedDate !== "" &&
      selectedDate !== undefined &&
      currentDate !== ""
    ) {
      // console.log("selectedDate", selectedDate, currentDate);
      await axios
        .post(
          `${BASE_URL}/user/ContactTransactionreport/`,
          {
            Is_Deleted: false,
            fromdate: selectedDate,
            todate: currentDate,
          },
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          if (id) {
            const filter =
              response.data?.Result?.find(
                (result) => Number(result?.id) === Number(id)
              ) ?? {};

            let merge = [
              { Contact_Id: filter?.Contact_Id, Contact_Name: filter?.Name },
              ...(filter?.Leads || []),
              ...(filter?.Deal || []),
              ...(filter?.Sales || []),
            ];

            setDatas(merge);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });

      //
    }
    if (fromDate !== "" && toDate !== "") {
      await axios
        .post(
          `${BASE_URL}/user/ContactTransactionreport/`,
          {
            Is_Deleted: false,
            fromdate: fromDate,
            todate: toDate,
          },
          {
            headers: {
              db: item,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          if (id) {
            const filter =
              response.data?.Result?.find(
                (result) => Number(result?.id) === Number(id)
              ) ?? {};

            let merge = [
              { Contact_Id: filter?.Contact_Id, Contact_Name: filter?.Name },
              ...(filter?.Leads || []),
              ...(filter?.Deal || []),
              ...(filter?.Sales || []),
            ];

            setDatas(merge);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  // get functions

  const getTransactions = useCallback(async () => {
    NotesFilter();
  }, [datas]);

  useEffect(() => {
    NotesFilter();
  }, [selectedDate, fromDate, toDate]);

  return (
    <>
      <Div>
        <Div
          sx={[
            DisplayFlex,
            {
              mt: 2,
              flexWrap: "wrap",
              gap: "0px !important",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            <FormControl
              sx={{
                width: "250px",
              }}
            >
              <SelectDropdown
                value={selectedPeriod}
                options={periodOptions || []}
                onChange={handlePeriodChange}
                placeholder="Choose a Period"
              />
            </FormControl>
          </Div>

          {/* <Div sx={[DisplayFlex, { flexWrap: "wrap" }]}>
            <SearchBar
              width={"200px !important"}
              border={"1px solid lightgray"}
              // SearchData={SearchData}
            />
            <CustomButton
              label="Create"
              Icon=""
              onClick={() => setShowDialog(true)}
            />
          </Div> */}
        </Div>

        {Boolean(customDate) && (
          <Box sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap", mt: 2 }]}>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography id="Typography-root" sx={[FontStyle]}>
                  From
                </Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={fromDate}
                  onChange={(e) => setfromDate(e.target.value)}
                />
              </FormControl>
            </Div>
            <Div sx={[DisplayFlex, { gap: "10px", flexWrap: "wrap" }]}>
              <FormControl>
                <Typography id="Typography-root" sx={[FontStyle]}>
                  To
                </Typography>
                <TextField
                  sx={[FontStyle]}
                  type={"date"}
                  className="input-box"
                  value={toDate}
                  onChange={(e) => settoDate(e.target.value)}
                />
              </FormControl>
            </Div>
          </Box>
        )}
      </Div>

      <Box sx={{ my: 2 }}>
        <JumboScrollbar
          autoHeight={true}
          autoHideTimeout={4000}
          autoHeightMin={300}
          autoHeightMax={"80vh"}
          autoHide={true}
          hideTracksWhenNotNeeded
          id="no-more-tables"
        >
          <Table stickyHeader>
            <CustomTableHeader
              showGear={false}
              headerMenuItems={[
                { bool: true, label: "Transactions ID" },
                { bool: true, label: "Transactions Name" },
                { bool: true, label: "Transactions Type" },
                { bool: true, label: "Amount" },
              ]}
            />
            <TableBody>
              {datas?.length > 0 &&
                datas?.map((item, idx) => {
                  let trans_id =
                    item?.LeadId ||
                    item?.Deal_Id ||
                    item?.Sales_Id ||
                    item?.Contact_Id ||
                    " - ";
                  let trans_name =
                    item?.Sales_Person ||
                    item?.Deal_Name ||
                    item?.LeadFirstName?.concat(" " + item?.LeadLastName) ||
                    item?.Contact_Name ||
                    " - ";
                  let Trans_type = Boolean(item?.Sales_Id)
                    ? "Sales"
                    : Boolean(item?.Deal_Id)
                    ? "Deal"
                    : Boolean(item?.LeadId)
                    ? "Lead"
                    : Boolean(item?.Contact_Id)
                    ? "Contact"
                    : "";
                  let Trans_amount = item?.Amount || item?.Net_Amount || " - ";

                  return (
                    <CRMTableRow key={idx}>
                      <CRMTableCell data-title="Transactions ID">
                        {trans_id}
                      </CRMTableCell>
                      <CRMTableCell data-title="Transactions Name">
                        {trans_name}
                      </CRMTableCell>
                      <CRMTableCell data-title="Transactions Type">
                        {Trans_type}
                      </CRMTableCell>
                      <CRMTableCell data-title="Amount">
                        {Boolean(Trans_amount)
                          ? Trans_amount?.toLocaleString()
                          : parseInt(Trans_amount)
                          ? Trans_amount
                          : " - "}
                      </CRMTableCell>
                    </CRMTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </JumboScrollbar>
      </Box>
    </>
  );
}

export default memo(TransactionReport);
