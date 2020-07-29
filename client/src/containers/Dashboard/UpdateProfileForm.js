import React, { useState, Fragment } from "react";
import axios from "axios";
import { SUCCESS, FAILURE, PATTERN, PASSWORD_WARNING } from "../../constants";
import { setUserDetails, setMessage, thunkLogout } from "../../actions";
import { connect } from "react-redux";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { bindActionCreators } from "redux";

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
  const [disable, setDisable] = useState(true);
  const [imageData, setImageData] = useState({
    src: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1 / 1,
    croppedAreaPixels: null,
    croppedImage: null,
    isCropping: false,
  });

  const handleInputChange = (e) => {
    setUserDetails({ [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      if (e.target.value !== "") setDisable(false);
      else setDisable(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!disable) {
      if (userDetails.newPassword !== userDetails.confirmPassword) {
        setMessage({ data: "New passwords do not match!", type: FAILURE });
        return;
      }
    }

    var bodyForm = new FormData();
    bodyForm.append("fullname", userDetails.fullname);
    if (!disable) {
      bodyForm.set("password", userDetails.password);
      bodyForm.set("newPassword", userDetails.newPassword);
      bodyForm.set("confirmPassword", userDetails.confirmPassword);
    }

    var imageUpload = false;
    if (imageData.croppedImage) {
      console.log(imageData.croppedImage);
      bodyForm.append("image", imageData.croppedImage);
      imageUpload = true;
    }

    axios({
      method: "PUT",
      url: `/user/?changePassword=${!disable}&imageUpload=${imageUpload}`,
      data: bodyForm,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        if (imageUpload) setUserDetails({ image: res.data.filename });
        console.log(disable);
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
          setMessage({ data: res.data.message, type: SUCCESS });
        }
      })
      .catch((err) => {
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

  const handleCrop = async () => {
    try {
      setImageData({
        ...imageData,
        isCropping: true,
      });
      const croppedImage = await getCroppedImg(
        imageData.src,
        imageData.croppedAreaPixels
      );
      setImageData({
        ...imageData,
        croppedImage,
        src: null,
      });
    } catch (e) {
      console.error(e);
      setImageData({
        ...imageData,
        isCropping: false,
      });
    }
  };

  const handleCancelCrop = () => {
    setImageData({ ...imageData, src: null });
    document.querySelector("#image").value = null;
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      setImageData({
        ...imageData,
        src: imageDataUrl,
        crop: { x: 0, y: 0 },
        zoom: 1,
      });
    }
  };

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleCropChange = (crop) => {
    setImageData({ ...imageData, crop });
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setImageData({
      ...imageData,
      croppedAreaPixels,
    });
  };

  return (
    <>
      {imageData.src && (
        <Fragment>
          <div className="crop__container">
            <Cropper
              image={imageData.src}
              crop={imageData.crop}
              zoom={imageData.zoom}
              aspect={imageData.aspect}
              cropShape="round"
              onCropChange={handleCropChange}
              onCropComplete={handleCropComplete}
            />
          </div>
          <div className="crop__button">
            <button
              className="crop__button-crop"
              onClick={handleCrop}
              disabled={imageData.isCropping}
            >
              Crop
            </button>
            <button
              className="crop__button-cancel"
              onClick={handleCancelCrop}
              disabled={imageData.isCropping}
            >
              Cancel
            </button>
          </div>
        </Fragment>
      )}

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
          value={userDetails.email}
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
        <div className="dashboard__head-profile-image">
          <label htmlFor="image">Display Picture</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileInput}
          />
        </div>

        <div className="dashboard__head-profile-button">
          <button className="dashboard__head-profile-button__update">
            Update Profile
          </button>
          <button
            className="dashboard__head-profile-button__cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileForm);
