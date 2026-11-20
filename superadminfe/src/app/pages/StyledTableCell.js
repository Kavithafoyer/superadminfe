import styled from "@emotion/styled";
import { TableCell, tableCellClasses } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  lineHeight: "2.2rem",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: theme.palette.common.black,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: "1px solid #D6EAF8",
    transform: "translateX(0px)",
    transition: "transform 0.3s ease",
  },
}));

export default StyledTableCell;