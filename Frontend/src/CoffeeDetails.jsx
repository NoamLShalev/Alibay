import React, { Component } from "react";
import { Link } from "react-router-dom";
import Review from "./Review.jsx";
import "./css/main.css";
import swal from "sweetalert";
let path = "http://159.89.112.34:4000/";

class CoffeeDetails extends Component {
  addToCart = () => {
    console.log(this.props.item, "what is item?");
    let itemId = this.props.item._id;
    let data = new FormData();
    data.append("itemId", itemId);
    console.log("ID=>", itemId);
    fetch(path + "add-to-cart-coffee", {
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
            text: "Your coffee was added to your cart!",
            icon: "success",
            button: "Keep Shopping"
          }).then(function() {
            window.location = "/coffee";
          });
        }
      })
      .catch(err => console.log(err));
  };

  render = () => {
    console.log("PROPS=>", this.props);
    return (
      <div>
        <div className="item-card">
          <img className="itemPhoto" src={this.props.item.image} />
          <h3>{this.props.item.name}</h3>
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

export default CoffeeDetails;
