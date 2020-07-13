import React from "react";
import ReactDOM from "react-dom";
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
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

render();

store.subscribe(render);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
