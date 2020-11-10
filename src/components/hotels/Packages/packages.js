import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getPackages,
  deletePackage,
  partialPackageUpdate,
} from "../../../services/packageService";
import { getPackageTypes } from "../../../services/packageTypeService";
import auth from "../../../services/authService";
import SearchBox from "../../common/searchBox";
import ListGroup from "../../common/listGroup";
import PackagesTable from "../../../components/hotels/Packages/packagesTable";
import Pagination from "../../common/pagination";
import { paginate } from "../../../utils/paginate";
import _ from "lodash";
const newPackageCreateLink = `${process.env.PUBLIC_URL}/dashboard/packages/new-package`;

class Packages extends Component {
  _isMounted = false;
  state = {
    packages: [],
    package_types: [],
    pageSize: 4,
    searchQuery: "",
    currentPage: 1,
    selectedPackageType: null,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    try {
      const { data } = await getPackageTypes();
      const package_types = [{ id: "", name: "All Packages" }, ...data];
      const { data: packages } = await getPackages();
      const user = auth.getCurrentUser();
      if (this._isMounted) {
        this.setState({ packages, user, package_types });
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

  handlePackageTypeSelect = (package_type) => {
    this.setState({
      selectedPackageType: package_type,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleActivate = async (pack) => {
    const packages = [...this.state.packages];
    const index = packages.indexOf(pack);
    packages[index] = { ...packages[index] };
    packages[index].active = !packages[index].active;
    this.setState({ packages });
    try {
      await partialPackageUpdate(pack.slug, {
        active: pack[index].active,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  handleFeatured = async (pack) => {
    const packages = [...this.state.packages];
    const index = packages.indexOf(pack);
    packages[index] = { ...packages[index] };
    packages[index].featured = !packages[index].featured;
    this.setState({ packages });
    try {
      await partialPackageUpdate(pack.slug, {
        featured: packages[index].featured,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  handleDelete = async (pack) => {
    const originalPackages = this.state.packages;
    const packages = originalPackages.filter((p) => p.slug !== pack.slug);
    this.setState({ packages });
    try {
      await deletePackage(pack.slug);
      toast.error("Package successfully deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This Package has already been deleted");

      this.setState({ packages: originalPackages });
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
      selectedPackageType,
      packages: allPackages,
    } = this.state;

    let filtered = allPackages;

    if (searchQuery)
      filtered = allPackages.filter((p) =>
        p.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedPackageType && selectedPackageType.id)
      filtered = allPackages.filter(
        (p) => p.package_type_id === selectedPackageType.id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const packages = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: packages };
  };

  render() {
    const { length: count } = this.state.packages;
    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (count === 0)
      return (
        <p>
          There are no packages in the database.{" "}
          <Link to={newPackageCreateLink}>Create Package</Link>
        </p>
      );

    const { totalCount, data: packages } = this.getPageData();

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <ListGroup
              items={this.state.package_types}
              selectedItem={this.state.selectedPackageType}
              onItemSelect={this.handlePackageTypeSelect}
            />
          </div>
          <div className="col-sm-9">
            {user && (
              <Link
                to={newPackageCreateLink}
                className="btn btn-primary"
                style={{ marginBottom: 20, marginTop: 20 }}
              >
                New Package
              </Link>
            )}
            <p>Showing {totalCount} packages in the database</p>
            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
            <PackagesTable
              onClickActivate={this.handleActivate}
              onClickFeatured={this.handleFeatured}
              onClickGallery={this.handleGallery}
              onSort={this.handleSort}
              packages={packages}
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
      </div>
    );
  }
}

export default Packages;
