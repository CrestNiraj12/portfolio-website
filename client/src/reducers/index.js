import { combineReducers } from "redux";
import page from "./setPage";
import isLandscape from "./isLandscape";
import posts from "./setPosts";
import overflowHidden from "./hideOverflow";
import dialog from "./showDialog";
import userDetails from "./setUserDetails";
import message from "./setMessage";
import users from "./setAllUsers";

export default combineReducers({
  page,
  isLandscape,
  posts,
  overflowHidden,
  dialog,
  userDetails,
  message,
  users,
});
