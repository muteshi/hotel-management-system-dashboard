import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import auth from "../../services/authService";
const user = auth.getCurrentUser() ? auth.getCurrentUser() : {};

class BookingsTable extends Component {
  columns = [
    {
      path: "guest_name",
      label: "Reservation #",
      content: (order) => (
        <Link to={`${process.env.PUBLIC_URL}/orders/${order.id}`}>
          #{order.reservation_id}
        </Link>
      ),
    },
    { path: "created_at", label: "Date created" },
    { path: "final_total", label: "Invoice total" },
    user.is_superuser
      ? { path: "commission_total", label: "Commission total" }
      : null,
    {
      key: "invoice",
      content: (order) => (
        <Link
          to={`${process.env.PUBLIC_URL}/invoices/${order.id}`}
          className="btn btn-primary btn-xs"
        >
          View invoice
        </Link>
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (order) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(order)}
        style={{ color: "red", cursor: "pointer", fontSize: 24 }}
      ></i>
    ),
  };
  constructor() {
    super();

    if (user && user.is_staff) this.columns.push(this.deleteColumn);
  }

  render() {
    const updatedColums = this.columns.filter((column) => column !== null);
    const { bookings, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={updatedColums}
        data={bookings}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default BookingsTable;
