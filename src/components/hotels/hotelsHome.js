import React, { Fragment, useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import NewHotelForm from "../../components/hotels/newHotelForm";
import HotelSettingsForm from "./hotelSettingsForm";
import HotelPolicyForm from "./hotelPolicyForm";
import HotelFacilitiesForm from "../../components/hotels/hotelFacilitiesForm";

import Breadcrumb from "../common/breadcrumb";

const HotelsHome = () => {
  const [activeTab5, setActiveTab5] = useState("1");

  return (
    <Fragment>
      <Breadcrumb title="Manage Hotel" parent="Hotels" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-xl-8 xl-90">
            <div className="card">
              <div className="card-body">
                <Nav tabs className="nav-pills nav-primary">
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab5 === "1" ? "active" : ""}
                      onClick={() => setActiveTab5("1")}
                    >
                      General Information
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab5 === "2" ? "active" : ""}
                      onClick={() => setActiveTab5("2")}
                    >
                      Hotel Facilities
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab5 === "3" ? "active" : ""}
                      onClick={() => setActiveTab5("3")}
                    >
                      Hotel Policies
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab5}>
                  <TabPane tabId="1">
                    <NewHotelForm />
                  </TabPane>
                  <TabPane tabId="2">
                    <HotelFacilitiesForm />
                  </TabPane>
                  <TabPane tabId="3">
                    <HotelPolicyForm />{" "}
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-xl-4 xl-90">
            <div className="card-header">
              <h5>Manage Hotel Settings</h5>
            </div>
            <HotelSettingsForm />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HotelsHome;
