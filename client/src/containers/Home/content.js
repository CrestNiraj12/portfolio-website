import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideTitle from "../../components/SideTitle";
import Projects from "./projects";
import { connect } from "react-redux";
import { setPosts } from "../../actions";
import axios from "axios";

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  setPosts: (posts) => dispatch(setPosts(posts)),
});

const Content = ({ posts, setPosts }) => {
  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    if (posts !== null)
      if (posts.length < 1) setFeaturedPost(null);
      else setFeaturedPost(posts[0]);
    else
      axios.get("/posts/").then((p) => {
        setPosts(p.data);
      });
  }, [posts, setPosts]);

  return (
    <>
      <section className="home__content">
        <SideTitle text="Who am I?" color="yellow" />
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
                <img
                  src={`/images/posts/${featuredPost.thumbnail}`}
                  alt="Featured post"
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
      <section className="home__collab">
        <p>
          Let's get <span>started.</span>
        </p>
        <p>
          Keep in touch <Link to="/contact">Contact me</Link>
        </p>
      </section>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
