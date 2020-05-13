import React, { Component } from "react";
import axios from "axios";
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      alias: "",
      email: "",
      password: "",
      confirmation: "",
      error: "",
    };
  }

  componentDidMount = () => {
    let credential = document.cookie;
    if (credential) {
      this.props.history.push("/");
    }
  };

  handleInputChange = (event) => {
    let { id, value } = event.target;
    this.setState({ [id]: value });
  };

  handleSubmit = async () => {
    try {
      let data = this.state;
      delete data.error;
      Object.entries(data).forEach(([k, v]) => {
        if (v === "") {
          throw alert(`${k} is not yet filled.`);
        }
      });
      if (data.password !== data.confirmation)
        throw alert("Password does not match confirmation");
      delete data.confirmation;
      let result = await axios.post("/users/register", data);
      alert("Success");
    } catch (error) {
      if (error) {
        alert("Failed");
      }
    }
  };

  render() {
    return (
      <div className="container">
        <div className="card p-3">
          <div className="card-title text-center">
            3322 Event Management System
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="What is your full name?"
                id="name"
                onChange={(event) => this.handleInputChange(event)}
              />
            </div>
            <div className="form-group">
              <label>Alias</label>
              <input
                type="text"
                className="form-control"
                placeholder="How do we call you?"
                id="alias"
                onChange={(event) => this.handleInputChange(event)}
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Which email do we reach you?"
                id="email"
                onChange={(event) => this.handleInputChange(event)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Your password"
                id="password"
                onChange={(event) => this.handleInputChange(event)}
              />
            </div>
            <div className="form-group">
              <label>Password confirmation</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm your password!"
                id="confirmation"
                onChange={(event) => this.handleInputChange(event)}
              />
            </div>
            <button className="btn btn-primary" onClick={this.handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
