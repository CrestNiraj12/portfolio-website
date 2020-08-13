import React, { useEffect, useState } from "react";
import axios from "axios";
import { FAILURE, REDIRECTION_PAGE, SUCCESS } from "../../constants";
import { connect } from "react-redux";
import { setPage, setIsLoadingPage } from "../../actions";
import { Redirect, useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const ConfirmMail = ({
  match: {
    params: { token },
  },
  setPage,
  setIsLoadingPage,
}) => {
  var history = useHistory();
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    setIsLoadingPage(true);
    setPage(REDIRECTION_PAGE);
    axios
      .get(`/user/confirm/${token}`)
      .then((res) => {
        history.push({ state: { message: res.data, status: SUCCESS } });
        setIsLoadingPage(false);
      })
      .catch((err) => {
        console.log(err);
        history.push({
          state: { message: err.response.data, status: FAILURE },
        });
      });
    setRedirect("/auth/login");
  }, [setPage, token, history, setIsLoadingPage]);

  return (
    <>
      {redirect && <Redirect to={redirect} />}
      <h4 style={{ color: "#fff" }}>Redirecting...</h4>
    </>
  );
};

export default connect(null, mapDispatchToProps)(ConfirmMail);
