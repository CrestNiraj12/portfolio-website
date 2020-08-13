import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { hideOverflow, setPosts } from "../../actions";
import { ReactComponent as Home } from "./svg/home.svg";
import { ReactComponent as About } from "./svg/candidate.svg";
import { ReactComponent as Download } from "./svg/download.svg";
import { ReactComponent as CloseIcon } from "../../images/close-icon.svg";
import { HOME, ABOUT, ALL_POSTS } from "../../constants";
import axios from "axios";
import { useCallback } from "react";

const mapStateToProps = (state) => ({
  page: state.page,
  isLandscape: state.isLandscape,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  hideOverflow: (confirm) => dispatch(hideOverflow(confirm)),
  setPosts: (posts) => dispatch(setPosts(posts)),
});

const Navbar = ({ page, posts, isLandscape, hideOverflow }) => {
  const [activeNav, setActiveNav] = useState(false);

  const isActivePage = useCallback((p) => page === p, [page]);

  const orientedNavClass = useCallback(() => {
    if (isLandscape) return "navbar__items--landscape";
    else return "navbar__items--portrait";
  }, [isLandscape]);

  const [navLinks, setNavLinks] = useState([]);

  useEffect(() => {
    const navStatus = document.getElementById("navStatus");
    if (activeNav) {
      navStatus.classList.remove("hide");
      navStatus.focus();
    } else navStatus.classList.add("hide");

    const links = [
      {
        Icon: Home,
        href: "/",
        className: `${orientedNavClass()}__links-link`,
        text: "Home",
        isActive: isActivePage(HOME),
      },
      {
        Icon: About,
        href: "/about",
        className: `${orientedNavClass()}__links-link`,
        text: "About",
        isActive: isActivePage(ABOUT),
      },
    ];

    if (posts !== null) {
      if (posts.length > 0)
        links.push({
          Icon: About,
          href: "/all/posts",
          className: `${orientedNavClass()}__links-link`,
          text: "Posts",
          isActive: isActivePage(ALL_POSTS),
        });
    } else
      axios.get("/posts/").then((p) => {
        setPosts(p.data);
      });

    setNavLinks(links);
  }, [activeNav, posts, isActivePage, orientedNavClass]);

  const createLines = (n) => {
    let lines = [];
    for (let i = 0; i < n; i++) {
      lines.push(<div key={i} className="navbar__show-items--line"></div>);
    }
    return lines;
  };

  const handleNavShow = (confirm) => {
    setActiveNav(confirm);
    hideOverflow(confirm);
  };

  const handleDownloadCV = () => {
    axios({
      url: "/download/CV.pdf",
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Niraj_Shrestha_CV_2020.pdf");
      document.body.appendChild(link);
      link.click();
    });
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
          {navLinks.map(({ Icon, href, className, text, isActive }) => (
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
          <li>
            <button
              className={`${orientedNavClass()}__links-link--button`}
              onClick={handleDownloadCV}
              title="Download CV"
            >
              <Download className="download__svg" title="Download CV" />{" "}
              {!isLandscape ? "Download CV" : "Resumé"}
            </button>
          </li>
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
