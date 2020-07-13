import { combineReducers } from "redux";
import page from "./setPage";
import activeNav from "./activeNav";
import isLandscape from "./isLandscape";

export default combineReducers({ page, activeNav, isLandscape });
