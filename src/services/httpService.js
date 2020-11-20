import axios from "axios";
import { apiUrl } from "../config.json";
import logger from "./logService";
import { toast } from "react-toastify";

const baseURL = apiUrl;

const axiosInstance = axios.create({
  baseURL: baseURL,
  // timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "JWT " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(null, async (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occurred");
    logger.log(error);
  }

  const originalRequest = error.config;
  // const api_url = "/account/token/refresh/";

  const loopCheck = error.response && error.response.status === 401;
  if (loopCheck) {
    toast.warning("Your session has expired. Please login again");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axiosInstance.defaults.headers["Authorization"] = null;

    window.location = `${process.env.PUBLIC_URL}/`;
  }
  const invalidToken =
    error.response &&
    error.response.data.code === "token_not_valid" &&
    error.response.status === 401 &&
    error.response.statusText === "Unauthorized";

  if (invalidToken) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

      // exp date in token is expressed in seconds, while now() returns milliseconds:
      const now = Math.ceil(Date.now() / 1000);
      console.log(tokenParts.exp);

      if (tokenParts.exp > now) {
        try {
          const response = await axiosInstance.post("/account/token/refresh/", {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + response.data.access;
          originalRequest.headers["Authorization"] =
            "JWT " + response.data.access;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("Refresh token is expired", tokenParts.exp, now);
        window.location = `${process.env.PUBLIC_URL}/`;
      }
    } else {
      console.log("Refresh token not available.");
      window.location = `${process.env.PUBLIC_URL}/`;
    }
  }

  return Promise.reject(error);
});

export default axiosInstance;
