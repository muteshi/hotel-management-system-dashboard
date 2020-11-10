import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Activate from "../common/activate";
import Featured from "../common/featured";
import auth from "../../services/authService";

class HotelsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Hotel name",
      content: (hotel) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/home/hotels/${hotel.slug}`}
        >
          {hotel.name}
        </Link>
      ),
    },
    { path: "star_rating", label: "Star Rating" },
    {
      key: "gallery",
      content: (hotel) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/hotels/gallery/${hotel.slug}`}
          className="btn btn-primary btn-sm"
        >
          Gallery ({hotel.photo_count})
        </Link>
      ),
    },
    {
      key: "rooms",
      content: (hotel) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/rooms/${hotel.slug}`}
          className="btn btn-primary btn-sm"
        >
          Rooms ({hotel.room_count})
        </Link>
      ),
    },
  ];

  featuredColumn = {
    key: "featuredKey",
    label: "Featured",
    content: (hotel) => (
      <Featured
        featured={hotel.featured}
        onClick={() => this.props.clickFeatured(hotel)}
      />
    ),
  };

  isActiveColumn = {
    key: "activeKey",
    label: "Active",
    content: (hotel) => (
      <Activate
        activate={hotel.active}
        onClick={() => this.props.onClickActivate(hotel)}
      />
    ),
  };

  deleteColumn = {
    key: "delete",
    content: (hotel) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.clickDelete(hotel.id, hotel)}
        style={{ color: "red", cursor: "pointer", fontSize: 24 }}
      ></i>
    ),
  };
  constructor() {
    super();

    const user = auth.getCurrentUser();
    if (user && user.is_staff) this.columns.push(this.deleteColumn);

    if (user && user.is_superuser) {
      this.columns.splice(1, 0, this.isActiveColumn);
      this.columns.splice(2, 0, this.featuredColumn);
    }
  }

  render() {
    const { onSort, sortColumn, hotels } = this.props;
    return (
      <Table
        columns={this.columns}
        data={hotels}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default HotelsTable;
