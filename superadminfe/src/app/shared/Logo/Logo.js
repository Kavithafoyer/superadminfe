import React from "react";
import "./Logo.css";
import Div from "@jumbo/shared/Div";
import Link from "@mui/material/Link";
import { ASSET_IMAGES } from "../../utils/constants/paths";
import { Typography } from "@mui/material";
import pegattoLogo from "../../assets/images/pegatto_logo.png";

import { base64UrlDecode } from "app/pages/home/IntroPage";
import { FirstLetterCaps } from "app/pages/widgets/StylesComponents";

const Logo = ({ mini, mode, sx }) => {
  // const params = new URLSearchParams(window.location.search);
  // const Tenantname = params.get('Tenentname');
  const hostname = window.location.href.split(".")[0].split("//")[1];
  const Tenantname =
    hostname === "localhost:3000/" ? "" : hostname.split(".")[0];

  console.log("Tenantname", hostname, Tenantname);

  return (
    <Div
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Link
        href={"/home"}
        sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}
      >
        <img
          src={pegattoLogo}
          alt="PEGATTO SuperAdmin Logo"
          style={{
            height: "28px",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Link>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#0565FD",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        PEGATTO SuperAdmin
      </Typography>
    </Div>
  );
};
Logo.defaultProps = {
  mode: "light",
};
export default Logo;
