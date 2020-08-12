import React from "react";
import { ReactComponent as Facebook } from "./svg/fb.svg";
import { ReactComponent as Instagram } from "./svg/insta.svg";
import { ReactComponent as Github } from "./svg/github.svg";

const InfoCard = () => (
  <div className="info__card" id="contact">
    <h1>
      Let's <span>Collab!</span>
    </h1>

    <div className="info__card--desc">
      <span>Niraj Shrestha</span>
      <span>Buddhanagar 44600</span>
      <span>New Baneshwor, Kathmandu</span>
    </div>
    <div className="info__card--social">
      <a
        href="https://www.facebook.com/crestniraz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="info__card--social-icon" />
      </a>
      <a
        href="https://www.instagram.com/crestniraz"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram className="info__card--social-icon" />
      </a>
      <a
        href="https://www.github.com/crestniraj12"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="info__card--social-icon" />
      </a>
    </div>
    <div className="info__card--contact">
      <div className="info__card--contact-mail">
        <p>Email</p>
        <a
          href="mailto:crestniraj@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="info__card--contact__mail-link"
        >
          <p>crestniraj@gmail.com</p>
        </a>
      </div>
      <div className="info__card--contact-call">
        <p>Phone</p>
        <a
          href="tel:+9779821911389"
          target="_blank"
          rel="noopener noreferrer"
          className="info__card--contact__call-link"
        >
          <p>+977 - 9821911389</p>
        </a>
      </div>
    </div>
  </div>
);

export default InfoCard;
