import React, { useEffect } from "react";
import Header from "./header";
import Content from "./content";
import Footer from "../../components/Footer";
import { setPage, setIsLoadingPage } from "../../actions";
import { HOME } from "../../constants";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  setIsLoadingPage: (confirm) => dispatch(setIsLoadingPage(confirm)),
  setPage: (page) => dispatch(setPage(page)),
});

const Home = ({ setIsLoadingPage, setPage }) => {
  useEffect(() => {
    setIsLoadingPage(true);
    setPage(HOME);
  }, [setIsLoadingPage, setPage]);

  return (
    <main className="home" onLoad={() => setIsLoadingPage(false)}>
      <Header />
      <Content />
      <Footer />
    </main>
  );
};

export default connect(null, mapDispatchToProps)(Home);
