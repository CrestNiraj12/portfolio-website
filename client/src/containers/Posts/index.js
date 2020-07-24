import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { setPage, showDialog, setPosts } from "../../actions";
import { POSTS, DELETE_POST } from "../../constants";
import { Checkbox } from "react-input-checkbox";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as Details } from "../../images/more.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import Search from "../../components/Search";
import { bindActionCreators } from "redux";
import SortOption from "../../components/SortOption";
import FeatureHeader from "../../components/FeatureHeader";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      showDialog: (action, payload) => dispatch(showDialog(action, payload)),
      setPosts: (posts) => setPosts(posts),
    },
    dispatch
  );

const Posts = ({ posts, isLandscape, setPage, showDialog, setPosts }) => {
  const [postsList, setPostsList] = useState([]);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const [sort, setSort] = useState("title");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [redirect, setRedirect] = useState(null);

  const refPostsList = useRef([]);

  useEffect(() => {
    setPage(POSTS);

    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("/auth/login");

    if (posts !== null) {
      var initialState = {};
      setPostsList(posts);
      refPostsList.current = sortBy(posts, (a) => a.title);
      posts.forEach((post) => {
        initialState[post._id] = false;
      });
      setSelected(initialState);
    } else
      axios.get("/posts/").then((p) => {
        setPosts(p.data);
      });
  }, [posts, setPage, setPosts]);

  useEffect(() => {
    const list = sortBy(refPostsList.current, (a) => {
      switch (sort.toLowerCase()) {
        case "title":
          return a.title;
        case "author":
          return a.authorId.fullname;
        case "created":
          return a.createdAt;
        case "updated":
          return a.updatedAt;
        default:
          return a;
      }
    });
    if (!ascendingOrder) list.reverse();
    setPostsList(list);
    refPostsList.current = list;
  }, [ascendingOrder, sort]);

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

  return (
    <main className="posts">
      {redirect && <Redirect to={redirect} />}
      <FeatureHeader title="All Posts" />
      <section className="posts__features">
        <div className="posts__features-sort">
          <SortOption
            state={sort}
            setState={setSort}
            order={ascendingOrder}
            setOrder={setAscendingOrder}
            options={["Title", "Author", "Created on", "Updated on"]}
          />
        </div>
        <div className="posts__features-search">
          <Search
            setState={setPostsList}
            query="title"
            list={refPostsList.current}
          />
        </div>
      </section>
      <section>
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
              <th>Title</th>
              {isLandscape && (
                <>
                  <th>Author</th>
                  <th>Created</th>
                  <th>Last Updated</th>
                </>
              )}
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {postsList.length > 0 &&
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
                      <td>
                        {post.authorId ? post.authorId.fullname : "Deleted"}
                      </td>
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
                    {isLandscape ? (
                      <TrashIcon
                        width="15px"
                        className="trashIcon"
                        onClick={() =>
                          showDialog(DELETE_POST, {
                            userId:
                              post.authorId !== null ? post.authorId._id : 404,
                            postId: post._id,
                          })
                        }
                      />
                    ) : (
                      <Details width="4px" />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {postsList.length <= 0 && (
          <p
            style={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: "2em",
            }}
          >
            There are no posts here!
          </p>
        )}
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
      </section>
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
