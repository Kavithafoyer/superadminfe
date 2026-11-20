import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain'
import { Avatar, Button, IconButton, InputAdornment, InputBase, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import ticketSummaryList from 'app/mock/ticketSummaryList';
import React, { useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi';
import { filter } from "lodash";
import JumboTableHead from '@jumbo/components/JumboTableHead/JumboTableHead';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import AllOutIcon from '@mui/icons-material/AllOut';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { Search } from '@mui/icons-material';
import Div from '@jumbo/shared/Div';


const TABLE_HEAD = [
  { id: "avatar", label: "", alignRight: false },
  { id: "ticketName", label: "Ticket Name", alignRight: false },
  { id: "lastChatted", label: "Last Chatted", alignRight: false },
  { id: "name", label: "Name", alignRight: false },
  { id: "priority", label: "Priority", alignRight: false },
  { id: "status", label: "status", alignRight: false },
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
        _contacts.ticketName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

const TicketStatus = () => {
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedRow, setSelectedRow] = useState("");

  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ticketSummaryList.map((n) => n.ticketName);
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


  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - ticketSummaryList.length)
      : 0;

  const filteredContacts = applySortFilter(
    ticketSummaryList,
    getComparator(order, orderBy),
    filterName
  );
  const isNotFound = !filteredContacts.length && !!filterName;
  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{display:"flex",alignItems:'center', justifyContent:'space-between'}}>
          <Div>
            <Typography 
            color="neutral"
            level="h2"
            noWrap={false}
            variant="plain"
            sx={{ fontSize: "18px", fontWeight: 700, marginY: "auto" }}
            >Ticket Status</Typography>
          </Div>
          <Div>
            <Paper
              component="form"
              className='search-filed'
              sx={{width: "50vh !important"}}
            >
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <Search />
              </IconButton>
              <InputBase
                sx={{ flex: 1, ml: -1 }}
                // onChange={SearchData}
                placeholder="Search chats . . ."
                inputProps={{ 'aria-label': 'search . . . ' }}
              />

            </Paper>
          </Div>
        </Div>
        <div style={{ marginTop: "1rem" }}>
          <TableContainer >
            <JumboScrollbar
              autoHeight={true}
              autoHeightMin={"92vh"}
              autoHideTimeOut={4000}
            >
              <Table responsive >
                <TableHead stickyHeader className='dialog-head' sx={{ background: "ghostwhite !important" }}>
                  <TableRow >
                    <TableCell sx={{ padding: "10px 5px !important", width: "40px !important", }} align="left"></TableCell>
                    <TableCell sx={{ color: "#746C70 !important", padding: "10px !important" }} align="left">Ticket Name</TableCell>
                    <TableCell sx={{ color: "#746C70 !important", padding: "10px !important" }} align="left">Last Chatted</TableCell>
                    <TableCell sx={{ color: "#746C70 !important", padding: "10px !important" }} align="left">Name</TableCell>
                    <TableCell sx={{ color: "#746C70 !important", padding: "10px !important" }} align="left">Priority</TableCell>
                    <TableCell sx={{ color: "#746C70 !important", padding: "10px !important" }} align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContacts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        ticketName,
                        lastChatted,
                        avatar,
                        name,
                        priority,
                      } = row;
                      const selectedContacts =
                        selected.indexOf(ticketName) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedContacts}
                        >
                          <TableCell sx={{ padding: "10px 0px !important" }} align="left">
                            <Avatar src={avatar} sx={{ ml: 2, mr: 1, width: "30px !important", height: "30px !important" }} alt="photoURL" />
                          </TableCell>
                          <TableCell sx={{ padding: "10px !important" }} align="left">
                            <Typography>{ticketName}</Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "10px !important" }} align="left">
                            <Typography>{lastChatted}</Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "10px !important" }} align="left">
                            <Typography>{name}</Typography>
                          </TableCell>
                          <TableCell sx={{ padding: "10px !important" }} align="left">
                            {priority === "High" && (
                              <Stack direction={"row"} spacing={1}>
                                <KeyboardDoubleArrowUpIcon />
                                <Typography>{priority}</Typography>
                              </Stack>
                            )}
                            {priority === "Medium" && (
                              <Stack direction={"row"} spacing={1}>
                                <AllOutIcon />
                                <Typography>{priority}</Typography>
                              </Stack>
                            )}
                            {priority === "Low" && (
                              <Stack direction={"row"} spacing={1}>
                                <KeyboardDoubleArrowDownIcon />
                                <Typography>{priority}</Typography>
                              </Stack>
                            )}
                            {priority === "Critical" && (
                              <Stack direction={"row"} spacing={1}>
                                <PriorityHighRoundedIcon />
                                <Typography>{priority}</Typography>
                              </Stack>
                            )}
                            {priority === "Trivial" && (
                              <Stack direction={"row"} spacing={1}>
                                <ArrowCircleDownIcon />
                                <Typography>{priority}</Typography>
                              </Stack>
                            )}
                          </TableCell>
                          <TableCell sx={{ padding: "5px 0px !important" }} align="left">
                            {priority === "High" && (
                              <>
                                <Button
                                  disabled
                                  sx={{
                                    background: "#7689D5",
                                    color: "#FFFF !important",
                                    width: "100px",

                                    borderRadius: "3px",
                                  }}
                                >
                                  To do
                                </Button>
                              </>
                            )}
                            {priority === "Medium" && (
                              <>
                                <Button
                                  disabled
                                  sx={{
                                    background: "#98b1be",
                                    color: "#FFFF !important",
                                    width: "100px",

                                    borderRadius: "3px",
                                  }}
                                >
                                  In Progress
                                </Button>
                              </>
                            )}
                            {priority === "Low" && (
                              <>
                                <Button
                                  disabled
                                  sx={{
                                    background: "#d39bfd",
                                    color: "#FFFF !important",
                                    width: "100px",

                                    borderRadius: "3px",
                                  }}
                                >
                                  On Hold
                                </Button>
                              </>
                            )}
                            {priority === "Critical" && (
                              <>
                                <Button
                                  disabled
                                  sx={{
                                    background: "#CECEFA",
                                    color: "#FFFF !important",
                                    width: "100px",

                                    borderRadius: "3px",
                                  }}
                                >
                                  Closed
                                </Button>
                              </>
                            )}
                            {priority === "Trivial" && (
                              <>
                                <Button
                                  disabled
                                  sx={{
                                    background: "#8cd4c0",
                                    color: "#FFFF !important",
                                    width: "100px",

                                    borderRadius: "3px",
                                  }}
                                >
                                  Done
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
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
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </JumboScrollbar>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            color="primary"
            count={ticketSummaryList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </JumboContentLayoutMain>
    </>
  );
}

export default TicketStatus
