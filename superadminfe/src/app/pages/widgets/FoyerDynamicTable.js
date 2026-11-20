import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Tooltip,
  IconButton,
  Typography,
  Avatar,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { capitalCase } from "change-case";
import StyledTableCell from "../StyledTableCell";
import Checkbox from "@mui/material/Checkbox";
import {
  CommonPagination,
  CustomTooltip,
  DateFormatter,
  EditIcon,
  FirstLetterCaps,
  NoRecordsPage,
} from "./StylesComponents";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { FaTasks } from "react-icons/fa";

const getNestedValue = (obj, path) => {
  return path?.split(".").reduce((acc, key) => acc?.[key], obj);
};

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) =>
      (b[orderBy] ?? "")
        .toString()
        .localeCompare((a[orderBy] ?? "").toString())
    : (a, b) =>
      (a[orderBy] ?? "")
        .toString()
        .localeCompare((b[orderBy] ?? "").toString());

const FoyerDynamicTable = ({
  data = [],
  columnsConfig = [],
  isAction = false,
  loading = false,
  pagination = true,
  checkbox = false,
  selectedRows = [],
  customActions,
  setSelectedRows = () => { },
  onEdit = () => { },
  onDelete = () => { },
  handleChangePage = () => { },
  showEdit = true,
  showDelete = true,
  AssignLead = false,
  onAssign = () => { },
  minHeight = 300,
  onQualify = () => { },
  qualifyLead = false,
  askQuestion = false,
  onQuestion = () => { },
  extraPayload,
  page,
  count,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [columnState, setColumnState] = useState(columnsConfig);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const tableContainerRef = useRef(null);

  const responsiveHeight = useMemo(() => {
    const OFFSET = 250;
    const height = windowHeight - OFFSET;
    return height > minHeight ? height : minHeight;
  }, [windowHeight, minHeight]);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leadStageColors = {
    Enquiry: "#ff9f51", Registered: "#54c6bc", Contacted: "#f8b45e", Open: "#f8b45e",
    Qualified: "#54c6bc", Approved: "#54c6bc", ReadyforTesting: "#54c6bc",
    "Application Sent": "#7efa74", "Application Submitted": "#ffd571", "Documents Verified": "#798af4",
    Counseled: "#63c5fb", Shortlisted: "#51a8fe", InProgress: "#51a8fe", Rejected: "#ff6565",
    Applied: "#ea6eff", Enrolled: "#65e66c", Cool: "#91d0faff", Hot: "#fb8383ff",
    Warm: "#faf891ff", Pending: "#ec4e0fff", Draft: "#ec4e0fff", "In progress": "#74bcecff",
    Completed: "#009688", Fixed: "#009688", Submitted: "#009688",
  };

  const getStickyLeft = (columns, upToIndex) => {
    const checkboxWidth = 48;
    const baseLeft = checkbox ? checkboxWidth : 0;
    return (
      baseLeft +
      columns
        .slice(0, upToIndex)
        .filter((col) => col.sticky)
        .reduce((acc, col) => {
          const width = parseInt(col.width?.replace("px", "") || 100, 10);
          return acc + width;
        }, 0)
    );
  };

  const columns = useMemo(
    () =>
      columnState.map((col) => ({
        ...col,
        label: col.label || capitalCase(col.key),
        sticky: !!col.sticky,
        width: col.width || "minmax(120px, 1fr)",
        clickable: !!col.onClick,
      })),
    [columnState]
  );

  const sortedData = useMemo(() => {
    if (Array.isArray(data)) {
      return [...data].sort(getComparator(order, orderBy));
    }
  }, [data, order, orderBy]);

  const handleSort = (key) => {
    const isAsc = orderBy === key && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(key);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...columns];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setColumnState(reordered);
  };

  const isAllChecked = useMemo(
    () => selectedRows.length === data.length && data.length > 0,
    [selectedRows, data]
  );

  const isIndeterminate = useMemo(
    () => selectedRows.length > 0 && selectedRows.length < data.length,
    [selectedRows, data]
  );

  const handleSelectAll = () => {
    if (isAllChecked) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...data]);
    }
  };

  const handleRowSelect = (row) => {
    const isSelected = selectedRows.some((r) => r.id === row.id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((r) => r.id !== row.id));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", position: "relative" }} ref={tableContainerRef}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <TableContainer
          sx={{
            height: responsiveHeight,
            overflowY: "auto",
            overflowX: "auto",
            position: "relative",
            maxHeight: "calc(100vh - 240px)",
            "&::-webkit-scrollbar": { width: "8px", height: "8px" },
            "&::-webkit-scrollbar-thumb": { background: "#b1b1b1", borderRadius: "50px" },
            "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
          }}
        >
          {loading && (
            <Box sx={{ position: "absolute", inset: 0, zIndex: 20, backgroundColor: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={32} />
            </Box>
          )}
          <Table stickyHeader>
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 15, backgroundColor: "#fff", boxShadow: 0.5 }}>
              <Droppable droppableId="columns-droppable" direction="horizontal" type="column">
                {(provided) => (
                  <TableRow ref={provided.innerRef} {...provided.droppableProps}>
                    {checkbox && (
                      <StyledTableCell padding="checkbox" sx={{ position: "sticky", left: 0, zIndex: 15, backgroundColor: "#fbfeff", minWidth: "48px", borderRight: "1px solid #eee" }}>
                        <Checkbox size="small" checked={isAllChecked} indeterminate={isIndeterminate} onChange={handleSelectAll} />
                      </StyledTableCell>
                    )}
                    {columns?.map((column, index) => (
                      <Draggable key={column.key} draggableId={column.key} index={index}>
                        {(provided) => (
                          <StyledTableCell
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              position: column.sticky ? "sticky" : "static",
                              left: column.sticky ? getStickyLeft(columns, index) : undefined,
                              zIndex: column.sticky ? 11 : 10,
                              backgroundColor: "#fbfeff",
                              minWidth: column.width,
                              fontWeight: "bold",
                              fontSize: "15px",
                              textAlign: column.textAlign || "left",
                            }}
                          >
                            <TableSortLabel active={orderBy === column.key} direction={orderBy === column.key ? order : "asc"} onClick={() => handleSort(column.key)}>
                              {column.label}
                            </TableSortLabel>
                          </StyledTableCell>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableRow>
                )}
              </Droppable>
            </TableHead>
            <TableBody>
              {sortedData?.length > 0 ? (
                sortedData?.map((row, idx) => (
                  <TableRow key={row.id || idx} hover>
                    {checkbox && (
                      <StyledTableCell padding="checkbox" sx={{ position: "sticky", left: 0, zIndex: 1, backgroundColor: "#fff", borderRight: "1px solid #eee" }}>
                        <Checkbox size="small" checked={selectedRows.some((r) => r.id === row.id)} onChange={() => handleRowSelect(row)} />
                      </StyledTableCell>
                    )}
                    {columns?.map((col, index) => (
                      <StyledTableCell
                        key={`${row.id}-${col.key}`}
                        sx={{
                          position: col.sticky ? "sticky" : "static",
                          left: col.sticky ? getStickyLeft(columns, index) : undefined,
                          textAlign: col.textAlign || "left",
                          zIndex: col.sticky ? 9 : "auto",
                          backgroundColor: "#fff",
                          cursor: col.onClick ? "pointer" : "default",
                        }}
                        onClick={col.onClick ? () => col.onClick(row) : undefined}
                      >
                        {col.render ? col.render(row) : (getNestedValue(row, col.key) || "-")}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={columns.length + (checkbox ? 1 : 0)} align="center">
                    <NoRecordsPage title="Records" />
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination && <CommonPagination count={count} page={page} onChange={handleChangePage} />}
      </DragDropContext>
    </Box>
  );
};

export default FoyerDynamicTable;
