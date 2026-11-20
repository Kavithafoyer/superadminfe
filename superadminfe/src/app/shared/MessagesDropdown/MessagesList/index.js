import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import MessageItem from "./MessageItem";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";

const MessagesList = ({notifications}) => {
  
  console.log("gh",notifications)
  return (
    <List disablePadding>
      {notifications.slice(0,10).map((item, index) => {
        return <MessageItem key={index} item={item}/>;
      })}
    </List>
  );
};

export default MessagesList;
