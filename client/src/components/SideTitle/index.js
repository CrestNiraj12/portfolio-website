import React from "react";
import { ReactComponent as Arrow } from "../../images/arrow.svg";

const SideTitle = ({ text, color }) => {
  return (
    <aside className={`side__title-${color.toLowerCase()}`}>
      {text} <Arrow className={`side__title-${color.toLowerCase()}__arrow`} />
    </aside>
  );
};

export default SideTitle;
