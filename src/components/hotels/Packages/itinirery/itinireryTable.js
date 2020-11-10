import React, { Component } from "react";
import Table from "../../../common/table";
import { Link } from "react-router-dom";
import auth from "../../../../services/authService";

class ItinireryTable extends Component {
  columns = [
    {
      path: "title",
      label: "Itinirery title",
      content: (itinirery) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/itinirery/${itinirery.id}`}
        >
          {itinirery.title}
        </Link>
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (itinirery) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(itinirery)}
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
    const { itinirerys, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={itinirerys}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ItinireryTable;
