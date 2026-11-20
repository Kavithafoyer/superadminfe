import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { memo } from "react";

function TableSkelton(count, height) {
  return (
    <Box className="w-full m-2 h-full ">
      {Array.from({ length: count })?.map((item) => (
        <Skeleton height={height} className="my-3" />
      ))}
    </Box>
  );
}

const VSkeleton = ({ type = "table", count = 10, height = 50 }) => {
  switch (type?.toLowerCase()) {
    case "table":
      return TableSkelton(count, height);
      break;
    default:
      break;
  }
};

export default memo(VSkeleton);
