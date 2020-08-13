import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setPage, setIsLoadingPage } from "../../actions";
import SubmitPost from "../../components/SubmitPost";
import { ADDPOST, ADDPOST_PAGE } from "../../constants";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const AddPost = ({ setPage, setIsLoadingPage }) => {
  useEffect(() => {
    setPage(ADDPOST);
  }, [setPage, setIsLoadingPage]);

  return <SubmitPost pageTitle={ADDPOST_PAGE} />;
};

export default connect(null, mapDispatchToProps)(AddPost);
