import { createSlice } from "@reduxjs/toolkit";
import { getHotels, getHotelTypes } from "../services/hotelService";
import { hotelTypeApiCallBegan } from "../store/apiActions";
import moment from "moment";

const slice = createSlice({
  name: "hotelTypes",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    hotelTypesRequested: (hotelTypes) => {
      hotelTypes.loading = true;
    },
    hotelTypesRequestFailed: (hotelTypes) => {
      hotelTypes.loading = false;
    },
    hotelTypesReceived: (hotelTypes, action) => {
      hotelTypes.list = action.payload;
      hotelTypes.loading = false;
      hotelTypes.lastFetch = Date.now();
    },
  },
});

export const {
  hotelTypesReceived,
  hotelTypesRequestFailed,
  hotelTypesRequested,
} = slice.actions;
export default slice.reducer;

//Action creators
export const loadHotelTypes = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.hotelTypes;
  const diffInMinutes = moment().diff(lastFetch, "minutes");
  if (diffInMinutes < 10) return;
  dispatch(
    hotelTypeApiCallBegan({
      //   getHotelTypes: getHotelTypes(),
      onStart: hotelTypesRequested.type,
      onSuccess: hotelTypesReceived.type,
      onError: hotelTypesRequestFailed.type,
    })
  );
};
