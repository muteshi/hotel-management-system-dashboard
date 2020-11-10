import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import auth from "../../services/authService";
import { Redirect } from "react-router-dom";
import logo from "../../assets/images/webguruslogo.png";
import "react-toastify/dist/ReactToastify.css";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      window.location = `${process.env.PUBLIC_URL}/dashboard`;
    } catch (ex) {
      if (ex.response && ex.response.status === 401) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data.detail;
        this.setState({ errors });
      }
    }
  };

  render() {
    const dashboardPage = `${process.env.PUBLIC_URL}/`;
    if (auth.getCurrentUser()) return <Redirect to={dashboardPage} />;

    return (
      <div>
        <div className="page-wrapper">
          <div className="auth-bg">
            <div className="authentication-box">
              <div className="text-center">
                <img src={logo} alt="" />
              </div>
              <div className="card mt-4">
                <div className="card-body">
                  <div className="text-center">
                    <h4>LOGIN</h4>
                    <h6>Enter your Username and Password </h6>
                  </div>

                  <form className="theme-form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      {this.renderInput("username", "", "Email Address")}
                    </div>
                    <div className="form-group">
                      {this.renderInput("password", "", "Password", "password")}
                    </div>
                    <small className="text-muted">
                      <a
                        rel="noopener noreferrer"
                        href="https://marvellousventures.com/accounts/password-reset/"
                        target="_blank"
                      >
                        Forgot password?
                      </a>
                    </small>
                    <div className="form-group form-row mt-3 mb-0">
                      {this.renderButton("Login")}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
