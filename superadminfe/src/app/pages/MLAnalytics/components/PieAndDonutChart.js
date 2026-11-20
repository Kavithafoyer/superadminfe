import React from "react";
import PieChart, {
  Legend,
  Series,
  Tooltip,
  Format,
  Label,
  Connector,
  Export,
} from "devextreme-react/pie-chart";
import { Div, NoRecordsPage } from "app/pages/widgets/StylesComponents";
import { DisplayFlex, avatarColors } from "app/pages/widgets/CRMStyles";

function customizeTooltip(arg) {
  console.log("customizeTooltip", arg);
  return {
    text: Boolean(!isNaN(arg?.argumentText)) ? `${arg.valueText} - ${(arg.percent * 100).toFixed(2)}%` : `${arg.argumentText} - ${arg.valueText}`,
  };
}

const populationByRegions = [
  {
    region: "Cash Flow",
    val: 41196,
  },
  {
    region: "Africa",
    val: 1012,
  },
  {
    region: "Northern America",
    val: 3441,
  },
  {
    region: "Latin America and the Caribbean",
    val: 59040,
  },
  {
    region: "Europe",
    val: 72222,
  },
  {
    region: "Oceania",
    val: 3516,
  },
];

const PieAndDonutChart = ({
  chartData = [],
  type = "pie",
  label = "label",
  valueField = "value",
}) => {
  // console.log("chartData",chartData,type,label,valueField);
  return (
    <>
      {chartData?.length > 0 ? (
        <PieChart
          width={"100%"}
          id="pie"
          type={type}
          title=""
          palette={avatarColors}
          dataSource={chartData}
        >
          {valueField?.length > 1 ? (
            valueField?.map((chart, idx) => {
              <Series key={idx} argumentField={label} valueField={chart}>
                <Label
                  visible={true}
                // format="millions"
                >
                  <Connector visible={true} />
                </Label>
              </Series>;
            })
          ) : (
            <Series argumentField={label} valueField={valueField[0]}>
              <Label
                visible={true}
              // format="millions"
              >
                <Connector visible={true} />
              </Label>
            </Series>
          )}
          <Export enabled={false} />

          <Legend
            visible={true}
            margin={0}
            horizontalAlignment="center"
            verticalAlignment="bottom"
          />
          <Tooltip enabled={true} customizeTooltip={customizeTooltip}>
            {/* <Format type="millions" /> */}
          </Tooltip>
        </PieChart>
      ) : (
        <Div
          sx={[DisplayFlex, { justifyContent: "center", position: "relative" }]}
        >
          <NoRecordsPage />
        </Div>
      )}
    </>
  );
};

export default PieAndDonutChart;
