import React, {Component, useRef} from 'react';
import { Resizable, ResizableBox } from 'react-resizable';
// Import Materialize
import M from "materialize-css";
import Menu from './Menu.js';
import 'materialize-css/dist/css/materialize.min.css';
import './Happiness.css';
import BoundedDraggable from './BoundedDraggable.js'

export default class Happiness extends Component {

    constructor(props) {
      super(props);
      this.state = {
        paramViewSelected: {pitch: false, speed: false, pauses: false},
        numWords: 0,
        words: ''
      };
      this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
      this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    }

    handleCheckboxChange(event) {
      var temp = this.state.paramViewSelected;
      temp[event.target.name] = event.target.checked;
      this.setState({
        paramViewSelected: temp
      });
      // console.log(this.state.paramViewSelected);
    }

    handleTextAreaChange(event) {
      // console.log(event.target.value);
      var temp = event.target.value.trim().split(' ')
      this.setState({
        numWords: temp.length,
        words: temp
      });
    }

    componentDidMount() {
      // Auto initialize all the things!
      M.AutoInit();
      let dropdowns = document.querySelectorAll('.dropdown-trigger');
      let options = {
        constrainWidth: false,
        coverTrigger: false,
        alignment: 'right'
      };
      M.Dropdown.init(dropdowns, options);
    }
    
    render() {
      let state = this.state;
      function createParamViewPanels(numWords) {
        let divArr = [];
        for (let i=0; i<numWords; i++) {
          divArr.push(<ParamViewPanel word={state.words[i]} {...state}/>);
        }
        return divArr;
        // return (
        //   <ParamViewPanel />
        // );
      }

      return(
      <div>
          
          <div class="row">
            <div class="col s3">
              <Menu />
              <div class="container">
                <div class="row">
                  <div class="col s12">
                    <ul class="tabs">
                      <li class="tab col s6"><a href="#files" class="active">Files</a></li>
                      <li class="tab col s6"><a href="#history">History</a></li>
                    </ul>
                  </div>
                  <div id="files" class="col s12"><FilesTab /></div>
                  <div id="history" class="col s12"><HistoryTab /></div>
                </div>             
              </div>
            </div>
            <div class="col s9">
              {/* <div class="row" style={{display: 'flex', flexWrap: 'wrap'}}> */}
              <div class="row" style={{display: "flex"}}>
                <div class="col s1 valign-wrapper" 
                    style={{
                    //  height: '300px',
                    //  width: '300px',
                    //  background: 'blue',
                    //  display: 'flex',
                    //  alignItems: 'center',
                      justifyContent: 'flex-end',
                    //  height: '100%'
                  }}>
                  <a class='dropdown-trigger btn no-autoinit' href='#' data-target='dropdown1'>&#43;</a>
                  <ul id='dropdown1' class='dropdown-content'>
                    {/* <li><Link to="/happiness">Happiness</Link></li> */}
                    <li><a href="#!">Sadness</a></li>
                    <li><a href="#!">Fear</a></li>
                    <li><a href="#!">Disgust</a></li>
                    <li><a href="#!">Anger</a></li>
                    <li><a href="#!">Surprise</a></li>
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
                    <form class="col s12">
                      <div class="row">
                        <div class="input-field col s12">
                          <textarea id="textarea1" class="materialize-textarea" onChange={this.handleTextAreaChange}></textarea>
                          <label for="textarea1">Speech</label>
                        </div>
                      </div>
                    </form>
                </div>
                <div class="col s3 valign-wrapper">
                  <a class="btn-floating btn-large waves-effect waves-light red">Go</a>
                  {/* <a class="btn-floating btn-large waves-effect waves-light red" title="White Speaker Icon #192589"><img src="https://icon-library.net//images/white-speaker-icon/white-speaker-icon-24.jpg" width="350" /></a>
                  <a class="btn-floating btn-large waves-effect waves-light red" href="https://icon-library.net/icon/white-speaker-icon-24.html">White Speaker Icon #192589</a> */}
                </div>
              </div>
              <div class="row param-view">
                  <div class="col s10 param-chart">
                    {createParamViewPanels(this.state.numWords)}
                  </div>
                  <div class="col s2">                                 
                    <form action="#">
                      <p>
                        <label>
                          <input type="checkbox" class="filled-in checkbox-orange" onChange={this.handleCheckboxChange} name="pitch"/>
                          <span>Pitch</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input type="checkbox" class="filled-in checkbox-purple" onChange={this.handleCheckboxChange} name="speed"/>
                          <span>Speed</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input type="checkbox" class="filled-in checkbox-green" onChange={this.handleCheckboxChange} name="pauses"/>
                          <span>Pauses</span>
                        </label>
                      </p>
                    </form>
                  </div>
              </div>
              <div class="row" style={{backgroundColor: "pink"}}>
                  <h6>Some buttons</h6>
              </div>
            </div>
          </div>
      </div>
      )
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
      <div><p>here</p></div>
    );
  }
}


class ParamViewPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerRect: Array(3),
      childRect: Array(3)
    };

    this.containerRef = [React.createRef(), React.createRef(), React.createRef()];
    this.childRef = [React.createRef(), React.createRef(),React.createRef()];
    this.getRectsInterval = undefined;

    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleChildMouseDown = this.handleChildMouseDown.bind(this);

    this.temp = this.temp.bind(this);

    this.paramsDict = {pitch: 0, speed: 1, pauses: 2};

  }

  componentDidMount() {
    // console.log(this.childRef[0].current.getBoundingClientRect());
    var temp = this.state.childRect;
    var temp2 = this.state.containerRect;
    // var i = Number(this.containerRef[num].current.id);
    temp2[0] = this.containerRef[0].current ? this.containerRef[0].current.getBoundingClientRect() : temp2[0];
    temp2[1] = this.containerRef[1].current ? this.containerRef[1].current.getBoundingClientRect() : temp2[1];
    temp2[2] = this.containerRef[2].current ? this.containerRef[2].current.getBoundingClientRect() : temp2[2];

    // var i = Number(this.childRef[num].current.id);
    temp[0] = this.childRef[0].current ? this.childRef[0].current.getBoundingClientRect() : temp[0];
    temp[1] = this.childRef[1].current ? this.childRef[1].current.getBoundingClientRect() : temp[1];
    temp[2] = this.childRef[2].current ? this.childRef[2].current.getBoundingClientRect() : temp[2];
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
      containerRect: temp//this.containerRef.current.getBoundingClientRect(),
    });
  }

  handleChildMouseDown() {
    console.log(this.childRef[0].current.getBoundingClientRect());
    var temp = this.state.childRect;
    var temp2 = this.state.containerRect;
    // var i = Number(this.containerRef[num].current.id);
    temp2[0] = this.containerRef[0].current ? this.containerRef[0].current.getBoundingClientRect() : temp2[0];
    temp2[1] = this.containerRef[1].current ? this.containerRef[1].current.getBoundingClientRect() : temp2[1];
    temp2[2] = this.containerRef[2].current ? this.containerRef[2].current.getBoundingClientRect() : temp2[2];

    // var i = Number(this.childRef[num].current.id);
    temp[0] = this.childRef[0].current ? this.childRef[0].current.getBoundingClientRect() : temp[0];
    temp[1] = this.childRef[1].current ? this.childRef[1].current.getBoundingClientRect() : temp[1];
    temp[2] = this.childRef[2].current ? this.childRef[2].current.getBoundingClientRect() : temp[2];
    this.setState({
      childRect: temp, //this.childRef.current.getBoundingClientRect(),
      containerRect: temp2
    });
  }

  temp(num) {
    // return (<div id="rectangle" style={{backgroundColor: "pink", width:'100%', height:'100%'}}
    // ref={this.childRef} onMouseDown={this.handleChildMouseDown}/>);
    // return(<h1>hahahaha</h1>);
    return (<div class="center-align" id={num} style={{backgroundColor: "greenyellow", width:'100%'}} ref={this.childRef[num]} onMouseDown={this.handleChildMouseDown}>&#x2015;</div>);
  }

  render() {
    var selectedIndex = Object.values(this.props.paramViewSelected).filter(Boolean);
    var numParams = selectedIndex.length;
    var paramHeight = Math.floor(90/numParams).toString().concat('%');
    let speedParam, pausesParam, pitchParam;//=<div style={{height: '90%', width: '100%', backgroundColor:'blue'}}></div>;

    if(this.props.paramViewSelected.pitch) {
      pitchParam = <div style={{height: [paramHeight], width: '100%', backgroundColor:'orange'}}
      ref={this.containerRef[0]}// onMouseDown={this.handleContainerMouseDown}
      >
        {/* {this.temp()} */}
      <BoundedDraggable element={this.temp(0)} childRect={this.state.childRect[0]} containerRect={this.state.containerRect[0]} />
      </div>;
    }
    if(this.props.paramViewSelected.speed) {
      speedParam = <div style={{height: [paramHeight], width: '100%', backgroundColor:'purple'}}
      ref={this.containerRef[1]}// onMouseDown={this.handleContainerMouseDown}
      >
        {/* {this.temp()} */}
      <BoundedDraggable element={this.temp(1)} childRect={this.state.childRect[1]} containerRect={this.state.containerRect[1]} />
      </div>;
    }
    if(this.props.paramViewSelected.pauses) {
      pausesParam = <div style={{height: [paramHeight], width: '100%', backgroundColor:'green'}}
      ref={this.containerRef[2]} //onMouseDown={this.handleContainerMouseDown}
      >
        {/* {this.temp()} */}
      <BoundedDraggable element={this.temp(2)} childRect={this.state.childRect[2]} containerRect={this.state.containerRect[2]} />
      </div>;
    }
    if(numParams == 0) {
      pitchParam = <div style={{height: '90%', width: '100%', backgroundColor:'white'}}></div>;
    }

    return (
      <div className="card--content" >
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
      <div className='center-align' style={{height: '10%', backgroundColor: 'black'}}><font color="white">{this.props.word}</font></div>
      </div>  
    );
  }
} 

// class ParamViewPanel extends Component {

//   constructor(props) {
//     super(props);


//     this.numParams = 3;
//     const defaultRect = { x: 0, y: 0, width: 200, height: 100, top: 0, right: 200, bottom: 100, left: 0 };

//     this.state = {
//       containerRect: Array(this.numParams),
//       childRect: Array(this.numParams)
//     };

//     this.colorDict = {pitch: "yellow", speed: "pink", pauses: "green"};
//     // this.containerRef = useRef([...Array(numParams)].map(() => React.createRef()));
//     // this.childRef = useRef([...Array(numParams)].map(() => React.createRef()));
//     this.containerRef = {};
//     this.childRef = {};
//     for(let i=0; i<this.numParams; i++) {
//       this.containerRef[i] = React.createRef();
//       this.childRef[i] = React.createRef();
//     }
//     console.log(this.childRef);
//     // this.childRef = React.createRef();

//     this.handleMouseDown = this.handleMouseDown.bind(this);
//   }

//   componentDidMount() {
//     for(let i=0; i<this.numParams; i++) {
//       this.handleMouseDown(i);
//     }
//   }

//   handleMouseDown(i) {
//     i = Number(i);
//     console.log(this.containerRef);
//     // this.containerRef.current.click();
//     // this.handleContainerMouseDown();
//     var newChildRect = this.state.childRect;
//     var newContainerRect = this.state.containerRect;
//     newChildRect[i] = this.childRef[i];
//     newContainerRect[i] = this.containerRef[i];
//     this.setState({
//       childRect: newChildRect,
//       containerRect: newContainerRect
//     });
//   }

//   handleContainerRef(i, r) {
//     // console.log(r.getBoundingClientRect());
//     this.containerRef[i] = r.getBoundingClientRect();
//   }

//   handleChildRef(i, r) {
//     console.log(r.getBoundingClientRect());
//     this.childRef[i] = r.getBoundingClientRect();
//   }

//   createLine = (i) => {
//     var id = "line_" + i.toString();
//     return (<div id="rectangle" style={{backgroundColor: "black", width:'100%', height:'5px'}}
//     ref={this.handleChildRef.bind(this, i)} onMouseDown={this.handleMouseDown(i)}
//     />);
//   }

//   createListParam = () => {
//     var selectedIndex = Object.values(this.props.paramViewSelected).filter(Boolean);
//     var numParams = selectedIndex.length;
//     var paramHeight = Math.floor(90/numParams).toString().concat('%');
//     var temp = [];
//     let i = 0;
//     for(const param in this.props.paramViewSelected) {
//       if(this.props.paramViewSelected[param]) {
//         let color = this.colorDict[param];
//         temp.push(
//           <div
//           ref={this.handleContainerRef.bind(this, i)}
//           style={{height: [paramHeight], backgroundColor: [color]}}>
//             <BoundedDraggable element={this.createLine} params={i} childRect={this.state.childRect[i]} containerRect={this.state.containerRect[i]} />
//           </div>);
//       }
//       i += 1;
//     }
//     i=0;
//     if(temp.length == 0) {
//       temp.push(<div style={{height: '90%'}} />);
//     }
//     return temp;
//   }

//   render() {
//     // console.log(paramHeight);


//     return (
//       <div className="card--content" >
//         {this.createListParam()}
//         <div className='center-align' style={{height: '10%', backgroundColor: 'white'}}>{this.props.word}</div>
//       </div>
//     );
//   }
// } 