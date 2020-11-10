import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getItinirerys,
  deleteItinirery,
} from "../../../../services/itinireryService";
import auth from "../../../../services/authService";
import { getPackage } from "../../../../services/packageService";
import SearchBox from "../../../common/searchBox";
import ItinireryTable from "../../../../components/hotels/Packages/itinirery/itinireryTable";
import Pagination from "../../../common/pagination";
import { paginate } from "../../../../utils/paginate";
import _ from "lodash";
const newItinireryCreateLink = `${process.env.PUBLIC_URL}/dashboard/itinirery/new-itinirery`;

class Itinirery extends Component {
  _isMounted = false;
  state = {
    itinirerys: [],
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
      const { data: itinirerys } = await getItinirerys(
        this.state.packageData.id
      );
      const user = auth.getCurrentUser();
      if (this._isMounted) {
        this.setState({ itinirerys, user });
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

  handleDelete = async (itinirery) => {
    const originalItinirerys = this.state.itinirerys;
    const itinirerys = originalItinirerys.filter((i) => i.id !== itinirery.id);
    this.setState({ itinirerys });
    try {
      await deleteItinirery(itinirery.id);
      toast.error("Itinirery  successfully deleted");
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/packages`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This Hotel itinirery has already been deleted");

      this.setState({ itinirerys: originalItinirerys });
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
      itinirerys: allItinirerys,
    } = this.state;

    let filtered = allItinirerys;

    if (searchQuery)
      filtered = allItinirerys.filter((i) =>
        i.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const itinirerys = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: itinirerys };
  };

  render() {
    const { length: count } = this.state.itinirerys;
    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (count === 0)
      return (
        <p>
          There are no itinirery for this package yet.{" "}
          <Link to={newItinireryCreateLink}>Add Itinirery</Link>
        </p>
      );

    const { totalCount, data: itinirerys } = this.getPageData();

    return (
      <div className="row">
        <div className="col">
          {user && (
            <Link
              to={newItinireryCreateLink}
              className="btn btn-primary"
              style={{ marginBottom: 20, marginTop: 20 }}
            >
              New Itinirery
            </Link>
          )}
          <p>
            Showing {totalCount} itinirerys for{" "}
            <strong>{this.state.packageData.title}</strong>
          </p>
          <SearchBox
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />
          <ItinireryTable
            onSort={this.handleSort}
            itinirerys={itinirerys}
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

export default Itinirery;
