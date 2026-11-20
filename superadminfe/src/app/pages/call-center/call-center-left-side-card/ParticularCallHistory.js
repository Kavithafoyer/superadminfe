import {
  Table,
  TableBody,
  TableHead,
  Typography,
  Pagination,
  Avatar,
  FormControlLabel,
  Box,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import Div from "@jumbo/shared/Div/Div";

import JumboScrollbar from "@jumbo/components/JumboScrollbar";

import "react-toastify/dist/ReactToastify.css";
import {
  CRMTableHead,
  FontStyle,
  PrimaryColor,
  avatarColors,
} from "app/pages/widgets/CRMStyles";
import { CRMTableCell, CRMTableRow } from "app/pages/widgets/CRMTable";
import { memo } from "react";
import {
  AvatarCircle,
  NoRecordsPage,
} from "app/pages/widgets/StylesComponents";
import { AutoHeight } from "app/redux/auth/localStorage";

const ParticularCallHistory = ({
  scrollHeight,
  datePicker,
  activitiesList,
  id,
  setUserCallsActivities,
  index,
}) => {

  console.log("activitiesListhistory", activitiesList, id)
  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);

  const [contactname, setContactName] = useState(true);
  const [phone, setPhone] = useState(true);
  const [act, setAct] = useState(true);
  const [actstatus, setActStatus] = useState(true);
  const [actdetails, setActDetails] = useState(true);
  const [companyname, setCompanyName] = useState(true);
  const [date, setDate] = useState(false);
  const [actrelates, setActRelates] = useState(false);
  const [actNext, setActNext] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showsort, setShowsort] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //code for table sorting
  const sortData = (key, direction) => {
    const sortedData = [...datas];

    sortedData?.sort((a, b) => {
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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    sortData(key, direction);
    setShowsort(false);
  };

  useEffect(() => {
    let data = [];
    let date = new Date(
      new Date(datePicker || new Date()).getTime() + 1 * 86400000
    )
      .toISOString()
      .split("T")[0];

    activitiesList?.forEach((activities) => {
      if (
        Number(activities?.Contact_Id?.id) === Number(id?.id) &&
        new Date(datePicker || new Date())?.toISOString()?.split("T")[0] ==
        new Date(activities?.Selected_Date).toISOString()?.split("T")[0]
      ) {
        data.push(activities);
        console.log("activities", activities);
      }
    });

    setDatas(data);
  }, [id]);

  return (
    <>
      <Div>
        <Div sx={{ mt: 2 }}>
          <AvatarCircle
            size={50}
            fontSize={"16px"}
            labelSize="15px"
            bgColor={avatarColors[index]}
            title={id?.Name}
            label={id?.Name}
            subLabel={id?.Mobile_Number}
          />
        </Div>

        <Box sx={{ mt: 1.5 }}>
          <JumboScrollbar
            autoHeight={true}
            autoHideTimeout={4000}
            autoHeightMin={AutoHeight(2)}
            autoHide={true}
            hideTracksWhenNotNeeded
            id="no-more-tables"
          >
            <Table className="table">
              <TableHead sx={[CRMTableHead, FontStyle]}>
                <CRMTableRow>
                  {
                    <CRMTableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 103,
                      }}
                      onClick={() => handleSort("Selected_Date")}
                    >
                      Date
                    </CRMTableCell>
                  }

                  {
                    <CRMTableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 103,
                      }}
                      onClick={() => handleSort("Selected_Date")}
                    >
                      Time
                    </CRMTableCell>
                  }
                  {
                    <CRMTableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 100,
                      }}
                      onClick={() => handleSort("Activity_Type")}
                    >
                      Activity
                    </CRMTableCell>
                  }

                  {
                    <CRMTableCell
                      onClick={() => handleSort("Select_Status")}
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 100,
                      }}
                    >
                      Call Status
                    </CRMTableCell>
                  }

                  {
                    <CRMTableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 101,
                      }}
                      onClick={() => handleSort("Details")}
                    >
                      Call Notes
                    </CRMTableCell>
                  }

                  {
                    <CRMTableCell
                      sx={{
                        fontWeight: 600,
                        color: "white",
                        cursor: "pointer",
                        minWidth: 138,
                      }}
                      onClick={() => handleSort("Next_SheduledTime")}
                    >
                      Next Call
                    </CRMTableCell>
                  }
                </CRMTableRow>
              </TableHead>
              {datas?.length > 0 && (
                <TableBody className="table-body" sx={{ mt: 2 }}>
                  {datas?.length > 0 &&
                    datas?.map((data, index) => {
                      return (
                        <CRMTableRow>
                          {
                            <CRMTableCell data-title="Date">
                              {data?.Selected_Date}
                            </CRMTableCell>
                          }
                          {
                            <CRMTableCell data-title="Next Date">
                              {new Date(data?.End_Time).toLocaleString(
                                undefined,
                                {
                                  hour12: true,
                                  hour: "numeric",
                                  minute: "numeric",
                                  second: "numeric",
                                }
                              )}
                            </CRMTableCell>
                          }
                          {
                            <CRMTableCell
                              data-title="Activity Type"
                              onClick={() => {
                                // console.log("check");
                                // setShowDialog(true);
                              }}
                            >
                              {data?.Activity_Type}
                            </CRMTableCell>
                          }
                          {
                            <CRMTableCell data-title="Status" sx={[FontStyle]}>
                              {data?.Select_Status}
                            </CRMTableCell>
                          }
                          {
                            <CRMTableCell data-title="Details">
                              {data?.Details}
                            </CRMTableCell>
                          }
                          {
                            <CRMTableCell data-title="Next Date">
                              {
                                new Date(data?.Next_SheduledTime)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </CRMTableCell>
                          }
                        </CRMTableRow>
                      );
                    })}
                </TableBody>
              )}
            </Table>
            {datas?.length == 0 && (
              <Div>
                <NoRecordsPage title="Calls" />
              </Div>
            )}
          </JumboScrollbar>
        </Box>

        {/* code for pagination */}

        <Div
          sx={{
            display: datas?.length === 0 ? "none" : "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Pagination
            color="success"
            count={Math?.ceil(datas?.length / count)}
            page={page}
            onChange={(e, newValue) => handleChangePage(e, newValue)}
            size="small"
            showFirstButton
            showLastButton
          />
        </Div>
      </Div>
    </>
  );
};

export default ParticularCallHistory;
