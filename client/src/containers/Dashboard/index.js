import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import store from "../../store";
import { setPage } from "../../actions";
import { ReactComponent as User } from "./avatar.svg";
import { ReactComponent as Post } from "./paper.svg";

const Dashboard = ({ match }) => {
  const [redirect, setRedirect] = useState(null);
  const [details, setDetails] = useState({
    fullname: "",
    email: "",
    image: "",
    role: "",
    posts: [],
  });

  const features = [
    { url: "/posts", text: "All Posts", Svg: Post },
    { url: "/user/all", text: "All Users", Svg: User },
  ];

  useEffect(() => {
    store.dispatch(setPage(6));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../auth/login");
    axios.get(`/user/${match.params.id}`).then((user) => {
      setDetails(user.data);
    });
  }, [match.params.id]);

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    axios
      .put(`/user/${match.params.id}`, details)
      .then((res) => console.log(res.data))
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

  return (
    <>
      <main className="dashboard">
        {redirect && <Redirect to={redirect} />}
        <section className="dashboard__head">
          <h1>
            Welcome !
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

            <p className="dashboard__head-profile-role">{details.role}</p>
            <div className="dashboard__head-profile__view">
              <h3 className="dashboard__head-profile__view-fullname">
                {details.fullname}
              </h3>
              <p className="dashboard__head-profile__view-email">
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
          <h2 style={{ color: "#fff" }}>Control Center</h2>
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
          <div>
            <h1>Your Posts</h1>
            <div className="">
              {details.posts.length > 1 ? (
                details.posts.map((post) => <Link key={post.title}></Link>)
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
