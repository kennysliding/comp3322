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
      allEvents: [],
    };
    this.showPastEvents = this.showPastEvents.bind(this);
    this.showCurrentEvents = this.showCurrentEvents.bind(this);
  }

  async componentDidMount() {
    let response = await axios.get("/events");
    let events = response.data.events;
    events = events.sort((a, b) => moment(a.startTime) - moment(b.startTime));
    this.setState({ allEvents: events });
    events = events.filter((event) => moment(event.endTime) > moment());
    this.setState({ events });
  }

  showPastEvents() {
    let events = this.state.allEvents;
    events = events.filter(
      (event) => moment(event.endTime) > moment().subtract("14", "d")
    );
    this.setState({ events });
  }

  showCurrentEvents() {
    let events = this.state.allEvents;
    events = events.filter((event) => moment(event.endTime) > moment());
    this.setState({ events });
  }

  render() {
    return (
      <React.Fragment>
        {document.cookie ? (
          <React.Fragment>
            <div className="d-flex justify-content-between">
              <p>Hi {this.state.name}</p>
              <button
                className="btn btn-primary m-2"
                onClick={() => {
                  this.props.history.push("/addevent");
                }}
              >
                Add Event
              </button>
              <button
                className="btn btn-primary m-2"
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
        <div class="btn-group" role="group">
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
        <table className="table table-hover table-responsive">
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
                <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default Home;
