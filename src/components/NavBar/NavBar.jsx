import { useRef, useState } from "react";
import "./NavBar.scss";
import MenuIcon from "@mui/icons-material/Menu";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { Avatar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const NavBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef();
  const logout = () => {
    sessionStorage.setItem("uesr", null);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <h1 className="logo-name">Nick Shop</h1>
      <div>
        <MenuIcon
          fontSize="large"
          className="icon"
          onClick={() => setOpen(true)}
          ref={anchorRef}
        />
        <ControlledMenu
          anchorRef={anchorRef}
          state={open ? "open" : "closed"}
          transition
          onClose={() => setOpen(false)}
        >
          <div className="account-container">
            <Avatar />
            <span className="greeting">Welcome, Admin</span>
            <h1>Nick Hassan</h1>
          </div>
          <MenuItem>
            <Link to="/">Orders</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/products">Products</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/users">Customers</Link>
          </MenuItem>
          <button className="logout" onClick={logout}>
            Log Out
          </button>
        </ControlledMenu>
      </div>
    </div>
  );
};

export default NavBar;
