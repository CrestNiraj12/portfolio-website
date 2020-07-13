import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

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

import { ReactComponent as Preloader } from "./preloader.svg";

function App() {
  const state = store.getState();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    store.dispatch(isLandscape(window.innerWidth > window.innerHeight));
  }, []);

  const routes = [
    { path: "/", component: Home, isExact: true },
    { path: "/contact", component: Contact, isExact: false },
    { path: "/portfolio", component: Portfolio, isExact: false },
    { path: "/post/:id", component: Post, isExact: false },
  ];

  const handleClick = () => {
    store.dispatch(activeNav(false));
  };

  const handleBodyLoad = () => {
    const preloader = document.querySelector(".preloader__wrapper");
    if (preloader) preloader.style.opacity = 0;
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "visible";
    }, 500);
  };

  return (
    <Router>
      {isLoading && (
        <div className="preloader__wrapper">
          <Preloader className="preloader__content" />
        </div>
      )}
      <>
        <Navbar page={state.page} />
        <div onClick={handleClick} onLoad={handleBodyLoad}>
          {routes.map(({ path, component, isExact }) => (
            <Route
              key={path}
              path={path}
              exact={isExact}
              component={component}
            />
          ))}
          <Footer />
        </div>
      </>
    </Router>
  );
}

export default App;
