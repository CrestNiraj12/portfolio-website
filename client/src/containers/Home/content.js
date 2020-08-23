import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideTitle from "../../components/SideTitle";
import Projects from "./projects";
import { connect } from "react-redux";
import { setPosts, setIsLoadingPage } from "../../actions";
import axios from "axios";
import Collab from "../../components/Collab";
import ImageOverlay from "../../components/ImageOverlay";
import VisibilitySensor from "react-visibility-sensor";
import Typical from "react-typical";
import Attributions from "./attributions";

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  setPosts: (posts) => dispatch(setPosts(posts)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const descriptions = [
  "a diligent programmer",
  1500,
  "from Nepal",
  1500,
  "a day dreamer",
  1500,
  "a passionate developer",
  1500,
  "ready to work",
  1500,
  "a creative individual",
  1500,
  "a web developer",
  1500,
  "here to help",
  1500,
];

const Content = ({ posts, setPosts }) => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsLoadingPage(true);
    if (posts !== null) {
      setFeaturedPost(posts.length < 1 ? null : posts[0]);
      setIsLoadingPage(false);
    } else
      axios.get("/posts/").then((p) => {
        setPosts(p.data);
      });
  }, [posts, setPosts, featuredPost]);

  const handleHideOverlay = (e) => {
    e.target.previousSibling.style.display = "none";
    e.target.style.visibility = "visible";
  };

  return (
    <>
      <section className="home__content">
        {isVisible && (
          <SideTitle text="Who am I?" color="yellow" isVisible={isVisible} />
        )}
        <div className="home__content-main">
          <VisibilitySensor onChange={(isVisible) => setIsVisible(isVisible)}>
            <p className="home__content-main__bio">
              I am{" "}
              <Typical loop={Infinity} steps={descriptions} wrapper="span" />
            </p>
          </VisibilitySensor>
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
        <Projects />
        <div className="home__projects-all">
          <h3>Want to See More?</h3>
          <a href="https://github.com/CrestNiraj12" className="link-design">
            View All Projects
          </a>
        </div>
      </section>
      {featuredPost && (
        <section className="home__featured">
          <SideTitle text="Featured Post" color="white" />

          <div className="home__featured-wrapper">
            <Link
              className="home__featured-post"
              to={`/posts/${
                featuredPost.title.toLowerCase().split(" ").join("-") +
                "-" +
                featuredPost._id
              }`}
            >
              <div className="home__featured-post__thumbnail">
                <ImageOverlay />
                <img
                  src={`/images/posts/${featuredPost.thumbnail}`}
                  alt="Featured post"
                  onLoad={handleHideOverlay}
                />
              </div>
              <div className="home__featured-post__content">
                <p className="home__featured-post__content-tag">Testing</p>
                <h3>{featuredPost.title}</h3>
                <p className="home__featured-post__content-desc">
                  {featuredPost.description}
                </p>
                <p className="home__featured-post__content-published">
                  Published {featuredPost.updatedAt.substring(0, 10)}
                </p>
                <span className="link-design-layered">Read More</span>
              </div>
            </Link>
          </div>
        </section>
      )}
      <Collab />
      <Attributions />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
