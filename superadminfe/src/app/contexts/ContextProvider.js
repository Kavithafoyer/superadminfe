import { BASE_URL } from "app/services/config";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [landingpath, setLandingpath] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [sideMenu, setSideMenu] = useState("chart");
  const [reminder, setReminder] = useState([]);
  const [countnumber, setCountnumber] = useState([]);
  const [count, setCount] = useState(0);
  const [defaultDate, setDefaultDate] = useState("YYYY-MM-DD");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [userMessages, setUserMessages] = useState([]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  // < --------------------------------------------------  get financialYear  --------------------------------------------------
  const financialYear = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}useradmin/CRMorganizationCRUD/?id=1`,
      );
      // console.log("getOrganisation", response.data);

      return response.data?.DateFormat;
    } catch (error) {
      console.error("Error fetching  CRUD :", error);

      return { error: error };

      throw new Error(error.response?.data?.message || "Error fetching data");
    }
  };

  const {
    data: financialYearData,
    isLoading: isLoadingfinancialYear,
    isError: isErrorfinancialYear,
    refetch: refetchfinancialYear,
  } = useQuery("refetchCRMorganizationCRUD", financialYear, {
    staleTime: Infinity,
  });

  useEffect(() => {
    if (financialYearData) {
      setDefaultDate(financialYearData);
    }
  }, [financialYearData]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        sideMenu,
        setSideMenu,
        reminder,
        setReminder,
        count,
        setCount,
        countnumber,
        setCountnumber,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        userMessages,
        setUserMessages,
        defaultDate,
        landingpath,
        setLandingpath,
        openMenu,
        setOpenMenu,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
