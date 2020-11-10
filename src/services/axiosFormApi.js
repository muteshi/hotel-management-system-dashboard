import axios from "axios";
import { apiUrl } from "../config.json";
import logger from "./logService";
import { toast } from "react-toastify";

const axiosFormInstance = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: {
    Authorization: "JWT " + localStorage.getItem("access_token"),
    "Content-Type": "multipart/form-data",
  },
});

axiosFormInstance.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occurred");
    logger.log(error);
  }
  return Promise.reject(error);
});

axiosFormInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refresh_token = localStorage.getItem("refresh_token");

      try {
        const response = await axiosFormInstance.post(
          "/account/token/refresh/",
          {
            refresh: refresh_token,
          }
        );
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        axiosFormInstance.defaults.headers["Authorization"] =
          "JWT " + response.data.access;
        originalRequest.headers["Authorization"] =
          "JWT " + response.data.access;
        return axiosFormInstance(originalRequest);
      } catch (err) {
        console.log(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosFormInstance;
