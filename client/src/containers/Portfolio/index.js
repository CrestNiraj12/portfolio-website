import React, { useEffect } from "react";
import Content from "./content";
import store from "../../store";
import { setPage } from "../../actions";
import { PORTFOLIO } from "../../constants";

const Portfolio = () => {
  useEffect(() => {
    store.dispatch(setPage(PORTFOLIO));
  }, []);
  return <Content />;
};

export default Portfolio;
