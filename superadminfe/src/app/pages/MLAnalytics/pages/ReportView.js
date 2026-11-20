/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Charts } from "../components/Charts";
import ResizableDraggableComponent from "../components/ResizableDraggableComponent";

const AutoHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return height;
};

function ReportView() {
  const getChart = useSelector(
    (state) => state?.selfServiceViewOptions?.charts
  );
  const dispatch = useDispatch();


  console.log("getChart",getChart);
  return (
    <div>
      <Box
        className="px-6 py-4"
        sx={{
          height: `${AutoHeight() - 190}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {/* <ResizableDraggableComponent /> */}
        {getChart?.length > 0 ? (
          getChart?.map((_chart, _idx) => (
            // console.log("_chart", _chart?.type);
            <React.Fragment key={_idx}>
              <ResizableDraggableComponent chart={_chart} index={_idx}>
                <div>
                  <Charts chartType={_chart} />
                </div>
              </ResizableDraggableComponent>
            </React.Fragment>
          ))
        ) : (
          <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            No Charts
          </div>
        )}
      </Box>
    </div>
  );
}

export default memo(ReportView);
