import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/package/";

function packageUrl(slug) {
  return `${apiEndpoint}${slug}`;
}

export function getPackages() {
  return axiosInstance.get("/package/");
}

export function getPackage(packageSlug) {
  return axios.get(packageUrl(packageSlug + "/"));
}

export function savePackage(pack) {
  if (pack.slug) {
    const body = { ...pack };
    delete body.id;
    return axiosInstance.put("/package/" + pack.slug + "/update/", body);
  }
  return axiosInstance.post("/package/new/", pack);
}

export function partialPackageUpdate(packageSlug, packageData) {
  return axiosInstance.put(
    "/package/" + packageSlug + "/partial-update/",
    packageData
  );
}

export function deletePackage(packageSlug) {
  return axiosInstance.delete("/package/" + packageSlug + "/delete/");
}
