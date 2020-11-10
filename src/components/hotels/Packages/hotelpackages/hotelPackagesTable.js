import React, { Component } from "react";
import Table from "../../../common/table";
import { Link } from "react-router-dom";
import auth from "../../../../services/authService";

class HotelPackagesTable extends Component {
  columns = [
    {
      path: "hotel",
      label: "Hotel Package name",
      content: (hotelPackage) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/hotel-packages/${hotelPackage.id}`}
        >
          {hotelPackage.hotel_name}
        </Link>
      ),
    },

    { path: "package_Price", label: "Package price" },
    { path: "start_Date", label: "Start Date" },
    { path: "end_Date", label: "End Date" },
    { path: "duration", label: "Package duration" },
  ];

  deleteColumn = {
    key: "delete",
    content: (hotelPackage) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(hotelPackage)}
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
    const { hotelPackages, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={hotelPackages}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default HotelPackagesTable;
