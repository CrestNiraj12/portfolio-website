import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./styles/css/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store from "./store";

const fancyLog = () => {
  console.log("%c Rendered with 👉 👉 👇", "background: purple; color: #FFF");
  console.log(store.getState());
};

const render = () => {
  fancyLog();
  return ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>,
    document.getElementById("root")
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
