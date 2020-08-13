import { IS_LOADING_PAGE } from "../constants";

export default (state = true, action) => {
  switch (action.type) {
    case IS_LOADING_PAGE:
      return action.payload;
    default:
      return state;
  }
};
