import { combineReducers } from "redux";
import hotelsReducer from "./hotels.reducer";
import hotelTypesReducer from "./hotelTypes.reducer";

const reducers = combineReducers({
  hotels: hotelsReducer,
  hotelTypes: hotelTypesReducer,
});

export default reducers;
