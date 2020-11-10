import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import { getRoom, saveRoom, updateRoom } from "../../../services/roomService";
import { getHotels } from "../../../services/hotelService";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import Select from "react-select";

class NewRoomForm extends Form {
  state = {
    data: {
      hotel: [],
      room_Name: "",
      room_photo: "",
      room_details: "",
    },
    errors: {},
    hotels: [],
    photoUpload: false,
  };
  schema = {
    id: Joi.number(),
    room_Name: Joi.string().required().label("Room name"),
    hotel: Joi.object().required().label("Hotel"),
    room_photo: Joi.any().required().label("Main room photo"),
    room_details: Joi.string().required().label("Brief Room Description"),
  };

  async populateHotels() {
    const { data: hotels } = await getHotels();
    this.setState({ hotels });
  }

  async populateRooms() {
    try {
      const roomId = this.props.match.params.roomId;
      if (roomId === "new-room") return;
      const { data: room } = await getRoom(roomId);
      this.setState({ data: this.mapToViewModel(room) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async componentDidMount() {
    await this.populateRooms();
    await this.populateHotels();
  }

  mapToViewModel(room) {
    const hotel_name = {
      label: room.hotel_name,
      value: room.hotel,
    };
    return {
      id: room.id,
      room_Name: room.room_Name,
      hotel: hotel_name,
      room_details: room.room_details,
      room_photo: room.room_photo,
    };
  }

  onPhotoUpload = (e) => {
    let imgData = this.state.data;
    imgData.room_photo = e.target.files[0];
    this.setState({ data: imgData, photoUpload: true });
  };

  doSubmit = async () => {
    // try {
    //   const hotelData = {
    //     ...this.state.data,
    //     hotel: this.state.data.hotel.value,
    //   };
    const roomId = this.props.match.params.roomId;
    const stateData = this.state.data;
    const formData = new FormData();
    if (this.state.photoUpload) {
      formData.append(
        "room_photo",
        stateData.room_photo,
        stateData.room_photo.name
      );
    }
    formData.append("room_Name", stateData.room_Name);
    formData.append("room_details", stateData.room_details);
    formData.append("hotel", stateData.hotel.value);
    if (roomId === "new-room") {
      const res1 = await saveRoom(formData);
      const newUrl = `${process.env.PUBLIC_URL}/dashboard/home/hotel-rooms/${res1.data.id}`;
      window.location = newUrl;
      toast.success("Room saved successfully");
    } else {
      const res = await updateRoom(formData, roomId);
      console.log(res);
      this.props.history.replace(
        `${process.env.PUBLIC_URL}/dashboard/home/hotel-rooms/${res.data.id}`
      );
      toast.success("Room updated successfully");
    }
  };

  handleHotelOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.hotel = selectedOption;
    this.setState({ data });
  };

  render() {
    const { data, hotels } = this.state;
    let hotelOptions = hotels.map(function (hotel) {
      return { value: hotel.id, label: hotel.name };
    });
    return (
      <div>
        <div className="jumbotron">
          <h3>
            {" "}
            {this.props.match.params.roomId === "new-room"
              ? "Add New Room"
              : "Update room"}
          </h3>
          <hr />

          <form onSubmit={this.handleSubmit}>
            <small className="text-muted">Select property</small>
            <Select
              value={data.hotel}
              className="mb-3"
              name="form-field-name"
              onChange={this.handleHotelOptionSelectChange}
              options={hotelOptions}
              placeholder="Select property"
            />
            {/* {this.renderSelect("hotel", "Hotel", this.state.hotels)} */}

            {this.renderInput(
              "room_Name",
              "Set custom room name",
              "Custom Room Name"
            )}
            <small>Main room image</small>
            <br />
            {this.state.data.room_photo ? (
              <img
                src={this.state.data.room_photo}
                alt={this.state.data.room_name}
                className="img-thumbnail"
              />
            ) : null}
            <input type="file" onChange={this.onPhotoUpload} className="mb-3" />

            {this.renderTextArea(
              "room_details",
              "Brief room description",
              "Brief room description"
            )}

            {this.props.match.params.roomId === "new-room"
              ? this.renderButton("Save Room")
              : this.renderButton("Update Room")}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewRoomForm);
