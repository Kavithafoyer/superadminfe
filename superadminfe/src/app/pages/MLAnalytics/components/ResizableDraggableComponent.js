import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import {
  removeCharts,
  selectChart,
  setCharts,
  setUpdateCharts,
} from "app/redux/self_service_BI/ViewOptionSlice";
import { IoIosMore } from "react-icons/io";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FontStyle } from "app/pages/widgets/CRMStyles";
import { TbRefresh } from "react-icons/tb";
import { MdZoomOutMap } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaClone } from "react-icons/fa6";
import { chartsMenu } from "../data/dummy";

const ResizableDraggableComponent = (props) => {
  const [selected, setSelected] = useState(null);
  const [size, setSize] = useState({ width: "100%", height: "100%" }); // Set defaults
  const displatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickCollapse = () => {
    setOpen(!open);
  };
  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const id = Boolean(anchorEl) ? "simple-popover" : undefined;

  const getTableHeads =
    useSelector((state) => state?.selfServiceViewOptions?.tableHeads) || [];

  const selectedTable = useSelector(
    (state) => state?.selfServiceViewOptions?.selectTable
  );
  const selectedChart = useSelector(
    (state) => state?.selfServiceViewOptions?.selectChart
  );
  const chartList = useSelector(
    (state) => state?.selfServiceViewOptions?.charts
  );
  const handleDragStop = (event, data) => {
    // setPosition({ x: data.x, y: data.y });
    let list = chartList?.map((item, index) => {
      if (item?.id === props.chart?.id && Boolean(data)) {
        return {
          ...item,
          position: { x: data.x, y: data.y },
        };
      } else {
        return item;
      }
    });

    // console.log("handlehandleDragStop", list);

    displatch(selectChart(props.chart?.id));
    setSelected(props.chart?.id);
    displatch(setUpdateCharts(list));
  };

  // chart replace
  const replaceChart = (chart) => {
    let list = chartList?.map((item, index) => {
      console.log("replace", item, chart);

      if (item?.id === selected) {
        return {
          ...item,
          type: chart?.type,
        };
      } else {
        return item;
      }
    });

    displatch(setUpdateCharts(list));
  };

  const handleResizeStop = (event, data, ref, position) => {
    // setSize({ width: data.width, height: data.height });
    let list = chartList?.map((item, index) => {
      if (index === props.index) {
        return {
          ...item,
          size: { width: ref?.style?.width, height: ref?.style?.height },
          position: { x: position?.x, y: position?.y },
        };
      } else {
        return item;
      }
    });

    // console.log("handlehandleResizeStop",list)
    displatch(setUpdateCharts(list));
  };

  console.log("size: ", props?.chart?.id === selectedChart);

  return (
    <Rnd
      style={{
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: props?.chart?.id === selectedChart ? 1 : 0,
        border:
          props?.chart?.id === selectedChart
            ? "1px solid #10BBE5"
            : "1px solid #ccc",
        padding: "15px ",
        paddingTop: "10px",
      }}
      default={{
        x: props?.chart?.position?.x,
        y: props?.chart?.position?.y,
        width: props?.chart?.size?.width || "100%",
        height: props?.chart?.size?.height || "100%",
      }}
      bounds="parent"
      onResize={(e, direction, ref, d, position) =>
        handleResizeStop(e, direction, ref, position)
      }
      onDragStop={(e, d) => handleDragStop(e, d)}
      // enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
      dragHandleClassName="drag-handle"
    >
      <div className="flex justify-between drag-handle cursor-move">
        <Typography>{getTableHeads[selectedTable]?.tableName}</Typography>
        <IoIosMore
          onContextMenu={handleClick}
          // aria-describedby={id}
          style={{ cursor: "pointer" }}
          onClick={handleClick}
        />
      </div>

      <Popover
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List
          sx={{
            width: "100%",
            minWidth: 190,
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
          // component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton onClick={handleClickCollapse}>
            <ListItemIcon sx={{ minWidth: "25px" }}>
              <TbRefresh style={{ color: "#20ABE8" }} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={[FontStyle]}>Replace Chart</Typography>}
            />
            {open ? (
              <ExpandLess style={{ fontSize: 16, color: "#20ABE8" }} />
            ) : (
              <ExpandMore style={{ fontSize: 16, color: "#20ABE8" }} />
            )}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {chartsMenu?.map((chart, i) => (
                <ListItemButton
                  key={i}
                  onClick={() => replaceChart(chart)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon
                    sx={{ minWidth: "25px", fontSize: "14px !important" }}
                  >
                    {chart?.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={[FontStyle]}>{chart?.type}</Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
          <ListItemButton
            onClick={() => {
              let dataChart = chartList?.filter(
                (chart, i) => chart?.id === selectedChart
              );
              if (Boolean(dataChart)) {
                let id =
                  chartList?.length > 0
                    ? chartList[chartList?.length - 1]?.id + 1
                    : 1;
                if (Boolean(id)) {
                  displatch(
                    setCharts({
                      ...dataChart[0],
                      id,
                      position: {
                        x: dataChart[0]?.position?.x,
                        y: dataChart[0]?.position?.y,
                      },
                    })
                  );
                  displatch(selectChart(id));
                  setSelected(id);
                  setAnchorEl(null);
                  console.log("chartList[selected]", chartList);
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: "25px" }}>
              <FaClone style={{ color: "#20ABE8" }} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={[FontStyle]}>Duplicate</Typography>}
            />
          </ListItemButton>

          {/* <ListItemButton>
            <ListItemIcon sx={{ minWidth: "25px" }}>
            <MdZoomOutMap  style={{  color: '#20ABE8' }} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={[FontStyle]}>Zoom</Typography>}
            />
          </ListItemButton> */}

          <ListItemButton
            onClick={() => {
              console.log("sdsa", selected);
              displatch(removeCharts(selectedChart));
              displatch(selectChart(null));
              setAnchorEl(null);
            }}
          >
            <ListItemIcon sx={{ minWidth: "25px" }}>
              <MdDelete style={{ color: "tomato" }} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography sx={[FontStyle]}>Delete</Typography>}
            />
          </ListItemButton>
        </List>
      </Popover>

      <div style={{ height: "calc(100% - 24px)" }}>{props?.children}</div>
    </Rnd>
  );
};

export default memo(ResizableDraggableComponent);
