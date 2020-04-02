
import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({ text }) => (

  <div className="errorMessage" role="alert">
    {text}
  </div>
);

ErrorMessage.propTypes = {
  text: PropTypes.string.isRequired
};

export default ErrorMessage;
