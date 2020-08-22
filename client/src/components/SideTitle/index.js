import React, { useEffect } from "react";
import { ReactComponent as Arrow } from "../../images/arrow.svg";
import { useSpring, animated } from "react-spring";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const SideTitle = ({ text, color, isLandscape }) => {
  const [{ x }, set] = useSpring(() => ({
    x: [-100, 0],
  }));

  useEffect(() => {
    set({ x: [0, isLandscape ? 270 : 0] });
  }, [set, isLandscape]);

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
          (t, r) => `translateX(${t}px) rotate(${r}deg)`
        ),
      }}
    >
      {text} <Arrow className={`side__title-${color.toLowerCase()}__arrow`} />
    </animated.aside>
  );
};

export default connect(mapStateToProps)(SideTitle);
