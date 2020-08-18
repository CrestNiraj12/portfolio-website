import React from "react";

const Attributions = () => {
  return (
    <section
      className="attributions"
      style={{
        bottom: "0",
        position: "absolute",
        right: "10%",
        fontSize: "0.5em",
      }}
    >
      <h2>Attributions</h2>
      <br />
      <a
        href="https://iconscout.com/icons/home"
        target="_blank"
        rel="noopener noreferrer"
      >
        home
      </a>{" "}
      by{" "}
      <a
        href="https://iconscout.com/contributors/oviyan"
        target="_blank"
        rel="noopener noreferrer"
      >
        Vignesh Oviyan
      </a>
      <br />
    </section>
  );
};

export default Attributions;
