import { SET_PAGE } from "../constants";

export default (state = 0, action) => {
  switch (action.type) {
    case SET_PAGE:
      return action.payload;
    default:
      return state;
  }
};
