import axios from "axios";
import axiosInstance from "../services/httpService";
import { apiUrl } from "../config.json";

export function getPhotos(hotel) {
  return axios.get(apiUrl + "/hotel/photos/" + hotel + "/");
}

export function getRoomPhotos(room) {
  return axios.get(apiUrl + "/hotel-room/photos/" + room + "/");
}

export function getPackagePhotos(packageData) {
  return axios.get(apiUrl + "/package/photos/" + packageData + "/");
}

export function uploadPhotos(photosData) {
  return axiosInstance.post("photos-upload/", photosData);
}

export function uploadRoomPhotos(photosData) {
  return axiosInstance.post("room-photos-upload/", photosData);
}

export function uploadPackagePhotos(photosData) {
  return axiosInstance.post("package-photos-upload/", photosData);
}
