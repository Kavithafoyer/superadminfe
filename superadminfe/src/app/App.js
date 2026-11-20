import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import JumboApp from "@jumbo/components/JumboApp";
import AppLayout from "./AppLayout";
import JumboTheme from "@jumbo/components/JumboTheme";
import AppRoutes from "./AppRoutes";
import configureStore, { history } from "./redux/store";
import JumboDialog from "@jumbo/components/JumboDialog";
import JumboDialogProvider from "@jumbo/components/JumboDialog/JumboDialogProvider";
import { SnackbarProvider } from "notistack";
import AppProvider from "./AppProvider";
import { config } from "./config/main";
import JumboRTL from "@jumbo/JumboRTL/JumboRTL";
import Div from "@jumbo/shared/Div";
import { CircularProgress } from "@mui/material";
import JumboAuthProvider from "@jumbo/components/JumboAuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ContextProvider } from "./contexts/ContextProvider";
import { fetchUserRolePermissions } from "./redux/actions/fetchUserRolePermissions";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const store = configureStore();


function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    const designation = localStorage.getItem("Designation");
    if (token && designation) {
      store.dispatch(fetchUserRolePermissions({ token, designation }));
    }
  }, []);
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);
  useEffect(() => {
    const refreshTokenInterval = async () => {
      const refreshToken = localStorage.getItem("refreshtoken");
      if (!refreshToken) return;

      const currentURL = window.location.href;
      const tenant = currentURL.split(".")[0].split("//")[1];
      const BASE_URL = "https://backend.crmfarm.in/";

      try {
        const res = await axios.post(
          `${BASE_URL}${tenant}/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        if (res.status === 200) {
          const newAccessToken = res.data.access || res.data.token || res.data.accessToken || res.data.access_token;
          localStorage.setItem("accesstoken", newAccessToken);
          localStorage.setItem("token", newAccessToken);
          console.log("Proactive token refresh succeeded");
        }
      } catch (err) {
        console.error("Proactive token refresh failed", err);
      }
    };

    // Run once immediately on load if token exists, then repeat every 10 minutes (600,000 ms)
    refreshTokenInterval();
    const intervalId = setInterval(refreshTokenInterval, 10 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (!isOnline) {
      toast.error("please check your internet connection", { autoClose: 2000 });
    } else {
      toast.success("Internet connected", { autoClose: 2000 });
    }
  }, [isOnline]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ContextProvider>
          <BrowserRouter history={history}>
            <AppProvider>
              <JumboApp activeLayout={config.defaultLayout}>
                <JumboTheme init={config.theme}>
                  <JumboRTL>
                    <JumboDialogProvider>
                      {/* <JumboDialog />
                      <SnackbarProvider
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        maxSnack={3}
                      > */}
                      <AppLayout>
                        <Suspense
                          fallback={
                            <Div
                              sx={{
                                display: "flex",
                                minWidth: 0,
                                alignItems: "center",
                                alignContent: "center",
                                height: "100%",
                              }}
                            >
                              <CircularProgress sx={{ m: "-40px auto 0" }} />
                            </Div>
                          }
                        >
                          <AppRoutes isOnline={isOnline} />
                          {!isOnline && <ToastContainer />}
                          <ToastContainer />
                        </Suspense>
                      </AppLayout>
                      {/* </SnackbarProvider> */}
                    </JumboDialogProvider>
                  </JumboRTL>
                </JumboTheme>
              </JumboApp>
            </AppProvider>
          </BrowserRouter>
        </ContextProvider>
      </Provider>
    </QueryClientProvider>
  );
}
export default App;
