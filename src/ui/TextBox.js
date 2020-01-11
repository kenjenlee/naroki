import React, {Component} from 'react'
import Doc from '../text_editor/Doc';
import {keys} from '../text_editor/Const.js'

export default class TextBox extends Component {
  
  render() {
    return (
      <div contentEditable="true" style={{border: "1px solid #ccc", width: '100%', height: "30vh"}}
        onKeyUp={this.props.handleKeyMouseUp}
        onMouseUp={this.props.handleKeyMouseUp}
        onKeyDown={this.props.handleKeyDown}
      >

      </div>
    );
  }
}