import React from "react";

const Card = ({ url, image, alt, title, desc, linkText }) => {
  return (
    <div style={{ padding: "4em 0" }}>
      <a className="card" href={url}>
        <div className="card__img-wrapper">
          <img src={image} alt={alt} />
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
