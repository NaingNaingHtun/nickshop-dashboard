import React from "react";
import "./SideBar.scss";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Link, useNavigate } from "react-router-dom";
const SideBar = () => {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.setItem("user", null);
    navigate("/login");
  };
  return (
    <div className="sidebar">
      <hr />
      <div className="links">
        <Link className="link" to="/">
          <CreditCardIcon className="icon" />
          <span>Orders</span>
        </Link>
        <Link className="link" to="/users">
          <PersonIcon className="icon" />
          <span>Customers</span>
        </Link>
        <Link className="link" to="/products">
          <StoreIcon className="icon" />
          <span>Products</span>
        </Link>
      </div>
      <button className="logout" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};

export default SideBar;
