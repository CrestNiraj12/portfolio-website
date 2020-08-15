import React, { useEffect } from "react";
import { RESET_PASSWORD, RESET_PASSWORD_PAGE, FAILURE } from "../../constants";
import { connect } from "react-redux";
import { setPage, setIsLoadingPage } from "../../actions";
import AuthenticationForm from "../../components/AuthenticationForm";
import axios from "axios";
import { useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const ResetPassword = ({
  match: {
    params: { token },
  },
  setPage,
  setIsLoadingPage,
}) => {
  var history = useHistory();

  useEffect(() => {
    setIsLoadingPage(true);
    setPage(RESET_PASSWORD_PAGE);
    axios
      .get(`/user/checkToken/${token}`)
      .then(() => {
        setIsLoadingPage(false);
      })
      .catch((err) => {
        setIsLoadingPage(false);
        history.push({
          pathname: "/auth/login",
          state: { message: err.response.data, status: FAILURE },
        });
      });
  }, [setPage, token, setIsLoadingPage, history]);

  return <AuthenticationForm pageTitle={RESET_PASSWORD} token={token} />;
};

export default connect(null, mapDispatchToProps)(ResetPassword);
