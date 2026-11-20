import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Colors } from "./CRMStyles";

export const CRMTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    cursor: "pointer",
    flexWrap: "nowrap",
    padding: "0px 10px  !important",
    fontSize: "14px !important",
    backgroundColor: "#F3F3F3 !important",
    color: `${Colors?.Mblue} `,
    fontWeight: "500",
    // minWidth:"120px",
    boxShadow: "none",
  },
  [`&.${tableCellClasses.body}`]: {
    boxShadow: "none",
    fontSize: "14px !important",
    fontWeight: "400 !important",
    padding: "0px 10px !important",
    margin: "0px !important",
    // textAlign: "left", // Align non-numeric content to the left
  },
  [`&.${tableCellClasses.numeric}`]: {
    boxShadow: "none",
    fontSize: "14px !important",
    fontWeight: "400 !important",
    padding: "0px 10px !important",
    textAlign: "right", // Align numeric content to the right
  },
}));

export const CRMTableRow = styled(TableRow)(({ theme }) => ({
  // "&:nth-of-type(even)": {
  //   backgroundColor: "#F3F3F3",
  // },
  // hide last border
  "td, th": {
    border: "0px solid  !important",
    borderBottom: "1px dashed lightgray !important",
    height: "35px !important",
    padding: "0px !important",
    paddingX: "10px !important",
  },
}));
