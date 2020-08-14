import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Home from "./containers/Home";
import Posts from "./containers/Posts";
import Post from "./containers/Post";
import Flash from "./components/Flash";
import Navbar from "./components/Navbar";

import "./styles/css/App.css";
import "./styles/css/style.comp.css";
import { isLandscape } from "./actions";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Users from "./containers/Users";
import { HOME, ALL_POSTS, POST, ABOUT } from "./constants";
import { bindActionCreators } from "redux";
import Dialog from "./components/Dialog";
import AddPost from "./containers/AddPost";
import EditPost from "./containers/EditPost";
import ConfirmMail from "./containers/ConfirmMail";
import ConfirmRecoverPassword from "./containers/ConfirmRecoverPassword";
import ResetPassword from "./containers/ResetPassword";
import About from "./containers/About";
import Preloader from "./components/Preloader";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  page: state.page,
  dialogShow: state.dialog.show,
  overflowHidden: state.overflowHidden,
  loading: state.loading,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      isLandscape: (confirm) => isLandscape(confirm),
    },
    dispatch
  );

const App = ({ page, overflowHidden, isLandscape, dialogShow, loading }) => {
  useEffect(() => {
    if (overflowHidden) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";

    isLandscape(window.innerWidth > window.innerHeight);
  }, [page, isLandscape, overflowHidden]);

  const routes = [
    { path: "/about", Component: About, isExact: true },
    { path: "/posts/update/:postId", Component: EditPost, isExact: false },
    { path: "/posts/:postPath", Component: Post, isExact: true },
    { path: "/auth/login", Component: Login, isExact: true },
    { path: "/auth/register", Component: Signup, isExact: true },
    {
      path: "/auth/password/recover",
      Component: ConfirmRecoverPassword,
      isExact: false,
    },
    { path: "/user/dashboard", Component: Dashboard, isExact: false },
    { path: "/posts", Component: Posts, isExact: true },
    { path: "/users", Component: Users, isExact: true },
    { path: "/user/addpost", Component: AddPost, isExact: false },
    { path: "/user/confirm/:token", Component: ConfirmMail, isExact: true },
    {
      path: "/password/recover/token/:token",
      Component: ResetPassword,
      isExact: false,
    },
    { path: "/", Component: Home, isExact: true },
    { path: "*", Component: Home, isExact: false },
  ];

  return (
    <>
      <Flash />
      {dialogShow && <Dialog />}

      {loading && <Preloader />}
      <Router>
        {[HOME, ABOUT, ALL_POSTS, POST].includes(page) && <Navbar />}
        <Switch>
          {routes.map(({ path, Component, isExact }) => (
            <Route
              key={path}
              path={path}
              exact={isExact}
              component={Component}
            />
          ))}
        </Switch>
      </Router>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
