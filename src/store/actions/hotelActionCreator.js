import * as actionTypes from "./hotelActionTypes";
import axiosInstance from "../../services/httpService";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { redirectPage } from "../../services/hotelService";

export const addHotelStart = () => {
  return {
    type: actionTypes.ADD_HOTEL_START,
  };
};

export const addHotelSuccess = (slug, hotelData) => {
  return {
    type: actionTypes.ADD_HOTEL_SUCCESS,
    hotelSlug: slug,
    hotelData,
  };
};

export const hotelAddFail = (error) => {
  return {
    type: actionTypes.ADD_HOTEL_FAIL,
    error,
  };
};

export const addHotel = (hotelData) => {
  return (dispatch) => {
    axiosInstance
      .post("/hotel/new/", hotelData)
      .then((response) => {
        console.log(response.data);
        dispatch(addHotelStart());
        dispatch(addHotelSuccess(hotelData));
        redirectPage(
          `${process.env.PUBLIC_URL}/dashboard/home/hotels/${response.data.slug}`
        );
        toast.success(`${response.data.name} added successfully`, {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((error) => {
        dispatch(hotelAddFail(error));
      });
  };
};

export const editHotelStart = () => {
  return {
    type: actionTypes.EDIT_HOTEL_START,
  };
};

export const editHotelSuccess = (hotelData) => {
  return {
    type: actionTypes.EDIT_HOTEL_SUCCESS,
    hotelData,
  };
};

export const hotelEditFail = (error) => {
  return {
    type: actionTypes.EDIT_HOTEL_FAIL,
    error,
  };
};

export const editHotel = (hotelData, slug) => {
  return (dispatch) => {
    axiosInstance
      .patch("/hotel/" + slug + "/update/", hotelData)
      .then((response) => {
        dispatch(editHotelStart());
        dispatch(editHotelSuccess(hotelData));
        redirectPage(
          `${process.env.PUBLIC_URL}/dashboard/home/hotels/${response.data.slug}`
        );
        toast.success(`${response.data.name} updated successfully`, {
          position: toast.POSITION.TOP_CENTER,
        });
      })
      .catch((error) => {
        dispatch(hotelEditFail(error));
      });
  };
};

export const getHotelsStart = () => {
  return {
    type: actionTypes.GET_HOTELS_START,
  };
};

export const getHotelsSuccess = (hotels) => {
  return {
    type: actionTypes.GET_HOTELS_SUCCESS,
    hotels,
  };
};
export const getHotelsFail = (error) => {
  return {
    type: actionTypes.GET_HOTELS_FAIL,
    error,
  };
};

export const getHotels = () => {
  return (dispatch) => {
    dispatch(getHotelsStart());
    axiosInstance
      .get("/hotel/")
      .then((res) => {
        dispatch(getHotelsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getHotelsFail(err));
      });
  };
};

export const getHotelStart = () => {
  return {
    type: actionTypes.GET_HOTEL_START,
  };
};

export const getHotelSuccess = (hotel) => {
  return {
    type: actionTypes.GET_HOTEL_SUCCESS,
    hotel,
  };
};
export const getHotelFail = (error) => {
  return {
    type: actionTypes.GET_HOTEL_FAIL,
    error,
  };
};

export const getHotel = (hotel) => {
  return (dispatch) => {
    dispatch(getHotelStart());
    axiosInstance
      .get(`/hotel/${hotel}/`)
      .then((res) => {
        dispatch(getHotelSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getHotelFail(err));
      });
  };
};

export const getHotelTypesSuccess = (hotelTypes) => {
  return {
    type: actionTypes.GET_HOTEL_TYPES_SUCCESS,
    hotelTypes,
  };
};
export const getHotelTypesFail = (error) => {
  return {
    type: actionTypes.GET_HOTEL_TYPES_FAIL,
    error,
  };
};

export const getHotelTypes = () => {
  return (dispatch) => {
    axiosInstance
      .get("/hotel-types/")
      .then((res) => {
        dispatch(getHotelTypesSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getHotelTypesFail(err));
      });
  };
};

export const enableHotelStart = (hotel) => {
  return {
    type: actionTypes.ENABLE_HOTEL_START,
    hotel,
  };
};
export const enableHotelSuccess = (hotel) => {
  return {
    type: actionTypes.ENABLE_HOTEL_SUCCESS,
    hotel,
  };
};
export const enableHotelFail = (error) => {
  return {
    type: actionTypes.ENABLE_HOTEL_FAIL,
    error,
  };
};

export const enableOrDisableHotel = (hotel) => {
  return (dispatch) => {
    dispatch(enableHotelStart(hotel));
    let hotelIsActive = { active: hotel.active };
    if (hotelIsActive.active) {
      toast.success(`${hotel.name} enabled`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.warning(`${hotel.name} disabled`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    axiosInstance
      .put(`/hotel/${hotel.slug}/partial-update/`, hotelIsActive)
      .then((res) => {
        dispatch(enableHotelSuccess(res.data));
      })
      .catch((err) => {
        dispatch(enableHotelFail(err));
      });
  };
};

export const featureHotelStart = (hotel) => {
  return {
    type: actionTypes.FEATURE_HOTEL_START,
    hotel,
  };
};
export const featureHotelSuccess = (hotel) => {
  return {
    type: actionTypes.FEATURE_HOTEL_SUCCESS,
    hotel,
  };
};
export const featureHotelFail = (error) => {
  return {
    type: actionTypes.FEATURE_HOTEL_FAIL,
    error,
  };
};

export const featureOnOffHotel = (hotel) => {
  return (dispatch) => {
    dispatch(featureHotelStart(hotel));
    let hotelIsFeatured = { featured: hotel.featured };
    if (hotelIsFeatured.featured) {
      toast.success(`${hotel.name} featured on`, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.warning(`${hotel.name} featured off`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    axiosInstance
      .put(`/hotel/${hotel.slug}/partial-update/`, hotelIsFeatured)
      .then((res) => {
        dispatch(featureHotelSuccess(res.data));
      })
      .catch((err) => {
        dispatch(featureHotelFail(err));
      });
  };
};

export const deleteHotelStart = () => {
  return {
    type: actionTypes.DELETE_HOTEL_START,
  };
};

export const deleteHotelSuccess = (hotelId) => {
  return {
    type: actionTypes.DELETE_HOTEL_SUCCESS,
    hotelId,
  };
};
export const cancelHotelDelete = () => {
  return {
    type: actionTypes.CANCEL_HOTEL_DELETE,
  };
};

export const deleteHotelFail = (error) => {
  return {
    type: actionTypes.DELETE_HOTEL_FAIL,
    error,
  };
};

export const deleteHotel = (hotelId, hotel) => {
  return (dispatch) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this property!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteHotelStart());
        axiosInstance
          .delete(`/hotel/${hotelId}/delete/`)
          .then((res) => {
            console.log(res);
            dispatch(deleteHotelSuccess(hotelId));
          })
          .catch((err) => {
            dispatch(deleteHotelFail(err));
          });
        swal(`${hotel.name} has been deleted!`, {
          icon: "success",
        });
      } else {
        dispatch(cancelHotelDelete());
      }
    });
  };
};
