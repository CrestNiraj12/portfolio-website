import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "false") setRedirect("../auth/login");
  }, []);

  const handleLogout = () => {
    axios
      .get("/auth/logout")
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("isAuthenticated", false);
        setRedirect("/");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="test">
      {redirect && <Redirect to={redirect} />}
      <p style={{ color: "#fff" }}>I am in dashboard!</p>
      <button style={{ cursor: "pointer" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
