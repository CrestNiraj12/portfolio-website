import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers";
import axios from "axios";

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(axios))
);

export default store;
