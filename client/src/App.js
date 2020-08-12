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

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  page: state.page,
  dialogShow: state.dialog.show,
  overflowHidden: state.overflowHidden,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      isLandscape: (confirm) => isLandscape(confirm),
    },
    dispatch
  );

const App = ({ page, overflowHidden, isLandscape, dialogShow }) => {
  useEffect(() => {
    if (overflowHidden) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";

    isLandscape(window.innerWidth > window.innerHeight);
  }, [page, isLandscape, overflowHidden]);

  const routes = [
    { path: "/about", component: About, isExact: false },
    { path: "/posts/update/:postId", component: EditPost, isExact: false },
    { path: "/posts/:postPath", component: Post, isExact: false },
    { path: "/auth/login", component: Login, isExact: true },
    { path: "/auth/register", component: Signup, isExact: true },
    {
      path: "/auth/password/recover",
      component: ConfirmRecoverPassword,
      isExact: false,
    },
    { path: "/user/dashboard", component: Dashboard, isExact: false },
    { path: "/posts", component: Posts, isExact: false },
    { path: "/users", component: Users, isExact: false },
    { path: "/user/addpost", component: AddPost, isExact: false },
    { path: "/user/confirm/:token", component: ConfirmMail, isExact: false },
    {
      path: "/password/recover/token/:token",
      component: ResetPassword,
      isExact: false,
    },
    { path: "*", component: Home, isExact: false },
  ];

  return (
    <>
      <Flash />
      {dialogShow && <Dialog />}

      <Router>
        {[HOME, ABOUT, ALL_POSTS, POST].includes(page) && <Navbar />}
        <Switch>
          {routes.map(({ path, component, isExact }) => (
            <Route
              key={path}
              path={path}
              exact={isExact}
              component={component}
            />
          ))}
        </Switch>
      </Router>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
