import React from "react";
import { pickBy } from "lodash";
import { showDialog } from "../../actions";
import { connect } from "react-redux";
import { POST_SCHEMA, USER_SCHEMA } from "../../constants";

const mapStateToProps = (state) => ({
  posts: state.posts,
  users: state.users,
});

const mapDispatchToProps = (dispatch) => ({
  showDialog: (action, payload) => dispatch(showDialog(action, payload)),
});

const DeleteMultiple = ({
  schema,
  users,
  posts,
  selected,
  isDisabled,
  showDialog,
  action,
}) => {
  const handleDeleteMultiple = (schema) => {
    const selectedList = pickBy(selected, (v, k) => v);
    const selectedListIds = Object.keys(selectedList);
    const dict = {};
    if (schema === POST_SCHEMA) {
      if (posts.length > 0) {
        posts.forEach((post) => {
          if (selectedListIds.includes(post._id))
            dict[post._id] = post.authorId._id;
        });
        showDialog(action, dict);
      }
    } else if (schema === USER_SCHEMA) showDialog(action, selectedListIds);
  };

  return (
    <button
      className="posts__features-select__multiple-delete__button"
      onClick={() => handleDeleteMultiple(schema)}
      disabled={isDisabled}
    >
      Delete selected
    </button>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMultiple);
