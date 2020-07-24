import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { setPage, isLandscape, showDialog } from "../../actions";
import { USERS, REMOVE_ACCOUNT } from "../../constants";
import { connect } from "react-redux";
import FeatureHeader from "../../components/FeatureHeader";
import SortOption from "../../components/SortOption";
import Search from "../../components/Search";
import { Checkbox } from "react-input-checkbox";
import { Link } from "react-router-dom";
import { ReactComponent as Pencil } from "../../images/pencil.svg";
import { ReactComponent as Details } from "../../images/more.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  showDialog: (action, payload) => showDialog(action, payload),
});

const Users = ({ setPage, showDialog }) => {
  const [usersList, setUsersList] = useState([]);
  const [sort, setSort] = useState("name");
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const [allSelection, setAllSelection] = useState(false);
  const [selected, setSelected] = useState({});

  const refUsersList = useRef([]);

  useEffect(() => {
    setPage(USERS);
    axios.get("/user/all").then((users) => {
      var initialState = {};
      setUsersList(users.data);
      refUsersList.current = users.data;
      users.data.forEach((post) => {
        initialState[post._id] = false;
      });
      setSelected(initialState);
    });
  }, [setPage]);

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

  const handleDeleteUser = (userId) => {
    showDialog(REMOVE_ACCOUNT, userId);
  };

  return (
    <main className="users">
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
            query="name"
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
            {usersList.length > 0 &&
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
                      <td>{user.role}</td>
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
                        onClick={() => handleDeleteUser(user._id)}
                      />
                    ) : (
                      <Details width="4px" />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
          {usersList.length <= 1 && (
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
        </table>
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
