import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { setPage } from "../../actions";

import { DASHBOARD } from "../../constants";
import { connect } from "react-redux";
import Features from "./Features";
import Content from "./content";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Dashboard = ({ match, setPage }) => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    setPage(DASHBOARD);
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("/auth/login");
  }, [setPage]);

  return (
    <main className="dashboard">
      {redirect && <Redirect to={redirect} />}

      <Content />

      <Features />
      <div className="attributions">
        <a
          href="https://iconscout.com/icons/add"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add Icon
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/google-inc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Inc.
        </a>
        <br />
        <a
          href="https://iconscout.com/icons/link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Link
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/pocike"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alpár - Etele Méder
        </a>
        <br />
        <a
          href="https://iconscout.com/icons/paper"
          target="_blank"
          rel="noopener noreferrer"
        >
          Paper
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/oviyan"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vignesh Oviyan
        </a>
        <br />
        <a
          href="https://iconscout.com/icons/avatar"
          target="_blank"
          rel="noopener noreferrer"
        >
          Avatar
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/pocike"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alpár - Etele Méder
        </a>
        <br />
        <a
          href="https://iconscout.com/icons/delete"
          rel="noopener noreferrer"
          target="_blank"
        >
          delete
        </a>{" "}
        by{" "}
        <a href="https://iconscout.com/contributors/oviyan">Vignesh Oviyan</a>{" "}
        on <a href="https://iconscout.com">Iconscout</a>
        <br />
        <a
          href="https://iconscout.com/icons/pencil"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pencil
        </a>{" "}
        by{" "}
        <a
          href="https://iconscout.com/contributors/pocike"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alpár - Etele Méder
        </a>{" "}
        on <a href="https://iconscout.com">Iconscout</a>
      </div>
    </main>
  );
};

export default connect(null, mapDispatchToProps)(Dashboard);
