import React from "react";
import { connect } from "react-redux";
import {
  thunkLogout,
  thunkRemoveAccount,
  thunkDeletePost,
  showDialog,
} from "../../actions";
import {
  LOG_OUT,
  REMOVE_ACCOUNT,
  DELETE_OWN_POST,
  DELETE_POST,
} from "../../constants";
import { bindActionCreators } from "redux";

const mapStateToProps = (state) => ({
  userDetails: state.userDetails,
  dialog: state.dialog,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showDialog: (action) => showDialog(action),
      logOut: () => thunkLogout(),
      removeAccount: (id) => thunkRemoveAccount(id),
      deletePost: (id, payload) => thunkDeletePost(id, payload),
    },
    dispatch
  );

const Dialog = ({
  userDetails,
  dialog,
  showDialog,
  logOut,
  removeAccount,
  deletePost,
}) => {
  const handleConfirmation = (action, payload = "") => {
    switch (action) {
      case LOG_OUT:
        logOut();
        break;
      case REMOVE_ACCOUNT:
        removeAccount(payload);
        break;
      case DELETE_OWN_POST:
        deletePost(userDetails._id, payload);
        break;
      case DELETE_POST:
        deletePost(payload.userId, payload.postId);
        break;
      default:
        showDialog("NO");
    }
  };

  return (
    <div className="dialog__confirm">
      <h1>{dialog.message.title}</h1>
      <p>{dialog.message.description}</p>
      <div className="dialog__confirm-button">
        <button
          className="dialog__confirm-button__yes"
          onClick={() => handleConfirmation(dialog.action, dialog.payload)}
        >
          {dialog.message.confirmText}
        </button>
        <button
          className="dialog__confirm-button__no"
          onClick={() => handleConfirmation("NO")}
        >
          {dialog.message.denyText}
        </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
