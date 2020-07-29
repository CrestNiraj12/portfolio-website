import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setMessage, thunkLogout } from "../../actions";
import { FAILURE, ADDPOST } from "../../constants";
import { useHistory } from "react-router-dom";
import setPage from "../../reducers/setPage";

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      setMessage: (message) => setMessage(message),
      logOut: () => thunkLogout(true),
    },
    dispatch
  );

const AddPost = ({ setMessage, logOut }) => {
  var history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setPage(ADDPOST);
  });

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleAddPost = () => {
    const bodyForm = new FormData();
    const title = document.querySelector(".addpost__content-form-title").value;
    const description = document.querySelector(
      ".addpost__content-form-description"
    ).value;
    const thumbnail = document.querySelector(
      ".addpost__content-form-thumbnail__input"
    ).files[0];

    bodyForm.set("title", title);
    bodyForm.set("description", description);
    bodyForm.set("image", thumbnail);
    bodyForm.set("content", content);

    axios({
      method: "POST",
      url: "/user/addpost",
      data: bodyForm,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        history.push("/user/dashboard");
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

  const handleThumbnailPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      const preview = document.querySelector("#preview");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const handleThumbnailClick = () => {
    document.querySelector("#thumbnail").click();
  };

  return (
    <main className="addpost">
      <section className="addpost__head">
        <h1>Add Post</h1>
      </section>
      <section className="addpost__content-form">
        <input
          type="text"
          className="addpost__content-form-title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="addpost__content-form-description"
          placeholder="Description"
          required
        />
        <div
          className="addpost__content-form-preview"
          style={{ cursor: "pointer" }}
          onClick={handleThumbnailClick}
        >
          <img
            src="https://dummyimage.com/600x400/ffffff/a6a6a6.jpg&text=Thumbnail"
            alt="Preview"
            id="preview"
          />
        </div>
        <div className="addpost__content-form-thumbnail">
          <label
            className="addpost__content-form-thumbnail__label"
            htmlFor="thumbnail"
          >
            Insert Thumbnail ----&gt;
          </label>
          <input
            type="file"
            accept="image/*"
            id="thumbnail"
            className="addpost__content-form-thumbnail__input"
            onChange={handleThumbnailPreview}
            required
          />
        </div>

        <Editor
          apiKey="1lvin9aa1mtv7lw8kldumik1xbmvujcw56cr1dqatcnedqds"
          initialValue=""
          init={{
            height: 500,
            menubar: true,
            image_caption: true,
            a11y_advanced_options: true,
            image_uploadtab: true,
            content_css: [
              "//fonts.googleapis.com/css2?family=Baloo+Paaji+2:wght@500;700&family=Galada&family=Kurale&family=Encode+Sans+Expanded:wght@600&display=swap",
            ],
            font_formats:
              "Arial=arial black, avant garde, helvetica, sans-serif;Courier New=courier new,courier,monospace;Kurale=kurale, serif;Galada=galada, cursive;Baloo paaji 2=baloo paaji 2, cursive;Encode Sans Expanded=encode sans expanded, sans-serif;",
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste imagetools code help wordcount",
              "casechange importcss searchreplace autosave save directionality advcode visualchars mediaembed template codesample hr pagebreak nonbreaking toc",
              "checklist tinymcespellchecker a11ychecker textpattern noneditable formatpainter permanentpen pageembed mentions quickbars linkchecker emoticons advtable",
            ],
            toolbar:
              "undo redo | formatselect fontselect fontsizeselect | bold italic forecolor backcolor emoticons | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            images_upload_handler: (blobInfo, success, failure, progress) => {
              const formData = new FormData();
              formData.append("image", blobInfo.blob());

              axios
                .post("/posts/images/upload", formData, {
                  onUploadProgress: (e) => {
                    progress((e.loaded / e.total) * 100);
                  },
                })
                .then((res) => {
                  success(res.data.location);
                })
                .catch((err) => {
                  failure("Image upload failed! Error: " + err);
                });
            },
          }}
          onEditorChange={handleEditorChange}
          className="addpost__content-form-editor"
        />
        <div className="addpost__content-form-submit">
          <button
            onClick={handleAddPost}
            className="addpost__content-form-submit__button"
          >
            Add Post
          </button>
        </div>
      </section>
      <section className="addpost__content-preview">
        <p className="addpost__content-preview__head">Preview</p>
        <div
          className="addpost__content-preview__content"
          dangerouslySetInnerHTML={{
            __html:
              `<h1 style="font-size:3em;font-family:Kurale;text-align:center">${title}</h1>` +
              content,
          }}
        ></div>
      </section>
    </main>
  );
};

export default connect(null, mapDispatchToProps)(AddPost);
