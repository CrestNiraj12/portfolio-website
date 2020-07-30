import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FAILURE,
  SUCCESS,
  EMAIL_PATTERN,
  RECOVER_PASSWORD,
} from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import { Redirect, useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const ConfirmMail = ({ setPage }) => {
  var history = useHistory();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    setPage(RECOVER_PASSWORD);
  }, [setPage]);

  const handleRecoverPassword = (e) => {
    const email = document.querySelector(".email__input").value;
    axios
      .post("/auth/recoverPassword", { email })
      .then((res) => {
        history.push({ state: { message: res.data, status: SUCCESS } });
      })
      .catch((err) => {
        console.log(err);
        history.push({
          state: { message: err.response.data, status: FAILURE },
        });
      });
    setRedirect("/auth/login");
  };

  return (
    <main>
      {redirect && <Redirect to={redirect} />}
      <form>
        <input
          type="email"
          pattern={EMAIL_PATTERN}
          name="email"
          className="email__input"
        />
        <button onClick={handleRecoverPassword}>Recover Password</button>
      </form>
    </main>
  );
};

export default connect(null, mapDispatchToProps)(ConfirmMail);
