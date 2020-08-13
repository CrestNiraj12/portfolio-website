import React, { useEffect, useState } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import axios from "axios";
import { ReactComponent as EyeIcon } from "./svg/eye.svg";
import { ReactComponent as EyeCloseIcon } from "./svg/close-eye.svg";
import {
  FAILURE,
  PATTERN,
  EMAIL_PATTERN,
  ADMIN,
  EDITOR,
  TESTER,
  PASSWORD_WARNING,
  SUCCESS,
  RECOVER_PASSWORD,
  RESET_PASSWORD,
  REGISTER,
  LOGIN,
} from "../../constants";
import { connect } from "react-redux";
import { setMessage, setIsLoadingPage } from "../../actions";

const mapDispatchToProps = (dispatch) => ({
  setMessage: (message) => dispatch(setMessage(message)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const AuthenticationForm = ({
  token,
  pageTitle,
  setMessage,
  setIsLoadingPage,
}) => {
  var history = useHistory();
  const [details, setDetails] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [resendLink, setResendLink] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setIsLoadingPage(true);
    if (pageTitle !== RESET_PASSWORD) {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") setRedirect(`/user/dashboard`);
    }
    if (pageTitle === REGISTER)
      axios
        .get("/user/all")
        .then((users) => {
          setUsersCount(users.data.length);
          setIsLoadingPage(false);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    else setIsLoadingPage(false);
  }, [pageTitle, setIsLoadingPage]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/auth/${pageTitle}`, details)
      .then((res) => {
        if (pageTitle === LOGIN) {
          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("id", res.data.user.id);
        }

        if (pageTitle === LOGIN) setRedirect("/user/dashboard");

        history.push({
          pathname: pageTitle === LOGIN ? "/user/dashboard" : "/auth/login",
          state: { message: res.data.message, status: SUCCESS },
        });
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 403) {
          setUserId(err.response.data.id);
          setResendLink(true);
          setMessage({ data: err.response.data.message, type: FAILURE });
        } else {
          setResendLink(false);
          setMessage({ data: err.response.data, type: FAILURE });
        }
      });
  };

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleShowPassword = (
    show,
    inputId = "password",
    showId = "showPassword",
    hideId = "hidePassword"
  ) => {
    const passwordInput = document.getElementById(inputId);
    passwordInput.setAttribute("type", show ? "text" : "password");
    document.getElementById(showId).style.display = show ? "none" : "block";
    document.getElementById(hideId).style.display = show ? "block" : "none";
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    const email = details.email;
    axios
      .post("/auth/recoverPassword", { email })
      .then((res) => {
        history.push({
          pathname: "../login",
          state: { message: res.data, status: SUCCESS },
        });
      })
      .catch((err) => {
        console.log(err);
        history.push({
          state: { message: err.response.data, status: FAILURE },
        });
      });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const newPassword = details.newPassword;
    const confirmPassword = details.confirmPassword;
    console.log(token);
    axios
      .put(`/user/changePassword/${token}`, {
        newPassword,
        confirmPassword,
      })
      .then((res) => {
        history.push({
          pathname: "/auth/login",
          state: { message: res.data, status: SUCCESS },
        });
      })
      .catch((err) => {
        console.log(err.response);
        setMessage({ data: err.response.data, type: FAILURE });
      });
  };

  const handleResendLink = (e) => {
    e.preventDefault();

    axios
      .get(`/auth/resendLink/activation/${userId}`)
      .then((res) => {
        console.log(res);
        setMessage({ data: res.data, type: SUCCESS });
      })
      .catch((err) => {
        console.log(err.response);
        setMessage({ data: err.response.data, type: FAILURE });
      });
  };

  return (
    <main className="authentication">
      <div className="form__wrapper">
        {redirect && <Redirect to={redirect} />}
        <h1 style={{ textTransform: "capitalize" }}>{pageTitle}</h1>
        <form
          className="form__authentication"
          onSubmit={
            pageTitle === RECOVER_PASSWORD
              ? handleRecoverPassword
              : pageTitle === RESET_PASSWORD
              ? handleResetPassword
              : handleFormSubmit
          }
        >
          {pageTitle === REGISTER && (
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              onChange={handleInputChange}
              required
            />
          )}
          {pageTitle === RECOVER_PASSWORD && (
            <p>
              Enter your email address so that we could send a password reset
              link to you.
            </p>
          )}
          {pageTitle !== RESET_PASSWORD && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              pattern={EMAIL_PATTERN}
              title="Enter a valid email address!"
              onChange={handleInputChange}
              required
            />
          )}
          {pageTitle !== RECOVER_PASSWORD && (
            <div className="form__authentication-password">
              <input
                type="password"
                name={pageTitle === RESET_PASSWORD ? "newPassword" : "password"}
                id="password"
                minLength="8"
                pattern={PATTERN}
                title={PASSWORD_WARNING}
                placeholder={
                  pageTitle === RESET_PASSWORD ? "New Password" : "Password"
                }
                onChange={handleInputChange}
                required
              />
              <EyeIcon
                id="showPassword"
                className="form__authentication-password__show"
                onClick={() => handleShowPassword(true)}
              />
              <EyeCloseIcon
                id="hidePassword"
                className="form__authentication-password__hide"
                onClick={() => handleShowPassword(false)}
              />
            </div>
          )}
          {pageTitle === RESET_PASSWORD && (
            <div className="form__authentication-password">
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                minLength="8"
                pattern={PATTERN}
                title={PASSWORD_WARNING}
                placeholder="Confirm Password"
                onChange={handleInputChange}
                required
              />
              <EyeIcon
                id="showConfirmPassword"
                className="form__authentication-password__show"
                onClick={() =>
                  handleShowPassword(
                    true,
                    "confirmPassword",
                    "showConfirmPassword",
                    "hideConfirmPassword"
                  )
                }
              />
              <EyeCloseIcon
                id="hideConfirmPassword"
                className="form__authentication-password__hide"
                onClick={() =>
                  handleShowPassword(
                    false,
                    "confirmPassword",
                    "showConfirmPassword",
                    "hideConfirmPassword"
                  )
                }
              />
            </div>
          )}
          {pageTitle === REGISTER && (
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
          <button>
            {pageTitle === RECOVER_PASSWORD
              ? "Recover Password"
              : pageTitle === RESET_PASSWORD
              ? "Reset Password"
              : pageTitle === REGISTER
              ? "Register"
              : "Login"}
          </button>
          {pageTitle === LOGIN && resendLink && (
            <p>
              Confirm your email address!{" "}
              <button onClick={handleResendLink}>Resend link</button>
            </p>
          )}
          {pageTitle === REGISTER ? (
            <p>
              Already have an account? <Link to="./login">Log in</Link>
            </p>
          ) : pageTitle === LOGIN ? (
            <>
              <p>
                Create an account? <Link to="./register">Sign up</Link>
              </p>
              <p>
                Forgot password? <Link to="./password/recover">Recover</Link>
              </p>
            </>
          ) : (
            pageTitle === RESET_PASSWORD && (
              <p>
                Go to Login Page? <Link to="/auth/login">Log in</Link>
              </p>
            )
          )}
          {pageTitle !== RECOVER_PASSWORD && (
            <>
              <p style={{ fontSize: "0.5em" }}>
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
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default connect(null, mapDispatchToProps)(AuthenticationForm);
