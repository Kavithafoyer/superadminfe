import Div from "@jumbo/shared/Div";
import React, { useState } from "react";
import { Typography, Avatar } from "@mui/material";
import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import SocialMedias from "../SocialMedias";
import { deepPurple } from "@mui/material/colors";
import AccountEmailContent from "./AccountEmailContent";

const DealEmailLists = () => {
  return (
    <>
      <JumboContentLayoutMain>
        <SocialMedias />

        <Div>
          {/* <MailApp /> */}
          <Div sx={{ display: "flex" }}>
            <Avatar
              sx={{
                bgcolor: deepPurple[500],
                width: "30px",
                height: "30px",
                fontSize: "14px",
              }}
            >
              ST
            </Avatar>
            <Typography sx={{ fontSize: "14px" }} paddingLeft="5px">
              Subramanian Thangappan <br />
              <span>Online</span>
            </Typography>
          </Div>

          <Div>
            <AccountEmailContent />
          </Div>
        </Div>
      </JumboContentLayoutMain>
    </>
  );
};

export default DealEmailLists;
