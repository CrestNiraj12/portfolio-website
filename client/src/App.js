import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Home from "./containers/Home";
import Contact from "./containers/Contact";
import Portfolio from "./containers/Portfolio";
import Posts from "./containers/Posts";
import Post from "./containers/Post";

import Navbar from "./components/Navbar";

import "./styles/css/App.css";
import "./styles/css/style.comp.css";
import { isLandscape, confirmAction, showDialog } from "./actions";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Users from "./containers/Users";
import { LOGIN, REGISTER, DASHBOARD, USERS, POSTS, HOME } from "./constants";
import { hideOverflow } from "./actions";
import { bindActionCreators } from "redux";
import Dialog from "./components/Dialog";

const mapStateToProps = (state) => ({
  page: state.page,
  dialog: state.dialog,
  overflowHidden: state.overflowHidden,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      isLandscape: (confirm) => isLandscape(confirm),
      hideOverflow: (hide) => hideOverflow(hide),
      confirmAction: (confirm) => confirmAction(confirm),
      showDialog: (message, show) => showDialog(message, show),
    },
    dispatch
  );

const App = ({
  page,
  dialog,
  overflowHidden,
  isLandscape,
  hideOverflow,
  confirmAction,
  showDialog,
}) => {
  useEffect(() => {
    if (page === HOME)
      document.querySelector(".navbar").style.position = "absolute";

    if (overflowHidden) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";

    isLandscape(window.innerWidth > window.innerHeight);
    hideOverflow(dialog.show);
  }, [page, dialog.show, hideOverflow, isLandscape, overflowHidden]);

  const routes = [
    { path: "/contact", component: Contact, isExact: false },
    { path: "/portfolio", component: Portfolio, isExact: false },
    { path: "/posts/:id", component: Post, isExact: false },
    { path: "/auth/login", component: Login, isExact: true },
    { path: "/auth/register", component: Signup, isExact: true },
    { path: "/user/:id/dashboard", component: Dashboard, isExact: false },
    { path: "/posts", component: Posts, isExact: false },
    { path: "/user/all", component: Users, isExact: false },
    { path: "*", component: Home, isExact: false },
  ];

  const handleConfirmation = (confirm) => {
    confirmAction(confirm);
    showDialog({}, false);
  };

  return (
    <>
      {dialog.show && (
        <Dialog dialog={dialog} handleConfirmation={handleConfirmation} />
      )}

      <Router>
        {![0, LOGIN, REGISTER, DASHBOARD, USERS, POSTS].includes(page) && (
          <Navbar />
        )}
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
