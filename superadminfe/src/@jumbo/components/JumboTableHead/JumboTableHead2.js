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
export default function JumboTableHead({ order, colums, orderBy, settingOptions, headLabel, onRequestSort, componentName }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead
    className='table-head'
      style={{
        backgroundColor: "#1B416B",
        borderRadius: "8px",
        height: "50px",
      }}
    >
      <TableRow>
        {headLabel.map((headCell) => (
          <>
            {(headCell.id !== "Setting" && colums[headCell.id]) && <CRMTableCell
              key={headCell.id}
              align={headCell.alignRight ? "right" : "left"}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                color: "#fff !important",
                "&.active": {
                  color: "#fff !important",
                },
              }}
            >
              <TableSortLabel
                // hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                // sx={{
                //   color: "#fff !important",
                //   "&.active": {
                //     color: "#fff !important",
                //   },
                // }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </CRMTableCell>}
            {(headCell.id == "Setting") &&
              <CRMTableCell
                onClick={() => settingOptions(true)}
                sx={{ cursor: "pointer", color: "#fff !important", textAlign: 'center' }}
              >
                <SettingsOutlinedIcon color='white' />
              </CRMTableCell>}
          </>
        ))}
      </TableRow>
    </TableHead>
  );
}