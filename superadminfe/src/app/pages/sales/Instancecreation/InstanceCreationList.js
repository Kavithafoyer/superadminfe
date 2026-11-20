import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import Div from "@jumbo/shared/Div";
import {
  Box,
  Grid,
  IconButton,
  Popover,
  Table,
  TableBody,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useReducer, useCallback } from "react";
import { debounce } from "lodash";
import { useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { RiAiGenerate } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import CreateInstance from "./CreateInstance";
import CreateInstanceDialog from "./CreateInstanceDialog";
import {
  ButtonStyle,
  Colors,
  ComponentHeading,
  componentTitle,
  CRMTableHead,
  DialogBoxCancelButton,
  DialogBoxSaveButton,
  dialogTitle,
  DisplayFlex,
  FontStyle,
  input_label,
  StyledTab,
  StyledTabs,
} from "../../widgets/CRMStyles";
import { BsArrowDownUp } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import SearchBar from "app/pages/widgets/SearchField";
import {
  InstantCreationFilterState,
  reducerFilter,
} from "app/pages/settings/filter-reducers/FilterReducers";
import {
  axiosInstance,
  Cancelbutton,
  CustomButton,
  CustomTooltip,
  DateFormatter,
  DialogBox,
  errorFilter,
  NoRecordsPage,
  CRMCustomLoader,
} from "app/pages/widgets/StylesComponents";
import { toast } from "react-toastify";
import { GrPowerReset } from "react-icons/gr";
import CustomTableHeader from "app/pages/widgets/CustomTableHeader";
import { handleError } from "app/pages/components/ErrorHandler/handleError";

const InstanceCreationList = ({ scrollHeight }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [value, setValue] = useState("1");
  const [listInstance, setListInstance] = useState(true);
  const [createInstance, setCreateInstance] = useState(false);
  const [datas, setDatas] = useState([]);
  const [mydatas, setMyDatas] = useState([]);

  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [Editdatas, setEditdatas] = useState([]);
  const [searchFiled, setSearchFiled] = useState("");
  const [count, setCount] = useState(0);
  const [mycount, setMyCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const tabOne = [
    { sort: "Updated_Date", label: "Date", bool: true },
    {
      sort: "RequestId",
      label: "Request No",
      bool: true,
    },
    {
      sort: "InstanceName",
      label: "Instance Name",
      bool: true,
    },
    {
      sort: "RequestDate",
      label: "Request Date",
      bool: true,
    },
    {
      sort: "CustomerName",
      label: "Customer Name",
      bool: true,
    },

    {
      sort: "Subscription_Id",
      label: "Subscription Id",
      bool: true,
    },
  ];

  const tabTwo = [
    { sort: "Updated_Date", label: "Date", bool: true },
    {
      sort: "Instance_Request_No",
      label: "Request No",
      bool: true,
    },
    {
      sort: "Database_Name",
      label: "Instance Name",
      bool: true,
    },

    {
      sort: "Customer_Name",
      label: "Customer Name",
      bool: true,
    },
    {
      sort: "Subscription_Id",
      label: "Subscription Id",
      bool: true,
    },
  ];

  const [columnMenuItems, setColumnMenuItems] = useState(tabOne);
  const [columnMenuItems2, setColumnMenuItems2] = useState(tabTwo);

  // sorting Functins

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

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
  };

  // ---------------------------------------------------------------- //

  // Filter Start --------------------------------------------------------

  const [filterState, filterDispatch] = useReducer(
    reducerFilter,
    InstantCreationFilterState,
  );

  const resetFilter = () => {
    filterDispatch({
      Request_No: "",
      Domain_Name: "",
      Customer_Name: "",
      Database_Name: "",
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
    let queryParams = `?fromdate=${filterState?.Fromdate || ""}&todate=${
      filterState?.Todate || ""
    }&Request_No=${filterState?.Request_No || ""}&Domain_Name=${
      filterState?.Domain_Name || ""
    }&Database_Name=${filterState?.Database_Name || ""}&page=${page}`;

    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/InstanceCreationFilter/${queryParams}`),
    );

    if (handledata) {
      setDatas(handledata?.results || []);
      setCount(handledata?.count || 0);
      setShowFilter(false);
      setSearchFiled("");
      setTabValue(3);
    }
    setLoading(false);
  };

  // Filter End ------------------------------------------------------------

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const CreateFinanceForm = (data) => {
    // navigate("/finance/create-journals");
    console.log("Print CreateFinanceForm:", data);

    setCreateInstance(data);
    // setListInstance(false);
  };

  const ShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const RefreshData = () => {
    setShowFilter(null);
    setTabValue(0);
    resetFilter();
    getAllDatas();
  };

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  // get all Data
  const getAllDatas = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(
        `/superadmin/InstanceRequestpendingList/?Created_By=${localStorage.getItem(
          "UserId",
        )}`,
      ),
    );
    if (handledata) {
      setDatas(handledata?.results || []);
      setCount(handledata?.count || 0);
    }
    setLoading(false);
  };
  // get all Data

  const getInstantMyDatas = async () => {
    setLoading(true);
    const handledata = await handleError(
      axiosInstance.get(`/superadmin/InstanceCreationList/`),
    );
    if (handledata) {
      setMyDatas(handledata?.results || []);
      setMyCount(handledata?.count || 0);
    }
    setLoading(false);
  };

  // search Functions
  const handleSearch = useCallback(
    debounce(async (searchstring) => {
      setLoading(true);
      const handledata = await handleError(
        axiosInstance.get(
          `/superadmin/InstanceCreationSearch/?search=${searchstring}&page=${page}`,
        ),
      );

      if (handledata) {
        setDatas(handledata?.results || []);
        setCount(handledata?.count || 0);
      }
      setLoading(false);
    }, 500),
    [page],
  );

  useEffect(() => {
    resetFilter();
    if (tabValue == 0) {
      getAllDatas();
    } else if (tabValue == 1) {
      getInstantMyDatas();
    }
  }, [tabValue]);

  useEffect(() => {
    if (
      Object.values(filterState)?.some((state) => Boolean(state)) &&
      !Boolean(searchFiled)
    ) {
      setSearchFiled("");
      filterData();
    } else if (tabValue === 0) {
      getAllDatas();
    } else if (tabValue === 1) {
      getInstantMyDatas();
    } else if (tabValue === 2) {
      if (Object.values(filterState)?.some((state) => Boolean(state))) {
        resetFilter();
      }
      handleSearch(searchFiled);
    }
  }, [page, searchFiled]);

  useEffect(() => {
    getInstantMyDatas();
  }, []);

  return (
    <>
      <JumboContentLayoutMain>
        <Div sx={{ position: "relative" }}>
          {loading && <CRMCustomLoader />}
          <Div sx={{ display: listInstance === true ? "block" : "none" }}>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid item xs={12} md={8} sx={[FontStyle]}>
              <Typography
                sx={[
                  componentTitle,
                  { color: Colors?.gray, fontWeight: 700, mb: 2 },
                ]}
              >
                Instance List
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
                  {tabValue === 2 || tabValue === 3 ? (
                    <Typography
                      sx={{ fontSize: "18px" }}
                      className="text-[#494949]"
                    >
                      {count == 0 ? "No results" : count}{" "}
                      {tabValue === 3
                        ? " found for your filers."
                        : " found for your search."}
                    </Typography>
                  ) : (
                    <StyledTabs
                      value={tabValue}
                      onChange={(e, newValue) => {
                        setTabValue(newValue);

                        console.log("newValue : ", newValue);
                      }}
                      aria-label="ant example"
                    >
                      <StyledTab label={`(${count}) Pending Instance`} />
                      <StyledTab label={`(${mycount}) Instance List`} />
                    </StyledTabs>
                  )}
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
                        Request No
                      </Typography>
                      <TextField
                        type="text"
                        className={`col-12 input-box2`}
                        autoComplete="off"
                        placeholder="Request No"
                        name="Request_No"
                        value={filterState?.Request_No}
                        onChange={handleFilterNameChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Typography
                        id="Typography-root"
                        sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                      >
                        Domain Name
                      </Typography>
                      <TextField
                        type="text"
                        className={`col-12 input-box2`}
                        autoComplete="off"
                        placeholder="Domain Name"
                        name="Domain_Name"
                        value={filterState?.Domain_Name}
                        onChange={handleFilterNameChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <Typography
                        id="Typography-root"
                        sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                      >
                        Customer Name
                      </Typography>
                      <TextField
                        type="text"
                        className={`col-12 input-box2`}
                        autoComplete="off"
                        placeholder="Customer Name"
                        name="Customer_Name"
                        value={filterState?.Customer_Name}
                        onChange={handleFilterNameChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <Typography
                        id="Typography-root"
                        sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                      >
                        Database Name
                      </Typography>
                      <TextField
                        type="text"
                        className={`col-12 input-box2`}
                        autoComplete="off"
                        placeholder="Database Name"
                        name="Database_Name"
                        value={filterState?.Database_Name}
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
                      if (Boolean(e.target.value)) {
                        setTabValue(2);
                      } else {
                        setTabValue(0);
                      }
                    }}
                  />
                  {/* <CustomButton
                    onClick={() => setCreateInstance("create")}
                    label="Create"
                    Icon="createIcon"
                    endIcon={true}
                  /> */}
                </Div>
              </Grid>
            </Grid>
          </Box>

          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={scrollHeight ? scrollHeight : "53vh"}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            <Table stickyHeader sx={{ minWidth: { xs: "auto", sm: 1000 } }}>
              <CustomTableHeader
                headerMenuItems={
                  tabValue === 1 ? columnMenuItems2 : columnMenuItems
                }
                setHeadermenuItems={
                  tabValue === 1 ? setColumnMenuItems2 : setColumnMenuItems
                }
                setDatas={setDatas}
                sortDatas={datas}
                showGear={tabValue === 1 ? false : true}
              />
              <TableBody>
                {(tabValue !== 1 ? datas : mydatas)?.length > 0 &&
                  (tabValue !== 1 ? datas : mydatas)?.map((data, index) => {
                    // let invoicedata = Boolean(data?.Invoice_Id);
                    return (
                      <CRMTableRow key={index}>
                        {(tabValue === 0 ? tabOne : tabTwo)?.map((item) => {
                          if (item?.bool) {
                            return (
                              <CRMTableCell
                                data-title={item?.label}
                                align="left"
                                style={{
                                  color:
                                    item?.label?.includes("Status") &&
                                    (!data?.[item?.sort]
                                      ? "orangered"
                                      : "green"),
                                }}
                              >
                                {item?.label?.includes("Date") ? (
                                  // data?.[item?.sort]?.split("T")[0] || ""
                                  <DateFormatter
                                    date={data?.[item?.sort]?.split("T")[0]}
                                  />
                                ) : item?.label === "Subscription Id" &&
                                  item?.label?.includes("Id") ? (
                                  data?.[item?.sort]?.[item?.sort]
                                ) : item?.label?.includes("Status") ? (
                                  data?.[item?.sort] ? (
                                    "Paid"
                                  ) : (
                                    "Unpaid"
                                  )
                                ) : (
                                  data?.[item?.sort] || ""
                                )}
                              </CRMTableCell>
                            );
                          }
                        })}

                        {tabValue === 0 && (
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
                            <CustomTooltip
                              value="Create Instance"
                              type="children"
                            >
                              <IconButton
                                size="small"
                                onClick={() => {
                                  CreateFinanceForm(data);
                                }}
                              >
                                <RiAiGenerate
                                  style={{
                                    fontSize: 16,
                                    color: Colors?.Mblue,
                                  }}
                                />
                              </IconButton>
                            </CustomTooltip>
                          </CRMTableCell>
                        )}
                      </CRMTableRow>
                    );
                  })}
              </TableBody>

              {/* code for Delete Action */}
              {/* <DialogBox
                  open={deleteItem}
                  Content={deletedWarnigMsg}
                  onClickYes={() => {
                    setDeleteItem(false);
                    handleDelete(deleteItem);
                  }}
                  onClickNo={() => setDeleteItem(false)}
                /> */}
            </Table>
            {datas?.length === 0 && (
              <NoRecordsPage title={"Instant Creation "} />
            )}
          </JumboScrollbar>
        </Div>

        <CreateInstanceDialog
          open={createInstance}
          onClose={setCreateInstance}
          getAllDatas={getAllDatas}
        />
      </Div>
    </JumboContentLayoutMain>
    </>
  );
};

export default InstanceCreationList;
