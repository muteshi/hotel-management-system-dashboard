import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/hotel/room/";

function roomUrl(roomId) {
  return `${apiEndpoint}${roomId}`;
}

export function getRooms(hotel) {
  return axiosInstance.get("/hotel-room/" + hotel + "/");
}

export function getRoom(roomId) {
  return axios.get(roomUrl(roomId));
}

export function saveRoom(room) {
  return axiosInstance.post("/hotel/room/new/", room);
}
export function updateRoom(room, roomId) {
  return axiosInstance.patch("/hotel-room/" + roomId + "/update/", room);
}

export function updateRoomSettings(roomId, room) {
  return axiosInstance.put("/room-settings/" + roomId + "/update/", room);
}

export function updateRoomAmmenities(roomId, room) {
  return axiosInstance.put("/room-ammenities/" + roomId + "/update/", room);
}

export function deleteRoom(roomId) {
  return axiosInstance.delete("/hotel-room/" + roomId + "/delete/");
}
