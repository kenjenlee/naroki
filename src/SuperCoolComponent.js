import React, {Component} from 'react';

// Import Materialize
import M from "materialize-css";


class SuperCoolComponent extends Component {

    componentDidMount() {
        // Auto initialize all the things!
        M.AutoInit();
    }
    
    render() {
        return(
        <div>
          <div className="input-field col s12 m12 l12">
            <select>
              <option value="" disabled selected>Choose your option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
            <label>Materialize Select</label>
          </div>
        </div>
        )
    }
}

export default SuperCoolComponent;
