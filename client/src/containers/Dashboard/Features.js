import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as ControlIcon } from "./control.svg";
import { ReactComponent as UserIcon } from "./avatar.svg";
import { ReactComponent as PostIcon } from "./paper.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { ReactComponent as AddIcon } from "./add.svg";
import { ReactComponent as Details } from "../../images/more.svg";
import { DELETE_OWN_POST } from "../../constants";
import { Checkbox } from "react-input-checkbox";
import { showDialog } from "../../actions";
import { connect } from "react-redux";
import Search from "../../components/Search";
import { sortBy } from "lodash";
import SortOption from "../../components/SortOption";

const mapStateToProps = (state) => ({
  userId: state.userDetails._id,
  role: state.userDetails.role,
  posts: state.userDetails.posts,
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) => ({
  showDialog: (action, payload) => dispatch(showDialog(action, payload)),
});

const Features = ({ userId, role, posts, isLandscape, showDialog }) => {
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const [postsList, setPostsList] = useState(posts);
  const [sort, setSort] = useState("title");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: `/user/${userId}/all`, text: "All Users", Svg: UserIcon },
    { url: "/", text: "Add Post", Svg: AddIcon },
  ];

  const refPosts = useRef([]);

  useEffect(() => {
    setPostsList(sortBy(posts, (a) => a.title));
    refPosts.current = sortBy(posts, (a) => a.title);
    var initialState = {};
    posts.forEach((post) => {
      initialState[post._id] = false;
    });

    setSelected(initialState);
  }, [posts]);

  useEffect(() => {
    const list = sortBy(refPosts.current, (a) => {
      switch (sort.toLowerCase()) {
        case "title":
          return a.title;
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
    refPosts.current = list;
  }, [sort, ascendingOrder]);

  const handleAllSelect = () => {
    setAllSelection(!allSelection);

    var selections = {};
    Object.keys(selected).forEach((key) => {
      selections[key] = !allSelection;
    });

    setSelected(selections);
  };

  const handleChange = (id) => {
    var selections = { ...selected, [id]: !selected[id] };
    setSelected(selections);

    if (Object.values(selections).every((elem) => elem)) setAllSelection(true);
    else setAllSelection(false);
  };

  return (
    <section className="dashboard__content">
      {role && role !== "editor" && (
        <>
          <div className="dashboard__content-heading">
            <ControlIcon />
            <h2 style={{ color: "#fff" }}>Control Center</h2>
          </div>
          <div className="dashboard__content-features">
            {features.map(({ url, text, Svg }) => (
              <Link key={url} to={url}>
                <div className="dashboard__content-features__card">
                  <p>{text}</p>
                  <Svg className="dashboard__content-features__card-icon" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {role && role !== "tester" && (
        <div className="posts__content-posts">
          <h1>Your Posts {posts.length > 0 && `(${posts.length})`}</h1>
          <div
            className="posts__features"
            style={isLandscape ? { margin: "5% 0" } : {}}
          >
            <div className="posts__features-sort">
              <SortOption
                state={sort}
                setState={setSort}
                order={ascendingOrder}
                setOrder={setAscendingOrder}
                options={["Title", "Created on", "Updated on"]}
              />
            </div>
            <div className="posts__features-search">
              <Search
                setState={setPostsList}
                query="title"
                list={refPosts.current}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr className="dashboard__head-row">
                <th>
                  <Checkbox
                    theme="material-checkbox"
                    value={allSelection}
                    onChange={handleAllSelect}
                  >
                    {" "}
                  </Checkbox>
                </th>
                <th style={isLandscape ? { width: "60%" } : {}}>Title</th>
                {isLandscape && (
                  <>
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
                  <tr key={post._id} className="dashboard__body-row">
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
                        to={`/posts/${post.title
                          .toLowerCase()
                          .split(" ")
                          .join("-")}-${post._id}`}
                      >
                        <p>{post.title}</p>
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
                      {isLandscape ? (
                        <TrashIcon
                          width="15px"
                          className="trashIcon"
                          onClick={() => showDialog(DELETE_OWN_POST, post._id)}
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
            <p style={{ fontFamily: "Kurale", color: "#fff", fontSize: "2em" }}>
              You have not posted anything!
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Features);
