import axiosInstance from "../services/httpService";
import axios from "axios";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/booking/";

const apiEndpoint2 = apiUrl + "/booking-item/";

function bookingUrl(id) {
  return `${apiEndpoint}${id}`;
}

function bookingItemUrl(id) {
  return `${apiEndpoint2}${id}`;
}

export function getBookings() {
  return axiosInstance.get("/booking/");
}

export function getBookingSettings() {
  return axiosInstance.get("/booking-settings/");
}

export function getPaymentOptions() {
  return axiosInstance.get("/payment-options/");
}

export function getBookingStatus() {
  return axiosInstance.get("/booking-status/");
}

export function getBooking(bookingId) {
  return axios.get(bookingUrl(bookingId + "/"));
}

export function getBookingItems(bookingId) {
  return axios.get(bookingItemUrl(bookingId + "/"));
}

export function saveBooking(booking) {
  if (booking.id) {
    const body = { ...booking };
    delete body.id;
    return axiosInstance.put("/booking/" + booking.id + "/update/", body);
  }
  return axiosInstance.post("/booking/new/", booking);
}

export function deleteBooking(bookingId) {
  return axiosInstance.delete("/booking/" + bookingId + "/delete/");
}
