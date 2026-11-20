import React from 'react'
import Chatbot from './Chatbot'
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import Div from '@jumbo/shared/Div';
import { ComponentHeading } from 'app/pages/widgets/CRMStyles';
import { Card, CardContent, Typography, Grid } from '@mui/material';
// import {
//   Button,
//   Card,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   FormControl,

//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Select,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   TablePagination,
//   FormControlLabel,
//   Checkbox,
//   Menu,
//   FormGroup,
//   Autocomplete,
//   Pagination,
//   DialogTitle,
// } from "@mui/material";



const ChatandSupport = () => {
  return (
    <JumboContentLayoutMain>
      <Div>
        <Typography sx={{ fontWeight: 600, fontSize: "18px", paddingBottom: "10px" }}>
          Support & Chat
        </Typography>
      </Div>

      <Div sx={{ minHeight: "150px" }}>
        <Typography sx={{ padding: "5px" }}>
          Our support team is here to help you with any questions or concerns you may have regarding our products or services.
          Our support team is available 24/7 to assist you. If you reach out outside of these hours, don't worry, we'll get back to you as soon as possible during our next available time.
          We offer assistance with product information, troubleshooting, account management, and any other inquiries you may have.
        </Typography>
        <Typography sx={{ padding: "5px" }}>
          We strive to respond to all inquiries promptly. Please allow up to 1hrs for a representative to assist you
          Our support agents are currently available to assist you. Feel free to start a conversation and we'll be with you shortly.
          In addition to this chat module, you can also reach us via email at support@foyetech.com or by phone at 8618720989.
        </Typography>
        <Typography sx={{ padding: "5px" }}>
          Your privacy and security are important to us. Rest assured that all conversations are kept confidential and secure.
          We're constantly striving to improve our support services. If you have any feedback or suggestions, please let us know!
          Thank you for contacting our support team! We hope we were able to assist you. If you have any further questions, don't hesitate to reach out. Have a great day!
        </Typography>
      </Div>


      <hr />
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ borderRight: "2px solid grey" }}>
          <Card>
            <CardContent>
              <Typography variant="h2" component="div">
                Contact Details
              </Typography>
              <Typography>
                Email: support@foyetech.com
              </Typography>
              <Typography>
                Phone: 8618720989
              </Typography>
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={5}>
          <Card>
            <CardContent>
              <Typography  variant="h2" component="div">
                Chat Now
              </Typography>
              <Typography>
                Start a conversation with our support team:
              </Typography>
              {/* <Chatbot /> */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={1}>
          <Chatbot />
        </Grid>
      </Grid>
    </JumboContentLayoutMain>
  )
}

export default ChatandSupport
