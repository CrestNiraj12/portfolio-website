const { IS_LANDSCAPE } = require("../constants");

export default (state = false, action) => {
  switch (action.type) {
    case IS_LANDSCAPE:
      return action.payload;
    default:
      return state;
  }
};
