import { createAction } from "@reduxjs/toolkit";

//hotel api actions
export const hotelApiCallBegan = createAction("hotel-api/callBegan");
export const hotelApiCallSuccess = createAction("hotel-api/callSuccess");
export const hotelApiCallFailed = createAction("hotel-api/callFailed");
//hotel types api  actions
export const hotelTypeApiCallBegan = createAction(
  "hotelType-api/hotelTypeCallBegan"
);
export const hotelTypeApiCallSuccess = createAction(
  "hotelType-api/hotelTypeCallSuccess"
);
export const hotelTypeApiCallFailed = createAction(
  "hotelType-api/hotelTypeCallFailed"
);
