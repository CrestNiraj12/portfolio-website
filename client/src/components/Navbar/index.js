import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { hideOverflow } from "../../actions";
import { ReactComponent as Home } from "./svg/home.svg";
import { ReactComponent as About } from "./svg/candidate.svg";
import { ReactComponent as CloseIcon } from "../../images/close-icon.svg";
import { HOME, ABOUT } from "../../constants";

const mapStateToProps = (state) => ({
  page: state.page,
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) => ({
  hideOverflow: (confirm) => dispatch(hideOverflow(confirm)),
});

const Navbar = ({ page, isLandscape, hideOverflow }) => {
  const [activeNav, setActiveNav] = useState(false);

  useEffect(() => {
    const navStatus = document.getElementById("navStatus");
    if (activeNav) {
      navStatus.classList.remove("hide");
      navStatus.focus();
    } else navStatus.classList.add("hide");
  }, [activeNav]);

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
      className: `${orientedNavClass()}__links-link`,
      text: "Home",
      isActive: isActivePage(HOME),
      button: false,
    },
    {
      Icon: About,
      href: "/about",
      className: `${orientedNavClass()}__links-link`,
      text: "About",
      isActive: isActivePage(ABOUT),
      button: false,
    },
  ];

  const handleNavShow = (confirm) => {
    setActiveNav(confirm);
    hideOverflow(confirm);
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
          onClick={() => handleNavShow(true)}
        >
          {createLines(4)}
        </div>
      )}
      <div
        className={orientedNavClass() + " hide"}
        id="navStatus"
        tabIndex={0}
        onBlur={() => setTimeout(() => handleNavShow(false), 0)}
      >
        {!isLandscape && (
          <>
            <Link to="/">
              <img
                src={logo}
                className={`${orientedNavClass()}--logo navbar__logo`}
                alt="NS logo"
              />
            </Link>

            <CloseIcon
              className="navbar__hide-items"
              onClick={() => handleNavShow(false)}
            />
          </>
        )}
        <ul className={`${orientedNavClass()}__links`}>
          {navLinks.map(({ Icon, href, className, text, isActive, button }) => (
            <li key={href}>
              <Link className={className} to={href}>
                <Icon className={`${orientedNavClass()}__links--icon`} />

                <span
                  className={
                    isActive ? `${orientedNavClass()}__links-link--active` : ""
                  }
                >
                  {text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {!isLandscape && (
          <div
            className="attributions"
            style={{
              position: "absolute",
              bottom: "5%",
              textAlign: "left",
              fontSize: "0.5em",
            }}
          >
            <a
              href="https://iconscout.com/icons/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              home
            </a>{" "}
            by{" "}
            <a
              href="https://iconscout.com/contributors/oviyan"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vignesh Oviyan
            </a>
            <br />
            <a
              href="https://iconscout.com/icons/call"
              target="_blank"
              rel="noopener noreferrer"
            >
              Call
            </a>{" "}
            by{" "}
            <a
              href="https://iconscout.com/contributors/pocike"
              target="_blank"
              rel="noopener noreferrer"
            >
              Alpár - Etele Méder
            </a>
            <br />
            <a
              href="https://iconscout.com/icons/candidate"
              target="_blank"
              rel="noopener noreferrer"
            >
              Candidate
            </a>{" "}
            by{" "}
            <a
              href="https://iconscout.com/contributors/jemismali"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jemis Mali
            </a>{" "}
            on{" "}
            <a
              href="https://iconscout.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Iconscout
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
