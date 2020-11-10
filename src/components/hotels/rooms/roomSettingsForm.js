import React from "react";
import Joi from "joi-browser";
import Form from "../../common/form";
import "../../../assets/css/hotelFacilitiesForm.css";
import { getRoom, updateRoomSettings } from "../../../services/roomService";
import { getRoomTypes } from "../../../services/roomTypeService";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import Select from "react-select";

class RoomSettingsForm extends Form {
  state = {
    data: {
      room_type: [],
      max_adults: "",
      max_child: "",
      extra_beds: "",
      extra_bed_price: "",
      room_Price: "",
      total_Rooms: "",
      is_conference_room: false,
    },
    errors: {},
    room_type: [],
  };
  schema = {
    room_type: Joi.object(),
    is_conference_room: Joi.boolean(),
    max_adults: Joi.number().min(1).label("Max adults"),
    max_child: Joi.number().min(1).label("Max child"),
    extra_beds: Joi.number().min(0).label("Extra beds"),
    extra_bed_price: Joi.number().min(1).label("Extra Bed price"),
    room_Price: Joi.number().min(1).label("Room Price"),
    total_Rooms: Joi.number().min(1).label("Room Quantity"),
  };

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

  async populateRoomTypes() {
    const { data: room_type } = await getRoomTypes();
    this.setState({ room_type });
  }

  async componentDidMount() {
    await this.populateRooms();
    await this.populateRoomTypes();
  }

  mapToViewModel(room) {
    const room_type = {
      label: room.room_type_name,
      value: room.room_type,
    };
    return {
      max_adults: room.max_adults,
      max_child: room.max_child,
      extra_beds: room.extra_beds,
      extra_bed_price: room.extra_bed_price,
      room_Price: room.room_Price,
      room_type: room.room_type ? room_type : "",
      total_Rooms: room.total_Rooms,
      is_conference_room: room.is_conference_room,
    };
  }

  doSubmit = async () => {
    try {
      const roomId = this.props.match.params.roomId;
      const data = this.state.data;

      const roomData = {
        ...data,
        room_type: data.room_type.value,
      };

      await updateRoomSettings(roomId, roomData);
      window.location.reload();
      toast.success("Settings submitted successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  handleRoomTypesOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.room_type = selectedOption;
    this.setState({ data });
    if (data.room_type.label === "Conference room") {
      data.is_conference_room = true;
      this.setState({ data });
    } else {
      data.is_conference_room = false;
      this.setState({ data });
    }
  };

  toggleChange = () => {
    let data = this.state.data;
    data.is_conference_room = !data.is_conference_room;
    this.setState({ data });
  };

  render() {
    const { data, room_type } = this.state;

    let roomTypesOptions = room_type.map(function (room) {
      return { value: room.id, label: room.name };
    });
    return (
      <div>
        <div className="jumbotron">
          <form onSubmit={this.handleSubmit} style={{ marginTop: -45 }}>
            <small className="text-muted">Select room type</small>
            <Select
              value={data.room_type}
              className="mb-3"
              name="form-field-name"
              onChange={this.handleRoomTypesOptionSelectChange}
              options={roomTypesOptions}
              placeholder="Room types"
            />

            {this.renderInput(
              "room_Price",
              "Room price",
              "Room price",
              "number"
            )}

            {this.renderInput(
              "max_adults",
              "Max occupancy",
              "Max Adults",
              "number"
            )}

            {this.renderInput(
              "total_Rooms",
              "Quantity of rooms",
              "Room Quantity",
              "number"
            )}

            {this.renderInput(
              "extra_beds",
              "Number of extra beds",
              "Extra Beds",
              "number"
            )}

            {this.renderInput(
              "extra_bed_price",
              "Price of the extra bed",
              "Extra Bed Price",
              "number"
            )}

            {this.props.match.params.slug === "new-hotel"
              ? this.renderButton("Save Hotel")
              : this.renderButton("Update Hotel")}
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(RoomSettingsForm);
