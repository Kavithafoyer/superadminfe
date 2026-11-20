import PropTypes from 'prop-types';
// @mui
import {
  Box,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
} from "@mui/material";
import { IconButton } from 'rsuite';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { ButtonStyle, CRMTableHead, ComponentHeading, DialogBoxCancelButton, DialogBoxSaveButton, DialogHeader, DisplayFlex, FontStyle, UploadBtn, generateRandomColor } from "app/pages/widgets/CRMStyles";
import { CRMTableCell } from 'app/pages/widgets/CRMTable';

// ----------------------------------------------------------------------
const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};
JumboTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};
export default function JumboTableHead({ order, orderBy, headLabel }) {
 
  return (
    <TableHead
    className='table-head'
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        height: "50px",
      }}
    >
      <TableRow>
        {headLabel.map((headCell) => (
          <>
          
          <CRMTableCell
              key={headCell.id}
              align={headCell.alignRight ? "right" : "left"}
              // sx={{
              //   color: "#000 !important",
              //   "&.active": {
              //     color: "#000 !important",
              //   },
              // }}
            >
              <TableSortLabel
                // hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                sx={{
                  color: "#000 !important",
                  "&.active": {
                    color: "#000 !important",
                  },
                }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </CRMTableCell>
          </>
        ))}
      </TableRow>
    </TableHead>
  );
}