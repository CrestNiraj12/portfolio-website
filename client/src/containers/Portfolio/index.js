import React, { useEffect } from "react";
import Content from "./content";
import store from "../../store";
import { setPage } from "../../actions";

const Portfolio = () => {
  useEffect(() => {
    store.dispatch(setPage(2));
  }, []);
  return <Content />;
};

export default Portfolio;
