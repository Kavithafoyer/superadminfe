import HandshakeIcon from "@mui/icons-material/Handshake";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StyleIcon from "@mui/icons-material/Style";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  GiBoxUnpacking,
  GiHumanTarget,
  GiOrganigram,
  GiPencilRuler,
} from "react-icons/gi";
import {
  BsChatQuoteFill,
  BsEnvelopeAtFill,
  BsFileRuledFill,
  BsFillPatchQuestionFill,
  BsFillPinMapFill,
  BsPersonFillCheck,
  BsPersonFillSlash,
} from "react-icons/bs";
import { HiMiniHome, HiMiniMegaphone } from "react-icons/hi2";
import { AiFillBell, AiFillFolderAdd, AiFillSignal } from "react-icons/ai";
import {
  RiAccountPinCircleFill,
  RiContactsBookFill,
  RiContactsFill,
  RiFeedbackLine,
  RiFileList3Fill,
} from "react-icons/ri";
import { IoBag, IoChatbubblesSharp, IoStorefrontSharp } from "react-icons/io5";
import { TbSubtask } from "react-icons/tb";
import {
  MdAccountTree,
  MdBatchPrediction,
  MdCall,
  MdCampaign,
  MdConfirmationNumber,
  MdDiscount,
  MdLeaderboard,
  MdOutlineStorage,
} from "react-icons/md";
import { SiGoogleadsense, SiProducthunt } from "react-icons/si";
import { BiSolidDashboard } from "react-icons/bi";
import {
  FaCommentDots,
  FaEdit,
  FaHandsHelping,
  FaHouseUser,
  FaIdeal,
  FaPiedPiperPp,
  FaShippingFast,
} from "react-icons/fa";
import { TfiStatsUp } from "react-icons/tfi";
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { FaArrowsToCircle } from "react-icons/fa6";
import { PiClockCountdownFill, PiTabsFill } from "react-icons/pi";
import { TbTargetArrow } from "react-icons/tb";
import SettingsIcon from "@mui/icons-material/Settings";
import { GrTransaction } from "react-icons/gr";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import "./menus.css";

const navConfig = [
  {
    id: null,
    title: "Dashboard",
    path: `superadmin-dashboard`,
    type: "nav-item",
    icon: (
      <BiSolidDashboard
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
  },
  {
    id: null,
    title: "Analytics Dashboard",
    path: `analytics-dashboard`,
    type: "nav-item",
    icon: (
      <AiFillSignal
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
  },
  // {
  //   id: null,
  //   title: "Home",
  //   path: `home`,
  //   type: "nav-item", // add type
  //   icon: (
  //     <HiMiniHome
  //       className="sideBarIcon"
  //       style={{ fontSize: 16, color: "#666565" }}
  //     />
  //   ),
  // },
  // {
  //   id: null,
  //   title: "Notification",
  //   path: `Home-Notifications`,
  //   // path: `sales-sales-Notifications`,
  //   type: "nav-item", // add type
  //   icon: (
  //     <AiFillBell
  //       className="sideBarIcon"
  //       style={{ fontSize: 16, color: "#666565" }}
  //     />
  //   ),
  // },
  {
    id: 74,
    title: "Accounts",
    type: "nav-item",
    icon: (
      <RiAccountPinCircleFill
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
    path: `customer-list`,
  },
  // {
  //   id: null,
  //   title: "Notification",
  //   path: `sales-sales-Notifications`,
  //   type: "nav-item", // add type
  //   icon: (
  //     <AiFillBell
  //       className="sideBarIcon"
  //       style={{ fontSize: 16, color: "#666565" }}
  //     />
  //   ),
  // },

  {
    id: 13,
    title: "Sales",
    type: "collapsible", // add type
    path: `sales`,
    icon: (
      <IoStorefrontSharp
        className="sideBarIcon"
        style={{ fontSize: 15, color: "#666565" }}
      />
    ),
    children: [
      // {
      //   id: 59,
      //   title: "Products",
      //   type: "nav-item", // add type
      //   icon: (
      //     <RiAccountPinCircleFill
      //       className="sideBarIcon"
      //       style={{ fontSize: 14, color: "#666565" }}
      //     />
      //   ),
      //   path: `products`,
      // },
      {
        id: 59,
        title: "Plan",
        type: "nav-item", // add type
        icon: (
          <RiAccountPinCircleFill
            className="sideBarIcon"
            style={{ fontSize: 14, color: "#666565" }}
          />
        ),
        path: `plan`,
      },
      {
        id: 58,
        title: "Subscription",
        type: "nav-item", // add type
        icon: (
          <BiSolidDashboard
            className="sideBarIcon"
            style={{ fontSize: 13, color: "#666565" }}
          />
        ),
        path: `subscription`,
      },

      {
        id: 60,
        title: "Sales Invoice",
        type: "nav-item", // add type
        icon: (
          <RiFeedbackLine
            className="sideBarIcon"
            style={{ fontSize: 14, color: "#666565" }}
          />
        ),
        path: `sale-invoice`,
      },
      {
        id: 61,
        title: "Payments",
        type: "nav-item", // add type
        icon: (
          <RiAccountPinCircleFill
            className="sideBarIcon"
            style={{ fontSize: 14, color: "#666565" }}
          />
        ),
        path: `sales-payments`,
      },

      {
        id: 62,
        title: "Instance Request",
        type: "nav-item", // add type
        icon: (
          <FaCommentDots
            className="sideBarIcon"
            style={{ fontSize: 13, color: "#666565" }}
          />
        ),
        path: `sales-instance-request`,
      },
      {
        id: 70,
        title: "Instance Creation",
        type: "nav-item", // add type
        path: `customer-intance-creation`,
        icon: <StyleIcon sx={{ fontSize: 15 }} />,
      },
    ],
  },

  {
    id: null,
    title: "Customer Management",
    type: "collapsible",
    path: `customer-management`,
    icon: (
      <RiContactsFill
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
    children: [
      {
        id: null,
        title: "Additional Licence",
        type: "nav-item",
        path: `customer-additoinal-licence`,
        icon: (
          <RiFileList3Fill
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: null,
        title: "Addon Subscription",
        type: "nav-item",
        path: `AdditionalAddonSubscription`,
        icon: (
          <IoBag style={{ fontSize: 14, marginLeft: 15, color: "#666565" }} />
        ),
      },
      {
        id: null,
        title: "Additional Storage",
        type: "nav-item",
        path: `customer-additoinal-storage`,
        icon: (
          <MdOutlineStorage
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: null,
        title: "Renewal",
        type: "nav-item",
        path: `customer-renewal`,
        icon: (
          <PiClockCountdownFill
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: null,
        title: "Cancel Plan",
        type: "nav-item",
        path: `CancellationofPlanlist`,
        icon: (
          <BsPersonFillSlash
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
    ],
  },

  {
    id: 16,
    title: "Task Management",
    type: "collapsible", // add type
    // path: "/task/list-task",
    path: `task-managements`,
    icon: (
      <TbSubtask
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
    children: [
      {
        id: 88,
        title: "List Task",
        type: "nav-item",
        path: `task-management`,
        icon: (
          <RiFileList3Fill
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: 87,
        title: "Task Status",
        type: "nav-item",
        path: `task-status`,
        icon: (
          <AiFillSignal
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: 89,
        title: "Task Gantt Chart",
        type: "nav-item",
        path: `task-gantt-chart`,
        icon: (
          <MdLeaderboard
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: 90,
        title: "Task Calendar",
        type: "nav-item",
        path: `task-calendar`,
        icon: (
          <PiTabsFill
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
    ],
  },

  {
    id: 17,
    title: "Ticket Management",
    type: "collapsible",
    path: `ticket`,
    icon: (
      <MdConfirmationNumber
        className="sideBarIcon"
        style={{ fontSize: 16, color: "#666565" }}
      />
    ),
    children: [
      {
        id: 91,
        title: "Ticket Management Group",
        type: "nav-item",
        path: `ticket/ticket-Managementgroup`,
        icon: (
          <GiOrganigram
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: 92,
        title: "Ticket Created List",
        type: "nav-item",
        path: `ticket/ticket-Createdticketlist`,
        icon: (
          <BsFileRuledFill
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
      {
        id: 93,
        title: "List Tickets",
        type: "nav-item",
        path: `ticket/list-ticket`,
        icon: (
          <MdConfirmationNumber
            style={{ fontSize: 14, marginLeft: 15, color: "#666565" }}
          />
        ),
      },
    ],
  },

  // {
  //   id: 14,
  //   title: "Marketing",
  //   type: "collapsible", // add type
  //   path: `marketing`,
  //   icon: (
  //     <HiMiniMegaphone
  //       className="sideBarIcon"
  //       style={{ fontSize: 16, color: "#666565" }}
  //     />
  //   ),
  //   children: [
  //     {
  //       id: 74,
  //       title: "Account",
  //       type: "nav-item", // add type
  //       icon: (
  //         <RiAccountPinCircleFill
  //           className="sideBarIcon"
  //           style={{ fontSize: 14, color: "#666565" }}
  //         />
  //       ),
  //       path: `customer-list`,
  //     },
  //   ],
  // },

  // {
  //   id: 19,
  //   type: "collapsible",
  //   title: "Reports",
  //   path: `reports`,
  //   icon: (
  //     <AiFillSignal
  //       className="sideBarIcon"
  //       style={{ fontSize: 14, color: "#666565" }}
  //     />
  //   ),
  //   children: [
  //     {
  //       id: null,
  //       type: "collapsible",
  //       title: "Sales Performance",
  //       path: `report/sales-performance`,
  //       children: [
  //         {
  //           id: 110,
  //           type: "nav-item",
  //           title: "Sales pipeline report",
  //           path: `reports/SalesPipeLineReport`,
  //         },
  //         // { id: 112,title: "Sales forecast report", path: `reports/SalesForecastReport` },
  //         // {
  //         // id: 113,
  //         //   title: "Sales rep performance report",
  //         //   path: `reports/SalesRepPerformanceReport`,
  //         // },
  //         {
  //           id: 114,
  //           type: "nav-item",
  //           title: "Pro/Ser performance report",
  //           path: `reports/ProAndSerPerformanceReport`,
  //         },
  //         {
  //           id: 115,
  //           type: "nav-item",
  //           title: "Sales activity report",
  //           path: `reports/SalesActivityReports`,
  //         },
  //       ],
  //     },
  //     {
  //       id: null,
  //       type: "collapsible",
  //       title: "Lead and opportunity Management",
  //       path: `report/lead-management`,
  //       children: [
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Lead Conversion report",
  //           path: `leads/addleads/LeadConversionreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Opportunity pipeline report",
  //           path: `leads/addleads/Opportunitypipelinereport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Sales forecast by stage report",
  //           path: `leads/addleads/Salesforecast`,
  //         },
  //         // {
  //         // id: null,
  //         //   title: "Deal size and win rate report",
  //         //   path:  `leads/addleads/DealSize`,
  //         // },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Sales funner report",
  //           path: `leads/addleads/SalesFunnelReport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Lead Source report",
  //           path: `leads/addleads/LeadSourceReports`,
  //         },
  //         // {
  //         // id: null,
  //         //   title: "Sales Pipeline report",
  //         //   path:  `leads/addleads/SalesPipelineReport`,
  //         // },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Opportunity aging report",
  //           path: `leads/addleads/OpportunityAgingReport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Conversion rate report",
  //           path: `leads/addleads/ConversionRateReport`,
  //         },
  //         // {
  //         // id: null,
  //         //   title: "Sales forecast report",
  //         //   path:  `leads/addleads`,
  //         // },
  //       ],
  //     },
  //     {
  //       id: null,
  //       type: "collapsible",
  //       title: "Customer Engagement",
  //       path: `report/customer-engagement`,
  //       children: [
  //         // {
  //         // id: null,
  //         // type: "nav-item",
  //         //   title: "Customer interaction history report ",
  //         //   path: `customer-support/CustomerInteractionHistoryReport`,
  //         // },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Email Campaign performance report",
  //           path: `customer-support/EmailCampaignPerformanceReport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Social media engagement report",
  //           path: `customer-support/SocialMediaEngagementReport`,
  //         },
  //         // {
  //         // id: null,
  //         //   title: "Customer satisfaction report",
  //         //   path: `customer-support/CustomerSatisfactionReport`,
  //         // },
  //         // {
  //         // id: null,
  //         //   title: "Website traffic report",
  //         //   path: `customer-support/WebsiteTrafficReport`,
  //         // },
  //       ],
  //     },

  //     // {
  //     // id: null,
  //     //   title: "Financial Metrics",
  //     //   children: [
  //     //     { id: null,title: "Revenue report ", path: `home` },
  //     //     { id: null,title: "Sales Performance report", path: `home` },
  //     //     { id: null,title: "Profit & Loss report", path: `home` },
  //     //     { id: null,title: "Cost analysis report", path: `home` },
  //     //     { id: null,title: "Catch flow report", path: `home` },
  //     //   ],
  //     // },
  //     //karthik add
  //     {
  //       id: null,
  //       type: "collapsible",
  //       title: "New Reports",
  //       path: `report/new-reports`,
  //       children: [
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Daily sales report",
  //           path: `reports/Dailysalesreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Weekly sales report",
  //           path: `reports/Weeklysalesreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Monthly sales report",
  //           path: `reports/Monthlysalesreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Customer Churn report",
  //           path: `reports/CustomerChurnreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Customer addition report",
  //           path: `reports/Customeradditionreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Customer retention report",
  //           path: `reports/Customerretentionreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Sales rep perform report",
  //           path: `reports/newreports/Salesrepperformreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Lead and Opportunity report",
  //           path: `reports/LeadandOpportunityreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "Sales performance report",
  //           path: `reports/Salesperformancereport`,
  //         },
  //       ],
  //     },
  //     {
  //       id: null,
  //       type: "collapsible",
  //       title: "Sales Funnel Reports",
  //       path: `report/sales-funnel-reports`,
  //       children: [
  //         {
  //           id: null,
  //           type: "nav-item",
  //           title: "sales Funnel report",
  //           path: `reports/salesFunnelreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item", // add type
  //           title: "Pipeline Development report",
  //           path: `reports/PipelineDevelopmentreport`,
  //         },
  //         {
  //           id: null,
  //           type: "nav-item", // add type
  //           title: "Stage Distribution CRM report",
  //           path: `reports/StageDistributionCRMreport`,
  //         },
  //       ],
  //     },
  //   ],
  // },

  // {
  //   id: 18,
  //   title: "Analytics",
  //   type: "collapsible", // add type
  //   path: `analytics`,
  //   icon: (
  //     <AiFillSignal
  //       className="sideBarIcon"
  //       style={{ fontSize: 14, color: "#666565" }}
  //     />
  //   ),
  //   children: [
  //     // new rout start
  //     {
  //       id: 92,
  //       title: "Sales by Customer",
  //       type: "nav-item", // add type
  //       path: `analytics/salesbycustomer`,
  //     },
  //     {
  //       id: 93,
  //       title: "Activity Overview",
  //       type: "nav-item", // add type
  //       path: `analytics/activityoverview`,
  //     },
  //     {
  //       id: 94,
  //       title: "Sales Goals",
  //       type: "nav-item", // add type
  //       path: `analytics/SalesGoals`,
  //     },
  //     // {
  //     //   title: "Stage Conversion",
  //     //   path:  `analytics/stageconversionbyowner`,
  //     // },
  //     // {
  //     //   title: "Stage Duration Analysis",
  //     //   path:  `analytics/stagedurationanalysis`,
  //     // },
  //     // {
  //     //   title: "Time to First Action",
  //     //   path:  `analytics/TimetoFirstActionbyOwner`,
  //     // },
  //     {
  //       id: 95,
  //       title: "Lead Sources",
  //       type: "nav-item", // add type
  //       path: `analytics/LeadSources`,
  //     },
  //     {
  //       id: 96,
  //       title: "Call Duration",
  //       type: "nav-item", // add type
  //       path: `analytics/CallDuration`,
  //     },
  //     {
  //       id: 97,
  //       title: "Call Length Vs Time Of Day",
  //       type: "nav-item", // add type
  //       path: `analytics/CallLengthVsTimeOfDay`,
  //     },
  //     // {
  //     // id: null,
  //     //   title: "CRM DashBoard",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/CRMDashBoard`,
  //     // },
  //     {
  //       id: 98,
  //       title: "Sales KPI Dashboard",
  //       type: "nav-item", // add type
  //       path: `analytics/SalesKPIDashboard`,
  //     },
  //     {
  //       id: 99,
  //       title: "Churn Analysis Dashboard",
  //       type: "nav-item", // add type
  //       path: `analytics/ChurnAnalysisDashboard`,
  //     },
  //     {
  //       id: 100,
  //       title: "Sales Dashboard",
  //       type: "nav-item", // add type
  //       path: `analytics/SalesDashboard`,
  //     },
  //     // {
  //     //   title: "Key Performance Indicators",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/KeyPerformanceIndicator`,
  //     // },
  //     {
  //       id: 101,
  //       title: "Sales Opportunities Overview",
  //       type: "nav-item", // add type
  //       path: `analytics/SalesOpportunitiesOverview`,
  //     },
  //     {
  //       id: 102,
  //       title: "Opportunities Individual Report",
  //       type: "nav-item", // add type
  //       path: `analytics/OpportunitiesIndividualReport`,
  //     },
  //     {
  //       id: 103,
  //       title: "Activity Individual Report",
  //       type: "nav-item", // add type
  //       path: `analytics/ActivityIndividualReport`,
  //     },
  //     // {
  //     //   title: "Customer Rentention Dashboard",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/CustomerRententionDashboard`,
  //     // },
  //     // {
  //     //   title: "Lead Performance",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/LeadPerformance`,
  //     // },
  //     {
  //       id: 104,
  //       title: "Call Activities",
  //       type: "nav-item", // add type
  //       path: `analytics/CallActivities`,
  //     },
  //     // {
  //     //   title: "Monthly Sales Board",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/MonthlySalesDashboard`,
  //     // },
  //     // {
  //     //   title: "Sales Product Performance Dashboard",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/SalesProductPerformance`,
  //     // },
  //     // {
  //     //   title: "Executive Sales Performance Dashboard",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/ExecutiveSalesPerformance`,
  //     // },
  //     // {
  //     //   title: "Total Sales And Growth",
  //     // type: 'nav-item', // add type
  //     //   path:  `analytics/TotalSalesAndGrowth`,
  //     // },
  //     {
  //       id: 105,
  //       title: "Sales Volume By Channel",
  //       type: "nav-item", // add type
  //       path: `analytics/SalesVolumeByChannel`,
  //     },
  //     {
  //       id: 106,
  //       title: "Monthly Sales Activity Report",
  //       type: "nav-item", // add type
  //       path: `analytics/MonthlySalesActivityReport`,
  //     },
  //     {
  //       id: 107,
  //       title: "Monthly Sales Call Report Template",
  //       type: "nav-item", // add type
  //       path: `analytics/MonthlySalesCallReport`,
  //     },
  //     {
  //       id: 108,
  //       title: "Simple Monthly Sales Report",
  //       type: "nav-item", // add type
  //       path: `analytics/SimpleMonthlySalesReport`,
  //     },
  //     {
  //       id: 109,
  //       title: "Monthly Retail Sales",
  //       type: "nav-item", // add type
  //       path: `analytics/MonthlyRetailSales`,
  //     },

  //     // new rout end
  //     // {
  //     //   title: "Form 1",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 2",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 3",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 4",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 5",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 6",
  //     //   path: "/analytics",
  //     // },
  //     // {
  //     //   title: "Form 7",
  //     //   path: "/analytics",
  //     // },
  //   ],
  // },

  // {
  //   id: 21,
  //   title: "Customer Engagement",
  //   type: "nav-item", // add type
  //   icon: (
  //     <HiMiniMegaphone
  //       className="sideBarIcon"
  //       style={{ fontSize: 15, color: "#666565" }}
  //     />
  //   ),
  //   path: `customerengagementlist`,
  // },

  // settings
  {
    id: null,
    title: "Settings",
    type: "collapsible",
    path: `settings`,
    icon: <SettingsIcon style={{ fontSize: 16, color: "#666565" }} />,
    children: [
      {
        id: null,
        path: `settings/add-menu`,
        title: "Product Menu Setup",
        type: "nav-item",
        icon: <MdAccountTree style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      {
        id: 63,
        path: `settings/edit-company-details`,
        title: "Edit Company Details",
        type: "nav-item",
        icon: <FaEdit style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      {
        id: 64,
        path: `settings/roles&users`,
        title: "Roles & Users",
        type: "nav-item",
        icon: <FaHouseUser style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      // {
      //   id: 73,
      //   path: `settings/Setup`,
      //   title: "Auto Responder Setup",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },
      // {
      //   id: 74,
      //   path: `template`,
      //   title: "Templates",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },
      // {
      //   id: 75,
      //   path: `settings/TaxSetup`,
      //   title: "Tax Setup",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },
      // {
      //   id: 76,
      //   path: `settings/FactorySetup`,
      //   title: "Factory Setup",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },
      // {
      //   id: 77,
      //   path: `InvoiceTemplate`,
      //   title: "Invoice Template",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },

      // {
      //   id: 79,
      //   path: `AddAgent`,
      //   title: "Add Agent",
      //   type: "nav-item",
      //   icon: <FaIdeal style={{ fontSize: 16, marginLeft: 15 }} />,
      // },
      {
        id: 80,
        path: `settings/storage-price`,
        title: "Storage Master",
        type: "nav-item",
        icon: <MdOutlineStorage style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      {
        id: null,
        path: `settings/user-master`,
        title: "User Master",
        type: "nav-item",
        icon: <FaHouseUser style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      {
        id: 81,
        path: `settings/addon-price`,
        title: "Add on Master",
        type: "nav-item",
        icon: <AiFillFolderAdd style={{ fontSize: 16, marginLeft: 15 }} />,
      },

      {
        id: 75,
        path: `settings/system-preference`,
        title: "System Preference",
        type: "nav-item",
        icon: <GrTransaction style={{ fontSize: 16, marginLeft: 15 }} />,
      },
      {
        id: 76,
        path: `settings/lookup-list`,
        title: "Lookup List",
        type: "nav-item",
        icon: <FindInPageIcon style={{ fontSize: 16, marginLeft: 15 }} />,
      },
    ],
  },
];

export default navConfig;
