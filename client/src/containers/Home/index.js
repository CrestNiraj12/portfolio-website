import React, { useEffect } from "react";
import Header from "./header";
import Content from "./content";
import Footer from "../../components/Footer";
import { setPage } from "../../actions";
import { HOME } from "../../constants";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Home = ({ setPage }) => {
  useEffect(() => {
    setPage(HOME);
  }, [setPage]);

  return (
    <main className="home">
      <Header />
      <Content />
      <Footer />
    </main>
  );
};

export default connect(null, mapDispatchToProps)(Home);
