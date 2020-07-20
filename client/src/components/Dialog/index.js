import React from "react";

const Dialog = ({ dialog, handleConfirmation }) => {
  return (
    <div className="dialog__confirm">
      <h1>{dialog.message.title}</h1>
      <p>{dialog.message.description}</p>
      <div className="dialog__confirm-button">
        <button
          className="dialog__confirm-button__yes"
          onClick={() => handleConfirmation(true)}
        >
          {dialog.message.confirmText}
        </button>
        <button
          className="dialog__confirm-button__no"
          onClick={() => handleConfirmation(false)}
        >
          {dialog.message.denyText}
        </button>
      </div>
    </div>
  );
};

export default Dialog;
