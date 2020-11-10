import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Textarea from "./textarea";
import FileInput from "./fileInput";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    const errors = {};

    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };
  handleSubmit = (e) => {
    const submitBtn = document.getElementById("submitBtn");
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
    submitBtn.disabled = true;
  };
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderButton(label) {
    return (
      <button
        className="btn btn-primary btn-block"
        id="submitBtn"
        disabled={this.validate()}
      >
        {label}
      </button>
    );
  }

  renderSelect(name, label, options) {
    const { data, errors } = this.state;
    return (
      <Select
        options={options}
        name={name}
        value={data[name] || ""}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderInput(name, label, placeholder, type = "text", disabled) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        disabled={disabled}
        name={name}
        placeholder={placeholder}
        value={data[name] || ""}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderTextArea(name, label, placeholder, type = "text") {
    const { data, errors } = this.state;
    return (
      <Textarea
        type={type}
        placeholder={placeholder}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderFile(name, label, type = "file") {
    const { data, errors } = this.state;
    return (
      <FileInput
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
