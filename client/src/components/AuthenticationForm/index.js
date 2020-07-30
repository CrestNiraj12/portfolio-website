import React, { useEffect, useState } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import axios from "axios";
import { ReactComponent as EyeIcon } from "./eye.svg";
import { ReactComponent as EyeCloseIcon } from "./close-eye.svg";
import {
  FAILURE,
  PATTERN,
  EMAIL_PATTERN,
  ADMIN,
  EDITOR,
  TESTER,
  PASSWORD_WARNING,
  SUCCESS,
} from "../../constants";

const AuthenticationForm = ({ pageTitle, setPage }) => {
  var history = useHistory();
  const [details, setDetails] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [message, setMessage] = useState({});

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") setRedirect(`/user/dashboard`);

    axios
      .get("/user/all")
      .then((users) => {
        setUsersCount(users.data.length);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/auth/${pageTitle}`, details)
      .then((res) => {
        if (pageTitle === "login") {
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("id", res.data.user.id);
        }

        if (pageTitle === "login") setRedirect("/user/dashboard");

        history.push({
          pathname: pageTitle === "login" ? "/user/dashboard" : "/auth/login",
          state: { message: res.data.message, status: SUCCESS },
        });
      })
      .catch((err) => {
        setMessage({ data: err.response.data, type: FAILURE });
      });
  };

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleShowPassword = (show) => {
    const passwordInput = document.getElementById("password");
    passwordInput.setAttribute("type", show ? "text" : "password");
    document.getElementById("showPassword").style.display = show
      ? "none"
      : "block";
    document.getElementById("hidePassword").style.display = show
      ? "block"
      : "none";
  };

  return (
    <>
      <div className="flash__wrapper">
        <p className={`flash__message ${message.type}`}>{message.data}</p>
      </div>
      <main className="authentication">
        <div className="form__wrapper">
          {redirect && <Redirect to={redirect} />}
          <h1 style={{ textTransform: "capitalize" }}>{pageTitle}</h1>
          <form className="form__authentication" onSubmit={handleFormSubmit}>
            {pageTitle === "register" && (
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                onChange={handleInputChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              pattern={EMAIL_PATTERN}
              title="Enter a valid email address!"
              onChange={handleInputChange}
              required
            />
            <div className="form__authentication-password">
              <input
                type="password"
                name="password"
                id="password"
                minLength="8"
                pattern={PATTERN}
                title={PASSWORD_WARNING}
                placeholder="Password"
                onChange={handleInputChange}
                required
              />
              <EyeIcon
                id="showPassword"
                onClick={() => handleShowPassword(true)}
              />
              <EyeCloseIcon
                id="hidePassword"
                onClick={() => handleShowPassword(false)}
              />
            </div>
            {pageTitle === "register" && (
              <select
                name="role"
                onChange={handleInputChange}
                value={details.value}
                required
              >
                <option value="">Select Role</option>
                {usersCount === 0 && <option value={ADMIN}>Admin</option>}
                <option value={EDITOR}>Editor</option>
                <option value={TESTER}>Tester</option>
              </select>
            )}
            <button>Submit</button>
            {pageTitle === "register" ? (
              <p>
                Already have an account? <Link to="./login">Log in</Link>
              </p>
            ) : (
              <>
                <p>
                  Create an account? <Link to="./register">Sign up</Link>
                </p>
                <p>
                  Forgot password? <Link to="./password/recover">Recover</Link>
                </p>
              </>
            )}
            <p style={{ fontSize: "0.6em" }}>
              <a
                href="https://iconscout.com/icons/eye"
                target="_blank"
                rel="noopener noreferrer"
              >
                Eye Icon
              </a>{" "}
              by{" "}
              <a
                href="https://iconscout.com/contributors/dario-ferrando"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dario Ferrando
              </a>
            </p>
          </form>
        </div>
      </main>
    </>
  );
};

export default AuthenticationForm;
