import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/account/";

function userUrl(id) {
  return `${apiEndpoint}${id}`;
}

export function getUsers() {
  return axiosInstance.get("/account/users/");
}

export function getUserTypes() {
  return axiosInstance.get("/account/user-types/");
}

export function getUser(userId) {
  return axios.get(userUrl("user/" + userId + "/"));
}

export function saveUser(user) {
  if (user.id) {
    const body = { ...user };
    delete body.id;
    return axiosInstance.put("/account/user/" + user.id + "/update/", body);
  }
  return axiosInstance.post("/account/create/", user);
}

export function partialUserUpdate(userId, userIsActive) {
  return axiosInstance.put(
    "/account/user/" + userId + "/partial-update/",
    userIsActive
  );
}

export function userProfileUpdate(profile) {
  return axiosInstance.put(
    "/account/user-profile/" + profile.profileId + "/update/",
    profile
  );
}

export function deleteUser(userId) {
  return axiosInstance.delete("/account/user/" + userId + "/delete/");
}
