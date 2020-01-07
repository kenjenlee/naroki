import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from "react-router-dom";
import Menu from "./ui/Menu.js";

// Import Materialize
import M from "materialize-css";
import axios from "axios";

export default class App extends Component {
  componentDidMount() {
    // Auto initialize all the things!
    // M.AutoInit();
    let dropdowns = document.querySelectorAll(".dropdown-trigger");
    let options = {
      constrainWidth: false,
      coverTrigger: false
    };
    M.Dropdown.init(dropdowns, options);
  }

  render() {
    return (
      <div>
        <Menu />
        <div class="row center-align">
          <h1>LolFig v0</h1>
        </div>
      </div>
    );
  }
}
