import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { SUCCESS, LOG_OUT, REMOVE_OWN_ACCOUNT, FAILURE } from "../../constants";
import UpdateProfileForm from "./UpdateProfileForm";
import { ReactComponent as LinkIcon } from "./svg/link.svg";
import { ReactComponent as AddIcon } from "./svg/addPP.svg";
import {
  showDialog,
  setUserDetails,
  thunkLogout,
  setMessage,
  setIsLoadingPage,
} from "../../actions";
import { bindActionCreators } from "redux";
import ImageOverlay from "../../components/ImageOverlay";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";

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
  const [imageData, setImageData] = useState({
    src: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: 1 / 1,
    croppedAreaPixels: null,
    croppedImage: null,
    isCropping: false,
  });

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

    if (!isLandscape) {
      document.querySelector("#hoverIcon").style.cssText = "display: block;";
      document.querySelector(".dashboard__head-profile__img").style.filter =
        "brightness(0.8)";
    }
  };

  const handleImageLoad = (e) => {
    document.querySelector(
      ".dashboard__head-profile__img-loader"
    ).style.display = "none";
    e.target.style.position = "relative";
    e.target.style.visibility = "visible";
  };

  const handleCrop = async () => {
    setIsLoadingPage(true);
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

      var bodyForm = new FormData();
      bodyForm.append("image", croppedImage);

      axios({
        method: "PUT",
        url: "/user/imageUpload",
        data: bodyForm,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          setIsLoadingPage(false);
          setUserDetails({ image: res.data.filename });
          setMessage({ data: res.data.message, type: SUCCESS });
        })
        .catch((err) => {
          setIsLoadingPage(false);
          if (err.response.status === 401) {
            setMessage({ data: err.response.data, type: FAILURE });
            logOut(true);
          } else {
            console.log(err.response);
            setMessage({ data: err.response.data, type: FAILURE });
          }
        });
    } catch (e) {
      setIsLoadingPage(false);
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

  const handleInputClick = () => {
    document.getElementById("image").click();
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
      <section className="dashboard__head">
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: "none" }}
        />

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
            <div className="dashboard__head-profile__img-wrapper">
              <img
                src={
                  userDetails.image && userDetails.image.startsWith("http")
                    ? userDetails.image
                    : `/images/users/${userDetails.image}`
                }
                alt="Profile"
                onLoad={handleImageLoad}
                onClick={handleInputClick}
              />
              <AddIcon
                className="dashboard__head-profile__img-wrapper__hoverIcon"
                id="hoverIcon"
                onClick={handleInputClick}
              />
            </div>
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
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
