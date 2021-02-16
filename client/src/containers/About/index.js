import React, { useEffect, useState } from "react";
import { setPage, setIsLoadingPage } from "../../actions";
import { ABOUT } from "../../constants";
import { connect } from "react-redux";
import { ReactComponent as NodeJS } from "./svg/nodejs.svg";
import Laravel from "./laravel.png";
import { ReactComponent as Python } from "./svg/python.svg";
import { ReactComponent as ReactIcon } from "./svg/react.svg";
import Flutter from "./flutter.png";
import JS from "./js.png";
import Footer from "../../components/Footer";
import Collab from "../../components/Collab";
import Attributions from "./attributions";
import { useSpring, animated, useTrail } from "react-spring";
import ReactVisibilitySensor from "react-visibility-sensor";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const skills = [
  {
    image: <Python className="about__content-description__skills-item__logo" />,
    title: "Python",
  },
  {
    image: (
      <img
        src={Laravel}
        alt="Laravel"
        className="about__content-description__skills-item__logo"
      />
    ),
    title: "Laravel",
  },

  {
    image: (
      <img
        src={JS}
        alt="Javascript"
        className="about__content-description__skills-item__logo"
      />
    ),
    title: "Javascript",
  },
  {
    image: <NodeJS className="about__content-description__skills-item__logo" />,
    title: "NodeJS",
  },
  {
    image: (
      <ReactIcon className="about__content-description__skills-item__logo" />
    ),
    title: "React",
  },
  {
    image: (
      <img
        src={Flutter}
        alt="Flutter"
        className="about__content-description__skills-item__logo"
      />
    ),
    title: "Flutter/Dart",
  },
];

const About = ({ setPage, setIsLoadingPage }) => {
  const [visible, setVisible] = useState(false);

  const [skillTrail, setTrail] = useTrail(skills.length, () => ({
    opacity: 0,
    s: 0,
    config: { mass: 5, tension: 500, friction: 50 },
  }));

  useEffect(() => {
    setIsLoadingPage(true);
    setPage(ABOUT);
    setIsLoadingPage(false);

    if (visible)
      setTrail({
        opacity: 1,
        s: 1,
      });
  }, [setPage, setIsLoadingPage, setTrail, visible]);

  const slide = useSpring({ from: { opacity: 0, x: -1000 }, opacity: 1, x: 0 });

  const show = useSpring({
    from: { opacity: 0, y: 100 },
    opacity: 1,
    y: 0,
    delay: 500,
  });

  return (
    <>
      <main className="about">
        <section className="about__content">
          <animated.p
            style={{
              opacity: slide.opacity,
              transform: slide.x.interpolate((x) => `translateX(${x}px)`),
            }}
          >
            Brief Introduction
          </animated.p>
          <animated.h1
            style={{
              opacity: show.opacity,
              transform: show.y.interpolate((y) => `translateY(${y}px)`),
            }}
          >
            From{" "}
            <span role="img" aria-label="web">
              🕸
            </span>{" "}
            Web development to{" "}
            <span role="img" aria-label="scroll">
              📜
            </span>
            Scripting , a{" "}
            <span className="emphasis-color-yellow">Programmer</span> and a very{" "}
            <span className="emphasis-color-blue">curious</span> individual
          </animated.h1>
          <div className="about__content-description">
            <p>
              Web developer and Programmer localized in Nepal, I am very
              interested in new technology.
            </p>
            <p>
              With my years of learning technology and still as passionate, I
              put my skills at the service of your creative ideas.
            </p>
            <p>
              I listen and analyze to all of your requirements very carefully to
              provide you with the most satisfying product.
            </p>
            <p style={{ margin: "0" }}>My Skillset:</p>
            <ReactVisibilitySensor
              onChange={(isVisible) => {
                if (!visible) setVisible(isVisible);
              }}
            >
              <div className="about__content-description__skills">
                {skillTrail.map(({ s, ...rest }, index) => (
                  <animated.div
                    key={index}
                    className="about__content-description__skills-item"
                    style={{
                      ...rest,
                      transform: s.interpolate((s) => `scale(${s})`),
                    }}
                  >
                    {skills[index].image}
                    <p>{skills[index].title}</p>
                  </animated.div>
                ))}
              </div>
            </ReactVisibilitySensor>
          </div>
        </section>
        <Collab />
        <Attributions />
      </main>
      <Footer />
    </>
  );
};

export default connect(null, mapDispatchToProps)(About);
