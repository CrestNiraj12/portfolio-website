import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideTitle from "../../components/SideTitle";
import Projects from "./projects";
import { connect } from "react-redux";
import { setPosts, setIsLoadingPage } from "../../actions";
import axios from "axios";
import Collab from "../../components/Collab";
import ImageOverlay from "../../components/ImageOverlay";
import { animated, useTransition, useSpring } from "react-spring";
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
  "from Nepal",
  "a day dreamer",
  "a passionate developer",
  "ready to work",
  "a creative individual",
  "a web developer",
  "here to help",
];

const Content = ({ posts, setPosts }) => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [index, setIndex] = useState(
    Math.floor(Math.random() * descriptions.length)
  );

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

  useEffect(() => {
    var mounted = true;

    setTimeout(() => {
      if (mounted) setIndex(index < descriptions.length - 1 ? index + 1 : 0);
    }, 2500);

    return () => (mounted = false);
  }, [index]);

  const handleHideOverlay = (e) => {
    e.target.previousSibling.style.display = "none";
    e.target.style.visibility = "visible";
  };

  const changeDescriptions = useTransition(index, (p) => p, {
    from: { opacity: 1, w: 0, x: 0 },
    enter: { opacity: 1, w: 100, x: 0 },
    leave: { opacity: 0, w: 0, x: 1000 },
    config: { duration: 1000 },
  });

  const viewText = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    opacity: 1,
    transform: "translateY(0)",
    config: { mass: 10, tension: 5000, friction: 50 },
  });

  return (
    <>
      <section className="home__content">
        <SideTitle text="Who am I?" color="yellow" />
        <div className="home__content-main">
          <p className="home__content-main__bio">
            I am
            {changeDescriptions.map(({ item, props, key }) => (
              <animated.span
                key={key}
                style={{
                  opacity: props.opacity,
                  width: props.w.interpolate((w) => `${w}%`),
                  transform: props.x.interpolate((x) => `translateX(${x}px)`),
                }}
                className="home__content-main__bio-content"
              >
                {descriptions[item].split(" ")[0]}{" "}
                <span className="home__content-main__bio-emphasis">
                  {descriptions[item].split(" ")[1]}
                </span>{" "}
                {descriptions[item].split(" ").slice(2).join(" ")}
              </animated.span>
            ))}
          </p>
          <animated.p className="home__content-main__sub-bio" style={viewText}>
            I will help you reach out the <span>best potential</span> of your
            business by providing users with best user <span>experience</span>{" "}
            and design.
          </animated.p>
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
