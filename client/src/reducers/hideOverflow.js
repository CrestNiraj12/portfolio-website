import { HIDE_OVERFLOW } from "../constants";

export default (state = false, action) => {
  switch (action.type) {
    case HIDE_OVERFLOW:
      return action.payload;
    default:
      return state;
  }
};
