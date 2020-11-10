import jwtDecode from "jwt-decode";
import axiosInstance from "../services/httpService";
import { toast } from "react-toastify";
// import { apiHotelUrl } from "../config.json";

const tokenKey = "access_token";

// const apiEndpoint = apiHotelUrl;
// // http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await axiosInstance.post("/account/token/", {
    email,
    password,
  });
  axiosInstance.defaults.headers["Authorization"] = "JWT " + jwt.access;
  axiosInstance.defaults.headers["Authorization"] = "JWT " + jwt.refresh;
  localStorage.setItem("access_token", jwt.access);
  localStorage.setItem("refresh_token", jwt.refresh);
  return jwt;
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  try {
    const response = axiosInstance.post("/account/token/blacklist/", {
      tokenKey: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    axiosInstance.defaults.headers["Authorization"] = null;
    window.location = `${process.env.PUBLIC_URL}/`;
    return response;
  } catch (e) {
    console.log(e);
    toast.error("An unexpected error occurred");
  }
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
