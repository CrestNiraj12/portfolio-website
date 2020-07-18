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
    password: "",
    newPassword: "",
    confirmPassword: "",
    posts: [],
  });
  const [disable, setDisable] = useState(true);

  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: "/user/all", text: "All Users", Svg: UserIcon },
  ];

  useEffect(() => {
    var mounted = true;
    store.dispatch(setPage(6));
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../../auth/login");
    axios.get(`/user/${match.params.id}`).then((user) => {
      if (mounted)
        setDetails({
          ...user.data,
          password: "",
          confirmPassword: "",
          newPassword: "",
        });
    });

    store.subscribe(() => {
      if (mounted) setIsLandscape(store.getState().isLandscape);
    });
    return () => (mounted = false);
  }, [match.params.id]);

  const handleInputChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      if (e.target.value !== "") setDisable(false);
      else setDisable(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!disable) {
      if (details.newPassword !== details.confirmPassword) {
        console.log("Error: New passwords do not match!");
        return;
      }
    }

    var bodyForm = new FormData();
    bodyForm.append("fullname", details.fullname);
    if (!disable) {
      bodyForm.set("password", details.password);
      bodyForm.set("newPassword", details.newPassword);
      bodyForm.set("confirmPassword", details.confirmPassword);
    }

    var image = document.querySelector("#image");
    var imageUpload = false;
    if (image.files.length !== 0) {
      bodyForm.append("image", image.files[0]);
      imageUpload = true;
    }

    axios({
      method: "PUT",
      url: `/user/${
        match.params.id
      }/changePassword/${!disable}/imageUpload/${imageUpload}`,
      data: bodyForm,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        console.log(res.data);

        if (imageUpload) setDetails({ ...details, image: res.data.filename });
        if (!disable) {
          handleLogout();
          return;
        }
        document.querySelector(".dashboard__head-profile__view").style.display =
          "flex";
        document.querySelector(
          ".dashboard__head-profile > form"
        ).style.display = "none";
      })
      .catch((err) => {
        console.log(err.response.data);
      });
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
        handleLogout();
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
      .catch((err) => console.log(err.response.data));

    setDetails({
      ...details,
      posts: details.posts.filter((post) => post._id !== postId),
    });
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
                src={
                  details.image && details.image.startsWith("http")
                    ? details.image
                    : `../../images/${details.image}`
                }
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
                required
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
                name="password"
                placeholder="Old Password"
                value={details.password}
                onChange={handleInputChange}
                required={!disable}
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handleInputChange}
                value={details.newPassword}
                disabled={disable}
                required={!disable}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
                value={details.confirmPassword}
                disabled={disable}
                required={!disable}
              />
              <div>
                <label htmlFor="image">Display Picture</label>
                <input type="file" id="image" name="image" accept="image/*" />
              </div>

              <button className="dashboard__head-profile-button__update">
                Update Profile
              </button>
            </form>
          </div>
        </section>

        <section className="dashboard__content">
          {details.role && details.role.toLowerCase() !== "editor" && (
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
          {details.role && details.role.toLowerCase() !== "tester" && (
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
                        <p>{post.title}</p>
                      </Link>
                      <div className="dashboard__content-posts__wrapper-item__button">
                        <button className="dashboard__content-posts__wrapper-item__button-edit">
                          Edit
                        </button>
                        <button
                          className="dashboard__content-posts__wrapper-item__button-delete"
                          onClick={() =>
                            handleDeletePost(post.authorId, post._id)
                          }
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
      </main>
    </>
  );
};

export default Dashboard;
