const { SET_POSTS } = require("../constants");

export default (state = [], action) => {
  switch (action.type) {
    case SET_POSTS:
      return action.payload;
    default:
      return state;
  }
};
