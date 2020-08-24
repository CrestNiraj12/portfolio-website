import React, { useState } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { useSpring, animated } from "react-spring";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const Collab = ({ isLandscape }) => {
  const [visible, setVisible] = useState(false);

  const handleScrollToContact = () => {
    window.scroll({
      top: document.querySelector(".footer").offsetTop,
      behavior: "smooth",
    });
  };

  const defaultSet = isLandscape ? "4em" : "2em";

  const increase = useSpring({
    from: { fontSize: defaultSet },
    fontSize: visible ? (isLandscape ? "2em" : "1em") : defaultSet,
    config: { mass: 5, tension: 1000, friction: 100 },
  });

  const decrease = useSpring({
    from: { fontSize: "0.5em" },
    fontSize: visible ? (isLandscape ? "2em" : "1em") : "0.5em",
    config: { mass: 5, tension: 1000, friction: 100 },
  });

  return (
    <VisibilitySensor
      onChange={(isVisible) => {
        if (!visible) setVisible(isVisible);
      }}
    >
      <section className="collab">
        <animated.p style={increase}>
          Let's get <span>started.</span>
        </animated.p>
        <animated.p style={decrease}>
          Keep in touch <span onClick={handleScrollToContact}>Contact me</span>
        </animated.p>
      </section>
    </VisibilitySensor>
  );
};

export default connect(mapStateToProps)(Collab);
