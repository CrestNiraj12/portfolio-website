import React, { useEffect, useState } from "react";
import { setPage } from "../../actions";
import Header from "./header";
import Content from "./content";
import Footer from "../../components/Footer";
import { HOME } from "../../constants";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
  navActive: state.navActive,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) => dispatch(setPage(page)),
});

const Home = ({ navActive, setPage }) => {
  const [activeNav, setActiveNav] = useState(false);

  useEffect(() => {
    setPage(HOME);
    setActiveNav(navActive);
  }, [navActive, setPage]);

  return (
    <>
      {activeNav && <div className="body__overlay"></div>}
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
