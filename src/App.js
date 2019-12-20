import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import { Link } from 'react-router-dom';
import Menu from "./ui/Menu.js";

// Import Materialize
import M from "materialize-css";
import axios from 'axios';

export default class App extends Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
    let dropdowns = document.querySelectorAll('.dropdown-trigger');
    let options = {
      constrainWidth: false,
      coverTrigger: false
    };
    M.Dropdown.init(dropdowns, options);

    // fetch('http://localhost:5000/random_response')
    // .then(results => {
    //   console.log(results);
    // })
    axios.get('http://localhost:5000/random_response')
    .then(response => {
      console.log(response.data);
    }, error => {
      console.log(error);
    });
    axios.post('http://localhost:5000/register', {
      name: 'haha'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
    // const response = await axios.post(
    //   'http://localhost:5000/register',
    //   { name: 'data' },
    //   { headers: { 'Content-Type': 'application/json' } }
    // )
    // console.log(response.data)
    // fetch('http://localhost:5000/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name: 'data' }),
    // }).then(results => {
    //   console.log(results);
    // });
    
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
