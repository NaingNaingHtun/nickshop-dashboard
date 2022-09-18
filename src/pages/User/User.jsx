import React, { useState } from "react";
import "./user.scss";
import SideBar from "../../components/SideBar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import SpendingBarChart from "../../components/SpendingBarChart/SpendingBarChart";
import LatestOrders from "../../components/LatestOrders/LatestOrders";
import { isAdmin } from "../../authenticateUser";
import { Avatar, Skeleton } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../../api";

const User = () => {
  const admin = JSON.parse(sessionStorage.getItem("user"));
  isAdmin();
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [orders, setOrders] = useState([]);
  const [prevSixMonthsSpendings, setPreviousSixMonthsSpendings] = useState([]);
  const [
    prevSixMonthsSpendingsByCategory,
    setPreviousSixMonthsSpendingsByCategory,
  ] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [fetchingPrevSixMonths, setFetchingPrevSixMonths] = useState(false);
  const [fetchingPrevSixMonthsByCategory, setFetchingPrevSixMonthsByCategory] =
    useState(false);

  const getUser = async () => {
    setFetchingUser(true);
    await api
      .get(`/users/find/${userId}`, {
        headers: {
          authorization: "Bearer " + admin.accessToken,
        },
      })
      .then((res) => {
        setFetchingUser(false);
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
        setFetchingUser(false);
      });
  };

  const getPrevSixMonthsSpendings = async () => {
    setFetchingPrevSixMonths(true);
    api
      .get(`/orders/prev-six_months_spendings/${userId}`)
      .then((res) => {
        setFetchingPrevSixMonths(false);
        setPreviousSixMonthsSpendings(res.data);
      })
      .catch((err) => {
        setFetchingPrevSixMonths(false);
        console.log(err);
      });
  };

  const getPrevSixMonthsSpendingsByCategory = async () => {
    setFetchingPrevSixMonthsByCategory(true);
    api
      .get(`/orders/prev_six_months_spendings_by_category/${userId}`)
      .then((res) => {
        setFetchingPrevSixMonthsByCategory(false);
        setPreviousSixMonthsSpendingsByCategory(res.data);
      })
      .catch((err) => {
        setFetchingPrevSixMonthsByCategory(false);
        console.log(err);
      });
  };

  const getOrders = async () => {
    setFetchingOrders(true);
    api
      .get(`/orders/find/${userId}`, {
        headers: {
          authorization: "Bearer " + admin.accessToken,
        },
      })
      .then((res) => {
        setFetchingOrders(false);
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
        setFetchingOrders(false);
      });
  };
  //fetch user, previous six months spendings and by category
  useEffect(() => {
    getUser();
    getPrevSixMonthsSpendings();
    getPrevSixMonthsSpendingsByCategory();
    getOrders();
  }, [userId]);

  return !user ? null : (
    <div className="user">
      <SideBar />
      <div className="userContainer">
        <NavBar />
        <div className="top">
          <div className="left">
            {fetchingUser ? (
              <div className="loading-container">
                <Skeleton width="100%" height="100%" variant="rectangular" />
              </div>
            ) : (
              <React.Fragment>
                <div className="user-top">
                  <h1>Details</h1>
                </div>
                <div className="user-bottom">
                  <div className="user-bottom-top">
                    <Avatar sx={{ width: 100, height: 100 }} />
                    <h1 className="username">{user.username}</h1>
                  </div>
                  <div className="user-bottom-bottom">
                    <div className="user-info">
                      <span className="info-title">Email:</span>
                      <span className="info">{user.email}</span>
                    </div>
                    <div className="user-info">
                      <span className="info-title">Phone:</span>
                      <span className="info">{user.phone}</span>
                    </div>
                    <div className="user-info">
                      <span className="info-title">Address:</span>
                      <span className="info">{user.address}</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="center">
            {fetchingPrevSixMonths ? (
              <div className="loading-container">
                <Skeleton width="100%" height="100%" variant="rectangular" />
              </div>
            ) : (
              <SpendingBarChart
                data={prevSixMonthsSpendings}
                label="Last 6 months spendings"
              />
            )}
          </div>
          <div className="right">
            {fetchingPrevSixMonthsByCategory ? (
              <div className="loading-container">
                <Skeleton width="100%" height="100%" variant="rectangular" />
              </div>
            ) : (
              <SpendingBarChart
                data={prevSixMonthsSpendingsByCategory}
                label="Last 6 months spendings by category"
              />
            )}
          </div>
        </div>
        <div className="bottom">
          <h1>Latest Transactions</h1>
          <LatestOrders loading={fetchingOrders} orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default User;
