import React, { Component } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  getUsers,
  deleteUser,
  partialUserUpdate,
} from "../../services/userService";
import { getUserTypes } from "../../services/userService";
import auth from "../../services/authService";
import SearchBox from "../common/searchBox";
import ListGroup from "../common/listGroup";
import UsersTable from "../../components/users/usersTable";
import Pagination from "../common/pagination";
import { paginate } from "../../utils/paginate";
import _ from "lodash";
const newUserCreateLink = `${process.env.PUBLIC_URL}/account/new-user`;

class Users extends Component {
  _isMounted = false;
  state = {
    users: [],
    user_types: [],
    pageSize: 4,
    searchQuery: "",
    currentPage: 1,
    selectedUserType: null,
    sortColumn: { path: "title", order: "order" },
  };

  async componentDidMount() {
    this._isMounted = true;
    document.title = "Marvellous Ventures users";
    const { data } = await getUserTypes();
    const user_types = [{ id: "", name: "All users" }, ...data];
    const { data: users } = await getUsers();
    const user = auth.getCurrentUser();
    if (this._isMounted) {
      this.setState({ users, user, user_types });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleUserTypeSelect = (user_type) => {
    this.setState({
      selectedUserType: user_type,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleActivate = async (user) => {
    const users = [...this.state.users];
    const index = users.indexOf(user);
    users[index] = { ...users[index] };
    users[index].is_active = !users[index].is_active;
    this.setState({ users });
    try {
      await partialUserUpdate(user.id, {
        is_active: users[index].is_active,
        from_api: true,
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  handleDelete = async (user) => {
    const originalUsers = this.state.users;
    const users = originalUsers.filter((u) => u.id !== user.id);
    this.setState({ users });
    try {
      await deleteUser(user.id);
      toast.error("User successfully deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This User has already been deleted");

      this.setState({ users: originalUsers });
    }
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
      currentPage: 1,
      selectedUserType: null,
    });
  };

  getPageData = () => {
    const {
      pageSize,
      sortColumn,
      currentPage,
      searchQuery,
      selectedUserType,
      users: allUsers,
    } = this.state;

    let filtered = allUsers;

    if (searchQuery)
      filtered = allUsers.filter((u) =>
        u.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedUserType && selectedUserType.id)
      filtered = allUsers.filter((u) => u.user_type_id === selectedUserType.id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const {
      pageSize,
      sortColumn,
      currentPage,
      user,
      user_types,
      selectedUserType,
    } = this.state;
    if (count === 0)
      return (
        <p>
          There are no users in the system.{" "}
          <Link to={newUserCreateLink}>Create user</Link>
        </p>
      );

    const { totalCount, data: users } = this.getPageData();

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-3">
            <ListGroup
              items={user_types}
              selectedItem={selectedUserType}
              onItemSelect={this.handleUserTypeSelect}
            />
          </div>
          <div className="col-sm-9">
            {user && (
              <Link
                to={newUserCreateLink}
                className="btn btn-primary"
                style={{ marginBottom: 20, marginTop: 20 }}
              >
                New User
              </Link>
            )}
            <p>Showing {totalCount} users in the system</p>
            <SearchBox
              value={this.state.searchQuery}
              onChange={this.handleSearch}
            />
            <UsersTable
              onClickActivate={this.handleActivate}
              onSort={this.handleSort}
              users={users}
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

export default Users;
