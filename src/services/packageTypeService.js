import axiosInstance from "./httpService";

export function getPackageTypes() {
  return axiosInstance.get("/package-types/");
}
