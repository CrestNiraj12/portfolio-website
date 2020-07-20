import { SET_POSTS } from "../constants";

export default (state = [], action) => {
  switch (action.type) {
    case SET_POSTS:
      return action.payload;
    default:
      return state;
  }
};
