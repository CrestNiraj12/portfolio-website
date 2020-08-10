import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Arrow } from "../../images/arrow.svg";
import CollegeProject from "../../images/project.jpg";
import AT from "../../images/at.gif";

const Content = () => {
  return (
    <>
      <section className="home__content">
        <aside>
          Who am I? <Arrow className="home__content-arrow" />
        </aside>
        <div className="home__content-main">
          <p className="home__content-main__bio">
            I am{" "}
            <span id="traits">
              a{" "}
              <span className="home__content-main__bio-emphasis">creative</span>{" "}
              programmer
            </span>
          </p>
          <p className="home__content-main__sub-bio">
            I will help you reach out the <span>best potential</span> of your
            business by providing users with best user <span>experience</span>{" "}
            and design.
          </p>
          <Link to="/about" className="link-design">
            About me
          </Link>
        </div>
      </section>
      <section className="home__projects">
        <div className="home__projects-content">
          <a href="https://nirajshrestha01.com.np/website/index.html">
            <div className="home__projects-content-item">
              <div className="home__projects-content-item__img-wrapper">
                <img src={CollegeProject} alt="College Project" />
              </div>
              <h2>Personal Website</h2>
              <p>
                Second year college project, developed with plain HTML5, CSS and
                JS with JQuery
              </p>
              <span className="link-design">View Project</span>
            </div>
          </a>
          <a href="https://crestniraj12.github.io/profile-page/index.html">
            <div className="home__projects-content-item">
              <div className="home__projects-content-item__img-wrapper">
                <img src={AT} alt="First year college project" />
              </div>
              <h2>Profile page</h2>
              <p>
                First year college project, developed with plain HTML5 and CSS
              </p>
              <span className="link-design">View Project</span>
            </div>
          </a>
        </div>
        <div className="home__projects-all">
          <h3>Want to See More?</h3>
          <a href="https://github.com/CrestNiraj12" className="link-design">
            View All Projects
          </a>
        </div>
      </section>
    </>
  );
};

export default Content;
