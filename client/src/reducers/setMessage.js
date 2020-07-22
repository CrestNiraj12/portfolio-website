import { SET_MESSAGE } from "../constants";

export default (state = { type: "", data: "" }, action) => {
  switch (action.type) {
    case SET_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};
