import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";
import { hideOverflow, setPosts, setMessage } from "../../actions";
import { ReactComponent as Home } from "./svg/home.svg";
import { ReactComponent as About } from "./svg/avatar.svg";
import { ReactComponent as CloseIcon } from "../../images/close-icon.svg";
import { HOME, ABOUT, ALL_POSTS, FAILURE } from "../../constants";
import axios from "axios";
import { useCallback } from "react";
import CustomButton from "../CustomButton";
import { bindActionCreators } from "redux";
import Attributions from "./attributions";
import { useSpring, animated } from "react-spring";

const mapStateToProps = (state) => ({
  page: state.page,
  isLandscape: state.isLandscape,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      hideOverflow: (confirm) => hideOverflow(confirm),
      setPosts: (posts) => setPosts(posts),
      setMessage: (message) => setMessage(message),
    },
    dispatch
  );

const Navbar = ({ page, posts, isLandscape, hideOverflow, setMessage }) => {
  const [activeNav, setActiveNav] = useState(false);

  const ref = useRef();

  const isActivePage = useCallback((p) => page === p, [page]);

  const orientedNavClass = useCallback(() => {
    if (isLandscape) return "navbar__items--landscape";
    else return "navbar__items--portrait";
  }, [isLandscape]);

  const [navLinks, setNavLinks] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    hideOverflow(activeNav);

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
  }, [hideOverflow, activeNav, posts, isActivePage, orientedNavClass]);

  const createLines = (n) => {
    let lines = [];
    for (let i = 0; i < n; i++) {
      lines.push(<div key={i} className="navbar__show-items--line"></div>);
    }
    return lines;
  };

  const handleDownloadCV = () => {
    setButtonLoading(true);
    axios({
      url: "/download/Resume.pdf",
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Niraj_Shrestha_Resume_2020.pdf");
        document.body.appendChild(link);
        link.click();
        setButtonLoading(false);
      })
      .catch((err) => {
        setButtonLoading(false);
        setMessage({ data: err.response.data, type: FAILURE });
      });
  };

  const fade = useSpring({ from: { opacity: 0 }, opacity: 1, delay: 200 });
  const showNav = useSpring({
    from: { transform: "translateX(-15rem)", opacity: 0 },
    transform:
      activeNav || isLandscape ? "translateX(0)" : "translateX(-15rem)",
    opacity: activeNav || isLandscape ? 1 : 0,
  });

  const handleNavShow = () => {
    setActiveNav(true);
    ref.current.focus();
  };

  return (
    <animated.nav className="navbar" style={fade}>
      <Link to="/" className="navbar__logo-wrapper">
        <img src={logo} className="navbar__logo" alt="NS logo" />
      </Link>
      {!isLandscape && (
        <div
          id="showItem"
          className="navbar__show-items"
          onClick={() => handleNavShow()}
        >
          {createLines(4)}
        </div>
      )}
      <animated.div
        style={showNav}
        className={orientedNavClass()}
        tabIndex={0}
        onBlur={() => setActiveNav(false)}
        ref={ref}
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
              onClick={() => ref.current.blur()}
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
            <CustomButton
              loading={buttonLoading}
              handleClick={handleDownloadCV}
              clsName={`${orientedNavClass()}__links-link--button`}
              text="Download CV"
              style={{ marginTop: "-5px" }}
            />
          </li>
        </ul>
        {!isLandscape && <Attributions />}
      </animated.div>
    </animated.nav>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
