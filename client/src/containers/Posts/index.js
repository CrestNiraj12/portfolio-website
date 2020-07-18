import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { setPage } from "../../actions";
import store from "../../store";

const Posts = () => {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    store.dispatch(setPage(7));
    axios.get("/posts/").then((posts) => {
      console.log(posts);
      setPostsList(posts.data);
    });
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {postsList &&
        postsList.map((post) => (
          <Link
            key={post._id}
            to={`/posts/${
              post.title.toLowerCase().split(" ").join("-") + "-" + post._id
            }`}
          >
            <p>{post.title}</p>
          </Link>
        ))}
    </div>
  );
};

export default Posts;
