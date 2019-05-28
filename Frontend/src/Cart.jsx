import React, { Component } from "react";
import "./css/cart.css";
let path = "http://159.89.112.34:4000/";
let stripe = Stripe("pk_test_o0jp2CyctV96lKqFAIdFE4i0008Y2G9odT");

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      fixit: false
    };
  }
  componentDidMount = () => {
    fetch(path + "cart", {
      method: "GET",
      credentials: "include"
    })
      .then(x => {
        return x.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);
        if (body.success) {
          this.setState({ items: body.items });
        }
      });

    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  };

  handleScroll = () => {
    if (window.scrollY > 200) {
      this.setState({ fixit: true });
    }
    if (window.scrollY < 200) {
      this.setState({ fixit: false });
    }
  };

  checkoutHandler = () => {
    fetch(path + "purchase", {
      credentials: "include"
    })
      .then(responseHeader => {
        return responseHeader.text();
      })
      .then(responseBody => {
        let parsed = JSON.parse(responseBody);
        if (parsed.success) {
          stripe
            .redirectToCheckout({
              sessionId: parsed.sessionId
            })
            .then(result => {
              fetch(path + "clear-cart", {
                credentials: "include"
              });
            });
        }
      });
  };

  removeItem = id => {
    let data = new FormData();
    data.append("itemId", id);
    fetch(path + "remove-item", {
      method: "POST",
      credentials: "include",
      body: data
    })
      .then(header => {
        return header.text();
      })
      .then(body => {
        let parsed = JSON.parse(body);
        if (parsed.success) {
          fetch(path + "cart", {
            method: "GET",
            credentials: "include"
          })
            .then(x => {
              return x.text();
            })
            .then(responseBody => {
              let body = JSON.parse(responseBody);
              if (body.success) {
                this.setState({ items: body.items });
              }
            });
        }
      });
  };

  render = () => {
    let optionalEmpty = "";
    if (this.state.items.length === 0) {
      optionalEmpty = (
        <div className="cart">You have no items in your shopping cart</div>
      );
    }
    let total = 0;
    this.state.items.map(item => {
      total = total + parseInt(item.price);
    });
    if (total !== 0) {
      optionalEmpty = (
        <div className="cart">
          <div className="cart-items">
            <ul>
              {this.state.items.map(item => {
                return (
                  <li>
                    <div className="item-cart">
                      <img
                        className="image-cart"
                        src={item.image}
                        height="100px"
                      />
                      <div className="cart-text">
                        <h3 className="name">{item.name}</h3>
                        <p>{"$" + item.price + ".00"}</p>
                        <button
                          className="button"
                          onClick={() => {
                            this.removeItem(item._id);
                          }}
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="checkout">
            <div
              className={`checkout-container${
                this.state.fixit ? " fixed" : ""
              }`}
            >
              <div className="total">Total: {"$" + total + ".00"}</div>
              <button className="button" onClick={this.checkoutHandler}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      );
    }
    return <div>{optionalEmpty}</div>;
  };
}

export default Cart;
