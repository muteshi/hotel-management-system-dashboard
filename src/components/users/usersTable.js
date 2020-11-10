import React, { Component } from "react";
import Table from "../common/table";
import { Link } from "react-router-dom";
import Activate from "../common/activate";
import auth from "../../services/authService";

class UsersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Full name",
      content: (user) => (
        <Link to={`${process.env.PUBLIC_URL}/users/${user.id}`}>
          {user.name}
        </Link>
      ),
    },
    { path: "city", label: "Location" },
    { path: "country", label: "Country" },
  ];

  isActiveColumn = {
    key: "activeKey",
    label: "Active",
    content: (user) => (
      <Activate
        activate={user.is_active}
        onClick={() => this.props.onClickActivate(user)}
      />
    ),
  };

  deleteColumn = {
    key: "delete",
    content: (user) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(user)}
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
    }
  }

  render() {
    const { users, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={users}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UsersTable;
