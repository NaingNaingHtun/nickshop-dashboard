import React from "react";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import "./Widget.scss";
const Widget = ({ type }) => {
  let data;
  const amount = 200;
  const diff = 20;
  switch (type) {
    case "users": {
      data = {
        title: "USERS",
        isMoney: false,
        link: "See All Users",
        icon: (
          <PersonIcon
            className="icon"
            style={{ color: "blue", backgroundColor: "lightBlue" }}
          />
        ),
      };
      break;
    }
    case "orders": {
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "See All Orders",
        icon: (
          <ShoppingCartCheckoutIcon
            className="icon"
            style={{ color: "green", backgroundColor: "lightgreen" }}
          />
        ),
      };
      break;
    }
    case "earnings": {
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View Net Earnings",
        icon: (
          <MonetizationOnIcon
            className="icon"
            style={{ color: "gold", backgroundColor: "goldenrod" }}
          />
        ),
      };
      break;
    }
    case "balance": {
      data = {
        title: "BALANCE",
        isMoney: true,
        link: "View Detail",
        icon: (
          <AccountBalanceWalletIcon
            className="icon"
            style={{ color: "yellow", backgroundColor: "yellowgreen" }}
          />
        ),
      };

      break;
    }
    default: {
      break;
    }
  }
  return (
    <div
      className="widget"
      // style={{
      //   background: "rgb(43,56,191)",
      //   background:
      //     "linear-gradient(301deg, rgba(43,56,191,1) 0%, rgba(210,210,255,1) 100%)",
      // }}
    >
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to="/" className="link">
          {data.link}
        </Link>
      </div>
      <div className="left">
        <div className="percentage positive">
          <KeyboardArrowUpIcon /> {diff}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
