import React, { useEffect, useState } from "react";
import axios from "axios";
import { setPage } from "../../actions";
import store from "../../store";

const Users = () => {
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    store.dispatch(setPage(8));
    axios.get("/user/all").then((users) => {
      console.log(users);
      setUsersList(users.data);
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {usersList &&
        usersList.map((user) => <p key={user._id}>{user.fullname}</p>)}
    </div>
  );
};

export default Users;
