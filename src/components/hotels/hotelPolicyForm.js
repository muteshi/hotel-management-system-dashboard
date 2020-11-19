import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { withRouter } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class HotelPolicyForm extends Form {
  state = {
    data: {
      checkin: "",
      checkout: "",
      policies: "",
    },
    errors: {},
  };
  schema = {
    checkin: Joi.date().label("Checkin Time"),
    checkout: Joi.date().label("Checkout Time"),
    policies: Joi.string().required().label("Policies"),
  };

  setCheckin = (time) => {
    let data = this.state.data;
    data.checkin = time;
    this.setState({
      data,
    });
  };

  setCheckout = (time) => {
    let data = this.state.data;
    data.checkout = time;
    this.setState({
      data,
    });
  };

  componentDidMount() {
    const hotelSlug = this.props.match.params.slug;
    if (hotelSlug === "new-hotel") return;
    this.props.loadHotel(hotelSlug);
  }

  componentDidUpdate(prevProps) {
    // check if hotel to be updated is populated in state
    if (prevProps.hotel !== this.props.hotel) {
      this.setState({
        data: this.mapToViewModel(this.props.hotel),
      });
    }
  }

  mapToViewModel(hotel) {
    const fullDate = new Date();
    const d = moment(fullDate).format("MM/DD/YYYY"); //date
    //combine date with time
    const check_in = new Date(d + " " + hotel.checkin);
    const check_out = new Date(d + " " + hotel.checkout);
    return {
      checkin: hotel.checkin ? new Date(check_in) : new Date(),
      checkout: hotel.checkout ? new Date(check_out) : new Date(),
      policies: hotel.policies ? hotel.policies : "",
    };
  }

  doSubmit = () => {
    const hotelSlug = this.props.match.params.slug;
    const hotelData = {
      ...this.state.data,
      checkin: moment(this.state.data.checkin).format("HH:mm:ss"),
      checkout: moment(this.state.data.checkout).format("HH:mm:ss"),
    };
    this.props.onEditHotel(hotelData, hotelSlug);
  };

  render() {
    return (
      <div>
        <div className="jumbotron">
          <form onSubmit={this.handleSubmit}>
            {this.renderTextArea("policies", "Hotel Policies")}
            <div className="row">
              <div
                className="form-group"
                style={{ marginTop: 28, marginLeft: 12 }}
              >
                <small className="text-muted">Official checkin time</small>
                <DatePicker
                  className="form-control digits"
                  selected={this.state.data.checkin}
                  onChange={this.setCheckin}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  timeFormat="HH:mm:ss"
                  dateFormat="HH:mm:ss aa"
                  placeholderText="Checkin time"
                />
              </div>
            </div>
            <div className="row">
              <div
                className="form-group"
                style={{ marginTop: 28, marginLeft: 12, marginBottom: 30 }}
              >
                <small className="text-muted">Official checkout time</small>
                <DatePicker
                  className="form-control digits"
                  selected={this.state.data.checkout}
                  onChange={this.setCheckout}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Time"
                  timeFormat="HH:mm:ss"
                  dateFormat="HH:mm:ss aa"
                  placeholderText="Checkin out"
                />
              </div>
            </div>

            {this.props.match.params.slug === "new-hotel"
              ? this.renderButton("Save Hotel")
              : this.renderButton("Update Hotel")}
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  hotel: state.apiData.hotel,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadHotel: (slug) => dispatch(actions.getHotel(slug)),
    onEditHotel: (hotelData, slug) =>
      dispatch(actions.editHotel(hotelData, slug)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HotelPolicyForm));
