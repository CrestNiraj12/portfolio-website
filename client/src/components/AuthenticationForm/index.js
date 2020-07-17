import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { setPage } from "../../actions";
import { ReactComponent as EyeIcon } from "./eye.svg";
import { ReactComponent as EyeCloseIcon } from "./close-eye.svg";

const AuthenticationForm = ({ page, pageTitle }) => {
  const [details, setDetails] = useState({});
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    store.dispatch(setPage(page));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") setRedirect("../user/dashboard");
  }, [page]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/auth/${pageTitle}`, details)
      .then((res) => {
        const id = res.data.user.id;
        const isAuthenticated = res.data.user.isAuthenticated;
        localStorage.setItem("isAuthenticated", isAuthenticated);
        if (isAuthenticated) setRedirect(`../user/${id}/dashboard`);
      })
      .catch((err) => console.log("Error: " + err));
  };

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleShowPassword = (e) => {
    const passwordInput = document.getElementById("password");
    passwordInput.setAttribute("type", "text");
    document.getElementById("showPassword").style.display = "none";
    document.getElementById("hidePassword").style.display = "block";
  };

  const handleHidePassword = (e) => {
    const passwordInput = document.getElementById("password");
    passwordInput.setAttribute("type", "password");
    document.getElementById("showPassword").style.display = "block";
    document.getElementById("hidePassword").style.display = "none";
  };

  return (
    <main className="form__wrapper">
      {redirect && <Redirect to={redirect} />}
      <h1 style={{ textTransform: "capitalize" }}>{pageTitle}</h1>
      <form className="form__authentication" onSubmit={handleFormSubmit}>
        {page === 5 && (
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            onChange={handleInputChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
        />
        <div className="form__authentication-password">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <EyeIcon id="showPassword" onClick={handleShowPassword} />
          <EyeCloseIcon id="hidePassword" onClick={handleHidePassword} />
        </div>
        {page === 5 && (
          <select
            name="role"
            onChange={handleInputChange}
            value={details.value}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        )}

        <button>Submit</button>
        {page === 5 ? (
          <p>
            Already have an account? <Link to="./login">Log in</Link>
          </p>
        ) : (
          <p>
            Create an account? <Link to="./register">Sign up</Link>
          </p>
        )}
      </form>
    </main>
  );
};

export default AuthenticationForm;
