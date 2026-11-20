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
import React, { useReducer } from "react";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CreateAddon from "./CreateAddon";
import EditAddon from "./EditAddon";
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
import {
  addonsFilterState,
  reducerFilter,
} from "../filter-reducers/FilterReducers";

const AddonList = ({ scrollHeight }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listAddon, setListAddon] = useState(true);
  const [createAddon, setCreateAddon] = useState(false);
  const [editAddon, setEditAddon] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Updated_Date", label: "Date", bool: true },
    { sort: "Addon_Id", label: "Addon Id", bool: true },
    { sort: "Addon_Name", label: "Addon Name", bool: true },
    { sort: "NoofUsers", label: "No of Users", bool: true },
    { sort: "Price", label: "Price", bool: true },
  ]);

  const [datas, setdatas] = useState([]);
  const [myDatas, setMyDatas] = useState([]);

  const [Editdatas, setEditdatas] = useState([]);

  // Table Pagination
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  // const rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  // for table header
  // const [showsaddonid, setshowsaddonid] = useState(true);
  // const [showsaddonname, setshowsaddonname] = useState(true);
  // const [showsnoofuser, setshowsnoofuser] = useState(true);
  // const [showscurrency, setshowscurrency] = useState(true);
  // const [showprice, setshowprice] = useState(true);
  // const [showaction,setshowaction] = useState(true)

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    addonsFilterState
  );

  const resetFilter = () => {
    filterDispatch({
      Addon_Name: "",
      NoofUsers: "",
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
      Addon_Name: filterState?.Addon_Name,
      NoofUsers: filterState?.NoofUsers,
      Price: filterState?.Price,
      fromdate: filterState?.Fromdate,
      todate: filterState?.Todate,
      Created_Date: new Date().toISOString().split("T")[0],
      Updated_Date: new Date().toISOString().split("T")[0],
      page: page,
    };

    let error = errorFilter(payload);

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
        .post(`${BASE_URL}/superadmin/AddonAdditional/`, payload, {
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
        });
    }
  };

  // Filter End ------------------------------------------------------------

  const [anchorEl, setAnchorEl] = useState(null);

  const [deleteItem, setDeleteItem] = useState(false);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = () => {
    setCreateAddon(true);
    setListAddon(false);
  };

  const EditShowForm = (data) => {
    setEditdatas(data);
    setEditAddon(true);
    setListAddon(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const RefreshData = () => {
    setShowFilter(null);
    resetFilter();
    setSearchFiled("");
    setTabValue(0);
    setPage(1);
  };

  const GetAddonPriceRecords = () => {
    axios
      .get(
        BASE_URL + `/superadmin/AddonAdditional/?Is_Deleted=False&page=${page}`,
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
        // console.log("Storage on Price", response.data);
        setdatas(response.data.results);
        setCount(response.data.count);
        setSearchFiled("");
      })
      .catch((error) => {
        console.error(error);
        setdatas([]);
      })
      .finally(() => {});
  };

  const GetMyAddonPriceRecords = () => {
    axios
      .get(
        BASE_URL +
          `/superadmin/Addonsmylist/?page=${page}&Created_By=${localStorage.getItem(
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
        // console.log("Add on Price", response.data);
        setdatas(response.data.results);
        setMyCount(response.data.count);
        setSearchFiled("");
      })
      .catch((error) => {
        console.error(error);
        setdatas([]);
      })
      .finally(() => {});
  };

  const handleAddonPriceDelete = (data) => {
    if (
      data.Addon_Id === "" ||
      data.Addon_Id === undefined ||
      data.Addon_Id === null
    ) {
      toast.error("Invalid Datas");
    } else {
      axios
        .delete(`${BASE_URL}/superadmin/Addon/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
          data: { Addon_Id: data.Addon_Id },
        })
        .then((res) => {
          console.log("Delete", res.data);
          if (
            res.data.message !== "" ||
            res.data.message !== null ||
            res.data.message !== undefined
          ) {
            GetAddonPriceRecords();
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

  // Removed redundant useEffect for listAddon

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

  const handleSearch = async (searchstring) => {
    await axios
      .put(
        `${BASE_URL}/superadmin/AddonAdditional/`,
        { search: searchstring, page },
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
  };

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      filterData();
    } else if (tabValue === 0) {
      GetAddonPriceRecords();
    } else if (tabValue === 1) {
      GetMyAddonPriceRecords();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue, listAddon]);

  return (
    <>
      <JumboContentLayoutMain>
        {/* <Finance /> */}

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
                    Addons List
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

                      <Grid container spacing={2} sx={{ padding: "1rem" }}>
                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Addon Name
                          </Typography>
                          <TextField
                            type="text"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Addon Name"
                            name="Addon_Name"
                            value={filterState?.Addon_Name}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            No of Users
                          </Typography>
                          <TextField
                            type="number"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="No of Users"
                            name="NoofUsers"
                            value={filterState?.NoofUsers}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
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
                            value={filterState?.Price}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
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

                        <Grid item xs={12} md={6} lg={6}>
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
                        width={"250px !important"}
                        value={searchFiled}
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
                        {datas
                          ?.slice(visitedPages * 10, visitedPages * 10 + 10)
                          ?.map((data, index) => {
                            return (
                              <CRMTableRow key={index}>
                                {columnMenuItems[0]?.bool && (
                                  <CRMTableCell data-title="Date" align="left">
                                    {data?.Updated_Date?.split("T")[0]}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[1]?.bool && (
                                  <CRMTableCell
                                    data-title="Addon Id"
                                    align="left"
                                  >
                                    {data?.Addon_Id}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[2]?.bool && (
                                  <CRMTableCell
                                    data-title="Addon Name"
                                    align="left"
                                  >
                                    {data?.Addon_Name || data?.Name}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[3]?.bool && (
                                  <CRMTableCell
                                    data-title="No of Users"
                                    align="left"
                                  >
                                    {data?.NoofUsers}
                                  </CRMTableCell>
                                )}

                                {/* {columnMenuItems[4]?.bool && (
                                    <CRMTableCell
                                      data-title="Currency code"
                                      align="left"
                                    >
                                      {data?.Currency_code}
                                    </CRMTableCell>
                                  )} */}

                                {columnMenuItems[4]?.bool && (
                                  <CRMTableCell data-title="Price" align="left">
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
                        handleAddonPriceDelete(deleteItem);
                      }}
                      onClickNo={() => setDeleteItem(false)}
                    />
                  </Table>
                  {datas?.length === 0 && <NoRecordsPage title={"Addons"} />}
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
                  onChange={(e, newValue) => setPage(newValue)}
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
          open={createAddon}
          title="Create Addons"
          onClose={() => setCreateAddon(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <CreateAddon
              setCreateAddon={setCreateAddon}
              setListAddon={setListAddon}
            />
          </DialogContent>
        </Dragabledialog>

        <Dragabledialog
          maxWidth="md"
          open={editAddon}
          title="Edit Addons"
          onClose={() => setEditAddon(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <EditAddon
              setEditAddon={setEditAddon}
              setListAddon={setListAddon}
              Editdatas={Editdatas}
            />
          </DialogContent>
        </Dragabledialog>

        {/* <Div sx={{ display: createAddon === true ? "block" : "none" }}>
          <CreateAddon setCreateAddon={setCreateAddon} setListAddon={setListAddon}/>
        </Div>
        <Div sx={{ display: editAddon === true ? "block" : "none" }}>
          <EditAddon setEditAddon={setEditAddon} setListAddon={setListAddon} Editdatas={Editdatas} />
        </Div> */}
        {/* <Div sx={{ display: editCustomer === true ? "block" : "none" }}>
          <EditCustomer setEditCustomer={setEditCustomer} setListCustomer={setListCustomer}/>
        </Div> */}
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default AddonList;
