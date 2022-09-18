import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import SaleBarChart from "../../components/SaleBarChart/SaleBarChart";
import SideBar from "../../components/SideBar/SideBar";
import LatestOrders from "../../components/LatestOrders/LatestOrders";
import "./product.scss";
import { isAdmin } from "../../authenticateUser";
const Product = () => {
  isAdmin();
  return (
    <div className="product">
      <SideBar />
      <div className="productContainer">
        <NavBar />
        <div className="product-top">
          <div className="product-top-left">
            <img
              src="https://th.bing.com/th/id/R.72966dfb34278fe36b7ac8ba6d635704?rik=mZfT3QfcaJXOsw&pid=ImgRaw&r=0"
              alt="Shoe"
            />
            <div className="product-details">
              <div className="info">
                <span className="info-title">Title:</span>
                <div className="info-text">Nike Shoe For Men</div>
              </div>
              <div className="info">
                <span className="info-title">Desc:</span>
                <div className="info-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate labore saepe nesciunt voluptas officia et impedit
                  eum libero dicta, totam ea voluptatum nam iste, quo doloremque
                  nemo dolore error hic?
                </div>
              </div>
              <div className="info">
                <span className="info-title">For:</span>
                <div className="info-text">Men, Women</div>
              </div>
              <div className="info">
                <span className="info-title">Category:</span>
                <div className="info-text">Shoe, Runner, Sneaker</div>
              </div>
              <div className="info">
                <span className="info-title">Price:</span>
                <div className="info-text">$ 39.99</div>
              </div>
              <div className="info">
                <span className="info-title">InStock:</span>
                <div className="info-text">Yes</div>
              </div>
            </div>
          </div>
          <div className="product-top-right">
            <SaleBarChart />
          </div>
        </div>
        <div className="product-bottom">
          <h1>Latest Transactions</h1>
          <LatestOrders />
        </div>
      </div>
    </div>
  );
};

export default Product;
