import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { ReactComponent as ControlIcon } from "./control.svg";
import { ReactComponent as UserIcon } from "./avatar.svg";
import { ReactComponent as PostIcon } from "./paper.svg";
import { bindActionCreators } from "redux";
import { showDialog, setUserDetails } from "../../actions";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  role: state.userDetails.role.toLowerCase(),
  posts: state.userDetails.posts,
  actionConfirm: state.confirmAction,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showDialog: (message, show) => showDialog(message, show),
      setUserDetails: (details) => setUserDetails(details),
    },
    dispatch
  );

const Features = ({
  role,
  posts,
  userDetails,
  actionConfirm,
  showDialog,
  setUserDetails,
}) => {
  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: "/user/all", text: "All Users", Svg: UserIcon },
  ];

  const handleDeletePost = (authorId, postId) => {
    showDialog(
      {
        title: "Are you sure?",
        description: "You are going to remove this post permanently.",
        confirmText: "Remove",
        denyText: "Cancel",
      },
      true
    );

    if (actionConfirm) {
      axios
        .delete(`/posts/${authorId}/${postId}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err.response.data));

      setUserDetails({
        posts: userDetails.posts.filter((post) => post._id !== postId),
      });
    }
  };

  return (
    <section className="dashboard__content">
      {role && role !== "editor" && (
        <>
          <div className="dashboard__content-heading">
            <ControlIcon />
            <h2 style={{ color: "#fff" }}>Control Center</h2>
          </div>
          <div className="dashboard__content-features">
            {features.map(({ url, text, Svg }) => (
              <Link key={url} to={url}>
                <div className="dashboard__content-features__card">
                  <p>{text}</p>
                  <Svg className="dashboard__content-features__card-icon" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {role && role !== "tester" && (
        <div className="dashboard__content-posts">
          <h1>Your Posts {posts.length > 0 && `(${posts.length})`}</h1>
          <div className="dashboard__content-posts__wrapper">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="dashboard__content-posts__wrapper-item"
                >
                  <Link
                    to={`/posts/${post.title
                      .toLowerCase()
                      .split(" ")
                      .join("-")}-${post._id}`}
                  >
                    <p>{post.title}</p>
                  </Link>
                  <div className="dashboard__content-posts__wrapper-item__button">
                    <button className="dashboard__content-posts__wrapper-item__button-edit">
                      Edit
                    </button>
                    <button
                      className="dashboard__content-posts__wrapper-item__button-delete"
                      onClick={() => handleDeletePost(post.authorId, post._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontFamily: "Kurale", color: "#9b9b9b" }}>
                You have not posted anything!
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Features);
