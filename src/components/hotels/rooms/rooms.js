import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getRooms, deleteRoom } from "../../../services/roomService";
import { getHotel } from "../../../services/hotelService";
import auth from "../../../services/authService";
import SearchBox from "../../common/searchBox";
import RoomsTable from "../../../components/hotels/rooms/roomsTable";
import Pagination from "../../common/pagination";
import { paginate } from "../../../utils/paginate";
import _ from "lodash";
const newRoomCreateLink = `${process.env.PUBLIC_URL}/dashboard/home/hotel-rooms/new-room`;

class Rooms extends Component {
  _isMounted = false;
  state = {
    rooms: [],
    pageSize: 4,
    searchQuery: "",
    currentPage: 1,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    const hotelSlug = this.props.match.params.slug;
    const { data: hotel } = await getHotel(hotelSlug);
    const user = auth.getCurrentUser();

    if (this._isMounted) {
      this.setState({ user });
      this.setState({ hotel });
      const { data: rooms } = await getRooms(this.state.hotel.id);
      this.setState({ rooms });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleDelete = async (room) => {
    const originalRooms = this.state.rooms;
    const rooms = originalRooms.filter((r) => r.id !== room.id);
    this.setState({ rooms });
    try {
      await deleteRoom(room.id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This hotel has already been deleted");

      this.setState({ rooms: originalRooms });
    }
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
    });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      rooms: allRooms,
    } = this.state;

    let filtered = allRooms;

    if (searchQuery)
      filtered = allRooms.filter((r) =>
        r.room_Name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const rooms = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: rooms };
  };

  render() {
    const { length: count } = this.state.rooms;
    const { pageSize, sortColumn, currentPage } = this.state;
    const { user } = this.state;
    if (count === 0)
      return (
        <p>
          There are no rooms in the in this hotel.
          <Link to={newRoomCreateLink}>Create room</Link>{" "}
        </p>
      );

    const { totalCount, data: rooms } = this.getPageData();

    return (
      <div className="row">
        <div className="col">
          {user && (
            <Link
              to={newRoomCreateLink}
              className="btn btn-primary"
              style={{ marginBottom: 20, marginTop: 20 }}
            >
              New Room
            </Link>
          )}
          <p>Showing {totalCount} rooms in the database</p>
          <SearchBox
            value={this.state.searchQuery}
            onChange={this.handleSearch}
          />

          <RoomsTable
            onSort={this.handleSort}
            rooms={rooms}
            hotel={this.state.hotel}
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

export default Rooms;
