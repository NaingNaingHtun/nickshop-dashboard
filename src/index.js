import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import UserList from "./components/UserList/UserList";
import User from "./pages/User/User";
import ProductsList from "./pages/ProductsList/ProductsList";
import Product from "./pages/Product/Product";
import AddProduct from "./pages/AddProduct/AddProduct";
import Orders from "./pages/Orders/Orders";
import NotPageFound from "./pages/NotPageFound/NotPageFound";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="users">
            <Route index element={<UserList />} />
            <Route path=":userId" element={<User />} />
          </Route>
          <Route path="/products">
            <Route index element={<ProductsList />} />
            <Route path=":productId" element={<Product />} />
            <Route path="new/" element={<AddProduct />} />
            <Route path="new/:id" element={<AddProduct />} />
          </Route>
        </Route>
        <Route path="*" element={<NotPageFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
