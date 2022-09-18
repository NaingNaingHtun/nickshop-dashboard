import React from "react";
import "./notPageFound.scss";
const NotPageFound = () => {
  return (
    <div className="not-page-found-container">
      <div className="not-page-found-title">404</div>
      <div className="not-page-found-text">
        Oops! Something Went Wrong. The page you are looking for is not found.
      </div>
      <a href="/" className="link">
        Go to home
      </a>
    </div>
  );
};

export default NotPageFound;
