import React, { useState, useEffect } from "react";
import { useSpring, animated, useTransition, useTrail } from "react-spring";
import { connect } from "react-redux";

const interests = [
  "Programming",
  "Travelling",
  "FPS Games",
  "Animals",
  "Food",
  "Testing new features",
  "Learning new things",
  "Challenges",
  "Binging Anime",
  "Marvel",
];

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const Header = ({ isLandscape }) => {
  const [index, setIndex] = useState(0);

  const text = `Nepali Freelancer`.split("");

  useEffect(() => {
    var mounted = true;

    setTimeout(() => {
      if (mounted) setIndex(index < interests.length - 1 ? index + 1 : 0);
    }, 2500);

    return () => (mounted = false);
  }, [index]);

  const props = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    opacity: 1,
    transform: "translateY(0px)",
    delay: 500,
  });

  const leftSlide = useSpring({
    from: { opacity: 0, transform: "translateX(-100px)" },
    opacity: 1,
    transform: "translateX(0)",
    delay: 1000,
  });

  const changeTextTransition = useTransition(index, (p) => p, {
    from: {
      opacity: 0,
      width: "max-content",
      transform: "translateY(20px)",
    },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
  });

  const trailText = useTrail(text.length, {
    config: { mass: 5, tension: 1500, friction: isLandscape ? 100 : 110 },
    from: {
      display: "inline-block",
      whiteSpace: "break-spaces",
      opacity: 0,
      transform: "translateY(20px)",
    },
    opacity: 1,
    transform: "translateY(0)",
  });

  return (
    <header className="home__header">
      <div className="home__header-content" style={props}>
        <animated.p style={props}>I'm Niraj Shrestha</animated.p>
        <animated.p style={props}>
          A{" "}
          {trailText.map((props, index) =>
            text[index] === " " && !isLandscape ? (
              <br key={index} />
            ) : (
              <animated.span
                style={props}
                key={index}
                className="emphasis-color-pink"
              >
                {text[index]}
              </animated.span>
            )
          )}
        </animated.p>
        <animated.p style={props}>Problem Solving,</animated.p>
        <animated.p style={props}>
          Scripting, <span className="emphasis-color-yellow">Coding,</span>
        </animated.p>
        <animated.p style={props}>Frontend and</animated.p>
        <animated.p style={props}>
          <span className="emphasis-color-red">Backend</span> Development
        </animated.p>
        <animated.aside
          className="home__header-content__desc"
          style={leftSlide}
        >
          “I strive to be a developer that brings about a revolutionary change”
        </animated.aside>
        <div className="home__header-content__sub">
          <div className="home__header-content__sub-interests">
            <animated.p style={props}>
              Technology and Anime lover. I love{" "}
              {changeTextTransition.map(({ item, props, key }) => (
                <animated.span key={key} style={props}>
                  {interests[item]}
                </animated.span>
              ))}
            </animated.p>
          </div>
          <div className="home__header-content__sub-social">
            <animated.p style={props}>Find me also on</animated.p>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/crestniraj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIN
                </a>
              </li>
              <li>
                <a
                  href="https://www.github.com/CrestNiraj12"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/crestniraz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/crestniraz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default connect(mapStateToProps)(Header);
