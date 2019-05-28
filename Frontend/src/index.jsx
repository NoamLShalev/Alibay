import ReactDOM from "react-dom";
import "./css/main.css";
import React, { Component } from "react";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
