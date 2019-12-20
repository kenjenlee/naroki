import React from 'react';
import styled, { css } from 'styled-components';
import M from "materialize-css";
import 'materialize-css/dist/css/materialize.min.css';

// reference https://engineering.datorama.com/mastering-drag-drop-with-reactjs-part-01-39bed3d40a03
export default class BoundedDraggable extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();

    // console.log("Tops are " + this.props.rect.top + " " + this.props.bound.top);
    // this.setState({
    //   translateY: Math.floor((this.props.containerRect.height - this.props.childRect.height)/2),
    // })
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
      // console.log("collision top");
      actualTransY = 0;
    } else if(this.props.childRect.bottom + clientY - this.state.originalY >= this.props.containerRect.bottom) {
      // console.log("collision bottom");
      actualTransY = this.props.containerRect.height - this.props.childRect.height;// - this.props.childRect.top;
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

    // call callback for param change
    this.props.onShiftBar(1-(this.state.translateY/(this.props.containerRect.height - this.props.childRect.height)));
  };

  render() {
    const { translateX, translateY, isDragging } = this.state;
    // console.log("rerendering Testo");

    return (
        <Container
          onMouseDown={this.handleMouseDown}
          x={translateX}
          y={translateY}
          isDragging={isDragging}
        >
          {this.props.element}
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