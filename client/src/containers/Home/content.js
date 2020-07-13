import React from "react";
import { Link } from "react-router-dom";
import profileImage from "../../images/profile.jpg";
import profileImageLow from "../../images/profile-low.jpg";
import store from "../../store";

const Content = () => {
  const state = store.getState();
  const posts = [];

  return (
    <main>
      <section
        className="section__bio"
        style={posts.length >= 1 ? { height: "110vh" } : { height: "90vh" }}
      >
        <div className="section__bio-wrapper">
          <div className="section__bio-wrapper__corner-top"></div>
          <div className="section__bio-wrapper__content">
            <img
              className="section__bio-wrapper__content-image"
              src={state.isLandscape ? profileImage : profileImageLow}
              alt="Profile"
            />
            <div className="section__bio-wrapper__content-wrapper">
              <p className="section__bio-wrapper__content-desc">
                I am Niraj Shrestha and I have been coding for more than 3
                years. I have had my hands on various programming languages like
                Python, Java, C, C++, Javascript, etc. but what I have been
                personally working much with is Python. I am also interested in
                web development. Recently I started using nodejs with expressjs
                and mongodb for backend.
              </p>
              <div className="section__bio-wrapper__button">
                <Link
                  className="section__bio-wrapper__button-item"
                  to="/portfolio"
                >
                  Portfolio
                </Link>

                {state.isLandscape && (
                  <Link
                    className="section__bio-wrapper__button-item"
                    to="/contact"
                  >
                    Contact
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="section__bio-wrapper__corner-bottom"></div>
        </div>
        {posts.length >= 1 && (
          <div className="section__bio--headings">
            <h2>Almost made in time</h2>
            <h3>Check out some of my blog posts</h3>
          </div>
        )}
      </section>
    </main>
  );
};

export default Content;
