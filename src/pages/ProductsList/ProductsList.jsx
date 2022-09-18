import React, { useEffect, useState } from "react";
import "./productsList.scss";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { isAdmin } from "../../authenticateUser";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api";
import { useNavigate } from "react-router-dom";
const columns = [
  { field: "_id", headerName: "ID", width: 200 },
  {
    field: "product",
    headerName: "Product",
    sortable: false,
    renderCell: (params) => (
      <div className="product-container">
        <img className="product-img" src={params.row.image} alt="Product" />
        <p className="product-name">{params.row.title}</p>
      </div>
    ),
    width: 200,
  },
  {
    field: "price",
    headerName: "Price",
    renderCell: (params) => <span>$ {params.row.price}</span>,
    width: 100,
  },
  {
    field: "colors",
    headerName: "Colors",
    sortable: false,
    renderCell: (params) => (
      <div className="colors">
        {params.row.colors.map((color) => (
          <div className="color" style={{ backgroundColor: color }}></div>
        ))}
      </div>
    ),
    width: 200,
  },
  {
    field: "Categories",
    headerName: "Categories",
    width: 150,
    sortable: false,
    renderCell: (params) => <div>{params.row.category.join(", ")}</div>,
  },
  {
    field: "sizes",
    headerName: "Sizes",
    width: 150,
    sortable: false,
    renderCell: (params) => <div>{params.row.sizes.join(", ")}</div>,
  },
  {
    field: "Gender",
    headerName: "Gender",
    sortable: false,
    width: 150,
    renderCell: (params) => <div>{params.row.for.join(", ")}</div>,
  },
];

const ProductsList = () => {
  const navigate = useNavigate();
  isAdmin(navigate);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [deleteError, setDeleteError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div className="action">
          <button
            className="delete"
            onClick={() => deleteProduct(params.row._id)}
          >
            <DeleteIcon />
          </button>
          <button
            className="edit"
            onClick={() =>
              (window.location.href = `/products/new/${params.row._id}`)
            }
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  const getProducts = async () => {
    setLoading(true);
    await api
      .get("/products", {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then((response) => {
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProduct = async (id) => {
    // console.log("Bearer " + user.accessToken);
    setDeleting(true);
    await api
      .delete(`/products/${id}`, {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then(() => {
        getProducts();
        setDeleteError(false);
        setDeleting(false);
      })
      .catch((err) => {
        console.log(err);
        setDeleteError(true);
        setDeleting(false);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  //every time query changes, filter out products
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => {
        return (
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.includes(query.toLowerCase())
        );
      })
    );
  }, [query, products]);

  useEffect(() => {
    //when we are in the filtered products and user delete a product, we need to update the filtered prodcuts with then new products
    if (query) {
      setFilteredProducts(
        products.filter((product) => {
          return (
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.includes(query.toLowerCase())
          );
        })
      );
    }
  }, [products, query]);

  return (
    <div className="products-list">
      <SideBar />
      <div className="products-container">
        <NavBar />
        <div className="products-top">
          <div>
            <span className="title">Total Products:</span>
            <span>{products.length}</span>
          </div>
          <button
            className="create-btn"
            onClick={() => navigate("/products/new")}
          >
            New Product
          </button>
        </div>
        <div className="products-center">
          <input
            type="search"
            className="product-search"
            placeholder="Search product..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {deleteError && (
          <div className="delete-error">Couldn't delete. Try Again.</div>
        )}
        <div className="products-bottom">
          <DataGrid
            rows={query ? filteredProducts : products}
            loading={loading || deleting}
            columns={columns.concat(actionColumn)}
            pageSize={10}
            getRowId={(row) => row._id}
            rowsPerPageOptions={[10]}
            rowHeight={70}
          ></DataGrid>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
