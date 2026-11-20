import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { DisplayFlex, FontStyle } from "./CRMStyles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: -2,
  minWidth: "200px",
  width: "100%",
  height: "33px",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    height: "33px",
    minWidth: "200px",
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(3)}) !important`,
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "25px !important",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

export default function SearchBar({
  bgcolor,
  value,
  color,
  border = "1px solid lightgray",
  SearchData,
  width = "300px",
  className,
}) {
  const matches = useMediaQuery("(min-width:759px)");

  return (
    <Search
      className="search-bar"
      sx={[
        FontStyle,
        DisplayFlex,
        {
          width: width,
          backgroundColor: `${bgcolor || ""} !important`,
          border: border || "none",
        },
      ]}
    >
      <SearchIconWrapper>
        <SearchIcon sx={{ color: color || "", fontSize: "18px" }} />
      </SearchIconWrapper>
      <StyledInputBase
        value={value}
        onChange={(e) => SearchData && SearchData(e)}
        sx={[FontStyle, { color: `${color || ""} !important` }]}
        placeholder="Search…"
        className={className}
        inputProps={{ "aria-label": "search" }}
      />
    </Search>
  );
}
