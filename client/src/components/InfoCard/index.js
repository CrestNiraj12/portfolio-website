import React from "react";
import { ReactComponent as Facebook } from "./fb.svg";
import { ReactComponent as Instagram } from "./insta.svg";
import { ReactComponent as Github } from "./github.svg";
import { ReactComponent as Mail } from "./mail.svg";
import { ReactComponent as Call } from "./call.svg";

const InfoCard = () => (
  <div className="info__card">
    <div className="info__card--social">
      <a
        href="https://www.facebook.com/crestniraz"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: "15%" }}
      >
        <Facebook className="info__card--social-icon" />
      </a>
      <a
        href="https://www.instagram.com/crestniraz"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: "15%" }}
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
    <div className="info__card--desc">
      <span>Niraj Shrestha</span>
      <span>Buddhanagar, Kathmandu</span>
    </div>
    <div className="info__card--contact">
      <div className="info__card--contact-mail">
        <Mail className="info__card--icon" />
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
        <Call className="info__card--icon" />
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
