import React from "react";
import { ReactComponent as More } from "../../images/more.svg";
import { ReactComponent as TrashIcon } from "../../images/trash.svg";
import { ReactComponent as InfoIcon } from "../../images/info.svg";
import { connect } from "react-redux";
import { showDialog } from "../../actions";

const mapStateToProps = (state) => ({
  isLandscape: state.isLandscape,
});

const matchDispatchToProps = (dispatch) => ({
  showDialog: (action, payload) => dispatch(showDialog(action, payload)),
});

const ShowMore = ({
  handleShowDetails,
  isLandscape,
  deleteItem,
  action,
  payload,
  showDialog,
}) => {
  const handleShowMore = (e) => {
    e.currentTarget.children[1].style.display = isLandscape ? "block" : "flex";
  };

  const handleBlur = (e) => {
    e.currentTarget.children[1].style.display = "none";
  };

  return (
    <div
      className="more"
      tabIndex={0}
      onBlur={handleBlur}
      onClick={handleShowMore}
    >
      <More className="more__icon" />
      <ul>
        <li onClick={handleShowDetails}>
          {isLandscape ? "Details" : <InfoIcon width="12px" />}
        </li>
        {deleteItem && isLandscape && (
          <li onClick={() => showDialog(action, payload)}>Delete</li>
        )}
        {deleteItem && !isLandscape && (
          <li onClick={() => showDialog(action, payload)}>
            <TrashIcon width="12px" className="trashIcon" />
          </li>
        )}
      </ul>
    </div>
  );
};

export default connect(mapStateToProps, matchDispatchToProps)(ShowMore);
