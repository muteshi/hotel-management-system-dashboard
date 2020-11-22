import React from "react";
import Joi from "joi-browser";
import Breadcrumb from "../common/breadcrumb";
import Form from "../common/form";
import {
  getBooking,
  saveBooking,
  getPaymentOptions,
  getBookingStatus,
} from "../../services/bookingService";
import { toast } from "react-toastify";
import Select from "react-select";

class BookingUpdateForm extends Form {
  state = {
    data: {
      guest_name: "N/A",
      package_name: "N/A",
      id: "",
      hotel_name: "N/A",
      payment_option: [],
      booking_status: [],
      deposit: "",
      special_requests: "",
      final_total: "",
    },
    errors: {},
    items: [],
    payment_options: [],
    booking_status: [],
  };
  schema = {
    guest_name: Joi.string(),
    package_name: Joi.string(),
    id: Joi.number(),
    hotel_name: Joi.string(),
    deposit: Joi.string(),
    special_requests: Joi.string(),
    final_total: Joi.string(),
    booking_status: Joi.object(),
    payment_option: Joi.object(),
  };

  async populateBooking() {
    try {
      const bookingId = this.props.match.params.bookingId;
      if (bookingId === "new-booking") return;
      const { data: booking } = await getBooking(bookingId);
      this.setState({ data: this.mapToViewModel(booking) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async populateBookingItems() {
    const bookingId = this.props.match.params.bookingId;
    const { data: items } = await getBooking(bookingId);
    this.setState({ items: items.items });
  }

  async loadPaymentOptions() {
    const { data: payment_options } = await getPaymentOptions();
    this.setState({ payment_options });
  }

  async loadBookingStatus() {
    const { data: booking_status } = await getBookingStatus();
    this.setState({ booking_status });
  }

  async componentDidMount() {
    await this.populateBooking();
    await this.populateBookingItems();
    await this.loadBookingStatus();
    await this.loadPaymentOptions();
  }

  mapToViewModel(booking) {
    const payment_option = {
      label: booking.payment_option_name,
      value: booking.payment_option,
    };
    const booking_status = {
      label: booking.booking_status_name,
      value: booking.booking_status,
    };
    const hotel_name = "N/A";
    const package_name = "N/A";
    return {
      id: booking.id,
      guest_name: booking.guest_name,
      package_name: !booking.package_name ? package_name : booking.package_name,
      hotel_name: !booking.hotel_name ? hotel_name : booking.hotel_name,
      deposit: booking.deposit,
      final_total: booking.final_total,
      booking_status: !booking_status.value ? "" : booking_status,
      payment_option: payment_option,
      special_requests: booking.special_requests,
    };
  }

  handlePaymentOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.payment_option = selectedOption;
    this.setState({ data });
  };

  handleBookingStatusSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.booking_status = selectedOption;
    this.setState({ data });
  };

  doSubmit = async () => {
    try {
      let data = this.state.data;
      const userData = {
        ...data,
        booking_status: data.booking_status.value,
        payment_option: data.payment_option.value,
      };
      await saveBooking(userData);
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/bookings`);
      toast.success("Booking updated successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    const { data, items, booking_status, payment_options } = this.state;

    let bookingStatusOptions = booking_status.map(function (booking) {
      return { value: booking.id, label: booking.name };
    });

    let paymentOptions = payment_options.map(function (pay) {
      return { value: pay.id, label: pay.name };
    });

    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    });

    let bookingItems = items.map((item) => {
      return (
        <tr key={item.id}>
          <th scope="row">
            {!item.room_Name ? item.hotel_name : item.room_Name}
          </th>
          <td>{item.qty}</td>
          <td>{item.total_guests}</td>
          <td>{item.stay_duration}</td>
          <td>{item.checkin}</td>
          <td>{item.checkout}</td>
          <td>{formatter.format(item.sub_total)}</td>
        </tr>
      );
    });

    return (
      <div>
        <div className="container">
          <Breadcrumb parent="Booking" title="Update booking" />

          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-9">
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput(
                      "guest_name",
                      "Guest name",
                      "Guest name",
                      "",
                      "disabled"
                    )}
                  </div>
                  <div className="col-sm-6">
                    {data.hotel_name === "N/A"
                      ? this.renderInput(
                          "package_name",
                          "Package name",
                          "Package name",
                          "",
                          "disabled"
                        )
                      : this.renderInput(
                          "hotel_name",
                          "Hotel name",
                          "Hotel name",
                          "",
                          "disabled"
                        )}
                  </div>
                </div>
                <h4>Items</h4>
                <table className="table table-responsive-sm">
                  <thead>
                    <tr>
                      <th scope="col">Item Name</th>
                      <th scope="col">Qty</th>
                      <th scope="col">Guests</th>
                      <th scope="col">Sleeps</th>
                      <th scope="col">Checkin</th>
                      <th scope="col">Checkout</th>
                      <th scope="col">Sub-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingItems}
                    <tr>
                      <th scope="row">Order total</th>
                      <td colSpan="5"></td>
                      <td>
                        <h5>{formatter.format(data.final_total)}</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput(
                      "deposit",
                      "Deposit amount",
                      "Deposit amount"
                    )}
                  </div>
                  <div className="col-sm-6">
                    {this.renderInput(
                      "final_total",
                      "Invoice total",
                      "Invoice total",
                      "",
                      "disabled"
                    )}
                  </div>
                </div>
                <br></br>
                <div className="row">
                  <div className="col-sm-6">
                    <small className="text-muted">Payment type</small>
                    <Select
                      className="mb-4"
                      value={data.payment_option}
                      searchable
                      name="form-field-name"
                      onChange={this.handlePaymentOptionSelectChange}
                      options={paymentOptions}
                      placeholder="Select payment type"
                    />
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Booking status</small>
                    <Select
                      className="mb-4"
                      value={data.booking_status}
                      searchable
                      name="form-field-name"
                      onChange={this.handleBookingStatusSelectChange}
                      options={bookingStatusOptions}
                      placeholder="Select booking status"
                    />
                  </div>
                </div>
                {this.renderTextArea(
                  "special_requests",
                  "",
                  "Enter any special requests here..",
                  "",
                  "disabled"
                )}
                {this.renderButton("Update booking")}
              </div>
              <div className="col-sm-1"></div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default BookingUpdateForm;
