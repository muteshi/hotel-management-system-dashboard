import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import "../../assets/css/hotelFacilitiesForm.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class HotelFacilitiesForm extends Form {
  state = {
    data: {
      airport_transport: false,
      night_club: false,
      wifi: false,
      parking: false,
      swimming_pool: false,
      restaurant: false,
      gym: false,
      air_conditioner: false,
      laundry_services: false,
      bar_lounge: false,
      disabled_services: false,
      elevator: false,
      shuttle_bus_service: false,
      cards_accepted: false,
    },
    errors: {},
  };
  schema = {
    // id: Joi.number(),
    // slug: Joi.boolean(),
    airport_transport: Joi.boolean().label("Air transport"),
    night_club: Joi.boolean().label("Night club"),
    wifi: Joi.boolean().label("WiFi Internet"),
    parking: Joi.boolean().label("Parking Availbility"),
    swimming_pool: Joi.boolean().label("Swimming pool"),
    restaurant: Joi.boolean().label("Restaurant Services"),
    gym: Joi.boolean().label("Fitness Center"),
    air_conditioner: Joi.boolean().label("Cooling"),
    laundry_services: Joi.boolean().label("Laundry"),
    bar_lounge: Joi.boolean().label("Bar"),
    disabled_services: Joi.boolean().label("Disable services"),
    elevator: Joi.boolean().label("Elavator"),
    shuttle_bus_service: Joi.boolean().label("Shuttle bus service"),
    cards_accepted: Joi.boolean().label("Cards accepted"),
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
    return {
      // id: hotel.id,
      // slug: hotel.slug,
      airport_transport: hotel.airport_transport,
      night_club: hotel.night_club,
      wifi: hotel.wifi,
      parking: hotel.parking,
      swimming_pool: hotel.swimming_pool,
      restaurant: hotel.restaurant,
      gym: hotel.gym,
      air_conditioner: hotel.air_conditioner,
      laundry_services: hotel.laundry_services,
      bar_lounge: hotel.bar_lounge,
      disabled_services: hotel.disabled_services,
      elevator: hotel.elevator,
      shuttle_bus_service: hotel.shuttle_bus_service,
      cards_accepted: hotel.cards_accepted,
    };
  }

  toggleCheckbox = (e) => {
    const FacilityBoxName = e.target.name;
    this.setState((state) => ({
      data: {
        ...state.data,
        [FacilityBoxName]: !state.data[FacilityBoxName],
      },
    }));
  };

  toggleAllCheckboxes = (check) => {
    this.setState((state) => ({
      data: Object.keys(state.data).reduce((acc, key) => {
        acc[key] = check;
        return acc;
      }, {}),
    }));
  };

  doSubmit = () => {
    const hotelSlug = this.props.match.params.slug;
    this.props.onEditHotel(this.state.data, hotelSlug);
  };

  render() {
    return (
      <div>
        <div className="form-check">
          <label className="containerBox">
            <input
              type="checkbox"
              checked={Object.keys(this.state.data).every(
                (k) => this.state.data[k]
              )}
              onChange={(e) => this.toggleAllCheckboxes(e.target.checked)}
              className="form-check-input"
            />
            <span className="checkmark"></span>
            Select All
          </label>
        </div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="air_conditioner"
                    type="checkbox"
                    checked={this.state.data.air_conditioner}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Air Conditioner
                </label>
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="airport_transport"
                    type="checkbox"
                    checked={this.state.data.airport_transport}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Airport Transport
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="bar_lounge"
                    type="checkbox"
                    checked={this.state.data.bar_lounge}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Bar Lounge
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="cards_accepted"
                    type="checkbox"
                    checked={this.state.data.cards_accepted}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Cards accepted
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="disabled_services"
                    type="checkbox"
                    checked={this.state.data.disabled_services}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Disabled Services
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="elevator"
                    type="checkbox"
                    checked={this.state.data.elevator}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Elevator
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="gym"
                    type="checkbox"
                    checked={this.state.data.gym}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Fitness center
                </label>{" "}
              </div>
            </div>
            <div className="col">
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="laundry_services"
                    type="checkbox"
                    checked={this.state.data.laundry_services}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Laundry services
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="night_club"
                    type="checkbox"
                    checked={this.state.data.night_club}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Night club
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="parking"
                    type="checkbox"
                    checked={this.state.data.parking}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Parking availability
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="restaurant"
                    type="checkbox"
                    checked={this.state.data.restaurant}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Restaurant
                </label>{" "}
              </div>

              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="shuttle_bus_service"
                    type="checkbox"
                    checked={this.state.data.shuttle_bus_service}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Bus shuttle service
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="swimming_pool"
                    type="checkbox"
                    checked={this.state.data.swimming_pool}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  Swimming pool
                </label>{" "}
              </div>
              <div className="form-check">
                <label className="containerBox">
                  <input
                    name="wifi"
                    type="checkbox"
                    checked={this.state.data.wifi}
                    onChange={this.toggleCheckbox}
                    className="form-check-input"
                  />
                  <span className="checkmark"></span>
                  WiFi internet
                </label>{" "}
              </div>
            </div>

            {this.props.match.params.slug === "new-hotel"
              ? this.renderButton("Submit Hotel facilities")
              : this.renderButton("Update Hotel facilities")}
          </div>
        </form>
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
)(withRouter(HotelFacilitiesForm));
