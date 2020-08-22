import React, { useState, useEffect } from "react";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import { setPage, setMessage } from "../../actions";

import { DASHBOARD } from "../../constants";
import { connect } from "react-redux";
import Features from "./Features";
import Content from "./content";
import Attributions from "./attributions";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
  setMessage: (message) => dispatch(setMessage(message)),
});

const Dashboard = ({ location: { state }, setPage, setMessage }) => {
  var history = useHistory();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    setPage(DASHBOARD);
    if (state) {
      setMessage({ data: state.message, type: state.status });
      history.push({ state: "" });
    }
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("/auth/login");
  }, [state, setPage, setMessage, history]);

  return (
    <main className="dashboard">
      {redirect && <Redirect to={redirect} />}
      <Content />
      <Features />
      <Attributions />
    </main>
  );
};

export default withRouter(connect(null, mapDispatchToProps)(Dashboard));
