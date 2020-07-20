import {
  SET_PAGE,
  ACTIVE_NAV,
  IS_LANDSCAPE,
  SET_POSTS,
  HIDE_OVERFLOW,
  SHOW_DIALOG,
  CONFIRM_ACTION,
} from "../constants";

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: page,
});

export const activeNav = (active) => ({
  type: ACTIVE_NAV,
  payload: active,
});

export const isLandscape = (confirm) => ({
  type: IS_LANDSCAPE,
  payload: confirm,
});

export const setPosts = (posts) => ({
  type: SET_POSTS,
  payload: posts,
});

export const hideOverflow = (hide) => ({
  type: HIDE_OVERFLOW,
  payload: hide,
});

export const showDialog = (message, show) => ({
  type: SHOW_DIALOG,
  payload: { message, show },
});

export const confirmAction = (confirm) => ({
  type: CONFIRM_ACTION,
  payload: confirm,
});
