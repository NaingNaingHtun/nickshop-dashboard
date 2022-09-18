import React, { useState, useEffect } from "react";
import { isAdmin } from "../../authenticateUser";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import "./UserList.scss";
import UsersTable from "../UsersTable/UsersTable";
import api from "../../api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const navigate = useNavigate();
  isAdmin(navigate); //this page is only can be accessed only if the user the admin
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: ({ row }) => (
        <div className="action">
          <button className="delete" onClick={() => deleteUser(row._id)}>
            <DeleteIcon />
          </button>
          <button
            className="view"
            onClick={() => (window.location.href = `/users/${row._id}`)}
          >
            Details
          </button>
        </div>
      ),
    },
  ];

  //===========================FUNCTIONS========================
  const getUsers = async () => {
    setLoading(true);
    await api
      .get(
        "/users/",

        {
          headers: {
            authorization: "Bearer " + user.accessToken,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setUsers(res.data);
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorMessage("Cannot connect to the server");
      });
  };

  //delete user
  const deleteUser = async (id) => {
    await api
      .delete(`/users/${id}`, {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      })
      .then(() => {
        //after deleting the uesr, we need to get all the users back
        getUsers();
        setError(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
        setErrorMessage("Couldn't Delete User. Try again later");
      });
  };
  //===========================EFFECTS==========================
  //get all the users
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="userlist">
      <SideBar />
      <div className="usersContainer">
        <NavBar />
        <div className="add-new-container">
          <div className="title">
            <span>Customers:</span>
            <h3>202</h3>
          </div>
          {error && <div className="error">{errorMessage}</div>}
        </div>
        <UsersTable
          users={users}
          loading={loading}
          actionColumn={actionColumn}
        />
      </div>
    </div>
  );
};

export default UserList;
