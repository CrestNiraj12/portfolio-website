import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { setPage, showDialog, setAllUsers } from "../../actions";
import {
  USERS,
  REMOVE_ACCOUNT,
  CHANGE_ROLE,
  DELETE_MULTIPLE_USERS,
  USER_SCHEMA,
  ADMIN,
  EDITOR,
  TESTER,
} from "../../constants";
import { connect } from "react-redux";
import FeatureHeader from "../../components/FeatureHeader";
import SortOption from "../../components/SortOption";
import Search from "../../components/Search";
import { Checkbox } from "react-input-checkbox";
import { Link, Redirect } from "react-router-dom";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { sortBy } from "lodash";
import { bindActionCreators } from "redux";
import DeleteMultiple from "../../components/DeleteMultiple";
import ShowMore from "../../components/ShowMore";
import DetailsCard from "../../components/DetailsCard";

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

const Users = ({ users, isLandscape, setPage, showDialog, setAllUsers }) => {
  const [usersList, setUsersList] = useState([]);
  const [sort, setSort] = useState("name");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [details, setDetails] = useState({});

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
      axios.get("/user/all/?exclude=true").then((u) => {
        setAllUsers(u.data);
      });
    }
  }, [setPage, setAllUsers, users]);

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

  const handleShowDetails = ({ _id: id, fullname, email, role, posts }) => {
    setDetails({ id, fullname, email, role, posts });
    document.querySelector(".users__show-details").style.display = "flex";
  };

  return (
    <main className="users">
      {redirect && <Redirect to={redirect} />}
      <div className="users__show-details">
        {details && Object.keys(details).length > 0 && (
          <DetailsCard
            query="users"
            details={details}
            handleCloseCard={() => setDetails({})}
          />
        )}
      </div>
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
        <div className="users__features-select">
          <div className="users__features-select__multiple-delete">
            <DeleteMultiple
              selected={selected}
              isDisabled={disabled}
              action={DELETE_MULTIPLE_USERS}
              schema={USER_SCHEMA}
            />
          </div>
          <div className="posts__features-select__search">
            <Search
              setState={setUsersList}
              query="fullname"
              list={refUsersList.current}
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
                          <option value={ADMIN}>Admin</option>
                          <option value={EDITOR}>Editor</option>
                          <option value={TESTER}>Tester</option>
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
                    {isLandscape && user.role !== ADMIN ? (
                      <TrashIcon
                        width="15px"
                        className="trashIcon"
                        onClick={() => showDialog(REMOVE_ACCOUNT, user._id)}
                      />
                    ) : (
                      <ShowMore
                        deleteItem={
                          !isLandscape && user.role !== ADMIN ? true : false
                        }
                        handleShowDetails={() => handleShowDetails(user)}
                        action={REMOVE_ACCOUNT}
                        payload={user._id}
                      />
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
              fontSize: isLandscape ? "2em" : "1.1em",
            }}
          >
            There are no users here except you!
          </p>
        )}
      </section>
      {refUsersList.current.length > 0 && (
        <section className="attributions">
          <a
            href="https://iconscout.com/icons/denied-icon"
            target="_blank"
            rel="noopener noreferrer"
          >
            Denied Icon
          </a>{" "}
          by{" "}
          <a
            href="https://iconscout.com/contributors/chamedesign/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chameleon Design
          </a>
          <br />
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
          <br />
          <a
            href="https://iconscout.com/icons/delete"
            rel="noopener noreferrer"
            target="_blank"
          >
            delete
          </a>{" "}
          by{" "}
          <a href="https://iconscout.com/contributors/oviyan">Vignesh Oviyan</a>{" "}
          on <a href="https://iconscout.com">Iconscout</a>
        </section>
      )}
    </main>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
