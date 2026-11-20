// utils/handleError.js

import { ToastMsg } from "app/pages/widgets/StylesComponents";

export const handleError = async (promise) => {
  try {
    const response = await promise;
    return response?.data;
  } catch (error) {
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = getErrorMessage(error, statusCode);

      ToastMsg("error", errorMessage);
      console.error("Server responded with an error:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      ToastMsg(
        "error",
        "Network Error: No response from the server. Please check your network connection."
      );
      console.error("No response received:", error.request);
    } else {
      ToastMsg("error", `Error: ${error.message}`);
      console.error("Error in setting up request:", error.message);
    }
    return null;
  }
};

const getErrorMessage = (error, statusCode) => {
  switch (statusCode) {
    case 400:
      return "Bad Request: The server could not understand the request due to invalid syntax.";
    case 401:
      return "Unauthorized: You must be authenticated to access this resource.";
    case 403:
      return "Forbidden: You do not have permission to access this resource.";
    case 404:
      return "Not Found: The requested resource could not be found.";
    case 405:
      return "Method Not Allowed: The HTTP method used is not allowed for this resource.";
    case 417:
      return "Expectation Failed: The server cannot meet the requirements of the Expect request-header field.";
    case 500:
      return "Internal Server Error: The server has encountered a situation it doesn't know how to handle.";
    case 502:
      return "Bad Gateway: The server was acting as a gateway or proxy and received an invalid response from the upstream server.";
    case 503:
      return "Service Unavailable: The server is not ready to handle the request. It might be down for maintenance.";
    case 504:
      return "Gateway Timeout: The server is acting as a gateway and cannot get a response in time.";
    default:
      return `Unexpected Error: ${error.response.statusText}`;
  }
};
