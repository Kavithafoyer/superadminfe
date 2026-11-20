import baseAxios from "axios";
import { toast } from "react-toastify";

const currentURL = window.location.href;
export const Tenantname = currentURL.split(".")[0].split("//")[1];
export const BASE_URL = `https://backend.crmfarm.in/`;
// export const BASE_URL = `https://127.0.0.1:8000/`;

// Define a unified helper to attach interceptors to any axios instance
export function setupInterceptors(instance) {
  // Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accesstoken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Dynamically add DBName header if stored in localStorage
      const dbName = localStorage.getItem("DBName");
      if (dbName) {
        if (!config.headers.db && !config.headers.Db) {
          config.headers.Db = dbName;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/token/refresh/")
      ) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshtoken");
        const tenant = window.location.href.split(".")[0].split("//")[1];

        if (refreshToken) {
          try {
            // Call post on baseAxios which is configured, but avoid interceptor loop because we check url.includes("/token/refresh/")
            const res = await baseAxios.post(
              `${BASE_URL}${tenant}/token/refresh/`,
              {
                refresh: refreshToken,
              },
            );

            if (res.status === 200) {
              const newAccessToken =
                res.data.access ||
                res.data.token ||
                res.data.accessToken ||
                res.data.access_token;
              localStorage.setItem("accesstoken", newAccessToken);
              localStorage.setItem("token", newAccessToken);

              // Update authorization header
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              // Retry the original request using the same instance that initiated it
              return instance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Refresh token expired or invalid", refreshError);
            localStorage.removeItem("accesstoken");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshtoken");
            localStorage.removeItem("session_id");
            window.location.href = "/";
            return Promise.reject(refreshError);
          }
        } else {
          localStorage.removeItem("accesstoken");
          localStorage.removeItem("token");
          localStorage.removeItem("session_id");
          window.location.href = "/";
        }
      }

      if (error.response && error.response.status === 400) {
        toast.error("Bad Request: Please check your inputs.", { position: "top-right" });
      } else if (
        error.response &&
        error.response.status !== 401 &&
        // Don't show generic alert on token refresh failure to avoid double alerts
        !originalRequest?.url?.includes("/token/refresh/")
      ) {
        toast.error("An unexpected error occurred.", { position: "top-right" });
      }
      return Promise.reject(error);
    },
  );
}

// 1. Setup interceptors on baseAxios (global instance)
setupInterceptors(baseAxios);

// 2. Override baseAxios.create to automatically apply setupInterceptors to all custom instances
const originalCreate = baseAxios.create;
baseAxios.create = function (config) {
  const instance = originalCreate.call(baseAxios, config);
  setupInterceptors(instance);
  return instance;
};

// 3. Create the default exported custom axios instance
const axios = baseAxios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Moved to top

//todo: define interceptors and other configuration like baseURL, headers etc. here
export default axios;

const apiConfig = {};
apiConfig.URL1 = "https://backend.crmfarm.in/";
apiConfig.URL = BASE_URL;

export { apiConfig };
