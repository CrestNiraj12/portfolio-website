import React, { useEffect } from "react";
import { setPage } from "../../actions";
import { ABOUT } from "../../constants";
import { connect } from "react-redux";
import { ReactComponent as NodeJS } from "./svg/nodejs.svg";
import { ReactComponent as Html } from "./svg/html.svg";
import { ReactComponent as Python } from "./svg/python.svg";
import { ReactComponent as ReactIcon } from "./svg/react.svg";
import { ReactComponent as Redux } from "./svg/redux.svg";
import JS from "./js.png";
import Footer from "../../components/Footer";
import Collab from "../../components/Collab";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const About = ({ setPage }) => {
  useEffect(() => {
    setPage(ABOUT);
  });

  return (
    <>
      <main className="about">
        <section className="about__content">
          <p>Brief Introduction</p>
          <h1>
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
          </h1>
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
            <div className="about__content-description__skills">
              <div className="about__content-description__skills-item">
                <Python className="about__content-description__skills-item__logo" />
                <p>Python</p>
              </div>
              <div className="about__content-description__skills-item">
                <Html className="about__content-description__skills-item__logo" />
                <p>HTML5</p>
              </div>
              <div className="about__content-description__skills-item">
                <img
                  src={JS}
                  alt="Javascript"
                  className="about__content-description__skills-item__logo"
                />
                <p>Javascript</p>
              </div>
              <div className="about__content-description__skills-item">
                <NodeJS className="about__content-description__skills-item__logo" />
                <p>NodeJS</p>
              </div>
              <div className="about__content-description__skills-item">
                <ReactIcon className="about__content-description__skills-item__logo" />
                <p>React</p>
              </div>
              <div className="about__content-description__skills-item">
                <Redux className="about__content-description__skills-item__logo" />
                <p>Redux</p>
              </div>
            </div>
          </div>
        </section>
        <Collab />
        <section className="attributions">
          <h2
            style={{
              display: "inline-block",
              borderBottom: "1px solid gray",
              letterSpacing: "1px",
            }}
          >
            Attributions
          </h2>
          <br />
          <a
            href="https://commons.wikimedia.org/wiki/File:JavaScript-logo.png"
            title="via Wikimedia Commons"
          >
            Ramaksoud2000 via Chris Williams
          </a>{" "}
          / Public domain
          <br />
          <a
            href="https://commons.wikimedia.org/wiki/File:React-icon.svg"
            title="via Wikimedia Commons"
          >
            Facebook
          </a>{" "}
          / Public domain
          <br />
          <a
            href="https://commons.wikimedia.org/wiki/File:Python-logo-notext.svg"
            title="via Wikimedia Commons"
          >
            www.python.org
          </a>{" "}
          / <a href="http://www.gnu.org/licenses/gpl.html">GPL</a>
          <br />
          <a
            href="https://commons.wikimedia.org/wiki/File:HTML5_logo_and_wordmark.svg"
            title="via Wikimedia Commons"
          >
            W3C
          </a>{" "}
          / <a href="https://creativecommons.org/licenses/by/3.0">CC BY</a>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default connect(null, mapDispatchToProps)(About);
