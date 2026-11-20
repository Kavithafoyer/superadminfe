import React from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Div from "@jumbo/shared/Div";

const Footer = ({ sidebarOptions }) => {
  // console.log("sidebarOptions", { sidebarOptions });
  return (
    <Div
      sx={{
        py: 2,
        mr: 0,
        px: { lg: 6, xs: 4 },
        borderTop: 2,
        // borderColor: 'divider',
        position: "fixed !important",
        width: "100% !important",
        bottom: "0px !important",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Div
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant={"body1"} color={"text.primary"}>
          Copyright <span style={{ color: "#00BFFF" }}>CRMFARM</span> © 2022
        </Typography>

        <Typography
          className={`transform ${
            sidebarOptions?.open ? "-translate-x-[240px]" : "translate-x-0"
          }`}
        >
          {" "}
          Developed by @{" "}
          <span style={{ color: "#00BFFF" }}>Foyer Technology</span>
        </Typography>
      </Div>
    </Div>
  );
};

export default Footer;
