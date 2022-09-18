import React, { useEffect, useState } from "react";
import "./login.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import api from "../../api";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [logging, setLogging] = useState(false);
  const handleSubmit = async (e) => {
    setLogging(true);
    e.preventDefault();
    await api
      .post("/auth/login", { email, password })
      .then((res) => {
        setLogging(false);
        if (res.data.isAdmin) {
          navigate("/");
          sessionStorage.setItem("user", JSON.stringify(res.data));
        } else {
          setError(true);
          setLogging(false);
          setErrorMessage("Unauthorized User. You are not admin.");
        }
      })
      .catch((err) => {
        setLogging(false);
        setError(true);
        if (err.response.status === 401) {
          setErrorMessage("Incorrect email or password");
        }
        if (err.response.status === 0) {
          setErrorMessage("Cannot connect to the server");
        }

        console.log(err);
      });
  };
  useEffect(() => {
    setError(false);
  }, [email, password]);

  return (
    <div className="login-container">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <div className="greeting">
            <AccountCircleIcon style={{ width: "50px", height: "50px" }} />
            {error ? (
              <div className="error">
                <ReportProblemIcon /> {errorMessage}
              </div>
            ) : (
              <span>Welcome Admin, Please Login</span>
            )}
          </div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required={true}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{logging ? "Logging..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
