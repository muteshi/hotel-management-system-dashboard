import axiosInstance from "./httpService";

export function getHotelTypes() {
  return axiosInstance.get("/hotel-types/");
}
