import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as ControlIcon } from "./control.svg";
import { ReactComponent as UserIcon } from "./avatar.svg";
import { ReactComponent as PostIcon } from "./paper.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { DELETE_OWN_POST } from "../../constants";
import { Checkbox } from "react-input-checkbox";
import { showDialog } from "../../actions";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  role: state.userDetails.role,
  posts: state.userDetails.posts,
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) => ({
  showDialog: (action, payload) => dispatch(showDialog(action, payload)),
});

const Features = ({ role, posts, isLandscape, showDialog }) => {
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const features = [
    { url: "/posts", text: "All Posts", Svg: PostIcon },
    { url: "/user/all", text: "All Users", Svg: UserIcon },
  ];

  useEffect(() => {
    var initialState = {};
    posts.forEach((post) => {
      initialState[post._id] = false;
    });
    setSelected(initialState);
  }, [setSelected, posts]);

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
        <div className="dashboard__content-posts">
          <h1>Your Posts {posts.length > 0 && `(${posts.length})`}</h1>
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
              {posts.length > 0 ? (
                posts.map((post) => (
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
                      <TrashIcon
                        width="15px"
                        className="trashIcon"
                        onClick={() => showDialog(DELETE_OWN_POST, post._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <p style={{ fontFamily: "Kurale", color: "#9b9b9b" }}>
                  You have not posted anything!
                </p>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Features);
