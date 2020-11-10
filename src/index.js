import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ScrollContext } from "react-router-scroll-4";
import * as serviceWorker from "./serviceWorker";
import auth from "./services/authService";

import Dashboard from "./components/dashboard";

// Users
import LoginForm from "./components/users/loginForm";
import UserForm from "./components/users/userForm";
import UserUpdateForm from "./components/users/userUpdateForm";
import Users from "./components/users/users";

// Hotels
import NewHotelForm from "./components/hotels/newHotelForm";
import Hotels from "./components/hotels/hotels";
import HotelsHome from "./components/hotels/hotelsHome";

// Bookings
import BookingForm from "./components/bookings/bookingForm";
import BookingUpdateForm from "./components/bookings/bookingUpdate";
import Bookings from "./components/bookings/bookings";
import Invoice from "./components/bookings/invoice";

//Rooms

import NewRoomForm from "./components/hotels/rooms/newRoomForm";
import RoomsHome from "./components/hotels/rooms/roomsHome";
import Rooms from "./components/hotels/rooms/rooms";

//Packages

import NewPackageForm from "./components/hotels/Packages/newPackageForm";
import Packages from "./components/hotels/Packages/packages";

//Hotel Packages

import NewHotelPackageForm from "./components/hotels/Packages/hotelpackages/newHotelPackageForm";
import HotelPackages from "./components/hotels/Packages/hotelpackages/hotelPackages";

//itinirery

import ItinireryForm from "./components/hotels/Packages/itinirery/itinireryForm";
import Itinirery from "./components/hotels/Packages/itinirery/itinirery";

// ** Import custom components for redux**
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./components/app";

//Gallery
import Gallery from "./components/hotels/gallery/gallery";
import UploadImages from "./components/hotels/gallery/imagesUpload";
import RoomGallery from "./components/hotels/gallery/roomGallery";
import UploadRoomImages from "./components/hotels/gallery/roomUpload";
import PackageGallery from "./components/hotels/Packages/packageGallery";
import UploadPackageImages from "./components/hotels/Packages/packageImagesUpload";

class Root extends Component {
  render() {
    const user = auth.getCurrentUser();
    return (
      <div className="App">
        <BrowserRouter basename={`/`}>
          <ScrollContext>
            <Switch>
              <Route
                path={`${process.env.PUBLIC_URL}/login`}
                component={LoginForm}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/invoices/:bookingId`}
                component={Invoice}
              ></Route>
              {user ? (
                <Fragment>
                  <Provider store={store}>
                    <App>
                      {/* dashboard menu */}
                      <Route
                        exact
                        path={`${process.env.PUBLIC_URL}/dashboard`}
                        component={Dashboard}
                      />
                      {/* users */}

                      <Route
                        path={`${process.env.PUBLIC_URL}/users/:userId`}
                        component={UserUpdateForm}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/account/new-user`}
                        component={UserForm}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/users/`}
                        component={Users}
                        exact
                      ></Route>

                      {/* hotels */}
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/hotels`}
                        render={() => <Hotels />}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/home/hotels/:slug`}
                        component={HotelsHome}
                        exact
                      />
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/hotels/:slug`}
                        render={() => <NewHotelForm />}
                        exact
                      ></Route>
                      {/* Bookings */}
                      <Route
                        path={`${process.env.PUBLIC_URL}/bookings/new-booking`}
                        component={BookingForm}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/orders/:bookingId`}
                        component={BookingUpdateForm}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/bookings/`}
                        component={Bookings}
                        exact
                      ></Route>

                      {/* packages */}
                      {user.is_superuser && (
                        <div>
                          <Route
                            path={`${process.env.PUBLIC_URL}/dashboard/packages`}
                            component={Packages}
                            exact
                          />
                          <Route
                            path={`${process.env.PUBLIC_URL}/dashboard/packages/:slug`}
                            component={NewPackageForm}
                            exact
                          ></Route>
                          {/* hotel packages */}
                          <Route
                            path={`${process.env.PUBLIC_URL}/dashboard/hotelpackages/:slug`}
                            component={HotelPackages}
                            exact
                          />
                          <Route
                            path={`${process.env.PUBLIC_URL}/dashboard/hotel-packages/:hotelPackageId`}
                            component={NewHotelPackageForm}
                            exact
                          ></Route>
                          {/* hotel packages */}
                          <Route
                            path={`${process.env.PUBLIC_URL}/dashboard/package-itinirery/:slug`}
                            component={Itinirery}
                            exact
                          />
                        </div>
                      )}
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/itinirery/:itinireryId`}
                        component={ItinireryForm}
                        exact
                      ></Route>
                      {/* rooms */}
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/hotel-rooms/:roomId`}
                        component={NewRoomForm}
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/home/hotel-rooms/:roomId`}
                        component={RoomsHome}
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/rooms/:slug`}
                        component={Rooms}
                        exact
                      />
                      {/* Gallery */}
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/hotels/gallery/:slug`}
                        component={Gallery}
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/hotels/upload/:slug`}
                        component={UploadImages}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/package/gallery/:slug`}
                        component={PackageGallery}
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/package/upload/:slug`}
                        component={UploadPackageImages}
                        exact
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/rooms/gallery/:roomId`}
                        component={RoomGallery}
                      ></Route>
                      <Route
                        path={`${process.env.PUBLIC_URL}/dashboard/rooms/upload/:roomId`}
                        component={UploadRoomImages}
                        exact
                      ></Route>
                      {/* Pricing */}
                    </App>
                  </Provider>
                </Fragment>
              ) : (
                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
              )}
            </Switch>
          </ScrollContext>
        </BrowserRouter>
      </div>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById("root"));
export default Root;
serviceWorker.unregister();
