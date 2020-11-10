import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import { getUser, getUserTypes, saveUser } from "../../services/userService";
import { toast } from "react-toastify";
import Select from "react-select";
import auth from "../../services/authService";

class UserForm extends Form {
  state = {
    data: {
      user: {},
      email: "",
      password: "",
      name: "",
      country: "",
      telephone_Number: "",
      user_type: [],
      address: "",
      city: "",
      organisation_name: "",
      from_api: true,
    },
    errors: {},
    user_types: [],
    companyNameShow: false,
  };
  schema = {
    email: Joi.string().email().required().label("Email "),
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().label("Password"),
    organisation_name: Joi.string(),
    country: Joi.string().label("Country"),
    address: Joi.string().label("Address"),
    city: Joi.string().label("City"),
    user_type: Joi.object(),
    user: Joi.object(),
    from_api: Joi.boolean(),
    telephone_Number: Joi.string().label("Mobile number"),
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.userId;
      if (userId === "new-user") return;
      const { data: user } = await getUser(userId);
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log("Problem");
      // this.props.history.replace("/notfound");
    }
  }

  async populateUserTypes() {
    const { data: user_types } = await getUserTypes();
    this.setState({ user_types });
  }

  async componentDidMount() {
    document.title = "Manage users form";
    await this.populateUser();
    await this.populateUserTypes();
  }

  mapToViewModel(user) {
    return {
      email: user.email,
      password: user.password,
      organisation_name: user.organisation_name,
      user_type: user.user_type,
      name: user.name,
      address: user.address,
      city: user.city,
      country: user.country,
      telephone_Number: user.telephone_Number,
    };
  }

  handleUserTypeSelectChange = async (selectedOption) => {
    let data = this.state.data;
    data.user_type = selectedOption;
    this.setState({ data });
    if (
      (data.user_type && data.user_type.label === "Company") ||
      data.user_type.label === "Partner"
    ) {
      this.setState({ companyNameShow: true });
    } else {
      data.organisation_name = "N/A";
      this.setState({ data, companyNameShow: false });
    }
  };

  doSubmit = async () => {
    try {
      let data = this.state.data;
      let user = {
        name: data.name,
        email: data.email,
        password: data.password,
        from_api: data.from_api,
        parent: auth.getCurrentUser().user_id,
      };
      const userData = {
        user,
        organisation_name: data.organisation_name,
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country,
        telephone_number: data.telephone_Number,
        user_type: data.user_type.value,
      };
      await saveUser(userData);
      this.props.history.push("/dashboard/users");
      toast.success("User saved successfully");
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
            <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8">
                <h3>Add New user</h3>
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
                  <div className="col-sm-6">
                    {this.renderInput("name", "", "Full name")}
                  </div>
                  <div className="col-sm-6">
                    {this.renderInput(
                      "password",
                      "",
                      "Password",
                      "Password",
                      ""
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput("email", "", "Email address")}
                  </div>
                  <div className="col-sm-6">
                    {this.renderInput("telephone_Number", "", "Mobile Phone")}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-6">
                    {this.renderInput("address", "", "Street address")}
                  </div>
                  <div className="col-sm-6">
                    {this.renderInput("city", "", "Nearest City/Town")}
                  </div>
                </div>{" "}
                {this.renderInput("country", "", "Country")}
                {this.renderButton("Save user")}
              </div>
              <div className="col-sm-2"></div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserForm;
