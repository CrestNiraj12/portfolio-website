import React from "react";

const ImageOverlay = ({ cls }) => {
  return <div className={cls ? cls : "overlay"}>Loading...</div>;
};

export default ImageOverlay;
