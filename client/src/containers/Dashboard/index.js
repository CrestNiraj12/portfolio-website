import React, { useState, useEffect, useCallback } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import { setPage, showDialog, confirmAction } from "../../actions";
import { ReactComponent as LinkIcon } from "./link.svg";
import { ReactComponent as UserIcon } from "./avatar.svg";
import { ReactComponent as PostIcon } from "./paper.svg";
import { ReactComponent as ControlIcon } from "./control.svg";
import { DASHBOARD, SUCCESS, FAILURE, PATTERN } from "../../constants";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Flash from "../../components/Flash";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
  actionConfirm: state.confirmAction,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      showDialog: (message, show) => showDialog(message, show),
      confirmAction: (confirm) => confirmAction(confirm),
    },
    dispatch
  );

const Dashboard = ({
  match,
  isLandscape,
  actionConfirm,
  setPage,
  showDialog,
  confirmAction,
}) => {
  const [redirect, setRedirect] = useState(null);
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
  const [message, setMessage] = useState({});
  const [disable, setDisable] = useState(true);

  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: "/user/all", text: "All Users", Svg: UserIcon },
  ];

  useEffect(() => {
    setPage(DASHBOARD);
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../../auth/login");
    axios.get(`/user/${match.params.id}`).then((user) => {
      setDetails({
        ...user.data,
        password: "",
        confirmPassword: "",
        newPassword: "",
      });
    });
  }, [setPage, match.params.id]);

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
        setMessage({ data: "New passwords do not match!", type: FAILURE });
        return;
      }
    }

    document.querySelector(".flash__wrapper").style.opacity = "1";
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
        setMessage({ data: res.data.message, type: SUCCESS });
      })
      .catch((err) => {
        setMessage({ data: err.response.data, type: FAILURE });
      });

    setTimeout(() => {
      if (document.querySelector(".flash__wrapper"))
        document.querySelector(".flash__wrapper").style.opacity = "0";
    }, 2000);
  };

  const handleEditProfile = () => {
    document.querySelector(".dashboard__head-profile__view").style.display =
      "none";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "flex";
  };

  const handleLogout = useCallback(
    (skipMessage = false) => {
      if (!skipMessage)
        showDialog(
          {
            title: "Are you sure?",
            description: "You are going to log out from this page.",
            confirmText: "Logout",
            denyText: "Cancel",
          },
          true
        );

      if (skipMessage || actionConfirm)
        axios
          .get("/auth/logout")
          .then((res) => {
            setMessage({ data: res.data, type: SUCCESS });
            localStorage.setItem("id", "");
            localStorage.setItem("isAuthenticated", false);

            setRedirect("/auth/login");
          })
          .catch((err) => {
            console.log(err.response.data, FAILURE);
          });

      confirmAction(false);
    },
    [actionConfirm, confirmAction, showDialog]
  );

  const handleRemoveAccount = useCallback(() => {
    showDialog(
      {
        title: "Are you sure?",
        description: "You are going to remove your account permanently.",
        confirmText: "Remove",
        denyText: "Cancel",
      },
      true
    );

    if (actionConfirm)
      axios
        .delete(`/user/${match.params.id}`, details)
        .then((res) => {
          console.log(res.data);
          setMessage({ data: res.data.message, type: SUCCESS });
          handleLogout(true);
        })
        .catch((err) => console.log(err));
  }, [details, handleLogout, actionConfirm, showDialog, match.params.id]);

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
      <Flash type={message.type} data={message.data} />
      <main className="dashboard">
        {redirect && <Redirect to={redirect} />}
        <section className="dashboard__head">
          <div className="dashboard__head-wrapper">
            {!isLandscape && <p>Welcome!</p>}
            <div className="dashboard__head-button">
              <button
                className="dashboard__head-button__logout"
                style={{ cursor: "pointer" }}
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </div>
          </div>

          <div className="dashboard__head-profile">
            <div className="dashboard__head-profile__img">
              <div className="dashboard__head-profile__img-loader"></div>
              <img
                src={
                  details.image && details.image.startsWith("http")
                    ? details.image
                    : `/images/${details.image}`
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
                minLength="8"
                title="You password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, 1 symbol and 1 digit"
                pattern={PATTERN}
                value={details.password}
                onChange={handleInputChange}
                required={!disable}
              />
              <input
                type="password"
                name="newPassword"
                minLength="8"
                pattern={PATTERN}
                title="You password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, 1 symbol and 1 digit"
                placeholder="New Password"
                onChange={handleInputChange}
                value={details.newPassword}
                disabled={disable}
                required={!disable}
              />
              <input
                type="password"
                name="confirmPassword"
                minLength="8"
                pattern={PATTERN}
                title="You password must be atleast 8 characters long and must contain atleast 1 lowercase letter, 1 uppercase letter, 1 symbol and 1 digit"
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
