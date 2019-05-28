import React, { Component } from "react";
import "./css/main.css";
import moment from "moment";

class Review extends Component {
  renderRating = props => {
    let stars = [];
    for (let i = 0; i < props.rating; i++) {
      stars = stars.concat(<img src="/leaf.png" />);
    }
    for (let j = 0; j < 5 - props.rating; j++) {
      stars = stars.concat(<img src="/leaf black.png" />);
    }
    return stars;
  };

  render() {
    return (
      <li className="review">
        <h4>{this.props.reviewer + ": "}</h4>
        <p>
          <span>{this.renderRating(this.props)}</span>
        </p>
        {moment().format("MMMM Do YYYY")}
        <p>{this.props.description}</p>
      </li>
    );
  }
}

export default Review;
