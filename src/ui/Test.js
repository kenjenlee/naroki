import React from 'react';
import styled, { css } from 'styled-components';
import M from "materialize-css";
import 'materialize-css/dist/css/materialize.min.css';
import BoundedDraggable from './BoundedDraggable.js';

class Test2 extends React.Component {

  onDragStart= (event) => {
    console.log('dragstart on div: ', event.target.id);
    event.dataTransfer.setData("taskName", "taskName");
  }

  render() {
    return (
      <div>
        <div id="rectangle" draggable='true' onDragStart = {(event) => this.onDragStart(event)} style={{backgroundColor: "green", width:'200px', height:'100px'}} />
      </div>
    );
  }
}


// cross ref: https://stackoverflow.com/questions/39913863/how-to-manually-trigger-click-event-in-reactjs/39914279
export default class Test extends React.Component {

  constructor(props) {
    super(props);

    const defaultRect = { x: 0, y: 0, width: 200, height: 100, top: 0, right: 200, bottom: 100, left: 0 };

    this.state = {
      containerRect: defaultRect,
      childRect: defaultRect
    };

    this.containerRef = React.createRef();
    this.childRef = React.createRef();
    this.getRectsInterval = undefined;

    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleChildMouseDown = this.handleChildMouseDown.bind(this);

    this.temp = this.temp.bind(this);

  }

  handleContainerMouseDown() {
    console.log(this.state.containerRect);
    this.setState({
      containerRect: this.containerRef.current.getBoundingClientRect(),
    });
  }

  handleChildMouseDown() {
    console.log(this.state.childRect);
    // this.containerRef.current.click();
    // this.handleContainerMouseDown();
    this.setState({
      childRect: this.childRef.current.getBoundingClientRect(),
    });
  }

  // componentDidMount() {
  //   this.getRectsInterval = setInterval(() => {
  //     this.setState(state => {
  //       const containerRect = this.containerRef.current.getBoundingClientRect();
  //       return JSON.stringify(containerRect) !== JSON.stringify(state.containerRect) ? null : { containerRect };
  //     });
  //     this.setState(state => {
  //       const tooltipRect = this.tooltipRef.current.getBoundingClientRect();
  //       return JSON.stringify(tooltipRect) === JSON.stringify(state.tooltipRect) ? null : { tooltipRect };
  //     });
  //   }, 10);
  // }

  temp() {
    return (<div id="rectangle" style={{backgroundColor: "green", width:'200px', height:'100px'}}
    ref={this.childRef} onMouseDown={this.handleChildMouseDown}
    ></div>);
  }

  render() {
    return (
      <div className='row' style={{height: '60vh', backgroundColor:'indigo'}}
      ref={this.containerRef} onMouseDown={this.handleContainerMouseDown}
      >
        {/* {this.temp()} */}
      <BoundedDraggable element={this.temp} childRect={this.state.childRect} containerRect={this.state.containerRect} />
      </div>
    );
  }
}

// reference https://engineering.datorama.com/mastering-drag-drop-with-reactjs-part-01-39bed3d40a03
class Testo extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();

    // console.log("Tops are " + this.props.rect.top + " " + this.props.bound.top);
  } 

  state = {
    isDragging: false,

    originalX: 0,
    originalY: 0,

    translateX: 0,
    translateY: 0,

    lastTranslateX: 0,
    lastTranslateY: 0,
  };
  
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    if (this.props.onDragStart) {
      this.props.onDragStart();
    }

    this.setState({
      originalX: clientX,
      originalY: clientY,
      isDragging: true,
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { isDragging } = this.state;
    const { onDrag } = this.props;

    if (!isDragging) {
      return;
    }
    
    // console.log(this.state.translateY + " " + this.state.originalY + " " + this.state.lastTranslateY);

    var nextTransY = clientY - this.state.originalY + this.state.lastTranslateY;
    var actualTransY = nextTransY;

    if(this.props.childRect.top + clientY - this.state.originalY <= this.props.containerRect.top) {
      console.log("collision top");
      actualTransY = 0;
    } else if(this.props.childRect.bottom + clientY - this.state.originalY >= this.props.containerRect.bottom) {
      // console.log("collision bottom");
      actualTransY = this.props.containerRect.bottom - this.props.childRect.height;
    }

    this.setState(prevState => ({
      translateX: clientX - prevState.originalX + prevState.lastTranslateX,
      translateY: actualTransY
    }), () => {
      if (onDrag) {
        onDrag({
          translateX: this.state.translateX,
          translateY: this.state.translateY
        });
      }
    });
  };

  handleMouseUp = () => {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);

    this.setState(
      {
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.state.translateX,
        lastTranslateY: this.state.translateY,

        isDragging: false
      },
      () => {
        if (this.props.onDragEnd) {
          this.props.onDragEnd();
        }
      }
    );
    console.log(this.state);
  };

  render() {
    const { children } = this.props;
    const { translateX, translateY, isDragging } = this.state;
    // console.log("rerendering Testo");

    return (
        <Container
          onMouseDown={this.handleMouseDown}
          x={translateX}
          y={translateY}
          isDragging={isDragging}
        >
          {this.props.element()}
      </Container>
    );
  }
}

const Container = styled.div.attrs({
  // style: ({ x, y }) => ({
  //   transform: `translate(${x}px, ${y}px)`
  // }),
  style: ({ y }) => ({
    transform: `translateY(${y}px)`
  }),
})`
  // cursor: grab;
  
  ${({ isDragging }) =>
  isDragging && css`
    opacity: 0.8;
    cursor: grabbing;
  `};
`;