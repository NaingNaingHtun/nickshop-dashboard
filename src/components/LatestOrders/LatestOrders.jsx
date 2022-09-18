import React from "react";
import "./LatestOrders.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const LatestOrders = ({ orders, loading }) => {
  return loading ? (
    <div className="loading-container">loading</div>
  ) : (
    <TableContainer component={Paper} className="latest-orders">
      <Table sx={{ minWidth: 650 }} aria-label="cuttomers latest orders">
        <TableHead>
          <TableRow>
            <TableCell>Order Id</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell className="tabelCell">{order._id}</TableCell>
              <TableCell className="tabelCell">
                <div className="product-ids">
                  {order.products.map((product) => (
                    <div key={product._id}>{product._id}</div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="tabelCell">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="tabelCell">$ {order.total}</TableCell>
              <TableCell className="tabelCell">
                <div className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LatestOrders;
