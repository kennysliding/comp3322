import React, { Component } from "react";
import axios from "axios";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
          throw alert(`Please fill in ${k}.`);
        }
      });
      let result = await axios.post("/users/signin", data);
      if (result) {
        alert(result.data.message);
        this.props.history.push("/");
      }
    } catch (error) {
      this.setState({ password: "" });
      if (error) {
        alert(`Failed: ${error.response.data.message}`);
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="card-body">
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
          <div className="d-flex justify-content-between">
            <button className="btn btn-primary m-1" onClick={this.handleSubmit}>
              Submit
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={() => this.props.history.push("/signup")}
            >
              Register
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={() => this.props.history.push("/")}
            >
              Back to home
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
