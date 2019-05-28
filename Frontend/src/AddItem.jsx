import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import swal from "sweetalert";
import "./css/additem.css";
let path = "http://159.89.112.34:4000/";

class UnconnectedAddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "tea",
      desc: "",
      name: "",
      price: "",
      quantity: "",
      file: undefined
    };
  }

  handleFile = event => {
    console.log("User put an image", event.target.files);
    this.setState({ file: event.target.files[0] });
  };

  handleChangeName = event => {
    console.log("Name", event.target.value);
    this.setState({ name: event.target.value });
  };

  handleChangeDesc = event => {
    console.log("Desc", event.target.value);
    this.setState({ desc: event.target.value });
  };

  handleChangeQuantity = event => {
    console.log("Quantity", event.target.value);
    this.setState({ quantity: event.target.value });
  };

  handleChangePrice = event => {
    console.log("Price", event.target.value);
    this.setState({ price: event.target.value });
  };

  handleChange = event => {
    console.log("Type", event.target.value);
    this.setState({ type: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("Add an item form submitted");
    let data = new FormData();
    let type = "add-item-tea";
    if (this.state.type === "coffee") {
      type = "add-item-coffee";
    }
    data.append("name", this.state.name);
    data.append("price", this.state.price);
    data.append("quantity", this.state.quantity);
    data.append("desc", this.state.desc);
    data.append("file", this.state.file);
    fetch(path + type, {
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
            title: "Success!",
            text: "You've added an item to our marketplace!",
            icon: "success",
            button: "Return"
          }).then(function() {
            window.location = "/";
          });
          return;
        }
        swal({
          title: "Oops!",
          text: "You forgot to fill out a form field!",
          icon: "error",
          button: "Fix It"
        });
        return;
      });
  };

  render = () => {
    return (
      <div className="add-item-card">
        <h2>Add New Item</h2>
        <div className="add-body">
          <form onSubmit={this.handleSubmit}>
            Tea or Coffee?
            <br />
            <select
              className="selector"
              name="Choice"
              onChange={this.handleChange}
            >
              <option value="tea">Tea</option>
              <option value="coffee">Coffee</option>
            </select>
            <div className="flex-add">
              <p>Name of the Item: </p>
              <input
                className="input-add"
                type="text"
                value={this.state.name}
                onChange={this.handleChangeName}
                required
              />
            </div>
            <div className="flex-add">
              <p>Price: </p>
              <input
                className="input-add"
                type="number"
                min="0"
                max="100000000"
                name="price"
                onChange={this.handleChangePrice}
                required
              />
            </div>
            <div className="desc-add">
              <p>Description: </p>
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
            <div className="flex-add">
              <p className="image-p">Image:</p>
              <input
                className="add-image"
                type="file"
                onChange={this.handleFile}
                required
              />
            </div>
            <div className="flex-add">
              <p>Quantity:</p>
              <input
                className="input-add"
                type="number"
                min="0"
                max="100000000"
                name="quantity"
                onChange={this.handleChangeQuantity}
                required
              />
            </div>
            <div className="add-button-container">
              <input
                className="add-item-button"
                type="submit"
                value="Add Item"
              />
            </div>
          </form>
        </div>
      </div>
    );
  };
}

let mapStateToProps = st => {
  console.log("State=>", st);
  return { type: st.category };
};

let AddItem = connect(mapStateToProps)(UnconnectedAddItem);
export default AddItem;
