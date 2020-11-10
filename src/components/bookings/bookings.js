import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getBookings,
  deleteBooking,
  getBookingStatus,
} from "../../services/bookingService";
import auth from "../../services/authService";
import SearchBox from "../common/searchBox";
import ListGroup from "../common/listGroup";
import BookingsTable from "../../components/bookings/bookingsTable";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import { pageSize } from "../../config.json";
import _ from "lodash";

class Bookings extends Component {
  _isMounted = false;
  state = {
    bookings: [],
    bookingStatus: [],
    pageSize,
    searchQuery: "",
    currentPage: 1,
    selectedBookingStatus: null,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    document.title = "Marvellous Ventures bookings";
    const { data } = await getBookingStatus();
    const bookingStatus = [{ id: "", name: "All Bookings" }, ...data];
    const { data: bookings } = await getBookings();
    const user = auth.getCurrentUser();
    if (this._isMounted) {
      this.setState({ bookings, user, bookingStatus });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleBookingStatusSelect = (b_status) => {
    this.setState({
      selectedBookingStatus: b_status,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleDelete = async (order) => {
    const originalBookings = this.state.bookings;
    const bookings = originalBookings.filter((b) => b.id !== order.id);
    this.setState({ bookings });
    try {
      await deleteBooking(order.id);
      toast.error("Booking successfully deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This booking has already been deleted");

      this.setState({ booking: originalBookings });
    }
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      selectedBookingStatus: null,
    });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      selectedBookingStatus,
      bookings: allBookings,
    } = this.state;

    let filtered = allBookings;

    if (searchQuery)
      filtered = allBookings.filter((b) =>
        b.guest_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedBookingStatus && selectedBookingStatus.id)
      filtered = allBookings.filter(
        (b) => b.booking_status_id === selectedBookingStatus.id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const bookings = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: bookings };
  };

  render() {
    const { length: count } = this.state.bookings;
    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (count === 0)
      return (
        <p>
          There are no booking yet.{" "}
          <Link to={`${process.env.PUBLIC_URL}/bookings/new-booking`}>
            Create booking
          </Link>
        </p>
      );

    const { totalCount, data: bookings } = this.getPageData();

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <ListGroup
              items={this.state.bookingStatus}
              selectedItem={this.state.selectedBookingStatus}
              onItemSelect={this.handleBookingStatusSelect}
            />
          </div>
          <div className="col-sm-9">
            {user && (
              <Link
                to={`${process.env.PUBLIC_URL}/bookings/new-booking`}
                className="btn btn-primary"
                style={{ marginBottom: 20, marginTop: 20 }}
              >
                New Booking
              </Link>
            )}
            <p>Showing {totalCount} bookings in the database</p>
            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
            <BookingsTable
              onSort={this.handleSort}
              bookings={bookings}
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

export default Bookings;
