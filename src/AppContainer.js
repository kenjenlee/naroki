import React, { Component } from "react";
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';

import App from "./App.js";
import Happiness from './ui/Happiness.js';
import Test from './ui/Test.js';

const browserHistory = createBrowserHistory();

export default class AppContainer extends Component {
  /**
   * Container class for App class for routing
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route exact path="/happiness" component={Happiness}/>
          <Route exact path="/test" component={Test}/>
          {/* <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/admin" component={Admin}/>
          <Route component={NotFound}/> */}
        </Switch>
      </Router>
    )
  }
}