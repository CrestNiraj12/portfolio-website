import React, { useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { LOG_OUT, REMOVE_OWN_ACCOUNT } from "../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import { ReactComponent as LinkIcon } from "./link.svg";
import { showDialog, setUserDetails } from "../../actions";
import { bindActionCreators } from "redux";

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
    },
    dispatch
  );

const Content = ({ isLandscape, userDetails, showDialog, setUserDetails }) => {
  useEffect(() => {
    const id = localStorage.getItem("id");
    axios.get(`/user/${id}`).then((user) => {
      setUserDetails({
        ...user.data,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    });
  }, [setUserDetails]);

  const handleEditProfile = () => {
    document.querySelector(".dashboard__head-profile__view").style.display =
      "none";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "flex";
  };

  const handleImageLoad = (e) => {
    document.querySelector(
      ".dashboard__head-profile__img-loader"
    ).style.display = "none";
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
          <div className="dashboard__head-profile__img-loader"></div>
          <img
            src={
              userDetails.image && userDetails.image.startsWith("http")
                ? userDetails.image
                : `/images/${userDetails.image}`
            }
            alt="Profile"
            onLoad={(e) => handleImageLoad(e)}
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
