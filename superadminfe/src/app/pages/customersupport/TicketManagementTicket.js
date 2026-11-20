import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain/JumboContentLayoutMain'
import JumboTableHead from '@jumbo/components/JumboTableHead/JumboTableHead';
import { Avatar, Box, Button, Card, CardMedia, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputBase, InputLabel, MenuItem, Paper, Select, Stack, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { HiOutlineSearch } from "react-icons/hi";
import ticketSummaryList from "app/mock/ticketSummaryList";
import { filter } from "lodash";
import TurnedInNotRoundedIcon from '@mui/icons-material/TurnedInNotRounded';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import { CancelOutlined, Search } from "@mui/icons-material";
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { BackupOutlined } from "@mui/icons-material";
import JumboScrollbar from '@jumbo/components/JumboScrollbar';
import { GiTicket } from "react-icons/gi";
import Div from '@jumbo/shared/Div';
import axios from 'axios';
import { BASE_URL } from 'app/services/auth-services';


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

const TicketManagementTicket = () => {

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRow, setSelectedRow] = useState("");

  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  const [ticketStatus, setTicketStatus] = useState(10);
  const [ticketType, setTicketType] = useState(10);
  const [project, setProject] = useState(10);
  const [assignTo, setAssignTo] = useState(10);
  const [priority, setPriority] = useState(10);
  const [dueDate, setDueDate] = useState("");

  const [ticketList, setTicketList] = useState([])
  const [selectedDatas, setSelectedDatas] = useState({})


  const steps = ["Crated Jan 23", "Assigned to Project", "Assigned to Roshan"];

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

  const handleTicketStatusChange = (event) => {
    setTicketStatus(event.target.value);
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


  const token = localStorage.getItem("accesstoken")
  const item = "crmuseradmin1"
  // get ticket lists
  const getTicketLists = async () => {
    try {
      await axios.get(`${BASE_URL}/user/TicketManagementAdditional/?Is_Deleted=False`,
        {
          headers: {
            "db": item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => {
          console.log("Ticket Lists", res.data.results);
          if(res.data?.results){
            setTicketList(res.data?.results || [])
            setSelectedDatas(res.data?.results[0])
          }
        })

    } catch (error) {
      console.log(error);
    }
  }


  // On click user seleceted
  const onClickuserSelected = (e) => {
    setSelectedDatas(e)
  }

  // Search Functionality
  const SearchData = (e) => {
    //  console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : getTicketLists();
  }

  const handleSearch = async(search) => {
  try {
    axios.get(`${BASE_URL}/user/TicketManagementSearch/?search=${search}`,
    {
      headers: {
        "db": item,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",

      },
    }
  )
    .then((res) => {
      //  console.log(res.data);
      if(res.data){
        setTicketList(res?.data)
      }
    })
  } catch (error) {
    console?.error(error)
  }
  }


  useEffect(() => {
    getTicketLists();
  }, [])

  return (
    <>
      <JumboContentLayoutMain>
        <Dialog
          fullWidth={Boolean(true)}
          maxWidth={"md"}
          open={openCreateTicket}
          onClose={() => setOpenCreateTicket(false)}
        >
          <DialogTitle
            align="center"
            id="alert-dialog-title"
            sx={{ fontSize: "18px", pl: 5 }}
          >
            Create Ticket
            <IconButton
              sx={{ float: "right" }}
              onClick={() => setOpenCreateTicket(false)}
            >
              <CancelOutlined />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: "#D4F1F4",
            }}
          >
            <Stack className="px-0.5" mt={1}>
              <Card className="border">
                <Stack className="px-3" m={1}>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <TextField
                      sx={{
                        "& fieldset": {
                          borderRadius: "30px",
                        },
                        width: "325px",
                      }}
                      className="input-box mt-1"
                      id="outlined-basic"
                      placeholder="Ticket Name"
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
                      placeholder="Name"
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
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack>
                      <TextField
                        sx={{
                          "& fieldset": {
                            borderRadius: "30px",
                          },
                          width: "325px",
                        }}
                        className="input-box mt-1"
                        id="outlined-basic"
                        placeholder="Email"
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
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Order Number
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Ticket Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Ticket Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Project
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Assigned to
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >

                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                    <Stack>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Priority
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Age"
                          sx={{
                            borderRadius: "20px !important",
                            width: "325px",
                            height: "37px",
                            marginTop: "5px",
                          }}
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                    <Stack>
                      <Stack>
                        <TextField
                          type="date"
                          sx={{
                            "& fieldset": {
                              borderRadius: "30px",
                            },
                            width: "325px",
                          }}
                          className="input-box mt-1"
                          id="outlined-basic"
                          placeholder="Name"
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
                  </Stack>
                  <Stack>
                    <TextField
                      type="text"
                      sx={{
                        "& fieldset": {
                          borderRadius: "30px",
                        },
                      }}
                      className="input-box mt-1"
                      id="outlined-basic"
                      placeholder="Ticket Description"
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
                  <Stack mt={2}>
                    <Typography>Link Ticket</Typography>
                    <Stack
                      direction={"row"}
                      spacing={3}
                      alignContent={"center"}
                    >
                      <Stack direction={"column"}>
                        <Stack>
                          <TextField
                            sx={{
                              "& fieldset": {
                                borderRadius: "30px",
                              },
                              width: "325px",
                            }}
                            className="input-box mt-1"
                            id="outlined-basic"
                            placeholder="Ticket No."
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
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          mt={1}
                        >
                          <Stack direction={"row"}>
                            <TurnedInNotRoundedIcon />
                            <Typography variant="h4">Ticket 02</Typography>
                          </Stack>
                          <Stack>
                            <DeleteIcon sx={{ color: "red" }} />
                          </Stack>
                        </Stack>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          mt={1}
                        >
                          <Stack direction={"row"}>
                            <TurnedInNotRoundedIcon />
                            <Typography variant="h4">Ticket 03</Typography>
                          </Stack>
                          <Stack>
                            <DeleteIcon sx={{ color: "red" }} />
                          </Stack>
                        </Stack>
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          mt={1}
                        >
                          <Stack direction={"row"}>
                            <TurnedInNotRoundedIcon />
                            <Typography variant="h4">Ticket 04</Typography>
                          </Stack>
                          <Stack>
                            <DeleteIcon sx={{ color: "red" }} />
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack>
                        <Typography sx={{ color: "#007BFF" }}>
                          + Add More
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack>
                    <Grid
                      p={2}
                      container
                      direction={"row"}
                      justifyContent={"space-evenly"}
                    >
                      <Grid item>
                        <Typography sx={{ fontSize: "14px" }}>
                          Attach File
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          direction={"column"}
                          justifyContent={"space-evenly"}
                          alignItems={"center"}
                          sx={{
                            background: " rgba(212, 241, 244, 0.7)",
                            borderRadius: "10px",
                            minWidth: "405px",
                            height: "114px",
                            border: "1px dashed #000000",
                          }}
                        >
                          <IconButton sx={{ p: 0 }}>
                            <BackupOutlined />
                          </IconButton>
                          <Typography sx={{ fontSize: "12px" }}>
                            Drag your .jpg,.png prodcut image to start upload
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }}>
                            (Or)
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              maxHeight: "23px",
                              maxWidth: "100px",
                              bgcolor: "#1E90FF",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              paddingRight: "8px",
                              "&:hover": { bgcolor: "#007BFF" },
                            }}
                          >
                            Browse Files
                          </Button>
                        </Grid>
                      </Grid>
                      {/* <Grid item>
                        <CardMedia
                          sx={{ borderRadius: "10px" }}
                          width={"108px"}
                          component={"img"}
                          height={"114px"}
                          image={"/images/Uploads.png"}
                          alt={"upload-img"}
                        />
                      </Grid> */}
                    </Grid>
                  </Stack>
                </Stack>
                <Grid container align="center" mb={1} spacing={2}>
                  <Grid item align="right" xs={6}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "#1E90FF",
                        paddingRight: "10px",
                        fontSize: "14px",
                        borderRadius: "8px",
                        "&:hover": { color: "#FFFFFF", bgcolor: "#008000" },
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item align="left" xs={6}>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "#FFFFFF",
                        paddingRight: "10px",
                        color: "#007BFF",
                        fontSize: "14px",
                        borderRadius: "8px",
                        "&:hover": { color: "#FFFFFF", bgcolor: "#008000" },
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Stack>
          </DialogContent>
        </Dialog>

        <Stack>
          <Grid container spacing={2} >
            <Grid item xs={12} md={4} lg={4} xl={4}  >
              <Card sx={{ boxShadow: 3, borderRadius: "5px !important" }}>
                <Stack m={2} mb={1} spacing={3}>
                  <Stack>
                    <Button
                      className='dialog-add-btn'
                      sx={{ maxWidth: "40% !important", mb: "-10px !important" }}
                      onClick={() => setOpenCreateTicket(true)}
                    >
                      Create Ticket
                    </Button>
                  </Stack>
                  <Stack>
                    <Paper
                      component="form"
                      className='search-filed'
                    >
                      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <Search />
                      </IconButton>
                      <InputBase
                        sx={{ flex: 1, ml: -1 }}
                        onChange={SearchData}
                        placeholder="Search . . ."
                        inputProps={{ 'aria-label': 'search . . . ' }}
                      />

                    </Paper>
                  </Stack>
                </Stack>

                <Stack>
                  <div>
                    <TableContainer>
                      <JumboScrollbar
                        autoHeight={true}
                        autoHeightMin={550}
                        autoHideTimeOut={4000}
                        id="no-more-tables"
                      >
                        <Table responsive sx={{ minWidth: { xs: "auto", sm: 400 } }}>
                          <TableHead stickyHeader className='dialog-head' sx={{ background: "ghostwhite !important" }}>
                            <TableRow>
                              <TableCell sx={{ padding: "10px 5px !important", width: "40px !important", }} align="left"></TableCell>
                              <TableCell sx={{ color: "#746C70 !important", padding: "10px 0px !important", }} align="left">Ticket Name</TableCell>
                              <TableCell sx={{ color: "#746C70 !important", padding: "10px 0px !important", }} align="center">Created</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {ticketList
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => {
                                const { id, Ticket_Name, Created_Date, lastChatted, avatar } = row;
                                const selectedContacts =
                                  selected.indexOf(Ticket_Name) !== -1;

                                return (
                                  <TableRow
                                    hover
                                    key={id}
                                    tabIndex={-1}
                                    // sx={{paddingLeft:2}}
                                    role="checkbox"
                                    selected={selectedContacts}
                                    onClick={() => onClickuserSelected(row)}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <TableCell sx={{ padding: "5px 0px !important" }} align="center" data-title="Avatar">
                                      <Avatar src={avatar} alt="photoURL" sx={{ ml: 2, mr: 1, width: "30px !important", height: "30px !important" }} />
                                    </TableCell>
                                    <TableCell sx={{ padding: "5px 0px !important" }} align="left" data-title="Ticket Name">
                                      <Typography>{Ticket_Name}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ padding: "5px 0px !important" }} align="center" data-title="Created">
                                      <Typography>{new Date(Created_Date)?.getMinutes()} min</Typography>
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
                                <TableCell
                                  align="center"
                                  colSpan={6}
                                  sx={{ py: 3 }}
                                >
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
                                      <br /> Try checking for typos or using
                                      complete words.
                                    </Typography>
                                  </Paper>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          )}
                        </Table>
                      </JumboScrollbar>
                    </TableContainer>
                  </div>
                  {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    color="primary"
                    count={ticketSummaryList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    // sx={{width:"70% !important" }}
                  /> */}
                </Stack>

              </Card>
            </Grid>

            <Grid item xs={12} md={5} lg={5} xl={5}  >
              <Stack p={2} pr={0} spacing={2}
              >
                <Div sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
                  <GiTicket size={25} />
                  <Typography fontSize={16} >Ticket 01</Typography>
                </Div>
                <Stack >
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Ticket name
                  </Typography>
                  <Typography sx={{ color: "#746C70", }} >{selectedDatas?.Ticket_Name}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Ticket Description
                  </Typography>
                  <Typography sx={{ color: "#746C70", }} >
                    {selectedDatas?.Ticket_Description}
                  </Typography>
                </Stack>
                <Stack >
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Name
                  </Typography>
                  <Typography sx={{ color: "#746C70", }} >{selectedDatas?.Name}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Email
                  </Typography>
                  <Typography sx={{ color: "#746C70", }} >{selectedDatas?.Mail_Id}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Order Number
                  </Typography>
                  <Typography sx={{ color: "#746C70", }}>{selectedDatas?.Order_Number}</Typography>
                </Stack>
                <Stack >
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Linked Tickets
                  </Typography>
                  <Paper
                    component="form"
                    className='search-filed'
                    sx={{ height: "40px  !important ", mt: 1 }}
                  >
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <Search />
                    </IconButton>
                    <InputBase
                      sx={{ flex: 1, ml: -1 }}
                      // onChange={SearchData}
                      placeholder="Search Linked Tickets . . ."
                      inputProps={{ 'aria-label': 'search . . . ' }}
                    />
                  </Paper>

                  <Grid container spacing={2} mt={0.5}>
                    <Grid item xs={6} md={6} lg={6} xl={6}>
                      <Stack spacing={2} pl={1}>
                        <Div sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
                          <GiTicket size={20} />
                          <Typography sx={{ fontSize: "14px" }}>Ticket 02</Typography>
                        </Div>
                        <Div sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
                          <GiTicket size={20} />
                          <Typography sx={{ fontSize: "14px" }}>Ticket 03</Typography>
                        </Div>
                        <Div sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
                          <GiTicket size={20} />
                          <Typography sx={{ fontSize: "14px" }}>Ticket 04</Typography>
                        </Div>
                      </Stack>
                    </Grid>
                    <Grid sx={{ display: "flex", alignItems: 'center', justifyContent: 'center' }} item xs={6} md={6} lg={6} xl={6}>
                      <input type='file' id='file' style={{ display: "none" }} />
                      <label htmlFor='file' style={{ border: "2px dashed #e6e6e6", backgroundColor: "#f7f7f7", cursor: 'pointer' }}>
                        <Div sx={{ m: 3 }}>
                          <Typography sx={{ color: "#746C70", textAlign: 'center ' }}>
                            Attachments
                          </Typography>
                          <Div sx={{ display: "flex", gap: 1, alignItems: 'center !important', cursor: 'pointer' }}>
                            <AddLinkRoundedIcon />
                            <Typography htmlFor='file' sx={{ color: "#007BFF" }}>
                              Add File
                            </Typography>
                          </Div>
                        </Div>
                      </label>
                    </Grid>
                  </Grid>
                </Stack>

                <Stack >
                  <Typography variant="caption" sx={{ fontSize: 14 }}>
                    Ticket History
                  </Typography>
                  <Box mt={1} display={{ md: "flex", xs: "initial" }}>
                    <Stepper alternativeLabel sx={{ width: "100% !important" }}>
                      {steps.map((label, index) => (
                        <Step key={index}>
                          <StepLabel >
                            <Typography sx={{ fontSize: 12, }}>{label}</Typography>
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3} lg={3} xl={3}  >
              <Stack p={2} pr={0}>
                <Stack direction={"column"} spacing={3}>
                  <Stack>
                    <Button
                      className='dialog-add-btn'
                      sx={{
                        maxWidth: "40% !important", mb: "-10px !important",
                        backgroundColor: "#66B0FF !important", ":hover": {
                          opacity: 0.9
                        }, fontSize: { xs: "10px" },
                      }}
                      onClick={() => setOpenCreateTicket(true)}
                    >
                      <Typography noWrap>Start Chat</Typography>
                    </Button>
                  </Stack>
                  <Stack direction={"column"}>
                    <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                      Ticket Status
                    </Typography>
                    <Box sx={{
                      minWidth: 120, background: "#FFB3C2",
                      padding:"10px",
                      color: "#fff",
                    }}>
                      {selectedDatas?.Ticket_Status}
                    </Box>
                  </Stack>
                  <Stack direction={"column"}>
                    <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                      Ticket Type
                    </Typography>
                    <Box sx={{
                      minWidth: 120, background: "#7689D5",
                      padding:"10px",
                      // width: "100px",
                      color: "#fff",
                    }}>
                      {selectedDatas?.Ticket_Type}
                    </Box>
                 
                  </Stack>
                  <Stack direction={"column"} spacing={2}>
                    <Stack direction={"column"}>
                      <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                        Project
                      </Typography>
                      <Box sx={{
                      minWidth: 120, background: "#98b1be",
                      padding:"10px",
                      // width: "100px",
                      color: "#fff",
                    }}>
                      {selectedDatas?.File}
                    </Box>
                    </Stack>
                    <Stack direction={"column"}>
                      <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                        Assigned to
                      </Typography>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ticketStatus}
                            label="Ticket Status"
                            onChange={handleTicketStatusChange}
                            sx={{
                              background: "#d39bfd",
                              padding:"10px",
                              color: "#fff",
                            }}
                          >
                            <MenuItem value={10}>Roshan</MenuItem>
                            <MenuItem value={20}>In Progress</MenuItem>
                            <MenuItem value={30}>on Hold</MenuItem>
                            <MenuItem value={40}>Closed</MenuItem>
                            <MenuItem value={50}>Done</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                    <Stack direction={"column"}>
                      <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                        Priority
                      </Typography>
                      <Box sx={{
                      minWidth: 120, background: "#8cd4c0",
                      padding:"10px",
                      // width: "100px",
                      color: "#fff",
                    }}>
                      {selectedDatas?.Priority}
                    </Box>
                    </Stack>
                    <Stack >
                      <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                        Due Date
                      </Typography>
                      <TextField value={selectedDatas?.Due_Date} className='date' type="date" />
                      {/* <input type="date" id="birthday" name="birthday" /> */}
                    </Stack>
                    <Stack direction={"row"}>
                      <ArrowRightRoundedIcon />
                      <Typography variant="caption" sx={{ color: "#746C70", fontSize: 14 }}>
                        Chat History
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Stack>

      </JumboContentLayoutMain>
    </>
  );
}

export default TicketManagementTicket
