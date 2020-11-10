import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/itinirery/";

function itinireryUrl(itinireryId) {
  return `${apiEndpoint}${itinireryId}`;
}

export function getItinirerys(itinireryId) {
  return axiosInstance.get("/itinirery/" + itinireryId + "/");
}

export function getItinirery(itinireryId) {
  return axios.get(itinireryUrl(itinireryId));
}

export function saveItinirery(itinirery) {
  if (itinirery.id) {
    const body = { ...itinirery };
    delete body.id;
    return axiosInstance.put("/itinirery/" + itinirery.id + "/update/", body);
  }
  return axiosInstance.post("/itinirery/new/", itinirery);
}

export function deleteItinirery(itinireryId) {
  return axiosInstance.delete("/itinirery/" + itinireryId + "/delete/");
}
