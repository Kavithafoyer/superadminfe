import {
  blue,
  purple,
  lightBlue,
  indigo,
  orange,
  green,
  red,
} from "@mui/material/colors";
import { Switch, Tab, Tabs } from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";

export const Colors = {
  blue: lightBlue[800],
  // Mblue: "#10BBE5",
  Mblue: "#147659",
  lightgray: "#f7f7f7",
  // Mblue:lightBlue[400],
  MHoverblue: lightBlue[300],
  lightBlue: blue[50],
  purple: purple[800],
  lightpurple: purple[50],
  indigo: indigo[800],
  lightindigo: indigo[50],
  orange: orange[800],
  lightorange: orange[50],
  green: green[800],
  lightgreen: green[50],
  red: red[800],
  lightred: red[50],
  lightSkyBlue: "#d3e2e9",
  lightSkyBlueV2: "#0FDAE7",
  dialogBgColor: "#F6F5F2",
};
export const customHeight = "30px !important";
export const ChartHeight = "450px !important";
export const cardHeight = "125px !important";
export const dialogTitle = {
  fontSize: "16px !important",
  fontWeight: "600 !important",
};
export const dialogFontSize = {
  fontSize: "20px !important",
  fontWeight: "600 !important",
};

export const dialogheading = {
  fontSize: "14px !important",
  fontWeight: "600 !important",
  color: "white !important",
  height: "38px !important",
  backgroundColor: "#08D9D6 !important",
};

export const inputLabel = {
  fontSize: "14px !important",
  fontWeight: "700 !important",
  color: "#08D9D6 !important",
};

export const input_label = {
  fontSize: "14px !important",
  fontWeight: "600 !important",
  color: "#4D4D4D !important",
  // color:'#08D9D6 !important',
};

export const input_label1 = {
  fontSize: "14px !important",
  fontWeight: "600 !important",
  color: "#4D4D4D !important",
  width: "200px !important",
  // color:'#08D9D6 !important',
};
// export const InputPlaceholder = {
//   fontSize: "13px !important",
// };

export const LeadtoMove =
  "Would you like to change this contact to a lead? Will this contact be deleted from the contact list if you request it?";

export const deletedWarnigMsg = "Are you sure you want to delete this item ?";

export const deleteCampaign = "Are you sure you want to delete this Campaign";
export const deleteCampaignPosting =
  "The post has already been placed, thus you are unable to remove it.";
export const deleteCampaignPostingEdit =
  "The post has already been placed, thus you are unable to edit it.";
export const deleteCampaignPostingPromotion =
  "The post has already been placed, you are unable to stop the Promotion";

export const componentTitle = {
  fontSize: "22px !important",
  fontWeight: "700 !important",
  color: "#4D4D4D !important",
};

export const FontStyleINV = {
  fontSize: "12px !important",
  fontWeight: "400 !important",
  color: "#C0C0C0",
};
export const ComponentHeadingINV = {
  fontSize: "14px !important",
  fontWeight: "600 !important",
};

export const Rupee = "₹";

export const TableHeaderType = "Capitalize"; // "Capitalize" or "Lowercase" or "Lowercase"

// tap navigation
export const AntTabs = styled(Tabs)({
  borderBottom: "0px solid ",
  borderColor: Colors?.Mblue,
  "& .MuiTabs-indicator": {
    backgroundColor: Colors?.Mblue,
  },
});

export const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme?.breakpoints?.up("sm")]: {
      minWidth: 0,
    },
    // marginRight: theme.spacing(1),
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: dialogTitle.fontSize,
    fontWeight: dialogTitle.fontWeight,
    "&:hover": {
      color: Colors?.Mblue,
      opacity: 1,
    },
    "&.Mui-selected": {
      color: Colors?.Mblue,
      fontWeight: theme?.typography?.fontWeightMedium,
    },
    "&.Mui-focusVisible": {
      backgroundColor: Colors?.Mblue,
    },
  }),
);

export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    // maxWidth: 50,
    width: "90%",
    backgroundColor: Colors?.Mblue,
  },
});

export const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    // textTransform: "none",
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: dialogTitle.fontSize,
    fontWeight: dialogTitle.fontWeight,
    // marginRight: 1,
    "&.Mui-selected": {
      color: Colors?.Mblue,
    },
    "&.Mui-focusVisible": {
      backgroundColor: Colors?.Mblue,
    },
  }),
);

export const avatarColors = [
  "#8e44ad", // Deep purple
  "#e91e63", // Deep pink
  "#e67d21", // Deep orange
  "#2196f3", // Deep blue
  "#198754", // Deep green
  "#6610f2", // Deep indigo
  "#dc3545", // Deep red
  "#0dcaf0", // Deep cyan
  "#20c997", // Deep Teal
  "#6673FC", //
];

export const avatarLightColors = [
  "#3686FF", // Light blue
  "#7C47F7", // Light indigo
  "#8E6AC1", // Light purple
  "#EB5F9F", // Light pink
  "#FF6B77", // Light red
  "#FFA14E", // Light orange
  "#2BB673", // Light green
  "#31D9FF", // Light cyan
  "#45E8B6", // Light teal
  "#7785FF", // Light
];
export const lightColors = [
  "#f0f8ff", // AliceBlue
  "#faebd7", // AntiqueWhite
  "#f0ffff", // Azure
  "#f5f5dc", // Beige
  "#ffe4c4", // Bisque
  "#faf0e6", // Linen
  "#fff5ee", // Seashell
  "#f5fffa", // MintCream
  "#f0fff0", // Honeydew
  "#f0f8ff", // AliceBlue
];

export const PrymidColor = [
  "#1F3A93", // Deep Blue
  "#22A7F0", // Vivid Sky Blue
  "#26C281", // Emerald Green
  "#F5D76E", // Bright Gold
  "#E87E04", // Rich Amber
  "#BF55EC", // Amethyst Purple
];

export const colorCode = {
  textPurple: {
    color: "#9675ce",
  },
  textWhite: {
    color: "#ffffff",
  },
  textSuccess: {
    color: "#36c6d3",
  },
  textInfo: {
    color: "#659be0",
  },
  textWarning: {
    color: "#f1c40f",
  },
  textDanger: {
    color: "#f44336",
  },
  headerBadgeColor1: {
    backgroundColor: "#ff4081",
  },
  headerBadgeColor2: {
    backgroundColor: "#28a745",
  },
  orangeBgcolor: {
    backgroundColor: "#c46210",
  },
  purpleBgcolor: {
    backgroundColor: "#673ab7",
  },
  blueBgcolor: {
    backgroundColor: "#2196f3",
    color: "#fff",
  },
  cyanBgcolor: {
    backgroundColor: "#36c6d3",
    color: "#fff",
  },
  deepPinkBgcolor: {
    backgroundColor: "#e91e63",
    color: "#fff",
  },
  lightDarkBgcolor: {
    background: "linear-gradient(45deg, #708090, #7c8ea0)",
    color: "#fff",
  },
  bgPrimary: {
    color: "#fff",
    backgroundColor: "#9c78cd",
  },
  bgWarning: {
    color: "#fff",
    backgroundColor: "#ffd200",
  },
  bgSuccess: {
    background: "#5fc29d",
    color: "#fff",
  },
  bgInfo: {
    color: "#fff",
    backgroundColor: "#6bd3f3",
  },
  bgDanger: {
    color: "#fff",
    backgroundColor: "#e55957",
  },
  bgDark: {
    color: "#fff",
    backgroundColor: "#2b2b2c",
  },
  bgOrange: {
    background: "#e67d21",
    color: "#fff",
  },
  bgBlue: {
    background: "#3598dc",
    color: "#fff",
  },
  bgPurple: {
    background: "#8e44ad",
    color: "#fff",
  },
  bgBDanger: {
    background: "linear-gradient(45deg, #f30c41, #eb66dd)",
  },
  bgBBlue: {
    background: "linear-gradient(45deg, #1a77e2, #bfd6f1)",
  },
  bgBGreen: {
    background: "linear-gradient(45deg, #2ed8b6, #59e0c5)",
  },
  bgBOrange: {
    background: "linear-gradient(45deg, #fda582, #f7cf68)",
  },
  bgBPurple: {
    background: "linear-gradient(45deg, #a52dd8, #e29bf1)",
  },
  bgBCyan: {
    background: "linear-gradient(45deg, #40ffed, #29b5af)",
  },
  bgBBlack: {
    background: "linear-gradient(45deg, #708090, #7c8ea0)",
  },
  bgBYellow: {
    background: "linear-gradient(45deg, #ffb64d, #ffcb80)",
  },
  bgBPink: {
    background: "linear-gradient(45deg, #ff5370, #ff869a)",
  },
  red: {
    color: "#fff",
    backgroundColor: "#f44336",
  },
  pink: {
    backgroundColor: "#ff1493",
    color: "#fff",
  },
  yellow: {
    backgroundColor: "#f1c500",
    color: "#fff",
  },
  greenColor: {
    color: "green",
  },
};

// my own CRM styles
export const PrimaryColor = {
  color: "#08D9D6f !important",
};
export const FontStyle = {
  fontSize: "14px !important",
  fontWeight: "400 !important",
  color: "#000",
};
export const AvatarFont = {
  fontSize: "10px !important",
  fontWeight: "800 !important",
};

export const ComponentHeading = {
  fontSize: "20px !important",
  fontWeight: "600 !important",
};

export const DialogHeader = {
  fontSize: "13px !important",
  color: "black",
  bgcolor: "#dcdcdc !important",
  fontWeight: 600,
  height: "35px !important",
};

export const CRMTableHead = {
  backgroundColor: "#F3F3F3 !important",
  // height: "35px !important",
};

export const UploadBtn = {
  border: "1px solid green !important",
};

export const ButtonStyle = {
  // minWidth: "100px !important",
  // width: "100px !important",

  height: "35px !important",
  padding: "4px 5px",
};

export const DialogBoxSaveButton = {
  padding: "0px !important",
  color: "#FFFF !important",
  border: "0px solid gray !important",
  bgcolor: "#08D9D6f !important",
  height: "30px !important",
};
export const DialogBoxCancelButton = {
  padding: "0px !important",
  border: "1px solid lightgray !important",
  color: "black",
  height: "30px !important",
};

export const DisplayFlex = {
  display: "flex !important",
  alignItems: "center !important",
  gap: "5px !important",
};

export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Accordian styles
export const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid rgba(0, 0, 0, .125)`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme?.palette?.mode === "dark"
      ? "rgba(255, 255, 255, 0)"
      : "rgba(0, 0, 0, 0)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: 1,
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: 2,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export const InvoiceA4 = {
  width: "210mm",
  minHeight: "297mm",
  padding: "10mm",
  border: "1px solid #D3D3D3",
  borderRadius: "5px",
  background: "white",
  boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
  position: "relative",
  boxSizing: "border-box",
  // Standard A4 aspect ratio is approx 1:1.414
  aspectRatio: "1 / 1.414",
  display: "flex",
  flexDirection: "column",
  // Scale down for smaller screens
  "@media (max-width: 850px)": {
    width: "100%",
    minHeight: "auto",
    padding: "10mm",
  },
  // Print specific styles to ensure it fits one page
  "@media print": {
    margin: "0 !important",
    border: "none !important",
    boxShadow: "none !important",
    width: "210mm !important",
    height: "297mm !important",
    padding: "5mm !important",
    pageBreakAfter: "always !important",
    overflow: "hidden !important",
    WebkitPrintColorAdjust: "exact",
  },
};

