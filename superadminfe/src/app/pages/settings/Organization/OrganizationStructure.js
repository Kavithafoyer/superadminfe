import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import {
  Typography,
  Tab,
  Box,
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React from "react";
import Setting from "../Setting";
import Div from "@jumbo/shared/Div";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import JumboScrollbar from "@jumbo/components/JumboScrollbar/JumboScrollbar";

export default function OrganizationStructure() {
  const [value, setValue] = useState("1");
  const [open, setOpen] = React.useState(false);

  const handleAddLegalEntity = () => {
    setOpen(true);
  };

  const handleAddCountry = () => {
    setOpen(true);
  };

  const handleAddCity = () => {
    setOpen(true);
  };

  const handleAddState = () => {
    setOpen(true);
  };

  const handleAddPartner = () => {
    setOpen(true);
  };

  const handleAddRegion = () => {
    setOpen(true);
  };

  const handleAddZones = () => {
    setOpen(true);
  };

  const handleAddHub = () => {
    setOpen(true);
  };

  // const handleAddLocation = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (index, newValue) => {
    setValue(newValue, index);
  };

  // const handleChangeIndex = (index) => {
  //   setValue(index);
  // };

  return (
    <>
      <JumboContentLayoutMain>
        <Setting />
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Organization Structure
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Users shall use this form to set up the Organization structure for all
          operational activities.
        </Typography>

        <Div>
          <TabContext value={value}>
            <Box
              sx={{
                // width: "fit-content",
                borderBottom: 0,
                borderColor: "divider",
                overflowX: "auto",
                mb: -1,
              }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Legal Entity"
                  value="1"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
                <Tab
                  label="Country"
                  value="2"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
                <Tab
                  label="Region"
                  value="5"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
                <Tab
                  label="State"
                  value="3"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
                <Tab
                  label="City"
                  value="4"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />

                {/* <Tab
                  label="Partner"
                  value="6"
                  sx={{ fontSize: "16px", color: "#000000" }}
                /> */}
                <Tab
                  label="Zones"
                  value="7"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
                {/* <Tab
                  label="Hub"
                  value="8"
                  sx={{ fontSize: "16px", color: "#000000" }}
                /> */}
                <Tab
                  label="Location"
                  value="9"
                  sx={{ fontSize: "16px", color: "#000000" }}
                />
              </TabList>
            </Box>

            <TabPanel value="1" index="1" sx={{ ml: -3 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button
                    className="save-buttonuser"
                    onClick={handleAddLegalEntity}
                  >
                    {" "}
                    + Add Legal Entity
                  </Button>
                </Div>
                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Legal Entity Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Legal Entity Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>

            <TabPanel value="2" index="2" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button
                    className="save-buttonuser"
                    onClick={handleAddCountry}
                  >
                    {" "}
                    + Add Country
                  </Button>
                </Div>
                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Country Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Country Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="3" index="3" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddState}>
                    {" "}
                    + Add state
                  </Button>
                </Div>
                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          State Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="State Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="4" index="4" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                    // display: "flex",
                    // justifyContent: "flex-end",
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddCity}>
                    {" "}
                    + Add City
                  </Button>
                </Div>

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          City Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="City Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="5" index="5" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddRegion}>
                    {" "}
                    + Add Region
                  </Button>
                </Div>

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Region Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Region Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="6" index="6" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button
                    className="save-buttonuser"
                    onClick={handleAddPartner}
                  >
                    {" "}
                    + Add Partner
                  </Button>
                </Div>

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Partner Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Partner Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="7" index="7" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                    // display: "flex",
                    // justifyContent: "flex-end",
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddZones}>
                    {" "}
                    + Add Zones
                  </Button>
                </Div>

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Zone Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Zone Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="8" index="8" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddHub}>
                    {" "}
                    + Add Hub
                  </Button>
                </Div>

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Hub Name <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Hub Name"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
            <TabPanel value="9" index="9" sx={{ ml: -2 }}>
              <Div
                className="card"
                sx={{ p: 2, minHeight: "300px", borderRadius: 0, m: 0 }}
              >
                {/* <Div
                  sx={{
                    position: "absolute",
                    right: 15,
                    // display: "flex",
                    // justifyContent: "flex-end",
                  }}
                >
                  <Button className="save-buttonuser" onClick={handleAddLocation}>
                    {" "}
                    + Add Location
                  </Button>
                </Div> */}

                <Grid container>
                  <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: -1 } }}>
                    <JumboScrollbar
                      autoHeight={true}
                      autoHideTimeout={4000}
                      autoHeightMin={300}
                      autoHide={true}
                      hideTracksWhenNotNeeded
                      id="no-more-tables"
                    >
                      <Table
                        className="table table-borderless"
                        sx={{ minWidth: { xs: "auto", sm: 600 } }}
                      >
                        <TableHead>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              className="col-2"
                              sx={{ fontWeight: 600 }}
                            >
                              Address
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow className="row">
                            <TableCell
                              className="col-2"
                              data-title="Name"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Description"
                            ></TableCell>
                            <TableCell
                              className="col-2"
                              data-title="Address"
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </JumboScrollbar>
                  </Grid>
                </Grid>
              </Div>

              <div>
                <Dialog
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <Grid container>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Location <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 input-box"
                          id="outlined-basic"
                          placeholder="Location"
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Description <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Description"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <Typography className="col-12 input-label">
                          Address <span className="required">*</span>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: 1.5 }}>
                        <TextField
                          className="col-12 multiline-box"
                          id="outlined-basic"
                          placeholder="Address"
                          multiline
                          rows={3}
                          variant="outlined"
                          sx={{ minWidth: "280px", maxWidth: "1005px" }}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      className="save-buttonuser"
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleClose}
                      className="cancel-buttonuser"
                      autoFocus
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </TabPanel>
          </TabContext>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
}
