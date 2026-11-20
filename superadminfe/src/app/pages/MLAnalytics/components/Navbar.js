/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
import React, { memo, useEffect, useRef, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  FaChartPie,
  FaChartArea,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa6";
import { BiSolidDoughnutChart } from "react-icons/bi";
import axios from "axios";
import {
  setCharts,
  setShowData,
  setSideMenuOptions,
  setTableHeads,
  setTables,
  setUpdateCharts,
} from "app/redux/self_service_BI/ViewOptionSlice";
import { useStateContext } from "app/contexts/ContextProvider";
// import Selectdropdown from "./Selectdropdown";
import { charts } from "../data/dummy";
import {
  CustomButton,
  CustomIcons,
  SelectDropdown,
} from "app/pages/widgets/StylesComponents";
import { FontStyle } from "app/pages/widgets/CRMStyles";
import { useNavigate } from "react-router-dom";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <Tooltip content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </Tooltip>
);

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Navbar = () => {
  const [importedTables, setImportedTables] = useState([]);
  // const [checkBox,setChechBox] = useState([])
  const navigate = useNavigate();
  const showDatas = useSelector(
    (state) => state?.selfServiceViewOptions?.showData,
  );

  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  const StyledTabs = styled((props) => (
    <Tabs
      {...props}
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  ))({
    "& .MuiTabs-indicator": {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    "& .MuiTabs-indicatorSpan": {
      // maxWidth: 50,
      width: "60%",
      backgroundColor: "#10BBE5",
    },
  });

  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      // textTransform: "none",
      color: "rgba(0, 0, 0, 0.85)",
      fontSize: 12,
      fontWeight: 600,
      // marginRight: 1,
      "&.Mui-selected": {
        color: "#10BBE5",
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#10BBE5",
      },
    }),
  );

  const [value, setValue] = React.useState(0);
  const [Month, setMonth] = React.useState(0);
  const [forecasting, setForeCasting] = React.useState(false);
  const [xaxis, setXaxis] = React.useState("");
  const [yaxis, setyaxis] = React.useState([]);
  const [legend, setlegend] = React.useState("");
  const [update, setUpdate] = React.useState([]);
  const [error, setError] = React.useState({});
  // const [showPanes, setSshowPanes] = React.useState({
  //   data: false,
  //   visual: false,
  //   filter: false,
  // });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      displatch(setSideMenuOptions("analytics"));
    } else {
      displatch(setSideMenuOptions("report"));
    }
  };

  const isSideMenuOptions = useSelector(
    (state) => state.selfServiceViewOptions.sideMenuOptions,
  );

  const displatch = useDispatch();
  const getChart = useSelector(
    (state) => state?.selfServiceViewOptions?.charts,
  );
  const getTables = useSelector(
    (state) => state?.selfServiceViewOptions?.tables,
  );

  const getTableHeads =
    useSelector((state) => state?.selfServiceViewOptions?.tableHeads) || [];

  const selectedTable = useSelector(
    (state) => state?.selfServiceViewOptions?.selectTable,
  );

  const selectChart = useSelector(
    (state) => state?.selfServiceViewOptions?.selectChart,
  );

  const sideMenuOptions =
    useSelector((state) => state?.selfServiceViewOptions?.sideMenuOptions) ||
    "";

  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const handleChangePanes = (event) => {
    displatch(setShowData(event.target.checked));
  };

  const handleChartClick = (event) => {
    const id =
      getChart?.length > 0 ? getChart[getChart?.length - 1]?.id + 1 : 1;

    if (Boolean(event) && Boolean(id)) {
      displatch(
        setCharts({
          id,
          type: event,
          position: { x: 0, y: 0 },
          size: { width: 500, height: 500 },
          filter: { Xaxis: [], Yaxis: [], legend: [] },
          zoom: false,
          data: [],
        }),
      );
    }
  };

  // import dialog states and functions
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImportedTables({});
  };

  const loadFunctions = () => {
    const fIdx = getTableHeads?.some((t) =>
      update?.some((o) => o.tableName === t.tableName && o.check === true),
    );

    console.log("fIdx", fIdx, update, getTableHeads);

    if (!fIdx) {
      if (update?.some((boo) => Boolean(boo?.check))) {
        update?.map((data, index) => {
          const id =
            getTables?.length > 0
              ? getTables[getTables?.length - 1]?.id + 1 + index
              : 1 + index;

          if (data?.check) {
            // console.log("Checkdata",data)
            displatch(
              setTables({
                id,
                tableName: data?.tableName,
                data: data?.data,
              }),
            );
            displatch(
              setTableHeads({
                tableName: data?.tableName,
                data:
                  (data?.data?.length > 0 &&
                    Object.keys(data?.data[0])?.map((key) => ({
                      name: key,
                      bool: false,
                    }))) ||
                  [],
              }),
            );
            setOpen(false);
          }
        });
      } else {
        alert("Please select a table");
      }
    } else {
      alert("Please select another table because it's already imported");
    }
  };

  // import excels sheets
  // const inputFile = useRef(null);

  const FetchGetData = async () => {
    try {
      const response = await axios.post(
        "https://backend.crmfarm.app/demo/user/ChartDsign_dataloader/",
        {},
        {
          headers: {
            db: item,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      // eslint-disable-next-line no-console
      console.log("Product Inward", response?.data);
      // setCount(response.data?.count || 0);
      // setDatas(response.data?.results || []);
      const tables = [];
      Object.keys(response?.data)?.length > 0 &&
        // eslint-disable-next-line array-callback-return
        Object.entries(response?.data)?.map(([key, data]) => {
          tables.push({
            tableName: key,
            data,
            check: false,
            selectedTable: false,
          });
        });
      setUpdate(tables);
      setOpen(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  // check functions

  const checkImportedFun = (index) => {
    const updatedTables = [...update];
    updatedTables[index].check = !updatedTables[index]?.check;
    console.log("updated", index, updatedTables[index]?.check, updatedTables);
    setUpdate(updatedTables);
  };

  const handleFileUpload = async () => {
    await FetchGetData();
    // const tables = [];
    // Object.keys(dummyTables)?.length > 0
    //   && Object.entries(dummyTables)?.map(([key, data]) => {
    //     tables.push({
    //       tableName: key,
    //       data,
    //       check: false,
    //       selectedTable: false,
    //     });
    //   });
    // console.log('tables2: ', tables);
    //   setOpen(tables);

    //   if (reader.readAsArrayBuffer) {
    //     reader.readAsArrayBuffer(file);
    //   } else {
    //     reader.readAsBinaryString(file);
    //   }
    // };

    // // check functions
    // const checkImportedFun = (index) => {
    //   const updatedTables = [...open];
    //   updatedTables[index].check = !updatedTables[index]?.check;
    //   setOpen(updatedTables);
  };

  console.log("getTableHeads", getTableHeads[selectedTable]);

  const setChartDatas = (data) => {
    console.log("setChartDatas", getTables[selectedTable], selectedTable);
    let lists = [];

    getTables[selectedTable]?.data?.forEach((data) => {
      yaxis?.forEach((axis) => {
        let ListFI = lists.findIndex((list) => list?.xaxis === data[xaxis]);

        if (ListFI !== -1) {
          // let existingDataIndex = lists[ListFI]?.data.findIndex(item => item[axis?.name] === data[axis?.name]);

          if (lists[ListFI][axis?.name] === data[axis?.name]) {
            // Increment count if the data exists
            lists[ListFI][axis?.name + "_Count"]++;
          } else {
            // Add new data if it doesn't exist
            ((lists[ListFI][axis?.name] = data[axis?.name]),
              (lists[ListFI][axis?.name + "_Count"] = 1));
          }
        } else {
          // Add new xaxis with data if it doesn't exist
          lists.push({
            xaxis: data[xaxis],
            [axis?.name]: data[axis?.name],
            [axis?.name + "_Count"]: 1,
          });
        }
      });
    });

    let setchartdata = getChart?.map((item, index) => {
      // console.log("replace",item,chart)

      if (item?.id === selectChart) {
        return {
          ...item,
          data: lists,
        };
      } else {
        return item;
      }
    });

    displatch(setUpdateCharts(setchartdata));

    console.log("lists", setchartdata, lists);
  };

  const filterFunction = () => {
    let error = {};
    console.log("newvaluexaxis  ", xaxis, yaxis);

    if (!Boolean(xaxis)) {
      error.xaxis = "Please select a valid X-axis";
    }
    if (!Boolean(yaxis?.length > 0 || Object.keys(yaxis).length > 0)) {
      error.yaxis = "Please select a valid y-axis";
    }

    if (Object.keys(error).length === 0) {
      setChartDatas();
    } else {
      alert("must be a valid X-axis and y-axis");
    }
    setError(error);
    console.log("error: ", error, xaxis, yaxis);
  };

  // <-- ------------------------------------------------ useQuery ---------------------------------------------- -->

  return (
    <div
      className={`"p-2 pl-1 relative z-50" ${
        isSideMenuOptions === "analytics" ? "h-20  z-50" : "h-30"
      }`}
    >
      <Box
        className={`"flex ${
          isSideMenuOptions === "analytics" ? "h-20  z-50" : "h-30"
        }"`}
      >
        <div className={isSideMenuOptions === "analytics" ? "h-full" : ""}>
          <div
            className={`flex align-items-center ${
              isSideMenuOptions === "analytics" ? "h-full" : ""
            }`}
          >
            <IconButton
              onClick={() => navigate("/home", { replace: true })}
              className="mt-2"
            >
              {CustomIcons.backIcon}
            </IconButton>

            <InputLabel className="mt-2">
              <Button
                className="border-1"
                onClick={handleFileUpload}
                component="span"
              >
                Import
              </Button>
            </InputLabel>

            <Box>
              <StyledTabs
                value={value}
                onChange={handleChange}
                aria-label="styled tabs example"
              >
                {/* <StyledTab
                  label={
                    <Typography sx={{ fontSize: "14px" }}>Home</Typography>
                  }
                /> */}
                {sideMenuOptions !== "table" && (
                  <StyledTab
                    label={
                      <Typography sx={{ fontSize: "14px" }}>Insert</Typography>
                    }
                  />
                )}
                {/* <StyledTab
                  label={
                    <Typography sx={{ fontSize: "14px" }}>View</Typography>
                  }
                /> */}
                <StyledTab
                  label={
                    <Typography sx={{ fontSize: "14px" }}>Analytics</Typography>
                  }
                />
              </StyledTabs>
              {/* <Box sx={{ p: 3 }} /> */}
            </Box>
          </div>

          {/* Home */}
          <Box
            className={`${
              isSideMenuOptions === "analytics" ? "h-0" : "h-10"
            } flex align-items-center ml-14`}
          >
            {
              // sideMenuOptions !== "table" && value == 0 && (
              //   <Box className="pl-2 mt-1 border-x-1 w-30">
              //     {/* show Panels */}
              //     <CustomButton
              //       onClick={() => setForeCasting(!forecasting)}
              //       label="Forecast"
              //       Icon=""
              //     />
              //   </Box>
              // )
            }

            {
              // (sideMenuOptions === "table" ? value === 1 : value === 2) && (
              //   <Box className="pl-2  border-x-1 w-30">
              //     {/* show Panels */}
              //     <FormControlLabel
              //       control={
              //         <Checkbox
              //           size="small"
              //           color="warning"
              //           checked={showDatas}
              //           onChange={handleChangePanes}
              //           name="data"
              //         />
              //       }
              //       label={<Typography sx={{ fontSize: 12 }}>Data</Typography>}
              //     />
              //   </Box>
              // )
            }
            {/* Insert Menu */}
            {sideMenuOptions !== "table" && value === 0 && (
              <Box>
                <Box className="pl-2 border-x-1 w-30 mt-2">
                  {/* show Charts */}
                  <Box className="flex ">
                    {charts?.map((chart, i) => (
                      <IconButton
                        title={chart?.type || ""}
                        key={i}
                        onClick={() => handleChartClick(chart.type)}
                        sx={{ padding: "7px", m: 0.8 }}
                      >
                        {chart?.icon}
                      </IconButton>
                    ))}
                  </Box>
                  <Typography
                    className="pl-2 "
                    style={{ fontSize: 10, fontWeight: 400 }}
                  >
                    Visualizations
                  </Typography>
                </Box>
              </Box>
            )}
            {sideMenuOptions !== "analytics" &&
              (Boolean(selectChart) || selectChart == 0) && (
                <div className="p-4 w-screen">
                  <Box className="flex align-items-end  gap-4 mt-2">
                    <div className="col-span-2">
                      <Typography sx={[FontStyle]}>
                        {getTableHeads[selectedTable]?.tableName} X-axis
                      </Typography>
                      {console.log("erroes", error)}
                      <SelectDropdown
                        value={xaxis}
                        getOptionLabel="name"
                        sx={{
                          border: error?.xaxis && "1px solid red",
                          borderRadius: "5px",
                        }}
                        options={getTableHeads[selectedTable]?.data?.filter(
                          (value) => !value.bool,
                        )}
                        onChange={(e, newvalue) => {
                          setXaxis(newvalue?.name);
                          console.log("newvalue", newvalue);
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <Typography sx={[FontStyle]}>
                        {getTableHeads[selectedTable]?.tableName} Y-axis
                      </Typography>
                      <SelectDropdown
                        multiple
                        value={yaxis}
                        sx={{
                          border: error?.yaxis && "1px solid red",
                          borderRadius: "5px",
                        }}
                        getOptionLabel="name"
                        options={getTableHeads[selectedTable]?.data?.filter(
                          (value) => !value.bool,
                        )}
                        onChange={(e, newvalue) => {
                          setyaxis(newvalue);
                          console.log("newvalue", newvalue);
                        }}
                      />
                    </div>

                    {forecasting && (
                      <div className="col-span-1">
                        <Typography sx={[FontStyle]}>
                          Forecast (Month)
                        </Typography>
                        <TextField
                          className="search-select"
                          sx={{ width: 100 }}
                        />
                      </div>
                    )}
                    {/* <div className="col-span-2">
              <Typography sx={[FontStyle]}>Legend</Typography>
              <SelectDropdown
                getOptionLabel="name"
                value={legend}
                options={getTableHeads[selectedTable]?.data?.filter((value) => !value.bool)}
                onChange={(e, newvalue) => { setlegend(newvalue?.name); }}

              />
              
            </div> */}
                    <div className="col-span-1 ">
                      <Button
                        onClick={() => {
                          filterFunction();
                          console.log({
                            tableName: getTableHeads[selectedTable]?.tableName,
                            xaxis,
                            yaxis: yaxis?.map((re) => re?.name) || [],
                            legend,
                          });
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </Box>
                </div>
              )}
            {/* <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} /> */}
          </Box>
        </div>
      </Box>

      {/* <--------------------------------------- Import Dialog Box --------------------------------------------> */}
      <Dialog
        sx={{ bgcolor: "transparent !important", zIndex: 99999 }}
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle className="flex items-center justify-between border-1">
          <Typography sx={{ fontSize: "14px" }}>Import Tables</Typography>
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-12 gap-2 ">
            <Box className="col-span-2 border-r-1 ">
              <List>
                {update?.length > 0 &&
                  update?.map((tlist, i) => (
                    // console.log("tlist", tlist);
                    <div key={i} className="flex items-center cursor-pointer ">
                      <FormControlLabel
                        // sx={{ marginRight: "0px" }}
                        control={
                          <Checkbox
                            onClick={() => checkImportedFun(i)}
                            checked={tlist?.check}
                            color="warning"
                          />
                        }
                      />
                      <Typography
                        onClick={() => {
                          setImportedTables(tlist);
                          // console.log('tlist', tlist);
                        }}
                        sx={{ fontSize: 12 }}
                      >
                        {tlist?.tableName || "-"}
                      </Typography>
                    </div>
                  ))}
              </List>
            </Box>
            <Box sx={{ height: 600 }} className="col-span-10 overflow-auto">
              <Table stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#F3F3F3",
                      },
                      // hide last border
                      "td, th": {
                        border: "0px solid !important",
                        height: "35px !important",
                        padding: "0px !important",
                        paddingX: "10px !important",
                      },
                    }}
                  >
                    {importedTables?.data?.length > 0 &&
                      Object.entries(importedTables?.data[0])?.map(
                        ([column, columnData], index) => (
                          <>
                            {/* {console.log('column', column,columnData)} */}
                            {typeof columnData !== "object" &&
                              !Array.isArray(columnData) && (
                                <TableCell
                                  sx={{
                                    cursor: "pointer",
                                    flexWrap: "nowrap",
                                    padding: "0px 10px  !important",
                                    fontSize: "12px ",
                                    backgroundColor: "#F3F3F3 !important",
                                    color: "#10BBE5 !important",
                                    fontWeight: "500",
                                    minWidth: "80px",
                                    boxShadow: "none",
                                  }}
                                  key={index}
                                >
                                  {column}
                                </TableCell>
                              )}
                          </>
                        ),
                      )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importedTables?.data?.length > 0 &&
                    importedTables?.data?.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object?.values(row)?.map((cell, cellIndex) => (
                          <>
                            {typeof cell !== "object" &&
                              !Array.isArray(cell) && (
                                <TableCell
                                  sx={{
                                    boxShadow: "none",
                                    fontSize: "12px !important",
                                    fontWeight: "400 !important",
                                    padding: "5px 10px !important",
                                  }}
                                  key={cellIndex}
                                >
                                  {cell}
                                </TableCell>
                              )}
                          </>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          {/* <List></List> */}
        </DialogContent>
        <DialogActions>
          <Button className="border-1 border" onClick={loadFunctions}>
            Load
          </Button>
          <Button className="border-1 border" onClick={handleClose} Cancel>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(Navbar);
