import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as ControlIcon } from "./svg/control.svg";
import { ReactComponent as UserIcon } from "./svg/avatar.svg";
import { ReactComponent as PostIcon } from "./svg/paper.svg";
import { ReactComponent as AddIcon } from "./svg/add.svg";
import { ReactComponent as YourPostsIcon } from "./svg/posts.svg";
import { EDITOR, POSTS } from "../../constants";
import { connect } from "react-redux";
import AdminControl from "../../components/AdminControl";

const mapStateToProps = (state) => ({
  role: state.userDetails.role,
  posts: state.userDetails.posts,
});

const Features = ({ role, posts }) => {
  const features =
    role !== EDITOR
      ? [
          { url: "/posts", text: "All Posts", Svg: PostIcon },
          { url: "/users", text: "All Users", Svg: UserIcon },
          { url: "/user/addpost", text: "Add Post", Svg: AddIcon },
        ]
      : [{ url: "/user/addpost", text: "Add Post", Svg: AddIcon }];

  return (
    <section className="dashboard__content">
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
      <div className="posts__content">
        <div className="posts__content-wrapper">
          <YourPostsIcon />
          <h1>Your Posts {posts.length > 0 && `(${posts.length})`}</h1>
        </div>
        <AdminControl page={POSTS} hide={true} />
      </div>
    </section>
  );
};

export default connect(mapStateToProps)(Features);
