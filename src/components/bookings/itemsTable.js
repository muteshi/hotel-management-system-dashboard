import React, { Component } from "react";
import Table from "../common/table";

class BookingItemsTable extends Component {
  columns = [
    { path: "room_Name", label: "Room name" },
    { path: "room_qty", label: "Room quantity" },
    { path: "total_guests", label: "Max guests" },
    { path: "stay_duration", label: "Stay duration" },
    { path: "checkin", label: "Checkin" },
    { path: "checkout", label: "Checkout" },
    { path: "sub_total", label: "Sub total" },
  ];

  render() {
    const { items } = this.props;
    console.log(items);
    return (
      <Table
        columns={this.columns}
        data={items}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BookingItemsTable;
