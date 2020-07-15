import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import store from "../../store";
import { activeNav } from "../../actions";
import { ReactComponent as Home } from "./home.svg";
import { ReactComponent as Contact } from "./call.svg";
import { ReactComponent as Portfolio } from "./candidate.svg";
import { ReactComponent as CloseIcon } from "./close-icon.svg";

const Navbar = ({ page }) => {
  const [navActive, setNavActive] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const handleNavActive = useCallback(() => {
    const body = document.body;
    const navStatus = document.getElementById("navStatus");
    if (navActive) {
      navStatus.classList.remove("hide");
      body.style.overflow = "hidden";
    } else {
      navStatus.classList.add("hide");
      body.style.overflow = "visible";
    }
  }, [navActive]);

  useEffect(() => {
    store.subscribe(() => {
      const state = store.getState();
      setNavActive(state.activeNav);
      setIsLandscape(state.isLandscape);
    });
    handleNavActive();
  }, [handleNavActive]);

  const isActivePage = (p) => page === p;

  const createLines = (n) => {
    let lines = [];
    for (let i = 0; i < n; i++) {
      lines.push(<div key={i} className="navbar__show-items--line"></div>);
    }
    return lines;
  };

  const orientedNavClass = () => {
    if (isLandscape) return "navbar__items--landscape";
    else return "navbar__items--portrait";
  };

  const navLinks = [
    {
      Icon: Home,
      href: "/",
      className: `${orientedNavClass()}-link`,
      text: "Home",
      isActive: isActivePage(0),
      button: false,
    },
    {
      Icon: Contact,
      href: "/contact",
      className: `${orientedNavClass()}-link`,
      text: "Contact",
      isActive: isActivePage(1),
      button: false,
    },
    {
      Icon: Portfolio,
      href: "/portfolio",
      className: `${orientedNavClass()}-link--button`,
      text: "Portfolio",
      isActive: isActivePage(2),
      button: true,
    },
  ];

  const handleNavShow = () => {
    store.dispatch(activeNav(true));
  };

  const handleNavHide = () => {
    store.dispatch(activeNav(false));
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo-wrapper">
        <img src={logo} className="navbar__logo" alt="NS logo" />
      </Link>
      {!isLandscape && (
        <div
          id="showItem"
          className="navbar__show-items"
          onClick={handleNavShow}
        >
          {createLines(4)}
        </div>
      )}
      <ul className={orientedNavClass() + " hide"} id="navStatus">
        <Link to="/">
          <img
            src={logo}
            className={`${orientedNavClass()}--logo navbar__logo`}
            alt="NS logo"
          />
        </Link>
        {!isLandscape && (
          <CloseIcon className="navbar__hide-items" onClick={handleNavHide} />
        )}
        {navLinks.map(({ Icon, href, className, text, isActive, button }) => (
          <li key={href}>
            <Link
              className={
                button && isActive
                  ? `${className} ${className}--active`
                  : className
              }
              to={href}
            >
              <Icon className={`${orientedNavClass()}--icon`} />

              <span
                className={
                  (isActive && !isLandscape) ||
                  (isActive && isLandscape && !button)
                    ? `${orientedNavClass()}--active`
                    : ""
                }
              >
                {text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
