import { SHOW_DIALOG } from "../constants";

export default (state = { message: {}, show: false }, action) => {
  switch (action.type) {
    case SHOW_DIALOG:
      return action.payload;
    default:
      return state;
  }
};
