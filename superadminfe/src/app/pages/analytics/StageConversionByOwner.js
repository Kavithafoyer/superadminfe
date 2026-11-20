import JumboContentLayoutMain from "@jumbo/components/JumboContentLayout/JumboContentLayoutMain";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ColumnBarChart from "./Bars/ColumnBarChart";
import { useDrawingArea } from "@mui/x-charts";
import { ComponentHeading } from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import axios from "axios";
import { BASE_URL } from "app/services/auth-services";
import { AutoHeight } from "app/redux/auth/localStorage";

function StageConversionByOwner() {
  const { width, height } = useDrawingArea();
    const [datas, setDatas] = useState([])
  const dataSource = [
    {
      color: "#588157",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1300,
      label: "NEW INCOMING",
    },
    {
      color: "#fb5607",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1100,
      label: "OLD INCOMING",
    },
    {
      color: "#ffba08",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1020,
      label: "PITCH",
    },
    {
      color: "#0077b6",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1560,
      label: "NEW STAGE",
    },
    {
      color: "#ff758f",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1280,
      label: "CONTRACT",
    },
    {
      color: "#ffba08",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1020,
      label: "FINAL REVIEWS",
    },
    {
      color: "#0077b6",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1560,
      label: "SIGNED",
    },
    {
      color: "#ff758f",
      value2: 1200,
      value3: 1100,
      value4: 1000,
      value: 1280,
      label: "WON",
    },
  ].reverse();

  const token = localStorage.getItem("accesstoken");
  const DBName = "crmuseradmin1";

  const getMyData = async () => {
    try {
        await axios
      .get(
        `${BASE_URL}/user/DealMyAdditional/?Is_Deleted=False&Created_By=${localStorage.getItem(
          "UserId"
        )}`,
        {
          headers: {
            db: DBName,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
         console.log("dealstage",res.data?.results);
        setDatas(res?.data?.results || []);
      })
    } catch (error) {
        console.error("err", error);
    }
  };


  useEffect(()=>getMyData(),[])





  return (
    <JumboContentLayoutMain>
      <Div
        sx={[
          {
            p: { xs: 0, md: 2 },
            px: { xs: 0, md: 4 },
          },
        ]}
      >
        <Typography sx={[ComponentHeading, { mb: 3 }]}>
          Stage Conversion By Owner
        </Typography>
        <ColumnBarChart
          height={AutoHeight()}
          rotated={true}
          yAxisPosition="top"
          barType="scatter"
          labelShow={false}
          barData={dataSource}
          barLength={["value", "value2", "value3", "value4"]}
        />
      </Div>
    </JumboContentLayoutMain>
  );
}

export default StageConversionByOwner;
