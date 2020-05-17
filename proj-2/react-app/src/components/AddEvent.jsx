import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "",
      startTime: moment().format("YYYY-MM-DDTHH:mm"),
      endTime: moment().format("YYYY-MM-DDTHH:mm"),
      location: "",
      description: "",
    };
  }

  componentDidMount() {
    if (!document.cookie) {
      this.props.history.push("/");
    }
  }

  handleInputChange = (event) => {
    let { id, value } = event.target;
    console.log(id, value);
    this.setState({ [id]: value });
  };

  handleSubmit = async () => {
    try {
      let data = this.state;
      Object.entries(data).forEach(([k, v]) => {
        if (v === "") {
          throw alert(`Please fill in ${k}.`);
        }
      });
      if (moment(data.startTime) >= moment(data.endTime)) {
        throw alert("Start time is later than/equal to end time");
      }
      let result = await axios.post("/events", data);
      if (result) {
        alert(result.data.message);
        this.props.history.push("/");
      }
    } catch (error) {
      if (error) {
        alert(`Failed: ${error.response.data.message}`);
      }
    }
  };

  render() {
    return (
      <div className="card-body">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name of the event"
            id="title"
            onChange={(event) => this.handleInputChange(event)}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="type"
              id="type"
              value="public"
              checked={this.state.type === "public"}
              onChange={(event) => this.handleInputChange(event)}
            />
            <label class="form-check-label">Public</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="type"
              id="type"
              value="private"
              checked={this.state.type === "private"}
              onChange={(event) => this.handleInputChange(event)}
            />
            <label class="form-check-label">Private</label>
          </div>
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            value={this.state.startTime}
            onChange={(event) => this.handleInputChange(event)}
          />
        </div>
        <div className="form-group">
          <label>End Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="endTime"
            value={this.state.endTime}
            onChange={(event) => this.handleInputChange(event)}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="Where is the event?"
            id="location"
            onChange={(event) => this.handleInputChange(event)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            placeholder="Describe your event!"
            id="description"
            maxlength={200}
            onChange={(event) => this.handleInputChange(event)}
          />
        </div>
        <button className="btn btn-primary m-1" onClick={this.handleSubmit}>
          Submit
        </button>
        <button
          className="btn btn-danger m-1"
          onClick={() => {
            this.props.history.push("/");
          }}
        >
          Cancel
        </button>
      </div>
    );
  }
}

export default SignUp;
