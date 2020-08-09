import React from "react";

const Header = () => {
  return (
    <div className="home__header">
      <div className="home__header-content">
        <p>I'm Niraj Shrestha</p>
        <p>
          A <span className="emphasis-color-pink">Nepali Freelancer</span>
        </p>
        <p>Problem Solving,</p>
        <p>
          Scripting, <span className="emphasis-color-yellow">Coding,</span>
        </p>
        <p>Frontend and</p>
        <p>
          <span className="emphasis-color-red">Backend</span> Development
        </p>
        <div className="home__header-content__desc">
          “I strive to be a developer that brings about a revolutionary change”
        </div>
        <div className="home__header-content__sub">
          <div className="home__header-content__sub-interests">
            <p>
              Technology and Anime lover. I enjoy{" "}
              <span id="interests">Challenges</span>
            </p>
          </div>
          <div className="home__header-content__sub-social">
            <p>Find me also on</p>
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
    </div>
  );
};

export default Header;
