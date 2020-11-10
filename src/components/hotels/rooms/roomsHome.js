import React, { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import NewRoomForm from "../../../components/hotels/rooms/newRoomForm";
import RoomSettingsForm from "./roomSettingsForm";
import RoomAmmenitiesForm from "../../../components/hotels/rooms/roomAmmenitiesForm";

import Breadcrumb from "../../common/breadcrumb";

const RoomsHome = () => {
  const [activeTab5, setActiveTab5] = useState("1");
  let history = useHistory();

  return (
    <Fragment>
      <Breadcrumb title="Manage Room" parent="Hotel" />
      <div className="container-fluid">
        <button
          onClick={() => history.goBack()}
          className="btn btn-primary"
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          Back to rooms
        </button>
        <div className="row">
          <div className="col-sm-12 col-xl-8 xl-90">
            <div className="card">
              <div className="card-body">
                <Nav tabs className="nav-pills nav-primary">
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink className={activeTab5 === "1" ? "active" : ""}>
                      General Room Information
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab5 === "2" ? "active" : ""}
                      onClick={() => setActiveTab5("2")}
                    >
                      Room Ammenities
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab5}>
                  <TabPane tabId="1">
                    <NewRoomForm />
                  </TabPane>
                  <TabPane tabId="2">
                    <RoomAmmenitiesForm />
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-xl-4 xl-90">
            <div className="card-header">
              <h5>Manage Room Settings</h5>
            </div>
            <RoomSettingsForm />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RoomsHome;
