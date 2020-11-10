import { createStore, applyMiddleware, compose } from "redux";

// middlewares
// import thunkMiddleware from "redux-thunk";
import thunk from "redux-thunk";
// import logger from "redux-logger";

// Import custom components
import reducers from "../store/reducers/index";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (e) {
    return undefined;
  }
}

/**
 * Create a Redux store that holds the app state.
 */
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

// eslint-disable-next-line
const unsubscribe = store.subscribe(() => {
  const state = store.getState();
  saveToLocalStorage(state);
});

export default store;
