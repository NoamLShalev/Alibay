import { createStore } from "redux";
let reducer = (state, action) => {
  if (action.type === "Login") {
    return { ...state, login: true };
  }
  if (action.type === "logout-success") {
    return { ...state, login: false };
  }
  if (action.type === "coffee") {
    return { ...state, category: "coffee" };
  }
  if (action.type === "tea") {
    return { ...state, category: "tea" };
  }
  return state;
};

const store = createStore(
  reducer,
  { login: false, category: "" },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
