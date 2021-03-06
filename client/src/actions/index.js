import {
  SET_PAGE,
  IS_LANDSCAPE,
  SET_POSTS,
  HIDE_OVERFLOW,
  SET_USER_DETAILS,
  SET_MESSAGE,
  SUCCESS,
  FAILURE,
  SET_ALL_USERS,
  USER_SCHEMA,
  POST_SCHEMA,
  IS_LOADING_PAGE,
} from "../constants";

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: page,
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

export const setIsLoadingPage = (confirm) => ({
  type: IS_LOADING_PAGE,
  payload: confirm,
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
      dispatch(setIsLoadingPage(false));
    })
    .catch((err) => provideErrorResponse(err, dispatch));

export const thunkLogout = (skipMessage = false) => (
  dispatch,
  getState,
  axios
) =>
  axios
    .get("/auth/logout")
    .then((res) => {
      console.log(skipMessage);
      if (!skipMessage) dispatch(setMessage({ data: res.data, type: SUCCESS }));
      localStorage.setItem("isAuthenticated", false);
      localStorage.setItem("id", "");
      window.location = "/auth/login";
    })
    .catch((err) => provideErrorResponse(err, dispatch, false));

export const thunkRemoveAccount = (id) => (dispatch, getState, axios) => {
  axios
    .delete(`/user/${id}`)
    .then((res) => {
      dispatch(setMessage({ data: res.data, type: SUCCESS }));
      const users = getState().users;
      if (users !== null)
        dispatch(setAllUsers(users.filter(({ _id: userId }) => userId !== id)));
      dispatch(setIsLoadingPage(false));
      if (id === localStorage.getItem("id")) dispatch(thunkLogout(true));
    })
    .catch((err) => provideErrorResponse(err, dispatch));
};

export const thunkDeletePost = (authorId, postId) => (
  dispatch,
  getState,
  axios
) => {
  axios
    .delete(`/posts/${authorId}/${postId}`)
    .then((res) => {
      dispatch(setMessage({ data: res.data, type: SUCCESS }));
      dispatch(
        setUserDetails({
          posts: getState().userDetails.posts.filter(
            (post) => post._id !== postId
          ),
        })
      );

      if (getState().posts !== null)
        dispatch(
          setPosts(getState().posts.filter((post) => post._id !== postId))
        );
      else
        dispatch(
          setUserDetails(
            getState().userDetails.posts.filter((post) => post._id !== postId)
          )
        );
      dispatch(setIsLoadingPage(false));
    })
    .catch((err) => provideErrorResponse(err, dispatch));
};

export const thunkDeleteMultiple = (dict, schema) => (
  dispatch,
  getState,
  axios
) => {
  if (schema === USER_SCHEMA && dict.length === 1)
    dispatch(thunkRemoveAccount(dict[0]));
  else if (schema === POST_SCHEMA && Object.keys(dict).length === 1) {
    const authorId = Object.values(dict)[0];
    const postId = Object.keys(dict)[0];
    dispatch(thunkDeletePost(authorId, postId));
  } else
    axios
      .put(`/${schema}/selected`, { dict })
      .then((res) => {
        dispatch(setMessage({ data: res.data, type: SUCCESS }));
        if (schema === USER_SCHEMA)
          dispatch(
            setAllUsers(
              getState().users.filter(
                ({ _id: id }) => !dict.includes(String(id))
              )
            )
          );
        else if (schema === POST_SCHEMA) {
          dispatch(
            setUserDetails({
              ...getState().userDetails,
              posts: getState().userDetails.posts.filter(
                ({ _id: id }) => !Object.keys(dict).includes(String(id))
              ),
            })
          );
          dispatch(setPosts(null));
        }
        dispatch(setIsLoadingPage(false));
      })
      .catch((err) => provideErrorResponse(err, dispatch));
};

const provideErrorResponse = (err, dispatch, logout = true) => {
  console.log(err);
  if (err.response) {
    if (err.response.status === 401 && logout) {
      dispatch(setMessage({ data: err.response.data, type: FAILURE }));
      dispatch(thunkLogout(true));
    } else {
      dispatch(setIsLoadingPage(false));
      dispatch(setMessage({ data: err.response.data, type: FAILURE }));
    }
  }
};
