import React, { Component } from "react";
import axios from "axios";
import helper from "./helper.js";
import moment from "moment";

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
      name: helper.getCookie("name"),
      editing: "",
      owner: false,
      event: {},
      joined: false,
    };
    this.convertEvent = this.convertEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
  }

  async componentDidMount() {
    let { eventId } = this.props.match.params;
    let userId = helper.getCookie("userId");
    this.setState({ eventId });
    let response = await axios.get(`/event/${eventId}`);
    if (response.data.event.attenders.includes(userId))
      this.setState({ joined: true });
    let event = this.convertEvent(response.data.event);
    this.setState({ event });
    if (event.creator.value === this.state.name) this.setState({ owner: true });
  }

  convertEvent(event) {
    return {
      title: {
        title: "Title",
        value: event.title || "",
      },
      type: {
        title: "Type",
        value: event.type || "",
      },
      startTime: {
        title: "Start Time",
        value: moment(event.startTime) || moment(),
      },
      endTime: {
        title: "End Time",
        value: moment(event.endTime) || moment(),
      },
      location: {
        title: "Location",
        value: event.location || "",
      },
      description: {
        title: "Description",
        value: event.description || "",
      },
      creator: {
        title: "Creator",
        value: event.creator,
      },
    };
  }

  handleInputChange(event) {
    let { target } = event;
    let newEvent = this.state.event;
    newEvent[target.id].value = target.value;
    this.setState({ event: newEvent });
  }

  async updateEvent() {
    try {
      let newEvent = this.state.event;
      Object.entries(newEvent).forEach(([k, v]) => {
        if (v === "") {
          throw alert(`Please fill in ${k}.`);
        }
      });
      if (moment(newEvent.startTime) >= moment(newEvent.endTime)) {
        throw alert("Start time is later than end time");
      }
      newEvent = {
        type: newEvent.type.value,
        title: newEvent.title.value,
        startTime: moment(newEvent.startTime.value),
        endTime: moment(newEvent.endTime.value),
        location: newEvent.location.value,
        description: newEvent.description.value,
      };
      let update = await axios.put(`/events/${this.state.eventId}`, newEvent);
      if (update) {
        let event = this.convertEvent(update.data.event);
        this.setState({ event, editing: "" });
        alert(update.data.message);
        this.props.history.push("/");
      }
    } catch (error) {
      if (error) {
        alert("Failed");
      }
    }
  }

  async deleteEvent() {
    try {
      let update = await axios.delete(`/events/${this.state.eventId}`);
      if (update) {
        alert(update.data.message);
        return this.props.history.push("/");
      }
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  }

  async joinEvent() {
    try {
      let eventId = this.state.eventId;
      let userId = helper.getCookie("userId");
      let update = await axios.put(`/events/${eventId}/register`);
      if (update) {
        this.setState({ joined: update.data.event.attenders.includes(userId) });
        alert(update.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  }

  render() {
    return (
      <React.Fragment>
        {document.cookie ? (
          <div className="d-flex justify-content-between">
            <p>Hi {this.state.name}</p>
            {this.state.event.type &&
              this.state.event.type.value === "public" &&
              !this.state.owner &&
              this.state.name && (
                <button
                  className="btn btn-sm btn-primary m-2"
                  onClick={this.joinEvent}
                >
                  {this.state.joined ? "Leave" : "Join"}
                </button>
              )}
            <button
              className="btn btn-sm btn-primary m-2"
              onClick={() => {
                this.props.history.push("/logout");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <React.Fragment>
            <button
              className="btn btn-sm btn-primary m-2"
              onClick={() => {
                this.props.history.push("/login");
              }}
            >
              Login
            </button>
            <button
              className="btn btn-sm btn-primary m-2"
              onClick={() => {
                this.props.history.push("/signup");
              }}
            >
              Register
            </button>
          </React.Fragment>
        )}
        <table class="table table-borderless">
          <tbody>
            {Object.entries(this.state.event).map(([key, field]) => {
              return (
                <React.Fragment>
                  <tr>
                    <td>{field.title}</td>
                    {this.state.editing !== key ? (
                      <td>
                        {key === "startTime" || key === "endTime"
                          ? moment(field.value).format("YYYY-MM-DD HH:mm")
                          : field.value}
                      </td>
                    ) : (
                      <td>
                        <div className="form-group">
                          {key === "description" ? (
                            <textarea
                              className="form-control"
                              id={key}
                              maxlength={200}
                              onChange={(event) =>
                                this.handleInputChange(event)
                              }
                              value={field.value}
                            />
                          ) : (
                            <input
                              type={
                                key === "startTime" || key === "endTime"
                                  ? "datetime-local"
                                  : "text"
                              }
                              className="form-control"
                              value={
                                key === "startTime" || key === "endTime"
                                  ? moment(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : field.value
                              }
                              id={key}
                              onChange={(event) =>
                                this.handleInputChange(event)
                              }
                            />
                          )}
                        </div>
                      </td>
                    )}
                    {this.state.owner && key !== "creator" && (
                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() =>
                            this.setState({
                              editing: this.state.editing !== key ? key : "",
                            })
                          }
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        <div className="d-flex justify-content-around">
          {this.state.owner && (
            <React.Fragment>
              <button
                className="btn btn-sm btn-primary m-1"
                onClick={this.updateEvent}
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-danger m-1"
                onClick={this.deleteEvent}
              >
                Delete
              </button>
            </React.Fragment>
          )}
          <button
            className="btn btn-sm btn-info m-1"
            onClick={() => this.props.history.push("/")}
          >
            Go back
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Event;
