// GeoLocation.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGoogleMapsApiKey } from "./actions";
import axios from "axios";

const GeoLocationNew = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accesstoken");

  useEffect(() => {
    const getMapData = () => {
      axios
        .get(
          `${BASE_URL}/superadmin/MapConfigurationCRUD/?User_Id=${localStorage.getItem(
            "UserId"
          )}`
        )
        .then((res) => {
          dispatch(setGoogleMapsApiKey(res?.data?.API_Key));
        })
        .catch((err) => {
          // console.log("err", err);
        });
    };

    getMapData();
  }, [token]);

  return null; // or your GeoLocation component UI
};

export default GeoLocationNew;
