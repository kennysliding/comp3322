import React, { Component } from "react";
const helper = require("./helper.js");
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: helper.getCookie("name"),
    };
  }

  render() {
    return (
      <div className="container p-1">
        <div className="card p-3">
          <div className="card-title text-center">
            3322 Event Management System
          </div>
          {document.cookie ? (
            <React.Fragment>
              <p>Hi {this.state.name}</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button
                className="btn btn-primary m-2"
                onClick={() => {
                  this.props.history.push("/login");
                }}
              >
                Login
              </button>
              <button
                className="btn btn-primary m-2"
                onClick={() => {
                  this.props.history.push("/signup");
                }}
              >
                Register
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
