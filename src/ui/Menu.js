import React, { Component } from "react";
import "materialize-css/dist/css/materialize.min.css";
import { Link } from "react-router-dom";

// Import Materialize
import M from "materialize-css";

export default class Menu extends Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
    let dropdowns = document.querySelectorAll(".dropdown-trigger");
    let options = {
      constrainWidth: false,
      coverTrigger: false
    };
    M.Dropdown.init(dropdowns, options);
  }
  render() {
    return (
      <div className="App">
        <div class="row">
          <div class="col s1">
            <a
              class="dropdown-trigger btn no-autoinit"
              href="#"
              data-target="dropdown1"
            >
              &#9776;
            </a>
            <ul id="dropdown1" class="dropdown-content">
              <li>
                <Link to="/happiness">Happiness</Link>
              </li>
              <li>
                <a href="#!">Sadness</a>
              </li>
              <li>
                <a href="#!">Fear</a>
              </li>
              <li>
                <a href="#!">Disgust</a>
              </li>
              <li>
                <a href="#!">Anger</a>
              </li>
              <li>
                <a href="#!">Surprise</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
