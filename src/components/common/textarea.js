import React from "react";

const Textarea = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <small className="text-muted">{label}</small>
      <label htmlFor={name} style={{ opacity: 0, marginBottom: -8 }}>
        {label}
      </label>
      <textarea {...rest} id={name} name={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Textarea;
