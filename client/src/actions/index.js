import {
  SET_PAGE,
  ACTIVE_NAV,
  IS_LANDSCAPE,
  SET_POSTS,
  HIDE_OVERFLOW,
  SET_USER_DETAILS,
  SET_MESSAGE,
  SUCCESS,
  FAILURE,
  SET_ALL_USERS,
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

export const showDialog = (action, payload = "") => ({
  type: action,
  payload,
});

export const setUserDetails = (details) => ({
  type: SET_USER_DETAILS,
  payload: details,
});

export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});

export const setAllUsers = (users) => ({
  type: SET_ALL_USERS,
  payload: users,
});

export const thunkChangeRole = (userId, role) => (dispatch, getState, axios) =>
  axios
    .put(`/user/${userId}/changeRole`, { role })
    .then((res) => {
      dispatch(setMessage({ data: res.data.message, type: SUCCESS }));
      res.data.user.role = role;
      dispatch(
        setAllUsers([
          ...getState().users.filter((user) => user._id !== res.data.user._id),
          res.data.user,
        ])
      );
    })
    .catch((err) =>
      dispatch(setMessage({ data: err.response.data, type: FAILURE }))
    );

export const thunkLogout = (skipMessage = false) => (
  dispatch,
  getState,
  axios
) =>
  axios
    .get("/auth/logout")
    .then((res) => {
      if (!skipMessage) dispatch(setMessage({ data: res.data, type: SUCCESS }));
      localStorage.setItem("id", "");
      localStorage.setItem("isAuthenticated", false);

      window.location = "/auth/login";
    })
    .catch((err) => {
      dispatch(setMessage({ data: err.response.data, type: FAILURE }));
    });

export const thunkRemoveAccount = (id) => (dispatch, getState, axios) => {
  axios
    .delete(`/user/${id}`)
    .then((res) => {
      dispatch(setMessage({ data: res.data, type: SUCCESS }));
      dispatch(setAllUsers(getState().users.filter((user) => user._id !== id)));

      if (id === getState().userDetails._id) dispatch(thunkLogout(true));
    })
    .catch((err) => {
      dispatch(setMessage({ data: err.response.data, type: FAILURE }));
    });
};

export const thunkDeletePost = (authorId, postId) => (
  dispatch,
  getState,
  axios
) => {
  axios
    .delete(`/posts/${authorId}/${postId}`)
    .then((res) => {
      console.log(res);
      dispatch(setMessage({ data: res.data, type: SUCCESS }));
    })
    .catch((err) => {
      dispatch(setMessage({ data: err.response.data, type: FAILURE }));
    });

  dispatch(
    setUserDetails({
      posts: getState().userDetails.posts.filter((post) => post._id !== postId),
    })
  );

  dispatch(setPosts(getState().posts.filter((post) => post._id !== postId)));
};
