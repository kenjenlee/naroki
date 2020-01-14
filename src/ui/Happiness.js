import React, { Component, useRef } from "react";
import axios from "axios";
import { Resizable, ResizableBox } from "react-resizable";
// Import Materialize
import M from "materialize-css";
import Menu from "./Menu.js";
import "materialize-css/dist/css/materialize.min.css";
import "./Happiness.css";
import BoundedDraggable from "./BoundedDraggable.js";
import * as NaoConsts from "../NaoConst.js";
import TextBox from './TextBox.js';
import Doc from '../text_editor/Doc.js';
import {keys} from '../text_editor/Const.js';
import VerticalRangeSlider from './reusable/VerticalRangeSlider.js'
import {pitch, pause, volume, speed, 
  pitchInitial, pauseInitial, volumeInitial, speedInitial, 
  pitchMin, pauseMin, volumeMin, speedMin, 
  pitchMax, pauseMax, volumeMax, speedMax} from '../text_editor/Const.js'


export default class Happiness extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: new Doc(),
      highlightedRegion: {anchorOffset: 0, focusOffset: 0},
      isHighlighted: false,
      prevCursorOffset: -1,
      rawInput: "",
      prevKey: '',
      reundo: false,
    };
    

  }

  // TODO Inefficient code here called redundantly by both keyup and mouseup
  checkTextIsHighlighted = () => {
    // console.log(window.getSelection());
    let selection = window.getSelection();
    if(selection.anchorOffset != selection.focusOffset 
      && selection.anchorNode.nodeName == "#text"
      && selection.focusNode.nodeName == "#text") {
        this.setState({
          highlightedRegion: {anchorOffset: selection.anchorOffset, focusOffset: selection.focusOffset},
          isHighlighted: true
        });
        console.log("here");
    } else if(this.state.isHighlighted) {
      this.setState({
        isHighlighted: false
      });
    }
  }

  handleKeyDown = (e) => {
    console.log(window.getSelection());
    if(keys.navigation.includes(e.key)) {
      return; // dealt with in key up event
    }
    let newDoc;
    this.setState({isHighlighted: false});
    // prevent default for undo and redo. Implement own logic.
    if(e.ctrlKey && (e.key == 'z' || e.key == 'y' || e.key == 'Z' || e.key == 'Y')) {
      e.preventDefault();
      this.setState({reundo: true});
      if(e.key == 'z') {
        // trigger custom undo logic
      } else if(e.key == 'y') {
        // triger custom redo logic
      }
      return;
    } else if(!keys.navigation.includes(e.key)) {
      // e.type == keyup and non-navigation, no highlighted region
      this.setState({isHighlighted: false});
      
      if(keys.whitespace.includes(e.key) || (e.key.length == 1 && !e.ctrlKey)) {
        // whitespace character
        newDoc = this.state.doc;
        newDoc.addText(window.getSelection().focusOffset, e.key);
        this.setState({
          doc: newDoc
        });
        console.log(this.state.doc.getString());
      } else if(e.ctrlKey) {
        switch(e.key) {
          case 'x':
          case 'X':
            break;
          case 'v':
          case 'V':
            break;
          default:
            break;
        }
      } else {
        newDoc = this.state.doc;
        let offset = window.getSelection().focusOffset;
        switch(e.key) {
          case 'Backspace':
            
            if(offset > 0) {
              newDoc.deleteChar(offset-1);
            }
            
            break;
          case 'Clear':
            break;
          case 'Cut':
            break;
          case 'Delete':
            if(offset < newDoc.getString().length) {
              newDoc.deleteChar(offset);
            }
            break;
          case 'Paste':
            break;
          default:
            break;
        }
        this.setState({
          doc: newDoc
        });
        
      }
    }
    console.log(this.state.doc.getString());
    // console.log(window.getSelection().nodeName);
    // this.setState({
    //   prevKey: e.key, 
    //   prevCursorOffset: 
    //     window.getSelection().focusOffset
    // });
    this.setState({reundo: false});
  }

  // TODO bug where if you press shift+char quickly the capital letter is printed
  // but the small letter is passed into the event first after the shift key
  handleKeyMouseUp = (e) => {
    // cut paste needs to be here as well????///// TODO


    // if it's whitespace character (tab, space, enter)
    // console.log(e.key);
    // console.log(e.type);
    if(e.type == 'mouseup' || keys.navigation.includes(e.key)) {
      // navigation event, change of cursor position
      this.checkTextIsHighlighted();
    }
    // console.log(window.getSelection().nodeName);
    // this.setState({
    //   prevKey: e.key, 
    //   prevCursorOffset: 
    //     window.getSelection().focusOffset
    // });
    // console.log(e.target.value);
    // if it's backspace/delete
    // below also includes arrow keys
    // if(strlen(String.fromCharCode(e.keyCode))) {
    //   console.log(window.getSelection());
    //   console.log(e.keyCode);
    // }
    
  }

  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
    let dropdowns = document.querySelectorAll(".dropdown-trigger");
    let options = {
      constrainWidth: false,
      coverTrigger: false,
      alignment: "right"
    };
    M.Dropdown.init(dropdowns, options);
  }

  // /**
  //  * @function handleCheckboxChange
  //  * Handles any check/uncheck events in the checkboxes
  //  */
  // handleCheckboxChange = (event) => {
  //   var temp = this.state.paramViewSelected;
  //   temp[event.target.name] = event.target.checked;
  //   this.setState({
  //     paramViewSelected: temp
  //   });
  //   // console.log(this.state.paramViewSelected);
  // }

  /**
   * @function formSpeechString
   * Formats the string to include the pitch settings
   */
  formSpeechString = () => {
    var speech = "";
    for (let i = 0; i < this.state.numWords; i++) {
      speech = speech.concat(
        " \\vct=" + this.state.pitches[i] + "\\" + this.state.words[i]
      );
    }
    return speech;
  }

  // /**
  //  * @function handleTextAreaChange
  //  * Handles any changes to the text area input, aka speech
  //  */
  // handleTextAreaChange = (event) => {
  //   // console.log(event.target.value);
  //   var temp = event.target.value.trim().split(" ");
  //   this.setState({
  //     numWords: temp.length,
  //     words: temp,
  //     pitches: new Array(temp.length).fill(100)
  //   });
  //   console.log("here in handleTextAreaChange");
  // }

  /**
   * @function handleGoButtonClick
   * Handles the clicks on the Go button to trigger Nao to say speech
   */
  handleGoButtonClick = (event) => {
    axios
      .post("http://localhost:5000/speak", {
        speech: this.formSpeechString()
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // /**
  //  * @function handleWordParamChange
  //  * Handles changes in the various speech settings
  //  * @param {String} type The name of the paramter, "pitch" etc.
  //  * @param {Number} index Index of word corresponding to setting change
  //  * @param {Number} value The new value of the setting for that word
  //  */
  // handleWordParamChange = (type, index, value) => {
  //   if (type == "pitch") {
  //     var pitch = this.state.pitches;
  //     console.log(pitch);
  //     pitch[index] = value;
  //     this.setState({
  //       pitches: pitch
  //     });
  //   }
  // }

  /**
   * @function createParamViewPanels 
   * Creates the panels for each word in the viewing window
   * 
   */
  createParamViewPanels = () => {
    let divArr = [];
    // let numWords = this.state.words.length;
    // for (let i = 0; i < numWords; i++) {
    //   console.log("here");
    //   divArr.push(
    //     <ParamViewPanel
    //       index={i}
    //       word={this.state.words[i]}
    //       handleParamChange={this.handleWordParamChange}
    //       {...this.state}
    //     />
    //   );
    // }

    // start at 1 so that DummyWord does not get loaded
    for (let i=1; i<this.state.doc.wordList.size(); i+=1) {
      divArr.push(
        <PausePanel index={i} onChange={this.handleWordParamChange}/>
      );
      divArr.push(
        // <ParamViewPanel 
        //   index={i}
        //   node={this.state.doc.wordList.elementAtIndex(i)}
        //   onChange={this.handleWordParamChange} />
        // <PausePanel />
        <WordPanel index={i} onChange={this.handleWordParamChange} node={this.state.doc.wordList.elementAtIndex(i)}/>
      );
    }
    return divArr;
  }

  handleWordParamChange = (paramName, paramValue, index) => {
    let newDoc = this.state.doc;
    newDoc.wordList.elementAtIndex(index).updateSpeechParam(paramName, paramValue);
    this.setState({doc:newDoc});
  }

  render() {
    return (
      <div>
        <Menu />
        <div class="row">
          <div class="col s3">
            <div class="container">
              <div class="row">
                <div class="col s12">
                  <ul class="tabs">
                    <li class="tab col s6">
                      <a href="#files" class="active">
                        Files
                      </a>
                    </li>
                    <li class="tab col s6">
                      <a href="#history">History</a>
                    </li>
                  </ul>
                </div>
                <div id="files" class="col s12">
                  <FilesTab />
                </div>
                <div id="history" class="col s12">
                  <HistoryTab />
                </div>
              </div>
            </div>
          </div>
          <div class="col s9">
            {/* <div class="row" style={{display: 'flex', flexWrap: 'wrap'}}> */}
            <div class="row" style={{ display: "flex" }}>
              <div
                class="col s1 valign-wrapper"
                style={{
                  //  height: '300px',
                  //  width: '300px',
                  //  background: 'blue',
                  //  display: 'flex',
                  //  alignItems: 'center',
                  justifyContent: "flex-end"
                  //  height: '100%'
                }}
              >
                <a
                  class="dropdown-trigger btn no-autoinit"
                  href="#"
                  data-target="dropdown1"
                >
                  &#43;
                </a>
                <ul id="dropdown1" class="dropdown-content">
                  {/* <li><Link to="/happiness">Happiness</Link></li> */}
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
                {/* <div class="container">
                  <a class='dropdown-button btn' href='#' data-activates='dropdown1' data-beloworigin="true"><i class="material-icons">add</i></a>

                  <ul id='dropdown1' class='dropdown-content dropdown-nested'>
                  <li><a class='dropdown-button' href='#' data-activates='dropdown2' data-hover="hover" data-alignment="left">one<span class="right-triangle">&#9656;</span></a></li>
                    <li><a href="#!">two</a></li>
                    <li><a href="#!">three</a></li>
                  </ul>

                  <ul id='dropdown2' class='dropdown-content dropdown-nested'>
                    <li><a href="#!">one</a></li>
                    <li><a class='dropdown-button' href="#" data-activates="dropdown3" data-hover="hover" data-alignment="left">two<span class="right-triangle">&#9656;</span></a></li>
                    <li><a href="#!">three</a></li>
                  </ul>

                  <ul id='dropdown3' class='dropdown-content'>
                    <li><a href="#!">three</a></li>
                    <li><a href="#!">four</a></li>
                    <li><a href="#!">five</a></li>
                    <li><a href="#!">six</a></li>
                  </ul>
                  </div> */}
              </div>
              <div class="col s8 valign-wrapper">
                {/* <form class="col s12">
                  <div class="row">
                    <div class="input-field col s12">
                      <textarea
                        id="textarea1"
                        class="materialize-textarea"
                        onChange={this.handleTextAreaChange}
                      ></textarea>
                      <label for="textarea1">Speech</label>
                    </div>
                  </div>
                </form> */}
                <TextBox handleKeyDown={this.handleKeyDown} handleKeyMouseUp={this.handleKeyMouseUp}/>
              </div>
              <div class="col s3 valign-wrapper">
                <a
                  class="btn-floating btn-large waves-effect waves-light red"
                  onClick={this.handleGoButtonClick}
                >
                  Go
                </a>
                {/* <a class="btn-floating btn-large waves-effect waves-light red" title="White Speaker Icon #192589"><img src="https://icon-library.net//images/white-speaker-icon/white-speaker-icon-24.jpg" width="350" /></a>
                  <a class="btn-floating btn-large waves-effect waves-light red" href="https://icon-library.net/icon/white-speaker-icon-24.html">White Speaker Icon #192589</a> */}
              </div>
            </div>
            <div class="row param-view">
              <div class="col s10 param-chart">
                {this.createParamViewPanels()}
              </div>
              <div class="col s2">
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        class="filled-in checkbox-orange"
                        onChange={this.handleCheckboxChange}
                        name="pitch"
                      />
                      <span>Pitch</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        class="filled-in checkbox-purple"
                        onChange={this.handleCheckboxChange}
                        name="speed"
                      />
                      <span>Speed</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input
                        type="checkbox"
                        class="filled-in checkbox-green"
                        onChange={this.handleCheckboxChange}
                        name="pauses"
                      />
                      <span>Pauses</span>
                    </label>
                  </p>
              </div>
            </div>
            <div class="row" style={{ backgroundColor: "pink", marginRight: "3vw"}}>
              <h6>Some buttons</h6>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          {/* <div className="container"> */}
            Icons: waves by Olga from the Noun Project, wave by Olivia from the Noun Project
          {/* </div> */}
        </div>
      </div>
    );
  }
}

class FilesTab extends Component {
  render() {
    return (
      <div>
        <ul class="collection">
          <li class="collection-item">File1</li>
          <li class="collection-item">File2</li>
          <li class="collection-item">File3</li>
          <li class="collection-item">File4</li>
          <li class="collection-item">File5</li>
        </ul>
      </div>
    );
  }
}

class HistoryTab extends Component {
  render() {
    return (
      <div>
        <p>here</p>
      </div>
    );
  }
}

// TODO control MAX_WIDTH of each panel!!! especially in case the text is TOOOOO long.
class ParamViewPanel extends Component {
  constructor(props) {
    super(props);
    console.log("constructor of ParamViewPanal");

    this.state = {
      containerRect: Array(3),
      childRect: Array(3)
    };

    this.containerRef = [
      React.createRef(),
      React.createRef(),
      React.createRef()
    ];
    this.childRef = [React.createRef(), React.createRef(), React.createRef()];
    this.getRectsInterval = undefined;

    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleChildMouseDown = this.handleChildMouseDown.bind(this);
    this.handlePitchChange = this.handlePitchChange.bind(this);

    this.temp = this.temp.bind(this);

    this.paramsDict = { pitch: 0, speed: 1, pauses: 2 };
  }

  componentDidMount() {
    // console.log(this.childRef[0].current.getBoundingClientRect());
    var temp = this.state.childRect;
    var temp2 = this.state.containerRect;
    // var i = Number(this.containerRef[num].current.id);
    temp2[0] = this.containerRef[0].current
      ? this.containerRef[0].current.getBoundingClientRect()
      : temp2[0];
    temp2[1] = this.containerRef[1].current
      ? this.containerRef[1].current.getBoundingClientRect()
      : temp2[1];
    temp2[2] = this.containerRef[2].current
      ? this.containerRef[2].current.getBoundingClientRect()
      : temp2[2];

    // var i = Number(this.childRef[num].current.id);
    temp[0] = this.childRef[0].current
      ? this.childRef[0].current.getBoundingClientRect()
      : temp[0];
    temp[1] = this.childRef[1].current
      ? this.childRef[1].current.getBoundingClientRect()
      : temp[1];
    temp[2] = this.childRef[2].current
      ? this.childRef[2].current.getBoundingClientRect()
      : temp[2];
    this.setState({
      childRect: temp, //this.childRef.current.getBoundingClientRect(),
      containerRect: temp2
    });
  }

  handleContainerMouseDown() {
    console.log(this.containerRef[0].current.getBoundingClientRect());
    var temp = this.state.containerRect;
    // var i = Number(this.containerRef[num].current.id);
    temp[0] = this.containerRef[0].current.getBoundingClientRect();
    temp[1] = this.containerRef[1].current.getBoundingClientRect();
    temp[2] = this.containerRef[2].current.getBoundingClientRect();
    this.setState({
      containerRect: temp //this.containerRef.current.getBoundingClientRect(),
    });
  }

  handleChildMouseDown() {
    console.log(this.childRef[0].current.getBoundingClientRect());
    var temp = this.state.childRect;
    var temp2 = this.state.containerRect;
    // var i = Number(this.containerRef[num].current.id);
    temp2[0] = this.containerRef[0].current
      ? this.containerRef[0].current.getBoundingClientRect()
      : temp2[0];
    temp2[1] = this.containerRef[1].current
      ? this.containerRef[1].current.getBoundingClientRect()
      : temp2[1];
    temp2[2] = this.containerRef[2].current
      ? this.containerRef[2].current.getBoundingClientRect()
      : temp2[2];

    // var i = Number(this.childRef[num].current.id);
    temp[0] = this.childRef[0].current
      ? this.childRef[0].current.getBoundingClientRect()
      : temp[0];
    temp[1] = this.childRef[1].current
      ? this.childRef[1].current.getBoundingClientRect()
      : temp[1];
    temp[2] = this.childRef[2].current
      ? this.childRef[2].current.getBoundingClientRect()
      : temp[2];
    this.setState({
      childRect: temp, //this.childRef.current.getBoundingClientRect(),
      containerRect: temp2
    });
  }

  temp(num) {
    return (
      <div
        class="center-align"
        id={num}
        style={{ backgroundColor: "greenyellow", width: "100%" }}
        ref={this.childRef[num]}
        onMouseDown={this.handleChildMouseDown}
      >
        &#x2015;
      </div>
    );
  }

  handlePitchChange(percentage) {
    this.props.handleParamChange(
      "pitch",
      this.props.index,
      Math.floor(
        percentage * NaoConsts.speechPitchRange + NaoConsts.speechPitchMin
      )
    );
  }

  render() {
    // var selectedIndex = Object.values(this.props.paramViewSelected).filter(
    //   Boolean
    // );
    var numParams = 1;//selectedIndex.length;
    var paramHeight = Math.floor(90 / numParams)
      .toString()
      .concat("%");
    let speedParam, pausesParam, pitchParam; //=<div style={{height: '90%', width: '100%', backgroundColor:'blue'}}></div>;

    if (true) {
      pitchParam = (
        <div
          style={{
            height: [paramHeight],
            width: "100%",
            backgroundColor: "orange"
          }}
          ref={this.containerRef[0]} // onMouseDown={this.handleContainerMouseDown}
        >
          {/* {this.temp()} */}
          <BoundedDraggable
            element={this.temp(0)}
            childRect={this.state.childRect[0]}
            containerRect={this.state.containerRect[0]}
            onShiftBar={this.handlePitchChange}
          />
        </div>
      );
    }
    if (false){//this.props.paramViewSelected.speed) {
      speedParam = (
        <div
          style={{
            height: [paramHeight],
            width: "100%",
            backgroundColor: "purple"
          }}
          ref={this.containerRef[1]} // onMouseDown={this.handleContainerMouseDown}
        >
          {/* {this.temp()} */}
          <BoundedDraggable
            element={this.temp(1)}
            childRect={this.state.childRect[1]}
            containerRect={this.state.containerRect[1]}
          />
        </div>
      );
    }
    if (false){
      pausesParam = (
        <div
          style={{
            height: [paramHeight],
            width: "100%",
            backgroundColor: "green"
          }}
          ref={this.containerRef[2]} //onMouseDown={this.handleContainerMouseDown}
        >
          {/* {this.temp()} */}
          <BoundedDraggable
            element={this.temp(2)}
            childRect={this.state.childRect[2]}
            containerRect={this.state.containerRect[2]}
          />
        </div>
      );
    }
    if (numParams == 0) {
      console.log("no params selected in paramsview");
      pitchParam = (
        <div
          style={{ height: "90%", width: "100%", backgroundColor: "white" }}
        ></div>
      );
    }

    return (
      <div className="card--content">
        {/* <div style={{height: '45%', width: '100%', backgroundColor:'pink'}}
      ref={this.containerRef[0]} onMouseDown={this.handleContainerMouseDown}
      >
      <BoundedDraggable element={this.temp(0)} childRect={this.state.childRect[0]} containerRect={this.state.containerRect[0]} />
      </div>
      <div style={{height: '45%', width: '100%', backgroundColor:'red'}}
      ref={this.containerRef[1]} onMouseDown={this.handleContainerMouseDown}
      >
      <BoundedDraggable element={this.temp(1)} childRect={this.state.childRect[1]} containerRect={this.state.containerRect[1]} />
      </div> */}
        {pitchParam}
        {speedParam}
        {pausesParam}
        <div
          className="center-align"
          style={{ height: "10%", backgroundColor: "black" }}
        >
          <font color="white">{this.props.node.word.trim()}</font>
        </div>
      </div>
    );
  }
}

class WordPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="card--content">
        <div className="row" style={{ height: "85%"}}>
          <div className="col s6">
            <VerticalRangeSlider 
              name={pitch}
              min={pitchMin}
              max={pitchMax}
              step="1"
              initialValue={pitchInitial}
              iconTop="./icons/noun_wave_1985513.svg"
              iconBottom="./icons/noun_waves_2767962.svg"
              onChange={this.props.onChange}
              index={this.props.index}
            />
          </div>
          <div className="col s6">
            <VerticalRangeSlider 
              name={volume}
              min={volumeMin}
              max={volumeMax}
              step="1"
              initialValue={volumeInitial}
              iconTop="./icons/volume_up-24px.svg"
              iconBottom="./icons/volume_down-24px.svg"
              onChange={this.props.onChange}
              index={this.props.index}
            />
          </div>
        </div>
        <div
          className="center-align"
          style={{ height: "10%", backgroundColor: "grey", padding: '5px'}}
        >
          {/* {this.props.node.word.trim()} */}
          <font color="white">{this.props.node.word.trim()}</font>
        </div>
      </div>
    );
  }
}

class PausePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="card-content-pause">
        <div className="row" style={{ height: "85%"}}>
          
            <VerticalRangeSlider 
              name={pause}
              min={pauseMin}
              max={pauseMax}
              step="1"
              initialValue={pauseInitial}
              // iconTop="./icons/noun_wave_1985513.svg"
              // iconBottom="./icons/noun_waves_2767962.svg"
              onChange={this.props.onChange}
              index={this.props.index}
            />
          
         </div>
      </div>
    );
  }
}