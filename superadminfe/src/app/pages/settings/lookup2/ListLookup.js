import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
  FormControlLabel,
  Checkbox,
  Menu,
  FormGroup,
  Pagination,
  Popover,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CreateLookup from "./CreateLookup";
import lookUpService from "app/services/lookUp-Service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import { CheckBox } from "@mui/icons-material";
import { apiConfig, BASE_URL } from "app/services/config";
import axios from "axios";
import { format } from "date-fns";
import {
  ButtonStyle,
  Colors,
  ComponentHeading,
  CRMTableHead,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  UploadBtn,
} from "app/pages/widgets/CRMStyles";
import { DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/cjs/data-grid";
import EditeLookup from "./EditeLookup";
import {
  Cancelbutton,
  CRMDateField,
  CustomButton,
  DateFormatter,
  DeletedIcon,
  EditIcon,
} from "app/pages/widgets/StylesComponents";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { CRMTableCell } from "app/pages/widgets/CRMTable";
import { GrPowerReset } from "react-icons/gr";
import SearchBar from "app/pages/widgets/SearchField";

const ListLookup = ({ scrollHeight }) => {
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const header = {
    headers: {
      db: item,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const navigate = useNavigate();
  const [transfer, setTransfer] = useState([]);
  const [value, setValue] = useState("My Request");
  const [createLookup, setCreateLookup] = useState(false);
  const [viewLookup, setViewLookup] = useState(false);
  const [listLookup, setListLookup] = useState(true);
  const [datas, setDatas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // For filter Functionality
  const [showFilter, setShowFilter] = useState(false);
  const [meg, setMeg] = useState("");
  const [module, setModule] = useState("");
  const [fromdate, setFromdate] = useState(new Date().toISOString());
  const [todate, setToDate] = useState(new Date().toISOString());

  // for search
  const [searchData, setSearchData] = useState("");

  // For the Pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [columnItems, setColumnItems] = useState([
    { sort: "Created_Date", label: "Date", bool: true, width: "120px" },
    { sort: "Lookupid", label: "Lookup Id", bool: true },
    { sort: "Lookupname", label: "Lookup Name", bool: true },
    { sort: "Purpose", label: "Purpose", bool: true },
    { sort: "No.of Values", label: "Values", bool: true },
  ]);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  //code for table sorting
  const sortData = (key, direction) => {
    const sortedData = [...datas];

    sortedData.sort((a, b) => {
      const valueA = typeof a[key] === "string" ? a[key].toLowerCase() : a[key];
      const valueB = typeof b[key] === "string" ? b[key].toLowerCase() : b[key];

      if (valueA < valueB) {
        return direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setDatas(sortedData);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
    setShowsort(false);
  };

  const ShowCreateLookupForm = () => {
    // navigate("/lookup/create-lookup");
    setCreateLookup(true);
    setListLookup(false);
    setTransfer([]);
  };

  const handleDeletePopup = (item) => {
    // alert(item.Lookupid)
    lookUpService
      .DeleteUserLookUp(item?.id)
      .then((response) => {
        console.log(response?.data);
        toast.success(response?.data);
        lookUpRecords();
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.log(error);
      })
      .finally(() => {});
  };

  const updateData = (data) => {
    setCreateLookup("update");
    setListLookup(false);
    setTransfer(data);
  };

  const RefreshData = () => {};

  const filterSubmit = async () => {};

  const handleSearchData = async (e) => {
    var data = e.target.value;
    if (data) {
      try {
        const response = await axios.get(
          `${BASE_URL}crmfarmsa/useradmin/Userlookupsearch/?search=${data}`,
          header
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      lookUpRecords();
    }
  };

  const lookUpRecords = async () => {
    await axios
      .get(`${BASE_URL}crmfarmsa/useradmin/Userlookuplistwithpagination/`, header)
      .then((response) => {
        console.log("responsesssss", response?.data);
        setDatas(response?.data?.results);
        setCount(response?.data?.count);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    lookUpRecords();
  }, []);

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ display: listLookup === true ? "block" : "none" }}>
          <Typography sx={[{ fontSize: "20px", fontWeight: 600 }]}>
            Lookup
          </Typography>
          <Typography sx={[{ fontSize: "18px", fontWeight: 600 }]}>
            List View
          </Typography>

          <Grid container spacing={1} sx={{ mt: 2, mb: 1 }}>
            <Grid
              className="filter"
              item
              xs={12}
              md={7}
              sm={12}
              xl={7}
              sx={{ display: "flex", flexDirection: "row" }}
            >
              <IconButton
                sx={{ color: Colors?.Mblue }}
                onClick={(e) => setShowFilter(e.currentTarget)}
                // onClick={ShowFilter}
              >
                <BiFilterAlt size={22} />
              </IconButton>

              {/* code for filter popup */}
              <Popover
                open={Boolean(showFilter)}
                anchorEl={showFilter}
                onClose={() => setShowFilter(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{ minWidth: "400px", width: { xs: "100%", md: "40%" } }}
              >
                <Box>
                  <Div
                    sx={[
                      DisplayFlex,
                      CRMTableHead,
                      dialogTitle,
                      { px: 2, justifyContent: "space-between" },
                    ]}
                  >
                    <Typography id="Typography-root" sx={[dialogTitle]}>
                      Filters
                    </Typography>
                    <IconButton sx={{ mr: -1 }} onClick={RefreshData}>
                      <GrPowerReset size={16} />
                    </IconButton>
                  </Div>

                  <form style={{ padding: "1rem" }} onSubmit={filterSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Lookup Name
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box"
                          autoComplete="off"
                          placeholder="Lookup Name"
                          // value={lookupName}
                          // onChange={(e) => {
                          //   setLookupName(e.target.value);
                          // }}
                          sx={{ mt: -0.5 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Lookup Id
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box"
                          autoComplete="off"
                          placeholder="Lookup Id"
                          // value={meg}
                          // onChange={(e) => {
                          //   setMeg(e.target.value);
                          // }}
                          sx={{ mt: -0.5 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          From Date
                        </Typography>
                        <CRMDateField
                          id="fromdate"
                          name="fromdate"
                          inputValue={fromdate}
                          handleInputChange={(e) => setFromdate(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          To Date
                        </Typography>
                        <CRMDateField
                          id="todate"
                          name="todate"
                          inputValue={todate}
                          handleInputChange={(e) => setToDate(e.target.value)}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>

                    <Div
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                        gap: "10px",
                      }}
                    >
                      <CustomButton
                        type="submit"
                        label="Apply"
                        Icon="filterIcon"
                      />
                      <Cancelbutton onClick={() => setShowFilter(null)} />
                    </Div>
                  </form>
                </Box>
              </Popover>
            </Grid>

            <Grid item xs={12} md={3} sm={12} xl={3}>
              <SearchBar SearchData={handleSearchData} value={searchData} />
              {/* <TextField
                className="col-12 input-box2"
                id="outlined-search"
                type="search"
                value={searchData}
                onChange={handleSearchData}
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineSearch size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 150, mt: { xs: 0.5, md: 0 } }} */}
              {/* /> */}
            </Grid>

            <Grid
              item
              xs={12}
              md={2}
              sm={12}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              {/* <Button
                type="button"
                sx={[ButtonStyle, UploadBtn, {
                  mt: { xs: 0.5, md: 0 },
                  ml: 1,
                }]}
                onClick={ShowCreateLookupForm}
              >
                Create
              </Button> */}
              <CustomButton
                onClick={ShowCreateLookupForm}
                label="Create"
                Icon="createIcon"
                endIcon={true}
                sx={{ textAlign: "right" }}
              />
            </Grid>
          </Grid>

          {/* code for Lookup list table */}
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={"55vh"}
            id="no-more-tables"
          >
            <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
              <CustomTableHeader
                headerMenuItems={columnItems}
                setHeadermenuItems={setColumnItems}
                sortDatas={datas}
                setDatas={setDatas}
              />
              <TableBody>
                {datas?.length > 0 ? (
                  datas?.map((data, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: "#F3F3F3",
                          },
                          // hide last border
                          "td, th": {
                            border: "0px solid !important",
                            // height: "35px !important",
                            marginY: "10px !important",
                            padding: "10px !important",
                          },
                        }}
                      >
                        {columnItems[0].bool && (
                          <CRMTableCell data-title="Date">
                            <Typography sx={[FontStyle]}>
                              <DateFormatter date={data?.Created_Date} />
                            </Typography>
                            <Typography></Typography>
                          </CRMTableCell>
                        )}
                        {columnItems[1].bool && (
                          <CRMTableCell data-title="Lookup Id">
                            <Typography sx={[FontStyle]}>
                              {data?.Lookupid || "-"}
                            </Typography>
                          </CRMTableCell>
                        )}
                        {columnItems[2].bool && (
                          <CRMTableCell data-title="Lookup Name">
                            <Typography sx={[FontStyle]}>
                              {data?.Lookupname || " - "}
                            </Typography>
                          </CRMTableCell>
                        )}
                        {columnItems[3].bool && (
                          <CRMTableCell data-title="Purpose">
                            <Typography sx={[FontStyle]}>
                              {data?.Purpose || " - "}
                            </Typography>
                          </CRMTableCell>
                        )}
                        {columnItems[4].bool && (
                          <CRMTableCell data-title="Values">
                            <Typography sx={[FontStyle]}>
                              {data?.Values?.length || " 0 "}
                            </Typography>
                          </CRMTableCell>
                        )}
                        <CRMTableCell
                          align="center"
                          data-title="Action"
                          sx={[
                            DisplayFlex,
                            {
                              cursor: "pointer",
                              mb: 1,
                              justifyContent: { xs: "flex-end", sm: "center" },
                            },
                          ]}
                        >
                          <EditIcon
                            onClick={(e) => {
                              updateData(data?.data);
                            }}
                          />

                          <DeletedIcon
                            onClick={() => {
                              handleDeletePopup(data?.data);
                            }}
                          />
                        </CRMTableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow align="center">
                    <CRMTableCell colSpan={columnItems?.length + 1}>
                      No Records
                    </CRMTableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* <DataGrid
              dataSource={datas}
              showBorders={true}
              remoteOperations={true}
            >
              <Column
                visible={showdate}
                dataField="formattedDate"
                dataType="date"
                caption="Date"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important", minWidth: "100px", }}>
                    Date
                  </div>
                )}
                cellRender={(data) => (
                  <Typography sx={[FontStyle,]}>{format(new Date(data?.data?.Created_Date.split("T")[0]), dateformat)}</Typography>
                )}
              />

              <Column
                visible={showlookupid}
                dataField='Lookupid'
                dataType="string"
                caption="Lookup Id"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important", minWidth: "100px", }}>
                    Lookup Id
                  </div>
                )}
                cellRender={(data, idx) => (
                  <>
                    {
                      <Typography sx={[FontStyle,]}>{data?.data?.Lookupid}</Typography>
                    }</>)}
              />

              <Column
                visible={showlookupname}
                dataField="Lookupname"
                dataType="string"
                caption="Lookup Name"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important" }}>
                    Lookup Name
                  </div>
                )}
                cellRender={(data) => (
                  <>
                    {<Typography sx={[FontStyle,]}>{data?.data?.Lookupname}</Typography>}
                  </>
                )}
              />

              <Column
                visible={showdetails}
                dataField='Purpose'
                dataType="string"
                caption="Purpose"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important", minWidth: "100px", }}>
                    Purpose
                  </div>
                )}
                cellRender={(data) => (
                  <>
                    {<Typography sx={[FontStyle,]}>{data?.data?.Purpose}</Typography>}
                  </>
                )}
              />

              <Column
                visible={showvalues}
                dataType="string"
                caption="No. of Values"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important", minWidth: "100px", }}>
                    No.of Values
                  </div>
                )}
                cellRender={(data) => (
                  <>
                    {<Typography sx={[FontStyle,]}>{data?.data?.Values.length}</Typography>}
                  </>
                )}
              />

              <Column
                dataType="string"
                caption="Action"
                alignment="center"
                headerCellRender={() => (
                  <div style={{ fontWeight: "bold", color: "black", padding: "4px !important", minWidth: "70px", textAlign: "center" }}>
                    <IconButton onClick={handleClickOpen} sx={{ padding: '0px !important' }} >
                      <SettingsIcon size={18} color="black" />
                    </IconButton>

                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{ mt: 7, maxHeight: "300px", scrollBehavior: "smooth" }}
                    >
                      <Typography sx={[ComponentHeading, { p: 2, mb: -2 }]}>
                        Choose Columns
                      </Typography>
                      <FormGroup sx={{ p: 2 }}>
                        <FormControlLabel
                          control={<Checkbox color="info"
                            checked={showdate}
                            onChange={(e) => {
                              setshowdate(e.target.checked);
                            }} />}
                          label=" Date"
                        />
                        <FormControlLabel
                          control={<Checkbox color="info"
                            checked={showlookupid}
                            onChange={(e) => {
                              setshowlookupid(e.target.checked);
                            }} />}
                          label=" Lookup Id"
                        />
                        <FormControlLabel
                          control={<Checkbox color="info"
                            checked={showlookupname}
                            onChange={(e) => {
                              setshowlookupname(e.target.checked);
                            }} />}
                          label=" Lookup Name"
                        />
                        <FormControlLabel
                          control={<Checkbox color="info"
                            checked={showdetails}
                            onChange={(e) => {
                              setshowdetails(e.target.checked);
                            }}
                          />}
                          label=" Details"
                        />
                        <FormControlLabel
                          control={<Checkbox color="info" checked={showvalues}
                            onChange={(e) => {
                              setshowvalues(e.target.checked);
                            }}
                          />}
                          label=" Values"
                        />
                        <FormControlLabel
                          control={<Checkbox color="info" checked={showaction}
                            onChange={(e) => {
                              setshowaction(e.target.checked);
                            }}
                          />}
                          label="action"
                        />
                      </FormGroup>
                    </Menu>
                  </div>
                )}
                cellRender={(data) => (
                  <>
                    <Div >
                      <IconButton sx={{ padding: "0px" }} size="small" onClick={() => { updateData(data?.data) }} className="edit-icon">
                        <BiEdit />
                      </IconButton>

                      <IconButton sx={{ padding: "0px" }} onClick={() => handleDeletePopup(data?.data)} size="small" className="delete-icon">
                        <MdDelete />
                      </IconButton>
                    </Div>
                  </>
                )}
              />
            </DataGrid> */}
          </JumboScrollbar>

          <Div
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Pagination
              color="success"
              count={Math?.ceil(datas?.length / 10)}
              page={page}
              onChange={(e, newValue) => setPage(newValue)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Div>

          {/* <TablePagination
            rowsPerPageOptions={[10, 20]}
            colSpan={3}
            component="div"
            count={datas?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 3 }}
          /> */}
        </Div>

        {createLookup === true && (
          <CreateLookup
            setCreateLookup={setCreateLookup}
            setListLookup={setListLookup}
            prop={transfer}
            listdatas={datas}
          />
        )}
        {createLookup == "update" && (
          <Div>
            <EditeLookup
              setCreateLookup={setCreateLookup}
              setListLookup={setListLookup}
              prop={transfer}
              listdatas={datas}
            />
          </Div>
        )}
      </JumboContentLayoutMain>

      <ToastContainer />
    </>
  );
};

export default ListLookup;
