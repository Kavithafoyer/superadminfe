import React from "react";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import SettingsPhoneIcon from '@mui/icons-material/SettingsPhone';
import { ImHome } from "react-icons/im";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CampaignIcon from '@mui/icons-material/Campaign';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Tenantname } from "app/services/auth-services";


const homemenu = [
  {
    uri:  `home`,
    label: "HOME",
    type: "nav-item",
    icon: <ImHome style={{ fontSize: 15, marginLeft: -15,marginRight:-65 }} />,
  },
  {
    uri:  `app/contacts`,
    label: "CONTACT",
    type: "nav-item",
    icon: <PermContactCalendarIcon sx={{ fontSize: 15, marginLeft: -15,marginRight:-65 }} />,
  },
  {
    uri:  `app/call-centre`,
    label: "CALL CENTRE",
    type: "nav-item",
    icon: <SettingsPhoneIcon sx={{ fontSize: 15, marginLeft: -15,marginRight:-65 }} />,
  },
  {
    uri:  `sales`,
    label: "SALES",
    type: "nav-item",
    icon: <TrendingDownIcon sx={{ fontSize: 15, marginLeft: -15,marginRight:-65 }} />,
  },
  {
    uri:  `analytics`,
    label: "ANALYTICS",
    type: "nav-item",
    icon: <AnalyticsIcon sx={{ fontSize: 15, marginLeft: -15,marginRight:-65 }} />,
  },
];
export default homemenu;
