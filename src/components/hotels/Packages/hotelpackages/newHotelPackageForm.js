import React from "react";
import DatePicker from "react-datepicker";
import Breadcrumb from "../../../common/breadcrumb";
import Joi from "joi-browser";
import Form from "../../../common/form";
import "react-datepicker/dist/react-datepicker.css";
import {
  getHotelPackage,
  saveHotelPackage,
} from "../../../../services/hotelPackageServices";
import { getHotels } from "../../../../services/hotelService";
import { getPackages } from "../../../../services/packageService";
import { toast } from "react-toastify";
import moment from "moment";
import Select from "react-select";
import { withRouter } from "react-router-dom";

class NewHotelPackageForm extends Form {
  state = {
    data: {
      hotel: [],
      package: [],
      package_Price: "",
      meal_Plans: "",
      duration: "",
      start_Date: "",
      end_Date: "",
    },
    errors: {},
    hotels: [],
    packages: [],
  };
  schema = {
    id: Joi.number(),
    package_Price: Joi.number().min(1).label("Package price"),
    duration: Joi.number().min(1).label("Duration of the package"),
    start_Date: Joi.date().label("Start date"),
    end_Date: Joi.date().label("End date"),
    hotel: Joi.object().label("Hotel"),
    package: Joi.object().label("Package"),
    meal_Plans: Joi.string().label("Meal plans"),
  };

  async populateHotels() {
    const { data: hotels } = await getHotels();
    this.setState({ hotels });
  }

  async populatePackages() {
    const { data: packages } = await getPackages();
    this.setState({ packages });
  }

  setStartDate = (date) => {
    let data = this.state.data;
    data.start_Date = date;
    this.setState({
      data,
    });
  };

  setEndDate = (date) => {
    let data = this.state.data;
    data.end_Date = date;
    this.setState({
      data,
    });
  };

  handleHotelOptionSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.hotel = selectedOption;
    this.setState({ data });
  };

  handlePackageSelectChange = (selectedOption) => {
    let data = this.state.data;
    data.package = selectedOption;
    this.setState({ data });
  };

  async populateHotelPackage() {
    try {
      const hotelPackageId = this.props.match.params.hotelPackageId;
      if (hotelPackageId === "new-hotelpackage") return;
      const { data: hotelPackage } = await getHotelPackage(hotelPackageId);
      this.setState({ data: this.mapToViewModel(hotelPackage) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async componentDidMount() {
    await this.populateHotelPackage();
    await this.populateHotels();
    await this.populatePackages();
  }

  mapToViewModel(hotelPackage) {
    const pack = {
      label: hotelPackage.package_name,
      value: hotelPackage.package,
    };
    const hotel = { label: hotelPackage.hotel_name, value: hotelPackage.hotel };
    return {
      id: hotelPackage.id,
      hotel: hotel,
      package: pack,
      package_Price: hotelPackage.package_Price,
      meal_Plans: hotelPackage.meal_Plans,
      duration: hotelPackage.duration,
      start_Date: new Date(hotelPackage.start_Date),
      end_Date: new Date(hotelPackage.end_Date),
    };
  }

  doSubmit = async () => {
    try {
      const data = this.state.data;
      const packageData = {
        ...data,
        start_Date: moment(this.state.data.start_Date).format("YYYY-MM-DD"),
        end_Date: moment(this.state.data.end_Date).format("YYYY-MM-DD"),
        hotel: data.hotel.value,
        package: data.package.value,
      };
      await saveHotelPackage(packageData);
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/packages`);
      toast.success("Package saved successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    const { hotels, packages, data } = this.state;

    let packageOptions = packages.map(function (pack) {
      return { value: pack.id, label: pack.title };
    });

    let hotelOptions = hotels.map(function (hotel) {
      return { value: hotel.id, label: hotel.name };
    });
    return (
      <div>
        <Breadcrumb parent="Package" title="New package" />

        <hr className="mb-3" />
        <div className="row">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="jumbotron">
              <h3>
                {" "}
                {this.props.match.params.hotelPackageId === "new-hotelpackage"
                  ? "Add hotel to package"
                  : "Update hotel package"}
              </h3>
              <small className="text-muted">
                Use this form to add a hotel to an existing package
              </small>
              <hr />

              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col">
                    <small className="text-muted">Select package</small>
                    <Select
                      isSearchable
                      value={data.package}
                      name="form-field-name"
                      className="mb-3"
                      onChange={this.handlePackageSelectChange}
                      options={packageOptions}
                      // isDisabled={isDisabled}
                      placeholder="Select package"
                    />
                  </div>
                  <div className="col">
                    <small className="text-muted">Select hotel</small>
                    <Select
                      value={data.hotel}
                      className="mb-3"
                      name="form-field-name"
                      onChange={this.handleHotelOptionSelectChange}
                      options={hotelOptions}
                      placeholder="Select property"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group" style={{ marginTop: 28 }}>
                      <small className="text-muted">
                        Set the start date from which this package is valid
                      </small>
                      <DatePicker
                        className="form-control digits"
                        todayButton="Today"
                        selected={this.state.data.start_Date}
                        isClearable
                        onChange={this.setStartDate}
                        placeholderText="Select start date"
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group" style={{ marginTop: 28 }}>
                      <small className="text-muted">Set end date</small>
                      <DatePicker
                        className="form-control digits"
                        isClearable
                        selected={this.state.data.end_Date}
                        onChange={this.setEndDate}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                        minDate={
                          this.state.data.start_Date === ""
                            ? new Date()
                            : this.state.data.start_Date
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    {this.renderInput("package_Price", "Price of the package")}
                  </div>
                  <div className="col">
                    {this.renderInput(
                      "duration",
                      "Minimum nights",
                      "Minimum number of nights a guest can book"
                    )}
                  </div>
                </div>

                {this.renderTextArea(
                  "meal_Plans",
                  "Meal plans",
                  "Enter meal plans that accompany this offer. Each on new line. e.g Full board etc"
                )}

                {this.props.match.params.hotelPackageId === "new-hotelpackage"
                  ? this.renderButton("Save hotel package")
                  : this.renderButton("Update hotel package")}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NewHotelPackageForm);
