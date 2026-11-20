import React, { useState } from "react";
import {
  TableHead,
  IconButton,
  Menu,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  useMediaQuery,
  TableCell,
  TableRow,
} from "@mui/material";
import { SettingsIcon } from "app/icons/PngIcons";
import { Colors, FontStyle } from "./CRMStyles";
import { capitalizeWords } from "./StylesComponents";
import "./Tab.css";
import Div from "@jumbo/shared/Div";

function CustomTableHeader({
  headerMenuItems,
  setHeadermenuItems,
  setDatas,
  sortDatas,
  showGear = true,
  transformText = "Capitalize",
  width = "auto",
  bgColor = "#e2f1ff",
  color = "#010f1c",
}) {
  const matches = useMediaQuery("(max-width:600px)", { noSsr: true });

  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortData = (key, direction) => {
    const sortedData = [...sortDatas];
    const sortedArray = sortedData.sort((a, b) => {
      // console.log("sortKeysssss", key);
      let valueA, valueB;

      if (Array.isArray(key)) {
        // console.log("sortKeysssss", {key,direction});
        valueA =
          typeof a[key[0]][key[1]] === "string"
            ? a[key[0]][key[1]].toLowerCase()
            : a[key[0]][key[1]];
        valueB =
          typeof b[key[0]][key[1]] === "string"
            ? b[key[0]][key[1]].toLowerCase()
            : b[key[0]][key[1]];
      } else {
        valueA = a[key];
        valueB = b[key];
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "ascending"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "ascending" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

    setDatas(sortedArray);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    sortData(key, direction);
  };

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TableHead>
        <TableRow
          sx={{
            "&:nth-of-type(even)": {
              backgroundColor: "red",
            },
            // hide last border
            "td, th": {
              border: "0px solid !important",
              height: "35px !important",
              padding: "0px !important",
              paddingX: "10px !important",
              fontWeight: "600",
            },
          }}
        >
          {headerMenuItems?.length > 0 &&
            headerMenuItems?.map((item, index) => {
              if (item?.bool) {
                let value = item?.label?.length;
                let label = Boolean(item?.label)
                  ? transformText === "Capitalize"
                    ? capitalizeWords(item?.label)
                    : transformText === "Lowercase"
                      ? item?.label?.toLowerCase()
                      : transformText === "Uppercase"
                        ? item?.label?.toUpperCase()
                        : item?.label
                  : "";
                return (
                  <TableCell
                    sx={{
                      minWidth: item?.width
                        ? item?.width
                        : matches
                          ? "100%"
                          : value > 11
                            ? `${value * 10}px !important`
                            : "90px !important",
                      width: `${item?.width ? item?.width : width} !important`,
                      cursor: "pointer",
                      flexWrap: "nowrap",
                      padding: "0px 10px  !important",
                      fontSize: "14px !important",
                      backgroundColor: `${bgColor} !important`,
                      color: `${color} !important`,
                      fontWeight: "500",
                      // minWidth:"120px",
                      boxShadow: "none",
                      textAlign: `${item?.align ? item?.align : "left"
                        } !important`,
                    }}
                    key={index}
                    onClick={() => item?.sort && handleSort(item?.sort)}
                  >
                    {label}{" "}
                    {sortConfig.key === item?.sort &&
                      (sortConfig.direction === "ascending" ? "▲" : "▼")}
                  </TableCell>
                );
              }
            })}

          {Boolean(showGear) &&
            <TableCell
              align="center"
              width={"100px"}
              sx={{
                width: "50px !important",
                cursor: "pointer",
                flexWrap: "nowrap",
                backgroundColor: "#e2f1ff  !important",
                color: "#104911 !important",
                fontWeight: "400 ",
                // minWidth:"120px",
              }}
            >
              <Div
                sx={{
                  display: "flex",
                  justifyContent: showGear ? "flex-end" : "center",
                  lineHeight: 2.5,
                }}
              >
                Action
                {Boolean(showGear) &&
                  <span style={{ cursor: "pointer" }}>
                    <IconButton onClick={handleClickOpen}>
                      <SettingsIcon size={18} color="navy" />
                    </IconButton>
                  </span>
                }
              </Div>
            </TableCell>
          }

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              mt: 7,
              maxHeight: "300px",
              scrollBehavior: "smooth",
            }}
          >
            <Typography id="Typography-root" sx={{ p: 2, mb: -2 }}>
              Choose Columns
            </Typography>
            <FormGroup sx={{ p: 2 }}>
              {headerMenuItems?.length > 0 &&
                headerMenuItems?.map((column, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          color="info"
                          checked={column?.bool}
                          onChange={(e) => {
                            let value = [...headerMenuItems];
                            value[index].bool = !column?.bool;
                            setHeadermenuItems(value);
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
        </TableRow>
      </TableHead>
    </>
  );
}

export default CustomTableHeader;
