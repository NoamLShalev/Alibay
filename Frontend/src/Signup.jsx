import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./css/login-signup.css";
let path = "http://159.89.112.34:4000/";

class UnconnectedSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsername = event => {
    console.log("new username", event);
    this.setState({ username: event.target.value });
  };

  handlePassword = event => {
    console.log("new password", event);
    this.setState({ password: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("sign up form submitted");
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    fetch(path + "signup", {
      method: "POST",
      body: data,
      credentials: "include"
    }) // THIS MIGHT CHANGE BASED ON WHAT MONGO WILL SEND
      .then(x => {
        console.log("text", x);
        return x.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);
        console.log("parsed body", body);
        if (!body.success) {
          swal({
            title: "Oops!",
            text: "That username is taken already",
            icon: "error",
            button: "Choose another name",
            confirmButtonColor: "#999933"
          });
          return;
        }
        this.props.dispatch({ type: "Login" });
      });
  };

  render = () => {
    return (
      <div className="login-signup-form">
        <form className="login-inputs-container" onSubmit={this.handleSubmit}>
          <input
            className="login-inputs"
            type="text"
            placeholder="new username"
            onChange={this.handleUsername}
            value={this.state.username}
          />
          <input
            className="login-inputs"
            type="password"
            placeholder="new password"
            onChange={this.handlePassword}
            value={this.state.password}
          />
          <input className="login-button" type="submit" value="Sign Up" />
        </form>
        <p className="register">
          Already registered?{" "}
          <Link className="login-link" to="/login">
            Log in here!
          </Link>
        </p>
      </div>
    );
  };
}

let Signup = connect()(UnconnectedSignup);
export default Signup;
