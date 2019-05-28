import React, { Component } from "react";
import { Link } from "react-router-dom";
import Review from "./Review.jsx";
import "./css/main.css";
import swal from "sweetalert";
let path = "http://159.89.112.34:4000/";

class TeaDetails extends Component {
  addToCart = () => {
    console.log(this.props.item, "what is item?");
    let itemId = this.props.item._id;
    let data = new FormData();
    data.append("itemId", itemId);
    console.log("ID=>", itemId);
    fetch(path + "add-to-cart-tea", {
      method: "POST",
      body: data,
      credentials: "include"
    })
      .then(x => {
        return x.text();
      })
      .then(responseBody => {
        console.log(responseBody, "RESPONSE BODY");
        let body = JSON.parse(responseBody);
        if (body.success) {
          swal({
            title: "Success!",
            text: "Your tea was added to your cart!",
            icon: "success",
            button: "Keep Shopping"
          }).then(function() {
            window.location = "/tea";
          });
        }
      })
      .catch(err => console.log(err));
  };

  renderRatingTwo = x => {
    let stars = [];
    for (let i = 0; i < x; i++) {
      stars = stars.concat(<img src="/leaf.png" />);
    }
    for (let j = 0; j < 5 - x; j++) {
      stars = stars.concat(<img src="/leaf black.png" />);
    }
    return stars;
  };

  renderAverage = () => {
    let reviews = this.props.reviews;
    let total = 0;
    let div = reviews.length;
    let average = 0;
    reviews.map(elem => {
      let number = Number(elem.rating);
      total += number;
    });
    average = Math.round(total / div);
    console.log("average=>", average);
    return average;
  };

  render = () => {
    console.log("PROPS=>", this.props);
    return (
      <div>
        <div className="item-card">
          <img className="itemPhoto" src={this.props.item.image} />
          <h3>{this.props.item.name}</h3>
          <p>
            <span>{this.renderRatingTwo(this.renderAverage())}</span>
          </p>
          <p>{"Quantity: " + this.props.item.quantity}</p>
          <div>
            <br />
            <p>
              <em>{this.props.item.description}</em>
            </p>
          </div>
          <br />
          <div>{"Price: $" + this.props.item.price + ".00"}</div>
          <br />
          <div className="item-buttons">
            <Link className="button" to={"/seller/" + this.props.item.sellerId}>
              Seller
            </Link>
            <br />
            <button className="button" onClick={this.addToCart}>
              Add To Cart
            </button>
          </div>
        </div>
        <div className="reviews">
          <h3>Reviews</h3>
          {this.props.reviews.length === 0 ? (
            <h4 style={{ padding: "20px" }}>There are no reviews yet!</h4>
          ) : (
            <ul>
              {this.props.reviews.map(rev => (
                <Review
                  description={rev.review}
                  reviewer={rev.reviewer.name}
                  reviewerId={rev.reviewer.id}
                  itemId={rev.itemId}
                  rating={rev.rating}
                />
              ))}
            </ul>
          )}
          <div>
            <Link
              to={{
                pathname: "/add-review-item",
                state: {
                  itemId: this.props.item._id,
                  name: this.props.item.name
                }
              }}
              className="button"
            >
              Add a review
            </Link>
          </div>
        </div>
      </div>
    );
  };
}

export default TeaDetails;
