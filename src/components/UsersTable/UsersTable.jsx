import React from "react";
import "./userstable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
const columns = [
  { field: "_id", headerName: "ID", width: 200 },
  {
    field: "username",
    headerName: "Name",
    width: 150,
  },
  ,
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "address", headerName: "Address", width: 250 },
];
const UsersTable = ({ users, loading, actionColumn }) => {
  const navigate = useNavigate();
  return (
    <div className="datatable">
      <DataGrid
        loading={loading}
        rows={users}
        columns={columns.concat(actionColumn)}
        pageSize={10}
        getRowId={(row) => row._id}
        onRowClick={(param) => navigate("/users/" + param.row._id)}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
};

export default UsersTable;
