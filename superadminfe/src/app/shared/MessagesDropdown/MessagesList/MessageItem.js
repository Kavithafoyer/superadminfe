import React, { useEffect, useState } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import { ListItemButton, Typography } from "@mui/material";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useStateContext } from "app/contexts/ContextProvider";

const MessageItem = ({ item }) => {
  const token = localStorage.getItem("accesstoken");
  // update the seen the notifications
  // useEffect(() => {
  //   var payload = {
  //     id: item.id,
  //     Notification_Id: item.Notification_Id,
  //     Notificationname: item.Notificationname,
  //     Open_flg: true,
  //     Notification_Time: item.Notification_Time,
  //     NotificationMsg: item.NotificationMsg,
  //     Created_By: item.Created_By,
  //     Updated_By: item.Updated_By,
  //     Organization_Id: item.Organization_Id,
  //   };
  //   console.log("payload", payload);
  //   axios
  //     .put(`${BASE_URL}/user/UserNotificationCRUD/`, payload, {
  //       headers: {
  //         db: "crmuseradmin1",
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       console.log("Put", res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [item]);
  const { count, setCount, setCountnumber, countnumber } = useStateContext();

  useEffect(() => {
    setCount(0);
    setCountnumber([0]);
  }, []);

  // Contact Notes

  const calculateTimeDifference = (startDate) => {
    const currentDate = new Date();
    const startDateObject = new Date(startDate);
    const timeDifference = currentDate - startDateObject;

    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (secondsDifference < 60) {
      return `${secondsDifference} ${
        secondsDifference === 1 ? "second" : "seconds"
      } ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} ${
        minutesDifference === 1 ? "minute" : "minutes"
      } ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} ${
        hoursDifference === 1 ? "hour" : "hours"
      } ago`;
    } else if (daysDifference < 1) {
      return "Today";
    } else if (daysDifference < 2) {
      return "Yesterday";
    } else if (daysDifference < 7) {
      return `${daysDifference} days ago`;
    } else if (weeksDifference < 4) {
      return `${weeksDifference} ${
        weeksDifference === 1 ? "week" : "weeks"
      } ago`;
    } else if (monthsDifference < 12) {
      return `${monthsDifference} ${
        monthsDifference === 1 ? "month" : "months"
      } ago`;
    } else {
      return `${yearsDifference} ${
        yearsDifference === 1 ? "year" : "years"
      } ago`;
    }
  };

  return (
    <ListItemButton component={"li"} disableRipple sx={{ pt: 0.5, pb: 0.5 }}>
      <ListItemAvatar>
        <IoIosNotificationsOutline style={{ width: "36px", height: "36px" }} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <>
            <Typography variant={"h6"} mb={0.25} fontWeight={500}>
              {item?.RemainderFor}
            </Typography>
          </>
        }
        secondary={
          <>
            <Typography color={"text.secondary"}>
              Reminder Date :{item?.Updated_Date?.split(".")[0]}
            </Typography>
            <Typography color={"text.secondary"}>
              Reminder Message : {item?.RemainderMessage}
            </Typography>

            <Typography
              sx={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "8px",
                color: "#10BBE5",
                minWidth: "300px",
              }}
            >
              {calculateTimeDifference(item?.Updated_Date)}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
};

export default MessageItem;
