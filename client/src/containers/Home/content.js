import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import profileImage from "../../images/profile.jpg";
import profileImageLow from "../../images/profile-low.jpg";
import FeaturedBlog from "./FeaturedBlog";
import { setPosts } from "../../actions";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  landscapeCheck: state.isLandscape,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) => ({
  setPosts: (posts) => dispatch(setPosts(posts)),
});

const Content = ({ landscapeCheck, posts, setPosts }) => {
  const [postList, setPostList] = useState([]);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    if (posts !== null) setPostList(posts);
    else
      axios
        .get("/posts")
        .then((res) => {
          setPosts(res.data);
        })
        .catch((err) => console.log("Error: " + err));

    setIsLandscape(landscapeCheck);
  }, [landscapeCheck, posts, setPosts]);

  return (
    <main>
      <section
        className="section__bio"
        style={postList.length > 0 ? { height: "110vh" } : { height: "90vh" }}
      >
        <div className="section__bio-wrapper">
          <div className="section__bio-wrapper__corner-top"></div>
          <div className="section__bio-wrapper__content">
            <img
              className="section__bio-wrapper__content-image"
              src={isLandscape ? profileImage : profileImageLow}
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

                {isLandscape && (
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
        {postList.length >= 1 && (
          <div className="section__bio--headings">
            <h2>Almost made in time</h2>
            <h3>
              Check out
              {postList.length > 2 ? " some of my blog posts" : " my blog post"}
            </h3>
          </div>
        )}
      </section>
      {postList.length >= 1 && <FeaturedBlog posts={postList} />}
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
