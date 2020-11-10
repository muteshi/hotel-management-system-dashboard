import * as actionTypes from "../actions/hotelActionTypes";
import { updateObject } from "../../utils/utility";

const initialState = {
  hotels: [],
  hotel: {},
  hotelTypes: [],
  loading: false,
  spinning: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_HOTEL_START:
      return updateObject(state, { loading: true });

    case actionTypes.ADD_HOTEL_SUCCESS:
      return updateObject(state, {
        loading: true,
        hotels: state.hotels.concat({ ...action.hotelData }),
      });

    case actionTypes.ADD_HOTEL_FAIL:
      return updateObject(state, { loading: false });

    case actionTypes.EDIT_HOTEL_START:
      return updateObject(state, { loading: true });

    case actionTypes.EDIT_HOTEL_SUCCESS:
      return updateObject(state, {
        loading: false,
        hotels: state.hotels.concat({ ...action.hotelData }),
      });

    case actionTypes.EDIT_HOTEL_FAIL:
      return updateObject(state, { loading: false });

    case actionTypes.GET_HOTELS_START:
      return updateObject(state, { loading: true });

    case actionTypes.GET_HOTELS_SUCCESS:
      return updateObject(state, { loading: false, hotels: action.hotels });

    case actionTypes.GET_HOTELS_FAIL:
      return updateObject(state, { loading: false });

    case actionTypes.GET_HOTEL_START:
      return updateObject(state, { loading: true });

    case actionTypes.GET_HOTEL_SUCCESS:
      return updateObject(state, { loading: false, hotel: action.hotel });

    case actionTypes.GET_HOTEL_FAIL:
      return updateObject(state, { loading: false });

    case actionTypes.GET_HOTEL_TYPES_SUCCESS:
      return updateObject(state, { hotelTypes: action.hotelTypes });

    case actionTypes.GET_HOTEL_TYPES_FAIL:
      return updateObject(state, {});

    case actionTypes.ENABLE_HOTEL_START:
      const newHotels = [...state.hotels];
      const index = newHotels.findIndex(
        (hotel) => hotel.id === action.hotel.id
      );
      newHotels[index].active = !action.hotel.active;
      return updateObject(state, { hotels: newHotels });

    case actionTypes.ENABLE_HOTEL_SUCCESS:
      return updateObject(state, {});

    case actionTypes.ENABLE_HOTEL_FAIL:
      return updateObject(state, {});

    case actionTypes.FEATURE_HOTEL_START:
      const allHotels = [...state.hotels];
      const i = allHotels.findIndex((hotel) => hotel.id === action.hotel.id);
      allHotels[i].featured = !action.hotel.featured;
      return updateObject(state, { hotels: allHotels });

    case actionTypes.FEATURE_HOTEL_SUCCESS:
      return updateObject(state, {});

    case actionTypes.FEATURE_HOTEL_FAIL:
      return updateObject(state, {});

    case actionTypes.DELETE_HOTEL_START:
      return updateObject(state, {});

    case actionTypes.CANCEL_HOTEL_DELETE:
      return updateObject(state, {});

    case actionTypes.DELETE_HOTEL_SUCCESS:
      return updateObject(state, {
        hotels: state.hotels.filter((h) => h.id !== action.hotelId),
      });

    case actionTypes.DELETE_HOTEL_FAIL:
      return updateObject(state, {});

    default:
      return state;
  }
};

export default reducer;
