import React, { useEffect } from "react";
import { setPage } from "../../actions";
import { POSTS } from "../../constants";
import { connect } from "react-redux";
import AdminControl from "../../components/AdminControl";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Posts = ({ setPage }) => {
  useEffect(() => {
    setPage(POSTS);
  }, [setPage]);

  return <AdminControl page={POSTS} />;
};

export default connect(null, mapDispatchToProps)(Posts);
