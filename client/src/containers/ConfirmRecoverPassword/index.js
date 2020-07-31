import React, { useEffect } from "react";
import { RECOVER_PASSWORD, RECOVER_PASSWORD_PAGE } from "../../constants";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import AuthenticationForm from "../../components/AuthenticationForm";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const ConfirmRecoverPassword = ({ setPage }) => {
  useEffect(() => {
    setPage(RECOVER_PASSWORD_PAGE);
  }, [setPage]);

  return <AuthenticationForm pageTitle={RECOVER_PASSWORD} />;
};

export default connect(null, mapDispatchToProps)(ConfirmRecoverPassword);
