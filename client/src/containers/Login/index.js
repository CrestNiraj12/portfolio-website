import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { setPage } from "../../actions";

const Login = (props) => {
  const [creds, setCreds] = useState({});
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    store.dispatch(setPage(4));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") setRedirect("../user/dashboard");
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/login", creds)
      .then((res) => {
        console.log(res.data);
        const isAuthenticated = res.data.user.isAuthenticated;
        localStorage.setItem("isAuthenticated", isAuthenticated);
        if (isAuthenticated) setRedirect("../user/dashboard");
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleInputChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <div className="test">
      {redirect && <Redirect to={redirect} />}
      <h1>Login Page</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Login;
