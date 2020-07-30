import React, { useEffect } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import { REGISTER } from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Signup = ({ setPage }) => {
  useEffect(() => {
    setPage(REGISTER);
  }, [setPage]);

  return <AuthenticationForm pageTitle="register" />;
};

export default connect(null, mapDispatchToProps)(Signup);
