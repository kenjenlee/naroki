import React, {Component} from 'react';

// Import Materialize
import M from "materialize-css";


export default class TabBar extends Component {

    componentDidMount() {
        // Auto initialize all the things!
        M.AutoInit();
    }
    
    render() {
        return(
        <div>
            {/* <!-- Dropdown Trigger --> */}
            <a class='dropdown-trigger btn' href='#' data-target='dropdown1'>&#43;</a>

            {/* <!-- Dropdown Structure --> */}
            <ul id='dropdown1' class='dropdown-content'>
              <li><a href="#!">Happiness</a></li>
              <li><a href="#!">Sadness</a></li>
              <li><a href="#!">Fear</a></li>
              <li><a href="#!">Disgust</a></li>
              <li><a href="#!">Anger</a></li>
              <li><a href="#!">Surprise</a></li>
            </ul>
        </div>
        )
    }
}
