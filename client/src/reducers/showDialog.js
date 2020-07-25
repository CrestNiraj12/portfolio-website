import {
  LOG_OUT,
  REMOVE_ACCOUNT,
  REMOVE_OWN_ACCOUNT,
  DELETE_OWN_POST,
  CHANGE_ROLE,
  DELETE_POST,
  DELETE_MULTIPLE_POSTS,
  DELETE_MULTIPLE_USERS,
} from "../constants";

const initialState = {
  message: {
    title: "Are you sure?",
    description: "",
    confirmText: "Confirm",
    denyText: "Cancel",
  },
  show: false,
  action: "NONE",
  payload: "",
};

export default (state = initialState, action) => {
  const constState = { show: true, action: action.type };
  switch (action.type) {
    case LOG_OUT:
      return {
        message: {
          ...state.message,
          description: "You are going to log out from this page.",
          confirmText: "Logout",
        },
        ...constState,
      };

    case REMOVE_OWN_ACCOUNT:
      return {
        message: {
          ...state.message,
          description: "You are going to remove your account permanently.",
          confirmText: "Remove",
        },
        ...constState,
        payload: action.payload,
      };

    case REMOVE_ACCOUNT:
      return {
        message: {
          ...state.message,
          description: "You are going to remove this account permanently.",
          confirmText: "Remove",
        },
        ...constState,
        payload: action.payload,
      };

    case DELETE_OWN_POST:
    case DELETE_POST:
      return {
        message: {
          ...state.message,
          description: "You are going to delete this post permanently.",
          confirmText: "Delete",
        },
        ...constState,
        payload: action.payload,
      };

    case DELETE_MULTIPLE_POSTS:
      return {
        message: {
          ...state.message,
          description:
            "You are going to delete all the selected posts permanently.",
          confirmText: "Delete",
        },
        ...constState,
        payload: action.payload,
      };

    case DELETE_MULTIPLE_USERS:
      return {
        message: {
          ...state.message,
          description:
            "You are going to remove all the selected users permanently.",
          confirmText: "Remove",
        },
        ...constState,
        payload: action.payload,
      };

    case CHANGE_ROLE:
      return {
        message: {
          ...state.message,
          description: "You are going to change the user's role.",
          confirmText: "Change",
        },
        ...constState,
        payload: action.payload,
      };

    default:
      return initialState;
  }
};
