import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { addDays } from "date-fns";
import {
  saveBooking,
  getPaymentOptions,
  getBookingSettings,
} from "../../services/bookingService";
import { Link } from "react-router-dom";
import { getHotels } from "../../services/hotelService";
import { getUsers } from "../../services/userService";
import { getRooms, getRoom } from "../../services/roomService";
import { toast } from "react-toastify";
import auth from "../../services/authService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import moment from "moment";
import Select from "react-select";
import _ from "lodash";
const newuserLink = `${process.env.PUBLIC_URL}/dashboard/account/new-user`;

const currentUser = auth.getCurrentUser() ? auth.getCurrentUser() : {};

const userOptions = [
  { value: "registered", label: "Registered" },
  {
    value: "create",
    label:
      currentUser.is_superuser | currentUser.is_staff ? (
        <Link to={newuserLink}>New customer</Link>
      ) : (
        ""
      ),
  },
];

class ApartmentBookingForm extends Form {
  state = {
    data: {
      checkin: "",
      checkout: "",
      room_Name: "",
      guest_name: "",
      email: "",
      name: "",
      hotel: "",
      payment_option: "",
      qty: "",
      room: "",
      user: "",
      total_guests: "",
      stay_duration: "",
      room_Price: 0,
      final_total: 0,
      sub_total: 0,
      tax_total: 0.0,
      special_requests: "N/A",
    },
    errors: {},
    registeredShow: false,
    apartments: [],
    items: [],
    rooms: [],
    settings: [],
    roomData: [],
    subTotals: [],
    users: [],
    payment_options: [],
    user: {},
  };
  schema = {
    checkin: Joi.date().label("Checkin"),
    checkout: Joi.date().label("Checkout"),
    payment_option: Joi.number(),
    room: Joi.number(),
    hotel: Joi.number(),
    user: Joi.number(),
    stay_duration: Joi.number(),
    total_guests: Joi.number(),
    special_requests: Joi.string().label("Special requests"),
    final_total: Joi.number().min(0).label("Booking total"),
    sub_total: Joi.number().min(0).label("Booking sub total"),
    tax_total: Joi.number().min(0).label("tax total"),
    qty: Joi.number(),
    room_Price: Joi.number(),
    room_Name: Joi.string(),
    guest_name: Joi.string(),
    name: Joi.string(),
    email: Joi.string(),
  };

  async populateApartments() {
    const { data: apartments } = await getHotels();
    this.setState({ apartments });
  }

  async populateSettings() {
    const { data: settings } = await getBookingSettings();
    this.setState({ settings });
  }

  async loadPaymentOptions() {
    const { data: payment_options } = await getPaymentOptions();
    this.setState({ payment_options });
  }

  async loadUser() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  async componentDidMount() {
    await this.populateSettings();
    await this.populateApartments();
    await this.loadPaymentOptions();
    await this.loadUser();
  }

  setStartDate = (date) => {
    let data = this.state.data;
    data.checkin = date;
    this.setState({
      data,
    });

    if (data.checkin && data.checkout) {
      data.stay_duration = Math.floor(
        (data.checkout - data.checkin) / (1000 * 60 * 60 * 24)
      );
      this.setState({
        data,
      });
    }
  };

  setEndDate = (date) => {
    let data = this.state.data;
    data.checkout = date;
    this.setState({
      data,
    });

    if (data.checkin && data.checkout) {
      data.stay_duration = Math.floor(
        (data.checkout - data.checkin) / (1000 * 60 * 60 * 24)
      );

      this.setState({
        data,
      });
    }
  };

  doSubmit = async () => {
    try {
      const invoice_total = _.sum(this.state.subTotals);
      const commission_total =
        (this.state.settings[0].commission / 100) * invoice_total;
      const apartmentBookingData = {
        ...this.state.data,
        items: this.state.items,
        final_total: invoice_total.toFixed(2),
        commission_total: commission_total.toFixed(2),
      };
      await saveBooking(apartmentBookingData);
      window.location = `${process.env.PUBLIC_URL}/dashboard/bookings`;
      toast.success("Booking submitted successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  handleApartmentSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.hotel = selectedOption.value;
    data.user = selectedOption.bookingOwner;
    data.room = [];
    data.qty = [];
    this.setState({ data });
    const { data: rooms } = await getRooms(selectedOption.value);
    this.setState({ rooms });
  };

  handleGuestSelectChange = (selectedOption) => {
    let data = this.state.data;

    data.guest_name = selectedOption.label;
    data.email = selectedOption.email;

    this.setState({ data });
  };

  handlePaymentOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.payment_option = selectedOption.value;
    this.setState({ data });
  };

  handleRoomsSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.room = selectedOption;
    data.name = selectedOption.label;
    data.qty = [];

    this.setState({ data });
    const { data: roomData } = await getRoom(selectedOption.value);
    this.setState({ roomData });
    this.setState({ data });
  };

  handleRoomsQtySelectChange = (selectedOption) => {
    let data = this.state.data;

    data.qty = selectedOption;
    this.setState({ data });
    data.sub_total =
      data.qty.value * this.state.roomData.room_Price * data.stay_duration;
    data.total_guests = this.state.roomData.max_adults * selectedOption.value;
    this.setState({ data });
  };

  handleGuestsTotalSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.total_guests = selectedOption;
    this.setState({ data });
    data.sub_total =
      this.state.roomData.room_Price *
      data.stay_duration *
      data.total_guests.value;
    this.setState({ data });
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
    const data = this.state.data;
    const itemsData = this.state.items;
    const sub_totals = this.state.subTotals;
    const roomDetails = {
      rooms: data.room.value,
      user: data.user,
      name: data.name,
      room_Name: this.state.roomData.room_Name,
      room_Price: this.state.roomData.room_Price,
      id: this.state.roomData.id,
      qty: data.qty.value,
      checkin: moment(data.checkin).format("YYYY-MM-DD"),
      checkout: moment(data.checkout).format("YYYY-MM-DD"),
      sub_total: data.sub_total,
      tax_total: data.tax_total,
      stay_duration: data.stay_duration,
      total_guests: data.total_guests.value,
    };
    sub_totals.push(data.sub_total);
    itemsData.push(roomDetails);
    data.room = 0;
    data.qty = 0;
    data.room_Name = "N/A";
    data.name = "N/A";
    data.checkin = new Date();
    data.checkout = new Date(tomorrow.setDate(new Date().getDate() + 1));
    data.final_total = 0;
    data.sub_total = 0;
    data.tax_total = 0;
    data.total_guests = 0;
    this.setState({ data, items: itemsData, subTotals: sub_totals });
    data.stay_duration = 1;
    this.setState({ data });
  };

  validateAddRoomButton = () => {
    const itemsData = this.state.data;
    if (itemsData.sub_total !== 0) {
      return false;
    } else {
      return true;
    }
  };

  toggleChange = () => {
    let data = this.state.data;
    data.has_conference = !data.has_conference;
    this.setState({ data });
  };

  handleDelete = (item) => {
    const originalItems = this.state.items;
    const items = originalItems.filter((i) => i.id !== item.id);
    this.setState({ items });
    let sub_totals = items.map((num) => num.sub_total);
    this.setState({ subTotals: sub_totals });
  };

  render() {
    const {
      registeredShow,
      roomData,
      subTotals,
      payment_options,
      items,
      users,
      apartments,
      rooms,
      data,
    } = this.state;

    let roomQtyOptions = _.range(0, roomData.total_Rooms + 1).map(function (
      num
    ) {
      const roomPrice = roomData.room_Price * num;
      const roomPriceShow = `${num}${"  "}${"("}${"KES "}${roomPrice}${")"}`;

      return {
        value: num,
        label: `${roomPrice === 0 ? 0 : roomPriceShow}`,
      };
    });

    let usersOptions = users.map(function (user) {
      return {
        value: currentUser.user_id,
        label: user.name,
        email: user.email,
      };
    });

    let apartmentOptions = apartments
      .filter((apartment) => {
        return apartment.is_apartment;
      })
      .map((apartment) => {
        return {
          value: apartment.id,
          label: apartment.name,
          bookingOwner: apartment.contact_person,
        };
      });

    let paymentOptions = payment_options.map(function (pay) {
      return { value: pay.id, label: pay.name };
    });

    let roomOptions = rooms.map(function (room) {
      return {
        value: room.id,
        label: `${room.room_Name}${"  "}${"("}${
          room.max_adults
        }${" max guest/s)"}`,
      };
    });

    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    });

    let bookingSummary = items.map((item, index) => {
      const bookingItemDes = `${item.qty} room(s) X ${
        item.stay_duration
      } X night(s) X ${formatter.format(item.room_Price)} per day`;
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
              {item.room_Name}
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
              <form onSubmit={this.handleSubmit} style={{ marginTop: -10 }}>
                <div className="row">
                  <div className="col">
                    <small className="text-muted">Customer</small>
                    <Select
                      className="mb-3"
                      name="form-field-name"
                      onChange={this.handleUsersSelectChange}
                      options={userOptions}
                      placeholder="Select user"
                    />
                  </div>

                  <div className="container">
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
                      todayButton="Today"
                      selected={data.checkout}
                      onChange={this.setEndDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Check-out"
                      minDate={
                        data.checkin === ""
                          ? new Date()
                          : addDays(data.checkin, 1)
                      }
                    />
                  </div>
                </div>

                <Select
                  isSearchable
                  name="form-field-name"
                  className="mb-3"
                  onChange={this.handleApartmentSelectChange}
                  options={apartmentOptions}
                  placeholder="Select apartment"
                />

                <div className="row" style={{ marginTop: 22 }}>
                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Choose room type</small>
                    <Select
                      className="mb-3"
                      value={data.room}
                      name="form-field-name"
                      onChange={this.handleRoomsSelectChange}
                      options={roomOptions}
                      placeholder="Select room"
                    />
                  </div>

                  <div className="col-sm-6 col-md-6">
                    <small className="text-muted">Choose number of rooms</small>
                    <Select
                      value={data.qty}
                      className="mb-3"
                      name="form-field-name"
                      onChange={this.handleRoomsQtySelectChange}
                      options={roomQtyOptions}
                      placeholder="Room quantity"
                    />
                  </div>
                </div>
                <div className="row" style={{ marginTop: 5 }}>
                  <div className="col-sm-6 col-md-6">
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => this.roomAddhandler()}
                      disabled={this.validateAddRoomButton()}
                    >
                      Add room
                    </button>
                    <br />
                    {data.sub_total !== 0 ? (
                      <small className="text-muted">
                        Click to add apartment. You can add more than one
                        apartment
                      </small>
                    ) : null}
                  </div>
                  <div className="col-sm-4 col-md-4"></div>

                  <div className="col-sm-2 col-md-2"></div>
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

export default ApartmentBookingForm;
