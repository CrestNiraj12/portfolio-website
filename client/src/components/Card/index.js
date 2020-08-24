import React from "react";
import ImageOverlay from "../ImageOverlay";
import { useSpring, animated } from "react-spring";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const Card = ({
  url,
  image,
  alt,
  title,
  desc,
  linkText,
  translateY,
  isLandscape,
}) => {
  const defaultSet = isLandscape ? [0, 50, 0.75] : [0, 0, 1];

  const [props, setProps] = useSpring(() => ({
    xys: defaultSet,
    config: { mass: 5, tension: 800, friction: 50 },
  }));

  const calc = (x, y) => [
    -(y - window.innerHeight / 2) / 25,
    (x - window.innerWidth / 2) / 25,
    1,
  ];

  const trans = (x, y, s) =>
    `perspective(800px) rotateX(${x}deg) rotateY(${y}deg) scale(${s}) translateY(${
      translateY && isLandscape ? translateY : 0
    }em)`;

  const handleHideOverlay = (e) => {
    e.target.previousSibling.style.display = "none";
    e.target.style.visibility = "visible";
  };

  return (
    <animated.div
      style={{
        padding: "4em 0",
        transform: props.xys.interpolate(trans),
      }}
      onMouseMove={({ clientX: x, clientY: y }) =>
        setProps({ xys: calc(x, y) })
      }
      onMouseLeave={() => setProps({ xys: defaultSet })}
    >
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
    </animated.div>
  );
};

export default connect(mapStateToProps)(Card);
