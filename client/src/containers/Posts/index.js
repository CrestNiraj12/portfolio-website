import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { setPage } from "../../actions";
import store from "../../store";
import { POSTS } from "../../constants";
import { Checkbox } from "react-input-checkbox";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as Details } from "./more.svg";
import { ReactComponent as Arrow } from "../../images/arrow.svg";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ isLandscape: state.isLandscape });

const Posts = ({ isLandscape }) => {
  let history = useHistory();
  const [postsList, setPostsList] = useState([]);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});

  const getPosts = useCallback(() => {
    var initialState = {};
    axios.get("/posts/").then((posts) => {
      setPostsList(posts.data);
      posts.data.forEach((post) => {
        initialState[post._id] = false;
      });
      setSelected(initialState);
    });
  }, []);

  useEffect(() => {
    store.dispatch(setPage(POSTS));
    getPosts();
  }, [getPosts]);

  const handleChange = (id) => {
    var selections = { ...selected, [id]: !selected[id] };
    setSelected(selections);

    if (Object.values(selections).every((elem) => elem)) setAllSelection(true);
    else setAllSelection(false);
  };

  const handleAllSelect = () => {
    setAllSelection(!allSelection);

    var selections = {};
    Object.keys(selected).forEach((key) => {
      selections[key] = !allSelection;
    });

    setSelected(selections);
  };

  const orientedWidth = !isLandscape ? { width: "20%" } : {};

  return (
    <main className="posts">
      <section className="posts__header">
        <div className="posts__header-back">
          <Arrow
            className="posts__header-back__arrow"
            onClick={() => history.goBack()}
          />
        </div>
        <h1>All Posts</h1>
      </section>
      <table>
        <thead>
          <tr>
            <th>
              <Checkbox
                theme="material-checkbox"
                value={allSelection}
                onChange={handleAllSelect}
              >
                {" "}
              </Checkbox>
            </th>
            <th style={!isLandscape ? { width: "70%" } : {}}>Title</th>
            {isLandscape && (
              <>
                <th>Created</th>
                <th>Last Updated</th>
              </>
            )}
            <th colSpan="2" style={orientedWidth}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {postsList &&
            postsList.map((post) => (
              <tr key={post._id}>
                <td>
                  <Checkbox
                    theme="material-checkbox"
                    value={selected[post._id] ? selected[post._id] : false}
                    onChange={() => handleChange(post._id)}
                  >
                    {" "}
                  </Checkbox>
                </td>
                <td>
                  <Link
                    to={`/posts/${
                      post.title.toLowerCase().split(" ").join("-") +
                      "-" +
                      post._id
                    }`}
                  >
                    {post.title}
                  </Link>
                </td>
                {isLandscape && (
                  <>
                    <td>{post.createdAt.substring(0, 10)}</td>
                    <td>{post.updatedAt.substring(0, 10)}</td>
                  </>
                )}

                <td>
                  <Link to="/">
                    <Pencil width="15px" />
                  </Link>
                </td>
                <td>
                  <Link to="/">
                    <Details width="4px" />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="attributions">
        <a
          href="https://iconscout.com/icons/more"
          target="_blank"
          rel="noopener noreferrer"
        >
          more
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/pocike"
          rel="noopener noreferrer"
        >
          Alpár - Etele Méder
        </a>{" "}
        on <a href="https://iconscout.com">Iconscout</a>
        <br />
        <a
          href="https://iconscout.com/icons/pencil"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pencil
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/pocike"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alpár - Etele Méder
        </a>{" "}
        on <a href="https://iconscout.com">Iconscout</a>
      </div>
    </main>
  );
};

export default connect(mapStateToProps)(Posts);
