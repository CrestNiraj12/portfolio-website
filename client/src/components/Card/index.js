import React from "react";
import ImageOverlay from "../ImageOverlay";

const Card = ({ url, image, alt, title, desc, linkText }) => {
  const handleHideOverlay = (e) => {
    e.target.previousSibling.style.display = "none";
    e.target.style.visibility = "visible";
  };

  return (
    <div style={{ padding: "4em 0" }}>
      <a className="card" href={url}>
        <div className="card__img-wrapper">
          <ImageOverlay />
          <img src={image} alt={alt} onLoad={handleHideOverlay} />
        </div>
        <div className="card__content">
          <h2 className="card__content-title">{title}</h2>
          <p className="card__content-desc">{desc}</p>
          <span className="link-design">{linkText}</span>
        </div>
      </a>
    </div>
  );
};

export default Card;
