import React, { useEffect } from "react";
import Content from "./content";
import store from "../../store";
import { setPage } from "../../actions";
import { HOME } from "../../constants";

const Portfolio = () => {
  useEffect(() => {
    store.dispatch(setPage(HOME));
  }, []);
  return <Content />;
};

export default Portfolio;
