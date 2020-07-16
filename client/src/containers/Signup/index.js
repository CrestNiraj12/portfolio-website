import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { setPage } from "../../actions";

const Signup = () => {
  const [details, setDetails] = useState({});
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    store.dispatch(setPage(5));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") setRedirect("../user/dashboard");
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/auth/register", details)
      .then((res) => {
        console.log(res.data);
        const isAuthenticated = res.data.isAuthenticated;
        localStorage.setItem("isAuthenticated", isAuthenticated);
        if (isAuthenticated) setRedirect("../user/dashboard");
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="test">
      {redirect && <Redirect to={redirect} />}
      <h1>Signup Page</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          onChange={handleInputChange}
        />
        <p style={{ color: "#fff" }}>{details.fullname}</p>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <p style={{ color: "#fff" }}>{details.email}</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <p style={{ color: "#fff" }}>{details.password}</p>
        <select name="role" onChange={handleInputChange} value={details.value}>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        <p style={{ color: "#fff" }}>{details.role}</p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Signup;
