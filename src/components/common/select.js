import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
  return (
    <div className="form-group">
      <small className="text-muted">{label}</small>
      <label htmlFor={name} style={{ opacity: 0, marginBottom: -8 }}>
        {label}
      </label>
      <select {...rest} id={name} name={name} className="form-control">
        <option value="" disabled>
          {" "}
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
