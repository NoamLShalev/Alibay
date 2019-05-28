import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./css/footer.css";
import Modal from "react-modal";
Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "300px",
    width: "400px",
    backgroundColor: "white"
  }
};

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render = () => {
    return (
      <footer id="footer" className="flex">
        <div className="para">
          <p>
            <a className="link" onClick={this.openModal}>
              Contact
            </a>
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div className="contact">
                <h2>Contact</h2>
                <ul>
                  <li>
                    <strong>Adress</strong>: 1155 Metcalfe St, Montreal, Quebec
                    H3B 2V6
                  </li>
                  <li>
                    <strong>Phone number</strong>: (+1) 538 407 9856
                  </li>
                  <li>
                    <strong>email</strong>: procaffeinating.gmail.com
                  </li>
                </ul>
                <button onClick={this.closeModal}>Close</button>
              </div>
            </Modal>
          </p>
        </div>
        <div className="image">
          <img className="imageOne" src="/logo.png" height="50px" />
        </div>
        <div className="flex">
          <div>
            <a
              href={"http://www.facebook.com/pages/Rishi-Tea/39035256828"}
              target={"_blank"}
            >
              <img className="imageOne" src={"/facebook.png"} height="20px" />
            </a>
          </div>
          <div>
            <a href={"http://twitter.com/RishiTea"} target={"_blank"}>
              <img className="imageOne" src={"/twitter.png"} height="20px" />
            </a>
          </div>
        </div>
      </footer>
    );
  };
}

export default Footer;
