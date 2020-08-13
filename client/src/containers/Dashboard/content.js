import React, { useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { LOG_OUT, REMOVE_OWN_ACCOUNT, FAILURE } from "../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import { ReactComponent as LinkIcon } from "./svg/link.svg";
import {
  showDialog,
  setUserDetails,
  thunkLogout,
  setMessage,
  setIsLoadingPage,
} from "../../actions";
import { bindActionCreators } from "redux";
import ImageOverlay from "../../components/ImageOverlay";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  isLandscape: state.isLandscape,
  actionConfirm: state.confirmAction,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showDialog: (action, payload) => showDialog(action, payload),
      setUserDetails: (details) => setUserDetails(details),
      logOut: (skip) => thunkLogout(skip),
      setMessage: (message) => setMessage(message),
      setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
    },
    dispatch
  );

const Content = ({
  isLandscape,
  userDetails,
  showDialog,
  setUserDetails,
  logOut,
  setMessage,
  setIsLoadingPage,
}) => {
  useEffect(() => {
    setIsLoadingPage(true);
    const id = localStorage.getItem("id");
    axios
      .get(`/user/${id}`)
      .then((user) => {
        setIsLoadingPage(false);
        setUserDetails({
          ...user.data,
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((e) => {
        if (e.response.status === 401) {
          setMessage({ data: e.response.data, type: FAILURE });
          logOut(true);
        }
      });
  }, [setUserDetails, setMessage, logOut, setIsLoadingPage]);

  const handleEditProfile = () => {
    document.querySelector(".dashboard__head-profile__view").style.display =
      "none";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "flex";
  };

  const handleImageLoad = (e) => {
    e.target.previousSibling.style.display = "none";
    e.target.style.position = "relative";
    e.target.style.visibility = "visible";
  };

  return (
    <section className="dashboard__head">
      <div className="dashboard__head-wrapper">
        {!isLandscape && <p>Welcome!</p>}
        <div className="dashboard__head-button">
          <button
            className="dashboard__head-button__logout"
            style={{ cursor: "pointer" }}
            onClick={() => showDialog(LOG_OUT)}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard__head-profile">
        <div className="dashboard__head-profile__img">
          <ImageOverlay cls="dashboard__head-profile__img-loader" />
          <img
            src={
              userDetails.image && userDetails.image.startsWith("http")
                ? userDetails.image
                : `/images/users/${userDetails.image}`
            }
            alt="Profile"
            onLoad={handleImageLoad}
          />
        </div>

        <div className="dashboard__head-profile__view">
          <p className="dashboard__head-profile-role">{userDetails.role},</p>
          <h3 className="dashboard__head-profile__view-fullname">
            {userDetails.fullname}
          </h3>

          <p className="dashboard__head-profile__view-email">
            <LinkIcon className="dashboard__head-profile__view-email__icon" />
            {userDetails.email}
          </p>
          <div className="dashboard__head-profile__view-button">
            <button
              className="dashboard__head-profile__view-button__edit"
              onClick={handleEditProfile}
            >
              Edit Profile
            </button>
            <button
              className="dashboard__head-profile__view-button__delete"
              onClick={() => showDialog(REMOVE_OWN_ACCOUNT, userDetails._id)}
            >
              Remove Account
            </button>
          </div>
        </div>

        <UpdateProfileForm />
      </div>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
