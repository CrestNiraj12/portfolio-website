import { combineReducers } from "redux";
import page from "./setPage";
import activeNav from "./activeNav";
import isLandscape from "./isLandscape";
import posts from "./setPosts";

export default combineReducers({
  page,
  activeNav,
  isLandscape,
  posts,
});
