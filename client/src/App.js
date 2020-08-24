import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
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
import { useTransition, animated } from "react-spring";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  page: state.page,
  dialogShow: state.dialog.show,
  overflowHidden: state.overflowHidden,
  loading: state.loading,
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setIsLandscape: (confirm) => isLandscape(confirm),
    },
    dispatch
  );

const App = ({
  page,
  overflowHidden,
  setIsLandscape,
  isLandscape,
  dialogShow,
  loading,
}) => {
  useEffect(() => {
    if (overflowHidden) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "visible";

    setIsLandscape(window.innerWidth > window.innerHeight);
  }, [page, setIsLandscape, overflowHidden]);

  const routes = [
    { path: "/", Component: Home, isExact: true },
    { path: "/about", Component: About, isExact: false },
    { path: "/update/posts/:postId", Component: EditPost, isExact: true },
    { path: "/posts/:postPath", Component: Post, isExact: true },
    { path: "/auth/login", Component: Login, isExact: true },
    { path: "/auth/register", Component: Signup, isExact: true },
    {
      path: "/auth/password/recover",
      Component: ConfirmRecoverPassword,
      isExact: true,
    },
    { path: "/user/dashboard", Component: Dashboard, isExact: true },
    { path: "/posts", Component: Posts, isExact: true },
    { path: "/users", Component: Users, isExact: true },
    { path: "/user/addpost", Component: AddPost, isExact: true },
    { path: "/user/confirm/:token", Component: ConfirmMail, isExact: true },
    {
      path: "/password/recover/token/:token",
      Component: ResetPassword,
      isExact: true,
    },
    { path: "/*", Component: Home, isExact: false },
  ];

  const location = useLocation();
  const transitions = useTransition(location, (location) => location.pathname, {
    from: {
      opacity: 0,
      transform: "translateX(100px)",
    },
    enter: {
      opacity: 1,
      transform: "translateX(0)",
    },
    leave: {
      opacity: 0,
      transform: "translateX(-100px)",
    },
  });

  return (
    <>
      <Flash />
      {dialogShow && <Dialog />}
      {loading && isLandscape && <Preloader />}
      {[HOME, ABOUT, ALL_POSTS, POST].includes(page) && <Navbar />}
      {transitions.map(({ item, props, key }) => (
        <animated.div
          key={key}
          style={{
            ...props,
            position: "absolute",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {loading && !isLandscape && <Preloader />}
          <Switch location={item}>
            {routes.map(({ path, Component, isExact }) => (
              <Route
                key={path}
                path={path}
                exact={isExact}
                component={Component}
              />
            ))}
          </Switch>
        </animated.div>
      ))}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
