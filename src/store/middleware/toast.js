import { toast } from "react-toastify";
import {
  hotelAdded,
  hotelDeleted,
  hotelEdited,
  hotelFacilitiesEdited,
  hotelPoliciesEdited,
  hotelSettingsEdited,
} from "../../reducers/hotels.reducer";
// import * as actions from "../apiActions";

const toastMessage = (store) => (next) => (action) => {
  if (action.type === hotelAdded.type) {
    toast.success("Property added successfully");
  }
  if (action.type === hotelEdited.type) {
    toast.success("Property details updated successfully");
  }
  if (action.type === hotelDeleted.type) {
    toast.info("Hotel deleted successfully");
  }

  if (action.type === hotelFacilitiesEdited.type) {
    toast.success("Property facilities updated successfully");
  }
  if (action.type === hotelPoliciesEdited.type) {
    toast.success("Property policies updated successfully");
  }
  if (action.type === hotelSettingsEdited.type) {
    toast.success("Property settings updated successfully");
  }
  next(action);
};

export default toastMessage;
