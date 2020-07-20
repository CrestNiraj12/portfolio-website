import { HIDE_OVERFLOW, ACTIVE_NAV } from "../constants";

export default (state = false, action) => {
  switch (action.type) {
    case HIDE_OVERFLOW:
      return action.payload;
    case ACTIVE_NAV:
      return action.payload;
    default:
      return state;
  }
};
