import React, { Component } from "react";
import SuperAdminDashboard from "./superAdminDashboard";
import AdminDashboard from "./adminDashboard";
import auth from "../services/authService";
import Bookings from "../components/bookings/bookings";

class Dashboard extends Component {
  _isMounted = false;
  state = {
    userData: [],
  };

  async componentDidMount() {
    this._isMounted = true;
    const user = auth.getCurrentUser();
    if (this._isMounted) {
      this.setState({ userData: user });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { userData } = this.state;

    return (
      <div>
        {userData.is_superuser && userData.is_staff ? (
          <SuperAdminDashboard />
        ) : userData.is_staff ? (
          <AdminDashboard />
        ) : (
          <Bookings />
        )}
      </div>
    );
  }
}

export default Dashboard;
