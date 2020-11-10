import { combineReducers } from "redux";
import Customizer from "./customizer.reducer";
import entitiesReducer from "./entities";

const reducer = combineReducers({
  Customizer,
  entities: entitiesReducer,
});

export default reducer;
