import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  setPage,
  showDialog,
  setAllUsers,
  setIsLoadingPage,
  setPosts,
} from "../../actions";
import {
  USERS,
  REMOVE_ACCOUNT,
  CHANGE_ROLE,
  DELETE_MULTIPLE_USERS,
  USER_SCHEMA,
  ADMIN,
  EDITOR,
  TESTER,
  DELETE_POST,
  DELETE_MULTIPLE_POSTS,
  POST_SCHEMA,
} from "../../constants";
import { connect } from "react-redux";
import FeatureHeader from "../FeatureHeader";
import SortOption from "../SortOption";
import Search from "../Search";
import { Checkbox } from "react-input-checkbox";
import { Link, Redirect } from "react-router-dom";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { sortBy } from "lodash";
import { bindActionCreators } from "redux";
import DeleteMultiple from "../DeleteMultiple";
import ShowMore from "../ShowMore";
import DetailsCard from "../DetailsCard";
import Attributions from "./attributions";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
  users: state.users,
  posts: state.posts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      showDialog: (action, payload) => showDialog(action, payload),
      setAllUsers: (users) => setAllUsers(users),
      setPosts: (posts) => setPosts(posts),
      setIsLoadingPage: (confirm) => setIsLoadingPage(confirm),
    },
    dispatch
  );

const AdminControl = ({
  page,
  users,
  isLandscape,
  posts,
  showDialog,
  setAllUsers,
  setPosts,
  hide,
  setIsLoadingPage,
}) => {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState(page === USERS ? "name" : "title");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [details, setDetails] = useState({});

  const refList = useRef([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("/auth/login");

    setIsLoadingPage(true);
    var initialState = {};

    if (page === USERS)
      if (users !== null) {
        setList(users);
        refList.current = sortBy(users, (a) => a.fullname);
        users.forEach((post) => {
          initialState[post._id] = false;
        });
        setSelected(initialState);
        setIsLoadingPage(false);
      } else {
        axios.get("/user/all/?exclude=true").then((u) => {
          setAllUsers(u.data);
        });
      }
    else if (posts !== null) {
      setList(posts);
      refList.current = sortBy(posts, (a) => a.title);
      posts.forEach((post) => {
        initialState[post._id] = false;
      });
      setSelected(initialState);
      setIsLoadingPage(false);
    } else
      axios.get("/posts/").then((p) => {
        setPosts(p.data);
      });
  }, [page, setIsLoadingPage, setAllUsers, users, posts, setPosts]);

  useEffect(() => {
    const data_list =
      page === USERS
        ? sortBy(refList.current, (a) => {
            switch (sort.toLowerCase()) {
              case "name":
                return a.fullname;
              case "id":
                return a._id;
              case "role":
                return a.role;
              case "posts":
                return a.posts.length;
              default:
                return a;
            }
          })
        : sortBy(refList.current, (a) => {
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
    if (!ascendingOrder) data_list.reverse();
    setList(data_list);
    refList.current = data_list;
  }, [ascendingOrder, setIsLoadingPage, sort, page]);

  const checkSelected = (selections) => {
    if (Object.values(selections).some((elem) => elem)) setDisabled(false);
    else setDisabled(true);
  };

  const handleChange = (id) => {
    var selections = { ...selected, [id]: !selected[id] };
    setSelected(selections);

    if (Object.values(selections).every((elem) => elem)) setAllSelection(true);
    else setAllSelection(false);

    checkSelected(selections);
  };

  const handleAllSelect = () => {
    setAllSelection(!allSelection);

    var selections = {};

    Object.keys(selected).forEach((key) => {
      selections[key] = !allSelection;
    });

    checkSelected(selections);
    setSelected(selections);
  };

  const handleShowUserDetails = ({ _id: id, fullname, email, role, posts }) => {
    setDetails({ id, fullname, email, role, posts });
    document.querySelector(".control__show-details").style.display = "flex";
  };

  const handleShowPostDetails = ({
    _id: id,
    title,
    authorId,
    createdAt,
    updatedAt,
  }) => {
    setDetails({
      id,
      title,
      author: authorId.fullname,
      created: createdAt.substring(0, 10),
      updated: updatedAt.substring(0, 10),
    });
    document.querySelector(".control__show-details").style.display = "flex";
  };

  return (
    <main className="control" style={hide && { margin: "0" }}>
      {redirect && <Redirect to={redirect} />}
      <div className="control__show-details">
        {details && Object.keys(details).length > 0 && (
          <DetailsCard
            query={page === USERS ? "users" : "posts"}
            details={details}
            handleCloseCard={() => setDetails({})}
          />
        )}
      </div>
      {!hide && (
        <FeatureHeader title={`All ${page === USERS ? "Users" : "Posts"}`} />
      )}
      <section className="control__features">
        <div className="control__features-sort">
          <SortOption
            state={sort}
            setState={setSort}
            order={ascendingOrder}
            setOrder={setAscendingOrder}
            options={
              page === "USERS"
                ? ["Name", "Id", "Role", "Posts"]
                : ["Title", "Author", "Created on", "Updated on"]
            }
          />
        </div>
        <div className="control__features-select">
          <div className="control__features-select__multiple-delete">
            <DeleteMultiple
              selected={selected}
              isDisabled={disabled}
              action={
                page === USERS ? DELETE_MULTIPLE_USERS : DELETE_MULTIPLE_POSTS
              }
              schema={page === USERS ? USER_SCHEMA : POST_SCHEMA}
            />
          </div>
          <div className="control__features-select__search">
            <Search
              setState={setList}
              query={page === USERS ? "fullname" : "title"}
              list={refList.current}
            />
          </div>
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
              {page === USERS ? (
                <>
                  <th>Name</th>
                  {isLandscape && (
                    <>
                      <th>User Id</th>
                      <th>Role</th>
                      <th>Posts</th>
                    </>
                  )}
                </>
              ) : (
                <>
                  <th>Title</th>
                  {isLandscape && (
                    <>
                      <th>Author</th>
                      <th>Created</th>
                      <th>Last Updated</th>
                    </>
                  )}
                </>
              )}
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {refList.current.length > 0 &&
              list.map((data) =>
                page === USERS ? (
                  <tr key={data._id}>
                    <td>
                      <Checkbox
                        theme="material-checkbox"
                        value={selected[data._id] ? selected[data._id] : false}
                        onChange={() => handleChange(data._id)}
                      >
                        {" "}
                      </Checkbox>
                    </td>
                    <td>{data.fullname}</td>
                    {isLandscape && (
                      <>
                        <td>{data._id}</td>
                        <td>{data.posts.length}</td>
                      </>
                    )}
                    <td>
                      <select
                        style={{
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          cursor: "pointer",
                        }}
                        value={data.role}
                        onChange={(e) =>
                          showDialog(CHANGE_ROLE, {
                            userId: data._id,
                            role: e.target.value,
                          })
                        }
                      >
                        <option value={ADMIN}>Admin</option>
                        <option value={EDITOR}>Editor</option>
                        <option value={TESTER}>Tester</option>
                      </select>
                    </td>
                    <td>
                      {isLandscape && data.role !== ADMIN ? (
                        <TrashIcon
                          width="15px"
                          className="trashIcon"
                          onClick={() => showDialog(REMOVE_ACCOUNT, data._id)}
                        />
                      ) : (
                        <ShowMore
                          deleteItem={
                            !isLandscape && data.role !== ADMIN ? true : false
                          }
                          handleShowDetails={() => handleShowUserDetails(data)}
                          action={REMOVE_ACCOUNT}
                          payload={data._id}
                        />
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr key={data._id}>
                    <td>
                      <Checkbox
                        theme="material-checkbox"
                        value={selected[data._id] ? selected[data._id] : false}
                        onChange={() => handleChange(data._id)}
                      >
                        {" "}
                      </Checkbox>
                    </td>
                    <td>
                      <Link
                        to={`/posts/${
                          data.title
                            .toLowerCase()
                            .replace(/[^a-z ]/g, "")
                            .split(" ")
                            .join("-") +
                          "-" +
                          data._id
                        }`}
                      >
                        {data.title}
                      </Link>
                    </td>
                    {isLandscape && (
                      <>
                        <td>
                          {data.authorId ? data.authorId.fullname : "Deleted"}
                        </td>
                        <td>{data.createdAt.substring(0, 10)}</td>
                        <td>{data.updatedAt.substring(0, 10)}</td>
                      </>
                    )}

                    <td>
                      <Link to={`/update/posts/${data._id}`}>
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
                                data.authorId !== null
                                  ? data.authorId._id
                                  : 404,
                              postId: data._id,
                            })
                          }
                        />
                      ) : (
                        <ShowMore
                          deleteItem={true}
                          action={DELETE_POST}
                          payload={{
                            userId:
                              data.authorId !== null ? data.authorId._id : 404,
                            postId: data._id,
                          }}
                          handleShowDetails={() => handleShowPostDetails(data)}
                        />
                      )}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
        {refList.current.length <= 0 && (
          <p
            style={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: isLandscape ? "2em" : "1.1em",
            }}
          >
            There are no {page === USERS ? "users" : "posts"} here
            {page === USERS && " except you"}!
          </p>
        )}
      </section>
      {refList.current.length > 0 && !hide && <Attributions />}
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminControl);
