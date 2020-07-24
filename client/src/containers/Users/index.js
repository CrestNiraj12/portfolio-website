import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { setPage, showDialog, setAllUsers } from "../../actions";
import { USERS, REMOVE_ACCOUNT, CHANGE_ROLE } from "../../constants";
import { connect } from "react-redux";
import FeatureHeader from "../../components/FeatureHeader";
import SortOption from "../../components/SortOption";
import Search from "../../components/Search";
import { Checkbox } from "react-input-checkbox";
import { Link, Redirect } from "react-router-dom";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as Details } from "../../images/more.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { sortBy } from "lodash";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
  users: state.users,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      showDialog: (action, payload) => showDialog(action, payload),
      setAllUsers: (users) => setAllUsers(users),
    },
    dispatch
  );

const Users = ({
  match,
  users,
  isLandscape,
  setPage,
  showDialog,
  setAllUsers,
}) => {
  const [usersList, setUsersList] = useState([]);
  const [sort, setSort] = useState("name");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const [redirect, setRedirect] = useState(null);

  const refUsersList = useRef([]);

  useEffect(() => {
    setPage(USERS);

    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("/auth/login");

    if (users !== null) {
      var initialState = {};
      setUsersList(users);
      refUsersList.current = sortBy(users, (a) => a.fullname);
      users.forEach((post) => {
        initialState[post._id] = false;
      });
      setSelected(initialState);
    } else {
      axios.get(`/user/${match.params.id}/all`).then((u) => {
        setAllUsers(u.data);
      });
    }
  }, [setPage, setAllUsers, users, match.params.id]);

  useEffect(() => {
    const list = sortBy(refUsersList.current, (a) => {
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
    });
    if (!ascendingOrder) list.reverse();
    setUsersList(list);
    refUsersList.current = list;
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
    <main className="users">
      {redirect && <Redirect to={redirect} />}
      <FeatureHeader title="All Users" />
      <section className="users__features">
        <div className="users__features-sort">
          <SortOption
            state={sort}
            setState={setSort}
            order={ascendingOrder}
            setOrder={setAscendingOrder}
            options={["Name", "Id", "Role", "Posts"]}
          />
        </div>
        <div className="users__features-search">
          <Search
            setState={setUsersList}
            query="fullname"
            list={refUsersList.current}
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
              <th>Name</th>
              {isLandscape && (
                <>
                  <th>User Id</th>
                  <th>Role</th>
                  <th>Posts</th>
                </>
              )}
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>
            {refUsersList.current.length > 0 &&
              usersList.map((user) => (
                <tr key={user._id}>
                  <td>
                    <Checkbox
                      theme="material-checkbox"
                      value={selected[user._id] ? selected[user._id] : false}
                      onChange={() => handleChange(user._id)}
                    >
                      {" "}
                    </Checkbox>
                  </td>
                  <td>{user.fullname}</td>
                  {isLandscape && (
                    <>
                      <td>{user._id}</td>
                      <td>
                        <select
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                          }}
                          value={user.role}
                          onChange={(e) =>
                            showDialog(CHANGE_ROLE, {
                              userId: user._id,
                              role: e.target.value,
                            })
                          }
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="tester">Tester</option>
                        </select>
                      </td>
                      <td>{user.posts.length}</td>
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
                        onClick={() => showDialog(REMOVE_ACCOUNT, user._id)}
                      />
                    ) : (
                      <Details width="4px" />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {refUsersList.current.length <= 0 && (
          <p
            style={{
              fontWeight: "bold",
              color: "#fff",
              fontSize: "2em",
            }}
          >
            There are no users here except you!
          </p>
        )}
      </section>
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

export default connect(mapStateToProps, mapDispatchToProps)(Users);
