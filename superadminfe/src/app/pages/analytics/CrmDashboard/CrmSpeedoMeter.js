import React from 'react';
import {
  CircularGauge,
  ValueIndicator,
  Scale,
  Label,
  Geometry,
} from 'devextreme-react/circular-gauge';

// import '../Analysis.css'

function customizeText({ valueText }) {
  return `${valueText} %`;
}
function CrmSpeedoMeter() {
  return (

    <CircularGauge
      value={80}
      height={100}
    >
      <ValueIndicator
        color="#8FBC8F"
      ></ValueIndicator>
      <Scale
        startValue={0}
        endValue={100}
        tickInterval={50}
      >
        <Label customizeText={customizeText}></Label>
      </Scale>
      <Geometry
        startAngle={180}
        endAngle={0}
      ></Geometry>
    </CircularGauge>

  );
}
export default CrmSpeedoMeter;
