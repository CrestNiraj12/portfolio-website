import { SET_PAGE, ACTIVE_NAV, IS_LANDSCAPE } from "../constants";

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
