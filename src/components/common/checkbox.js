import React from "react";

const Checkbox = ({ name, checked, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <div className="form-check">
        <label htmlFor={name} className="form-check-label">
          {label}
        </label>
        <input
          {...rest}
          id={name}
          name={name}
          className="form-check-input"
          style={{ marginLeft: -110 }}
        />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default Checkbox;
