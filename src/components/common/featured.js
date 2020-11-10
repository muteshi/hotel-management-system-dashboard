import React from "react";

const Featured = (props) => {
  let classes = "fa fa-circle-o";
  if (props.featured) classes += "fa fa-check-circle";
  return (
    <i
      onClick={props.onClick}
      className={classes}
      aria-hidden="true"
      style={{ cursor: "pointer", color: "green" }}
    ></i>
  );
};

export default Featured;
