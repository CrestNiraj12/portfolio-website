import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { setPage } from "../../actions";
import { ReactComponent as LinkIcon } from "./link.svg";
import { ReactComponent as UserIcon } from "./avatar.svg";
import { ReactComponent as PostIcon } from "./paper.svg";
import { ReactComponent as ControlIcon } from "./control.svg";

const Dashboard = ({ match }) => {
  const [redirect, setRedirect] = useState(null);
  const [isLanscape, setIsLandscape] = useState(false);
  const [details, setDetails] = useState({
    fullname: "",
    email: "",
    image: "",
    role: "",
    posts: [],
  });

  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: "/user/all", text: "All Users", Svg: UserIcon },
  ];

  useEffect(() => {
    store.dispatch(setPage(6));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../../auth/login");
    axios.get(`/user/${match.params.id}`).then((user) => {
      setDetails(user.data);
    });

    store.subscribe(() => {
      setIsLandscape(store.getState().isLandscape);
    });
  }, [match.params.id]);

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    axios
      .put(`/user/${match.params.id}`, details)
      .then((res) => {
        console.log(res);
        handleLogout();
      })
      .catch((err) => console.log(err));
    document.querySelector(".dashboard__head-profile__view").style.display =
      "flex";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "none";
  };

  const handleEditProfile = () => {
    document.querySelector(".dashboard__head-profile__view").style.display =
      "none";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "flex";
  };

  const handleRemoveAccount = () => {
    axios
      .delete(`/user/${match.params.id}`, details)
      .then((res) => {
        console.log(res.data);
        setRedirect("/auth/login");
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    axios
      .get("/auth/logout")
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("isAuthenticated", false);
        setRedirect("/auth/login");
      })
      .catch((err) => console.log(err));
  };

  const handleImageLoad = (e) => {
    document.querySelector(
      ".dashboard__head-profile__img-loader"
    ).style.display = "none";
    e.target.style.position = "relative";
    e.target.style.visibility = "visible";
  };

  const handleDeletePost = (authorId, postId) => {
    axios
      .delete(`/posts/${authorId}/${postId}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <main className="dashboard">
        {redirect && <Redirect to={redirect} />}
        <section className="dashboard__head">
          <h1>
            {!isLanscape && "Welcome!"}
            <button
              className="dashboard__head-button__logout"
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </h1>

          <div className="dashboard__head-profile">
            <div className="dashboard__head-profile__img">
              <div className="dashboard__head-profile__img-loader"></div>
              <img
                src={details.image}
                alt="Profile"
                onLoad={(e) => handleImageLoad(e)}
              />
            </div>

            <div className="dashboard__head-profile__view">
              <p className="dashboard__head-profile-role">{details.role},</p>
              <h3 className="dashboard__head-profile__view-fullname">
                {details.fullname}
              </h3>

              <p className="dashboard__head-profile__view-email">
                <LinkIcon className="dashboard__head-profile__view-email__icon" />
                {details.email}
              </p>
              <button
                className="dashboard__head-profile__view-button__edit"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
              <button
                className="dashboard__head-profile__view-button__delete"
                onClick={handleRemoveAccount}
              >
                Remove Account
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={details.fullname}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={details.email}
                disabled
              />
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
              />
              <button className="dashboard__head-profile-button__update">
                Update Profile
              </button>
            </form>
          </div>
        </section>

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
          <div className="dashboard__content-posts">
            <h1>
              Your Posts{" "}
              {details.posts.length > 0 && `(${details.posts.length})`}
            </h1>
            <div className="dashboard__content-posts__wrapper">
              {details.posts.length > 0 ? (
                details.posts.map((post) => (
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
                      {post.title}
                    </Link>
                    <button>Edit</button>
                    <button
                      onClick={() => handleDeletePost(post.authorId, post._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ fontFamily: "Kurale", color: "#9b9b9b" }}>
                  You have not posted anything!
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
