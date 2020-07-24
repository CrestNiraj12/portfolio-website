import { SET_ALL_USERS } from "../constants";

export default (state = null, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return action.payload;
    default:
      return state;
  }
};
