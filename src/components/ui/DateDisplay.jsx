import React from "react";
import moment from "moment";

const DateDisplay = ({ date }) => {
  return <span>{moment(date).fromNow()}</span>;
};

export default DateDisplay;
