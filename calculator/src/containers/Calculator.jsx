import React from "react";
import NumButton from "../components/NumButton.jsx";
import ActButton from "../components/ActButton.jsx";
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      numberPressed: null,
      actionPressed: null,
    };
    this.onNumberPressed = this.onNumberPressed.bind(this);
    this.onActionPressed = this.onActionPressed.bind(this);
  }

  componentDidMount() {}

  onNumberPressed = (number) => {
    // initial press, if there is no previous result
    if (this.state.result === null) {
      this.setState({ result: number });
    }
    this.setState({ numberPressed: number });
  };

  onActionPressed = (action) => {
    if (this.state.result === null) {
      return;
    }
    if (["+", "-", "x", "/"].includes(action)) {
      return this.setState({ actionPressed: action });
    }
    if (action === "=") {
      let newResult = this.state.result;
      switch (this.state.actionPressed) {
        case "+":
          newResult = newResult + this.state.numberPressed;
        case "-":
          newResult = newResult - this.state.numberPressed;
        case "x":
          newResult = newResult * this.state.numberPressed;
        case "/":
          newResult = newResult / this.state.numberPressed;
      }
      return this.setState({
        result: newResult,
        actionPressed: null,
        numberPressed: null,
      });
    }
  };

  render() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const actions = ["+", "-", "x", "/", "="];
    return (
      <React.Fragment>
        <h3>Calculator</h3>
        <label>Result: {this.state.result}</label>
        <label>Current number pressed: {this.state.numberPressed}</label>
        <label>Current action pressed: {this.state.actionPressed}</label>
        {numbers.map((number) => {
          return (
            <NumButton
              buttonValue={number}
              onNumberPressed={this.onNumberPressed}
            />
          );
        })}
        {actions.map((action) => {
          return (
            <ActButton
              buttonAct={action}
              onActionPressed={this.onActionPressed}
            />
          );
        })}
      </React.Fragment>
    );
  }
}

export default Calculator;
