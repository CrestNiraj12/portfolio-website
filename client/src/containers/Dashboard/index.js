import React, { useState, useEffect, useCallback } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { setPage, confirmAction, showDialog } from "../../actions";

import { DASHBOARD } from "../../constants";
import { SUCCESS, FAILURE } from "../../constants";
import { connect } from "react-redux";
import Flash from "../../components/Flash";
import Features from "./Features";
import Content from "./content";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => ({
  actionConfirm: state.confirmAction,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPage: (page) => setPage(page),
      showDialog: (message, show) => showDialog(message, show),
      confirmAction: (confirm) => confirmAction(confirm),
    },
    dispatch
  );

const Dashboard = ({
  match,
  actionConfirm,
  showDialog,
  setPage,
  confirmAction,
}) => {
  const [redirect, setRedirect] = useState(null);
  const [message, setMessage] = useState({});

  useEffect(() => {
    setPage(DASHBOARD);
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../../auth/login");
  }, [setPage]);

  const handleLogout = useCallback(
    (skipMessage = false) => {
      if (!skipMessage)
        showDialog(
          {
            title: "Are you sure?",
            description: "You are going to log out from this page.",
            confirmText: "Logout",
            denyText: "Cancel",
          },
          true
        );

      if (skipMessage || actionConfirm)
        axios
          .get("/auth/logout")
          .then((res) => {
            setMessage({ data: res.data, type: SUCCESS });
            localStorage.setItem("id", "");
            localStorage.setItem("isAuthenticated", false);

            setRedirect("/auth/login");
          })
          .catch((err) => {
            console.log(err.response.data, FAILURE);
          });

      confirmAction(false);
    },
    [actionConfirm, confirmAction, showDialog]
  );

  return (
    <>
      <Flash type={message.type} data={message.data} />
      <main className="dashboard">
        {redirect && <Redirect to={redirect} />}

        <Content
          id={match.params.id}
          handleLogout={handleLogout}
          setMessage={setMessage}
        />

        <Features handleLogout={handleLogout} />
        <div className="attributions">
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
        </div>
      </main>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
