import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { withRouter } from "react-router-dom";
import auth from "../../services/authService";
import DatePicker from "react-datepicker";
import moment from "moment";
import Select from "react-select";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";

class HotelSettingsForm extends Form {
  state = {
    data: {
      vat: "",
      hotel_type: [],
      has_conference: false,
      is_apartment: false,
      star_rating: "",
      featured_from: "",
      featured_to: "",
    },
    errors: {},
    user: {},
  };
  schema = {
    slug: Joi.string(),
    featured_from: Joi.date().label("Featured to"),
    featured_to: Joi.date().label("Featured from"),
    hotel_type: Joi.object(),
    has_conference: Joi.boolean(),
    is_apartment: Joi.boolean(),
    star_rating: Joi.number().min(1).max(5).label("Star Rating"),
    vat: Joi.number().min(1).max(100).label("VAT"),
  };

  loadUser() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  componentDidMount() {
    const hotelSlug = this.props.match.params.slug;
    if (hotelSlug === "new-hotel") return;
    this.props.loadHotel(hotelSlug);
    this.props.loadHotelTypes();
    this.loadUser();
  }

  componentDidUpdate(prevProps) {
    // check if hotel to be updated is populated in state
    if (prevProps.hotel !== this.props.hotel) {
      this.setState({
        data: this.mapToViewModel(this.props.hotel),
      });
    }
  }

  setStartDate = (date) => {
    let data = this.state.data;
    data.featured_from = date;
    this.setState({
      data,
    });
  };

  setEndDate = (date) => {
    let data = this.state.data;
    data.featured_to = date;
    this.setState({
      data,
    });
  };

  mapToViewModel(hotel) {
    const hotel_type = {
      label: hotel.hotel_type_name,
      value: hotel.hotel_type,
    };
    return {
      slug: hotel.slug,
      featured_from: new Date(hotel.featured_from),
      featured_to: new Date(hotel.featured_to),
      hotel_type: hotel.hotel_type ? hotel_type : "",
      has_conference: hotel.has_conference,
      star_rating: hotel.star_rating,
      vat: hotel.vat,
    };
  }

  doSubmit = () => {
    const hotelSlug = this.props.match.params.slug;
    const data = this.state.data;
    const hotelData = {
      ...data,
      featured_from: moment(data.featured_from).format("YYYY-MM-DD"),
      featured_to: moment(data.featured_to).format("YYYY-MM-DD"),
      hotel_type: data.hotel_type.value,
    };
    this.props.onEditHotel(hotelData, hotelSlug);
  };

  toggleChange = () => {
    let data = this.state.data;
    data.has_conference = !data.has_conference;
    this.setState({ data });
  };

  handleHotelTypesOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.hotel_type = selectedOption;
    this.setState({ data });
    if (data.hotel_type.label === "Apartment") {
      data.is_apartment = true;
      this.setState({ data });
    } else {
      data.is_apartment = false;
      this.setState({ data });
    }
  };

  render() {
    const { data } = this.state;

    let hotelTypesOptions = this.props.hotelTypes.map(function (hotel) {
      return { value: hotel.id, label: hotel.name };
    });
    return (
      <div>
        <div className="jumbotron">
          <form onSubmit={this.handleSubmit} style={{ marginTop: -45 }}>
            <small className="text-muted">Select property type</small>
            <Select
              value={data.hotel_type}
              className="mb-3"
              name="form-field-name"
              onChange={this.handleHotelTypesOptionSelectChange}
              options={hotelTypesOptions}
              placeholder="Property type"
            />

            {this.renderInput("star_rating", "Star rating(1-5)", "Star rating")}
            {this.renderInput("vat", "VAT(value added tax)", "VAT")}

            {this.state.user.is_superuser && (
              <div>
                <div className="form-group" style={{ marginTop: 28 }}>
                  <small className="text-muted">
                    Date from which hotel will be featured on frontpage
                  </small>
                  <DatePicker
                    className="form-control digits"
                    todayButton="Today"
                    selected={this.state.data.featured_from}
                    isClearable
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    onChange={this.setStartDate}
                    placeholderText="Featured from"
                    dateFormat="yyyy-MM-dd"
                    minDate={new Date()}
                  />
                </div>

                <div className="form-group" style={{ marginTop: 28 }}>
                  <small className="text-muted">
                    End date when the hotel stops being featured
                  </small>
                  <DatePicker
                    className="form-control digits"
                    isClearable
                    selected={this.state.data.featured_to}
                    onChange={this.setEndDate}
                    yearDropdownItemNumber={15}
                    scrollableYearDropdown
                    dateFormat="yyyy-MM-dd"
                    todayButton="Today"
                    placeholderText="Featured to"
                    minDate={
                      this.state.data.featured_from === ""
                        ? new Date()
                        : this.state.data.featured_from
                    }
                  />
                </div>
              </div>
            )}

            {!(data.hotel_type.label === "Apartment") && (
              <div className="form-group">
                <label className="containerBox">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={this.state.data.has_conference}
                    onChange={this.toggleChange}
                  />
                  <span className="checkmark"></span>
                  Conferencing
                </label>
              </div>
            )}

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
  hotelTypes: state.apiData.hotelTypes,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadHotel: (slug) => dispatch(actions.getHotel(slug)),
    loadHotelTypes: () => dispatch(actions.getHotelTypes()),
    onEditHotel: (hotelData, slug) =>
      dispatch(actions.editHotel(hotelData, slug)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HotelSettingsForm));
