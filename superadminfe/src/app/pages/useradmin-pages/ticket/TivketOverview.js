import React from "react";
import { Box, Typography, IconButton, Grid, Chip } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { Div } from "app/pages/widgets/StylesComponents";

const TivketOverview = ({ rowData, onBack }) => {
    return (
        <JumboContentLayoutMain>
            <Box sx={{ p: 3, background: "#f4f5f7", borderRadius: 2, height: "100%", overflowY: "auto" }}>
                <IconButton onClick={onBack} sx={{ mb: 2 }}>
                    <IoIosArrowBack />
                </IconButton>
                <Typography variant="h5" fontWeight={600} mb={3}>Ticket Details: {rowData?.TicketManagement_Id}</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ p: 3, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
                            <Typography variant="h6" mb={2}>Subject</Typography>
                            <Typography variant="body1" mb={3}>{rowData?.Ticket_Name}</Typography>
                            <Typography variant="h6" mb={2}>Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{rowData?.Ticket_Description || "No description provided."}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, background: "#fff", borderRadius: 2, boxShadow: 1 }}>
                            <Typography variant="h6" mb={2}>Attributes</Typography>
                            <Div sx={{ mb: 2 }}>
                                <Typography variant="caption" color="textSecondary">Status</Typography>
                                <Typography variant="body2" fontWeight={600}>{rowData?.Ticket_Status}</Typography>
                            </Div>
                            <Div sx={{ mb: 2 }}>
                                <Typography variant="caption" color="textSecondary">Priority</Typography>
                                <Typography variant="body2" fontWeight={600}>{rowData?.Priority}</Typography>
                            </Div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </JumboContentLayoutMain>
    );
};

export default TivketOverview;
