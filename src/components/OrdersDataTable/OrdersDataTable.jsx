import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import "./ordersDataTable.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api";

const columns = [
  {
    field: "_id",
    headerName: "Order ID",
    width: 250,
    renderCell: (params) => <div className="id">{params.row._id}</div>,
  },
  {
    field: "product",
    headerName: "Product",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 250,
    height: "auto",
    renderCell: (params) => (
      <div className="products_ids">
        {params.row.products.map((p, index) => (
          <div key={index} className="id">
            {p._id}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: "userId",
    headerName: "Customer ID",
    width: 250,
    renderCell: (params) => <div className="id">{params.row.userId}</div>,
  },
  { field: "address", headerName: "Address", width: 200 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 100,
    renderCell: (params) => (
      <div>{new Date(params.row.createdAt).toLocaleDateString()}</div>
    ),
  },
  { field: "total", headerName: "Total", width: 100 },
  {
    field: "status",
    headerName: "Status",
    renderCell: (params) => (
      <div className={`status ${params.row.status}`}>{params.row.status}</div>
    ),
    width: 150,
  },
];

const OrdersDataTable = ({ orders, loading, getAllOrders }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  //delete order
  const deleteOrder = async (orderId) => {
    api
      .delete(`/orders/${orderId}`, {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then(() => {
        //after deleting the order, we need to get all the new orders
        getAllOrders();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <button className="delete" onClick={() => deleteOrder(params.row._id)}>
          <DeleteIcon />
        </button>
      ),
    },
  ];

  return (
    <div className="orders-grid">
      <DataGrid
        columns={columns.concat(actionColumn)}
        rows={orders}
        loading={loading}
        getRowId={(row) => row._id}
        pageSize={10}
        getRowHeight={() => "auto"}
        rowsPerPageOptions={[10]}
      ></DataGrid>
    </div>
  );
};

export default OrdersDataTable;
