import { memo } from "react";
import { Box } from "@mui/material";

function NoChat({ ...other }) {
  return (
    <Box {...other}>
      <img
        src={require("../../../../assets/images/chat-and-chatting.jpg")}
        style={{ width: "200px", height: "200px" }}
      />
    </Box>
  );
}

export default memo(NoChat);
