import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Popover,
  Grid,
  TextField,
  MenuItem,
  Select,
  Chip,
  Autocomplete,
  Paper,
  Avatar,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { BiFilterAlt } from "react-icons/bi";

import CreateTickets from "./CreateTickets";
import {
  useDeleteTicketMutation,
  useGetmyTicketQuery,
  useGetAllTicketQuery,
  useLazySearchTicketsQuery,
  useSetupTicketMutation,
  useUpdateTicketStatusMutation,
} from "app/services/RTKApis/TicketManagementApis/Ticketmanagement";

import { toast } from "react-toastify";
import SearchBar from "app/pages/widgets/SearchField";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  CRMDateField,
  CustomButton,
  Cancelbutton,
  DateFormatter,
  DialogBox,
  Div,
  CustomTooltip,
  ChatIcon,
  UpdateIcon,
  EditIcon,
  DeletedIcon,
  Dragabledialog,
  Customgrid,
} from "app/pages/widgets/StylesComponents";

import FoyerDynamicTable from "app/pages/widgets/FoyerDynamicTable";

import {
  StyledTabs,
  StyledTab,
  DisplayFlex,
  dialogFontSize,
  input_label,
} from "app/pages/widgets/CRMStyles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import TicketOverview from "./TivketOverview";

const MyTickets = () => {
  const userId = parseInt(localStorage.getItem("UserId"));

  /* ---------------- STATE ---------------- */
  const [tabValue, setTabValue] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [showFilter, setShowFilter] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [searchData, setSearchData] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [Ticketsearch, setTicketSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [ChatDialogOpen, setChatDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [Overview, setOverview] = useState(null);

  const [message, setMessage] = useState("");

  const statusOptions = [
    { label: "New", value: "New" },
    { label: "Open", value: "Open" },
    { label: "In Progress", value: "In Progress" },
    { label: "Pending", value: "Pending" },
    { label: "Testing", value: "Testing" },
    { label: "Fixed", value: "Fixed" },
    { label: "Reopen", value: "Reopen" },
  ];
  const [newStatus, setNewStatus] = useState("");

  const chatData = [
    { name: "Pravin Raj", message: "Hey team!" },
    { name: "Ishwarya K", message: "Hello 👋" },
    { name: "Karthik S", message: "Let's start the meeting." },
  ];

  /* ---------------- API ---------------- */
  const { data: myTicketData } = useGetmyTicketQuery({ page });
  const { data: allTicketData } = useGetAllTicketQuery({ page });

  const [triggerSearch, { data: searchResults }] = useLazySearchTicketsQuery();

  const [setupTicket] = useSetupTicketMutation();

  /* ---------------- ACTIVE DATA ---------------- */
  const activeData = searchData
    ? searchResults
    : tabValue === 0
      ? myTicketData
      : allTicketData;

  useEffect(() => {
    if (activeData) {
      setTickets(activeData?.results || []);
      setCount(activeData?.count || 0);
    }
  }, [activeData]);

  /* ---------------- SEARCH ---------------- */
  useEffect(() => {
    if (searchData) {
      triggerSearch({
        search: searchData,
        page,
        type: tabValue === 0 ? "my" : "all",
      });
    }
  }, [searchData, page, tabValue]);

  /* ---------------- ASSIGN ---------------- */
  const handleAssign = async (ticketId, assignee) => {
    try {
      await setupTicket({
        payload: {
          id: ticketId,
          Assigned_Person: assignee,
          Updated_By: userId,
        },
        method: "PATCH",
      }).unwrap();

      toast.success("Assigned Successfully");
    } catch {
      toast.error("Assignment Failed");
    }
  };

  /*-----------------UPDATE STATUS --------------*/

  const [updateTicketStatus] = useUpdateTicketStatusMutation();

  const handleSaveStatus = async () => {
    try {
      await updateTicketStatus({
        id: selectedRow.id,
        Ticket_Status: newStatus,
      }).unwrap();
      toast.success("Status updated successfully");
      setStatusDialogOpen(false);
    } catch {
      toast.error("Failed to update status");
    }
  };

  /*-----------------Delete STATUS --------------*/

  const [deleteTicket] = useDeleteTicketMutation();

  const deleteItem = async (row) => {
    try {
      await deleteTicket(row.id).unwrap();
      toast.success("Deleted successfully");
      setSave(false);
    } catch {
      toast.error("Failed to delete defect");
    }
  };

  /* ---------------- UI COLORS ---------------- */
  const priorityColors = {
    "P0-Critical": "#FFCDD2",
    "P1-High": "#FFEBEE",
    "P2-Medium": "#FFFDE7",
    "P3-Low": "#E8F5E9",
    Low: "#E8F5E9", // Fallback
    Medium: "#FFFDE7",
    High: "#FFEBEE",
    Critical: "#FFCDD2",
  };

  const statusColors = {
    New: "#E3F2FD",
    Open: "#BBDEFB",
    "In Progress": "#FFF3E0",
    Pending: "#F5F5F5",
    Testing: "#E1BEE7",
    Fixed: "#C8E6C9",
    Reopen: "#FFCCBC",
    Resolved: "#C8E6C9", // Fallback
    Closed: "#ECEFF1",
  };

  /* ------------------- Filtering Logic ------------------- */
  const filteredTickets = () => {
    return tickets?.filter((t) => {
      const matchesSearch =
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.TicketManagement_Id?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter
        ? t.Ticket_Status === statusFilter
        : true;

      const matchesPriority = priorityFilter
        ? t.Priority === priorityFilter
        : true;

      const matchesDate =
        fromDate && toDate
          ? new Date(t.Created_Date) >= new Date(fromDate) &&
            new Date(t.Created_Date) <= new Date(toDate)
          : true;

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });
  };

  /*---------------------Search and Filter -------------------*/
  const handleTicketSearch = (value) => {
    setTicketSearch(value);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setOpenModal({ type: "create", data: null });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleTicketClearReset = () => {
    setTicketSearch("");
    setPage(1);
    setPage(1);
  };

  const handleClickOverviewContact = (data) => {
    setOverview(data);
  };

  const stringToColor = (string) => {
    let hash = 0;

    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 🎯 Generate HSL (best for light colors)
    const hue = hash % 360; // color variation
    const saturation = 60; // medium saturation
    const lightness = 75; // light color (IMPORTANT)

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  /* ---------------- RENDER ---------------- */
  return (
    <>
      {Overview ? (
        <TicketOverview rowData={Overview} onBack={() => setOverview(null)} />
      ) : (
        <>
          <JumboContentLayoutMain>
            <Box>
              {/* HEADER */}

              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2 items-center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton onClick={(e) => setShowFilter(e.currentTarget)}>
                      <BiFilterAlt size={22} />
                    </IconButton>

                    <StyledTabs
                      value={tabValue}
                      onChange={(e, val) => {
                        setTabValue(val);
                        setPage(1);
                        setSearchData("");
                      }}
                    >
                      <StyledTab
                        label={`My Tickets (${myTicketData?.count || 0})`}
                      />
                      <StyledTab
                        label={`All Tickets (${allTicketData?.count || 0})`}
                      />
                    </StyledTabs>
                  </Stack>
                </div>

                {/* RIGHT SIDE: SEARCH + CREATE */}
                <div className="flex gap-2">
                  <SearchBar
                    SearchData={(e) => handleTicketSearch(e.target.value)}
                    onClear={handleTicketClearReset}
                    width={"250px !important"}
                    color={"black"}
                    border={"1px solid lightgray"}
                  />
                  <CustomButton
                    label="Create Ticket"
                    Icon="createIcon"
                    width={180}
                    onClick={handleOpenCreate}
                  />
                </div>
              </div>

              {/* Filter Popover */}
              <Popover
                open={Boolean(showFilter)}
                anchorEl={showFilter}
                onClose={() => setShowFilter(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              >
                <Box sx={{ p: 2, maxWidth: 350 }}>
                  <Grid container spacing={2}>
                    {/* Search Ticket */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Search Ticket
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search by ticket title or number"
                        className="input-box2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Grid>

                    {/* Status Filter */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Status
                      </Typography>
                      <Autocomplete
                        className="search-select3"
                        options={["All Status", ...Object.keys(statusColors)]}
                        value={statusFilter || "All Status"}
                        onChange={(e, val) =>
                          setStatusFilter(val === "All Status" ? "" : val)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select status"
                            className="input-box2"
                          />
                        )}
                      />
                    </Grid>

                    {/* Priority Filter */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Priority
                      </Typography>
                      <Autocomplete
                        className="search-select3"
                        options={[
                          "All Priority",
                          ...Object.keys(priorityColors),
                        ]}
                        value={priorityFilter || "All Priority"}
                        onChange={(e, val) =>
                          setPriorityFilter(val === "All Priority" ? "" : val)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select priority"
                            className="input-box2"
                          />
                        )}
                      />
                    </Grid>

                    {/* From Date */}
                    <Grid item xs={6} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        From Date
                      </Typography>
                      <CRMDateField
                        type="date"
                        fullWidth
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </Grid>

                    {/* To Date */}
                    <Grid item xs={6} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        To Date
                      </Typography>
                      <CRMDateField
                        type="date"
                        fullWidth
                        size="small"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        disabled={!fromDate}
                        inputProps={{ min: fromDate }}
                      />
                    </Grid>

                    {/* Buttons */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <CustomButton
                        Icon="applyIcon"
                        label="Apply"
                        onClick={() => filteredTickets()}
                      />
                      <Cancelbutton onClick={() => setShowFilter(null)} />
                    </Grid>
                  </Grid>
                </Box>
              </Popover>

              {/* TABLE */}
              {/* Note: I'm using Div here because FoyerDynamicTable might not be directly available or exported correctly yet. 
                  In IT-CRM it was a separate widget. I will need to check if SuperAdmin has it or migrate it. */}
              {/* For now, let's assume it's in StylesComponents or I'll migrate it soon. */}
              <FoyerDynamicTable
                rowKey="id"
                data={tickets}
                columnsConfig={[
                  {
                    key: "TicketManagement_Id",
                    label: "Ticket No",
                    onClick: (row) => handleClickOverviewContact(row),
                    sticky: true,
                    render: (row) => (
                      <Typography
                        fontWeight={700}
                        fontSize="16px"
                        color={"#1565b5"}
                      >
                        {`${row?.TicketManagement_Id}`}
                      </Typography>
                    ),
                  },
                  { key: "Related_Module", label: "Ticket Name" },
                  {
                    key: "Priority",
                    label: "Priority",
                    render: (row) => (
                      <Chip
                        label={row.Priority}
                        sx={{
                          backgroundColor: priorityColors[row.Priority],
                          width: 90,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 500,
                          "& .MuiChip-label": {
                            width: "100%",
                            textAlign: "center",
                            padding: 0,
                          },
                        }}
                      />
                    ),
                  },
                  {
                    key: "Ticket_Status",
                    label: "Status",
                    render: (row) => (
                      <Chip
                        label={row.Ticket_Status}
                        sx={{
                          backgroundColor: statusColors[row.Ticket_Status],
                          width: 90,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 500,
                          "& .MuiChip-label": {
                            width: "100%",
                            textAlign: "center",
                            padding: 0,
                          },
                        }}
                      />
                    ),
                  },
                  {
                    key: "Assigned_Person",
                    label: "Assigned To",
                    render: (row) => {
                      const name = row.Assigned_Person || "Unassigned";
                      const bgColor = stringToColor(name);
                      return (
                        <Div
                          sx={{
                            backgroundColor: bgColor,
                            color: "#1a1a1a",
                            borderRadius: "10px",
                            height: 32,
                            width: 120,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 500,
                            fontSize: "13px",
                          }}
                        >
                          {name}
                        </Div>
                      );
                    },
                  },
                  {
                    key: "Created_Date",
                    label: "Start Date",
                    width: "150px",
                    render: (row) => <DateFormatter date={row?.Created_Date} />,
                  },
                  {
                    key: "actions",
                    label: "Actions",
                    width: "180px",
                    render: (row) => {
                      const isMyDefect = tabValue === 1;
                      return (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <CustomTooltip value="Chat" type="children">
                            <ChatIcon
                              onClick={() => {
                                setSelectedRow(row);
                                setChatDialogOpen(true);
                              }}
                            />
                          </CustomTooltip>
                          <CustomTooltip value="Update Status" type="children">
                            <UpdateIcon
                              onClick={() => {
                                setSelectedRow(row);
                                setNewStatus(row?.Ticket_Status);
                                setStatusDialogOpen(true);
                              }}
                            />
                          </CustomTooltip>
                          {!isMyDefect && (
                            <>
                              <CustomTooltip value="Edit" type="children">
                                <EditIcon
                                  onClick={() =>
                                    setOpenModal({ type: "edit", data: row })
                                  }
                                />
                              </CustomTooltip>
                              <CustomTooltip value="Delete" type="children">
                                <DeletedIcon onClick={() => setSave(row)} />
                              </CustomTooltip>
                            </>
                          )}
                        </Box>
                      );
                    },
                  },
                ]}
                page={page}
                count={count}
                handleChangePage={(p) => setPage(p)}
              />
            </Box>

            {/* CREATE / EDIT */}
            <CreateTickets
              key={
                openModal?.type === "create" ? "create" : openModal?.data?.id
              }
              open={Boolean(openModal)}
              setOpen={handleCloseModal}
              type={openModal?.type === "edit" ? "Edit" : "Create"}
              currentData={openModal?.data || null}
            />

            {/* DELETE DIALOG */}
            <DialogBox
              open={Boolean(save)}
              Content={"Are you sure you want to delete this defect?"}
              onClickNo={() => setSave(false)}
              onClickYes={() => deleteItem(save)}
            />

            <Dragabledialog open={Boolean(statusDialogOpen)}>
              <DialogTitle
                sx={[
                  DisplayFlex,
                  dialogFontSize,
                  { justifyContent: "space-between" },
                ]}
                style={{ cursor: "move" }}
                id="draggable-dialog-title"
              >
                Update Ticket Status
              </DialogTitle>

              <DialogContent>
                <DialogContentText sx={{ pt: 2 }}>
                  <Customgrid>
                    <Grid item>
                      <Typography sx={[input_label]}>Change Status</Typography>
                    </Grid>
                    <Grid item className="col-12 input-box2">
                      <Autocomplete
                        sx={{ width: "250px" }}
                        options={statusOptions}
                        getOptionLabel={(option) => option?.label || ""}
                        value={
                          statusOptions.find((s) => s.value === newStatus) ||
                          null
                        }
                        onChange={(event, newValue) => {
                          setNewStatus(newValue ? newValue.value : "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Status"
                            sx={{
                              backgroundColor: "#f9f9f9",
                              borderRadius: "8px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Customgrid>
                </DialogContentText>

                <DialogActions sx={[DisplayFlex, { justifyContent: "center" }]}>
                  <CustomButton
                    label="Save"
                    Icon="saveIcon"
                    onClick={handleSaveStatus}
                  />
                  <Cancelbutton
                    label="Cancel"
                    onClick={() => setStatusDialogOpen(false)}
                  />
                </DialogActions>
              </DialogContent>
            </Dragabledialog>

            {/* Chat Dialog and other parts would go here, simplified for now */}
          </JumboContentLayoutMain>
        </>
      )}
    </>
  );
};

export default MyTickets;
