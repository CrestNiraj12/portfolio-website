import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setMessage,
  thunkLogout,
  setPosts,
  setIsLoadingPage,
} from "../../actions";
import { FAILURE, SUCCESS, EDITPOST_PAGE } from "../../constants";
import { useHistory } from "react-router-dom";
import FeatureHeader from "../FeatureHeader";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPosts: (posts) => setPosts(posts),
      setMessage: (message) => setMessage(message),
      logOut: () => thunkLogout(true),
      setIsLoadingPage: (confirm) => setIsLoadingPage(confirm),
    },
    dispatch
  );

const SubmitPost = ({
  postId,
  pageTitle,
  isLandscape,
  setMessage,
  setPosts,
  logOut,
  setIsLoadingPage,
}) => {
  var history = useHistory();
  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [thumbnailImage, setThumbnailImage] = useState(null);

  useEffect(() => {
    setIsLoadingPage(true);
    if (pageTitle === EDITPOST_PAGE)
      axios
        .get(`/posts/${postId}`)
        .then((res) => {
          setPost(res.data);
          setIsLoadingPage(false);
          const preview = document.querySelector("#preview");
          preview.src = `/images/posts/${res.data.thumbnail}`;
        })
        .catch((err) => {
          console.log(err.response);
          setMessage({ message: err.response.data, type: FAILURE });
        });
    else setIsLoadingPage(false);
  }, [postId, pageTitle, setMessage, setIsLoadingPage]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    const bodyForm = new FormData();
    bodyForm.set("title", post.title);
    bodyForm.set("description", post.description);
    bodyForm.set("image", thumbnailImage);
    bodyForm.set("content", post.content);

    axios({
      method: pageTitle === EDITPOST_PAGE ? "PUT" : "POST",
      url:
        pageTitle === EDITPOST_PAGE
          ? `/posts/update/${postId}`
          : "/user/addpost",
      data: bodyForm,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setPosts(null);
        history.push("/user/dashboard");
        setMessage({ data: res.data, type: SUCCESS });
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

  const handleInputChange = (e, value = null) => {
    if (e.target.name === "thumbnail") {
      const file = e.target.files[0];
      setThumbnailImage(file);
      const preview = document.querySelector("#preview");
      preview.src = URL.createObjectURL(file);
    } else
      setPost({
        ...post,
        [e.target.name]: value === null ? e.target.value : value,
      });
  };

  return (
    <main className="submitpost" onLoad={() => setIsLoadingPage(false)}>
      {isLandscape ? (
        <>
          <section className="submitpost__head">
            <FeatureHeader
              title={pageTitle === EDITPOST_PAGE ? "Edit Post" : "Add Post"}
            />
          </section>
          <section className="submitpost__content-form">
            <form onSubmit={handleSubmitPost}>
              <input
                type="text"
                className="submitpost__content-form-title"
                placeholder="Title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="submitpost__content-form-description"
                placeholder="Description"
                name="description"
                value={post.description}
                onChange={handleInputChange}
                required
              />
              <div
                className="submitpost__content-form-preview"
                style={{ cursor: "pointer" }}
                onClick={() => document.querySelector("#thumbnail").click()}
              >
                <img
                  src="https://dummyimage.com/400x600/ffffff/a6a6a6.jpg&text=Thumbnail"
                  alt="Preview"
                  id="preview"
                />
              </div>
              <div className="submitpost__content-form-thumbnail">
                <label
                  className="submitpost__content-form-thumbnail__label"
                  htmlFor="thumbnail"
                >
                  Insert Thumbnail ----&gt;
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="thumbnail"
                  name="thumbnail"
                  className="submitpost__content-form-thumbnail__input"
                  onChange={handleInputChange}
                />
              </div>

              <Editor
                apiKey="1lvin9aa1mtv7lw8kldumik1xbmvujcw56cr1dqatcnedqds"
                value={post.content}
                init={{
                  height: 500,
                  menubar: true,
                  image_caption: true,
                  a11y_advanced_options: true,
                  image_uploadtab: true,
                  content_css: [
                    "//fonts.googleapis.com/css2?family=Baloo+Paaji+2:wght@500;700&family=Galada&family=Kurale&family=Encode+Sans+Expanded:wght@600&display=swap",
                  ],
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste imagetools code help wordcount",
                    "importcss searchreplace autosave save directionality visualchars template codesample hr pagebreak nonbreaking toc",
                  ],
                  toolbar:
                    "undo redo | formatselect fontsizeselect | bold italic forecolor backcolor emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                  images_upload_handler: (
                    blobInfo,
                    success,
                    failure,
                    progress
                  ) => {
                    const formData = new FormData();
                    formData.append("image", blobInfo.blob());

                    axios
                      .post("/posts/images/upload", formData, {
                        onUploadProgress: (e) => {
                          progress((e.loaded / e.total) * 100);
                        },
                      })
                      .then((res) => {
                        console.log(res.data.location);
                        success(res.data.location);
                      })
                      .catch((err) => {
                        failure("Image upload failed! Error: " + err);
                      });
                  },
                }}
                onEditorChange={(content, editor) =>
                  handleInputChange({ target: { name: "content" } }, content)
                }
                className="submitpost__content-form-editor"
              />
              <div className="submitpost__content-form-submit">
                <button className="submitpost__content-form-submit__button">
                  {pageTitle === EDITPOST_PAGE ? "Update Post" : "Add Post"}
                </button>
              </div>
            </form>
          </section>
          <section className="submitpost__content-preview">
            <p className="submitpost__content-preview__head">Preview</p>
            <div
              className="submitpost__content-preview__content"
              dangerouslySetInnerHTML={{
                __html:
                  `<h1 style="font-size:3em;font-family:'Roboto Slab';text-align:center">${post.title}</h1>` +
                  post.content,
              }}
            ></div>
          </section>
        </>
      ) : (
        <section
          style={{
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
          }}
        >
          <h1 style={{ color: "#fff" }}>
            Please open this page on a computer! <br />
            Mobile devices are not supported!
          </h1>
          <button
            onClick={() => history.goBack()}
            style={{
              background: "transparent",
              border: "none",
              color: "#96cdef",
              textDecoration: "underline",
            }}
          >
            Go back
          </button>
        </section>
      )}
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmitPost);
