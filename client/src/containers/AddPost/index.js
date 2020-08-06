import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import SubmitPost from "../../components/SubmitPost";
import { ADDPOST, ADDPOST_PAGE } from "../../constants";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const AddPost = ({ setPage }) => {
  useEffect(() => {
    setPage(ADDPOST);
  }, [setPage]);

  return <SubmitPost pageTitle={ADDPOST_PAGE} />;
};

export default connect(null, mapDispatchToProps)(AddPost);
