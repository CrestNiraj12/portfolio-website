import React from "react";

const Collab = () => {
  const handleScrollToContact = () => {
    window.scroll({
      top: document.querySelector(".footer").offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <section className="collab">
      <p>
        Let's get <span>started.</span>
      </p>
      <p>
        Keep in touch <span onClick={handleScrollToContact}>Contact me</span>
      </p>
    </section>
  );
};

export default Collab;
