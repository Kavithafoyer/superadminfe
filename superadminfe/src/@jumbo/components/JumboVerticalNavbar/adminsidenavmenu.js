import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StyleIcon from '@mui/icons-material/Style';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';


import Home from '../../../../assets/images/Vector.png';
import Marketing from '../../../../assets/images/Goal.png';
import Sales from '../../../../assets/images/TotalSales.png';
import CustomerSupport from '../../../../assets/images/TotaSale.png';
import TaskManagement from '../../../../assets/images/Business.png';
import Reports from '../../../../assets/images/PieChart.png';


const navConfig = [
  {
    title: "Home",
    path: "/home",
    icon: <img src={Home} alt={"home"} />,
  },
  {
    title: "Marketing",
    path: "/home",
    icon: <img src={Marketing} alt={"marketing"} />,
    subNav: [
      {
        title: "Contact Management",
        path: "/home",
        icon: <PeopleOutlineIcon />,
        innerSubNav: [
          { title: "Contacts", path: "/home" },
          { title: "Calls", path: "/home" },
        ],
      },
      {
        title: "Lead Management",
        path: "/home",
        icon: <FilterAltIcon />,
        innerSubNav: [
          { title: "Dashboard", path: "/home" },
          { title: "Qualified Leads", path: "/home" },
          { title: "Unqualified Leads", path: "/home" },
          { title: "Lead Generation", path: "/home" },
        ],
      },
      {
        title: "Deal Management",
        path: "/home",
        icon: <HandshakeIcon />,
        innerSubNav: [
          { title: "Dashboard", path: "/home" },
          { title: "All deals", path: "/home" },
          { title: "My deals", path: "/home" },
          { title: "Pipeline deals", path: "/home" },
        ],
      },
      {
        title: "Campaign",
        path: "/home",
        icon: <CampaignIcon />,
        innerSubNav: [
          { title: "Dashboard", path: "/home" },
          { title: "Email", path: "/home" },
          { title: "Templates", path: "/home" },
          { title: "Statistics", path: "/home" },
        ],
      },
      {
        title: "Account",
        path: "/home",
        icon: <AccountBoxIcon />,
        innerSubNav: [
          { title: "Dashboard", path: "/home" },
          { title: "My Account", path: "/home" },
          { title: "New Account", path: "/home" },
        ],
      },
    ],
  },
  {
    title: "Sales",
    path: "/home",
    icon: <img src={Sales} alt={"Sales"} />,
    subNav: [
      {
        title: "Dashboard",
        path: "/home",
        icon: <AutoAwesomeMosaicIcon />,
      },
      {
        title: "Configure Product",
        path: "/home",
        icon: <InventoryIcon />,
        innerSubNav: [
          { title: "Product Master", path: "/home" },
          { title: "Opening Stock", path: "/home" },
          { title: "Product Catalogue", path: "/home" },
          { title: "Setting up discount", path: "/home" },
          { title: "Product inward", path: "/home" },
        ],
      },
      {
        title: "Manage price",
        path: "/home",
        icon: <LocalOfferIcon />,
      },
      {
        title: "Offer",
        path: "/home",
        icon: <StyleIcon />,
      },
      {
        title: "Customer Enquiry",
        path: "/home",
        icon: <StyleIcon />,
      },
      {
        title: "Order Management",
        path: "/home",
        icon: <ListAltIcon />,
      },
      {
        title: "Schedule",
        path: "/home",
        icon: <ScheduleIcon />,
      },
      {
        title: "Shipment",
        path: "/home",
        icon: <ProductionQuantityLimitsIcon />,
      },
      {
        title: "Invoice",
        path: "/home",
        icon: <ReceiptIcon />,
      },
      {
        title: "Payments",
        path: "/home",
        icon: <PaymentsIcon />,
      },
    ],
  },
  {
    title: "Customer Support",
    icon: <img src={CustomerSupport} alt={"CustomerSupport"} />,
    subNav: [
      {
        title: "SLA",
        path: "/customer-support",
      },
      {
        title: "AMC",
        path: "/customer-support",
      },
      {
        title: "Ticket Management",
        innerSubNav: [
          { title: "Summery", path: "/home" },
          { title: "Tickets", path: "/home" },
          { title: "Live Chats", path: "/home" },
          { title: "Ticket Status", path: "/home" },
        ],
      },
    ],
  },
  {
    title: "Task Management",
    path: "/home",
    icon: <img src={TaskManagement} alt={"TaskManagement"} />,
  },
  {
    title: "Reports",
    path: "/home",
    icon: <img src={Reports} alt={"Reports"} />,
    subNav: [
      {
        title: "Sales Performance",
        path: "/home",
        innerSubNav: [
          { title: "Sales Pipeline report", path: "/home" },
          { title: "Sales forecast report", path: "/home" },
          { title: "Sales rep performance report", path: "/home" },
          { title: "Pro/ser performance report", path: "/home" },
          { title: "Sales activity report", path: "/home" },
        ],
      },
      {
        title: "Lead and opportunity Management",
        path: "/home",
        innerSubNav: [
          { title: "Lead Conversion report", path: "/home" },
          { title: "Opportunity pipeline report", path: "/home" },
          { title: "Sales forecast by stage report", path: "/home" },
          { title: "Deal size and win rate report", path: "/home" },
          { title: "Sales funner report", path: "/home" },
          { title: "Lead Source report", path: "/home" },
          { title: "Sales Pipeline report", path: "/home" },
          { title: "Opportunity aging report", path: "/home" },
          { title: "Conversion rate report", path: "/home" },
          { title: "Sales forecast report", path: "/home" },
        ],
      },
      {
        title: "Customer Management",
        path: "/home",
        innerSubNav: [
          { title: "Customer interaction history report ", path: "/home" },
          { title: "Email Campaign performance report", path: "/home" },
          { title: "Social media engagement report", path: "/home" },
          { title: "Customer satisfaction report", path: "/home" },
        ],
      },
      {
        title: "Marketing Effectiveness",
        path: "/home",
        innerSubNav: [
          { title: "Lead generation report ", path: "/home" },
          { title: "Conversion rate report", path: "/home" },
          { title: "Revenue attribution  report", path: "/home" },
          { title: "Customer lifetime value report", path: "/home" },
          { title: "Marketing ROI report", path: "/home" },
        ],
      },
      {
        title: "Customer Retention",
        path: "/home",
        innerSubNav: [
          { title: "Customer Churn report ", path: "/home" },
          { title: "Customer loyalty report", path: "/home" },
          { title: "Customer Satisfaction report", path: "/home" },
          { title: "Customer Engagement report", path: "/home" },
          { title: "Customer lifetime value report", path: "/home" },
        ],
      },
      {
        title: "Financial Metrics",
        path: "/home",
        innerSubNav: [
          { title: "Revenue report ", path: "/home" },
          { title: "Sales Performance report", path: "/home" },
          { title: "Profit & Loss report", path: "/home" },
          { title: "Cost analysis report", path: "/home" },
          { title: "Catch flow report", path: "/home" },
        ],
      },
    ],
  },
  {
    title: "Analytics",
    icon: <img src={TaskManagement} alt={"TaskManagement"} />,
    subNav: [
      {
        title: "Form 1",
        path: "/analytics",
      },
      {
        title: "Form 2",
        path: "/analytics",
      },
      {
        title: "Form 3",
        path: "/analytics",
      },
      {
        title: "Form 4",
        path: "/analytics",
      },
      {
        title: "Form 5",
        path: "/analytics",
      },
      {
        title: "Form 6",
        path: "/analytics",
      },
      {
        title: "Form 7",
        path: "/analytics",
      },
    ],
  },
];

  export default navConfig;