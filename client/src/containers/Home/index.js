import React, { useEffect } from "react";
import Header from "./header";
import Content from "./content";
import store from "../../store";
import { setPage } from "../../actions";
import { HOME } from "../../constants";

const Portfolio = () => {
  useEffect(() => {
    store.dispatch(setPage(HOME));
  }, []);

  return (
    <main className="home">
      <Header />
      <Content />
    </main>
  );
};

export default Portfolio;
