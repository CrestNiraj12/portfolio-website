import React from "react";
import InfoCard from "../InfoCard";
import { ReactComponent as Arrow } from "../../images/arrow.svg";

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
      <div className="footer__copy">
        <span>&copy; 2020 Niraj Shrestha</span>
        <span>|</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
