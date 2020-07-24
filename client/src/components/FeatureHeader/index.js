import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as Arrow } from "../../images/arrow.svg";

const FeatureHeader = ({ title }) => {
  let history = useHistory();

  return (
    <section className="feature__header">
      <div className="feature__header-back">
        <Arrow
          className="feature__header-back__arrow"
          onClick={() => history.goBack()}
        />
      </div>
      <h1>{title}</h1>
    </section>
  );
};

export default FeatureHeader;
