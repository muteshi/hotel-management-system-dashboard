import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  getUser,
  getUserTypes,
  userProfileUpdate,
} from "../../services/userService";
import { toast } from "react-toastify";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import auth from "../../services/authService";

class UserProfileUpdateForm extends Form {
  state = {
    data: {
      country: "",
      id: "",
      telephone_Number: "",
      user_type: [],
      address: "",
      city: "",
      commission: "",
      organisation_name: "",
      name: "",
    },
    errors: {},
    user_types: [],
    user: {},
    companyNameShow: false,
  };
  schema = {
    organisation_name: Joi.string(),
    id: Joi.number(),
    profileId: Joi.number(),
    name: Joi.string(),
    user_type: Joi.object(),
    is_superuser: Joi.boolean(),
    country: Joi.string().label("Country"),
    address: Joi.string().label("Address"),
    city: Joi.string().label("City"),
    commission: Joi.string().label("Commission"),
    telephone_Number: Joi.string().label("Mobile number"),
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.userId;
      if (userId === "new-user") return;
      const { data: user } = await getUser(userId);
      this.setState({ data: this.mapToViewModel(user) });
      let data = this.state.data;
      if (
        data.user_type.label === "Company" ||
        data.user_type.label === "Partner"
      ) {
        this.setState({ companyNameShow: true });
      } else {
        data.organisation_name = "N/A";
        this.setState({ data, companyNameShow: false });
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async loadUser() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  async populateUserTypes() {
    const { data: user_types } = await getUserTypes();
    this.setState({ user_types });
  }

  async componentDidMount() {
    await this.populateUser();
    await this.loadUser();
    await this.populateUserTypes();
  }

  mapToViewModel(user) {
    const user_type = {
      label: user.user_type_name,
      value: user.user_type,
    };
    return {
      id: user.id,
      organisation_name: user.organisation_name,
      name: user.name,
      user_type: !user.user_type ? "" : user_type,
      address: user.address,
      city: user.city,
      is_superuser: user.is_superuser,
      country: user.country,
      profileId: user.profile,
      commission: user.commission,
      telephone_Number: user.telephone_Number,
    };
  }

  handleUserTypeSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.user_type = selectedOption;
    if (
      data.user_type.label === "Partner" ||
      data.user_type.label === "Company"
    ) {
      this.setState({ companyNameShow: true });
      data.organisation_name = "";
    } else {
      data.organisation_name = "N/A";
      this.setState({ data, companyNameShow: false });
    }
  };

  doSubmit = async () => {
    try {
      let data = this.state.data;
      const userData = {
        ...data,
        user_type: data.user_type.value,
      };

      await userProfileUpdate(userData);
      this.props.history.push("/dashboard/users");
      toast.success("Profile updated successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    const { user_types, data, companyNameShow } = this.state;

    let userTypeOptions = user_types.map(function (user) {
      return { value: user.id, label: user.name };
    });

    return (
      <div>
        <div className="jumbotron">
          <form onSubmit={this.handleSubmit}>
            <h3>{data.name} profile</h3>
            <hr className="mb-3" />
            <Select
              className="mt-5"
              value={data.user_type}
              autoFocus
              searchable
              name="form-field-name"
              onChange={this.handleUserTypeSelectChange}
              options={userTypeOptions}
              placeholder="Select user type"
            />

            {companyNameShow &&
              this.renderInput("organisation_name", "", "Company name")}
            <div className="row">
              <div className="col-sm-6 col-md-6">
                {this.renderInput("telephone_Number", "", "Mobile phone")}
              </div>
              <div className="col-sm-6 col-md-6">
                {this.renderInput("address", "", "Street address")}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-6">
                {this.renderInput("city", "", "Nearest City/Town")}
              </div>
              <div className="col-sm-6 col-md-6">
                {this.renderInput("country", "", "Country")}
              </div>
            </div>
            <div className="row">
              {data.is_superuser && (
                <div className="col-sm-6 col-md-6">
                  {this.renderInput(
                    "commission",
                    "Commission",
                    "The percentage commission"
                  )}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-sm-4 col-md-4">
                {this.props.match.params.userId === "new-user"
                  ? this.renderButton("Save user")
                  : this.renderButton("Update user")}
              </div>
              <div className="col-sm-8 col-md-8"></div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(UserProfileUpdateForm);
