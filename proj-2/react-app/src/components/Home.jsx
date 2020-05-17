import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import helper from "./helper.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: helper.getCookie("name"),
      events: [],
    };
    this.showPastEvents = this.showPastEvents.bind(this);
    this.showCurrentEvents = this.showCurrentEvents.bind(this);
  }

  async componentDidMount() {
    let response = await axios.get("/events");
    let events = response.data.events;
    events = events.filter((event) => moment(event.endTime) > moment());
    events = events.sort((a, b) => moment(a.startTime) - moment(b.startTime));
    this.setState({ events });
  }

  async showPastEvents() {
    let response = await axios.get("/events");
    let events = response.data.events;
    events = events.filter(
      (event) =>
        moment(event.endTime) >= moment().subtract("14", "d") &&
        moment(event.endTime) < moment()
    );
    events = events.sort((a, b) => moment(a.startTime) - moment(b.startTime));
    this.setState({ events });
  }

  async showCurrentEvents() {
    let response = await axios.get("/events");
    let events = response.data.events;
    events = events.filter((event) => moment(event.endTime) >= moment());
    events = events.sort((a, b) => moment(a.startTime) - moment(b.startTime));
    this.setState({ events });
  }

  render() {
    return (
      <React.Fragment>
        {document.cookie ? (
          <React.Fragment>
            <div className="d-flex justify-content-between">
              <p className="my-auto">Hi {this.state.name}</p>
              <button
                className="btn btn-sm btn-info m-2"
                onClick={() => {
                  this.props.history.push("/addevent");
                }}
              >
                Add Event
              </button>
              <button
                className="btn btn-sm btn-danger m-2"
                onClick={() => {
                  this.props.history.push("/logout");
                }}
              >
                Logout
              </button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <button
              className="btn btn-sm btn-info m-2"
              onClick={() => {
                this.props.history.push("/login");
              }}
            >
              Login
            </button>
            <button
              className="btn btn-sm btn-info m-2"
              onClick={() => {
                this.props.history.push("/signup");
              }}
            >
              Register
            </button>
          </React.Fragment>
        )}
        <div className="btn-group" role="group">
          <button
            className="btn btn-primary m-1"
            onClick={this.showCurrentEvents}
          >
            Current Event
          </button>
          <button
            className="btn btn-secondary m-1"
            onClick={this.showPastEvents}
          >
            Past Event
          </button>
        </div>
        <div class="row justify-content-center">
          <div class="col-auto table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Time</th>
                  <th scope="col">Venue</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Attenders</th>
                </tr>
              </thead>
              <tbody>
                {this.state.events.map((event, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr
                        onClick={() =>
                          this.props.history.push(`/events/${event.eventId}`)
                        }
                      >
                        <td>{event.title}</td>
                        <td>
                          {moment(event.startTime).format("YYYY-MM-DD HH:mm")}
                        </td>
                        <td>{event.location}</td>
                        <td>{event.creator}</td>
                        <td>{event.attenders.length}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
