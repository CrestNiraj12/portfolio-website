import React from "react";
import { ReactComponent as ButtonLoading } from "./svg/buttonLoading.svg";

const CustomButton = ({ loading, text, clsName, handleClick, svgStyle }) => {
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={clsName ? clsName : ""}
    >
      {loading && (
        <ButtonLoading className="button-loading__svg" style={svgStyle} />
      )}
      {!loading && <span>{text}</span>}
    </button>
  );
};

export default CustomButton;
