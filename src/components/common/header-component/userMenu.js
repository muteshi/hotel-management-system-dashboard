import React, { Component, Fragment } from "react";
import sixteen from "../../../assets/images/user/16.png";
import { User, Mail, Lock, Settings, LogOut } from "react-feather";
import auth from "../../../services/authService";
import { Link } from "react-router-dom";
const user = auth.getCurrentUser() ? auth.getCurrentUser() : {};

class UserMenu extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }
  async handleLogout() {
    await auth.logout();
  }

  render() {
    return (
      <Fragment>
        <li className="onhover-dropdown">
          <div className="media align-items-center">
            <img className="img-80 rounded-circle" src={sixteen} alt="#" />
            <div className="dotted-animation">
              <span className="animate-circle"></span>
              <span className="main-circle"></span>
            </div>
          </div>
          <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
            <li>
              <Link to={`${process.env.PUBLIC_URL}/users/${user.user_id}`}>
                <User />
                Edit Profile
              </Link>
            </li>
            <li>
              <a href="#javascript">
                <Mail />
                Inbox
              </a>
            </li>
            <li>
              <a href="#javascript">
                <Lock />
                Lock Screen
              </a>
            </li>
            <li>
              <a href="#javascript">
                <Settings />
                Settings
              </a>
            </li>
            <li>
              <Link to="#" onClick={this.handleLogout}>
                <LogOut />
                Log out
              </Link>
            </li>
          </ul>
        </li>
      </Fragment>
    );
  }
}

export default UserMenu;
