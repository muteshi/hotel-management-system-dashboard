import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../../services/authService";
import SearchBox from "../common/searchBox";
import ListGroup from "../common/listGroup";
import Loader from "../common/tablePlaceholder";
import HotelsTable from "../../components/hotels/hotelsTable";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import { pageSize } from "../../config.json";
import _ from "lodash";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
const newHotelCreateLink = `${process.env.PUBLIC_URL}/dashboard/home/hotels/new-hotel`;

class Hotels extends Component {
  _isMounted = false;
  state = {
    pageSize,
    searchQuery: "",
    currentPage: 1,
    selectedHotelType: null,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    this.props.loadHotels();
    this.props.loadHotelTypes();
    const user = auth.getCurrentUser();
    if (this._isMounted) {
      this.setState({ user });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleHotelTypeSelect = (hotel_type) => {
    this.setState({
      selectedHotelType: hotel_type,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      selectedHotelType: null,
    });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      selectedHotelType,
    } = this.state;

    let filtered = this.props.hotels;
    if (searchQuery)
      filtered = this.props.hotels.filter((h) =>
        h.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedHotelType && selectedHotelType.id)
      filtered = this.props.hotels.filter(
        (h) => h.hotel_type_id === selectedHotelType.id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const hotels = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: hotels };
  };

  render() {
    // const { length: count } = this.props.hotels;
    const { totalCount, data: hotels } = this.getPageData();
    const hotel_types = [
      { id: "", name: "All Hotels" },
      ...this.props.hotelTypes,
    ];

    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (totalCount === 0)
      return (
        <p>
          There are no hotels in the database.{" "}
          <Link to={newHotelCreateLink}>Create hotel</Link>
        </p>
      );
    const hotelsTable = (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <ListGroup
              items={hotel_types}
              selectedItem={this.state.selectedHotelType}
              onItemSelect={this.handleHotelTypeSelect}
            />
          </div>
          {
            <div className="col-sm-9">
              {user && (
                <Link
                  to={newHotelCreateLink}
                  className="btn btn-primary"
                  style={{ marginBottom: 20, marginTop: 20 }}
                >
                  New Hotel
                </Link>
              )}
              <p>Showing {totalCount} hotels in the database</p>
              <SearchBox
                value={this.state.searchQuery}
                onChange={this.handleSearch}
              />
              <HotelsTable
                onSort={this.handleSort}
                sortColumn={sortColumn}
                hotels={hotels}
                spinning={this.props.spinner}
                onClickActivate={this.props.onEnableOrDisable}
                clickFeatured={this.props.clickFeatured}
                clickDelete={this.props.onDelete}
              />

              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
            </div>
          }
        </div>
      </div>
    );
    return this.props.loading ? <Loader /> : hotelsTable;
  }
}
const mapStateToProps = (state) => ({
  hotels: state.apiData.hotels,
  hotelTypes: state.apiData.hotelTypes,
  spinner: state.apiData.spinning,
  loading: state.apiData.loading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadHotels: () => dispatch(actions.getHotels()),
    loadHotelTypes: () => dispatch(actions.getHotelTypes()),
    onEnableOrDisable: (hotel) => dispatch(actions.enableOrDisableHotel(hotel)),
    clickFeatured: (hotel) => dispatch(actions.featureOnOffHotel(hotel)),
    onDelete: (hotel, hotelId) => dispatch(actions.deleteHotel(hotel, hotelId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Hotels);
