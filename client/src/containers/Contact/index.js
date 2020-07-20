import React, { useEffect } from "react";
import Content from "./content";
import { setPage } from "../../actions";
import { CONTACT } from "../../constants";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Contact = ({ setPage }) => {
  useEffect(() => {
    setPage(CONTACT);
  }, [setPage]);

  return <Content />;
};

export default connect(null, mapDispatchToProps)(Contact);
