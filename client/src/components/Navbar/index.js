import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { activeNav, hideOverflow } from "../../actions";
import { ReactComponent as Home } from "./home.svg";
import { ReactComponent as Contact } from "./call.svg";
import { ReactComponent as Portfolio } from "./candidate.svg";
import { ReactComponent as CloseIcon } from "./close-icon.svg";
import { HOME, CONTACT, PORTFOLIO } from "../../constants";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => ({
  page: state.page,
  navActive: state.activeNav,
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      activeNav: (confirm) => activeNav(confirm),
      hideOverflow: (hide) => hideOverflow(hide),
    },
    dispatch
  );

const Navbar = ({ page, navActive, isLandscape, activeNav }) => {
  useEffect(() => {
    const navStatus = document.getElementById("navStatus");
    navActive
      ? navStatus.classList.remove("hide")
      : navStatus.classList.add("hide");
  }, [navActive]);

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
      isActive: isActivePage(HOME),
      button: false,
    },
    {
      Icon: Contact,
      href: "/contact",
      className: `${orientedNavClass()}-link`,
      text: "Contact",
      isActive: isActivePage(CONTACT),
      button: false,
    },
    {
      Icon: Portfolio,
      href: "/portfolio",
      className: `${orientedNavClass()}-link--button`,
      text: "Portfolio",
      isActive: isActivePage(PORTFOLIO),
      button: true,
    },
  ];

  const handleNavShow = (confirm) => {
    activeNav(confirm);
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
      <ul className={orientedNavClass() + " hide"} id="navStatus">
        <Link to="/">
          <img
            src={logo}
            className={`${orientedNavClass()}--logo navbar__logo`}
            alt="NS logo"
          />
        </Link>
        {!isLandscape && (
          <CloseIcon
            className="navbar__hide-items"
            onClick={() => handleNavShow(false)}
          />
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
      </ul>
    </nav>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
