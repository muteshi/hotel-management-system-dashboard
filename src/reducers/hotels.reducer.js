import { createSlice } from "@reduxjs/toolkit";
import { hotelApiCallBegan } from "../store/apiActions";
import { hotelUrl } from "../config.json";
import moment from "moment";

const slice = createSlice({
  name: "hotels",
  initialState: {
    list: [],
    loading: false,
    enabled: false,
    lastFetch: null,
    hotelJustAdded: [],
    hotelToBeUpdated: [],
  },
  reducers: {
    hotelsRequested: (hotels) => {
      hotels.loading = true;
    },
    hotelsRequestFailed: (hotels) => {
      hotels.loading = false;
    },
    hotelsReceived: (hotels, action) => {
      hotels.list = action.payload;
      hotels.loading = false;
      hotels.lastFetch = Date.now();
    },
    hotelEnabled: (hotels, action) => {
      const { slug } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.slug === slug);
      hotels.list[index].active = true;
      hotels.enabled = true;
    },

    hotelDisabled: (hotels, action) => {
      const { slug } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.slug === slug);
      hotels.list[index].active = false;
      hotels.enabled = false;
    },
    hotelFeaturedEnabled: (hotels, action) => {
      const { slug } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.slug === slug);
      hotels.list[index].featured = true;
    },
    hotelFeaturedDisabled: (hotels, action) => {
      const { slug } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.slug === slug);
      hotels.list[index].featured = false;
    },

    hotelAdded: (hotels, action) => {
      hotels.list.push(action.payload);
      hotels.hotelJustAdded = action.payload;
    },

    hotelEdited: (hotels, action) => {
      const { id } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.id === id);
      hotels.list[index] = action.payload;
      // hotels.list.push(action.payload);
    },
    hotelSettingsEdited: (hotels, action) => {
      const { id } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.id === id);
      hotels.list[index] = action.payload;
    },
    hotelFacilitiesEdited: (hotels, action) => {
      const { id } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.id === id);
      hotels.list[index] = action.payload;
    },
    hotelPoliciesEdited: (hotels, action) => {
      const { id } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.id === id);
      hotels.list[index] = action.payload;
    },

    hotelToBeUpdatedRequested: (hotels) => {
      hotels.loading = true;
    },
    hotelToBeUpdatedRequestFailed: (hotels) => {
      hotels.loading = false;
    },
    hotelToBeUpdatedReceived: (hotels, action) => {
      hotels.hotelToBeUpdated = action.payload;
      hotels.loading = false;
    },
    hotelDeleted: (hotels, action) => {
      const { slug } = action.payload;
      const index = hotels.list.findIndex((hotel) => hotel.slug !== slug);
      hotels.list.splice(index, 1);
    },
  },
});

export const {
  hotelsReceived,
  hotelsRequestFailed,
  hotelsRequested,
  hotelEnabled,
  hotelEnabledAfter,
  hotelDisabled,
  hotelAdded,
  hotelDeleted,
  hotelFeaturedEnabled,
  hotelFeaturedDisabled,
  hotelEdited,
  hotelSettingsEdited,
  hotelFacilitiesEdited,
  hotelPoliciesEdited,
  hotelToBeUpdatedRequested,
  hotelToBeUpdatedRequestFailed,
  hotelToBeUpdatedReceived,
} = slice.actions;
export default slice.reducer;

//Action creators
export const loadHotels = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.hotels;
  const diffInMinutes = moment().diff(lastFetch, "minutes");
  if (diffInMinutes < 10) return;
  dispatch(
    hotelApiCallBegan({
      url: hotelUrl,
      onStart: hotelsRequested.type,
      onSuccess: hotelsReceived.type,
      onError: hotelsRequestFailed.type,
    })
  );
};

export const enableHotel = (slug) =>
  hotelApiCallBegan(
    {
      url: `${hotelUrl}${slug}/partial-update/`,
      method: "put",
      data: { active: true },
      onSuccess: hotelEnabled.type,
    },
    console.log(slug)
  );

// export const disableHotel = (slug) => (dispatch, getState) => {
//   const { list } = getState().entities.hotels;
//   const index = list.findIndex((hotel) => hotel.slug === slug);
//   const newHotel = { ...list[index] };
//   const newHotels = { ...list };
//   newHotel.active = !newHotel.active;
//   newHotels[index] = newHotel;

//   // console.log(newHotel.active);
//   dispatch(
//     hotelApiCallBegan({
//       url: `${hotelUrl}${slug}/partial-update/`,
//       method: "put",
//       data: { active: false },
//       onSuccess: hotelDisabled.type,
//     })
//   );
// };

export const disableHotel = (slug) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${slug}/partial-update/`,
    method: "put",
    data: { active: false },
    onSuccess: hotelDisabled.type,
  });

export const enableFeatured = (slug) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${slug}/partial-update/`,
    method: "put",
    data: { featured: true },
    onSuccess: hotelFeaturedEnabled.type,
  });

export const disableFeatured = (slug) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${slug}/partial-update/`,
    method: "put",
    data: { featured: false },
    onSuccess: hotelFeaturedDisabled.type,
  });

export const addHotel = (hotel, history) =>
  hotelApiCallBegan({
    url: `${hotelUrl}new/`,
    method: "post",
    data: hotel,
    onSuccess: hotelAdded.type,
    redirect: history,
  });
export const deleteHotel = (id) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${id}/delete/`,
    method: "delete",
    onSuccess: hotelDeleted.type,
  });

//load single hotel for editing
export const loadHotel = (slug) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${slug}/`,
    onStart: hotelToBeUpdatedRequested.type,
    onSuccess: hotelToBeUpdatedReceived.type,
    onError: hotelToBeUpdatedRequestFailed.type,
  });

export const editHotel = (hotel, history) =>
  hotelApiCallBegan({
    url: `${hotelUrl}${hotel.slug}/update/`,
    method: "put",
    data: hotel,
    onSuccess: hotelEdited.type,
    redirect: history,
  });

export const editHotelSettings = (hotel, history) =>
  hotelApiCallBegan({
    url: `/hotel-settings/${hotel.slug}/update/`,
    method: "put",
    data: hotel,
    onSuccess: hotelSettingsEdited.type,
    redirect: history,
  });

export const editHotelFacilities = (hotel, history) =>
  hotelApiCallBegan({
    url: `/hotel-facilities/${hotel.slug}/update/`,
    method: "put",
    data: hotel,
    onSuccess: hotelFacilitiesEdited.type,
    redirect: history,
  });
export const editHotelPolicies = (hotel, history) =>
  hotelApiCallBegan({
    url: `/hotel-policy/${hotel.slug}/update/`,
    method: "put",
    data: hotel,
    onSuccess: hotelPoliciesEdited.type,
    redirect: history,
  });
