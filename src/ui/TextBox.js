import React, {Component} from 'react'
import Doc from '../text_editor/Doc';
import {keys} from '../text_editor/Const.js'

export default class TextBox extends Component {
  componentDidUpdate() {
    if(this.props.forceText) {
      document.getElementById("textBox").innerText = this.props.forceText;
      console.log("HAHAHAHA");
    }
  }

  render() {
    return (
      <div id="textBox" contentEditable="true" style={{border: "1px solid #ccc", width: '100%', height: "30vh"}}
        onKeyUp={this.props.handleKeyMouseUp}
        onMouseUp={this.props.handleKeyMouseUp}
        onKeyDown={this.props.handleKeyDown}
      >

      </div>
    );
  }
}