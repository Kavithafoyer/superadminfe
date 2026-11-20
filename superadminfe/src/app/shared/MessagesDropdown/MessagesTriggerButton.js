import React, { useEffect } from "react";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import JumboIconButton from "@jumbo/components/JumboIconButton";
import useJumboHeaderTheme from "@jumbo/hooks/useJumboHeaderTheme";
import { Badge, ThemeProvider } from "@mui/material";
import { useStateContext } from "app/contexts/ContextProvider";
import NotificationImportantOutlinedIcon from "@mui/icons-material/NotificationImportantOutlined";

const MessagesTriggerButton = ({ notifications }) => {
  const { headerTheme } = useJumboHeaderTheme();

  const filterItems =
    notifications?.filter((opt) => opt.Open_flg === false).length > 0
      ? notifications?.filter((opt) => opt.Open_flg === false).length
      : 1;

  const { count, setCount } = useStateContext();

  console.log("filterItems", filterItems);
  return (
    <ThemeProvider theme={headerTheme}>
      <Badge badgeContent={count} color="black">
        <JumboIconButton
          badge={{ variant: "red" }}
          elevation={25}
          filterItems={4}
        >
          <NotificationImportantOutlinedIcon sx={{ fontSize: 23 }} />
        </JumboIconButton>
      </Badge>
    </ThemeProvider>
  );
};

export default MessagesTriggerButton;
