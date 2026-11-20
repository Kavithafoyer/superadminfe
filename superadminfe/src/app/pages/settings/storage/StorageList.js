import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TextField,
  Typography,
  Menu,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  Popover,
} from "@mui/material";
import React, { useReducer, useCallback } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { apiConfig } from "app/services/config";
import { BASE_URL } from "app/services/auth-services";
import { toast, ToastContainer } from "react-toastify";
import { SettingsIcon } from "app/icons/PngIcons";
import { BsArrowDownUp } from "react-icons/bs";
import {
  ButtonStyle,
  CRMTableHead,
  Colors,
  ComponentHeading,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  StyledTab,
  StyledTabs,
  UploadBtn,
  componentTitle,
  deletedWarnigMsg,
  dialogTitle,
} from "../../widgets/CRMStyles";
import SearchBar from "../../widgets/SearchField";
import { CRMTableCell, CRMTableRow } from "../../widgets/CRMTable";
import {
  Cancelbutton,
  CustomButton,
  CustomTooltip,
  DeletedIcon,
  DialogBox,
  Dragabledialog,
  EditIcon,
  errorFilter,
  NoRecordsPage,
  toLocaleCurrency,
} from "app/pages/widgets/StylesComponents";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { GrPowerReset } from "react-icons/gr";
import { AutoHeight } from "app/redux/auth/localStorage";
import CreateStorage from "./CreateStorage";
import EditStorage from "./EditStorage";
import {
  reducerFilter,
  storageFilterState,
} from "../filter-reducers/FilterReducers";

const datas = [
  {
    date: "23-12-2022",
    accountName: "Saving Account",
    journal: "Assets",
    reference: "Fixed Assets",
    currency: "Rupee",
  },
];

const StorageList = ({ scrollHeight }) => {
  // const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listStorage, setListStorage] = useState(true);
  const [createStorage, setCreateStorage] = useState(false);
  const [editStorage, setEditStorage] = useState(false);
  // const [editCustomer, setEditCustomer] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Storage_Id", label: "Storage Id", bool: true },
    { sort: "Name", label: "Storage Name", bool: true },
    { sort: "Storage_Size", label: "Storage(GB)", bool: true },
    // { sort: "Country", label: "Country", bool: true },
    // { sort: "Currency_code", label: "Currency code", bool: true },
    { sort: "Price", label: "Price", bool: true },
  ]);
  const [deleteItem, setDeleteItem] = useState(false);

  const [datas, setdatas] = useState([]);
  const [editdatas, seteditdatas] = useState([]);

  //for table content check box
  // const [showstorageid, setshowstorageid] = useState(true);
  // const [showstoragegb, setshowstoragegb] = useState(true);
  // const [showstoragecountry, setshowstoragecountry] = useState(true);
  // const [showstoragename, setshowstoragename] = useState(true);
  // const [showstoragecode, setshowstoragecode] = useState(true);
  // const [showprice, setshowprice] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  // const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    axios
      .get(`${BASE_URL}/superadmin/storagemasterlist/?page=${newPage}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log(res.data.results);
        setdatas(res.data.results);
        setCount(res.data.count);
      })
      .catch((error) => {
        console.log("ds", error);
      });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = () => {
    setCreateStorage(true);
    setListStorage(false);
  };

  const EditShowForm = (data) => {
    console.log("data", data);
    seteditdatas(data);
    setEditStorage(true);
    setListStorage(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    storageFilterState
  );

  const resetFilter = () => {
    filterDispatch({
      Name: "",
      StorageSize: "",
      Price: "",
      Fromdate: "",
      Todate: "",
    });
  };

  const handleFilterNameChange = (e) => {
    const { name, value } = e.target;
    filterDispatch({ type: name, payload: value });
    console.log("Filter : ", name, value);
  };

  const filterData = async () => {
    let payload = {
      Name: filterState?.Name || "",
      Storage_Size: filterState?.StorageSize ? Number(filterState.StorageSize) : undefined,
      Price: filterState?.Price ? Number(filterState.Price) : undefined,
      page: page,
    };

    // Remove undefined fields
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    let error = errorFilter({ Name: payload.Name });

    if (Object.keys(error).length > 0) {
      toast.warning(
        `some fields are empty ${Object.keys(error)?.map((item) => item)}${
          Object.keys(error)?.length > 0 && ", "
        }`,
        {
          position: "top-right",
          autoClose: 500,
        }
      );
    } else {
      await axios
        .post(`${BASE_URL}/superadmin/Storagemasterfilter/`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          console.log(res.data.results);
          setdatas(res.data.results);
          setCount(res.data.count);
          setShowFilter(null);
          setSearchFiled("");
        })
        .catch((error) => {
          console.log("ds", error);
          setdatas([]);
        });
    }
  };

  // Filter End ------------------------------------------------------------

  const RefreshData = () => {
    setShowFilter(null);
    resetFilter();
    setSearchFiled("");
    setTabValue(0);
    setPage(1);
  };

  const GetStorageRecords = () => {
    axios
      .get(BASE_URL + `/superadmin/storagemasterlist/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("Storage", response.data);
        setdatas(response.data?.results);
        setCount(response.data?.count);
      })
      .catch((error) => {
        console.error(error);
        setdatas([]);
      })
      .finally(() => {});
  };

  const GetMyStorageRecords = () => {
    axios
      .get(
        BASE_URL +
          `/superadmin/storagemastermylist/?page=${page}&Created_By=${localStorage.getItem(
            "UserId"
          )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        }
      )
      .then((response) => {
        console.log("Storage", response.data);
        setdatas(response.data?.results);
        setMyCount(response.data?.count);
      })
      .catch((error) => {
        console.error(error);
        setdatas([]);
      })
      .finally(() => {});
  };

  // Removed redundant useEffects for listStorage and mount

  const handleClickDelete = (data) => {
    console.log(data);
    if (
      data.Storage_Id === "" ||
      data.Storage_Id === undefined ||
      data.Storage_Id === null
    ) {
      toast.error("Invalid Datas");
    } else {
      axios
        .delete(
          `${BASE_URL}/superadmin/storagemaster/?Storage_Id=${data.Storage_Id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: localStorage.getItem("DBName"),
            },
          }
        )
        .then((res) => {
          console.log("Delete", res.data);
          if (res.data.Storage_Id === data.Storage_Id) {
            GetStorageRecords();
            toast.success("Deleted Sucessfully");
          } else {
            toast.error("Something went wrong");
          }
          // setdatas(res.data.results)
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

    setdatas(sortedData);
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

  // search Functions

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      await axios
        .get(
          `${BASE_URL}/superadmin/Storagemastersearch/?search=${searchstring}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: localStorage.getItem("DBName"),
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setdatas(response.data?.results);
          setCount(response.data?.count);
        })
        .catch((error) => {
          console.log("ds", error);
        });
    }, 500),
    [page],
  );

  const SearchData = (e) => {
    console.log(e.target.value);
    e.target.value !== "" ? handleSearch(e.target.value) : GetStorageRecords();
  };

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      filterData();
    } else if (tabValue === 0) {
      GetStorageRecords();
    } else if (tabValue === 1) {
      GetMyStorageRecords();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue, listStorage]);

  return (
    <>
      <JumboContentLayoutMain>
        <Div>
          <Box>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} justifyContent={"space-between"}>
                <Grid item xs={12} md={8} sx={[FontStyle]}>
                  <Typography
                    sx={[
                      componentTitle,
                      { color: Colors?.gray, fontWeight: 700, mb: 2 },
                    ]}
                  >
                    Storage List
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={10.5}
                    md={6}
                    display={"flex"}
                    alignItems={"center"}
                  >
                    <IconButton
                      sx={{ color: Colors?.Mblue }}
                      onClick={(event) => setShowFilter(event.currentTarget)}
                    >
                      <BiFilterAlt size={22} />
                    </IconButton>
                    <Div>
                      <StyledTabs
                        value={tabValue}
                        onChange={(e, newValue) => {
                          setTabValue(newValue);
                          resetFilter();
                          setSearchFiled("");
                          setPage(1);
                          console.log("newValue : ", newValue);
                        }}
                        aria-label="ant example"
                      >
                        <StyledTab label={`(${count}) All List`} />
                        <StyledTab label={`(${mycount}) My List`} />
                      </StyledTabs>
                    </Div>
                  </Grid>

                  {/* Filter popover  */}
                  <Popover
                    open={Boolean(showFilter)}
                    anchorEl={showFilter}
                    onClose={ShowFilter}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    sx={{ minWidth: "300px", width: { xs: "100%", md: "30%" } }}
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

                      <Grid container spacing={2} sx={{ padding: "1rem" }}>
                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Storage Name
                          </Typography>
                          <TextField
                            type="text"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Storage Name"
                            name="Name"
                            value={filterState?.Name}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Storage Size
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Storage Size"
                            name="StorageSize"
                            inputProps={{
                              min: 0,
                            }}
                            value={filterState?.StorageSize}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Price
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Price"
                            name="Price"
                            inputProps={{
                              min: 0,
                            }}
                            value={filterState?.Price}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            From Date
                          </Typography>
                          <TextField
                            type="date"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder=" From Date"
                            name="Fromdate"
                            value={filterState?.Fromdate}
                            onChange={handleFilterNameChange}
                            id="createdDate"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            To Date
                          </Typography>
                          <TextField
                            type="date"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="  To Date"
                            id="lastDate"
                            name="Todate"
                            value={filterState?.Todate}
                            onChange={handleFilterNameChange}
                            disabled={!Boolean(filterState?.Fromdate)}
                            inputProps={{
                              min:
                                Boolean(filterState?.Fromdate) &&
                                new Date(filterState?.Fromdate)
                                  ?.toISOString()
                                  ?.split("T")[0],
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Div
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          my: 2,
                          gap: "10px",
                        }}
                      >
                        <Cancelbutton onClick={ShowFilter} />

                        <CustomButton
                          onClick={() => filterData()}
                          type="submit"
                          label="Apply"
                          Icon="filterIcon"
                        />
                      </Div>
                    </Box>
                  </Popover>

                  <Grid item xs={12} md={6}>
                    <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
                      <SearchBar
                        value={searchFiled}
                        width={"250px !important"}
                        border={"1px solid lightgray"}
                        SearchData={(e) => {
                          setSearchFiled(e.target.value);
                          setPage(1);
                          if (Boolean(e.target.value)) {
                            setTabValue(2);
                          } else {
                            setTabValue(0);
                          }
                        }}
                      />
                      <CustomButton
                        onClick={CreateFinanceForm}
                        label="Create"
                        Icon="createIcon"
                        endIcon={true}
                      />
                    </Div>
                  </Grid>
                </Grid>
              </Box>

              <Div sx={{ mt: { xs: 0, md: 1.5 } }}>
                <JumboScrollbar
                  autoHeight={true}
                  autoHideTimeout={4000}
                  autoHeightMin={AutoHeight(1.6)}
                  autoHide={true}
                  hideTracksWhenNotNeeded
                  id="no-more-tables"
                >
                  <Table stickyHeader sx={{ mt: 2, mb: 2, minWidth: { xs: "auto", sm: 1000 } }}>
                    <CustomTableHeader
                      headerMenuItems={columnMenuItems}
                      setHeadermenuItems={setColumnMenuItems}
                      setDatas={setdatas}
                      sortDatas={datas}
                    />
                    {datas?.length > 0 && (
                      <TableBody sx={{ mt: 2 }}>
                        {datas?.length > 0 &&
                          datas
                            ?.slice(visitedPages * 10, visitedPages * 10 + 10)
                            ?.map((data, index) => {
                              return (
                                <CRMTableRow key={index}>
                                  {columnMenuItems[0]?.bool && (
                                    <CRMTableCell
                                      data-title="Date"
                                      align="left"
                                    >
                                      {data?.Updated_Date?.split("T")[0]}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[1]?.bool && (
                                    <CRMTableCell
                                      data-title="Storage Id"
                                      align="left"
                                    >
                                      {data?.Storage_Id}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[2]?.bool && (
                                    <CRMTableCell
                                      data-title="Storage Name"
                                      align="left"
                                    >
                                      {data?.Name}
                                    </CRMTableCell>
                                  )}

                                  {columnMenuItems[3]?.bool && (
                                    <CRMTableCell
                                      data-title="Storage(GB)"
                                      align="left"
                                    >
                                      {data?.Storage_Size}
                                    </CRMTableCell>
                                  )}

                                  {/* {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Currency"
                                      align="left"
                                    >
                                      {data?.Currency}
                                    </CRMTableCell>
                                  )}
                                  {columnMenuItems[5]?.bool && (
                                    <CRMTableCell
                                      data-title="Currency code"
                                      align="left"
                                    >
                                      {data?.Currency_code}
                                    </CRMTableCell>
                                  )} */}

                                  {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Price"
                                      align="left"
                                    >
                                      {toLocaleCurrency(data?.Price || 0)}
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
                                          // justifyContent: matches ? "center" : "left",
                                          justifyContent: { xs: "flex-end", sm: "center" },
                                        },
                                      ]}
                                    >
                                    <EditIcon
                                      onClick={(e) => {
                                        EditShowForm(data);
                                      }}
                                    />
                                    <DeletedIcon
                                      onClick={(e) => {
                                        setDeleteItem(data);
                                      }}
                                    />
                                  </CRMTableCell>
                                </CRMTableRow>
                              );
                            })}
                      </TableBody>
                    )}

                    {/* code for Delete Action */}
                    <DialogBox
                      open={deleteItem}
                      Content={deletedWarnigMsg}
                      onClickYes={() => {
                        setDeleteItem(false);
                        handleClickDelete(deleteItem);
                      }}
                      onClickNo={() => setDeleteItem(false)}
                    />
                  </Table>

                  {datas?.length === 0 && <NoRecordsPage title={"Storage"} />}
                </JumboScrollbar>
              </Div>
              {/* code for pagination */}
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
                  count={totalPages}
                  page={page}
                  onChange={(e, newValue) => handleChangePage(e, newValue)}
                  size="small"
                  showFirstButton
                  showLastButton
                />
              </Div>
            </Box>
          </Box>
        </Div>

        {/* Create Lookup modal */}
        <Dragabledialog
          maxWidth="md"
          open={createStorage}
          title="Create Storage"
          // onClose={() => setOpenAppointment(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <CreateStorage
              setCreateStorage={setCreateStorage}
              setListStorage={setListStorage}
            />
          </DialogContent>
        </Dragabledialog>

        <Dragabledialog
          maxWidth="md"
          open={editStorage}
          title="Edit Storage"
          // onClose={() => setOpenAppointment(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <EditStorage
              setEditStorage={setEditStorage}
              setListStorage={setListStorage}
              editdatas={editdatas}
            />
          </DialogContent>
        </Dragabledialog>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default StorageList;
