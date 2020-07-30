import React, { useState, useEffect } from "react";
import axios from "axios";
import { FAILURE, SUCCESS, PATTERN, CHANGE_PASSWORD } from "../../constants";
import { connect } from "react-redux";
import { setPage, setMessage } from "../../actions";
import { useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setMessage: (message) => dispatch(setMessage(message)),
});

const ChangePassword = ({
  match: {
    params: { token },
  },
  setPage,
  setMessage,
}) => {
  var history = useHistory();
  const [details, setDetails] = useState({});

  useEffect(() => {
    setPage(CHANGE_PASSWORD);
  }, [setPage]);

  const handleChangeInput = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    axios
      .put(`/user/changePassword/${token}`, details)
      .then((res) => {
        history.push({
          pathname: "/auth/login",
          state: { message: res.data, status: SUCCESS },
        });
      })
      .catch((err) => {
        console.log(details);
        console.log(err.response);
        setMessage({ data: err.response.data, type: FAILURE });
      });
  };

  return (
    <main>
      <form>
        <input
          type="password"
          name="newPassword"
          pattern={PATTERN}
          className="password__new"
          onChange={handleChangeInput}
        />
        <input
          type="password"
          name="confirmPassword"
          className="password__confirm"
          onChange={handleChangeInput}
        />
        <button onClick={handleChangePassword}>Change Password</button>
      </form>
    </main>
  );
};

export default connect(null, mapDispatchToProps)(ChangePassword);
