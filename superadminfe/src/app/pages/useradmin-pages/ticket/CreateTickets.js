import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import {
  Cancelbutton,
  CustomButton,
  Div,
} from "app/pages/widgets/StylesComponents";
import { toast } from "react-toastify";
import { useSetupTicketMutation } from "app/services/RTKApis/TicketManagementApis/Ticketmanagement";
import { DisplayFlex, dialogFontSize, input_label } from "app/pages/widgets/CRMStyles";

const CreateTickets = ({ open, setOpen, type, currentData }) => {
  const userId = localStorage.getItem("UserId");
  const [formData, setFormData] = useState({
    Ticket_Name: "",
    Priority: "Low",
    Ticket_Description: "",
    Ticket_Status: "New",
  });

  const [setupTicket, { isLoading }] = useSetupTicketMutation();

  useEffect(() => {
    if (type === "Edit" && currentData) {
      setFormData({
        Ticket_Name: currentData.Related_Module || "",
        Priority: currentData.Priority || "Low",
        Ticket_Description: currentData.Ticket_Description || "",
        Ticket_Status: currentData.Ticket_Status || "New",
      });
    }
  }, [type, currentData]);

  const handleSave = async () => {
    if (!formData.Ticket_Name) {
      toast.error("Please enter ticket name");
      return;
    }

    try {
      const payload = {
        ...formData,
        Created_By: userId,
        Updated_By: userId,
        ...(type === "Edit" && { id: currentData.id }),
      };

      await setupTicket({
        payload,
        method: type === "Edit" ? "PATCH" : "POST",
      }).unwrap();

      toast.success(`${type} Successful`);
      setOpen(false);
    } catch (err) {
      toast.error(`${type} Failed`);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={[DisplayFlex, dialogFontSize]}>
        {type} Ticket
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography sx={[input_label]}>Ticket Name</Typography>
            <TextField
              fullWidth
              size="small"
              value={formData.Ticket_Name}
              onChange={(e) => setFormData({ ...formData, Ticket_Name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={[input_label]}>Priority</Typography>
            <Autocomplete
              options={["Low", "Medium", "High", "Critical"]}
              value={formData.Priority}
              onChange={(e, val) => setFormData({ ...formData, Priority: val })}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={[input_label]}>Status</Typography>
            <Autocomplete
              options={["New", "Open", "In Progress", "Pending", "Fixed", "Closed"]}
              value={formData.Ticket_Status}
              onChange={(e, val) => setFormData({ ...formData, Ticket_Status: val })}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={[input_label]}>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={formData.Ticket_Description}
              onChange={(e) => setFormData({ ...formData, Ticket_Description: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 3 }}>
        <CustomButton
          label={isLoading ? "Saving..." : "Save"}
          Icon="saveIcon"
          onClick={handleSave}
          disabled={isLoading}
        />
        <Cancelbutton onClick={() => setOpen(false)} />
      </DialogActions>
    </Dialog>
  );
};

export default CreateTickets;
