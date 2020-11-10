import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/hotel-facilities/";

function hotelFacilityUrl(facilityId) {
  return `${apiEndpoint}${facilityId}`;
}

export function getHotelFacility(facilityId) {
  return axios.get(hotelFacilityUrl(facilityId));
}

export function saveHotelFacility(hotelFacility) {
  if (hotelFacility.id) {
    const body = { ...hotelFacility };
    delete body.id;
    return axiosInstance.put(
      "/hotel/-facilities" + hotelFacility.id + "/update/",
      body
    );
  }
  return axiosInstance.post("/hotel-facilities/new/", hotelFacility);
}
