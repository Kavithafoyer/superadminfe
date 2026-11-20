import { BsSegmentedNav, BsTable } from "react-icons/bs";
import { IoArrowRedoSharp, IoBarChart } from "react-icons/io5";
import {
  FaChartPie,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaIdeal,
} from "react-icons/fa";
import { FaArrowTrendUp, FaPeopleRoof, FaRegChartBar } from "react-icons/fa6";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { TbChartHistogram, TbTargetArrow } from "react-icons/tb";
import { MdLeaderboard, MdSource } from "react-icons/md";
import { SiGoogleads } from "react-icons/si";
import { GrScorecard } from "react-icons/gr";

export const links = [
  // {
  //   title: 'Dashboard',
  //   links: [
  //     {
  //       name: 'ecommerce',
  //       icon: <FiShoppingBag />,
  //     },
  //   ],
  // },

  {
    // title: 'Pages',
    links: [
      {
        name: "report",
        icon: <IoBarChart />,
      },
      {
        name: "table",
        icon: <BsTable />,
      },
      // {
      //   name: 'customers',
      //   icon: <RiContactsLine />,
      // },
    ],
  },
  // {
  //   title: 'Apps',
  //   links: [
  //     {
  //       name: 'calendar',
  //       icon: <AiOutlineCalendar />,
  //     },
  //     {
  //       name: 'kanban',
  //       icon: <BsKanban />,
  //     },
  //     {
  //       name: 'editor',
  //       icon: <FiEdit />,
  //     },
  //     {
  //       name: 'color-picker',
  //       icon: <BiColorFill />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Charts',
  //   links: [
  //     {
  //       name: 'line',
  //       icon: <AiOutlineStock />,
  //     },
  //     {
  //       name: 'area',
  //       icon: <AiOutlineAreaChart />,
  //     },

  //     {
  //       name: 'bar',
  //       icon: <AiOutlineBarChart />,
  //     },
  //     {
  //       name: 'pie',
  //       icon: <FiPieChart />,
  //     },
  //     {
  //       name: 'financial',
  //       icon: <RiStockLine />,
  //     },
  //     {
  //       name: 'color-mapping',
  //       icon: <BsBarChart />,
  //     },
  //     {
  //       name: 'pyramid',
  //       icon: <GiLouvrePyramid />,
  //     },
  //     {
  //       name: 'stacked',
  //       icon: <AiOutlineBarChart />,
  //     },
  //   ],
  // },
];

export const charts = [
  {
    type: "areachart",
    icon: (
      <FaChartArea
        name="areachart"
        style={{ fontSize: 20, color: "#20ABE8" }}
      />
    ),
  },
  {
    type: "barchart",
    icon: (
      <FaChartBar name="barchart" style={{ fontSize: 20, color: "#20ABE8" }} />
    ),
  },
  {
    type: "linechart",
    icon: (
      <FaChartLine
        name="linechart"
        style={{ fontSize: 20, color: "#20ABE8" }}
      />
    ),
  },
  {
    type: "piechart",
    icon: (
      <FaChartPie name="piechart" style={{ fontSize: 20, color: "#20ABE8" }} />
    ),
  },
  {
    type: "sidebarchart",
    icon: (
      <FaRegChartBar
        name="sidebar"
        style={{ fontSize: 20, color: "#20ABE8" }}
      />
    ),
  },
  {
    type: "donutchart",
    icon: (
      <BiSolidDoughnutChart
        name="donut"
        style={{ fontSize: 20, color: "#20ABE8" }}
      />
    ),
  },
];

export const chartsMenu = [
  {
    type: "areachart",
    icon: <FaChartArea name="areachart" style={{ color: "#20ABE8" }} />,
  },
  {
    type: "barchart",
    icon: <FaChartBar name="barchart" style={{ color: "#20ABE8" }} />,
  },
  {
    type: "linechart",
    icon: <FaChartLine name="linechart" style={{ color: "#20ABE8" }} />,
  },
  {
    type: "piechart",
    icon: <FaChartPie name="piechart" style={{ color: "#20ABE8" }} />,
  },
  {
    type: "sidebarchart",
    icon: <FaRegChartBar name="sidebar" style={{ color: "#20ABE8" }} />,
  },
  {
    type: "donutchart",
    icon: <BiSolidDoughnutChart name="donut" style={{ color: "#20ABE8" }} />,
  },
];

//  for Analytics

export const analyticssMenu = [
  {
    title: "Sales",
    links: [
      {
        type: "Sales Forecast",
        icon: <FaChartArea name="Sales Forecast" />,
      },
      // {
      //   type: "Sales Target",
      //   icon: <TbTargetArrow size={15} name="Sales Target" />,
      // },
      {
        type: "Sales Trend",
        icon: <FaArrowTrendUp size={15} name="Sales Trend" />,
      },
    ],
  },
  {
    title: "Leads",
    links: [
      {
        type: "Lead Qualification",
        icon: <TbChartHistogram size={15} name="Lead Qualification" />,
      },
      {
        type: "Lead Stage",
        icon: <IoArrowRedoSharp size={15} name="Lead Stage" />,
      },
      {
        type: "Lead Segment",
        icon: <BsSegmentedNav size={18} name="Lead Segment" />,
      },
      {
        type: "Lead Score",
        icon: <GrScorecard size={15} name="Lead Score" />,
      },
      {
        type: "Lead Convertion Rate",
        icon: <MdLeaderboard size={15} name="Lead Convertion Rate" />,
      },
      {
        type: "Lead Demograph",
        icon: <SiGoogleads size={13} name="Lead Demograph" />,
      },
      {
        type: "Lead Source",
        icon: <MdSource size={15} name="Lead Source" />,
      },
    ],
  },
  {
    title: "Deals",
    links: [
      {
        type: "Deals Probability",
        icon: <FaIdeal size={15} name="Deals Probability" />,
      },
      {
        type: "Deals Convertion Rate",
        icon: <IoArrowRedoSharp size={15} name="Deals Convertion Rate" />,
      },
    ],
  },
  {
    title: "Customer",
    links: [
      {
        type: "Customer Churn",
        icon: <FaIdeal size={15} name="Customer Churn" />,
      },
      {
        type: "Customer Retain",
        icon: <FaPeopleRoof size={15} name="Customer Retain ( Month Count )" />,
      },
    ],
  },
];
