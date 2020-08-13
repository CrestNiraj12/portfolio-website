import React, { useEffect } from "react";
import Header from "./header";
import Content from "./content";
import Footer from "../../components/Footer";
import store from "../../store";
import { setPage, setIsLoadingPage } from "../../actions";
import { HOME } from "../../constants";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
});

const Home = ({ setIsLoadingPage }) => {
  useEffect(() => {
    setIsLoadingPage(true);
    store.dispatch(setPage(HOME));
  }, [setIsLoadingPage]);

  return (
    <main className="home" onLoad={() => setIsLoadingPage(false)}>
      <Header />
      <Content />
      <Footer />
    </main>
  );
};

export default connect(null, mapDispatchToProps)(Home);
