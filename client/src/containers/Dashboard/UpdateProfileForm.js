import React, { useState } from "react";
import axios from "axios";
import { SUCCESS, FAILURE, PATTERN, PASSWORD_WARNING } from "../../constants";
import { setUserDetails, setMessage, thunkLogout } from "../../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomButton from "../../components/CustomButton";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setUserDetails: (details) => setUserDetails(details),
      setMessage: (message) => setMessage(message),
      logOut: () => thunkLogout(true),
    },
    dispatch
  );

const UpdateProfileForm = ({
  userDetails,
  setUserDetails,
  setMessage,
  logOut,
}) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [disable, setDisable] = useState(true);

  const handleInputChange = (e) => {
    setUserDetails({ [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      if (e.target.value !== "") setDisable(false);
      else setDisable(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    if (!disable) {
      if (userDetails.newPassword !== userDetails.confirmPassword) {
        setMessage({ data: "New passwords do not match!", type: FAILURE });
        return;
      }
    }

    axios
      .put(`/user/?changePassword=${!disable}`, userDetails)
      .then((res) => {
        if (!disable) {
          setMessage({ data: res.data.message, type: SUCCESS });
          logOut();
          return;
        } else {
          document.querySelector(
            ".dashboard__head-profile__view"
          ).style.display = "flex";
          document.querySelector(
            ".dashboard__head-profile > form"
          ).style.display = "none";
          setButtonLoading(false);
          setMessage({ data: res.data, type: SUCCESS });
        }
      })
      .catch((err) => {
        setButtonLoading(false);
        if (err.response.status === 401) {
          setMessage({ data: err.response.data, type: FAILURE });
          logOut(true);
        } else {
          console.log(err.response);
          setMessage({ data: err.response.data, type: FAILURE });
        }
      });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setUserDetails({
      ...userDetails,
      password: "",
      newPassword: "",
      confirmPassword: "",
    });
    document.querySelector(".dashboard__head-profile__view").style.display =
      "flex";
    document.querySelector(".dashboard__head-profile > form").style.display =
      "none";
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="fullname"
        placeholder="Full Name"
        value={userDetails.fullname}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={userDetails.email + " (Permanent)"}
        disabled
      />
      <input
        type="password"
        name="password"
        placeholder="Old Password"
        minLength="8"
        value={userDetails.password}
        onChange={handleInputChange}
        required={!disable}
      />
      <input
        type="password"
        name="newPassword"
        minLength="8"
        pattern={PATTERN}
        title={PASSWORD_WARNING}
        placeholder="New Password"
        onChange={handleInputChange}
        value={userDetails.newPassword}
        disabled={disable}
        required={!disable}
      />
      <input
        type="password"
        name="confirmPassword"
        minLength="8"
        placeholder="Confirm Password"
        onChange={handleInputChange}
        value={userDetails.confirmPassword}
        disabled={disable}
        required={!disable}
      />

      <div className="dashboard__head-profile-button">
        <CustomButton
          loading={buttonLoading}
          clsName="dashboard__head-profile-button__update"
          text="Update Profile"
        />
        <button
          className="dashboard__head-profile-button__cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileForm);
