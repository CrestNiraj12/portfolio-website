import React from "react";

const Flash = ({ type, data }) => {
  return (
    <div className="flash__wrapper">
      <p className={`flash__message ${type}`}>{data}</p>
    </div>
  );
};

export default Flash;
