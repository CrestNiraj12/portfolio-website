import React, { useEffect } from "react";
import AuthenticationForm from "../../components/AuthenticationForm";
import { REGISTER, REGISTER_PAGE } from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Signup = ({ setPage }) => {
  useEffect(() => {
    setPage(REGISTER_PAGE);
  }, [setPage]);

  return <AuthenticationForm pageTitle={REGISTER} />;
};

export default connect(null, mapDispatchToProps)(Signup);
