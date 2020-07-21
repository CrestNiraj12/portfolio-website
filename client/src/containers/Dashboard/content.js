import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";

import { SUCCESS, FAILURE } from "../../constants";
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
      showDialog: (message, show) => showDialog(message, show),
      setUserDetails: (details) => setUserDetails(details),
    },
    dispatch
  );

const Content = ({
  id,
  isLandscape,
  userDetails,
  actionConfirm,
  showDialog,
  handleLogout,
  setUserDetails,
  setMessage,
}) => {
  useEffect(() => {
    axios.get(`/user/${id}`).then((user) => {
      console.log(user.data);
      setUserDetails({
        ...user.data,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    });
  }, [id, setUserDetails]);

  const handleEditProfile = () => {
    document.querySelector(".dashboard__head-profile__view").style.display =
      "none";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "flex";
  };

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
        .delete(`/user/${id}`, userDetails)
        .then((res) => {
          console.log(res.data);
          setMessage({ data: res.data.message, type: SUCCESS });
          handleLogout(true);
        })
        .catch((err) => setMessage({ data: err.response.data, type: FAILURE }));
  }, [userDetails, handleLogout, actionConfirm, showDialog, id, setMessage]);

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
              onClick={handleRemoveAccount}
            >
              Remove Account
            </button>
          </div>
        </div>

        <UpdateProfileForm
          id={id}
          setMessage={setMessage}
          handleLogout={handleLogout}
        />
      </div>
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
