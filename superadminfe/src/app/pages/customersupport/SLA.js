import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain'
import JumboTableHead from '@jumbo/components/JumboTableHead/JumboTableHead';
import { BackupOutlined, CancelOutlined, ModeEdit } from '@mui/icons-material';
import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import { HiOutlineSearch } from 'react-icons/hi';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import slaList from "../../mock/sla";
import { filter } from "lodash";
import JumboIconify from "@jumbo/components/JumboIconify/index";
import DeleteIcon from "@mui/icons-material/Delete";

const TABLE_HEAD = [
  { id: "slaName", label: "SLA Name", alignRight: false },
  { id: "customerName", label: "Customer Name", alignRight: false },
  { id: "escalationLevel", label: "Escalation levels", alignRight: false },
  { id: "fromDate", label: "From Date", alignRight: false },
  { id: "endDate", label: "End Date", alignRight: false },
  { id: "targets", label: "Targets", alignRight: false },
  { id: "Setting", label: <SettingsOutlinedIcon />, alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_contacts) =>
        _contacts.customerName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const SLA = () => {
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRow, setSelectedRow] = useState("");

  const [showAddProductInward, setShowAddProductInward] = useState(false);

  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = slaList.map((n) => n.customerName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleOpenMenu = (e, update) => {
    setOpen(e.currentTarget);
    setSelectedRow(update);
  };
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - slaList.length)
      : 0;

  const filteredContacts = applySortFilter(
    slaList,
    getComparator(order, orderBy),
    filterName
  );
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const isNotFound = !filteredContacts.length && !!filterName;

  const [productRows, setProductRows] = useState([
    {
      column1: "Product001",
      column2: "maecenas",
      column3: "Mtrs",
      column4: "100",
    },
  ]);

  const TableAddProductRow = ({ data, onDelete }) => {
    return (
      <TableRow>
        <TableCell>{data.column1}</TableCell>
        <TableCell>{data.column2}</TableCell>
        <TableCell>{data.column3}</TableCell>
        <TableCell>{data.column4}</TableCell>
        <TableCell>
          <Button onClick={() => onDelete(data.id)}>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const handleAddRow = () => {
    console.log("rows", productRows);
    const newRow = {
      column1: "",
      column2: "",
      column3: "",
      column4: "",
    };
    setProductRows([...productRows, newRow]);
  };

  const handleDeleteRow = (id) => {
    const updatedRows = productRows.filter((_, row) => row !== id);
    setProductRows(updatedRows);
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Dialog
          scroll="body"
          PaperProps={{
            sx: {
              borderRadius: "10px",
              boxShadow: "0px 4px 4px 5px rgba(0, 0, 0, 0.25)",
            },
          }}
          open={showAddProductInward}
          onClose={() => setShowAddProductInward(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"md"}
        >
          <DialogTitle
            align="center"
            id="alert-dialog-title"
            sx={{ fontSize: "18px", background: "#FFFFFF" }}
          >
            Service Level Agreement
            <IconButton
              sx={{ float: "right" }}
              onClick={() => setShowAddProductInward(false)}
            >
              <CancelOutlined />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ background: "rgba(141, 119, 190)", p: "8px" }}>
            <Card sx={{ mt: "6px", borderRadius: "10px" }}>
              <Stack direction={"column"} spacing={2}>
                <Stack
                  direction={{ md: "row", xs: "column" }}
                  mt={1}
                  spacing={2}
                  alignContent={"center"}
                  justifyContent={"center"}
                >
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="Customer Name"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="SLA Name"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Stack m={2} direction={"column"} spacing={2}>
                <TextField
                  sx={{
                    "& fieldset": {
                      borderRadius: "30px",
                    },
                  }}
                  className="input-box mt-1"
                  id="outlined-basic"
                  placeholder="Description"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack m={2} direction={"column"} spacing={2}>
                <Stack
                  direction={{ md: "row", xs: "column" }}
                  mt={1}
                  spacing={2}
                  alignContent={"center"}
                  justifyContent={"center"}
                >
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="Escalation Levels"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="From Date"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="To Date"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Stack m={2} direction={"column"} spacing={2}>
                <Stack
                  direction={{ md: "row", xs: "column" }}
                  mt={1}
                  ml={0.5}
                  spacing={2}
                >
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="Targets"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="Response Time"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder=""
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder="Response within By"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "325px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder=""
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Stack m={2}>
                <Typography
                  sx={{
                    color: "#007BFF",
                    ":hover": {
                      color: "#007BFF",
                    },
                    textAlign: "left",
                  }}
                >
                  + Add More Lines
                </Typography>
                <Typography
                  sx={{
                    textAlign: "left",
                  }}
                >
                  Escalation Level
                </Typography>

                <Stack
                  direction={{ md: "row", xs: "column" }}
                  mt={1}
                  spacing={2}
                >
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "300px",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder=""
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    sx={{
                      "& fieldset": {
                        borderRadius: "30px",
                      },
                      width: "100%",
                    }}
                    className="input-box mt-1"
                    id="outlined-basic"
                    placeholder=""
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {/* <PermIdentityIcon sx={{ color: "#6C63FF" }} /> */}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </Stack>
              <Grid container align="center" mt={3} spacing={2} pb={2}>
                <Grid item align="right" xs={6}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      maxHeight: "23px",
                      width: "55px",
                      bgcolor: "#1E90FF",
                      fontSize: "14px",
                      borderRadius: "8px",
                      paddingRight: "8px",
                      "&:hover": { bgcolor: "#007BFF" },
                    }}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item align="left" xs={6}>
                  <Button
                    onClick={() => setShowAddProductInward(false)}
                    size="small"
                    variant="text"
                    sx={{
                      maxHeight: "23px",
                      width: "55px",
                      fontSize: "14px",
                      paddingRight: "10px",
                      color: "#007BFF",
                      "&:hover": { bgcolor: "transparent" },
                    }}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </DialogContent>
        </Dialog>
        <Card>
          <Stack
            direction={{ md: "row", xs: "column" }}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#000000",
                }}
              >
                Service Level Agreement
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={2}>
              <TextField
                id="input-with-icon-textfield"
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineSearch />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
              <Button
                onClick={() => {
                  setShowAddProductInward(true);
                }}
                sx={{
                  mr: 2,
                  backgroundColor: "#007BFF",
                  height: 30,
                  borderRadius: 8,
                  fontSize: { xs: "10px" },
                  color: "#fff",
                  ":hover": {
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    borderRadius: 8,
                  },
                }}
              >
                +Create SLA
              </Button>
            </Stack>
          </Stack>
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <JumboTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={slaList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredContacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        slaName,
                        customerName,
                        escalationLevel,
                        fromDate,
                        endDate,
                        target,
                      } = row;
                      const selectedContacts =
                        selected.indexOf(customerName) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedContacts}
                        >
                          <TableCell align="left">
                            <Typography>{slaName}</Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Typography>{customerName}</Typography>
                          </TableCell>

                          <TableCell align="left">
                            <Typography>{escalationLevel}</Typography>
                          </TableCell>
                          <TableCell align="left">{fromDate}</TableCell>
                          <TableCell align="left">{endDate}</TableCell>
                          <TableCell align="left">{target}</TableCell>
                          <TableCell align="right">
                            <IconButton size="large" color="inherit">
                              <JumboIconify
                                icon={"eva:more-vertical-fill"}
                                onClick={(e) => handleOpenMenu(e, row)}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete
                            words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            color="primary"
            count={slaList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </JumboContentLayoutMain>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <JumboIconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem>
          <JumboIconify icon={"eva:eye-fill"} sx={{ mr: 2 }} />
          View
        </MenuItem>
        <MenuItem sx={{ color: "error.main" }}>
          <JumboIconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
};

export default SLA;
