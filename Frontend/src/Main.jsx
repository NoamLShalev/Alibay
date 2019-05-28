import React, { Component } from "react";
import Coffee from "./Coffee.jsx";
import Tea from "./Tea.jsx";
import { Link } from "react-router-dom";

class Main extends Component {
  constructor() {
    super();
  }

  render = () => {
    return (
      <div>
        <h1 className="header">Procaffeinating</h1>
        <div className="container">
          <Link to={"/coffee"} className="main-button">
            <img className="main-img" src={"/coffee v1.png"} />
          </Link>
          <Link to={"/tea"} className="main-button">
            <img className="main-img" src={"/tea v1.png"} />
          </Link>
        </div>
      </div>
    );
  };
}

export default Main;
