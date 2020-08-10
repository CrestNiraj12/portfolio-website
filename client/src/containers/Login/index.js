import React, { useEffect } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import { LOGIN_PAGE, LOGIN } from "../../constants";
import { useHistory } from "react-router-dom";
import { setMessage, setPage } from "../../actions";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setMessage: (message) => dispatch(setMessage(message)),
});

const Login = ({ location: { state }, setPage, setMessage }) => {
  var history = useHistory();

  useEffect(() => {
    setPage(LOGIN_PAGE);
    if (state) {
      setMessage({ data: state.message, type: state.status });
      history.push({ state: "" });
    }
  }, [state, history, setPage, setMessage]);

  return <AuthenticationForm pageTitle={LOGIN} />;
};

export default connect(null, mapDispatchToProps)(Login);
