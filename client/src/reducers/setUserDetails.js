import { SET_USER_DETAILS } from "../constants";

const initialState = {
  fullname: "",
  email: "",
  image: "",
  role: "",
  password: "",
  newPassword: "",
  confirmPassword: "",
  posts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
