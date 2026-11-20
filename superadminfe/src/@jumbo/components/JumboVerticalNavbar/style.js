import { ListItemButton, ListItemIcon } from "@mui/material";
import styled from "@mui/material/styles/styled";

export const ArrowWrapper = styled("span")({
  position: "absolute",
  right: 5,
  display: "inline-flex",
  top: "50%",
  transform: "translateY(-50%)",
  // fontSize:"8px !important",
});

export const StyledNavItem = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,

  position: "relative",
  textTransform: "capitalize",
  // color: "#4B4B4B",
  // fontWeight: 400, // Make the text bold on hover
  padding: "5px !important",
  // // borderRadius: theme.shape.borderRadius,
  // "&:hover": {
  //   backgroundColor: "#f5f5f5", // Change the background color on hover
  //   color: "#4B4B4B",

  // },
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  // width: "10px !important",
  // height: "10px !important",
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const StyledNavInnerItem = styled((props) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  position: "relative",
  textTransform: "capitalize",
  // fontWeight: 400, // Make the text bold on hover
  // color: "#4B4B4B",
  padding: "5px !important",
  // // borderRadius: theme.shape.borderRadius,
  // "&:hover": {
  //   backgroundColor: "#f5f5f5", // Change the background color on hover
  //   color: "#4B4B4B",
  // },
}));
