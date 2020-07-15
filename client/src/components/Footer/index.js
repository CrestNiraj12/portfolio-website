import React from "react";
import { Link } from "react-router-dom";
import InfoCard from "../InfoCard";
import { ReactComponent as Arrow } from "./arrow.svg";

const Footer = () => {
  const handleTopScroll = () => {
    window.scrollTo({
      top: -100,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer__content">
        <InfoCard />
        <div className="footer__go-top" onClick={handleTopScroll}>
          <Arrow className="footer__go-top--icon" />
          <span>Go North</span>
        </div>
      </div>
      <div className="footer__links">
        <Link className="footer__links--link" to="/">
          Terms {"&"} conditions
        </Link>
        <span>|</span>

        <Link className="footer__links--link" to="/">
          Privacy Policy
        </Link>
        <span>|</span>
        <Link className="footer__links--link" to="/">
          Cookies
        </Link>
        <span>|</span>
        <span className="footer__links--copy">&copy; 2020 Niraj Shrestha</span>
      </div>
    </footer>
  );
};

export default Footer;
