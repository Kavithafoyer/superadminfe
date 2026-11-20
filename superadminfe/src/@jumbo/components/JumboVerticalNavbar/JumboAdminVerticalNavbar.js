import PropTypes from "prop-types";
import { useState } from "react";
import {
  NavLink as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
// @mui
import { alpha, Box, Collapse, List, ListItemText, Stack } from "@mui/material";
import { ArrowWrapper } from "@jumbo/components/JumboVerticalNavbar/style";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
//
import { StyledNavItem, StyledNavItemIcon } from "./style";
import Div from "@jumbo/shared/Div";
import { Colors } from "app/pages/widgets/CRMStyles";
import { useStateContext } from "app/contexts/ContextProvider";

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding>
        {data.map((item) => (
          <Stack sx={{ color: "#4B4B4B !important" }}>
            <NavItem className="Nav Admin" key={item.title} item={item} />
          </Stack>
        ))}
      </List>
    </Box>
  );
}

const NavItem = ({ item }) => {
  const { title, path, icon, children } = item;
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { setLandingpath } = useStateContext();

  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };
  const renderBase = (path, title, icon) => (
    <StyledNavItem
      onClick={children && handleClick}
      // style={{ backgroundColor: open ? alpha("#2a978f", 0.05) : "transparent" }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText
        sx={{
          fontSize: 12,
          pl: -1,
          color: "#4B4B4B !important",
        }}
        disableTypography
        primary={title?.charAt(0).toUpperCase() + title?.slice(1) || title}
      />
      {children && (
        <ArrowWrapper>
          {open ? (
            <ArrowDropDownIcon
              sx={{ mr: 1, fontSize: "20px", color: "#4B4B4B" }}
            />
          ) : (
            <ArrowRightIcon
              sx={{ mr: 1, fontSize: "20px", color: "#4B4B4B" }}
            />
          )}
        </ArrowWrapper>
      )}
    </StyledNavItem>
  );

  if (children) {
    return (
      <>
        {renderBase(null, title, icon)}
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          // style={{
          //   backgroundColor: open ? alpha("#2a978f", 0.05) : "transparent",
          // }}
        >
          <List disablePadding>
            {children.map((subNavItem) => (
              <SubNavItem
                sx={{ padding: 0, color: "#4B4B4B" }}
                key={subNavItem.title}
                item={subNavItem}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }
  return (
    <Div
    // sx={{ backgroundColor: open ? alpha("#2a978f", 0.05) : "transparent" }}
    >
      <StyledNavItem component={RouterLink} to={path}>
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText
          sx={{
            fontSize: 12,
            pl: -1,
            color:
              path === location.pathname?.substring(1)
                ? "#2a978f !important"
                : "#4B4B4B !important",
          }}
          disableTypography
          primary={title?.charAt(0)?.toUpperCase() + title?.slice(1) || title}
        />
      </StyledNavItem>
    </Div>
  );
};
const SubNavItem = ({ item }) => {
  const { title, path, icon, children } = item;
  // console.log("innerSubNav:", children);
  const location = useLocation();
  const navigate = useNavigate();
  const { setLandingpath } = useStateContext();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const InnerRenderBase = (path, title, icon) => (
    <StyledNavItem onClick={children && handleClick}>
      <StyledNavItemIcon sx={{ pl: 2 }}>{icon && icon}</StyledNavItemIcon>
      <ListItemText
        sx={{ fontSize: 12, pl: -1 }}
        disableTypography
        primary={title}
      />
      {children && (
        <ArrowWrapper>
          {open ? (
            <ArrowDropDownIcon
              sx={{ mr: 1, fontSize: "20px", color: "#4B4B4B" }}
            />
          ) : (
            <ArrowRightIcon
              sx={{ mr: 1, fontSize: "20px", color: "#4B4B4B" }}
            />
          )}
        </ArrowWrapper>
      )}
    </StyledNavItem>
  );

  if (children) {
    return (
      <>
        {InnerRenderBase(null, title, icon)}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            className="menuPadding"
            sx={{
              padding: "0px !important",
              color: "#4B4B4B !important",
              margin: "0px !important",
              marginLeft: "15px !important",
            }}
          >
            {children.map((innerSubNavItem) => (
              <SubNavItem key={innerSubNavItem.title} item={innerSubNavItem} />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <Div>
      <StyledNavItem component={RouterLink} to={path}>
        <StyledNavItemIcon sx={{ pl: 2 }}>{icon && icon}</StyledNavItemIcon>
        <ListItemText
          disableTypography
          sx={{
            fontSize: 12,
            pl: -1,
            color:
              path === location.pathname?.substring(1)
                ? "#2a978f !important"
                : "#4B4B4B !important",
          }}
          primary={title}
        />
      </StyledNavItem>
    </Div>
  );
};

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

SubNavItem.propTypes = {
  item: PropTypes.object,
};
