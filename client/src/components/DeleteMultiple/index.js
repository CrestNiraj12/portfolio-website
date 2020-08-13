import React from "react";
import { pickBy } from "lodash";
import { showDialog } from "../../actions";
import { connect } from "react-redux";
import { POST_SCHEMA, USER_SCHEMA } from "../../constants";

const mapStateToProps = (state) => ({
  posts: state.posts,
  users: state.users,
  userPosts: state.userDetails.posts,
});

const mapDispatchToProps = (dispatch) => ({
  showDialog: (action, payload) => dispatch(showDialog(action, payload)),
});

const DeleteMultiple = ({
  schema,
  posts,
  userPosts,
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
      const postsList = posts && posts.length > 0 ? posts : userPosts;

      postsList.forEach((post) => {
        if (selectedListIds.includes(post._id)) {
          const authorId =
            posts && posts.length > 0 ? post.authorId._id : post.authorId;
          dict[post._id] = post.authorId !== null ? authorId : 404;
        }
      });

      showDialog(action, dict);
    } else if (schema === USER_SCHEMA) showDialog(action, selectedListIds);
  };

  return (
    <button
      className="control__features-select__multiple-delete__button"
      onClick={() => handleDeleteMultiple(schema)}
      disabled={isDisabled}
    >
      Delete selected
    </button>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMultiple);
