import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  FormControl,
  Grid,
  IconButton,
  Table,
  TableBody,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  FormControlLabel,
  Checkbox,
  Menu,
  FormGroup,
  Pagination,
  Box,
  Popover,
  Autocomplete,
} from "@mui/material";
import React, { useEffect, useReducer, useCallback } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiEdit, BiFilterAlt } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiRefreshFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { GrPowerReset, GrView } from "react-icons/gr";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { apiConfig } from "app/services/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "app/services/auth-services";
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
  DeletedIcon,
  DialogBox,
  Dragabledialog,
  EditIcon,
  errorFilter,
  NoRecordsPage,
  ToastMsg,
  toLocaleCurrency,
} from "app/pages/widgets/StylesComponents";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { AutoHeight } from "app/redux/auth/localStorage";
import {
  planFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import { Country } from "country-state-city";
import { handleError } from "app/pages/components/ErrorHandler/handleError";
import SetupProduct from "./SetupProduct";

const ListProduct = ({ scrollHeight }) => {
  let Countries = Country.getAllCountries();

  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listPlan, setListPlan] = useState(true);
  const [createPlan, setCreatePlan] = useState(false);
  const [editPlan, setEditPlan] = useState(false);
  const [viewPlan, setViewPlan] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  // const [showplanname, setshowplanname] = useState(true);
  // const [showplandetails, setshowplandetails] = useState(true);
  // const [showprice, setshowprice] = useState(true);
  // const [showmodules, setshowmodules] = useState(true);
  // const [shownoofuser, setshownoofuser] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const [datas, setdatas] = useState([]);
  const [mydatas, setMydatas] = useState([]);

  const [editdatas, seteditdatas] = useState([]);
  const [viewdatas, setviewdatas] = useState([]);

  // For Asecnding Order
  const [showsort, setShowsort] = useState(true);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [tabValue, setTabValue] = useState(0);
  const [searchFiled, setSearchFiled] = useState("");

  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "Created_Date", label: "Date", bool: true },
    { sort: "Product_Id", label: "Product Id", bool: true },
    { sort: "Product_Name", label: "Product Name", bool: true },
  ]);
  const [deleteItem, setDeleteItem] = useState(false);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visitedPages, setVisitedPages] = useState(page - 1);
  const totalRecords = count;
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    planFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      Name: "",
      Country: "",
      Code: "",
      Fromdate: "",
      Todate: "",
      Product: "",
    });
  };

  const handleFilterNameChange = (e) => {
    const { name, value } = e.target;
    filterDispatch({ type: name, payload: value });
    console.log("Filter : ", name, value);
  };

  const filterData = async () => {
    const params = {
      fromdate: filterState?.Fromdate || "",
      todate: filterState?.Todate || "",
      Country: filterState?.Country || "",
      Currency_Type: filterState?.Code || "",
      Plan_Name: filterState?.Name || "",
      Product: filterState?.Product || "",
      page: page,
    };

    await axios
      .get(`${BASE_URL}/superadmin/planfilter/`, {
        params: params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((res) => {
        console.log(res.data.results);
        setTabValue(3);
        setdatas(res.data.results);
        setCount(res.data.count);
        setShowFilter(false);
        setSearchFiled("");
      })
      .catch((error) => {
        handleError(error);
        console.log("ds", error);
      });
  };

  const RefreshData = () => {
    setShowFilter(null);
    resetFilter();
    setTabValue(0);
    getPlanRecords();
  };

  // Filter End ------------------------------------------------------------

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    setVisitedPages(visitedPages);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = () => {
    // navigate("/finance/create-journals");
    setCreatePlan(true);
    setListPlan(false);
  };

  const editplanFun = (data) => {
    console.log("data", data);
    seteditdatas(data);
    setEditPlan(true);
    setListPlan(false);
  };

  const ViewForm = (data) => {
    setviewdatas(data);
    setOpenDetails(true);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // code for settings open
  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = () => {
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

  const handleClose = () => {
    setOpenDetails(false);
    setviewdatas([]);
  };

  const DeletePlan = (data) => {
    // console.log(data)
    if (data.id === "" || data.id === undefined || data.id === null) {
      toast.error("Invalid Datas");
    } else {
      axios
        .delete(`${BASE_URL}/superadmin/plan/?id=${data.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            db: localStorage.getItem("DBName"),
          },
        })
        .then((res) => {
          console.log("Delete", res.data);
          if (res.data.id === data.id) {
            getPlanRecords();
            toast.success("Deleted Sucessfully");
          } else {
            toast.error("Something went wrong");
          }
          // setdatas(res.data.results)
        })
        .catch((error) => {
          handleError(error);
          console.log("ds", error);
        });
    }
  };

  const getPlanRecords = async () => {
    await axios
      .get(BASE_URL + `/superadmin/planlist/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Db: localStorage.getItem("DBName"),
        },
      })
      .then((response) => {
        console.log("Plan", response.data);
        setdatas(response.data.results);
        setCount(response.data.count);
      })
      .catch((error) => {
        handleError(error);
        console.error(error);
      })
      .finally(() => {});
  };

  const getMyPlanRecords = async () => {
    await axios
      .get(
        BASE_URL +
          `/superadmin/planmylist/?page=${page}&Created_By=${localStorage.getItem(
            "UserId",
          )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      )
      .then((response) => {
        console.log("My Plan", response.data);
        setMydatas(response.data?.results);
        setMyCount(response.data?.count);
      })
      .catch((error) => {
        handleError(error);
        console.error(error);
      })
      .finally(() => {});
  };

  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      await axios
        .get(
          `${BASE_URL}/superadmin/productsearch/?search=${searchstring}&page=${page}`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
              "Content-Type": "application/json",
              Accept: "application/json",
              db: localStorage.getItem("DBName"),
            },
          },
        )
        .then((response) => {
          console.log(response.data);
          setdatas(response.data?.results);
          setCount(response.data?.count);
        })
        .catch((error) => {
          handleError(error);
          console.log("ds", error);
        });
    }, 500),
    [page],
  );

  useEffect(() => {
    resetFilter();
    setPage(1);
    setSearchFiled("");
  }, [tabValue]);

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      setSearchFiled("");
      filterData();
    } else if (tabValue === 0) {
      getPlanRecords();
    } else if (tabValue === 1) {
      getMyPlanRecords();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled, tabValue]);

  useEffect(() => {
    getMyPlanRecords();
  }, []);

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
                    Product List
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
                            Plan Name
                          </Typography>
                          <TextField
                            type="text"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Plan Name"
                            name="Name"
                            value={filterState?.Name}
                            onChange={handleFilterNameChange}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Country
                          </Typography>
                          <FormControl className="col-12 w-100">
                            <Autocomplete
                              className="w-100 search-select3 col-12"
                              id="outlined-basic"
                              name="Country"
                              options={Countries}
                              getOptionLabel={(option) => option?.name}
                              value={Countries.find(
                                (item) => item?.name === filterState?.Country,
                              )}
                              onChange={(e, newvalue) => {
                                filterDispatch({
                                  type: "Country",
                                  payload: newvalue?.name,
                                });
                                filterDispatch({
                                  type: "Code",
                                  payload: newvalue?.currency,
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Country"
                                />
                              )}
                            />
                          </FormControl>
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
                            disabled={!Boolean(filterState?.Fromdate)}
                            onChange={handleFilterNameChange}
                            inputProps={{
                              min:
                                Boolean(filterState?.Fromdate) &&
                                new Date(filterState?.Fromdate)
                                  ?.toISOString()
                                  ?.split("T")[0],
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6} lg={6}>
                          <Typography
                            id="Typography-root"
                            sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                          >
                            Product
                          </Typography>
                          <TextField
                            type="text"
                            className={`col-12 input-box2`}
                            autoComplete="off"
                            placeholder="Product"
                            name="Product"
                            value={filterState?.Product}
                            onChange={handleFilterNameChange}
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
                        <CustomButton
                          onClick={() => filterData()}
                          type="submit"
                          label="Apply"
                          Icon="filterIcon"
                        />
                        <Cancelbutton onClick={ShowFilter} />
                      </Div>
                    </Box>
                  </Popover>

                  <Grid item xs={12} md={6}>
                    <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
                      <SearchBar
                        width={"250px !important"}
                        border={"1px solid lightgray"}
                        value={searchFiled}
                        SearchData={(e) => {
                          setSearchFiled(e.target.value);
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
                  <Table
                    stickyHeader
                    sx={{ minWidth: { xs: "auto", sm: 800 } }}
                  >
                    <CustomTableHeader
                      headerMenuItems={columnMenuItems}
                      setHeadermenuItems={setColumnMenuItems}
                      setDatas={setdatas}
                      sortDatas={datas}
                    />
                    {(tabValue !== 1 ? datas : mydatas)?.length > 0 && (
                      <TableBody sx={{ mt: 2 }}>
                        {(tabValue !== 1 ? datas : mydatas)?.map(
                          (data, index) => {
                            return (
                              <CRMTableRow key={index}>
                                {columnMenuItems[0]?.bool && (
                                  <CRMTableCell data-title="Date" align="left">
                                    {data?.Updated_Date?.split("T")[0]}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[1]?.bool && (
                                  <CRMTableCell
                                    data-title="Product Id"
                                    align="left"
                                  >
                                    {data?.Product_Id}
                                  </CRMTableCell>
                                )}

                                {columnMenuItems[2]?.bool && (
                                  <CRMTableCell
                                    data-title="Product Name"
                                    align="left"
                                  >
                                    {data?.Product_Name}
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
                                      justifyContent: {
                                        xs: "flex-end",
                                        sm: "center",
                                      },
                                    },
                                  ]}
                                >
                                  {/* <IconButton
                                    sx={{ padding: "5px !important" }}
                                    size="small"
                                    className="edit-icon"
                                    onClick={() => {
                                      ViewForm(data);
                                    }}
                                  >
                                    <GrView style={{ fontSize: 16 }} />
                                  </IconButton> */}

                                  <EditIcon
                                    onClick={(e) => {
                                      editplanFun(data);
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
                          },
                        )}
                      </TableBody>
                    )}

                    {/* code for Delete Action */}
                    <DialogBox
                      open={deleteItem}
                      Content={deletedWarnigMsg}
                      onClickYes={() => {
                        setDeleteItem(false);
                        DeletePlan(deleteItem);
                      }}
                      onClickNo={() => setDeleteItem(false)}
                    />
                  </Table>

                  {datas?.length === 0 && <NoRecordsPage title={"Plans"} />}
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
          open={createPlan}
          title="Create Product"
          onClose={() => setCreatePlan(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <SetupProduct
              setCreatePlan={setCreatePlan}
              setListPlan={setListPlan}
              getPlanRecords={getPlanRecords}
            />
          </DialogContent>
        </Dragabledialog>

        {/* edit plan */}
        <Dragabledialog
          maxWidth="lg"
          open={editPlan}
          title="Edit Product"
          onClose={() => setEditPlan(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            {/* <EditPlan
              setEditPlan={setEditPlan}
              setListPlan={setListPlan}
              editdatas={editdatas}
              getPlanRecords={getPlanRecords}
            /> */}
          </DialogContent>
        </Dragabledialog>

        {/* view plan */}
        <Dragabledialog
          maxWidth="md"
          open={viewPlan}
          title="Product OverView"
          onClose={() => setViewPlan(false)}
        >
          <DialogContent sx={{ p: 1 }}>
            <Grid container columns={12}>
              <Grid item xs={5.5}>
                <Div sx={[FontStyle, { mt: 1 }]}>Product Id</Div>
                <Div sx={[FontStyle, { mt: 1 }]}>Product Name</Div>
              </Grid>
              <Grid item xs={0.5}>
                <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
                <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              </Grid>
              <Grid item xs={6}>
                <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Product_Id}</Div>
                <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Product_Name}</Div>
              </Grid>
            </Grid>
          </DialogContent>
        </Dragabledialog>
      </JumboContentLayoutMain>
      <ToastContainer />
    </>
  );
};

export default ListProduct;
