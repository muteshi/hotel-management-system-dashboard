import { combineReducers } from "redux";
import Customizer from "./customizer.reducer";
import hotels from "./hotel.reducer";

const reducer = combineReducers({
  Customizer,
  apiData: hotels,
});

export default reducer;
