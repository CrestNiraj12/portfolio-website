import React, { useEffect } from "react";
import { setPage } from "../../actions";
import { connect } from "react-redux";
import { USERS } from "../../constants";
import AdminControl from "../../components/AdminControl";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Users = ({ setPage }) => {
  useEffect(() => {
    setPage(USERS);
  }, [setPage]);

  return <AdminControl page={USERS} />;
};

export default connect(null, mapDispatchToProps)(Users);
