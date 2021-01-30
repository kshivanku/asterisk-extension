import logo from "./logo.svg";
import React from "react";
import "./App.css";
import { useEffect } from "react";

const App = ({ data }) => {
  useEffect(() => {
    console.log(data);
  });
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      <h1>Remind yourself why you followed someone on Twitter</h1>
      <p>
        Logged in as <span>{data.current_huh_user}</span>
      </p>
    </div>
  );
};

export default App;
