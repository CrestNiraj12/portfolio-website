import React, { useEffect } from "react";
import { RESET_PASSWORD, RESET_PASSWORD_PAGE, FAILURE } from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import AuthenticationForm from "../../components/AuthenticationForm";
import axios from "axios";
import { useHistory } from "react-router-dom";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const ResetPassword = ({
  match: {
    params: { token },
  },
  setPage,
}) => {
  var history = useHistory();

  useEffect(() => {
    setPage(RESET_PASSWORD_PAGE);
    axios.get(`/user/checkToken/${token}`).catch((err) => {
      history.push({
        pathname: "/auth/login",
        state: { message: err.response.data, status: FAILURE },
      });
    });
  }, [setPage, token, history]);

  return <AuthenticationForm pageTitle={RESET_PASSWORD} token={token} />;
};

export default connect(null, mapDispatchToProps)(ResetPassword);
