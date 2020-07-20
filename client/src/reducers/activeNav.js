import { ACTIVE_NAV } from "../constants";

export default (state = false, action) => {
  switch (action.type) {
    case ACTIVE_NAV:
      return action.payload;
    default:
      return state;
  }
};
