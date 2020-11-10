import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/hotel-package/";

function hotelPackageUrl(hotelPackageId) {
  return `${apiEndpoint}${hotelPackageId}`;
}

export function getHotelPackages(packageId) {
  return axiosInstance.get("/hotelpackages/" + packageId + "/");
}

export function getHotelPackage(hotelPackageId) {
  return axios.get(hotelPackageUrl(hotelPackageId));
}

export function saveHotelPackage(hotelPackage) {
  if (hotelPackage.id) {
    const body = { ...hotelPackage };
    delete body.id;
    return axiosInstance.put(
      "/hotel-package/" + hotelPackage.id + "/update/",
      body
    );
  }
  return axiosInstance.post("/hotel-package/new/", hotelPackage);
}

export function deleteHotelPackage(hotelPackageId) {
  return axiosInstance.delete("/hotel-package/" + hotelPackageId + "/delete/");
}
