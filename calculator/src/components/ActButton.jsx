import React from "react";
class ActButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <button
          onClick={() => this.props.onActionPressed(this.props.buttonAct)}
        >
          {this.props.buttonAct}
        </button>
      </React.Fragment>
    );
  }
}
export default ActButton;
