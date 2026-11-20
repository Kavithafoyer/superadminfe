import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  DialogTitle,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  useGetAssignedTicketQuery,
  useLazySearchTicketsQuery,
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
} from "app/services/RTKApis/TicketManagementApis/Ticketmanagement";
import { toast } from "react-toastify";
import SearchBar from "app/pages/widgets/SearchField";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  DialogBox,
  Div,
  CustomTooltip,
  UpdateIcon,
  DeletedIcon,
  Dragabledialog,
  CustomButton,
  Cancelbutton,
} from "app/pages/widgets/StylesComponents";
import FoyerDynamicTable from "app/pages/widgets/FoyerDynamicTable";
import { dialogFontSize, DisplayFlex } from "app/pages/widgets/CRMStyles";
import RecievedTicketOverview from "./RecievedTicketOverview";

const ReceivedTickets = () => {
  const userId = parseInt(localStorage.getItem("UserId"));

  const [tickets, setTickets] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [Ticketsearch, setTicketSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [save, setSave] = useState(false);
  const [Overview, setOverview] = useState(null);

  const { data: assignedTicketData } = useGetAssignedTicketQuery({ page });
  const [triggerSearch, { data: searchResults }] = useLazySearchTicketsQuery();

  useEffect(() => {
    const data = Ticketsearch ? searchResults : assignedTicketData;
    if (data) {
      setTickets(data?.results || []);
      setCount(data?.count || 0);
    }
  }, [assignedTicketData, searchResults, Ticketsearch]);

  const handleTicketSearch = (value) => {
    setTicketSearch(value);
    setPage(1);
    if (value) triggerSearch({ search: value, page: 1, type: "assigned" });
  };

  const handleTicketClearReset = () => {
    setTicketSearch("");
    setPage(1);
  };

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

  const [deleteTicket] = useDeleteTicketMutation();
  const deleteItem = async (row) => {
    try {
      await deleteTicket(row.id).unwrap();
      toast.success("Deleted successfully");
      setSave(false);
    } catch {
      toast.error("Failed to delete ticket");
    }
  };

  const statusColors = {
    New: "#E3F2FD",
    Open: "#BBDEFB",
    "In Progress": "#FFF3E0",
    Pending: "#F5F5F5",
    Testing: "#E1BEE7",
    Fixed: "#C8E6C9",
    Reopen: "#FFCCBC",
    Closed: "#ECEFF1",
  };

  const priorityColors = {
    "P0-Critical": "#FFCDD2",
    "P1-High": "#FFEBEE",
    "P2-Medium": "#FFFDE7",
    "P3-Low": "#E8F5E9",
  };

  return (
    <>
      {Overview ? (
        <RecievedTicketOverview
          rowData={Overview}
          onBack={() => setOverview(null)}
        />
      ) : (
        <JumboContentLayoutMain>
          <Box>
            <div className="flex items-center justify-between mb-2">
              <Typography variant="h5" fontWeight={600}>
                Received Tickets
              </Typography>
              <div className="flex gap-2">
                <SearchBar
                  SearchData={(e) => handleTicketSearch(e.target.value)}
                  onClear={handleTicketClearReset}
                  width={"250px"}
                  color={"black"}
                  border={"1px solid lightgray"}
                />
              </div>
            </div>

            <FoyerDynamicTable
              rowKey="id"
              data={tickets}
              columnsConfig={[
                {
                  key: "TicketManagement_Id",
                  label: "Ticket No",
                  render: (row) => (
                    <Typography
                      fontWeight={700}
                      fontSize="16px"
                      color={"#1565b5"}
                      onClick={() => setOverview(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.TicketManagement_Id}
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
                        backgroundColor: priorityColors[row.Priority] || "#eee",
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
                        backgroundColor:
                          statusColors[row.Ticket_Status] || "#eee",
                      }}
                    />
                  ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <CustomTooltip value="Update Status" type="children">
                        <UpdateIcon
                          onClick={() => {
                            setSelectedRow(row);
                            setNewStatus(row?.Ticket_Status);
                            setStatusDialogOpen(true);
                          }}
                        />
                      </CustomTooltip>
                      <CustomTooltip value="Delete" type="children">
                        <DeletedIcon onClick={() => setSave(row)} />
                      </CustomTooltip>
                    </Box>
                  ),
                },
              ]}
              page={page}
              count={count}
              handleChangePage={(p) => setPage(p)}
            />
          </Box>

          <DialogBox
            open={Boolean(save)}
            Content={"Are you sure you want to delete this ticket?"}
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
              id="draggable-dialog-title"
            >
              Update Status
            </DialogTitle>
            <Box sx={{ p: 3 }}>
              <Autocomplete
                options={Object.keys(statusColors)}
                value={newStatus}
                onChange={(e, val) => setNewStatus(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <CustomButton
                  label="Save"
                  Icon="saveIcon"
                  onClick={handleSaveStatus}
                />
                <Cancelbutton onClick={() => setStatusDialogOpen(false)} />
              </Box>
            </Box>
          </Dragabledialog>
        </JumboContentLayoutMain>
      )}
    </>
  );
};

export default ReceivedTickets;
