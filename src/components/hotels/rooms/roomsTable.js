import React, { Component } from "react";
import Table from "../../common/table";
import { Link } from "react-router-dom";
import auth from "../../../services/authService";

class RoomsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Room name",
      content: (room) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/home/hotel-rooms/${room.id}`}
        >
          {room.room_Name}
        </Link>
      ),
    },
    {
      path: "hotel_name",
      label: "Hotel name",
      content: (room) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/home/hotels/${room.hotel_slug}`}
        >
          {room.hotel_name}
        </Link>
      ),
    },
    { path: "room_Price", label: "Room Price" },
    {
      key: "gallery",
      content: (room) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/rooms/gallery/${room.id}`}
          className="btn btn-primary"
        >
          Gallery
        </Link>
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (hotel) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(hotel)}
        style={{ color: "red", cursor: "pointer", fontSize: 24 }}
      ></i>
    ),
  };
  constructor() {
    super();

    const user = auth.getCurrentUser();
    if (user && user.is_staff) this.columns.push(this.deleteColumn);
  }

  render() {
    const { rooms, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={rooms}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default RoomsTable;
