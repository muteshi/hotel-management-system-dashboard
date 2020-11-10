import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/hotel/";

function hotelUrl(slug) {
  return `${apiEndpoint}${slug}`;
}

export function getHotelTypes() {
  return axiosInstance.get("/hotel-types/");
}

export function getHotels() {
  return axiosInstance.get("/hotel/");
}

export function getConferenceHotels() {
  return axiosInstance.get("/conference-hotel/");
}

export function getApartments() {
  return axiosInstance.get("/apartments/");
}

export function getHotel(hotelSlug) {
  return axios.get(hotelUrl(hotelSlug + "/"));
}

export function saveHotel(hotel) {
  if (hotel.slug) {
    const body = { ...hotel };
    delete body.id;
    return axiosInstance.put("/hotel/" + hotel.slug + "/update/", body);
  }
  return axiosInstance.post("/hotel/new/", hotel);
}

export function updateHotelFacilities(hotelSlug, hotel) {
  return axiosInstance.put(
    "/hotel-facilities/" + hotelSlug + "/update/",
    hotel
  );
}

export function updateHotelSettings(hotelSlug, hotel) {
  return axiosInstance.put("/hotel-settings/" + hotelSlug + "/update/", hotel);
}

export function updateHotelPolicy(hotelSlug, hotel) {
  return axiosInstance.put("/hotel-policy/" + hotelSlug + "/update/", hotel);
}

export function partialHotelUpdate(hotelSlug, hotelIsActive) {
  return axiosInstance.put(
    "/hotel/" + hotelSlug + "/partial-update/",
    hotelIsActive
  );
}

export function deleteHotel(hotelSlug) {
  return axiosInstance.delete("/hotel/" + hotelSlug + "/delete/");
}

export function redirectPage(path) {
  window.location = path;
}
