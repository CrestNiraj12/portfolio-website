import { CONFIRM_ACTION } from "../constants";

export default (state = false, action) => {
  switch (action.type) {
    case CONFIRM_ACTION:
      return action.payload;
    default:
      return state;
  }
};
