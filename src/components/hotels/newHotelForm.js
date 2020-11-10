import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { withRouter } from "react-router-dom";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";

class NewHotelForm extends Form {
  state = {
    data: {
      name: "",
      country: "",
      mobile_number: "",
      address: "",
      city: "",
      // property_photo: null,
      description: "",
    },
    errors: {},
  };
  schema = {
    slug: Joi.string(),
    name: Joi.string().required().label("Name of the hotel"),
    description: Joi.string().required().label("Brief Description"),
    property_photo: Joi.any().required().label("Main property photo"),
    country: Joi.string().required().label("Country"),
    address: Joi.string().required().label("Address"),
    city: Joi.string().required().label("City/Town"),
    mobile_number: Joi.string().required().label("Mobile phone"),
  };

  populateHotels() {
    const hotelSlug = this.props.match.params.slug;
    if (hotelSlug === "new-hotel") return;
    this.props.loadHotel(hotelSlug);
  }

  componentDidMount() {
    this.populateHotels();
  }

  componentDidUpdate(prevProps, prevState) {
    // check if hotel to be updated is populated in state
    if (prevProps.hotel !== this.props.hotel) {
      this.setState({
        data: this.mapToViewModel(this.props.hotel),
      });
    }
  }

  onPhotoUpload = (e) => {
    let imgData = this.state.data;
    imgData.property_photo = e.target.files[0];
    this.setState({ data: imgData });
  };

  mapToViewModel(hotel) {
    return {
      slug: hotel.slug,
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country,
      mobile_number: hotel.mobile_number,
      property_photo: hotel.property_photo,
    };
  }

  doSubmit = () => {
    const hotelSlug = this.props.match.params.slug;

    const formData = new FormData();
    formData.append(
      "property_photo",
      this.state.data.property_photo,
      this.state.data.property_photo.name
    );

    const stateData = this.state.data;
    formData.append("name", stateData.name);
    formData.append("description", stateData.description);
    formData.append("address", stateData.address);
    formData.append("city", stateData.city);
    formData.append("country", stateData.country);
    formData.append("mobile_number", stateData.mobile_number);

    if (this.props.match.params.slug === "new-hotel") {
      this.props.onAddHotel(formData);
    } else {
      this.props.onEditHotel(formData, hotelSlug);
    }
  };

  render() {
    return (
      <div>
        {/* {console.log(this.props.hotels)} */}
        <div className="jumbotron">
          <h3>
            {" "}
            {this.props.match.params.slug === "new-hotel"
              ? "Add New property"
              : "Update property"}
          </h3>
          <hr />
          <form onSubmit={this.handleSubmit}>
            {this.renderInput(
              "name",
              "Name of your property",
              "Name of the property"
            )}
            {this.renderInput(
              "address",
              "Will enable easy access of your property",
              "Street address"
            )}

            {this.renderInput(
              "city",
              "Nearest major town or city",
              "Nearest City/Town"
            )}

            {this.renderInput("country", "Country", "Country")}

            {this.renderInput(
              "mobile_number",
              "Used to confirm ownership of this property",
              "Mobile Phone"
            )}
            <small>Main property image</small>
            <br />
            {this.state.data.property_photo ? (
              <img
                src={this.state.data.property_photo}
                alt={this.state.data.name}
                className="img-thumbnail"
              />
            ) : null}
            <input
              type="file"
              // value={this.state.data.property_photo}
              onChange={this.onPhotoUpload}
              className="mb-3"
            />
            {this.renderTextArea(
              "description",
              "What makes your property to stand out",
              "Property Description"
            )}

            {this.props.match.params.slug === "new-hotel"
              ? this.renderButton("Save property")
              : this.renderButton("Update property")}
          </form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  hotel: state.apiData.hotel,
  hotelTypes: state.apiData.hotelTypes,
  spinner: state.apiData.spinning,
  loading: state.apiData.loading,
});

const mapDispatchToProps = (dispatch) => {
  return {
    loadHotel: (slug) => dispatch(actions.getHotel(slug)),
    onAddHotel: (hotelData) => dispatch(actions.addHotel(hotelData)),
    onEditHotel: (hotelData, slug) =>
      dispatch(actions.editHotel(hotelData, slug)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewHotelForm));
