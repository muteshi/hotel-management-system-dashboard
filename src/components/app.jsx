import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import auth from "../services/authService";
import Header from "./common/header-component/header";
import Sidebar from "./common/sidebar-component/sidebar";
import RightSidebar from "./common/right-sidebar";
import Footer from "./common/footer";
// import ThemeCustomizer from "./common/theme-customizer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./common/loader";

class AppLayout extends Component {
  render() {
    return (
      <div>
        <Loader />

        <div className="page-wrapper">
          <div className="page-body-wrapper">
            <Header />
            <Sidebar />
            <RightSidebar />
            <div className="page-body">{this.props.children}</div>
            <Footer />
            {/* <ThemeCustomizer /> */}
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }
}

export default AppLayout;
