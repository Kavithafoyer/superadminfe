import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";

function ExcelReader() {
  const [table, setTable] = useState([]);

  const excelData = useSelector(
    (state) => state?.selfServiceViewOptions?.tables
  );

  const selectedTable = useSelector(
    (state) => state?.selfServiceViewOptions?.selectTable
  );

  const isshodataFunc = useCallback(
    (show) => {
      setTable(show);
      // console.log("sadsadasd",excelData)
    },
    [table]
  );

  useEffect(() => {
    isshodataFunc(excelData);
  }, [excelData]);

  // console.log("excelData",excelData,selectedTable)
  return (
    <div className="bg-white">
      {table && (
        <Table stickyHeader className="">
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
              {table?.length > 0 &&
                Object.entries(table[selectedTable]?.data[0])?.map(
                  ([column, columnData], index) => (
                    <>
                      {typeof columnData !== "object" &&
                        !Array.isArray(columnData) && (
                          <TableCell
                            sx={{
                              cursor: "pointer",
                              flexWrap: "nowrap",
                              padding: "0px 10px  !important",
                              fontSize: "12px ",
                              backgroundColor: `#F3F3F3 !important`,
                              color: `#10BBE5 !important`,
                              fontWeight: "500",
                              // minWidth:"120px",
                              boxShadow: "none",
                            }}
                            key={index}
                          >
                            {column}
                          </TableCell>
                        )}
                    </>
                  )
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {table?.length > 0 &&
              table[selectedTable]?.data?.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row)?.map((cell, cellIndex) => (
                    <>
                      {typeof cell !== "object" && !Array.isArray(cell) && (
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
      )}
    </div>
  );
}

export default memo(ExcelReader);
