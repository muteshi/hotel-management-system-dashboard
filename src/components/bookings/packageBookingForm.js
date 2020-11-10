import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  saveBooking,
  getPaymentOptions,
  getBookingSettings,
} from "../../services/bookingService";
import { Link } from "react-router-dom";
import {
  getHotelPackages,
  getHotelPackage,
} from "../../services/hotelPackageServices";
import { getUsers } from "../../services/userService";
import { getPackages } from "../../services/packageService";
import { toast } from "react-toastify";
import auth from "../../services/authService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";
import Select from "react-select";
import _ from "lodash";

const currentUser = auth.getCurrentUser() ? auth.getCurrentUser() : {};

const userOptions = [
  { value: "registered", label: "Registered" },
  {
    value: "create",
    label:
      currentUser.is_superuser || currentUser.is_staff ? (
        <Link to={`${process.env.PUBLIC_URL}/dashboard/account/new-user`}>
          New customer
        </Link>
      ) : (
        ""
      ),
  },
];

class PackageBookingForm extends Form {
  state = {
    data: {
      checkin: "",
      checkout: "",
      name: "",
      guest_name: "",
      email: "",
      payment_option: "",
      qty: "",
      user: "",
      total_guests: "",
      packages: "",
      hotel_package: "",
      package_Price: 0,
      final_total: 0,
      sub_total: 0,
      tax_total: 0.0,
      special_requests: "N/A",
    },
    errors: {},
    registeredShow: false,
    isDisabled: false,
    hotelPackages: [],
    items: [],
    hotelPackageData: [],
    subTotals: [],
    users: [],
    packages: [],
    settings: [],
    payment_options: [],
    user: {},
  };
  schema = {
    checkin: Joi.date().label("Checkin"),
    checkout: Joi.date().label("Checkout"),
    payment_option: Joi.number(),
    packages: Joi.number(),
    hotel_package: Joi.object(),
    user: Joi.number(),
    total_guests: Joi.number(),
    special_requests: Joi.string().label("Special requests"),
    final_total: Joi.number().min(0).label("Booking total"),
    sub_total: Joi.number().min(0).label("Booking sub total"),
    tax_total: Joi.number().min(0).label("tax total"),
    qty: Joi.number(),
    package_Price: Joi.number(),
    name: Joi.string(),
    guest_name: Joi.string(),
    email: Joi.string(),
  };

  async loadPaymentOptions() {
    const { data: payment_options } = await getPaymentOptions();
    this.setState({ payment_options });
  }

  async loadPackages() {
    const { data: packages } = await getPackages();
    this.setState({ packages });
  }

  async populateSettings() {
    const { data: settings } = await getBookingSettings();
    this.setState({ settings });
  }

  async loadUser() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  async componentDidMount() {
    await this.loadPaymentOptions();
    await this.populateSettings();
    await this.loadPackages();
    await this.loadUser();
  }

  setStartDate = (date) => {
    let data = this.state.data;
    let hotelPackageData = this.state.hotelPackageData;
    data.checkin = date;
    this.setState({
      data,
    });

    if (hotelPackageData.length !== 0) {
      data.checkout = new Date(
        data.checkin.getTime() +
          Math.floor(hotelPackageData.duration * 1000 * 60 * 60 * 24)
      );

      this.setState({
        data,
      });
    }
  };

  doSubmit = async () => {
    const data = this.state.data;
    try {
      const invoice_total = _.sum(this.state.subTotals);
      const commission_total =
        (this.state.settings[0].commission / 100) * invoice_total;
      const packageBookingData = {
        ...this.state.data,
        special_requests:
          data.special_requests === "N/A" ? "" : data.special_requests,
        items: this.state.items,
        package: data.packages,
        final_total: invoice_total,
        commission_total,
      };
      await saveBooking(packageBookingData);
      window.location = `${process.env.PUBLIC_URL}/dashboard/bookings`;
      toast.success("Booking submitted successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  handlePackageSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.packages = selectedOption.value;
    data.hotel_package = [];
    data.qty = [];
    this.setState({ data });
    const { data: hotelPackages } = await getHotelPackages(
      selectedOption.value
    );
    this.setState({ hotelPackages });
  };

  handleGuestSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.guest_name = selectedOption.label;
    data.email = selectedOption.email;

    this.setState({ data });
  };

  handleQtySelectChange = (selectedOption) => {
    let data = this.state.data;
    data.qty = selectedOption;
    this.setState({ data });
    data.sub_total = data.qty.value * this.state.hotelPackageData.package_Price;
    this.setState({ data });
  };

  handlePaymentOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.payment_option = selectedOption.value;
    this.setState({ data });
  };

  handleHotelPackageSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.hotel_package = selectedOption;
    data.user = selectedOption.bookingOwner;
    data.name = selectedOption.label;
    this.setState({ data });
    const { data: hotelPackageData } = await getHotelPackage(
      selectedOption.value
    );
    this.setState({ hotelPackageData });
  };

  handleUsersSelectChange = async (selectedOption) => {
    if (selectedOption.value === "registered") {
      const { data: users } = await getUsers();
      this.setState({ users, registeredShow: true });
    }
    if (selectedOption.value === "create") {
      this.setState({ registeredShow: false });
    }
  };

  roomAddhandler = async () => {
    let tomorrow = new Date();
    const hotelPackageData = this.state.hotelPackageData;
    const data = this.state.data;
    const itemsData = this.state.items;
    const sub_totals = this.state.subTotals;
    const hotelPackageDetails = {
      hotel_package: data.hotel_package.value,
      user: data.user,
      name: data.name,
      stay_duration: hotelPackageData.duration,
      package_Price: hotelPackageData.package_Price,
      qty: data.qty.value,
      id: hotelPackageData.id,
      checkin: moment(data.checkin).format("YYYY-MM-DD"),
      checkout: moment(data.checkout).format("YYYY-MM-DD"),
      sub_total: data.sub_total,
      tax_total: data.tax_total,
      package_name: hotelPackageData.package_name,
      total_guests: data.qty.value,
    };
    sub_totals.push(data.sub_total);
    itemsData.push(hotelPackageDetails);

    data.qty = 0;
    data.name = "N/A";
    data.checkin = new Date();
    data.checkout = new Date(
      tomorrow.setDate(new Date().getDate() + hotelPackageData.duration)
    );

    data.final_total = 0;
    data.sub_total = 0;
    data.tax_total = 0;
    data.total_guests = 0;
    this.setState({ data, items: itemsData, subTotals: sub_totals });

    this.setState({ data, isDisabled: true });
  };

  validateAddRoomButton = () => {
    const itemsData = this.state.data;
    if (itemsData.sub_total !== 0) {
      return false;
    } else {
      return true;
    }
  };

  handleDelete = (item) => {
    const originalItems = this.state.items;
    const items = originalItems.filter((i) => i.id !== item.id);
    this.setState({ items });
    let sub_totals = items.map((num) => num.sub_total);
    this.setState({ subTotals: sub_totals });
  };

  toggleChange = () => {
    let data = this.state.data;
    data.has_conference = !data.has_conference;
    this.setState({ data });
  };

  render() {
    const {
      registeredShow,
      hotelPackageData,
      subTotals,
      payment_options,
      items,
      isDisabled,
      users,
      packages,
      hotelPackages,
      data,
    } = this.state;

    let qtyOptions = _.range(1, 11).map(function (num) {
      return { value: num, label: num };
    });

    let usersOptions = users.map(function (user) {
      return {
        value: currentUser.user_id,
        label: user.name,
        email: user.email,
      };
    });

    let packageOptions = packages.map(function (pack) {
      return { value: pack.id, label: pack.title };
    });

    let hotelPackageOptions = hotelPackages.map(function (pack) {
      return {
        value: pack.id,
        label: pack.hotel_name,
        bookingOwner: pack.hotel_user,
      };
    });

    let paymentOptions = payment_options.map(function (pay) {
      return { value: pay.id, label: pay.name };
    });

    const PackageDuration = `For ${hotelPackageData.duration} nights & ${
      hotelPackageData.duration + 1
    } days`;

    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    });

    let bookingSummary = items.map((item, index) => {
      const bookingItemDes = `for ${item.qty} in ${
        item.name
      } at ${formatter.format(item.package_Price)} per person sharing`;
      return (
        <li
          className="list-group-item d-flex justify-content-between lh-condensed"
          key={index}
        >
          <div>
            <h6 className="my-0">
              <i
                className="fa fa-trash"
                onClick={() => this.handleDelete(item)}
                style={{ color: "red", cursor: "pointer", fontSize: 14 }}
              ></i>
              {item.package_name}
            </h6>
            <small className="text-muted">{bookingItemDes}</small>
          </div>
          <span className="text-muted">{formatter.format(item.sub_total)}</span>
        </li>
      );
    });

    return (
      <div>
        <div className="row">
          {/* <div className="col-sm-1"></div> */}
          <div className="col-sm-8">
            <div className="jumbotron">
              <form onSubmit={this.handleSubmit} style={{ marginTop: -25 }}>
                <div className="row">
                  <div className="col-sm-6 col-md-6">
                    {isDisabled && (
                      <small className="text-muted">
                        You can only choose one package per booking
                      </small>
                    )}
                    <Select
                      isSearchable
                      name="form-field-name"
                      className="mb-3"
                      onChange={this.handlePackageSelectChange}
                      options={packageOptions}
                      isDisabled={isDisabled}
                      placeholder="Select package"
                    />
                  </div>
                  <div className="col-sm-6 col-md-6">
                    {isDisabled && (
                      <small className="text-muted">Select hotel</small>
                    )}
                    <Select
                      className="mb-3"
                      value={data.hotel_package}
                      name="form-field-name"
                      onChange={this.handleHotelPackageSelectChange}
                      options={hotelPackageOptions}
                      placeholder="Select hotel"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Customer</small>
                    <Select
                      className="mb-3"
                      name="form-field-name"
                      onChange={this.handleUsersSelectChange}
                      options={userOptions}
                      placeholder="Select user"
                    />
                  </div>
                  <div className="col-sm-6 col-md-6">
                    {registeredShow && (
                      <div>
                        <small className="text-muted">Select customer</small>
                        <Select
                          className="mb-3"
                          name="form-field-name"
                          onChange={this.handleGuestSelectChange}
                          options={usersOptions}
                          placeholder="Select user"
                        />
                      </div>
                    )}
                  </div>
                  <div
                    className="border borderLight"
                    style={{ marginBottom: 10, marginTop: 5 }}
                  ></div>
                </div>
                <div className="row" style={{ marginBottom: 20 }}>
                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Checkin date</small>
                    <DatePicker
                      className="form-control digits"
                      todayButton="Today"
                      selected={data.checkin}
                      onChange={this.setStartDate}
                      placeholderText="Check-in"
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()}
                    />
                  </div>

                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Checkout date</small>
                    <DatePicker
                      className="form-control digits"
                      selected={data.checkout}
                      onChange={this.setStartDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Check-out"
                      disabled
                    />
                    {data.checkin !== "" && hotelPackageData.length !== 0 ? (
                      <small className="text-muted">{PackageDuration}</small>
                    ) : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Choose adults</small>
                    <Select
                      value={data.qty}
                      className="mb-3"
                      name="form-field-name"
                      onChange={this.handleQtySelectChange}
                      options={qtyOptions}
                      placeholder="Guest quantity"
                    />
                  </div>
                </div>

                <div className="row" style={{ marginTop: 5 }}>
                  <div className="col-sm-4 col-md-4">
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => this.roomAddhandler()}
                      disabled={this.validateAddRoomButton()}
                    >
                      Add hotel
                    </button>
                  </div>
                  <div className="col-sm-4 col-md-4"></div>

                  <div className="col-sm-4 col-md-4"></div>
                </div>

                {this.renderTextArea(
                  "special_requests",
                  "",
                  "Enter any special requests here..",
                  "",
                  ""
                )}
                <small className="text-muted">Choose payment option</small>
                <Select
                  // value={data.payment_option}
                  className="mb-3"
                  name="form-field-name"
                  onChange={this.handlePaymentOptionSelectChange}
                  options={paymentOptions}
                  placeholder="Payment options"
                />
                {this.renderButton("Save Booking")}
              </form>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="row">
              <div className="col">
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Booking summary</span>
                  <span className="badge badge-secondary badge-pill">
                    {items.length}
                  </span>
                </h4>
                <hr className="mb-3" />
                <ul className="list-group mb-3">
                  {bookingSummary}
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Total (Ksh)</span>
                    <strong>{formatter.format(_.sum(subTotals))}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PackageBookingForm;
