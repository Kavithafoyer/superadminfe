import React, { useEffect, useState } from "react";
import { FunnelChart } from 'react-funnel-pipeline';
import 'react-funnel-pipeline/dist/index.css';
import Div from "@jumbo/shared/Div";
import { BASE_URL } from "app/services/auth-services";
import axios from "axios";
import { DisplayFlex, PrymidColor } from "app/pages/widgets/CRMStyles";
import { NoRecordsPage } from "app/pages/widgets/StylesComponents";

function PyramidHomeChart() {
  const [datas, setDatas] = useState([]);

  // token and db name
  const token = localStorage.getItem("accesstoken");
  const item = "crmuseradmin1";

  const getDatas = async () => {
    try {
      // get shipment data
      const response = await axios.get(`${BASE_URL}/user/Dealdashboard/`, {
        headers: {
          db: item,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response?.data) {
        let data = [];
        Object.keys(response.data).forEach((key) => {
          let value = key?.split("_");
          data.push({
            name: `${value[0]} ${value[1]}`,
            value: response.data[key],
          });
        });
        console.log("cfgd", response, data);
        // Sort the array by the count property in descending order
        data.sort((a, b) => b.value - a.value);

        setDatas(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <>
      {datas?.length > 0 ? (
        <Div
          sx={{
            borderRadius: "3px",
          }}
        >
          <FunnelChart 
            data={datas}
            colors={PrymidColor} // Custom colors
          />
        </Div>
      ) : (
        <Div
          sx={[DisplayFlex, { justifyContent: "center", position: "relative" }]}
        >
          <NoRecordsPage title={"deal pipeline"} />
        </Div>
      )}
    </>
  );
}

export default PyramidHomeChart;
