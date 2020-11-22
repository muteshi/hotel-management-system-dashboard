import React, { Component } from "react";
import "../../assets/css/invoice.css";
import auth from "../../services/authService";
import { Redirect, Link } from "react-router-dom";
import logo from "../../assets/images/webguruslogo.png";
import { getBooking } from "../../services/bookingService";

class Invoice extends Component {
  state = {
    items: [],
    booking: [],
  };

  async populateBooking() {
    try {
      const bookingId = this.props.match.params.bookingId;
      const { data: booking } = await getBooking(bookingId);
      this.setState({ booking });
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

  async componentDidMount() {
    await this.populateBooking();
    await this.populateBookingItems();
  }

  render() {
    const { booking, items } = this.state;

    if (!auth.getCurrentUser())
      return <Redirect to={`${process.env.PUBLIC_URL}/login/`} />;

    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
    });

    let trItems = items.map((item) => {
      const guest_or_guests = item.total_guests > 1 ? " guests" : " guest";
      const room_or_rooms = item.qty > 1 ? " rooms" : " room";
      const night_or_nights = item.stay_duration > 1 ? " nights" : " night";
      const day_or_days = item.stay_duration > 1 ? " days" : " day";

      const conferenceRoomItemsDes = `${item.room_Name} (${item.total_guests}  ${guest_or_guests})`;
      const roomItemsDes = `${item.room_Name}${
        " -" + item.total_guests * item.qty + " max" + guest_or_guests
      }`;

      const packageItemsDes = `${item.hotel_name}${
        " -" + item.total_guests + guest_or_guests
      }`;

      const packageDetails = `${item.meal_plan}`;

      const conferenceRoomItems = `${item.stay_duration + day_or_days}${
        " x " +
        item.total_guests +
        guest_or_guests +
        " x " +
        formatter.format(item.room_Price)
      }`;

      const roomItems = `${item.qty + room_or_rooms}${
        " x " + item.stay_duration + night_or_nights
      }${" x " + formatter.format(item.room_Price)}`;

      const packageItems = `${formatter.format(item.package_Price)} pps`;
      return (
        <tr key={item.id}>
          <td className="col-4 border-0">
            {item.is_conference_room ? (
              conferenceRoomItemsDes
            ) : item.hotel_package ? (
              <p>
                {packageItemsDes} <br /> <strong>{packageDetails}</strong>
              </p>
            ) : (
              roomItemsDes
            )}
          </td>
          <td className="col-6 text-right border-0">
            {item.is_conference_room
              ? conferenceRoomItems
              : item.hotel_package
              ? packageItems
              : roomItems}
          </td>
          <td className="col-2 text-right border-0">
            {formatter.format(item.sub_total)}
          </td>
        </tr>
      );
    });

    let rooms = items.map((item) => {
      return (
        <div className="row" key={item.id}>
          <div className="col-sm-4">
            {" "}
            <strong>Check In:</strong>
            <p>{item.checkin}</p>
          </div>
          <div className="col-sm-4">
            {" "}
            <strong>Check Out:</strong>
            <p>{item.checkout}</p>
          </div>
          <div className="col-sm-4">
            {" "}
            <strong>
              {item.is_conference_room ? null : item.qty} {item.room_Name}
            </strong>
          </div>
        </div>
      );
    });

    return (
      <div className="page-wrapper">
        <body-invoice>
          <div className="container-fluid invoice-container">
            <header>
              <div className="row align-items-center">
                <div className="col-sm-7 text-sm-left mb-3 mb-sm-0">
                  {" "}
                  <img
                    id="logo"
                    src={logo}
                    title="WebGurus"
                    alt="WebGurus"
                  />{" "}
                </div>
                <div className="col-sm-5 text-sm-right">
                  <h4 className="mb-0">Invoice</h4>
                  <p className="mb-0">
                    Invoice Number - {booking.invoice_number}
                  </p>
                </div>
              </div>
              <hr />
            </header>

            <main>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  {" "}
                  <strong>Guest Name:</strong>{" "}
                  <span> {booking.guest_name} </span>{" "}
                </div>
                <div className="col-sm-6 mb-3 text-sm-right">
                  {" "}
                  <strong>Booking Date:</strong>{" "}
                  <span>{booking.created_at}</span>{" "}
                </div>
              </div>
              <hr className="mt-0" />
              <div className="row">
                {booking.hotel_name && (
                  <div className="col-sm-5">
                    <strong>Hotel Details:</strong>
                    <address>
                      {booking.hotel_name}
                      <br />
                      {booking.address}
                      <br />
                      {booking.city},{booking.country}.
                      <br />
                    </address>
                  </div>
                )}
                {booking.package_name && (
                  <div className="col-sm-5">
                    <strong>Package Details:</strong>
                    <address>
                      {booking.package_name}
                      <br />
                      {booking.address}
                      <br />
                      {booking.city},{booking.country}.
                      <br />
                    </address>
                  </div>
                )}
                <div className="col-sm-7">{rooms}</div>
              </div>
              <div className="card-invoice">
                <div className="card-header-invoice py-0">
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <td className="col-6 border-0">
                          <strong>Description</strong>
                        </td>
                        <td className="col-4 text-right border-0">
                          <strong>Rate</strong>
                        </td>
                        <td className="col-2 text-right border-0">
                          <strong>Amount</strong>
                        </td>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        {trItems}

                        <tr>
                          <td colSpan="2" className="bg-light-2 text-right">
                            <strong>Sub Total:</strong>
                          </td>
                          <td className="bg-light-2 text-right">
                            {formatter.format(booking.final_total)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="bg-light-2 text-right">
                            <strong>Tax:</strong>
                          </td>
                          <td className="bg-light-2 text-right">
                            {booking.tax_total}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="2" className="bg-light-2 text-right">
                            <strong>Total:</strong>
                          </td>
                          <td className="bg-light-2 text-right">
                            {formatter.format(booking.final_total)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <br />

              {/* <p className="text-1 text-muted">
                Please Note: Amount payable is inclusive of central & state
                goods & services Tax act applicable slab rates. Please ask Hotel
                for invoice at the time of check-out.
              </p> */}
            </main>

            <footer className="text-center">
              <hr />
              <p>
                <br />
                Marvellous Ventures Ltd
                <br />
                1st Floor, Coffee Plaza, Off Haile Selassie Avenue, Nairobi
              </p>
              <hr />
              <p className="text-1">
                <strong>NOTE :</strong> This is computer generated receipt and
                does not require physical signature.
              </p>
              <div className="btn-group btn-group-sm d-print-none">
                <Link
                  to="#"
                  onClick={() => window.print()}
                  className="btn btn-light border text-black-50 shadow-none"
                >
                  <i className="fa fa-print"></i> Print
                </Link>
                <Link
                  to=""
                  className="btn btn-light border text-black-50 shadow-none"
                >
                  <i className="fa fa-download"></i> Download
                </Link>
              </div>
            </footer>
          </div>

          <div>
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <Link
                  to={`${process.env.PUBLIC_URL}/dashboard/bookings`}
                  className="btn btn-info-gradien"
                >
                  {" "}
                  BACK TO MY ACCOUNT
                </Link>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </body-invoice>
      </div>
    );
  }
}

export default Invoice;
