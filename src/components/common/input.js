import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <small className="text-muted">{label}</small>
      <label
        htmlFor={name}
        style={{ opacity: 0, marginBottom: -8 }}
        className="col-form-label"
      >
        {label}
      </label>

      <input {...rest} id={name} name={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
