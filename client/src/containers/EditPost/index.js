import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setPage } from "../../actions";
import SubmitPost from "../../components/SubmitPost";
import { EDITPOST, EDITPOST_PAGE } from "../../constants";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const EditPost = ({
  match: {
    params: { postId },
  },
  setPage,
}) => {
  useEffect(() => {
    setPage(EDITPOST);
  }, [setPage]);

  return <SubmitPost pageTitle={EDITPOST_PAGE} postId={postId} />;
};

export default connect(null, mapDispatchToProps)(EditPost);
