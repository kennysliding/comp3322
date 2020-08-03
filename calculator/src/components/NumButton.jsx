import React from "react";

class NumButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <button
          onClick={() => this.props.onNumberPressed(this.props.buttonValue)}
        >
          {this.props.buttonValue}
        </button>
      </React.Fragment>
    );
  }
}

export default NumButton;
