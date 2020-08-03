import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Calculator from "./containers/Calculator.jsx";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Calculator />
      </header>
    </div>
  );
}

export default App;
