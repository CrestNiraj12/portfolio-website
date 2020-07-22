import React, { useEffect } from "react";
import { connect } from "react-redux";
import { setMessage } from "../../actions";

const mapStateToProps = (state) => ({
  message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
  setMessage: (message) => dispatch(setMessage),
});

const Flash = ({ message: { type, data } }) => {
  useEffect(() => {
    document.querySelector(".flash__wrapper").style.opacity = "1";
    setTimeout(() => {
      setMessage({ type: "", data: "" });
      document.querySelector(".flash__wrapper").style.opacity = "0";
    }, 1000);
  });

  return (
    <div className="flash__wrapper">
      <p className={`flash__message ${type}`}>{data}</p>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Flash);
