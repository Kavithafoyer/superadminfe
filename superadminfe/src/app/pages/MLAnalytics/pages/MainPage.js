import React, { useCallback, useEffect, useState } from "react";
// import { Grid } from '@mui/material';
import { useSelector } from "react-redux";
import ReportView from "./ReportView";
import ExcelReader from "./ExcelReader";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DataSets from "../components/DataSets";
import Analytics from "./Analytics";

function MainPage() {
  const [isShowdata, setIsShowData] = useState(false);
  const isShowData = useSelector(
    (state) => state.selfServiceViewOptions.showData
  );
  const isSideMenuOptions = useSelector(
    (state) => state.selfServiceViewOptions.sideMenuOptions
  );

  const isshodataFunc = useCallback(
    (show) => {
      setIsShowData(show);
    },
    [isShowdata]
  );

  useEffect(() => {
    isshodataFunc(isShowData);
  }, [isShowData]);

  console.log("isSideMenuOptions", isSideMenuOptions, isShowdata);

  return (
    <div>
      {/* <!-- Navigation --> */}
      {/* <!-- Nave Bar --> */}
      <div className="grid w-screen grid-cols-12  h-screen bg-gray-100">
        <header
          className={`row-auto col-span-12 z-50 fixed top-0 shadow-md dark:bg-secondary-dark-bg bg-gray-100 w-full ${
            isSideMenuOptions === "analytics" ? "h-20  z-50" : "h-40"
          } `}
        >
          <Navbar />
        </header>
        <nav
          className={`sidebar fixed  dark:bg-secondary-dark-bg bg-gray-200 z-40 ${
            isSideMenuOptions === "analytics"
              ? "w-56 pt-20 ml-1 mt-1"
              : "w-14 m-0 pt-40"
          }`}
        >
          <Sidebar />
        </nav>
        {/* <!-- Main content --> */}
        <main
          className={`h-full overflow-x-auto ${
            isSideMenuOptions === "analytics"
              ? "col-span-12 pl-56 pt-20"
              : isShowdata
              ? "col-span-10 pt-40 pl-14"
              : "col-span-12 pt-40 pl-14"
          } `}
          style={{ boxShadow: "9px 0px 12px -1px rgba(0,0,0,0.75)" }}
        >
          <div
            className={`bg-gray-50 h-full ${
              isSideMenuOptions === "table" && "overflow-x-auto"
            } `}
          >
            {isSideMenuOptions === "table" ? (
              <ExcelReader />
            ) : (
              isSideMenuOptions === "report" && <ReportView />
            )}

            {isSideMenuOptions === "analytics" && <Analytics />}
          </div>
        </main>

        {/* <!-- Sidebar / Ads --> */}
        {Boolean(isShowdata) && isSideMenuOptions !== "analytics" && (
          <aside
            className={`pt-40 col-span-2 scroll-smooth overflow-y-scroll h-full bg-gray-100`}
          >
            <DataSets />
          </aside>
        )}
      </div>
    </div>
  );
}

export default MainPage;
