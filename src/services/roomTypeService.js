import axiosInstance from "./httpService";

export function getRoomTypes() {
  return axiosInstance.get("/room-types/");
}
