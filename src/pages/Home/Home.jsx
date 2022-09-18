import React from "react";
import Chart from "../../components/Chart/Chart";
import Featured from "../../components/Featured/Featured";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import LatestOrders from "../../components/LatestOrders/LatestOrders";
import Widget from "../../components/Widget/Widget";
import "./home.scss";
import { isAdmin } from "../../authenticateUser";
const Home = () => {
  isAdmin();
  console.log(JSON.stringify(sessionStorage.getItem("user")));
  return (
    <div className="home">
      <SideBar />
      <div className="home-container">
        <NavBar />
        <div className="wrapper">
          <div className="widgets">
            <Widget type="users" />
            <Widget type="orders" />
            <Widget type="earnings" />
            <Widget type="balance" />
          </div>
          <div className="charts">
            <Featured />
            <Chart aspect={2 / 1} title="Last 6 Months" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
