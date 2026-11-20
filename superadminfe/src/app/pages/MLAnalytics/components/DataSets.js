/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/jsx-no-useless-fragment */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { MdExpandMore, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  setSelectTable,
  setShowData,
  setTableHeadsVisibles,
} from "app/redux/self_service_BI/ViewOptionSlice";

function DataSets() {
  const showDatas =
    useSelector((state) => state?.selfServiceViewOptions?.showData) || false;
  const tableHeaders =
    useSelector((state) => state?.selfServiceViewOptions?.tableHeads) || [];
  const sideMenuOptions =
    useSelector((state) => state?.selfServiceViewOptions?.sideMenuOptions) ||
    "";

  const selectedTable = useSelector(
    (state) => state?.selfServiceViewOptions?.selectTable
  );

  const display = useDispatch();
  // console.log('2', tableHeaders);

  const visbleButton = (mainIdx, subIdx) => {
    const table = JSON.parse(JSON.stringify(tableHeaders));
    // console.log('display', table);
    if (table?.length > 0) {
      table[mainIdx].data[subIdx].bool = !table[mainIdx]?.data[subIdx]?.bool;
      display(setTableHeadsVisibles(table));
    }
  };

  return (
    <>
      <div
        // style={{ display: showDatas ? "block" : "none" }}
        className="bg-gray-100 border-l-slate-100 px-2"
      >
        <div className="flex items-center justify-between">
          <h2 style={{ fontWeight: 700 }}>Data</h2>
          <IconButton onClick={() => display(setShowData(!showDatas))}>
            <MdKeyboardDoubleArrowRight style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        {tableHeaders?.map((rowData, index) => (
          <Accordion
            sx={{
              boxShadow: "none !important",
              bgcolor: "transparent !important",
            }}
          >
            <AccordionSummary
              sx={{
                bgcolor:
                  index === selectedTable ? "rgb(3, 201, 215)" : "transparent",
                borderRadius: "5px",
                borderBottomRightRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
              expandIcon={
                <MdExpandMore
                  style={{ color: index === selectedTable ? "white" : "gray" }}
                />
              }
            >
              <Typography
                title="click"
                onClick={() => {
                  display(setSelectTable(index));
                }}
                sx={{
                  fontSize: "14px",
                  color: index === selectedTable ? "white" : "black",
                }}
              >
                {rowData?.dataName || rowData?.tableName}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                border:
                  index === selectedTable
                    ? "1px solid rgb(3, 201, 215)"
                    : "none",
                borderRadius: "5px",
                borderTopRightRadius: "0px",
                borderTopLeftRadius: "0px",
              }}
            >
              <div>
                {rowData?.data?.length > 0 &&
                  // eslint-disable-next-line no-undef
                  rowData?.data?.map((key, idx) => (
                    // console.log('sdsadhb', key.name, idx);

                    <>
                      {(sideMenuOptions !== "table" ? !key?.bool : true) && (
                        <div key={idx}>
                          <FormControlLabel
                            sx={{
                              px: 1.5,
                              py: sideMenuOptions === "report" ? 1.5 : 0,
                            }}
                            // eslint-disable-next-line no-nested-ternary
                            control={
                              sideMenuOptions === "report" ? (
                                <></>
                              ) : !key?.bool ? (
                                <IoEye
                                  onClick={() => visbleButton(index, idx)}
                                  style={{
                                    fontSize: 17,
                                    color: "gray",
                                    margin: "10px",
                                  }}
                                  color="warning"
                                />
                              ) : (
                                <IoEyeOff
                                  onClick={() => visbleButton(index, idx)}
                                  style={{
                                    fontSize: 17,
                                    color: "gray",
                                    margin: "10px",
                                  }}
                                  color="warning"
                                />
                              )
                            }
                            label={
                              <Typography
                                sx={{ fontSize: "12px", color: "black" }}
                              >
                                {key?.name}
                              </Typography>
                            }
                          />
                        </div>
                      )}
                    </>
                  ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
}

export default memo(DataSets);
