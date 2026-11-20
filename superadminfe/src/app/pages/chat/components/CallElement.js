import React from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import { MdLocalPhone } from "react-icons/md";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { PiArrowUpRightThin } from "react-icons/pi";
import { PiArrowDownRightThin } from "react-icons/pi";

import { useDispatch } from "react-redux";
// import { StartAudioCall } from "../redux/slices/audioCall";
// import { StartVideoCall } from "../redux/slices/videoCall";
// import { AWS_S3_REGION, S3_BUCKET_NAME } from "../config";

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const CallLogElement = ({ img, name, incoming, missed, online, id }) => {
  const theme = useTheme();

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {" "}
          {true ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar   />
            </StyledBadge>
          ) : (
            <Avatar/>
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{}</Typography>
            <Stack spacing={1} alignItems="center" direction={"row"}>
              {true ? (
                <PiArrowDownRightThin color={true ? "red" : "green"} />
              ) : (
                <PiArrowUpRightThin color={true ? "red" : "green"} />
              )}
              <Typography variant="caption">Yesterday 21:24</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <MdLocalPhone />

          <HiMiniVideoCamera />
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const CallElement = ({ img, name, id, handleClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {" "}
          <Avatar alt={name} src={img} />
          <Stack spacing={0.3} alignItems="center" direction={"row"}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            // onClick={() => {
            //   dispatch(StartAudioCall(id));
            //   handleClose();
            // }}
          >
            <MdLocalPhone style={{ color: theme.palette.primary.main }} />
          </IconButton>

          <IconButton
            onClick={() => {
              // dispatch(StartVideoCall(id));
              // handleClose();
            }}
          >
            <HiMiniVideoCamera style={{ color: theme.palette.primary.main }} />
          </IconButton>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { CallLogElement, CallElement };
