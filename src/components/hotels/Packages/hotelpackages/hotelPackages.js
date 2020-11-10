import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getHotelPackages,
  deleteHotelPackage,
} from "../../../../services/hotelPackageServices";
import auth from "../../../../services/authService";
import { getPackage } from "../../../../services/packageService";
import SearchBox from "../../../common/searchBox";
import HOtelPackagesTable from "../../../../components/hotels/Packages/hotelpackages/hotelPackagesTable";
import Pagination from "../../../common/pagination";
import { paginate } from "../../../../utils/paginate";
import _ from "lodash";
const newHotelPackageCreateLink = `${process.env.PUBLIC_URL}/dashboard/hotel-packages/new-hotelpackage`;

class HotelPackages extends Component {
  _isMounted = false;
  state = {
    hotelPackages: [],
    packageData: [],
    pageSize: 4,
    searchQuery: "",
    currentPage: 1,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    const packageSlug = this.props.match.params.slug;
    const { data: packageData } = await getPackage(packageSlug);
    this.setState({ packageData });
    try {
      const { data: hotelPackages } = await getHotelPackages(
        this.state.packageData.id
      );
      const user = auth.getCurrentUser();
      if (this._isMounted) {
        this.setState({ hotelPackages, user });
      }
    } catch (error) {
      console.log(error);
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleDelete = async (hotelPackage) => {
    const originalHotelPackages = this.state.hotelPackages;
    const hotelPackages = originalHotelPackages.filter(
      (p) => p.id !== hotelPackage.id
    );
    this.setState({ hotelPackages });
    try {
      await deleteHotelPackage(hotelPackage.id);
      toast.error("Hotel successfully deleted");
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/packages`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This Hotel Package has already been deleted");

      this.setState({ packages: originalHotelPackages });
    }
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      selectedPackageType: null,
    });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      hotelPackages: allHotelPackages,
    } = this.state;

    let filtered = allHotelPackages;

    if (searchQuery)
      filtered = allHotelPackages.filter((p) =>
        p.hotel_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const hotelPackages = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: hotelPackages };
  };

  render() {
    const { length: count } = this.state.hotelPackages;
    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (count === 0)
      return (
        <p>
          There are no hotel for this package yet.{" "}
          <Link to={newHotelPackageCreateLink}>Add a hotel</Link>
        </p>
      );

    const { totalCount, data: hotelPackages } = this.getPageData();

    return (
      <div className="row">
        <div className="col">
          {user && (
            <Link
              to={newHotelPackageCreateLink}
              className="btn btn-primary"
              style={{ marginBottom: 20, marginTop: 20 }}
            >
              Hotel Package
            </Link>
          )}
          <p>
            Showing {totalCount} hotel packages for{" "}
            <strong>{this.state.packageData.title}</strong>
          </p>
          <SearchBox
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />
          <HOtelPackagesTable
            onSort={this.handleSort}
            hotelPackages={hotelPackages}
            onDelete={this.handleDelete}
            sortColumn={sortColumn}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default HotelPackages;
