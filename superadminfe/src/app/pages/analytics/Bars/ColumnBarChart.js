import React, { memo } from "react";
import {
  Chart,
  Series,
  CommonSeriesSettings,
  Legend,
  ValueAxis,
  Title,
  Export,
  Tooltip,
  Border,
  Label,
  Format,
  ArgumentAxis,
  Crosshair,
  HorizontalLine,
  SeriesTemplate,
  Grid,
} from "devextreme-react/chart";

// import { Typography, alpha } from "@mui/material";
// import Div from "@jumbo/shared/Div";
// import { DisplayFlex } from "app/pages/widgets/CRMStyles";

// function onPointClick(e) {
//   e.target.select();
// }

// function ColumnBarChart({
//   barData = [],
//   rotated = false,
//   barWidth = null,
//   xAxisTitle = "",
//   yAxisTitle = "",
//   xAxisPosition = "bottom",
//   yAxisPosition = "left",
//   legend = false,
//   legendhorizotal = "center",
//   legendVerticle = "Bottom",
//   labelShow = true,
//   barType = "bar",
//   barLength = ["value"],
//   color = ["#32cbff"],
//   endOnTick = true,
//   MultipleColumn = false,
//   label = "label",
//   labelColor = "#012a4a",
//   valueField = "value",
//   height = "auto",
//   customLegendName = [],
// }) {
//   const customizeTooltip = (pointInfo) =>
//     barType != "rangebar" && {
//       html: `<div><div class="tooltip-header text-center">${
//         pointInfo.argumentText == pointInfo.seriesName
//           ? ""
//           : pointInfo.argumentText
//       }</div><div class="tooltip-body"><div class="series-name"><span class='top-series-name'>${
//         pointInfo.seriesName
//       } : ${parseFloat(pointInfo.value)?.toLocaleString()}</span>`,
//     };

//   const crosshairFormat = {
//     type: "fixedPoint",
//     precision: 2,
//   };

//   console.log("dsfds23", MultipleColumn, barData);
//   return (
//     <>
//       {barData?.length > 0 ? (
//         <Chart height={height} title="" dataSource={barData} rotated={rotated}>
//           <ArgumentAxis position={xAxisPosition}>
//             <Label
//               font={{ size: "11px", color: "black" }}
//               backgroundColor="lightgreen"
//             />
//             <Title
//               font={{ size: "10px", color: "black", weight: 600 }}
//               text={xAxisTitle}
//             />
//           </ArgumentAxis>

//           {!Boolean(MultipleColumn) && (
//             <CommonSeriesSettings endOnTick={endOnTick} barWidth={barWidth} />
//           )}
//           {!Boolean(MultipleColumn) &&
//             barLength?.map((chart, idx) => {
//               let findIdx =
//                 Array.isArray(barType) &&
//                 barType?.find((itm) => itm?.label == chart);
//               return (
//                 <Series
//                   key={idx}
//                   argumentField={label}
//                   valueField={barType != "rangebar" && `${chart}`}
//                   type={
//                     barType == "bar"
//                       ? barType
//                       : Array.isArray(barType)
//                       ? Boolean(findIdx)
//                         ? findIdx?.style
//                         : "bar"
//                       : barType
//                   }
//                   name={
//                     Boolean(customLegendName[idx])
//                       ? customLegendName[idx]
//                       : `${chart}`
//                   }
//                   color={color[idx]}
//                   // rangeValue1Field={barType == "rangebar" && "rangeStart"}
//                   // rangeValue2Field={barType == "rangebar" && "rangeEnd"}
//                 >
//                   <Label
//                     font={{ size: "11px", color: labelColor, weight: 600 }}
//                     backgroundColor={alpha("#ffff", 0)}
//                     visible={
//                       labelShow?.length > 0
//                         ? labelShow?.some((itm) => itm == chart)
//                         : labelShow
//                     }
//                   >
//                     <Format type="fixedPoint" precision={0} />
//                   </Label>
//                 </Series>
//               );
//             })}
//           {Boolean(MultipleColumn) && (
//             <CommonSeriesSettings
//               argumentField={label}
//               valueField={valueField}
//               type="bar"
//               barWidth={barWidth}
//               ignoreEmptyPoints={true}
//             >
//               <Label
//                 font={{ size: "11px", color: labelColor, weight: 600 }}
//                 backgroundColor={alpha("#ffff", 0)}
//                 visible={labelShow}
//               >
//                 <Format type="fixedPoint" precision={0} />
//               </Label>
//             </CommonSeriesSettings>
//           )}

//           {Boolean(MultipleColumn) && (
//             <SeriesTemplate nameField={label}/>
//           )}
//           <ValueAxis position={yAxisPosition}>
//             <Label font={{ size: "11px", color: "black" }} />
//             <Title
//               font={{ size: "10px", color: "black", weight: 600 }}
//               text={yAxisTitle}
//             />
//           </ValueAxis>

//           <Legend
//             margin={5}
//             visible={legend}
//             horizontalAlignment={legendhorizotal}
//             verticalAlignment={legendVerticle}
//           />
//           <Export enabled={false} />
//           <Tooltip
//             customizeTooltip={customizeTooltip}
//             enabled={true}
//             shared={true}
//           />
//           <Crosshair enabled={true}>
//             <HorizontalLine visible={false} />
//             <Label visible={true} format={crosshairFormat} />
//           </Crosshair>
//           <Grid visible={false} />
//         </Chart>
//       ) : (
//         <Div sx={[DisplayFlex, { justifyContent: "center", height }]}>
//           <Typography sx={{ fontSize: "14px" }}>No record </Typography>
//         </Div>
//       )}
//     </>
//   );
// }

// export default ColumnBarChart;

import { Typography, alpha } from "@mui/material";
import Div from "@jumbo/shared/Div";
import { DisplayFlex } from "app/pages/widgets/CRMStyles";
import "../Analysis.css"

function onPointClick(e) {
  e.target.select();
}

function ColumnBarChart({
  barData = [],
  rotated = false,
  barWidth = null,
  xAxisTitle = "",
  yAxisTitle = "",
  xAxisPosition = "bottom",
  yAxisPosition = "left",
  legend = false,
  legendhorizotal = "center",
  legendVerticle = "bottom",
  labelShow = true,
  barType = "bar",
  barLength = ["value"],
  color = ["#32cbff"],
  endOnTick = true,
  MultipleColumn = false,
  label = "label",
  labelColor = "#012a4a",
  valueField = "value",
  height = "100%",
  customLegendName = [],
}) {
  const customizeTooltip = (pointInfo) =>
    barType !== "rangebar" && {
      html: `<div><div class="tooltip-header text-center">${
        pointInfo.argumentText === pointInfo.seriesName
          ? ""
          : pointInfo.argumentText
      }</div><div class="tooltip-body"><div class="series-name"><span class='top-series-name'>${
        pointInfo.seriesName
      } : ${parseFloat(pointInfo.value)?.toLocaleString()}</span>`,
    };

  const crosshairFormat = {
    type: "fixedPoint",
    precision: 2,
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        {barData?.length > 0 ? (
          <Chart
            height={height}
            dataSource={barData}
            rotated={rotated}
            style={{ overflow: "hidden" }} // Ensures the chart doesn't overflow
          >
            <ArgumentAxis position={xAxisPosition}>
              <Label font={{ size: "11px", color: "black" }} backgroundColor="lightgreen" />
              <Title font={{ size: "10px", color: "black", weight: 600 }} text={xAxisTitle} />
            </ArgumentAxis>

            {!Boolean(MultipleColumn) && (
              <CommonSeriesSettings endOnTick={endOnTick} barWidth={barWidth} />
            )}
            {!Boolean(MultipleColumn) &&
              barLength?.map((chart, idx) => {
                let findIdx =
                  Array.isArray(barType) &&
                  barType?.find((itm) => itm?.label === chart);
                return (
                  <Series
                    key={idx}
                    argumentField={label}
                    valueField={barType !== "rangebar" && `${chart}`}
                    type={
                      barType === "bar"
                        ? barType
                        : Array.isArray(barType)
                        ? Boolean(findIdx)
                          ? findIdx?.style
                          : "bar"
                        : barType
                    }
                    name={
                      Boolean(customLegendName[idx])
                        ? customLegendName[idx]
                        : `${chart}`
                    }
                    color={color[idx]}
                  >
                    <Label
                      font={{ size: "11px", color: labelColor, weight: 600 }}
                      backgroundColor={alpha("#ffff", 0)}
                      visible={
                        labelShow?.length > 0
                          ? labelShow?.some((itm) => itm === chart)
                          : labelShow
                      }
                    >
                      <Format type="fixedPoint" precision={0} />
                    </Label>
                  </Series>
                );
              })}
            {Boolean(MultipleColumn) && (
              <CommonSeriesSettings
                argumentField={label}
                valueField={valueField}
                type="bar"
                barWidth={barWidth}
                ignoreEmptyPoints={true}
              >
                <Label
                  font={{ size: "11px", color: labelColor, weight: 600 }}
                  backgroundColor={alpha("#ffff", 0)}
                  visible={labelShow}
                >
                  <Format type="fixedPoint" precision={0} />
                </Label>
              </CommonSeriesSettings>
            )}

            {Boolean(MultipleColumn) && (
              <SeriesTemplate nameField={label} />
            )}
            <ValueAxis position={yAxisPosition}>
              <Label font={{ size: "11px", color: "black" }} />
              <Title
                font={{ size: "10px", color: "black", weight: 600 }}
                text={yAxisTitle}
              />
            </ValueAxis>

            <Legend
              margin={5}
              visible={legend}
              horizontalAlignment={legendhorizotal}
              verticalAlignment={legendVerticle}
            />
            <Export enabled={false} />
            <Tooltip
              customizeTooltip={customizeTooltip}
              enabled={true}
              shared={true}
            />
            <Crosshair enabled={true}>
              <HorizontalLine visible={false} />
              <Label visible={true} format={crosshairFormat} />
            </Crosshair>
            <Grid visible={false} />
          </Chart>
        ) : (
          <Div sx={[DisplayFlex, { justifyContent: "center", height }]}>
            <Typography sx={{ fontSize: "14px" }}>No record</Typography>
          </Div>
        )}
      </div>
    </div>
  );
}

export default memo(ColumnBarChart);
