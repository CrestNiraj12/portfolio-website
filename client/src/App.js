import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Contact from "./containers/Contact";
import Portfolio from "./containers/Portfolio";
import Post from "./containers/Post";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./styles/css/App.css";
import "./styles/css/style.comp.css";
import store from "./store";
import { activeNav } from "./actions";
import { isLandscape } from "./actions/index";

import PageNotFound from "./components/PageNotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Dashboard from "./containers/Dashboard";

function App() {
  const state = store.getState();

  useEffect(() => {
    store.dispatch(isLandscape(window.innerWidth > window.innerHeight));
  }, []);

  const routes = [
    { path: "/", component: Home, isExact: true },
    { path: "/contact", component: Contact, isExact: false },
    { path: "/portfolio", component: Portfolio, isExact: false },
    { path: "/posts/:id", component: Post, isExact: false },
    { path: "/auth/login", component: Login, isExact: true },
    { path: "/auth/register", component: Signup, isExact: true },
    { path: "/user/dashboard", component: Dashboard, isExact: false },
    { path: "*", component: PageNotFound, isExact: false },
  ];

  const handleClick = () => {
    store.dispatch(activeNav(false));
  };

  return (
    <Router>
      <Navbar page={state.page} />
      <div onClick={handleClick}>
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
