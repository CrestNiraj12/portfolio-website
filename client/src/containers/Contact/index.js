import React, { useEffect } from "react";
import Content from "./content";
import store from "../../store";
import { setPage } from "../../actions";

const Contact = () => {
  useEffect(() => {
    store.dispatch(setPage(1));
  }, []);

  return <Content />;
};

export default Contact;
