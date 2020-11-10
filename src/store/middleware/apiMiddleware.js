import { getHotelTypes } from "../../services/hotelService";
import * as actions from "../apiActions";
import axiosInstance from "../../services/httpService";
import { apiUrl } from "../../config.json";
const baseURL = apiUrl;

export const hotelsApi = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.hotelApiCallBegan.type) return next(action);

  const {
    onStart,
    onSuccess,
    onError,
    url,
    method,
    data,
    redirect,
  } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);
  try {
    const response = await axiosInstance.request({
      baseURL,
      url,
      method,
      data,
      redirect,
    });

    //General
    dispatch(actions.hotelApiCallSuccess(response.data));
    //Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    //general error
    dispatch(actions.hotelApiCallFailed(error.message));
    console.log(error.message);
    //Specific error
    if (onError) dispatch({ type: onError, payload: error.message });
    console.log(error.message);
  }
};

export const hotelTypesApi = ({ dispatch }) => (next) => async (action) => {
  if (action.type !== actions.hotelTypeApiCallBegan.type) return next(action);

  const { onStart, onSuccess, onError } = action.payload;

  if (onStart) dispatch({ type: onStart });

  next(action);
  try {
    const response = await getHotelTypes();

    //General
    dispatch(actions.hotelTypeApiCallSuccess(response.data));
    //Specific
    if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
  } catch (error) {
    //general error
    dispatch(actions.hotelTypeApiCallFailed(error.message));
    //Specific error
    if (onError) dispatch({ type: onError, payload: error.message });
  }
};
