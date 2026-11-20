import React, { memo, useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import {
  Table,
  Typography,
  Grid,
  TextField,
  IconButton,
  Pagination,
  Menu,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogContentText,
  Popover,
  ListItemText,
  ListItemIcon,
  List,
  ListItemButton,
  Box,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL, BASE_URL1 } from "app/services/auth-services";

import {
  Colors,
  DialogHeader,
  DisplayFlex,
  FontStyle,
  useStyles,
  CRMTableHead,
  componentTitle,
  dialogTitle,
  input_label,
} from "app/pages//widgets/CRMStyles";
import {
  CustomButton,
  AvatarCircle,
  avatarColorFun,
  CustomIcons,
  formatDate,
  SelectDropdown,
  Cancelbutton,
  Div,
  CRMDateField,
} from "app/pages//widgets/StylesComponents";
import { City, Country, State } from "country-state-city";
import { TiEdit } from "react-icons/ti";
import { FaGear } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from "react-query";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import OverviewPage from "../components/OverviewPage";
import { setUpdateCharts } from "app/redux/self_service_BI/ViewOptionSlice";
import JumboScrollbar from "@jumbo/components/JumboScrollbar";
import "./Notify.css";

const TABLE_HEAD = [
  //   { id: "SaleId", label: "Sales Id" },
  //   { id: "CustomerName", label: "Customer Name" },
  //   { id: "EnquiryNo", label: "Enquiry No" },
  //   { id: "PriceBook", label: "Price Book" },
  //   { id: "OfferDate", label: "Quotation Date" },
  //   { id: "freight", label: "freight" },
  //   { id: "PaymentTerms", label: "Payment Terms" },
  //   { id: "DeliveryTerms", label: "Delivery Terms" },
  //   { id: "SalesPerson", label: "Sales Person" },
  //   { id: "TotalAmount", label: "Order Amt" },
  //   { id: "NetAamount", label: "Net Amt" },
  { id: "Setting", label: " < />" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const NotificationHome = () => {
  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "NotificationModule", label: "Notification Module", bool: true },
    { sort: "Notification_Id", label: "Notification Id", bool: true },
    { sort: "NotificationMsg", label: "Notification Msg", bool: true },
    { sort: "Notification_Time", label: "Last Notification", bool: true },
    { sort: "Created_By", label: "Send By", bool: true },
    { sort: "Notification_Time", label: "Notification Date", bool: true },
  ]);
  const matches = useMediaQuery("(min-width:759px)");

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [Overviewnotification, setShowOverviewnotification] = useState(false);
  const [overviewdatas, setoverviewdatas] = useState([]);
  const [notificationdate, setnotificationdate] = useState("");
  const [notificationtime, setnotificationtime] = useState("");

  const [datas, setDatas] = useState([]);
  const [paginatedDatas, setPaginatedDatas] = useState([]); // State to hold the fetched items
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevScrollTop, setPrevScrollTop] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const initialItemCount = 10; // Set your initial item count

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //overview Notification

  const handleClickOverviewNotification = (event, data) => {
    const formattedDate = new Date(
      data?.Notification_Time,
    ).toLocaleDateString();
    const formattedTime = new Date(
      data?.Notification_Time,
    ).toLocaleTimeString();
    setnotificationdate(formattedDate);
    setnotificationtime(formattedTime);
    setShowOverviewnotification(event.currentTarget);
  };

  const handleCloseOverviewNotification = () => {
    setnotificationdate("");
    setnotificationtime("");
    setoverviewdatas([]);
    setShowOverviewnotification(false);
  };

  // get products
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  // For filter Functionality
  const [meg, setMeg] = useState("");
  const [module, setModule] = useState("");
  const [fromdate, setFromdate] = useState(new Date().toISOString());
  const [todate, setToDate] = useState(new Date().toISOString());

  const filterSubmit = async (e) => {
    console.log("fromdate", todate, fromdate);
    e.preventDefault();

    // axios
    //   .get(
    //     `${BASE_URL}/user/UserNotificationFilter/?NotificationModule=${module}&NotificationMsg=${meg}&fromdate=${fromdate}&todate=${todate}&Created_By=${localStorage.getItem(
    //       "UserId"
    //     )}`,
    //     {
    //       headers: {
    //         db: item,
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     // console.log(res.data);
    //     setDatas(res.data || []);
    //     setShowFilter(false);
    //   })
    //   .catch((error) => {
    //     console.log("error", error);
    //   });

    axios
      .post(
        `${BASE_URL}/user/UserNotificationFilter/`,
        {
          NotificationModule: module,
          Notification_Id: meg,
          Created_Date: [fromdate, todate],
          page: page,
        },
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      )
      .then((res) => {
        // console.log(res.data);
        setDatas(res?.data?.results || []);
        setCount(res?.data?.count || 0);
        setShowFilter(false);
      })
      .catch((error) => {
        console.log("error", error);
        setShowFilter(false);
      });
  };

  const getNotificationlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/UserNotificationAdditional/?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      setLoading(false);
      return { data: [], count: 0 };
    } catch (error) {
      console.error("error", error);
      setLoading(false);
      return { data: [], count: 0 };
    }
  };

  const {
    data: getDatas,
    status,
    isLoading,
    isError: getNotificationslistError,
    refetch: getNotificationslistRefetch,
  } = useQuery(
    ["getNotificationslist", page],
    async () => await getNotificationlist(page),
    {
      staleTime: Infinity,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (getDatas) {
      setDatas((prevDatas) => {
        const updatedDatas = new Set([...prevDatas, ...getDatas?.data]);
        return Array.from(updatedDatas);
      });
      let Counts =
        getDatas?.data?.length == 0 ? datas?.length : getDatas?.count || 0;
      setCount(Counts);
    }
  }, [getDatas]);

  // const handleScroll = useCallback(() => {
  //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;

  //   if (scrollTop + windowHeight >= documentHeight - 5 && !loading && hasMore) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // }, [loading, hasMore]);

  // const handleScroll = useCallback(() => {
  //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   const windowHeight = window.innerHeight;
  //   const documentHeight = document.documentElement.scrollHeight;

  //   // Check if the user is scrolling down and near the bottom of the page
  //   if (scrollTop > prevScrollTop && scrollTop + windowHeight >= documentHeight - 5 && !loading && hasMore) {
  //     setPage((prevPage) => prevPage + 1);
  //   }

  //   setPrevScrollTop(scrollTop);
  // }, [loading, hasMore, prevScrollTop]);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if the user is scrolling down and near the bottom of the page
    if (
      scrollTop > prevScrollTop &&
      scrollTop + windowHeight >= documentHeight - 5 &&
      !loading &&
      hasMore &&
      count >= initialItemCount
    ) {
      setPage((prevPage) => prevPage + 1);
    }

    // Check if the user is scrolling up and reset to the initial state
    if (scrollTop < prevScrollTop && count > initialItemCount) {
      setDatas((prevItems) => prevItems.slice(0, initialItemCount));
      setPaginatedDatas((prevItems) => prevItems.slice(0, initialItemCount));
      setPage(1);
    }

    setPrevScrollTop(scrollTop);
  }, [loading, hasMore, prevScrollTop, datas]);

  // Example of how you might load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate a data fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadData();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // sorting functions
  const sortData = (e, value) => {
    const sortedData = [...datas].sort((a, b) =>
      value === "A-Z"
        ? a?.Notification_Id?.localeCompare(b?.Notification_Id)
        : b?.Notification_Id?.localeCompare(a?.Notification_Id),
    );
    setDatas(sortedData);
  };

  const RefreshData = () => {
    setMeg("");
    setModule("");
    setFromdate("");
    setToDate("");

    getNotificationslistRefetch(page);
  };

  return (
    <>
      <JumboContentLayoutMain>
        <Box>
          <Box sx={{ mb: 2 }}>
            <div
              style={{
                backgroundColor: "rgb(239, 239, 239)",
                padding: "10px",
                borderRadius: "5px",
                // boxShadow: "rgba(149, 157, 165, 0.2) 0px 3px 8px",
              }}
            >
              <div class="card-body">
                <div class="row">
                  <Div className="flex items-center justify-between">
                    <Typography sx={[componentTitle]}>
                      Notifications <i class="bi bi-bell-fill"></i>
                    </Typography>
                    <Div className="z-999 p-2 flex items-center justify-center">
                      <SelectDropdown
                        className="search-select3"
                        defaultValue={"A-Z"}
                        onChange={sortData}
                        options={["A-Z", "Z-A"]}
                      />
                    </Div>
                  </Div>
                </div>
              </div>
            </div>
          </Box>

          <Box>
            <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
              <Div sx={[DisplayFlex]}>
                <IconButton
                  sx={{ color: Colors?.Mblue }}
                  onClick={(e) => setShowFilter(e.currentTarget)}
                >
                  <BiFilterAlt size={22} />
                </IconButton>
                <Typography
                  sx={[FontStyle, { color: Colors?.gray, fontWeight: 400 }]}
                >
                  ( {count} ) Notifications
                </Typography>
              </Div>

              {/* Filter popover  */}
              <Popover
                open={Boolean(showFilter)}
                anchorEl={showFilter}
                onClose={() => setShowFilter(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                sx={{
                  minWidth: "350px",
                  width: { xs: "100%", md: "40%" },
                }}
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

                  <form onSubmit={filterSubmit}>
                    <Grid container spacing={2} sx={{ padding: "10px" }}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Notification Module
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box2"
                          autoComplete="off"
                          placeholder="Notification Module"
                          value={module}
                          onChange={(e) => {
                            setModule(e.target.value);
                          }}
                          sx={{ mt: -0.5 }}
                        ></TextField>
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[input_label, { mb: 0.5, textAlign: "left" }]}
                        >
                          Notification Id
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box2"
                          autoComplete="off"
                          placeholder="Notification Id"
                          value={meg}
                          onChange={(e) => {
                            setMeg(e.target.value);
                          }}
                          sx={{ mt: -0.5 }}
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[input_label, { mb: 0.5, textAlign: "left" }]}
                        >
                          From Date
                        </Typography>
                        <CRMDateField
                          type="date"
                          className="col-12 input-box2"
                          value={fromdate}
                          onChange={(e) => {
                            setFromdate(e.target.value);
                          }}
                          id="createdDate"
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          id="Typography-root"
                          sx={[input_label, { mb: 0.5, textAlign: "left" }]}
                        >
                          To Date
                        </Typography>
                        <CRMDateField
                          value={todate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                          }}
                          type="date"
                          className="col-12 input-box2"
                          id="lastDate"
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
                        type="submit"
                        label="Apply"
                        Icon="filterIcon"
                      />
                      <Cancelbutton onClick={() => setShowFilter(null)} />
                    </Div>
                  </form>
                </Box>
              </Popover>

              <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                <FaGear style={{ fontSize: 18 }} />
              </IconButton>
            </Div>
          </Box>

          {/* list of notifications */}
          <Div id="list" sx={{ mb: 1 }} className="">
            <List>
              {datas?.length > 0 &&
                datas?.map((data, idx) => {
                  // if (idx < 2) {

                  let image =
                    (BASE_URL +
                      data?.File?.split("https://backend.crmfarm.app")[1] ||
                      data?.File) ??
                    "";

                  return (
                    <Div
                      // onMouseOver={() => setFadeEdit(idx)}
                      // onMouseLeave={() => setFadeEdit(null)}
                      className=""
                      key={idx}
                      sx={{
                        minHeight: "124px",
                        p: { xs: 0.5, sm: 2 },
                        px: { xs: 0.5, md: 7 },
                        my: 2,
                        bgcolor: "white",
                        borderRadius: { xs: "5px", md: "10px" },
                        ":hover": {
                          boxsShadow:
                            "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important",
                        },
                        cursor: "default",
                      }}
                    >
                      <Box className="grid grid-cols-12 gap-1 divide rounded-md">
                        <Div
                          className="col-span-1 md:-translate-x-7"
                          style={{ marginTop: "6px" }}
                          onClick={() => {
                            let obj = Object.keys(data).reduce((acc, key) => {
                              const item = columnMenuItems.find(
                                (item) => item.sort === key,
                              );
                              if (item) {
                                if (key === "Created_By") {
                                  acc[key] = data[key]?.first_name || "";
                                } else {
                                  acc[key] = data[key] || "";
                                }
                              }
                              return acc;
                            }, {});

                            setShowOverviewnotification(obj);
                          }}
                        >
                          <AvatarCircle
                            size="90px"
                            fontSize="30px"
                            bgColor={avatarColorFun(idx)}
                            title={
                              !Boolean(data?.File) && data?.Notificationname
                            }
                            image={Boolean(data?.File) ? image : false}
                          />
                        </Div>

                        <Div className=" col-span-11">
                          <Div
                            onClick={() => {
                              let obj = Object.keys(data).reduce((acc, key) => {
                                const item = columnMenuItems.find(
                                  (item) => item.sort === key,
                                );
                                if (item) {
                                  if (key === "Created_By") {
                                    acc[key] = data[key]?.first_name || "";
                                  } else {
                                    acc[key] = data[key] || "";
                                  }
                                }
                                return acc;
                              }, {});

                              setShowOverviewnotification(obj);
                            }}
                            sx={[
                              DisplayFlex,
                              {
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                mb: 1,
                                cursor: "pointer",
                              },
                            ]}
                          >
                            <Typography
                              className="title"
                              sx={[
                                {
                                  fontSize: "18px",
                                  fontWeight: 700,
                                  color: `${Colors?.Mblue}`,
                                },
                              ]}
                            >
                              {data?.NotificationModule || "No Name  "}
                            </Typography>
                          </Div>
                          <Box className=" grid grid-cols-3 gap-1 ">
                            {columnMenuItems
                              ?.filter(
                                (opt) => opt?.label != "Last Notification",
                              )
                              ?.map((Menu, subIdx) => {
                                console.log("Menu", data[Menu?.sort], data);
                                return (
                                  <>
                                    {Menu?.bool && (
                                      <Div key={subIdx}>
                                        <Typography
                                          sx={[
                                            {
                                              fontSize: "14px",
                                              color: "#828282",
                                            },
                                          ]}
                                        >
                                          <span
                                            style={{
                                              fontWeight: 700,
                                              color: "#5e5e5e",
                                            }}
                                          >
                                            {Menu?.label} :
                                          </span>{" "}
                                          <span>
                                            {Menu?.sort ===
                                              "Notification_Time" ||
                                              Menu?.sort === "Notification_Date"
                                              ? formatDate(data[Menu?.sort])
                                              : Menu?.sort === "Created_By"
                                                ? data[Menu?.sort]?.first_name
                                                : Menu?.sort ===
                                                  "NotificationMsg"
                                                  ? data[Menu?.sort]?.length >
                                                    20
                                                    ? data[
                                                      Menu?.sort
                                                    ]?.substring(0, 20) +
                                                    "..."
                                                    : data[Menu?.sort]
                                                  : (data[Menu?.sort] ?? "-")}
                                          </span>
                                        </Typography>
                                      </Div>
                                    )}
                                  </>
                                );
                              })}
                          </Box>
                        </Div>
                      </Box>
                    </Div>
                  );
                  // }
                })}
            </List>
          </Div>
          <br />

          {/* gear options */}
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            sx={{
              mt: 5,
              maxHeight: "300px",
              scrollBehavior: "smooth",
            }}
          >
            <Typography sx={[dialogTitle, { p: 2, mb: -2 }]}>
              Choose Fields
            </Typography>
            <FormGroup sx={{ p: 2 }}>
              {columnMenuItems?.length > 0 &&
                columnMenuItems?.map((column, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          color="info"
                          size="small"
                          checked={column?.bool}
                          onChange={(e) => {
                            let value = [...columnMenuItems];
                            value[index].bool = !column?.bool;
                            setColumnMenuItems(value);
                          }}
                        />
                      }
                      label={
                        <Typography id="Typography-root" sx={[FontStyle]}>
                          {column?.label}
                        </Typography>
                      }
                    />
                  );
                })}
            </FormGroup>
          </Menu>
        </Box>
        <br />

        {loading && (
          // <Div sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
          //   <CircularProgress />
          // </Div>
          <div class="loader1" id="loader">
            <CircularProgress />
          </div>
        )}

        {/* overview page */}
        <OverviewPage
          label={"Notification"}
          datas={Overviewnotification}
          open={Boolean(Overviewnotification)}
          setOpen={setShowOverviewnotification}
          onClose={() => setShowOverviewnotification(false)}
        />
      </JumboContentLayoutMain>
    </>
  );
};

export default memo(NotificationHome);
