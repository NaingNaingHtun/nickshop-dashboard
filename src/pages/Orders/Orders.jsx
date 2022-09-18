import React, { useState } from "react";
import "./orders.scss";
import SideBar from "../../components/SideBar/SideBar";
import NavBar from "../../components/NavBar/NavBar";
import TodayOrdersBarChart from "../../components/TodayOrdersBarChart/TodayOrdersBarChart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrdersDataTable from "../../components/OrdersDataTable/OrdersDataTable";
import { isAdmin } from "../../authenticateUser";
import api from "../../api";
import { useEffect } from "react";
import PrevSixMonthsOrders from "../../components/PrevSixMonthsOrders/PrevSixMonthsOrders";
import PreviousMonthOrders from "../../components/PreviousMonthOrders/PreviousMonthOrders";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const truncate = (total) => {
  const splited = (total + "").split(".");
  let beforeDot = "";
  let afterDot = "";

  if (splited.length > 1) {
    beforeDot = splited[0]; //"100"
    afterDot = splited[1]; //"3300000003"
    total = Number(beforeDot + "." + afterDot.slice(0, 2));
  } else {
    beforeDot = splited[0]; //"100"
    total = Number(beforeDot + "." + afterDot);
  }

  return total;
};
const Orders = () => {
  const navigate = useNavigate();
  //if it is not admin, it going to redirect to the login page
  isAdmin(navigate);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [prevSixMonthsIncomes, setPrevSixMonthsIncomes] = useState([]);
  const [prevMonthIncomes, setPrevMonthIncomes] = useState([]);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredAllOrders, setFilteredAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDate, setOrderDate] = useState("");
  const [id, setId] = useState("");
  const [ordersByCategory, setOrdersByCategory] = useState([]); //[{name: "category_name", amount: "amount",},...]
  const [bestSellings, setBestSellings] = useState([]);
  const [todayOrderTotal, setTodayOrdersTotal] = useState(0);
  const [date, setDate] = useState(new Date());
  const [fetchingOrdersByDate, setFetchingOrdersByDate] = useState(false);

  console.log("Best Sellings: " + bestSellings.length);
  console.log("orders by date");
  ordersByDate.forEach((order) => console.log(order));
  //===========================FUCNTIONS========================
  const refresh = () => {
    getAllOrders();
    getPrevSixMonthsIncomes();
    getPrevMonthIncomes();
    getOrdersByDate(date);
  };
  //=============================EFFECTS============================
  const getAllOrders = async () => {
    setLoading(true);
    await api
      .get("/orders", {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then((res) => {
        setAllOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getPrevSixMonthsIncomes = async () => {
    await api
      .get("/orders/prev_six_months_incomes", {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then((res) => {
        setPrevSixMonthsIncomes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPrevMonthIncomes = async () => {
    await api
      .get("/orders/prev_month_incomes", {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then((res) => {
        setPrevMonthIncomes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getOrdersByDate = async (d) => {
    setFetchingOrdersByDate(true);
    await api
      .get(
        `/orders/orders_by_date/${d}`,

        {
          headers: {
            authorization: "Bearer " + user.accessToken,
          },
        }
      )
      .then((res) => {
        setOrdersByDate(res.data);
        setFetchingOrdersByDate(false);
      })
      .catch((err) => {
        console.log(err);
        setFetchingOrdersByDate(false);
      });
  };

  useEffect(() => {
    getPrevSixMonthsIncomes();
    getPrevMonthIncomes();
    getAllOrders();
  }, []);

  useEffect(() => {
    getOrdersByDate(date);
  }, [date]);
  useEffect(() => {
    const orders_by_category = [
      { name: "Hat", amount: 0 },
      { name: "Glasses", amount: 0 },
      { name: "Coat", amount: 0 },
      { name: "Shirt", amount: 0 },
      { name: "Pant", amount: 0 },
      { name: "Shoe", amount: 0 },
    ];
    orders_by_category.forEach((category, index) => {
      let totalByCategory = 0;
      ordersByDate.forEach((order) => {
        order.products.forEach((product) => {
          if (product.category.includes(category.name.toLocaleLowerCase())) {
            totalByCategory += product.total;
          }
        });
      });
      //for some reason, sometimes totalByCategory is not like "100.33", it looks like 100.3300000003
      //so I changed the number to string, split them and took till the last 2 after "." dot

      orders_by_category[index].amount = truncate(totalByCategory);
    });
    setOrdersByCategory(orders_by_category);

    //today order total
    let total = 0;
    ordersByDate.forEach((order) => {
      total = total + order.total;
    });
    setTodayOrdersTotal(total);
  }, [ordersByDate]);

  //best sellings products
  useEffect(() => {
    let bestSellingsProducts = [];
    const productsWithQuantity = {};
    ordersByDate.forEach((order) => {
      order.products.forEach(({ _id, quantity, image, title }) => {
        if (Object.keys(productsWithQuantity).includes(_id)) {
          productsWithQuantity[_id] = {
            quantity: Number(productsWithQuantity[_id].quantity) + quantity,
            image,
            title,
          };
        } else {
          productsWithQuantity[_id] = { quantity, image, title };
        }
      });
    });
    //sort the products with quantity in descending
    bestSellingsProducts = Object.entries(productsWithQuantity).sort(
      //[[], [], [], [], [], [], [], [], [],...]
      (a, b) => b[1].quantity - a[1].quantity
    );

    bestSellingsProducts.length = 3; //now we only have at most top 3 products
    bestSellingsProducts = bestSellingsProducts.map((product_arr) => ({
      id: product_arr[0],
      info: product_arr[1],
    }));
    setBestSellings(bestSellingsProducts);
  }, [ordersByDate]);

  //filtering the orders
  useEffect(() => {
    if (id || orderDate) {
      let result = [];
      result = allOrders.filter((order) => {
        const createdAt = new Date(order.createdAt);
        let filterDate = new Date(orderDate); //assume orderDate= 09/4/2022, then filterDate=09/5/2022, so we need to decrease one month
        if (
          order._id === id ||
          createdAt.toLocaleDateString() === filterDate.toLocaleDateString()
        ) {
          return true;
        } else {
          return false;
        }
      });

      setFilteredAllOrders(result);
    }
  }, [id, orderDate, allOrders]);

  const bgColors = ["gold", "#bfbfbf", "#4b2020"];
  return (
    <div className="orders">
      <SideBar />
      <div className="orders-container">
        <NavBar />
        <div className="refresh-container">
          <div className="refresh-btn" onClick={refresh}>
            <RefreshIcon /> <span>Refresh</span>
          </div>
        </div>
        <div className="top">
          <div className="last-6-months-orders">
            <h1 className="title">Last 6 Months Orders Summary</h1>
            <PrevSixMonthsOrders incomes={prevSixMonthsIncomes} />
          </div>
          <div className="previous-month-orders">
            <h1 className="title">Previous Month Orders Summary</h1>
            <PreviousMonthOrders incomes={prevMonthIncomes} />
          </div>
        </div>
        <div className="info-text">Choose Date to see Summary</div>
        <div className="date-container">
          <DatePicker
            selected={new Date(date)}
            onChange={(d) => setDate(d)}
            className="date-picker"
            // onSelect={(d) => setDate(d.toLocaleDateString())}
            placeholderText="Choose date"
          />
        </div>
        <div className="center">
          <div className="center-left">
            {fetchingOrdersByDate ? (
              <div className="loading-container">
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
            ) : (
              <TodayOrdersBarChart orders={ordersByCategory} />
            )}
          </div>
          <div className="center-center">
            <div className="top-sellers">
              <div className="items">
                {fetchingOrdersByDate ? (
                  <div className="loading-container">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </div>
                ) : bestSellings.length > 0 && ordersByDate.length > 0 ? (
                  <React.Fragment>
                    <div className="title">Top sellers</div>
                    {bestSellings.map((product, index) => (
                      <div className="item" key={index}>
                        <div className="item-top">
                          <img
                            src={product.info.image}
                            alt={product}
                            loading="lazy"
                          />
                          <div className="product-details">
                            <div className="name-container">
                              <b>Name:</b>
                              <div className="product-name">
                                {product.info.title}
                              </div>
                            </div>
                            <p>
                              <b>Id:</b>
                              {product.id}
                            </p>
                          </div>
                        </div>
                        <div className="item-bottom">
                          <div>
                            <span className="sold-out">Sold out:</span>{" "}
                            <span className="quantity">
                              {product.info.quantity}
                            </span>
                          </div>
                        </div>

                        <div
                          className="rank"
                          style={{ backgroundColor: bgColors[index] }}
                        >
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ) : (
                  <div className="no-orders">No Orders</div>
                )}
              </div>
            </div>
          </div>
          <div className="center-right">
            {fetchingOrdersByDate ? (
              <div className="loading-container">
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
            ) : (
              <React.Fragment>
                <div className="orders-count-wrapper">
                  <div className="title">
                    Orders (<b>today</b>)
                  </div>
                  <div className="orders-count">{ordersByDate.length}</div>
                </div>
                <div className="earnings-amount-wrapper">
                  <div className="title">
                    Earnings (<b>today</b>)
                  </div>
                  <div className="earnings-amount">
                    $ {truncate(todayOrderTotal)}
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        <div className="title" style={{ marginTop: "10px" }}>
          Previous Orders
        </div>
        <div className="bottom">
          <div className="filters-container">
            <div className="date-container">
              <DatePicker
                selected={orderDate ? new Date(orderDate) : ""}
                onChange={(d) => setOrderDate(d)}
                className="date-picker"
                onSelect={(date) => setOrderDate(date.toLocaleDateString())}
                placeholderText="Choose date"
              />
            </div>
            <div className="id-input-container">
              <input
                className="id-input"
                type="search"
                name="id"
                placeholder="Enter Order Id"
                onChange={(event) => setId(event.target.value)}
              />
            </div>
            <div className="refresh-btn" onClick={refresh}>
              <RefreshIcon /> <span>Refresh</span>
            </div>
          </div>
          <OrdersDataTable
            orders={id || orderDate ? filteredAllOrders : allOrders}
            loading={loading}
            getAllOrders={getAllOrders}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
