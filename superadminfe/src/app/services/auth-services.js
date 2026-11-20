import { io } from "socket.io-client";
import axios from "./config";

const authService = {};

authService.getCurrentUser = async (username, header) => {
  console.log("username", username);
  console.log("header", header);
  const data = await axios.get(
    `${BASE_URL}/superadmin/user/?username=${username}`,
    header,
  );

  return data;
};

authService.signIn = async (username, password, header) => {
  const data = await axios.post(
    `${BASE_URL}/useradmin/login/`,
    {
      username,
      password,
    },
    header,
  );

  return data;
};

authService.refreshToken = async (refresh) => {
  const data = await axios.post(`${BASE_URL}/token/refresh/`, {
    refresh,
  });

  return data;
};

const currentURL = window.location.href;
// Split the URL by '/'
export const segments = currentURL.split("/");
// Get the second segment (index 1)
// export const Tenantname = segments[segments.length > 3 ? 3 : 1].trim();

// export const Tenantname = currentURL.split(".")[0].split("//")[1];

const hostname = currentURL.split(".")[0].split("//")[1];
// const params = new URLSearchParams(window.location.search);

// Check if there's a subdomain
export const Tenantname =
  hostname === "localhost:3000/" ? "" : hostname.split(".")[0];
// export const Tenantname = params.get('Tenentname');
console.log("Tenantname:", hostname, Tenantname);

export const BASE_URL1 = `https://backend.crmfarm.in/${Tenantname}`;

export const BASE_URLIMAGE = `https://backend.crmfarm.in`;

// export const BASE_URL = `https://127.0.0.1:8000/${Tenantname}`;
//
export const BASE_URL = `https://backend.crmfarm.in/${Tenantname}`;

export const Super_Admin_URL = `https://backend.crmfarm.in/${Tenantname}`;

export const getProfileImage = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http") || photo.startsWith("data:image")) return photo;
  return `${BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
};

export const BASE_URL2 = `https://3.85.209.92:8000/`;

// export const socket = io("https://chat.crmfarm.app", {
//   transports: ["websocket", "polling"],
// });

export const socket = {
  on: () => {},
  off: () => {},
  emit: () => {},
  connect: () => {},
  disconnect: () => {},
};

// export const localSocket = io("https://localhost:8082", {
//   transports: ["websocket", "polling"],
// });
export default authService;
