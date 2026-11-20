import React, { memo, useEffect, useState } from "react";
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
  CustomTooltip,
} from "app/pages//widgets/StylesComponents";
import { City, Country, State } from "country-state-city";
import { TiEdit } from "react-icons/ti";
import { FaGear } from "react-icons/fa6";
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from "react-query";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import OverviewPage from "../components/OverviewPage";

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

const NotificationSales = () => {
  const [columnMenuItems, setColumnMenuItems] = useState([
    { sort: "NotificationModule", label: "Notification Module", bool: true },
    { sort: "Notification_Id", label: "Notification Id", bool: true },
    { sort: "NotificationMsg", label: "Notification Msg", bool: true },
    { sort: "Notification_Time", label: "Last Notification", bool: true },
    { sort: "Created_By", label: "Send By", bool: true },
    { sort: "Notification_Time", label: "Notification Date", bool: true },
  ]);
  const matches = useMediaQuery("(min-width:759px)");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRow, setSelectedRow] = useState("");

  const [notes, setNotes] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [update, setUpdate] = useState({});
  const [Overviewnotification, setShowOverviewnotification] = useState(false);
  const [overviewdatas, setoverviewdatas] = useState([]);
  const [notificationdate, setnotificationdate] = useState("");
  const [notificationtime, setnotificationtime] = useState("");
  const [Save, setSave] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(null);

  const [datas, setDatas] = useState([]);
  const [notilength, setnotilength] = useState("0");

  const [count, setCount] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);

  // Tabel sort
  const [anchorElAction, setAnchorElAction] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setAnchorElAction(null);
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
  const [contry, setContry] = useState("");
  const [meg, setMeg] = useState("");
  const [module, setModule] = useState("");
  const [fromdate, setFromdate] = useState(new Date().toISOString());
  const [todate, setToDate] = useState(new Date().toISOString());
  const [statefil, setStatefil] = useState("");

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
        setDatas(res?.data || []);
        setShowFilter(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getNotificationlist = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/superadmin/UserNotificationAdditional/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Db: localStorage.getItem("DBName"),
          },
        },
      );
      return response?.data;
    } catch (error) {
      console.error("error", error);
    }
  };

  const {
    data: getDatas,
    status,
    isLoading,
    isError: getNotificationslistError,
    refetch: getNotificationslistRefetch,
  } = useQuery(
    ["getNotificationslist", item, token],
    () => getNotificationlist(),
    {
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (getDatas) {
      setCount(getDatas?.length);
      setDatas(getDatas);
    }
  }, [getDatas]);

  // sorting functions
  const sortData = (e, value) => {
    const sortedData = [...datas].sort((a, b) =>
      value === "A-Z"
        ? a?.Notificationname?.localeCompare(b?.Notificationname)
        : b?.Notificationname?.localeCompare(a?.Notificationname),
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
        <Box
          sx={{
            bgcolor: "white",
            p: { xs: 2, md: 4 },
            borderRadius: "15px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
            minHeight: "80vh",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Div
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                pb: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              <Typography sx={[componentTitle, { fontWeight: 700 }]}>
                Notifications
              </Typography>
              <Div className="flex items-center justify-center">
                <SelectDropdown
                  className="search-select-border"
                  defaultValue={"A-Z"}
                  onChange={sortData}
                  options={["A-Z", "Z-A"]}
                />
                {matches && (
                  <CustomTooltip value="Notification Settings" placement="top">
                    <IconButton
                      onClick={(e) => setMenuAnchorEl(e.currentTarget)}
                      sx={{ ml: 1, border: "1px solid #eee" }}
                    >
                      <FaGear style={{ fontSize: 18 }} />
                    </IconButton>
                  </CustomTooltip>
                )}
              </Div>
            </Div>
          </Box>

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
                  sx={{
                    color: Colors?.Mblue,
                    border: `1px solid ${Colors?.Mblue}`,
                    borderRadius: "5px",
                    p: "5px",
                    mr: 2,
                  }}
                  onClick={(e) => setShowFilter(e.currentTarget)}
                >
                  <BiFilterAlt size={22} />
                </IconButton>
                <Typography
                  sx={[
                    FontStyle,
                    {
                      color: Colors?.gray,
                      fontWeight: 600,
                      fontSize: "16px",
                    },
                  ]}
                >
                  ( {count} ) Notifications
                </Typography>
              </Grid>
              {!matches && (
                <Grid item xs={1} md={1}>
                  <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}>
                    <FaGear style={{ fontSize: 18 }} />
                  </IconButton>
                </Grid>
              )}

              {/* Filter popover  */}

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
                          Notification Module
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box"
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
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          Notification Id
                        </Typography>
                        <TextField
                          type="text"
                          className="col-12 input-box"
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
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          From Date
                        </Typography>
                        <TextField
                          type="date"
                          className="col-12 input-box"
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
                          sx={[FontStyle, { mb: 0.5, textAlign: "left" }]}
                        >
                          To Date
                        </Typography>
                        <TextField
                          value={todate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                          }}
                          type="date"
                          className="col-12 input-box"
                          id="lastDate"
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

              {/* <Grid item xs={12} md={4}>
                <Div sx={{ width: { md: window.innerWidth / 3 } }}>
                  <SearchBar
                    SearchData={SearchData}
                    width={"100%"}
                    color={"black"}
                  />
                </Div>
              </Grid> */}
              {/* <Grid item xs={12} md={6}>
              <Div sx={[DisplayFlex, { justifyContent: "right" }]}>
                <CustomButton
                  // onClick={() => setShowComponent("create")}
                  label="Create"
                  Icon="createIcon"
                  endIcon={true}
                />
              </Div>
            </Grid> */}
            </Grid>
          </Box>

          <List sx={{ mt: 0 }}>
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
                    className=""
                    key={idx}
                    sx={{
                      minHeight: "124px",
                      p: { xs: 1, sm: 2 },
                      px: { xs: 1, md: 4 },
                      my: 2,
                      bgcolor: "white",
                      border: "1px solid #ececec",
                      borderRadius: "10px",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
                        borderColor: Colors?.Mblue,
                        transform: "translateY(-2px)",
                      },
                      cursor: "default",
                    }}
                  >
                    <Box className="grid grid-cols-12 gap-1 divide rounded-md">
                      <Div
                        className="col-span-1 md:-translate-x-7"
                        style={{ marginTop: "6px" }}
                        // onClick={() =>{
                        //   let obj = {};
                        //   Object.keys(data)?.map((key, i) => {
                        //     columnMenuItems?.filter((item) => {
                        //       if (item.sort == key) {
                        //         if (item.sort === "Created_By") {
                        //           obj[key] = data[key]?.first_name || "";
                        //         } else {
                        //           obj[key] = data[key] || "";
                        //         }
                        //       }
                        //     });
                        //   });
                        //   setShowOverviewnotification(obj);
                        // }}
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
                          title={!Boolean(data?.File) && data?.Notificationname}
                          image={Boolean(data?.File) ? image : false}
                        />
                      </Div>

                      <Div className=" col-span-11">
                        <Div
                          sx={[
                            DisplayFlex,
                            {
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              mb: 1,
                            },
                          ]}
                        >
                          <Typography
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
                            ?.filter((opt) => opt?.label != "Last Notification")
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
                                        {Menu?.sort === "Notification_Time" ||
                                          Menu?.sort === "Notification_Date"
                                          ? formatDate(data[Menu?.sort])
                                          : Menu?.sort === "Created_By"
                                            ? data[Menu?.sort].first_name
                                            : Menu?.sort === "NotificationMsg"
                                              ? data[Menu?.sort]?.length > 20
                                                ? data[Menu?.sort]?.substring(
                                                  0,
                                                  20,
                                                ) + "..."
                                                : data[Menu?.sort]
                                              : (data[Menu?.sort] ?? "-")}
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

          {/* openAnchor Action popover */}
          {/* <Popover
          id={Boolean(openAnchor) ? "simple-popover" : undefined}
          open={Boolean(openAnchor)}
          anchorEl={openAnchor}
          onClose={() => {
            setOpenAnchor(null);
            // setIsLoading(false);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List sx={{ p: 1 }}>
            <ListItemButton
              onClick={() => {
                setShowComponent("edit");
                setOpenAnchor(false);
              }}
            >
              <ListItemIcon
                sx={{
                  color: Colors?.Mblue,
                  minWidth: "25px !important",
                }}
              >
                <TiEdit
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={[FontStyle]}>Edit Supplier</Typography>
                }
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                setShowDelete(true);
                setOpenAnchor(false);
              }}
              sx={{ borderRadius: "5px" }}
            >
              <ListItemIcon
                sx={{ minWidth: "25px !important", color: "tomato" }}
              >
                {CustomIcons?.deleteIcon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography sx={[FontStyle]}>Delete</Typography>}
              />
            </ListItemButton>
          </List>
        </Popover> */}
        </Box>

        {/* <Dialog
          open={Overviewnotification}
          onClose={() => setShowOverviewnotification(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={[
              DialogHeader,
              DisplayFlex,
              {
                bgcolor: "#dcdcdc !important",
                justifyContent: "space-between",
              },
            ]}
          >
            Overview Notification
            <IconButton
              onClick={() => {
                handleCloseOverviewNotification();
              }}
              sx={{ padding: "5px", mr: -3 }}
            >
              <IoMdClose
                style={{
                  fontSize: 25,
                  fontWeight: 900,
                  color: "black",
                }}
              />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Grid container gap={1} sx={{ mt: 3 }}>
                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Notification Number <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                      {Overviewnotification?.Notification_Id}
                    </Typography>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Notification Date <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                    {Overviewnotification?.Notification_Time?.split(' ')[0]}
                    </Typography>
                  </Div>
                </Grid>

             

                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Send By <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                      {Overviewnotification?.Created_By?.username}
                    </Typography>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Notification Source <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                      {Overviewnotification?.NotificationModule}
                    </Typography>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Notification Module <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                      {Overviewnotification?.Notificationname}
                    </Typography>
                  </Div>
                </Grid>

                <Grid item xs={12} md={12} className="row">
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle]}
                    className="input-label col-sm-12 col-md-4"
                  >
                    Notification Details <span className="required"> * </span>
                  </Typography>
                  <Div
                    style={{
                      border: "1px solid #EEEEEE",
                      padding: "10px",
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "start",
                      borderRadius: "6px",
                      backgroundColor: "#F5F3F3",
                      height: "100px",
                    }}
                    className="col-sm-12 col-md-8"
                  >
                    <Typography id="Typography-root" sx={{ color: "#000" }}>
                      {Overviewnotification?.NotificationMsg}
                    </Typography>
                  </Div>

                

                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </Dialog> */}

        <OverviewPage
          label={"Notification Overview"}
          datas={Overviewnotification}
          open={Boolean(Overviewnotification)}
          setOpen={setShowOverviewnotification}
          onClose={() => setShowOverviewnotification(false)}
        ></OverviewPage>
      </JumboContentLayoutMain>
    </>
  );
};

export default NotificationSales;
