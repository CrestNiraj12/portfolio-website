import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Contact from "./containers/Contact";
import Portfolio from "./containers/Portfolio";
import Posts from "./containers/Posts";
import Post from "./containers/Post";

import Navbar from "./components/Navbar";

import "./styles/css/App.css";
import "./styles/css/style.comp.css";
import store from "./store";
import { isLandscape } from "./actions/index";

import PageNotFound from "./components/PageNotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Dashboard from "./containers/Dashboard";
import Users from "./containers/Users";

function App() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    store.dispatch(isLandscape(window.innerWidth > window.innerHeight));

    const state = store.getState();
    setPage(state.page);

    if (page === 0)
      document.querySelector(".navbar").style.position = "absolute";
    else if (![4, 5, 6, 7, 8].includes(page))
      document.querySelector(".navbar").style.position = "initial";
  }, [page]);

  const routes = [
    { path: "/", component: Home, isExact: true },
    { path: "/contact", component: Contact, isExact: false },
    { path: "/portfolio", component: Portfolio, isExact: false },
    { path: "/posts/:id", component: Post, isExact: false },
    { path: "/auth/login", component: Login, isExact: true },
    { path: "/auth/register", component: Signup, isExact: true },
    { path: "/user/:id/dashboard", component: Dashboard, isExact: false },
    { path: "/posts", component: Posts, isExact: false },
    { path: "/user/all", component: Users, isExact: false },
    { path: "*", component: PageNotFound, isExact: false },
  ];

  return (
    <Router>
      {![4, 5, 6, 7, 8].includes(page) && <Navbar page={page} />}
      <Switch>
        {routes.map(({ path, component, isExact }) => (
          <Route key={path} path={path} exact={isExact} component={component} />
        ))}
      </Switch>
    </Router>
  );
}

export default App;
