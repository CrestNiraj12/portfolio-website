import React, { useEffect, useState } from "react";
import store from "../../store";
import { setPage } from "../../actions";
import Header from "./header";
import Content from "./content";
import Footer from "../../components/Footer";

const Home = ({ page }) => {
  const [activeNav, setActiveNav] = useState(false);

  useEffect(() => {
    store.dispatch(setPage(0));

    store.subscribe(() => {
      const navActive = store.getState().activeNav;
      setActiveNav(navActive);
    });
  }, []);

  return (
    <>
      {activeNav && <div className="body__overlay"></div>}
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default Home;
