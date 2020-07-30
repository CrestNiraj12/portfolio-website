import React, { useEffect, useState } from "react";
import axios from "axios";
import { setPage } from "../../actions";
import { connect } from "react-redux";
import { POST } from "../../constants";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Post = ({
  setPage,
  match: {
    params: { id },
  },
}) => {
  const [post, setPost] = useState({
    title: "",
    description: "",
    authorId: "",
    thumbnail: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    setPage(POST);
    axios.get(`/posts/${id}`).then((res) => {
      setPost(res.data);
    });
  }, [id, setPage]);

  return (
    <main>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <h5>
              Author: <span>{post.authorId.fullname}</span> | Created on:{" "}
              <span>{post.createdAt.substring(0, 10)}</span> | Updated on:{" "}
              <span>{post.updatedAt.substring(0, 10)}</span>
            </h5>
          </section>

          <section>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            ></div>
          </section>
        </>
      )}
    </main>
  );
};

export default connect(null, mapDispatchToProps)(Post);
