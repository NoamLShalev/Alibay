import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import swal from "sweetalert";
let path = "http://159.89.112.34:4000/";

class UnconnectedAddReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      desc: "",
      ratingInput: "5"
    };
  }

  handleChangeDesc = event => {
    console.log("Desc", event.target.value);
    this.setState({ desc: event.target.value });
  };

  handleRadioChange = e => {
    let ratingInput = e.target.value;
    this.setState({ ratingInput });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("Add a revew to an item form submitted");
    let data = new FormData();
    data.append("review", this.state.desc);
    data.append("itemId", this.props.itemId);
    data.append("rating", this.state.ratingInput);
    fetch(path + "add-review-item", {
      method: "POST",
      body: data,
      credentials: "include"
    })
      .then(x => {
        console.log("text", x);
        return x.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);
        console.log("parsed body", body);
        if (body.success) {
          swal({
            title: "Thank you!",
            text: "Our sellers appreciate your thoughts on their items!",
            icon: "success",
            button: "Keep Shopping"
          }).then(function() {
            window.location = "/";
          });
          this.setState({ desc: "" });
          return;
        }
        swal({
          title: "Oops!",
          text: "Please make sure you fill out all forms",
          icon: "error",
          button: "Return"
        });
        return;
      });
  };

  render = () => {
    console.log("Props =>", this.props);
    return (
      <div>
        <div className="add-item-card">
          <h2>Add a review</h2>
          <div className="add-body">
            <h3>{this.props.name}</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="desc-add">
                <p>Comment: </p>
                <textarea
                  className="text-add"
                  rows="4"
                  cols="50"
                  name="textarea"
                  value={this.state.desc}
                  onChange={this.handleChangeDesc}
                  required
                />
              </div>
              Rating:
              <section className="radioRow">
                <label>
                  <input
                    type="radio"
                    name="review"
                    value="1"
                    checked={this.state.ratingInput === "1"}
                    onChange={this.handleRadioChange}
                  />
                  1
                </label>
                <label>
                  <input
                    type="radio"
                    name="review"
                    value="2"
                    checked={this.state.ratingInput === "2"}
                    onChange={this.handleRadioChange}
                  />
                  2
                </label>
                <label>
                  <input
                    type="radio"
                    name="review"
                    value="3"
                    checked={this.state.ratingInput === "3"}
                    onChange={this.handleRadioChange}
                  />
                  3
                </label>
                <label>
                  <input
                    type="radio"
                    name="review"
                    value="4"
                    checked={this.state.ratingInput === "4"}
                    onChange={this.handleRadioChange}
                  />
                  4
                </label>
                <label>
                  <input
                    type="radio"
                    name="review"
                    value="5"
                    checked={this.state.ratingInput === "5"}
                    onChange={this.handleRadioChange}
                  />
                  5
                </label>
              </section>
              <div className="add-button-container">
                <input className="add-item-button" type="submit" value="Add" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
}

let AddReview = connect()(UnconnectedAddReview);
export default AddReview;
