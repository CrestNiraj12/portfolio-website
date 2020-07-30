import React, { useEffect, useState } from "react";
import axios from "axios";
import { FAILURE, REDIRECTION_PAGE, SUCCESS } from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import { Redirect, useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const ConfirmMail = ({
  match: {
    params: { token },
  },
  setPage,
}) => {
  var history = useHistory();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    setPage(REDIRECTION_PAGE);
    axios
      .get(`/user/confirm/${token}`)
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
  }, [setPage, token, history]);

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      <h4 style={{ color: "#fff" }}>Redirecting...</h4>
    </>
  );
};

export default connect(null, mapDispatchToProps)(ConfirmMail);
