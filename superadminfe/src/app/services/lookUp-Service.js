import { apiConfig } from "./config";
import axios from "./config";

const lookUpService = {};

lookUpService.getUserLogin = (formData) => {
  return axios.post(apiConfig.URL + "auth_token", formData);
};
lookUpService.getUserLookUpList = () => {
  return axios.get(apiConfig.URL + "crmfarmsa/useradmin/Userlookuplist/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Db: localStorage.getItem("DBName"),
    },
  });
};
lookUpService.DeleteUserLookUp = (id) => {
  return axios.delete(
    apiConfig.URL + "crmfarmsa/useradmin/Userlookup/?id=" + id,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Db: localStorage.getItem("DBName"),
      },
    },
  );
};

lookUpService.getAddLicenceList = () => {
  return axios.get(
    apiConfig.URL +
      "useradmin/Taskuserlist/?db=" +
      localStorage.getItem("DBName"),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Db: localStorage.getItem("DBName"),
      },
    },
  );
};
lookUpService.getStorageList = () => {
  return axios.get(
    apiConfig.URL +
      "useradmin/UserAddStoragelist/?db=" +
      localStorage.getItem("DBName"),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Db: localStorage.getItem("DBName"),
      },
    },
  );
};
lookUpService.getTicketList = () => {
  return axios.get(apiConfig.URL + "useradmin/Ticketlist/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      Db: localStorage.getItem("DBName"),
    },
  });
};

lookUpService.getAllAdditionalList = () => {
  return axios.get(
    apiConfig.URL +
      "useradmin/UserAddorcancellicenselist/?db=" +
      localStorage.getItem("DBName"),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Db: localStorage.getItem("DBName"),
      },
    },
  );
};

lookUpService.getMyadditionalList = () => {
  return axios.get(
    apiConfig.URL +
      "useradmin/MyuserAddorcancellicenselist/?db=" +
      localStorage.getItem("DBName"),
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        Db: localStorage.getItem("DBName"),
      },
    },
  );
};

export default lookUpService;
