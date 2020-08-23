import React, { useEffect } from "react";
import { ReactComponent as Arrow } from "../../images/arrow.svg";
import { useSpring, animated } from "react-spring";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const SideTitle = ({ text, color, isLandscape }) => {
  const [{ x }, set] = useSpring(() => ({
    x: [-500],
    config: { mass: 5, tension: 1500, friction: 100 },
  }));

  useEffect(() => {
    set({ x: [0] });
  }, [set]);

  const leftSlide = useSpring({
    from: {
      opacity: 0,
    },
    opacity: 1,
  });

  return (
    <animated.aside
      className={`side__title-${color.toLowerCase()}`}
      style={{
        ...leftSlide,
        transform: x.interpolate(
          (t) => `translateX(${t}px) rotate(${isLandscape ? 270 : 0}deg)`
        ),
      }}
    >
      {text} <Arrow className={`side__title-${color.toLowerCase()}__arrow`} />
    </animated.aside>
  );
};

export default connect(mapStateToProps)(SideTitle);
