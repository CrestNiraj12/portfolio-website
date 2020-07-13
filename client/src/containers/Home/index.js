import React, { useEffect, useState } from "react";
import store from "../../store";
import { setPage } from "../../actions";
import Header from "./header";
import Content from "./content";

const Home = ({ page }) => {
  const [activeNav, setActiveNav] = useState(false);

  useEffect(() => {
    store.dispatch(setPage(0));
  }, []);

  useEffect(() => {
    store.subscribe(() => {
      const navActive = store.getState().activeNav;
      setActiveNav(navActive);
    });
  });

  return (
    <>
      {activeNav && <div className="body__overlay"></div>}
      <Header />
      <Content />
    </>
  );
};

export default Home;
