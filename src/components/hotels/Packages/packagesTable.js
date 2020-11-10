import React, { Component } from "react";
import Table from "../../common/table";
import { Link } from "react-router-dom";
import Activate from "../../common/activate";
import Featured from "../../common/featured";
import auth from "../../../services/authService";

class PackagesTable extends Component {
  columns = [
    {
      path: "name",
      label: "Package name",
      content: (pack) => (
        <Link to={`${process.env.PUBLIC_URL}/dashboard/packages/${pack.slug}`}>
          {pack.title}
        </Link>
      ),
    },
    { path: "city", label: "Location" },
    {
      key: "hotel",
      content: (pack) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/hotelpackages/${pack.slug}`}
          className="btn btn-primary btn-xs"
        >
          Hotels ({pack.hotel_count})
        </Link>
      ),
    },
    {
      key: "itinirery",
      content: (pack) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/package-itinirery/${pack.slug}`}
          className="btn btn-primary btn-xs"
        >
          Itinirery ({pack.itinirery_count})
        </Link>
      ),
    },
    {
      key: "gallery",
      content: (pack) => (
        <Link
          to={`${process.env.PUBLIC_URL}/dashboard/package/gallery/${pack.slug}`}
          className="btn btn-primary btn-xs"
        >
          Gallery ({pack.photo_count})
        </Link>
      ),
    },
  ];

  featuredColumn = {
    key: "featuredKey",
    label: "Featured",
    content: (pack) => (
      <Featured
        featured={pack.featured}
        onClick={() => this.props.onClickFeatured(pack)}
      />
    ),
  };

  isActiveColumn = {
    key: "activeKey",
    label: "Active",
    content: (pack) => (
      <Activate
        activate={pack.active}
        onClick={() => this.props.onClickActivate(pack)}
      />
    ),
  };

  deleteColumn = {
    key: "delete",
    content: (pack) => (
      <i
        className="fa fa-trash"
        onClick={() => this.props.onDelete(pack)}
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
    const { packages, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={packages}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default PackagesTable;
