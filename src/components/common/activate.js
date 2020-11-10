import React from "react";

const Activate = (props) => {
  let classes = "fa fa-circle-o";
  if (props.activate) classes += "fa fa-check-circle";

  return (
    <i
      onClick={props.onClick}
      className={classes}
      aria-hidden="true"
      style={{ cursor: "pointer", color: "green" }}
    ></i>
  );
};

export default Activate;
