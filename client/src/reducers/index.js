import { combineReducers } from "redux";
import page from "./setPage";
import activeNav from "./activeNav";
import isLandscape from "./isLandscape";
import posts from "./setPosts";
import overflowHidden from "./hideOverflow";
import dialog from "./showDialog";
import confirmAction from "./confirmAction";

export default combineReducers({
  page,
  activeNav,
  isLandscape,
  posts,
  overflowHidden,
  dialog,
  confirmAction,
});
