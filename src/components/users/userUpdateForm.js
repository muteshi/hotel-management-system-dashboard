import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import Breadcrumb from "../common/breadcrumb";
import { getUser, saveUser } from "../../services/userService";
import { toast } from "react-toastify";
import UserProfileUpdateForm from "./profileUpdateForm";

class UserUpdateForm extends Form {
  state = {
    data: {
      id: "",
      email: "",
      password: "passwordhere",
      name: "",
      from_api: true,
    },
    errors: {},
  };
  schema = {
    email: Joi.string().email().required().label("Email "),
    name: Joi.string().required().label("Name"),
    password: Joi.string().required().label("Password"),
    from_api: Joi.boolean(),
    id: Joi.number(),
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

  async componentDidMount() {
    document.title = "Update user details form";
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      email: user.email,
      password: this.state.data.password,
      from_api: user.from_api,
      id: user.id,
      name: user.name,
    };
  }

  doSubmit = async () => {
    try {
      await saveUser(this.state.data);
      this.props.history.push(`${process.env.PUBLIC_URL}/dashboard/users`);
      toast.success("User updated successfully");
    } catch (ex) {
      console.log(ex);
      if (ex.response && ex.response.status === 403)
        toast.warning("You have no permission to perform this task");
    }
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <Breadcrumb parent="User" title="Edit Profile" />
        <div className="row">
          <div className="col-lg-4">
            <div className="jumbotron">
              <form onSubmit={this.handleSubmit}>
                <h3 className="card-title mb-0">{data.name}</h3>
                <hr className="mb-3" />
                {this.renderInput("name", "", "Full name")}
                {this.renderInput("password", "", "Password", "Password")}
                {this.renderInput("email", "", "Email address", "", "disabled")}
                {this.props.match.params.userId === "new-user"
                  ? this.renderButton("Save user")
                  : this.renderButton("Update user")}
              </form>
            </div>
          </div>
          <div className="col-lg-8">
            <UserProfileUpdateForm />
          </div>
        </div>
      </div>
    );
  }
}

export default UserUpdateForm;
