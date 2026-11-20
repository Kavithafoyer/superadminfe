import React from "react";
import Div from "@jumbo/shared/Div";
import useJumboContentLayout from "@jumbo/hooks/useJumboContentLayout";
import { useLocation } from "react-router-dom";

const JumboContentLayoutMain = ({ children }) => {
  const contentLayout = useJumboContentLayout();
  const location = useLocation();
  return (
    <Div
      className="JumboCmtLayout-content"
      sx={{
        display: "flex",
        flex: 1,
        mt: 0,
        minWidth: 0,
        flexDirection: "column",
        overflowY: "hidden",
        minHeight: "100%",
        backgroundColor:
          location.pathname === "/app/contacts" ||
          location.pathname === "/leads/qualifiedLeads"
            ? "#F7F7F7"
            : "#FFFFFF",
        ...contentLayout?.main?.sx,
      }}
    >
      {children}
    </Div>
  );
};

export default JumboContentLayoutMain;
